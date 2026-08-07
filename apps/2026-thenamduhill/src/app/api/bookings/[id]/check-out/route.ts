import { type Actor, withAuthGuardParams } from '@/lib/auth/guard'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

async function postCheckOutHandler(
    request: Request,
    actor: Actor,
    ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
    try {
        const { id } = await ctx.params
        if (!id) {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng cung cấp mã hoặc ID đơn hàng.',
                en: 'Booking ID is required.',
            })
        }

        let body: any = {}
        try {
            body = await request.json()
        } catch {
            // body optional
        }

        const { incidentals = [], note, settled = true } = body ?? {}

        const adminSupabase = createAdminClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

        const { data: booking, error: findError } = await adminSupabase
            .from('bookings')
            .select('id, status, total_amount, paid_amount')
            .eq(isUuid ? 'id' : 'code', isUuid ? id : id.trim().toUpperCase())
            .maybeSingle()

        if (findError || !booking) {
            return fail(404, 'BOOKING_NOT_FOUND', {
                vi: 'Không tìm thấy đơn hàng.',
                en: 'Booking not found.',
            })
        }

        if (booking.status !== 'checked_in') {
            return fail(422, 'INVALID_TRANSITION', {
                vi: `Đơn hàng đang ở trạng thái '${booking.status}', không thể trả phòng.`,
                en: `Booking is currently in '${booking.status}' status and cannot be checked out.`,
            })
        }

        const remaining = Number(booking.total_amount) - Number(booking.paid_amount)
        if (remaining > 0 || !settled) {
            const formattedRemaining = new Intl.NumberFormat('vi-VN').format(Math.max(remaining, 0))
            return fail(400, 'NOT_SETTLED', {
                vi: `Chưa thu đủ ${formattedRemaining}đ. Vui lòng thu đủ trước khi hoàn tất trả phòng.`,
                en: `Outstanding balance of ${formattedRemaining} VND remains. Please settle payment before checkout.`,
            })
        }

        const checkOutRecord = {
            actualTime: new Date().toISOString(),
            incidentals: Array.isArray(incidentals) ? incidentals : [],
            note: note ? String(note).trim() : null,
            settled: true,
        }

        const { data: updatedBooking, error: rpcError } = await adminSupabase.rpc('check_out_booking', {
            p_booking_id: booking.id,
            p_check_out_record: checkOutRecord,
            p_actor_id: actor.id,
            p_actor_name: actor.fullName,
            p_actor_role: actor.role,
        })

        if (rpcError) {
            console.error('[check_out_booking RPC error]', rpcError)
            return serverError()
        }

        return ok(updatedBooking)
    } catch (err: any) {
        console.error('[POST /api/bookings/[id]/check-out error]', err)
        return serverError()
    }
}

export const POST = withAuthGuardParams(postCheckOutHandler, 'booking.change-status')
