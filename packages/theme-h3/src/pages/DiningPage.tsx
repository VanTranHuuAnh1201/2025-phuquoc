'use client'

import { useState } from 'react'
import { Coffee, Flame, MessageCircle, Utensils } from 'lucide-react'
import {
    pick,
    themePath,
    themeRoot,
    UI,
    type Locale,
    type MenuCategory,
    type PropertyData,
} from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Trang Ẩm thực — BẢN RIÊNG CỦA MẪU 03.
 *
 * VÌ SAO KHÔNG DÙNG `DiningPage` CỦA `@repo/domain-hotel`: bản dùng chung ở
 * tầng domain là bố cục tối giản — lưới điểm ăn uống rồi một thực đơn hai cột
 * kẻ chấm. Mẫu 03 kế thừa trang `/dining` của app resort: hero ảnh chiếm nửa
 * màn hình, ba thẻ điểm ăn uống có badge giờ mở cửa, lưới món đặc sản kiểu
 * bento 2×2 + bốn ô nhỏ, bảng giá BBQ nền navy và dải bốn ô thông tin dịch vụ.
 * Khác biệt nằm ở BỐ CỤC chứ không ở token, nên không rút được về một bản
 * chung — đó đúng là lúc mẫu được phép có bản riêng (luật R4: theme giữ hình
 * thức). Bản domain vẫn nguyên vẹn cho các mẫu khác dùng.
 *
 * KHÁC BẢN RESORT Ở BỐN CHỖ, ĐỀU VÌ RÀNG BUỘC KIẾN TRÚC:
 *   - hex đổi hết sang token của `tokens.css` (luật D0) — giá trị khớp từng
 *     con số nên hình ảnh không đổi;
 *   - `isEn ? … : …` đổi sang `pick()` trên chuỗi song ngữ (luật R6);
 *   - dữ liệu vào qua prop chứ không import thẳng `DINING_MENU` (luật R13);
 *   - header/footer do chính trang render — app resort có `layout.tsx` lo việc
 *     đó, còn trang con của mẫu thì không.
 *
 * ẢNH: app resort dùng `ImageSlot` với bảng ánh xạ nằm trong app. Package
 * không với tới bảng đó, nên đường dẫn ảnh vào qua prop `images` (cùng cách
 * `Gallery`/`Panorama` của mẫu này đang làm). Thiếu ảnh thì ô giữ đúng kích
 * thước với nền `--surface-hover` — bố cục không xê dịch.
 *
 * ⚠️ SỐ TRONG CLASS SPACING KHÔNG PHẢI PIXEL. Thang của dự án phi tuyến
 * (p-4 = 24px, p-6 = 64px). Mọi khoảng cách chép từ bản resort viết ngoặc
 * vuông theo px gốc để giữ đúng từng pixel.
 */

/** Khoá ảnh của trang — trùng id `ImageSlot` bên app resort để app bơm sang dễ. */
export type DiningImageKey =
    | 'hero'
    | 'restaurant'
    | 'bar'
    | 'bbq'
    | 'dishGoiCa'
    | 'dishChao'
    | 'dishLau'
    | 'dishNuong'

export interface DiningPageProps {
    data: PropertyData
    locale: Locale
    /** Slug của mẫu — mọi đường dẫn dựng từ đây, không viết cứng (luật R5). */
    /**
     * Mẫu đang render. TUỲ CHỌN, mặc định `meta.slug`.
     *
     * VÌ SAO KHÔNG BẮT BUỘC: route dùng chung `[theme]/**` chỉ truyền
     * `data`/`locale` (+ `menu`/`searchParams` tuỳ trang) — nó KHÔNG đưa slug
     * xuống. Khai bắt buộc ở đây thì trang vỡ ngay khi cắm vào registry, mà
     * TypeScript không bắt được vì slot của registry dùng type rộng hơn.
     */
    slug?: string
    /** Thực đơn theo nhóm. Thiếu thì khối `#menu` không render. */
    menu?: Record<string, MenuCategory>
    /** Đường dẫn ảnh theo khoá. Thiếu khoá nào thì ô đó giữ nền trống. */
    images?: Partial<Record<DiningImageKey, string>>
    /** Chèn thêm vào header — vd nút chuyển ngôn ngữ riêng của app. */
    extra?: React.ReactNode
}

