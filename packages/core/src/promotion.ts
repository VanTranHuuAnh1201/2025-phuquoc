/**
 * Engine khuyến mãi.
 *
 * Khuyến mãi CAN THIỆP vào giá tại thời điểm áp — không sửa `basePrice`, không
 * sửa `priceOverride`. Tắt khuyến mãi là giá trở về nguyên trạng.
 *
 * Thuật toán đầy đủ và ví dụ số: `.claude/rules/booking-domain.md` §B4.
 * Tóm tắt:
 *   ① lọc theo điều kiện + hạn mức
 *   ② sắp theo priority tăng dần
 *   ③ nếu có KM độc quyền (stackable=false) → chỉ giữ cái priority nhỏ nhất
 *   ④ áp lần lượt, MỖI LẦN TÍNH TRÊN SỐ TIỀN CÒN LẠI (cộng dồn nhân)
 *   ⑤ cắt theo maxDiscount
 *   ⑥ tổng giảm không bao giờ vượt subtotal
 */

import { daysBetween, listStayDates, weekdayOf } from './pricing'
import type {
    AppliedPromotion,
    Channel,
    NightlyPrice,
    Promotion,
} from './booking-types'

/** Bối cảnh của một đơn, để quyết định khuyến mãi nào áp được. */
export interface PromotionContext {
    roomTypeId: string
    ratePlanId: string
    checkIn: string
    checkOut: string
    nights: number
    /** Tiền phòng + giường phụ + dịch vụ, trước mọi khuyến mãi. */
    subtotal: number
    /** Giá từng đêm — cần cho `nth-night-free`. */
    nightlyPrices: NightlyPrice[]
    channel: Channel
    /** Hôm nay, YYYY-MM-DD. Truyền vào để hàm thuần và test được. */
    today: string
    /** Mã khách nhập. Khuyến mãi có `code` chỉ áp khi khớp mã này. */
    enteredCode?: string
    /** Số lần khách này đã dùng từng khuyến mãi — để kiểm `perCustomerLimit`. */
    customerUsage?: Record<string, number>
}

/** Vì sao một khuyến mãi không áp được. Dùng cho màn hình admin. */
export type PromotionRejectReason =
    | 'inactive'
    | 'code-required'
    | 'code-mismatch'
    | 'stay-window'
    | 'book-window'
    | 'room-type'
    | 'rate-plan'
    | 'min-nights'
    | 'max-nights'
    | 'min-amount'
    | 'weekday'
    | 'lead-time'
    | 'channel'
    | 'usage-limit'
    | 'per-customer-limit'
    | 'superseded-by-exclusive'

export interface PromotionEvaluation {
    promotion: Promotion
    eligible: boolean
    reason?: PromotionRejectReason
}

// ================================================================= ① lọc

/**
 * Một khuyến mãi có thoả mọi điều kiện không.
 *
 * Trả về mã lý do đầu tiên bị vi phạm — màn hình admin dùng nó để nói rõ vì sao
 * một khuyến mãi không xuất hiện, thay vì để admin tự đoán.
 */
