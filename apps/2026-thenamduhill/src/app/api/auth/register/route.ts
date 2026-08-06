import type { I18nText } from '@repo/core'
import { permissionsOf } from '@repo/core'
import { createAdminClient } from '@/utils/supabase/admin'
import { signToken, ttlFor } from '@/lib/auth/jwt'
import { sessionCookie } from '@/lib/auth/cookie'
import { hashPassword } from '@/lib/auth/password'
import { fail, ok, serverError } from '@/lib/auth/errors'

/**
 * POST /api/auth/register — `{ email, password, fullName, phone }`.
 *
 * Đăng ký tài khoản KHÁCH. Vai trò luôn cố định `'customer'` — không đọc `role`
 * từ body dù client có gửi (BE2: không bao giờ tin `role` từ client). Muốn tạo
 * tài khoản nhân viên thì dùng màn quản lý tài khoản của CMS, nơi có
 * `requirePermission('account.manage')`.
 *
 * Đăng ký xong đăng nhập luôn — không có bước xác thực email vì chưa có
 * SendGrid (MANUAL.md M3). Khi có, thêm cột `email_verified_at` và chặn ở
 * `/api/auth/login`, không phải sửa endpoint này.
 *
 * Node runtime: `bcryptjs` cần Node API (BE11).
 */

interface RegisterBody {
    email?: unknown
    password?: unknown
    fullName?: unknown
    phone?: unknown
}

/** `accounts.phone` là NOT NULL UNIQUE, nên SĐT là bắt buộc khi đăng ký. */
const PHONE_RE = /^0[0-9]{8,10}$/

const MIN_PASSWORD = 8

export async function POST(req: Request): Promise<Response> {
    let body: RegisterBody
    try {
        body = (await req.json()) as RegisterBody
    } catch {
        return fail(400, 'INVALID_BODY', {
            vi: 'Dữ liệu gửi lên không hợp lệ.',
            en: 'The request body is not valid JSON.',
        })
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.replace(/[\s.-]/g, '') : ''

    // Kiểm toàn bộ dữ liệu vào TRƯỚC khi chạm DB.
    if (!email || !email.includes('@')) {
        return fail(400, 'INVALID_EMAIL', {
            vi: 'Email không hợp lệ. Ví dụ: ten@example.com',
            en: 'Invalid email. Example: name@example.com',
        })
    }
    if (password.length < MIN_PASSWORD) {
        return fail(400, 'WEAK_PASSWORD', {
            vi: `Mật khẩu phải có ít nhất ${MIN_PASSWORD} ký tự.`,
            en: `Password must be at least ${MIN_PASSWORD} characters.`,
        })
    }
    if (!fullName) {
        return fail(400, 'MISSING_NAME', {
            vi: 'Nhập họ tên để tiếp tục.',
            en: 'Enter your full name to continue.',
        })
    }
    if (!PHONE_RE.test(phone)) {
        return fail(400, 'INVALID_PHONE', {
            vi: 'Số điện thoại không hợp lệ. Nhập theo dạng 0901234567.',
            en: 'Invalid phone number. Use the format 0901234567.',
        })
    }

    const passwordHash = await hashPassword(password)

    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('accounts')
            .insert({
                role: 'customer', // cố định — không đọc từ body (BE2)
                full_name: fullName,
                email,
                phone,
                password_hash: passwordHash,
                active: true,
            })
            .select('id, role, full_name, phone, email, active')
            .single<{
                id: string
                role: 'customer'
                full_name: string
                phone: string
                email: string | null
                active: boolean
            }>()

        if (error) {
            // 23505 = unique_violation. Email hoặc SĐT đã có người dùng.
            if (error.code === '23505') {
                const trungEmail = error.message.includes('email')
                const msg: I18nText = trungEmail
                    ? {
                          vi: 'Email này đã được đăng ký. Đăng nhập hoặc dùng email khác.',
                          en: 'This email is already registered. Sign in or use another email.',
                      }
                    : {
                          vi: 'Số điện thoại này đã được đăng ký. Đăng nhập hoặc dùng số khác.',
                          en: 'This phone number is already registered. Sign in or use another number.',
                      }
                return fail(409, 'ALREADY_REGISTERED', msg)
            }
            console.error('[auth/register] Không tạo được tài khoản', { error: error.message })
            return serverError()
        }

        // Đăng ký xong đăng nhập luôn — bớt một bước cho khách.
        const token = await signToken(data.id, data.role)
        const response = ok({
            account: {
                id: data.id,
                role: data.role,
                fullName: data.full_name,
                phone: data.phone,
                email: data.email ?? '',
                active: data.active,
            },
            permissions: permissionsOf(data.role),
        })
        response.headers.append('Set-Cookie', sessionCookie(token, ttlFor(data.role)))
        return response
    } catch (e) {
        console.error('[auth/register] Không kết nối được cơ sở dữ liệu', { error: e })
        return serverError()
    }
}
