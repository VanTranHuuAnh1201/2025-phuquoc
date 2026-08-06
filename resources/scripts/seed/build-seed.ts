/**
 * Sinh hai file seed SQL từ `packages/core/src/data` — ticket 200-01 §6.5.
 *
 * Vì sao là script chứ không gõ tay: 5+ hạng phòng × 9 trường jsonb, 44 phòng
 * vật lý, 90 ngày tồn kho và ~30 đơn là chắc chắn lệch với core nếu gõ tay, mà
 * AC-11 và checklist §13 của schema-mapping yêu cầu so khớp TỪNG TRƯỜNG.
 *
 * Vì sao xuất `.sql` chứ không phải script Node ghi qua PostgREST:
 *   1. File …000200 REVOKE UPDATE/DELETE trên activity_logs khỏi CẢ service_role.
 *      Seed phải là SQL chạy bằng quyền owner qua `supabase db push`.
 *   2. Không phụ thuộc `SUPABASE_SERVICE_ROLE_KEY` (đang là publishable key — nợ M13).
 *   3. Seed thành một phần lịch sử migration: dựng lại DB sạch là có luôn dữ liệu.
 *
 * Chạy:  pnpm seed:build
 *
 * KHÔNG chạy tự động trong build — đây là script dev-only, đầu ra được commit.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { propertyData } from '../../../packages/core/src/data/index'
import { blogPosts } from '../../../packages/core/src/data/blog'
import { diningMenu } from '../../../packages/core/src/data/dining-menu'
import {
    exploreSpots,
    satelliteIslands,
    tripPlans,
} from '../../../packages/core/src/data/explore'
import {
    buildRoomUnits,
    childPolicy,
    promotions,
    ratePlans,
    seasons,
} from '../../../packages/core/src/data/operations.seed'
import { generateDemoData } from '../../../packages/core/src/data/demo-generator'
import { addDays, listStayDates } from '../../../packages/core/src/pricing'
import { inventoryKey } from '../../../packages/core/src/availability'
import { holdsInventory } from '../../../packages/core/src/booking-lifecycle'
import type {
    ActivityLog,
    Booking,
    Inventory,
} from '../../../packages/core/src/booking-types'
import type { I18nText } from '@repo/utils'

const HERE = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS = resolve(HERE, '../../../supabase/migrations')

/**
 * Ngày mốc CỐ ĐỊNH cho seed.
 *
 * Không dùng `new Date()`: chạy lại script hai ngày khác nhau sẽ sinh hai file
 * SQL khác nhau, và `git diff` đầy nhiễu. Đây cũng là lý do demo-generator dùng
 * PRNG có hạt giống thay vì Math.random().
 */
const TODAY = '2026-08-06'

/** Mật khẩu thô của 4 tài khoản nhân viên nằm ở MANUAL.md M12, KHÔNG ở đây. */
const STAFF_PASSWORD_HASHES: Record<string, string> = {
    // bcryptjs cost 12. Sinh bằng resources/scripts/seed/hash-staff-passwords.mjs
    owner: '$2b$12$PLACEHOLDER_REPLACED_AT_RUNTIME',
}

// ============================================================ tiện ích sinh SQL

/** Chuỗi SQL an toàn: nhân đôi dấu nháy đơn. Không nối chuỗi thô ở bất kỳ đâu. */
function sql(value: string): string {
    return `'${value.replace(/'/g, "''")}'`
}

function sqlOrNull(value: string | undefined | null): string {
    return value === undefined || value === null ? 'NULL' : sql(value)
}

function num(value: number | undefined | null): string {
    return value === undefined || value === null ? 'NULL' : String(value)
}

function bool(value: boolean | undefined): string {
    return value ? 'TRUE' : 'FALSE'
}

/** jsonb literal. Ép kiểu rõ ràng để Postgres không đoán nhầm sang text. */
function json(value: unknown): string {
    return `${sql(JSON.stringify(value))}::jsonb`
}

/**
 * Giá trị cho cột kiểu domain `i18n_text`.
 *
 * Kiểm ngay tại đây thay vì để Postgres báo lỗi lúc chạy migration: thông báo
 * "value for domain i18n_text violates check constraint" không nói được trường
 * nào của bản ghi nào sai (AC-11).
 */
function i18n(value: I18nText | undefined, where: string): string {
    if (!value) throw new Error(`Thiếu I18nText bắt buộc tại ${where}`)
    if (!value.vi || !value.en) {
        throw new Error(
            `I18nText tại ${where} thiếu ngôn ngữ: vi=${JSON.stringify(value.vi)} en=${JSON.stringify(value.en)}`,
        )
    }
    return json(value)
}

function i18nOrNull(value: I18nText | undefined, where: string): string {
    return value ? i18n(value, where) : 'NULL'
}

function i18nArray(values: I18nText[] | undefined, where: string): string {
    const list = values ?? []
    list.forEach((item, index) => i18n(item, `${where}[${index}]`))
    return json(list)
}

/** Mảng int của Postgres cho `child_ages` — TUỔI từng trẻ, không phải số lượng. */
function intArray(values: number[]): string {
    return `'{${values.join(',')}}'::int[]`
}

function header(title: string, body: string): string {
    return `-- =============================================================================
-- ${title}
--
${body
    .split('\n')
    .map((line) => `-- ${line}`.trimEnd())
    .join('\n')}
-- =============================================================================

`
}

/**
 * Tiêu đề khối trong file SQL.
 *
 * Mọi dòng phải mang tiền tố `--`, kể cả dòng nối. Quên một dòng là psql đọc
 * chữ tiếng Việt như câu lệnh và migration đổ ngay ("syntax error at or near").
 */
function section(title: string): string {
    const rule = '-- ---------------------------------------------------------------------------'
    const body = title
        .split('\n')
        .map((line) => `-- ${line.trim()}`.trimEnd())
        .join('\n')
    return `\n${rule}\n${body}\n${rule}\n\n`
}

