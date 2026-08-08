import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { GET as listBookings, POST as createBooking } from '@/app/api/bookings/route'
import { GET as getBooking } from '@/app/api/bookings/[id]/route'
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
 * 3 route: `POST /api/bookings` · `GET /api/bookings` · `GET /api/bookings/[id]`.
 *
 * TEST-STRATEGY §6 nhóm "Chống overbooking": 4 case, 2 negative.
 * Cộng phần RBAC/RLS ở tầng ứng dụng cho `GET`.
 */

/** Hàng `bookings` thô — route trả nguyên snake_case (nợ `M33`). */
interface BookingRow {
    id: string
    code: string
    status: string
    room_type_id: string
    customer_id: string | null
    subtotal: number
    discount_total: number
    total_amount: number
    deposit_amount: number
    paid_amount: number
    nights: number
}

const FROM = dayOffset(340)
const TO = dayOffset(360)

let restorePromotions: () => Promise<void>

beforeAll(async () => {
    restorePromotions = await withAutoPromotionsDisabled()
})

afterAll(async () => {
    await restorePromotions()
    await teardown()
})

/** Payload đặt phòng tối thiểu hợp lệ. */
function bookingPayload(roomTypeId: string, checkIn: string, checkOut: string) {
    return {
        roomTypeId,
        checkIn,
        checkOut,
        guests: { adults: 2, children: [] },
        ratePlanId: 'standard',
        guest: {
            fullName: 'Khách Test Đặt Phòng',
            phone: '0901234567',
            email: 'zz-test-guest@example.com',
        },
    }
}

