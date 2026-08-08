import { test, expect, type Page } from '@playwright/test'

/**
 * E2E — Tạo / sửa / xoá HẠNG PHÒNG ở `/admin/settings/rooms`.
 *
 * Phạm vi: màn khai báo hạng phòng (`RoomType`, luật B0) — thứ khách nhìn thấy
 * trên web. KHÔNG phải màn tạo ĐƠN đặt phòng.
 *
 * ─── VÌ SAO XẾP THEO THỨ TỰ NÀY (workflow W8.2: logic trước, giao diện sau) ──
 *
 *   1. Ghi dữ liệu đúng   — sai là mọi thứ phía sau vô nghĩa
 *   2. Chặn dữ liệu sai   — validation, gồm cả negative test
 *   3. Phân quyền         — `editor` không được thấy ô giá (B8)
 *   4. Cảnh báo hậu quả   — đổi giá gốc, xoá hạng đang có đơn
 *   5. Giao diện          — mật độ form, khả năng tiếp cận
 *
 * ─── TỰ DỌN DẸP (W8.3) ──────────────────────────────────────────────────────
 *
 * Store `catalog` có `persist(localStorage)` nên hạng phòng test tạo ra sẽ SỐNG
 * QUA các lần chạy sau. Mỗi test tạo hạng đều mang `id` có tiền tố `e2e-` và
 * `afterEach` xoá sạch chúng khỏi localStorage — chạy lại 10 lần vẫn cho cùng
 * kết quả, không tích rác.
 */

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 375, height: 812 }

/** Khoá persist của `catalog.store` — dùng để dọn dữ liệu test. */
const CATALOG_KEY = 'namduhill.catalog'

/** Mọi hạng phòng do test tạo đều bắt đầu bằng tiền tố này. */
const E2E_PREFIX = 'e2e-'

/** Mã duy nhất cho mỗi lần chạy, tránh đụng nhau khi chạy song song. */
function uniqueId(suffix: string): string {
    return `${E2E_PREFIX}${suffix}-${Math.random().toString(36).slice(2, 8)}`
}

async function loginAs(page: Page, email: string, password: string) {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.getByLabel(/^Email/).fill(email)
    await page.getByLabel(/^Mật khẩu/).fill(password)
    await page.getByRole('button', { name: /^Đăng nhập$/ }).last().click()
    await page.waitForURL(/\/admin|\/my-orders/, { timeout: 30_000 })
}

async function gotoRooms(page: Page) {
    await page.goto('/admin/settings/rooms')
    await page.waitForLoadState('networkidle')
}

