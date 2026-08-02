/**
 * Nghiệp vụ đặt phòng — tính giá, kiểm tra hợp lệ.
 *
 * Đây là nơi DUY NHẤT chứa logic giá. Mọi theme gọi vào đây, nhờ vậy N giao
 * diện luôn hiện cùng một con số (luật R8). Theme không được tự tính lại.
 */

import type { Addon, Room, RoomExtra } from './types'

export interface BookingSelection {
    roomId: string
    /** Ngày nhận phòng, dạng YYYY-MM-DD. */
    checkIn: string
    /** Ngày trả phòng, dạng YYYY-MM-DD. */
    checkOut: string
    guests: number
    /** id của addon → số lượng. */
    addons: Record<string, number>
}

export interface PriceLine {
    /** Khoá để theme tra chuỗi hiển thị; core không chứa chuỗi giao diện. */
    kind: 'room' | 'extra-bed' | 'addon'
    /** id của phòng hoặc addon tương ứng. */
    refId: string
    quantity: number
    unitPrice: number
    total: number
}

export interface PriceBreakdown {
    nights: number
    lines: PriceLine[]
    total: number
}

const MS_PER_NIGHT = 86_400_000

/** Số đêm giữa hai mốc. Trả 0 nếu ngày không hợp lệ hoặc trả trước khi nhận. */
export function countNights(checkIn: string, checkOut: string): number {
    const start = Date.parse(`${checkIn}T00:00:00Z`)
    const end = Date.parse(`${checkOut}T00:00:00Z`)
    if (Number.isNaN(start) || Number.isNaN(end)) return 0
    const nights = Math.round((end - start) / MS_PER_NIGHT)
    return nights > 0 ? nights : 0
}

/** Số giường phụ cần thêm khi vượt số khách tiêu chuẩn. */
export function countExtraBeds(
    guests: number,
    room: Room,
    extra?: RoomExtra,
): number {
    const capacity = extra?.maxGuests ?? room.guests
    const standard = room.guests
    const billable = Math.min(guests, capacity)
    return billable > standard ? billable - standard : 0
}

/**
 * Tính giá trọn gói: tiền phòng + giường phụ + dịch vụ cộng thêm.
 *
 * Quy ước đơn vị addon:
 * - "khách / đêm" → nhân số khách và số đêm (giường phụ)
 * - còn lại       → nhân đúng số lượng người dùng chọn
 */
export function calculatePrice(
    selection: BookingSelection,
    rooms: Room[],
    roomExtras: Record<string, RoomExtra>,
    addons: Addon[],
): PriceBreakdown {
    const room = rooms.find((r) => r.id === selection.roomId)
    const nights = countNights(selection.checkIn, selection.checkOut)

    if (!room || nights === 0) {
        return { nights, lines: [], total: 0 }
    }

    const lines: PriceLine[] = []

    lines.push({
        kind: 'room',
        refId: room.id,
        quantity: nights,
        unitPrice: room.price,
        total: room.price * nights,
    })

    const extra = roomExtras[room.id]
    const extraBeds = countExtraBeds(selection.guests, room, extra)
    if (extraBeds > 0 && extra?.extraBed) {
        lines.push({
            kind: 'extra-bed',
            refId: room.id,
            quantity: extraBeds * nights,
            unitPrice: extra.extraBed,
            total: extra.extraBed * extraBeds * nights,
        })
    }

    for (const [addonId, quantity] of Object.entries(selection.addons)) {
        if (quantity <= 0) continue
        const addon = addons.find((a) => a.id === addonId)
        if (!addon || addon.price === 0) continue

        lines.push({
            kind: 'addon',
            refId: addon.id,
            quantity,
            unitPrice: addon.price,
            total: addon.price * quantity,
        })
    }

    return {
        nights,
        lines,
        total: lines.reduce((sum, line) => sum + line.total, 0),
    }
}

// ------------------------------------------------------------------ kiểm tra

/** Mã lỗi — theme tự tra ra chuỗi hiển thị theo ngôn ngữ đang chọn. */
export type BookingErrorCode =
    | 'room-required'
    | 'dates-required'
    | 'checkout-before-checkin'
    | 'checkin-in-past'
    | 'guests-exceed-capacity'

export function validateBooking(
    selection: BookingSelection,
    rooms: Room[],
    roomExtras: Record<string, RoomExtra>,
    /** Hôm nay dạng YYYY-MM-DD — truyền vào để hàm thuần và test được. */
    today: string,
): BookingErrorCode[] {
    const errors: BookingErrorCode[] = []

    const room = rooms.find((r) => r.id === selection.roomId)
    if (!room) errors.push('room-required')

    if (!selection.checkIn || !selection.checkOut) {
        errors.push('dates-required')
        return errors
    }

    if (countNights(selection.checkIn, selection.checkOut) === 0) {
        errors.push('checkout-before-checkin')
    }

    if (selection.checkIn < today) {
        errors.push('checkin-in-past')
    }

    if (room) {
        const capacity = roomExtras[room.id]?.maxGuests ?? room.guests
        if (selection.guests > capacity) {
            errors.push('guests-exceed-capacity')
        }
    }

    return errors
}
