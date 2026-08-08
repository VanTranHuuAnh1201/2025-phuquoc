// Số đêm dùng lại `countNights` của core, không tự tính lại ở đây (C10) —
// nó đã xử lý đúng chuỗi ngày `YYYY-MM-DD` không kèm giờ (C6).
import { countNights } from '@repo/core'
import type {
    Addon,
    AppliedPromotion,
    BookingGuest,
    BookingPriceLine,
    BookingStatus,
    Channel,
    ChildPolicy,
    GuestCount,
    I18nText,
    Inventory,
    Promotion,
    RatePlan,
    Room,
    RoomExtra,
    Season,
} from '@repo/core'

/**
 * Hàng thô đọc trực tiếp từ Supabase — key rắn (snake_case), giá trị chưa ép
 * kiểu. `SupabaseClient` chưa gắn generic từ DB schema nên `.select('*')` trả
 * `any`; các hàm `map*Row` dưới đây là ranh giới DUY NHẤT thu hẹp nó về type
 * domain, đúng pattern BE8 "SQL bám theo TypeScript".
 */
type DbRow = Record<string, unknown>

/**
 * Cột song ngữ trong Postgres là `jsonb` (`{vi, en}`) nhưng đôi khi seed cũ để
 * chuỗi đơn — hàm này thu hẹp `unknown` về `I18nText` mà không dùng `any`.
 * Giữ đúng hành vi cũ: object thì dùng nguyên, không phải object thì ép cùng
 * một chuỗi cho cả hai ngôn ngữ.
 */
function toI18nText(value: unknown, fallback = ''): I18nText {
    if (value !== null && typeof value === 'object') {
        const obj = value as Record<string, unknown>
        return {
            vi: typeof obj.vi === 'string' ? obj.vi : fallback,
            en: typeof obj.en === 'string' ? obj.en : fallback,
        }
    }
    const text = value != null ? String(value) : fallback
    return { vi: text, en: text }
}

/** `unknown` → mảng string, giữ hành vi cũ: không phải mảng thì trả rỗng. */
function toStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(String) : []
}

/** `unknown` → mảng `I18nText`, mỗi phần tử đi qua `toI18nText()`. */
function toI18nTextArray(value: unknown): I18nText[] {
    return Array.isArray(value) ? value.map((item) => toI18nText(item)) : []
}

/**
 * Maps a row from `room_types` table to Room and optional RoomExtra.
 */
export function mapRoomTypeRow(row: DbRow): { room: Room; roomExtra?: RoomExtra } {
    const basePrice = Number(row.base_price ?? row.price ?? 0)

    const room: Room = {
        id: String(row.id),
        name: toI18nText(row.name),
        desc: toI18nText(row.description),
        price: basePrice,
        guests: Number(row.max_occupancy ?? row.capacity ?? row.guests ?? 2),
        area: String(row.area_sqm ? `${row.area_sqm} m²` : (row.size ? `${row.size} m²` : '30 m²')),
        tags: toI18nTextArray(row.tags),
        images: toStringArray(row.images),
    }

    let roomExtra: RoomExtra | undefined = undefined
    if (row.extra_bed_price != null || row.max_extra_beds != null || row.max_occupancy != null) {
        roomExtra = {
            maxGuests: Number(row.max_occupancy ?? 4),
            defaultGuests: Number(row.capacity ?? row.guests ?? 2),
            extraBed: Number(row.extra_bed_price ?? 200000),
            bed: toI18nText(row.bed_type, '1 giường đôi'),
            view: toI18nText(row.view, 'Hướng biển'),
            long: toI18nText(row.description),
            amenities: toI18nTextArray(row.amenities),
            conditions: [],
        }
    }

    return { room, roomExtra }
}

/**
 * Maps a row from `inventory` table to Core Inventory type.
 */
export function mapInventoryRow(row: DbRow): Inventory {
    const rawDate = String(row.date ?? '')
    const dateStr = rawDate.includes('T') ? rawDate.split('T')[0]! : rawDate

    return {
        roomTypeId: String(row.room_type_id),
        date: dateStr,
        totalUnits: Number(row.total_units ?? 0),
        bookedUnits: Number(row.booked_units ?? 0),
        blockedUnits: Number(row.blocked_units ?? 0),
        priceOverride: row.price_override != null ? Number(row.price_override) : undefined,
        minNights: row.min_stay != null ? Number(row.min_stay) : (row.min_nights != null ? Number(row.min_nights) : undefined),
        closedToArrival: Boolean(row.closed_to_arrival ?? false),
        closedToDeparture: Boolean(row.closed_to_departure ?? false),
        version: Number(row.version ?? 1),
    }
}

/**
 * Maps a row from `seasons` table to Core Season type.
 */