/** Mở modal "Thêm hạng phòng" và đợi nó hiện hẳn. */
async function openCreateModal(page: Page) {
    await page.getByRole('button', { name: /Thêm hạng phòng|Add room type/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
}

interface RoomDraftInput {
    id: string
    nameVi: string
    nameEn: string
    descVi?: string
    descEn?: string
    guests?: string
    maxGuests?: string
    remaining?: string
    price?: string
    area?: string
    tags?: string
}

/** Điền form đang mở. Bỏ trống field nào thì giữ nguyên giá trị mặc định. */
async function fillDraft(page: Page, d: RoomDraftInput) {
    const dialog = page.getByRole('dialog')

    await dialog.locator('#room-field-id').fill(d.id)
    await dialog.locator('#room-field-name').fill(d.nameVi)
    // Ô EN không có `fieldId` (chỉ ô VI có, để form nhảy focus vào ô lỗi) —
    // lấy theo nhãn kèm hậu tố (EN) của `I18nField`.
    await dialog.getByLabel(/Tên hạng phòng.*\(EN\)/i).fill(d.nameEn)

    if (d.descVi !== undefined) await dialog.locator('#room-field-desc').fill(d.descVi)
    if (d.descEn !== undefined) await dialog.getByLabel(/Mô tả ngắn.*\(EN\)/i).fill(d.descEn)
    if (d.guests !== undefined) await dialog.locator('#room-field-guests').fill(d.guests)
    if (d.maxGuests !== undefined) await dialog.locator('#room-field-maxGuests').fill(d.maxGuests)
    if (d.remaining !== undefined) await dialog.locator('#room-field-remaining').fill(d.remaining)
    if (d.price !== undefined) await dialog.locator('#room-field-price').fill(d.price)
    if (d.area !== undefined) await dialog.locator('#room-field-area').fill(d.area)
    if (d.tags !== undefined) await dialog.getByLabel(/Thẻ tiện nghi/i).fill(d.tags)
}

async function save(page: Page) {
    await page.getByRole('dialog').getByRole('button', { name: /^Lưu$/ }).click()
}

/** Đọc bản ghi test đã lưu trong `catalog.store`. `null` = chưa lưu được. */
async function readSavedRoom(page: Page, id: string) {
    return page.evaluate(
        ([key, roomId]) => {
            const raw = localStorage.getItem(key as string)
            if (!raw) return null
            const state = JSON.parse(raw)?.state
            const added = state?.roomsAdded ?? []
            return added.find((r: { id: string }) => r.id === roomId) ?? null
        },
        [CATALOG_KEY, id],
    )
}

/**
 * Xoá mọi hạng phòng do test tạo.
 *
 * Đụng thẳng localStorage chứ không bấm qua giao diện: dọn dẹp không được phụ
 * thuộc vào chính nút đang được kiểm thử — nút xoá hỏng thì rác vẫn phải sạch.
 */
async function cleanupE2ERooms(page: Page) {
    await page.evaluate(
        ([key, prefix]) => {
            const raw = localStorage.getItem(key as string)
            if (!raw) return
            const parsed = JSON.parse(raw)
            const state = parsed?.state
            if (!state) return

            state.roomsAdded = (state.roomsAdded ?? []).filter(
                (r: { id: string }) => !r.id.startsWith(prefix as string),
            )
            for (const id of Object.keys(state.roomOverrides ?? {})) {
                if (id.startsWith(prefix as string)) delete state.roomOverrides[id]
            }
            state.removedIds = (state.removedIds ?? []).filter(
                (id: string) => !id.startsWith(prefix as string),
            )
            localStorage.setItem(key as string, JSON.stringify(parsed))
        },
        [CATALOG_KEY, E2E_PREFIX],
    )
}

test.afterEach(async ({ page }) => {
    // `catalog.store` persist localStorage — không dọn thì lần chạy sau thấy
    // hạng phòng của lần trước và test "trùng mã" sẽ fail vì lý do sai.
    await cleanupE2ERooms(page).catch(() => {
        /* trang đã đóng — không còn gì để dọn */
    })
})

// ═══════════════════════════════════════════════════════════ 1. GHI DỮ LIỆU

test('1.1 — tạo hạng phòng lưu ĐÚNG mọi trường vừa nhập', async ({ page }) => {
    const id = uniqueId('bungalow')
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)
    await openCreateModal(page)

    await fillDraft(page, {
        id,
        nameVi: 'Bungalow E2E Hướng Biển',
        nameEn: 'E2E Ocean Bungalow',
        descVi: 'Bungalow gỗ nhìn thẳng ra vịnh.',
        descEn: 'Timber bungalow facing the bay.',
        guests: '2',
        maxGuests: '4',
        remaining: '7',
        price: '2500000',
        area: '48 m²',
        tags: 'Hướng biển | Ocean view\nBan công riêng | Private balcony',
    })
    await save(page)

    await expect(page.getByRole('dialog')).toBeHidden()

    // KIỂM Ở TẦNG DỮ LIỆU, không chỉ "thấy chữ trên bảng": bảng có thể hiện
    // đúng tên trong khi giá hoặc số phòng lưu sai — đó chính là loại lỗi
    // `remaining: 4` hard-code từng lọt qua mắt review.
    const saved = await readSavedRoom(page, id)
    expect(saved, 'hạng phòng phải nằm trong catalog.store').not.toBeNull()
    expect(saved).toMatchObject({
        id,
        name: { vi: 'Bungalow E2E Hướng Biển', en: 'E2E Ocean Bungalow' },
        desc: { vi: 'Bungalow gỗ nhìn thẳng ra vịnh.', en: 'Timber bungalow facing the bay.' },
        guests: 2,
        price: 2_500_000,
        area: '48 m²',
        // Số phòng vật lý phải bằng ĐÚNG số đã nhập. Trước đây form không có ô
        // này và code cứng `remaining: 4` cho mọi hạng — mẫu số của mọi phép
        // tính còn trống sai theo (luật B0).
        remaining: 7,
    })

    // Tiện nghi phải giữ ĐỦ HAI NGÔN NGỮ (luật R6).
    expect(saved.tags).toEqual([
        { vi: 'Hướng biển', en: 'Ocean view' },
        { vi: 'Ban công riêng', en: 'Private balcony' },
    ])

    // Và phải hiện trên bảng để người dùng thấy.
    await expect(page.getByRole('cell', { name: id })).toBeVisible()
})

test('1.2 — mô tả KHÔNG bị gán trùng tên phòng', async ({ page }) => {
    // Hồi quy có chủ đích: bản cũ gán `desc: draft.name` vì form thiếu ô mô tả,
    // nên mọi phòng mới tạo hiện ra trang khách với mô tả y hệt tên.
    const id = uniqueId('desc')
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)
    await openCreateModal(page)

    await fillDraft(page, {
        id,
        nameVi: 'Phòng E2E Tên Riêng',
        nameEn: 'E2E Distinct Name',
        descVi: 'Mô tả hoàn toàn khác tên phòng.',
        descEn: 'Description totally different from the name.',
        remaining: '3',
    })
    await save(page)
    await expect(page.getByRole('dialog')).toBeHidden()

    const saved = await readSavedRoom(page, id)
    expect(saved.desc.vi).not.toBe(saved.name.vi)
    expect(saved.desc.en).not.toBe(saved.name.en)
    expect(saved.desc.vi).toBe('Mô tả hoàn toàn khác tên phòng.')
})