export function evaluatePromotion(
    promotion: Promotion,
    ctx: PromotionContext,
): PromotionEvaluation {
    const reject = (reason: PromotionRejectReason): PromotionEvaluation => ({
        promotion,
        eligible: false,
        reason,
    })

    if (!promotion.active) return reject('inactive')

    // mã: có code thì khách phải nhập đúng
    if (promotion.code) {
        if (!ctx.enteredCode) return reject('code-required')
        if (ctx.enteredCode.trim().toUpperCase() !== promotion.code.toUpperCase()) {
            return reject('code-mismatch')
        }
    }

    // hạn mức
    if (promotion.usageLimit !== undefined && promotion.usageCount >= promotion.usageLimit) {
        return reject('usage-limit')
    }
    if (promotion.perCustomerLimit !== undefined) {
        const used = ctx.customerUsage?.[promotion.id] ?? 0
        if (used >= promotion.perCustomerLimit) return reject('per-customer-limit')
    }

    const c = promotion.conditions

    // khoảng ngày Ở — mọi đêm phải nằm trong cửa sổ
    if (c.stayFrom && ctx.checkIn < c.stayFrom) return reject('stay-window')
    if (c.stayTo && ctx.checkOut > c.stayTo) return reject('stay-window')

    // khoảng ngày ĐẶT
    if (c.bookFrom && ctx.today < c.bookFrom) return reject('book-window')
    if (c.bookTo && ctx.today > c.bookTo) return reject('book-window')

    if (c.roomTypeIds?.length && !c.roomTypeIds.includes(ctx.roomTypeId)) {
        return reject('room-type')
    }
    if (c.ratePlanIds?.length && !c.ratePlanIds.includes(ctx.ratePlanId)) {
        return reject('rate-plan')
    }

    if (c.minNights !== undefined && ctx.nights < c.minNights) return reject('min-nights')
    if (c.maxNights !== undefined && ctx.nights > c.maxNights) return reject('max-nights')
    if (c.minAmount !== undefined && ctx.subtotal < c.minAmount) return reject('min-amount')

    // thứ trong tuần: MỌI đêm phải rơi vào các thứ được khai
    if (c.weekdays?.length) {
        const dates = listStayDates(ctx.checkIn, ctx.checkOut)
        const allMatch = dates.every((d) => c.weekdays!.includes(weekdayOf(d)))
        if (!allMatch) return reject('weekday')
    }

    // đặt sớm / đặt sát ngày
    if (c.daysBeforeCheckIn !== undefined) {
        const lead = daysBetween(ctx.today, ctx.checkIn)
        if (promotion.type === 'early-bird' && lead < c.daysBeforeCheckIn) {
            return reject('lead-time')
        }
        if (promotion.type === 'last-minute' && lead > c.daysBeforeCheckIn) {
            return reject('lead-time')
        }
    }

    if (c.channels?.length && !c.channels.includes(ctx.channel)) return reject('channel')

    return { promotion, eligible: true }
}

// ============================================================ ② số tiền giảm

/**
 * Số tiền một khuyến mãi giảm, tính trên `amount` là số tiền CÒN LẠI sau các
 * khuyến mãi áp trước đó.
 */
function discountOf(promotion: Promotion, amount: number, ctx: PromotionContext): number {
    switch (promotion.type) {
        case 'percent':
        case 'early-bird':
        case 'last-minute':
            return (amount * promotion.value) / 100

        case 'fixed':
            return Math.min(promotion.value, amount)

        case 'nth-night-free': {
            // Tặng đêm thứ N. Ở nhiều hơn N đêm thì tặng đêm RẺ NHẤT trong kỳ —
            // đây là cách các resort làm, để không bị tặng đúng đêm đắt nhất.
            const n = promotion.value
            if (ctx.nights < n) return 0
            const cheapest = Math.min(...ctx.nightlyPrices.map((p) => p.price))
            return Math.min(cheapest, amount)
        }

        case 'long-stay': {
            // Bậc thang: lấy bậc cao nhất mà số đêm còn thoả.
            const tiers = [...(promotion.conditions.tiers ?? [])].sort(
                (a, b) => b.minNights - a.minNights,
            )
            const tier = tiers.find((t) => ctx.nights >= t.minNights)
            return tier ? (amount * tier.percent) / 100 : 0
        }

        case 'free-addon':
            // Giá trị addon được tặng do phía gọi truyền vào qua `value`.
            return Math.min(promotion.value, amount)
    }
}

// ============================================================ ③ áp toàn bộ

export interface PromotionResult {
    applied: AppliedPromotion[]
    /** Tổng giảm. Không bao giờ vượt `subtotal`. */
    discountTotal: number
    /** subtotal - discountTotal. */
    finalAmount: number
    /** Mọi khuyến mãi đã xét, kèm lý do bị loại. Dùng cho màn hình admin. */
    evaluations: PromotionEvaluation[]
}

/**
 * Áp toàn bộ khuyến mãi đủ điều kiện lên `ctx.subtotal`.
 *
 * Bước ④ là chỗ hay sai nhất: mỗi khuyến mãi tính trên SỐ TIỀN CÒN LẠI, không
 * phải cộng % lại rồi trừ một lần. Đơn 1.000.000đ với hai KM 10% và 20%:
 *   ❌ cộng %:      1.000.000 × 30%           = giảm 300.000
 *   ✅ cộng dồn:    ×0.9 = 900.000, ×0.8 = 720.000 → giảm 280.000
 * Cách ✅ khớp cách khách hiểu ("giảm thêm 20% trên giá đã giảm") và không bao
 * giờ ra mức giảm quá 100%.
 */
