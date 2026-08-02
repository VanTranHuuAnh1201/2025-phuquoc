import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { ui } from '../strings'

/**
 * Điểm đến quanh đảo — thẻ ảnh CAO, chữ đè lên ảnh.
 *
 * Khác hẳn mẫu 01 (thẻ ảnh nhỏ + chữ dưới ảnh): ở đây mỗi thẻ cao 300px, phủ
 * một dải gradient teal từ giữa xuống chân, tên và mô tả nằm trong dải đó,
 * nhãn phân loại là badge xanh lá góc trên trái.
 */

export function Places({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="places"
            style={{
                background: 'var(--surface-alt)',
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
                            color: 'var(--accent-dark)',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {t.placesKicker}
                    </div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            lineHeight: 1.16,
                            fontWeight: 900,
                            color: 'var(--brand)',
                            letterSpacing: '-0.035em',
                            margin: '0 0 10px',
                            textWrap: 'balance',
                        }}
                    >
                        {t.placesTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            lineHeight: 1.7,
                            color: 'var(--text-muted)',
                            margin: '0 auto',
                            maxWidth: 560,
                            textWrap: 'pretty',
                        }}
                    >
                        {t.placesSub}
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {data.places.map((place) => (
                        <article
                            key={place.id}
                            style={{
                                position: 'relative',
                                height: 300,
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}
                        >
                            <ImageSlot
                                placeholder={pick(place.name, locale)}
                                src={place.image}
                                height="100%"
                                style={{ borderRadius: 0 }}
                            />

                            {/* Gradient teal để chữ trắng luôn đọc được trên mọi ảnh. */}
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(180deg, transparent 40%, var(--brand) 100%)',
                                    pointerEvents: 'none',
                                }}
                            />

                            <span
                                style={{
                                    position: 'absolute',
                                    top: 14,
                                    left: 14,
                                    padding: '5px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 800,
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
                                    padding: 'var(--space-5)',
                                    pointerEvents: 'none',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 800,
                                        color: 'var(--text-inverse)',
                                        letterSpacing: '-0.015em',
                                        margin: '0 0 6px',
                                    }}
                                >
                                    {pick(place.name, locale)}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        lineHeight: 1.6,
                                        color: 'var(--text-inverse)',
                                        opacity: 0.82,
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
