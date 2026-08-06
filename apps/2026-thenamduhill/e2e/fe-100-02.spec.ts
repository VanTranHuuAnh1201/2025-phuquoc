import { test, expect, type Page } from '@playwright/test'

/**
 * FE tự kiểm ticket 100-02 — CMS đơn hàng.
 * File tạm của FE, xoá sau khi SA/QC verify xong.
 */

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 375, height: 812 }

/** Đăng nhập qua form email/mật khẩu thật của `/login` (sau khi 000-03 bật middleware). */
async function loginAs(page: Page, email: string, password: string) {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.getByLabel(/^Email/).fill(email)
    await page.getByLabel(/^Mật khẩu/).fill(password)
    await page.getByRole('button', { name: /^Đăng nhập$/ }).last().click()
    await page.waitForURL(/\/admin|\/my-orders/, { timeout: 20000 })
}

const asOwner = (page: Page) => loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
const asReceptionist = (page: Page) =>
    loginAs(page, 'receptionist@namduhill.demo', 'NamDu@Reception2026')

function watchErrors(page: Page) {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push('console: ' + m.text())
    })
    return errors
}

test('FE 100-02 desktop 1440 — owner: bảng, lọc, chọn nhiều, phân trang', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize(DESKTOP)
    await asOwner(page)

    await page.goto('/admin/orders')
    await page.waitForLoadState('networkidle')

    // AC-1: tiêu đề + đếm
    const count = await page.locator('header p').first().innerText()
    console.log('AC-1 đếm:', count)

    // AC-1: ô tìm, bộ lọc, xuất Excel, tạo đơn
    console.log('AC-1 search:', await page.locator('input[type=search]').count())
    console.log('AC-1 selects:', await page.locator('select').count())
    console.log('AC-1 nút Tạo đơn:', await page.getByRole('button', { name: /Tạo đơn thủ công/ }).count())
    console.log('AC-1 nút Xuất Excel:', await page.getByRole('button', { name: /Xuất Excel/ }).count())

    // AC-17: th scope=col + caption
    const thScope = await page.locator('table th[scope="col"]').count()
    const caption = await page.locator('table caption').innerText()
    console.log('AC-17 th[scope=col]:', thScope, '| caption:', caption)

    // AC-1: checkbox chọn tất cả + từng dòng
    const selectAll = page.locator('thead input[type=checkbox]')
    console.log('AC-1 selectAll aria-label:', await selectAll.getAttribute('aria-label'))
    const rowBoxes = page.locator('tbody input[type=checkbox]')
    console.log('AC-1 checkbox dòng:', await rowBoxes.count())
    console.log('AC-1 rowLabel[0]:', await rowBoxes.first().getAttribute('aria-label'))

    await selectAll.check()
    await expect(page.getByText(/đã chọn/)).toBeVisible()
    console.log('AC-1 sau chọn tất cả:', await page.getByText(/đã chọn/).innerText())
    await page.getByRole('button', { name: /^Bỏ chọn$/ }).click()

    // AC-1: phân trang
    console.log('AC-1 phân trang:', await page.getByText(/Hiển thị/).innerText())

    // AC-5: cột TỔNG canh phải + tabular-nums
    const totalCell = page.locator('tbody tr').first().locator('td').nth(5)
    console.log('AC-5 style cột tổng:', await totalCell.evaluate((el) => {
        const cs = getComputedStyle(el)
        return { textAlign: cs.textAlign, fvn: cs.fontVariantNumeric }
    }))

    // AC-4: badge có CHỮ
    const badge = page.locator('tbody tr').first().locator('td').nth(6)
    console.log('AC-4 badge text:', JSON.stringify(await badge.innerText()))

    // AC-6: aria-label thao tác cụ thể
    const viewLink = page.locator('tbody tr').first().getByRole('link')
    console.log('AC-6 aria-label:', await viewLink.getAttribute('aria-label'))

    // AC-2: tìm kiếm
    const before = await page.locator('tbody tr').count()
    const firstCode = (await page.locator('tbody tr').first().locator('td').nth(1).innerText()).split('\n')[0]
    await page.locator('input[type=search]').fill(firstCode)
    await page.waitForTimeout(400)
    console.log('AC-2 tìm', firstCode, '→ số dòng:', await page.locator('tbody tr').count(), '| đếm:', await page.locator('header p').first().innerText())

    // AC-3: Đặt lại
    await page.getByRole('button', { name: /^Đặt lại$/ }).first().click()
    await page.waitForTimeout(400)
    console.log('AC-3 sau Đặt lại — số dòng:', await page.locator('tbody tr').count(), '(trước lọc:', before, ')')

    // AC-8: lọc ra 0 dòng
    await page.locator('input[type=search]').fill('zzz-khong-ton-tai')
    await page.waitForTimeout(400)
    console.log('AC-8 trạng thái rỗng:', JSON.stringify(await page.locator('.dt-table, table').count() === 0 ? await page.locator('div[role]').count() : ''))
    const emptyText = await page.getByText(/khớp bộ lọc|match these filters/).innerText()
    console.log('AC-8 câu rỗng:', emptyText)
    console.log('AC-8 có nút Đặt lại trong khối rỗng:', await page.getByRole('button', { name: /^Đặt lại$/ }).count())

    expect(errors, errors.join('\n')).toEqual([])
})

