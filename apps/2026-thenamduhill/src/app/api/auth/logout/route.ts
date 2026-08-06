import { clearedSessionCookie } from '@/lib/auth/cookie'
import { ok } from '@/lib/auth/errors'

/**
 * POST /api/auth/logout — ticket 000-03 §3.
 *
 * Không yêu cầu phiên hợp lệ: bấm Đăng xuất khi token đã hỏng vẫn phải xoá
 * được cookie, nếu không người dùng kẹt ở trạng thái nửa vời.
 *
 * Cookie xoá dùng CHUNG hàm với lúc set (`cookie.ts`) — lệch một thuộc tính là
 * trình duyệt không xoá (000-03 §6.7 điều 4).
 */
export async function POST(): Promise<Response> {
    const response = ok({ loggedOut: true })
    response.headers.append('Set-Cookie', clearedSessionCookie())
    return response
}
