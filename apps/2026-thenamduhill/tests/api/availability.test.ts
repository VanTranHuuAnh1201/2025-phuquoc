import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Quote } from '@repo/core'
import { POST as availabilityRoute } from '@/app/api/availability/route'
import { POST as searchRoute } from '@/app/api/availability/search/route'
import { at, call, expectFail, expectOk } from '../helpers/request'
import {
    dayOffset,
    seedPromotion,
    seedRoomType,
    teardown,
    withAutoPromotionsDisabled,
    disablePromotions,
} from '../helpers/seed'

/**
 * 2 route: `POST /api/availability` (báo giá 1 hạng) · `POST /api/availability/search`.
 *
 * TEST-STRATEGY §6 nhóm "Tính giá từng đêm + khuyến mãi nhân dồn": 8 case,
 * 2 negative (`discountTotal > subtotal`, `maxDiscount` cắt trần).
 *
 * ⚠️ Mọi test tính giá TẮT khuyến mãi tự động của DB trước khi chạy. Không tắt
 * thì 7 KM seed sẵn trộn vào con số và bài "1tr × 0.9 × 0.8" không kiểm được gì.
 */

/**
 * `POST /api/availability` trả **thẳng** object `Quote` trong `data`, không bọc
 * thêm khoá `quote` — xác nhận bằng response thật, không suy từ tên biến trong
 * route. Khoá thừa duy nhất là `promotionMessages` (chuỗi giải thích cho FE).
 */
type AvailabilityBody = Quote & { promotionMessages?: unknown[] }

/*
 * ─── VÌ SAO CỬA SỔ NGÀY BẮT ĐẦU TỪ +280 ─────────────────────────────────────
 *
 * Không phải "chọn đại một ngày xa". `seasons` trong DB phủ liên tục tới
 * `2027-05-03` (`high-winter` ×1.2 / cuối tuần ×1.4, rồi `holiday-30-4` ×1.8).
 * Đặt test trong vùng đó thì `subtotal` mang thêm hệ số mùa, và bài kiểm
 * "3 đêm × 1.000.000 = 3.000.000" đỏ vì một lý do KHÔNG liên quan đến thứ đang
 * kiểm — đúng loại test giòn làm người sau mất niềm tin vào cả bộ.
 *
 * Từ `2027-05-04` trở đi không season nào phủ ⇒ hệ số = 1, tách bạch được
 * "tính theo từng đêm" khỏi "nhân hệ số mùa". Hệ số mùa có test riêng bên dưới.
 */
const FROM = dayOffset(280)
const TO = dayOffset(300)

let restorePromotions: () => Promise<void>

beforeAll(async () => {
    restorePromotions = await withAutoPromotionsDisabled()
})

afterAll(async () => {
    await restorePromotions()
    await teardown()
})

/** Thu hẹp response về `Quote` + kiểm bất biến §B1 đúng một chỗ. */
function quoteOf(data: AvailabilityBody): Quote {
    expect(data, 'Response phải là object Quote').toBeTypeOf('object')
    // Bất biến của MỌI báo giá, kiểm ở đây nên không test nào quên được:
    // `chk_bookings_money` trong DB cũng ép đúng hệ thức này.
    expect(data.totalAmount).toBe(data.subtotal - data.discountTotal)
    expect(data.discountTotal).toBeLessThanOrEqual(data.subtotal)
    return data
}