export function mapSeasonRow(row: DbRow): Season {
    return {
        id: String(row.id),
        name: toI18nText(row.name),
        from: String(row.date_from ?? row.from ?? ''),
        to: String(row.date_to ?? row.to ?? ''),
        multiplier: Number(row.multiplier ?? 1),
        weekendMultiplier: row.weekend_multiplier != null ? Number(row.weekend_multiplier) : undefined,
        priority: Number(row.priority ?? 1),
    }
}

/**
 * Maps a row from `rate_plans` table to Core RatePlan type.
 */
export function mapRatePlanRow(row: DbRow): RatePlan {
    return {
        id: String(row.id),
        name: toI18nText(row.name),
        description: toI18nText(row.description),
        adjustPercent: Number(row.adjust_percent ?? 0),
        includesBreakfast: Boolean(row.includes_breakfast ?? true),
        refundable: Boolean(row.refundable ?? true),
        depositPercent: row.deposit_percent != null ? Number(row.deposit_percent) : 100,
        // `cancellation_rules` là jsonb đã đúng shape `CancellationRule[]` từ RPC/migration —
        // không có cách thu hẹp `unknown[]` an toàn hơn String()/Number() ở đây mà không
        // đổi hành vi, nên giữ nguyên qua `as` có chú thích rõ nguồn.
        cancellationRules: Array.isArray(row.cancellation_rules)
            ? (row.cancellation_rules as RatePlan['cancellationRules'])
            : [],
        roomTypeIds: toStringArray(row.room_type_ids),
        active: Boolean(row.active ?? true),
    }
}

/**
 * Maps a row from `addons` table to Core Addon type.
 */
export function mapAddonRow(row: DbRow): Addon {
    const nameSource = row.name ?? row.title
    return {
        id: String(row.id),
        name: toI18nText(nameSource),
        price: Number(row.price ?? 0),
        unit: toI18nText(row.unit),
    }
}

/**
 * Maps a row from `promotions` table to Core Promotion type.
 */
export function mapPromotionRow(row: DbRow): Promotion {
    const stayWindow = row.stay_window as { from?: string; to?: string } | undefined
    const bookWindow = row.book_window as { from?: string; to?: string } | undefined

    return {
        id: String(row.id),
        code: row.code ? String(row.code) : undefined,
        name: toI18nText(row.name),
        description: toI18nText(row.description),
        type: (row.type as Promotion['type']) ?? 'percent',
        value: Number(row.value ?? 0),
        conditions: {
            minNights: row.min_nights != null ? Number(row.min_nights) : undefined,
            minAmount: row.min_amount != null ? Number(row.min_amount) : undefined,
            stayFrom: stayWindow?.from ?? (row.stay_from as string | undefined),
            stayTo: stayWindow?.to ?? (row.stay_to as string | undefined),
            bookFrom: bookWindow?.from ?? (row.book_from as string | undefined),
            bookTo: bookWindow?.to ?? (row.book_to as string | undefined),
            roomTypeIds: Array.isArray(row.room_type_ids) ? toStringArray(row.room_type_ids) : undefined,
            ratePlanIds: Array.isArray(row.rate_plan_ids) ? toStringArray(row.rate_plan_ids) : undefined,
            daysBeforeCheckIn: row.lead_time_days != null ? Number(row.lead_time_days) : (row.days_before_check_in != null ? Number(row.days_before_check_in) : undefined),
            channels: Array.isArray(row.channels) ? (row.channels as Channel[]) : undefined,
        },
        stackable: Boolean(row.stackable ?? true),
        priority: Number(row.priority ?? 1),
        maxDiscount: row.max_discount != null ? Number(row.max_discount) : undefined,
        usageLimit: row.usage_limit != null ? Number(row.usage_limit) : undefined,
        perCustomerLimit: row.per_customer_limit != null ? Number(row.per_customer_limit) : undefined,
        usageCount: Number(row.usage_count ?? 0),
        active: Boolean(row.active ?? true),
    }
}

/**
 * Maps property settings row to ChildPolicy type.
 */
export function mapChildPolicy(settingRow?: DbRow): ChildPolicy {
    const policyRaw = settingRow?.child_policy
    if (!settingRow || policyRaw == null || typeof policyRaw !== 'object') {
        return {
            freeUnderAge: 6,
            halfPriceUntilAge: 12,
            childRate: 150000,
        }
    }
    const policy = policyRaw as Record<string, unknown>
    return {
        freeUnderAge: Number(policy.freeUnderAge ?? policy.free_under_age ?? 6),
        halfPriceUntilAge: Number(policy.halfPriceUntilAge ?? policy.half_price_until_age ?? policy.halfPriceUnderAge ?? 12),
        childRate: Number(policy.childRate ?? policy.child_rate ?? 150000),
    }
}

