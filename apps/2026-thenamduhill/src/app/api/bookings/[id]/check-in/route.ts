import { type Actor, withAuthGuardParams } from '@/lib/auth/guard'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

async function postCheckInHandler(
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

        let body: any
        try {
            body = await request.json()
        } catch {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Dữ liệu đầu vào không hợp lệ.',
                en: 'Invalid JSON body.',
            })
        }

        const { roomUnitId, idNumber, actualGuests, actualTime, earlyCheckIn, vehiclePlate, note } = body ?? {}

        if (!roomUnitId || typeof roomUnitId !== 'string') {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng chọn phòng vật lý để gán cho khách.',
                en: 'Room unit ID is required.',
            })
        }

        if (!idNumber || typeof idNumber !== 'string') {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng cung cấp số CCCD/Hộ chiếu của khách.',
                en: 'ID number / Passport is required.',
            })
        }

        if (!actualGuests || typeof actualGuests.adults !== 'number') {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng cung cấp số lượng khách thực tế nhận phòng.',
                en: 'Actual guest counts are required.',
            })
        }

        const adminSupabase = createAdminClient()
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

        const { data: booking, error: findError } = await adminSupabase
            .from('bookings')
            .select('id, status, room_type_id')
            .eq(isUuid ? 'id' : 'code', isUuid ? id : id.trim().toUpperCase())
            .maybeSingle()

        if (findError || !booking) {
            return fail(404, 'BOOKING_NOT_FOUND', {
                vi: 'Không tìm thấy đơn hàng.',
                en: 'Booking not found.',
            })
        }

        if (booking.status !== 'confirmed') {
            return fail(422, 'INVALID_TRANSITION', {
                vi: `Đơn hàng đang ở trạng thái '${booking.status}', không thể nhận phòng.`,
                en: `Booking is currently in '${booking.status}' status and cannot be checked in.`,
            })
        }

        const checkInRecord = {
            roomUnitId,
            idNumber: String(idNumber).trim(),
            actualGuests: {
                adults: Number(actualGuests.adults ?? 1),
                children: Array.isArray(actualGuests.children) ? actualGuests.children.map(Number) : [],
            },
            actualTime: actualTime || new Date().toISOString(),
            earlyCheckIn: Boolean(earlyCheckIn),
            vehiclePlate: vehiclePlate ? String(vehiclePlate).trim() : null,
            note: note ? String(note).trim() : null,
        }

        const { data: updatedBooking, error: rpcError } = await adminSupabase.rpc('check_in_booking', {
            p_booking_id: booking.id,
            p_room_unit_id: roomUnitId,
            p_check_in_record: checkInRecord,
            p_actor_id: actor.id,
            p_actor_name: actor.fullName,
            p_actor_role: actor.role,
        })

        if (rpcError) {
            console.error('[check_in_booking RPC error]', rpcError)
            if (rpcError.message?.includes('ROOM_UNIT_TAKEN') || rpcError.code === 'P0001') {
                return fail(409, 'ROOM_UNIT_TAKEN', {
                    vi: 'Phòng này vừa được gán cho đơn khác. Vui lòng chọn phòng khác.',
                    en: 'This room unit was just assigned to another booking. Please select another room.',
                })
            }
            if (rpcError.message?.includes('ROOM_UNIT_TYPE_MISMATCH')) {
                return fail(400, 'ROOM_UNIT_TYPE_MISMATCH', {
                    vi: 'Phòng được chọn không thuộc hạng phòng của đơn hàng.',
                    en: 'Selected room unit does not match the room type of this booking.',
                })
            }
            return serverError()
        }

        return ok(updatedBooking)
    } catch (err: any) {
        console.error('[POST /api/bookings/[id]/check-in error]', err)
        return serverError()
    }
}

export const POST = withAuthGuardParams(postCheckInHandler, 'booking.change-status')
