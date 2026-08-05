import { pick, telHref, themeHref, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Chân trang kiêm section liên hệ.
 *
 * Prototype dùng chính `<footer id="contact">` làm section contact — giữ
 * nguyên cách đó để bộ id của luật R7 vẫn đủ.
 */

const SOCIAL = ['Facebook', 'Instagram', 'TikTok', 'Google Maps']

const COLUMN_TITLE: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 'var(--space-3)',
}

const LINK: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    textDecoration: 'none',
}

export function Contact({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { brand, nav } = data
    const tel = telHref(brand.phone)

    return (
        <footer
            id="contact"
            style={{
                background: 'var(--surface-alt)',
                borderTop: '1px solid var(--border)',
                padding: 'var(--space-16) var(--space-6) 28px',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                        gap: 'var(--space-8)',
                        paddingBottom: '36px',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
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
                                maxWidth: '320px',
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
                        <div style={COLUMN_TITLE}>{t.footerNav}</div>
                        <div style={{ display: 'grid', gap: 9 }}>
                            {nav.map((item) => (
                                <a key={item.href} href={themeHref(SLUG, item.href)} style={LINK}>
                                    {pick(item.label, locale)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={COLUMN_TITLE}>{t.footerContact}</div>
                        <div style={{ display: 'grid', gap: 9 }}>
                            <a href={tel} style={LINK}>
                                {brand.phone}
                            </a>
                            <a href={`mailto:${brand.email}`} style={LINK}>
                                {brand.email}
                            </a>
                            <a
                                href={`https://${brand.site}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={LINK}
                            >
                                {brand.site}
                            </a>
                        </div>
                    </div>

                    <div>
                        <div style={COLUMN_TITLE}>{t.footerFollow}</div>
                        <div style={{ display: 'grid', gap: 9 }}>
                            {SOCIAL.map((name) => (
                                <span key={name} style={LINK}>
                                    {name}
                                </span>
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
                        © {new Date().getFullYear()} {brand.name} {brand.suffix}
                    </span>
                    <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                        ← {locale === 'vi' ? 'Về trang tổng' : 'Back to showcase'}
                    </a>
                </div>
            </div>
        </footer>
    )
}