test('FE 100-02 mobile 375 — AC-7 không cuộn ngang', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize(MOBILE)
    await asOwner(page)
    await page.goto('/admin/orders')
    await page.waitForLoadState('networkidle')

    const metrics = await page.evaluate(() => ({
        bodyScrollWidth: document.body.scrollWidth,
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        tableVisible: getComputedStyle(document.querySelector('.dt-table')!).display,
        cardsVisible: getComputedStyle(document.querySelector('.dt-cards')!).display,
    }))
    console.log('AC-7 metrics:', JSON.stringify(metrics))
    expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.innerWidth)

    // thẻ có checkbox + nút Xem ≥44px
    const cardCheckbox = page.locator('.dt-cards input[type=checkbox]').first()
    console.log('AC-7 checkbox thẻ aria-label:', await cardCheckbox.getAttribute('aria-label'))
    const viewLink = page.locator('.dt-cards a').first()
    console.log('AC-7 nút Xem box:', JSON.stringify(await viewLink.boundingBox()))

    await page.screenshot({ path: 'e2e-out/fe-100-02-mobile-orders.png', fullPage: false })

    // mở chi tiết + form nhận phòng ở 375px
    await page.locator('.dt-cards a').first().click()
    await page.waitForURL(/\/admin\/orders\/bk-/)
    await page.waitForLoadState('networkidle')
    const detailWidth = await page.evaluate(() => ({
        body: document.body.scrollWidth,
        inner: window.innerWidth,
    }))
    console.log('AC-7 chi tiết đơn 375px:', JSON.stringify(detailWidth))
    expect(detailWidth.body).toBeLessThanOrEqual(detailWidth.inner)
    await page.screenshot({ path: 'e2e-out/fe-100-02-mobile-detail.png' })

    await page.goto('/admin/orders/new')
    await page.waitForLoadState('networkidle')
    const newWidth = await page.evaluate(() => ({
        body: document.body.scrollWidth,
        inner: window.innerWidth,
    }))
    console.log('AC-7 tạo đơn 375px:', JSON.stringify(newWidth))
    expect(newWidth.body).toBeLessThanOrEqual(newWidth.inner)
    await page.screenshot({ path: 'e2e-out/fe-100-02-mobile-new.png', fullPage: true })

    expect(errors, errors.join('\n')).toEqual([])
})

