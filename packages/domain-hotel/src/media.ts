import type { GalleryItem, I18nText, Place, PropertyData } from '@repo/core'

/**
 * Ánh xạ ĐƯỜNG DẪN ẢNH cho nội dung lưu trú.
 *
 * VÌ SAO TỒN TẠI: `packages/core` giữ phần CHỮ song ngữ (tên điểm đến, chú
 * thích ảnh) nhưng không giữ đường dẫn file — Next chỉ phục vụ những gì nằm
 * trong `public/` của từng app. Trước đây mỗi app tự khai bảng ánh xạ này
 * trong `src/data/property.ts`, và đó là một bản FORK: app resort có đủ ảnh
 * nên trang chủ đẹp, app hub không có nên `/h3` render ra ba section trống.
 *
 * VÌ SAO Ở TẦNG DOMAIN CHỨ KHÔNG Ở `utils`: file này nhắc `GalleryItem`,
 * `Place`, "resort", "phòng" — từ vựng của ngành lưu trú. Luật R15 cấm tầng
 * nền biết những khái niệm đó.
 *
 * VÌ SAO KHÔNG ĐẶT THẲNG VÀO `core`: cũng đặt được, nhưng `core` đang là vùng
 * dữ liệu thuần và các bảng dưới đây là quyết định TRÌNH BÀY (chọn ảnh nào cho
 * ô nào, cắt mấy ảnh). Để ở domain thì domain thứ hai không phải mang theo.
 *
 * ĐIỀU KIỆN DÙNG ĐƯỢC: hai app phải có cùng bộ file trong `public/uploads/`.
 * Đã đồng bộ; thêm ảnh mới thì thêm ở cả hai, nếu không app thiếu file sẽ 404.
 */

/** Thư mục ảnh tải lên của cơ sở lưu trú, chung cho mọi app của sản phẩm. */
export const UPLOAD_DIR = '/uploads' as const

const up = (file: string) => `${UPLOAD_DIR}/${file}`

// ------------------------------------------------------------------ hero

export interface HeroSlideAsset {
    src: string
    alt: I18nText
}

/**
 * Ảnh hero, theo thứ tự trình chiếu.
 *
 * `alt` song ngữ vì đây là chuỗi khách nhìn thấy — screen reader tiếng Anh mà
 * đọc mô tả tiếng Việt thì đúng bằng không có `alt` (luật R6 + D4).
 */
export const HERO_SLIDES: readonly HeroSlideAsset[] = [
    {
        src: up('hai-dang-Ke-Ga-2.jpg'),
        alt: { vi: 'Vịnh Nam Du nhìn từ trên đồi', en: 'Nam Du bay seen from the hill' },
    },
    {
        src: up('hero-1.jpg'),
        alt: { vi: 'Bãi biển Nam Du', en: 'Nam Du beach' },
    },
    {
        src: up('hero-3.png'),
        alt: { vi: 'Sân hiên The Nam Du Hill', en: 'The Nam Du Hill terrace' },
    },
    {
        src: up('hero-4.png'),
        alt: {
            vi: 'Sân hiên lục giác nhìn từ trên cao về đêm',
            en: 'The hexagonal terrace from above at night',
        },
    },
] as const

// --------------------------------------------------------------- thư viện

/** Ảnh cho từng mục thư viện trang chủ, khớp theo `GalleryItem.id` của core. */
const GALLERY_IMAGES: Record<string, string> = {
    'gallery-beach': up('hoang-hon.jpg'),
    'gallery-pool': up('ho-boi.jpg'),
    'gallery-dining': up('nha-hang-view-bien.jpg'),
    'gallery-diving': up('lan-ngan-san-ho.jpg'),
}

/**
 * Mục thư viện đã gắn ảnh — dùng cho section `places`.
 *
 * Mục đã có `image` sẵn trong dữ liệu thì giữ nguyên: nếu sau này CMS cho
 * biên tập viên chọn ảnh, giá trị đó phải thắng bảng cứng ở đây.
 */
export function galleryWithImages(data: PropertyData): GalleryItem[] {
    return (data.gallery ?? []).map((item) => ({
        ...item,
        image: item.image ?? GALLERY_IMAGES[item.id] ?? '',
    }))
}

// -------------------------------------------------------------- điểm đến

/** Ảnh cho các điểm đến, khớp theo `Place.id` của core. */
const PLACE_IMAGES: Record<string, string> = {
    'place-hai-bo-dap': up('honhaibodap.jpg'),
    'place-hon-mau': up('du-lich-hon-mau.jpg'),
    'place-cay-men': up('du-lich-bai-cay-men-nam-du.jpg'),
    'place-hai-dang': up('hai-dang-Ke-Ga-2.jpg'),
}

/** Bốn điểm đến nổi bật hiện ở trang chủ, theo đúng thứ tự này. */
export const FEATURED_PLACE_IDS = [
    'place-hai-bo-dap',
    'place-hon-mau',
    'place-cay-men',
    'place-hai-dang',
] as const

/** Bốn điểm đến nổi bật, đã gắn ảnh. Thiếu id nào trong dữ liệu thì bỏ qua. */
export function featuredPlaces(data: PropertyData): Place[] {
    return FEATURED_PLACE_IDS.map((id) => data.places.find((place) => place.id === id))
        .filter((place): place is Place => Boolean(place))
        .map((place) => ({ ...place, image: place.image ?? PLACE_IMAGES[place.id] ?? '' }))
}

// ----------------------------------------------------------- ảnh thật resort

export type ResortPhotoCategory = 'resort' | 'dining' | 'rooms' | 'places' | 'views'

export interface ResortPhoto {
    id: string
    src: string
    title: I18nText
    category: ResortPhotoCategory
}

