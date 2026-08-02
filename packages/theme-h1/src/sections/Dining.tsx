import { pick, type Locale, type PropertyData } from '@repo/core'
import { Card, ImageSlot, Pill, SectionHeader } from '@repo/ui'

import { ui } from '../strings'

/** Nhà hàng & bar — lưới thẻ, mỗi thẻ có nhãn giờ mở cửa ở chân. */

export function Dining({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="dining"
            style={{
                background: 'var(--surface)',
                padding: 'var(--space-16) var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader kicker={t.diningKicker} title={t.diningTitle} sub={t.diningSub} />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.dining.map((venue) => (
                        <Card
                            key={venue.id}
                            media={
                                <ImageSlot
                                    placeholder={pick(venue.name, locale)}
                                    height={176}
                                    style={{ borderRadius: 0 }}
                                />
                            }
                        >
                            <h3
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 700,
                                    color: 'var(--text)',
                                    margin: '0 0 var(--space-2)',
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
                                    flex: 1,
                                }}
                            >
                                {pick(venue.desc, locale)}
                            </p>
                            <div>
                                <Pill>{pick(venue.note, locale)}</Pill>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