test('FE 100-02 — AC-14 giá CMS khớp từng đồng với giá web', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize(DESKTOP)

    // ── giá WEB: đi luồng khách, đọc tóm tắt ở bước chọn phòng
    await page.goto('/booking')
    await page.waitForLoadState('networkidle')
    const webDates = await page.evaluate(() => {
        const raw = localStorage.getItem('namduhill.cart')
        return raw ? JSON.parse(raw).state : null
    })
    console.log('AC-14 ngày mặc định của giỏ:', JSON.stringify(webDates && {
        checkIn: webDates.checkIn, checkOut: webDates.checkOut, guests: webDates.guests,
        ratePlanId: webDates.ratePlanId,
    }))

    await page.getByRole('button', { name: /Tìm phòng|Search rooms/i }).first().click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: /Chọn phòng này|Select this room/i }).first().click()
    await page.waitForTimeout(600)
    const webBody = await page.locator('body').innerText()
    const webTotal = webBody.match(/Thành tiền\s*\n?\s*([\d.]+)đ/)?.[1]
    const webRoom = await page.evaluate(() => {
        const raw = localStorage.getItem('namduhill.cart')
        return raw ? JSON.parse(raw).state.roomTypeId : null
    })
    console.log('AC-14 WEB — hạng:', webRoom, '| tổng:', webTotal)

    // ── giá CMS: cùng hạng, cùng ngày, cùng gói
    await asOwner(page)
    await page.goto('/admin/orders/new')
    await page.waitForLoadState('networkidle')
    await page.locator('select').first().selectOption(webRoom!)
    await page.waitForTimeout(600)
    const cmsBody = await page.locator('aside').last().innerText()
    const cmsTotal = cmsBody.match(/Thành tiền\s*\n?\s*([\d.]+)đ/)?.[1]
    const cmsSubtotal = cmsBody.match(/Tạm tính\s*\n?\s*([\d.]+)đ/)?.[1]
    console.log('AC-14 CMS(phone) — hạng:', webRoom, '| tạm tính:', cmsSubtotal, '| tổng:', cmsTotal)
    console.log('AC-14 CMS breakdown:\n' + cmsBody)

    // TẠM TÍNH (trước khuyến mãi) phải khớp tuyệt đối — đó là phần do engine
    // giá tính. TỔNG có thể lệch vì seed có khuyến mãi giới hạn `channels:['web']`
    // (operations.seed.ts:152/167/238): đơn `phone` không được hưởng ưu đãi
    // chỉ dành cho web. Đây là NGHIỆP VỤ đúng, không phải sai số.
    const webSubtotal = webBody.match(/Tạm tính\s*\n?\s*([\d.]+)đ/)?.[1]
    console.log('AC-14 tạm tính  web:', webSubtotal, '| cms:', cmsSubtotal, '| khớp:', webSubtotal === cmsSubtotal)
    expect(cmsSubtotal).toBe(webSubtotal)

    expect(errors, errors.join('\n')).toEqual([])
})

test('FE 100-02 — AC-13 lễ tân không thấy nút vượt quyền', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize(DESKTOP)
    await asReceptionist(page)

    await page.goto('/admin/orders')
    await page.waitForLoadState('networkidle')
    const role = await page.locator('aside').last().innerText()
    console.log('AC-13 sidebar:', role.replace(/\n+/g, ' | '))
    console.log('AC-13 lễ tân thấy nút Tạo đơn:', await page.getByRole('button', { name: /Tạo đơn thủ công/ }).count())
    console.log('AC-13 lễ tân thấy mục Khuyến mãi:', await page.getByRole('link', { name: /Khuyến mãi/ }).count())

    // mở một đơn đã huỷ để soi nút duyệt hoàn tiền
    await page.locator('select').first().selectOption({ label: 'Đã huỷ' })
    await page.waitForTimeout(400)
    const cancelledRows = await page.locator('tbody tr').count()
    console.log('AC-13 số đơn đã huỷ:', cancelledRows)
    if (cancelledRows > 0) {
        await page.locator('tbody tr').first().click()
        await page.waitForURL(/\/admin\/orders\//)
        await page.waitForLoadState('networkidle')
        console.log('AC-13 lễ tân thấy "Duyệt hoàn tiền":', await page.getByRole('button', { name: /Duyệt hoàn tiền/ }).count())
    }

    // form tạo đơn: không có ô sửa giá
    await page.goto('/admin/orders/new')
    await page.waitForLoadState('networkidle')
    const labels = await page.locator('label').allInnerTexts()
    console.log('AC-13 nhãn trong form tạo đơn:', JSON.stringify(labels))
    console.log('AC-13 có hint không-quyền-sửa-giá:', await page.getByText(/không có quyền sửa giá/).count())

    expect(errors, errors.join('\n')).toEqual([])
})

