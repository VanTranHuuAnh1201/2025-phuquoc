import type { Locale, PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Dải kêu gọi đặt phòng.
 *
 * Ngược mẫu 01: ở đây khối CTA có nền SÁNG (`--surface-alt`) bo góc rất mềm
 * chứ không phải nền tối, để giữ mạch tươi sáng của mẫu 04. Nút chính là xanh
 * lá với chữ xanh rừng, nút phụ là teal đặc với chữ trắng.
 *
 * Số điện thoại và email đọc từ `data.brand`, không hard-code trong theme.
 */

export function Booking({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { brand } = data
    const telHref = `tel:${brand.phone.replace(/\s/g, '')}`

    return (
        <section
            id="booking"
            style={{
                background: 'var(--surface)',
                padding: 'var(--space-2) var(--space-6) var(--space-20)',
                scrollMarginTop: '110px',
            }}
        >
            <div
                style={{
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    borderRadius: 'calc(var(--radius-lg) * 2)',
                    background: 'var(--surface-alt)',
                    padding: '56px 52px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                    gap: 'var(--space-8)',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            lineHeight: 1.18,
                            fontWeight: 900,
                            color: 'var(--brand)',
                            letterSpacing: '-0.035em',
                            margin: '0 0 var(--space-3)',
                            textWrap: 'balance',
                        }}
                    >
                        {t.ctaTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-lg)',
                            lineHeight: 1.68,
                            color: 'var(--text-muted)',
                            margin: 0,
                            maxWidth: 520,
                            textWrap: 'pretty',
                        }}
                    >
                        {t.ctaSub}
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: 'var(--space-3)',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                    }}
                >
                    <a
                        href={telHref}
                        style={{
                            padding: '15px 30px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            color: 'var(--text)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                        }}
                    >
                        Zalo · {brand.phone}
                    </a>
                    <a
                        href={`mailto:${brand.email}`}
                        style={{
                            padding: '15px 28px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--brand)',
                            color: 'var(--text-inverse)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                        }}
                    >
                        {t.emailUs}
                    </a>
                </div>
            </div>
        </section>
    )
}
