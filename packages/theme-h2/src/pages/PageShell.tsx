'use client'

import { pick, telHref, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { pageUi } from './strings'

/**
 * Khung dùng chung của các trang con mẫu 07 — header cố định, hero có
 * breadcrumb, chân trang.
 *
 * Cả sáu trang con (`Rooms`, `Room Detail`, `Tours`, `Tour Detail`, `Gallery`,
 * `Contact`) trong prototype lặp lại đúng ba khối này với cùng kích thước, chỉ
 * khác chiều cao hero và nội dung breadcrumb. Gom vào đây thay vì chép sáu lần.
 *
 * Kích thước bám sát prototype: header min-height 66px, topbar 44px, container
 * 1200px, hero 420px (Rooms/Tours) · 400px (Gallery) · 380px (Contact).
 *
 * STYLE: Tailwind v4 đọc token của theme qua cầu nối `@repo/styling-tailwind`.
 * Biến nằm ngoài hợp đồng D1 (`--container`, `--radius-pill`, `--surface-*`…)
 * viết dạng arbitrary trỏ thẳng vào biến — không bao giờ ghi mã hex ở đây
 * (luật D0).
 */

// ==================================================================== header

/**
 * Điều hướng của trang con.
 *
 * Prototype ánh xạ `#rooms` → `Rooms - Nam Du Hill.dc.html`… Ở đây là route
 * thật; mục nào chưa có trang riêng thì quay về trang chủ kèm neo section.
 */
const NAV_ROUTES: Record<string, string> = {
    '#top': '/h7',
    '#rooms': '/h7/rooms',
    '#tours': '/h7/tours',
    '#gallery': '/h7/gallery',
    '#contact': '/h7/contact',
}

function navHref(href: string): string {
    return NAV_ROUTES[href] ?? `/h7${href}`
}

export function PageHeader({
    data,
    locale,
    extra,
}: {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}) {
    const t = pageUi[locale]
    const { brand, nav } = data
    const scrolled = useScrolled()

    return (
        <div className="fixed inset-x-0 top-0 z-[60]">
            {/* Thanh trên: địa chỉ + hotline. Thu lại khi cuộn quá 60px.
                `maxHeight`/`opacity` vẫn ở inline style vì chúng phụ thuộc state
                `scrolled` — đây là giá trị động, không phải token. */}
            <div
                className="overflow-hidden bg-[var(--surface-inverse)] text-text-inverse [transition:max-height_260ms_ease,opacity_200ms_ease]"
                style={{
                    maxHeight: scrolled ? 0 : 44,
                    opacity: scrolled ? 0 : 0.7,
                }}
            >
                <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-3 px-4 py-2 text-[12.5px]">
                    <span>{pick(brand.address, locale)}</span>
                    <a href={telHref(brand.phone)} className="text-inherit no-underline">
                        Hotline / Zalo: {brand.phone}
                    </a>
                </div>
            </div>

            <header
                className={[
                    'border-b border-border-default bg-[rgb(255_255_255/0.96)] backdrop-blur-[14px]',
                    '[transition:box-shadow_240ms_ease]',
                    scrolled ? 'shadow-1' : '',
                ].join(' ')}
            >
                <div className="mx-auto flex min-h-[66px] max-w-[var(--container)] items-center gap-[20px] px-4 py-[10px]">
                    <a href="/h7" className="flex shrink-0 items-center gap-[10px] no-underline">
                        <img
                            src={brand.logo || '/OP5.png'}
                            alt={brand.name}
                            className="h-[36px] w-[36px] rounded-[50%] bg-[var(--surface)] object-contain p-[2px]"
                        />
                        <div className="flex flex-col leading-[1.1]">
                            {/* `--font-serif` không có trong hợp đồng token —
                                giá trị thật luôn rơi về fallback Georgia. Giữ
                                nguyên chuỗi cũ để diện mạo không đổi. */}
                            <span className="text-[14px] font-bold tracking-[-0.01em] text-text-primary [font-family:var(--font-serif,Georgia,serif)]">
                                {brand.name || 'The Nam Du Hill'}
                            </span>
                            <span className="mt-[2px] text-[10.5px] font-medium text-text-secondary">
                                Nam Du, Kiên Giang
                            </span>
                        </div>
                    </a>

                    <nav className="ml-auto flex min-w-0 flex-wrap items-center gap-1 overflow-hidden">
                        {nav
                            .filter((item) => item.href !== '#top' && item.href !== '/')
                            .map((item) => (
                            <a
                                key={item.href}
                                href={navHref(item.href)}
                                className="shrink-0 rounded-[8px] px-[12px] py-2 text-[13.5px] font-medium whitespace-nowrap text-text-secondary no-underline"
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <div className="flex shrink-0 items-center gap-[10px]">
                        {extra && <div className="flex items-center">{extra}</div>}

                        <a
                            href="/h7/rooms"
                            className="shrink-0 rounded-[var(--radius-pill)] bg-accent px-[20px] py-[10px] text-[13.5px] font-semibold whitespace-nowrap text-text-inverse no-underline shadow-1"
                        >
                            {t.bookNow}
                        </a>
                    </div>
                </div>
            </header>
        </div>
    )
}

// ====================================================================== hero

export interface Crumb {
    label: string
    href?: string
}

export function PageHero({
    title,
    sub,
    crumbs,
    height = 420,
    image,
}: {
    title: string
    sub: string
    crumbs: Crumb[]
    height?: number
    image?: string
}) {
    return (
        // `height` là prop số do gọi bên ngoài quyết định → phải giữ inline.
        <section
            className="relative overflow-hidden bg-[var(--surface-inverse)]"
            style={{ height }}
        >
            {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,41,0.66)_0%,rgba(15,23,41,0.34)_50%,rgba(15,23,41,0.8)_100%)]"
            />
            <div className="relative mx-auto flex h-full max-w-[var(--container)] flex-col justify-end px-4 pt-[130px] pb-[48px]">
                <nav className="mb-[14px] flex flex-wrap items-center gap-2 text-[13px] text-[rgb(255_255_255/0.75)]">
                    {crumbs.map((crumb, index) => (
                        <span key={index} className="flex items-center gap-2">
                            {index > 0 && <span aria-hidden="true">/</span>}
                            {crumb.href ? (
                                <a href={crumb.href} className="text-inherit no-underline">
                                    {crumb.label}
                                </a>
                            ) : (
                                <span className="text-text-inverse" aria-current="page">
                                    {crumb.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>

                <h1 className="m-0 mb-[12px] font-display text-[46px] leading-[1.1] font-extrabold tracking-[-0.03em] text-text-inverse">
                    {title}
                </h1>
                <p className="m-0 max-w-[570px] text-[16px] leading-[1.6] text-[rgb(255_255_255/0.85)]">
                    {sub}
                </p>
            </div>
        </section>
    )
}

/**
 * Breadcrumb trên nền sáng — dùng ở trang chi tiết, nơi prototype không có hero
 * ảnh mà mở thẳng bằng dải ảnh.
 */
export function LightCrumbs({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <section className="bg-surface-base px-4 pt-[118px]">
            <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center gap-2 pt-[16px] pb-[18px] text-[13px] text-text-secondary">
                {crumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-2">
                        {index > 0 && <span aria-hidden="true">/</span>}
                        {crumb.href ? (
                            <a href={crumb.href} className="text-inherit no-underline">
                                {crumb.label}
                            </a>
                        ) : (
                            <span className="font-semibold text-text-primary" aria-current="page">
                                {crumb.label}
                            </span>
                        )}
                    </span>
                ))}
            </div>
        </section>
    )
}

// ================================================================= chân trang

export function PageFooter({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = pageUi[locale]
    const { brand, nav } = data

    return (
        <footer className="border-t border-border-default bg-surface-base px-4 pt-[52px] pb-[26px]">
            <div className="mx-auto max-w-[var(--container)]">
                {/* Lưới 4 cột từ 900px — khai bằng `md:` không đủ (breakpoint mặc
                    định 768px), nên giữ media query riêng ở `<style>` cuối file. */}
                <div className="h7-footer-grid grid gap-5 border-b border-border-default pb-[34px]">
                    <div>
                        <div className="mb-[14px] flex items-center gap-[10px]">
                            <span className="text-[15px] font-bold text-text-primary">
                                {brand.name} {brand.suffix}
                            </span>
                        </div>
                        <p className="m-0 mb-[14px] max-w-[320px] text-[13.5px] leading-[1.7] text-text-secondary">
                            {t.footerAbout}
                        </p>
                        <div className="text-[13.5px] leading-[1.7] text-text-secondary">
                            {pick(brand.address, locale)}
                        </div>
                    </div>

                    <div>
                        <div className="mb-[14px] text-[12.5px] font-bold text-text-primary">
                            {t.footerNav}
                        </div>
                        <div className="grid gap-[9px]">
                            {nav.map((item) => (
                                <a
                                    key={item.href}
                                    href={navHref(item.href)}
                                    className="text-[13.5px] text-text-secondary no-underline"
                                >
                                    {pick(item.label, locale)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-[14px] text-[12.5px] font-bold text-text-primary">
                            {t.footerContact}
                        </div>
                        <div className="grid gap-[9px] text-[13.5px] text-text-secondary">
                            <a href={telHref(brand.phone)} className="text-inherit no-underline">
                                {brand.phone}
                            </a>
                            <a href={`mailto:${brand.email}`} className="text-inherit no-underline">
                                {brand.email}
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="mb-[14px] text-[12.5px] font-bold text-text-primary">
                            {t.footerFollow}
                        </div>
                        <div className="grid gap-[9px] text-[13.5px]">
                            {['Facebook', 'Instagram', 'Google Maps'].map((label) => (
                                <a
                                    key={label}
                                    href={brand.site}
                                    className="text-text-secondary no-underline"
                                >
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-[20px] text-[12.5px] text-text-secondary">
                    <span>© 2026 {brand.name} {brand.suffix}</span>
                    <a href="/" className="text-[var(--border-strong)] no-underline">
                        ← Về trang tổng
                    </a>
                </div>
            </div>

            {/* GIỮ `<style>`: breakpoint 900px không có trong thang mặc định của
                Tailwind, và đây là `grid-template-columns` không đều
                (1.4fr + 3×1fr) — arbitrary variant sẽ dài hơn và khó đọc hơn. */}
            <style>{`
                @media (min-width: 900px) {
                    .h7-footer-grid {
                        grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
                    }
                }
            `}</style>
        </footer>
    )
}