describe('POST /api/bookings — tạo đơn + chống overbooking', () => {
    it('[happy] khách đặt phòng → 201, đơn ở pending_payment, 4 con số tiền khớp §B1', async () => {
        const checkIn = dayOffset(341)
        const checkOut = dayOffset(343)
        const roomTypeId = await seedRoomType({
            label: 'create',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
        })
        const customer = await seedAccount('booker')
        const session = await sessionForAccount(customer.id, 'customer')

        const res = await call<BookingRow>(createBooking, '/api/bookings', {
            method: 'POST',
            session,
            json: bookingPayload(roomTypeId, checkIn, checkOut),
        })
        const booking = expectOk(res, 201)
        trackBooking(booking.id)

        expect(booking.status).toBe('pending_payment')
        expect(booking.nights).toBe(2)
        expect(Number(booking.subtotal)).toBe(2_000_000)
        // Bất biến `chk_bookings_money`: total = subtotal - discount.
        expect(Number(booking.total_amount)).toBe(
            Number(booking.subtotal) - Number(booking.discount_total),
        )
        // Cọc 30% của gói `standard` (`deposit_percent = 30` đọc từ DB).
        expect(Number(booking.deposit_amount)).toBe(600_000)
        expect(Number(booking.paid_amount)).toBe(0)
        expect(booking.customer_id).toBe(customer.id)

        // ĐỌC LẠI TỪ SERVER — inventory phải tăng `booked_units` đúng số đêm ở.
        const { data: inv } = await adminDb()
            .from('inventory')
            .select('date, booked_units')
            .eq('room_type_id', roomTypeId)
            .in('date', [checkIn, dayOffset(342)])
        for (const row of inv ?? []) {
            expect(Number((row as { booked_units: number }).booked_units)).toBe(1)
        }
    })

    it('[negative] đặt phòng CUỐI CÙNG → 201; đặt tiếp cùng ngày → 409 SOLD_OUT', async () => {
        const checkIn = dayOffset(345)
        const checkOut = dayOffset(346)
        // Chỉ MỘT phòng mở bán ⇒ người thứ hai chắc chắn phải bị chặn.
        const roomTypeId = await seedRoomType({
            label: 'lastroom',
            basePrice: 1_000_000,
            totalUnits: 1,
            from: FROM,
            to: TO,
        })
        const first = await seedAccount('first')
        const second = await seedAccount('second')

        const resA = await call<BookingRow>(createBooking, '/api/bookings', {
            method: 'POST',
            session: await sessionForAccount(first.id, 'customer'),
            json: bookingPayload(roomTypeId, checkIn, checkOut),
        })
        const bookingA = expectOk(resA, 201)
        trackBooking(bookingA.id)

        const resB = await call(createBooking, '/api/bookings', {
            method: 'POST',
            session: await sessionForAccount(second.id, 'customer'),
            json: bookingPayload(roomTypeId, checkIn, checkOut),
        })
        // Bán trùng phòng là lỗi không sửa được bằng lời xin lỗi (W8.2 mục 2).
        expectFail(resB, 409, 'SOLD_OUT')

        // Đọc lại DB: đúng 1 phòng bán ra, `chk_not_oversold` không bị vượt.
        const { data: inv } = await adminDb()
            .from('inventory')
            .select('booked_units, total_units')
            .eq('room_type_id', roomTypeId)
            .eq('date', checkIn)
            .maybeSingle<{ booked_units: number; total_units: number }>()
        expect(Number(inv?.booked_units)).toBe(1)
        expect(Number(inv?.booked_units)).toBeLessThanOrEqual(Number(inv?.total_units))
    })

    it('[negative] hai request ĐỒNG THỜI cho phòng cuối → đúng 1 thắng, 1 nhận 409', async () => {
        const checkIn = dayOffset(348)
        const checkOut = dayOffset(349)
        const roomTypeId = await seedRoomType({
            label: 'race',
            basePrice: 1_000_000,
            totalUnits: 1,
            from: FROM,
            to: TO,
        })
        const a = await seedAccount('race-a')
        const b = await seedAccount('race-b')

        // Bắn cùng lúc. `create_booking_atomic()` dùng SELECT FOR UPDATE nên
        // người sau phải ĐỢI rồi mới đọc — không phải cả hai cùng đọc số cũ.
        const [resA, resB] = await Promise.all([
            call<BookingRow>(createBooking, '/api/bookings', {
                method: 'POST',
                session: await sessionForAccount(a.id, 'customer'),
                json: bookingPayload(roomTypeId, checkIn, checkOut),
            }),
            call<BookingRow>(createBooking, '/api/bookings', {
                method: 'POST',
                session: await sessionForAccount(b.id, 'customer'),
                json: bookingPayload(roomTypeId, checkIn, checkOut),
            }),
        ])

        const statuses = [resA.status, resB.status].sort()
        expect(statuses, 'Đúng một request thắng (201), một bị chặn (409)').toEqual([201, 409])

        for (const r of [resA, resB]) {
            if (r.body.success) trackBooking(r.body.data.id)
            else expect(r.body.error.code).toBe('SOLD_OUT')
        }

        const { data: inv } = await adminDb()
            .from('inventory')
            .select('booked_units, total_units')
            .eq('room_type_id', roomTypeId)
            .eq('date', checkIn)
            .maybeSingle<{ booked_units: number; total_units: number }>()
        // Lớp phòng thủ cuối: CHECK constraint không bao giờ để vượt.
        expect(Number(inv?.booked_units)).toBe(1)
    })

    it('[negative] thiếu thông tin khách → 400 INVALID_INPUT', async () => {
        const roomTypeId = await seedRoomType({
            label: 'noguest',
            basePrice: 1_000_000,
            totalUnits: 3,
            from: FROM,
            to: TO,
        })
        const customer = await seedAccount('noguest-acc')

        const res = await call(createBooking, '/api/bookings', {
            method: 'POST',
            session: await sessionForAccount(customer.id, 'customer'),
            json: {
                roomTypeId,
                checkIn: dayOffset(350),
                checkOut: dayOffset(351),
                guests: { adults: 2, children: [] },
                guest: { fullName: 'Thiếu SĐT' },
            },
        })
        expectFail(res, 400, 'INVALID_INPUT')
    })

    it('[negative] hạng phòng không tồn tại → 404 ROOM_TYPE_NOT_FOUND', async () => {
        const customer = await seedAccount('norm')
        const res = await call(createBooking, '/api/bookings', {
            method: 'POST',
            session: await sessionForAccount(customer.id, 'customer'),
            json: bookingPayload('zz-test-khong-ton-tai-bao-gio', dayOffset(352), dayOffset(353)),
        })
        expectFail(res, 404, 'ROOM_TYPE_NOT_FOUND')
    })

    it('[negative] KHÔNG đăng nhập → 401 UNAUTHENTICATED (không phải 403)', async () => {
        const res = await call(createBooking, '/api/bookings', {
            method: 'POST',
            json: bookingPayload('bat-ky', dayOffset(354), dayOffset(355)),
        })
        expectFail(res, 401, 'UNAUTHENTICATED')
    })

    it('[negative] editor KHÔNG có booking.create → 403 FORBIDDEN (phân biệt với 401)', async () => {
        const res = await call(createBooking, '/api/bookings', {
            method: 'POST',
            session: await loginAs('editor'),
            json: bookingPayload('bat-ky', dayOffset(354), dayOffset(355)),
        })
        // §B8: editor chỉ có `content.edit`. Đã đăng nhập nhưng thiếu quyền ⇒
        // 403, KHÔNG phải 401 — FE xử lý hai mã này khác nhau (FE4).
        expectFail(res, 403, 'FORBIDDEN')
    })
})

