/**
 * Dựng lại `PropertyData` từ các bảng Supabase — ticket 200-01 §6.3.
 *
 * `PropertyData` là KIỂU TỔNG HỢP, không phải một bảng (schema-mapping §8.2):
 * nó được ghép từ `property_settings` + `room_types` + `addons` + nhóm nội dung
 * marketing. Chỗ này là nơi duy nhất biết cách ghép.
 *
 * Không `any`, không `as any` (luật C1): mọi hàng đọc lên đi qua một hàm thu
 * hẹp kiểu, thiếu trường bắt buộc thì ném lỗi có tên bảng và id.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { I18nText } from '@repo/utils'
import type {
    About,
    Addon,
    Amenity,
    Brand,
    Dining,
    Fact,
    Faq,
    GalleryItem,
    Hero,
    NavItem,
    Place,
    PropertyData,
    Review,
    Room,
    RoomExtra,
    RoomGroup,
    RoomReview,
    Tour,
    TourDay,
    TransportLeg,
} from '@repo/core'

// ------------------------------------------------------------ thu hẹp kiểu

/** Hàng trả về từ PostgREST: khoá là tên cột, giá trị chưa biết kiểu. */
type Row = Record<string, unknown>

function fail(where: string, detail: string): never {
    throw new Error(`[property-source] ${where}: ${detail}`)
}

function asString(value: unknown, where: string): string {
    if (typeof value !== 'string') fail(where, `mong đợi string, nhận ${typeof value}`)
    return value
}

function asOptionalString(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined
}

function asNumber(value: unknown, where: string): number {
    // DECIMAL của Postgres về PostgREST dưới dạng chuỗi để không mất độ chính
    // xác. Ép ở đây thay vì rải `Number()` khắp nơi gọi.
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value)
        if (!Number.isNaN(parsed)) return parsed
    }
    fail(where, `mong đợi number, nhận ${JSON.stringify(value)}`)
}

function asOptionalNumber(value: unknown): number | undefined {
    if (value === null || value === undefined) return undefined
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value)
        if (!Number.isNaN(parsed)) return parsed
    }
    return undefined
}

/** Cột kiểu domain `i18n_text` — DB đã CHECK đủ {vi,en}, đây là chốt chặn TS. */
function asI18n(value: unknown, where: string): I18nText {
    if (typeof value !== 'object' || value === null) {
        fail(where, `I18nText không phải object: ${JSON.stringify(value)}`)
    }
    const record = value as Record<string, unknown>
    const vi = record.vi
    const en = record.en
    if (typeof vi !== 'string' || typeof en !== 'string') {
        fail(where, `I18nText thiếu vi/en: ${JSON.stringify(value)}`)
    }
    return { vi, en }
}

function asOptionalI18n(value: unknown): I18nText | undefined {
    if (value === null || value === undefined) return undefined
    const record = value as Record<string, unknown>
    if (typeof record.vi !== 'string' || typeof record.en !== 'string') return undefined
    return { vi: record.vi, en: record.en }
}

function asI18nArray(value: unknown, where: string): I18nText[] {
    if (!Array.isArray(value)) return []
    return value.map((item, index) => asI18n(item, `${where}[${index}]`))
}

function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return []
    return value.filter((item): item is string => typeof item === 'string')
}

function asRows(value: unknown): Row[] {
    if (!Array.isArray(value)) return []
    return value.filter((item): item is Row => typeof item === 'object' && item !== null)
}

// ------------------------------------------------------------------- nạp

export async function loadPropertyFromSupabase(
    client: SupabaseClient,
    propertyId: string,
): Promise<PropertyData> {
    // Nạp song song: 7 truy vấn độc lập, không việc gì phải xếp hàng.
    const [settings, roomTypes, addons, dining, tours, places, gallery, amenities, reviews] =
        await Promise.all([
            selectOne(client, 'property_settings', propertyId),
            selectMany(client, 'room_types', 'sort_order'),
            selectMany(client, 'addons', 'sort_order'),
            selectMany(client, 'dining', 'sort_order'),
            selectMany(client, 'tours', 'sort_order'),
            selectMany(client, 'places', 'sort_order'),
            selectMany(client, 'gallery_items', 'sort_order'),
            selectMany(client, 'amenities', 'sort_order'),
            selectMany(client, 'reviews', 'sort_order'),
        ])

    const faqs = await selectMany(client, 'faqs', 'sort_order')

    return {
        brand: mapBrand(settings.brand),
        nav: mapNav(settings.nav),
        hero: mapHero(settings.hero),
        facts: mapFacts(settings.facts),
        about: mapAbout(settings.about),
        rooms: roomTypes.map(mapRoom),
        roomExtras: Object.fromEntries(
            roomTypes.map((row) => [asString(row.id, 'room_types.id'), mapRoomExtra(row)]),
        ),
        addons: addons.map(mapAddon),
        dining: dining.map(mapDining),
        tours: tours.map(mapTour),
        places: places.map(mapPlace),
        transport: mapTransport(settings.transport),
        faq: faqs.map(mapFaq),
        notes: asI18nArray(settings.notes, 'property_settings.notes'),
        gallery: gallery.map(mapGalleryItem),
        amenities: amenities.map(mapAmenity),
        reviews: reviews.map(mapReview),
    }
}

