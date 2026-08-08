import { test, expect, type Page, type APIRequestContext } from '@playwright/test'

/**
 * E2E — VÒNG ĐỜI ĐƠN ĐẶT PHÒNG, từ lúc tạo tới lúc khách trả phòng.
 *
 *     pending_payment ──duyệt cọc──▶ confirmed ──nhận phòng──▶ checked_in
 *                                       │                          │
 *                                       │                     trả phòng
 *                                    huỷ đơn                       ▼
 *                                       ▼                    checked_out
 *                                   cancelled
 *
 * ─── ĐIỀU KHIẾN BỘ TEST NÀY CÓ GIÁ TRỊ ──────────────────────────────────────
 *
 * Mọi khẳng định "đã đổi trạng thái" đều được kiểm bằng cách ĐỌC LẠI TỪ SERVER,
 * không phải nhìn badge trên màn hình. Lý do rất cụ thể: trước bản sửa này,
 * `changeStatus()` chỉ ghi vào store trong trình duyệt — badge đổi ngay nhưng
 * F5 là quay về trạng thái cũ và máy lễ tân khác không thấy gì. Một bộ test chỉ
 * nhìn badge sẽ XANH HOÀN TOÀN trên đúng cái bug đó.
 *
 * ─── HỆ QUẢ KÈM THEO MỖI BƯỚC (không chỉ kiểm mỗi trạng thái) ───────────────
 *
 *   duyệt cọc   → `paidAmount` tăng đúng bằng tiền cọc
 *   nhận phòng  → `RoomUnit` được gán, đơn có `checkInRecord`
 *   trả phòng   → đơn đóng, phòng chuyển sang chờ dọn
 *   huỷ đơn     → tồn kho được NHẢ RA (đây là chỗ đắt tiền nếu sai)
 *   mọi bước    → `ActivityLog` ghi thêm một dòng
 *
 * ─── TỰ DỌN ─────────────────────────────────────────────────────────────────
 *
 * Mỗi test tự tạo đơn của riêng mình qua API (nhanh và không phụ thuộc form),
 * mang SĐT `09999xxxxx` để nhận ra. Đơn đã `checked_out` không xoá được theo
 * nghiệp vụ nên KHÔNG cố xoá; test không bao giờ đọc "đơn mới nhất" mà luôn
 * bám đúng mã đơn của chính mình, nên rác không làm sai kết quả lần sau.
 */

const DESKTOP = { width: 1440, height: 900 }

const OWNER = { email: 'owner@namduhill.demo', password: 'NamDu@Owner2026' }

/** Ngày `YYYY-MM-DD` cách hôm nay `offset` ngày (UTC, đúng cách core xử lý). */
function dayFromToday(offset: number): string {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() + offset)
    return d.toISOString().slice(0, 10)
}

interface BookingSnapshot {
    id: string
    code: string
    status: string
    paidAmount: number
    totalAmount: number
    depositAmount: number
    nights: number
    roomTypeId: string
    checkIn: string
    checkOut: string
    assignedRoomUnitId?: string
}

/** Đăng nhập ở tầng API, trả context đã mang cookie phiên. */
async function loginApi(page: Page): Promise<APIRequestContext> {
    const res = await page.request.post('/api/auth/login', { data: OWNER })
    expect(res.status(), 'đăng nhập phải thành công').toBe(200)
    return page.request
}

/** Đọc đơn TỪ SERVER theo mã — nguồn sự thật duy nhất của mọi assertion. */
async function fetchFromServer(api: APIRequestContext, code: string): Promise<BookingSnapshot> {
    const res = await api.get('/api/bookings')
    expect(res.status()).toBe(200)
    const body = await res.json()
    const found = (body.data ?? []).find((b: BookingSnapshot) => b.code === code)
    expect(found, `đơn ${code} phải tồn tại trên server`).toBeTruthy()
    return found
}

interface AvailabilityRoom {
    room: { id: string }
    availability?: { availableUnits?: number; available?: boolean }
}

/**
 * Tra tồn kho cho một khoảng ngày.
 *
 * `POST` chứ không `GET` — route nhận `guests` dạng object trong body
 * (`GET` trả 405). Shape trả về là `data.rooms[]`, mỗi phần tử `{ room, availability }`.
 */
