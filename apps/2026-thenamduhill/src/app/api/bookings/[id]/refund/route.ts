import { type Actor, withAuthGuardParams } from '@/lib/auth/guard'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

async function postRefundHandler(
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

        interface RefundBody {
            amount?: unknown
            paymentMethod?: unknown
            reference?: unknown
        }

        let body: RefundBody
        try {
            body = await request.json()
        } catch {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Dữ liệu đầu vào không hợp lệ.',
                en: 'Invalid JSON body.',
            })
        }

        const amount = Number(body?.amount)
        if (isNaN(amount) || amount <= 0) {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Số tiền hoàn trả phải lớn hơn 0.',
                en: 'Refund amount must be greater than 0.',
            })
        }

        const paymentMethod = body?.paymentMethod || 'bank_transfer'
        const reference = body?.reference || `REF-${Date.now()}`

        const adminSupabase = createAdminClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

        const { data: booking, error: findError } = await adminSupabase
            .from('bookings')
            .select('id, paid_amount')
            .eq(isUuid ? 'id' : 'code', isUuid ? id : id.trim().toUpperCase())
            .maybeSingle()

        if (findError || !booking) {
            return fail(404, 'BOOKING_NOT_FOUND', {
                vi: 'Không tìm thấy đơn hàng.',
                en: 'Booking not found.',
            })
        }

        if (amount > Number(booking.paid_amount)) {
            return fail(400, 'EXCEEDS_PAID_AMOUNT', {
                vi: 'Số tiền hoàn vượt quá số tiền khách đã thanh toán.',
                en: 'Refund amount cannot exceed the total amount paid.',
            })
        }

        const { data: updatedBooking, error: rpcError } = await adminSupabase.rpc('refund_booking_payment', {
            p_booking_id: booking.id,
            p_amount: amount,
            p_payment_method: paymentMethod,
            p_reference: reference,
            p_actor_id: actor.id,
            p_actor_name: actor.fullName,
            p_actor_role: actor.role,
        })

        if (rpcError) {
            console.error('[refund_booking_payment RPC error]', rpcError)
            return serverError()
        }

        return ok(updatedBooking)
    } catch (err: unknown) {
        console.error('[POST /api/bookings/[id]/refund error]', err instanceof Error ? err.message : err)
        return serverError()
    }
}

export const POST = withAuthGuardParams(postRefundHandler, 'booking.refund')
