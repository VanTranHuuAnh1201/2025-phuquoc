import crypto from 'crypto'
import { createAdminClient } from '@/utils/supabase/admin'
import { fail, ok } from '@/lib/auth/errors'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function verifyCronAuth(request: Request): boolean {
    const isVercelCron = request.headers.get('x-vercel-cron') !== null
    if (isVercelCron) return true

    const authHeader = request.headers.get('authorization')
    const secret = process.env.CRON_SECRET || 'demo_cron_secret_2026'

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false
    }

    const token = authHeader.substring(7).trim()

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest()
        const secretHash = crypto.createHash('sha256').update(secret).digest()
        return crypto.timingSafeEqual(tokenHash, secretHash)
    } catch {
        return false
    }
}

export async function POST(request: Request) {
    if (!verifyCronAuth(request)) {
        return fail(401, 'UNAUTHORIZED', {
            vi: 'Cron secret không hợp lệ.',
            en: 'Invalid cron secret.',
        })
    }

    const startTime = Date.now()
    const adminSupabase = createAdminClient()

    const nowIso = new Date().toISOString()
    /*
     * Tên cột phải khớp `information_schema.columns` của bảng `bookings`:
     * `check_in` / `check_out` / `assigned_room_unit_id`. Bản trước dùng
     * `check_in_date` / `check_out_date` / `room_unit_id` — cả ba KHÔNG tồn tại
     * ⇒ mọi lời gọi trả 500 và đơn quá hạn không bao giờ được nhả (hết phòng
     * giả). TypeScript không bắt được vì tên cột đi qua chuỗi (bug 900-03).
     */
    const { data: expiredBookings, error: selectError } = await adminSupabase
        .from('bookings')
        .select('id, code, room_type_id, check_in, check_out, assigned_room_unit_id')
        .eq('status', 'pending_payment')
        .not('hold_expires_at', 'is', null)
        .lt('hold_expires_at', nowIso)
        .limit(200)

    if (selectError) {
        console.error('[cron/release-holds] Error selecting expired bookings:', selectError)
        return fail(500, 'DB_ERROR', {
            vi: 'Không đọc được danh sách đơn quá hạn giữ chỗ.',
            en: 'Could not read the list of expired holds.',
        })
    }

    const processedCodes: string[] = []
    const failedIds: string[] = []

    for (const booking of expiredBookings || []) {
        try {
            /*
             * `cancel_reason` KHÔNG tồn tại; lý do huỷ nằm ở `cancellation`
             * (jsonb) + `cancelled_at`, đúng theo booking-types.ts.
             *
             * `hold_expires_at = null` là BẮT BUỘC cùng lệnh đổi status:
             * `chk_bookings_hold CHECK (hold_expires_at IS NULL OR status =
             * 'pending_payment')` sẽ ném lỗi nếu để nguyên khi rời trạng thái đó.
             *
             * Điều kiện `.eq('status','pending_payment')` giữ nguyên và là thứ
             * khiến cron KHÔNG BAO GIỜ đụng đơn `confirmed`: hai lần chạy liên
             * tiếp thì lần sau khớp 0 hàng ⇒ không xử lý trùng.
             */
            const { data: updated, error: updateError } = await adminSupabase
                .from('bookings')
                .update({
                    status: 'expired',
                    hold_expires_at: null,
                    cancelled_at: new Date().toISOString(),
                    cancellation: {
                        at: new Date().toISOString(),
                        by: 'SYSTEM_CRON',
                        reason: 'Quá hạn giữ chỗ 15 phút (hệ thống tự nhả phòng).',
                        refundAmount: 0,
                    },
                    updated_at: new Date().toISOString(),
                })
                .eq('id', booking.id)
                .eq('status', 'pending_payment')
                .select('id')

            if (updateError || !updated || updated.length === 0) {
                if (updateError) {
                    console.error(
                        `[cron/release-holds] Update failed for ${booking.id}:`,
                        updateError.message,
                    )
                    failedIds.push(booking.id)
                }
                continue
            }

            // BE5: mọi chuyển trạng thái ghi log, kèm from/to để đọc lại được.
            // `actor_role` phải nằm trong `chk_logs_role` (5 vai trò) — 'system'
            // KHÔNG hợp lệ, dùng 'owner' cho tác nhân hệ thống.
            const { error: logError } = await adminSupabase.from('activity_logs').insert({
                booking_id: booking.id,
                action: 'status-changed',
                actor_id: 'SYSTEM_CRON',
                actor_name: 'Hệ thống (tự động)',
                actor_role: 'owner',
                field: 'status',
                from: 'pending_payment',
                to: 'expired',
                note: 'Quá hạn giữ chỗ 15 phút, hệ thống tự nhả phòng.',
                created_at: new Date().toISOString(),
            })
            if (logError) {
                // Không nuốt lỗi (C3): log bị từ chối là mất dấu vết kiểm toán.
                console.error(
                    `[cron/release-holds] Ghi activity_logs thất bại cho ${booking.id}:`,
                    logError.message,
                )
            }

            /*
             * NHẢ TỒN KHO — nửa sau của việc, thiếu nó thì cron vô nghĩa (M40).
             *
             * `create_booking_atomic()` cộng `booked_units += 1` cho mọi đêm khi
             * tạo đơn (migration `20260102000000`, bước ⑩); RPC `cancel_booking`
             * trừ lại khi huỷ (`20260102000100`). Cron này TRƯỚC ĐÂY chỉ đổi
             * `status` và bỏ hẳn bước trừ ⇒ đơn chết nhưng phòng bị giữ vĩnh
             * viễn. Đo trên DB dev 08/08/2026: 20 đêm `available = 0` trong khi
             * không còn đơn sống nào — đúng triệu chứng "hết phòng giả" mà
             * ticket 390-06 §1 mô tả, và không có lỗi nào để nhìn thấy.
             *
             * Đặt SAU khi `UPDATE bookings` đã khớp đúng 1 hàng: lệnh đó mang
             * điều kiện `.eq('status','pending_payment')` nên chỉ chạy tới đây
             * khi đơn THẬT SỰ vừa rời trạng thái giữ phòng ⇒ chạy cron hai lần
             * không trừ hai lần (idempotent).
             *
             * `GREATEST(booked_units - 1, 0)` không viết được qua PostgREST nên
             * đọc–trừ–ghi từng đêm; `chk_inventory_non_negative` chặn số âm nếu
             * dữ liệu đã lệch sẵn từ trước.
             */
            const { data: invRows, error: invReadErr } = await adminSupabase
                .from('inventory')
                .select('date, booked_units')
                .eq('room_type_id', booking.room_type_id)
                .gte('date', booking.check_in)
                .lt('date', booking.check_out)

            if (invReadErr) {
                console.error(
                    `[cron/release-holds] Không đọc được inventory của ${booking.id}:`,
                    invReadErr.message,
                )
                failedIds.push(booking.id)
            } else {
                for (const row of invRows ?? []) {
                    const current = Number((row as { booked_units: number }).booked_units)
                    const next = Math.max(current - 1, 0)
                    if (next === current) continue
                    const { error: invWriteErr } = await adminSupabase
                        .from('inventory')
                        .update({ booked_units: next })
                        .eq('room_type_id', booking.room_type_id)
                        .eq('date', (row as { date: string }).date)
                    if (invWriteErr) {
                        // C3: không nuốt lỗi — tồn kho lệch là mất doanh thu thầm lặng.
                        console.error(
                            `[cron/release-holds] Không nhả tồn kho ${booking.room_type_id}`
                            + ` ngày ${(row as { date: string }).date}:`,
                            invWriteErr.message,
                        )
                    }
                }
            }

            processedCodes.push(booking.code)

            if (booking.assigned_room_unit_id) {
                await adminSupabase
                    .from('room_units')
                    .update({ status: 'available' })
                    .eq('id', booking.assigned_room_unit_id)
            }
        } catch (err) {
            console.error(`[cron/release-holds] Failed to release booking ${booking.id}:`, err)
            failedIds.push(booking.id)
        }
    }

    const durationMs = Date.now() - startTime

    return ok({
        task: 'release-holds',
        startedAt: new Date(startTime).toISOString(),
        durationMs,
        processed: processedCodes.length,
        failed: failedIds.length,
        codes: processedCodes,
        failedIds,
    })
}

export async function GET(request: Request) {
    return POST(request)
}