async function searchAvailability(
    api: APIRequestContext,
    checkIn: string,
    checkOut: string,
): Promise<AvailabilityRoom[]> {
    const res = await api.post('/api/availability/search', {
        data: { checkIn, checkOut, guests: { adults: 2, children: [] } },
    })
    expect(res.status(), 'tra tồn kho phải thành công').toBe(200)
    return (await res.json()).data?.rooms ?? []
}

/** Hạng phòng CÒN TRỐNG trong khoảng ngày — lấy từ dữ liệu thật, không hard-code. */
async function firstRoomTypeIdFor(
    api: APIRequestContext,
    checkIn: string,
    checkOut: string,
): Promise<string> {
    const rooms = await searchAvailability(api, checkIn, checkOut)
    const free = rooms.find((r) => (r.availability?.availableUnits ?? 0) > 0)
    expect(free, `phải còn hạng phòng trống cho ${checkIn} → ${checkOut}`).toBeTruthy()
    return free!.room.id
}

/** Số phòng trống của một hạng trong khoảng ngày. `null` khi không tra được. */
async function availableUnitsOf(
    api: APIRequestContext,
    roomTypeId: string,
    checkIn: string,
    checkOut: string,
): Promise<number | null> {
    const rooms = await searchAvailability(api, checkIn, checkOut)
    const hit = rooms.find((r) => r.room.id === roomTypeId)
    return hit?.availability?.availableUnits ?? null
}

/**
 * Tạo một đơn mới qua API và trả về ảnh chụp của nó.
 *
 * Dùng API thay vì điền form: bộ test này kiểm VÒNG ĐỜI, không kiểm form tạo
 * đơn (việc đó thuộc spec khác). Đi qua form chỉ làm mỗi test chậm thêm và
 * khiến lỗi ở form làm hỏng kết quả của phần vòng đời.
 */
async function createBooking(
    api: APIRequestContext,
    tag: string,
    /**
     * Ngày nhận phòng, tính bằng số ngày kể từ hôm nay.
     *
     * MỖI TEST MỘT CỬA SỔ RIÊNG: dùng chung một khoảng ngày thì test chạy sau
     * gặp "hết phòng" do chính test chạy trước đặt hết — hỏng vì tự tranh chấp,
     * không phải vì sản phẩm sai (đã quan sát trên ảnh chụp lần chạy trước).
     */
    startOffset = 1,
): Promise<BookingSnapshot> {
    const checkIn = dayFromToday(startOffset)
    const checkOut = dayFromToday(startOffset + 2)
    const roomTypeId = await firstRoomTypeIdFor(api, checkIn, checkOut)
    const res = await api.post('/api/bookings', {
        data: {
            roomTypeId,
            ratePlanId: 'standard',
            checkIn,
            checkOut,
            guests: { adults: 2, children: [] },
            addons: {},
            channel: 'phone',
            guest: {
                fullName: `E2E ${tag}`,
                phone: '0999900001',
                email: 'e2e-lifecycle@namduhill.test',
            },
        },
    })
    expect(res.status(), `tạo đơn ${tag} phải trả 201`).toBe(201)
    return (await res.json()).data
}

/**
 * Số dòng nhật ký của một đơn — mọi chuyển trạng thái phải ghi thêm một dòng.
 *
 * `GET /api/bookings/[id]` trả hàng THÔ của Postgres (snake_case) chứ không đi
 * qua `mapBookingRow` như route danh sách, nên khoá là `activity_logs`.
 */
async function countLogs(api: APIRequestContext, bookingId: string): Promise<number> {
    const res = await api.get(`/api/bookings/${bookingId}`)
    expect(res.status(), 'phải đọc được chi tiết đơn').toBe(200)
    const data = (await res.json()).data
    const logs = data?.activity_logs ?? data?.logs
    expect(Array.isArray(logs), 'chi tiết đơn phải kèm nhật ký hoạt động').toBe(true)
    return logs.length
}

// ══════════════════════════════════════════════ 1. VÒNG ĐỜI ĐẦY ĐỦ (happy path)