// ==================================================== file 1: seed_reference

function buildReferenceSeed(): string {
    const parts: string[] = []

    parts.push(
        header(
            '20260101000300_seed_reference.sql',
            `SINH TỰ ĐỘNG bởi resources/scripts/seed/build-seed.ts — ĐỪNG SỬA TAY.
Sửa dữ liệu ở packages/core/src/data/ rồi chạy lại: pnpm seed:build

Ticket 200-01 §6.5 — dữ liệu danh mục: hạng phòng, phòng vật lý, mùa vụ,
gói giá, dịch vụ thêm, khuyến mãi, cấu hình cơ sở, tài khoản nhân viên,
nội dung marketing.

Id giữ NGUYÊN SLUG của core (room-suite-sea, standard, high-summer…).
Cấm sinh UUID mới cho bảng danh mục (schema-mapping Q1).

⚠️ Nội dung marketing là BẢN DEMO (MANUAL.md M2/M6). property_settings.brand
mang khoá "demo": true để 300-02 lọc được trước khi go-live.`,
        ),
    )

    // ---- property_settings ------------------------------------------------
    parts.push(section('1. property_settings — đúng một hàng ở v1.0.0'))
    const brandWithDemoFlag = { ...propertyData.brand, demo: true }
    parts.push(
        `INSERT INTO public.property_settings (id, brand, hero, about, facts, nav, transport, notes, child_policy) VALUES (
    'nam-du-hill',
    ${json(brandWithDemoFlag)},
    ${json(propertyData.hero)},
    ${json(propertyData.about)},
    ${json(propertyData.facts)},
    ${json(propertyData.nav)},
    ${json(propertyData.transport)},
    ${json(propertyData.notes)},
    ${json(childPolicy)}
);\n`,
    )

    // ---- room_types -------------------------------------------------------
    parts.push(section(`2. room_types — ${propertyData.rooms.length} hạng phòng (Room + RoomExtra gộp)`))
    for (const room of propertyData.rooms) {
        const extra = propertyData.roomExtras[room.id]
        // Không có RoomExtra thì suy ra giá trị tối thiểu hợp lệ từ Room:
        // chk_room_types_capacity yêu cầu max_guests >= guests > 0.
        const maxGuests = extra?.maxGuests ?? room.guests
        const defaultGuests = extra?.defaultGuests ?? room.guests
        parts.push(
            `INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    ${sql(room.id)},
    ${i18n(room.name, `room ${room.id}.name`)},
    ${i18n(room.desc, `room ${room.id}.desc`)},
    ${sql(room.area)},
    ${room.guests},
    ${room.price},
    ${i18nArray(room.tags, `room ${room.id}.tags`)},
    ${json(room.images ?? [])},
    ${sqlOrNull(room.group)},
    ${num(room.extraBedFee)},
    ${json(room.reviews ?? [])},
    ${maxGuests},
    ${defaultGuests},
    ${extra?.extraBed ?? 0},
    ${i18nOrNull(extra?.bed, `roomExtra ${room.id}.bed`)},
    ${i18nOrNull(extra?.view, `roomExtra ${room.id}.view`)},
    ${i18nOrNull(extra?.long, `roomExtra ${room.id}.long`)},
    ${i18nOrNull(extra?.long2, `roomExtra ${room.id}.long2`)},
    ${i18nArray(extra?.amenities, `roomExtra ${room.id}.amenities`)},
    ${i18nArray(extra?.conditions, `roomExtra ${room.id}.conditions`)},
    ${propertyData.rooms.indexOf(room)}
);\n`,
        )
    }

    // ---- room_units -------------------------------------------------------
    const roomUnits = buildRoomUnits(propertyData.rooms.map((r) => r.id))
    parts.push(
        section(
            `3. room_units — ${roomUnits.length} phòng vật lý (MANUAL.md M8: số phòng thật chờ khách cấp)`,
        ),
    )
    parts.push(
        'INSERT INTO public.room_units (id, code, room_type_id, floor, status) VALUES\n' +
            roomUnits
                .map(
                    (u) =>
                        `    (${uuidFor(u.id)}, ${sql(u.code)}, ${sql(u.roomTypeId)}, ${sqlOrNull(u.floor)}, ${sql(u.status)})`,
                )
                .join(',\n') +
            ';\n',
    )

    // ---- seasons ----------------------------------------------------------
    parts.push(section(`4. seasons — ${seasons.length} mùa vụ`))
    for (const s of seasons) {
        parts.push(
            `INSERT INTO public.seasons (id, name, date_from, date_to, multiplier, weekend_multiplier, priority)
VALUES (${sql(s.id)}, ${i18n(s.name, `season ${s.id}`)}, ${sql(s.from)}, ${sql(s.to)}, ${s.multiplier}, ${num(s.weekendMultiplier)}, ${s.priority});\n`,
        )
    }

    // ---- rate_plans -------------------------------------------------------
    parts.push(
        section(
            `5. rate_plans — ${ratePlans.length} gói giá (cancellation_rules: MANUAL.md M7 chờ khách chốt)`,
        ),
    )
    for (const p of ratePlans) {
        parts.push(
            `INSERT INTO public.rate_plans (
    id, name, description, adjust_percent, includes_breakfast, refundable,
    cancellation_rules, deposit_percent, room_type_ids
) VALUES (
    ${sql(p.id)},
    ${i18n(p.name, `ratePlan ${p.id}.name`)},
    ${i18n(p.description, `ratePlan ${p.id}.description`)},
    ${p.adjustPercent}, ${bool(p.includesBreakfast)}, ${bool(p.refundable)},
    ${json(p.cancellationRules)}, ${p.depositPercent}, ${json(p.roomTypeIds)}
);\n`,
        )
    }

    // ---- addons -----------------------------------------------------------
    // Đưa đón tàu Rạch Giá đứng ĐẦU (sort_order = 0) — booking-domain §B6.
    const addons = [...propertyData.addons].sort((a, b) => {
        const rank = (id: string) => (id.includes('ferry') ? 0 : 1)
        return rank(a.id) - rank(b.id)
    })
    parts.push(
        section(
            `6. addons — ${addons.length} dịch vụ thêm. Đưa đón tàu Rạch Giá sort_order=0 (§B6)`,
        ),
    )
    addons.forEach((a, index) => {
        parts.push(
            `INSERT INTO public.addons (id, name, price, unit, sort_order)
VALUES (${sql(a.id)}, ${i18n(a.name, `addon ${a.id}.name`)}, ${a.price}, ${i18n(a.unit, `addon ${a.id}.unit`)}, ${index});\n`,
        )
    })

    // ---- promotions -------------------------------------------------------
    parts.push(section(`7. promotions — ${promotions.length} khuyến mãi, phủ đủ 7 kiểu`))
    for (const p of promotions) {
        parts.push(
            `INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    ${sql(p.id)}, ${sqlOrNull(p.code)},
    ${i18n(p.name, `promotion ${p.id}.name`)},
    ${i18n(p.description, `promotion ${p.id}.description`)},
    ${sql(p.type)}, ${p.value}, ${json(p.conditions)}, ${bool(p.stackable)}, ${p.priority},
    ${num(p.maxDiscount)}, ${num(p.usageLimit)}, ${p.usageCount}, ${num(p.perCustomerLimit)}, ${bool(p.active)}
);\n`,
        )
    }

    // ---- accounts (nhân viên) ---------------------------------------------
    parts.push(
        section(
            `8. accounts — 4 tài khoản nhân viên đủ 4 vai trò nội bộ
    Mật khẩu thô nằm ở MANUAL.md M12; file này CHỈ chứa hash bcryptjs cost 12.
    Danh sách nhân viên thật: MANUAL.md M9.`,
        ),
    )
    for (const staff of STAFF_ACCOUNTS) {
        parts.push(
            `INSERT INTO public.accounts (id, role, full_name, phone, email, password_hash)
VALUES (${uuidFor(`staff-${staff.role}`)}, ${sql(staff.role)}, ${sql(staff.fullName)}, ${sql(staff.phone)}, ${sql(staff.email)}, ${sql(STAFF_PASSWORD_HASHES[staff.role] ?? STAFF_PASSWORD_HASHES.owner!)});\n`,
        )
    }

    // ---- nội dung marketing ------------------------------------------------
    parts.push(section('9. Nội dung marketing (bản demo — MANUAL.md M2/M6)'))

    propertyData.dining.forEach((d, i) => {
        parts.push(
            `INSERT INTO public.dining (id, name, description, note, image, sort_order)
VALUES (${sql(d.id)}, ${i18n(d.name, `dining ${d.id}.name`)}, ${i18n(d.desc, `dining ${d.id}.desc`)}, ${i18n(d.note, `dining ${d.id}.note`)}, ${sqlOrNull(d.image)}, ${i});\n`,
        )
    })

    propertyData.tours.forEach((tour, i) => {
        parts.push(
            `INSERT INTO public.tours (id, code, name, summary, price, days, sort_order)
VALUES (${sql(tour.id)}, ${sql(tour.code)}, ${i18n(tour.name, `tour ${tour.id}.name`)}, ${i18n(tour.summary, `tour ${tour.id}.summary`)}, ${tour.price}, ${json(tour.days)}, ${i});\n`,
        )
    })

    propertyData.places.forEach((p, i) => {
        parts.push(
            `INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES (${sql(p.id)}, ${i18n(p.name, `place ${p.id}.name`)}, ${i18n(p.tag, `place ${p.id}.tag`)}, ${i18n(p.desc, `place ${p.id}.desc`)}, ${sqlOrNull(p.image)}, ${i});\n`,
        )
    })

    ;(propertyData.gallery ?? []).forEach((g, i) => {
        parts.push(
            `INSERT INTO public.gallery_items (id, title, subtitle, image, sort_order)
VALUES (${sql(g.id)}, ${i18n(g.title, `gallery ${g.id}.title`)}, ${i18n(g.subtitle, `gallery ${g.id}.subtitle`)}, ${sqlOrNull(g.image)}, ${i});\n`,
        )
    })

    ;(propertyData.amenities ?? []).forEach((a, i) => {
        parts.push(
            `INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES (${sql(a.id)}, ${sql(a.icon)}, ${i18n(a.label, `amenity ${a.id}.label`)}, ${i18nOrNull(a.desc, `amenity ${a.id}.desc`)}, ${i});\n`,
        )
    })

    ;(propertyData.reviews ?? []).forEach((r, i) => {
        parts.push(
            `INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES (${sql(r.id)}, ${sql(r.name)}, ${i18nOrNull(r.from, `review ${r.id}.from`)}, ${sql(normaliseDate(r.date))}, ${r.rating}, ${i18n(r.comment, `review ${r.id}.comment`)}, ${sqlOrNull(r.avatar)}, ${i});\n`,
        )
    })

    exploreSpots.forEach((s, i) => {
        parts.push(
            `INSERT INTO public.explore_spots (id, name, dist, text, tip, sort_order)
VALUES (${sql(s.id)}, ${i18n(s.name, `spot ${s.id}.name`)}, ${i18n(s.dist, `spot ${s.id}.dist`)}, ${i18n(s.text, `spot ${s.id}.text`)}, ${i18n(s.tip, `spot ${s.id}.tip`)}, ${i});\n`,
        )
    })

    satelliteIslands.forEach((s, i) => {
        parts.push(
            `INSERT INTO public.satellite_islands (id, name, badge, text, sort_order)
VALUES (${sql(s.id)}, ${i18n(s.name, `island ${s.id}.name`)}, ${i18n(s.badge, `island ${s.id}.badge`)}, ${i18n(s.text, `island ${s.id}.text`)}, ${i});\n`,
        )
    })

    Object.values(tripPlans).forEach((plan, i) => {
        parts.push(
            `INSERT INTO public.trip_plans (key, name, legs, costs, total, sort_order)
VALUES (${sql(plan.key)}, ${i18n(plan.name, `tripPlan ${plan.key}.name`)}, ${json(plan.legs)}, ${json(plan.costs)}, ${sql(plan.total)}, ${i});\n`,
        )
    })

    Object.values(diningMenu).forEach((cat, i) => {
        parts.push(
            `INSERT INTO public.menu_categories (key, name, items, sort_order)
VALUES (${sql(cat.key)}, ${i18n(cat.name, `menuCategory ${cat.key}.name`)}, ${json(cat.items)}, ${i});\n`,
        )
    })

    blogPosts.forEach((post, i) => {
        parts.push(
            `INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    ${sql(post.id)},
    ${i18n(post.category, `blog ${post.id}.category`)},
    ${i18n(post.title, `blog ${post.id}.title`)},
    ${i18n(post.lede, `blog ${post.id}.lede`)},
    ${i18n(post.author, `blog ${post.id}.author`)},
    ${i18n(post.role, `blog ${post.id}.role`)},
    ${sql(normaliseDate(post.date.vi))},
    ${post.readMin},
    ${sqlOrNull(post.heroSlot)},
    ${i18nOrNull(post.heroCaption, `blog ${post.id}.heroCaption`)},
    ${i18nArray(post.tags, `blog ${post.id}.tags`)},
    ${json(post.blocks)},
    ${i}
);\n`,
        )
    })

    // Faq không có `id` trong TS → sinh từ thứ tự, ổn định giữa các lần chạy.
    propertyData.faq.forEach((f, i) => {
        parts.push(
            `INSERT INTO public.faqs (id, question, answer, sort_order)
VALUES (${sql(`faq-${String(i + 1).padStart(2, '0')}`)}, ${i18n(f.q, `faq[${i}].q`)}, ${i18n(f.a, `faq[${i}].a`)}, ${i});\n`,
        )
    })

    return parts.join('')
}

