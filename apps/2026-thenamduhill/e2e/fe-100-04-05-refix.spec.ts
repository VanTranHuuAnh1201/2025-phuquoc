import { test, type Page } from '@playwright/test'

/**
 * Tự kiểm sau khi sửa vòng 1 của `100-04` / `100-05`.
 * Chạy lại đúng các phép đo mà QC đã dùng để đánh FAIL.
 */

const DESKTOP = { width: 1440, height: 900 }

async function loginAs(page: Page, email: string, password: string) {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.getByLabel(/^Email/).fill(email)
    await page.getByLabel(/^Mật khẩu/).fill(password)
    await page.getByRole('button', { name: /^Đăng nhập$/ }).last().click()
    await page.waitForURL(/\/admin|\/my-orders/, { timeout: 30000 })
}

const PICTO = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u

const GUARDED = [
    '/admin/settings/rooms',
    '/admin/settings/rate-plans',
    '/admin/settings/addons',
    '/admin/settings/general',
    '/admin/settings/accounts',
    '/admin/settings/tickets',
]

async function blockedOn(page: Page, path: string) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const body = await page.locator('body').innerText()
    return /Không có quyền truy cập|Access denied/.test(body)
}

test('P2/AC-6 — lễ tân gõ thẳng URL bị chặn ở cả 6 trang', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'receptionist@namduhill.demo', 'NamDu@Reception2026')
    for (const p of GUARDED) {
        console.log(`receptionist ${p} -> blocked=${await blockedOn(page, p)}`)
    }
    // Lễ tân VẪN phải vào được lịch tồn kho (AC-8)
    await page.goto('/admin/inventory')
    await page.waitForLoadState('networkidle')
    const invBody = await page.locator('body').innerText()
    console.log('receptionist /admin/inventory -> blocked=', /Không có quyền|Access denied/.test(invBody))
    console.log('  co-o-gia-chi-doc-string=', /chỉ đọc|Read-only/i.test(invBody) || 'chưa mở modal')
})

test('AC-10 — manager bị chặn ở màn ngân hàng', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'manager@namduhill.demo', 'NamDu@Manager2026')
    console.log('manager /admin/settings/general -> blocked=', await blockedOn(page, '/admin/settings/general'))
    console.log('manager /admin/settings/accounts -> blocked=', await blockedOn(page, '/admin/settings/accounts'))
    console.log('manager /admin/settings/rooms -> blocked=', await blockedOn(page, '/admin/settings/rooms'))
})

test('AC-2/AC-3 — validation hạng phòng báo lỗi bằng chữ', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await page.goto('/admin/settings/rooms')
    await page.waitForLoadState('networkidle')

    const before = await page.locator('tbody tr').count()
    console.log('rows-before=', before)

    await page.getByRole('button', { name: /Thêm hạng phòng/i }).first().click()
    await page.waitForTimeout(400)

    // AC-2: chỉ điền VI, bỏ trống EN
    await page.getByLabel(/Mã định danh|Identifier/i).fill('qc-thu-nghiem')
    await page.getByLabel(/\(VI\)/).first().fill('Phòng thử QC')
    await page.getByRole('button', { name: /^Lưu$/ }).click()
    await page.waitForTimeout(300)
    let body = await page.locator('body').innerText()
    console.log('AC-2 co-thong-bao-song-ngu=', /cả hai ngôn ngữ|both languages/i.test(body))

    // AC-3: điền đủ tên, nhập giá âm
    await page.getByLabel(/\(EN\)/).first().fill('QC Test Room')
    await page.getByLabel(/Giá gốc 1 đêm/i).fill('-500000')
    await page.getByRole('button', { name: /^Lưu$/ }).click()
    await page.waitForTimeout(300)
    body = await page.locator('body').innerText()
    console.log('AC-3 co-thong-bao-gia-am=', /số không âm|non-negative/i.test(body))
    console.log('AC-3 modal-van-mo=', await page.getByRole('dialog').isVisible().catch(() => false))
    console.log('AC-3 rows-after=', await page.locator('tbody tr').count(), '(phải bằng rows-before)')
})

test('AC-4 — hộp xác nhận đổi giá gốc có số ngày + câu "đơn đã đặt không đổi"', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await page.goto('/admin/settings/rooms')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /^Sửa /i }).first().click()
    await page.waitForTimeout(400)
    await page.getByLabel(/Giá gốc 1 đêm/i).fill('1800000')
    await page.getByRole('button', { name: /^Lưu$/ }).click()
    await page.waitForTimeout(400)
    const body = await page.locator('body').innerText()
    console.log('AC-4 co-hop-xac-nhan=', /Xác nhận đổi giá gốc/i.test(body))
    console.log('AC-4 co-cau-don-khong-doi=', /Đơn đã đặt KHÔNG đổi/i.test(body))
    console.log('AC-4 co-so-ngay=', /\d+\s*ngày chưa đặt giá riêng/i.test(body))
})