async function selectOne(
    client: SupabaseClient,
    table: string,
    id: string,
): Promise<Row> {
    const { data, error } = await client.from(table).select('*').eq('id', id).maybeSingle()
    if (error) fail(table, `đọc thất bại: ${error.message}`)
    if (!data) fail(table, `không có hàng id="${id}"`)
    return data as Row
}

async function selectMany(
    client: SupabaseClient,
    table: string,
    orderBy: string,
): Promise<Row[]> {
    const { data, error } = await client.from(table).select('*').order(orderBy)
    if (error) fail(table, `đọc thất bại: ${error.message}`)
    return (data ?? []) as Row[]
}

// -------------------------------------------------------------- ánh xạ hàng

/** `room_types` gộp Room + RoomExtra (schema-mapping §3) — tách lại làm hai. */
function mapRoom(row: Row): Room {
    const id = asString(row.id, 'room_types.id')
    const group = asOptionalString(row.group)
    return {
        id,
        name: asI18n(row.name, `room_types[${id}].name`),
        desc: asI18n(row.description, `room_types[${id}].description`),
        area: asString(row.area, `room_types[${id}].area`),
        guests: asNumber(row.guests, `room_types[${id}].guests`),
        price: asNumber(row.base_price, `room_types[${id}].base_price`),
        tags: asI18nArray(row.tags, `room_types[${id}].tags`),
        images: asStringArray(row.images),
        group: isRoomGroup(group) ? group : undefined,
        extraBedFee: asOptionalNumber(row.extra_bed_fee),
        reviews: mapRoomReviews(row.reviews),
        // `remaining` CỐ Ý để undefined: là giá trị dẫn xuất từ inventory cho
        // một khoảng ngày cụ thể, không phải thuộc tính của hạng phòng
        // (schema-mapping §3). checkAvailability() trả số thật — cấm bịa khan
        // hiếm (luật FE13/P10).
    }
}

function isRoomGroup(value: string | undefined): value is RoomGroup {
    return value === 'couple' || value === 'family' || value === 'suite'
}

function mapRoomReviews(value: unknown): RoomReview[] {
    return asRows(value).map((row, index) => ({
        who: asString(row.who, `roomReview[${index}].who`),
        score: asString(row.score, `roomReview[${index}].score`),
        text: asI18n(row.text, `roomReview[${index}].text`),
    }))
}

function mapRoomExtra(row: Row): RoomExtra {
    const id = asString(row.id, 'room_types.id')
    return {
        maxGuests: asNumber(row.max_guests, `room_types[${id}].max_guests`),
        defaultGuests: asNumber(row.default_guests, `room_types[${id}].default_guests`),
        extraBed: asNumber(row.extra_bed, `room_types[${id}].extra_bed`),
        bed: asOptionalI18n(row.bed) ?? { vi: '', en: '' },
        view: asOptionalI18n(row.view) ?? { vi: '', en: '' },
        long: asOptionalI18n(row.long_desc) ?? { vi: '', en: '' },
        long2: asOptionalI18n(row.long_desc_2),
        amenities: asI18nArray(row.amenities, `room_types[${id}].amenities`),
        conditions: asI18nArray(row.conditions, `room_types[${id}].conditions`),
    }
}

function mapAddon(row: Row): Addon {
    const id = asString(row.id, 'addons.id')
    return {
        id,
        name: asI18n(row.name, `addons[${id}].name`),
        price: asNumber(row.price, `addons[${id}].price`),
        unit: asI18n(row.unit, `addons[${id}].unit`),
    }
}

function mapDining(row: Row): Dining {
    const id = asString(row.id, 'dining.id')
    return {
        id,
        name: asI18n(row.name, `dining[${id}].name`),
        desc: asI18n(row.description, `dining[${id}].description`),
        note: asI18n(row.note, `dining[${id}].note`),
        image: asOptionalString(row.image),
    }
}

function mapTour(row: Row): Tour {
    const id = asString(row.id, 'tours.id')
    return {
        id,
        code: asString(row.code, `tours[${id}].code`),
        name: asI18n(row.name, `tours[${id}].name`),
        summary: asI18n(row.summary, `tours[${id}].summary`),
        price: asNumber(row.price, `tours[${id}].price`),
        days: mapTourDays(row.days),
    }
}