// ================================================== file 2: seed_demo_bookings

function buildDemoSeed(): string {
    const roomUnits = buildRoomUnits(propertyData.rooms.map((r) => r.id))

    const demo = generateDemoData({
        rooms: propertyData.rooms,
        roomExtras: propertyData.roomExtras,
        addons: propertyData.addons,
        roomUnits,
        today: TODAY,
        count: 40, // sinh dư rồi lọc — buildQuote bỏ đơn quá sức chứa/hết phòng
    })

    // AC-8 đòi đơn mẫu phủ ĐỦ 7 trạng thái. deriveStatus() của demo-generator
    // suy trạng thái từ mốc thời gian nên `no_show` và `expired` gần như không
    // bao giờ rơi ra, và `checked_in` chỉ xuất hiện khi có kỳ lưu trú ôm đúng
    // TODAY. Ép bù một cách TẤT ĐỊNH thay vì tăng `count` rồi cầu may.
    ensureAllStatuses(demo.bookings, demo.logs)

    // Tồn kho 90 ngày kể từ TODAY. demo-generator dựng 180 ngày (từ -60) để đơn
    // quá khứ có chỗ trừ; chỉ seed phần cửa sổ mà CMS thật sự nhìn.
    // Tính SAU ensureAllStatuses vì đổi trạng thái là đổi ai giữ phòng.
    const inventoryWindow = buildSeedInventory(demo.inventory, demo.bookings)

    // Seed lệch là AC-3 của 200-05 báo lỗi GIẢ — kiểm ngay khi sinh, không để
    // phát hiện sau khi đã chạy migration lên DB (§6.5).
    assertSeedConsistent(demo.bookings, inventoryWindow, demo.logs)

    const parts: string[] = []
    parts.push(
        header(
            '20260101000400_seed_demo_bookings.sql',
            `SINH TỰ ĐỘNG bởi resources/scripts/seed/build-seed.ts — ĐỪNG SỬA TAY.
Chạy lại: pnpm seed:build

Ticket 200-01 §6.5 — tồn kho 90 ngày + ~30 đơn demo + payments + activity_logs
+ notifications, NHẤT QUÁN NỘI BỘ với nhau.

Ngày mốc cố định: ${TODAY} (không dùng new Date() — xem đầu build-seed.ts).

Ràng buộc đã bảo đảm khi sinh:
  · bookings.paid_amount = Σ payments (deposit+balance+surcharge) − refund
  · mỗi đơn có ≥1 activity_logs dòng 'created'
  · inventory.booked_units = số đơn holdsInventory() phủ đêm đó
  · đơn expired/cancelled/no_show KHÔNG cộng vào booked_units
  · remaining_amount BỎ khỏi INSERT — là cột GENERATED (bẫy #3)`,
        ),
    )

    // ---- accounts của khách -------------------------------------------------
    parts.push(section(`1. accounts — ${demo.customers.length} hồ sơ khách (role='customer')`))
    for (const c of demo.customers) {
        parts.push(
            `INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES (${uuidFor(c.id)}, 'customer', ${sql(c.fullName)}, ${sql(c.phone)}, ${sqlOrNull(c.email)}, ${c.totalSpent}, ${c.stayCount}, ${sql(c.createdAt)});\n`,
        )
    }

    // ---- inventory ----------------------------------------------------------
    const overrideCount = inventoryWindow.filter((i) => i.priceOverride != null).length
    const minNightsCount = inventoryWindow.filter((i) => i.minNights != null).length
    const ctaCount = inventoryWindow.filter((i) => i.closedToArrival).length
    parts.push(
        section(
            `2. inventory — ${inventoryWindow.length} hàng, 90 ngày × ${propertyData.rooms.length} hạng
    price_override: ${overrideCount} ngày · min_nights: ${minNightsCount} ngày · closed_to_arrival: ${ctaCount} ngày
    (AC-9 yêu cầu ≥3 / ≥2 / ≥1 — phục vụ test 200-02)`,
        ),
    )
    parts.push(
        'INSERT INTO public.inventory (room_type_id, date, total_units, booked_units, blocked_units, price_override, min_nights, closed_to_arrival, version) VALUES\n' +
            inventoryWindow
                .map(
                    (inv) =>
                        `    (${sql(inv.roomTypeId)}, ${sql(inv.date)}, ${inv.totalUnits}, ${inv.bookedUnits}, ${inv.blockedUnits}, ${num(inv.priceOverride)}, ${num(inv.minNights)}, ${bool(inv.closedToArrival)}, ${inv.version})`,
                )
                .join(',\n') +
            ';\n',
    )

    // ---- bookings -----------------------------------------------------------
    const statusCount = new Map<string, number>()
    for (const b of demo.bookings) {
        statusCount.set(b.status, (statusCount.get(b.status) ?? 0) + 1)
    }
    parts.push(
        section(
            `3. bookings — ${demo.bookings.length} đơn rải 105 ngày
    Phân bố trạng thái: ${[...statusCount.entries()].map(([s, n]) => `${s}=${n}`).join(' · ')}`,
        ),
    )
    for (const b of demo.bookings) {
        parts.push(bookingInsert(b))
    }

    // ---- payments -----------------------------------------------------------
    const payments = demo.bookings.flatMap(buildPayments)
    parts.push(
        section(
            `4. payments — ${payments.length} lần thu, tổng khớp bookings.paid_amount từng đơn`,
        ),
    )
    for (const p of payments) {
        parts.push(
            `INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES (${uuidFor(p.bookingId)}, ${sql(p.at)}, ${p.amount}, ${sql(p.method)}, ${sql(p.kind)}, ${sqlOrNull(p.note)});\n`,
        )
    }

    // ---- activity_logs ------------------------------------------------------
    // ⚠️ Phải INSERT ở đây, trong file .sql chạy bằng quyền owner. File …000200
    //    đã REVOKE UPDATE/DELETE khỏi cả service_role — nhưng INSERT vẫn được;
    //    dù vậy giữ log trong seed SQL để không phụ thuộc key runtime (bẫy #5).
    parts.push(section(`5. activity_logs — ${demo.logs.length} dòng, mỗi đơn ≥1 dòng 'created'`))
    for (const log of demo.logs) {
        parts.push(activityLogInsert(log))
    }

    // ---- notifications ------------------------------------------------------
    parts.push(section(`6. notifications — ${demo.notifications.length} thông báo cho chuông`))
    for (const n of demo.notifications) {
        parts.push(
            `INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES (${uuidFor(n.accountId)}, ${sql(n.kind)}, ${sql(n.at)}, ${bool(n.read)}, ${uuidFor(n.bookingId!)}, ${sqlOrNull(n.bookingCode)}, ${json(n.payload ?? {})});\n`,
        )
    }

    // ---- room_units status --------------------------------------------------
    parts.push(section('7. room_units — cập nhật tình trạng theo đơn đang ở / vừa trả'))
    for (const u of demo.roomUnits) {
        if (u.status === 'available') continue
        parts.push(
            `UPDATE public.room_units SET status = ${sql(u.status)} WHERE id = ${uuidFor(u.id)};\n`,
        )
    }

    return parts.join('')
}