test('AC-2 100-05 — lưu xong F5 còn nguyên (persist)', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await page.goto('/admin/settings/rooms')
    await page.waitForLoadState('networkidle')

    const before = await page.locator('tbody tr').count()
    await page.getByRole('button', { name: /Thêm hạng phòng/i }).first().click()
    await page.waitForTimeout(400)
    await page.getByLabel(/Mã định danh|Identifier/i).fill('qc-persist-test')
    await page.getByLabel(/\(VI\)/).first().fill('Phòng kiểm tra lưu')
    await page.getByLabel(/\(EN\)/).first().fill('Persist Test Room')
    await page.getByLabel(/Giá gốc 1 đêm/i).fill('1200000')
    await page.getByRole('button', { name: /^Lưu$/ }).click()
    await page.waitForTimeout(500)
    const afterSave = await page.locator('tbody tr').count()

    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(600)
    const afterReload = await page.locator('tbody tr').count()
    const body = await page.locator('body').innerText()
    console.log('persist before=', before, 'afterSave=', afterSave, 'afterReload=', afterReload)
    console.log('persist con-thay-ten-vua-tao=', /Phòng kiểm tra lưu|Persist Test Room/.test(body))
})

test('AC-4 100-05 — tạo ticket rỗng phải báo lỗi bằng chữ', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await page.goto('/admin/settings/tickets')
    await page.waitForLoadState('networkidle')

    const before = await page.locator('tbody tr').count()
    await page.getByRole('button', { name: /Báo sự cố mới/i }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /^Tạo ticket$/i }).click()
    await page.waitForTimeout(300)
    const body = await page.locator('body').innerText()
    console.log('AC-4-05 co-thong-bao-loi=', /Nhập tiêu đề sự cố|Enter an incident title/i.test(body))
    console.log('AC-4-05 rows before/after=', before, await page.locator('tbody tr').count())
})

test('AC-13 — lịch tồn kho có bộ chọn 14/30 ngày', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await page.goto('/admin/inventory')
    await page.waitForLoadState('networkidle')

    const cols14 = await page.locator('thead th').count()
    const select = page.getByLabel(/Khoảng ngày hiển thị|Visible date range/i)
    console.log('AC-13 co-bo-chon=', await select.isVisible().catch(() => false))
    await select.selectOption('30')
    await page.waitForTimeout(400)
    const cols30 = await page.locator('thead th').count()
    console.log('AC-13 cot-thead 14ngay=', cols14, '-> 30ngay=', cols30)

    const body = await page.locator('body').innerText()
    console.log('AC-14 co-chu-Het-tren-o=', /\bHết\b/.test(body))
})

test('AC-16 — số tài khoản admin lưu chảy sang bước thanh toán', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await page.goto('/admin/settings/general')
    await page.waitForLoadState('networkidle')

    await page.getByLabel(/Số tài khoản|Account number/i).fill('1234567890')
    await page.getByRole('button', { name: /^Lưu$/ }).click()
    await page.waitForTimeout(400)
    let body = await page.locator('body').innerText()
    console.log('AC-16 luu-thanh-cong=', /Đã lưu tài khoản nhận cọc|Deposit account saved/i.test(body))

    // AC-17: số tài khoản có chữ cái phải bị chặn
    await page.getByLabel(/Số tài khoản|Account number/i).fill('ABC123XYZ')
    await page.getByRole('button', { name: /^Lưu$/ }).click()
    await page.waitForTimeout(300)
    body = await page.locator('body').innerText()
    console.log('AC-17 chan-chu-cai=', /chỉ gồm chữ số|digits only/i.test(body))

    // giá trị đã lưu phải còn sau F5
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    const value = await page.getByLabel(/Số tài khoản|Account number/i).inputValue()
    console.log('AC-16 sau-F5-so-tk=', value, '(phải là 1234567890)')
})

test('AC-1/AC-18 — bộ lọc, phân trang, sức chứa NL/TE, emoji, song ngữ EN', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')

    for (const p of ['/admin/settings/rooms', '/admin/settings/tickets', '/admin/settings/addons']) {
        await page.goto(p)
        await page.waitForLoadState('networkidle')
        const body = await page.locator('body').innerText()
        const picto = [...body.matchAll(new RegExp(PICTO, 'gu'))].map((m) => m[0])
        console.log(`\n### ${p}`)
        console.log('  emoji-picto=', picto.length, [...new Set(picto)].join(' '))
        console.log('  co-dat-lai=', /Đặt lại|Reset/.test(body))
        console.log('  co-phan-trang=', /Hiển thị|Showing|Trước|Prev/.test(body))
        console.log('  rows=', await page.locator('tbody tr').count())
        if (p.endsWith('rooms')) {
            console.log('  suc-chua-tach-NL-TE=', /Người lớn/i.test(body))
        }
    }

    // đổi sang EN rồi đếm token tiếng Việt còn sót
    await page.goto('/admin/settings/rooms')
    await page.waitForLoadState('networkidle')
    const enBtn = page.getByRole('button', { name: /^en$/i }).first()
    if (await enBtn.isVisible().catch(() => false)) {
        await enBtn.click()
        await page.waitForTimeout(500)
    }
    for (const p of ['/admin/settings/rooms', '/admin/settings/tickets']) {
        await page.goto(p)
        await page.waitForLoadState('networkidle')
        const body = await page.locator('body').innerText()
        const viTokens = body.split(/\s+/).filter((w) => /[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(w))
        console.log(`EN ${p}: vi-token=${viTokens.length}`, [...new Set(viTokens)].slice(0, 12).join(' '))
    }
})
