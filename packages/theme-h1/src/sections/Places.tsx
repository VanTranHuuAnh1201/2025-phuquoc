import { pick, type Locale, type PropertyData } from '@repo/core'
import { Card, ImageSlot, Pill, SectionHeader } from '@repo/ui'

import { ui } from '../strings'

/** Điểm đến quanh đảo — lưới bốn cột, thẻ ảnh nhỏ. */

export function Places({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="places"
            style={{
                background: 'var(--surface-alt)',
                padding: 'var(--space-16) var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader
                    kicker={t.placesKicker}
                    title={t.placesTitle}
                    sub={t.placesSub}
                    align="center"
                />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.places.map((place) => (
                        <Card
                            key={place.id}
                            media={
                                <ImageSlot
                                    placeholder={pick(place.name, locale)}
                                    src={place.image}
                                    height={168}
                                    style={{ borderRadius: 0 }}
                                />
                            }
                        >
                            <div style={{ marginBottom: 'var(--space-2)' }}>
                                <Pill tone="neutral">{pick(place.tag, locale)}</Pill>
                            </div>
                            <h3
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 700,
                                    color: 'var(--text)',
                                    margin: '0 0 var(--space-2)',
                                }}
                            >
                                {pick(place.name, locale)}
                            </h3>
                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    lineHeight: 1.65,
                                    color: 'var(--text-muted)',
                                    margin: 0,
                                }}
                            >
                                {pick(place.desc, locale)}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
