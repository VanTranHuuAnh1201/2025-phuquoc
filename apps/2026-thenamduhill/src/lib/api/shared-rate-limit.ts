import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Rate limit dùng **store chung** (Postgres), thay cho bộ đếm in-memory.
 *
 * ─── VÌ SAO KHÔNG DÙNG `checkRateLimit()` CỦA `rate-limit.ts` ──────────────
 *
 * File đó giữ `Map<ip, …>` trong RAM tiến trình và tự ghi chú "Multi-instance
 * deployments do not share this in-memory state". Trên Vercel mỗi lời gọi có
 * thể rơi vào một lambda khác, mỗi lambda một `Map` rỗng ⇒ ngưỡng gần như
 * không bao giờ chạm tới. Nó vẫn đủ cho `/api/availability/search` (chỉ trả
 * giá phòng công khai), nhưng KHÔNG đủ cho `/api/bookings/lookup` — route công
 * khai duy nhất chạm dữ liệu đơn của khách.
 *
 * ─── VÌ SAO POSTGRES ──────────────────────────────────────────────────────
 *
 * Đã có sẵn, đã có pool, đã có backup, đã nằm trong hợp đồng vận hành. Thêm
 * Redis/Upstash là thêm một nhà cung cấp + một secret + một thứ có thể chết
 * lúc 2 giờ sáng, cho một bộ đếm vài chục dòng. Chi phí: một round-trip
 * (~5ms cùng vùng) mỗi lời gọi.
 *
 * Đổi sang Redis sau này chỉ cần viết lại **thân** hàm dưới — chữ ký không
 * đổi nên route không phải sửa dòng nào.
 *
 * Đếm nguyên tử nằm ở RPC `consume_rate_limit()`
 * (`supabase/migrations/20260104000100_api_rate_limits.sql`): một câu
 * `INSERT … ON CONFLICT DO UPDATE`. Làm "SELECT rồi UPDATE" từ đây là hai
 * round-trip và có khe hở — hai request đồng thời cùng đọc `59`, cùng ghi
 * `60`, cả hai đều lọt.
 */

export interface SharedRateLimitResult {
    allowed: boolean
    /** Số giây nên đợi trước khi thử lại — đổ thẳng vào `retryAfterSeconds`. */
    retryAfterSeconds: number
}

interface ConsumeRateLimitRow {
    allowed: boolean
    retry_after_sec: number
}

/**
 * Lấy IP người gọi từ header proxy.
 *
 * `x-forwarded-for` là danh sách "client, proxy1, proxy2" — phần tử ĐẦU là
 * client thật. Lấy phần tử cuối là lấy IP của chính Vercel edge ⇒ mọi khách
 * dùng chung một bộ đếm, một người dò làm cả thế giới bị chặn.
 *
 * ⚠️ Header này client tự đặt được. Trên Vercel nó bị ghi đè ở tầng hạ tầng
 * nên tin được; chạy sau proxy khác thì phải kiểm lại. Đây là lý do rate limit
 * là lớp phòng thủ THỨ HAI — lớp thứ nhất là bắt buộc cả `code` + `phone`.
 */
export function clientIpOf(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const first = forwarded?.split(',')[0]?.trim()
    if (first) return first
    return request.headers.get('x-real-ip')?.trim() || '127.0.0.1'
}

/**
 * Tiêu thụ một lượt của `<bucket>:<identifier>`.
 *
 * Bucket nằm trong khoá để một IP bị chặn ở `lookup` vẫn tra được phòng trống
 * bình thường — chặn nhầm cả site là tự tạo sự cố cho khách thật.
 *
 * ⚠️ **Fail-open có chủ ý**: DB lỗi thì cho request đi tiếp thay vì trả 429.
 * Lý do: bộ đếm hỏng không được biến thành sự cố mất dịch vụ cho khách thật.
 * Đánh đổi này chấp nhận được vì đây là lớp phòng thủ thứ hai; lớp thứ nhất
 * (bắt buộc đủ `code` + `phone`, thông báo lỗi không phân biệt) vẫn đứng
 * nguyên khi bộ đếm chết. Lỗi được ghi log để không im lặng (luật C3).
 */
export async function consumeSharedRateLimit(
    bucket: string,
    identifier: string,
    limit: number,
    windowSeconds: number,
): Promise<SharedRateLimitResult> {
    try {
        const { data, error } = await createAdminClient().rpc('consume_rate_limit', {
            p_key: `${bucket}:${identifier}`,
            p_limit: limit,
            p_window_sec: windowSeconds,
        })

        if (error) {
            console.error('[consume_rate_limit RPC error]', error.message)
            return { allowed: true, retryAfterSeconds: 0 }
        }

        const row = Array.isArray(data) ? (data[0] as ConsumeRateLimitRow | undefined) : undefined
        if (!row) {
            console.error('[consume_rate_limit] RPC trả rỗng — cho qua để không chặn khách thật')
            return { allowed: true, retryAfterSeconds: 0 }
        }

        return {
            allowed: row.allowed === true,
            retryAfterSeconds: Number(row.retry_after_sec ?? windowSeconds),
        }
    } catch (err: unknown) {
        console.error(
            '[consume_rate_limit] lỗi ngoài dự kiến',
            err instanceof Error ? err.message : err,
        )
        return { allowed: true, retryAfterSeconds: 0 }
    }
}
