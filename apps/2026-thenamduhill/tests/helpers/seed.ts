import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Seed + teardown cho tầng 2 (ticket 400-01, AC-12).
 *
 * ─── VÌ SAO KHÔNG DÙNG SUPABASE LOCAL ─────────────────────────────────────
 *
 * Ticket ghi "Supabase local (`supabase start`)". Đã đo, **không chạy được**:
 *   ① `docker ps` → `open //./pipe/docker_engine: The system cannot find the
 *      file specified` — Docker CLI có cài (24.0.6) nhưng daemon không chạy.
 *   ② Fallback branching của `M24` → `402 entitlement_required`,
 *      "Branching is supported only on the Pro plan or above".
 *
 * Cả hai đường của `M24` đều chết ⇒ dùng đường 3, ghi nợ `M24b`: chạy thẳng
 * vào DB dev chung nhưng **cô lập bằng tiền tố `zz-test-<runId>`** và dọn sạch
 * ở `afterAll`. DB đó đang có 148 đơn seed — test **không được** chạm vào.
 *
 * ─── VÌ SAO TIỀN TỐ `zz-` ─────────────────────────────────────────────────
 *
 * `room_types.id` là slug text và các màn CMS sắp xếp theo tên/id. `zz-` đẩy
 * mọi bản ghi test xuống cuối danh sách, nên nếu teardown có sót thì người mở
 * CMS vẫn thấy dữ liệu thật trước, không bị rác chen vào giữa.
 */

let cached: SupabaseClient | null = null

/**
 * Chạy SQL bằng quyền `postgres` qua Management API.
 *
 * ⚠️ CHỈ dùng cho teardown bảng `activity_logs`. Bảng đó **cố ý** không cấp
 * `UPDATE`/`DELETE` cho `service_role` — nhật ký đơn hàng là **bất biến**
 * (luật BE5), và đó là thứ cứu mình khi tranh chấp với khách. Test không được
 * nới quyền đó; nó chỉ mượn một đường khác, hẹp hơn, để dọn rác của chính mình.
 *
 * Đây là bằng chứng tính bất biến đang hoạt động thật, không phải chỗ để "sửa
 * cho tiện": bản đầu của teardown dùng service role và nhận đúng
 * `permission denied for table activity_logs`.
 */
async function runPrivilegedSql(query: string): Promise<void> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const accessToken = process.env.SUPABASE_ACCESS_TOKEN
    if (!url || !accessToken) {
        throw new Error(
            'Thiếu SUPABASE_ACCESS_TOKEN — không dọn được activity_logs. '
            + 'Xem MANUAL.md M24b.',
        )
    }
    const ref = new URL(url).hostname.split('.')[0]
    const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
    if (!res.ok) {
        throw new Error(`SQL đặc quyền thất bại (${res.status}): ${(await res.text()).slice(0, 300)}`)
    }
}

/** Chuỗi id an toàn cho câu `IN (...)` — chỉ nhận UUID/slug do chính test tạo. */
function sqlIdList(ids: string[]): string {
    const safe = ids.filter((id) => /^[a-zA-Z0-9-]+$/.test(id))
    return safe.map((id) => `'${id}'`).join(',')
}

/** Client service role dùng cho seed/teardown/đọc lại kiểm chứng. */
export function adminDb(): SupabaseClient {
    if (cached) return cached
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Thiếu cấu hình Supabase cho test')
    cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    return cached
}

/** Tiền tố nhận diện mọi bản ghi do test tạo. */
export const TEST_PREFIX = 'zz-test'

/** Id duy nhất cho một lần chạy — chặn hai lần chạy giẫm chân nhau. */
export const RUN_ID = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** SĐT test: `09` + 8 số, khớp `PHONE_RE` của `/api/auth/register`. */
let phoneCounter = 0
export function testPhone(): string {
    phoneCounter += 1
    const tail = String(Date.now() % 1_000_000).padStart(6, '0')
    return `09${tail}${String(phoneCounter % 100).padStart(2, '0')}`
}

export function testEmail(label: string): string {
    return `${TEST_PREFIX}-${label}-${RUN_ID}@example.com`.toLowerCase()
}

