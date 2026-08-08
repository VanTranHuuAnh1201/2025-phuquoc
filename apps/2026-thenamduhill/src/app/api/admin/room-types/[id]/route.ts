import type { DeleteRoomTypeResponse, RoomGroup, UpdateRoomTypeResponse } from '@repo/core'
import { fail, ok } from '@/lib/auth/errors'
import { withAuthGuardParams } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'
import {
    countActiveBookings,
    invalidBody,
    mapRoomTypeRow,
    notFound,
    ROOM_TYPE_COLUMNS as COLUMNS,
    validationFailed,
    type DbRow,
} from '@/lib/api/catalog'
import { readJsonObject, Validator } from '@/lib/api/validate'

export const dynamic = 'force-dynamic'

const GROUPS: readonly RoomGroup[] = ['couple', 'family', 'suite']

function roomTypeNotFound(id: string): Response {
    return notFound(
        `Không tìm thấy hạng phòng "${id}".`,
        `Room type "${id}" was not found.`,
    )
}

/**
 * `PATCH /api/admin/room-types/[id]` — sửa một phần. Quyền: `price.edit`.
 *
 * Mọi trường tuỳ chọn: không gửi = giữ nguyên. Gửi `null` KHÔNG được hỗ trợ —
 * muốn xoá giá trị nullable thì gửi chuỗi rỗng / mảng rỗng theo đúng kiểu
 * (hợp đồng `UpdateRoomTypeRequest`).
 *
 * ⚠️ `chk_room_types_capacity` là ràng buộc **giữa hai cột**. PATCH chỉ gửi
 * `guests` mà không gửi `maxGuests` vẫn có thể vi phạm, nên phải đọc hàng hiện
 * tại rồi kiểm trên **giá trị sau khi trộn** — kiểm trên body gửi lên là bỏ lọt.
 */
async function patchHandler(
    req: Request,
    _actor: unknown,
    ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
    const { id } = await ctx.params
    const body = await readJsonObject(req)
    if (!body) return invalidBody()

    const db = createAdminClient()
    const { data: current, error: readError } = await db
        .from('room_types')
        .select('id, guests, max_guests')
        .eq('id', id)
        .maybeSingle()

    if (readError) throw new Error(`Không đọc được room_type ${id}: ${readError.message}`)
    if (!current) return roomTypeNotFound(id)

    const currentRow = current as unknown as DbRow
    const v = new Validator()
    const patch: Record<string, unknown> = {}

    const name = v.optionalI18n('name', body.name)
    if (name) patch.name = name
    const description = v.optionalI18n('description', body.description)
    if (description) patch.description = description
    const area = v.optionalString('area', body.area, 100)
    if (area !== undefined) patch.area = area

    const guests = v.optionalInt('guests', body.guests, 1, 50)
    if (guests !== undefined) patch.guests = guests
    const maxGuests = v.optionalInt('maxGuests', body.maxGuests, 1, 50)
    if (maxGuests !== undefined) patch.max_guests = maxGuests
    const defaultGuests = v.optionalInt('defaultGuests', body.defaultGuests, 1, 50)
    if (defaultGuests !== undefined) patch.default_guests = defaultGuests

    const basePrice = v.optionalNumber('basePrice', body.basePrice, 0, 1_000_000_000)
    if (basePrice !== undefined) patch.base_price = basePrice
    const extraBed = v.optionalNumber('extraBed', body.extraBed, 0, 1_000_000_000)
    if (extraBed !== undefined) patch.extra_bed = extraBed
    const extraBedFee = v.optionalNumber('extraBedFee', body.extraBedFee, 0, 1_000_000_000)
    if (extraBedFee !== undefined) patch.extra_bed_fee = extraBedFee

    const tags = v.optionalI18nArray('tags', body.tags)
    if (tags !== undefined) patch.tags = tags
    const images = v.optionalStringArray('images', body.images)
    if (images !== undefined) patch.images = images
    const amenities = v.optionalI18nArray('amenities', body.amenities)
    if (amenities !== undefined) patch.amenities = amenities
    const conditions = v.optionalI18nArray('conditions', body.conditions)
    if (conditions !== undefined) patch.conditions = conditions

    const bed = v.optionalI18n('bed', body.bed)
    if (bed) patch.bed = bed
    const view = v.optionalI18n('view', body.view)
    if (view) patch.view = view
    const longDesc = v.optionalI18n('longDesc', body.longDesc)
    if (longDesc) patch.long_desc = longDesc
    const longDesc2 = v.optionalI18n('longDesc2', body.longDesc2)
    if (longDesc2) patch.long_desc_2 = longDesc2

    const sortOrder = v.optionalInt('sortOrder', body.sortOrder, 0, 10_000)
    if (sortOrder !== undefined) patch.sort_order = sortOrder
    const active = v.optionalBoolean('active', body.active)
    if (active !== undefined) patch.active = active

    if (body.group !== undefined) {
        if (typeof body.group !== 'string' || !GROUPS.includes(body.group as RoomGroup)) {
            v.add('group', {
                vi: 'Nhóm hạng phòng phải là một trong: couple, family, suite.',
                en: 'Room group must be one of: couple, family, suite.',
            })
        } else {
            patch.group = body.group
        }
    }

    // Kiểm trên GIÁ TRỊ SAU KHI TRỘN, không phải trên body.
    const nextGuests = guests ?? Number(currentRow.guests)
    const nextMaxGuests = maxGuests ?? Number(currentRow.max_guests)
    if (Number.isFinite(nextGuests) && Number.isFinite(nextMaxGuests) && nextMaxGuests < nextGuests) {
        v.add('maxGuests', {
            vi: `Số khách tối đa (${nextMaxGuests}) không được nhỏ hơn số khách tiêu chuẩn (${nextGuests}).`,
            en: `Maximum guests (${nextMaxGuests}) cannot be lower than standard guests (${nextGuests}).`,
        })
    }

    if (v.failed) return validationFailed(v.fields)

    if (Object.keys(patch).length === 0) {
        return validationFailed([{
            field: 'body',
            message: {
                vi: 'Không có trường nào để cập nhật.',
                en: 'No fields to update.',
            },
        }])
    }

    // `updated_at` không có trigger trên bảng này — đặt tay, nếu không CMS hiện
    // thời điểm sửa cũ và không ai biết bản ghi vừa đổi.
    patch.updated_at = new Date().toISOString()

    const { data, error } = await db
        .from('room_types')
        .update(patch)
        .eq('id', id)
        .select(COLUMNS)
        .single()

    if (error) throw new Error(`Không cập nhật được room_type ${id}: ${error.message}`)

    const response: UpdateRoomTypeResponse = { item: mapRoomTypeRow(data as unknown as DbRow) }
    return ok(response)
}

