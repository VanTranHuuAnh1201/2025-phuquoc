'use client'

import { useState, type ReactNode } from 'react'
import {
    ArrowLeft,
    Armchair,
    Ban,
    Bath,
    Bed,
    BedDouble,
    Calendar,
    Check,
    ChevronRight,
    Coffee,
    CreditCard,
    Eye,
    Flower2,
    Heart,
    Info,
    Maximize2,
    Share2,
    Shirt,
    Star,
    Users,
    Utensils,
    type LucideIcon,
} from 'lucide-react'
import {
    UI,
    formatPrice,
    pick,
    roomPath,
    themePath,
    themeRoot,
    type I18nText,
    type Locale,
    type PropertyData,
    type Room,
} from '@repo/core'
import {
    BookingCalendarModal,
    siteFooterPropsOf,
    siteHeaderPropsOf,
} from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Trang chi tiết một hạng phòng của mẫu 03 — bản riêng, theo đúng bố cục của
 * app resort.
 *
 * VÌ SAO KHÔNG DÙNG BẢN Ở `domain-hotel`: bản dùng chung là một cột nội dung
 * với khối đặt phòng nằm cuối trang. Bản resort là lưới 12 cột chia 4/5/3 —
 * thư viện ảnh · thông tin · thẻ đặt phòng DÍNH bên phải — cộng một luồng
 * mobile hoàn toàn tách rời (hero tràn viền, thanh CTA cố định đáy màn). Hai
 * cấu trúc điều hướng khác nhau, không phải hai bảng màu của cùng một cấu
 * trúc, nên theo luật R4 nó thuộc về theme. Bản domain vẫn nguyên cho h1/h2.
 *
 * NĂM THỨ ĐÃ CẮT KHI ĐƯA LÊN PACKAGE:
 *
 *   1. `useLanguage()` → `locale` qua prop. Hai app hai cơ chế i18n, theme
 *      phải chạy được ở cả hai (luật R4).
 *   2. `use(params)` + `next/link` → `roomSlug` qua prop, điều hướng bằng
 *      `<a>`. Theme không phụ thuộc router của framework.
 *   3. `ROOMS`/`formatVND`/`roomSlug` của app → `data.rooms`,
 *      `formatPrice()`, `roomPath()` của `core`. Bản ở app chỉ là một lớp đổi
 *      tên trường; giữ nó là giữ hai nguồn sự thật (luật R8).
 *   4. BỐN KHỐI VIẾT CỨNG TIẾNG VIỆT của bản resort — bảy nhóm tiện nghi,
 *      mười tiện nghi nổi bật, bốn đánh giá khách, mô tả dài — nay đọc từ
 *      `data.roomExtras[room.id]` và `data.reviews`. Chuỗi một ngôn ngữ ở tầng
 *      hiển thị là chuỗi không bao giờ dịch được (luật R6), và dữ liệu nội
 *      dung phải có đúng một nhà (luật R8). Nhóm tiện nghi giờ suy ra từ
 *      `RoomExtra.amenities` bằng một bảng từ khoá thuần hình thức — nó chỉ
 *      quyết định *icon nào đứng cạnh dòng nào*, không quyết định nội dung.
 *   5. `BookingCalendarModal` chép trong app → import từ `@repo/domain-hotel`.
 *      Popup này dùng chung với hero trang chủ; hai bản là hai đường phân kỳ.
 *
 * KHÔNG TÍNH GIÁ TRONG THEME (luật R13): tổng tiền ở thẻ đặt phòng chỉ là
 * `room.price × số đêm` để hiển thị. Con số thật đi qua `buildQuote()` của
 * `core` ở bước thanh toán — theme không được gọi thẳng nó.
 *
 * HEX ĐỔI SANG TOKEN, HÌNH ẢNH KHÔNG ĐỔI: mọi mã màu của bản resort có token
 * khớp đúng từng giá trị trong `tokens.css` (#1D4E89 = `--brand`, #0F2D52 =
 * `--surface-inverse`, #FFB800 = `--accent`…). Đổi sang token là hết vi phạm
 * D0 mà pixel vẫn y nguyên.
 *
 * ⚠️ SPACING VIẾT NGOẶC VUÔNG: thang `--space-N` của dự án phi tuyến
 * (4·8·16·24·40·64·96·140px), nên `px-6` ở đây là 64px chứ không phải 24px như
 * ở app resort. Mọi con số chép từ bản cũ phải viết `px-[24px]`. Cỡ chữ cùng
 * bẫy đó: `text-sm` của mẫu này là 13px còn của resort là 14px.
 */

/** Số đêm giữa hai mốc ISO; tối thiểu 1 để tổng tiền không bao giờ bằng 0. */
function countNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn).getTime()
    const end = new Date(checkOut).getTime()
    if (Number.isNaN(start) || Number.isNaN(end)) return 1
    return Math.max(1, Math.round((end - start) / 86400000))
}

/** `2026-08-15` → `15/08/2026`. Chuỗi ISO là để máy đọc, không phải để khách đọc. */
function formatDisplayDate(iso: string): string {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    return y && m && d ? `${d}/${m}/${y}` : iso
}

