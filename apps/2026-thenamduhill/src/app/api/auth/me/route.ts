import { withAuthGuard } from '@/lib/auth/guard'
import { ok } from '@/lib/auth/errors'

/**
 * GET /api/auth/me — ticket 000-03 §3.
 *
 * Trả `{ account, permissions }`. FE đọc mảng `permissions` để ẩn/hiện nút chứ
 * KHÔNG tự suy từ `role` — tránh hai nguồn sự thật (000-02 §6.1).
 *
 * `withAuthGuard()` không truyền permission: chỉ cần đăng nhập hợp lệ. Actor
 * đã được `requireAuth()` đọc lại từ DB nên `active`/`role` luôn là bản mới nhất.
 */
export const GET = withAuthGuard(async (_req, actor) =>
    ok({
        account: {
            id: actor.id,
            role: actor.role,
            fullName: actor.fullName,
            active: actor.active,
        },
        permissions: actor.permissions,
    }),
)