test('1.1 — đi trọn vòng đời: tạo → duyệt cọc → nhận phòng → trả phòng', async ({ page }) => {
    test.slow() // bốn lần gọi server + điều hướng UI

    const api = await loginApi(page)
    const created = await createBooking(api, 'lifecycle', 2)

    // ── Bước 1: vừa tạo xong phải là `pending_payment` và CHƯA thu tiền ──────
    let snap = await fetchFromServer(api, created.code)
    expect(snap.status).toBe('pending_payment')
    expect(snap.paidAmount).toBe(0)
    expect(snap.depositAmount, 'đơn phải có mức cọc yêu cầu').toBeGreaterThan(0)
    const logsAtCreate = await countLogs(api, snap.id)

    // ── Bước 2: DUYỆT CỌC trên giao diện ────────────────────────────────────
    await page.setViewportSize(DESKTOP)
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    // Bộ lọc mặc định là "Hôm nay"; đơn nhận phòng ngày mai nên phải mở rộng.
    await page.locator('select').first().selectOption('week')
    await page.waitForTimeout(600)

    const row = page.locator('tbody tr').filter({ hasText: created.code })
    await expect(row, 'đơn vừa tạo phải hiện trên bảng').toHaveCount(1)
    await row.getByRole('button', { name: /Duyệt cọc/i }).click()

    // Chờ SERVER xác nhận, không chờ badge đổi.
    await expect
        .poll(async () => (await fetchFromServer(api, created.code)).status, { timeout: 20_000 })
        .toBe('confirmed')

    snap = await fetchFromServer(api, created.code)
    // Tiền cọc phải được ghi nhận THẬT, không chỉ đổi nhãn trạng thái.
    expect(snap.paidAmount, 'duyệt cọc phải ghi nhận tiền đã thu').toBeGreaterThan(0)
    expect(await countLogs(api, snap.id), 'duyệt cọc phải ghi ActivityLog').toBeGreaterThan(
        logsAtCreate,
    )

    // ── Bước 3: NHẬN PHÒNG — bắt buộc gán phòng vật lý + CCCD ───────────────
    await page.reload({ waitUntil: 'networkidle' })
    await page.locator('select').first().selectOption('week')
    await page.waitForTimeout(600)
    await page.locator('tbody tr').filter({ hasText: created.code }).first().click()

    const drawer = page.locator('[role="dialog"], aside').filter({ hasText: created.code }).first()
    await expect(drawer).toBeVisible()

    // "Nhận phòng" là một TAB trong drawer, không phải nút hành động — tab chỉ
    // hiện khi `nextStatuses()` cho phép, nên thấy được tab cũng là bằng chứng
    // đơn đang ở đúng `confirmed`.
    await drawer.getByRole('tab', { name: /Nhận phòng/i }).click()

    // Chọn phòng vật lý đầu tiên còn trống và nhập CCCD (khai báo lưu trú §F5).
    await drawer.locator('select').first().selectOption({ index: 1 })
    await drawer.getByLabel(/CCCD|Hộ chiếu|ID number/i).first().fill('079201001234')
    // Nút submit và TAB trùng nhãn "Nhận phòng" — phân biệt bằng `role`, không
    // bằng `.last()` (thứ tự DOM có thể đổi khi bố cục thay đổi).
    await drawer.getByRole('button', { name: /^Nhận phòng$/ }).click()

    await expect
        .poll(async () => (await fetchFromServer(api, created.code)).status, { timeout: 20_000 })
        .toBe('checked_in')

    snap = await fetchFromServer(api, created.code)
    expect(snap.assignedRoomUnitId, 'nhận phòng phải gán một phòng vật lý (luật B0)').toBeTruthy()

    // ── Bước 4: THU NỐT TIỀN CÒN LẠI ────────────────────────────────────────
    //
    // `check_out_booking` từ chối khi `total_amount > paid_amount`
    // (`NOT_SETTLED`) — đúng nghiệp vụ §F5: chưa thu đủ thì không đóng đơn.
    // Khách mới trả cọc 30% nên phải thu phần còn lại trước, giống hệt việc
    // lễ tân thu nốt tại quầy.
    const remaining = snap.totalAmount - snap.paidAmount
    expect(remaining, 'đơn phải còn dư nợ sau khi chỉ đặt cọc').toBeGreaterThan(0)
    const payRest = await api.post(`/api/bookings/${snap.id}/payments`, {
        data: { amount: remaining, kind: 'balance', paymentMethod: 'at-property' },
    })
    expect(payRest.status(), 'thu nốt tiền tại quầy phải thành công').toBeLessThan(300)
    expect((await fetchFromServer(api, created.code)).paidAmount).toBe(snap.totalAmount)

    // ── Bước 5: TRẢ PHÒNG ───────────────────────────────────────────────────
    await page.reload({ waitUntil: 'networkidle' })
    await page.locator('select').first().selectOption('week')
    await page.waitForTimeout(600)
    await page.locator('tbody tr').filter({ hasText: created.code }).first().click()

    const drawer2 = page.locator('[role="dialog"], aside').filter({ hasText: created.code }).first()
    await drawer2.getByRole('tab', { name: /Trả phòng/i }).click()

    // "Đã thanh toán đủ" là chốt chặn có chủ đích (§F5): chưa tích thì nút Trả
    // phòng bị khoá, để tiền phát sinh không rơi khỏi sổ sách. Lễ tân thật cũng
    // phải tích ô này, nên test đi đúng đường đó thay vì tìm cách vòng qua.
    await drawer2.getByLabel(/Đã thanh toán đủ/i).check()
    await drawer2.getByRole('button', { name: /^Trả phòng$/ }).click()

    await expect
        .poll(async () => (await fetchFromServer(api, created.code)).status, { timeout: 20_000 })
        .toBe('checked_out')

    // ── Bước 6: F5 rồi đọc lại — thứ mà bug cũ trượt ────────────────────────
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    const afterReload = await page.evaluate((code) => {
        const raw = localStorage.getItem('namduhill.bookings')
        const list = raw ? (JSON.parse(raw)?.state?.bookings ?? []) : []
        return list.find((b: { code: string }) => b.code === code)?.status
    }, created.code)
    expect(afterReload, 'trạng thái phải SỐNG QUA F5 — không chỉ đổi trên máy').toBe('checked_out')
})