describe('GET /api/bookings — khách chỉ đọc đơn của mình', () => {
    it('[happy] lễ tân đọc được danh sách đơn', async () => {
        const res = await call<BookingRow[]>(listBookings, '/api/bookings', {
            session: await loginAs('receptionist'),
        })
        const list = expectOk(res)
        expect(Array.isArray(list)).toBe(true)
        // Bug đã sửa (ghi trong route): lễ tân từng nhận `[]` vì RLS chặn.
        expect(list.length).toBeGreaterThan(0)
    })

    it('[negative] khách A KHÔNG thấy đơn của khách B', async () => {
        const checkIn = dayOffset(356)
        const checkOut = dayOffset(357)
        const roomTypeId = await seedRoomType({
            label: 'isolate',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
        })
        const alice = await seedAccount('alice')
        const bob = await seedAccount('bob')

        const created = await call<BookingRow>(createBooking, '/api/bookings', {
            method: 'POST',
            session: await sessionForAccount(alice.id, 'customer'),
            json: bookingPayload(roomTypeId, checkIn, checkOut),
        })
        const aliceBooking = expectOk(created, 201)
        trackBooking(aliceBooking.id)

        const bobList = await call<BookingRow[]>(listBookings, '/api/bookings', {
            session: await sessionForAccount(bob.id, 'customer'),
        })
        const list = expectOk(bobList)
        expect(
            list.some((b) => b.id === aliceBooking.id),
            'Đơn của Alice KHÔNG được xuất hiện trong danh sách của Bob',
        ).toBe(false)
    })

    it('[negative] không đăng nhập → 401 UNAUTHENTICATED', async () => {
        const res = await call(listBookings, '/api/bookings')
        expectFail(res, 401, 'UNAUTHENTICATED')
    })
})

describe('GET /api/bookings/[id] — chi tiết đơn', () => {
    it('[happy] tra bằng CODE (không phải UUID) cũng ra đúng đơn', async () => {
        const checkIn = dayOffset(358)
        const checkOut = dayOffset(359)
        const roomTypeId = await seedRoomType({
            label: 'detail',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
        })
        const customer = await seedAccount('detail-acc')

        const created = await call<BookingRow>(createBooking, '/api/bookings', {
            method: 'POST',
            session: await sessionForAccount(customer.id, 'customer'),
            json: bookingPayload(roomTypeId, checkIn, checkOut),
        })
        const booking = expectOk(created, 201)
        trackBooking(booking.id)

        const res = await callWithParams<BookingRow>(
            getBooking,
            `/api/bookings/${booking.code}`,
            { id: booking.code },
            { session: await loginAs('manager') },
        )
        expect(expectOk(res).id).toBe(booking.id)
    })

    it('[negative] khách xem đơn của người khác → 403 FORBIDDEN', async () => {
        const checkIn = dayOffset(360)
        const checkOut = dayOffset(361)
        const roomTypeId = await seedRoomType({
            label: 'peek',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: dayOffset(359),
            to: dayOffset(363),
        })
        const owner = await seedAccount('peek-owner')
        const stranger = await seedAccount('peek-stranger')

        const created = await call<BookingRow>(createBooking, '/api/bookings', {
            method: 'POST',
            session: await sessionForAccount(owner.id, 'customer'),
            json: bookingPayload(roomTypeId, checkIn, checkOut),
        })
        const booking = expectOk(created, 201)
        trackBooking(booking.id)

        const res = await callWithParams(
            getBooking,
            `/api/bookings/${booking.id}`,
            { id: booking.id },
            { session: await sessionForAccount(stranger.id, 'customer') },
        )
        // Khách đăng nhập hợp lệ nhưng đơn không phải của mình ⇒ 403.
        expectFail(res, 403, 'FORBIDDEN')
    })

    it('[negative] mã đơn không tồn tại → 404 BOOKING_NOT_FOUND', async () => {
        const res = await callWithParams(
            getBooking,
            '/api/bookings/NDH-KHONG-CO-THAT',
            { id: 'NDH-KHONG-CO-THAT' },
            { session: await loginAs('manager') },
        )
        expectFail(res, 404, 'BOOKING_NOT_FOUND')
    })
})
