/**
 * Cầu nối giữa `@repo/core` / `@repo/domain-hotel` và các component của app.
 *
 * FILE NÀY ĐÃ MỎNG ĐI RẤT NHIỀU. Trước đây nó tự khai bảng ánh xạ ảnh (hero,
 * thư viện, điểm đến, 9 ảnh cơ sở) — và đó là một bản FORK: app hub không có
 * bảng đó nên trang `/h3` render ra hero không ảnh cùng hai section tự ẩn.
 * Bảng nay nằm ở `@repo/domain-hotel/media`, cả hai app đọc chung (luật R8).
 *
 * CÒN LẠI GÌ Ở ĐÂY: đúng ba thứ mà package không quyết được —
 *   1. `property` — bản đồng bộ của dữ liệu, vì phần lớn component của app là
 *      client component nên không `await` được.
 *   2. Cờ môi trường lọc ảnh crawl — `process.env` là thứ của app.
 *   3. Đổi tên trường cho khớp component sẵn có của app.
 */

import { getPropertySync, type I18nText } from '@repo/core'
import {
    HERO_SLIDES as SHARED_HERO_SLIDES,
    RESORT_PHOTOS as SHARED_RESORT_PHOTOS,
    allPhotos,
    galleryWithImages,
    featuredPlaces as sharedFeaturedPlaces,
    facilityAmenities as sharedFacilityAmenities,
    hostPerks as sharedHostPerks,
    type ResortPhoto,
    type ResortPhotoCategory,
} from '@repo/domain-hotel'

export const property = getPropertySync()

export type { ResortPhoto, ResortPhotoCategory }

/** Ảnh hero — bộ chung ở tầng domain. */
export const HERO_SLIDES = SHARED_HERO_SLIDES

/** 9 ảnh cơ sở vật chất thật — bộ chung ở tầng domain. */
export const RESORT_PHOTOS = SHARED_RESORT_PHOTOS

/** Thư viện ảnh trang chủ: chữ từ core, ảnh từ bảng chung. */
export const gallery = galleryWithImages(property)

/** Bốn điểm đến nổi bật hiện ở trang chủ, kèm ảnh. */
export const featuredPlaces = sharedFeaturedPlaces(property)

/** Tiện ích cơ sở vật chất — khối "Tiện ích nổi bật". */
export const facilityAmenities = sharedFacilityAmenities(property)

/** Dịch vụ đi kèm — khối "Chủ nhà & tiện ích đi kèm". */
export const hostPerks = sharedHostPerks(property)

/**
 * Toàn bộ ảnh cho trang `/gallery`.
 *
 * ⚠️ LUẬT R9 — ảnh phòng và ảnh điểm đến phần lớn là URL crawl từ
 * thenamduhill.com, không được để nguyên khi lên production. Đặt cờ
 * `NEXT_PUBLIC_ALLOW_CRAWLED_MEDIA=0` để loại hết, trang tự rơi về 9 ảnh local.
 *
 * VÌ SAO CỜ ĐỌC Ở ĐÂY CHỨ KHÔNG Ở PACKAGE: `process.env.NEXT_PUBLIC_*` được
 * Next thay bằng giá trị thật lúc build CỦA APP. Package đọc thì giá trị dính
 * theo lúc build package, không theo app đang chạy.
 *
 * VÌ SAO LÀ HÀM CHỨ KHÔNG PHẢI HẰNG: `ROOMS` import ngược lại file này, để
 * hằng ở đây sẽ thành vòng lặp import lúc khởi tạo module.
 */
const ALLOW_CRAWLED_MEDIA = process.env.NEXT_PUBLIC_ALLOW_CRAWLED_MEDIA !== '0'

export function galleryPhotos(
    rooms: { name: string; nameEn: string; images: string[] }[],
): ResortPhoto[] {
    return allPhotos(property, rooms, ALLOW_CRAWLED_MEDIA)
}

/**
 * Đánh giá của khách — khối cột cuộn trong `HostService`.
 *
 * VÌ SAO CHỈ ÁNH XẠ CHỨ KHÔNG KHAI LẠI: nội dung nằm ở `core` (luật R8). App
 * chỉ đổi tên trường cho khớp component.
 *
 * VÌ SAO KHÔNG CÓ ẢNH ĐẠI DIỆN: đây là review demo. Gán mặt người thật vào lời
 * khen chưa xảy ra là dựng bằng chứng giả. Component dựng avatar từ chữ cái đầu.
 */
export interface Testimonial {
    id: string
    quote: I18nText
    name: string
    /** Nơi khách đến — hiện cạnh tên, giúp review đọc có thật hơn. */
    from: I18nText
    rating: number
}

const NO_PLACE: I18nText = { vi: '', en: '' }

export const TESTIMONIALS: Testimonial[] = (property.reviews ?? []).map((r) => ({
    id: r.id,
    quote: r.comment,
    name: r.name,
    from: r.from ?? NO_PLACE,
    rating: r.rating,
}))
