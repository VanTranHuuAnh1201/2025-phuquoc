import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { POST as createBooking } from '@/app/api/bookings/route'
import { POST as payRoute } from '@/app/api/bookings/[id]/payments/route'
import { POST as checkInRoute } from '@/app/api/bookings/[id]/check-in/route'
import { POST as checkOutRoute } from '@/app/api/bookings/[id]/check-out/route'
import { POST as cancelRoute } from '@/app/api/bookings/[id]/cancel/route'
import { GET as cancelQuoteRoute } from '@/app/api/bookings/[id]/cancel/quote/route'
import { POST as refundRoute } from '@/app/api/bookings/[id]/refund/route'
import { call, callWithParams, expectFail, expectOk } from '../helpers/request'
import { loginAs, sessionForAccount } from '../helpers/auth'
import {
    adminDb,
    dayOffset,
    seedAccount,
    seedRoomType,
    teardown,
    trackBooking,
    withAutoPromotionsDisabled,
} from '../helpers/seed'

/**
 * 6 route vòng đời đơn: `/payments` · `/check-in` · `/check-out` · `/cancel` ·
 * `/cancel/quote` · `/refund`.
 *
 * TEST-STRATEGY §6 nhóm "Vòng đời đơn — không nhảy cóc": 10 case, 4 negative.
 * Đồ thị hợp lệ (§B1):
 *   pending_payment → confirmed → checked_in → checked_out
 * Mọi cạnh KHÔNG có trong đồ thị phải bị chặn bằng 422.
 */

interface BookingRow {
    id: string
    code: string
    status: string
    total_amount: number
    paid_amount: number
    deposit_amount: number
    room_type_id: string
    room_unit_id: string | null
}

const FROM = dayOffset(400)
const TO = dayOffset(430)

let restorePromotions: () => Promise<void>

beforeAll(async () => {
    restorePromotions = await withAutoPromotionsDisabled()
})

afterAll(async () => {
    await restorePromotions()
    await teardown()
})

/** Tạo một đơn `pending_payment` + phòng vật lý để check-in được. */
async function makeBooking(label: string, checkIn: string, checkOut: string): Promise<{
    booking: BookingRow
    roomTypeId: string
    roomUnitId: string
    customerId: string
}> {
    const roomTypeId = await seedRoomType({
        label,
        basePrice: 1_000_000,
        totalUnits: 5,
        from: FROM,
        to: TO,
    })
    const customer = await seedAccount(`${label}-cust`)

    // Phòng VẬT LÝ (`RoomUnit`, §B0) — lễ tân gán lúc nhận phòng. Không có thì
    // check-in đổ `22P02` như bug đã ghi trong `room-units/route.ts`.
    const { data: unit, error: unitError } = await adminDb()
        .from('room_units')
        .insert({
            code: `ZZ${label.slice(0, 6).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`,
            room_type_id: roomTypeId,
            status: 'available',
        })
        .select('id')
        .single<{ id: string }>()
    if (unitError) throw new Error(`Seed room_unit thất bại: ${unitError.message}`)

    const created = await call<BookingRow>(createBooking, '/api/bookings', {
        method: 'POST',
        session: await sessionForAccount(customer.id, 'customer'),
        json: {
            roomTypeId,
            checkIn,
            checkOut,
            guests: { adults: 2, children: [] },
            ratePlanId: 'standard',
            guest: {
                fullName: `Khách ${label}`,
                phone: '0901234567',
                email: 'zz-test-lifecycle@example.com',
            },
        },
    })
    const booking = expectOk(created, 201)
    trackBooking(booking.id)
    return { booking, roomTypeId, roomUnitId: unit.id, customerId: customer.id }
}

/** Đọc trạng thái THẬT từ server — không tin badge/response (luật MAP A3). */
async function statusOf(bookingId: string): Promise<string> {
    const { data } = await adminDb()
        .from('bookings')
        .select('status')
        .eq('id', bookingId)
        .maybeSingle<{ status: string }>()
    return data?.status ?? 'KHONG-TIM-THAY'
}

