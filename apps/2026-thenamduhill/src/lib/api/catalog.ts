import type {
    AddonDto,
    CancellationRule,
    I18nText,
    RatePlanDto,
    RoomGroup,
    RoomTypeDto,
} from '@repo/core'
import { fail } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'
import type { FieldError } from './validate'

/**
 * Mapper + helper dùng chung cho 3 nhóm route danh mục (ticket `390-01`).
 *
 * ─── snake_case ⇄ camelCase LÀ CHỖ HAY LỆCH NHẤT ────────────────────────────
 *
 * Bẫy đã ghi ở `API_INTEGRATION_MAP §3`: tên cột lệch schema ra
 * `42703 column does not exist`, mà **build vẫn xanh** vì Supabase client chưa
 * gắn generic schema nên `.select('*')` trả `any`. Ba hàm `map*Row()` dưới đây
 * là ranh giới DUY NHẤT dịch hai chiều — mọi tên cột chỉ được viết ở đây, không
 * rải trong thân route.
 *
 * Mọi tên cột đã đối chiếu `information_schema.columns` trên DB sống 08/08/2026.
 */

/** Hàng thô từ Supabase — key snake_case, giá trị chưa ép kiểu. */
export type DbRow = Record<string, unknown>

/**
 * Cột đọc lên của mỗi bảng — liệt kê TƯỜNG MINH thay vì `select('*')`.
 *
 * Khai một lần ở đây vì `route.ts` và `[id]/route.ts` của cùng một danh mục
 * phải trả **cùng một hình dạng**: liệt kê hai lần thì thêm cột chỉ sửa một
 * chỗ, và FE nhận DTO thiếu field tuỳ đường đi — lỗi rất khó truy.
 *
 * `"group"` phải có dấu nháy kép: `group` là **từ khoá SQL**, không nháy thì
 * PostgREST hiểu nhầm thành cú pháp gộp nhóm.
 */
export const ROOM_TYPE_COLUMNS =
    'id, name, description, area, guests, max_guests, default_guests, base_price,'
    + ' extra_bed, extra_bed_fee, "group", tags, images, bed, view, long_desc, long_desc_2,'
    + ' amenities, conditions, sort_order, active, created_at, updated_at'

export const RATE_PLAN_COLUMNS =
    'id, name, description, adjust_percent, includes_breakfast, refundable,'
    + ' cancellation_rules, deposit_percent, room_type_ids, active, created_at, updated_at'

export const ADDON_COLUMNS = 'id, name, price, unit, sort_order, active, created_at, updated_at'

/** `unknown` → `I18nText`. Không phải object thì trả chuỗi rỗng cả hai vế. */
function toI18n(value: unknown): I18nText {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        const obj = value as Record<string, unknown>
        return {
            vi: typeof obj.vi === 'string' ? obj.vi : '',
            en: typeof obj.en === 'string' ? obj.en : '',
        }
    }
    return { vi: '', en: '' }
}

function toI18nArray(value: unknown): I18nText[] {
    return Array.isArray(value) ? value.map(toI18n) : []
}

function toStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

/**
 * `numeric` của Postgres về JS là **chuỗi** qua PostgREST, không phải number.
 *
 * Đây là bẫy im lặng: `base_price` trả `"1500000"` thì `JSON.stringify` giữ
 * nguyên dấu nháy, FE nhận chuỗi, `giá * số đêm` ra chuỗi nối. Ép ở đúng một
 * chỗ này thay vì tin kiểu trả về.
 */
function toNumber(value: unknown, fallback = 0): number {
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : fallback
}

/** Timestamp về chuỗi ISO 8601 (C6) — không bao giờ trả `Date` object ra FE. */
function toIso(value: unknown): string {
    return typeof value === 'string' ? value : ''
}

