import { afterAll, describe, expect, it } from 'vitest'
import type {
    AddonDto,
    BankSettingsDto,
    RatePlanDto,
    RoomTypeDto,
} from '@repo/core'
import { GET as listRoomTypes, POST as createRoomType } from '@/app/api/admin/room-types/route'
import {
    DELETE as deleteRoomType,
    PATCH as patchRoomType,
} from '@/app/api/admin/room-types/[id]/route'
import { GET as listRatePlans, POST as createRatePlan } from '@/app/api/admin/rate-plans/route'
import {
    DELETE as deleteRatePlan,
    PATCH as patchRatePlan,
} from '@/app/api/admin/rate-plans/[id]/route'
import { GET as listAddons, POST as createAddon } from '@/app/api/admin/addons/route'
import { DELETE as deleteAddon, PATCH as patchAddon } from '@/app/api/admin/addons/[id]/route'
import { GET as getBank, PATCH as patchBank } from '@/app/api/admin/settings/bank/route'
import { call, callWithParams, expectFail, expectOk } from '../helpers/request'
import { loginAs } from '../helpers/auth'
import {
    adminDb,
    dayOffset,
    RUN_ID,
    seedRoomType,
    teardown,
    TEST_PREFIX,
    trackAddon,
    trackBooking,
    trackRatePlan,
    trackRoomType,
} from '../helpers/seed'

/**
 * Ticket `390-01` — M9: 4 nhóm API danh mục.
 *
 * AC-12 yêu cầu **≥16 case, ≥9 negative**. Bộ này có **26 case, 15 negative**.
 *
 * ─── VÌ SAO NHIỀU NEGATIVE HƠN POSITIVE ────────────────────────────────────
 *
 * Đường hạnh phúc của CRUD gần như không thể sai im lặng: gọi POST rồi GET
 * không thấy là đỏ ngay. Thứ **sai im lặng** ở đây là ba nhánh khác:
 *   ① lễ tân sửa được giá (§B8) — UI ẩn nút nên không ai thấy cho tới khi lộ;
 *   ② xoá cứng hạng phòng làm mồ côi `bookings.room_type_id` — chỉ phát hiện
 *      khi tra lại lịch sử đơn, tức là lúc đang tranh chấp với khách;
 *   ③ dữ liệu thiếu một ngôn ngữ (R6) — trang khách hiện ô trống, không đỏ ở
 *      bất kỳ đâu.
 * Ba thứ đó chỉ có negative test mới chứng minh được.
 *
 * ─── DỌN DẸP ───────────────────────────────────────────────────────────────
 *
 * Test chạy thẳng vào DB dev chung (nợ `M24b`). Mọi bản ghi mang tiền tố
 * `zz-test-<runId>`; id do **route** tạo được ghi nhận bằng `trackRoomType()` /
 * `trackRatePlan()` / `trackAddon()` ngay sau khi POST trả về.
 */

afterAll(teardown)

/** Slug hợp lệ, luôn khớp `chk_*_id_slug` và luôn bị teardown quét. */
function testId(label: string): string {
    return `${TEST_PREFIX}-${label}-${RUN_ID}`.toLowerCase()
}

/**
 * Tạo một đơn thẳng vào DB để dựng kịch bản "hạng phòng đang được dùng".
 *
 * Tên cột lấy nguyên từ `information_schema.columns` — `guest_full_name` chứ
 * không `guest_name`, `num_adults` + `child_ages` chứ không một object `guests`.
 * Đây đúng bẫy MAP §3: TypeScript không biết gì về schema nên sai tên cột chỉ
 * nổ lúc chạy bằng `42703`/`23502`.
 */
