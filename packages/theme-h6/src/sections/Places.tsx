import { formatPrice, pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `places` — "Nam Du nên đi đâu" (spec §4.2): một ảnh khổ rộng đóng
 * khung trong container (không full-bleed — trang giữ nền sáng ≥85%), dưới là
 * 3 CỘT CHỮ editorial kẻ dọc cho 3 điểm đến, chốt bằng 2 tour dạng dòng giá.
 * Dữ liệu tour gọn ở đây vì Home mẫu 06 bỏ section `tours` (hợp lệ theo R7).
 */

export function Places({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const places = data.places.slice(0, 3)

    return (
        <section id="places" style={{ padding: 'var(--space-7) 0 0' }}>
            <div className="h6-container">
                <p className="h6-kicker" style={{ margin: '0 0 var(--space-2)' }}>
                    {t.placesKicker}
                </p>
                <h2
                    className="h6-display"
                    style={{ fontSize: 'var(--font-size-3xl)', margin: '0 0 var(--space-5)' }}
                >
                    {locale === 'vi' ? 'Nam Du nên đi đâu' : 'Where to go on Nam Du'}
                </h2>

                <div
                    style={{
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        aspectRatio: '21 / 9',
                        background: 'var(--color-surface-sand)',
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={data.hero.images?.[1] ?? '/hero-2.jpg'}
                        alt={
                            locale === 'vi'
                                ? 'Bãi biển Nam Du nhìn từ trên cao'
                                : 'A Nam Du beach seen from above'
                        }
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div
                    className="h6-places-cols"
                    style={{
                        display: 'grid',
                        gap: 'var(--space-4)',
                        paddingTop: 'var(--space-5)',
                    }}
                >
                    {places.map((place) => (
                        <div key={place.id} className="h6-place-col">
                            <h3
                                className="h6-display"
                                style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 4px' }}
                            >
                                {pick(place.name, locale)}
                            </h3>
                            <p
                                style={{
                                    margin: '0 0 var(--space-2)',
                                    fontSize: 'var(--font-size-xs)',
                                    fontWeight: 'var(--font-weight-bold)' as never,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-brand)',
                                }}
                            >
                                {pick(place.tag, locale)}
                            </p>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {pick(place.desc, locale)}
                            </p>
                        </div>
                    ))}
                </div>

                {data.tours.length > 0 && (
                    <div style={{ paddingTop: 'var(--space-5)' }}>
                        <p
                            style={{
                                margin: '0 0 var(--space-2)',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-bold)' as never,
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            {t.toursLabel}
                        </p>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            {data.tours.slice(0, 2).map((tour) => (
                                <li
                                    key={tour.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-3) 0',
                                        borderTop: '1px solid var(--color-border-muted)',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: 'var(--font-weight-bold)' as never,
                                            letterSpacing: '0.08em',
                                            color: 'var(--color-brand)',
                                        }}
                                    >
                                        {tour.code}
                                    </span>
                                    <span style={{ fontWeight: 'var(--font-weight-medium)' as never }}>
                                        {pick(tour.name, locale)}
                                    </span>
                                    <span
                                        style={{
                                            marginLeft: 'auto',
                                            fontVariantNumeric: 'tabular-nums',
                                            fontWeight: 'var(--font-weight-bold)' as never,
                                        }}
                                    >
                                        {formatPrice(tour.price, locale)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .h6-places-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .h6-place-col + .h6-place-col {
                        border-left: 1px solid var(--color-border-default);
                        padding-left: var(--space-4);
                    }
                }
            `}</style>
        </section>
    )
}
