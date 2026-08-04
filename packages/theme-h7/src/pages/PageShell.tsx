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

export function PageHeader({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = pageUi[locale]
    const { brand, nav } = data
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
                        padding: '8px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                        fontSize: 12.5,
                    }}
                >
                    <span>{pick(brand.address, locale)}</span>
                    <a href={telHref(brand.phone)} style={{ color: 'inherit', textDecoration: 'none' }}>
                        Hotline / Zalo: {brand.phone}
                    </a>
                </div>
            </div>

            <header
                style={{
                    background: 'rgba(255,255,255,0.96)',
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
                        padding: '10px 24px',
                        minHeight: 66,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                    }}
                >
                    <a
                        href="/h7"
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
                                fontSize: 14.5,
                                fontWeight: 800,
                                letterSpacing: '0.02em',
                                color: 'var(--text)',
                            }}
                        >
                            {brand.name.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {brand.suffix} · Nam Du Island
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
                                href={navHref(item.href)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    fontSize: 13.5,
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                }}
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="/h7/rooms"
                        style={{
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: 13.5,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            background: 'var(--accent)',
                            color: 'var(--text-inverse)',
                            boxShadow: 'var(--shadow-sm)',
                            textDecoration: 'none',
                        }}
                    >
                        {t.bookNow}
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
                    background:
                        'linear-gradient(180deg, rgba(15,23,41,0.66) 0%, rgba(15,23,41,0.34) 50%, rgba(15,23,41,0.8) 100%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'relative',
                    height: '100%',
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    padding: '130px 24px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}
            >
                <nav
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.75)',
                        marginBottom: 14,
                        flexWrap: 'wrap',
                    }}
                >
                    {crumbs.map((crumb, index) => (
                        <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {index > 0 && <span aria-hidden="true">/</span>}
                            {crumb.href ? (
                                <a href={crumb.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {crumb.label}
                                </a>
                            ) : (
                                <span style={{ color: '#FFFFFF' }} aria-current="page">
                                    {crumb.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>

                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 46,
                        lineHeight: 1.1,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        margin: '0 0 12px',
                        letterSpacing: '-0.03em',
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        fontSize: 16,
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.85)',
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
 * Breadcrumb trên nền sáng — dùng ở trang chi tiết, nơi prototype không có hero
 * ảnh mà mở thẳng bằng dải ảnh.
 */
export function LightCrumbs({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <section style={{ background: 'var(--surface-alt)', padding: '118px 24px 0' }}>
            <div
                style={{
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    padding: '16px 0 18px',
                    flexWrap: 'wrap',
                }}
            >
                {crumbs.map((crumb, index) => (
                    <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {index > 0 && <span aria-hidden="true">/</span>}
                        {crumb.href ? (
                            <a href={crumb.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {crumb.label}
                            </a>
                        ) : (
                            <span style={{ color: 'var(--text)', fontWeight: 600 }} aria-current="page">
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
        <footer
            style={{
                background: 'var(--surface-alt)',
                borderTop: '1px solid var(--border)',
                padding: '52px 24px 26px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div
                    className="h7-footer-grid"
                    style={{
                        display: 'grid',
                        gap: 40,
                        paddingBottom: 34,
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                                {brand.name} {brand.suffix}
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: 13.5,
                                lineHeight: 1.7,
                                color: 'var(--text-muted)',
                                margin: '0 0 14px',
                                maxWidth: 320,
                            }}
                        >
                            {t.footerAbout}
                        </p>
                        <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                            {pick(brand.address, locale)}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
                            {t.footerNav}
                        </div>
                        <div style={{ display: 'grid', gap: 9 }}>
                            {nav.map((item) => (
                                <a
                                    key={item.href}
                                    href={navHref(item.href)}
                                    style={{
                                        fontSize: 13.5,
                                        color: 'var(--text-muted)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {pick(item.label, locale)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
                            {t.footerContact}
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gap: 9,
                                fontSize: 13.5,
                                color: 'var(--text-muted)',
                            }}
                        >
                            <a href={telHref(brand.phone)} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {brand.phone}
                            </a>
                            <a href={`mailto:${brand.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {brand.email}
                            </a>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
                            {t.footerFollow}
                        </div>
                        <div style={{ display: 'grid', gap: 9, fontSize: 13.5 }}>
                            {['Facebook', 'Instagram', 'Google Maps'].map((label) => (
                                <a
                                    key={label}
                                    href={brand.site}
                                    style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                                >
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        paddingTop: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                        fontSize: 12.5,
                        color: 'var(--text-muted)',
                    }}
                >
                    <span>© 2026 {brand.name} {brand.suffix}</span>
                    <a href="/" style={{ color: 'var(--border-strong)', textDecoration: 'none' }}>
                        ← Về trang tổng
                    </a>
                </div>
            </div>

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
