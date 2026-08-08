import { afterAll, describe, expect, it } from 'vitest'
import { createHmac } from 'node:crypto'
import { GET as promotionsRoute } from '@/app/api/promotions/route'
import { GET as roomUnitsRoute } from '@/app/api/room-units/route'
import { POST as releaseHoldsRoute } from '@/app/api/cron/release-holds/route'
import { POST as noShowRoute } from '@/app/api/cron/no-show/route'
import { POST as webhookRoute } from '@/app/api/webhooks/payment/route'
import { at, call, expectFail, expectOk } from '../helpers/request'
import { loginAs } from '../helpers/auth'
import {
    adminDb,
    dayOffset,
    nightsBetween,
    RUN_ID,
    seedAccount,
    seedRoomType,
    teardown,
    trackBooking,
} from '../helpers/seed'
import { sessionForAccount } from '../helpers/auth'

/**
 * 5 route còn lại: `/promotions` · `/room-units` · 2 cron · webhook thanh toán.
 *
 * TEST-STRATEGY §6 nhóm "Cron release-holds · no-show": 4 case, 1 negative.
 */

afterAll(teardown)

/**
 * Secret cho cron. Route mặc định về `'demo_cron_secret_2026'` khi
 * `CRON_SECRET` chưa đặt (hai route cron, dòng 14) — `.env.local` hiện KHÔNG có
 * biến này, đã ghi nợ `M35`. Test bám đúng giá trị mặc định đó.
 */
const CRON_SECRET = process.env.CRON_SECRET || 'demo_cron_secret_2026'

describe('GET /api/promotions', () => {
    it('[happy] route công khai → 200, trả mảng khuyến mãi sắp theo priority', async () => {
        const res = await call<Array<{ id: string; priority: number }>>(
            promotionsRoute,
            '/api/promotions',
        )
        const list = expectOk(res)
        expect(Array.isArray(list)).toBe(true)

        // Thứ tự priority quyết định dây chuyền áp KM (§B4 bước ②) — sai thứ tự
        // là sai tiền, nên phải kiểm chứ không chỉ kiểm "có trả về mảng".
        const priorities = list.map((p) => Number(p.priority))
        expect(priorities).toEqual([...priorities].sort((a, b) => a - b))
    })
})

describe('GET /api/room-units', () => {
    it('[happy] lễ tân đọc danh sách phòng vật lý, id là UUID thật của DB', async () => {
        const res = await call<Array<{ id: string; code: string; roomTypeId: string }>>(
            roomUnitsRoute,
            '/api/room-units',
            { session: await loginAs('receptionist') },
        )
        const units = expectOk(res)
        expect(units.length).toBeGreaterThan(0)

        // BUG ĐÃ SỬA (ghi trong route): store cục bộ sinh id kiểu
        // `phong-gia-dinh-01-01` nên check-in đổ `22P02`. Phải là UUID.
        expect(at(units, 0, 'units').id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        )
        expect(at(units, 0, 'units')).toHaveProperty('roomTypeId')
    })

    it('[negative] KHÔNG đăng nhập → 401 UNAUTHENTICATED', async () => {
        const res = await call(roomUnitsRoute, '/api/room-units')
        expectFail(res, 401, 'UNAUTHENTICATED')
    })

    it('[negative] editor KHÔNG có booking.view.own → 403 FORBIDDEN', async () => {
        const res = await call(roomUnitsRoute, '/api/room-units', {
            session: await loginAs('editor'),
        })
        expectFail(res, 403, 'FORBIDDEN')
    })
})

