import { SignJWT, jwtVerify } from 'jose'
import type { Role } from '@repo/core'

/**
 * Ký và verify access token (ticket 000-03 §6.1, §6.2).
 *
 * Dùng `jose` vì nó chạy trên Web Crypto API — hoạt động ở CẢ Edge Runtime
 * (`middleware.ts`) lẫn Node runtime (Route Handler). `jsonwebtoken` cần
 * `crypto` của Node nên không dùng được ở middleware (luật BE11).
 *
 * File này KHÔNG được import `bcryptjs` — nó bị kéo vào Edge bundle.
 */

/** Payload access token. Đúng 7 trường, không nhồi thêm (000-03 §6.2). */
export interface AuthTokenPayload {
    /** accounts.id (UUID). Trùng claim chuẩn `sub` của JWT. */
    sub: string
    /** Vai trò ĐỌC TỪ DB lúc đăng nhập. Không bao giờ nhận từ client (BE2). */
    role: Role
    /** Chừa sẵn cho refresh flow v1.1 (BE10 mục 1). v1.0.0 luôn 'access'. */
    tokenType: 'access'
    /** Phát hành lúc — giây epoch. */
    iat: number
    /** Hết hạn — giây epoch. Nhân viên +8h, khách +30 ngày. */
    exp: number
    /** Cố định 'namduhill'. Chặn token của môi trường/dự án khác lọt vào. */
    iss: string
    /** Cố định 'namduhill-app'. */
    aud: string
}

/**
 * Không đưa `permissions[]` vào token — suy ra từ `role` bằng `permissionsOf()`.
 * Đưa vào là hai nguồn sự thật: sửa ma trận quyền mà token cũ chưa hết hạn thì
 * quyền cũ còn sống tới 30 ngày.
 *
 * Không đưa `active` — nhân viên bị vô hiệu hoá giữa ca mà token còn 7 tiếng
 * vẫn vào được. Vì vậy `requireAuth()` luôn đọc lại `accounts` từ DB.
 *
 * Không đưa thông tin cá nhân — JWT chỉ KÝ, không mã hoá; ai có token đều đọc
 * được payload.
 */

/** 8 giờ — đúng một ca làm việc của nhân viên quầy lễ tân. */
export const TTL_STAFF = 60 * 60 * 8
/** 30 ngày — khách chỉ xem đơn của mình, bắt đăng nhập lại liên tục là hỏng UX. */
export const TTL_CUSTOMER = 60 * 60 * 24 * 30

// v1.0.0 CHỈ cấp access token. Refresh flow HOÃN sang v1.1 (BE10) — không phải
// thiếu sót. Payload đã có `tokenType` nên thêm 'refresh' sau không phá cấu
// trúc cũ; `accounts` đã có sẵn 2 cột `refresh_token`/`refresh_token_expires_at`
// để NULL; đường dẫn `/api/auth/refresh` đã chừa trong tài liệu API.

/** HS256 — đối xứng, một secret. RS256 là phức tạp không đổi lại giá trị nào khi
 *  chỉ có đúng một service vừa ký vừa verify. */
const ALG = 'HS256'

/** Tên cookie phiên. Dùng chung giữa middleware, guard và route đăng nhập. */
export const SESSION_COOKIE = 'ndh_session'

function readSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET
    // C4: không fallback thầm lặng. Thiếu cấu hình phải ném ngay, không để hệ
    // thống chạy với secret rỗng rồi ai cũng ký được token vai trò `owner`.
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET chưa cấu hình hoặc ngắn hơn 32 ký tự')
    }
    return new TextEncoder().encode(secret)
}

function readIssuer(): string {
    return process.env.JWT_ISSUER || 'namduhill'
}

function readAudience(): string {
    return process.env.JWT_AUDIENCE || 'namduhill-app'
}

/**
 * Danh sách vai trò hợp lệ, khai LẠI tại chỗ thay vì import runtime từ
 * `@repo/core`: file này được `middleware.ts` (Edge Runtime) nạp, mà import
 * runtime từ core vào Edge là rủi ro bundle (000-03 §6.3 ràng buộc 3).
 * `satisfies` bên dưới bắt lệch với `Role` ngay lúc biên dịch.
 */
const VALID_ROLES = [
    'owner',
    'manager',
    'receptionist',
    'editor',
    'customer',
] as const satisfies readonly Role[]

function isRole(value: unknown): value is Role {
    return typeof value === 'string' && (VALID_ROLES as readonly string[]).includes(value)
}

/** TTL theo vai trò (000-03 §4.1). */
export function ttlFor(role: Role): number {
    return role === 'customer' ? TTL_CUSTOMER : TTL_STAFF
}

/** Ký access token cho một tài khoản đã xác thực xong ở tầng trên. */
export async function signToken(accountId: string, role: Role): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    return new SignJWT({ role, tokenType: 'access' })
        .setProtectedHeader({ alg: ALG })
        .setSubject(accountId)
        .setIssuedAt(now)
        .setExpirationTime(now + ttlFor(role))
        .setIssuer(readIssuer())
        .setAudience(readAudience())
        .sign(readSecret())
}

/**
 * Verify chữ ký + hạn + iss + aud.
 * Trả `null` khi token hỏng/hết hạn — KHÔNG ném, vì middleware cần phân nhánh
 * chứ không cần stack trace. Tầng gọi quyết định 401 hay redirect.
 */
export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, readSecret(), {
            issuer: readIssuer(),
            audience: readAudience(),
            algorithms: [ALG],
        })

        const sub = payload.sub
        const role = payload.role
        const tokenType = payload.tokenType
        const { iat, exp, iss } = payload
        const aud = payload.aud

        if (typeof sub !== 'string' || !isRole(role)) return null
        if (tokenType !== 'access') return null
        if (typeof iat !== 'number' || typeof exp !== 'number') return null
        if (typeof iss !== 'string' || typeof aud !== 'string') return null

        return {
            sub,
            role,
            tokenType: 'access',
            iat,
            exp,
            iss,
            aud,
        }
    } catch {
        // Chữ ký sai, hết hạn, iss/aud lệch — mọi trường hợp đều là "không có
        // phiên hợp lệ". Không log nội dung token (nó là bí mật).
        return null
    }
}
