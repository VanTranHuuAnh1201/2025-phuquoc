import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `gallery` — FILMSTRIP một hàng cuộn ngang (desktop lộ ~4 khung, mép
 * phải cắt dở để mời cuộn) thay cho lưới mosaic các mẫu trước. Cuộn ngang có
 * chủ đích của carousel — không phải bảng (ngoại lệ K7 hợp lệ).
 *
 * Nguồn ảnh: cover ĐƠN của các hạng phòng trong core. Cấm `sua-tam-*`
 * (poster marketing gắn logo) và `*-full` (collage) — khảo sát spec §9.1.
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
        if (shots.length === 8) break
    }

    if (shots.length === 0) return null

    return (
        <section id="gallery" style={{ padding: 'var(--space-7) 0 0', overflow: 'hidden' }}>
            <div className="h6-container">
                <p className="h6-kicker" style={{ margin: '0 0 var(--space-4)' }}>
                    {t.galleryKicker}
                </p>
            </div>
            <div className="h6-container" style={{ overflow: 'visible' }}>
                <div className="h6-filmstrip" role="list">
                    {shots.map((shot) => (
                        <div
                            key={shot.src}
                            role="listitem"
                            style={{
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                background: 'var(--color-surface-sand)',
                                flexShrink: 0,
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={shot.src}
                                alt={shot.alt}
                                loading="lazy"
                                style={{
                                    display: 'block',
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .h6-filmstrip {
                    display: flex;
                    gap: var(--space-2);
                    overflow-x: auto;
                    scroll-snap-type: x proximity;
                    padding-bottom: var(--space-2);
                    -webkit-overflow-scrolling: touch;
                }
                .h6-filmstrip > div {
                    width: 300px;
                    height: 240px;
                    scroll-snap-align: start;
                }
                /* Nhịp rộng–hẹp xen kẽ cho hàng ảnh vuông 1000×1000 crawl. */
                .h6-filmstrip > div:nth-child(3n + 2) { width: 400px; }
                @media (max-width: 899.98px) {
                    .h6-filmstrip > div { width: 240px; height: 200px; }
                    .h6-filmstrip > div:nth-child(3n + 2) { width: 300px; }
                }
            `}</style>
        </section>
    )
}