/**
 * Cắt cửa sổ 90 ngày và rắc thêm điều kiện bán phục vụ test 200-02.
 *
 * AC-9 đòi ≥3 ngày price_override, ≥2 ngày min_nights, ≥1 ngày
 * closed_to_arrival, và ≥1 hạng phòng chỉ còn đúng 1 phòng trống cho một đêm.
 * demo-generator đã sinh min_nights cho cuối tuần hè; ba thứ còn lại đặt ở đây
 * một cách TẤT ĐỊNH (theo chỉ số, không random) để chạy lại ra cùng kết quả.
 */
function buildSeedInventory(
    all: Record<string, Inventory>,
    bookings: Booking[],
): Inventory[] {
    const dates = Array.from({ length: 90 }, (_, i) => addDays(TODAY, i))
    const rows: Inventory[] = []

    for (const room of propertyData.rooms) {
        for (const date of dates) {
            const found = all[inventoryKey(room.id, date)]
            if (found) rows.push({ ...found })
        }
    }

    // Tính lại booked_units từ danh sách đơn CUỐI CÙNG. Bản do demo-generator
    // trừ sẵn không còn đúng sau ensureAllStatuses() — mà con số này chính là
    // thứ lịch tồn kho của lễ tân hiển thị.
    const held = new Map<string, number>()
    for (const b of bookings) {
        if (!holdsInventory(b.status)) continue
        for (const date of listStayDates(b.checkIn, b.checkOut)) {
            const key = inventoryKey(b.roomTypeId, date)
            held.set(key, (held.get(key) ?? 0) + 1)
        }
    }
    for (const row of rows) {
        row.bookedUnits = held.get(inventoryKey(row.roomTypeId, row.date)) ?? 0
        // blocked_units do demo-generator rắc ngẫu nhiên có thể đẩy tổng vượt
        // total_units sau khi booked đổi → hạ blocked xuống, không hạ booked
        // (booked phải khớp số đơn thật).
        const room =
            row.totalUnits - row.bookedUnits
        if (row.blockedUnits > room) row.blockedUnits = Math.max(0, room)
    }

    const firstRoomId = propertyData.rooms[0]!.id

    // ① Giá đè cho 3 ngày lễ giả định của hạng đầu tiên (+80% cho dễ nhận ra).
    for (const offset of [20, 21, 22]) {
        const row = rows.find(
            (r) => r.roomTypeId === firstRoomId && r.date === addDays(TODAY, offset),
        )
        if (row) row.priceOverride = Math.round(propertyData.rooms[0]!.price * 1.8)
    }

    // ② Tối thiểu 2 đêm cho hai ngày trong nhóm trên.
    for (const offset of [20, 21]) {
        const row = rows.find(
            (r) => r.roomTypeId === firstRoomId && r.date === addDays(TODAY, offset),
        )
        if (row) row.minNights = 2
    }

    // ③ Cấm nhận phòng đúng ngày cao điểm (lễ tân không muốn khách đến giữa đợt).
    const ctaRow = rows.find(
        (r) => r.roomTypeId === firstRoomId && r.date === addDays(TODAY, 21),
    )
    if (ctaRow) ctaRow.closedToArrival = true

    // ④ Một hạng chỉ còn ĐÚNG 1 phòng trống cho một đêm cụ thể — để 200-03/KB-3
    //    test đặt đồng thời được ngay mà không phải dựng dữ liệu tay.
    const scarce = rows.find(
        (r) => r.roomTypeId === firstRoomId && r.date === addDays(TODAY, 30),
    )
    if (scarce) {
        // blocked_units gánh phần chênh: booked_units phải khớp số đơn thật,
        // không được bịa (nếu không AC của 200-05 báo lỗi giả).
        const target = scarce.totalUnits - scarce.bookedUnits - 1
        scarce.blockedUnits = Math.max(0, target)
    }

    return rows
}

