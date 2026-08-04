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
    { src: '/uploads/hai-dang-Ke-Ga-2.jpg', alt: 'Vịnh Nam Du nhìn từ trên đồi' },
    { src: '/uploads/hero-1.jpg', alt: 'Bãi biển Nam Du' },
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
 * Ảnh THẬT của resort — dùng cho trang /gallery và khối thư viện ở trang chủ.
 *
 * VÌ SAO KHAI Ở ĐÂY CHỨ KHÔNG Ở CORE: đây là đường dẫn file trong `public/`
 * của riêng app này, đúng lý do file `property.ts` tồn tại (xem đầu file).
 * Chữ song ngữ đi kèm nằm ngay tại chỗ vì chỉ trang thư viện dùng tới.
 *
 * Đây là các file đã nằm trong `public/uploads/` — luôn dùng được kể cả sau
 * khi gỡ ảnh crawl. Ảnh phòng lấy thêm từ `ROOMS` (xem `galleryPhotos()` bên
 * dưới) và hiện vẫn là ảnh crawl.
 */
export type ResortPhotoCategory = 'resort' | 'dining' | 'rooms' | 'places' | 'views'

export interface ResortPhoto {
    id: string
    src: string
    title: { vi: string; en: string }
    category: ResortPhotoCategory
}

export const RESORT_PHOTOS: ResortPhoto[] = [
    {
        id: 'photo-pool',
        src: '/uploads/ho-boi.jpg',
        title: { vi: 'Hồ bơi & khu nghỉ', en: 'Pool & guest wing' },
        category: 'resort',
    },
    {
        id: 'photo-terrace-night',
        src: '/uploads/hero-3.png',
        title: { vi: 'Sân hiên về đêm', en: 'Terrace at night' },
        category: 'resort',
    },
    {
        id: 'photo-facade-night',
        src: '/uploads/hero-5.png',
        title: { vi: 'Mặt tiền resort', en: 'Resort facade' },
        category: 'resort',
    },
    {
        id: 'photo-hexagon-deck',
        src: '/uploads/hero-4.png',
        title: { vi: 'Sân hiên lục giác', en: 'Hexagon deck' },
        category: 'resort',
    },
    {
        id: 'photo-restaurant',
        src: '/uploads/nha-hang-view-bien.jpg',
        title: { vi: 'Nhà hàng view biển', en: 'Sea-view restaurant' },
        category: 'dining',
    },
    {
        id: 'photo-terrace-bay',
        src: '/uploads/pasted-1785690635080-0.png',
        title: { vi: 'Ban công nhìn ra vịnh', en: 'Balcony over the bay' },
        category: 'views',
    },
    {
        id: 'photo-sunset',
        src: '/uploads/hoang-hon.jpg',
        title: { vi: 'Hoàng hôn từ resort', en: 'Sunset from the resort' },
        category: 'views',
    },
    {
        id: 'photo-coast-road',
        src: '/uploads/hero-2.jpg',
        title: { vi: 'Đường ven biển xuống bãi', en: 'Coastal road to the beach' },
        category: 'views',
    },
    {
        id: 'photo-hillside',
        src: '/uploads/hero-1.jpg',
        title: { vi: 'Resort trên sườn đồi', en: 'Resort on the hillside' },
        category: 'resort',
    },
]

/**
 * Toàn bộ ảnh cho trang `/gallery` — gộp ba nguồn, giống hệt cách
 * `GalleryPage` của `@repo/ui` dựng danh sách cho `/h7/gallery` ở app 3000.
 *
 * ⚠️ LUẬT R9 — ảnh phòng và ảnh điểm đến ở đây phần lớn là URL crawl từ
 * thenamduhill.com. Chúng KHÔNG được để nguyên khi lên production: vừa là vấn
 * đề bản quyền, vừa là duplicate content hại SEO. Trước khi deploy phải thay
 * bằng ảnh chụp thật rồi đưa vào `public/uploads/`.
 *
 * Đặt cờ `NEXT_PUBLIC_ALLOW_CRAWLED_MEDIA=0` để loại hết ảnh crawl, trang tự
 * rơi về 9 ảnh local — không sập bố cục.
 *
 * VÌ SAO LÀ HÀM CHỨ KHÔNG PHẢI HẰNG: `ROOMS` import ngược lại `property.ts`,
 * để hằng ở đây sẽ thành vòng lặp import lúc khởi tạo module. Gọi lúc render
 * thì cả hai module đã sẵn sàng.
 */