test('1.3 — sửa hạng phòng giữ nguyên các trường KHÔNG đụng tới', async ({ page }) => {
    const id = uniqueId('edit')
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)

    await openCreateModal(page)
    await fillDraft(page, {
        id,
        nameVi: 'Phòng E2E Trước Sửa',
        nameEn: 'E2E Before Edit',
        descVi: 'Mô tả gốc.',
        descEn: 'Original description.',
        remaining: '5',
        price: '1800000',
        tags: 'Hướng vườn | Garden view',
    })
    await save(page)
    await expect(page.getByRole('dialog')).toBeHidden()

    // Mở lại đúng hàng đó và CHỈ đổi tên.
    await page.getByRole('row', { name: new RegExp(id) }).getByRole('button', { name: /^Sửa/ }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('dialog').locator('#room-field-name').fill('Phòng E2E Sau Sửa')
    await save(page)

    // Đổi giá gốc mở hộp xác nhận; ở đây KHÔNG đổi giá nên phải lưu thẳng.
    await expect(page.getByRole('dialog')).toBeHidden()

    const saved = await readSavedRoom(page, id)
    expect(saved.name.vi).toBe('Phòng E2E Sau Sửa')
    // Những trường không đụng tới phải còn nguyên — bản patch dễ đánh rơi
    // field khi form chỉ gửi lên một phần.
    expect(saved.desc.vi).toBe('Mô tả gốc.')
    expect(saved.remaining).toBe(5)
    expect(saved.price).toBe(1_800_000)
    expect(saved.tags).toEqual([{ vi: 'Hướng vườn', en: 'Garden view' }])
})

// ═════════════════════════════════════════════════ 2. CHẶN DỮ LIỆU SAI (negative)

