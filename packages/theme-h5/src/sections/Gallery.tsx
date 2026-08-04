import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'
import { SectionHead } from '../components/SectionHead'
import { roomCover } from '../components/photos'

/**
 * Section `gallery` — lưới bất đối xứng 9 ảnh (1 ảnh 2×2 + 8 ảnh đơn = đúng
 * 3 hàng × 4 cột, không để lỗ hổng), gap 8px.
 *
 * Nguồn ảnh: cover ĐƠN của các hạng phòng trong core, qua bộ lọc chung
 * `roomCover()` — cấm poster `sua-tam-*` và collage (spec §8.1).
 */

export function Gallery({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    const shots: { src: string; alt: string }[] = []
    const seen = new Set<string>()
    for (const room of data.rooms) {
        const src = roomCover(room)
        if (!src || seen.has(src)) continue
        seen.add(src)
        shots.push({
            src,
            alt:
                locale === 'vi'
                    ? `Ảnh thật — ${pick(room.name, locale)}`
                    : `Real photo — ${pick(room.name, locale)}`,
        })
        if (shots.length === 9) break
    }

    if (shots.length === 0) return null

    return (
        <section id="gallery" style={{ padding: 'var(--space-7) 0 0' }}>
            <div className="h5-container">
                <SectionHead
                    kicker={locale === 'vi' ? 'Thư viện ảnh' : 'Gallery'}
                    title={t.galleryKicker}
                />
                <div className="h5-gallery-grid">
                    {shots.map((shot, i) => (
                        <div
                            key={shot.src}
                            className={i === 0 ? 'h5-gallery-big' : undefined}
                            style={{
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                background: 'var(--color-surface-sand)',
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={shot.src}
                                alt={shot.alt}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .h5-gallery-grid {
                    display: grid;
                    gap: 8px;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    grid-auto-rows: 150px;
                }
                @media (min-width: 900px) {
                    .h5-gallery-grid {
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        grid-auto-rows: 180px;
                    }
                    .h5-gallery-big { grid-column: span 2; grid-row: span 2; }
                }
            `}</style>
        </section>
    )
}