/** Đếm dòng nhật ký của một đơn — BE5: mỗi lần đổi trạng thái ghi đúng 1 dòng. */
async function logCount(bookingId: string): Promise<number> {
    const { count } = await adminDb()
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('booking_id', bookingId)
    return count ?? 0
}

describe('Vòng đời đơn — đường hợp lệ theo đồ thị §B1', () => {
    it('[happy] pending_payment → confirmed sau khi thu cọc, có ghi ActivityLog', async () => {
        const { booking } = await makeBooking('pay', dayOffset(401), dayOffset(403))
        const before = await logCount(booking.id)

        const res = await callWithParams<BookingRow>(
            payRoute,
            `/api/bookings/${booking.id}/payments`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('receptionist'),
                // Đ1 của MANUAL: mọi test thanh toán dùng `at-property`.
                json: { amount: Number(booking.deposit_amount), paymentMethod: 'at-property', kind: 'deposit' },
            },
        )
        expectOk(res)

        expect(await statusOf(booking.id)).toBe('confirmed')

        /*
         * BE5: thu cọc ghi ĐÚNG HAI dòng, không phải một —
         *   ① `payment-recorded`  (tiền vào)
         *   ② `status-changed`    (pending_payment → confirmed)
         * Xác nhận bằng `pg_get_functiondef(confirm_booking_payment)`: nhánh ②
         * chỉ chạy khi trạng thái thật sự đổi. Đây là thiết kế đúng — tiền và
         * trạng thái là hai sự kiện khác nhau, gộp lại thì khi tranh chấp với
         * khách không tách được "đã thu lúc nào" khỏi "xác nhận lúc nào".
         */
        expect(await logCount(booking.id)).toBe(before + 2)

        const { data: logs } = await adminDb()
            .from('activity_logs')
            .select('action')
            .eq('booking_id', booking.id)
        const actions = (logs ?? []).map((l) => String((l as { action: string }).action))
        expect(actions).toContain('payment-recorded')
        expect(actions).toContain('status-changed')
    })

    it('[happy] confirmed → checked_in, gán phòng vật lý và đổi trạng thái RoomUnit', async () => {
        const { booking, roomUnitId } = await makeBooking('cin', dayOffset(404), dayOffset(406))
        await payDeposit(booking)

        const res = await callWithParams<BookingRow>(
            checkInRoute,
            `/api/bookings/${booking.id}/check-in`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('receptionist'),
                json: {
                    roomUnitId,
                    idNumber: '012345678901',
                    actualGuests: { adults: 2, children: [] },
                },
            },
        )
        expectOk(res)

        expect(await statusOf(booking.id)).toBe('checked_in')

        const { data: unit } = await adminDb()
            .from('room_units')
            .select('status')
            .eq('id', roomUnitId)
            .maybeSingle<{ status: string }>()
        expect(unit?.status, 'RoomUnit phải chuyển sang occupied sau check-in').toBe('occupied')
    })

    it('[happy] checked_in → checked_out sau khi thu đủ tiền', async () => {
        const { booking, roomUnitId } = await makeBooking('cout', dayOffset(407), dayOffset(409))
        await payDeposit(booking)
        await doCheckIn(booking, roomUnitId)

        // Thu nốt phần còn lại — `check_out_booking()` từ chối nếu còn nợ.
        const remaining = Number(booking.total_amount) - Number(booking.deposit_amount)
        if (remaining > 0) {
            const pay = await callWithParams(
                payRoute,
                `/api/bookings/${booking.id}/payments`,
                { id: booking.id },
                {
                    method: 'POST',
                    session: await loginAs('receptionist'),
                    json: { amount: remaining, paymentMethod: 'at-property', kind: 'balance' },
                },
            )
            expectOk(pay)
        }

        const res = await callWithParams<BookingRow>(
            checkOutRoute,
            `/api/bookings/${booking.id}/check-out`,
            { id: booking.id },
            { method: 'POST', session: await loginAs('receptionist'), json: { settled: true } },
        )
        expectOk(res)
        expect(await statusOf(booking.id)).toBe('checked_out')
    })

    it('[happy] pending_payment → cancelled, ghi ActivityLog', async () => {
        const { booking } = await makeBooking('cancel', dayOffset(410), dayOffset(412))
        const before = await logCount(booking.id)

        const res = await callWithParams<BookingRow>(
            cancelRoute,
            `/api/bookings/${booking.id}/cancel`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('manager'),
                json: { reason: 'Test huỷ đơn' },
            },
        )
        expectOk(res)
        expect(await statusOf(booking.id)).toBe('cancelled')
        expect(await logCount(booking.id)).toBe(before + 1)
    })

    it('[happy] GET /cancel/quote trả số tiền hoàn TRƯỚC khi khách bấm huỷ (§B5)', async () => {
        // Nhận phòng sau 400 ngày ⇒ huỷ bây giờ là > 7 ngày ⇒ hoàn 100%.
        const { booking, customerId } = await makeBooking('quote', dayOffset(413), dayOffset(415))
        await payDeposit(booking)

        const res = await callWithParams<{
            refundPercent: number
            refundAmount: number
            daysUntilCheckIn: number
            paidAmount: number
        }>(
            cancelQuoteRoute,
            `/api/bookings/${booking.id}/cancel/quote`,
            { id: booking.id },
            { session: await sessionForAccount(customerId, 'customer') },
        )
        const quote = expectOk(res)

        expect(quote.daysUntilCheckIn).toBeGreaterThan(7)
        // `standard`: huỷ trước 7 ngày hoàn 100% (đọc từ `rate_plans` thật).
        expect(quote.refundPercent).toBe(100)
        expect(quote.refundAmount).toBe(Number(booking.deposit_amount))
    })

    /*
     * Trước `900-01` test này khoá hiện trạng của một BUG: `refund_booking_payment()`
     * ghi `action = 'refund-processed'` mà `chk_logs_action` chỉ nhận 9 giá trị
     * ⇒ 23514 ⇒ mọi lần hoàn tiền đều 500.
     *
     * Migration `20260103000000_add_refund_processed_log_action.sql` mở rộng
     * constraint lên 10 giá trị (hướng A: giữ nguyên chiều tiền trong nhật ký).
     * Assertion đã đảo sang nhánh happy path — AC-5.
     */
    it('[happy] POST /refund → 200, paid_amount giảm đúng, ghi 1 dòng log (900-01)', async () => {
        const { booking } = await makeBooking('refund', dayOffset(416), dayOffset(418))
        await payDeposit(booking)

        const paidBefore = Number(booking.deposit_amount)
        const before = await logCount(booking.id)
        const REFUND = 100_000

        const res = await callWithParams<BookingRow>(
            refundRoute,
            `/api/bookings/${booking.id}/refund`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('manager'),
                json: { amount: REFUND, paymentMethod: 'bank-transfer' },
            },
        )
        expectOk(res)

        // AC-1: đọc lại từ SERVER, không tin response (luật MAP A3).
        const { data } = await adminDb()
            .from('bookings')
            .select('paid_amount')
            .eq('id', booking.id)
            .maybeSingle<{ paid_amount: number }>()
        expect(Number(data?.paid_amount)).toBe(paidBefore - REFUND)

        // AC-2: đúng 1 dòng nhật ký (BE5), `action` nằm trong `chk_logs_action`.
        expect(await logCount(booking.id)).toBe(before + 1)
        const { data: log } = await adminDb()
            .from('activity_logs')
            .select('action, field, "from", "to"')
            .eq('booking_id', booking.id)
            .order('at', { ascending: false })
            .limit(1)
            .maybeSingle<{ action: string; field: string; from: string; to: string }>()
        // Hoàn tiền KHÔNG được gộp vào 'payment-recorded' — nhật ký phải phân
        // biệt được chiều tiền khi tranh chấp với khách (§B1).
        expect(log?.action).toBe('refund-processed')
        expect(log?.field).toBe('paid_amount')
        expect(Number(log?.from)).toBe(paidBefore)
        expect(Number(log?.to)).toBe(paidBefore - REFUND)

        // Ghi một dòng `payments` kind='refund' — đối soát sổ được.
        const { count: refundRows } = await adminDb()
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('booking_id', booking.id)
            .eq('kind', 'refund')
        expect(refundRows).toBe(1)
    })

    /*
     * Negative đi kèm: hoàn tiền cho đơn CHƯA thu đồng nào. `paid_amount = 0`
     * nên mọi số tiền dương đều vượt ⇒ phải là 400 có mã đọc được, KHÔNG phải
     * 500. Đây là ranh giới hay bị nuốt thành INTERNAL_ERROR nhất sau khi sửa
     * constraint, vì lỗi lúc này rơi vào tầng route chứ không còn ở tầng DB.
     */
    it('[negative] /refund trên đơn chưa thu tiền → 400 EXCEEDS_PAID_AMOUNT, không ghi log', async () => {
        const { booking } = await makeBooking('refundzero', dayOffset(437), dayOffset(439))
        const before = await logCount(booking.id)

        const res = await callWithParams(
            refundRoute,
            `/api/bookings/${booking.id}/refund`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('manager'),
                json: { amount: 1, paymentMethod: 'bank-transfer' },
            },
        )
        expectFail(res, 400, 'EXCEEDS_PAID_AMOUNT')

        // Không có tác dụng phụ: không dòng log nào, tiền vẫn 0.
        expect(await logCount(booking.id)).toBe(before)
        const { data } = await adminDb()
            .from('bookings')
            .select('paid_amount')
            .eq('id', booking.id)
            .maybeSingle<{ paid_amount: number }>()
        expect(Number(data?.paid_amount)).toBe(0)
    })
})

