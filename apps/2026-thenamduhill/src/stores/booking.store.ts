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

    // ---- đồng bộ API ----
    fetchBookingsFromApi: () => Promise<void>

    // ---- khách đặt ----
    createBooking: (input: CreateBookingInput) => Booking

    // ---- hồ sơ khách (CRM) ----
    ensureCustomer: (guest: EnsureCustomerInput) => string

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

/** Thông tin tối thiểu để tra/tạo hồ sơ khách. Đúng phần lễ tân gõ vào form. */
export interface EnsureCustomerInput {
    fullName: string
    phone: string
    email?: string
    /** Ai thao tác — để `ActivityLog` ghi đúng người, mặc định là chính khách. */
    actor?: Actor
    /** Đơn nào làm phát sinh hồ sơ này. `ActivityLog` bắt buộc có `bookingId`. */
    bookingId?: string
}

/**
 * Chuẩn hoá số điện thoại về DUY NHẤT một dạng `0xxxxxxxxx` trước khi tra khách.
 *
 * VÌ SAO PHẢI CÓ: hồ sơ khách gộp theo số điện thoại (`Customer` — luật B0), mà
 * id khách lại sinh thẳng từ số đó (`cus-<phone>`, xem `demo-generator.ts`). Lễ
 * tân gõ tay trong lúc nghe điện thoại nên cùng một người ra nhiều cách viết:
 * `0901234567`, `090 123 4567`, `090.123.4567`, `090-123-4567`, `+84901234567`,
 * `84901234567`. Nếu ghép id từ chuỗi thô thì mỗi cách viết đẻ ra một khách
 * mới, lịch sử lưu trú vỡ vụn và phân hạng VIP/Quay lại tính sai — đúng triệu
 * chứng đang phải sửa.
 *
 * `+84` và `84` đứng đầu là MÃ QUỐC GIA của Việt Nam, tương đương số `0` mở đầu
 * ở dạng nội địa: `+84901234567` và `0901234567` là CÙNG một thuê bao, buộc
 * phải quy về một mối.
 */
