import { type Actor, withAuthGuardParams } from '@/lib/auth/guard'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

async function postCancelHandler(
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

        let body: { reason?: unknown } = {}
        try {
            body = await request.json()
        } catch {
            // body optional
        }

        const reason = body.reason ? String(body.reason).trim() : 'Khách yêu cầu hủy đơn'

        const adminSupabase = createAdminClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

        const { data: booking, error: findError } = await adminSupabase
            .from('bookings')
            .select('id, status, customer_id')
            .eq(isUuid ? 'id' : 'code', isUuid ? id : id.trim().toUpperCase())
            .maybeSingle()

        if (findError || !booking) {
            return fail(404, 'BOOKING_NOT_FOUND', {
                vi: 'Không tìm thấy đơn hàng.',
                en: 'Booking not found.',
            })
        }

        if (actor.role === 'customer' && booking.customer_id !== actor.id) {
            return fail(403, 'FORBIDDEN', {
                vi: 'Bạn chỉ có thể hủy đơn hàng do chính mình đặt.',
                en: 'You can only cancel your own bookings.',
            })
        }

        if (booking.status === 'checked_out' || booking.status === 'cancelled' || booking.status === 'no_show' || booking.status === 'expired') {
            return fail(422, 'INVALID_TRANSITION', {
                vi: `Đơn hàng đang ở trạng thái '${booking.status}', không thể hủy.`,
                en: `Booking is currently in '${booking.status}' status and cannot be cancelled.`,
            })
        }

        const { data: updatedBooking, error: rpcError } = await adminSupabase.rpc('cancel_booking', {
            p_booking_id: booking.id,
            p_reason: reason,
            p_actor_id: actor.id,
            p_actor_name: actor.fullName,
            p_actor_role: actor.role,
        })

        if (rpcError) {
            console.error('[cancel_booking RPC error]', rpcError)
            return serverError()
        }

        return ok(updatedBooking)
    } catch (err: unknown) {
        console.error('[POST /api/bookings/[id]/cancel error]', err instanceof Error ? err.message : err)
        return serverError()
    }
}

export const POST = withAuthGuardParams(postCancelHandler, 'booking.cancel.own')
