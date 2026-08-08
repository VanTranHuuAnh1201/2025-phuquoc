import type { CreateRatePlanResponse, ListRatePlansResponse } from '@repo/core'
import { ok } from '@/lib/auth/errors'
import { withAuthGuard } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'
import {
    duplicateId,
    invalidBody,
    isUniqueViolation,
    mapRatePlanRow,
    parseCancellationRules,
    RATE_PLAN_COLUMNS as COLUMNS,
    refundRulesConflict,
    validationFailed,
    type DbRow,
} from '@/lib/api/catalog'
import { readJsonObject, slugify, Validator } from '@/lib/api/validate'

export const dynamic = 'force-dynamic'

/**
 * `GET /api/admin/rate-plans` — danh sách gói giá. Quyền: `price.view`.
 *
 * `roomTypeId` lọc theo hạng phòng: `room_type_ids` là mảng jsonb, **rỗng nghĩa
 * là áp cho MỌI hạng**. Nên lọc phải giữ lại cả gói có mảng rỗng — bỏ sót chúng
 * làm màn hình giá của một hạng thiếu đúng các gói phổ quát (gói tiêu chuẩn).
 * Postgres không lọc được "chứa X **hoặc** rỗng" trong một `contains`, nên lọc
 * ở tầng app trên tập nhỏ (5–15 bản ghi) là đúng chi phí.
 */
export const GET = withAuthGuard(async (req: Request): Promise<Response> => {
    const params = new URL(req.url).searchParams
    const includeInactive = params.get('includeInactive') === 'true'
    const roomTypeId = params.get('roomTypeId')

    let query = createAdminClient()
        .from('rate_plans')
        .select(COLUMNS)
        .order('id', { ascending: true })
    if (!includeInactive) query = query.eq('active', true)

    const { data, error } = await query
    if (error) throw new Error(`Không đọc được rate_plans: ${error.message}`)

    let items = ((data ?? []) as unknown as DbRow[]).map(mapRatePlanRow)
    if (roomTypeId) {
        items = items.filter(
            (plan) => plan.roomTypeIds.length === 0 || plan.roomTypeIds.includes(roomTypeId),
        )
    }

    const body: ListRatePlansResponse = { items, total: items.length }
    return ok(body)
}, 'price.view')

/** `POST /api/admin/rate-plans` — tạo gói giá. Quyền: `price.edit` (lễ tân KHÔNG có). */
export const POST = withAuthGuard(async (req: Request): Promise<Response> => {
    const body = await readJsonObject(req)
    if (!body) return invalidBody()

    const v = new Validator()

    const name = v.requireI18n('name', body.name)
    const description = v.requireI18n('description', body.description)

    // `chk_rate_plans_adjust`: `adjust_percent > -100`. Giới hạn dưới là -99.99
    // chứ không -100: giảm đúng 100% là giá 0đ, tức là cho không phòng — nếu
    // resort thật muốn vậy thì đó là một khuyến mãi, không phải một gói giá.
    const adjustPercent = v.requireNumber('adjustPercent', body.adjustPercent, -99.99, 1000)
    const depositPercent = v.requireNumber('depositPercent', body.depositPercent, 0, 100)
    const includesBreakfast = v.optionalBoolean('includesBreakfast', body.includesBreakfast)
    const refundable = v.optionalBoolean('refundable', body.refundable)
    const roomTypeIds = v.optionalStringArray('roomTypeIds', body.roomTypeIds)
    const active = v.optionalBoolean('active', body.active)
    const explicitId = v.optionalSlug('id', body.id)
    const cancellationRules = parseCancellationRules('cancellationRules', body.cancellationRules, v.fields)

    if (v.failed) return validationFailed(v.fields)
    if (!name || !description || adjustPercent === undefined || depositPercent === undefined) {
        return validationFailed(v.fields)
    }

    const isRefundable = refundable ?? true
    const rules = cancellationRules ?? []
    if (!isRefundable && rules.length > 0) return refundRulesConflict()

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
        .from('rate_plans')
        .insert({
            id,
            name,
            description,
            adjust_percent: adjustPercent,
            includes_breakfast: includesBreakfast ?? false,
            refundable: isRefundable,
            cancellation_rules: rules,
            deposit_percent: depositPercent,
            room_type_ids: roomTypeIds ?? [],
            active: active ?? true,
        })
        .select(COLUMNS)
        .single()

    if (error) {
        if (isUniqueViolation(error)) return duplicateId(id)
        // Lớp phòng thủ cuối: nếu kiểm ở tầng app lỡ lọt, DB vẫn chặn bằng
        // `chk_rate_plans_refund`. Dịch về đúng mã hợp đồng thay vì 500.
        if (error.code === '23514' && error.message.includes('chk_rate_plans_refund')) {
            return refundRulesConflict()
        }
        throw new Error(`Không tạo được rate_plan ${id}: ${error.message}`)
    }

    const response: CreateRatePlanResponse = { item: mapRatePlanRow(data as unknown as DbRow) }
    return ok(response, 201)
}, 'price.edit')