async function seedBooking(input: {
    roomTypeId: string
    status: 'confirmed' | 'checked_out'
    checkIn: string
    checkOut: string
}): Promise<string> {
    const code = `ZZ-${RUN_ID}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase()
    const nights = Math.round(
        (Date.parse(`${input.checkOut}T00:00:00Z`) - Date.parse(`${input.checkIn}T00:00:00Z`))
        / 86_400_000,
    )
    const { data, error } = await adminDb()
        .from('bookings')
        .insert({
            code,
            room_type_id: input.roomTypeId,
            rate_plan_id: 'standard',
            check_in: input.checkIn,
            check_out: input.checkOut,
            nights,
            num_adults: 2,
            guest_full_name: 'Khách test danh mục',
            guest_phone: '0900000001',
            guest_email: `${TEST_PREFIX}-catalog-${RUN_ID}@example.com`,
            status: input.status,
            subtotal: 2_000_000,
            discount_total: 0,
            total_amount: 2_000_000,
            deposit_amount: 600_000,
            paid_amount: input.status === 'checked_out' ? 2_000_000 : 600_000,
        })
        .select('id')
        .single<{ id: string }>()

    if (error) throw new Error(`Seed booking thất bại: ${error.message}`)
    trackBooking(data.id)
    return data.id
}

const RT_PATH = '/api/admin/room-types'
const RP_PATH = '/api/admin/rate-plans'
const AD_PATH = '/api/admin/addons'
const BANK_PATH = '/api/admin/settings/bank'

function roomTypeBody(id: string): Record<string, unknown> {
    return {
        id,
        name: { vi: 'Bungalow test', en: 'Test bungalow' },
        description: { vi: 'Mô tả test.', en: 'Test description.' },
        area: '42 m²',
        guests: 2,
        maxGuests: 4,
        defaultGuests: 2,
        basePrice: 1_500_000,
    }
}

// ══════════════════════════════════════════════ hạng phòng — 12 case

describe('M9 · /api/admin/room-types', () => {
    it('[1] owner tạo được hạng phòng, đọc lại từ SERVER thấy đúng dữ liệu', async () => {
        const session = await loginAs('owner')
        const id = testId('rt-create')

        const created = expectOk<{ item: RoomTypeDto }>(
            await call(createRoomType, RT_PATH, { method: 'POST', session, json: roomTypeBody(id) }),
            201,
        )
        trackRoomType(id)

        expect(created.item.id).toBe(id)
        expect(created.item.basePrice).toBe(1_500_000)
        // `numeric` của Postgres về JS là CHUỖI qua PostgREST. Nếu mapper quên
        // ép thì `basePrice` là `"1500000"` và phép nhân giá ra chuỗi nối.
        expect(typeof created.item.basePrice).toBe('number')
        expect(created.item.active).toBe(true)

        // Bằng chứng theo luật A3: đọc lại từ SERVER, không tin response của POST.
        const listed = expectOk<{ items: RoomTypeDto[]; total: number }>(
            await call(listRoomTypes, RT_PATH, { session }),
        )
        const found = listed.items.find((r) => r.id === id)
        expect(found, 'hạng phòng vừa tạo phải có trong GET').toBeDefined()
        expect(found?.name.vi).toBe('Bungalow test')
        expect(listed.total).toBe(listed.items.length)
    })

    it('[2] NEGATIVE — không token → 401 UNAUTHENTICATED (phân biệt với 403)', async () => {
        expectFail(await call(listRoomTypes, RT_PATH), 401, 'UNAUTHENTICATED')
    })

    it('[3] NEGATIVE — lễ tân POST → 403 FORBIDDEN (§B8: không sửa giá)', async () => {
        const session = await loginAs('receptionist')
        expectFail(
            await call(createRoomType, RT_PATH, {
                method: 'POST',
                session,
                json: roomTypeBody(testId('rt-recep')),
            }),
            403,
            'FORBIDDEN',
        )
    })

    it('[4] lễ tân GET được — có price.view, chỉ thiếu price.edit', async () => {
        const session = await loginAs('receptionist')
        const data = expectOk<{ items: RoomTypeDto[] }>(await call(listRoomTypes, RT_PATH, { session }))
        expect(Array.isArray(data.items)).toBe(true)
    })

    it('[5] NEGATIVE — thiếu name.en → 400 VALIDATION_FAILED, chỉ đúng ô sai (R6)', async () => {
        const session = await loginAs('owner')
        const body = roomTypeBody(testId('rt-noen'))
        body.name = { vi: 'Chỉ tiếng Việt' }

        const err = expectFail(
            await call(createRoomType, RT_PATH, { method: 'POST', session, json: body }),
            400,
            'VALIDATION_FAILED',
        ) as unknown as { fields?: { field: string }[] }

        expect(err.fields?.map((f) => f.field)).toContain('name')
    })

    it('[6] NEGATIVE — basePrice âm → 400', async () => {
        const session = await loginAs('owner')
        const body = roomTypeBody(testId('rt-neg'))
        body.basePrice = -1
        expectFail(
            await call(createRoomType, RT_PATH, { method: 'POST', session, json: body }),
            400,
            'VALIDATION_FAILED',
        )
    })

    it('[7] NEGATIVE — guests = 0 → 400 (chk_room_types_capacity: guests > 0)', async () => {
        const session = await loginAs('owner')
        const body = roomTypeBody(testId('rt-zero'))
        body.guests = 0
        expectFail(
            await call(createRoomType, RT_PATH, { method: 'POST', session, json: body }),
            400,
            'VALIDATION_FAILED',
        )
    })

    it('[8] NEGATIVE — basePrice là chuỗi → 400, KHÔNG phải 500', async () => {
        const session = await loginAs('owner')
        const body = roomTypeBody(testId('rt-str'))
        body.basePrice = '1500000'
        // Lọt xuống DB thì Postgres ném 22P02 và route chỉ dịch được thành 500 —
        // sai địa chỉ trách nhiệm: dữ liệu vào sai là lỗi của client, không phải
        // "hệ thống gặp sự cố".
        expectFail(
            await call(createRoomType, RT_PATH, { method: 'POST', session, json: body }),
            400,
            'VALIDATION_FAILED',
        )
    })

    it('[9] NEGATIVE — slug sai định dạng (CHỮ HOA) → 400 trước khi chạm DB', async () => {
        const session = await loginAs('owner')
        const body = roomTypeBody(testId('rt-slug'))
        body.id = 'ZZ-TEST-Hoa'
        expectFail(
            await call(createRoomType, RT_PATH, { method: 'POST', session, json: body }),
            400,
            'VALIDATION_FAILED',
        )
    })

    it('[10] NEGATIVE — tạo trùng slug → 409 DUPLICATE_ID', async () => {
        const session = await loginAs('owner')
        const id = testId('rt-dup')

        expectOk(await call(createRoomType, RT_PATH, { method: 'POST', session, json: roomTypeBody(id) }), 201)
        trackRoomType(id)

        expectFail(
            await call(createRoomType, RT_PATH, { method: 'POST', session, json: roomTypeBody(id) }),
            409,
            'DUPLICATE_ID',
        )
    })

    it('[11] PATCH đổi giá — đọc lại từ server thấy giá mới', async () => {
        const session = await loginAs('owner')
        const id = testId('rt-patch')
        expectOk(await call(createRoomType, RT_PATH, { method: 'POST', session, json: roomTypeBody(id) }), 201)
        trackRoomType(id)

        const patched = expectOk<{ item: RoomTypeDto }>(
            await callWithParams(patchRoomType, `${RT_PATH}/${id}`, { id }, {
                method: 'PATCH',
                session,
                json: { basePrice: 2_000_000 },
            }),
        )
        expect(patched.item.basePrice).toBe(2_000_000)
        // Trường không gửi phải giữ nguyên — PATCH là sửa MỘT PHẦN.
        expect(patched.item.area).toBe('42 m²')

        const { data } = await adminDb().from('room_types').select('base_price').eq('id', id).single()
        expect(Number((data as { base_price: unknown }).base_price)).toBe(2_000_000)
    })

    it('[12] NEGATIVE — PATCH maxGuests < guests hiện tại → 400 (kiểm SAU khi trộn)', async () => {
        const session = await loginAs('owner')
        const id = testId('rt-cap')
        expectOk(await call(createRoomType, RT_PATH, { method: 'POST', session, json: roomTypeBody(id) }), 201)
        trackRoomType(id)

        // Body chỉ gửi `maxGuests`, trông vô hại. Kiểm trên body thì lọt, và DB
        // ném 23514 → 500. Phải kiểm trên giá trị sau khi trộn với hàng hiện tại.
        expectFail(
            await callWithParams(patchRoomType, `${RT_PATH}/${id}`, { id }, {
                method: 'PATCH',
                session,
                json: { maxGuests: 1 },
            }),
            400,
            'VALIDATION_FAILED',
        )
    })

    it('[13] NEGATIVE — PATCH id không tồn tại → 404 NOT_FOUND', async () => {
        const session = await loginAs('owner')
        expectFail(
            await callWithParams(patchRoomType, `${RT_PATH}/khong-ton-tai`, { id: 'khong-ton-tai' }, {
                method: 'PATCH',
                session,
                json: { basePrice: 1 },
            }),
            404,
            'NOT_FOUND',
        )
    })

    it('[14] DELETE là SOFT DELETE — hàng còn nguyên trong DB, chỉ active = false', async () => {
        const session = await loginAs('owner')
        const id = testId('rt-soft')
        expectOk(await call(createRoomType, RT_PATH, { method: 'POST', session, json: roomTypeBody(id) }), 201)
        trackRoomType(id)

        const deleted = expectOk<{ id: string; active: boolean; softDeleted: boolean }>(
            await callWithParams(deleteRoomType, `${RT_PATH}/${id}`, { id }, { method: 'DELETE', session }),
        )
        expect(deleted.softDeleted).toBe(true)
        expect(deleted.active).toBe(false)

        // Bằng chứng KHÔNG xoá cứng: hàng vẫn tồn tại. Nếu route lỡ dùng
        // `.delete()` thì đây là chỗ duy nhất phát hiện được — response của
        // DELETE trông y hệt trong cả hai trường hợp.
        const { data } = await adminDb().from('room_types').select('id, active').eq('id', id).maybeSingle()
        expect(data, 'soft delete KHÔNG được xoá hàng khỏi DB').not.toBeNull()
        expect((data as { active: boolean }).active).toBe(false)

        // Mặc định GET chỉ trả hạng đang bán…
        const listed = expectOk<{ items: RoomTypeDto[] }>(await call(listRoomTypes, RT_PATH, { session }))
        expect(listed.items.some((r) => r.id === id)).toBe(false)

        // …nhưng `includeInactive=true` phải thấy, nếu không admin tắt nhầm là
        // không có đường nào bật lại ngoài vào thẳng DB.
        const withInactive = expectOk<{ items: RoomTypeDto[] }>(
            await call(listRoomTypes, RT_PATH, { session, query: { includeInactive: 'true' } }),
        )
        expect(withInactive.items.some((r) => r.id === id)).toBe(true)
    })

    it('[15] NEGATIVE — DELETE hạng đang có đơn confirmed → 409 kèm activeBookingCount', async () => {
        const session = await loginAs('owner')
        // Dùng `seedRoomType()` vì cần kèm inventory để đơn đứng vững.
        const roomTypeId = await seedRoomType({
            label: 'rt-inuse',
            basePrice: 1_000_000,
            totalUnits: 3,
            from: dayOffset(10),
            to: dayOffset(12),
        })

        await seedBooking({
            roomTypeId,
            status: 'confirmed',
            checkIn: dayOffset(10),
            checkOut: dayOffset(12),
        })

        const err = expectFail(
            await callWithParams(deleteRoomType, `${RT_PATH}/${roomTypeId}`, { id: roomTypeId }, {
                method: 'DELETE',
                session,
            }),
            409,
            'ROOM_TYPE_IN_USE',
        ) as unknown as { activeBookingCount?: number }

        // Nợ `M32`: trước ticket này `fail()` chỉ nhận 3 tham số nên field phụ
        // rơi mất — FE đọc ra `undefined` mà typecheck vẫn xanh. Assert ở đây là
        // chốt chặn chống trượt lại.
        expect(err.activeBookingCount, 'FE cần con số này để hiện cho admin').toBe(1)

        // Hạng phòng phải CÒN active — chặn nghĩa là không đổi gì cả.
        const { data } = await adminDb().from('room_types').select('active').eq('id', roomTypeId).single()
        expect((data as { active: boolean }).active).toBe(true)
    })

    it('[16] NEGATIVE — đơn đã checked_out KHÔNG chặn soft delete (ngưỡng SA chốt)', async () => {
        const session = await loginAs('owner')
        const roomTypeId = await seedRoomType({
            label: 'rt-closed',
            basePrice: 1_000_000,
            totalUnits: 2,
            from: dayOffset(20),
            to: dayOffset(22),
        })

        await seedBooking({
            roomTypeId,
            status: 'checked_out',
            checkIn: dayOffset(20),
            checkOut: dayOffset(22),
        })

        // Đếm cả `checked_out` là chặn nhầm: hạng bán 3 năm có hàng trăm đơn đã
        // đóng, admin sẽ không bao giờ tắt được nó và cũng không hiểu vì sao.
        const deleted = expectOk<{ softDeleted: boolean }>(
            await callWithParams(deleteRoomType, `${RT_PATH}/${roomTypeId}`, { id: roomTypeId }, {
                method: 'DELETE',
                session,
            }),
        )
        expect(deleted.softDeleted).toBe(true)
    })
})

// ══════════════════════════════════════════════ gói giá — 6 case

describe('M9 · /api/admin/rate-plans', () => {
    function ratePlanBody(id: string): Record<string, unknown> {
        return {
            id,
            name: { vi: 'Gói test', en: 'Test plan' },
            description: { vi: 'Mô tả gói test.', en: 'Test plan description.' },
            adjustPercent: -15,
            depositPercent: 30,
        }
    }

    it('[17] owner tạo gói giá, GET đọc lại thấy đủ field', async () => {
        const session = await loginAs('owner')
        const id = testId('rp-create')

        const created = expectOk<{ item: RatePlanDto }>(
            await call(createRatePlan, RP_PATH, { method: 'POST', session, json: ratePlanBody(id) }),
            201,
        )
        trackRatePlan(id)
        expect(created.item.adjustPercent).toBe(-15)
        expect(created.item.depositPercent).toBe(30)
        expect(created.item.refundable).toBe(true)

        const listed = expectOk<{ items: RatePlanDto[]; total: number }>(
            await call(listRatePlans, RP_PATH, { session }),
        )
        expect(listed.items.some((p) => p.id === id)).toBe(true)
    })

    it('[18] NEGATIVE — lễ tân PATCH gói giá → 403 (price.edit)', async () => {
        const session = await loginAs('receptionist')
        expectFail(
            await callWithParams(patchRatePlan, `${RP_PATH}/standard`, { id: 'standard' }, {
                method: 'PATCH',
                session,
                json: { depositPercent: 10 },
            }),
            403,
            'FORBIDDEN',
        )
    })

    it('[19] NEGATIVE — không token DELETE → 401', async () => {
        expectFail(
            await callWithParams(deleteRatePlan, `${RP_PATH}/standard`, { id: 'standard' }, {
                method: 'DELETE',
            }),
            401,
            'UNAUTHENTICATED',
        )
    })

    it('[20] NEGATIVE — refundable=false kèm bậc thang → 400 REFUND_RULES_CONFLICT', async () => {
        const session = await loginAs('owner')
        const body = ratePlanBody(testId('rp-conflict'))
        body.refundable = false
        body.cancellationRules = [{ daysBeforeCheckIn: 7, refundPercent: 100 }]

        // Khớp `chk_rate_plans_refund`. Mã riêng chứ không VALIDATION_FAILED:
        // đây là mâu thuẫn giữa HAI trường, FE phải nói "chọn một trong hai".
        expectFail(
            await call(createRatePlan, RP_PATH, { method: 'POST', session, json: body }),
            400,
            'REFUND_RULES_CONFLICT',
        )
    })

    it('[21] NEGATIVE — PATCH refundable=false trên gói ĐANG có bậc thang → 400', async () => {
        const session = await loginAs('owner')
        const id = testId('rp-patchconf')
        const body = ratePlanBody(id)
        body.cancellationRules = [{ daysBeforeCheckIn: 3, refundPercent: 50 }]
        expectOk(await call(createRatePlan, RP_PATH, { method: 'POST', session, json: body }), 201)
        trackRatePlan(id)

        // Body chỉ có `refundable: false` — trông vô hại. Cùng bẫy như case [12].
        expectFail(
            await callWithParams(patchRatePlan, `${RP_PATH}/${id}`, { id }, {
                method: 'PATCH',
                session,
                json: { refundable: false },
            }),
            400,
            'REFUND_RULES_CONFLICT',
        )
    })

    it('[22] NEGATIVE — depositPercent = 120 → 400 (chk 0..100)', async () => {
        const session = await loginAs('owner')
        const body = ratePlanBody(testId('rp-deposit'))
        body.depositPercent = 120
        expectFail(
            await call(createRatePlan, RP_PATH, { method: 'POST', session, json: body }),
            400,
            'VALIDATION_FAILED',
        )
    })

    it('[23] DELETE gói giá không có đơn → soft delete, hàng còn trong DB', async () => {
        const session = await loginAs('owner')
        const id = testId('rp-soft')
        expectOk(await call(createRatePlan, RP_PATH, { method: 'POST', session, json: ratePlanBody(id) }), 201)
        trackRatePlan(id)

        const deleted = expectOk<{ softDeleted: boolean; active: boolean }>(
            await callWithParams(deleteRatePlan, `${RP_PATH}/${id}`, { id }, { method: 'DELETE', session }),
        )
        expect(deleted.softDeleted).toBe(true)

        const { data } = await adminDb().from('rate_plans').select('active').eq('id', id).maybeSingle()
        expect(data, 'soft delete KHÔNG được xoá hàng').not.toBeNull()
        expect((data as { active: boolean }).active).toBe(false)
    })
})

// ══════════════════════════════════════════════ dịch vụ — 4 case

describe('M9 · /api/admin/addons', () => {
    function addonBody(id: string): Record<string, unknown> {
        return {
            id,
            name: { vi: 'Đưa đón tàu test', en: 'Test ferry transfer' },
            price: 300_000,
            unit: { vi: 'khách / chiều', en: 'guest / way' },
        }
    }

    it('[24] editor tạo được addon — content.edit, KHÔNG cần price.edit', async () => {
        const session = await loginAs('editor')
        const id = testId('ad-create')

        const created = expectOk<{ item: AddonDto }>(
            await call(createAddon, AD_PATH, { method: 'POST', session, json: addonBody(id) }),
            201,
        )
        trackAddon(id)
        expect(created.item.price).toBe(300_000)
        expect(created.item.unit.en).toBe('guest / way')

        const listed = expectOk<{ items: AddonDto[] }>(await call(listAddons, AD_PATH, { session }))
        expect(listed.items.some((a) => a.id === id)).toBe(true)
    })

    it('[25] NEGATIVE — lễ tân GET addon → 403 (chỉ có price.view, KHÔNG content.edit)', async () => {
        // Ngược chiều case [4]: lễ tân đọc được hạng phòng nhưng KHÔNG đọc được
        // dịch vụ. Hai quyền khác nhau cho hai danh mục là chủ ý của hợp đồng,
        // không phải nhầm lẫn — assert ở đây để không ai "sửa cho đồng nhất".
        const session = await loginAs('receptionist')
        expectFail(await call(listAddons, AD_PATH, { session }), 403, 'FORBIDDEN')
    })

    it('[26] NEGATIVE — unit thiếu tiếng Anh → 400 (R6, addons.unit KHÔNG có CHECK ở DB)', async () => {
        const session = await loginAs('editor')
        const body = addonBody(testId('ad-nounit'))
        body.unit = { vi: 'khách / chiều' }

        const err = expectFail(
            await call(createAddon, AD_PATH, { method: 'POST', session, json: body }),
            400,
            'VALIDATION_FAILED',
        ) as unknown as { fields?: { field: string }[] }
        expect(err.fields?.map((f) => f.field)).toContain('unit')
    })

    it('[27] PATCH + DELETE addon — soft delete, không có nhánh 409', async () => {
        const session = await loginAs('editor')
        const id = testId('ad-soft')
        expectOk(await call(createAddon, AD_PATH, { method: 'POST', session, json: addonBody(id) }), 201)
        trackAddon(id)

        const patched = expectOk<{ item: AddonDto }>(
            await callWithParams(patchAddon, `${AD_PATH}/${id}`, { id }, {
                method: 'PATCH',
                session,
                json: { price: 450_000 },
            }),
        )
        expect(patched.item.price).toBe(450_000)

        const deleted = expectOk<{ softDeleted: boolean }>(
            await callWithParams(deleteAddon, `${AD_PATH}/${id}`, { id }, { method: 'DELETE', session }),
        )
        expect(deleted.softDeleted).toBe(true)

        const { data } = await adminDb().from('addons').select('active').eq('id', id).maybeSingle()
        expect(data).not.toBeNull()
        expect((data as { active: boolean }).active).toBe(false)
    })

    it('[28] NEGATIVE — DELETE addon không tồn tại → 404', async () => {
        const session = await loginAs('editor')
        expectFail(
            await callWithParams(deleteAddon, `${AD_PATH}/khong-co-that`, { id: 'khong-co-that' }, {
                method: 'DELETE',
                session,
            }),
            404,
            'NOT_FOUND',
        )
    })
})

// ══════════════════════════════════════════════ ngân hàng — 4 case

describe('M9 · /api/admin/settings/bank', () => {
    /**
     * Route này ghi vào hàng cấu hình DUY NHẤT của cơ sở — không cô lập được
     * bằng tiền tố `zz-test-` như các danh mục khác. Nên: đọc giá trị gốc TRƯỚC,
     * khôi phục nguyên trạng SAU. Không làm vậy thì test để lại số tài khoản giả
     * trong DB dev chung, và người mở CMS sau đó thấy đúng số đó.
     */
    let original: BankSettingsDto | null = null

    afterAll(async () => {
        if (original === null) return
        const { error } = await adminDb()
            .from('property_settings')
            .update({ bank: original })
            .eq('id', 'nam-du-hill')
        if (error) throw new Error(`Không khôi phục được cấu hình bank: ${error.message}`)
    })

    it('[29] owner đọc được cấu hình — `{}` là trạng thái HỢP LỆ, không phải lỗi', async () => {
        const session = await loginAs('owner')
        const data = expectOk<{ bank: BankSettingsDto }>(await call(getBank, BANK_PATH, { session }))
        original = data.bank
        // Cơ sở mới cài đặt chưa nhập gì. FE phải chịu được object rỗng và
        // KHÔNG được giả định đã có số tài khoản (SA chốt 380-02 §8.3 điểm 1).
        expect(typeof data.bank).toBe('object')
    })

    it('[30] NEGATIVE — manager đọc → 403 (settings.bank CHỈ owner)', async () => {
        const session = await loginAs('manager')
        // Manager có gần hết quyền vận hành nhưng KHÔNG có `settings.bank`:
        // đây là tài khoản nhận tiền của cơ sở, không phải dữ liệu vận hành.
        expectFail(await call(getBank, BANK_PATH, { session }), 403, 'FORBIDDEN')
    })

    it('[31] owner PATCH — đọc lại từ SERVER thấy giá trị mới, trường không gửi giữ nguyên', async () => {
        const session = await loginAs('owner')

        expectOk<{ bank: BankSettingsDto }>(
            await call(patchBank, BANK_PATH, {
                method: 'PATCH',
                session,
                json: {
                    bankName: 'Vietcombank',
                    accountNumber: '0071000123456',
                    accountHolder: 'NAM DU HILL',
                    defaultDepositPercent: 30,
                },
            }),
        )

        // PATCH thứ hai chỉ đổi tên chủ TK. Nếu route ghi đè cả object thì số
        // tài khoản biến mất — đúng loại lỗi làm tiền cọc đi lạc.
        const second = expectOk<{ bank: BankSettingsDto; updatedAt: string }>(
            await call(patchBank, BANK_PATH, {
                method: 'PATCH',
                session,
                json: { accountHolder: 'CONG TY NAM DU HILL' },
            }),
        )
        expect(second.bank.accountHolder).toBe('CONG TY NAM DU HILL')
        expect(second.bank.accountNumber, 'PATCH là sửa MỘT PHẦN, không ghi đè').toBe('0071000123456')
        expect(second.bank.bankName).toBe('Vietcombank')
        expect(second.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)

        const readBack = expectOk<{ bank: BankSettingsDto }>(await call(getBank, BANK_PATH, { session }))
        expect(readBack.bank.accountNumber).toBe('0071000123456')
    })

    it('[32] NEGATIVE — số tài khoản có ký tự lạ → 400, không ghi vào DB', async () => {
        const session = await loginAs('owner')
        const err = expectFail(
            await call(patchBank, BANK_PATH, {
                method: 'PATCH',
                session,
                json: { accountNumber: '0071 0001-2345' },
            }),
            400,
            'VALIDATION_FAILED',
        ) as unknown as { fields?: { field: string }[] }
        expect(err.fields?.map((f) => f.field)).toContain('accountNumber')

        // Giá trị hợp lệ của case [31] phải còn nguyên — 400 nghĩa là không ghi gì.
        const readBack = expectOk<{ bank: BankSettingsDto }>(await call(getBank, BANK_PATH, { session }))
        expect(readBack.bank.accountNumber).toBe('0071000123456')
    })

    it('[33] NEGATIVE — defaultDepositPercent = 150 → 400', async () => {
        const session = await loginAs('owner')
        expectFail(
            await call(patchBank, BANK_PATH, {
                method: 'PATCH',
                session,
                json: { defaultDepositPercent: 150 },
            }),
            400,
            'VALIDATION_FAILED',
        )
    })
})
