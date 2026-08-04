import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `gallery` — lưới bất đối xứng 7 ảnh, một ảnh 2×2, gap 8px.
 *
 * Nguồn ảnh: cover ĐƠN của các hạng phòng trong core. Cấm `sua-tam-*`
 * (poster marketing gắn logo) và hạn chế `*-full` (collage 3-trong-1) —
 * khảo sát spec §8.1.
 */

/** Ảnh không được phép vào gallery: poster có logo, collage ghép. */
function usableInGallery(src: string): boolean {
    return !src.includes('sua-tam') && !src.includes('-full') && !src.includes('_full')
}

export function Gallery({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    const shots: { src: string; alt: string }[] = []
    const seen = new Set<string>()
    for (const room of data.rooms) {
        const src = room.images?.find(usableInGallery)
        if (!src || seen.has(src)) continue
        seen.add(src)
        shots.push({
            src,
            alt:
                locale === 'vi'
                    ? `Ảnh thật — ${pick(room.name, locale)}`
                    : `Real photo — ${pick(room.name, locale)}`,
        })
        if (shots.length === 7) break
    }

    if (shots.length === 0) return null

    return (
        <section id="gallery" style={{ padding: 'var(--space-7) 0 0' }}>
            <div className="h5-container">
                <p className="h5-kicker" style={{ margin: '0 0 var(--space-4)' }}>
                    {t.galleryKicker}
                </p>
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
