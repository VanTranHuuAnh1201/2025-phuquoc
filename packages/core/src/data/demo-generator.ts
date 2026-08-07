/**
 * Sinh dữ liệu demo: tồn kho 90 ngày + ~30 đơn hàng rải đều.
 *
 * Vì sao cần: lịch tồn kho và bảng đơn hàng của CMS chỉ có ý nghĩa khi có dữ
 * liệu để nhìn. Bảng rỗng thì không kiểm chứng được gì.
 *
 * Sinh bằng PRNG có hạt giống cố định, KHÔNG dùng `Math.random()` — hai lần
 * chạy phải ra cùng kết quả, nếu không thì server và client render lệch nhau
 * (hydration mismatch) và không ai debug được.
 */

import { addDays, countNights, isWeekend, listStayDates } from '../pricing'
import { inventoryKey } from '../availability'
import { formatBookingCode } from '../booking-lifecycle'
import { seasons, ratePlans, childPolicy, promotions } from './operations.seed'
import { buildQuote } from '../availability'
import type {
    ActivityLog,
    Booking,
    BookingStatus,
    Customer,
    Inventory,
    Notification,
    RoomUnit,
} from '../booking-types'
import type { Addon, Room, RoomExtra } from '../types'

// ============================================================ số ngẫu nhiên ổn định

