import type { CreateRoomTypeResponse, ListRoomTypesResponse, RoomGroup } from '@repo/core'
import { ok } from '@/lib/auth/errors'
import { withAuthGuard } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'
import {
    duplicateId,
    invalidBody,
    isUniqueViolation,
    mapRoomTypeRow,
    ROOM_TYPE_COLUMNS as COLUMNS,
    validationFailed,
    type DbRow,
} from '@/lib/api/catalog'
import { readJsonObject, slugify, Validator } from '@/lib/api/validate'

export const dynamic = 'force-dynamic'

const GROUPS: readonly RoomGroup[] = ['couple', 'family', 'suite']

/**
 * `GET /api/admin/room-types` — danh sách hạng phòng cho CMS.
 * Quyền: `price.view` — **lễ tân CÓ**, vì lễ tân phải tra giá để trả lời khách;
 * chỉ việc **sửa** giá mới cần `price.edit` (§B8).
 *
 * ─── VÌ SAO ROUTE NÀY LÀ LỖ HỔNG NGHIÊM TRỌNG TRƯỚC ĐÂY ────────────────────
 *
 * `API_INTEGRATION_MAP §M9`: bốn màn danh mục đọc/ghi `catalog.store` có
 * `persist(localStorage)`. Hạng phòng tạo trong CMS **chỉ tồn tại trên máy vừa
 * dùng** — đổi máy hoặc xoá cache là mất, trang khách cũng không thấy. Đó không
 * phải thiếu tính năng mà là CMS chưa thật sự quản được dữ liệu.
 *
 * ─── VÌ SAO KHÁC `GET /api/rooms` CỦA TRANG KHÁCH ──────────────────────────
 *
 * Trang khách chỉ được thấy hạng đang bán. CMS phải thấy **cả hạng đã tắt** để
 * bật lại được — một hạng tắt nhầm mà admin không nhìn thấy thì không có đường
 * nào sửa ngoài vào thẳng DB.
 *
 * `unitCount` đếm `room_units` trỏ vào hạng: cảnh báo trước khi tắt bán một
 * hạng còn phòng vật lý.
 */
export const GET = withAuthGuard(async (req: Request): Promise<Response> => {
    const includeInactive = new URL(req.url).searchParams.get('includeInactive') === 'true'

    const db = createAdminClient()
    let query = db.from('room_types').select(COLUMNS).order('sort_order', { ascending: true })
    if (!includeInactive) query = query.eq('active', true)

    const { data, error } = await query
    if (error) {
        // C3: không nuốt lỗi, không trả `[]` giả vờ "chưa có dữ liệu" — trạng
        // thái rỗng giả làm admin tưởng mất sạch hạng phòng và tạo lại từ đầu.
        throw new Error(`Không đọc được room_types: ${error.message}`)
    }

    const rows = (data ?? []) as unknown as DbRow[]

    // Đếm phòng vật lý theo hạng bằng MỘT truy vấn, không phải N truy vấn con.
    const { data: unitRows, error: unitError } = await db.from('room_units').select('room_type_id')
    if (unitError) throw new Error(`Không đọc được room_units: ${unitError.message}`)

    const unitCounts = new Map<string, number>()
    for (const row of (unitRows ?? []) as unknown as DbRow[]) {
        const key = String(row.room_type_id)
        unitCounts.set(key, (unitCounts.get(key) ?? 0) + 1)
    }

    const items = rows.map((row) => mapRoomTypeRow(row, unitCounts.get(String(row.id)) ?? 0))

    // `{items, total}` chứ không mảng trần (SA chốt 380-02 §6.2): thêm phân
    // trang sau chỉ là thêm field tuỳ chọn, FE cũ không phải sửa dòng nào.
    const body: ListRoomTypesResponse = { items, total: items.length }
    return ok(body)
}, 'price.view')

/**
 * `POST /api/admin/room-types` — tạo hạng phòng mới.
 * Quyền: `price.edit` — **lễ tân KHÔNG có** (§B8). Đây là câu hỏi khách doanh
 * nghiệp luôn đặt ra, nên nó phải chặn ở server chứ không chỉ ẩn nút trên UI.
 */