/**
 * Nhóm tiện nghi theo icon.
 *
 * ĐÂY LÀ HÌNH THỨC, KHÔNG PHẢI NGHIỆP VỤ: bảng dưới chỉ nói "dòng nào thì đứng
 * cạnh icon nào". Nội dung vẫn là `RoomExtra.amenities` của `core` — bỏ bảng
 * này đi thì trang vẫn liệt kê đủ tiện nghi, chỉ mất phần gom nhóm. Vì vậy nó
 * ở lại theme chứ không leo lên `domain-hotel`.
 *
 * Khớp cả hai ngôn ngữ vì `RoomExtra.amenities` là `I18nText` — chỉ dò bản `vi`
 * là dữ liệu tiếng Anh rơi hết vào nhóm "Tổng quát".
 */
const AMENITY_GROUPS: readonly {
    icon: LucideIcon
    label: I18nText
    match: RegExp
}[] = [
    {
        icon: Bed,
        label: H3.amenityGroupBedroom,
        match: /giường|tủ|nệm|chăn|gối|bed|wardrobe|closet|linen|mattress|pillow/i,
    },
    {
        icon: Armchair,
        label: H3.amenityGroupLiving,
        match: /sofa|ghế|bàn|phòng khách|seating|living|desk|armchair/i,
    },
    {
        icon: Utensils,
        label: H3.amenityGroupKitchen,
        match: /bếp|ấm|tủ lạnh|minibar|mini bar|kitchen|kettle|fridge|refrigerator/i,
    },
    {
        icon: Bath,
        label: H3.amenityGroupBathroom,
        match: /tắm|dép|khăn|sấy|vệ sinh|vòi sen|bath|shower|towel|slipper|toiletr|hairdry|robe/i,
    },
    {
        icon: Flower2,
        label: H3.amenityGroupOutdoor,
        match: /ban công|sân|hiên|hồ bơi|vườn|balcon|terrace|patio|pool|garden|courtyard/i,
    },
    {
        icon: Shirt,
        label: H3.amenityGroupInRoom,
        match: /phơi|giặt|là quần áo|ủi|drying|laundry|iron/i,
    },
]

/** Nhóm còn lại: mọi dòng không khớp bảng trên. */
const AMENITY_FALLBACK = { icon: Info, label: H3.amenityGroupGeneral }

interface AmenityGroup {
    icon: LucideIcon
    label: I18nText
    items: I18nText[]
}

function groupAmenities(amenities: readonly I18nText[]): AmenityGroup[] {
    const buckets = new Map<I18nText, I18nText[]>()

    for (const item of amenities) {
        const group =
            AMENITY_GROUPS.find((g) => g.match.test(item.vi) || g.match.test(item.en)) ??
            AMENITY_FALLBACK
        const list = buckets.get(group.label)
        if (list) list.push(item)
        else buckets.set(group.label, [item])
    }

    const ordered = [...AMENITY_GROUPS, AMENITY_FALLBACK]
    return ordered
        .filter((g) => buckets.has(g.label))
        .map((g) => ({ icon: g.icon, label: g.label, items: buckets.get(g.label)! }))
}

/** Điểm trung bình từ `data.reviews`; không có đánh giá thì không hiện gì. */
function averageRating(ratings: readonly number[]): number | null {
    if (ratings.length === 0) return null
    return Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
}

export interface RoomDetailPageProps {
    data: PropertyData
    locale: Locale
    /** Id hạng phòng đang xem — route `[theme]/rooms/[id]` truyền xuống. */
    roomSlug?: string
    /**
     * Chèn thêm vào header — app hub cắm `<AccountBar />` vào đây.
     *
     * KHÔNG KHAI THÌ NÓ BỊ NUỐT LẶNG LẼ: prop không có trong type thì React bỏ
     * qua — chuông thông báo và menu tài khoản biến mất khỏi trang này mà
     * build vẫn xanh.
     */
    extra?: ReactNode
}

/**
 * `slug` đọc từ `meta` chứ không nhận qua prop: theme luôn biết mình là mẫu
 * nào, và route dùng chung chỉ truyền `data`/`locale`/`roomSlug`/`extra`. Khai
 * `slug` bắt buộc ở đây là trang vỡ ngay khi cắm vào registry.
 */