/** Bảy trạng thái của BookingStatus (booking-types.ts:291) — AC-8 đòi đủ cả 7. */
const ALL_STATUSES: Booking['status'][] = [
    'pending_payment',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled',
    'no_show',
    'expired',
]

/**
 * Bảo đảm đơn mẫu phủ đủ 7 trạng thái (AC-8).
 *
 * Cách làm: với mỗi trạng thái còn thiếu, chọn một đơn "hiến tế" phù hợp về mặt
 * thời gian rồi đổi trạng thái, đồng thời sửa các trường phụ thuộc để đơn vẫn
 * hợp lệ với CHECK của bảng và vẫn có nghĩa nghiệp vụ:
 *
 *   checked_in  → cần kỳ lưu trú ôm TODAY, cần checkInRecord
 *   no_show     → cần kỳ lưu trú đã qua, KHÔNG có checkIn/checkOutRecord,
 *                 giữ tiền cọc (paid_amount không hoàn)
 *   expired     → cần đơn tương lai chưa trả tiền, paid_amount = 0
 *
 * Không dùng random: chọn theo chỉ số đã sắp xếp để chạy lại ra cùng kết quả.
 */
function ensureAllStatuses(bookings: Booking[], logs: ActivityLog[]): void {
    const has = (s: Booking['status']) => bookings.some((b) => b.status === s)

    const retarget = (
        target: Booking['status'],
        candidate: (b: Booking) => boolean,
        apply: (b: Booking) => void,
    ) => {
        if (has(target)) return
        const victim = bookings.find(candidate)
        if (!victim) {
            throw new Error(
                `Không tìm được đơn phù hợp để dựng trạng thái "${target}" — tăng count trong buildDemoSeed()`,
            )
        }
        const from = victim.status
        apply(victim)
        victim.status = target
        // Mọi chuyển trạng thái ghi nhật ký (BE5 / §B1) — kể cả trong seed,
        // nếu không thì dòng thời gian trên màn chi tiết đơn bị đứt.
        logs.push({
            id: `${victim.id}-log-seed-${target}`,
            bookingId: victim.id,
            at: victim.updatedAt,
            actorId: 'SYSTEM_SEED',
            actorName: 'Seed dữ liệu mẫu',
            actorRole: 'manager',
            action: 'status-changed',
            field: 'status',
            from,
            to: target,
            note: 'Dữ liệu mẫu: dựng đủ 7 trạng thái để kiểm bộ lọc CMS',
        })
    }

    // ---- checked_in: kỳ lưu trú phải ôm TODAY ----
    //
    // Không đơn nào rơi đúng vào đó là chuyện bình thường (deriveStatus rải đơn
    // theo PRNG). Nhận cả đơn `confirmed` sắp tới rồi DỜI ngày về ôm TODAY —
    // rẻ hơn nhiều so với tăng `count` rồi cầu may, và vẫn tất định.
    retarget(
        'checked_in',
        (b) =>
            (b.checkIn <= TODAY && b.checkOut > TODAY && b.status !== 'cancelled') ||
            b.status === 'confirmed',
        (b) => {
            if (!(b.checkIn <= TODAY && b.checkOut > TODAY)) {
                // Dời sao cho khách đã ở được 1 đêm và còn ở tiếp — đúng nghĩa
                // "đang ở". `nights` giữ nguyên nên CHECK nights = check_out −
                // check_in vẫn đúng.
                b.checkIn = addDays(TODAY, -1)
                b.checkOut = addDays(b.checkIn, b.nights)
            }
            b.paidAmount = b.depositAmount
            b.checkOutRecord = undefined
            b.cancellation = undefined
            b.checkInRecord ??= {
                at: `${b.checkIn}T14:00:00.000Z`,
                roomUnitId: `${b.roomTypeId}-1`,
                idNumber: '079200001234',
                actualGuests: b.guests,
                earlyCheckIn: false,
                staffId: 'staff-01',
                staffName: 'Lê Thị Ngọc',
            }
        },
    )

    // ---- no_show: kỳ lưu trú đã qua, khách không tới ----
    retarget(
        'no_show',
        (b) => b.checkOut <= TODAY && b.status === 'checked_out',
        (b) => {
            // Không có ai nhận/trả phòng cả — xoá hai bản ghi đó, nếu không thì
            // màn chi tiết đơn hiện "đã trả phòng" cho một đơn no_show.
            b.checkInRecord = undefined
            b.checkOutRecord = undefined
            b.cancellation = undefined
            // Cọc mất, không hoàn (§B1: no_show quyết định hoàn cọc hay không).
            b.paidAmount = b.depositAmount
        },
    )

    // ---- expired: đơn tương lai hết hạn giữ chỗ mà chưa trả tiền ----
    retarget(
        'expired',
        (b) => b.checkIn > TODAY && b.status === 'pending_payment',
        (b) => {
            b.paidAmount = 0
            b.checkInRecord = undefined
            b.checkOutRecord = undefined
            b.cancellation = undefined
        },
    )

    // Còn thiếu trạng thái nào là seed không dùng được cho AC-8 → dừng ngay.
    const missing = ALL_STATUSES.filter((s) => !has(s))
    if (missing.length > 0) {
        throw new Error(`Đơn mẫu còn thiếu trạng thái: ${missing.join(', ')}`)
    }
}