/**
 * Hình dạng thật của hàng `bookings` sau khi map, có thêm `assignedRoomUnitId`
 * so với `Booking` của core.
 *
 * BUG ĐÃ SỬA — bốn field từng bị bỏ map dù CỘT DB CÓ SẴN DỮ LIỆU:
 * `nights`, `priceLines`, `appliedPromotions`, `propertyId`. Chúng vốn không
 * gây lỗi vì `GET /api/bookings` xưa nay trả `[]` (RLS chặn nhân viên, xem
 * `route.ts`), nên store luôn dùng seed local — nơi các field đó có đủ. Ngay
 * khi API trả dữ liệu thật, `OrderDetailPanel.tsx:244` gọi
 * `booking.priceLines.map()` và vỡ cả drawer bằng
 * `TypeError: Cannot read properties of undefined`.
 *
 * Rút ra: hai lỗi che nhau — sửa lỗi RLS mới làm lỗi này lộ ra.
 */
export interface MappedBookingRow {
    id: string
    code: string
    propertyId: string
    status: BookingStatus
    checkIn: string
    checkOut: string
    nights: number
    roomTypeId: string
    ratePlanId?: string
    guests: GuestCount
    addons: Record<string, number>
    guest: BookingGuest
    channel: Channel
    createdAt: string
    subtotal: number
    discountTotal: number
    totalAmount: number
    paidAmount: number
    depositAmount: number
    priceLines: BookingPriceLine[]
    appliedPromotions: AppliedPromotion[]
    holdExpiresAt?: string
    assignedRoomUnitId?: string
    customerId?: string
}

/**
 * Maps a row from `bookings` table to the shape các route cần (§MappedBookingRow).
 */
export function mapBookingRow(row: DbRow): MappedBookingRow {
    const checkIn = String(row.check_in)
    const checkOut = String(row.check_out)

    return {
        id: String(row.id),
        code: String(row.code),
        propertyId: String(row.property_id ?? 'nam-du-hill'),
        status: String(row.status) as BookingStatus,
        checkIn,
        checkOut,
        // Cột `nights` luôn được `create_booking_atomic` ghi, nhưng tính lại từ
        // hai đầu ngày làm giá trị dự phòng cho hàng cũ/nhập tay: số đêm sai
        // là mọi phép nhân tiền trên UI sai theo.
        nights: Number(row.nights ?? 0) || countNights(checkIn, checkOut),
        roomTypeId: String(row.room_type_id),
        ratePlanId: row.rate_plan_id ? String(row.rate_plan_id) : undefined,
        guests: {
            adults: Number(row.num_adults ?? 1),
            children: Array.isArray(row.child_ages) ? row.child_ages.map(Number) : [],
        },
        addons: typeof row.addons === 'object' && row.addons !== null ? (row.addons as Record<string, number>) : {},
        guest: {
            fullName: String(row.guest_full_name ?? ''),
            phone: String(row.guest_phone ?? ''),
            email: String(row.guest_email ?? ''),
            idNumber: row.guest_id_number ? String(row.guest_id_number) : undefined,
            estimatedArrivalTime: row.guest_estimated_arrival_time ? String(row.guest_estimated_arrival_time) : undefined,
            specialRequests: row.guest_special_requests ? String(row.guest_special_requests) : undefined,
            taxCode: row.guest_tax_code ? String(row.guest_tax_code) : undefined,
            companyName: row.guest_company_name ? String(row.guest_company_name) : undefined,
        },
        channel: String(row.channel ?? 'web') as Channel,
        createdAt: String(row.created_at ?? ''),
        subtotal: Number(row.subtotal ?? 0),
        discountTotal: Number(row.discount_total ?? 0),
        totalAmount: Number(row.total_amount ?? 0),
        paidAmount: Number(row.paid_amount ?? 0),
        depositAmount: Number(row.deposit_amount ?? 0),
        // `?? []` KHÔNG phải phòng thủ thừa: UI gọi thẳng `.map()` lên hai
        // mảng này (`OrderDetailPanel.tsx`), nên `undefined` làm vỡ cả drawer
        // thay vì hiện bảng giá rỗng.
        priceLines: Array.isArray(row.price_lines) ? (row.price_lines as BookingPriceLine[]) : [],
        appliedPromotions: Array.isArray(row.applied_promotions)
            ? (row.applied_promotions as AppliedPromotion[])
            : [],
        holdExpiresAt: row.hold_expires_at ? String(row.hold_expires_at) : undefined,
        assignedRoomUnitId: row.assigned_room_unit_id ? String(row.assigned_room_unit_id) : undefined,
        customerId: row.customer_id ? String(row.customer_id) : undefined,
    }
}
