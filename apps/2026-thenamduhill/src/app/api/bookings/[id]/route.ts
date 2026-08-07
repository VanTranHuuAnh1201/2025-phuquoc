import { type Actor, withAuthGuardParams } from '@/lib/auth/guard'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

async function getBookingHandler(
    request: Request,
    actor: Actor,
    ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
    try {
        const { id } = await ctx.params
        if (!id) {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng cung cấp mã hoặc ID đơn hàng.',
                en: 'Booking ID or code is required.',
            })
        }

        const adminSupabase = createAdminClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

        let query = adminSupabase.from('bookings').select(`
            *,
            room_types (*),
            assigned_room_unit:room_units (*),
            payments (*),
            activity_logs (*)
        `)

        if (isUuid) {
            query = query.eq('id', id)
        } else {
            query = query.eq('code', id.trim().toUpperCase())
        }

        const { data: booking, error } = await query.maybeSingle()

        if (error || !booking) {
            return fail(404, 'BOOKING_NOT_FOUND', {
                vi: 'Không tìm thấy đơn hàng.',
                en: 'Booking not found.',
            })
        }

        // Customer permission check: customers can only view their own booking
        if (actor.role === 'customer' && booking.customer_id !== actor.id) {
            return fail(403, 'FORBIDDEN', {
                vi: 'Bạn không có quyền xem thông tin đơn hàng này.',
                en: 'You do not have permission to view this booking.',
            })
        }

        return ok(booking)
    } catch (err: unknown) {
        console.error('[GET /api/bookings/[id] error]', err instanceof Error ? err.message : err)
        return serverError()
    }
}

export const GET = withAuthGuardParams(getBookingHandler, 'booking.view.own')