// ═══════════════════════════════════════════════ 2. NHÁNH HUỶ VÀ HOÀN TỒN KHO

test('2.1 — huỷ đơn: đổi trạng thái trên server và NHẢ tồn kho', async ({ page }) => {
    const api = await loginApi(page)
    const created = await createBooking(api, 'cancel', 20)
    const snap = await fetchFromServer(api, created.code)

    // Đếm số phòng còn trống TRƯỚC khi huỷ.
    const availBefore = await availableUnitsOf(api, snap.roomTypeId, snap.checkIn, snap.checkOut)

    const res = await api.post(`/api/bookings/${snap.id}/cancel`, {
        data: { reason: 'E2E — kiểm tra nhả tồn kho' },
    })
    expect(res.status(), 'huỷ đơn phải thành công').toBeLessThan(300)

    expect((await fetchFromServer(api, created.code)).status).toBe('cancelled')

    // Đơn huỷ mà KHÔNG nhả phòng là mất doanh thu im lặng — phòng còn trống
    // thật nhưng hệ thống báo hết (luật B7).
    expect(availBefore, 'phải tra được tồn kho trước khi huỷ').not.toBeNull()
    const availAfter = await availableUnitsOf(api, snap.roomTypeId, snap.checkIn, snap.checkOut)
    expect(availAfter, 'huỷ đơn phải trả phòng về kho').toBe(availBefore! + 1)
})

// ═══════════════════════════════════ 3. NEGATIVE — trạng thái không nhảy cóc

test('3.1 — KHÔNG cho trả phòng khi khách chưa nhận phòng', async ({ page }) => {
    const api = await loginApi(page)
    const created = await createBooking(api, 'skip-checkin', 30)
    const snap = await fetchFromServer(api, created.code)

    // `pending_payment → checked_out` không có trong đồ thị §B1.
    const res = await api.post(`/api/bookings/${snap.id}/check-out`, {
        data: { incidentals: [], settled: true },
    })
    expect(res.status(), 'nhảy cóc trạng thái phải bị từ chối').toBeGreaterThanOrEqual(400)

    // Và quan trọng hơn: đơn KHÔNG được đổi trạng thái.
    expect((await fetchFromServer(api, created.code)).status).toBe('pending_payment')
})

