import type { Locale, PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Dải kêu gọi đặt phòng — mẫu 03 dùng tấm CAM ĐẶC bo góc 50px (mẫu 01 dùng
 * nền tối). Chữ đen trên cam, nút chính đảo sang teal đậm.
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
                padding: 'var(--space-2) var(--space-6) 84px',
                scrollMarginTop: '80px',
            }}
        >
            <div
                style={{
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    borderRadius: 50,
                    background: 'var(--accent)',
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
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: 'var(--text)',
                            margin: '0 0 var(--space-3)',
                            textWrap: 'balance',
                        }}
                    >
                        {t.ctaTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: '15.5px',
                            lineHeight: 1.68,
                            color: 'var(--accent-dark)',
                            margin: 0,
                            maxWidth: '520px',
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
                            background: 'var(--brand)',
                            color: 'var(--text-inverse)',
                            fontSize: 'var(--text-base)',
                            fontWeight: 700,
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
                            border: '1px solid var(--text)',
                            color: 'var(--text)',
                            fontSize: 'var(--text-base)',
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