export function normalizePhone(raw: string): string {
    // Bỏ mọi ký tự không phải chữ số, giữ lại dấu `+` mở đầu để nhận ra mã quốc gia.
    const trimmed = raw.trim()
    const hasPlus = trimmed.startsWith('+')
    const digits = trimmed.replace(/\D/g, '')
    if (!digits) return ''

    // `+84…` hoặc `84…` (đủ dài để không nuốt nhầm số nội địa mở đầu bằng 84) → `0…`
    if (digits.startsWith('84') && (hasPlus || digits.length >= 11)) {
        return `0${digits.slice(2)}`
    }
    // Số nội địa thiếu số 0 mở đầu (`901234567`) → thêm lại cho khớp `cus-0…`.
    if (!digits.startsWith('0')) return `0${digits}`
    return digits
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

let bookingsInFlightPromise: Promise<void> | null = null

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

            // --------------------------------------------------- đồng bộ API

            fetchBookingsFromApi: async () => {
                if (bookingsInFlightPromise) return bookingsInFlightPromise

                bookingsInFlightPromise = (async () => {
                    try {
                        const res = await fetch('/api/bookings', { credentials: 'include' })
                        if (!res.ok) return
                        const json = await res.json()
                        // BUG THẬT (không phải suy đoán — đã đọc lại toàn bộ đường đi):
                        // `GET /api/bookings` trả `200 { success:true, data:[] }` khi
                        // bảng `bookings` trên Supabase CHƯA SEED — đây là kết quả hợp
                        // lệ về mặt API (không lỗi mạng, không lỗi HTTP), không phải
                        // "API hỏng". Bản cũ `set({ bookings: json.data })` VÔ ĐIỀU KIỆN
                        // ghi đè 31 đơn demo-seed bằng mảng rỗng đó, rồi `persist`
                        // (`namduhill.bookings`) lưu lại trạng thái rỗng — F5 lại đọc
                        // đúng cái rỗng đã lưu, KHÔNG BAO GIỜ tự phục hồi được. Bất kỳ
                        // ai mở CMS trước khi Supabase có dữ liệu thật đều thấy trắng
                        // trơn vĩnh viễn dù store đã seed sẵn.
                        //
                        // Sửa: CHỈ ghi đè khi API thật sự trả về ĐƠN — mảng rỗng bị coi
                        // là "chưa có dữ liệu thật từ backend", giữ nguyên seed demo
                        // đang có (giai đoạn 1 theo `app-flows.md §F7`: demo Zustand
                        // vẫn là nguồn thật cho tới khi backend thật sẵn sàng — mảng
                        // rỗng không phải tín hiệu "hãy xoá sạch dữ liệu demo").
                        if (json && Array.isArray(json.data) && json.data.length > 0) {
                            set({ bookings: json.data })
                        }
                    } catch {
                        // Fallback silently
                    } finally {
                        bookingsInFlightPromise = null
                    }
                })()

                return bookingsInFlightPromise
            },

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

            // ------------------------------------------------- hồ sơ khách (CRM)

            /**
             * Tra hồ sơ khách theo SĐT, chưa có thì tạo. Trả về `customerId`.
             *
             * ĐẶT Ở STORE, KHÔNG Ở COMPONENT: "một SĐT = một khách" là quy tắc
             * nghiệp vụ, không phải chi tiết của một màn hình (luật R8/C2). Cả
             * form tạo đơn CMS lẫn mọi luồng sau này đều phải ra CÙNG một id,
             * nếu không màn CRM lại lệch lần nữa.
             *
             * BUG ĐANG SỬA: form `/admin/orders/new` tạo đơn mà bỏ trống
             * `customerId`, nên `bookings.filter(b => b.customerId === c.id)` ở
             * `/admin/customers` không bao giờ khớp — đơn vừa tạo biến mất khỏi
             * lịch sử khách, kéo theo phân hạng VIP/Quay lại sai.
             */
            ensureCustomer: (guest) => {
                const state = get()
                const phone = normalizePhone(guest.phone)
                // Không có SĐT thì không gộp được hồ sơ — đơn ở lại dạng khách
                // vãng lai thay vì tạo một hồ sơ rác không tra cứu được.
                if (!phone) return ''

                // Id bám ĐÚNG quy ước của `demo-generator.ts`: `cus-<SĐT đã chuẩn hoá>`.
                // Nhờ vậy khách quen đã có trong seed được nhận ra ngay, không đẻ hồ sơ trùng.
                const customerId = `cus-${phone}`

                // So khớp cả trên SĐT đã chuẩn hoá của hồ sơ cũ: dữ liệu seed và
                // dữ liệu nhập tay có thể khác cách viết nhưng vẫn là một người.
                const existing = state.customers.find(
                    (c) => c.id === customerId || normalizePhone(c.phone) === phone,
                )
                if (existing) return existing.id

                const now = new Date().toISOString()
                const customer: Customer = {
                    id: customerId,
                    role: 'customer',
                    fullName: guest.fullName.trim(),
                    phone,
                    email: guest.email?.trim() ?? '',
                    createdAt: now,
                    active: true,
                    // Khách mới chưa lưu trú lần nào — hai số này chỉ tăng ở
                    // `checkOut()`, nơi duy nhất biết tiền đã thu thực tế.
                    totalSpent: 0,
                    stayCount: 0,
                }

                set({
                    customers: [...state.customers, customer],
                    // `ActivityLog` luôn treo trên một đơn, nên chỉ ghi khi biết
                    // đơn nào làm phát sinh hồ sơ (bám cách các action khác dùng `makeLog`).
                    logs: guest.bookingId
                        ? [
                              ...state.logs,
                              makeLog({
                                  bookingId: guest.bookingId,
                                  at: now,
                                  actor: guest.actor ?? {
                                      id: customerId,
                                      name: customer.fullName,
                                      role: 'customer',
                                  },
                                  action: 'note-added',
                                  note: `Tạo hồ sơ khách mới ${customer.fullName} · ${phone}`,
                              }),
                          ]
                        : state.logs,
                })

                return customerId
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
                const lateCheckOutFee = record.lateCheckOutFee || 0
                const computedDue = record.computedDue
                const collectedAmount = record.collectedAmount

                const unitId = booking.checkInRecord?.roomUnitId

                const newTotalAmount = booking.totalAmount + incidentalTotal + lateCheckOutFee
                const previousPaidAmount = booking.paidAmount
                const newPaidAmount = previousPaidAmount + collectedAmount
                const paidDelta = newPaidAmount - previousPaidAmount

                const logs: ActivityLog[] = [
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
                ]

                if (collectedAmount !== computedDue) {
                    logs.push(
                        makeLog({
                            bookingId: id,
                            at: now,
                            actor,
                            action: 'price-adjusted',
                            field: 'collectedAmount',
                            from: String(computedDue),
                            to: String(collectedAmount),
                            note: `Lễ tân điều chỉnh số thu thực tế từ ${computedDue.toLocaleString('vi-VN')}đ sang ${collectedAmount.toLocaleString('vi-VN')}đ`,
                        })
                    )
                }

                set({
                    inventory: shiftInventory(state.inventory, booking, -1),
                    bookings: state.bookings.map((b) =>
                        b.id === id
                            ? {
                                  ...b,
                                  status: 'checked_out',
                                  checkOutRecord: full,
                                  totalAmount: newTotalAmount,
                                  paidAmount: newPaidAmount,
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
                                  totalSpent: c.totalSpent + paidDelta,
                                  stayCount: c.stayCount + 1,
                              }
                            : c,
                    ),
                    logs: [...state.logs, ...logs],
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

            /**
             * Đổi trạng thái một phòng vật lý, VÀ đồng bộ tồn kho nếu việc đó
             * làm phòng ngừng bán được.
             *
             * BUG ĐÃ SỬA: bản trước chỉ ghi `roomUnits`. Đưa một phòng vào
             * `maintenance` ở màn Buồng phòng thì hệ thống VẪN BÁN đủ
             * `totalUnits` suất của hạng đó — bán xong khách đến thì không có
             * phòng giao. Hai màn ghi vào hai nơi mà không ai nói với ai.
             *
             * VÌ SAO SUY LẠI TỪ SỐ ĐẾM THẬT, KHÔNG CỘNG/TRỪ:
             * `blockedUnits += 1` khi vào bảo trì và `-= 1` khi ra là cách viết
             * ngắn hơn, nhưng nó TRÔI. Chỉ cần một lần gọi lặp, một lần thoát
             * giữa chừng, hay một phòng được đặt bảo trì từ trước khi có đoạn
             * mã này, con số sẽ lệch vĩnh viễn và không có cách nào phát hiện.
             * Đếm lại số phòng `maintenance` của hạng rồi GÁN thẳng thì kết quả
             * chỉ phụ thuộc trạng thái hiện tại — gọi bao nhiêu lần cũng ra một
             * giá trị.
             *
             * CHỈ ÁP CHO NGÀY TỪ HÔM NAY TRỞ ĐI: quá khứ đã xảy ra rồi, sửa tồn
             * kho ngày cũ là làm sai lệch số liệu đã chốt.
             */
            setUnitStatus: (unitId, status) =>
                set((state) => {
                    const unit = state.roomUnits.find((u) => u.id === unitId)
                    if (!unit) return {}

                    const roomUnits = state.roomUnits.map((u) =>
                        u.id === unitId ? { ...u, status } : u,
                    )

                    // Vào hay ra khỏi `maintenance` mới đụng tồn kho. Các
                    // chuyển đổi dọn dẹp (dirty → cleaning → available) không
                    // ảnh hưởng khả năng bán: phòng bẩn vẫn bán được cho tối
                    // nay, tổ buồng dọn kịp trước giờ nhận phòng.
                    const wasBlocking = unit.status === 'maintenance'
                    const isBlocking = status === 'maintenance'
                    if (wasBlocking === isBlocking) return { roomUnits }

                    const blocked = roomUnits.filter(
                        (u) => u.roomTypeId === unit.roomTypeId && u.status === 'maintenance',
                    ).length

                    const today = todayKey()
                    const inventory = { ...state.inventory }
                    for (const [key, inv] of Object.entries(state.inventory)) {
                        if (inv.roomTypeId !== unit.roomTypeId) continue
                        if (inv.date < today) continue

                        // Giữ bất biến `availableUnits >= 0`: phòng đã bán thì
                        // không khoá thêm được nữa. Khoá quá tay ở đây sẽ đẻ ra
                        // số âm và mọi phép tính phía sau đi theo.
                        const next = Math.min(blocked, inv.totalUnits - inv.bookedUnits)
                        if (next === inv.blockedUnits) continue

                        inventory[key] = {
                            ...inv,
                            blockedUnits: next,
                            // Tăng `version` để lần ghi sau từ thiết bị khác
                            // phát hiện được xung đột (optimistic locking).
                            version: inv.version + 1,
                        }
                    }

                    return { roomUnits, inventory }
                }),

            resetDemo: () => set(initialState()),
        }),
        {
            name: 'namduhill.bookings',
            version: 3,
            // `persistedState` đến từ `localStorage` của một phiên bản schema cũ hơn —
            // không có type nào mô tả đúng nó trước khi migrate xong, nên thu hẹp bằng
            // `Partial<BookingState>` (đủ để đọc `bookings` một cách an toàn) thay vì `any`.
            migrate: (persistedState: unknown, version: number) => {
                const state = persistedState as Partial<BookingState> | undefined
                if (version === 1 && state && Array.isArray(state.bookings)) {
                    state.bookings = state.bookings.map((b: Booking) => {
                        if (b.checkOutRecord) {
                            return {
                                ...b,
                                checkOutRecord: {
                                    ...b.checkOutRecord,
                                    lateCheckOutFee: b.checkOutRecord.lateCheckOutFee ?? 0,
                                    computedDue: b.checkOutRecord.computedDue ?? 0,
                                    collectedAmount: b.checkOutRecord.collectedAmount ?? 0,
                                },
                            }
                        }
                        return b
                    })
                }
                // v2 → v3: SỬA DỮ LIỆU ĐÃ HỎNG do bug ghi đè mảng rỗng (xem comment
                // tại `fetchBookingsFromApi`). Chỉ sửa mã nguồn thì máy ĐÃ TỪNG mở
                // `/admin` trước bản vá vẫn còn `bookings: []` nằm trong
                // `localStorage` — persist đọc lại đúng cái rỗng đó, code mới không
                // tự chạy lại để phục hồi. `initialState()` LUÔN seed sẵn 31 đơn nên
                // một store hợp lệ không bao giờ tự nhiên rỗng — `bookings: []` sau
                // khi rehydrate là DẤU HIỆU CHẮC CHẮN của đúng bug này, không phải
                // trạng thái người dùng chủ động tạo ra (không có nút "xoá hết đơn"
                // nào trong UI). An toàn để tự phục hồi bằng seed demo.
                if (
                    version <= 2 &&
                    state &&
                    Array.isArray(state.bookings) &&
                    state.bookings.length === 0
                ) {
                    return { ...state, ...initialState() }
                }
                return state
            },
        },
    ),
)
