'use client'

import { useState } from 'react'
import {
    Anchor,
    ArrowRight,
    BookOpen,
    Calendar,
    Clock,
    Compass,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Sun,
} from 'lucide-react'
import {
    pick,
    themePath,
    themeRoot,
    UI,
    type BlogPost,
    type ExploreSpot,
    type I18nText,
    type Locale,
    type PropertyData,
    type SatelliteIsland,
    type TripPlan,
} from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Trang Khám phá đảo — BẢN RIÊNG CỦA MẪU 03.
 *
 * TÊN FILE LÀ `ToursPage`, NỘI DUNG LÀ `/explore` CỦA RESORT: `ThemeDefinition`
 * gọi slot này là `Tours` và route là `/[theme]/tours`, nhưng app resort đặt
 * trang cùng vai trò ở `/explore`. Giữ nội dung của resort, đặt tên theo hợp
 * đồng slot — đổi tên slot là đụng `core` và cả N mẫu (luật R5/R7).
 *
 * VÌ SAO KHÔNG DÙNG `ToursPage` CỦA `@repo/domain-hotel`: bản chung bán COMBO
 * (`data.tours` — vé tàu + phòng + tour trọn gói). Trang này bán TRẢI NGHIỆM
 * TỰ ĐI: sáu điểm dừng trên Hòn Lớn, bốn đảo vệ tinh, hai lịch trình mẫu kèm
 * bảng chi phí, và các bài cẩm nang. Khác nhau về nội dung lẫn bố cục, không
 * rút được về một bản chung. Bản domain vẫn nguyên cho mẫu khác.
 *
 * KHÁC BẢN RESORT: hex → token (D0), `isEn ? …` → `pick()` (R6), dữ liệu vào
 * qua prop chứ không import `SPOTS`/`TRIPS`/`BLOG_POSTS` (R13), `<a>` thay
 * `next/link`, và trang tự render header/footer.
 *
 * ⚠️ SỐ TRONG CLASS SPACING KHÔNG PHẢI PIXEL (p-4 = 24px, p-6 = 64px). Mọi
 * khoảng cách chép từ bản resort viết ngoặc vuông theo px gốc.
 */

/** Một mục lọc bài viết. `key` khớp `category` của bài để so sánh. */
export interface ToursCategoryFilter {
    key: string
    label: I18nText
    /** Nhãn tiếng Anh của cùng nhóm, để so khớp bài đã dịch. */
    altKey?: string
}

export interface ToursPageProps {
    data: PropertyData
    locale: Locale
    /**
     * Mẫu đang render. TUỲ CHỌN, mặc định `meta.slug`.
     *
     * VÌ SAO KHÔNG BẮT BUỘC: route dùng chung `[theme]/**` chỉ truyền
     * `data`/`locale` (+ `menu`/`searchParams` tuỳ trang) — nó KHÔNG đưa slug
     * xuống. Khai bắt buộc ở đây thì trang vỡ ngay khi cắm vào registry, mà
     * TypeScript không bắt được vì slot của registry dùng type rộng hơn.
     */
    slug?: string
    /** Sáu điểm dừng trên Hòn Lớn. Rỗng thì khối tự ẩn. */
    spots?: readonly ExploreSpot[]
    /** Bốn đảo vệ tinh. Rỗng thì khối tự ẩn. */
    islands?: readonly SatelliteIsland[]
    /** Lịch trình mẫu theo khoá (`d2`, `d3`…). Rỗng thì khối tự ẩn. */
    trips?: Record<string, TripPlan>
    /** Bài cẩm nang. Rỗng thì khối tự ẩn. */
    posts?: readonly BlogPost[]
    /** Bộ lọc nhóm bài. Không truyền thì chỉ hiện nút "Tất cả". */
    categories?: readonly ToursCategoryFilter[]
    /** Đường dẫn ảnh theo id `spot`/`island`/`post`. Thiếu thì ô giữ nền trống. */
    images?: Record<string, string>
    extra?: React.ReactNode
}

/** Khoá của mục lọc "tất cả" — không phải một nhóm thật. */
const ALL = 'ALL'

