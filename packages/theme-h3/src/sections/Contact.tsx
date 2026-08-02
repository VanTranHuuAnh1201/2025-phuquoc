import { pick, themeHref, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Chân trang kiêm section liên hệ.
 *
 * Prototype dùng chính `<footer id="contact">` làm section contact — giữ
 * nguyên để bộ id của luật R7 vẫn đủ. Khác mẫu 01: nền teal đậm, chữ trắng,
 * tiêu đề cột màu cam viết hoa.
 */

const SOCIAL = ['Facebook', 'Instagram', 'TikTok', 'Google Maps']

const COLUMN_TITLE: React.CSSProperties = {
    fontSize: '12.5px',
    fontWeight: 800,
    color: 'var(--accent)',
    marginBottom: 'var(--space-3)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
}

const LINK: React.CSSProperties = {
    fontSize: '13.5px',
    color: 'var(--text-inverse)',
    opacity: 0.72,
    textDecoration: 'none',
}

export function Contact({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { brand, nav } = data
    const telHref = `tel:${brand.phone.replace(/\s/g, '')}`

    return (
        <footer
            id="contact"
            style={{
                background: 'var(--surface-inverse)',
                padding: '60px var(--space-6) 28px',
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
                        borderBottom: '1px solid var(--overlay-line)',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-base)',
                                fontWeight: 800,
                                color: 'var(--text-inverse)',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            {brand.name.toUpperCase()}
                        </div>
                        <p
                            style={{
                                fontSize: '13.5px',
                                lineHeight: 1.7,
                                color: 'var(--text-inverse)',
                                opacity: 0.7,
                                margin: '0 0 var(--space-3)',
                                maxWidth: '320px',
                            }}
                        >
                            {t.footerAbout}
                        </p>
                        <div
                            style={{
                                fontSize: '13.5px',
                                color: 'var(--text-inverse)',
                                opacity: 0.7,
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
                            <a href={telHref} style={LINK}>
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
                        fontSize: '12.5px',
                        color: 'var(--text-inverse)',
                        opacity: 0.5,
                    }}
                >
                    <span>
                        © {new Date().getFullYear()} {brand.name} {brand.suffix}
                    </span>
                    <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        ← {locale === 'vi' ? 'Về trang tổng' : 'Back to showcase'}
                    </a>
                </div>
            </div>
        </footer>
    )
}