const ALLOW_CRAWLED_MEDIA = process.env.NEXT_PUBLIC_ALLOW_CRAWLED_MEDIA !== '0'

/** Ảnh crawl nhận diện bằng host — file local luôn bắt đầu bằng `/uploads/`. */
const isCrawled = (src: string) => /^https?:\/\//.test(src)

export function galleryPhotos(rooms: { name: string; nameEn: string; images: string[] }[]): ResortPhoto[] {
    const roomPhotos: ResortPhoto[] = rooms.flatMap((room, roomIndex) =>
        (room.images ?? []).map((src, i) => ({
            id: `room-${roomIndex}-${i}`,
            src,
            title: { vi: room.name, en: room.nameEn || room.name },
            category: 'rooms' as const,
        })),
    )

    const placePhotos: ResortPhoto[] = property.places
        .filter((place) => Boolean(place.image))
        .map((place) => ({
            id: `place-${place.id}`,
            src: place.image as string,
            title: { vi: place.name.vi, en: place.name.en },
            category: 'places' as const,
        }))

    const all = [...RESORT_PHOTOS, ...roomPhotos, ...placePhotos]
    const usable = ALLOW_CRAWLED_MEDIA ? all : all.filter((photo) => !isCrawled(photo.src))

    // Cùng một file có thể xuất hiện ở nhiều hạng phòng — bỏ trùng theo src.
    const seen = new Set<string>()
    return usable.filter((photo) => {
        if (seen.has(photo.src)) return false
        seen.add(photo.src)
        return true
    })
}

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

/**
 * Đánh giá của khách — khối cột cuộn trong `HostServiceSection`.
 *
 * VÌ SAO NỘI DUNG TỰ VIẾT: luật R9 cấm đưa nội dung crawl từ thenamduhill.com
 * lên production. Chín đoạn dưới đây viết mới quanh những thứ đặc trưng của
 * Nam Du — chuyến tàu Rạch Giá, bình minh trên đồi, chủ nhà đón tận bến — nên
 * không dính bản quyền bên thứ ba.
 *
 * VÌ SAO KHÔNG CÓ ẢNH ĐẠI DIỆN: đây là review demo. Gán mặt người thật (kể cả
 * ảnh sinh tự động) vào lời khen chưa xảy ra là dựng bằng chứng giả. Component
 * dựng avatar từ chữ cái đầu của tên thay vì tải ảnh về.
 *
 * VÌ SAO KHAI Ở APP CHỨ KHÔNG Ở CORE: hiện chỉ app này dùng. Khi theme khác
 * cần tới thì chuyển lên `core` — trừu tượng hoá lúc có người dùng thứ hai,
 * không phải trước đó.
 */
