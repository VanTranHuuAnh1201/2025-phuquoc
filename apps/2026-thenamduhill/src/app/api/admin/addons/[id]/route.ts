import type { DeleteAddonResponse, UpdateAddonResponse } from '@repo/core'
import { ok } from '@/lib/auth/errors'
import { withAuthGuardParams } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'
import {
    ADDON_COLUMNS as COLUMNS,
    invalidBody,
    mapAddonRow,
    notFound,
    validationFailed,
    type DbRow,
} from '@/lib/api/catalog'
import { readJsonObject, Validator } from '@/lib/api/validate'

export const dynamic = 'force-dynamic'

function addonNotFound(id: string): Response {
    return notFound(`Không tìm thấy dịch vụ "${id}".`, `Add-on "${id}" was not found.`)
}

/** `PATCH /api/admin/addons/[id]`. Quyền: `content.edit`. */
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
        .from('addons')
        .select('id')
        .eq('id', id)
        .maybeSingle()

    if (readError) throw new Error(`Không đọc được addon ${id}: ${readError.message}`)
    if (!current) return addonNotFound(id)

    const v = new Validator()
    const patch: Record<string, unknown> = {}

    const name = v.optionalI18n('name', body.name)
    if (name) patch.name = name
    const unit = v.optionalI18n('unit', body.unit)
    if (unit) patch.unit = unit
    const price = v.optionalNumber('price', body.price, 0, 1_000_000_000)
    if (price !== undefined) patch.price = price
    const sortOrder = v.optionalInt('sortOrder', body.sortOrder, 0, 10_000)
    if (sortOrder !== undefined) patch.sort_order = sortOrder
    const active = v.optionalBoolean('active', body.active)
    if (active !== undefined) patch.active = active

    if (v.failed) return validationFailed(v.fields)

    if (Object.keys(patch).length === 0) {
        return validationFailed([{
            field: 'body',
            message: { vi: 'Không có trường nào để cập nhật.', en: 'No fields to update.' },
        }])
    }

    patch.updated_at = new Date().toISOString()

    const { data, error } = await db
        .from('addons')
        .update(patch)
        .eq('id', id)
        .select(COLUMNS)
        .single()

    if (error) throw new Error(`Không cập nhật được addon ${id}: ${error.message}`)

    const response: UpdateAddonResponse = { item: mapAddonRow(data as unknown as DbRow) }
    return ok(response)
}

/**
 * `DELETE /api/admin/addons/[id]` — soft delete (`active = false`).
 * Quyền: `content.edit`.
 *
 * ─── VÌ SAO KHÔNG CÓ NHÁNH 409 NHƯ HAI DANH MỤC KIA ────────────────────────
 *
 * Addon đã bán nằm trong `bookings.addons` **jsonb** (id → số lượng), **không**
 * phải khoá ngoại — xoá không làm gãy ràng buộc nào, nên không có gì để chặn.
 *
 * Nhưng vẫn soft delete: xoá cứng làm breakdown giá của đơn cũ mất **tên dịch
 * vụ**, chỉ còn lại một id trơ. Khách hỏi "600.000đ này là tiền gì" thì lễ tân
 * không trả lời được — mất đúng thứ nhật ký đơn sinh ra để giữ.
 *
 * Hệ quả cho FE: DELETE ở đây **luôn thành công** nếu addon tồn tại. Không cần
 * xử lý nhánh `*_IN_USE`, đúng như hợp đồng `DeleteAddonError` đã khai (chỉ
 * 401/403/404/500).
 */
async function deleteHandler(
    _req: Request,
    _actor: unknown,
    ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
    const { id } = await ctx.params
    const db = createAdminClient()

    const { data: current, error: readError } = await db
        .from('addons')
        .select('id')
        .eq('id', id)
        .maybeSingle()

    if (readError) throw new Error(`Không đọc được addon ${id}: ${readError.message}`)
    if (!current) return addonNotFound(id)

    const { error } = await db
        .from('addons')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(`Không ngừng bán được addon ${id}: ${error.message}`)

    const response: DeleteAddonResponse = { id, active: false, softDeleted: true }
    return ok(response)
}

export const PATCH = withAuthGuardParams(patchHandler, 'content.edit')
export const DELETE = withAuthGuardParams(deleteHandler, 'content.edit')
