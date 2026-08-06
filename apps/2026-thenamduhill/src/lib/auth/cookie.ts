import { SESSION_COOKIE } from './jwt'

/**
 * Sinh header `Set-Cookie` cho phiên (ticket 000-03 §6.2, §6.7 điều 4).
 *
 * Đặt và xoá phải dùng CHUNG một chỗ: xoá mà lệch một thuộc tính (`Path`,
 * `SameSite`, `Secure`) thì trình duyệt không xoá — người dùng bấm Đăng xuất
 * mà vẫn đăng nhập.
 */

/**
 * `Secure` theo NODE_ENV chứ KHÔNG cứng `true`: localhost chạy HTTP, cookie
 * `Secure` sẽ không được set và cả luồng đăng nhập im lặng hỏng ở dev.
 */
function baseAttributes(): string[] {
    const parts = ['Path=/', 'HttpOnly', 'SameSite=Strict']
    if (process.env.NODE_ENV === 'production') parts.push('Secure')
    return parts
}

/** Cookie phiên với thời hạn đúng bằng TTL của vai trò. */
export function sessionCookie(token: string, maxAge: number): string {
    return [
        `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
        ...baseAttributes(),
        `Max-Age=${maxAge}`,
    ].join('; ')
}

/** Cookie xoá phiên — cùng thuộc tính, `Max-Age=0`. */
export function clearedSessionCookie(): string {
    return [
        `${SESSION_COOKIE}=`,
        ...baseAttributes(),
        'Max-Age=0',
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ].join('; ')
}