export function ToursPage({
    data,
    locale,
    slug = meta.slug,
    spots = [],
    islands = [],
    trips,
    posts = [],
    categories = [],
    images = {},
    extra,
}: ToursPageProps) {
    const tripList = Object.values(trips ?? {})
    const [activeTripKey, setActiveTripKey] = useState<string>(tripList[0]?.key ?? '')
    const [activeCategory, setActiveCategory] = useState<string>(ALL)

    const currentTrip = tripList.find((p) => p.key === activeTripKey) ?? tripList[0]

    const filteredPosts = posts.filter((post) => {
        if (activeCategory === ALL) return true
        return post.category.vi === activeCategory || post.category.en === activeCategory
    })

    const zaloHref = `https://zalo.me/${data.brand.phone.replace(/\s/g, '')}`

    return (
        <div data-theme={meta.slug} className="font-primary overflow-x-clip">
            <SiteHeader
                {...siteHeaderPropsOf(data, locale, slug)}
                currentHref={themePath(slug, 'tours')}
                extra={extra}
                transparentOnTop
            />

            <main className="min-h-screen bg-[var(--surface-alt)] pt-[56px] pb-[80px] text-[var(--text)]">
                {/* ---------------------------------------------------- hero */}
                <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-[var(--surface-inverse)] pt-[80px] sm:min-h-[60vh]">
                    <SlotImage
                        src={images.hero}
                        alt={pick(UI.exploreNamDuComplete23, locale)}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-inverse)] via-[var(--surface-inverse)]/60 to-black/40" />

                    <div className="relative mx-auto w-full max-w-[var(--container)] space-y-[16px] px-[16px] pt-[96px] pb-[64px] sm:px-[24px] lg:px-[32px]">
                        <div className="inline-flex items-center gap-[8px] rounded-full border border-white/20 bg-white/10 px-[12px] py-[4px] text-[12px] font-medium text-[var(--text-inverse)] backdrop-blur-md">
                            <span
                                aria-hidden="true"
                                className="h-[8px] w-[8px] rounded-full bg-[var(--accent)]"
                            />
                            <span>{pick(UI.n21Islands912KmGulf, locale)}</span>
                        </div>

                        <h1 className="max-w-3xl font-display text-[30px] leading-tight font-bold tracking-tight text-[var(--text-inverse)] sm:text-[36px] lg:text-[48px]">
                            {pick(UI.exploreNamDuComplete23, locale)}
                        </h1>

                        <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--text-inverse)]/80 sm:text-[16px]">
                            {pick(UI.curatedExperiencesTriedAndLovedBy, locale)}
                        </p>

                        <nav
                            aria-label="Breadcrumb"
                            className="flex flex-wrap items-center gap-[8px] pt-[8px] text-[12px] text-[var(--text-inverse)]/70"
                        >
                            <a href={themeRoot(slug)} className="no-underline hover:underline">
                                {pick(UI.home, locale)}
                            </a>
                            <span aria-hidden="true">/</span>
                            <span
                                aria-current="page"
                                className="font-semibold text-[var(--text-inverse)]"
                            >
                                {pick(UI.exploreNamDu, locale)}
                            </span>
                        </nav>
                    </div>
                </section>

                {/* ------------------------------- dải bốn số liệu, nổi lên hero */}
                <section className="relative z-20 mx-auto -mt-[32px] max-w-[var(--container)] px-[16px] sm:px-[24px] lg:px-[32px]">
                    <div className="grid grid-cols-1 gap-[24px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[20px] text-[12px] shadow-2 sm:grid-cols-2 sm:p-[24px] lg:grid-cols-4">
                        <QuickStat
                            kicker={pick(UI.bestSeason, locale)}
                            value={pick(UI.decemberMarch, locale)}
                            note={pick(UI.calmTurquoiseSeaMildWeather, locale)}
                        />
                        <QuickStat
                            kicker={pick(UI.highestPeak, locale)}
                            value={`309 m ${pick(UI.lighthouse, locale)}`}
                            note={pick(UI.panoramicViewpointOnHonLon, locale)}
                            divider="sm"
                        />
                        <QuickStat
                            kicker={pick(UI.gettingHere, locale)}
                            value={pick(UI.rachGia25hSpeedboat, locale)}
                            note={pick(UI.freePierPickupAtCuTron, locale)}
                            divider="lg"
                        />
                        <QuickStat
                            kicker={pick(UI.mustBring, locale)}
                            value={pick(UI.idCardCash, locale)}
                            note={pick(UI.borderCheckLimitedAtms, locale)}
                            divider="lg"
                        />
                    </div>
                </section>

                {/* --------------------------------- tiện nghi & dịch vụ (lead) */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                    <div className="space-y-[20px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[24px] shadow-1 sm:p-[32px]">
                        <div className="space-y-[8px] border-b border-[var(--border-muted)] pb-[16px]">
                            <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[var(--brand)]">
                                <Sparkles className="h-[16px] w-[16px] text-[var(--brand)]" />
                                <span>{pick(H3.amenitiesKicker, locale)}</span>
                            </div>
                            <h2 className="font-display text-[24px] font-bold text-[var(--brand-dark)] sm:text-[30px]">
                                {pick(H3.amenitiesTitle, locale)}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 items-stretch gap-[24px] lg:grid-cols-12 lg:gap-[32px]">
                            <div className="relative min-h-[240px] overflow-hidden rounded-[10px] bg-[var(--surface-hover)] lg:col-span-5 lg:min-h-[300px]">
                                <SlotImage
                                    src={images.amenityNature}
                                    alt={pick(H3.amenityNatureBadge, locale)}
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-inverse)]/70 via-transparent to-transparent" />
                                <div className="absolute right-[16px] bottom-[16px] left-[16px]">
                                    <span className="inline-flex items-center gap-[6px] rounded-full bg-[var(--surface)]/95 px-[10px] py-[4px] text-[11px] font-bold text-[var(--brand-dark)] shadow-1 backdrop-blur-md">
                                        <Sparkles className="h-[12px] w-[12px] text-[var(--accent)]" />
                                        <span>{pick(H3.amenityNatureBadge, locale)}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center space-y-[16px] lg:col-span-7">
                                <p className="font-display text-[16px] leading-relaxed text-[var(--brand-dark)] sm:text-[18px]">
                                    {pick(H3.amenitiesLead, locale)}
                                </p>
                                <p className="text-[14px] leading-relaxed text-[var(--text-muted)]">
                                    {pick(H3.amenitiesLead2, locale)}
                                </p>

                                <ul className="grid grid-cols-2 gap-[8px] pt-[4px] sm:grid-cols-4">
                                    {AMENITY_HIGHLIGHTS.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <li
                                                key={item.key}
                                                className="flex items-start gap-[6px] rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-alt)] px-[10px] py-[8px] text-[11px] leading-snug font-semibold text-[var(--brand-dark)]"
                                            >
                                                <Icon className="mt-px h-[14px] w-[14px] shrink-0 text-[var(--brand)]" />
                                                <span>{pick(H3[item.key], locale)}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                            <AmenityBlock
                                image={images.amenityCafe}
                                title={pick(H3.amenityCafeTitle, locale)}
                                text={pick(H3.amenityCafeText, locale)}
                            />
                            <AmenityBlock
                                image={images.amenityQuiet}
                                title={pick(H3.amenityQuietTitle, locale)}
                                text={pick(H3.amenityQuietText, locale)}
                            />
                        </div>
                    </div>
                </section>

                {/* ------------------------- sáu điểm dừng chân trên Hòn Lớn */}
                {spots.length > 0 && (
                    <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                        <div className="mb-[32px] flex flex-col justify-between gap-[16px] sm:flex-row sm:items-end">
                            <div className="space-y-[8px]">
                                <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[var(--brand)]">
                                    <Compass className="h-[16px] w-[16px] text-[var(--brand)]" />
                                    <span>{pick(UI.honLonMainIsland, locale)}</span>
                                </div>
                                <h2 className="font-display text-[24px] font-bold text-[var(--brand-dark)] sm:text-[30px]">
                                    {pick(UI.n11kmCoastalLoopHighlights, locale)}
                                </h2>
                            </div>
                            <p className="max-w-md text-[12px] text-[var(--text-soft)]">
                                {pick(UI.scooterRental120000150000, locale)}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                            {spots.map((spot) => (
                                <a
                                    key={spot.id}
                                    href={themePath(slug, 'blog')}
                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] no-underline shadow-1 transition-all duration-300 hover:shadow-2"
                                >
                                    <div className="relative h-[192px] overflow-hidden bg-[var(--surface-hover)]">
                                        <SlotImage
                                            src={images[spot.id]}
                                            alt={pick(spot.name, locale)}
                                        />
                                        <span className="absolute top-[12px] left-[12px] rounded-full border border-[var(--border-muted)] bg-[var(--surface)]/95 px-[10px] py-[4px] text-[11px] font-bold text-[var(--brand-dark)] shadow-1 backdrop-blur-md">
                                            {pick(spot.dist, locale)}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between space-y-[12px] p-[20px]">
                                        <div className="space-y-[6px]">
                                            <h3 className="font-display text-[16px] font-bold text-[var(--brand-dark)] transition group-hover:text-[var(--brand)]">
                                                {pick(spot.name, locale)}
                                            </h3>
                                            <p className="text-[12px] leading-relaxed text-[var(--text-muted)]">
                                                {pick(spot.text, locale)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[var(--border-muted)] pt-[8px] text-[11px] font-semibold text-[var(--brand)]">
                                            <span>{pick(spot.tip, locale)}</span>
                                            <span className="flex items-center gap-[4px] text-[12px] font-bold text-[var(--brand)] transition-transform group-hover:translate-x-1">
                                                <span>{pick(H3.readArticle, locale)}</span>
                                                <ArrowRight className="h-[14px] w-[14px]" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* ---------------------------------- cẩm nang & góc trải nghiệm */}
                {posts.length > 0 && (
                    <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                        <div className="space-y-[24px]">
                            <div className="flex flex-col justify-between gap-[16px] border-b border-[var(--border-muted)] pb-[16px] sm:flex-row sm:items-end">
                                <div className="space-y-[4px]">
                                    <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[var(--brand)]">
                                        <BookOpen className="h-[16px] w-[16px] text-[var(--brand)]" />
                                        <span>{pick(H3.guideKicker, locale)}</span>
                                    </div>
                                    <h2 className="font-display text-[24px] font-bold text-[var(--brand-dark)] sm:text-[30px]">
                                        {pick(UI.travelGuideIslandStories, locale)}
                                    </h2>
                                </div>

                                {/* Bộ lọc nhóm bài — cuộn ngang trên mobile để
                                    không xuống hai hàng và đẩy lưới bài xuống. */}
                                <div className="flex items-center gap-[8px] overflow-x-auto pb-[4px]">
                                    <CategoryButton
                                        label={pick(H3.allArticles, locale)}
                                        on={activeCategory === ALL}
                                        onClick={() => setActiveCategory(ALL)}
                                    />
                                    {categories.map((cat) => (
                                        <CategoryButton
                                            key={cat.key}
                                            label={pick(cat.label, locale)}
                                            on={
                                                activeCategory === cat.key ||
                                                activeCategory === cat.altKey
                                            }
                                            onClick={() => setActiveCategory(cat.key)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                                {filteredPosts.map((post) => {
                                    const href = `${themePath(slug, 'blog')}/${post.id}`
                                    return (
                                        <article
                                            key={post.id}
                                            className="group flex flex-col overflow-hidden rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] shadow-1 transition hover:shadow-2"
                                        >
                                            <div className="relative h-[192px] overflow-hidden bg-[var(--surface-hover)]">
                                                <a href={href} className="absolute inset-0 block">
                                                    <SlotImage
                                                        src={images[post.heroSlot] ?? images[post.id]}
                                                        alt={pick(post.title, locale)}
                                                    />
                                                </a>
                                                <span className="absolute top-[12px] left-[12px] rounded-full bg-[var(--surface-inverse)]/90 px-[10px] py-[4px] text-[10px] font-bold tracking-wider text-[var(--text-inverse)] uppercase backdrop-blur-xs">
                                                    {pick(post.category, locale)}
                                                </span>
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between space-y-[12px] p-[20px]">
                                                <div className="space-y-[8px]">
                                                    <h3 className="line-clamp-2 font-display text-[16px] leading-snug font-bold text-[var(--brand-dark)] transition group-hover:text-[var(--brand)]">
                                                        <a href={href} className="no-underline">
                                                            {pick(post.title, locale)}
                                                        </a>
                                                    </h3>
                                                    <p className="line-clamp-3 text-[12px] leading-relaxed text-[var(--text-muted)]">
                                                        {pick(post.lede, locale)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-[var(--border-muted)] pt-[12px] text-[11px] text-[var(--text-soft)]">
                                                    <div className="flex items-center gap-[6px]">
                                                        <span>{pick(post.date, locale)}</span>
                                                        <span
                                                            aria-hidden="true"
                                                            className="text-[var(--text-faint)]"
                                                        >
                                                            •
                                                        </span>
                                                        <Clock className="h-[12px] w-[12px] text-[var(--brand)]" />
                                                        <span>
                                                            {post.readMin} {pick(UI.minRead, locale)}
                                                        </span>
                                                    </div>
                                                    <a
                                                        href={href}
                                                        className="flex items-center gap-[4px] font-bold text-[var(--brand)] no-underline hover:underline"
                                                    >
                                                        <span>{pick(H3.articleDetail, locale)}</span>
                                                        <ArrowRight className="h-[14px] w-[14px]" />
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* ------------------------------------------ bốn đảo vệ tinh */}
                {islands.length > 0 && (
                    <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                        <div className="mb-[32px] flex flex-col justify-between gap-[16px] sm:flex-row sm:items-end">
                            <div className="space-y-[8px]">
                                <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[var(--brand)]">
                                    <Anchor className="h-[16px] w-[16px] text-[var(--brand)]" />
                                    <span>{pick(UI.satelliteIslands, locale)}</span>
                                </div>
                                <h2 className="font-display text-[24px] font-bold text-[var(--brand-dark)] sm:text-[30px]">
                                    {pick(UI.woodenBoatTourCoralSnorkeling, locale)}
                                </h2>
                            </div>
                            <p className="max-w-md text-[12px] text-[var(--text-soft)]">
                                {pick(UI.n200000400000VndPer, locale)}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
                            {islands.map((island) => (
                                <a
                                    key={island.id}
                                    href={themePath(slug, 'blog')}
                                    className="group relative flex min-h-[320px] cursor-pointer items-end overflow-hidden rounded-[12px] bg-[var(--surface-inverse)] p-[20px] no-underline shadow-1"
                                >
                                    <SlotImage
                                        src={images[island.id]}
                                        alt={pick(island.name, locale)}
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-inverse)] via-[var(--surface-inverse)]/40 to-transparent" />

                                    <div className="relative z-10 space-y-[6px] text-[var(--text-inverse)]">
                                        <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--surface-inverse)]/80 px-[8px] py-[2px] text-[10px] font-bold text-[var(--accent)] backdrop-blur-xs">
                                            {pick(island.badge, locale)}
                                        </span>
                                        <h3 className="font-display text-[18px] font-bold text-[var(--text-inverse)] transition group-hover:text-[var(--accent)]">
                                            {pick(island.name, locale)}
                                        </h3>
                                        <p className="text-[12px] leading-relaxed text-[var(--text-inverse)]/80">
                                            {pick(island.text, locale)}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* --------------------------- lịch trình mẫu + bảng chi phí */}
                {currentTrip && (
                    <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                        <div className="space-y-[24px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[24px] shadow-1 sm:p-[32px]">
                            <div className="flex flex-col justify-between gap-[16px] border-b border-[var(--border-muted)] pb-[16px] sm:flex-row sm:items-center">
                                <div className="space-y-[4px]">
                                    <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[var(--brand)]">
                                        <Calendar className="h-[16px] w-[16px] text-[var(--brand)]" />
                                        <span>{pick(UI.suggestedItineraries, locale)}</span>
                                    </div>
                                    <h2 className="font-display text-[20px] font-bold text-[var(--brand-dark)] sm:text-[24px]">
                                        {pick(UI.detailed2d1n3d2nItinerary, locale)}
                                    </h2>
                                </div>

                                <div
                                    role="tablist"
                                    aria-label={pick(UI.suggestedItineraries, locale)}
                                    className="inline-flex rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-alt)] p-[4px]"
                                >
                                    {tripList.map((plan) => {
                                        const on = plan.key === currentTrip.key
                                        return (
                                            <button
                                                key={plan.key}
                                                type="button"
                                                role="tab"
                                                aria-selected={on}
                                                onClick={() => setActiveTripKey(plan.key)}
                                                className={[
                                                    'cursor-pointer rounded-[6px] border-none px-[16px] py-[8px] font-primary text-[12px] font-bold transition',
                                                    on
                                                        ? 'bg-[var(--brand)] text-[var(--text-inverse)] shadow-1'
                                                        : 'bg-transparent text-[var(--text-soft)] hover:text-[var(--text)]',
                                                ].join(' ')}
                                            >
                                                {pick(plan.name, locale)}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 items-start gap-[32px] lg:grid-cols-12">
                                {/* dòng thời gian — 7 cột */}
                                <div className="space-y-[16px] lg:col-span-7">
                                    {currentTrip.legs.map((leg, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-[16px] rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-alt)] p-[14px] text-[12px]"
                                        >
                                            <div className="w-[96px] shrink-0 space-y-[2px] border-r border-[var(--border-muted)] pr-[12px]">
                                                <span className="block text-[10px] font-bold text-[var(--brand)]">
                                                    {pick(leg.day, locale)}
                                                </span>
                                                <span className="block font-bold text-[var(--brand-dark)] tabular-nums">
                                                    {leg.time}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-[4px]">
                                                <h4 className="text-[12px] font-bold text-[var(--brand-dark)]">
                                                    {pick(leg.title, locale)}
                                                </h4>
                                                <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                                                    {pick(leg.text, locale)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* bảng chi phí + thẻ Zalo — 5 cột */}
                                <div className="space-y-[16px] lg:col-span-5">
                                    <div className="space-y-[12px] rounded-[10px] border border-[var(--border-muted)] bg-[var(--surface)] p-[20px] text-[12px]">
                                        <h3 className="border-b border-[var(--border-muted)] pb-[8px] font-display text-[14px] font-bold text-[var(--brand-dark)]">
                                            {pick(UI.estimatedCostPerGuest, locale)}
                                        </h3>
                                        {currentTrip.costs.map((cost, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between text-[var(--text-muted)]"
                                            >
                                                <span>{pick(cost.label, locale)}</span>
                                                <span className="font-semibold text-[var(--text)] tabular-nums">
                                                    {cost.val}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between border-t border-[var(--border-muted)] pt-[8px] text-[14px] font-bold text-[var(--brand-dark)]">
                                            <span>{pick(UI.totalEstimate, locale)}</span>
                                            <span className="text-[var(--brand)] tabular-nums">
                                                {currentTrip.total}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-[12px] rounded-[10px] bg-[var(--surface-inverse)] p-[20px] text-[var(--text-inverse)]">
                                        <h4 className="font-display text-[16px] font-bold text-[var(--text-inverse)]">
                                            {pick(UI.weArrangeEverything, locale)}
                                        </h4>
                                        <p className="text-[12px] leading-relaxed text-[var(--text-inverse)]/80">
                                            {pick(
                                                UI.bookIslandBoatsSpeedboatTicketsScooters,
                                                locale,
                                            )}
                                        </p>
                                        <div className="flex flex-col gap-[8px] pt-[4px]">
                                            <a
                                                href={zaloHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center rounded-[6px] bg-[var(--accent)] px-[16px] py-[10px] text-[14px] font-bold text-[var(--on-accent)] no-underline transition hover:bg-[var(--accent-dark)]"
                                            >
                                                <MessageCircle className="mr-[6px] h-[16px] w-[16px]" />
                                                {pick(UI.consultOnZalo, locale)}
                                            </a>
                                            <a
                                                href={themePath(slug, 'rooms')}
                                                className="inline-flex w-full items-center justify-center rounded-[6px] border border-white/30 px-[16px] py-[10px] text-[14px] font-bold text-[var(--text-inverse)] no-underline transition hover:bg-white/10"
                                            >
                                                {pick(UI.pickARoomFirst, locale)}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* -------------------------------------------- lời khuyên đi đảo */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                    <div className="space-y-[16px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[24px] shadow-1 sm:p-[32px]">
                        <h2 className="border-b border-[var(--border-muted)] pb-[12px] font-display text-[20px] font-bold text-[var(--brand-dark)] sm:text-[24px]">
                            {pick(UI.essentialTipsBeforeVisitingNamDu, locale)}
                        </h2>

                        <div className="grid grid-cols-1 gap-[24px] text-[12px] md:grid-cols-3">
                            <Advice
                                icon={<ShieldCheck className="h-[16px] w-[16px] text-[var(--brand)]" />}
                                title={pick(UI.bookSpeedboatEarly, locale)}
                                text={pick(UI.duringPeakSeasonDecToMar, locale)}
                            />
                            <Advice
                                icon={<Sun className="h-[16px] w-[16px] text-[var(--brand)]" />}
                                title={pick(UI.checkSeaWeather, locale)}
                                text={pick(UI.speedboatsStopWhenWindExceedsForce, locale)}
                            />
                            <Advice
                                icon={<Anchor className="h-[16px] w-[16px] text-[var(--brand)]" />}
                                title={pick(UI.protectCoralReefs, locale)}
                                text={pick(UI.neverBreakOrStandOnCoral, locale)}
                            />
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />
        </div>
    )
}

// ================================================================= mảnh nhỏ

/** Bốn điểm nhấn dịch vụ. Khoá trỏ vào `H3` nên chuỗi vẫn song ngữ (R6). */
const AMENITY_HIGHLIGHTS = [
    { key: 'amenitySeaviewBar', icon: Sun },
    { key: 'amenityIslandTours', icon: Compass },
    { key: 'amenitySnorkelling', icon: Anchor },
    { key: 'amenityTransfers', icon: ShieldCheck },
] as const satisfies readonly {
    key: keyof typeof H3
    icon: typeof Sun
}[]

function SlotImage({ src, alt }: { src?: string; alt: string }) {
    if (!src) {
        return (
            <div aria-hidden="true" className="absolute inset-0 bg-[var(--surface-hover)]" />
        )
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
        />
    )
}

function QuickStat({
    kicker,
    value,
    note,
    divider,
}: {
    kicker: string
    value: string
    note: string
    divider?: 'sm' | 'lg'
}) {
    const line =
        divider === 'sm'
            ? 'sm:border-l sm:border-[var(--border-muted)] sm:pl-[24px]'
            : divider === 'lg'
              ? 'lg:border-l lg:border-[var(--border-muted)] lg:pl-[24px]'
              : ''
    return (
        <div className={`space-y-[4px] ${line}`}>
            <span className="block text-[10px] font-extrabold tracking-wider text-[var(--accent)] uppercase">
                {kicker}
            </span>
            <div className="font-display text-[16px] font-bold text-[var(--brand-dark)]">
                {value}
            </div>
            <div className="text-[var(--text-soft)]">{note}</div>
        </div>
    )
}

function AmenityBlock({
    image,
    title,
    text,
}: {
    image?: string
    title: string
    text: string
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-[10px] border border-[var(--border-muted)] bg-[var(--surface-alt)]">
            <div className="relative h-[176px] bg-[var(--surface-hover)]">
                <SlotImage src={image} alt={title} />
            </div>
            <div className="space-y-[8px] p-[20px]">
                <h3 className="font-display text-[16px] font-bold text-[var(--brand-dark)]">
                    {title}
                </h3>
                <p className="text-[12px] leading-relaxed text-[var(--text-muted)]">{text}</p>
            </div>
        </div>
    )
}

function CategoryButton({
    label,
    on,
    onClick,
}: {
    label: string
    on: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            className={[
                'cursor-pointer rounded-[6px] px-[14px] py-[6px] font-primary text-[12px] font-bold whitespace-nowrap transition',
                on
                    ? 'border-none bg-[var(--brand)] text-[var(--text-inverse)] shadow-1'
                    : 'border border-[var(--border-muted)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]',
            ].join(' ')}
        >
            {label}
        </button>
    )
}

function Advice({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode
    title: string
    text: string
}) {
    return (
        <div className="space-y-[6px]">
            <h3 className="flex items-center gap-[6px] text-[14px] font-bold text-[var(--brand-dark)]">
                {icon}
                <span>{title}</span>
            </h3>
            <p className="leading-relaxed text-[var(--text-muted)]">{text}</p>
        </div>
    )
}