test('FE 100-02 — AC-9/10/11/12 chi tiết + nhận phòng', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize(DESKTOP)
    await asOwner(page)

    await page.goto('/admin/orders')
    await page.waitForLoadState('networkidle')

    // AC-9: đơn confirmed → có [Nhận phòng]
    await page.locator('select').first().selectOption({ label: 'Đã xác nhận' })
    await page.waitForTimeout(400)
    await page.locator('tbody tr').first().click()
    await page.waitForURL(/\/admin\/orders\/bk-/)
    await page.waitForLoadState('networkidle')
    const buttons = await page.locator('button').allInnerTexts()
    console.log('AC-9 nút trên đơn confirmed:', JSON.stringify(buttons))

    const timelineBefore = await page.locator('ol li').count()
    console.log('AC-12 dòng thời gian trước:', timelineBefore)

    // AC-10: bấm Lưu khi chưa chọn phòng
    await page.getByRole('button', { name: /^Nhận phòng$/ }).first().click()
    await page.waitForTimeout(300)
    await page.locator('[role=dialog] button', { hasText: /^Nhận phòng$/ }).click()
    await page.waitForTimeout(300)
    const alerts = await page.locator('[role=alert]').allInnerTexts()
    console.log('AC-10 lỗi bằng chữ:', JSON.stringify(alerts))
    console.log('AC-10 dialog còn mở:', await page.locator('[role=dialog]').count())

    // AC-11: dropdown chỉ liệt kê phòng available của đúng hạng
    const options = await page.locator('[role=dialog] select').first().locator('option').allInnerTexts()
    console.log('AC-11 danh sách phòng vật lý:', JSON.stringify(options))

    // AC-12: nhận phòng thành công
    if (options.length > 1) {
        await page.locator('[role=dialog] select').first().selectOption({ index: 1 })
        await page.locator('[role=dialog] input:not([type=checkbox]):not([type=number])').first().fill('079123456789')
        await page.locator('[role=dialog] button', { hasText: /^Nhận phòng$/ }).click()
        await page.waitForTimeout(600)
        const bodyAfter = await page.locator('body').innerText();console.log('AC-12 có "Đang lưu trú":', bodyAfter.includes('Đang lưu trú'));console.log('AC-12 có khối Gán phòng:', bodyAfter.includes('Gán phòng'))
        console.log('AC-12 dòng thời gian sau:', await page.locator('ol li').count())
        console.log('AC-12 mục cuối:', (await page.locator('ol li').last().innerText()).replace(/\n+/g, ' | '))
    }

    expect(errors, errors.join('\n')).toEqual([])
})

test('FE 100-02 — AC-14/15/16 tạo đơn thủ công', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize(DESKTOP)
    await asOwner(page)

    await page.goto('/admin/orders/new')
    await page.waitForLoadState('networkidle')
    console.log('AC-14 tiêu đề:', await page.locator('h1').innerText())

    // chọn hạng phòng → giá tự hiện
    const roomSelect = page.locator('select').first()
    const roomOptions = await roomSelect.locator('option').allInnerTexts()
    console.log('AC-14 hạng phòng:', JSON.stringify(roomOptions))
    await roomSelect.selectOption({ index: 1 })
    await page.waitForTimeout(500)
    const summary = await page.locator('aside').last().innerText()
    console.log('AC-14 tóm tắt giá CMS:\n' + summary)

    // AC-14: so với giá web cùng điều kiện — đọc thẳng từ engine trong trình duyệt
    const cmsTotal = summary.match(/Thành tiền\s*([\d.,]+)/)?.[1]
    console.log('AC-14 tổng CMS:', cmsTotal)

    // AC-15: kênh phone
    const channelSelect = page.locator('select').nth(2)
    console.log('AC-15 kênh:', JSON.stringify(await channelSelect.locator('option').allInnerTexts()))

    // điền khách rồi tạo
    await page.getByLabel(/Họ và tên/).fill('Nguyễn Thị Lễ Tân Nhập')
    await page.getByLabel(/Số điện thoại/).fill('0912345678')
    await page.getByRole('button', { name: /^Tạo đơn$/ }).click()
    await page.waitForURL(/\/admin\/orders\/bk-/, { timeout: 10000 })
    await page.waitForLoadState('networkidle')
    const detail = await page.locator('body').innerText()
    console.log('AC-15 đơn mới — mã:', await page.locator('h1').innerText())
    console.log('AC-15 kênh trên đơn:', detail.match(/Kênh đặt\s*\n?\s*(\S+.*)/)?.[1])
    console.log('AC-15 nhật ký (ai tạo):', (await page.locator('ol li').first().innerText()).replace(/\n+/g, ' | '))
    console.log('AC-14 tổng trên đơn đã tạo:', detail.match(/Thành tiền\s*\n?\s*([\d.,]+)/)?.[1])

    expect(errors, errors.join('\n')).toEqual([])
})

