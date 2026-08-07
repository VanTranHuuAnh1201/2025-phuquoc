import { quoteRefund } from '@repo/core'
import type { Booking, CancellationRule } from '@repo/core'
import { type Actor, withAuthGuardParams } from '@/lib/auth/guard'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { mapBookingRow, mapRatePlanRow } from '@/lib/db/mappers'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

async function getCancelQuoteHandler(
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

        const adminSupabase = createAdminClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

        const { data: bookingRow, error: findError } = await adminSupabase
            .from('bookings')
            .select('*')
            .eq(isUuid ? 'id' : 'code', isUuid ? id : id.trim().toUpperCase())
            .maybeSingle()

        if (findError || !bookingRow) {
            return fail(404, 'BOOKING_NOT_FOUND', {
                vi: 'Không tìm thấy đơn hàng.',
                en: 'Booking not found.',
            })
        }

        if (actor.role === 'customer' && bookingRow.customer_id !== actor.id) {
            return fail(403, 'FORBIDDEN', {
                vi: 'Bạn chỉ có thể xem số tiền hoàn của đơn hàng do chính mình đặt.',
                en: 'You can only view cancellation refund quotes for your own bookings.',
            })
        }

        const booking: Booking = mapBookingRow(bookingRow)

        let rules: CancellationRule[] = [
            { daysBeforeCheckIn: 7, refundPercent: 100 },
            { daysBeforeCheckIn: 3, refundPercent: 50 },
            { daysBeforeCheckIn: 0, refundPercent: 0 },
        ]

        if (bookingRow.rate_plan_id) {
            const { data: planRow } = await adminSupabase
                .from('rate_plans')
                .select('*')
                .eq('id', bookingRow.rate_plan_id)
                .maybeSingle()
            if (planRow) {
                const plan = mapRatePlanRow(planRow)
                if (plan.cancellationRules && plan.cancellationRules.length > 0) {
                    rules = plan.cancellationRules
                }
            }
        }

        const today = new Date().toISOString().slice(0, 10)
        const quote = quoteRefund(booking, rules, today)

        return ok({
            bookingId: booking.id,
            bookingCode: booking.code,
            checkIn: booking.checkIn,
            paidAmount: booking.paidAmount,
            refundPercent: quote.percent,
            refundAmount: quote.amount,
            daysUntilCheckIn: quote.daysUntilCheckIn,
        })
    } catch (err: any) {
        console.error('[GET /api/bookings/[id]/cancel/quote error]', err)
        return serverError()
    }
}

export const GET = withAuthGuardParams(getCancelQuoteHandler, 'booking.cancel.own')
