'use client'

import {
    pick,
    themeHref,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { useScrolled } from '@repo/ui'

/**
 * Thanh điều hướng cố định của mẫu 03.
 *
 * Cùng hành vi với mẫu 01 (trong suốt đè lên hero, cuộn quá 60px thì đổi nền
 * trắng mờ và thu gọn thanh trên) nhưng khác hình thức: nav dạng viên thuốc,
 * nút CTA nền cam, và có nút đổi ngôn ngữ ở thanh trên như prototype.
 *
 * Nút đổi ngôn ngữ hiện là link tới cùng trang ở locale kia — theme không tự
 * giữ state ngôn ngữ, locale do route quyết định.
 */

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

export function Header({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { brand, nav } = data
    const scrolled = useScrolled()

    const telHref = `tel:${brand.phone.replace(/\s/g, '')}`

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}>
            <div
                style={{
                    maxHeight: scrolled ? 0 : 44,
                    opacity: scrolled ? 0 : 1,
                    overflow: 'hidden',
                    color: 'var(--text-inverse)',
                    borderBottom: scrolled ? 'none' : '1px solid var(--overlay-line)',
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
                        opacity: 0.84,
                    }}
                >
                    <span>{pick(brand.address, locale)}</span>
                    <a href={telHref} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {t.phoneLabel}: {brand.phone}
                    </a>
                </div>
            </div>

            <header
                style={{
                    background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(14px)' : undefined,
                    boxShadow: scrolled ? 'var(--shadow)' : undefined,
                    transition: 'background 240ms ease, box-shadow 240ms ease',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: '10px var(--space-6)',
                        minHeight: 68,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-5)',
                    }}
                >
                    <a
                        href={themeRoot(SLUG)}
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
                                color: scrolled ? 'var(--brand)' : 'var(--text-inverse)',
                                transition: 'color 240ms ease',
                            }}
                        >
                            {brand.name.toUpperCase()}
                        </span>
                        <span
                            style={{
                                fontSize: 'var(--text-xs)',
                                color: scrolled ? 'var(--text-muted)' : 'var(--text-inverse)',
                                opacity: scrolled ? 1 : 0.74,
                                transition: 'color 240ms ease',
                            }}
                        >
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
                                href={themeHref(SLUG, item.href, true)}
                                style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius-pill)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    textDecoration: 'none',
                                    color: scrolled ? 'var(--text)' : 'var(--text-inverse)',
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
                            padding: '11px 22px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            color: 'var(--text)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
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
