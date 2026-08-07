import { canAll, permissionsOf, type Permission, type Role, type I18nText } from '@repo/core'
import { createAdminClient } from '@/utils/supabase/admin'
import { SESSION_COOKIE, verifyToken } from './jwt'
import { fail, serverError } from './errors'

/**
 * `requireAuth()` / `requirePermission()` — chốt chặn quyền ở Route Handler
 * (ticket 000-03 §6.4).
 *
 * Đặt ở app chứ không ở `packages/core`: hai hàm này chạm `Request`, cookie và
 * Supabase client — đều là thứ core bị cấm (BE9/R2). Core chỉ giữ
 * `permissions.ts` là hàm thuần.
 *
 * ⚠️ CHỈ NODE RUNTIME (chạm DB). Middleware Edge dùng `verifyToken()` trực tiếp.
 */

/** Danh tính đã xác minh. `permissions` suy từ role, KHÔNG lấy từ token. */
export interface Actor {
    id: string
    role: Role
    fullName: string
    active: boolean
    permissions: readonly Permission[]
}

/** Lỗi mang sẵn HTTP status + mã + thông điệp song ngữ. */
export class AuthError extends Error {
    readonly status: 401 | 403
    readonly code: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'ACCOUNT_DISABLED'
    readonly i18n: I18nText

    constructor(
        status: 401 | 403,
        code: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'ACCOUNT_DISABLED',
        i18n: I18nText,
    ) {
        // `message` của Error là chuỗi một ngôn ngữ cho log; thông điệp trả về
        // client nằm ở `i18n` (song ngữ, luật C7).
        super(`${code}: ${i18n.en}`)
        this.name = 'AuthError'
        this.status = status
        this.code = code
        this.i18n = i18n
    }
}

const MSG_UNAUTHENTICATED: I18nText = {
    vi: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục.',
    en: 'Your session has expired. Sign in again to continue.',
}

const MSG_FORBIDDEN: I18nText = {
    vi: 'Tài khoản của bạn không có quyền thực hiện thao tác này.',
    en: 'Your account does not have permission for this action.',
}

const MSG_DISABLED: I18nText = {
    vi: 'Tài khoản đã bị vô hiệu hoá. Liên hệ quản lý để mở lại.',
    en: 'This account has been disabled. Contact your manager to reactivate it.',
}

/** Đọc cookie phiên từ header `Cookie` — không phụ thuộc `next/headers`. */
function readSessionCookie(req: Request): string | null {
    const header = req.headers.get('cookie')
    if (!header) return null
    for (const part of header.split(';')) {
        const eq = part.indexOf('=')
        if (eq < 0) continue
        if (part.slice(0, eq).trim() === SESSION_COOKIE) {
            return decodeURIComponent(part.slice(eq + 1).trim())
        }
    }
    return null
}

interface AccountRow {
    id: string
    role: Role
    full_name: string
    active: boolean
}

/**
 * Verify chữ ký + hạn, RỒI ĐỌC LẠI `accounts` từ DB.
 *
 * NÉM `AuthError(401)` khi: không có cookie · chữ ký sai · hết hạn · tài khoản
 * không còn tồn tại. NÉM `AuthError(403, 'ACCOUNT_DISABLED')` khi `active=false`.
 *
 * Đọc lại DB mỗi request là CHỦ Ý, không phải thiếu tối ưu (C11): token nhân
 * viên sống 8 giờ, token khách 30 ngày; không đọc lại thì vô hiệu hoá tài khoản
 * hay đổi vai trò KHÔNG có tác dụng cho đến khi token hết hạn. Một SELECT theo
 * khoá chính là chi phí không đáng kể so với rủi ro đó.
 */
