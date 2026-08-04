import { formatPrice, pick, themePath, tourPath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'

const SLUG = meta.slug

/**
 * Khám phá Nam Du — điểm đến quanh đảo, kèm cột combo bên phải.
 *
 * Bản thiết kế desktop chia section này làm hai phần trong cùng một hàng:
 * ba thẻ điểm đến bên trái, hai thẻ combo dạng ngang xếp dọc bên phải. Mobile
 * bỏ cột combo khỏi hàng ngang và cho cả hai cùng cuộn — combo vẫn tới được
 * qua trang `/h7/tours`, nên không mất đường dẫn nào.
 */

export function Places({ data, locale, slug = 'h7' }: { data: PropertyData; locale: Locale; slug?: string }) {
    const sectionTitle = locale === 'vi' ? 'Khám phá Nam Du' : 'Explore Nam Du'
    const linkLabel = locale === 'vi' ? 'Xem tất cả' : 'View all'

    const places = data.places.slice(0, 3)
    const tours = data.tours.slice(0, 2)

    return (
        <section id="places" className="h7-places">
            <div className="h7-places-inner">
                <div className="h7-sec-head">
                    <h2 className="h7-sec-title">{sectionTitle}</h2>
                    <a href={themePath(slug, 'blog')} className="h7-sec-link">
                        {linkLabel}
                        <span aria-hidden="true">→</span>
                    </a>
                </div>

                <div className="h7-places-grid">
                    <div className="h7-places-rail">
                        {places.map((place) => (
                            <article key={place.id} className="h7-place">
                                <div className="h7-place-media">
                                    <ImageSlot
                                        placeholder={pick(place.name, locale)}
                                        src={place.image}
                                        height={150}
                                        style={{ borderRadius: 'var(--radius)' }}
                                    />
                                    <span className="h7-place-tag">{pick(place.tag, locale)}</span>
                                </div>
                                <h3 className="h7-place-name">{pick(place.name, locale)}</h3>
                                <p className="h7-place-desc">{pick(place.desc, locale)}</p>
                            </article>
                        ))}
                    </div>

                    {/* Cột combo — thẻ ngang, ảnh trái, tên + giá phải. */}
                    <div className="h7-combos">
                        {tours.map((tour) => (
                            <a key={tour.id} href={tourPath(slug, tour.id)} className="h7-combo">
                                <span className="h7-combo-media">
                                    <ImageSlot
                                        placeholder={pick(tour.name, locale)}
                                        height={78}
                                        style={{ borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <span className="h7-combo-badge">{tour.code}</span>
                                </span>
                                <span className="h7-combo-body">
                                    <span className="h7-combo-name">{pick(tour.name, locale)}</span>
                                    <span className="h7-combo-price">
                                        {formatPrice(tour.price, locale)}
                                    </span>
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .h7-places {
                    background: var(--surface);
                    padding: 26px 0 8px;
                    scroll-margin-top: 80px;
                }
                .h7-places-inner { max-width: var(--container); margin: 0 auto; }
                .h7-places-grid { display: grid; gap: 14px; }

                .h7-places-rail {
                    display: grid;
                    grid-auto-flow: column;
                    grid-auto-columns: 68vw;
                    gap: 12px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding: 4px var(--space-4) 6px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .h7-places-rail::-webkit-scrollbar { display: none; }

                .h7-place { scroll-snap-align: start; min-width: 0; }
                .h7-place-media { position: relative; }
                .h7-place-tag {
                    position: absolute;
                    left: 9px;
                    bottom: 9px;
                    padding: 4px 10px;
                    border-radius: var(--radius-sm);
                    background: rgba(255,255,255,0.92);
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text);
                }
                .h7-place-name {
                    font-size: 14.5px;
                    font-weight: 700;
                    color: var(--text);
                    margin: 10px 0 4px;
                    line-height: 1.4;
                }
                .h7-place-desc {
                    font-size: 12.5px;
                    line-height: 1.6;
                    color: var(--text-muted);
                    margin: 0;
                }

                .h7-combos {
                    display: grid;
                    gap: 10px;
                    padding: 0 var(--space-4) 12px;
                }
                .h7-combo {
                    display: grid;
                    grid-template-columns: 92px 1fr;
                    gap: 11px;
                    align-items: center;
                    padding: 8px;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    background: var(--surface);
                    text-decoration: none;
                    transition: border-color 180ms ease, box-shadow 180ms ease;
                }
                .h7-combo:hover { border-color: var(--brand); box-shadow: var(--shadow-sm); }
                .h7-combo:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
                .h7-combo-media { position: relative; display: block; }
                .h7-combo-badge {
                    position: absolute;
                    left: 6px;
                    top: 6px;
                    padding: 2px 7px;
                    border-radius: 4px;
                    background: rgba(255,255,255,0.92);
                    font-size: 10px;
                    font-weight: 700;
                    color: var(--text);
                }
                .h7-combo-body { display: grid; gap: 6px; min-width: 0; }
                .h7-combo-name {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: var(--text);
                    line-height: 1.4;
                }
                .h7-combo-price {
                    font-size: 15px;
                    font-weight: 800;
                    color: var(--text);
                    font-variant-numeric: tabular-nums;
                }

                @media (min-width: 960px) {
                    .h7-places { padding: 36px 0 12px; }
                    .h7-places-grid {
                        grid-template-columns: minmax(0, 2.15fr) minmax(0, 1fr);
                        gap: 20px;
                        padding: 0 var(--space-6);
                        align-items: start;
                    }
                    .h7-places-rail {
                        grid-auto-flow: row;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        grid-auto-columns: auto;
                        gap: 18px;
                        overflow-x: visible;
                        padding: 4px 0;
                    }
                    .h7-combos { padding: 4px 0; gap: 14px; }
                }

                @media (min-width: 640px) and (max-width: 959px) {
                    .h7-places-rail {
                        grid-auto-flow: row;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        grid-auto-columns: auto;
                        overflow-x: visible;
                    }
                    .h7-combos { grid-template-columns: 1fr 1fr; }
                }
            `}</style>
        </section>
    )
}
