import { ok, serverError } from '@/lib/auth/errors'
import { withAuthGuard } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * `GET /api/room-units` — danh sách phòng VẬT LÝ (`RoomUnit`, luật B0).
 *
 * VÌ SAO PHẢI CÓ: màn nhận phòng cho lễ tân chọn một phòng vật lý để gán, nhưng
 * `booking.store` sinh danh sách đó từ seed cục bộ (`buildRoomUnits()`), với id
 * kiểu `phong-gia-dinh-01-01`. DB thật dùng UUID. Hậu quả đã đo được: mọi lần
 * check-in đều đổ `22P02 invalid input syntax for type uuid` và trả 500 — tức
 * KHÔNG THỂ nhận phòng qua giao diện, dù backend hoàn toàn đúng.
 *
 * Dùng `createAdminClient` cùng lý do với `GET /api/bookings`: nhân viên đăng
 * nhập bằng JWT tự phát hành nên `current_account_id()` rỗng, policy RLS không
 * khớp hàng nào. Quyền vẫn được chặn ở cửa bằng `withAuthGuard`.
 */

export const dynamic = 'force-dynamic'

interface RoomUnitRow {
    id: string
    code: string
    room_type_id: string
    floor?: number | null
    status: string
    note?: string | null
}

export const GET = withAuthGuard(async () => {
    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('room_units')
            .select('id, code, room_type_id, floor, status, note')
            .order('code', { ascending: true })

        if (error) {
            console.error('[GET /api/room-units DB error]', error)
            return serverError()
        }

        const units = ((data ?? []) as RoomUnitRow[]).map((u) => ({
            id: u.id,
            code: u.code,
            roomTypeId: u.room_type_id,
            floor: u.floor ?? undefined,
            status: u.status,
            note: u.note ?? undefined,
        }))

        return ok(units)
    } catch (err: unknown) {
        console.error('[GET /api/room-units error]', err)
        return serverError()
    }
}, 'booking.view.own')