export const POST = withAuthGuard(async (req: Request): Promise<Response> => {
    const body = await readJsonObject(req)
    if (!body) return invalidBody()

    const v = new Validator()

    const name = v.requireI18n('name', body.name)
    const description = v.requireI18n('description', body.description)
    const area = v.requireString('area', body.area, 100)
    const guests = v.requireInt('guests', body.guests, 1, 50)
    const maxGuests = v.requireInt('maxGuests', body.maxGuests, 1, 50)
    const defaultGuests = v.requireInt('defaultGuests', body.defaultGuests, 1, 50)
    const basePrice = v.requireNumber('basePrice', body.basePrice, 0, 1_000_000_000)
    const extraBed = v.optionalNumber('extraBed', body.extraBed, 0, 1_000_000_000)
    const extraBedFee = v.optionalNumber('extraBedFee', body.extraBedFee, 0, 1_000_000_000)
    const tags = v.optionalI18nArray('tags', body.tags)
    const images = v.optionalStringArray('images', body.images)
    const bed = v.optionalI18n('bed', body.bed)
    const view = v.optionalI18n('view', body.view)
    const longDesc = v.optionalI18n('longDesc', body.longDesc)
    const longDesc2 = v.optionalI18n('longDesc2', body.longDesc2)
    const amenities = v.optionalI18nArray('amenities', body.amenities)
    const conditions = v.optionalI18nArray('conditions', body.conditions)
    const sortOrder = v.optionalInt('sortOrder', body.sortOrder, 0, 10_000)
    const active = v.optionalBoolean('active', body.active)
    const explicitId = v.optionalSlug('id', body.id)

    let group: RoomGroup | undefined
    if (body.group !== undefined) {
        if (typeof body.group !== 'string' || !GROUPS.includes(body.group as RoomGroup)) {
            v.add('group', {
                vi: 'Nhóm hạng phòng phải là một trong: couple, family, suite.',
                en: 'Room group must be one of: couple, family, suite.',
            })
        } else {
            group = body.group as RoomGroup
        }
    }

    // Kiểm quan hệ giữa hai trường, khớp `chk_room_types_capacity` trong DB.
    // Bắt ở đây để trả 400 chỉ đúng ô sai, thay vì để Postgres ném 23514 mà
    // route chỉ dịch được thành 500 chung chung.
    if (guests !== undefined && maxGuests !== undefined && maxGuests < guests) {
        v.add('maxGuests', {
            vi: 'Số khách tối đa không được nhỏ hơn số khách tiêu chuẩn.',
            en: 'Maximum guests cannot be lower than standard guests.',
        })
    }

    if (v.failed) return validationFailed(v.fields)
    if (!name || !description || area === undefined || guests === undefined
        || maxGuests === undefined || defaultGuests === undefined || basePrice === undefined) {
        return validationFailed(v.fields)
    }

    // Không gửi `id` → sinh từ `name.en`. Sinh từ `en` chứ không `vi` để slug
    // không phụ thuộc bước bỏ dấu, và để URL đọc được với cả khách quốc tế.
    const id = explicitId ?? slugify(name.en)
    if (!id) {
        return validationFailed([{
            field: 'id',
            message: {
                vi: 'Không sinh được mã định danh từ tên tiếng Anh. Nhập mã thủ công.',
                en: 'Could not derive an id from the English name. Provide one manually.',
            },
        }])
    }

    const insert: Record<string, unknown> = {
        id,
        name,
        description,
        area,
        guests,
        max_guests: maxGuests,
        default_guests: defaultGuests,
        base_price: basePrice,
        extra_bed: extraBed ?? 0,
        tags: tags ?? [],
        images: images ?? [],
        amenities: amenities ?? [],
        conditions: conditions ?? [],
        sort_order: sortOrder ?? 0,
        active: active ?? true,
    }
    if (extraBedFee !== undefined) insert.extra_bed_fee = extraBedFee
    if (group !== undefined) insert.group = group
    if (bed) insert.bed = bed
    if (view) insert.view = view
    if (longDesc) insert.long_desc = longDesc
    if (longDesc2) insert.long_desc_2 = longDesc2

    const { data, error } = await createAdminClient()
        .from('room_types')
        .insert(insert)
        .select(COLUMNS)
        .single()

    if (error) {
        // BE4: kiểm-rồi-ghi có khe hở. Hai admin bấm Lưu cùng lúc đều thấy slug
        // trống ⇒ người sau phải nhận 409 đúng nghĩa, không phải 500.
        if (isUniqueViolation(error)) return duplicateId(id)
        throw new Error(`Không tạo được room_type ${id}: ${error.message}`)
    }

    const response: CreateRoomTypeResponse = {
        item: mapRoomTypeRow(data as unknown as DbRow, 0),
    }
    return ok(response, 201)
}, 'price.edit')
