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

    // Ngày lịch dạng YYYY-MM-DD, cắt theo UTC (C6/B5).
    const todayDateStr = new Date().toISOString().slice(0, 10)

    /*
     * Cột thật là `check_in` và `assigned_room_unit_id` (đối chiếu
     * `information_schema.columns`). Bản trước dùng `check_in_date` /
     * `room_unit_id` — không tồn tại ⇒ 500 mọi lần (bug 900-03).
     */
    const { data: noShowBookings, error: selectError } = await adminSupabase
        .from('bookings')
        // `check_out` + `room_type_id` cần cho bước nhả tồn kho bên dưới (M40).
        .select('id, code, room_type_id, check_in, check_out, assigned_room_unit_id')
        .eq('status', 'confirmed')
        .lt('check_in', todayDateStr)
        .limit(200)

    if (selectError) {
        console.error('[cron/no-show] Error selecting no-show bookings:', selectError)
        return fail(500, 'DB_ERROR', {
            vi: 'Không đọc được danh sách đơn quá ngày nhận phòng.',
            en: 'Could not read the list of overdue check-ins.',
        })
    }

    const processedCodes: string[] = []
    const failedIds: string[] = []

    for (const booking of noShowBookings || []) {
        try {
            const { data: updated, error: updateError } = await adminSupabase
                .from('bookings')
                .update({
                    status: 'no_show',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', booking.id)
                .eq('status', 'confirmed')
                .select('id')

            // `.eq('status','confirmed')` khiến lần chạy thứ hai khớp 0 hàng ⇒
            // không xử lý trùng, và không đụng đơn đã `checked_in`/`cancelled`.
            if (updateError || !updated || updated.length === 0) {
                if (updateError) {
                    console.error(
                        `[cron/no-show] Update failed for ${booking.id}:`,
                        updateError.message,
                    )
                    failedIds.push(booking.id)
                }
                continue
            }

            // BE5 + `chk_logs_role`: actor_role phải là 1 trong 5 vai trò.
            const { error: logError } = await adminSupabase.from('activity_logs').insert({
                booking_id: booking.id,
                action: 'status-changed',
                actor_id: 'SYSTEM_CRON',
                actor_name: 'Hệ thống (tự động)',
                actor_role: 'owner',
                field: 'status',
                from: 'confirmed',
                to: 'no_show',
                note: 'Quá ngày nhận phòng, hệ thống đánh dấu không đến.',
                created_at: new Date().toISOString(),
            })
            if (logError) {
                console.error(
                    `[cron/no-show] Ghi activity_logs thất bại cho ${booking.id}:`,
                    logError.message,
                )
            }

            /*
             * NHẢ TỒN KHO (M40) — `no_show` rời nhóm trạng thái giữ phòng đúng
             * như `cancelled`, nên `booked_units` phải giảm y hệt (RPC
             * `cancel_booking`, migration `20260102000100` dòng 299-306).
             *
             * Thiếu bước này thì đêm khách không đến vẫn bị tính là đã bán, và
             * lễ tân không bán lại được phòng thực tế đang trống.
             *
             * Đặt SAU khi `UPDATE ... .eq('status','confirmed')` khớp 1 hàng ⇒
             * chạy lại cron không trừ chồng lên (idempotent).
             */
            const { data: invRows, error: invReadErr } = await adminSupabase
                .from('inventory')
                .select('date, booked_units')
                .eq('room_type_id', booking.room_type_id)
                .gte('date', booking.check_in)
                .lt('date', booking.check_out)

            if (invReadErr) {
                console.error(
                    `[cron/no-show] Không đọc được inventory của ${booking.id}:`,
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
                        console.error(
                            `[cron/no-show] Không nhả tồn kho ${booking.room_type_id}`
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
            console.error(`[cron/no-show] Failed to process no-show for booking ${booking.id}:`, err)
            failedIds.push(booking.id)
        }
    }

    const durationMs = Date.now() - startTime

    return ok({
        task: 'no-show',
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
