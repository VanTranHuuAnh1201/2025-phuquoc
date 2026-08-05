'use client'

import type { CSSProperties } from 'react'
import { telHref } from '@repo/utils'
import { useScrolled } from '@repo/ui'

/**
 * Khung trang dùng chung: header cố định, hero có breadcrumb, chân trang.
 *
 * VÌ SAO Ở `ui-layout` CHỨ KHÔNG Ở `ui`: đây là bố cục trang, không phải
 * primitive. Mọi website đều có header/footer/breadcrumb — kể cả một SaaS
 * dashboard hay trang thương mại điện tử, không riêng gì lưu trú.
 *
 * VÌ SAO KHÔNG NHẬN `PropertyData`: bản trước nhận trọn `data: PropertyData`
 * nhưng thực chất chỉ đọc `brand` và `nav`. Ràng buộc đó là giả, và nó khoá
 * cả khung trang vào domain khách sạn — domain thứ hai muốn dùng lại phải chép
 * code (luật R15). Nay nhận đúng những gì cần, dưới dạng nguyên thuỷ.
 *
 * VÌ SAO NHẬN HÀM DỰNG URL: `themeHref`/`themePath` biết tới `rooms`, `tours`,
 * `dining` — từ vựng của một ngành. Tầng nền không được biết chúng, nên nơi
 * gọi truyền vào cách dựng đường dẫn của mình.
 *
 * Mọi giá trị hình ảnh đọc từ `var(--…)`; không hex nào trong file này, nên đọc
 * nó KHÔNG đoán được đang là mẫu nào (luật R3/D0).
 *
 * Kích thước bám sát prototype: topbar 44px, header min-height 66px, container
 * `var(--container)`, hero 420px (Tours) · 400px (Gallery) · 380px (Contact).
 */

/** Một mục điều hướng — nhãn đã chọn ngôn ngữ, đường dẫn đã dựng xong. */
export interface NavItem {
    label: string
    href: string
}

/** Nhận diện thương hiệu ở dạng nguyên thuỷ — không mang type của domain nào. */
export interface BrandInfo {
    name: string
    suffix?: string
    /** Dòng phụ cạnh tên, vd tên địa danh. Không có thì bỏ trống. */
    locality?: string
    address: string
    phone: string
    email: string
    site: string
}

/** Nhãn cố định của khung trang, do nơi gọi cấp (đã chọn ngôn ngữ). */
export interface ShellStrings {
    hotlineTitle: string
    bookNow: string
    footerAbout: string
    footerNav: string
    footerContact: string
    footerFollow: string
    backToHub: string
}

export interface ShellProps {
    brand: BrandInfo
    nav: NavItem[]
    strings: ShellStrings
    /** Đường dẫn trang chủ của mẫu đang render. */
    homeHref: string
    /** Đường dẫn của nút hành động chính trên header. */
    ctaHref: string
}

// ==================================================================== header

