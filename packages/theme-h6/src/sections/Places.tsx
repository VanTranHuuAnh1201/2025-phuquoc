import { formatPrice, pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `places` — nhịp nghỉ của trang: full-bleed 60vh + MỘT câu đè.
 * Dưới: hàng địa danh + 2 tour dạng dòng kẻ (code · tên · giá).
 * Dữ liệu tour hiển thị gọn ở đây vì Home mẫu 06 bỏ section `tours`
 * (bỏ bớt hợp lệ theo R7, không đổi tên id).
 */

export function Places({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const oneLine =
        locale === 'vi'
            ? 'Bãi Cây Mến — hàng dừa nghiêng ra mép nước, 15 phút tàu từ resort.'
            : 'Cay Men beach — leaning coconut palms at the waterline, 15 minutes by boat.'

    return (
        <section id="places" style={{ padding: 'var(--space-7) 0 0' }}>
            <div className="h6-places-hero" style={{ position: 'relative', minHeight: '60vh' }}>
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
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(180deg, rgba(20,34,44,0) 45%, rgba(20,34,44,0.55) 100%)',
                    }}
                />
                <p
                    className="h6-display h6-places-line"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 'var(--space-5)',
                        margin: 0,
                        textAlign: 'center',
                        padding: '0 var(--space-4)',
                        fontSize: 'var(--font-size-2xl)',
                        color: 'var(--color-text-inverse)',
                    }}
                >
                    {oneLine}
                </p>
            </div>
            {/* K7: mobile câu chuyển XUỐNG DƯỚI ảnh. */}
            <p
                className="h6-display h6-places-line-mobile"
                style={{
                    display: 'none',
                    margin: 'var(--space-4) 0 0',
                    padding: '0 var(--space-4)',
                    fontSize: 'var(--font-size-xl)',
                    textAlign: 'center',
                }}
            >
                {oneLine}
            </p>

            <div className="h6-container" style={{ paddingTop: 'var(--space-5)' }}>
                <p className="h6-kicker" style={{ margin: '0 0 var(--space-3)' }}>
                    {t.placesKicker}
                </p>
                <p
                    style={{
                        margin: '0 0 var(--space-5)',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '72ch',
                    }}
                >
                    {data.places.map((place, i) => (
                        <span key={place.id}>
                            <strong style={{ color: 'var(--color-text-primary)' }}>
                                {pick(place.name, locale)}
                            </strong>
                            {i < data.places.length - 1 ? ' · ' : ''}
                        </span>
                    ))}
                </p>

                {data.tours.length > 0 && (
                    <div>
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
                @media (max-width: 899.98px) {
                    .h6-places-hero { min-height: 50vh; }
                    .h6-places-line { display: none; }
                    .h6-places-line-mobile { display: block !important; }
                }
            `}</style>
        </section>
    )
}