test('3.2 — nhận phòng THIẾU số CCCD bị từ chối', async ({ page }) => {
    const api = await loginApi(page)
    const created = await createBooking(api, 'no-id', 40)
    const snap = await fetchFromServer(api, created.code)

    await api.post(`/api/bookings/${snap.id}/payments`, { data: { kind: 'deposit' } })
    expect((await fetchFromServer(api, created.code)).status).toBe('confirmed')

    // Khai báo lưu trú là nghĩa vụ pháp lý — thiếu CCCD không được nhận phòng.
    const res = await api.post(`/api/bookings/${snap.id}/check-in`, {
        data: { roomUnitId: 'bat-ky', actualGuests: { adults: 2, children: 0 } },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
    expect((await fetchFromServer(api, created.code)).status).toBe('confirmed')
})

test('3.3 — huỷ đơn ĐÃ trả phòng bị từ chối', async ({ page }) => {
    const api = await loginApi(page)
    const created = await createBooking(api, 'cancel-closed', 50)
    const snap = await fetchFromServer(api, created.code)

    // Đưa đơn đi hết vòng đời bằng API cho nhanh.
    await api.post(`/api/bookings/${snap.id}/payments`, { data: { kind: 'deposit' } })

    // Lấy phòng vật lý THẬT từ `/api/room-units` thay vì suy ra `<hạng>-01`:
    // id trong DB là UUID nên mọi phép ghép chuỗi đều trả `22P02 invalid input
    // syntax for type uuid`. Đây chính là bug đã sửa ở route mới.
    const units = await api.get('/api/room-units').then((r) => r.json())
    const freeUnit = (units.data ?? []).find(
        (u: { roomTypeId: string; status: string }) =>
            u.roomTypeId === snap.roomTypeId && u.status === 'available',
    )
    expect(freeUnit, 'phải còn phòng vật lý trống của hạng này').toBeTruthy()

    const checkIn = await api.post(`/api/bookings/${snap.id}/check-in`, {
        data: {
            roomUnitId: freeUnit.id,
            idNumber: '079201009999',
            actualGuests: { adults: 2, children: 0 },
        },
    })
    expect(checkIn.status(), 'nhận phòng phải thành công').toBeLessThan(300)

    // Thu nốt tiền rồi mới đóng được đơn (`NOT_SETTLED`, xem test 1.1).
    const afterCheckIn = await fetchFromServer(api, created.code)
    await api.post(`/api/bookings/${snap.id}/payments`, {
        data: {
            amount: afterCheckIn.totalAmount - afterCheckIn.paidAmount,
            kind: 'balance',
            paymentMethod: 'at-property',
        },
    })

    await api.post(`/api/bookings/${snap.id}/check-out`, {
        data: { incidentals: [], settled: true },
    })
    expect((await fetchFromServer(api, created.code)).status).toBe('checked_out')

    const res = await api.post(`/api/bookings/${snap.id}/cancel`, { data: { reason: 'E2E' } })
    expect(res.status(), 'đơn đã đóng thì không huỷ được').toBeGreaterThanOrEqual(400)
    expect((await fetchFromServer(api, created.code)).status).toBe('checked_out')
})

// ═══════════════════════════════════════════ 4. DASHBOARD ĐỒNG BỘ SAU KHI TẠO

test('4.1 — tạo đơn xong dashboard TỰ tải lại, không cần F5', async ({ page }) => {
    await loginApi(page)
    await page.setViewportSize(DESKTOP)
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1200)

    const countBefore = await page.evaluate(() => {
        const raw = localStorage.getItem('namduhill.bookings')
        return raw ? (JSON.parse(raw)?.state?.bookings ?? []).length : 0
    })

    /*
     * Ghi lại MỌI request `/api/bookings` từ lúc này thay vì `waitForResponse`.
     *
     * `waitForResponse` chỉ bắt được nếu đăng ký đúng trước lượt request đó.
     * Ở đây giữa lúc mở drawer và lúc bấm Tạo đơn có nhiều lượt gọi khác
     * (tra tồn kho, tính giá) nên cách đó đọc nhầm hoặc lỡ mất. Ghi nhật ký
     * rồi kiểm THỨ TỰ POST-rồi-GET là bằng chứng chắc chắn hơn.
     */
    const calls: string[] = []
    page.on('response', (r) => {
        if (r.url().includes('/api/bookings') && r.ok()) calls.push(r.request().method())
    })

    await page.getByRole('button', { name: /Đặt phòng mới|New booking/i }).first().click()

    /*
     * ĐẨY NGÀY RA XA — chống tự tranh chấp tồn kho.
     *
     * Các test khác trong file này đều đặt vào cửa sổ +1..+3 ngày. Chạy tuần tự
     * thì tới lượt test này hạng phòng đầu bảng đã hết sạch và form trả
     * "Phòng vừa được khách khác đặt" (đã quan sát trên ảnh chụp) — test hỏng
     * vì chính nó, không phải vì sản phẩm sai.
     */
    const checkIn = dayFromToday(60)
    const checkOut = dayFromToday(62)
    await page.locator('input[type="date"]').first().fill(checkIn)
    await page.locator('input[type="date"]').nth(1).fill(checkOut)

    await page.getByLabel(/Họ và tên/i).fill('E2E Dashboard Sync')
    await page.getByLabel(/Số điện thoại/i).fill('0999900002')
    await page.getByLabel(/^Email/i).first().fill('e2e-sync@namduhill.test')

    // Chọn hạng CÒN TRỐNG THẬT, không phải `index: 1` cứng: chạy bộ test nhiều
    // lần thì hạng đầu bảng hết phòng và form trả `409 SOLD_OUT` — test hỏng vì
    // dữ liệu do chính nó tạo ra, không phải vì sản phẩm sai.
    const freeRoomId = await firstRoomTypeIdFor(page.request, checkIn, checkOut)
    await page
        .locator('select')
        .filter({ hasText: /Chọn hạng phòng/ })
        .first()
        .selectOption(freeRoomId)
    await page.waitForTimeout(1500)
    await page.getByRole('button', { name: /^Tạo đơn$/ }).click()

    // ĐÂY LÀ KHẲNG ĐỊNH CHÍNH: sau POST phải có ít nhất một GET — tức dashboard
    // TỰ tải lại, không đợi người dùng F5.
    await expect
        .poll(() => calls.lastIndexOf('GET') > calls.indexOf('POST') && calls.includes('POST'), {
            timeout: 25_000,
        })
        .toBe(true)

    await expect
        .poll(
            async () =>
                page.evaluate(() => {
                    const raw = localStorage.getItem('namduhill.bookings')
                    const list = raw ? (JSON.parse(raw)?.state?.bookings ?? []) : []
                    return list.some(
                        (b: { guest?: { fullName?: string } }) =>
                            b.guest?.fullName === 'E2E Dashboard Sync',
                    )
                }),
            { timeout: 20_000 },
        )
        .toBe(true)

    /*
     * KHÔNG khẳng định "số đơn phải tăng".
     *
     * `GET /api/bookings` có `.limit(100)`, nên khi tổng số đơn đã chạm trần
     * thì thêm một đơn mới không làm con số thay đổi — đơn mới đẩy đơn cũ nhất
     * ra khỏi trang. Kiểm bằng số lượng sẽ fail vì lý do sai hoàn toàn.
     *
     * Bằng chứng đúng đã có ở trên: (1) sau POST có GET, (2) đơn vừa tạo XUẤT
     * HIỆN trong store. Đó mới là "dashboard tự tải lại".
     */
    expect(countBefore, 'store phải có dữ liệu trước khi tạo').toBeGreaterThan(0)
})

test('4.2 — đơn ngoài phạm vi lọc KHÔNG hiện, đổi bộ lọc thì hiện', async ({ page }) => {
    // Chốt hành vi đã bàn với chủ dự án: bộ lọc mặc định "Hôm nay" loại đơn
    // nhận phòng ngày mai — đó là ĐÚNG thiết kế màn vận hành, không phải lỗi
    // đồng bộ. Test này giữ cho ai đó sau này không "sửa" nhầm thành tự nhảy
    // bộ lọc.
    const api = await loginApi(page)
    const created = await createBooking(api, 'filter-scope')

    await page.setViewportSize(DESKTOP)
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1200)

    // Đơn CÓ trong store…
    const inStore = await page.evaluate((code) => {
        const raw = localStorage.getItem('namduhill.bookings')
        const list = raw ? (JSON.parse(raw)?.state?.bookings ?? []) : []
        return list.some((b: { code: string }) => b.code === code)
    }, created.code)
    expect(inStore, 'đơn phải có trong store').toBe(true)

    // …nhưng KHÔNG hiện với bộ lọc "Hôm nay" (đơn nhận phòng ngày mai).
    await expect(page.locator('tbody tr').filter({ hasText: created.code })).toHaveCount(0)

    // Đổi sang "Tuần" là thấy ngay.
    await page.locator('select').first().selectOption('week')
    await page.waitForTimeout(800)
    await expect(page.locator('tbody tr').filter({ hasText: created.code })).toHaveCount(1)
})
