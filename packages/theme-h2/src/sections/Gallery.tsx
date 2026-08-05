import type { Locale, PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

/**
 * Ảnh thật tại resort.
 *
 * Bản thiết kế bỏ lưới mosaic của mẫu 01, thay bằng một hàng năm ảnh đều
 * nhau — desktop dàn hết chiều ngang, mobile cuộn ngang.
 *
 * Ảnh lấy từ `data.rooms` khi có; chỗ nào thiếu thì `ImageSlot` giữ đúng ô
 * trong lưới để bố cục không sập (xem chú thích trong ImageSlot về luật R9).
 */

const TILES = [
    { vi: 'Phòng nghỉ', en: 'Guest room' },
    { vi: 'Hồ bơi', en: 'Swimming pool' },
    { vi: 'Bãi Cây Mến', en: 'Cay Men beach' },
    { vi: 'BBQ hải sản', en: 'Seafood BBQ' },
    { vi: 'Hoàng hôn', en: 'Sunset' },
] as const

export function Gallery({ data, locale }: { data: PropertyData; locale: Locale }) {
    const sectionTitle = locale === 'vi' ? 'Ảnh thật tại resort' : 'Real photos at the resort'
    const linkLabel = locale === 'vi' ? 'Xem tất cả' : 'View all'

    // Gom ảnh sẵn có từ các hạng phòng — nguồn duy nhất là `core` (luật R8).
    const images = data.rooms.flatMap((room) => room.images ?? [])

    return (
        <section id="gallery" className="h7-gallery">
            <div className="h7-gallery-inner">
                <div className="h7-sec-head">
                    <h2 className="h7-sec-title">{sectionTitle}</h2>
                    <a href="#contact" className="h7-sec-link">
                        {linkLabel}
                        <span aria-hidden="true">→</span>
                    </a>
                </div>

                <div className="h7-gallery-rail">
                    {TILES.map((tile, index) => (
                        <div key={tile.en} className="h7-gtile">
                            <ImageSlot
                                placeholder={tile[locale]}
                                src={images[index]}
                                height="100%"
                                style={{ borderRadius: 'var(--radius)' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .h7-gallery {
                    background: var(--surface);
                    padding: 26px 0 8px;
                    scroll-margin-top: 80px;
                }
                .h7-gallery-inner { max-width: var(--container); margin: 0 auto; }

                .h7-gallery-rail {
                    display: grid;
                    grid-auto-flow: column;
                    grid-auto-columns: 52vw;
                    gap: 10px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding: 4px var(--space-4) 18px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .h7-gallery-rail::-webkit-scrollbar { display: none; }

                .h7-gtile {
                    scroll-snap-align: start;
                    height: 120px;
                    border-radius: var(--radius);
                    overflow: hidden;
                }

                @media (min-width: 960px) {
                    .h7-gallery { padding: 36px 0 12px; }
                    .h7-gallery-rail {
                        grid-auto-flow: row;
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                        grid-auto-columns: auto;
                        gap: 14px;
                        overflow-x: visible;
                        padding: 4px var(--space-6) 8px;
                    }
                    .h7-gtile { height: 150px; }
                }
            `}</style>
        </section>
    )
}
