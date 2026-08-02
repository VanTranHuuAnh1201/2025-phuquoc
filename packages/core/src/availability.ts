/**
 * Tra cứu phòng trống và báo giá trọn gói.
 *
 * Đây là cửa vào duy nhất cho câu hỏi "còn phòng không, bao nhiêu tiền".
 * Client và CMS gọi chung hàm này nên không bao giờ lệch số (luật R8).
 */

import {
    calculateNightlyPrices,
    calculateChildCharge,
    countExtraBeds,
    countNights,
    listStayDates,
    sumNightly,
    totalGuests,
} from './pricing'
import { applyPromotions } from './promotion'
import type { PromotionContext, PromotionResult } from './promotion'
import type {
    AvailabilityResult,
    BookingPriceLine,
    Channel,
    ChildPolicy,
    GuestCount,
    Inventory,
    Promotion,
    RatePlan,
    Season,
} from './booking-types'
import type { Addon, Room, RoomExtra } from './types'

/** Khoá tra cứu tồn kho: một hạng phòng trong một ngày. */
export function inventoryKey(roomTypeId: string, date: string): string {
    return `${roomTypeId}|${date}`
}

/** Số phòng còn bán được. */
export function availableUnits(inv: Inventory): number {
    return Math.max(0, inv.totalUnits - inv.bookedUnits - inv.blockedUnits)
}

export interface AvailabilityInput {
    room: Room
    roomExtra?: RoomExtra
    checkIn: string
    checkOut: string
    guests: GuestCount
    seasons: Season[]
    /** Toàn bộ tồn kho, khoá theo `inventoryKey()`. */
    inventory: Record<string, Inventory>
    ratePlan?: RatePlan
}

/**
 * Hạng phòng này có đặt được không, và giá bao nhiêu.
 *
 * Số phòng còn lại lấy theo ĐÊM KHAN HIẾM NHẤT: khách ở 3 đêm mà đêm giữa chỉ
 * còn 1 phòng thì cả kỳ chỉ đặt được 1 phòng.
 */
export function checkAvailability(input: AvailabilityInput): AvailabilityResult {
    const { room, roomExtra, checkIn, checkOut, guests, seasons, inventory, ratePlan } = input

    const nights = countNights(checkIn, checkOut)
    const dates = listStayDates(checkIn, checkOut)

    const empty: AvailabilityResult = {
        roomTypeId: room.id,
        available: false,
        availableUnits: 0,
        nightlyPrices: [],
        roomTotal: 0,
    }

    if (nights === 0) return empty

    // sức chứa
    const capacity = roomExtra?.maxGuests ?? room.guests
    if (totalGuests(guests) > capacity) {
        return { ...empty, blockedReason: 'capacity-exceeded' }
    }

    // tồn kho từng đêm
    const byDate: Record<string, Inventory> = {}
    let minUnits = Number.POSITIVE_INFINITY

    for (const date of dates) {
        const inv = inventory[inventoryKey(room.id, date)]
        if (inv) byDate[date] = inv
        // Không có bản ghi tồn kho = chưa ai đụng tới ngày đó = còn nguyên phòng.
        minUnits = Math.min(minUnits, inv ? availableUnits(inv) : room.guests > 0 ? 1 : 0)
    }

    const nightlyPrices = calculateNightlyPrices(
        checkIn,
        checkOut,
        room.price,
        seasons,
        byDate,
        ratePlan,
    )
    const roomTotal = sumNightly(nightlyPrices)

    if (minUnits <= 0) {
        return { ...empty, nightlyPrices, roomTotal, blockedReason: 'sold-out' }
    }

    // hạn chế nhận/trả phòng và số đêm tối thiểu — tra ở ĐÊM ĐẦU
    const firstDate = dates[0]
    const first = firstDate ? byDate[firstDate] : undefined
    if (first?.closedToArrival) {
        return {
            ...empty,
            nightlyPrices,
            roomTotal,
            availableUnits: minUnits,
            blockedReason: 'closed-to-arrival',
        }
    }
    if (first?.minNights !== undefined && nights < first.minNights) {
        return {
            ...empty,
            nightlyPrices,
            roomTotal,
            availableUnits: minUnits,
            blockedReason: 'min-nights',
            requiredMinNights: first.minNights,
        }
    }

    // hạn chế trả phòng tra ở ĐÚNG NGÀY TRẢ, không phải đêm cuối
    const departure = inventory[inventoryKey(room.id, checkOut)]
    if (departure?.closedToDeparture) {
        return {
            ...empty,
            nightlyPrices,
            roomTotal,
            availableUnits: minUnits,
            blockedReason: 'closed-to-departure',
        }
    }

    return {
        roomTypeId: room.id,
        available: true,
        availableUnits: minUnits,
        nightlyPrices,
        roomTotal,
    }
}