describe('POST /api/availability — tính giá theo TỪNG ĐÊM (§B3)', () => {
    it('[happy] 3 đêm giá phẳng → tiền phòng = Σ giá từng đêm, không phải giá × số đêm', async () => {
        const checkIn = dayOffset(281)
        const checkOut = dayOffset(284)
        const roomTypeId = await seedRoomType({
            label: 'flat',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
        })

        const res = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: { roomTypeId, checkIn, checkOut, guests: { adults: 2, children: [] } },
        })
        const quote = quoteOf(expectOk(res))

        expect(quote.nights).toBe(3)
        expect(quote.subtotal).toBe(3_000_000)
        expect(quote.discountTotal).toBe(0)
        expect(quote.totalAmount).toBe(3_000_000)
    })

    it('[happy] 1 đêm có priceOverride → ĐÈ HẲN, không nhân thêm (§B3 bước ③)', async () => {
        const checkIn = dayOffset(285)
        const middle = dayOffset(286)
        const checkOut = dayOffset(288)
        const roomTypeId = await seedRoomType({
            label: 'override',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
            priceOverrides: { [middle]: 2_500_000 },
        })

        const res = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: { roomTypeId, checkIn, checkOut, guests: { adults: 2, children: [] } },
        })
        const quote = quoteOf(expectOk(res))

        // 3 đêm: 1.000.000 + 2.500.000 (đè) + 1.000.000 = 4.500.000.
        // Nếu code lấy `giá × số đêm` thì ra 3.000.000 — con số này bắt được ngay.
        expect(quote.nights).toBe(3)
        expect(quote.subtotal).toBe(4_500_000)
    })

    it('[happy] RatePlan saver −15% → giá mỗi đêm giảm đúng 15% (§B3 bước ④)', async () => {
        const checkIn = dayOffset(289)
        const checkOut = dayOffset(291)
        const roomTypeId = await seedRoomType({
            label: 'rateplan',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
        })

        const base = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: {
                roomTypeId, checkIn, checkOut,
                guests: { adults: 2, children: [] },
                ratePlanId: 'standard',
            },
        })
        const saver = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: {
                roomTypeId, checkIn, checkOut,
                guests: { adults: 2, children: [] },
                ratePlanId: 'saver',
            },
        })

        const baseQuote = quoteOf(expectOk(base))
        const saverQuote = quoteOf(expectOk(saver))

        expect(baseQuote.subtotal).toBe(2_000_000)
        // `rate_plans.adjust_percent = -15` (đọc từ DB thật, không hardcode giả định).
        expect(saverQuote.subtotal).toBe(1_700_000)
    })

    it('[happy] KM nhân dồn 10% + 20% trên 1.000.000 → giảm ĐÚNG 280.000 (KHÔNG phải 300.000)', async () => {
        const checkIn = dayOffset(292)
        const checkOut = dayOffset(293)
        const roomTypeId = await seedRoomType({
            label: 'stack',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
        })

        const promoIds = [
            await seedPromotion({ label: 'p10', type: 'percent', value: 10, stackable: true, priority: 10 }),
            await seedPromotion({ label: 'p20', type: 'percent', value: 20, stackable: true, priority: 20 }),
        ]

        const res = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: { roomTypeId, checkIn, checkOut, guests: { adults: 2, children: [] } },
        })
        const quote = quoteOf(expectOk(res))

        expect(quote.subtotal).toBe(1_000_000)

        /*
         * ĐÂY LÀ CASE BẮT BUỘC của ticket.
         *   ❌ cộng % rồi trừ: 1.000.000 × 30%            = giảm 300.000
         *   ✅ cộng dồn nhân : ×0.9 = 900.000, ×0.8 = 720.000 → giảm 280.000
         * Chênh 20.000đ mỗi đơn — một mùa cao điểm là con số thật (§B4 bước ④).
         */
        expect(quote.discountTotal).toBe(280_000)
        expect(quote.totalAmount).toBe(720_000)

        // Kiểm cả từng bước trung gian — E2E chỉ thấy tổng, tầng 2 thấy dây chuyền.
        const applied = quote.promotion.applied
        expect(applied).toHaveLength(2)
        expect(at(applied, 0, 'applied').discount).toBe(100_000)
        expect(at(applied, 0, 'applied').remainingAfter).toBe(900_000)
        expect(at(applied, 1, 'applied').discount).toBe(180_000)
        expect(at(applied, 1, 'applied').remainingAfter).toBe(720_000)

        await disablePromotions(promoIds)
    })

    it('[happy] KM độc quyền (stackable=false) huỷ mọi KM khác, giữ cái priority nhỏ nhất', async () => {
        const checkIn = dayOffset(294)
        const checkOut = dayOffset(295)
        const roomTypeId = await seedRoomType({
            label: 'excl',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: FROM,
            to: TO,
        })

        const promoIds = [
            await seedPromotion({ label: 'ex5', type: 'percent', value: 5, stackable: false, priority: 5 }),
            await seedPromotion({ label: 'ex50', type: 'percent', value: 50, stackable: true, priority: 50 }),
        ]

        const res = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: { roomTypeId, checkIn, checkOut, guests: { adults: 2, children: [] } },
        })
        const quote = quoteOf(expectOk(res))

        // Chỉ KM độc quyền priority=5 được áp ⇒ giảm 5%, KHÔNG cộng thêm 50%.
        expect(quote.promotion.applied).toHaveLength(1)
        expect(quote.discountTotal).toBe(50_000)

        await disablePromotions(promoIds)
    })

    it('[negative] discountTotal KHÔNG BAO GIỜ vượt subtotal, kể cả KM fixed lớn hơn đơn', async () => {
        const checkIn = dayOffset(296)
        const checkOut = dayOffset(297)
        const roomTypeId = await seedRoomType({
            label: 'overshoot',
            basePrice: 500_000,
            totalUnits: 5,
            from: dayOffset(296),
            to: dayOffset(298),
        })

        // KM giảm cứng 9.000.000đ trên một đơn chỉ 500.000đ.
        const promoIds = [
            await seedPromotion({ label: 'huge', type: 'fixed', value: 9_000_000, stackable: true, priority: 10 }),
        ]

        const res = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: { roomTypeId, checkIn, checkOut, guests: { adults: 2, children: [] } },
        })
        const quote = quoteOf(expectOk(res))

        expect(quote.subtotal).toBe(500_000)
        expect(quote.discountTotal).toBeLessThanOrEqual(quote.subtotal)
        // totalAmount âm là tiền hoàn cho khách — bất biến của §B1.
        expect(quote.totalAmount).toBeGreaterThanOrEqual(0)

        await disablePromotions(promoIds)
    })

    it('[negative] maxDiscount cắt đúng trần: "giảm 50% nhưng tối đa 200.000"', async () => {
        const checkIn = dayOffset(298)
        const checkOut = dayOffset(299)
        const roomTypeId = await seedRoomType({
            label: 'cap',
            basePrice: 2_000_000,
            totalUnits: 5,
            from: dayOffset(298),
            to: dayOffset(300),
        })

        const promoIds = [
            await seedPromotion({
                label: 'capped',
                type: 'percent',
                value: 50,
                stackable: true,
                priority: 10,
                maxDiscount: 200_000,
            }),
        ]

        const res = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: { roomTypeId, checkIn, checkOut, guests: { adults: 2, children: [] } },
        })
        const quote = quoteOf(expectOk(res))

        // 50% của 2.000.000 = 1.000.000, nhưng trần là 200.000.
        expect(quote.discountTotal).toBe(200_000)
        expect(at(quote.promotion.applied, 0, 'applied').cappedByMax).toBe(true)

        await disablePromotions(promoIds)
    })

    it('[happy] Season nhân hệ số mùa + cuối tuần (§B3 bước ②)', async () => {
        // `high-winter` (2026-12-01 → 2027-04-30): multiplier 1.2, cuối tuần 1.4.
        // Chọn Thứ Hai → Thứ Ba (2 đêm trong tuần) để tách hệ số mùa khỏi hệ số
        // cuối tuần: cả 2 đêm đều ×1.2.
        const checkIn = '2027-01-04' // Thứ Hai
        const checkOut = '2027-01-06' // Thứ Tư ⇒ 2 đêm: T2, T3
        const roomTypeId = await seedRoomType({
            label: 'season',
            basePrice: 1_000_000,
            totalUnits: 5,
            from: '2027-01-03',
            to: '2027-01-08',
        })

        const res = await call<AvailabilityBody>(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: { roomTypeId, checkIn, checkOut, guests: { adults: 2, children: [] } },
        })
        const quote = quoteOf(expectOk(res))

        // 2 đêm × 1.000.000 × 1.2 = 2.400.000. Hệ số mùa đọc từ bảng `seasons`
        // thật, không phải hằng số trong test.
        expect(quote.nights).toBe(2)
        expect(quote.subtotal).toBe(2_400_000)
    })

    it('[negative] ngày trả ≤ ngày nhận → 400 INVALID_DATE_RANGE', async () => {
        const roomTypeId = await seedRoomType({
            label: 'baddate',
            basePrice: 1_000_000,
            totalUnits: 2,
            from: dayOffset(300),
            to: dayOffset(302),
        })

        const res = await call(availabilityRoute, '/api/availability', {
            method: 'POST',
            json: {
                roomTypeId,
                checkIn: dayOffset(301),
                checkOut: dayOffset(301),
                guests: { adults: 2, children: [] },
            },
        })
        expectFail(res, 400, 'INVALID_DATE_RANGE')
    })
})

