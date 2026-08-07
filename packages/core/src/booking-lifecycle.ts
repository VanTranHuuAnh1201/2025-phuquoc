/**
 * Vòng đời đơn hàng — chuyển trạng thái, huỷ, hoàn tiền.
 *
 * Đồ thị trạng thái ở `.claude/rules/booking-domain.md` §B1. Chuyển trạng thái
 * CHỈ đi theo đồ thị đó, không nhảy cóc — nếu không, đơn sẽ rơi vào những tổ hợp
 * mà báo cáo doanh thu không giải thích được.
 */

import { daysBetween } from './pricing'
import type {
    ActivityLog,
    Booking,
    BookingStatus,
    CancellationRule,
    IncidentalCharge,
    LogAction,
    Role,
} from './booking-types'

// ============================================================ chuyển trạng thái

/** Trạng thái nào đi được sang trạng thái nào. */
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    pending_payment: ['confirmed', 'cancelled', 'expired'],
    confirmed: ['checked_in', 'cancelled', 'no_show'],
    checked_in: ['checked_out', 'cancelled'],
    checked_out: [],
    cancelled: [],
    no_show: [],
    expired: [],
}

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
    return TRANSITIONS[from]?.includes(to) ?? false
}

/** Các bước tiếp theo hợp lệ — CMS dùng để dựng nút bấm, không hard-code. */
export function nextStatuses(from: BookingStatus): BookingStatus[] {
    return TRANSITIONS[from] ?? []
}

/** Đơn đã đóng chưa. Đơn đóng thì không sửa được nữa. */
export function isTerminal(status: BookingStatus): boolean {
    return TRANSITIONS[status]?.length === 0
}

/** Đơn có đang chiếm phòng trong tồn kho không. */
export function holdsInventory(status: BookingStatus): boolean {
    return status === 'pending_payment' || status === 'confirmed' || status === 'checked_in'
}

// ================================================================ tính toán chốt bill trả phòng

export const DEFAULT_LATE_CHECKOUT_FEE = 200000

export interface SettlementInput {
    booking: Booking
    incidentals: IncidentalCharge[]
    lateCheckOutFee: number
}

export interface Settlement {
    /** Tiền phòng còn nợ: totalAmount - paidAmount */
    roomBalance: number
    /** Tổng phát sinh dịch vụ/minibar */
    incidentalTotal: number
    /** Phụ phí trả phòng muộn */
    lateCheckOutFee: number
    /** Tổng phải thu hiện tại */
    totalDue: number
}

export function computeSettlement(input: SettlementInput): Settlement {
    const roomBalance = Math.max(0, input.booking.totalAmount - input.booking.paidAmount)
    const incidentalTotal = input.incidentals.reduce((sum, item) => sum + Math.max(0, item.amount || 0), 0)
    const lateCheckOutFee = Math.max(0, input.lateCheckOutFee || 0)
    const totalDue = Math.max(0, roomBalance + incidentalTotal + lateCheckOutFee)

    return {
        roomBalance,
        incidentalTotal,
        lateCheckOutFee,
        totalDue,
    }
}

// ================================================================ chính sách huỷ

export interface RefundQuote {
    /** % được hoàn. */
    percent: number
    /** Số tiền hoàn, tính trên số đã thu. */
    amount: number
    /** Bậc chính sách đã áp. Không có = không hoàn đồng nào. */
    rule?: CancellationRule
    /** Còn bao nhiêu ngày tới ngày nhận phòng. Âm = đã quá ngày. */
    daysUntilCheckIn: number
}

/**
 * Khách huỷ hôm nay thì được hoàn bao nhiêu.
 *
 * Chọn bậc CAO NHẤT mà khoảng cách tới ngày nhận phòng còn thoả. Chính sách
 * `[{7,100},{3,50},{0,0}]` nghĩa là: huỷ trước ≥7 ngày hoàn 100%, trước ≥3 ngày
 * hoàn 50%, còn lại không hoàn.
 *
 * Con số này phải hiện ngay trên nút Huỷ trước khi khách bấm — không để khách
 * bấm rồi mới biết mất tiền.
 */
export function quoteRefund(
    booking: Booking,
    rules: CancellationRule[],
    today: string,
): RefundQuote {
    const daysUntilCheckIn = daysBetween(today, booking.checkIn)

    const rule = [...rules]
        .sort((a, b) => b.daysBeforeCheckIn - a.daysBeforeCheckIn)
        .find((r) => daysUntilCheckIn >= r.daysBeforeCheckIn)

    const percent = rule?.refundPercent ?? 0

    return {
        percent,
        amount: Math.round((booking.paidAmount * percent) / 100),
        rule,
        daysUntilCheckIn,
    }
}

// ================================================================== nhật ký

let logCounter = 0

export interface LogActor {
    id: string
    name: string
    role: Role
}

/**
 * Dựng một dòng nhật ký. Bất biến — tạo xong không sửa.
 *
 * `at` truyền vào chứ không lấy `Date.now()` bên trong, để hàm thuần và test
 * được (cùng lý do `validateBooking` nhận `today`).
 */
export function makeLog(params: {
    bookingId: string
    at: string
    actor: LogActor
    action: LogAction
    field?: string
    from?: string
    to?: string
    note?: string
}): ActivityLog {
    logCounter += 1
    return {
        id: `log-${params.at}-${logCounter}`,
        bookingId: params.bookingId,
        at: params.at,
        actorId: params.actor.id,
        actorName: params.actor.name,
        actorRole: params.actor.role,
        action: params.action,
        field: params.field,
        from: params.from,
        to: params.to,
        note: params.note,
    }
}

// ================================================================== mã đơn

/**
 * Mã đơn khách nhìn thấy: ĐH-2026-0042.
 *
 * Có năm trong mã để nhân viên nhìn là biết đơn cũ hay mới — đây là thứ lễ tân
 * đọc qua điện thoại hằng ngày, nên phải ngắn và đọc được thành lời.
 */
export function formatBookingCode(year: number, sequence: number): string {
    return `ĐH-${year}-${String(sequence).padStart(4, '0')}`
}

// ============================================================ kiểm tra hợp lệ

export type BookingErrorCode =
    | 'room-required'
    | 'dates-required'
    | 'checkout-before-checkin'
    | 'checkin-in-past'
    | 'guests-exceed-capacity'
    | 'guest-name-required'
    | 'guest-phone-required'
    | 'guest-email-invalid'
    | 'sold-out'
    | 'min-nights'

const PHONE_RE = /^0\d{9,10}$|^\+84\d{9,10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidPhone(phone: string): boolean {
    return PHONE_RE.test(phone.replace(/[\s.-]/g, ''))
}

export function isValidEmail(email: string): boolean {
    return EMAIL_RE.test(email)
}

/** Kiểm thông tin khách ở bước 3. Trả mã lỗi, theme tự tra chuỗi hiển thị. */
export function validateGuestInfo(guest: {
    fullName: string
    phone: string
    email: string
}): BookingErrorCode[] {
    const errors: BookingErrorCode[] = []
    if (!guest.fullName.trim()) errors.push('guest-name-required')
    if (!isValidPhone(guest.phone)) errors.push('guest-phone-required')
    if (guest.email && !isValidEmail(guest.email)) errors.push('guest-email-invalid')
    return errors
}
