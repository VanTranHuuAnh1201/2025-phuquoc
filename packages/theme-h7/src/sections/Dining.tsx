import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

/**
 * Ẩm thực — bốn điểm ăn uống trong resort.
 *
 * Desktop: lưới 4 cột, mỗi thẻ ảnh trên · tên · giờ mở cửa · mô tả.
 * Mobile : băng cuộn ngang cùng cơ chế với Rooms (dùng chung lớp `.h7-rail`
 *          khai ở đây và ở Places — mỗi section tự khai để không phụ thuộc
 *          thứ tự render, nhưng cùng một quy tắc thị giác).
 */

export function Dining({ data, locale }: { data: PropertyData; locale: Locale }) {
    const sectionTitle = locale === 'vi' ? 'Ẩm thực' : 'Dining'
    const linkLabel = locale === 'vi' ? 'Xem thực đơn & dịch vụ' : 'View menu & services'

    return (
        <section id="dining" className="h7-dining">
            <div className="h7-dining-inner">
                <div className="h7-sec-head">
                    <h2 className="h7-sec-title">{sectionTitle}</h2>
                    <a href="#contact" className="h7-sec-link">
                        {linkLabel}
                        <span aria-hidden="true">→</span>
                    </a>
                </div>

                <div className="h7-dining-rail">
                    {data.dining.map((venue) => (
                        <article key={venue.id} className="h7-dine">
                            <ImageSlot
                                placeholder={pick(venue.name, locale)}
                                height={160}
                                style={{ borderRadius: 'var(--radius)' }}
                            />
                            <h3 className="h7-dine-name">{pick(venue.name, locale)}</h3>
                            <p className="h7-dine-note">{pick(venue.note, locale)}</p>
                            <p className="h7-dine-desc">{pick(venue.desc, locale)}</p>
                        </article>
                    ))}
                </div>
            </div>

            <style>{`
                .h7-dining {
                    background: var(--surface);
                    padding: 26px 0 8px;
                    scroll-margin-top: 80px;
                }
                .h7-dining-inner { max-width: var(--container); margin: 0 auto; }

                .h7-dining-rail {
                    display: grid;
                    grid-auto-flow: column;
                    grid-auto-columns: 68vw;
                    gap: 12px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding: 4px var(--space-4) 18px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .h7-dining-rail::-webkit-scrollbar { display: none; }

                .h7-dine { scroll-snap-align: start; min-width: 0; }
                .h7-dine-name {
                    font-size: 14.5px;
                    font-weight: 700;
                    color: var(--text);
                    line-height: 1.4;
                    margin: 11px 0 4px;
                }
                .h7-dine-note {
                    font-size: 12.5px;
                    font-weight: 600;
                    color: var(--brand);
                    margin: 0 0 5px;
                }
                .h7-dine-desc {
                    font-size: 12.5px;
                    line-height: 1.6;
                    color: var(--text-muted);
                    margin: 0;
                }

                @media (min-width: 960px) {
                    .h7-dining { padding: 36px 0 12px; }
                    .h7-dining-rail {
                        grid-auto-flow: row;
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        grid-auto-columns: auto;
                        gap: 20px;
                        overflow-x: visible;
                        padding: 4px var(--space-6) 8px;
                    }
                }

                @media (min-width: 640px) and (max-width: 959px) {
                    .h7-dining-rail {
                        grid-auto-flow: row;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        grid-auto-columns: auto;
                        overflow-x: visible;
                    }
                }
            `}</style>
        </section>
    )
}
