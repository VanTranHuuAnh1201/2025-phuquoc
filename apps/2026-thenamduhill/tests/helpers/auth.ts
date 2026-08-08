import type { Role } from '@repo/core'
import { signToken, SESSION_COOKIE } from '@/lib/auth/jwt'
import { adminDb } from './seed'

/**
 * `loginAs(role)` — cấp cookie phiên hợp lệ cho 1 trong 5 vai trò.
 *
 * VÌ SAO KÝ TOKEN TRỰC TIẾP thay vì gọi `POST /api/auth/login`:
 * đăng nhập thật cần mật khẩu dạng thô của tài khoản seed, mà `accounts` chỉ
 * lưu `password_hash` (bcrypt cost 12). Mỗi lần `loginAs()` gọi login là thêm
 * ~250ms bcrypt × hàng chục lần trong một lần chạy.
 *
 * Đánh đổi này KHÔNG làm mất độ phủ: `signToken()` là **đúng hàm** mà
 * `/api/auth/login` dùng để cấp token (`login/route.ts:129`), và bản thân luồng
 * login đầy đủ (email+mật khẩu → cookie) vẫn có test riêng ở `auth.test.ts`.
 * Còn `requireAuth()` thì vẫn chạy đủ: verify chữ ký + **đọc lại `accounts` từ
 * DB** mỗi request, nên vai trò/`active` lấy từ hàng thật, không phải từ token.
 */

/** Tài khoản nhân viên seed sẵn trong DB — không do test tạo, không được xoá. */
const STAFF_EMAILS: Record<Exclude<Role, 'customer'>, string> = {
    owner: 'owner@namduhill.demo',
    manager: 'manager@namduhill.demo',
    receptionist: 'receptionist@namduhill.demo',
    editor: 'editor@namduhill.demo',
}

interface AccountIdRow {
    id: string
    role: Role
    active: boolean
}

const cache = new Map<string, string>()

/** Bọc token thành header `Cookie` đúng tên mà `readSessionCookie()` đọc. */
export function toCookie(token: string): string {
    return `${SESSION_COOKIE}=${encodeURIComponent(token)}`
}

/**
 * Cookie phiên cho một vai trò nhân viên.
 * `customer` KHÔNG dùng hàm này — mỗi test cần một khách riêng để không đụng
 * đơn của nhau; dùng `sessionForAccount()` với id khách do seed tạo.
 */
export async function loginAs(role: Exclude<Role, 'customer'>): Promise<string> {
    const cached = cache.get(role)
    if (cached) return cached

    const email = STAFF_EMAILS[role]
    const { data, error } = await adminDb()
        .from('accounts')
        .select('id, role, active')
        .eq('email', email)
        .maybeSingle<AccountIdRow>()

    if (error) throw new Error(`Không đọc được tài khoản ${email}: ${error.message}`)
    if (!data) {
        throw new Error(
            `Thiếu tài khoản seed ${email} trong DB. `
            + 'Chạy migration 20260101000300_seed_reference.sql trước khi test.',
        )
    }
    // Bắt lệch seed sớm: một tài khoản `owner@` mà DB ghi role `manager` sẽ làm
    // toàn bộ test RBAC sai lệch mà không có dấu hiệu nào.
    if (data.role !== role) {
        throw new Error(`Tài khoản ${email} có role '${data.role}' trong DB, mong '${role}'`)
    }

    const cookie = toCookie(await signToken(data.id, data.role))
    cache.set(role, cookie)
    return cookie
}

/** Cookie phiên cho một account id bất kỳ — dùng cho khách do test tự tạo. */
export async function sessionForAccount(accountId: string, role: Role): Promise<string> {
    return toCookie(await signToken(accountId, role))
}

/**
 * Token hợp lệ về chữ ký nhưng trỏ tới account **không tồn tại**.
 * Dùng để kiểm `requireAuth()` có thật sự đọc lại DB hay chỉ tin payload token.
 */
export async function sessionForGhostAccount(): Promise<string> {
    return toCookie(await signToken('00000000-0000-4000-8000-000000000000', 'owner'))
}