/** `room_types` → `RoomTypeDto`. `unitCount` do route đếm thêm, không phải cột. */
export function mapRoomTypeRow(row: DbRow, unitCount?: number): RoomTypeDto {
    const dto: RoomTypeDto = {
        id: String(row.id),
        name: toI18n(row.name),
        description: toI18n(row.description),
        area: typeof row.area === 'string' ? row.area : '',
        guests: toNumber(row.guests),
        maxGuests: toNumber(row.max_guests),
        defaultGuests: toNumber(row.default_guests),
        basePrice: toNumber(row.base_price),
        extraBed: toNumber(row.extra_bed),
        tags: toI18nArray(row.tags),
        images: toStringArray(row.images),
        amenities: toI18nArray(row.amenities),
        conditions: toI18nArray(row.conditions),
        sortOrder: toNumber(row.sort_order),
        active: row.active !== false,
        createdAt: toIso(row.created_at),
        updatedAt: toIso(row.updated_at),
    }

    // Cột nullable: chỉ gán khi DB có giá trị. Gán `undefined` tường minh làm
    // `JSON.stringify` bỏ key — cùng kết quả, nhưng gán có điều kiện thì đọc
    // code là biết cột nào nullable trong DB, không phải tra lại schema.
    if (row.extra_bed_fee != null) dto.extraBedFee = toNumber(row.extra_bed_fee)
    if (typeof row.group === 'string') dto.group = row.group as RoomGroup
    if (row.bed != null) dto.bed = toI18n(row.bed)
    if (row.view != null) dto.view = toI18n(row.view)
    if (row.long_desc != null) dto.longDesc = toI18n(row.long_desc)
    if (row.long_desc_2 != null) dto.longDesc2 = toI18n(row.long_desc_2)
    if (unitCount !== undefined) dto.unitCount = unitCount

    return dto
}

/** `unknown` → bậc thang hoàn tiền, bỏ phần tử sai hình dạng (§B5). */
function toCancellationRules(value: unknown): CancellationRule[] {
    if (!Array.isArray(value)) return []
    const out: CancellationRule[] = []
    for (const item of value) {
        if (item === null || typeof item !== 'object') continue
        const obj = item as Record<string, unknown>
        const days = toNumber(obj.daysBeforeCheckIn, -1)
        const percent = toNumber(obj.refundPercent, -1)
        if (days < 0 || percent < 0) continue
        out.push({ daysBeforeCheckIn: days, refundPercent: percent })
    }
    return out
}

/** `rate_plans` → `RatePlanDto`. */
export function mapRatePlanRow(row: DbRow): RatePlanDto {
    return {
        id: String(row.id),
        name: toI18n(row.name),
        description: toI18n(row.description),
        adjustPercent: toNumber(row.adjust_percent),
        includesBreakfast: row.includes_breakfast === true,
        refundable: row.refundable !== false,
        cancellationRules: toCancellationRules(row.cancellation_rules),
        depositPercent: toNumber(row.deposit_percent),
        roomTypeIds: toStringArray(row.room_type_ids),
        active: row.active !== false,
        createdAt: toIso(row.created_at),
        updatedAt: toIso(row.updated_at),
    }
}

/** `addons` → `AddonDto`. */
export function mapAddonRow(row: DbRow): AddonDto {
    return {
        id: String(row.id),
        name: toI18n(row.name),
        price: toNumber(row.price),
        unit: toI18n(row.unit),
        sortOrder: toNumber(row.sort_order),
        active: row.active !== false,
        createdAt: toIso(row.created_at),
        updatedAt: toIso(row.updated_at),
    }
}

/**
 * Bậc thang hoàn tiền do client gửi — kiểm hình dạng, trả lỗi theo ô.
 * Trả `undefined` khi không gửi (PATCH = giữ nguyên).
 */
export function parseCancellationRules(
    field: string,
    value: unknown,
    errors: FieldError[],
): CancellationRule[] | undefined {
    if (value === undefined) return undefined
    if (!Array.isArray(value)) {
        errors.push({
            field,
            message: {
                vi: 'Bậc thang hoàn tiền phải là danh sách.',
                en: 'Cancellation rules must be a list.',
            },
        })
        return undefined
    }
    const out: CancellationRule[] = []
    for (let i = 0; i < value.length; i += 1) {
        const item: unknown = value[i]
        const obj = item !== null && typeof item === 'object'
            ? (item as Record<string, unknown>)
            : null
        const days = obj ? obj.daysBeforeCheckIn : undefined
        const percent = obj ? obj.refundPercent : undefined
        if (typeof days !== 'number' || !Number.isFinite(days) || days < 0) {
            errors.push({
                field: `${field}[${i}].daysBeforeCheckIn`,
                message: {
                    vi: 'Số ngày trước khi nhận phòng phải là số không âm.',
                    en: 'Days before check-in must be a non-negative number.',
                },
            })
            continue
        }
        if (typeof percent !== 'number' || !Number.isFinite(percent) || percent < 0 || percent > 100) {
            errors.push({
                field: `${field}[${i}].refundPercent`,
                message: {
                    vi: 'Phần trăm hoàn tiền phải nằm trong khoảng 0 đến 100.',
                    en: 'Refund percent must be between 0 and 100.',
                },
            })
            continue
        }
        out.push({ daysBeforeCheckIn: days, refundPercent: percent })
    }
    return out
}

