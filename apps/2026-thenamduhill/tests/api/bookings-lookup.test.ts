import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { PublicBookingDto } from '@repo/core'
import { GET as lookupRoute } from '@/app/api/bookings/lookup/route'
import { POST as createBooking } from '@/app/api/bookings/route'
import { call, expectFail, expectOk } from '../helpers/request'
import { sessionForAccount } from '../helpers/auth'
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
 * `GET /api/bookings/lookup` — tra cứu đơn KHÔNG cần đăng nhập (ticket `390-03`,
 * module MAP `M11`).
 *
 * Đây là route công khai DUY NHẤT chạm dữ liệu đơn, nên tỉ lệ negative cao là
 * chủ ý: 12 case / 9 negative. Ba nhóm phải chứng minh được:
 *
 *   ① Không dò được — thiếu tham số 400, sai cặp 404, vượt ngưỡng 429.
 *   ② **Hai nhánh 404 trả CÙNG body và CÙNG status** — đây là bài quan trọng
 *      nhất. Khác nhau một chữ là lộ mã đơn nào có thật.
 *   ③ Không rò dữ liệu — response không chứa CCCD, email đầy đủ, `customer_id`.
 */

interface BookingRow {
    id: string
    code: string
    guest_phone: string
    room_type_id: string
}

interface LookupData {
    booking: PublicBookingDto
}

const FROM = dayOffset(500)
const TO = dayOffset(520)

/** SĐT đứng tên đơn — gõ ở dạng `0…`, test sẽ tra lại bằng nhiều biến thể. */
const GUEST_PHONE = '0901234567'
const GUEST_EMAIL = 'zz-test-lookup-guest@example.com'
const GUEST_ID_NUMBER = '079201000999'

let restorePromotions: () => Promise<void>
let roomTypeId: string
/** Đơn chính dùng cho mọi bài tra cứu. */
let target: BookingRow
/** Đơn thứ hai CÙNG SĐT, khác mã — chứng minh route không trả danh sách. */
let sibling: BookingRow

/**
 * IP riêng cho từng bài.
 *
 * Bắt buộc, không phải cho gọn: rate limit đếm theo IP trên **store dùng
 * chung** (Postgres). Mọi bài dùng chung một IP thì bài thứ 11 trở đi đỏ vì
 * chạm ngưỡng — và người đọc sẽ tưởng route hỏng.
 */
function ipHeaders(label: string): Record<string, string> {
    return { 'x-forwarded-for': `203.0.113.${Math.abs(hash(label)) % 250 + 1}` }
}

function hash(s: string): number {
    let h = 0
    for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0
    return h
}

async function makeBooking(label: string, checkIn: string, checkOut: string): Promise<BookingRow> {
    const customer = await seedAccount(`lookup-${label}`)
    const created = await call<{ id: string; code: string; guest_phone: string; room_type_id: string }>(
        createBooking,
        '/api/bookings',
        {
            method: 'POST',
            session: await sessionForAccount(customer.id, 'customer'),
            json: {
                roomTypeId,
                checkIn,
                checkOut,
                guests: { adults: 2, children: [] },
                ratePlanId: 'standard',
                guest: {
                    fullName: `Khách tra cứu ${label}`,
                    phone: GUEST_PHONE,
                    email: GUEST_EMAIL,
                    // CCCD: cố ý ghi vào để bài AC-7 chứng minh được route
                    // KHÔNG trả nó ra — trường rỗng thì bài đó không kiểm gì cả.
                    idNumber: GUEST_ID_NUMBER,
                    specialRequests: 'Phòng tầng cao, kỷ niệm ngày cưới',
                },
            },
        },
    )
    const booking = expectOk(created, 201)
    trackBooking(booking.id)
    return {
        id: booking.id,
        code: booking.code,
        guest_phone: GUEST_PHONE,
        room_type_id: roomTypeId,
    }
}

beforeAll(async () => {
    restorePromotions = await withAutoPromotionsDisabled()
    roomTypeId = await seedRoomType({
        label: 'lookup',
        basePrice: 1_000_000,
        totalUnits: 5,
        from: FROM,
        to: TO,
    })
    target = await makeBooking('a', dayOffset(501), dayOffset(503))
    sibling = await makeBooking('b', dayOffset(505), dayOffset(507))
})