export function DiningPage({
    data,
    locale,
    slug = meta.slug,
    menu,
    images = {},
    extra,
}: DiningPageProps) {
    const categories = Object.values(menu ?? {})
    const [activeKey, setActiveKey] = useState<string>(categories[0]?.key ?? '')
    const active = categories.find((c) => c.key === activeKey) ?? categories[0]

    const zaloHref = `https://zalo.me/${data.brand.phone.replace(/\s/g, '')}`

    return (
        // `overflow-x-clip` chứ không `hidden`: `hidden` trên một trục biến trục
        // kia thành scroll container và phá mọi `position: sticky` bên trong.
        <div data-theme={meta.slug} className="font-primary overflow-x-clip">
            <SiteHeader
                {...siteHeaderPropsOf(data, locale, slug)}
                currentHref={themePath(slug, 'dining')}
                extra={extra}
                transparentOnTop
            />

            <main className="min-h-screen bg-[var(--surface-alt)] pt-[56px] pb-[80px] text-[var(--text)]">
                {/* ---------------------------------------------------- hero */}
                <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-[var(--surface-inverse)] pt-[80px] sm:min-h-[60vh]">
                    <SlotImage
                        src={images.hero}
                        alt={pick(UI.namDuSeafoodDiningFreshPlain, locale)}
                    />
                    {/* Lớp phủ navy dâng từ đáy — chữ trắng phải đọc được trên
                        mọi ảnh, kể cả ảnh sáng (luật D4/P15). */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-inverse)] via-[var(--surface-inverse)]/60 to-black/40" />

                    <div className="relative mx-auto w-full max-w-[var(--container)] space-y-[16px] px-[16px] pt-[96px] pb-[64px] sm:px-[24px] lg:px-[32px]">
                        <div className="inline-flex items-center gap-[8px] rounded-full border border-white/20 bg-white/10 px-[12px] py-[4px] text-[12px] font-medium text-[var(--text-inverse)] backdrop-blur-md">
                            <Utensils className="h-[14px] w-[14px] text-[var(--accent)]" />
                            <span>{pick(UI.hilltopOceanfrontDining, locale)}</span>
                        </div>

                        <h1 className="max-w-3xl font-display text-[30px] leading-tight font-bold tracking-tight text-[var(--text-inverse)] sm:text-[36px] lg:text-[48px]">
                            {pick(UI.namDuSeafoodDiningFreshPlain, locale)}
                        </h1>

                        <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--text-inverse)]/80 sm:text-[16px]">
                            {pick(UI.seafoodLandedDailyByNamDu, locale)}
                        </p>

                        {/* Breadcrumb — bản resort không có vì layout.tsx lo;
                            trang con của mẫu phải tự nói mình đang ở đâu. */}
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
                                {pick(UI.diningBbq, locale)}
                            </span>
                        </nav>
                    </div>
                </section>

                {/* -------------------------------------- ba thẻ điểm ăn uống */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                    <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3">
                        <VenueCard
                            image={images.restaurant}
                            badge={pick(UI.allDay06302130, locale)}
                            badgeTone="light"
                            title="Hilltop Restaurant"
                            desc={pick(UI.diningRoomWithPanoramicSeaViews, locale)}
                            href={zaloHref}
                            external
                            actionTone="outline"
                            actionIcon={<MessageCircle className="mr-[4px] h-[14px] w-[14px]" />}
                            actionLabel={pick(UI.reserveTableOnZalo, locale)}
                        />

                        <VenueCard
                            image={images.bar}
                            badge={pick(UI.n0600Late, locale)}
                            badgeTone="light"
                            title="Sunset Café & Bar"
                            desc={pick(UI.locatedOnTheTopDeckServing, locale)}
                            href="#menu"
                            actionTone="outline"
                            actionIcon={
                                <Coffee className="mr-[4px] h-[14px] w-[14px] text-[var(--brand)]" />
                            }
                            actionLabel={pick(UI.viewDrinksMenu, locale)}
                        />

                        <VenueCard
                            image={images.bbq}
                            badge={pick(H3.bbqPerTable, locale)}
                            badgeTone="accent"
                            title="Outdoor BBQ & Karaoke"
                            desc={pick(UI.grillFreshCatchUnderTheStars, locale)}
                            href="#bbq"
                            actionTone="solid"
                            actionIcon={<Flame className="mr-[4px] h-[14px] w-[14px]" />}
                            actionLabel={pick(UI.bbqPricing, locale)}
                        />
                    </div>
                </section>

                {/* ----------------------------------- lưới món đặc sản (bento) */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                    <div className="mb-[32px] space-y-[8px]">
                        <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[var(--brand)]">
                            <Utensils className="h-[16px] w-[16px] text-[var(--brand)]" />
                            <span>{pick(UI.freshDailyCatch, locale)}</span>
                        </div>
                        <h2 className="font-display text-[24px] font-bold text-[var(--brand-dark)] sm:text-[30px]">
                            {pick(UI.signatureIslandSpecialties, locale)}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-[16px] md:grid-cols-4">
                        {/* Món chủ lực chiếm ô 2×2 — điểm nhìn chính của viewport
                            này (luật P4: một viewport một điểm nhìn). */}
                        <div className="group relative flex min-h-[300px] items-end overflow-hidden rounded-[12px] bg-[var(--surface-inverse)] p-[24px] shadow-1 md:col-span-2 md:row-span-2 md:min-h-[420px]">
                            <SlotImage src={images.dishGoiCa} alt="Gỏi Cá Trích Nam Du" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-inverse)] via-[var(--surface-inverse)]/40 to-transparent" />
                            <div className="relative z-10 space-y-[6px] text-[var(--text-inverse)]">
                                <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--surface-inverse)]/80 px-[10px] py-[2px] text-[10px] font-bold text-[var(--accent)] backdrop-blur-xs">
                                    {pick(UI.topSpecialty, locale)}
                                </span>
                                <h3 className="font-display text-[20px] font-bold text-[var(--text-inverse)] transition group-hover:text-[var(--accent)]">
                                    Gỏi Cá Trích Nam Du
                                </h3>
                                <p className="max-w-md text-[12px] leading-relaxed text-[var(--text-inverse)]/80">
                                    {pick(UI.freshHerringRolledInRicePaper, locale)}
                                </p>
                            </div>
                        </div>

                        <DishTile
                            image={images.dishChao}
                            title="Cháo Cá Đập Đập"
                            note={pick(UI.richMekongStylePorridge, locale)}
                        />
                        <DishTile
                            image={images.dishLau}
                            title="Lẩu Hải Sản Chua Cay"
                            note={pick(UI.hotpotFor24Guests, locale)}
                        />
                        <DishTile
                            image={images.dishNuong}
                            title="Hải Sản Nướng Sa Tế"
                            note={pick(UI.crabsLobsterSquidSnails, locale)}
                        />

                        {/* Ô "100%" — số liệu thay cho một tấm ảnh nữa, để mắt có
                            chỗ nghỉ giữa lưới ảnh (luật P5). */}
                        <div className="flex flex-col justify-between space-y-[12px] rounded-[12px] border border-[var(--accent)]/20 bg-[var(--surface-inverse)] p-[20px] text-[var(--text-inverse)]">
                            <span className="font-display text-[30px] font-bold text-[var(--accent)]">
                                100%
                            </span>
                            <div className="space-y-[4px]">
                                <h4 className="text-[14px] font-bold text-[var(--text-inverse)]">
                                    {pick(UI.landedSameDay, locale)}
                                </h4>
                                <p className="text-[11px] leading-relaxed text-[var(--text-inverse)]/70">
                                    {pick(UI.boughtStraightFromLocalFishermenNever, locale)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------- thực đơn (#menu) */}
                {active && (
                    <section
                        id="menu"
                        className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]"
                    >
                        <div className="space-y-[24px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[24px] shadow-1 sm:p-[32px]">
                            <div className="flex flex-col justify-between gap-[16px] border-b border-[var(--border-muted)] pb-[16px] sm:flex-row sm:items-center">
                                <div className="space-y-[4px]">
                                    <div className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[var(--brand)]">
                                        <Coffee className="h-[16px] w-[16px] text-[var(--brand)]" />
                                        <span>Sunset Café & Bar</span>
                                    </div>
                                    <h2 className="font-display text-[20px] font-bold text-[var(--brand-dark)] sm:text-[24px]">
                                        {pick(UI.topDeckDrinksMenu, locale)}
                                    </h2>
                                </div>

                                {/* Tab nhóm món */}
                                <div
                                    role="tablist"
                                    aria-label={pick(UI.topDeckDrinksMenu, locale)}
                                    className="inline-flex rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-alt)] p-[4px]"
                                >
                                    {categories.map((cat) => {
                                        const on = cat.key === active.key
                                        return (
                                            <button
                                                key={cat.key}
                                                type="button"
                                                role="tab"
                                                aria-selected={on}
                                                onClick={() => setActiveKey(cat.key)}
                                                className={[
                                                    'cursor-pointer rounded-[6px] border-none px-[14px] py-[6px] font-primary text-[12px] font-bold transition',
                                                    on
                                                        ? 'bg-[var(--brand)] text-[var(--text-inverse)] shadow-1'
                                                        : 'bg-transparent text-[var(--text-soft)] hover:text-[var(--text)]',
                                                ].join(' ')}
                                            >
                                                {pick(cat.name, locale)}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                                {active.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-alt)] p-[14px] text-[12px] transition hover:border-[var(--brand)]/30"
                                    >
                                        <div className="space-y-[2px]">
                                            {/*
                                              * HAI DÒNG VI + EN LÀ CỐ Ý, KHÔNG PHẢI QUÊN `pick()`.
                                              * Bảng menu quán in cả hai thứ tiếng cạnh nhau để
                                              * khách nước ngoài chỉ tay gọi món — bản resort làm
                                              * đúng vậy. Đây là nội dung song ngữ đồng thời, khác
                                              * với chuỗi giao diện chọn theo `locale`.
                                              */}
                                            <div className="font-bold text-[var(--brand-dark)]">
                                                {item.name.vi}
                                            </div>
                                            <div className="text-[11px] text-[var(--text-soft)] italic">
                                                {item.name.en}
                                            </div>
                                        </div>
                                        <div className="ml-[12px] shrink-0 text-[14px] font-bold text-[var(--brand)] tabular-nums">
                                            {shortPrice(item.price)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* --------------------------------------- bảng giá BBQ (#bbq) */}
                <section
                    id="bbq"
                    className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]"
                >
                    <div className="relative space-y-[24px] overflow-hidden rounded-[12px] bg-[var(--surface-inverse)] p-[24px] text-[var(--text-inverse)] shadow-1 sm:p-[32px]">
                        <div className="grid grid-cols-1 items-center gap-[32px] lg:grid-cols-12">
                            <div className="space-y-[16px] lg:col-span-7">
                                <div className="inline-flex items-center gap-[6px] rounded-full bg-[var(--accent)]/20 px-[12px] py-[4px] text-[12px] font-semibold text-[var(--accent)]">
                                    <Flame className="h-[14px] w-[14px] text-[var(--accent)]" />
                                    <span>{pick(UI.outdoorSeafoodBbqKaraoke, locale)}</span>
                                </div>

                                <h2 className="font-display text-[24px] leading-snug font-bold text-[var(--text-inverse)] sm:text-[30px]">
                                    {pick(UI.buyYourCatchWeLightCoals, locale)}
                                </h2>

                                <p className="text-[12px] leading-relaxed text-[var(--text-inverse)]/80 sm:text-[14px]">
                                    {pick(UI.bringYourPierSeafoodCatchTo, locale)}
                                </p>

                                <div className="pt-[8px]">
                                    <a
                                        href={zaloHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center rounded-[6px] bg-[var(--accent)] px-[20px] py-[10px] text-[14px] font-bold text-[var(--on-accent)] no-underline transition hover:bg-[var(--accent-dark)]"
                                    >
                                        <MessageCircle className="mr-[6px] h-[16px] w-[16px]" />
                                        {pick(UI.reserveBbqTableOnZalo, locale)}
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-[12px] lg:col-span-5">
                                <PriceBox
                                    kicker={pick(UI.bbqTableSetup610Guests, locale)}
                                    amount="300.000đ"
                                    unit={pick(UI.table, locale)}
                                    note={pick(UI.includesCharcoalGrillPlatesTongsSpecial, locale)}
                                />
                                <PriceBox
                                    kicker={pick(UI.outsideBeerCorkage, locale)}
                                    amount="150.000đ"
                                    unit={pick(UI.crate, locale)}
                                    note={pick(UI.includesIceBucketIceSetup, locale)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ---------------------------------- bốn ô thông tin dịch vụ */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] pt-[64px] sm:px-[24px] lg:px-[32px]">
                    <div className="grid grid-cols-1 gap-[24px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[24px] text-[12px] shadow-1 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoBox
                            title={pick(UI.terraceBreakfast, locale)}
                            text={pick(UI.asianComboALaCarteServed, locale)}
                        />
                        <InfoBox
                            title={pick(UI.sunriseCoffee, locale)}
                            text={pick(UI.freeSunriseFilterCoffeeTeaFor, locale)}
                            divider="sm"
                        />
                        <InfoBox
                            title={pick(UI.groupCatering, locale)}
                            text={pick(UI.seafoodSetMenusFor10Guests, locale)}
                            divider="lg"
                        />

                        <div className="space-y-[4px] lg:border-l lg:border-[var(--border-muted)] lg:pl-[24px]">
                            <span className="block text-[14px] font-bold text-[var(--brand-dark)]">
                                {pick(UI.diningHotline, locale)}
                            </span>
                            <a
                                href={`tel:${data.brand.phone.replace(/\s/g, '')}`}
                                className="block font-display text-[18px] font-bold text-[var(--brand)] hover:underline"
                            >
                                {data.brand.phone}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />
        </div>
    )
}

// ================================================================= mảnh nhỏ

/**
 * Ô ảnh phủ kín khung cha.
 *
 * Không có ảnh thì trả về một khối nền `--surface-hover` chứ không trả `null`
 * — giữ đúng chiều cao để bố cục không co lại khi app chưa bơm ảnh.
 */
function SlotImage({ src, alt }: { src?: string; alt: string }) {
    if (!src) {
        return (
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[var(--surface-hover)]"
            />
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

function VenueCard({
    image,
    badge,
    badgeTone,
    title,
    desc,
    href,
    external,
    actionTone,
    actionIcon,
    actionLabel,
}: {
    image?: string
    badge: string
    badgeTone: 'light' | 'accent'
    title: string
    desc: string
    href: string
    external?: boolean
    actionTone: 'outline' | 'solid'
    actionIcon: React.ReactNode
    actionLabel: string
}) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] shadow-1 transition hover:shadow-2">
            <div className="relative h-[192px] overflow-hidden bg-[var(--surface-hover)]">
                <SlotImage src={image} alt={title} />
                <span
                    className={[
                        'absolute top-[12px] left-[12px] rounded-full px-[10px] py-[4px] text-[10px] font-bold tracking-wider uppercase',
                        badgeTone === 'accent'
                            ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-1'
                            : 'border border-[var(--border-muted)] bg-[var(--surface)]/95 text-[var(--brand-dark)] backdrop-blur-md',
                    ].join(' ')}
                >
                    {badge}
                </span>
            </div>

            <div className="flex flex-1 flex-col justify-between space-y-[12px] p-[20px]">
                <div className="space-y-[8px]">
                    <h3 className="font-display text-[18px] font-bold text-[var(--brand-dark)] transition group-hover:text-[var(--brand)]">
                        {title}
                    </h3>
                    <p className="text-[12px] leading-relaxed text-[var(--text-muted)]">{desc}</p>
                </div>

                <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={[
                        'inline-flex w-full items-center justify-center rounded-[6px] px-[16px] py-[8px] text-[12px] font-bold no-underline transition',
                        actionTone === 'solid'
                            ? 'bg-[var(--brand)] text-[var(--text-inverse)] hover:bg-[var(--brand-light)]'
                            : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--brand)]',
                    ].join(' ')}
                >
                    {actionIcon}
                    {actionLabel}
                </a>
            </div>
        </article>
    )
}

function DishTile({ image, title, note }: { image?: string; title: string; note: string }) {
    return (
        <div className="group relative flex min-h-[200px] items-end overflow-hidden rounded-[12px] bg-[var(--surface-inverse)] p-[16px] shadow-1">
            <SlotImage src={image} alt={title} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-inverse)] via-transparent to-transparent" />
            <div className="relative z-10 space-y-[2px] text-[var(--text-inverse)]">
                <h4 className="text-[14px] font-bold text-[var(--text-inverse)] transition group-hover:text-[var(--accent)]">
                    {title}
                </h4>
                <p className="text-[11px] text-[var(--text-inverse)]/80">{note}</p>
            </div>
        </div>
    )
}

function PriceBox({
    kicker,
    amount,
    unit,
    note,
}: {
    kicker: string
    amount: string
    unit: string
    note: string
}) {
    return (
        <div className="space-y-[4px] rounded-[10px] border border-white/15 bg-white/10 p-[16px] text-[12px] backdrop-blur-md">
            <span className="block text-[10px] font-bold tracking-wider text-[var(--accent)] uppercase">
                {kicker}
            </span>
            <div className="font-display text-[20px] font-bold text-[var(--text-inverse)]">
                {amount}{' '}
                <span className="text-[12px] font-normal text-[var(--text-inverse)]/70">
                    / {unit}
                </span>
            </div>
            <p className="text-[11px] text-[var(--text-inverse)]/70">{note}</p>
        </div>
    )
}

function InfoBox({
    title,
    text,
    divider,
}: {
    title: string
    text: string
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
            <span className="block text-[14px] font-bold text-[var(--brand-dark)]">{title}</span>
            <p className="text-[var(--text-soft)]">{text}</p>
        </div>
    )
}

/**
 * 35000 → "35K".
 *
 * VÌ SAO KHÔNG DÙNG `formatPrice()`: bảng menu của quán in dạng rút gọn, và cả
 * hai ngôn ngữ đọc chung một con số. Đây là ĐỊNH DẠNG HIỂN THỊ của mẫu, không
 * phải quy tắc nghiệp vụ — giá gốc vẫn là số VND trong `core` (luật R8).
 */
function shortPrice(vnd: number): string {
    return `${Math.round(vnd / 1000)}K`
}