// ============================================================== báo giá trọn gói

export interface QuoteInput extends AvailabilityInput {
    /** id addon → số lượng. */
    addons: Record<string, number>
    addonCatalog: Addon[]
    childPolicy: ChildPolicy
    promotions: Promotion[]
    channel: Channel
    /** Hôm nay, YYYY-MM-DD. Truyền vào để hàm thuần. */
    today: string
    enteredCode?: string
    customerUsage?: Record<string, number>
}

export interface Quote {
    availability: AvailabilityResult
    nights: number
    lines: BookingPriceLine[]
    /** Trước khuyến mãi. */
    subtotal: number
    promotion: PromotionResult
    discountTotal: number
    /** subtotal - discountTotal. */
    totalAmount: number
    depositAmount: number
    balanceDue: number
}

/**
 * Báo giá đầy đủ: tiền phòng + giường phụ + trẻ em + dịch vụ − khuyến mãi.
 *
 * Kết quả của hàm này chính là bảng breakdown mà cả khách lẫn admin nhìn thấy.
 * Không nơi nào được tính lại (luật R8).
 */
export function buildQuote(input: QuoteInput): Quote {
    const availability = checkAvailability(input)
    const nights = countNights(input.checkIn, input.checkOut)

    const lines: BookingPriceLine[] = []

    // ---- tiền phòng ----
    if (availability.roomTotal > 0) {
        lines.push({
            kind: 'room',
            refId: input.room.id,
            quantity: nights,
            // Giá trung bình mỗi đêm, chỉ để hiển thị — tổng mới là con số thật.
            unitPrice: Math.round(availability.roomTotal / Math.max(1, nights)),
            total: availability.roomTotal,
        })
    }

    // ---- giường phụ ----
    const extraBeds = countExtraBeds(input.guests, input.room, input.roomExtra)
    if (extraBeds > 0 && input.roomExtra?.extraBed) {
        lines.push({
            kind: 'extra-bed',
            refId: input.room.id,
            quantity: extraBeds * nights,
            unitPrice: input.roomExtra.extraBed,
            total: input.roomExtra.extraBed * extraBeds * nights,
        })
    }

    // ---- trẻ em ----
    const child = calculateChildCharge(input.guests, input.childPolicy, nights)
    if (child.total > 0) {
        lines.push({
            kind: 'child',
            refId: input.room.id,
            quantity: child.count * nights,
            unitPrice: input.childPolicy.childRate,
            total: child.total,
        })
    }

    // ---- dịch vụ thêm ----
    for (const [addonId, quantity] of Object.entries(input.addons)) {
        if (quantity <= 0) continue
        const addon = input.addonCatalog.find((a) => a.id === addonId)
        if (!addon || addon.price === 0) continue
        lines.push({
            kind: 'addon',
            refId: addon.id,
            quantity,
            unitPrice: addon.price,
            total: addon.price * quantity,
        })
    }

    const subtotal = lines.reduce((sum, l) => sum + l.total, 0)

    // ---- khuyến mãi ----
    const ctx: PromotionContext = {
        roomTypeId: input.room.id,
        ratePlanId: input.ratePlan?.id ?? '',
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        nights,
        subtotal,
        nightlyPrices: availability.nightlyPrices,
        channel: input.channel,
        today: input.today,
        enteredCode: input.enteredCode,
        customerUsage: input.customerUsage,
    }
    const promotion = applyPromotions(input.promotions, ctx)

    const totalAmount = promotion.finalAmount
    const depositPercent = input.ratePlan?.depositPercent ?? 100
    const depositAmount = Math.round((totalAmount * depositPercent) / 100)

    return {
        availability,
        nights,
        lines,
        subtotal,
        promotion,
        discountTotal: promotion.discountTotal,
        totalAmount,
        depositAmount,
        balanceDue: totalAmount - depositAmount,
    }
}
