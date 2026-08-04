'use client'

import { pick, telHref, themeHref, themeRoot, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { meta } from '../meta'
import { IconPhone } from '../components/icons'

/**
 * Header mẫu 05 — sáng, phẳng, không dải tối.
 *
 * Trong suốt trên hero (chữ ngà), cuộn quá 60px chuyển nền ngà mờ + viền cát.
 * Icon đăng nhập/chuông do `SiteOverlay` của app render (chức năng sản phẩm,
 * không phải hình thức mẫu — luật R1), nên header này chừa khoảng phải.
 */

const SLUG = meta.slug

export function Header({ data, locale }: { data: PropertyData; locale: Locale }) {
    const scrolled = useScrolled()
    const { brand, nav } = data

    const linkColor = scrolled ? 'var(--color-text-secondary)' : 'var(--color-text-inverse)'

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 60,
                background: scrolled ? 'var(--surface-veil)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : undefined,
                borderBottom: scrolled
                    ? '1px solid var(--color-border-muted)'
                    : '1px solid transparent',
                transition: 'background var(--motion-fast) ease, border-color var(--motion-fast) ease',
            }}
        >
            <div
                className="h5-container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    minHeight: 68,
                    /* Chừa chỗ cho SiteOverlay (đăng nhập + chuông) của app ở góc phải. */
                    paddingRight: 170,
                }}
            >
                <a
                    href={themeRoot(SLUG)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        textDecoration: 'none',
                        flexShrink: 0,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={brand.logo || '/OP5.png'}
                        alt={`${brand.name} ${brand.suffix}`}
                        style={{ height: 38, width: 'auto', objectFit: 'contain' }}
                    />
                    <span
                        className="h5-display"
                        style={{
                            fontSize: 'var(--font-size-lg)',
                            color: scrolled ? 'var(--color-text-primary)' : 'var(--color-text-inverse)',
                            whiteSpace: 'nowrap',
                            transition: 'color var(--motion-fast) ease',
                        }}
                    >
                        {brand.name}
                    </span>
                </a>

                <nav
                    aria-label={locale === 'vi' ? 'Điều hướng chính' : 'Main navigation'}
                    className="h5-header-nav"
                    style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        overflow: 'hidden',
                    }}
                >
                    {nav.map((item) => (
                        <a
                            key={item.href}
                            href={themeHref(SLUG, item.href, true)}
                            style={{
                                padding: '10px 12px',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-medium)' as never,
                                color: linkColor,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'color var(--motion-instant) ease',
                            }}
                        >
                            {pick(item.label, locale)}
                        </a>
                    ))}
                </nav>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        flexShrink: 0,
                    }}
                >
                    <a
                        href={telHref(brand.phone)}
                        className="h5-header-tel"
                        aria-label={
                            locale === 'vi'
                                ? `Gọi hotline ${brand.phone}`
                                : `Call hotline ${brand.phone}`
                        }
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-bold)' as never,
                            color: linkColor,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            minHeight: 24,
                        }}
                    >
                        <IconPhone size={16} />
                        <span className="h5-header-tel-num">{brand.phone}</span>
                    </a>

                    <span
                        style={{
                            display: 'inline-flex',
                            gap: 2,
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 'var(--font-weight-bold)' as never,
                        }}
                    >
                        <a
                            href="?lang=vi"
                            aria-label="Tiếng Việt"
                            aria-current={locale === 'vi' ? 'true' : undefined}
                            style={{
                                padding: 6,
                                minWidth: 24,
                                textAlign: 'center',
                                textDecoration: locale === 'vi' ? 'underline' : 'none',
                                textUnderlineOffset: 4,
                                color: linkColor,
                            }}
                        >
                            VI
                        </a>
                        <a
                            href="?lang=en"
                            aria-label="English"
                            aria-current={locale === 'en' ? 'true' : undefined}
                            style={{
                                padding: 6,
                                minWidth: 24,
                                textAlign: 'center',
                                textDecoration: locale === 'en' ? 'underline' : 'none',
                                textUnderlineOffset: 4,
                                color: linkColor,
                            }}
                        >
                            EN
                        </a>
                    </span>
                </div>
            </div>

            <style>{`
                .h5-header-nav a:hover { color: var(--color-brand); }
                @media (max-width: 1080px) {
                    .h5-header-nav { display: none; }
                }
                @media (max-width: 640px) {
                    .h5-header-tel-num { display: none; }
                }
            `}</style>
        </header>
    )
}
