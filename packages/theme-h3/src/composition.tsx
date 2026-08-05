import type { ReactNode } from 'react'
import type { GalleryItem, Locale, PropertyData, SectionId } from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from './meta'
import { Gallery, type GalleryPhoto } from './sections/Gallery'
import { Hero, type HeroSearchParams, type HeroSlide } from './sections/Hero'
import { HostService } from './sections/HostService'
import { Panorama } from './sections/Panorama'

/**
 * Bố cục mẫu 03 — Coastal Navy.
 *
 * MAP SECTION ID (luật R7 — bộ id không được đổi tên):
 *
 *   Hero        → `top`      hiển nhiên: ảnh mở màn + thanh tìm phòng
 *   HostService → `about`    "ở đây là nơi thế nào, ai đón mình" + review.
 *                            Bản gốc ở app đeo `id="experience"`, không nằm
 *                            trong bộ id của R7 nên CMS/deep-link không neo
 *                            được — đổi về `about`.
 *   Panorama    → `places`   nội dung là ĐIỂM ĐẾN trên đảo và nút dẫn sang
 *                            trang khám phá. Không dùng `gallery` vì id đó đã
 *                            có chủ ở dưới, và hai khối cùng id là hỏng neo.
 *   Gallery     → `gallery`  9 ảnh cơ sở vật chất thật của resort.
 *
 * `rooms`/`dining`/`tours`/`booking`/`contact` chưa có trong bản chuyển này —
 * theme được bỏ bớt section, chỉ không được đổi tên id. Mảng `sections` dưới
 * đây khai đúng những gì thật sự render, để hub và điều hướng không trỏ vào
 * chỗ trống.
 */

export const sections: readonly SectionId[] = ['top', 'about', 'places', 'gallery'] as const

export interface HomeProps {
    data: PropertyData
    locale: Locale
    /** Chèn thêm vào header — vd nút chuyển ngôn ngữ riêng của app. */
    extra?: ReactNode

    /**
     * ĐƯỜNG DẪN ẢNH DO APP CẤP.
     *
     * VÌ SAO KHÔNG ĐỌC TỪ `data`: file ảnh nằm trong `public/` của TỪNG app và
     * mỗi app một cấu trúc khác nhau, nên `core` chỉ giữ phần chữ song ngữ.
     * App bơm đường dẫn xuống — cũng là chỗ luật R9 được tôn trọng: app quyết
     * định có loại ảnh crawl hay không.
     */
    heroSlides?: readonly HeroSlide[]
    /**
     * Mục cho section `places`, ĐÃ gắn `image`. Không truyền thì rơi về
     * `data.gallery` — bản của core không kèm ảnh nên section sẽ tự ẩn, đúng
     * hơn là render một lưới khung xám.
     */
    panoramaItems?: readonly GalleryItem[]
    /** 9 ảnh thật cho section `gallery`. Rỗng thì section tự ẩn. */
    photos?: readonly GalleryPhoto[]

    /** Người dùng bấm tìm phòng. Không truyền thì nút rơi về `searchHref`. */
    onSearch?: (params: HeroSearchParams) => void
    searchHref?: string
    exploreHref?: string
    galleryHref?: string
}

/**
 * `overflow-x-clip` chứ KHÔNG phải `overflow-x-hidden`.
 *
 * Spec CSS: khi một trục là `hidden` còn trục kia `visible`, trình duyệt âm thầm
 * đổi trục `visible` thành `auto`. Nên `overflow-x: hidden` biến phần tử này
 * thành scroll container, và mọi `position: sticky` bên trong dính vào NÓ thay
 * vì vào viewport.
 *
 * `clip` chặn tràn ngang y hệt nhưng không tạo scroll container.
 */
export function Home({
    data,
    locale,
    extra,
    heroSlides = [],
    panoramaItems,
    photos = [],
    onSearch,
    searchHref,
    exploreHref,
    galleryHref,
}: HomeProps) {
    // Tiện ích đi kèm: lấy thẳng từ `data.amenities` (luật R8 — một nguồn sự
    // thật). App không phải bơm thêm gì.
    const perks = data.amenities ?? []
    const reviews = data.reviews ?? []
    const places = panoramaItems ?? data.gallery ?? []

    return (
        <div data-theme="h3" className="font-primary overflow-x-clip">
            <SiteHeader
                {...siteHeaderPropsOf(data, locale, meta.slug)}
                extra={extra}
                transparentOnTop
            />
            <main>
                <Hero
                    locale={locale}
                    slides={heroSlides}
                    onSearch={onSearch}
                    searchHref={searchHref}
                />
                <HostService locale={locale} perks={perks} reviews={reviews} />
                <Panorama locale={locale} items={places} exploreHref={exploreHref} />
                <Gallery locale={locale} photos={photos} galleryHref={galleryHref} />
            </main>
            <SiteFooter {...siteFooterPropsOf(data, locale, meta.slug)} />
        </div>
    )
}
