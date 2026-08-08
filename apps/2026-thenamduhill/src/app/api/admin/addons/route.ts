import type { CreateAddonResponse, ListAddonsResponse } from '@repo/core'
import { ok } from '@/lib/auth/errors'
import { withAuthGuard } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'
import {
    ADDON_COLUMNS as COLUMNS,
    duplicateId,
    invalidBody,
    isUniqueViolation,
    mapAddonRow,
    validationFailed,
    type DbRow,
} from '@/lib/api/catalog'
import { readJsonObject, slugify, Validator } from '@/lib/api/validate'

export const dynamic = 'force-dynamic'

/**
 * `GET /api/admin/addons` — danh sách dịch vụ thêm.
 *
 * Quyền: `content.edit` — **khác hai nhóm trên**. Dịch vụ thêm là **nội dung**,
 * không phải giá phòng: biên tập viên sửa được mà không cần `price.edit`. Hệ
 * quả cần biết trước: `editor` chỉ có đúng `content.edit` nên **gọi được** ba
 * route addon nhưng **403** ở room-types/rate-plans; ngược lại `receptionist`
 * có `price.view` nên đọc được hạng phòng nhưng **403** ở mọi route addon.
 *
 * Riêng Nam Du: đưa đón tàu cao tốc từ Rạch Giá gần như bắt buộc, nên
 * `sort_order` được dùng để đẩy nó lên đầu danh sách (§B6) — sắp xếp theo
 * `sort_order` chứ không theo tên là chủ ý.
 */
export const GET = withAuthGuard(async (req: Request): Promise<Response> => {
    const includeInactive = new URL(req.url).searchParams.get('includeInactive') === 'true'

    let query = createAdminClient()
        .from('addons')
        .select(COLUMNS)
        .order('sort_order', { ascending: true })
    if (!includeInactive) query = query.eq('active', true)

    const { data, error } = await query
    if (error) throw new Error(`Không đọc được addons: ${error.message}`)

    const items = ((data ?? []) as unknown as DbRow[]).map(mapAddonRow)
    const body: ListAddonsResponse = { items, total: items.length }
    return ok(body)
}, 'content.edit')

/** `POST /api/admin/addons`. Quyền: `content.edit`. */
export const POST = withAuthGuard(async (req: Request): Promise<Response> => {
    const body = await readJsonObject(req)
    if (!body) return invalidBody()

    const v = new Validator()

    const name = v.requireI18n('name', body.name)
    // `unit` là chuỗi khách NHÌN THẤY ("khách / chiều"), nên bắt buộc song ngữ
    // như mọi chuỗi khác (R6). `addons.unit` không có CHECK ở DB — chốt chặn
    // duy nhất là ở đây, không ỷ vào tầng dưới.
    const unit = v.requireI18n('unit', body.unit)
    const price = v.requireNumber('price', body.price, 0, 1_000_000_000)
    const sortOrder = v.optionalInt('sortOrder', body.sortOrder, 0, 10_000)
    const active = v.optionalBoolean('active', body.active)
    const explicitId = v.optionalSlug('id', body.id)

    if (v.failed) return validationFailed(v.fields)
    if (!name || !unit || price === undefined) return validationFailed(v.fields)

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

    const { data, error } = await createAdminClient()
        .from('addons')
        .insert({
            id,
            name,
            price,
            unit,
            sort_order: sortOrder ?? 0,
            active: active ?? true,
        })
        .select(COLUMNS)
        .single()

    if (error) {
        if (isUniqueViolation(error)) return duplicateId(id)
        throw new Error(`Không tạo được addon ${id}: ${error.message}`)
    }

    const response: CreateAddonResponse = { item: mapAddonRow(data as unknown as DbRow) }
    return ok(response, 201)
}, 'content.edit')