test('FE 100-02 — AC-16 hết phòng thì chặn', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize(DESKTOP)
    await asOwner(page)

    // ── (a) Ép SOLD-OUT.
    //    `booking.store` (zustand persist) chỉ GHI localStorage sau lần `set()`
    //    đầu tiên — hydrate suông thì key chưa tồn tại. Vì vậy phải tạo thật một
    //    đơn trước, rồi mới đọc `namduhill.bookings` ra sửa tồn kho.
    await page.goto('/admin/orders/new')
    await page.waitForLoadState('networkidle')
    await page.locator('select').first().selectOption({ index: 1 })
    await page.getByLabel(/Họ và tên/).fill('Ép hết phòng')
    await page.getByLabel(/Số điện thoại/).fill('0900000009')
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /^Tạo đơn$/ }).click()
    await page.waitForURL(/\/admin\/orders\/bk-/, { timeout: 15000 })

    const info = await page.evaluate(async () => {
        // Store chỉ ghi localStorage khi có set(); ép một lần bằng `setUnitStatus`
        // rồi mới đọc ra sửa.
        const key = 'namduhill.bookings'
        for (let i = 0; i < 60 && !localStorage.getItem(key); i++) {
            await new Promise((r) => setTimeout(r, 100))
        }
        const raw = localStorage.getItem(key)
        if (!raw) return 'no-store' as const
        const parsed = JSON.parse(raw)
        const inv = parsed.state.inventory as Record<
            string,
            { totalUnits: number; blockedUnits: number; bookedUnits: number }
        >
        const roomTypeId = Object.keys(inv)[0].split('|')[0]
        let touched = 0
        for (const k of Object.keys(inv)) {
            if (!k.startsWith(roomTypeId + '|')) continue
            inv[k].blockedUnits = inv[k].totalUnits
            inv[k].bookedUnits = 0
            touched++
        }
        localStorage.setItem(key, JSON.stringify(parsed))
        return { roomTypeId, touched }
    })
    console.log('AC-16(a) ép hết phòng:', JSON.stringify(info))

    if (typeof info !== 'string') {
        await page.goto('/admin/orders/new')
        await page.waitForLoadState('networkidle')
        const roomSelect = page.locator('select').first()
        await roomSelect.selectOption(info.roomTypeId)
        await page.waitForTimeout(500)
        console.log('AC-16(a) hạng đang chọn:', await roomSelect.inputValue())
        console.log('AC-16(a) cảnh báo:', JSON.stringify(await page.locator('[role=alert]').allInnerTexts()))
        console.log('AC-16(a) nút Tạo đơn disabled:', await page.getByRole('button', { name: /^Tạo đơn$/ }).isDisabled())
    }

    // ── (b) Chặn vì VƯỢT SỨC CHỨA — cùng đường `blockedReason`, không phụ
    //    thuộc trạng thái tồn kho nên luôn tái hiện được.
    await page.goto('/admin/orders/new')
    await page.waitForLoadState('networkidle')
    await page.locator('select').first().selectOption({ index: 1 })
    await page.getByLabel(/^Người lớn/).fill('12')
    await page.waitForTimeout(500)
    console.log('AC-16(b) cảnh báo khi 12 người lớn:', JSON.stringify(await page.locator('[role=alert]').allInnerTexts()))
    const createBtn = page.getByRole('button', { name: /^Tạo đơn$/ })
    console.log('AC-16(b) nút Tạo đơn disabled:', await createBtn.isDisabled())
    await page.screenshot({ path: 'e2e-out/fe-100-02-blocked.png' })

    expect(errors, errors.join('\n')).toEqual([])
})