test('2.1 — thiếu tên tiếng Anh: KHÔNG lưu, báo lỗi bằng chữ', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)
    await openCreateModal(page)

    const dialog = page.getByRole('dialog')
    await dialog.locator('#room-field-id').fill(uniqueId('missing-en'))
    await dialog.locator('#room-field-name').fill('Chỉ có tiếng Việt')
    // Cố tình bỏ trống ô EN — luật R6 bắt buộc đủ hai ngôn ngữ.
    await save(page)

    // Modal PHẢI còn mở: đóng lại nghĩa là đã lưu dữ liệu thiếu.
    await expect(dialog).toBeVisible()
    // Lỗi hiện bằng CHỮ, không chỉ đổi màu viền (luật D3/FE1).
    await expect(dialog.getByText(/tiếng Anh|English|bắt buộc|required/i).first()).toBeVisible()
})

test('2.2 — sức chứa tối đa NHỎ HƠN tiêu chuẩn: bị chặn', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)
    await openCreateModal(page)

    await fillDraft(page, {
        id: uniqueId('capacity'),
        nameVi: 'Phòng sai sức chứa',
        nameEn: 'Invalid capacity room',
        guests: '4',
        maxGuests: '2', // vô nghĩa: tối đa < tiêu chuẩn
    })
    await save(page)

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
        page.getByRole('dialog').getByText(/Sức chứa tối đa phải lớn hơn|Maximum capacity must be/i),
    ).toBeVisible()
})

test('2.3 — mã hạng sai định dạng: bị chặn', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)
    await openCreateModal(page)

    await fillDraft(page, {
        // Chữ HOA + khoảng trắng + ký tự có dấu — cả ba đều ngoài `ID_SLUG_PATTERN`.
        id: 'E2E Mã Sai!',
        nameVi: 'Phòng mã sai',
        nameEn: 'Bad id room',
    })
    await save(page)

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
        page.getByRole('dialog').getByText(/Mã hạng chỉ gồm chữ thường|accepts lowercase/i),
    ).toBeVisible()
})

test('2.4 — mã hạng TRÙNG: bị chặn, không đè bản ghi cũ', async ({ page }) => {
    const id = uniqueId('dup')
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)

    await openCreateModal(page)
    await fillDraft(page, { id, nameVi: 'Bản gốc', nameEn: 'Original', remaining: '2' })
    await save(page)
    await expect(page.getByRole('dialog')).toBeHidden()

    // Tạo lại đúng mã đó với dữ liệu khác hẳn.
    await openCreateModal(page)
    await fillDraft(page, { id, nameVi: 'Bản đè', nameEn: 'Overwriter', remaining: '99' })
    await save(page)

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
        page.getByRole('dialog').getByText(/đã tồn tại|already exists/i).first(),
    ).toBeVisible()

    // Bản ghi cũ phải NGUYÊN VẸN — đây mới là thiệt hại thật nếu chặn hỏng.
    const saved = await readSavedRoom(page, id)
    expect(saved.name.vi).toBe('Bản gốc')
    expect(saved.remaining).toBe(2)
})

test('2.5 — tiện nghi thiếu một ngôn ngữ: bị chặn', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)
    await openCreateModal(page)

    await fillDraft(page, {
        id: uniqueId('tags'),
        nameVi: 'Phòng tiện nghi thiếu',
        nameEn: 'Missing tag locale',
        // Thiếu dấu `|` ⇒ không có bản tiếng Anh (luật R6).
        tags: 'Hướng biển',
    })
    await save(page)

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
        page.getByRole('dialog').getByText(/đủ hai ngôn ngữ|both languages/i),
    ).toBeVisible()
})

// ═══════════════════════════════════════════════════════════ 3. PHÂN QUYỀN

test('3.1 — editor sửa được nội dung nhưng KHÔNG thấy ô giá', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'editor@namduhill.demo', 'NamDu@Editor2026')
    await gotoRooms(page)

    // Vào được màn (có quyền `content.edit`).
    await expect(page.getByRole('button', { name: /Thêm hạng phòng/i }).first()).toBeVisible()
    await openCreateModal(page)

    const dialog = page.getByRole('dialog')
    // Ô nội dung: CÓ.
    await expect(dialog.locator('#room-field-name')).toBeVisible()
    await expect(dialog.locator('#room-field-desc')).toBeVisible()
    // Ô tiền: KHÔNG (luật B8 — chỉ owner/manager sửa giá).
    await expect(dialog.locator('#room-field-price')).toHaveCount(0)
    await expect(dialog.locator('#room-field-extraBedFee')).toHaveCount(0)
    // Và phải NÓI RÕ vì sao ô giá biến mất, không im lặng giấu đi.
    await expect(page.getByText(/không có quyền sửa giá|cannot edit prices/i)).toBeVisible()
})

