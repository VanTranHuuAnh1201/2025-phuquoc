import { pick, telHref, themeHref, themeRoot, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { IconPhone } from '../components/icons'

/**
 * Header mẫu 06 — nền ngà ĐẶC từ pixel đầu tiên (spec v4 §2.1: sáng, sạch,
 * chính chủ). Không transparent-trên-hero như các mẫu trước: một website
 * booking đáng tin trông như quầy lễ tân, không như poster.
 *
 * Hairline xanh brand 3px trên cùng là dấu nhận diện duy nhất. Icon đăng
 * nhập/chuông do `SiteOverlay` của app render, header chừa khoảng phải.
 */

const SLUG = meta.slug

export function Header({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { brand, nav } = data

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 60,
                background: 'var(--color-surface-base)',
                borderTop: '3px solid var(--color-brand)',
                borderBottom: '1px solid var(--color-border-muted)',
            }}
        >
            <div
                className="h6-container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    minHeight: 64,
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
                        style={{ height: 36, width: 'auto', objectFit: 'contain' }}
                    />
                    <span
                        className="h6-display"
                        style={{
                            fontSize: 'var(--font-size-lg)',
                            color: 'var(--color-text-primary)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {brand.name}
                    </span>
                </a>

                <nav
                    aria-label={locale === 'vi' ? 'Điều hướng chính' : 'Main navigation'}
                    className="h6-header-nav"
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
                                color: 'var(--color-text-secondary)',
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
                        className="h6-header-tel"
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
                            color: 'var(--color-brand)',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            minHeight: 24,
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        <IconPhone size={16} />
                        <span className="h6-header-tel-num">{brand.phone}</span>
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
                                color:
                                    locale === 'vi'
                                        ? 'var(--color-text-primary)'
                                        : 'var(--color-text-tertiary)',
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
                                color:
                                    locale === 'en'
                                        ? 'var(--color-text-primary)'
                                        : 'var(--color-text-tertiary)',
                            }}
                        >
                            EN
                        </a>
                    </span>
                </div>
            </div>

            <style>{`
                .h6-header-nav a:hover { color: var(--color-brand); }
                @media (max-width: 1080px) {
                    .h6-header-nav { display: none; }
                }
                @media (max-width: 640px) {
                    .h6-header-tel-num { display: none; }
                }
            `}</style>
        </header>
    )
}