/**
 * Ảnh THẬT của cơ sở — dùng cho trang `/gallery` và khối thư viện trang chủ.
 *
 * Đây là các file đã nằm trong `public/uploads/` của cả hai app, nên luôn dùng
 * được kể cả sau khi gỡ ảnh crawl. Ảnh phòng lấy thêm từ dữ liệu phòng (xem
 * `allPhotos()` bên dưới) và hiện vẫn là ảnh crawl.
 */
export const RESORT_PHOTOS: readonly ResortPhoto[] = [
    {
        id: 'photo-pool',
        src: up('ho-boi.jpg'),
        title: { vi: 'Hồ bơi & khu nghỉ', en: 'Pool & guest wing' },
        category: 'resort',
    },
    {
        id: 'photo-terrace-night',
        src: up('hero-3.png'),
        title: { vi: 'Sân hiên về đêm', en: 'Terrace at night' },
        category: 'resort',
    },
    {
        id: 'photo-facade-night',
        src: up('hero-5.png'),
        title: { vi: 'Mặt tiền resort', en: 'Resort facade' },
        category: 'resort',
    },
    {
        id: 'photo-hexagon-deck',
        src: up('hero-4.png'),
        title: { vi: 'Sân hiên lục giác', en: 'Hexagon deck' },
        category: 'resort',
    },
    {
        id: 'photo-restaurant',
        src: up('nha-hang-view-bien.jpg'),
        title: { vi: 'Nhà hàng view biển', en: 'Sea-view restaurant' },
        category: 'dining',
    },
    {
        id: 'photo-terrace-bay',
        src: up('pasted-1785690635080-0.png'),
        title: { vi: 'Ban công nhìn ra vịnh', en: 'Balcony over the bay' },
        category: 'views',
    },
    {
        id: 'photo-sunset',
        src: up('hoang-hon.jpg'),
        title: { vi: 'Hoàng hôn từ resort', en: 'Sunset from the resort' },
        category: 'views',
    },
    {
        id: 'photo-coast-road',
        src: up('hero-2.jpg'),
        title: { vi: 'Đường ven biển xuống bãi', en: 'Coastal road to the beach' },
        category: 'views',
    },
    {
        id: 'photo-hillside',
        src: up('hero-1.jpg'),
        title: { vi: 'Resort trên sườn đồi', en: 'Resort on the hillside' },
        category: 'resort',
    },
] as const

/** Ảnh crawl nhận diện bằng host — file local luôn bắt đầu bằng `/uploads/`. */
const isCrawled = (src: string) => /^https?:\/\//.test(src)

export interface RoomImageSource {
    name: string
    nameEn: string
    images: string[]
}

/**
 * Toàn bộ ảnh cho trang `/gallery` — gộp ba nguồn: ảnh cơ sở, ảnh phòng, ảnh
 * điểm đến.
 *
 * ⚠️ LUẬT R9 — ảnh phòng và ảnh điểm đến phần lớn là URL crawl từ
 * thenamduhill.com. Chúng KHÔNG được để nguyên khi lên production: vừa là vấn
 * đề bản quyền, vừa là duplicate content hại SEO. Trước khi deploy phải thay
 * bằng ảnh chụp thật rồi đưa vào `public/uploads/`.
 *
 * `allowCrawled = false` loại hết ảnh crawl, trang tự rơi về 9 ảnh local —
 * không sập bố cục. Nơi gọi đọc cờ môi trường rồi truyền xuống, vì
 * `process.env` là thứ của app chứ không phải của package.
 */
export function allPhotos(
    data: PropertyData,
    rooms: readonly RoomImageSource[],
    allowCrawled = true,
): ResortPhoto[] {
    const roomPhotos: ResortPhoto[] = rooms.flatMap((room, roomIndex) =>
        (room.images ?? []).map((src, i) => ({
            id: `room-${roomIndex}-${i}`,
            src,
            title: { vi: room.name, en: room.nameEn || room.name },
            category: 'rooms' as const,
        })),
    )

    const placePhotos: ResortPhoto[] = data.places
        .filter((place) => Boolean(place.image))
        .map((place) => ({
            id: `place-${place.id}`,
            src: place.image as string,
            title: { vi: place.name.vi, en: place.name.en },
            category: 'places' as const,
        }))

    const all = [...RESORT_PHOTOS, ...roomPhotos, ...placePhotos]
    const usable = allowCrawled ? all : all.filter((photo) => !isCrawled(photo.src))

    // Cùng một file có thể xuất hiện ở nhiều hạng phòng — bỏ trùng theo src.
    const seen = new Set<string>()
    return usable.filter((photo) => {
        if (seen.has(photo.src)) return false
        seen.add(photo.src)
        return true
    })
}

// ------------------------------------------------------------- tiện ích

const amenityById = (data: PropertyData, id: string) =>
    data.amenities?.find((a) => a.id === id)

const pickAmenities = (data: PropertyData, ids: readonly string[]) =>
    ids
        .map((id) => amenityById(data, id))
        .filter((a): a is NonNullable<typeof a> => Boolean(a))

/** Tiện ích cơ sở vật chất — khối "Tiện ích nổi bật". */
export function facilityAmenities(data: PropertyData) {
    return pickAmenities(data, [
        'amenity-pool',
        'amenity-restaurant',
        'amenity-wifi',
        'amenity-transfer',
        'amenity-bike',
        'amenity-event',
    ])
}

/** Dịch vụ đi kèm — khối "Chủ nhà & tiện ích đi kèm". */
export function hostPerks(data: PropertyData) {
    return pickAmenities(data, [
        'amenity-pier-transfer',
        'amenity-canoe',
        'amenity-breakfast',
        'amenity-billiards',
        'amenity-bike',
        'amenity-support',
    ])
}