export async function requireAuth(req: Request): Promise<Actor> {
    const token = readSessionCookie(req)
    if (!token) throw new AuthError(401, 'UNAUTHENTICATED', MSG_UNAUTHENTICATED)

    const payload = await verifyToken(token)
    if (!payload) throw new AuthError(401, 'UNAUTHENTICATED', MSG_UNAUTHENTICATED)

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('accounts')
        .select('id, role, full_name, active')
        .eq('id', payload.sub)
        .maybeSingle<AccountRow>()

    if (error) {
        // C3: không nuốt lỗi. Ghi log có ngữ cảnh rồi chuyển tiếp thành 401 —
        // không thể xác minh danh tính thì coi như chưa đăng nhập.
        console.error('[auth] Không đọc được accounts khi xác thực', {
            accountId: payload.sub,
            error: error.message,
        })
        throw new AuthError(401, 'UNAUTHENTICATED', MSG_UNAUTHENTICATED)
    }

    if (!data) throw new AuthError(401, 'UNAUTHENTICATED', MSG_UNAUTHENTICATED)
    if (!data.active) throw new AuthError(403, 'ACCOUNT_DISABLED', MSG_DISABLED)

    // `role` lấy từ DB, KHÔNG từ payload token: vai trò đổi giữa ca thì có hiệu
    // lực ngay, và body request có gửi kèm `role` cũng vô nghĩa (BE2).
    return {
        id: data.id,
        role: data.role,
        fullName: data.full_name,
        active: data.active,
        permissions: permissionsOf(data.role),
    }
}

/**
 * Gọi `requireAuth()` rồi kiểm quyền.
 * NÉM `AuthError(403,'FORBIDDEN')` nếu thiếu. Nhận một permission hoặc mảng —
 * mảng nghĩa là phải có ĐỦ (dùng `canAll()` của 000-02).
 */
export async function requirePermission(
    req: Request,
    permission: Permission | readonly Permission[],
): Promise<Actor> {
    const actor = await requireAuth(req)
    const needed: readonly Permission[] =
        typeof permission === 'string' ? [permission] : permission

    if (!canAll(actor.role, needed)) {
        throw new AuthError(403, 'FORBIDDEN', MSG_FORBIDDEN)
    }
    return actor
}

/**
 * Bọc handler: bắt `AuthError` → Response chuẩn BE1; lỗi khác → 500 + log.
 *
 * Chốt thiết kế: guard NÉM lỗi thay vì trả `Response`. Trả `Response` buộc mọi
 * route viết `if (r instanceof Response) return r` — QUÊN MỘT CHỖ LÀ LỌT QUYỀN
 * IM LẶNG. Ném thì quên bắt = 500, ồn ào và bị phát hiện ngay, không phải lỗ
 * hổng. `withAuthGuard()` là chỗ bắt duy nhất; mọi route ghi bọc qua nó.
 */
export function withAuthGuard(
    handler: (req: Request, actor: Actor) => Promise<Response>,
    permission?: Permission | readonly Permission[],
): (req: Request) => Promise<Response> {
    return async (req: Request): Promise<Response> => {
        let actor: Actor
        try {
            actor = permission === undefined
                ? await requireAuth(req)
                : await requirePermission(req, permission)
        } catch (e) {
            if (e instanceof AuthError) return fail(e.status, e.code, e.i18n)
            console.error('[auth] Lỗi không lường trước khi xác thực', { error: e })
            return serverError()
        }

        try {
            return await handler(req, actor)
        } catch (e) {
            if (e instanceof AuthError) return fail(e.status, e.code, e.i18n)
            console.error('[api] Handler ném lỗi', {
                path: new URL(req.url).pathname,
                actorId: actor.id,
                error: e,
            })
            return serverError()
        }
    }
}

export function withAuthGuardParams<P>(
    handler: (req: Request, actor: Actor, ctx: { params: Promise<P> }) => Promise<Response>,
    permission?: Permission | readonly Permission[],
): (req: Request, ctx: { params: Promise<P> }) => Promise<Response> {
    return async (req: Request, ctx: { params: Promise<P> }): Promise<Response> => {
        let actor: Actor
        try {
            actor = permission === undefined
                ? await requireAuth(req)
                : await requirePermission(req, permission)
        } catch (e) {
            if (e instanceof AuthError) return fail(e.status, e.code, e.i18n)
            console.error('[auth] Lỗi không lường trước khi xác thực', { error: e })
            return serverError()
        }

        try {
            return await handler(req, actor, ctx)
        } catch (e) {
            if (e instanceof AuthError) return fail(e.status, e.code, e.i18n)
            console.error('[api] Handler ném lỗi', {
                path: new URL(req.url).pathname,
                actorId: actor.id,
                error: e,
            })
            return serverError()
        }
    }
}