function mapTourDays(value: unknown): TourDay[] {
    return asRows(value).map((row, index) => ({
        label: asI18n(row.label, `tourDay[${index}].label`),
        items: asI18nArray(row.items, `tourDay[${index}].items`),
    }))
}

function mapPlace(row: Row): Place {
    const id = asString(row.id, 'places.id')
    return {
        id,
        name: asI18n(row.name, `places[${id}].name`),
        tag: asI18n(row.tag, `places[${id}].tag`),
        desc: asI18n(row.description, `places[${id}].description`),
        image: asOptionalString(row.image),
    }
}

function mapGalleryItem(row: Row): GalleryItem {
    const id = asString(row.id, 'gallery_items.id')
    return {
        id,
        title: asI18n(row.title, `gallery_items[${id}].title`),
        subtitle: asI18n(row.subtitle, `gallery_items[${id}].subtitle`),
        image: asOptionalString(row.image),
    }
}

function mapAmenity(row: Row): Amenity {
    const id = asString(row.id, 'amenities.id')
    return {
        id,
        icon: asString(row.icon, `amenities[${id}].icon`),
        label: asI18n(row.label, `amenities[${id}].label`),
        desc: asOptionalI18n(row.description),
    }
}

function mapReview(row: Row): Review {
    const id = asString(row.id, 'reviews.id')
    return {
        id,
        name: asString(row.name, `reviews[${id}].name`),
        from: asOptionalI18n(row.from_place),
        date: asString(row.date, `reviews[${id}].date`),
        rating: asNumber(row.rating, `reviews[${id}].rating`),
        comment: asI18n(row.comment, `reviews[${id}].comment`),
        avatar: asOptionalString(row.avatar),
    }
}

function mapFaq(row: Row): Faq {
    const id = asString(row.id, 'faqs.id')
    return {
        q: asI18n(row.question, `faqs[${id}].question`),
        a: asI18n(row.answer, `faqs[${id}].answer`),
    }
}

// ------------------------------------------------ khối jsonb trong settings

function mapBrand(value: unknown): Brand {
    const row = (value ?? {}) as Row
    return {
        name: asString(row.name, 'property_settings.brand.name'),
        suffix: asString(row.suffix, 'property_settings.brand.suffix'),
        tagline: asI18n(row.tagline, 'property_settings.brand.tagline'),
        address: asI18n(row.address, 'property_settings.brand.address'),
        phone: asString(row.phone, 'property_settings.brand.phone'),
        email: asString(row.email, 'property_settings.brand.email'),
        site: asString(row.site, 'property_settings.brand.site'),
        logo: asOptionalString(row.logo),
    }
}

function mapNav(value: unknown): NavItem[] {
    return asRows(value).map((row, index) => ({
        href: asString(row.href, `property_settings.nav[${index}].href`),
        label: asI18n(row.label, `property_settings.nav[${index}].label`),
    }))
}

function mapHero(value: unknown): Hero {
    const row = (value ?? {}) as Row
    return {
        kicker: asI18n(row.kicker, 'property_settings.hero.kicker'),
        title: asI18n(row.title, 'property_settings.hero.title'),
        sub: asI18n(row.sub, 'property_settings.hero.sub'),
        badges: asI18nArray(row.badges, 'property_settings.hero.badges'),
        images: asStringArray(row.images),
    }
}

function mapAbout(value: unknown): About {
    const row = (value ?? {}) as Row
    return {
        title: asI18n(row.title, 'property_settings.about.title'),
        kicker: asI18n(row.kicker, 'property_settings.about.kicker'),
        body: asI18nArray(row.body, 'property_settings.about.body'),
        services: asI18nArray(row.services, 'property_settings.about.services'),
    }
}

function mapFacts(value: unknown): Fact[] {
    return asRows(value).map((row, index) => ({
        value: asString(row.value, `property_settings.facts[${index}].value`),
        label: asI18n(row.label, `property_settings.facts[${index}].label`),
    }))
}

function mapTransport(value: unknown): TransportLeg[] {
    return asRows(value).map((row, index) => ({
        leg: asI18n(row.leg, `property_settings.transport[${index}].leg`),
        mode: asI18n(row.mode, `property_settings.transport[${index}].mode`),
        // ⚠️ nợ T2: TransportLeg.price là I18nText trong TS (chuỗi hiển thị
        // "250.000đ/người"), không phải số. Giữ nguyên ở v1.0.0.
        price: asI18n(row.price, `property_settings.transport[${index}].price`),
    }))
}
