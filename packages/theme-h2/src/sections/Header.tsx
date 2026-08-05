'use client'

import { useState } from 'react'
import { pick, telHref, themeHref, themePath, themeRoot, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

/**
 * Thanh điều hướng mẫu 07 — hai bố cục tách hẳn nhau theo bản thiết kế.
 *
 * Desktop (≥ 960px): logo trái · nav ngang · khối hotline · nút vàng phải.
 * Mobile  (< 960px): hamburger trái · logo giữa · icon gọi phải — không nav
 *                    ngang, không nút vàng (CTA nằm trong hero).
 *
 * Hai nhánh cùng nằm trong một component, ẩn/hiện bằng media query ở thẻ
 * <style> cuối file. Không dùng useMediaQuery vì render phía server phải ra
 * đúng markup cho cả hai — tránh nhấp nháy khi hydrate.
 *
 * Đường dẫn đi qua `themeHref` của core: prototype nối trang bằng anchor
 * (`#rooms`), nhưng ở app thật `#rooms` phải dẫn sang `/h7/rooms`. Bảng ánh xạ
 * nằm ở core nên các mẫu dùng chung một luật, không mẫu nào tự chép (luật R1).
 */

const SLUG = meta.slug

/** Icon SVG — luật D5 cấm dùng emoji làm icon ở sản phẩm mới. */
function IconPhone({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.3 2.2Z"
                fill="currentColor"
            />
        </svg>
    )
}

function IconMenu({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function IconClose({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

export function Header({
    data,
    locale,
    extra,
}: {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}) {
    const t = ui[locale]
    const { brand, nav } = data
    const scrolled = useScrolled()
    const [menuOpen, setMenuOpen] = useState(false)

    const tel = telHref(brand.phone)
    /** Trên nền ảnh hero chữ phải trắng; cuộn qua rồi thì đổi sang navy. */
    const onDark = !scrolled
    const fg = onDark ? '#ffffff' : 'var(--text)'

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}>
            <header
                style={{
                    background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(14px)' : undefined,
                    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                    boxShadow: scrolled ? 'var(--shadow-sm)' : undefined,
                    transition: 'background 240ms ease, box-shadow 240ms ease',
                }}
            >
                {/* ---------- DESKTOP ---------- */}
                <div
                    className="h7-bar-desktop"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: '12px var(--space-6)',
                        minHeight: 72,
                        alignItems: 'center',
                        gap: 'var(--space-5)',
                    }}
                >
                    <a
                        href={themeRoot(SLUG)}
                        style={{
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            textDecoration: 'none',
                        }}
                    >
                        <img
                            src={brand.logo || '/OP5.png'}
                            alt={brand.name}
                            style={{ height: 38, width: 38, borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: 2 }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                            <span
                                style={{
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-serif, Georgia, serif)',
                                    color: fg,
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {brand.name || 'The Nam Du Hill'}
                            </span>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    color: onDark ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
                                    marginTop: 2,
                                }}
                            >
                                Nam Du, Kiên Giang
                            </span>
                        </div>
                    </a>

                    <nav
                        style={{
                            display: 'flex',
                            gap: 4,
                            marginLeft: 'auto',
                            alignItems: 'center',
                            minWidth: 0,
                        }}
                    >
                        {nav
                            .filter((item) => item.href !== '#top' && item.href !== '/')
                            .map((item) => (
                            <a
                                key={item.href}
                                href={themeHref(SLUG, item.href, true)}
                                className="h7-nav-link"
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '14.5px',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    textDecoration: 'none',
                                    color: fg,
                                    transition: 'color 240ms ease',
                                }}
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        {extra && <div key="extra-desktop" style={{ display: 'flex', alignItems: 'center', color: fg }}>{extra}</div>}

                        <a
                            href={themePath(SLUG, 'rooms')}
                            className="h7-cta"
                            style={{
                                padding: '10px 20px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--accent)',
                                color: 'var(--on-accent)',
                                fontSize: '14px',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                textDecoration: 'none',
                            }}
                        >
                            {t.bookNow}
                        </a>
                    </div>
                </div>

                {/* ---------- MOBILE ---------- */}
                <div
                    className="h7-bar-mobile"
                    style={{
                        padding: '10px var(--space-4)',
                        minHeight: 60,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
                        aria-expanded={menuOpen}
                        style={{
                            width: 40,
                            height: 40,
                            display: 'grid',
                            placeItems: 'center',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: menuOpen ? 'var(--text)' : fg,
                            padding: 0,
                        }}
                    >
                        {menuOpen ? <IconClose /> : <IconMenu />}
                    </button>

                    <a href={themeRoot(SLUG)} style={{ display: 'flex', textDecoration: 'none' }}>
                        <img
                            src={brand.logo || '/OP5.png'}
                            alt={brand.name}
                            style={{ height: 38, width: 'auto', objectFit: 'contain' }}
                        />
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: fg }}>
                        {extra && <div key="extra-mobile">{extra}</div>}
                        <a
                            href={tel}
                            aria-label={`${t.phoneLabel} ${brand.phone}`}
                            style={{
                                width: 40,
                                height: 40,
                                display: 'grid',
                                placeItems: 'center',
                                color: fg,
                                textDecoration: 'none',
                            }}
                        >
                            <IconPhone size={20} />
                        </a>
                    </div>
                </div>

                {/* Panel menu mobile — đổ xuống dưới thanh, nền trắng. */}
                {menuOpen && (
                    <nav
                        className="h7-menu-panel"
                        style={{
                            background: 'var(--surface)',
                            borderTop: '1px solid var(--border)',
                            boxShadow: 'var(--shadow)',
                            padding: 'var(--space-2) var(--space-4) var(--space-4)',
                            display: 'grid',
                            maxHeight: 'calc(100vh - 60px)',
                            overflowY: 'auto',
                        }}
                    >
                        {nav
                            .filter((item) => item.href !== '#top' && item.href !== '/')
                            .map((item) => (
                            <a
                                key={item.href}
                                href={themeHref(SLUG, item.href, true)}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    padding: '14px 4px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                        <a
                            href={themePath(SLUG, 'rooms')}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                marginTop: 'var(--space-4)',
                                padding: '14px 20px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--accent)',
                                color: 'var(--on-accent)',
                                fontSize: '15px',
                                fontWeight: 700,
                                textAlign: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            {t.bookNow}
                        </a>
                    </nav>
                )}
            </header>

            <style>{`
                .h7-bar-desktop { display: none; }
                .h7-bar-mobile  { display: flex; }
                @media (min-width: 960px) {
                    .h7-bar-desktop { display: flex; }
                    .h7-bar-mobile  { display: none; }
                    .h7-menu-panel  { display: none; }
                }
                .h7-nav-link:hover { color: var(--accent) !important; }
                .h7-nav-link:focus-visible,
                .h7-cta:focus-visible {
                    outline: 2px solid var(--accent);
                    outline-offset: 2px;
                }
                .h7-cta { transition: background 200ms ease, transform 150ms ease; }
                .h7-cta:hover  { background: var(--accent-dark); }
                .h7-cta:active { transform: translateY(1px); }
            `}</style>
        </div>
    )
}