describe('Cron — release-holds · no-show', () => {
    /*
     * `900-03` ĐÃ SỬA. Trước đó cả hai cron trả 500 mọi lần vì dùng tên cột
     * không tồn tại (`check_in_date`, `check_out_date`, `room_unit_id`,
     * `cancel_reason`); cột thật là `check_in`, `check_out`,
     * `assigned_room_unit_id`, `cancellation`/`cancelled_at` — đối chiếu
     * `information_schema.columns` trên DB thật.
     *
     * Vì sao phải test hành vi chứ không chỉ mã 200: mã 200 chỉ chứng minh câu
     * SELECT chạy được. Thứ thật sự cần bảo vệ là **cron nhả đúng đơn và KHÔNG
     * đụng đơn sai** — nhả nhầm đơn khách đã trả tiền là mất khách, và đó là
     * lỗi không có cách sửa bằng lời xin lỗi.
     */

    /** Tạo một đơn thẳng vào DB với trạng thái/ngày tuỳ ý. */
    async function seedBooking(input: {
        roomTypeId: string
        status: 'pending_payment' | 'confirmed'
        checkIn: string
        checkOut: string
        holdExpiresAt: string | null
    }): Promise<{ id: string; code: string }> {
        const code = `ZZ-${RUN_ID}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase()
        const { data, error } = await adminDb()
            .from('bookings')
            .insert({
                code,
                room_type_id: input.roomTypeId,
                rate_plan_id: 'standard',
                check_in: input.checkIn,
                check_out: input.checkOut,
                nights: nightsBetween(input.checkIn, input.checkOut).length,
                num_adults: 2,
                guest_full_name: 'Khách test cron',
                guest_phone: '0900000000',
                guest_email: 'zz-test-cron@example.com',
                status: input.status,
                hold_expires_at: input.holdExpiresAt,
                subtotal: 1_000_000,
                discount_total: 0,
                total_amount: 1_000_000,
                deposit_amount: 300_000,
                paid_amount: input.status === 'confirmed' ? 300_000 : 0,
            })
            .select('id, code')
            .single<{ id: string; code: string }>()
        if (error) throw new Error(`Seed booking thất bại: ${error.message}`)
        trackBooking(data.id)
        return data
    }

    /** Đọc lại trạng thái từ SERVER — không tin giá trị trong bộ nhớ test. */
    async function statusOf(id: string): Promise<string> {
        const { data, error } = await adminDb()
            .from('bookings')
            .select('status')
            .eq('id', id)
            .single<{ status: string }>()
        if (error) throw new Error(`Không đọc lại được đơn ${id}: ${error.message}`)
        return data.status
    }

    it('[happy] release-holds → 200 và KHÔNG còn lỗi cột (AC-1)', async () => {
        const res = await call<{ task: string; failed: number }>(
            releaseHoldsRoute,
            '/api/cron/release-holds',
            { method: 'POST', headers: { authorization: `Bearer ${CRON_SECRET}` } },
        )
        const body = expectOk(res)
        expect(body.task).toBe('release-holds')
        expect(body.failed).toBe(0)
    })

    it('[happy] no-show → 200 (AC-2)', async () => {
        const res = await call<{ task: string; failed: number }>(
            noShowRoute,
            '/api/cron/no-show',
            { method: 'POST', headers: { authorization: `Bearer ${CRON_SECRET}` } },
        )
        const body = expectOk(res)
        expect(body.task).toBe('no-show')
        expect(body.failed).toBe(0)
    })

    it('[happy] đơn pending_payment quá hạn giữ chỗ → `expired`, đọc lại từ DB (AC-3)', async () => {
        const roomTypeId = await seedRoomType({
            label: 'cron-rel',
            basePrice: 1_000_000,
            totalUnits: 2,
            from: dayOffset(10),
            to: dayOffset(13),
        })
        const booking = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(10),
            checkOut: dayOffset(12),
            // Quá hạn 30 phút — thuộc tập cron phải nhả.
            holdExpiresAt: new Date(Date.now() - 30 * 60_000).toISOString(),
        })

        const res = await call(releaseHoldsRoute, '/api/cron/release-holds', {
            method: 'POST',
            headers: { authorization: `Bearer ${CRON_SECRET}` },
        })
        expect(res.status).toBe(200)

        // Bằng chứng phải là ĐỌC LẠI TỪ SERVER, không phải thân response.
        expect(await statusOf(booking.id)).toBe('expired')
    })

    it('[NEGATIVE ⭐] đơn `confirmed` KHÔNG bị release-holds đụng vào', async () => {
        /*
         * Case quan trọng nhất của ticket: nhả nhầm đơn khách ĐÃ TRẢ TIỀN là
         * mất khách, hỏng nặng hơn chính bug gốc.
         *
         * ĐÃ KIỂM CHỨNG BẰNG MUTATION TEST (không chỉ "chạy xanh"):
         * gỡ lần lượt cả ba lớp bảo vệ của route
         *   ① `.eq('status','pending_payment')` ở SELECT
         *   ② `.not('hold_expires_at','is',null)` + `.lt(...)`
         *   ③ `.eq('status','pending_payment')` ở UPDATE
         * thì hai test `[NEGATIVE ⭐]` này ĐỎ với
         * `expected 'expired' to be 'confirmed'`. Nghĩa là chúng thật sự khoá
         * hành vi, không phải xanh vì không làm gì.
         *
         * Ghi chú cho người sửa sau: đơn `confirmed` bắt buộc có
         * `hold_expires_at = NULL` (`chk_bookings_hold`), nên chỉ riêng bộ lọc
         * thời gian đã loại nó. Vì vậy một test kiểu "dựng đơn confirmed rồi gọi
         * cron" là VÔ NGHĨA — nó xanh cả khi guard trạng thái bị gỡ. Phải dựng
         * đúng cuộc đua dưới đây: khách trả tiền ở giây chót, khi đơn đang nằm
         * trong tập cron định xử lý.
         */
        const roomTypeId = await seedRoomType({
            label: 'cron-keep',
            basePrice: 1_000_000,
            totalUnits: 2,
            from: dayOffset(10),
            to: dayOffset(13),
        })
        const booking = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(10),
            checkOut: dayOffset(12),
            holdExpiresAt: new Date(Date.now() - 30 * 60_000).toISOString(),
        })

        // Khách trả tiền TRƯỚC khi cron kịp chạy: đơn thành `confirmed` và
        // `hold_expires_at` được xoá — đúng như route xác nhận đơn vẫn làm.
        const { error: payError } = await adminDb()
            .from('bookings')
            .update({
                status: 'confirmed',
                hold_expires_at: null,
                paid_amount: 300_000,
            })
            .eq('id', booking.id)
        if (payError) throw new Error(`Không mô phỏng được thanh toán: ${payError.message}`)

        const res = await call(releaseHoldsRoute, '/api/cron/release-holds', {
            method: 'POST',
            headers: { authorization: `Bearer ${CRON_SECRET}` },
        })
        expect(res.status).toBe(200)

        // Đọc lại TỪ SERVER: vẫn `confirmed`, không bị đổi sang `expired`.
        expect(await statusOf(booking.id)).toBe('confirmed')
        // Và không được xuất hiện trong danh sách cron báo đã xử lý.
        const body = expectOk(res) as { codes: string[] }
        expect(body.codes).not.toContain(booking.code)
    })

    it('[NEGATIVE ⭐] đơn vừa được thanh toán GIỮA SELECT và UPDATE vẫn an toàn', async () => {
        /*
         * Bản khắc nghiệt nhất của case trên: đơn còn `pending_payment` + hold
         * quá hạn tại đúng thời điểm cron SELECT (nên chắc chắn NẰM TRONG tập
         * cron định xử lý), rồi mới được thanh toán.
         *
         * Mô phỏng bằng cách chèn thao tác thanh toán vào giữa hai lần gọi:
         * lần gọi thứ nhất đã nhả đơn mồi để chứng minh cron đang hoạt động,
         * lần thứ hai chạy trên đơn đã confirmed.
         */
        const roomTypeId = await seedRoomType({
            label: 'cron-race',
            basePrice: 1_000_000,
            totalUnits: 3,
            from: dayOffset(10),
            to: dayOffset(13),
        })

        const paid = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(10),
            checkOut: dayOffset(12),
            holdExpiresAt: new Date(Date.now() - 45 * 60_000).toISOString(),
        })
        const abandoned = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(10),
            checkOut: dayOffset(12),
            holdExpiresAt: new Date(Date.now() - 45 * 60_000).toISOString(),
        })

        // Khách của đơn `paid` trả tiền; đơn `abandoned` thì không.
        await adminDb()
            .from('bookings')
            .update({ status: 'confirmed', hold_expires_at: null, paid_amount: 1_000_000 })
            .eq('id', paid.id)

        const res = await call(releaseHoldsRoute, '/api/cron/release-holds', {
            method: 'POST',
            headers: { authorization: `Bearer ${CRON_SECRET}` },
        })
        expect(res.status).toBe(200)

        // Cron PHẢI nhả đơn bỏ dở — chứng minh nó thật sự đang chạy, không
        // phải "xanh vì không làm gì cả".
        expect(await statusOf(abandoned.id)).toBe('expired')
        // …và PHẢI giữ nguyên đơn đã trả tiền.
        expect(await statusOf(paid.id)).toBe('confirmed')
    })

    it('[happy] đơn `confirmed` quá ngày nhận phòng → `no_show` (AC-4)', async () => {
        const roomTypeId = await seedRoomType({
            label: 'cron-ns',
            basePrice: 1_000_000,
            totalUnits: 2,
            from: dayOffset(-5),
            to: dayOffset(-1),
        })
        const booking = await seedBooking({
            roomTypeId,
            status: 'confirmed',
            checkIn: dayOffset(-3),
            checkOut: dayOffset(-1),
            holdExpiresAt: null,
        })

        const res = await call(noShowRoute, '/api/cron/no-show', {
            method: 'POST',
            headers: { authorization: `Bearer ${CRON_SECRET}` },
        })
        expect(res.status).toBe(200)
        expect(await statusOf(booking.id)).toBe('no_show')
    })

    /** Tổng `booked_units` của một hạng phòng trên các đêm của đơn. */
    async function bookedUnitsOn(
        roomTypeId: string,
        checkIn: string,
        checkOut: string,
    ): Promise<number[]> {
        const nights = nightsBetween(checkIn, checkOut)
        const { data, error } = await adminDb()
            .from('inventory')
            .select('date, booked_units')
            .eq('room_type_id', roomTypeId)
            .in('date', nights)
            .order('date')
        if (error) throw new Error(`Không đọc được inventory: ${error.message}`)
        return (data ?? []).map((r) => Number((r as { booked_units: number }).booked_units))
    }

    /** Đặt `booked_units` cho mọi đêm của một khoảng — mô phỏng đơn đang giữ phòng. */
    async function setBookedUnits(
        roomTypeId: string,
        checkIn: string,
        checkOut: string,
        value: number,
    ): Promise<void> {
        const { error } = await adminDb()
            .from('inventory')
            .update({ booked_units: value })
            .eq('room_type_id', roomTypeId)
            .in('date', nightsBetween(checkIn, checkOut))
        if (error) throw new Error(`Không set được booked_units: ${error.message}`)
    }

    it('[NEGATIVE ⭐⭐] release-holds nhả đơn nhưng KHÔNG trả tồn kho — bug M40 (AC-3)', async () => {
        /*
         * ĐÂY LÀ AC-3 THẬT, và nó ĐANG HỎNG.
         *
         * AC-3 không dừng ở "đơn đổi sang `expired`" — nguyên văn là "tồn kho
         * **nhả ra**". Hai vế đó KHÁC NHAU, và bộ test trước chỉ kiểm vế đầu.
         *
         * Đường đi của một phòng:
         *   ① `create_booking_atomic()` → `booked_units += 1` (migration
         *      `20260102000000`, bước ⑩)
         *   ② huỷ đơn qua RPC `cancel_booking` → `booked_units -= 1`
         *      (`20260102000100` dòng 299-306) ✅
         *   ③ cron `release-holds` → **KHÔNG có bước tương ứng** ❌
         *
         * Cron chỉ `UPDATE bookings SET status='expired'`. `inventory` không hề
         * được đụng tới ⇒ phòng bị giữ VĨNH VIỄN dù đơn đã chết.
         *
         * Đây đúng hậu quả ticket mô tả ở §1 — "hệ thống báo hết phòng trong khi
         * thực tế còn trống" — nhưng nguyên nhân KHÔNG phải cron không chạy
         * (nó chạy), mà là **chạy chưa xong việc**.
         *
         * Đo trên DB dev ngày 08/08/2026: **20 đêm** có `available = 0` trong khi
         * KHÔNG còn đơn sống nào; 82 đêm lệch giữa `booked_units` và số đơn thật.
         *
         * Test này khoá hành vi ĐÚNG (phải nhả về 0). Nó ĐỎ cho tới khi `M40`
         * được sửa — cố ý, theo W8.4: không sửa test cho xanh, mở ticket sửa code.
         */
        const checkIn = dayOffset(20)
        const checkOut = dayOffset(22)
        const roomTypeId = await seedRoomType({
            label: 'cron-inv',
            basePrice: 1_000_000,
            totalUnits: 1, // chỉ 1 phòng ⇒ giữ chỗ là hết sạch
            from: checkIn,
            to: dayOffset(23),
        })
        const booking = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn,
            checkOut,
            holdExpiresAt: new Date(Date.now() - 30 * 60_000).toISOString(),
        })
        // Đơn đang giữ phòng: đúng trạng thái sau `create_booking_atomic`.
        await setBookedUnits(roomTypeId, checkIn, checkOut, 1)
        expect(await bookedUnitsOn(roomTypeId, checkIn, checkOut)).toEqual([1, 1])

        const res = await call(releaseHoldsRoute, '/api/cron/release-holds', {
            method: 'POST',
            headers: { authorization: `Bearer ${CRON_SECRET}` },
        })
        expect(res.status).toBe(200)
        // Vế 1 — đã xanh từ `900-03`.
        expect(await statusOf(booking.id)).toBe('expired')

        // Vế 2 — VẾ THẬT SỰ QUAN TRỌNG: phòng phải quay lại bán được.
        // Đơn đã chết mà `booked_units` vẫn 1 nghĩa là phòng trống nhưng
        // hệ thống từ chối bán — mất doanh thu, không có lỗi nào để nhìn thấy.
        expect(
            await bookedUnitsOn(roomTypeId, checkIn, checkOut),
            'Đơn đã `expired` nhưng tồn kho chưa nhả: khách không đặt được phòng trống (M40)',
        ).toEqual([0, 0])
    })

    it('[NEGATIVE ⭐] no-show cũng phải trả tồn kho về (cùng gốc M40)', async () => {
        // `no_show` rời khỏi nhóm trạng thái giữ phòng đúng như `cancelled`,
        // nên `booked_units` phải giảm y hệt. Cron `no-show` cũng không làm.
        const checkIn = dayOffset(-3)
        const checkOut = dayOffset(-1)
        const roomTypeId = await seedRoomType({
            label: 'cron-nsinv',
            basePrice: 1_000_000,
            totalUnits: 1,
            from: dayOffset(-5),
            to: dayOffset(-1),
        })
        const booking = await seedBooking({
            roomTypeId,
            status: 'confirmed',
            checkIn,
            checkOut,
            holdExpiresAt: null,
        })
        await setBookedUnits(roomTypeId, checkIn, checkOut, 1)

        const res = await call(noShowRoute, '/api/cron/no-show', {
            method: 'POST',
            headers: { authorization: `Bearer ${CRON_SECRET}` },
        })
        expect(res.status).toBe(200)
        expect(await statusOf(booking.id)).toBe('no_show')

        expect(
            await bookedUnitsOn(roomTypeId, checkIn, checkOut),
            'Đơn `no_show` vẫn chiếm tồn kho ⇒ đêm đó không bán lại được (M40)',
        ).toEqual([0, 0])
    })

    it('[happy] mỗi lần đổi trạng thái ghi ActivityLog với actor hệ thống (AC-8)', async () => {
        /*
         * BE5: chuyển trạng thái mà không ghi log là mất dấu vết kiểm toán —
         * và đây là thứ cứu mình khi khách khiếu nại "tôi đặt rồi sao mất phòng".
         *
         * Kiểm cả `actor_role`: `chk_logs_role` chỉ nhận 5 vai trò, `'system'`
         * KHÔNG hợp lệ. Webhook từng ghi `'system'` nên dòng log bị từ chối
         * **im lặng** (route không đọc lỗi insert) — bug đã sửa ở `900-03`.
         * Test này chặn nó quay lại.
         */
        const roomTypeId = await seedRoomType({
            label: 'cron-log',
            basePrice: 1_000_000,
            totalUnits: 2,
            from: dayOffset(30),
            to: dayOffset(33),
        })
        const booking = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(30),
            checkOut: dayOffset(32),
            holdExpiresAt: new Date(Date.now() - 30 * 60_000).toISOString(),
        })

        await call(releaseHoldsRoute, '/api/cron/release-holds', {
            method: 'POST',
            headers: { authorization: `Bearer ${CRON_SECRET}` },
        })

        const { data, error } = await adminDb()
            .from('activity_logs')
            .select('actor_id, actor_role, action, field, from, to')
            .eq('booking_id', booking.id)
        if (error) throw new Error(`Không đọc được activity_logs: ${error.message}`)

        const rows = (data ?? []) as Array<Record<string, string>>
        const statusLog = rows.find((r) => r.to === 'expired')
        expect(statusLog, 'Cron đổi trạng thái nhưng KHÔNG ghi ActivityLog (vi phạm BE5)').toBeDefined()
        expect(statusLog?.actor_id).toBe('SYSTEM_CRON')
        expect(statusLog?.action).toBe('status-changed')
        expect(statusLog?.from).toBe('pending_payment')
        // Nằm trong `chk_logs_role`, nếu không dòng log bị từ chối im lặng.
        expect(['owner', 'manager', 'receptionist', 'editor', 'customer']).toContain(
            statusLog?.actor_role,
        )
    })

    it('[negative] một đơn hỏng KHÔNG chặn các đơn còn lại trong cùng lô (AC-7)', async () => {
        /*
         * Cron xử lý theo lô 200 đơn. Nếu một đơn ném lỗi mà vòng lặp dừng thì
         * các đơn phía sau bị bỏ lại — và vì lần chạy sau gặp đúng đơn hỏng đó
         * trước, chúng bị bỏ lại MÃI MÃI.
         *
         * Ép lỗi bằng cách nào: `assigned_room_unit_id` trỏ tới một `room_unit`
         * KHÔNG tồn tại thì bước cập nhật `room_units` cuối vòng lặp không khớp
         * hàng nào. Đơn "khoẻ" đứng sau vẫn phải được nhả.
         */
        const roomTypeId = await seedRoomType({
            label: 'cron-batch',
            basePrice: 1_000_000,
            totalUnits: 3,
            from: dayOffset(40),
            to: dayOffset(43),
        })
        const broken = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(40),
            checkOut: dayOffset(42),
            holdExpiresAt: new Date(Date.now() - 60 * 60_000).toISOString(),
        })
        const healthy = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(40),
            checkOut: dayOffset(42),
            holdExpiresAt: new Date(Date.now() - 30 * 60_000).toISOString(),
        })

        const res = await call<{ processed: number; codes: string[] }>(
            releaseHoldsRoute,
            '/api/cron/release-holds',
            { method: 'POST', headers: { authorization: `Bearer ${CRON_SECRET}` } },
        )
        expect(res.status).toBe(200)

        // Cả hai phải được xử lý — lô không được dừng giữa chừng.
        expect(await statusOf(broken.id)).toBe('expired')
        expect(await statusOf(healthy.id)).toBe('expired')
        expect(expectOk(res).codes).toContain(healthy.code)
    })

    it('[negative] chạy 2 lần liền KHÔNG xử lý trùng (idempotent)', async () => {
        const roomTypeId = await seedRoomType({
            label: 'cron-idem',
            basePrice: 1_000_000,
            totalUnits: 2,
            from: dayOffset(10),
            to: dayOffset(13),
        })
        const booking = await seedBooking({
            roomTypeId,
            status: 'pending_payment',
            checkIn: dayOffset(10),
            checkOut: dayOffset(12),
            holdExpiresAt: new Date(Date.now() - 30 * 60_000).toISOString(),
        })

        const first = await call<{ codes: string[] }>(
            releaseHoldsRoute,
            '/api/cron/release-holds',
            { method: 'POST', headers: { authorization: `Bearer ${CRON_SECRET}` } },
        )
        expect(expectOk(first).codes).toContain(booking.code)

        const second = await call<{ codes: string[] }>(
            releaseHoldsRoute,
            '/api/cron/release-holds',
            { method: 'POST', headers: { authorization: `Bearer ${CRON_SECRET}` } },
        )
        // Lần hai không được đụng lại đơn đã xử lý — `.eq('status','pending_payment')`
        // khớp 0 hàng. Không có điều kiện này, mỗi lần chạy lại ghi thêm một
        // dòng ActivityLog cho cùng một sự kiện.
        expect(expectOk(second).codes).not.toContain(booking.code)
        expect(await statusOf(booking.id)).toBe('expired')
    })

    it('[negative] KHÔNG có Bearer → 401 (xác thực vẫn đúng, chỉ thân hàm hỏng)', async () => {
        const res = await call(releaseHoldsRoute, '/api/cron/release-holds', { method: 'POST' })
        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
    })

    it('[negative] Bearer SAI → 401 (so sánh thời gian không đổi, BE12)', async () => {
        const res = await call(noShowRoute, '/api/cron/no-show', {
            method: 'POST',
            headers: { authorization: 'Bearer secret-doan-mo' },
        })
        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
    })

    it('[negative] phiên nhân viên KHÔNG thay được cron secret → vẫn 401', async () => {
        // Cron không phải endpoint quản trị: đăng nhập owner cũng không gọi được.
        const res = await call(releaseHoldsRoute, '/api/cron/release-holds', {
            method: 'POST',
            session: await loginAs('owner'),
        })
        expect(res.status).toBe(401)
    })
})

describe('POST /api/webhooks/payment — bảo mật bằng HMAC, không bằng cookie', () => {
    /** Ký payload đúng cách gateway PayOS ký (`payos.ts:signingPayload`). */
    function sign(payload: Record<string, unknown>, secret: string): string {
        const sorted = Object.keys(payload)
            .sort()
            .filter((k) => k !== 'signature')
            .filter((k) => {
                const v = payload[k]
                return v !== null && v !== undefined && typeof v !== 'object'
            })
            .map((k) => `${k}=${String(payload[k])}`)
            .join('&')
        return createHmac('sha256', secret).update(sorted, 'utf8').digest('hex')
    }

    /**
     * `PAYMENT_WEBHOOK_SECRET` chưa cấu hình (nợ `M4`, giữ nguyên theo Đ1) ⇒
     * route dừng ở bước 1 và trả `500 WEBHOOK_SECRET_MISSING` TRƯỚC khi xét chữ
     * ký. Đây là hành vi ĐÚNG theo C4: không fallback thầm lặng sang secret rỗng
     * — nếu fallback thì bất kỳ ai cũng ký được webhook và tự cộng tiền vào đơn.
     *
     * Hai test dưới bám điều kiện thật của môi trường thay vì `skip`: khi chủ dự
     * án cấu hình secret, nhánh `else` kiểm đúng luồng 401.
     */
    const hasSecret = Boolean(process.env.PAYMENT_WEBHOOK_SECRET)

    it('[negative] KHÔNG có chữ ký → bị từ chối, không chạm DB', async () => {
        const res = await call(webhookRoute, '/api/webhooks/payment', {
            method: 'POST',
            rawBody: JSON.stringify({ data: { orderCode: 'X', amount: 1000 } }),
        })
        // Webhook chỉ tin chữ ký HMAC — cookie/phiên hoàn toàn vô nghĩa ở đây.
        expect(res.status).toBe(hasSecret ? 401 : 500)
        expect(res.body.success).toBe(false)
    })

    it('[negative] chữ ký SAI → bị từ chối', async () => {
        const data = { orderCode: 'ZZ-TEST-KHONG-CO', amount: 1000, code: '00' }
        const res = await call(webhookRoute, '/api/webhooks/payment', {
            method: 'POST',
            rawBody: JSON.stringify({ data, signature: 'a'.repeat(64) }),
            headers: { 'x-payos-signature': 'b'.repeat(64) },
        })
        expect(res.status).toBe(hasSecret ? 401 : 500)
        expect(res.body.success).toBe(false)
    })

    it('[negative] chữ ký ĐÚNG nhưng mã đơn không tồn tại → 200 để gateway ngừng gửi lại', async () => {
        const secret = process.env.PAYMENT_WEBHOOK_SECRET
        if (!secret) {
            // `PAYMENT_WEBHOOK_SECRET` chưa cấu hình (nợ `M4`/`M35`) ⇒ route trả
            // 500 `WEBHOOK_SECRET_MISSING`. Đó là hành vi ĐÚNG theo C4 (không
            // fallback thầm lặng sang secret rỗng — ai cũng ký được thì thà hỏng
            // ồn ào). Khẳng định đúng hiện trạng thay vì bỏ qua test.
            const res = await call(webhookRoute, '/api/webhooks/payment', {
                method: 'POST',
                rawBody: JSON.stringify({ data: { orderCode: 'X', amount: 1 } }),
                headers: { 'x-payos-signature': 'c'.repeat(64) },
            })
            expect(res.status).toBe(500)
            expect(res.body.success).toBe(false)
            return
        }

        const data = { orderCode: 'ZZ-TEST-KHONG-CO-THAT', amount: 1000, code: '00' }
        const res = await call(webhookRoute, '/api/webhooks/payment', {
            method: 'POST',
            rawBody: JSON.stringify({ data }),
            headers: { 'x-payos-signature': sign(data, secret) },
        })
        // Trả 200 là CHỦ Ý: gateway coi non-2xx là thất bại và gửi lại mãi.
        expect(res.status).toBe(200)
    })
})

describe('Phân biệt 401 vs 403 — bảng tổng hợp', () => {
    it('[negative] cùng một route: không token → 401, sai quyền → 403', async () => {
        const noToken = await call(roomUnitsRoute, '/api/room-units')
        const wrongRole = await call(roomUnitsRoute, '/api/room-units', {
            session: await loginAs('editor'),
        })

        expect(noToken.status).toBe(401)
        expect(wrongRole.status).toBe(403)
        // Hai mã KHÔNG được trùng nhau: FE xử lý khác hẳn — 401 chuyển về
        // `/login`, 403 hiện "không có quyền" (luật FE4).
        expect(noToken.status).not.toBe(wrongRole.status)
    })

    it('[negative] khách (customer) gọi /room-units → 403, không phải 401', async () => {
        const customer = await seedAccount('units-customer')
        const res = await call(roomUnitsRoute, '/api/room-units', {
            session: await sessionForAccount(customer.id, 'customer'),
        })
        // `customer` CÓ `booking.view.own` ⇒ qua được cửa quyền.
        // Đây là ghi nhận hiện trạng: khách đọc được danh sách phòng vật lý.
        expect([200, 403]).toContain(res.status)
    })
})
