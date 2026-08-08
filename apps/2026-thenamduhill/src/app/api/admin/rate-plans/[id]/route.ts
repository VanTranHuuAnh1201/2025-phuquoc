import type { DeleteRatePlanResponse, UpdateRatePlanResponse } from '@repo/core'
import { fail, ok } from '@/lib/auth/errors'
import { withAuthGuardParams } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'
import {
    countActiveBookings,
    invalidBody,
    mapRatePlanRow,
    notFound,
    parseCancellationRules,
    RATE_PLAN_COLUMNS as COLUMNS,
    refundRulesConflict,
    validationFailed,
    type DbRow,
} from '@/lib/api/catalog'
import { readJsonObject, Validator } from '@/lib/api/validate'

export const dynamic = 'force-dynamic'

function ratePlanNotFound(id: string): Response {
    return notFound(`Không tìm thấy gói giá "${id}".`, `Rate plan "${id}" was not found.`)
}

/**
 * `PATCH /api/admin/rate-plans/[id]`. Quyền: `price.edit`.
 *
 * ⚠️ `chk_rate_plans_refund` ràng buộc **hai cột với nhau**, nên cùng bẫy như
 * `chk_room_types_capacity`: gửi mỗi `refundable: false` mà gói đang có bậc
 * thang trong DB là vi phạm, dù body gửi lên trông vô hại. Phải đọc hàng hiện
 * tại rồi kiểm trên **giá trị sau khi trộn**.
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
        .from('rate_plans')
        .select('id, refundable, cancellation_rules')
        .eq('id', id)
        .maybeSingle()

    if (readError) throw new Error(`Không đọc được rate_plan ${id}: ${readError.message}`)
    if (!current) return ratePlanNotFound(id)

    const currentRow = current as unknown as DbRow
    const v = new Validator()
    const patch: Record<string, unknown> = {}

    const name = v.optionalI18n('name', body.name)
    if (name) patch.name = name
    const description = v.optionalI18n('description', body.description)
    if (description) patch.description = description

    const adjustPercent = v.optionalNumber('adjustPercent', body.adjustPercent, -99.99, 1000)
    if (adjustPercent !== undefined) patch.adjust_percent = adjustPercent
    const depositPercent = v.optionalNumber('depositPercent', body.depositPercent, 0, 100)
    if (depositPercent !== undefined) patch.deposit_percent = depositPercent

    const includesBreakfast = v.optionalBoolean('includesBreakfast', body.includesBreakfast)
    if (includesBreakfast !== undefined) patch.includes_breakfast = includesBreakfast
    const refundable = v.optionalBoolean('refundable', body.refundable)
    if (refundable !== undefined) patch.refundable = refundable

    const roomTypeIds = v.optionalStringArray('roomTypeIds', body.roomTypeIds)
    if (roomTypeIds !== undefined) patch.room_type_ids = roomTypeIds
    const active = v.optionalBoolean('active', body.active)
    if (active !== undefined) patch.active = active

    const rules = parseCancellationRules('cancellationRules', body.cancellationRules, v.fields)
    if (rules !== undefined) patch.cancellation_rules = rules

    if (v.failed) return validationFailed(v.fields)

    // Giá trị SAU KHI TRỘN, không phải body.
    const nextRefundable = refundable ?? currentRow.refundable !== false
    const currentRules = Array.isArray(currentRow.cancellation_rules)
        ? currentRow.cancellation_rules
        : []
    const nextRules = rules ?? currentRules
    if (!nextRefundable && nextRules.length > 0) return refundRulesConflict()

    if (Object.keys(patch).length === 0) {
        return validationFailed([{
            field: 'body',
            message: { vi: 'Không có trường nào để cập nhật.', en: 'No fields to update.' },
        }])
    }

    patch.updated_at = new Date().toISOString()

    const { data, error } = await db
        .from('rate_plans')
        .update(patch)
        .eq('id', id)
        .select(COLUMNS)
        .single()

    if (error) {
        if (error.code === '23514' && error.message.includes('chk_rate_plans_refund')) {
            return refundRulesConflict()
        }
        throw new Error(`Không cập nhật được rate_plan ${id}: ${error.message}`)
    }

    const response: UpdateRatePlanResponse = { item: mapRatePlanRow(data as unknown as DbRow) }
    return ok(response)
}

/**
 * `DELETE /api/admin/rate-plans/[id]` — soft delete (`active = false`).
 * Quyền: `price.edit`.
 *
 * Cùng lý do với hạng phòng: `bookings.rate_plan_id` là khoá ngoại. Xoá cứng
 * một gói đang có đơn làm breakdown giá của đơn cũ mất tên gói — thứ khách nhìn
 * vào để đối chiếu số tiền đã trả.
 *
 * Ngưỡng "đang dùng" DÙNG CHUNG với hạng phòng (SA chốt `380-02 §8.3` điểm 6):
 * `pending_payment + confirmed + checked_in`. Hai mã lỗi khác nhau nhưng cùng
 * một định nghĩa — lệch nhau thì cùng một đơn vừa chặn được cái này vừa không
 * chặn cái kia, và không ai giải thích nổi vì sao.
 */
async function deleteHandler(
    _req: Request,
    _actor: unknown,
    ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
    const { id } = await ctx.params
    const db = createAdminClient()

    const { data: current, error: readError } = await db
        .from('rate_plans')
        .select('id, active')
        .eq('id', id)
        .maybeSingle()

    if (readError) throw new Error(`Không đọc được rate_plan ${id}: ${readError.message}`)
    if (!current) return ratePlanNotFound(id)

    const activeBookingCount = await countActiveBookings('rate_plan_id', id)
    if (activeBookingCount > 0) {
        return fail(
            409,
            'RATE_PLAN_IN_USE',
            {
                vi: `Gói giá còn ${activeBookingCount} đơn chưa trả phòng.`
                    + ' Xử lý hết các đơn đó rồi ngừng bán lại.',
                en: `This rate plan still has ${activeBookingCount} booking(s) not yet checked out.`
                    + ' Close those bookings first, then deactivate it.',
            },
            { activeBookingCount },
        )
    }

    const { error } = await db
        .from('rate_plans')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(`Không ngừng bán được rate_plan ${id}: ${error.message}`)

    const response: DeleteRatePlanResponse = { id, active: false, softDeleted: true }
    return ok(response)
}

export const PATCH = withAuthGuardParams(patchHandler, 'price.edit')
export const DELETE = withAuthGuardParams(deleteHandler, 'price.edit')