/** PRNG mulberry32 — nhỏ, nhanh, cùng hạt giống cho cùng chuỗi số. */
function makeRng(seed: number) {
    let a = seed
    return () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function pick<T>(rng: () => number, items: T[]): T {
    return items[Math.floor(rng() * items.length)] as T
}

function pickInt(rng: () => number, min: number, max: number): number {
    return min + Math.floor(rng() * (max - min + 1))
}

// ==================================================================== danh sách tên

const FIRST_NAMES = [
    'Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Hoàng Thu',
    'Vũ Đức', 'Đặng Kim', 'Bùi Thanh', 'Đỗ Quang', 'Ngô Bảo',
]
const LAST_NAMES = ['An', 'Bình', 'Cường', 'Dũng', 'Hà', 'Khánh', 'Linh', 'Minh', 'Ngọc', 'Phương', 'Quân', 'Trang']
const FOREIGN_NAMES = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Wilson', 'David Park']

const SPECIAL_REQUESTS = [
    'Kỷ niệm ngày cưới, xin trang trí phòng',
    'Xin phòng tầng cao, yên tĩnh',
    'Có trẻ nhỏ, xin thêm cũi',
    'Ăn chay, báo trước nhà bếp',
    'Đến bằng chuyến tàu chiều, xin giữ phòng',
]

const CHECKOUT_COMMENTS = [
    'Khách lịch sự, phòng sạch sẽ khi trả.',
    'Khách trả phòng muộn 1 tiếng, đã thu phụ phí.',
    'Có dùng minibar, đã thanh toán đủ.',
    'Khách hài lòng, hẹn quay lại mùa sau.',
    'Vỡ một ly thuỷ tinh, đã tính phí.',
]

// ================================================================== tồn kho

export interface InventoryOptions {
    rooms: Room[]
    unitCounts: Record<string, number>
    /** Ngày bắt đầu, YYYY-MM-DD. */
    startDate: string
    days: number
}

/**
 * Dựng tồn kho trống cho toàn bộ hạng phòng trong `days` ngày tới.
 *
 * Có rắc thêm vài ràng buộc thực tế: cuối tuần cao điểm hè yêu cầu tối thiểu 2
 * đêm, và một ít phòng bị khoá bảo trì — để lịch tồn kho của CMS không phải là
 * một tấm lưới đều tăm tắp vô nghĩa.
 */
export function buildInventory(options: InventoryOptions): Record<string, Inventory> {
    const { rooms, unitCounts, startDate, days } = options
    const rng = makeRng(20260802)
    const result: Record<string, Inventory> = {}

    for (const room of rooms) {
        const totalUnits = unitCounts[room.id] ?? 6

        for (let i = 0; i < days; i++) {
            const date = addDays(startDate, i)
            const weekend = isWeekend(date)

            // vài phòng khoá bảo trì rải rác
            const blocked = rng() < 0.04 ? pickInt(rng, 1, 2) : 0

            result[inventoryKey(room.id, date)] = {
                date,
                roomTypeId: room.id,
                totalUnits,
                bookedUnits: 0, // các đơn sinh sau sẽ cộng vào
                blockedUnits: blocked,
                minNights: weekend && date >= '2026-06-01' && date <= '2026-08-31' ? 2 : undefined,
                version: 1,
            }
        }
    }

    return result
}

// ================================================================== đơn hàng

export interface DemoDataOptions {
    rooms: Room[]
    roomExtras: Record<string, RoomExtra>
    addons: Addon[]
    roomUnits: RoomUnit[]
    /** Hôm nay, YYYY-MM-DD. Truyền vào để kết quả ổn định. */
    today: string
    /** Số đơn cần sinh. */
    count?: number
}

export interface DemoData {
    bookings: Booking[]
    logs: ActivityLog[]
    customers: Customer[]
    notifications: Notification[]
    inventory: Record<string, Inventory>
    roomUnits: RoomUnit[]
}

/**
 * Sinh trọn bộ dữ liệu demo.
 *
 * Đơn rải từ 45 ngày trước tới 60 ngày sau hôm nay, để CMS có đủ cả đơn đã
 * hoàn thành, đơn đang ở, và đơn sắp tới. Trạng thái được suy ra từ vị trí của
 * đơn so với hôm nay chứ không random — nếu không sẽ có đơn "đã trả phòng" nằm
 * ở tương lai, và mọi báo cáo thành vô nghĩa.
 */
export function generateDemoData(options: DemoDataOptions): DemoData {
    const { rooms, roomExtras, addons, roomUnits, today, count = 32 } = options
    const rng = makeRng(20260802)

    const unitCounts: Record<string, number> = {}
    for (const unit of roomUnits) {
        unitCounts[unit.roomTypeId] = (unitCounts[unit.roomTypeId] ?? 0) + 1
    }

    const inventory = buildInventory({
        rooms,
        unitCounts,
        startDate: addDays(today, -60),
        days: 180,
    })

    const bookings: Booking[] = []
    const logs: ActivityLog[] = []
    const notifications: Notification[] = []
    const customersById = new Map<string, Customer>()
    const units = [...roomUnits]

    for (let i = 0; i < count; i++) {
        // ---- khách ----
        const isForeign = rng() < 0.2
        const fullName = isForeign
            ? pick(rng, FOREIGN_NAMES)
            : `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`
        const phone = `09${pickInt(rng, 10_000_000, 99_999_999)}`
        const customerId = `cus-${phone}`

        // ---- kỳ lưu trú: rải từ -45 đến +60 ngày ----
        const offset = pickInt(rng, -45, 60)
        const checkIn = addDays(today, offset)
        const nights = pickInt(rng, 1, 5)
        const checkOut = addDays(checkIn, nights)

        const room = pick(rng, rooms)
        const ratePlan = pick(rng, ratePlans)

        const adults = pickInt(rng, 1, 3)
        const childCount = rng() < 0.3 ? pickInt(rng, 1, 2) : 0
        const children = Array.from({ length: childCount }, () => pickInt(rng, 2, 12))

        const wantsFerry = rng() < 0.5
        const bookingAddons: Record<string, number> = {}
        if (wantsFerry && addons.length > 0) {
            const addon = pick(rng, addons)
            bookingAddons[addon.id] = adults
        }

        // ---- báo giá qua đúng engine mà khách dùng ----
        const createdAt = addDays(checkIn, -pickInt(rng, 1, 40))
        const quote = buildQuote({
            room,
            roomExtra: roomExtras[room.id],
            checkIn,
            checkOut,
            guests: { adults, children },
            seasons,
            inventory,
            ratePlan,
            addons: bookingAddons,
            addonCatalog: addons,
            childPolicy,
            promotions,
            channel: rng() < 0.75 ? 'web' : rng() < 0.5 ? 'phone' : 'walk-in',
            today: createdAt,
        })

        // Quá sức chứa hoặc hết phòng thì bỏ qua đơn này.
        if (quote.totalAmount <= 0) continue

        // ---- trạng thái suy từ mốc thời gian ----
        const status = deriveStatus(rng, checkIn, checkOut, today)

        const code = formatBookingCode(2026, i + 1)
        const bookingId = `bk-${String(i + 1).padStart(4, '0')}`

        const paidAmount =
            status === 'pending_payment'
                ? 0
                : status === 'checked_out'
                  ? quote.totalAmount
                  : quote.depositAmount

        const booking: Booking = {
            id: bookingId,
            code,
            propertyId: 'nam-du-hill',
            roomTypeId: room.id,
            ratePlanId: ratePlan.id,
            checkIn,
            checkOut,
            nights: countNights(checkIn, checkOut),
            guests: { adults, children },
            addons: bookingAddons,
            guest: {
                fullName,
                phone,
                email: `${phone}@example.com`,
                specialRequests: rng() < 0.3 ? pick(rng, SPECIAL_REQUESTS) : undefined,
                estimatedArrivalTime: rng() < 0.4 ? `${pickInt(rng, 12, 20)}:00` : undefined,
            },
            customerId,
            channel: rng() < 0.75 ? 'web' : 'phone',
            status,
            createdAt: `${createdAt}T${String(pickInt(rng, 8, 22)).padStart(2, '0')}:${String(pickInt(rng, 0, 59)).padStart(2, '0')}:00.000Z`,
            updatedAt: `${createdAt}T12:00:00.000Z`,
            subtotal: quote.subtotal,
            discountTotal: quote.discountTotal,
            totalAmount: quote.totalAmount,
            depositAmount: quote.depositAmount,
            paidAmount,
            priceLines: quote.lines,
            appliedPromotions: quote.promotion.applied,
        }

        // ---- nhận / trả phòng ----
        if (status === 'checked_in' || status === 'checked_out') {
            const freeUnit = units.find((u) => u.roomTypeId === room.id)
            booking.checkInRecord = {
                at: `${checkIn}T14:${String(pickInt(rng, 0, 59)).padStart(2, '0')}:00.000Z`,
                roomUnitId: freeUnit?.id ?? `${room.id}-1`,
                idNumber: `0${pickInt(rng, 10_000_000_00, 99_999_999_99)}`,
                actualGuests: { adults, children },
                earlyCheckIn: rng() < 0.15,
                vehiclePlate: rng() < 0.3 ? `65A-${pickInt(rng, 10_000, 99_999)}` : undefined,
                staffId: 'staff-01',
                staffName: 'Lê Thị Ngọc',
            }
        }

        if (status === 'checked_out') {
            const hasIncidental = rng() < 0.35
            const isLate = rng() < 0.2
            const lateFee = isLate ? 200_000 : 0
            const incidentals = hasIncidental
                ? [
                      {
                          id: `inc-${bookingId}`,
                          description: pick(rng, ['Minibar', 'Giặt ủi', 'Đồ uống nhà hàng']),
                          amount: pickInt(rng, 1, 8) * 50_000,
                      },
                  ]
                : []
            const incidentalTotal = incidentals.reduce((sum, i) => sum + i.amount, 0)
            const roomBalance = Math.max(0, quote.totalAmount - paidAmount)
            const computedDue = roomBalance + incidentalTotal + lateFee

            booking.checkOutRecord = {
                at: `${checkOut}T11:${String(pickInt(rng, 0, 59)).padStart(2, '0')}:00.000Z`,
                lateCheckOut: isLate,
                lateCheckOutFee: lateFee,
                incidentals,
                computedDue,
                collectedAmount: computedDue,
                settled: true,
                comment: pick(rng, CHECKOUT_COMMENTS),
                guestRating: pickInt(rng, 3, 5),
                staffId: 'staff-01',
                staffName: 'Lê Thị Ngọc',
            }
        }

        if (status === 'cancelled') {
            booking.cancellation = {
                at: `${addDays(checkIn, -pickInt(rng, 1, 10))}T10:00:00.000Z`,
                by: rng() < 0.7 ? 'customer' : 'admin',
                reason: pick(rng, ['Đổi lịch công tác', 'Thời tiết xấu', 'Lý do cá nhân']),
                refundAmount: Math.round(paidAmount * (rng() < 0.5 ? 1 : 0.5)),
            }
        }

        bookings.push(booking)

        // ---- trừ tồn kho ----
        if (status !== 'cancelled' && status !== 'expired' && status !== 'no_show') {
            for (const date of listStayDates(checkIn, checkOut)) {
                const inv = inventory[inventoryKey(room.id, date)]
                if (inv) inv.bookedUnits += 1
            }
        }

        // ---- nhật ký ----
        logs.push(...buildLogs(booking))

        // ---- hồ sơ khách ----
        const existing = customersById.get(customerId)
        if (existing) {
            if (status === 'checked_out') {
                existing.totalSpent += booking.totalAmount
                existing.stayCount += 1
            }
        } else {
            customersById.set(customerId, {
                id: customerId,
                role: 'customer',
                fullName,
                phone,
                email: booking.guest.email,
                createdAt: booking.createdAt,
                active: true,
                totalSpent: status === 'checked_out' ? booking.totalAmount : 0,
                stayCount: status === 'checked_out' ? 1 : 0,
            })
        }

        // ---- thông báo cho khách ----
        if (status !== 'pending_payment') {
            notifications.push({
                id: `ntf-${bookingId}`,
                accountId: customerId,
                kind: 'payment-success',
                at: booking.createdAt,
                read: rng() < 0.6,
                bookingId,
                bookingCode: code,
                payload: {
                    roomTypeName: room.name,
                    nights: booking.nights,
                    amount: booking.totalAmount,
                },
            })
        }
    }

    return {
        bookings,
        logs,
        customers: [...customersById.values()],
        notifications,
        inventory,
        roomUnits: applyUnitStatus(roomUnits, bookings, today),
    }
}

/**
 * Trạng thái đơn suy từ vị trí kỳ lưu trú so với hôm nay.
 *
 * Không random trạng thái: đơn của tuần trước không thể đang "chờ thanh toán",
 * và đơn tháng sau không thể "đã trả phòng".
 */
function deriveStatus(
    rng: () => number,
    checkIn: string,
    checkOut: string,
    today: string,
): BookingStatus {
    const r = rng()

    // đã trả phòng xong
    if (checkOut <= today) {
        if (r < 0.08) return 'cancelled'
        if (r < 0.12) return 'no_show'
        return 'checked_out'
    }

    // đang ở
    if (checkIn <= today && checkOut > today) {
        return r < 0.05 ? 'cancelled' : 'checked_in'
    }

    // sắp tới
    if (r < 0.12) return 'pending_payment'
    if (r < 0.2) return 'cancelled'
    return 'confirmed'
}

/** Cập nhật tình trạng phòng vật lý theo các đơn đang ở. */
function applyUnitStatus(
    units: RoomUnit[],
    bookings: Booking[],
    today: string,
): RoomUnit[] {
    const occupied = new Set(
        bookings
            .filter((b) => b.status === 'checked_in' && b.checkInRecord)
            .map((b) => b.checkInRecord!.roomUnitId),
    )
    const dirty = new Set(
        bookings
            .filter((b) => b.status === 'checked_out' && b.checkOut === today && b.checkInRecord)
            .map((b) => b.checkInRecord!.roomUnitId),
    )

    return units.map((unit) => ({
        ...unit,
        status: occupied.has(unit.id)
            ? 'occupied'
            : dirty.has(unit.id)
              ? 'dirty'
              : unit.status,
    }))
}

/** Nhật ký tương ứng với vòng đời mà đơn đã đi qua. */
function buildLogs(booking: Booking): ActivityLog[] {
    const result: ActivityLog[] = []
    let seq = 0

    const push = (
        at: string,
        action: ActivityLog['action'],
        actor: { id: string; name: string; role: ActivityLog['actorRole'] },
        extra?: Partial<ActivityLog>,
    ) => {
        seq += 1
        result.push({
            id: `${booking.id}-log-${seq}`,
            bookingId: booking.id,
            at,
            actorId: actor.id,
            actorName: actor.name,
            actorRole: actor.role,
            action,
            ...extra,
        })
    }

    const customer = {
        id: booking.customerId ?? 'guest',
        name: booking.guest.fullName,
        role: 'customer' as const,
    }
    const staff = { id: 'staff-01', name: 'Lê Thị Ngọc', role: 'receptionist' as const }

    push(booking.createdAt, 'created', customer, {
        note: `Đặt qua ${booking.channel}`,
    })

    if (booking.status !== 'pending_payment' && booking.status !== 'expired') {
        push(booking.createdAt, 'payment-recorded', customer, {
            note: `Thu cọc ${booking.depositAmount.toLocaleString('vi-VN')}đ`,
        })
        push(booking.createdAt, 'status-changed', staff, {
            field: 'status',
            from: 'pending_payment',
            to: 'confirmed',
        })
    }

    if (booking.checkInRecord) {
        push(booking.checkInRecord.at, 'checked-in', staff, {
            field: 'status',
            from: 'confirmed',
            to: 'checked_in',
            note: `Gán phòng ${booking.checkInRecord.roomUnitId}`,
        })
    }

    if (booking.checkOutRecord) {
        push(booking.checkOutRecord.at, 'checked-out', staff, {
            field: 'status',
            from: 'checked_in',
            to: 'checked_out',
            note: booking.checkOutRecord.comment,
        })
    }

    if (booking.cancellation) {
        push(booking.cancellation.at, 'cancelled', booking.cancellation.by === 'admin' ? staff : customer, {
            field: 'status',
            to: 'cancelled',
            note: booking.cancellation.reason,
        })
    }

    return result
}
