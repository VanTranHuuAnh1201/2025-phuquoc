import { type Actor, withAuthGuardParams } from '@/lib/auth/guard'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { recordPayment } from '@/lib/payment'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

async function postPaymentHandler(
    request: Request,
    actor: Actor,
    ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
    try {
        if (process.env.PAYMENT_MODE === 'live') {
            return fail(403, 'SIMULATION_DISABLED', {
                vi: 'Chế độ giả lập đã bị tắt trên môi trường sản xuất.',
                en: 'Payment simulation is disabled in live mode.',
            })
        }

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
            // body optional for default payment simulation
        }

        const adminSupabase = createAdminClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

        const { data: booking, error: findError } = await adminSupabase
            .from('bookings')
            .select('id, status, deposit_amount, total_amount, paid_amount')
            .eq(isUuid ? 'id' : 'code', isUuid ? id : id.trim().toUpperCase())
            .maybeSingle()

        if (findError || !booking) {
            return fail(404, 'BOOKING_NOT_FOUND', {
                vi: 'Không tìm thấy đơn hàng.',
                en: 'Booking not found.',
            })
        }

        if (booking.status !== 'pending_payment' && booking.status !== 'confirmed') {
            return fail(422, 'INVALID_TRANSITION', {
                vi: `Đơn hàng đang ở trạng thái '${booking.status}', không thể xác nhận thanh toán.`,
                en: `Booking is currently in '${booking.status}' status and cannot accept payment.`,
            })
        }

        const amount = Number(body.amount) > 0 ? Number(body.amount) : Number(booking.deposit_amount)
        const paymentMethod = body.paymentMethod || 'bank_transfer'

        const updatedBooking = await recordPayment({
            bookingId: booking.id,
            amount: amount,
            paymentMethod: paymentMethod,
            kind: body.kind || 'deposit',
            rawPayload: { mode: 'simulated', channel: body.channel || 'web' },
        }, actor)

        return ok(updatedBooking)
    } catch (err: any) {
        console.error('[POST /api/bookings/[id]/payments error]', err)
        return serverError()
    }
}

export const POST = withAuthGuardParams(postPaymentHandler, 'booking.change-status')