/**
 * Ba bất biến mà seed BẮT BUỘC giữ (§6.5). Sai thì ném ngay tại đây.
 *
 *   ① mỗi đơn có ≥1 dòng nhật ký 'created'
 *   ② booked_units của mỗi (hạng, đêm) = số đơn holdsInventory() phủ đêm đó
 *   ③ booked + blocked <= total  — chính là chk_not_oversold ở tầng DB
 *
 * ② quan trọng nhất: đơn cancelled/expired/no_show KHÔNG giữ phòng, cộng nhầm
 * chúng vào là lịch tồn kho của lễ tân hiện số sai ngay từ ngày đầu.
 */
function assertSeedConsistent(
    bookings: Booking[],
    inventory: Inventory[],
    logs: ActivityLog[],
): void {
    // ① nhật ký
    for (const b of bookings) {
        const created = logs.filter((l) => l.bookingId === b.id && l.action === 'created')
        if (created.length === 0) {
            throw new Error(`Đơn ${b.code} không có dòng nhật ký 'created'`)
        }
    }

    // ② tồn kho khớp đơn thật
    const expected = new Map<string, number>()
    for (const b of bookings) {
        if (!holdsInventory(b.status)) continue
        for (const date of listStayDates(b.checkIn, b.checkOut)) {
            const key = inventoryKey(b.roomTypeId, date)
            expected.set(key, (expected.get(key) ?? 0) + 1)
        }
    }
    for (const inv of inventory) {
        const key = inventoryKey(inv.roomTypeId, inv.date)
        const want = expected.get(key) ?? 0
        if (inv.bookedUnits !== want) {
            throw new Error(
                `booked_units lệch tại ${key}: seed ghi ${inv.bookedUnits}, số đơn thật ${want}`,
            )
        }

        // ③ ràng buộc chống oversell — bắt trước khi Postgres bắt
        if (inv.bookedUnits + inv.blockedUnits > inv.totalUnits) {
            throw new Error(
                `Oversell tại ${key}: ${inv.bookedUnits}+${inv.blockedUnits} > ${inv.totalUnits}`,
            )
        }
    }
}

