'use client'

/**
 * Đơn hàng, tồn kho, phòng vật lý, nhật ký, khách hàng.
 *
 * Store chỉ GIỮ state và gọi vào `@repo/core`. Không có công thức tính giá nào ở
 * đây — mọi con số đi qua `buildQuote()` (luật R8).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    canTransition,
    formatBookingCode,
    holdsInventory,
    inventoryKey,
    listStayDates,
    makeLog,
    quoteRefund,
} from '@repo/core'
import type {
    ActivityLog,
    Booking,
    BookingStatus,
    CheckInRecord,
    CheckOutRecord,
    Customer,
    Inventory,
    Quote,
    Role,
    RoomUnit,
    RoomUnitStatus,
} from '@repo/core'
import { getDemoData, todayKey } from './demo-data'
// `catalog.store` chỉ import KIỂU `Actor` từ file này (import type, bị xoá lúc
// biên dịch) nên chiều ngược lại không tạo vòng lặp lúc chạy.
import { mergeRatePlans, useCatalogStore } from './catalog.store'

export interface Actor {
    id: string
    name: string
    role: Role
}

/** Thao tác ghi bị từ chối và vì sao. */
export type WriteError =
    | 'not-found'
    | 'invalid-transition'
    | 'version-conflict'
    | 'sold-out'
    | 'unit-unavailable'
    | 'not-settled'

interface BookingState {
    bookings: Booking[]
    logs: ActivityLog[]
    customers: Customer[]
    inventory: Record<string, Inventory>
    roomUnits: RoomUnit[]
    /** Số thứ tự đơn kế tiếp, để sinh mã. */
    nextSequence: number

    // ---- đọc ----
    getBooking: (id: string) => Booking | undefined
    getByCode: (code: string) => Booking | undefined
    logsOf: (bookingId: string) => ActivityLog[]
    bookingsOf: (customerId: string) => Booking[]
    availableUnitsOf: (roomTypeId: string) => RoomUnit[]

    // ---- khách đặt ----
    createBooking: (input: CreateBookingInput) => Booking

    // ---- CMS ----
    changeStatus: (id: string, to: BookingStatus, actor: Actor, note?: string) => WriteError | null
    checkIn: (id: string, record: Omit<CheckInRecord, 'at'>, actor: Actor) => WriteError | null
    checkOut: (id: string, record: Omit<CheckOutRecord, 'at'>, actor: Actor) => WriteError | null
    cancelBooking: (id: string, by: 'customer' | 'admin', actor: Actor, reason?: string) => WriteError | null
    addNote: (id: string, note: string, actor: Actor) => WriteError | null

    // ---- tồn kho ----
    updateInventory: (
        roomTypeId: string,
        date: string,
        patch: Partial<Omit<Inventory, 'date' | 'roomTypeId' | 'version'>>,
        expectedVersion: number,
    ) => WriteError | null
    setUnitStatus: (unitId: string, status: RoomUnitStatus) => void

    resetDemo: () => void
}

export interface CreateBookingInput {
    quote: Quote
    roomTypeId: string
    ratePlanId: string
    checkIn: string
    checkOut: string
    guests: Booking['guests']
    addons: Record<string, number>
    guest: Booking['guest']
    customerId?: string
    channel: Booking['channel']
    /**
     * Ai thực sự tạo đơn — dùng cho `ActivityLog`.
     *
     * Bỏ trống = khách tự đặt trên web, nhật ký ghi chính khách (hành vi cũ,
     * không đổi). Truyền vào khi lễ tân nhập đơn hộ qua CMS: nhật ký phải ghi
     * tên nhân viên, nếu không thì tranh chấp về sau không truy được ai làm.
     */
    actor?: Actor
}

function initialState() {
    const demo = getDemoData()
    return {
        bookings: demo.bookings,
        logs: demo.logs,
        customers: demo.customers,
        inventory: demo.inventory,
        roomUnits: demo.roomUnits,
        nextSequence: demo.bookings.length + 1,
    }
}

