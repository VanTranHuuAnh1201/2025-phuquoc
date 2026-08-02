import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot, Pill, SectionHeader } from '@repo/ui'

import { ui } from '../strings'

/**
 * Nhà hàng & bar mẫu 03 — thẻ NẰM NGANG hai cột (ảnh trái, chữ phải), khác
 * lưới thẻ dọc của mẫu 01. Bo góc lớn, viền mảnh, không đổ bóng tĩnh.
 */

export function Dining({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="dining"
            style={{
                background: 'var(--surface)',
                padding: '76px var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader
                    kicker={t.diningKicker}
                    title={t.diningTitle}
                    sub={t.diningSub}
                    align="center"
                />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.dining.map((venue) => (
                        <article
                            key={venue.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
                                gap: 'var(--space-5)',
                                alignItems: 'center',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-3)',
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: 'var(--radius)',
                                    overflow: 'hidden',
                                    minWidth: 0,
                                }}
                            >
                                <ImageSlot
                                    placeholder={pick(venue.name, locale)}
                                    height={150}
                                    style={{
                                        borderRadius: 'var(--radius)',
                                        background: 'var(--surface-tint)',
                                    }}
                                />
                            </div>
                            <div style={{ paddingRight: 'var(--space-3)', minWidth: 0 }}>
                                <h3
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 800,
                                        color: 'var(--brand)',
                                        margin: '0 0 var(--space-2)',
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {pick(venue.name, locale)}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '13.5px',
                                        lineHeight: 1.65,
                                        color: 'var(--text-muted)',
                                        margin: '0 0 var(--space-3)',
                                    }}
                                >
                                    {pick(venue.desc, locale)}
                                </p>
                                <Pill>{pick(venue.note, locale)}</Pill>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
