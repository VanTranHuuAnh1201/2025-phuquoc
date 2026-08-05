import type { ReactNode } from 'react'
import { themePath, type GalleryItem, type Locale, type PropertyData, type ThemeSectionId } from '@repo/core'
import {
    AboutSection,
    DiningSection,
    HERO_SLIDES,
    PlacesSection,
    PracticalSection,
    RESORT_PHOTOS,
    RoomsSection,
    galleryWithImages,
    siteFooterPropsOf,
    siteHeaderPropsOf,
} from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { SECTION_HEADINGS } from './headings'
import { ui } from './strings'

import { meta } from './meta'
import { Gallery, type GalleryPhoto } from './sections/Gallery'
import { Hero, type HeroSearchParams, type HeroSlide } from './sections/Hero'
import { HostService } from './sections/HostService'
import { Panorama } from './sections/Panorama'

/**
 * Bố cục mẫu 03 — Coastal Navy.
 *
 * HAI NGUỒN SECTION, MỘT MẪU:
 *
 *   riêng của mẫu (`./sections/`)     Hero · HostService · Panorama · Gallery
 *   dùng chung (`@repo/domain-hotel`) About · Rooms · Dining · Places · Practical
 *
 * Bốn khối riêng là những chỗ mẫu 03 trình bày khác hẳn; năm khối dùng chung
 * có cùng bố cục ở mọi mẫu và chỉ khác token, nên chúng sống ở tầng domain
 * (luật R1 — hai mẫu cùng domain cần chung thì đẩy lên `domain-*`, không chép).
 *
 * MAP SECTION ID (luật R7 — bộ id chuẩn không được đổi tên):
 *
 *   Hero       → `top`        ảnh mở màn + thanh tìm phòng
 *   About      → `about`      giới thiệu cơ sở  (khối dùng chung)
 *   Panorama   → `panorama`   ← id RIÊNG, xem dưới
 *   Rooms      → `rooms`      (khối dùng chung)
 *   Dining     → `dining`     (khối dùng chung)
 *   Places     → `places`     điểm đến trên đảo (khối dùng chung)
 *   HostService→ `host`       ← id RIÊNG, xem dưới
 *   Gallery    → `gallery`    9 ảnh cơ sở vật chất thật
 *   Practical  → (không id)   cách đến nơi, lưu ý, FAQ (khối dùng chung).
 *                             Cố ý không neo: đây là phần bổ trợ đọc-rồi-đi,
 *                             không phải một dải nội dung điều hướng trỏ tới.
 *
 * VÌ SAO `panorama` VÀ `host` LÀ ID RIÊNG: hai khối đó từng đeo `places` và
 * `about`, nhưng mẫu này nay render CẢ hai khối dùng chung mang đúng hai id ấy.
 * Hai thẻ cùng một id thì `#places` chỉ neo được vào cái đầu tiên và cái sau
 * vĩnh viễn không tới được — hỏng lặng lẽ, build vẫn xanh. Chúng là
 * `CustomSectionId`: cố ý KHÔNG thêm vào `SECTION_IDS` vì bộ đó là hợp đồng mà
 * MỌI mẫu phải hiểu, còn hai khối này chỉ mẫu 03 có.
 *
 * `booking` không có trong mảng dưới đây dù `Hero` có khai `id="booking"` cho
 * thanh tìm phòng: đó là một thanh công cụ bên trong hero, không phải một dải
 * nội dung mà điều hướng nên trỏ tới.
 */

export const sections: readonly ThemeSectionId[] = [
    'top',
    'about',
    'panorama',
    'rooms',
    'dining',
    'places',
    'host',
    'gallery',
] as const

export interface HomeProps {
    data: PropertyData
    locale: Locale
    /** Chèn thêm vào header — vd nút chuyển ngôn ngữ riêng của app. */
    extra?: ReactNode