/**
 * Ngưỡng "đang dùng" của soft delete — `ndh-sa` chốt ở `380-02 §8.3` điểm 6.
 *
 * CHỈ ba trạng thái này chặn việc ngừng bán. `checked_out`/`cancelled`/
 * `no_show`/`expired` **không** tính: đơn đã đóng không cản việc tắt một hạng
 * phòng, và lịch sử của nó vẫn tra được nguyên vẹn vì đây là **soft delete**
 * (`active = false`) — khoá ngoại `bookings.room_type_id` không hề gãy.
 *
 * Đếm cả `cancelled` là chặn nhầm: một hạng bán 3 năm có hàng trăm đơn đã huỷ,
 * admin sẽ không bao giờ tắt được nó và cũng không hiểu vì sao.
 */
export const ACTIVE_BOOKING_STATUSES = ['pending_payment', 'confirmed', 'checked_in'] as const

/**
 * Đếm đơn CHƯA ĐÓNG đang trỏ vào một hạng phòng / gói giá.
 *
 * `head: true` + `count: 'exact'`: chỉ cần con số, không kéo hàng về. Một hạng
 * bán lâu có thể có hàng nghìn đơn — kéo hết chỉ để `.length` là lãng phí thật,
 * không phải tối ưu sớm.
 *
 * Ném khi lỗi DB, không trả `0`: trả `0` nghĩa là "không có đơn nào" ⇒ route
 * cho phép soft delete một hạng **đang có khách ở**. Sai im lặng ở đây tệ hơn
 * hẳn một cái 500 ồn ào (C3).
 */
export async function countActiveBookings(column: 'room_type_id' | 'rate_plan_id', id: string): Promise<number> {
    const { count, error } = await createAdminClient()
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq(column, id)
        .in('status', ACTIVE_BOOKING_STATUSES)

    if (error) {
        throw new Error(`Không đếm được đơn đang dùng ${column}=${id}: ${error.message}`)
    }
    return count ?? 0
}

/** 400 `VALIDATION_FAILED` kèm danh sách ô sai — FE gắn vào đúng input. */
export function validationFailed(fields: FieldError[]): Response {
    return fail(
        400,
        'VALIDATION_FAILED',
        {
            vi: 'Dữ liệu chưa hợp lệ. Kiểm tra các ô được đánh dấu rồi lưu lại.',
            en: 'Some fields are invalid. Review the highlighted fields and save again.',
        },
        { fields },
    )
}

/** 400 khi body không phải JSON object. */
export function invalidBody(): Response {
    return fail(400, 'VALIDATION_FAILED', {
        vi: 'Nội dung gửi lên không đọc được. Gửi lại dưới dạng JSON.',
        en: 'The request body could not be read. Send it as JSON.',
    })
}

/** 404 song ngữ cho một bản ghi danh mục. */
export function notFound(vi: string, en: string): Response {
    return fail(404, 'NOT_FOUND', { vi, en })
}

/**
 * 400 `REFUND_RULES_CONFLICT` — khai bậc thang hoàn tiền cho gói **không hoàn**.
 *
 * Khớp `chk_rate_plans_refund`: `refundable OR cancellation_rules = '[]'`.
 * Tách khỏi `VALIDATION_FAILED` chung vì đây là mâu thuẫn **logic giữa hai
 * trường**, không phải một ô điền sai — FE phải nói được "chọn một trong hai",
 * chứ không tô đỏ một ô rồi để admin đoán.
 */
export function refundRulesConflict(): Response {
    return fail(400, 'REFUND_RULES_CONFLICT', {
        vi: 'Gói không hoàn tiền thì không được khai bậc thang hoàn tiền.'
            + ' Bật "Cho phép hoàn tiền" hoặc xoá hết các bậc.',
        en: 'A non-refundable plan cannot define refund tiers.'
            + ' Either enable refunds or remove all tiers.',
    })
}

/** 409 `DUPLICATE_ID` — slug đã tồn tại. */
export function duplicateId(id: string): Response {
    return fail(409, 'DUPLICATE_ID', {
        vi: `Mã định danh "${id}" đã được dùng. Chọn một mã khác.`,
        en: `The id "${id}" is already taken. Choose a different one.`,
    })
}

/**
 * Postgres báo trùng khoá chính (`23505`).
 *
 * Cần vì kiểm-rồi-ghi có khe hở: hai admin bấm Lưu cùng lúc, cả hai đều thấy
 * slug trống, cả hai đều INSERT. Người sau phải nhận **409 đúng nghĩa**, không
 * phải 500 (BE4 — kiểm ở tầng ứng dụng là không đủ).
 */
export function isUniqueViolation(error: { code?: string } | null): boolean {
    return error?.code === '23505'
}