test('3.2 — lễ tân bị chặn khỏi màn hạng phòng', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'receptionist@namduhill.demo', 'NamDu@Reception2026')
    await gotoRooms(page)

    // Gõ thẳng URL cũng không lọt — chặn ở server/guard, không phải ẩn menu.
    // `.first()`: màn chặn hiện thông điệp ở cả tiêu đề lẫn phần mô tả.
    await expect(page.getByText(/Không có quyền truy cập|Access denied/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Thêm hạng phòng/i })).toHaveCount(0)
})

// ═══════════════════════════════════════════════ 4. CẢNH BÁO TRƯỚC HẬU QUẢ

test('4.1 — đổi giá gốc phải hỏi lại, kèm số ngày ảnh hưởng', async ({ page }) => {
    const id = uniqueId('price')
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)

    await openCreateModal(page)
    await fillDraft(page, {
        id,
        nameVi: 'Phòng đổi giá',
        nameEn: 'Price change room',
        price: '1000000',
        remaining: '2',
    })
    await save(page)
    await expect(page.getByRole('dialog')).toBeHidden()

    await page.getByRole('row', { name: new RegExp(id) }).getByRole('button', { name: /^Sửa/ }).click()
    await page.getByRole('dialog').locator('#room-field-price').fill('1500000')
    await save(page)

    // Hộp xác nhận PHẢI hiện — đổi giá là hành động có hậu quả (§4.1).
    // Trỏ đích danh: form sửa vẫn mở phía sau nên có hai dialog cùng lúc.
    const confirm = page.getByRole('dialog', { name: /Xác nhận đổi giá gốc/i })
    await expect(confirm).toBeVisible()
    await expect(confirm.getByText(/1.000.000|1,000,000/)).toBeVisible()
    await expect(confirm.getByText(/1.500.000|1,500,000/)).toBeVisible()
    // Và phải trấn an: đơn đã tạo KHÔNG bị tính lại tiền.
    await expect(confirm.getByText(/đơn đã|không (bị )?ảnh hưởng|unaffected/i)).toBeVisible()

    // Bấm Xác nhận thì mới thực sự đổi.
    await confirm.getByRole('button', { name: /Xác nhận/i }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
    expect((await readSavedRoom(page, id)).price).toBe(1_500_000)
})

test('4.2 — huỷ hộp xác nhận đổi giá thì giá GIỮ NGUYÊN', async ({ page }) => {
    const id = uniqueId('price-cancel')
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)

    await openCreateModal(page)
    await fillDraft(page, {
        id,
        nameVi: 'Phòng huỷ đổi giá',
        nameEn: 'Cancel price change',
        price: '900000',
        remaining: '1',
    })
    await save(page)
    await expect(page.getByRole('dialog')).toBeHidden()

    await page.getByRole('row', { name: new RegExp(id) }).getByRole('button', { name: /^Sửa/ }).click()
    await page.getByRole('dialog').locator('#room-field-price').fill('4000000')
    await save(page)

    // Lúc này CÓ HAI dialog chồng nhau: form sửa (vẫn mở phía sau) và hộp xác
    // nhận đổi giá. Phải trỏ đích danh hộp xác nhận qua `aria-label` của nó,
    // `getByRole('dialog')` chung sẽ khớp cả hai.
    const confirm = page.getByRole('dialog', { name: /Xác nhận đổi giá gốc/i })
    await expect(confirm).toBeVisible()
    await confirm.getByRole('button', { name: /^Huỷ$/ }).click()

    // Bấm Huỷ mà giá vẫn đổi thì hộp xác nhận chỉ là trang trí.
    expect((await readSavedRoom(page, id)).price).toBe(900_000)
})