export function PageHeader({ brand, nav, strings, homeHref, ctaHref }: ShellProps) {
    const scrolled = useScrolled()

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}>
            {/* Thanh trên: địa chỉ + hotline. Thu lại khi cuộn quá 60px. */}
            <div
                style={{
                    background: 'var(--surface-inverse)',
                    color: 'var(--text-inverse)',
                    overflow: 'hidden',
                    maxHeight: scrolled ? 0 : 44,
                    opacity: scrolled ? 0 : 0.7,
                    transition: 'max-height 260ms ease, opacity 200ms ease',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: 'var(--space-2) var(--space-6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap',
                        fontSize: 'var(--text-xs)',
                    }}
                >
                    <span>{brand.address}</span>
                    <a href={telHref(brand.phone)} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {strings.hotlineTitle}: {brand.phone}
                    </a>
                </div>
            </div>

            <header
                style={{
                    background: 'var(--surface)',
                    backdropFilter: 'blur(14px)',
                    borderBottom: '1px solid var(--border)',
                    boxShadow: scrolled ? 'var(--shadow-sm)' : undefined,
                    transition: 'box-shadow 240ms ease',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: '10px var(--space-6)',
                        minHeight: 66,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-5)',
                    }}
                >
                    <a
                        href={homeHref}
                        style={{
                            flexShrink: 0,
                            display: 'grid',
                            gap: 1,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 800,
                                letterSpacing: '0.02em',
                                color: 'var(--text)',
                            }}
                        >
                            {brand.name.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {[brand.suffix, brand.locality].filter(Boolean).join(' · ')}
                        </span>
                    </a>

                    <nav
                        style={{
                            display: 'flex',
                            gap: 4,
                            marginLeft: 'auto',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            minWidth: 0,
                            overflow: 'hidden',
                        }}
                    >
                        {nav.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <a
                        href={ctaHref}
                        style={{
                            padding: '10px var(--space-5)',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            background: 'var(--accent)',
                            color: 'var(--text-inverse)',
                            boxShadow: 'var(--shadow-sm)',
                            textDecoration: 'none',
                        }}
                    >
                        {strings.bookNow}
                    </a>
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
        <section
            style={{
                position: 'relative',
                height,
                background: 'var(--surface-inverse)',
                overflow: 'hidden',
            }}
        >
            {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={image}
                    alt=""
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            )}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--overlay-scrim)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'relative',
                    height: '100%',
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    padding: '130px var(--space-6) var(--space-12)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}
            >
                <Breadcrumbs crumbs={crumbs} tone="inverse" />

                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-3xl)',
                        lineHeight: 1.1,
                        fontWeight: 800,
                        color: 'var(--text-inverse)',
                        margin: '0 0 var(--space-3)',
                        letterSpacing: '-0.03em',
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        fontSize: 'var(--text-base)',
                        lineHeight: 1.6,
                        color: 'var(--text-inverse)',
                        opacity: 0.85,
                        margin: 0,
                        maxWidth: 570,
                    }}
                >
                    {sub}
                </p>
            </div>
        </section>
    )
}

/**
 * Breadcrumb dùng ở cả nền tối (trong hero) lẫn nền sáng (trang chi tiết).
 *
 * Phần tử cuối không phải link và mang `aria-current="page"` — screen reader
 * cần biết đâu là trang hiện tại (luật D4).
 */
