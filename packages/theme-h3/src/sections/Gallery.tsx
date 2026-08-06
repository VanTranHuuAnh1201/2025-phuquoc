import { pick, UI, type I18nText, type Locale } from '@repo/core'

import { H3 } from '../strings'
import { SectionHeading } from './SectionHeading'

/**
 * Section `gallery` — lưới 3×3, ảnh THẬT của resort.
 *
 * VÌ SAO KHÔNG PHẢI ẢNH ĐẢO: thư viện của một khách sạn là ảnh cơ sở vật chất
 * — phòng, hồ bơi, nhà hàng, sân hiên. Nội dung "khám phá đảo" đã có chỗ riêng
 * ở section `places` (xem `Panorama.tsx`).
 *
 * VÌ SAO NHẬN `photos` QUA PROP: file ảnh nằm trong `public/` của từng app nên
 * không đi qua package được — app truyền đường dẫn xuống, theme lo bố cục.
 * Đây cũng là chỗ luật R9 được tôn trọng: app quyết định lọc ảnh crawl hay
 * không, theme không có ý kiến.
 *
 * CẮT ĐÚNG 9 ẢNH: lưới 3×3 đầy khít nên không cần ô lấp chỗ.
 */

export interface GalleryPhoto {
    id: string
    src: string
    title: I18nText
}

export interface GalleryProps {
    locale: Locale
    photos: readonly GalleryPhoto[]
    /** Đích của nút "Xem tất cả". */
    galleryHref?: string
}

export function Gallery({ locale, photos, galleryHref = '#contact' }: GalleryProps) {
    const tiles = photos.slice(0, 9)
    if (tiles.length === 0) return null

    return (
        <section
            id="gallery"
            className="bg-surface-raised border-border-muted border-b pt-[26px] pb-[26px] [scroll-margin-top:80px] min-[960px]:pt-[36px] min-[960px]:pb-[36px]"
        >
            {/*
              * Khung và padding khớp các section dùng chung. Số trong class
              * không phải pixel — xem `HostService.tsx`.
              */}
            <div className="mx-auto max-w-[var(--container)] px-4 min-[960px]:px-6">
                <SectionHeading
                    title={pick(H3.realPhotosTitle, locale)}
                    description={pick(H3.realPhotosDesc, locale)}
                    href={galleryHref}
                    actionLabel={pick(UI.viewAll, locale)}
                />

                {/* 3 cột × 3 hàng trên desktop; mobile hạ xuống 2 cột cho ảnh
                    còn đọc được caption (luật P9). */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                    {tiles.map((photo) => (
                        <figure
                            key={photo.id}
                            className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-1 transition-all duration-300 hover:shadow-2"
                        >
                            <img
                                src={photo.src}
                                alt={pick(photo.title, locale)}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                            <figcaption className="text-text-inverse absolute right-3 bottom-3 left-3 text-xs leading-tight font-bold drop-shadow-sm sm:text-sm">
                                {pick(photo.title, locale)}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