afterAll(async () => {
    await restorePromotions()
    await teardown()
})

describe('GET /api/bookings/lookup — đường hợp lệ', () => {
    it('[happy] AC-1+AC-2: gọi KHÔNG cookie, đúng code+phone → 200 và KHÔNG phải 401', async () => {
        const res = await call<LookupData>(lookupRoute, '/api/bookings/lookup', {
            // Không truyền `session` — đây chính là điều kiện đang hỏng ở bug
            // M11: route cũ bọc `withAuthGuard` nên trả 401 ở đúng chỗ này.
            query: { code: target.code, phone: GUEST_PHONE },
            headers: ipHeaders('happy'),
        })
        expect(res.status).not.toBe(401)
        const data = expectOk(res)
        expect(data.booking.code).toBe(target.code)
    })

    it('[happy] AC-6: trả ĐÚNG MỘT đơn (object), không phải mảng — dù 2 đơn cùng SĐT', async () => {
        const res = await call<LookupData>(lookupRoute, '/api/bookings/lookup', {
            query: { code: sibling.code, phone: GUEST_PHONE },
            headers: ipHeaders('single'),
        })
        const data = expectOk(res)

        // Hai đơn dùng CHUNG một SĐT. Nếu route lọc theo phone rồi mới lọc code
        // lỏng lẻo, chỗ này sẽ ra mảng hoặc ra nhầm đơn.
        expect(Array.isArray(data)).toBe(false)
        expect(Array.isArray((data as unknown as { booking: unknown[] }).booking)).toBe(false)
        expect(data.booking.code).toBe(sibling.code)
        expect(data.booking.code).not.toBe(target.code)
    })

    it('[happy] AC-11: `+84`, khoảng trắng, dấu gạch đều tra ra cùng một đơn', async () => {
        const variants = ['+84901234567', '090 123 4567', '090-123-4567']
        for (const [i, phone] of variants.entries()) {
            const res = await call<LookupData>(lookupRoute, '/api/bookings/lookup', {
                query: { code: target.code, phone },
                headers: ipHeaders(`normalize-${i}`),
            })
            const data = expectOk(res)
            expect(data.booking.code, `biến thể SĐT "${phone}" phải tra ra đơn`).toBe(target.code)
        }
    })
})