export function Breadcrumbs({
    crumbs,
    tone = 'default',
}: {
    crumbs: Crumb[]
    tone?: 'default' | 'inverse'
}) {
    const inverse = tone === 'inverse'

    return (
        <nav
            aria-label="Breadcrumb"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                color: inverse ? 'var(--text-inverse)' : 'var(--text-muted)',
                opacity: inverse ? 0.78 : 1,
                marginBottom: inverse ? 'var(--space-4)' : 0,
                flexWrap: 'wrap',
            }}
        >
            {crumbs.map((crumb, index) => (
                <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {index > 0 && <span aria-hidden="true">/</span>}
                    {crumb.href ? (
                        <a href={crumb.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {crumb.label}
                        </a>
                    ) : (
                        <span
                            aria-current="page"
                            style={{
                                color: inverse ? 'var(--text-inverse)' : 'var(--text)',
                                fontWeight: inverse ? 400 : 600,
                                opacity: 1,
                            }}
                        >
                            {crumb.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    )
}

/** Breadcrumb trên nền sáng, có khoảng đệm cho header cố định. */
export function LightCrumbs({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <section style={{ background: 'var(--surface-alt)', padding: '118px var(--space-6) 0' }}>
            <div
                style={{
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    padding: 'var(--space-4) 0 var(--space-5)',
                }}
            >
                <Breadcrumbs crumbs={crumbs} />
            </div>
        </section>
    )
}

// ================================================================= chân trang

/** Một liên kết mạng xã hội ở chân trang. */
export interface SocialLink {
    label: string
    href: string
}

export function PageFooter({
    brand,
    nav,
    strings,
    social,
}: Omit<ShellProps, 'homeHref' | 'ctaHref'> & { social?: SocialLink[] }) {
    const socialLinks: SocialLink[] =
        social ??
        ['Facebook', 'Instagram', 'Google Maps'].map((label) => ({ label, href: brand.site }))

    return (
        <footer
            style={{
                background: 'var(--surface-alt)',
                borderTop: '1px solid var(--border)',
                padding: 'var(--space-16) var(--space-6) var(--space-6)',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div
                    className="ui-footer-grid"
                    style={{
                        display: 'grid',
                        gap: 'var(--space-8)',
                        paddingBottom: 'var(--space-8)',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: 700,
                                color: 'var(--text)',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            {brand.name} {brand.suffix}
                        </div>
                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                lineHeight: 1.7,
                                color: 'var(--text-muted)',
                                margin: '0 0 var(--space-3)',
                                maxWidth: 320,
                            }}
                        >
                            {strings.footerAbout}
                        </p>
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                lineHeight: 1.7,
                            }}
                        >
                            {brand.address}
                        </div>
                    </div>

                    <div>
                        <div style={FOOTER_HEADING}>{strings.footerNav}</div>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                            {nav.map((item) => (
                                <a key={item.href} href={item.href} style={FOOTER_LINK}>
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={FOOTER_HEADING}>{strings.footerContact}</div>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                            <a href={telHref(brand.phone)} style={FOOTER_LINK}>
                                {brand.phone}
                            </a>
                            <a href={`mailto:${brand.email}`} style={FOOTER_LINK}>
                                {brand.email}
                            </a>
                        </div>
                    </div>

                    <div>
                        <div style={FOOTER_HEADING}>{strings.footerFollow}</div>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                            {socialLinks.map((link) => (
                                <a key={link.label} href={link.href} style={FOOTER_LINK}>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        paddingTop: 'var(--space-5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                    }}
                >
                    <span>
                        © 2026 {brand.name} {brand.suffix}
                    </span>
                    <a href="/" style={{ color: 'var(--border-strong)', textDecoration: 'none' }}>
                        {strings.backToHub}
                    </a>
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .ui-footer-grid {
                        grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
                    }
                }
            `}</style>
        </footer>
    )
}

const FOOTER_HEADING: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 'var(--space-3)',
}

const FOOTER_LINK: CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    lineHeight: 1.7,
}

// =================================================================== bọc ngoài

/**
 * Bọc ngoài của mọi trang con — đặt nền, chữ và chặn tràn ngang.
 *
 * `data-theme` là BẮT BUỘC, không phải trang trí: `tokens.css` của mỗi mẫu khai
 * biến trong `[data-theme='hN']`, nên thiếu thuộc tính này thì cả trang rơi về
 * bộ dự phòng xám của `@repo/styling-css` và mọi mẫu trông y hệt nhau.
 *
 * `overflow-x: clip` chứ KHÔNG phải `hidden` — đây là chỗ dễ sai nhất vì hàm
 * này bọc MỌI trang con. Spec CSS: khi một trục là `hidden` còn trục kia
 * `visible`, trình duyệt âm thầm đổi trục `visible` thành `auto`. Nên `hidden`
 * biến phần tử này thành scroll container, và mọi `position: sticky` bên trong
 * dính vào NÓ thay vì vào viewport — thanh tóm tắt giá ở trang Rooms và
 * Checkout trôi mất khi cuộn. `clip` chặn tràn ngang y hệt mà không tạo scroll
 * container.
 */
export function PageBody({
    theme,
    children,
}: {
    theme: string
    children: React.ReactNode
}) {
    return (
        <div
            data-theme={theme}
            style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                background: 'var(--surface)',
                overflowX: 'clip',
                minHeight: '100vh',
            }}
        >
            {children}
        </div>
    )
}