/**
 * `DELETE /api/admin/room-types/[id]` — **soft delete** (`active = false`).
 * Quyền: `price.edit`.
 *
 * ─── VÌ SAO KHÔNG XOÁ CỨNG ─────────────────────────────────────────────────
 *
 * `bookings.room_type_id` là khoá ngoại trỏ vào đây. Xoá cứng một hạng đang có
 * đơn làm **mất lịch sử đơn** — đúng thứ cần khi tranh chấp với khách. Bảng
 * `room_types` không có cột `deleted_at`, nên cờ soft delete là chính `active`.
 *
 * ─── VÌ SAO CHẶN 409 KÈM SỐ ĐƠN ────────────────────────────────────────────
 *
 * Ngưỡng "đang dùng" = `pending_payment + confirmed + checked_in` (SA chốt
 * `380-02 §8.3` điểm 6). Trả kèm `activeBookingCount` để admin biết **bao
 * nhiêu** đơn phải xử lý — nói "còn đơn" mà không nói mấy đơn là bắt admin mò.
 */
async function deleteHandler(
    _req: Request,
    _actor: unknown,
    ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
    const { id } = await ctx.params
    const db = createAdminClient()

    const { data: current, error: readError } = await db
        .from('room_types')
        .select('id, active')
        .eq('id', id)
        .maybeSingle()

    if (readError) throw new Error(`Không đọc được room_type ${id}: ${readError.message}`)
    if (!current) return roomTypeNotFound(id)

    const activeBookingCount = await countActiveBookings('room_type_id', id)
    if (activeBookingCount > 0) {
        return fail(
            409,
            'ROOM_TYPE_IN_USE',
            {
                vi: `Hạng phòng còn ${activeBookingCount} đơn chưa trả phòng.`
                    + ' Xử lý hết các đơn đó rồi ngừng bán lại.',
                en: `This room type still has ${activeBookingCount} booking(s) not yet checked out.`
                    + ' Close those bookings first, then deactivate it.',
            },
            { activeBookingCount },
        )
    }

    const { error } = await db
        .from('room_types')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(`Không ngừng bán được room_type ${id}: ${error.message}`)

    // `softDeleted: true` để FE hiển thị đúng chữ "Đã ngừng bán", KHÔNG phải
    // "Đã xoá" — admin đọc "đã xoá" rồi tạo lại hạng cùng tên là có hai bản ghi.
    const response: DeleteRoomTypeResponse = { id, active: false, softDeleted: true }
    return ok(response)
}

export const PATCH = withAuthGuardParams(patchHandler, 'price.edit')
export const DELETE = withAuthGuardParams(deleteHandler, 'price.edit')
