'use client'

import type { CSSProperties } from 'react'
import {
    pick,
    telHref,
    themeHref,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { useScrolled } from '../useScrolled'
import type { PageStrings } from './strings'

/**
 * Khung dùng chung của các trang con: header cố định, hero có breadcrumb,
 * chân trang.
 *
 * VÌ SAO Ở `ui` CHỨ KHÔNG Ở TỪNG THEME: bốn trang Tours / Tour Detail /
 * Gallery / Contact chỉ có MỘT bản trong prototype, nên cả N mẫu dùng chung
 * đúng ba khối này. Bản trước nằm trong `theme-h1` và hard-code `/h1` ở chín
 * chỗ — nhân ra bốn theme là chép code giữa các mẫu (luật R1).
 *
 * Mọi giá trị hình ảnh đọc từ `var(--…)`; không hex nào trong file này, nên
 * đọc nó KHÔNG đoán được đang là mẫu nào (luật R3/D0). Đường dẫn đi qua
 * `themeHref`/`themePath` của core nên chỉ cần `slug` là chạy đúng cho mẫu thứ
 * 20 mà không sửa file này (luật R5).
 *
 * Kích thước bám sát prototype: topbar 44px, header min-height 66px, container
 * `var(--container)`, hero 420px (Tours) · 400px (Gallery) · 380px (Contact).
 */

export interface ShellProps {
    data: PropertyData
    locale: Locale
    /** Slug của mẫu đang render, vd "h3". Quyết định mọi đường dẫn. */
    slug: string
    t: PageStrings
}

// ==================================================================== header

export function PageHeader({ data, locale, slug, t }: ShellProps) {
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
                        padding: 'var(--space-2) var(--space-6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap',
                        fontSize: 'var(--text-xs)',
                    }}
                >
                    <span>{pick(brand.address, locale)}</span>
                    <a href={telHref(brand.phone)} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {t.hotlineTitle}: {brand.phone}
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
                        href={themeRoot(slug)}
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
                                href={themeHref(slug, item.href)}
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
                                {pick(item.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <a
                        href={themePath(slug, 'rooms')}
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

export function PageFooter({ data, locale, slug, t }: ShellProps) {
    const { brand, nav } = data

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
                            {t.footerAbout}
                        </p>
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                lineHeight: 1.7,
                            }}
                        >
                            {pick(brand.address, locale)}
                        </div>
                    </div>

                    <div>
                        <div style={FOOTER_HEADING}>{t.footerNav}</div>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                            {nav.map((item) => (
                                <a key={item.href} href={themeHref(slug, item.href)} style={FOOTER_LINK}>
                                    {pick(item.label, locale)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={FOOTER_HEADING}>{t.footerContact}</div>
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
                        <div style={FOOTER_HEADING}>{t.footerFollow}</div>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                            {['Facebook', 'Instagram', 'Google Maps'].map((label) => (
                                <a key={label} href={brand.site} style={FOOTER_LINK}>
                                    {label}
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
                        {t.backToHub}
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
}

/**
 * Bọc ngoài của mọi trang con — đặt nền, chữ và chặn tràn ngang.
 *
 * `data-theme` là BẮT BUỘC, không phải trang trí: `tokens.css` của mỗi mẫu khai
 * biến trong `[data-theme='hN']`, nên thiếu thuộc tính này thì cả trang rơi về
 * bộ dự phòng xám của `@repo/ui` và mọi mẫu trông y hệt nhau.
 */
export function PageBody({ slug, children }: { slug: string; children: React.ReactNode }) {
    return (
        <div
            data-theme={slug}
            style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                background: 'var(--surface)',
                overflowX: 'hidden',
                minHeight: '100vh',
            }}
        >
            {children}
        </div>
    )
}
