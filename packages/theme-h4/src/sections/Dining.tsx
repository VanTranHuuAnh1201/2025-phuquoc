import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { ui } from '../strings'

/**
 * Nhà hàng & Bar — dải nền TEAL ĐẶC, thẻ trong mờ.
 *
 * Đây là dải tối duy nhất giữa trang của mẫu 04, dùng để cắt nhịp giữa hai
 * dải sáng. Thẻ không có nền riêng mà là lớp trắng 7% đè lên teal, nhãn giờ
 * mở cửa là badge xanh lá.
 *
 * Lưu ý tương phản: chữ trên nền teal dùng `--text-inverse`, nhưng chữ trên
 * badge xanh lá phải là `--text` (xanh rừng đậm).
 */

export function Dining({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="dining"
            style={{
                background: 'var(--brand)',
                padding: '76px var(--space-6) var(--space-20)',
                scrollMarginTop: '110px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 34 }}>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 800,
                            color: 'var(--accent)',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {t.diningKicker}
                    </div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            lineHeight: 1.16,
                            fontWeight: 900,
                            color: 'var(--text-inverse)',
                            letterSpacing: '-0.035em',
                            margin: '0 0 10px',
                            textWrap: 'balance',
                        }}
                    >
                        {t.diningTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-inverse)',
                            opacity: 0.72,
                            margin: '0 auto',
                            maxWidth: 520,
                            textWrap: 'pretty',
                        }}
                    >
                        {t.diningSub}
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.dining.map((venue) => (
                        <article
                            key={venue.id}
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                background: 'var(--overlay-soft)',
                            }}
                        >
                            <ImageSlot
                                placeholder={pick(venue.name, locale)}
                                height={178}
                                style={{ borderRadius: 0, background: 'var(--brand-dark)' }}
                            />
                            <div style={{ padding: '20px 22px 24px' }}>
                                <h3
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 800,
                                        color: 'var(--text-inverse)',
                                        letterSpacing: '-0.015em',
                                        margin: '0 0 var(--space-2)',
                                    }}
                                >
                                    {pick(venue.name, locale)}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.65,
                                        color: 'var(--text-inverse)',
                                        opacity: 0.7,
                                        margin: '0 0 var(--space-3)',
                                    }}
                                >
                                    {pick(venue.desc, locale)}
                                </p>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '5px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--accent)',
                                        color: 'var(--text)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 800,
                                    }}
                                >
                                    {pick(venue.note, locale)}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