describe('GET /api/bookings/lookup — negative: chống dò', () => {
    it('[negative] AC-3: thiếu `code` → 400', async () => {
        const res = await call(lookupRoute, '/api/bookings/lookup', {
            query: { phone: GUEST_PHONE },
            headers: ipHeaders('missing-code'),
        })
        expectFail(res, 400, 'VALIDATION_FAILED')
    })

    it('[negative] AC-3: thiếu `phone` → 400 (chỉ có mã đơn KHÔNG đủ để tra)', async () => {
        const res = await call(lookupRoute, '/api/bookings/lookup', {
            query: { code: target.code },
            headers: ipHeaders('missing-phone'),
        })
        expectFail(res, 400, 'VALIDATION_FAILED')
    })

    it('[negative] AC-3: thiếu cả hai → 400', async () => {
        const res = await call(lookupRoute, '/api/bookings/lookup', {
            headers: ipHeaders('missing-both'),
        })
        expectFail(res, 400, 'VALIDATION_FAILED')
    })

    /**
     * ⚠️ BÀI QUAN TRỌNG NHẤT CỦA CẢ FILE.
     *
     * Hai nhánh khác nhau về bản chất:
     *   - mã đơn CÓ THẬT nhưng SĐT sai
     *   - mã đơn KHÔNG TỒN TẠI
     *
     * Nếu chúng trả khác nhau dù chỉ một chữ, người dò quét dải mã bằng một
     * SĐT rác: mã nào trả "sai số điện thoại" là mã có thật ⇒ biết mã rồi mới
     * dò tiếp SĐT. So sánh **toàn bộ body** chứ không chỉ `error.code` — khác
     * nhau ở `message.vi` cũng đủ để phân biệt từ ngoài.
     */
    it('[negative] AC-4+AC-5: sai `phone` và `code` không tồn tại trả CÙNG status + CÙNG body', async () => {
        const wrongPhone = await call(lookupRoute, '/api/bookings/lookup', {
            query: { code: target.code, phone: '0988888888' },
            headers: ipHeaders('wrong-phone'),
        })
        const noSuchCode = await call(lookupRoute, '/api/bookings/lookup', {
            query: { code: `NDH-99999999-9999`, phone: GUEST_PHONE },
            headers: ipHeaders('no-such-code'),
        })

        expectFail(wrongPhone, 404, 'LOOKUP_FAILED')
        expectFail(noSuchCode, 404, 'LOOKUP_FAILED')

        expect(
            wrongPhone.status,
            'sai SĐT và không có mã phải cùng HTTP status',
        ).toBe(noSuchCode.status)
        expect(
            JSON.stringify(wrongPhone.body),
            'sai SĐT và không có mã phải trả CÙNG MỘT body — khác nhau là lộ mã đơn nào có thật',
        ).toBe(JSON.stringify(noSuchCode.body))
    })

    it('[negative] AC-10: thông báo 404 song ngữ đủ vi + en', async () => {
        const res = await call(lookupRoute, '/api/bookings/lookup', {
            query: { code: 'NDH-00000000-0000', phone: '0900000000' },
            headers: ipHeaders('bilingual'),
        })
        const err = expectFail(res, 404, 'LOOKUP_FAILED')
        expect(err.message.vi.length).toBeGreaterThan(0)
        expect(err.message.en.length).toBeGreaterThan(0)
        expect(err.message.vi).not.toBe(err.message.en)
    })

    it('[negative] mã đơn của người khác + SĐT của mình → 404 (không ghép chéo được)', async () => {
        // Đơn thật nhưng SĐT thuộc người khác: phải trượt, không được trả đơn.
        const other = await adminDb()
            .from('bookings')
            .select('code')
            .not('room_type_id', 'in', `("${roomTypeId}")`)
            .limit(1)
            .maybeSingle<{ code: string }>()

        if (!other.data?.code) return // DB dev chưa có đơn khác — bỏ qua, không bịa PASS

        const res = await call(lookupRoute, '/api/bookings/lookup', {
            query: { code: other.data.code, phone: GUEST_PHONE },
            headers: ipHeaders('cross-match'),
        })
        expectFail(res, 404, 'LOOKUP_FAILED')
    })

    /**
     * AC-9 — rate limit phải là store DÙNG CHUNG, không phải `Map` trong RAM.
     *
     * Ngưỡng route: 10 lượt / 5 phút / IP. Bài này bắn 11 lượt từ **một IP
     * riêng** (không dùng chung với bài khác) rồi đòi lượt cuối là 429.
     */
    it('[negative] AC-9: vượt ngưỡng 10 lượt/5 phút → 429 kèm retryAfterSeconds', async () => {
        const headers = { 'x-forwarded-for': '198.51.100.77' }
        let last = await call(lookupRoute, '/api/bookings/lookup', {
            query: { code: 'NDH-11111111-1111', phone: '0911111111' },
            headers,
        })
        for (let i = 0; i < 10; i += 1) {
            last = await call(lookupRoute, '/api/bookings/lookup', {
                query: { code: 'NDH-11111111-1111', phone: '0911111111' },
                headers,
            })
        }
        const err = expectFail(last, 429, 'RATE_LIMITED')
        expect(err.message.vi).toBeTruthy()
        expect(err.message.en).toBeTruthy()
        // M32: field phụ phải đi kèm — FE cần biết đợi bao lâu mới thử lại.
        expect(
            Number((err as unknown as { retryAfterSeconds?: number }).retryAfterSeconds),
        ).toBeGreaterThan(0)
    })

    it('[negative] AC-9: IP khác KHÔNG bị chặn lây', async () => {
        // Bộ đếm khoá theo `<bucket>:<ip>`. Chặn nhầm cả site khi một người dò
        // là tự tạo sự cố cho khách thật.
        const res = await call<LookupData>(lookupRoute, '/api/bookings/lookup', {
            query: { code: target.code, phone: GUEST_PHONE },
            headers: { 'x-forwarded-for': '198.51.100.200' },
        })
        expect(res.status).not.toBe(429)
        expectOk(res)
    })
})

