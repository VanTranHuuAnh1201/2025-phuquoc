import type { Locale, PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { ui } from '../strings'

/**
 * Thư viện ảnh — lưới mosaic trên nền nhạt, ô đầu tiên chiếm 2×2 và bo góc
 * cực mềm (gấp đôi `--radius-lg`), giống ô ảnh lớn ở section about.
 *
 * Ảnh lấy từ `data.rooms` khi có; chỗ nào thiếu thì `ImageSlot` giữ đúng ô
 * trong lưới để bố cục không sập (luật R9).
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
    const images = data.rooms.flatMap((room) => room.images ?? [])

    return (
        <section
            id="gallery"
            style={{
                background: 'var(--surface-alt)',
                padding: '76px var(--space-6) var(--space-20)',
                scrollMarginTop: '110px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 800,
                            color: 'var(--accent-dark)',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {t.galleryKicker}
                    </div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            lineHeight: 1.16,
                            fontWeight: 900,
                            color: 'var(--brand)',
                            letterSpacing: '-0.035em',
                            margin: 0,
                            textWrap: 'balance',
                        }}
                    >
                        {t.galleryTitle}
                    </h2>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
                        gridAutoRows: '182px',
                        gap: 'var(--space-3)',
                    }}
                >
                    {TILES.map((tile, index) => {
                        const featured = index === 0
                        return (
                            <div
                                key={tile.en}
                                style={{
                                    gridColumn: featured ? 'span 2' : undefined,
                                    gridRow: featured ? 'span 2' : undefined,
                                    borderRadius: featured
                                        ? 'calc(var(--radius-lg) * 2)'
                                        : 'var(--radius-lg)',
                                    overflow: 'hidden',
                                }}
                            >
                                <ImageSlot
                                    placeholder={tile[locale]}
                                    src={images[index]}
                                    height="100%"
                                    style={{ borderRadius: 'inherit' }}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