export function applyPromotions(
    promotions: Promotion[],
    ctx: PromotionContext,
): PromotionResult {
    // ① lọc
    const evaluations = promotions.map((p) => evaluatePromotion(p, ctx))
    let eligible = evaluations.filter((e) => e.eligible).map((e) => e.promotion)

    // ② sắp theo priority tăng dần
    eligible = [...eligible].sort((a, b) => a.priority - b.priority)

    // ③ khuyến mãi độc quyền: chỉ giữ cái priority nhỏ nhất, bỏ hết phần còn lại
    const exclusive = eligible.find((p) => !p.stackable)
    if (exclusive) {
        for (const ev of evaluations) {
            if (ev.eligible && ev.promotion.id !== exclusive.id) {
                ev.eligible = false
                ev.reason = 'superseded-by-exclusive'
            }
        }
        eligible = [exclusive]
    }

    // ④⑤ áp lần lượt trên số tiền còn lại
    const applied: AppliedPromotion[] = []
    let remaining = ctx.subtotal

    for (const promotion of eligible) {
        if (remaining <= 0) break

        let discount = discountOf(promotion, remaining, ctx)

        // ⑤ trần giảm giá
        const cappedByMax =
            promotion.maxDiscount !== undefined && discount > promotion.maxDiscount
        if (cappedByMax) discount = promotion.maxDiscount!

        // ⑥ không bao giờ giảm quá số tiền còn lại
        discount = Math.round(Math.min(discount, remaining))
        if (discount <= 0) continue

        remaining -= discount
        applied.push({
            promotionId: promotion.id,
            code: promotion.code,
            name: promotion.name,
            type: promotion.type,
            discount,
            remainingAfter: remaining,
            cappedByMax,
        })
    }

    const discountTotal = applied.reduce((sum, a) => sum + a.discount, 0)

    return {
        applied,
        discountTotal,
        finalAmount: ctx.subtotal - discountTotal,
        evaluations,
    }
}

// ==================================================== phát hiện xung đột (admin)

export interface PromotionConflict {
    a: string
    b: string
    kind: 'both-exclusive' | 'same-priority'
    /** id của khuyến mãi sẽ thắng. Không có với 'same-priority'. */
    winnerId?: string
}

/**
 * Tìm các cặp khuyến mãi xung đột, để màn hình admin cảnh báo trước.
 *
 * Hai loại đáng cảnh báo:
 * - cả hai đều độc quyền và cùng phủ một khoảng ngày + hạng phòng → chỉ một cái
 *   được áp, admin cần biết cái nào thắng và vì sao
 * - trùng `priority` → thứ tự áp không xác định, kết quả có thể lệch
 */
export function findPromotionConflicts(promotions: Promotion[]): PromotionConflict[] {
    const active = promotions.filter((p) => p.active)
    const conflicts: PromotionConflict[] = []

    for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
            const a = active[i]
            const b = active[j]
            if (!a || !b || !overlaps(a, b)) continue

            if (!a.stackable && !b.stackable) {
                conflicts.push({
                    a: a.id,
                    b: b.id,
                    kind: 'both-exclusive',
                    winnerId: a.priority <= b.priority ? a.id : b.id,
                })
            } else if (a.priority === b.priority) {
                conflicts.push({ a: a.id, b: b.id, kind: 'same-priority' })
            }
        }
    }

    return conflicts
}

/** Hai khuyến mãi có cùng phủ một khoảng ngày và một hạng phòng không. */
function overlaps(a: Promotion, b: Promotion): boolean {
    const ac = a.conditions
    const bc = b.conditions

    // khoảng ngày ở: không khai = phủ mọi ngày
    const aFrom = ac.stayFrom ?? '0000-01-01'
    const aTo = ac.stayTo ?? '9999-12-31'
    const bFrom = bc.stayFrom ?? '0000-01-01'
    const bTo = bc.stayTo ?? '9999-12-31'
    if (aTo < bFrom || bTo < aFrom) return false

    // hạng phòng: rỗng = phủ mọi hạng
    const aRooms = ac.roomTypeIds ?? []
    const bRooms = bc.roomTypeIds ?? []
    if (aRooms.length && bRooms.length) {
        return aRooms.some((id) => bRooms.includes(id))
    }

    return true
}
