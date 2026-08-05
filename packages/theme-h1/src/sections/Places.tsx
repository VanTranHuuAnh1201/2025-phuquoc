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
        <section id="places" className="pt-7">
            <div className="h6-container">
                <p className="h6-kicker mt-0 mb-2">{t.placesKicker}</p>
                <h2 className="h6-display mt-0 mb-5 text-3xl">
                    {locale === 'vi' ? 'Nam Du nên đi đâu' : 'Where to go on Nam Du'}
                </h2>

                <div className="aspect-[21/9] overflow-hidden rounded-xl bg-[var(--color-surface-sand)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={data.hero.images?.[1] ?? '/hero-2.jpg'}
                        alt={
                            locale === 'vi'
                                ? 'Bãi biển Nam Du nhìn từ trên cao'
                                : 'A Nam Du beach seen from above'
                        }
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Mobile xếp dọc; ≥900px thành 3 cột editorial kẻ dọc ngăn cách —
                    breakpoint riêng của mẫu nên viết arbitrary variant. */}
                <div className="grid gap-4 pt-5 min-[900px]:grid-cols-3">
                    {places.map((place, i) => (
                        <div
                            key={place.id}
                            className={
                                i > 0
                                    ? 'min-[900px]:border-l min-[900px]:border-border-default min-[900px]:pl-4'
                                    : undefined
                            }
                        >
                            <h3 className="h6-display mt-0 mb-1 text-xl">
                                {pick(place.name, locale)}
                            </h3>
                            <p className="mt-0 mb-2 text-xs font-bold tracking-[0.08em] text-brand uppercase">
                                {pick(place.tag, locale)}
                            </p>
                            <p className="m-0 text-sm text-text-secondary">
                                {pick(place.desc, locale)}
                            </p>
                        </div>
                    ))}
                </div>

                {data.tours.length > 0 && (
                    <div className="pt-5">
                        <p className="mt-0 mb-2 text-sm font-bold text-text-secondary">
                            {t.toursLabel}
                        </p>
                        <ul className="m-0 list-none p-0">
                            {data.tours.slice(0, 2).map((tour) => (
                                <li
                                    key={tour.id}
                                    className="flex flex-wrap items-baseline gap-3 border-t border-border-muted py-3"
                                >
                                    <span className="text-xs font-bold tracking-[0.08em] text-brand">
                                        {tour.code}
                                    </span>
                                    <span className="font-medium">{pick(tour.name, locale)}</span>
                                    <span className="ml-auto font-bold [font-variant-numeric:tabular-nums]">
                                        {formatPrice(tour.price, locale)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    )
}
