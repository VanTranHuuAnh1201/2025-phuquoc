import type { Locale, PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { ui } from '../strings'
import { Heading } from './Kicker'

/**
 * Thư viện ảnh — lưới mosaic, ô đầu tiên chiếm 2×2 và bo 30px.
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
                padding: '76px var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div style={{ marginBottom: 36 }}>
                    <Heading kicker={t.galleryKicker} title={t.galleryTitle} align="center" />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                        gridAutoRows: '186px',
                        gap: 'var(--space-4)',
                    }}
                >
                    {TILES.map((tile, index) => {
                        const featured = index === 0
                        const radius = featured ? 30 : 'var(--radius-lg)'
                        return (
                            <div
                                key={tile.en}
                                style={{
                                    gridColumn: featured ? 'span 2' : undefined,
                                    gridRow: featured ? 'span 2' : undefined,
                                    borderRadius: radius,
                                    overflow: 'hidden',
                                }}
                            >
                                <ImageSlot
                                    placeholder={tile[locale]}
                                    src={images[index]}
                                    height="100%"
                                    style={{ borderRadius: radius }}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
