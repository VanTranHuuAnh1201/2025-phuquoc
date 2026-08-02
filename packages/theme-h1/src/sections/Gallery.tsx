import type { Locale, PropertyData } from '@repo/core'
import { ImageSlot, SectionHeader } from '@repo/ui'

import { ui } from '../strings'

/**
 * Thư viện ảnh — lưới mosaic, ô đầu tiên chiếm 2×2.
 *
 * Ảnh lấy từ `data.rooms` khi có; chỗ nào thiếu thì `ImageSlot` giữ đúng ô
 * trong lưới để bố cục không sập (xem chú thích trong ImageSlot về luật R9).
 */

const TILES = [
    { vi: 'Ảnh nổi bật', en: 'Featured' },
    { vi: 'Hồ bơi', en: 'Swimming pool' },
    { vi: 'Bãi Cây Mến', en: 'Cay Men beach' },
    { vi: 'BBQ hải sản', en: 'Seafood BBQ' },
    { vi: 'Hoàng hôn', en: 'Sunset' },
] as const

export function Gallery({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    // Gom ảnh sẵn có từ các hạng phòng — nguồn duy nhất là `core` (luật R8).
    const images = data.rooms.flatMap((room) => room.images ?? [])

    return (
        <section
            id="gallery"
            style={{
                background: 'var(--surface)',
                padding: 'var(--space-16) var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader kicker={t.galleryKicker} title={t.galleryTitle} align="center" />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                        gridAutoRows: '180px',
                        gap: 'var(--space-3)',
                    }}
                >
                    {TILES.map((tile, index) => (
                        <div
                            key={tile.en}
                            style={{
                                gridColumn: index === 0 ? 'span 2' : undefined,
                                gridRow: index === 0 ? 'span 2' : undefined,
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}
                        >
                            <ImageSlot
                                placeholder={tile[locale]}
                                src={images[index]}
                                height="100%"
                                style={{ borderRadius: 'var(--radius-lg)' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