/** Cộng/trừ tồn kho cho toàn bộ đêm của một đơn. */
function shiftInventory(
    inventory: Record<string, Inventory>,
    booking: Booking,
    delta: number,
): Record<string, Inventory> {
    const next = { ...inventory }
    for (const date of listStayDates(booking.checkIn, booking.checkOut)) {
        const key = inventoryKey(booking.roomTypeId, date)
        const inv = next[key]
        if (!inv) continue
        next[key] = {
            ...inv,
            bookedUnits: Math.max(0, inv.bookedUnits + delta),
            version: inv.version + 1,
        }
    }
    return next
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
            ...initialState(),

            // ------------------------------------------------------------ đọc

            getBooking: (id) => get().bookings.find((b) => b.id === id),
            getByCode: (code) =>
                get().bookings.find((b) => b.code.toLowerCase() === code.trim().toLowerCase()),
            logsOf: (bookingId) =>
                get()
                    .logs.filter((l) => l.bookingId === bookingId)
                    .sort((a, b) => a.at.localeCompare(b.at)),
            bookingsOf: (customerId) =>
                get()
                    .bookings.filter((b) => b.customerId === customerId)
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
            availableUnitsOf: (roomTypeId) =>
                get().roomUnits.filter(
                    (u) => u.roomTypeId === roomTypeId && u.status === 'available',
                ),

            // ------------------------------------------------------- khách đặt

            createBooking: (input) => {
                const state = get()
                const sequence = state.nextSequence
                const now = new Date().toISOString()
                const id = `bk-${String(sequence).padStart(4, '0')}`

                const booking: Booking = {
                    id,
                    code: formatBookingCode(new Date().getUTCFullYear(), sequence),
                    propertyId: 'nam-du-hill',
                    roomTypeId: input.roomTypeId,
                    ratePlanId: input.ratePlanId,
                    checkIn: input.checkIn,
                    checkOut: input.checkOut,
                    nights: input.quote.nights,
                    guests: input.guests,
                    addons: input.addons,
                    guest: input.guest,
                    customerId: input.customerId,
                    channel: input.channel,
                    // Bản demo bỏ qua cổng thanh toán: bấm xác nhận là coi như đã
                    // thu cọc, nên đơn vào thẳng `confirmed`. Khi nối cổng thật,
                    // đơn dừng ở `pending_payment` cho tới lúc callback báo thành công.
                    status: 'confirmed',
                    createdAt: now,
                    updatedAt: now,
                    subtotal: input.quote.subtotal,
                    discountTotal: input.quote.discountTotal,
                    totalAmount: input.quote.totalAmount,
                    depositAmount: input.quote.depositAmount,
                    paidAmount: input.quote.depositAmount,
                    priceLines: input.quote.lines,
                    appliedPromotions: input.quote.promotion.applied,
                }

                const actor: Actor = input.actor ?? {
                    id: input.customerId ?? 'guest',
                    name: input.guest.fullName,
                    role: 'customer',
                }

                set({
                    bookings: [booking, ...state.bookings],
                    nextSequence: sequence + 1,
                    inventory: shiftInventory(state.inventory, booking, 1),
                    logs: [
                        ...state.logs,
                        makeLog({
                            bookingId: id,
                            at: now,
                            actor,
                            action: 'created',
                            note: `Đặt qua ${input.channel}`,
                        }),
                        makeLog({
                            bookingId: id,
                            at: now,
                            actor,
                            action: 'payment-recorded',
                            note: `Thu cọc ${booking.depositAmount.toLocaleString('vi-VN')}đ`,
                        }),
                    ],
                })

                return booking
            },

            // ------------------------------------------------------------- CMS

            changeStatus: (id, to, actor, note) => {
                const state = get()
                const booking = state.bookings.find((b) => b.id === id)
                if (!booking) return 'not-found'
                if (!canTransition(booking.status, to)) return 'invalid-transition'

                const now = new Date().toISOString()
                const from = booking.status

                // Nhả phòng khi đơn rời khỏi nhóm trạng thái đang giữ chỗ.
                const inventory =
                    holdsInventory(from) && !holdsInventory(to)
                        ? shiftInventory(state.inventory, booking, -1)
                        : state.inventory

                set({
                    inventory,
                    bookings: state.bookings.map((b) =>
                        b.id === id ? { ...b, status: to, updatedAt: now } : b,
                    ),
                    logs: [
                        ...state.logs,
                        makeLog({
                            bookingId: id,
                            at: now,
                            actor,
                            action: 'status-changed',
                            field: 'status',
                            from,
                            to,
                            note,
                        }),
                    ],
                })
                return null
            },

            checkIn: (id, record, actor) => {
                const state = get()
                const booking = state.bookings.find((b) => b.id === id)
                if (!booking) return 'not-found'
                if (!canTransition(booking.status, 'checked_in')) return 'invalid-transition'

                const unit = state.roomUnits.find((u) => u.id === record.roomUnitId)
                if (!unit || unit.status !== 'available') return 'unit-unavailable'

                const now = new Date().toISOString()
                const full: CheckInRecord = { ...record, at: now }

                set({
                    bookings: state.bookings.map((b) =>
                        b.id === id
                            ? { ...b, status: 'checked_in', checkInRecord: full, updatedAt: now }
                            : b,
                    ),
                    roomUnits: state.roomUnits.map((u) =>
                        u.id === record.roomUnitId ? { ...u, status: 'occupied' } : u,
                    ),
                    logs: [
                        ...state.logs,
                        makeLog({
                            bookingId: id,
                            at: now,
                            actor,
                            action: 'checked-in',
                            field: 'status',
                            from: booking.status,
                            to: 'checked_in',
                            note: `Gán phòng ${unit.code}`,
                        }),
                    ],
                })
                return null
            },

            checkOut: (id, record, actor) => {
                const state = get()
                const booking = state.bookings.find((b) => b.id === id)
                if (!booking) return 'not-found'
                if (!canTransition(booking.status, 'checked_out')) return 'invalid-transition'
                // Chưa thu đủ thì không cho đóng đơn — nếu không, tiền phát sinh
                // lúc trả phòng sẽ biến mất khỏi sổ sách.
                if (!record.settled) return 'not-settled'

                const now = new Date().toISOString()
                const full: CheckOutRecord = { ...record, at: now }
                const incidentalTotal = record.incidentals.reduce((sum, i) => sum + i.amount, 0)
                const unitId = booking.checkInRecord?.roomUnitId

                set({
                    inventory: shiftInventory(state.inventory, booking, -1),
                    bookings: state.bookings.map((b) =>
                        b.id === id
                            ? {
                                  ...b,
                                  status: 'checked_out',
                                  checkOutRecord: full,
                                  totalAmount: b.totalAmount + incidentalTotal,
                                  paidAmount: b.totalAmount + incidentalTotal,
                                  updatedAt: now,
                              }
                            : b,
                    ),
                    roomUnits: state.roomUnits.map((u) =>
                        u.id === unitId ? { ...u, status: 'dirty' } : u,
                    ),
                    customers: state.customers.map((c) =>
                        c.id === booking.customerId
                            ? {
                                  ...c,
                                  totalSpent: c.totalSpent + booking.totalAmount + incidentalTotal,
                                  stayCount: c.stayCount + 1,
                              }
                            : c,
                    ),
                    logs: [
                        ...state.logs,
                        makeLog({
                            bookingId: id,
                            at: now,
                            actor,
                            action: 'checked-out',
                            field: 'status',
                            from: booking.status,
                            to: 'checked_out',
                            note: record.comment,
                        }),
                    ],
                })
                return null
            },

            cancelBooking: (id, by, actor, reason) => {
                const state = get()
                const booking = state.bookings.find((b) => b.id === id)
                if (!booking) return 'not-found'
                if (!canTransition(booking.status, 'cancelled')) return 'invalid-transition'

                const now = new Date().toISOString()
                // Đọc qua lớp merge của `catalog.store`: admin sửa bậc hoàn tiền
                // của một gói giá thì lần huỷ SAU phải theo bậc mới (`100-04` §6.2).
                //
                // ⚠️ Đây KHÔNG mâu thuẫn với §4.2 "đơn đã đặt không đổi giá":
                // `booking.totalAmount` vẫn là số đã chốt lúc đặt và không hề bị
                // tính lại — thứ đổi ở đây là CHÍNH SÁCH huỷ đang hiệu lực, vốn
                // luôn được tra tại thời điểm khách bấm huỷ.
                const plan = mergeRatePlans(useCatalogStore.getState()).find(
                    (p) => p.id === booking.ratePlanId,
                )
                const refund = quoteRefund(booking, plan?.cancellationRules ?? [], todayKey())

                set({
                    inventory: holdsInventory(booking.status)
                        ? shiftInventory(state.inventory, booking, -1)
                        : state.inventory,
                    bookings: state.bookings.map((b) =>
                        b.id === id
                            ? {
                                  ...b,
                                  status: 'cancelled',
                                  updatedAt: now,
                                  cancellation: { at: now, by, reason, refundAmount: refund.amount },
                              }
                            : b,
                    ),
                    logs: [
                        ...state.logs,
                        makeLog({
                            bookingId: id,
                            at: now,
                            actor,
                            action: 'cancelled',
                            field: 'status',
                            from: booking.status,
                            to: 'cancelled',
                            note: reason
                                ? `${reason} · hoàn ${refund.amount.toLocaleString('vi-VN')}đ (${refund.percent}%)`
                                : `Hoàn ${refund.amount.toLocaleString('vi-VN')}đ (${refund.percent}%)`,
                        }),
                    ],
                })
                return null
            },

            addNote: (id, note, actor) => {
                const state = get()
                if (!state.bookings.some((b) => b.id === id)) return 'not-found'
                set({
                    logs: [
                        ...state.logs,
                        makeLog({
                            bookingId: id,
                            at: new Date().toISOString(),
                            actor,
                            action: 'note-added',
                            note,
                        }),
                    ],
                })
                return null
            },

            // -------------------------------------------------------- tồn kho

            updateInventory: (roomTypeId, date, patch, expectedVersion) => {
                const state = get()
                const key = inventoryKey(roomTypeId, date)
                const current = state.inventory[key]
                if (!current) return 'not-found'
                // Chốt chặn khi hai lễ tân sửa cùng một ô trên hai thiết bị.
                if (current.version !== expectedVersion) return 'version-conflict'

                set({
                    inventory: {
                        ...state.inventory,
                        [key]: { ...current, ...patch, version: current.version + 1 },
                    },
                })
                return null
            },

            setUnitStatus: (unitId, status) =>
                set((state) => ({
                    roomUnits: state.roomUnits.map((u) =>
                        u.id === unitId ? { ...u, status } : u,
                    ),
                })),

            resetDemo: () => set(initialState()),
        }),
        { name: 'namduhill.bookings', version: 1 },
    ),
)
