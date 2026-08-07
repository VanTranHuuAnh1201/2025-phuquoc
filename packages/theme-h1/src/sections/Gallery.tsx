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
            alt: pick(
                {
                    vi: `Ảnh thật — ${pick(room.name, locale)}`,
                    en: `Real photo — ${pick(room.name, locale)}`,
                },
                locale,
            ),
        })
        if (shots.length === 8) break
    }

    if (shots.length === 0) return null

    return (
        <section id="gallery" className="overflow-hidden pt-7">
            <div className="h6-container">
                <p className="h6-kicker mt-0 mb-4">{t.galleryKicker}</p>
            </div>
            <div className="h6-container overflow-visible">
                <div
                    role="list"
                    className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_proximity]"
                >
                    {shots.map((shot, index) => (
                        <div
                            key={shot.src}
                            role="listitem"
                            className={[
                                'shrink-0 overflow-hidden rounded-md [scroll-snap-align:start]',
                                'bg-[var(--color-surface-sand)]',
                                'h-[200px] md:h-[240px]',
                                // Nhịp rộng–hẹp xen kẽ cho hàng ảnh vuông 1000×1000 crawl.
                                index % 3 === 1
                                    ? 'w-[300px] md:w-[400px]'
                                    : 'w-[240px] md:w-[300px]',
                            ].join(' ')}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={shot.src}
                                alt={shot.alt}
                                loading="lazy"
                                className="block h-full w-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