interface SeedPayment {
    bookingId: string
    at: string
    amount: number
    method: string
    kind: string
    note?: string
}

/**
 * Dựng các lần thu khớp đúng `booking.paidAmount`.
 *
 * demo-generator đặt paidAmount = 0 (chờ trả) | depositAmount | totalAmount.
 * Ở đây tách thành 1–2 dòng payments sao cho tổng bằng đúng con số đó — nếu
 * lệch thì màn hình công nợ của lễ tân hiện số sai ngay từ ngày đầu.
 */
function buildPayments(booking: Booking): SeedPayment[] {
    if (booking.paidAmount <= 0) return []

    const at = booking.createdAt
    const method = booking.channel === 'walk-in' ? 'at-property' : 'bank-transfer'

    if (booking.paidAmount <= booking.depositAmount) {
        return [
            { bookingId: booking.id, at, amount: booking.paidAmount, method, kind: 'deposit', note: 'Cọc theo gói giá' },
        ]
    }

    // Đã thu quá cọc → tách thành cọc + phần còn lại.
    return [
        { bookingId: booking.id, at, amount: booking.depositAmount, method, kind: 'deposit', note: 'Cọc theo gói giá' },
        {
            bookingId: booking.id,
            at: booking.checkOutRecord?.at ?? at,
            amount: booking.paidAmount - booking.depositAmount,
            method: 'at-property',
            kind: 'balance',
            note: 'Thu phần còn lại tại quầy',
        },
    ]
}

function bookingInsert(b: Booking): string {
    return `INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    ${uuidFor(b.id)}, ${sql(b.code)}, ${sql(b.roomTypeId)}, ${sql(b.ratePlanId)},
    ${sql(b.checkIn)}, ${sql(b.checkOut)}, ${b.nights},
    ${b.guests.adults}, ${intArray(b.guests.children)}, ${json(b.addons)},
    ${sql(b.guest.fullName)}, ${sql(b.guest.phone)}, ${sql(b.guest.email)}, ${sqlOrNull(b.guest.idNumber)},
    ${sqlOrNull(b.guest.estimatedArrivalTime)}, ${sqlOrNull(b.guest.specialRequests)},
    ${b.customerId ? uuidFor(b.customerId) : 'NULL'}, ${sql(b.channel)}, ${sql(b.status)},
    ${b.subtotal}, ${b.discountTotal}, ${b.totalAmount}, ${b.depositAmount}, ${b.paidAmount},
    ${json(b.priceLines)}, ${json(b.appliedPromotions)},
    ${b.checkInRecord ? json(b.checkInRecord) : 'NULL'},
    ${b.checkOutRecord ? json(b.checkOutRecord) : 'NULL'},
    ${b.cancellation ? json(b.cancellation) : 'NULL'},
    ${sqlOrNull(b.cancellation?.at)},
    ${sql(b.createdAt)}, ${sql(b.updatedAt)}
);\n`
}