export interface Testimonial {
    id: string
    quote: { vi: string; en: string }
    name: string
    /** Nơi khách đến — hiện cạnh tên, giúp review đọc có thật hơn. */
    from: { vi: string; en: string }
    rating: 4 | 5
}

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 'tm-ngoc-anh',
        quote: {
            vi: 'Chủ nhà nhắn tin trước một ngày hỏi chuyến tàu mấy giờ, rồi có người chờ sẵn ở bến. Đi đảo mà không phải lo khâu nào.',
            en: 'The host messaged a day ahead to ask which ferry we were on, then someone was waiting at the pier. Nothing left for us to arrange.',
        },
        name: 'Ngọc Anh',
        from: { vi: 'TP.HCM', en: 'Ho Chi Minh City' },
        rating: 5,
    },
    {
        id: 'tm-minh-tri',
        quote: {
            vi: 'Dậy sớm ngồi ngoài hiên xem mặt trời lên khỏi mặt biển. Hai đêm ở đây đáng giá hơn cả tuần nghỉ ở chỗ đông người.',
            en: 'We got up early and watched the sun come off the water from the terrace. Two nights here beat a whole week somewhere crowded.',
        },
        name: 'Minh Trí',
        from: { vi: 'Cần Thơ', en: 'Can Tho' },
        rating: 5,
    },
    {
        id: 'tm-thu-ha',
        quote: {
            vi: 'Phòng nhìn thẳng ra vịnh, sáng mở cửa là thấy biển. Đúng như ảnh, không có chuyện ảnh một đằng phòng một nẻo.',
            en: 'The room looks straight onto the bay — you open the door in the morning and there it is. Exactly like the photos, no surprises.',
        },
        name: 'Thu Hà',
        from: { vi: 'Hà Nội', en: 'Hanoi' },
        rating: 5,
    },
    {
        id: 'tm-quoc-bao',
        quote: {
            vi: 'Đi bốn người, thuê xe máy ngay tại resort rồi chạy vòng đảo. Chủ nhà chỉ đường tới mấy bãi vắng mà Google Maps không có.',
            en: 'Four of us rented bikes right at the resort and rode around the island. The host pointed us to quiet beaches Google Maps does not show.',
        },
        name: 'Quốc Bảo',
        from: { vi: 'Đà Nẵng', en: 'Da Nang' },
        rating: 5,
    },
    {
        id: 'tm-lan-phuong',
        quote: {
            vi: 'Bữa sáng ăn ngoài nhà hàng nhìn ra biển, cá mới đánh về nên ngọt. Bé nhà mình ăn hết cả phần người lớn.',
            en: 'Breakfast at the seaside restaurant, with fish caught that morning. Our little one finished an adult portion.',
        },
        name: 'Lan Phương',
        from: { vi: 'Bình Dương', en: 'Binh Duong' },
        rating: 5,
    },
    {
        id: 'tm-duc-huy',
        quote: {
            vi: 'Hồ bơi vắng, chiều nào cũng gần như của riêng mình. Buổi tối ra bàn bi-a ngồi với mấy nhóm khách khác, vui.',
            en: 'The pool was quiet — most afternoons we had it to ourselves. Evenings we played pool with the other guests.',
        },
        name: 'Đức Huy',
        from: { vi: 'Nha Trang', en: 'Nha Trang' },
        rating: 4,
    },
    {
        id: 'tm-kim-oanh',
        quote: {
            vi: 'Lần đầu ra đảo nên khá lo. Nhắn gì cũng được trả lời trong vài phút, kể cả lúc mười giờ đêm hỏi chuyện tàu về.',
            en: 'It was our first island trip and we were nervous. Every message got an answer within minutes, even asking about the return ferry at ten at night.',
        },
        name: 'Kim Oanh',
        from: { vi: 'Rạch Giá', en: 'Rach Gia' },
        rating: 5,
    },
    {
        id: 'tm-thanh-tung',
        quote: {
            vi: 'Đưa cả nhà ba thế hệ đi, ông bà đi lại thoải mái vì phòng gần khu ăn uống. Chuyện nhỏ nhưng chỗ khác ít khi tính tới.',
            en: 'We came as three generations. My parents got around easily because the rooms sit close to the dining area — a small thing most places overlook.',
        },
        name: 'Thanh Tùng',
        from: { vi: 'Vũng Tàu', en: 'Vung Tau' },
        rating: 5,
    },
    {
        id: 'tm-hai-yen',
        quote: {
            vi: 'Đi lặn ngắm san hô theo tour chủ nhà giới thiệu, nước trong tới mức nhìn thấy đáy. Về tới nơi đã có nước ấm sẵn để tắm.',
            en: 'We joined the snorkelling trip the host recommended — the water was clear to the bottom. Hot water was ready for us when we got back.',
        },
        name: 'Hải Yến',
        from: { vi: 'Huế', en: 'Hue' },
        rating: 5,
    },
]