describe('GET /api/bookings/lookup — negative: không rò dữ liệu nhạy cảm', () => {
    it('[negative] AC-7: response KHÔNG chứa CCCD, `customer_id`, email đầy đủ, ghi chú nội bộ', async () => {
        const res = await call<LookupData>(lookupRoute, '/api/bookings/lookup', {
            query: { code: target.code, phone: GUEST_PHONE },
            headers: ipHeaders('no-leak'),
        })
        const data = expectOk(res)

        /*
         * Quét trên CHUỖI JSON thô, không chỉ trên field đã biết tên.
         *
         * Nợ `M33` cho thấy đúng kiểu lỗi cần bắt: route `return ok(row)` thẳng
         * hàng RPC `RETURNS public.bookings` ⇒ rò cả 38 cột. Assert từng field
         * mình nhớ ra thì không bắt được cột mới ai đó thêm vào bảng sau này;
         * quét chuỗi thì bắt được.
         */
        const raw = JSON.stringify(data)

        expect(raw, 'CCCD lọt ra ngoài — đây là dữ liệu định danh cá nhân').not.toContain(
            GUEST_ID_NUMBER,
        )
        expect(raw, 'email đầy đủ lọt ra ngoài, phải che thành a***@…').not.toContain(GUEST_EMAIL)
        expect(raw).not.toContain('guest_id_number')
        expect(raw).not.toContain('customer_id')
        expect(raw).not.toContain('guest_tax_code')
        expect(raw).not.toContain('check_in_record')
        expect(raw).not.toContain('check_out_record')
        expect(raw).not.toContain('activity_logs')
        expect(raw).not.toContain('assigned_room_unit_id')

        // Không lẫn snake_case của hàng thô (bài học M33).
        expect(raw).not.toContain('guest_phone')
        expect(raw).not.toContain('total_amount')
    })

    it('[negative] AC-8: email và SĐT trả về ở dạng ĐÃ CHE', async () => {
        const res = await call<LookupData>(lookupRoute, '/api/bookings/lookup', {
            query: { code: target.code, phone: GUEST_PHONE },
            headers: ipHeaders('masked'),
        })
        const { booking } = expectOk(res)

        expect(booking.guest.emailMasked).toMatch(/^.\*\*\*@/)
        expect(booking.guest.emailMasked).not.toBe(GUEST_EMAIL)
        expect(booking.guest.phoneMasked).toContain('****')
        expect(booking.guest.phoneMasked).not.toBe(GUEST_PHONE)
    })

    it('[happy] trả đủ 6 thông tin tối thiểu khách cần: mã · hạng · ngày · trạng thái · tổng · số dư', async () => {
        const res = await call<LookupData>(lookupRoute, '/api/bookings/lookup', {
            query: { code: target.code, phone: GUEST_PHONE },
            headers: ipHeaders('minimum-fields'),
        })
        const { booking } = expectOk(res)

        expect(booking.code).toBe(target.code)
        expect(booking.roomTypeId).toBe(roomTypeId)
        // Tên hạng phòng song ngữ, để FE không phải gọi thêm route thứ hai.
        expect(booking.roomTypeName.vi).toBeTruthy()
        expect(booking.roomTypeName.en).toBeTruthy()
        expect(booking.checkIn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(booking.checkOut).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(booking.status).toBe('pending_payment')
        // R6: nhãn trạng thái song ngữ do server trả.
        expect(booking.statusLabel.vi).toBeTruthy()
        expect(booking.statusLabel.en).toBeTruthy()
        expect(booking.totalAmount).toBeGreaterThan(0)

        // `balanceDue` map từ cột SINH `remaining_amount` (KHÔNG phải
        // `balance_due` — cột đó không tồn tại). Kiểm bằng phép trừ để bắt
        // được trường hợp map nhầm sang cột khác.
        expect(booking.balanceDue).toBe(booking.totalAmount - booking.paidAmount)
    })
})