export function RoomDetailPage({ data, locale, roomSlug, extra }: RoomDetailPageProps) {
    const rooms = data.rooms ?? []
    const room: Room | undefined = rooms.find((r) => r.id === roomSlug)

    // Ngày & số khách của khối đặt phòng — sửa qua cùng popup với hero.
    const [isCalendarOpen, setCalendarOpen] = useState(false)
    const [checkIn, setCheckIn] = useState('2026-08-15')
    const [checkOut, setCheckOut] = useState('2026-08-17')
    const [guests, setGuests] = useState(pick(H3.defaultGuests, locale))
    const [isFavorite, setFavorite] = useState(false)

    const roomsHref = themePath(meta.slug, 'rooms')

    /**
     * KHÔNG RƠI VỀ PHÒNG ĐẦU TIÊN như bản resort làm. Slug sai mà vẫn hiện một
     * phòng khác là nói dối khách: họ tưởng đang xem đúng thứ mình bấm vào và
     * đặt nhầm hạng. Nói thẳng và chỉ đường về danh sách (luật D6).
     */
    if (!room) {
        return (
            <div data-theme={meta.slug} className="font-primary overflow-x-clip">
                <SiteHeader {...siteHeaderPropsOf(data, locale, meta.slug)} extra={extra} />
                <main className="bg-surface-base text-text-primary flex min-h-[60vh] items-center justify-center px-[24px] py-[80px]">
                    <div className="max-w-[420px] text-center">
                        <h1 className="font-display text-text-primary text-[22px] font-bold">
                            {pick(H3.roomNotFoundTitle, locale)}
                        </h1>
                        <p className="text-text-secondary mt-[8px] text-[13px] leading-relaxed">
                            {pick(H3.roomNotFoundBody, locale)}
                        </p>
                        <a
                            href={roomsHref}
                            className="bg-surface-strong text-text-inverse hover:bg-[var(--brand-mid)] focus-visible:outline-brand mt-[24px] inline-flex min-h-[44px] items-center rounded-[8px] px-[24px] text-[14px] font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            {pick(UI.roomList, locale)}
                        </a>
                    </div>
                </main>
                <SiteFooter {...siteFooterPropsOf(data, locale, meta.slug)} />
            </div>
        )
    }

    const extraInfo = data.roomExtras?.[room.id]
    const nights = countNights(checkIn, checkOut)
    const roomName = pick(room.name, locale)
    const roomImages = room.images?.length ? room.images : []
    const heroImage = roomImages[0]

    const amenityGroups = groupAmenities(extraInfo?.amenities ?? [])
    /** Dải "tiện nghi nổi bật": mười dòng đầu, chính là nguồn của các nhóm trên. */
    const highlights = (extraInfo?.amenities ?? []).slice(0, 10)

    const reviews = data.reviews ?? []
    const rating = averageRating(reviews.map((r) => r.rating))
    const otherRooms = rooms.filter((r) => r.id !== room.id).slice(0, 3)

    const checkoutHref = `${themePath(meta.slug, 'checkout')}?room=${encodeURIComponent(room.id)}`

    /** Sao đầy — dùng ở cả ba chỗ có xếp hạng nên tách ra khỏi JSX lặp. */
    const stars = (count: number, size: number) => (
        <div className="text-accent flex gap-[2px]" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <Star
                    key={i}
                    style={{ width: size, height: size }}
                    className="fill-[var(--accent)] text-[var(--accent)]"
                />
            ))}
        </div>
    )

    return (
        <div data-theme={meta.slug} className="font-primary overflow-x-clip">
            <SiteHeader {...siteHeaderPropsOf(data, locale, meta.slug)} extra={extra} />

            <main className="bg-surface-raised text-text-primary min-h-screen pt-[48px] pb-[80px] md:pt-[64px] md:pb-[64px]">
                {/* ==================================================== mobile ===
                  * Mobile là BỐ CỤC RIÊNG, không phải desktop xếp dọc: hero
                  * tràn viền, nội dung một cột hẹp, CTA cố định đáy màn hình
                  * (luật P9).
                  */}
                <div className="block md:hidden">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-hover)]">
                        {heroImage && (
                            <img
                                src={heroImage}
                                alt={roomName}
                                decoding="async"
                                className="h-full w-full object-cover"
                            />
                        )}

                        <div className="absolute inset-x-[12px] top-[12px] z-10 flex items-center justify-between">
                            <a
                                href={roomsHref}
                                aria-label={pick(UI.roomList, locale)}
                                className="text-text-primary focus-visible:outline-brand flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[var(--hero-card)] shadow-1 backdrop-blur-md transition hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <ArrowLeft className="h-[20px] w-[20px]" />
                            </a>

                            <div className="flex items-center gap-[8px]">
                                <button
                                    type="button"
                                    aria-pressed={isFavorite}
                                    aria-label={pick(H3.saveRoom, locale)}
                                    onClick={() => setFavorite(!isFavorite)}
                                    className="text-text-primary focus-visible:outline-brand flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[var(--hero-card)] shadow-1 backdrop-blur-md transition hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    <Heart
                                        className={`h-[16px] w-[16px] ${
                                            isFavorite ? 'fill-[var(--danger)] text-[var(--danger)]' : ''
                                        }`}
                                    />
                                </button>
                                <button
                                    type="button"
                                    aria-label={pick(H3.copyLink, locale)}
                                    onClick={() =>
                                        navigator.clipboard?.writeText?.(window.location.href)
                                    }
                                    className="text-text-primary focus-visible:outline-brand flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[var(--hero-card)] shadow-1 backdrop-blur-md transition hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    <Share2 className="h-[16px] w-[16px]" />
                                </button>
                            </div>
                        </div>

                        {roomImages.length > 1 && (
                            <span className="text-text-inverse absolute right-[12px] bottom-[12px] rounded-full bg-black/60 px-[10px] py-[4px] text-[11px] font-medium backdrop-blur-md">
                                1/{roomImages.length}
                            </span>
                        )}
                    </div>

                    <div className="space-y-[16px] px-[16px] pt-[12px]">
                        <div className="border-border-muted space-y-[8px] border-b pb-[16px]">
                            <h1 className="font-display text-text-primary text-[18px] font-bold">
                                {roomName}
                            </h1>

                            {rating !== null && (
                                <div className="flex items-center gap-[8px] text-[12px]">
                                    {stars(5, 14)}
                                    <span className="text-brand font-bold">{rating}</span>
                                    <span className="text-text-tertiary">
                                        ({reviews.length} {pick(UI.reviews, locale)})
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* --- những gì đã bao gồm trong giá --- */}
                        <div className="border-border-muted space-y-[12px] rounded-[12px] border bg-[var(--surface-alt)] p-[16px]">
                            <h2 className="font-display text-[13px] font-bold text-[var(--surface-inverse)]">
                                {pick(UI.roomInclusions, locale)}
                            </h2>

                            <div className="space-y-[8px] text-[12px]">
                                <p className="text-text-secondary m-0 flex items-center gap-[8px]">
                                    <Users
                                        className="text-brand h-[16px] w-[16px] shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {pick(H3.priceForAdults, locale)}{' '}
                                        {extraInfo?.defaultGuests ?? room.guests}{' '}
                                        {pick(UI.adults, locale)}
                                    </span>
                                </p>
                                <p className="text-text-secondary m-0 flex items-center gap-[8px]">
                                    <Calendar
                                        className="text-brand h-[16px] w-[16px] shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>{pick(UI.flexibleDateChanges, locale)}</span>
                                </p>
                                <p className="text-text-secondary m-0 flex items-center gap-[8px]">
                                    <Ban
                                        className="text-brand h-[16px] w-[16px] shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium">
                                        {pick(UI.nonRefundable, locale)}
                                    </span>
                                </p>
                                <p className="text-text-secondary m-0 flex items-center gap-[8px]">
                                    <CreditCard
                                        className="text-brand h-[16px] w-[16px] shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>{pick(UI.payBeforeArrival, locale)}</span>
                                </p>
                                <p className="text-success m-0 flex items-center gap-[8px] font-medium">
                                    <Coffee className="h-[16px] w-[16px] shrink-0" aria-hidden="true" />
                                    <span>{pick(UI.dailyBreakfastIncluded, locale)}</span>
                                </p>
                            </div>
                        </div>

                        {/* --- mô tả --- */}
                        <div className="border-border-muted space-y-[6px] border-t pt-[16px]">
                            <h2 className="font-display text-text-primary text-[13px] font-bold">
                                {pick(UI.roomDescription, locale)}
                            </h2>
                            <p className="text-text-secondary text-[12px] leading-relaxed">
                                {pick(extraInfo?.long ?? room.desc, locale)}
                            </p>
                        </div>

                        {/* --- tiện nghi theo nhóm --- */}
                        {amenityGroups.length > 0 && (
                            <div className="border-border-muted space-y-[16px] border-t pt-[16px]">
                                <h2 className="font-display text-text-primary text-[15px] font-bold">
                                    {pick(UI.roomAmenities, locale)}
                                </h2>

                                <div className="space-y-[16px]">
                                    {amenityGroups.map((group) => {
                                        const GroupIcon = group.icon
                                        return (
                                            <div
                                                key={group.label.en}
                                                className="flex items-start gap-[12px]"
                                            >
                                                <GroupIcon
                                                    className="text-text-primary mt-[2px] h-[20px] w-[20px] shrink-0 stroke-[1.75]"
                                                    aria-hidden="true"
                                                />
                                                <div className="space-y-[2px]">
                                                    <h3 className="text-text-primary text-[12px] font-bold">
                                                        {pick(group.label, locale)}
                                                    </h3>
                                                    <ul className="m-0 list-none space-y-[2px] p-0">
                                                        {group.items.map((item) => (
                                                            <li
                                                                key={item.en}
                                                                className="text-text-secondary text-[11px] leading-normal"
                                                            >
                                                                {pick(item, locale)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* --- gợi ý phòng khác --- */}
                        {otherRooms.length > 0 && (
                            <div className="border-border-muted space-y-[12px] border-t pt-[16px] pb-[24px]">
                                <h2 className="font-display text-text-primary text-[15px] font-bold">
                                    {pick(UI.suggestedRooms, locale)}
                                </h2>

                                <div className="space-y-[12px]">
                                    {otherRooms.map((r) => (
                                        <a
                                            key={r.id}
                                            href={roomPath(meta.slug, r.id)}
                                            className="bg-surface-raised border-border-muted hover:border-brand group flex items-center gap-[12px] rounded-[10px] border p-[12px] text-inherit no-underline shadow-1 transition"
                                        >
                                            <div className="relative aspect-[4/3] w-[90px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--surface-hover)]">
                                                {r.images?.[0] && (
                                                    <img
                                                        src={r.images[0]}
                                                        alt={pick(r.name, locale)}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-display text-text-primary group-hover:text-brand truncate text-[12px] font-bold">
                                                    {pick(r.name, locale)}
                                                </h3>
                                                <div className="text-text-tertiary mt-[2px] flex items-center gap-[10px] text-[10px]">
                                                    <span className="flex items-center gap-[4px]">
                                                        <Maximize2
                                                            className="text-brand h-[11px] w-[11px]"
                                                            aria-hidden="true"
                                                        />
                                                        {r.area}
                                                    </span>
                                                    <span className="flex items-center gap-[4px]">
                                                        <Users
                                                            className="text-brand h-[11px] w-[11px]"
                                                            aria-hidden="true"
                                                        />
                                                        {r.guests} {pick(UI.guests, locale)}
                                                    </span>
                                                </div>
                                                <div className="border-border-muted mt-[8px] flex items-center justify-between border-t pt-[4px]">
                                                    <span className="text-[12px] font-bold text-[var(--surface-inverse)]">
                                                        {formatPrice(r.price, locale)}
                                                        <span className="text-text-tertiary text-[8px] font-normal">
                                                            /{pick(UI.nights, locale)}
                                                        </span>
                                                    </span>
                                                    <span className="bg-surface-strong text-text-inverse rounded-[6px] px-[8px] py-[2px] text-[10px] font-semibold">
                                                        {pick(UI.select, locale)}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- CTA dính đáy màn (luật P10) --- */}
                    <div className="bg-surface-raised border-border-muted fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t px-[16px] py-[12px] shadow-2">
                        <button
                            type="button"
                            onClick={() => setCalendarOpen(true)}
                            aria-label={pick(H3.changeDatesGuests, locale)}
                            className="focus-visible:outline-brand rounded-[4px] text-left focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <span className="text-text-tertiary block text-[11px] leading-none">
                                {pick(UI.from, locale)}
                            </span>
                            <span className="mt-[2px] flex items-baseline gap-[4px]">
                                <span className="text-text-primary text-[17px] font-bold">
                                    {formatPrice(room.price, locale)}
                                </span>
                                <span className="text-text-tertiary text-[10px]">
                                    /{pick(UI.nights, locale)}
                                </span>
                            </span>
                            <span className="text-brand mt-[2px] block text-[10px] font-semibold underline">
                                {formatDisplayDate(checkIn)} — {formatDisplayDate(checkOut)} · {guests}
                            </span>
                        </button>

                        <a
                            href={checkoutHref}
                            className="bg-surface-strong text-text-inverse hover:bg-[var(--brand-mid)] focus-visible:outline-brand inline-flex min-h-[44px] items-center rounded-[8px] px-[20px] text-[14px] font-bold no-underline shadow-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            {pick(UI.selectRoom, locale)}
                        </a>
                    </div>
                </div>

                {/* =================================================== desktop === */}
                <div className="mx-auto hidden max-w-[var(--container)] space-y-[24px] px-[24px] md:block lg:px-[32px]">
                    <nav
                        aria-label="Breadcrumb"
                        className="text-text-tertiary flex items-center gap-[6px] pt-[8px] text-[12px]"
                    >
                        <a
                            href={themeRoot(meta.slug)}
                            className="hover:text-brand font-medium text-inherit no-underline transition"
                        >
                            {pick(UI.home, locale)}
                        </a>
                        <ChevronRight
                            className="h-[14px] w-[14px] shrink-0 text-[var(--text-faint)]"
                            aria-hidden="true"
                        />
                        <a
                            href={roomsHref}
                            className="hover:text-brand font-medium text-inherit no-underline transition"
                        >
                            {pick(UI.roomList, locale)}
                        </a>
                        <ChevronRight
                            className="h-[14px] w-[14px] shrink-0 text-[var(--text-faint)]"
                            aria-hidden="true"
                        />
                        <span
                            aria-current="page"
                            className="text-text-primary max-w-[300px] truncate font-semibold"
                        >
                            {roomName}
                        </span>
                    </nav>

                    {/* --- lưới 12 cột: ảnh 4 · thông tin 5 · đặt phòng 3 --- */}
                    <div className="grid grid-cols-12 items-start gap-[24px]">
                        {/* ============ cột 1: thư viện ảnh ============ */}
                        <div className="col-span-4 space-y-[12px]">
                            <div className="border-border-muted aspect-[4/3] overflow-hidden rounded-[16px] border bg-[var(--surface-hover)] shadow-1">
                                {heroImage && (
                                    <img
                                        src={heroImage}
                                        alt={roomName}
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>

                            {roomImages.length > 1 && (
                                <div className="grid grid-cols-5 gap-[8px]">
                                    {[0, 1, 2, 3, 4].map((idx) => {
                                        const src = roomImages[idx % roomImages.length]
                                        const remaining = roomImages.length - 5
                                        return (
                                            <div
                                                key={idx}
                                                className="border-border-muted relative aspect-[4/3] overflow-hidden rounded-[8px] border bg-[var(--surface-hover)] transition hover:opacity-90"
                                            >
                                                {src && (
                                                    <img
                                                        src={src}
                                                        alt={`${roomName} ${idx + 1}`}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                                {idx === 4 && remaining > 0 && (
                                                    <span className="text-text-inverse absolute inset-0 flex items-center justify-center bg-black/50 text-[12px] font-bold backdrop-blur-xs">
                                                        +{remaining}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ============ cột 2: thông tin & mô tả ============ */}
                        <div className="col-span-5 space-y-[24px]">
                            <div>
                                <h1 className="font-display text-text-primary text-[24px] font-bold lg:text-[30px]">
                                    {roomName}
                                </h1>

                                {/*
                                  * ICON SVG THAY CHO EMOJI: bản resort dùng
                                  * 📐 👤 🛏️ 👁️. Emoji đổi hình theo hệ điều
                                  * hành, không nhận màu token, và trình đọc
                                  * màn hình đọc thành "thước kẻ tam giác"
                                  * (luật D5).
                                  */}
                                <div className="text-text-tertiary mt-[6px] flex flex-wrap items-center gap-[12px] text-[12px] font-medium">
                                    <span className="flex items-center gap-[4px]">
                                        <Maximize2
                                            className="text-brand h-[14px] w-[14px]"
                                            aria-hidden="true"
                                        />
                                        {room.area}
                                    </span>
                                    <span className="flex items-center gap-[4px]">
                                        <Users
                                            className="text-brand h-[14px] w-[14px]"
                                            aria-hidden="true"
                                        />
                                        {room.guests} {pick(UI.guests, locale)}
                                    </span>
                                    {extraInfo?.bed && (
                                        <span className="flex items-center gap-[4px]">
                                            <BedDouble
                                                className="text-brand h-[14px] w-[14px]"
                                                aria-hidden="true"
                                            />
                                            {pick(extraInfo.bed, locale)}
                                        </span>
                                    )}
                                    {extraInfo?.view && (
                                        <span className="flex items-center gap-[4px]">
                                            <Eye
                                                className="text-brand h-[14px] w-[14px]"
                                                aria-hidden="true"
                                            />
                                            {pick(extraInfo.view, locale)}
                                        </span>
                                    )}
                                </div>

                                {rating !== null && (
                                    <div className="flex items-center gap-[8px] pt-[8px] text-[12px]">
                                        {stars(5, 14)}
                                        <span className="text-brand font-bold">{rating}</span>
                                        <span className="text-text-tertiary">
                                            ({reviews.length} {pick(UI.reviews, locale)})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* --- sáu điểm đã bao gồm, hai cột --- */}
                            <ul className="text-brand m-0 grid list-none grid-cols-2 gap-[8px] p-0 pt-[4px] text-[12px] font-medium">
                                {[
                                    UI.freeBreakfast,
                                    UI.privateBalcony,
                                    UI.freeHighSpeedWiFi,
                                    UI.airConditioning,
                                    UI.freeCancellation48h,
                                    UI.minibar,
                                ].map((label) => (
                                    <li key={label.en} className="flex items-center gap-[6px]">
                                        <Check
                                            className="text-success h-[16px] w-[16px] shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span>{pick(label, locale)}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* --- mô tả --- */}
                            <div className="border-border-muted space-y-[6px] border-t pt-[16px]">
                                <h2 className="text-text-primary text-[13px] font-bold">
                                    {pick(UI.roomDescription2, locale)}
                                </h2>
                                <p className="text-text-secondary text-[12px] leading-relaxed">
                                    {pick(extraInfo?.long ?? room.desc, locale)}
                                </p>
                                {extraInfo?.long2 && (
                                    <p className="text-text-secondary text-[12px] leading-relaxed">
                                        {pick(extraInfo.long2, locale)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ============ cột 3: thẻ đặt phòng dính ============ */}
                        <div className="sticky top-[80px] col-span-3">
                            <div className="bg-surface-raised border-border-muted space-y-[24px] rounded-[16px] border border-t-4 border-t-[var(--surface-inverse)] p-[20px] shadow-2">
                                <div>
                                    <div className="flex items-baseline gap-[4px]">
                                        <span className="text-[20px] font-bold text-[var(--surface-inverse)]">
                                            {formatPrice(room.price, locale)}
                                        </span>
                                        <span className="text-text-tertiary text-[12px]">
                                            /{pick(UI.nights, locale)}
                                        </span>
                                    </div>
                                    <span className="text-text-tertiary mt-[2px] block text-[11px]">
                                        {pick(UI.taxesAndFeesIncluded, locale)}
                                    </span>
                                </div>

                                {/* --- ngày nhận / trả --- */}
                                <button
                                    type="button"
                                    onClick={() => setCalendarOpen(true)}
                                    aria-label={pick(H3.changeStayDates, locale)}
                                    className="border-border-muted hover:border-brand focus-visible:outline-brand w-full space-y-[6px] rounded-[10px] border bg-[var(--surface-alt)] p-[10px] text-left transition focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    <span className="flex items-center justify-between text-[12px]">
                                        <span>
                                            <span className="text-text-tertiary block text-[10px]">
                                                {pick(UI.checkIn, locale)}
                                            </span>
                                            <span className="text-text-primary font-semibold">
                                                {formatDisplayDate(checkIn)}
                                            </span>
                                        </span>
                                        <span className="text-right">
                                            <span className="text-text-tertiary block text-[10px]">
                                                {pick(UI.checkOut, locale)}
                                            </span>
                                            <span className="text-text-primary font-semibold">
                                                {formatDisplayDate(checkOut)}
                                            </span>
                                        </span>
                                    </span>
                                    <span className="text-brand block border-t border-[var(--border)] pt-[4px] text-center text-[10px] font-semibold">
                                        {nights} {pick(UI.nights, locale)}
                                    </span>
                                </button>

                                {/* --- số khách --- */}
                                <div className="border-border-muted flex items-center justify-between rounded-[10px] border bg-[var(--surface-alt)] p-[10px] text-[12px]">
                                    <div>
                                        <span className="text-text-tertiary block text-[10px]">
                                            {pick(UI.guests2, locale)}
                                        </span>
                                        <span className="text-text-primary text-[12px] font-semibold">
                                            {guests}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCalendarOpen(true)}
                                        aria-label={pick(H3.changeGuestCount, locale)}
                                        className="text-brand border-brand focus-visible:outline-brand rounded-[4px] border px-[8px] py-[2px] text-[11px] font-semibold transition hover:bg-[var(--surface-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-[var(--surface-hover)]"
                                    >
                                        {pick(UI.change, locale)}
                                    </button>
                                </div>

                                {/*
                                  * TỔNG TIỀN Ở ĐÂY CHỈ ĐỂ XEM: `giá × số đêm`,
                                  * không mùa, không gói giá, không khuyến mãi.
                                  * Con số nghiệp vụ là kết quả `buildQuote()`
                                  * của `core` ở bước thanh toán — theme không
                                  * được tự tính (luật R8/R13).
                                  */}
                                <div className="border-border-muted flex items-center justify-between border-t pt-[4px]">
                                    <span className="text-text-secondary text-[12px] font-semibold">
                                        {pick(UI.total, locale)}
                                    </span>
                                    <span className="text-[17px] font-bold text-[var(--surface-inverse)]">
                                        {formatPrice(room.price * nights, locale)}
                                    </span>
                                </div>

                                <a
                                    href={checkoutHref}
                                    className="bg-surface-strong text-text-inverse hover:bg-[var(--brand-mid)] focus-visible:outline-brand flex h-[44px] w-full items-center justify-center rounded-[8px] text-[14px] font-semibold no-underline shadow-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    {pick(UI.bookNow, locale)}
                                </a>

                                <ul className="text-text-tertiary m-0 list-none space-y-[4px] p-0 pt-[4px] text-[11px]">
                                    {[UI.instantConfirmation, UI.noPrepaymentRequired].map(
                                        (label) => (
                                            <li
                                                key={label.en}
                                                className="flex items-center gap-[6px]"
                                            >
                                                <Check
                                                    className="text-success h-[14px] w-[14px] shrink-0"
                                                    aria-hidden="true"
                                                />
                                                <span>{pick(label, locale)}</span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* --- dải tiện nghi nổi bật --- */}
                    {highlights.length > 0 && (
                        <div className="border-border-muted space-y-[12px] border-t pt-[24px]">
                            <h2 className="text-text-primary text-[15px] font-bold">
                                {pick(UI.featuredAmenities, locale)}
                            </h2>
                            <ul className="m-0 grid list-none grid-cols-5 gap-[8px] p-0 lg:grid-cols-10">
                                {highlights.map((item) => {
                                    const group =
                                        AMENITY_GROUPS.find(
                                            (g) => g.match.test(item.vi) || g.match.test(item.en),
                                        ) ?? AMENITY_FALLBACK
                                    const ItemIcon = group.icon
                                    return (
                                        <li
                                            key={item.en}
                                            className="border-border-muted hover:bg-surface-raised flex flex-col items-center rounded-[10px] border bg-[var(--surface-alt)] p-[10px] text-center transition"
                                        >
                                            <ItemIcon
                                                className="text-brand mb-[4px] h-[20px] w-[20px] stroke-[1.75]"
                                                aria-hidden="true"
                                            />
                                            <span className="text-text-primary text-[10px] leading-tight font-medium">
                                                {pick(item, locale)}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}

                    {/* --- tiện nghi chi tiết theo nhóm --- */}
                    {amenityGroups.length > 0 && (
                        <div className="border-border-muted space-y-[24px] border-t pt-[24px]">
                            <h2 className="font-display text-text-primary text-[18px] font-bold">
                                {pick(UI.detailedRoomAmenities, locale)}
                            </h2>

                            <div className="grid grid-cols-3 gap-[24px]">
                                {amenityGroups.map((group) => {
                                    const GroupIcon = group.icon
                                    return (
                                        <div
                                            key={group.label.en}
                                            className="border-border-muted space-y-[10px] rounded-[12px] border bg-[var(--surface-alt)] p-[16px]"
                                        >
                                            <div className="flex items-center gap-[10px] text-[var(--surface-inverse)]">
                                                <GroupIcon
                                                    className="h-[20px] w-[20px] shrink-0 stroke-[1.75]"
                                                    aria-hidden="true"
                                                />
                                                <h3 className="text-text-primary text-[13px] font-bold">
                                                    {pick(group.label, locale)}
                                                </h3>
                                            </div>
                                            <ul className="space-y-[6px] pl-[28px]">
                                                {group.items.map((item) => (
                                                    <li
                                                        key={item.en}
                                                        className="text-text-secondary list-disc text-[12px] marker:text-[var(--brand)]"
                                                    >
                                                        {pick(item, locale)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* --- đánh giá của khách --- */}
                    {reviews.length > 0 && rating !== null && (
                        <div className="border-border-muted space-y-[40px] border-t pt-[40px]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-display text-text-primary text-[20px] font-bold">
                                        {pick(UI.customerReviews, locale)}
                                    </h2>
                                    <p className="text-text-tertiary mt-[2px] text-[12px]">
                                        {pick(UI.realReviewsFromVerifiedGuestsStaying, locale)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-[8px]">
                                    <span className="text-[20px] font-bold text-[var(--surface-inverse)]">
                                        {rating}
                                    </span>
                                    <div className="text-left">
                                        {stars(5, 14)}
                                        <span className="text-text-tertiary text-[11px] font-medium">
                                            {reviews.length} {pick(UI.reviews, locale)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/*
                              * BỐN THANH ĐIỂM THÀNH PHẦN: dữ liệu chấm theo
                              * tiêu chí chưa có trong `core` (`Review` chỉ có
                              * một `rating` tổng). Thay vì bịa "4.9 / 5.0 / 4.9
                              * / 4.8" như bản resort — con số bịa là dark
                              * pattern, luật P10 — cả bốn thanh đọc chung điểm
                              * trung bình thật. Có dữ liệu theo tiêu chí thì
                              * chỉ việc thay nguồn, bố cục không đổi.
                              */}
                            <div className="border-border-muted grid grid-cols-4 gap-[24px] rounded-[12px] border bg-[var(--surface-alt)] p-[16px] text-[12px]">
                                {[
                                    UI.cleanliness,
                                    UI.locationView,
                                    UI.service,
                                    UI.valueForMoney,
                                ].map((label) => (
                                    <div key={label.en}>
                                        <div className="text-text-secondary mb-[4px] flex justify-between font-medium">
                                            <span>{pick(label, locale)}</span>
                                            <span className="text-text-primary font-bold">
                                                {rating}/5
                                            </span>
                                        </div>
                                        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[var(--border)]">
                                            <div
                                                className="bg-brand h-full"
                                                style={{ width: `${(rating / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-[24px]">
                                {reviews.slice(0, 4).map((review) => (
                                    <article
                                        key={review.id}
                                        className="bg-surface-raised border-border-muted hover:border-brand space-y-[10px] rounded-[12px] border p-[16px] shadow-1 transition"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-[10px]">
                                                <span
                                                    aria-hidden="true"
                                                    className="text-text-inverse flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[var(--surface-inverse)] text-[12px] font-bold"
                                                >
                                                    {review.name.charAt(0)}
                                                </span>
                                                <div>
                                                    <h3 className="text-text-primary text-[12px] font-bold">
                                                        {review.name}
                                                    </h3>
                                                    <span className="text-text-tertiary text-[10px]">
                                                        {review.from
                                                            ? `${pick(review.from, locale)} • `
                                                            : ''}
                                                        {review.date}
                                                    </span>
                                                </div>
                                            </div>
                                            {stars(review.rating, 12)}
                                        </div>
                                        <p className="text-text-secondary text-[12px] leading-relaxed italic">
                                            &quot;{pick(review.comment, locale)}&quot;
                                        </p>
                                        <p className="text-success m-0 flex items-center gap-[6px] pt-[4px] text-[10px] font-medium">
                                            <Check className="h-[12px] w-[12px] shrink-0" aria-hidden="true" />
                                            <span>{pick(UI.verifiedStay, locale)}</span>
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- các hạng phòng khác --- */}
                    {otherRooms.length > 0 && (
                        <div className="border-border-muted space-y-[40px] border-t pt-[40px] pb-[24px]">
                            <div>
                                <h2 className="font-display text-text-primary text-[20px] font-bold">
                                    {pick(UI.suggestedRooms, locale)}
                                </h2>
                                <p className="text-text-tertiary mt-[2px] text-[12px]">
                                    {pick(UI.exploreOtherRoomTypesSuitableFor, locale)}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-[24px]">
                                {otherRooms.map((r) => (
                                    <article
                                        key={r.id}
                                        className="bg-surface-raised border-border-muted group flex flex-col justify-between overflow-hidden rounded-[12px] border shadow-1 transition hover:shadow-2"
                                    >
                                        <div>
                                            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-hover)]">
                                                {r.images?.[0] && (
                                                    <img
                                                        src={r.images[0]}
                                                        alt={pick(r.name, locale)}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                )}
                                                {r.tags[0] && (
                                                    <span className="text-text-inverse absolute top-[8px] left-[8px] rounded-[4px] bg-black/70 px-[8px] py-[2px] text-[10px] font-semibold backdrop-blur-md">
                                                        {pick(r.tags[0], locale)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-[8px] p-[16px]">
                                                <h3 className="font-display text-text-primary group-hover:text-brand truncate text-[15px] font-bold transition-colors">
                                                    <a
                                                        href={roomPath(meta.slug, r.id)}
                                                        className="text-inherit no-underline"
                                                    >
                                                        {pick(r.name, locale)}
                                                    </a>
                                                </h3>

                                                <div className="text-text-tertiary flex items-center gap-[12px] text-[12px] font-medium">
                                                    <span className="flex items-center gap-[4px]">
                                                        <Maximize2
                                                            className="text-brand h-[13px] w-[13px]"
                                                            aria-hidden="true"
                                                        />
                                                        {r.area}
                                                    </span>
                                                    <span className="flex items-center gap-[4px]">
                                                        <Users
                                                            className="text-brand h-[13px] w-[13px]"
                                                            aria-hidden="true"
                                                        />
                                                        {r.guests} {pick(UI.guests, locale)}
                                                    </span>
                                                </div>

                                                <p className="text-brand m-0 flex items-center gap-[4px] pt-[4px] text-[12px] font-medium">
                                                    <Check
                                                        className="text-success h-[14px] w-[14px] shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{pick(UI.dailyBreakfastIncluded, locale)}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-border-muted mt-[8px] flex items-center justify-between border-t p-[16px]">
                                            <div>
                                                <span className="text-[15px] font-bold text-[var(--surface-inverse)]">
                                                    {formatPrice(r.price, locale)}
                                                </span>
                                                <span className="text-text-tertiary text-[10px]">
                                                    /{pick(UI.nights, locale)}
                                                </span>
                                            </div>

                                            <a
                                                href={roomPath(meta.slug, r.id)}
                                                className="bg-surface-strong text-text-inverse hover:bg-[var(--brand-mid)] focus-visible:outline-brand inline-flex min-h-[32px] items-center rounded-[6px] px-[12px] text-[12px] font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                                            >
                                                {pick(UI.viewDetails, locale)}
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Popup chọn ngày & số khách — dùng chung với hero trang chủ. */}
                <BookingCalendarModal
                    isOpen={isCalendarOpen}
                    onClose={() => setCalendarOpen(false)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                    roomType={roomName}
                    locale={locale}
                    onSave={(nextCheckIn, nextCheckOut, nextGuests) => {
                        setCheckIn(nextCheckIn)
                        setCheckOut(nextCheckOut)
                        setGuests(nextGuests)
                    }}
                />
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, meta.slug)} />
        </div>
    )
}