describe('Vòng đời đơn — KHÔNG nhảy cóc (negative)', () => {
    it('[negative] checked_out → check-in lại → 422 INVALID_TRANSITION', async () => {
        const { booking, roomUnitId } = await makeBooking('nojump', dayOffset(419), dayOffset(421))
        await payDeposit(booking)
        await doCheckIn(booking, roomUnitId)

        const remaining = Number(booking.total_amount) - Number(booking.deposit_amount)
        if (remaining > 0) {
            await callWithParams(
                payRoute,
                `/api/bookings/${booking.id}/payments`,
                { id: booking.id },
                {
                    method: 'POST',
                    session: await loginAs('receptionist'),
                    json: { amount: remaining, paymentMethod: 'at-property', kind: 'balance' },
                },
            )
        }
        await callWithParams(
            checkOutRoute,
            `/api/bookings/${booking.id}/check-out`,
            { id: booking.id },
            { method: 'POST', session: await loginAs('receptionist'), json: { settled: true } },
        )
        expect(await statusOf(booking.id)).toBe('checked_out')

        const res = await callWithParams(
            checkInRoute,
            `/api/bookings/${booking.id}/check-in`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('receptionist'),
                json: {
                    roomUnitId,
                    idNumber: '012345678901',
                    actualGuests: { adults: 2, children: [] },
                },
            },
        )
        // Đơn đã đóng không quay ngược được — bất biến của state machine §B1.
        expectFail(res, 422, 'INVALID_TRANSITION')
        expect(await statusOf(booking.id)).toBe('checked_out')
    })

    it('[negative] pending_payment → check-in thẳng (bỏ qua confirmed) → 422', async () => {
        const { booking, roomUnitId } = await makeBooking('skip', dayOffset(422), dayOffset(424))

        const res = await callWithParams(
            checkInRoute,
            `/api/bookings/${booking.id}/check-in`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('receptionist'),
                json: {
                    roomUnitId,
                    idNumber: '012345678901',
                    actualGuests: { adults: 2, children: [] },
                },
            },
        )
        expectFail(res, 422, 'INVALID_TRANSITION')
        expect(await statusOf(booking.id)).toBe('pending_payment')
    })

    it('[negative] check-out khi CHƯA thu đủ tiền → 400 NOT_SETTLED', async () => {
        const { booking, roomUnitId } = await makeBooking('unpaid', dayOffset(425), dayOffset(427))
        await payDeposit(booking) // mới trả cọc 30%
        await doCheckIn(booking, roomUnitId)

        const res = await callWithParams(
            checkOutRoute,
            `/api/bookings/${booking.id}/check-out`,
            { id: booking.id },
            { method: 'POST', session: await loginAs('receptionist'), json: { settled: true } },
        )
        expectFail(res, 400, 'NOT_SETTLED')
        expect(await statusOf(booking.id)).toBe('checked_in')
    })

    it('[negative] huỷ đơn đã cancelled → 422 INVALID_TRANSITION', async () => {
        const { booking } = await makeBooking('recancel', dayOffset(428), dayOffset(430))
        await callWithParams(
            cancelRoute,
            `/api/bookings/${booking.id}/cancel`,
            { id: booking.id },
            { method: 'POST', session: await loginAs('manager'), json: { reason: 'lần 1' } },
        )

        const res = await callWithParams(
            cancelRoute,
            `/api/bookings/${booking.id}/cancel`,
            { id: booking.id },
            { method: 'POST', session: await loginAs('manager'), json: { reason: 'lần 2' } },
        )
        expectFail(res, 422, 'INVALID_TRANSITION')
    })

    it('[negative] hoàn tiền VƯỢT số đã thu → 400 EXCEEDS_PAID_AMOUNT', async () => {
        const { booking } = await makeBooking('overrefund', dayOffset(431), dayOffset(433))
        await payDeposit(booking)

        const res = await callWithParams(
            refundRoute,
            `/api/bookings/${booking.id}/refund`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('manager'),
                json: { amount: 999_000_000, paymentMethod: 'bank-transfer' },
            },
        )
        expectFail(res, 400, 'EXCEEDS_PAID_AMOUNT')
    })

    it('[negative] receptionist KHÔNG có booking.refund → 403 FORBIDDEN', async () => {
        const { booking } = await makeBooking('norefund', dayOffset(434), dayOffset(436))
        await payDeposit(booking)

        const res = await callWithParams(
            refundRoute,
            `/api/bookings/${booking.id}/refund`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('receptionist'),
                json: { amount: 100_000, paymentMethod: 'bank-transfer' },
            },
        )
        // §B8: lễ tân vận hành đơn nhưng KHÔNG duyệt hoàn tiền.
        expectFail(res, 403, 'FORBIDDEN')
    })

    it('[negative] khách huỷ đơn của NGƯỜI KHÁC → 403 FORBIDDEN', async () => {
        const { booking } = await makeBooking('notmine', dayOffset(437), dayOffset(439))
        const stranger = await seedAccount('cancel-stranger')

        const res = await callWithParams(
            cancelRoute,
            `/api/bookings/${booking.id}/cancel`,
            { id: booking.id },
            {
                method: 'POST',
                session: await sessionForAccount(stranger.id, 'customer'),
                json: { reason: 'thử huỷ hộ' },
            },
        )
        expectFail(res, 403, 'FORBIDDEN')
        expect(await statusOf(booking.id)).toBe('pending_payment')
    })

    it('[negative] check-in KHÔNG gửi roomUnitId → 400 INVALID_INPUT', async () => {
        const { booking } = await makeBooking('nounit', dayOffset(440), dayOffset(442))
        await payDeposit(booking)

        const res = await callWithParams(
            checkInRoute,
            `/api/bookings/${booking.id}/check-in`,
            { id: booking.id },
            {
                method: 'POST',
                session: await loginAs('receptionist'),
                json: { idNumber: '012345678901', actualGuests: { adults: 2, children: [] } },
            },
        )
        expectFail(res, 400, 'INVALID_INPUT')
    })
})

// ─────────────────────────── tiện ích dùng lại ──────────────────────────────

async function payDeposit(booking: BookingRow): Promise<void> {
    const res = await callWithParams(
        payRoute,
        `/api/bookings/${booking.id}/payments`,
        { id: booking.id },
        {
            method: 'POST',
            session: await loginAs('receptionist'),
            json: {
                amount: Number(booking.deposit_amount),
                paymentMethod: 'at-property',
                kind: 'deposit',
            },
        },
    )
    expectOk(res)
}

async function doCheckIn(booking: BookingRow, roomUnitId: string): Promise<void> {
    const res = await callWithParams(
        checkInRoute,
        `/api/bookings/${booking.id}/check-in`,
        { id: booking.id },
        {
            method: 'POST',
            session: await loginAs('receptionist'),
            json: {
                roomUnitId,
                idNumber: '012345678901',
                actualGuests: { adults: 2, children: [] },
            },
        },
    )
    expectOk(res)
}