// ═════════════════════════════════════════════════════════════ 5. GIAO DIỆN

test('5.1 — form vừa khung, không phải cuộn để tới nút Lưu', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)
    await openCreateModal(page)

    const dialog = page.getByRole('dialog')
    const box = await dialog.boundingBox()
    expect(box, 'modal phải đo được').not.toBeNull()

    // Lưới 4 cột cần đủ ngang; 560px mặc định làm nhãn xuống hai dòng và các ô
    // cùng hàng lệch nhau (đã quan sát trên ảnh chụp).
    expect(box!.width).toBeGreaterThanOrEqual(800)

    // Vùng cuộn của modal không được tràn — nút Lưu phải thấy ngay.
    const overflow = await dialog.evaluate((el) => {
        const s = el.querySelector('div[style*="overflow"]')
        return s ? { client: s.clientHeight, scroll: s.scrollHeight } : null
    })
    expect(overflow, 'modal phải có vùng nội dung').not.toBeNull()
    expect(overflow!.scroll).toBeLessThanOrEqual(overflow!.client + 1)

    await expect(dialog.getByRole('button', { name: /^Lưu$/ })).toBeInViewport()
})

test('5.2 — nút chính KHÔNG bị xám như nút vô hiệu hoá', async ({ page }) => {
    // Hồi quy: scope `[data-cms]` từng quên khai `--accent`, nút primary của
    // `@repo/ui` rơi về `#a0aec0` xám — trông y hệt nút disabled dù bấm được.
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)

    const addBtn = page.getByRole('button', { name: /Thêm hạng phòng/i }).first()
    const bg = await addBtn.evaluate((el) => getComputedStyle(el).backgroundColor)

    const [r, g, b] = bg.match(/\d+/g)!.map(Number)
    // Xám nghĩa là ba kênh gần bằng nhau. Nút thương hiệu phải lệch rõ.
    const spread = Math.max(r!, g!, b!) - Math.min(r!, g!, b!)
    expect(spread, `nút chính đang xám (${bg}) — kiểm --accent trong cms-ui`).toBeGreaterThan(40)
})

test('5.3 — mọi ô nhập có nhãn gắn đúng, bảng có caption', async ({ page }) => {
    await page.setViewportSize(DESKTOP)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)

    // Bảng dữ liệu phải có `<caption>` và header `scope="col"` (luật FE11/D4).
    await expect(page.locator('table caption')).toHaveCount(1)
    expect(await page.locator('table th[scope="col"]').count()).toBeGreaterThan(0)

    await openCreateModal(page)
    const dialog = page.getByRole('dialog')

    // Mỗi input phải có nhãn gắn đúng — click nhãn là focus vào ô.
    for (const fieldId of ['room-field-name', 'room-field-guests', 'room-field-remaining']) {
        const input = dialog.locator(`#${fieldId}`)
        await expect(input).toBeVisible()
        const labelled = await input.evaluate(
            (el) => !!document.querySelector(`label[for="${el.id}"]`),
        )
        expect(labelled, `${fieldId} thiếu <label for>`).toBe(true)
    }

    // Viền focus phải nhìn thấy — không `outline: none` (luật FE1/D3).
    await dialog.locator('#room-field-name').focus()
    const outline = await dialog
        .locator('#room-field-name')
        .evaluate((el) => getComputedStyle(el).outlineStyle)
    expect(outline).not.toBe('none')
})

test('5.4 — mobile 375px: bảng KHÔNG cuộn ngang', async ({ page }) => {
    await page.setViewportSize(MOBILE)
    await loginAs(page, 'owner@namduhill.demo', 'NamDu@Owner2026')
    await gotoRooms(page)

    // Luật FE5/F6: dưới 640px đổi sang thẻ, cấm cuộn ngang cả trang.
    const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(overflows, 'trang bị tràn ngang ở 375px').toBe(false)
})
