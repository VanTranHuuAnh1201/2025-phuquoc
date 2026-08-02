import type { Locale, PropertyData } from '@repo/core'
import { ImageSlot, SectionHeader } from '@repo/ui'

import { ui } from '../strings'

/**
 * Thư viện ảnh — mosaic năm ô: ô đầu 2×2 bo góc 50px, hai ô giữa trải ngang
 * hai cột. Lưới năm cột của prototype đổi sang `auto-fit` để co giãn được;
 * `span 2` vẫn giữ đúng nhịp khi còn đủ cột, và tự xẹp khi hẹp.
 */

const TILES = [
    { vi: 'Ảnh nổi bật', en: 'Featured', col: 2, row: 2 },
    { vi: 'Hồ bơi', en: 'Swimming pool', col: 1, row: 1 },
    { vi: 'Bãi Cây Mến', en: 'Cay Men beach', col: 2, row: 1 },
    { vi: 'BBQ hải sản', en: 'Seafood BBQ', col: 2, row: 1 },
    { vi: 'Hoàng hôn', en: 'Sunset', col: 1, row: 1 },
] as const

export function Gallery({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    // Nguồn ảnh duy nhất vẫn là `core` (luật R8).
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
                <SectionHeader kicker={t.galleryKicker} title={t.galleryTitle} align="center" />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                        gridAutoRows: '180px',
                        gap: 'var(--space-3)',
                    }}
                >
                    {TILES.map((tile, index) => {
                        const radius = index === 0 ? 50 : 'var(--radius-lg)'
                        return (
                            <div
                                key={tile.en}
                                style={{
                                    gridColumn: tile.col > 1 ? `span ${tile.col}` : undefined,
                                    gridRow: tile.row > 1 ? `span ${tile.row}` : undefined,
                                    borderRadius: radius,
                                    overflow: 'hidden',
                                }}
                            >
                                <ImageSlot
                                    placeholder={tile[locale]}
                                    src={images[index]}
                                    height="100%"
                                    style={{
                                        borderRadius: radius,
                                        background: 'var(--surface-tint)',
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
