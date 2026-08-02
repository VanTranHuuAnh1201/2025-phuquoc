import { pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot, Pill, SectionHeader } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Điểm đến quanh đảo — lưới thẻ, ảnh lùi vào 8px so với mép thẻ (ảnh bo góc
 * riêng nằm trong khung bo góc lớn hơn) đúng như prototype mẫu 03.
 *
 * Không dùng `Card` của `ui` ở đây: `Card` cho ảnh tràn sát viền, còn mẫu 03
 * cố ý chừa viền quanh ảnh — đó là khác biệt hình thức thuộc về theme.
 */

export function Places({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="places"
            style={{
                background: 'var(--surface)',
                padding: '60px var(--space-6) 76px',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader
                    kicker={t.placesKicker}
                    title={t.placesTitle}
                    sub={t.placesSub}
                    action={
                        <a
                            href={themePath(SLUG, 'tours')}
                            style={{
                                padding: '13px 26px',
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--brand)',
                                color: 'var(--brand)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                textDecoration: 'none',
                            }}
                        >
                            {t.viewAll}
                        </a>
                    }
                />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.places.map((place) => (
                        <article
                            key={place.id}
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            <div
                                style={{
                                    margin: '8px 8px 0',
                                    borderRadius: 'var(--radius)',
                                    overflow: 'hidden',
                                }}
                            >
                                <ImageSlot
                                    placeholder={pick(place.name, locale)}
                                    src={place.image}
                                    height={200}
                                    style={{
                                        borderRadius: 'var(--radius)',
                                        background: 'var(--surface-tint)',
                                    }}
                                />
                            </div>
                            <div style={{ padding: 'var(--space-4) 18px var(--space-5)' }}>
                                <div style={{ marginBottom: 'var(--space-3)' }}>
                                    <Pill>{pick(place.tag, locale)}</Pill>
                                </div>
                                <h3
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 800,
                                        color: 'var(--brand)',
                                        margin: '0 0 7px',
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {pick(place.name, locale)}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.6,
                                        color: 'var(--text-muted)',
                                        margin: 0,
                                    }}
                                >
                                    {pick(place.desc, locale)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