function activityLogInsert(log: ActivityLog): string {
    return `INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES (${uuidFor(log.bookingId)}, ${sql(log.at)}, ${sql(log.actorId)}, ${sql(log.actorName)}, ${sql(log.actorRole)}, ${sql(log.action)}, ${sqlOrNull(log.field)}, ${sqlOrNull(log.from)}, ${sqlOrNull(log.to)}, ${sqlOrNull(log.note)});\n`
}

// ============================================================ id ổn định

/**
 * UUID TẤT ĐỊNH sinh từ slug của core.
 *
 * Vì sao không `gen_random_uuid()`: seed phải chạy lại ra cùng một bộ id, nếu
 * không thì `notifications.booking_id` và `activity_logs.booking_id` không trỏ
 * đúng đơn nào. Vì sao không giữ slug làm PK: schema-mapping Q1 chốt các bảng
 * do hệ thống sinh (bookings, accounts, room_units) dùng UUID.
 *
 * Thuật toán: FNV-1a 32-bit trên 4 khối khác muối → 128 bit, đóng dấu version 4.
 * Đủ ổn định và không đụng độ trong phạm vi vài nghìn bản ghi seed.
 */
function uuidFor(slug: string): string {
    const hex = [0, 1, 2, 3]
        .map((salt) => fnv1a(`${salt}:${slug}`).toString(16).padStart(8, '0'))
        .join('')
    const uuid = [
        hex.slice(0, 8),
        hex.slice(8, 12),
        `4${hex.slice(13, 16)}`,
        `8${hex.slice(17, 20)}`,
        hex.slice(20, 32),
    ].join('-')
    return `'${uuid}'::uuid`
}

function fnv1a(input: string): number {
    let hash = 0x811c9dc5
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i)
        hash = Math.imul(hash, 0x01000193) >>> 0
    }
    return hash >>> 0
}

/** Ép chuỗi ngày hiển thị về YYYY-MM-DD cho cột DATE (nợ T1/T3). */
function normaliseDate(value: string): string {
    const iso = value.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (iso) return iso[0]
    const dmy = value.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/)
    if (dmy) {
        return `${dmy[3]}-${dmy[2]!.padStart(2, '0')}-${dmy[1]!.padStart(2, '0')}`
    }
    // Không đoán được thì dùng ngày mốc — thà một giá trị rõ ràng còn hơn NULL
    // ở cột NOT NULL làm migration đổ giữa chừng.
    return TODAY
}

// ============================================================ tài khoản nhân viên

interface StaffAccount {
    role: 'owner' | 'manager' | 'receptionist' | 'editor'
    fullName: string
    phone: string
    email: string
}

/** 4 vai trò nội bộ. Danh sách thật: MANUAL.md M9. Mật khẩu thô: M12. */
const STAFF_ACCOUNTS: StaffAccount[] = [
    { role: 'owner', fullName: 'Chủ cơ sở (demo)', phone: '0900000001', email: 'owner@namduhill.demo' },
    { role: 'manager', fullName: 'Quản lý (demo)', phone: '0900000002', email: 'manager@namduhill.demo' },
    { role: 'receptionist', fullName: 'Lễ tân (demo)', phone: '0900000003', email: 'receptionist@namduhill.demo' },
    { role: 'editor', fullName: 'Biên tập nội dung (demo)', phone: '0900000004', email: 'editor@namduhill.demo' },
]

// ==================================================================== chạy

function main(): void {
    // Hash bcrypt nạp từ file rời do hash-staff-passwords.mjs sinh, để mật khẩu
    // thô không bao giờ đi qua file này.
    loadStaffHashes()

    mkdirSync(MIGRATIONS, { recursive: true })

    const reference = buildReferenceSeed()
    const demo = buildDemoSeed()

    // UTF-8 KHÔNG BOM — tên tiếng Việt trong seed cần UTF-8 chuẩn, BOM đầu file
    // .sql làm psql/Supabase CLI hiểu sai câu lệnh đầu tiên (bẫy #6 của §6.7).
    writeFileSync(resolve(MIGRATIONS, '20260101000300_seed_reference.sql'), reference, {
        encoding: 'utf8',
    })
    writeFileSync(resolve(MIGRATIONS, '20260101000400_seed_demo_bookings.sql'), demo, {
        encoding: 'utf8',
    })

    console.log('Đã sinh:')
    console.log('  supabase/migrations/20260101000300_seed_reference.sql')
    console.log('  supabase/migrations/20260101000400_seed_demo_bookings.sql')
}

function loadStaffHashes(): void {
    // File hash sinh rời bởi hash-staff-passwords.mjs, để mật khẩu thô không
    // bao giờ đi qua file này (§6.5: cấm commit mật khẩu thô vào seed).
    const path = resolve(HERE, 'staff-hashes.json')
    let raw: string
    try {
        raw = readFileSync(path, 'utf8')
    } catch {
        // Không nuốt lỗi (C3): nói rõ phải chạy lệnh nào, thay vì ghi hash giả.
        throw new Error(
            `Chưa có ${path}. Chạy trước: node resources/scripts/seed/hash-staff-passwords.mjs`,
        )
    }
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error(`${path} không phải object JSON hợp lệ`)
    }
    for (const [role, hash] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof hash !== 'string' || !hash.startsWith('$2')) {
            throw new Error(`Hash của vai trò "${role}" không phải chuỗi bcrypt`)
        }
        STAFF_PASSWORD_HASHES[role] = hash
    }
}

main()
