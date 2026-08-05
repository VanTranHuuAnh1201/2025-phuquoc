import { formatPrice, pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `places` — nhịp nghỉ của trang: full-bleed 60vh + MỘT câu đè,
 * canh trái theo cùng trục container với mọi section khác (một giọng, K1).
 * Dưới ảnh là band cát chứa hàng địa danh + 2 tour dạng dòng kẻ — dữ liệu
 * tour hiện gọn ở đây vì Home mẫu 05 bỏ section `tours` (hợp lệ theo R7).
 */

export function Places({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const oneLine =
        locale === 'vi'
            ? 'Bãi Cây Mến — hàng dừa nghiêng ra mép nước, 15 phút tàu từ resort.'
            : 'Cay Men beach — leaning coconut palms at the waterline, 15 minutes by boat.'

    return (
        <section id="places" style={{ paddingTop: 'var(--space-7)' }}>
            <div className="h5-places-hero" style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'flex-end' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={data.hero.images?.[1] ?? '/hero-2.jpg'}
                    alt={
                        locale === 'vi'
                            ? 'Bãi biển Nam Du nhìn từ trên cao'
                            : 'A Nam Du beach seen from above'
                    }
                    loading="lazy"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--scrim-fade)' }} />
                <div className="h5-container" style={{ position: 'relative', width: '100%', paddingBottom: 'var(--space-5)' }}>
                    <p
                        className="h5-display h5-places-line"
                        style={{
                            margin: 0,
                            maxWidth: '30ch',
                            fontSize: 'var(--font-size-2xl)',
                            color: 'var(--color-text-inverse)',
                        }}
                    >
                        {oneLine}
                    </p>
                </div>
            </div>
            {/* K7: mobile câu chuyển XUỐNG DƯỚI ảnh. */}
            <p
                className="h5-display h5-places-line-mobile"
                style={{
                    display: 'none',
                    margin: 'var(--space-4) 0 0',
                    padding: '0 var(--space-4)',
                    fontSize: 'var(--font-size-xl)',
                }}
            >
                {oneLine}
            </p>

            {/* ---- band cát: địa danh + tour ---- */}
            <div style={{ background: 'var(--color-surface-sand)' }}>
                <div
                    className="h5-container h5-places-band"
                    style={{
                        display: 'grid',
                        gap: 'var(--space-5)',
                        paddingTop: 'var(--space-5)',
                        paddingBottom: 'var(--space-5)',
                    }}
                >
                    <div>
                        <p className="h5-kicker" style={{ margin: '0 0 var(--space-3)' }}>
                            {t.placesKicker}
                        </p>
                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', maxWidth: '46ch' }}>
                            {data.places.map((place, i) => (
                                <span key={place.id}>
                                    <strong style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' as never }}>
                                        {pick(place.name, locale)}
                                    </strong>
                                    {i < data.places.length - 1 ? ' · ' : ''}
                                </span>
                            ))}
                        </p>
                    </div>

                    {data.tours.length > 0 && (
                        <div>
                            <p
                                className="h5-kicker"
                                style={{ margin: '0 0 var(--space-3)' }}
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
                                            borderTop: '1px solid var(--color-border-default)',
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
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .h5-places-band { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); }
                }
                @media (max-width: 899.98px) {
                    .h5-places-hero { min-height: 50vh; }
                    .h5-places-line { display: none; }
                    .h5-places-line-mobile { display: block !important; }
                }
            `}</style>
        </section>
    )
}