/** Ngày `YYYY-MM-DD` cách hôm nay `offset` ngày, tính theo UTC (luật C6/B5). */
export function dayOffset(offset: number): string {
    const base = Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`)
    return new Date(base + offset * 86_400_000).toISOString().slice(0, 10)
}

/** Liệt kê các đêm từ `checkIn` tới `checkOut - 1` (§B3: tính theo từng đêm). */
export function nightsBetween(checkIn: string, checkOut: string): string[] {
    const out: string[] = []
    let cur = Date.parse(`${checkIn}T00:00:00Z`)
    const end = Date.parse(`${checkOut}T00:00:00Z`)
    while (cur < end) {
        out.push(new Date(cur).toISOString().slice(0, 10))
        cur += 86_400_000
    }
    return out
}

// ─────────────────────────── theo dõi để dọn ────────────────────────────────

const createdRoomTypes = new Set<string>()
const createdAccounts = new Set<string>()
const createdPromotions = new Set<string>()
const createdBookings = new Set<string>()
/** Danh mục do route `390-01` tạo — test không insert thẳng nên phải ghi nhận tay. */
const createdRatePlans = new Set<string>()
const createdAddons = new Set<string>()

export function trackBooking(id: string): void {
    createdBookings.add(id)
}

/**
 * Ghi nhận bản ghi do **route** tạo (POST `/api/admin/rate-plans` · `/addons`).
 *
 * Khác `seedRoomType()`: ở đó test tự INSERT nên hàm seed tự thêm vào danh sách
 * dọn. Ở đây thứ đang được test **chính là** route tạo bản ghi, nên id chỉ biết
 * được sau khi gọi. Quên gọi hàm này = rác `zz-test-*` nằm lại DB dev chung.
 */
export function trackRatePlan(id: string): void {
    createdRatePlans.add(id)
}

export function trackAddon(id: string): void {
    createdAddons.add(id)
}

/** Đăng ký một `room_types.id` do route tạo vào danh sách dọn. */
export function trackRoomType(id: string): void {
    createdRoomTypes.add(id)
}

// ─────────────────────────── các hàm seed ───────────────────────────────────

export interface SeedRoomTypeOptions {
    /** Nhãn ngắn phân biệt hạng phòng trong cùng một lần chạy. */
    label: string
    basePrice: number
    /** Số phòng mở bán mỗi đêm. `1` để dựng kịch bản hết phòng. */
    totalUnits: number
    /** Khoảng ngày cần tạo inventory. */
    from: string
    to: string
    maxGuests?: number
    /** Giá đè theo từng ngày — `{ '2026-09-01': 3_000_000 }` (§B3 bước ③). */
    priceOverrides?: Record<string, number>
    minNights?: Record<string, number>
    closedToArrival?: string[]
}

/**
 * Tạo một hạng phòng test + inventory cho khoảng ngày.
 * Trả về `id` dạng `zz-test-<label>-<runId>` (khớp `chk_room_types_id_slug`).
 */
export async function seedRoomType(opts: SeedRoomTypeOptions): Promise<string> {
    const id = `${TEST_PREFIX}-${opts.label}-${RUN_ID}`.toLowerCase()
    const db = adminDb()

    const { error: rtError } = await db.from('room_types').insert({
        id,
        name: { vi: `Phòng test ${opts.label}`, en: `Test room ${opts.label}` },
        description: { vi: 'Bản ghi do test tạo.', en: 'Record created by test.' },
        // `area` là NOT NULL không có default — bỏ trống thì `23502`. Cùng loại
        // với `chk_accounts_staff_pw`: TypeScript không thấy, build vẫn xanh.
        area: '30m²',
        base_price: opts.basePrice,
        guests: opts.maxGuests ?? 2,
        max_guests: opts.maxGuests ?? 2,
        default_guests: 2,
        active: true,
    })
    if (rtError) throw new Error(`Seed room_type thất bại: ${rtError.message}`)
    createdRoomTypes.add(id)

    const rows = nightsBetween(opts.from, opts.to).map((date) => ({
        room_type_id: id,
        date,
        total_units: opts.totalUnits,
        booked_units: 0,
        blocked_units: 0,
        price_override: opts.priceOverrides?.[date] ?? null,
        min_nights: opts.minNights?.[date] ?? null,
        closed_to_arrival: opts.closedToArrival?.includes(date) ?? false,
    }))
    if (rows.length > 0) {
        const { error: invError } = await db.from('inventory').insert(rows)
        if (invError) throw new Error(`Seed inventory thất bại: ${invError.message}`)
    }

    return id
}

export interface SeedAccountResult {
    id: string
    email: string
    phone: string
}

/** Tạo một tài khoản test (mặc định vai trò khách). */
export async function seedAccount(
    label: string,
    role: 'customer' | 'owner' | 'manager' | 'receptionist' | 'editor' = 'customer',
    active = true,
): Promise<SeedAccountResult> {
    const email = testEmail(label)
    const phone = testPhone()
    const { data, error } = await adminDb()
        .from('accounts')
        .insert({
            role,
            full_name: `Test ${label}`,
            email,
            phone,
            active,
            /*
             * Vai trò nhân viên BẮT BUỘC có `password_hash` — ràng buộc
             * `chk_accounts_staff_pw`: `role = 'customer' OR password_hash IS NOT NULL`.
             *
             * Đây đúng loại lỗi chỉ integration test bắt được: TypeScript không
             * biết gì về CHECK constraint trong Postgres, nên bản đầu của helper
             * này bỏ trống `password_hash` và **build vẫn xanh**, chỉ nổ lúc chạy
             * bằng `23514`. Cùng họ với bug `chk_payments_method` nêu ở §1 ticket.
             *
             * Giá trị là hash bcrypt của một chuỗi ngẫu nhiên không ai biết:
             * tài khoản seed vai trò nhân viên KHÔNG được đăng nhập bằng mật
             * khẩu. Test nào cần phiên thì đi qua `sessionForAccount()`.
             */
            password_hash: role === 'customer'
                ? null
                : '$2b$12$0000000000000000000000000000000000000000000000000000',
        })
        .select('id')
        .single<{ id: string }>()

    if (error) throw new Error(`Seed account thất bại: ${error.message}`)
    createdAccounts.add(data.id)
    return { id: data.id, email, phone }
}

/** Đăng ký account id vào danh sách dọn — cho tài khoản sinh qua `/register`. */
export function trackAccount(id: string): void {
    createdAccounts.add(id)
}

export interface SeedPromotionOptions {
    label: string
    type: 'percent' | 'fixed' | 'long-stay' | 'early-bird' | 'last-minute' | 'nth-night-free'
    value: number
    stackable: boolean
    priority: number
    code?: string
    maxDiscount?: number
    conditions?: Record<string, unknown>
}

/**
 * Tắt các khuyến mãi do CHÍNH test này tạo, sau khi đã đo xong.
 *
 * ⚠️ Vì sao cần: KM test có `conditions = {}` nên áp cho **mọi** đơn sau đó
 * trong cùng lần chạy. Bản đầu của bộ test không có bước này và bài `maxDiscount`
 * đo ra `100.000` thay vì `200.000` — vì KM `fixed 9.000.000đ` của bài trước
 * vẫn còn bật và ăn hết ngân sách giảm giá.
 *
 * Lẽ ra phải giới hạn bằng `conditions.roomTypeIds`, nhưng **không làm được**:
 * `mapPromotionRow()` đọc `row.room_type_ids` — một cột **không tồn tại** trong
 * bảng `promotions`. Đây là bug thật, đã mở ticket `900-01`.
 */
export async function disablePromotions(ids: string[]): Promise<void> {
    if (ids.length === 0) return
    const { error } = await adminDb().from('promotions').update({ active: false }).in('id', ids)
    if (error) throw new Error(`Không tắt được promotion test: ${error.message}`)
}

export async function seedPromotion(opts: SeedPromotionOptions): Promise<string> {
    const id = `${TEST_PREFIX}-${opts.label}-${RUN_ID}`.toLowerCase()
    const { error } = await adminDb().from('promotions').insert({
        id,
        code: opts.code ?? null,
        name: { vi: `KM test ${opts.label}`, en: `Test promo ${opts.label}` },
        description: { vi: 'Khuyến mãi do test tạo.', en: 'Promotion created by test.' },
        type: opts.type,
        value: opts.value,
        conditions: opts.conditions ?? {},
        stackable: opts.stackable,
        priority: opts.priority,
        max_discount: opts.maxDiscount ?? null,
        usage_count: 0,
        active: true,
    })
    if (error) throw new Error(`Seed promotion thất bại: ${error.message}`)
    createdPromotions.add(id)
    return id
}

/**
 * Tắt mọi khuyến mãi TỰ ĐỘNG (không có `code`) đang bật của DB, trả về hàm bật
 * lại. Cần cho các test tính giá: `buildQuote()` áp mọi KM tự động thoả điều
 * kiện, nên 7 KM seed sẵn sẽ trộn vào con số và bài test "1tr × 0.9 × 0.8"
 * không còn kiểm được gì.
 */
export async function withAutoPromotionsDisabled(): Promise<() => Promise<void>> {
    const db = adminDb()
    const { data, error } = await db
        .from('promotions')
        .select('id')
        .eq('active', true)
        .is('code', null)
    if (error) throw new Error(`Không đọc được promotions: ${error.message}`)

    const ids = (data ?? [])
        .map((r) => String((r as { id: string }).id))
        .filter((id) => !id.startsWith(TEST_PREFIX))
    if (ids.length === 0) return async () => {}

    const { error: offError } = await db.from('promotions').update({ active: false }).in('id', ids)
    if (offError) throw new Error(`Không tắt được promotions: ${offError.message}`)

    return async () => {
        const { error: onError } = await db.from('promotions').update({ active: true }).in('id', ids)
        if (onError) throw new Error(`Không bật lại promotions: ${onError.message}`)
    }
}

// ─────────────────────────── teardown ───────────────────────────────────────

/**
 * Xoá đúng những gì test tạo, **ngược thứ tự khoá ngoại**.
 *
 * Thứ tự bắt buộc: activity_logs/payments → bookings → inventory → room_types.
 * Đảo thứ tự là `23503 foreign key violation`, teardown fail giữa chừng và để
 * lại rác — đúng thứ làm lần chạy thứ 2 đỏ (AC-12).
 */
export async function teardown(): Promise<void> {
    const db = adminDb()
    const problems: string[] = []

    const roomTypeIds = [...createdRoomTypes]

    // Mọi đơn thuộc hạng phòng test — kể cả đơn do route tạo mà test không kịp
    // ghi nhận id (route trả 500 giữa chừng chẳng hạn).
    const bookingIds = new Set<string>(createdBookings)
    if (roomTypeIds.length > 0) {
        const { data } = await db.from('bookings').select('id').in('room_type_id', roomTypeIds)
        for (const row of data ?? []) bookingIds.add(String((row as { id: string }).id))
    }
    for (const accId of createdAccounts) {
        const { data } = await db.from('bookings').select('id').eq('customer_id', accId)
        for (const row of data ?? []) bookingIds.add(String((row as { id: string }).id))
    }

    const ids = [...bookingIds]
    if (ids.length > 0) {
        const list = sqlIdList(ids)
        if (list) {
            // `activity_logs` không cho service_role xoá (bất biến, BE5) —
            // phải đi đường `postgres`.
            await runPrivilegedSql(`DELETE FROM public.activity_logs WHERE booking_id IN (${list})`)
        }
        const { error: payErr } = await db.from('payments').delete().in('booking_id', ids)
        if (payErr) problems.push(`payments: ${payErr.message}`)
        const { error } = await db.from('bookings').delete().in('id', ids)
        if (error) problems.push(`bookings: ${error.message}`)
    }

    if (roomTypeIds.length > 0) {
        const { error: invErr } = await db.from('inventory').delete().in('room_type_id', roomTypeIds)
        if (invErr) problems.push(`inventory: ${invErr.message}`)
        const { error: unitErr } = await db.from('room_units').delete().in('room_type_id', roomTypeIds)
        if (unitErr) problems.push(`room_units: ${unitErr.message}`)
        const { error: rtErr } = await db.from('room_types').delete().in('id', roomTypeIds)
        if (rtErr) problems.push(`room_types: ${rtErr.message}`)
    }

    if (createdPromotions.size > 0) {
        const { error } = await db.from('promotions').delete().in('id', [...createdPromotions])
        if (error) problems.push(`promotions: ${error.message}`)
    }

    // Sau `bookings` vì `bookings.rate_plan_id` là khoá ngoại trỏ vào đây —
    // đảo thứ tự là `23503`, teardown chết giữa chừng và để lại rác.
    if (createdRatePlans.size > 0) {
        const { error } = await db.from('rate_plans').delete().in('id', [...createdRatePlans])
        if (error) problems.push(`rate_plans: ${error.message}`)
    }

    if (createdAddons.size > 0) {
        const { error } = await db.from('addons').delete().in('id', [...createdAddons])
        if (error) problems.push(`addons: ${error.message}`)
    }

    if (createdAccounts.size > 0) {
        const { error } = await db.from('accounts').delete().in('id', [...createdAccounts])
        if (error) problems.push(`accounts: ${error.message}`)
    }

    createdRoomTypes.clear()
    createdAccounts.clear()
    createdPromotions.clear()
    createdBookings.clear()
    createdRatePlans.clear()
    createdAddons.clear()

    // C3: không nuốt lỗi. Teardown hỏng phải ồn ào, nếu không lần chạy sau đỏ
    // vì rác của lần này mà không ai biết nguyên nhân.
    if (problems.length > 0) {
        throw new Error(`Teardown không sạch:\n  - ${problems.join('\n  - ')}`)
    }
}

/**
 * Quét rác của các lần chạy TRƯỚC bị ngắt giữa chừng (Ctrl-C, mất mạng).
 * Gọi một lần ở `globalSetup`. Không có nó thì `chk_not_oversold` của hạng
 * phòng cũ còn sót có thể làm test mới đỏ ngẫu nhiên.
 */
export async function sweepOrphans(): Promise<number> {
    const db = adminDb()
    let removed = 0

    const { data: rts } = await db.from('room_types').select('id').like('id', `${TEST_PREFIX}-%`)
    const staleRoomTypes = (rts ?? []).map((r) => String((r as { id: string }).id))

    const { data: accs } = await db.from('accounts').select('id').like('email', `${TEST_PREFIX}-%`)
    const staleAccounts = (accs ?? []).map((r) => String((r as { id: string }).id))

    const bookingIds = new Set<string>()
    if (staleRoomTypes.length > 0) {
        const { data } = await db.from('bookings').select('id').in('room_type_id', staleRoomTypes)
        for (const row of data ?? []) bookingIds.add(String((row as { id: string }).id))
    }
    if (staleAccounts.length > 0) {
        const { data } = await db.from('bookings').select('id').in('customer_id', staleAccounts)
        for (const row of data ?? []) bookingIds.add(String((row as { id: string }).id))
    }

    const ids = [...bookingIds]
    if (ids.length > 0) {
        const list = sqlIdList(ids)
        if (list) {
            await runPrivilegedSql(`DELETE FROM public.activity_logs WHERE booking_id IN (${list})`)
        }
        await db.from('payments').delete().in('booking_id', ids)
        await db.from('bookings').delete().in('id', ids)
        removed += ids.length
    }
    if (staleRoomTypes.length > 0) {
        await db.from('inventory').delete().in('room_type_id', staleRoomTypes)
        await db.from('room_units').delete().in('room_type_id', staleRoomTypes)
        await db.from('room_types').delete().in('id', staleRoomTypes)
        removed += staleRoomTypes.length
    }
    // ⚠️ TẮT `active` TRƯỚC KHI XOÁ — thứ tự này là bản sửa nợ `M39`, đừng đảo.
    //
    // Bản đầu chỉ có `.delete()` và **nuốt lỗi im lặng**. KM đã dính
    // `booking_promotions` bị `23503` chặn xoá, nhưng hàm vẫn chạy tiếp như
    // thành công ⇒ KM ở lại DB với `active = true`. KM `zz-test-*` không có
    // `code` là KM **tự động áp**, nên nó trừ thêm tiền vào báo giá của MỌI
    // case chạy sau — kể cả ở file test khác. Triệu chứng là suite đỏ ngẫu
    // nhiên, và đã làm gián đoạn điều tra ở ba ticket khác nhau
    // (`900-01`, `900-03`, `390-03`) vì ai cũng tưởng lỗi do thay đổi của mình.
    //
    // `UPDATE active = false` luôn thành công kể cả khi khoá ngoại chặn xoá,
    // nên KM hết vô hại ngay cả trong trường hợp xấu nhất.
    const { error: offErr } = await db
        .from('promotions')
        .update({ active: false })
        .like('id', `${TEST_PREFIX}-%`)
    if (offErr) throw new Error(`Không tắt được KM rác: ${offErr.message}`)

    // Xoá hẳn khi khoá ngoại cho phép. Còn `booking_promotions` tham chiếu thì
    // `23503` là chuyện bình thường — KM đã `active = false` ở trên nên không
    // còn ảnh hưởng kết quả. Không nuốt các lỗi khác (luật C3).
    const { error: delErr } = await db
        .from('promotions')
        .delete()
        .like('id', `${TEST_PREFIX}-%`)
    if (delErr && delErr.code !== '23503') {
        throw new Error(`Xoá KM rác thất bại: ${delErr.message}`)
    }
    // `390-01` sinh rate_plans/addons qua route. Không quét ở đây thì lần chạy
    // sau `POST` cùng slug nhận `409 DUPLICATE_ID` và test đỏ vì rác của lần
    // trước, không phải vì code sai. Đặt SAU khối xoá `bookings` ở trên vì
    // `bookings.rate_plan_id` là khoá ngoại.
    await db.from('rate_plans').delete().like('id', `${TEST_PREFIX}-%`)
    await db.from('addons').delete().like('id', `${TEST_PREFIX}-%`)
    if (staleAccounts.length > 0) {
        await db.from('accounts').delete().in('id', staleAccounts)
        removed += staleAccounts.length
    }

    return removed
}
