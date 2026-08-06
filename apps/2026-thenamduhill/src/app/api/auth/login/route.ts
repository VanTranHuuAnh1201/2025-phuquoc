import type { Role, I18nText } from '@repo/core'
import { permissionsOf } from '@repo/core'
import { createAdminClient } from '@/utils/supabase/admin'
import { signToken, ttlFor } from '@/lib/auth/jwt'
import { sessionCookie } from '@/lib/auth/cookie'
import { verifyPassword } from '@/lib/auth/password'
import { fail, ok, serverError } from '@/lib/auth/errors'

/**
 * POST /api/auth/login — `{ email, password }` cho MỌI vai trò.
 *
 * Chốt v1.0.0: **chỉ email + mật khẩu**. Luồng OTP qua SMS đã gỡ bỏ vì chưa có
 * nhà cung cấp SMS Brandname (MANUAL.md M3/M16) — dựng một cửa đăng nhập không
 * gửi được mã là để lại đúng cái cửa sau mà M16 cảnh báo: ai nhập `1234` cũng
 * vào được tài khoản của bất kỳ ai. Email + mật khẩu chạy được ngay hôm nay và
 * không nợ nhà cung cấp nào.
 *
 * Khách đăng ký tại `POST /api/auth/register`.
 *
 * Node runtime (mặc định Next 15). KHÔNG khai `runtime = 'edge'`: `bcryptjs`
 * cần Node API (BE11).
 */

interface LoginBody {
    email?: unknown
    password?: unknown
}

interface AccountRow {
    id: string
    role: Role
    full_name: string
    phone: string
    email: string | null
    password_hash: string | null
    active: boolean
}

/**
 * Một thông điệp duy nhất cho: sai mật khẩu · email không tồn tại.
 * Trả khác nhau là để lộ email nào có thật trong hệ thống (000-03 §6.5).
 */
const MSG_INVALID: I18nText = {
    vi: 'Email hoặc mật khẩu không đúng.',
    en: 'Email or password is incorrect.',
}

export async function POST(req: Request): Promise<Response> {
    let body: LoginBody
    try {
        body = (await req.json()) as LoginBody
    } catch {
        return fail(400, 'INVALID_BODY', {
            vi: 'Dữ liệu gửi lên không hợp lệ.',
            en: 'The request body is not valid JSON.',
        })
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    // Kiểm dữ liệu vào TRƯỚC khi chạm DB: lỗi do nhập sai không được phụ thuộc
    // vào việc kết nối DB có thành công hay không, nếu không nó trả 500 và
    // người dùng không biết mình sai ở đâu.
    if (!email) {
        return fail(400, 'MISSING_EMAIL', {
            vi: 'Nhập email để tiếp tục.',
            en: 'Enter your email to continue.',
        })
    }
    if (!email.includes('@')) {
        return fail(400, 'INVALID_EMAIL', {
            vi: 'Email không hợp lệ. Ví dụ: ten@example.com',
            en: 'Invalid email. Example: name@example.com',
        })
    }
    if (!password) {
        return fail(400, 'MISSING_PASSWORD', {
            vi: 'Nhập mật khẩu để tiếp tục.',
            en: 'Enter your password to continue.',
        })
    }

    let account: AccountRow | null
    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('accounts')
            .select('id, role, full_name, phone, email, password_hash, active')
            .eq('email', email)
            .maybeSingle<AccountRow>()

        if (error) {
            console.error('[auth/login] Không đọc được accounts', { error: error.message })
            return serverError()
        }
        account = data
    } catch (e) {
        console.error('[auth/login] Không kết nối được cơ sở dữ liệu', { error: e })
        return serverError()
    }

    // Luôn chạy compare kể cả khi không tìm thấy tài khoản: không làm vậy thì
    // thời gian phản hồi chênh ~200ms và dò được email nào có thật.
    const matched = await verifyPassword(password, account?.password_hash ?? null)
    if (!account || !matched) return fail(401, 'INVALID_CREDENTIALS', MSG_INVALID)

    if (!account.active) {
        // Lộ sự tồn tại ở đây chấp nhận được: người dùng cần biết phải liên hệ
        // quản lý chứ không phải thử lại mật khẩu (000-03 §6.5).
        return fail(403, 'ACCOUNT_DISABLED', {
            vi: 'Tài khoản đã bị vô hiệu hoá. Liên hệ quản lý để mở lại.',
            en: 'This account has been disabled. Contact your manager to reactivate it.',
        })
    }

    // v1.0.0 chỉ cấp ACCESS token. Refresh flow hoãn sang v1.1 (BE10) — payload
    // đã có `tokenType` và bảng `accounts` đã chừa 2 cột refresh để NULL, nên
    // thêm sau không phá cấu trúc này.
    const token = await signToken(account.id, account.role)
    const maxAge = ttlFor(account.role)

    try {
        const supabase = createAdminClient()
        const { error } = await supabase
            .from('accounts')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', account.id)
        if (error) {
            // Không chặn đăng nhập vì một cột thống kê — nhưng phải ồn ào.
            console.error('[auth/login] Không cập nhật được last_login_at', {
                accountId: account.id,
                error: error.message,
            })
        }
    } catch (e) {
        console.error('[auth/login] Lỗi khi cập nhật last_login_at', { error: e })
    }

    const response = ok({
        account: {
            id: account.id,
            role: account.role,
            fullName: account.full_name,
            phone: account.phone,
            email: account.email ?? '',
            active: account.active,
        },
        permissions: permissionsOf(account.role),
    })

    response.headers.append('Set-Cookie', sessionCookie(token, maxAge))
    return response
}
