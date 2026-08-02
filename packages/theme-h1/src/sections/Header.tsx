'use client'

import { pick, telHref, themeHref, themePath, themeRoot, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

/**
 * Thanh điều hướng cố định.
 *
 * Ban đầu trong suốt đè lên hero, sau khi cuộn quá 60px thì chuyển nền trắng
 * mờ và thu gọn thanh liên hệ phía trên — đúng hành vi của prototype.
 *
 * Đường dẫn đi qua `themeHref` của core: prototype nối trang bằng anchor
 * (`#rooms`), nhưng ở app thật `#rooms` phải dẫn sang `/h1/rooms`. Bảng ánh xạ
 * nằm ở core nên bốn mẫu dùng chung một luật, không mẫu nào tự chép (luật R1).
 */

const SLUG = meta.slug

export function Header({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { brand, nav } = data
    const scrolled = useScrolled()

    const tel = telHref(brand.phone)

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}>
            <div
                style={{
                    maxHeight: scrolled ? 0 : 46,
                    opacity: scrolled ? 0 : 1,
                    overflow: 'hidden',
                    color: 'var(--text-inverse)',
                    background: 'rgba(15, 23, 42, 0.85)',
                    borderBottom: scrolled ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    transition: 'max-height 260ms ease, opacity 200ms ease',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: '4px var(--space-6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                        fontSize: 'var(--text-xs)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {pick(brand.address, locale)}
                        </span>
                        <a
                            href={tel}
                            style={{
                                color: 'var(--brand-light)',
                                fontWeight: 700,
                                textDecoration: 'none',
                                flexShrink: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                            }}
                        >
                            <span>Hotline / Zalo:</span>
                            <span>{brand.phone}</span>
                        </a>
                    </div>

                    {/* Top Action Items: VI/EN, Bell, User */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 4, fontWeight: 700, fontSize: '12px' }}>
                            <a
                                href="?lang=vi"
                                style={{
                                    color: locale === 'vi' ? 'var(--brand-light)' : 'var(--text-inverse)',
                                    textDecoration: 'none',
                                    fontWeight: locale === 'vi' ? 800 : 500,
                                }}
                            >
                                VI
                            </a>
                            <span style={{ opacity: 0.4 }}>|</span>
                            <a
                                href="?lang=en"
                                style={{
                                    color: locale === 'en' ? 'var(--brand-light)' : 'var(--text-inverse)',
                                    textDecoration: 'none',
                                    fontWeight: locale === 'en' ? 800 : 500,
                                }}
                            >
                                EN
                            </a>
                        </div>

                        <button
                            type="button"
                            aria-label="Notification"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--text-inverse)',
                                opacity: 0.9,
                            }}
                        >
                            🔔
                        </button>

                        <button
                            type="button"
                            aria-label="User Account"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '15px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--text-inverse)',
                                opacity: 0.9,
                            }}
                        >
                            👤
                        </button>
                    </div>
                </div>
            </div>

            <header
                style={{
                    background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(14px)' : undefined,
                    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                    boxShadow: scrolled ? 'var(--shadow-sm)' : undefined,
                    transition: 'background 240ms ease, box-shadow 240ms ease',
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
                        href={themeRoot(SLUG)}
                        style={{
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <img
                            src="/OP5.png"
                            alt={brand.name}
                            style={{
                                height: 40,
                                width: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                        <div style={{ display: 'grid', gap: 1 }}>
                            <span
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 800,
                                    letterSpacing: '0.02em',
                                    color: scrolled ? 'var(--text)' : 'var(--text-inverse)',
                                    transition: 'color 240ms ease',
                                }}
                            >
                                {brand.name.toUpperCase()}
                            </span>
                            <span
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: scrolled ? 'var(--text-muted)' : 'var(--text-inverse)',
                                    opacity: scrolled ? 1 : 0.72,
                                    transition: 'color 240ms ease',
                                }}
                            >
                                {brand.suffix} · Nam Du Island
                            </span>
                        </div>
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
                                href={themeHref(SLUG, item.href, true)}
                                style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    textDecoration: 'none',
                                    color: scrolled ? 'var(--text-muted)' : 'var(--text-inverse)',
                                    transition: 'color 240ms ease',
                                }}
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <a
                        href={themePath(SLUG, 'rooms')}
                        style={{
                            padding: '10px var(--space-5)',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            color: 'var(--text-inverse)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            textDecoration: 'none',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        {t.bookNow}
                    </a>
                </div>
            </header>
        </div>
    )
}
