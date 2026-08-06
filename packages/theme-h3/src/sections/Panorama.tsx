import { pick, UI, type GalleryItem, type Locale } from '@repo/core'

import { SectionHeading } from './SectionHeading'

/**
 * Section `panorama` — bốn khoảnh khắc trên đảo, dẫn sang trang khám phá.
 *
 * VÌ SAO KHÔNG PHẢI `gallery`: nội dung ở đây là các ĐIỂM ĐẾN trên đảo (bãi
 * tắm, hồ bơi, lặn san hô) và nút "Xem tất cả" trỏ sang `/explore` — nó bán
 * trải nghiệm ngoài resort. Section `gallery` của mẫu này đã có chủ: 9 ảnh cơ
 * sở vật chất thật (xem `Gallery.tsx`).
 *
 * VÌ SAO KHÔNG PHẢI `places` NỮA: mẫu này render cả `PlacesSection` dùng chung
 * của `domain-hotel`, và khối đó đeo `id="places"`. Hai thẻ cùng id thì neo
 * `#places` chỉ tới được cái đầu tiên — hỏng lặng lẽ, build vẫn xanh.
 *
 * `panorama` là `CustomSectionId`: id riêng của mẫu, cố ý không thêm vào
 * `SECTION_IDS` vì bộ đó là hợp đồng chung của MỌI mẫu (luật R7).
 *
 * DỮ LIỆU: `data.gallery` của core giữ phần chữ song ngữ; `image` do app bơm
 * vào vì file ảnh nằm trong `public/` của từng app. Mục nào chưa có ảnh thì bỏ
 * qua — thà thiếu một ô còn hơn một khung xám trống.
 */

export interface PanoramaProps {
    locale: Locale
    /** Đã gắn `image` sẵn. Rỗng thì cả section không render. */
    items: readonly GalleryItem[]
    /** Đích của nút "Xem tất cả". */
    exploreHref?: string
}

export function Panorama({ locale, items, exploreHref = '#gallery' }: PanoramaProps) {
    const withImage = items.filter((item) => Boolean(item.image))
    if (withImage.length === 0) return null

    return (
        <section
            id="panorama"
            className="bg-surface-raised border-border-muted border-b py-5 [scroll-margin-top:80px] sm:py-7"
        >
            {/*
              * Khung đọc từ `--container`, padding dừng ở `sm:px-6` — khớp
              * khuôn của các section dùng chung (`domain-hotel`). Bản trước là
              * `max-w-[1280px] … lg:px-8`, tức ở màn ≥1024px khối này thụt vào
              * 32px mỗi bên trong khi section liền kề vẫn đủ 1280px. Xem giải
              * thích đầy đủ ở `HostService.tsx`.
              */}
            <div className="mx-auto max-w-[var(--container)] px-4 sm:px-6">
                <SectionHeading
                    title={pick(UI.momentsAtTheNamDuHill, locale)}
                    description={pick(UI.captureUnforgettableIslandMemories, locale)}
                    href={exploreHref}
                    actionLabel={pick(UI.viewAll, locale)}
                />

                {/* Lưới 2×2 trên mobile, 4 cột trên desktop */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {withImage.map((item) => (
                        <div
                            key={item.id}
                            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg shadow-1 transition-all duration-300 hover:shadow-2"
                        >
                            <img
                                src={item.image}
                                alt={pick(item.title, locale)}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Lớp phủ tối dần từ đáy — chữ trắng phải đọc được
                                trên mọi ảnh, kể cả ảnh sáng (luật D4). */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="text-text-inverse absolute right-3 bottom-3 left-3">
                                <h3 className="text-xs leading-tight font-bold drop-shadow-sm sm:text-sm">
                                    {pick(item.title, locale)}
                                </h3>
                                <p className="text-text-inverse/80 mt-0.5 line-clamp-1 text-[10px] font-normal sm:text-xs">
                                    {pick(item.subtitle, locale)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
