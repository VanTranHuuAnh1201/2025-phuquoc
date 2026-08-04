/**
 * Cầu nối giữa `@repo/core` và các component của app này.
 *
 * VÌ SAO TỒN TẠI: nội dung song ngữ nằm ở `core` (luật R8 — một nguồn sự
 * thật), nhưng FILE ẢNH thì không: Next chỉ phục vụ những gì nằm trong
 * `public/` của từng app, và mỗi app một cấu trúc khác nhau (xem
 * `packages/core/src/assets.ts`). Nên core giữ chữ, app giữ đường dẫn ảnh.
 *
 * VÌ SAO ĐỒNG BỘ: phần lớn component của app là client component, không await
 * được. `getPropertySync()` sinh ra đúng cho trường hợp này; khi chuyển sang
 * backend thật nó sẽ phục vụ từ cache chứ không biến mất.
 */

import { getPropertySync } from '@repo/core'

export const property = getPropertySync()

/**
 * Ảnh hero, theo thứ tự trình chiếu.
 * File nằm tại `apps/2026-thenamduhillresort/public/uploads/`.
 */
export const HERO_SLIDES = [
    { src: '/uploads/hero-1.jpg', alt: 'Bãi biển Nam Du' },
    { src: '/uploads/hai-dang-Ke-Ga-2.jpg', alt: 'Vịnh Nam Du nhìn từ trên đồi' },
    { src: '/uploads/hero-3.png', alt: 'Sân hiên The Nam Du Hill' },
    { src: '/uploads/hero-4.png', alt: 'Sân hiên lục giác nhìn từ trên cao về đêm' },
]

/**
 * Ảnh cho từng mục thư viện, khớp theo `GalleryItem.id` của core.
 * Chữ nghĩa ở core, ảnh ở đây.
 */
const GALLERY_IMAGES: Record<string, string> = {
    'gallery-beach': '/uploads/hoang-hon.jpg',
    'gallery-pool': '/uploads/ho-boi.jpg',
    'gallery-dining': '/uploads/nha-hang-view-bien.jpg',
    'gallery-diving': '/uploads/lan-ngan-san-ho.jpg',
}

/** Thư viện ảnh trang chủ: nội dung từ core, ảnh từ app. */
export const gallery = (property.gallery ?? []).map((item) => ({
    ...item,
    image: item.image ?? GALLERY_IMAGES[item.id] ?? '',
}))

/**
 * Ảnh cho các điểm đến, khớp theo `Place.id` của core.
 * Chỉ 4 điểm hiện trên trang chủ mới có ảnh.
 */
const PLACE_IMAGES: Record<string, string> = {
    'place-hai-bo-dap': '/uploads/honhaibodap.jpg',
    'place-hon-mau': '/uploads/du-lich-hon-mau.jpg',
    'place-cay-men': '/uploads/du-lich-bai-cay-men-nam-du.jpg',
    'place-hai-dang': '/uploads/hai-dang-Ke-Ga-2.jpg',
}

const amenityById = (id: string) => property.amenities?.find((a) => a.id === id)

const pickAmenities = (ids: string[]) =>
    ids.map(amenityById).filter((a): a is NonNullable<typeof a> => Boolean(a))

/**
 * Tiện ích cơ sở vật chất — khối "Tiện ích nổi bật".
 * Mobile hiện 4 mục đầu, desktop hiện đủ 6.
 */
export const facilityAmenities = pickAmenities([
    'amenity-pool',
    'amenity-restaurant',
    'amenity-wifi',
    'amenity-transfer',
    'amenity-bike',
    'amenity-event',
])

/** Dịch vụ đi kèm — khối "Chủ nhà & tiện ích đi kèm". */
export const hostPerks = pickAmenities([
    'amenity-pier-transfer',
    'amenity-canoe',
    'amenity-breakfast',
    'amenity-billiards',
    'amenity-bike',
    'amenity-support',
])

/** Bốn điểm đến nổi bật hiện ở trang chủ, kèm ảnh. */
export const featuredPlaces = ['place-hai-bo-dap', 'place-hon-mau', 'place-cay-men', 'place-hai-dang']
    .map((id) => property.places.find((place) => place.id === id))
    .filter((place): place is NonNullable<typeof place> => Boolean(place))
    .map((place) => ({ ...place, image: place.image ?? PLACE_IMAGES[place.id] ?? '' }))
