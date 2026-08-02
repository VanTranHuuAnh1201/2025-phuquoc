import { pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug
import { Heading } from './Kicker'

/**
 * Điểm đến quanh đảo — dải NỀN TEAL, thẻ ảnh cao 320px phủ gradient tối dần
 * xuống chân, chữ đè lên ảnh.
 *
 * Mẫu 01 dùng thẻ trắng có viền; ở đây thẻ chính là ảnh, nên không dùng `Card`
 * của `ui`.
 */

export function Places({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="places"
            style={{
                background: 'var(--surface-inverse)',
                padding: '76px var(--space-6) 84px',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: 'var(--space-8)',
                        marginBottom: 36,
                        flexWrap: 'wrap',
                    }}
                >
                    <Heading
                        kicker={t.placesKicker}
                        title={t.placesTitle}
                        sub={t.placesSub}
                        onDark
                        maxWidth={620}
                    />
                    <a
                        href={themePath(SLUG, 'rooms')}
                        style={{
                            padding: '13px 26px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            color: 'var(--text)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                        }}
                    >
                        {t.viewAll}
                    </a>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.places.map((place) => (
                        <article
                            key={place.id}
                            style={{
                                position: 'relative',
                                height: 320,
                                borderRadius: 30,
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ position: 'absolute', inset: 0 }}>
                                <ImageSlot
                                    placeholder={pick(place.name, locale)}
                                    src={place.image}
                                    height="100%"
                                    style={{ borderRadius: 0 }}
                                />
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(180deg, rgba(6,97,104,0) 42%, rgba(6,97,104,0.92) 100%)',
                                    pointerEvents: 'none',
                                }}
                            />

                            <span
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    padding: '5px 12px',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                }}
                            >
                                {pick(place.tag, locale)}
                            </span>

                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    padding: '20px 20px 22px',
                                    pointerEvents: 'none',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 800,
                                        color: 'var(--text-inverse)',
                                        margin: '0 0 6px',
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {pick(place.name, locale)}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        lineHeight: 1.6,
                                        color: 'var(--text-inverse)',
                                        opacity: 0.8,
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