describe('POST /api/availability/search — tìm nhiều hạng phòng', () => {
    it('[happy] trả về hạng phòng test kèm giá đã tính cho đúng khoảng ngày', async () => {
        const checkIn = dayOffset(310)
        const checkOut = dayOffset(312)
        const roomTypeId = await seedRoomType({
            label: 'search',
            basePrice: 1_500_000,
            totalUnits: 3,
            from: dayOffset(309),
            to: dayOffset(314),
        })

        const res = await call<{ rooms: Array<{ room: { id: string }; availability: { available: boolean; roomTotal: number } }> }>(
            searchRoute,
            '/api/availability/search',
            {
                method: 'POST',
                json: { checkIn, checkOut, guests: { adults: 2, children: [] } },
            },
        )
        const data = expectOk(res)
        const mine = data.rooms.find((r) => r.room.id === roomTypeId)

        expect(mine, 'Hạng phòng test phải có trong kết quả tìm kiếm').toBeDefined()
        expect(mine?.availability.available).toBe(true)
        // 2 đêm × 1.500.000 — giá của đúng khoảng ngày, không phải giá niêm yết.
        expect(mine?.availability.roomTotal).toBe(3_000_000)
    })

    it('[negative] ngày sai định dạng → 400 INVALID_INPUT', async () => {
        const res = await call(searchRoute, '/api/availability/search', {
            method: 'POST',
            json: { checkIn: '20/08/2026', checkOut: '22/08/2026', guests: { adults: 2 } },
        })
        expectFail(res, 400, 'INVALID_INPUT')
    })

    it('[negative] hết phòng (totalUnits đã bị block hết) → hạng đó available=false, có blockedReason', async () => {
        const checkIn = dayOffset(315)
        const checkOut = dayOffset(316)
        const roomTypeId = await seedRoomType({
            label: 'soldout',
            basePrice: 1_000_000,
            totalUnits: 1,
            from: dayOffset(314),
            to: dayOffset(318),
        })

        // Chặn nốt phòng cuối bằng blocked_units — đúng cách lễ tân đóng phòng.
        const { adminDb } = await import('../helpers/seed')
        const { error } = await adminDb()
            .from('inventory')
            .update({ blocked_units: 1 })
            .eq('room_type_id', roomTypeId)
            .eq('date', checkIn)
        expect(error).toBeNull()

        const res = await call<{ rooms: Array<{ room: { id: string }; availability: { available: boolean; blockedReason?: string } }> }>(
            searchRoute,
            '/api/availability/search',
            {
                method: 'POST',
                json: { checkIn, checkOut, guests: { adults: 2, children: [] } },
            },
        )
        const data = expectOk(res)
        const mine = data.rooms.find((r) => r.room.id === roomTypeId)

        expect(mine?.availability.available).toBe(false)
        // FE7: trạng thái rỗng phải nói được LÝ DO, không chỉ "không có kết quả".
        expect(mine?.availability.blockedReason).toBe('sold-out')
    })
})
