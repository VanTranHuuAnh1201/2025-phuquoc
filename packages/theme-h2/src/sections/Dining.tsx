import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { ui } from '../strings'
import { Heading } from './Kicker'

/**
 * Nhà hàng & bar — thẻ NỀN TEAL NHẠT không viền, nhãn giờ mở cửa nền trắng.
 * Mẫu 01 dùng thẻ trắng có viền, nên không dùng chung `Card` của `ui`.
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
                <div style={{ marginBottom: 38 }}>
                    <Heading
                        kicker={t.diningKicker}
                        title={t.diningTitle}
                        sub={t.diningSub}
                        align="center"
                    />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.dining.map((venue) => (
                        <article
                            key={venue.id}
                            style={{
                                borderRadius: 30,
                                overflow: 'hidden',
                                background: 'var(--surface-tint)',
                            }}
                        >
                            <ImageSlot
                                placeholder={pick(venue.name, locale)}
                                height={180}
                                style={{ borderRadius: 0, background: 'var(--border)' }}
                            />

                            <div style={{ padding: '20px 22px 24px' }}>
                                <h3
                                    style={{
                                        fontSize: 'var(--text-base)',
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
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.65,
                                        color: 'var(--text-muted)',
                                        margin: '0 0 var(--space-3)',
                                    }}
                                >
                                    {pick(venue.desc, locale)}
                                </p>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '5px 12px',
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--surface)',
                                        color: 'var(--brand)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 700,
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