    /**
     * ĐƯỜNG DẪN ẢNH — KHÔNG TRUYỀN THÌ DÙNG BỘ CHUNG.
     *
     * VÌ SAO CÓ MẶC ĐỊNH: trước đây ba prop này mặc định rỗng, nên trang `/h3`
     * trên hub — route chung chỉ truyền `data`/`locale`/`extra` cho mọi mẫu —
     * render ra hero không ảnh và hai section tự ẩn. Mẫu phải đứng được bằng
     * chính nó khi chỉ được đưa dữ liệu.
     *
     * Bộ mặc định lấy từ `@repo/domain-hotel/media` (một nguồn, luật R8). App
     * chỉ truyền khi muốn KHÁC — ví dụ resort lọc ảnh crawl theo cờ môi
     * trường, thứ package không đọc được.
     *
     * ⚠️ ĐIỀU KIỆN: app phải có bộ file trong `public/uploads/`. Hai app hiện
     * tại đã đồng bộ; app thứ ba thiếu file sẽ thấy ảnh 404 chứ không sập.
     */
    heroSlides?: readonly HeroSlide[]
    /** Mục cho section `places`, ĐÃ gắn `image`. */
    panoramaItems?: readonly GalleryItem[]
    /** 9 ảnh thật cho section `gallery`. */
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
    heroSlides = HERO_SLIDES,
    panoramaItems,
    photos = RESORT_PHOTOS,
    onSearch,
    searchHref = themePath(meta.slug, 'rooms'),
    exploreHref = themePath(meta.slug, 'tours'),
    galleryHref = themePath(meta.slug, 'gallery'),
}: HomeProps) {
    // Tiện ích đi kèm: lấy thẳng từ `data.amenities` (luật R8 — một nguồn sự
    // thật). App không phải bơm thêm gì.
    const perks = data.amenities ?? []
    const reviews = data.reviews ?? []
    // `galleryWithImages` gắn ảnh vào mục nào chưa có — chữ vẫn từ `core`.
    const places = panoramaItems ?? galleryWithImages(data)

    return (
        <div data-theme="h3" className="font-primary overflow-x-clip">
            <SiteHeader
                {...siteHeaderPropsOf(data, locale, meta.slug)}
                extra={extra}
                transparentOnTop
            />
            {/*
              * THỨ TỰ SECTION lấy đúng theo trang chủ của app resort — đó là
              * bản đã được duyệt về nội dung, không phải sắp lại theo ý mình.
              *
              * Nhịp của nó: mở bằng ảnh (Hero) → kể chuyện nơi này (About) →
              * cho thấy đảo (Panorama) → BA KHỐI BÁN HÀNG liền nhau (Rooms,
              * Dining, Places) → chủ nhà & đánh giá (HostService) → ảnh thật
              * (Gallery) → thông tin thực dụng chốt lại (Practical).
              *
              * Ba khối bán hàng đứng liền nhau là cố ý: khách vừa thấy đảo đẹp
              * xong là gặp ngay chỗ đặt phòng, không phải cuộn tìm (luật P10).
              */}
            <main>
                <Hero
                    locale={locale}
                    slides={heroSlides}
                    onSearch={onSearch}
                    searchHref={searchHref}
                />
                <AboutSection data={data} locale={locale} />
                <Panorama locale={locale} items={places} exploreHref={exploreHref} />
                <RoomsSection
                    data={data}
                    locale={locale}
                    slug={meta.slug}
                    ui={ui}
                    headingClass={SECTION_HEADINGS}
                />
                <DiningSection
                    data={data}
                    locale={locale}
                    slug={meta.slug}
                    headingClass={SECTION_HEADINGS}
                />
                <PlacesSection
                    data={data}
                    locale={locale}
                    slug={meta.slug}
                    headingClass={SECTION_HEADINGS}
                />
                <HostService locale={locale} perks={perks} reviews={reviews} />
                <Gallery locale={locale} photos={photos} galleryHref={galleryHref} />
                <PracticalSection
                    data={data}
                    locale={locale}
                    ui={ui}
                    headingClass={SECTION_HEADINGS}
                />
            </main>
            <SiteFooter {...siteFooterPropsOf(data, locale, meta.slug)} />
        </div>
    )
}
