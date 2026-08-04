/**
 * Kiểu dữ liệu nghiệp vụ đặt phòng.
 * Không JSX, không CSS, không mã màu (luật R2).
 */

import type { I18nText } from './i18n'

// ---------------------------------------------------------------- thương hiệu

export interface Brand {
    name: string
    suffix: string
    tagline: I18nText
    address: I18nText
    phone: string
    email: string
    site: string
    logo?: string
}

// -------------------------------------------------------------------- section

/**
 * Contract section ổn định (luật R7).
 * Theme được bỏ bớt hoặc đổi cách trình bày, KHÔNG được đổi tên id —
 * điều hướng, deep-link và CMS phụ thuộc vào bộ id này.
 */
export const SECTION_IDS = [
    'top',
    'about',
    'rooms',
    'dining',
    'tours',
    'places',
    'gallery',
    'booking',
    'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/**
 * Section riêng của một mẫu, ngoài bộ id chuẩn.
 *
 * Prototype cho thấy nhu cầu này có thật: mẫu 02 có dải "các bước đặt phòng"
 * (`steps`), mẫu 03 có dải "chọn theo chủ đề" (`themes`). Chúng là cách trình
 * bày riêng của từng mẫu, không phải dữ liệu nghiệp vụ — nên `core` chỉ cần
 * thừa nhận sự tồn tại của chúng, không cần biết chúng chứa gì.
 *
 * Vì sao không nhét thẳng vào `SECTION_IDS`: bộ id đó là hợp đồng điều hướng
 * và deep-link mà MỌI theme phải hiểu (luật R7). Một section chỉ mẫu 02 có thì
 * không thuộc về hợp đồng chung.
 */
export type CustomSectionId = string & {}

/** Id dùng được trong danh sách section của theme: chuẩn hoặc riêng. */
export type ThemeSectionId = SectionId | CustomSectionId

export interface NavItem {
    href: string
    label: I18nText
}

// ----------------------------------------------------------------------- phòng

/** Nhóm hạng phòng, dùng để lọc trên trang danh sách và CMS. */
export type RoomGroup = 'couple' | 'family' | 'suite'

/** Đánh giá của khách về một hạng phòng. */
export interface RoomReview {
    who: string
    score: string
    text: I18nText
}

export interface Room {
    id: string
    name: I18nText
    desc: I18nText
    /** Diện tích hiển thị nguyên văn, ví dụ "48 m²". */
    area: string
    /** Số khách tiêu chuẩn. */
    guests: number
    /** Giá mỗi đêm, đơn vị VND, chỉ lấy số. */
    price: number
    tags: I18nText[]
    images?: string[]

    /** Nhóm để lọc: đôi / gia đình / suite. */
    group?: RoomGroup
    /** Phụ thu giường phụ, VND. */
    extraBedFee?: number
    /** Số phòng trống còn lại — hiện badge "chỉ còn N phòng". */
    remaining?: number
    reviews?: RoomReview[]
}

/** Chi tiết mở rộng theo từng hạng phòng (key = Room.id). */
export interface RoomExtra {
    maxGuests: number
    defaultGuests: number
    extraBed: number
    bed: I18nText
    view: I18nText
    long: I18nText
    long2?: I18nText
    amenities: I18nText[]
    conditions: I18nText[]
}

// -------------------------------------------------------------------- tiện ích

export interface Addon {
    id: string
    name: I18nText
    price: number
    /** Đơn vị tính: "khách / đêm", "xe / ngày"… */
    unit: I18nText
}

// ---------------------------------------------------------- ẩm thực & trải nghiệm

export interface Dining {
    id: string
    name: I18nText
    desc: I18nText
    note: I18nText
    image?: string
}

export interface TourDay {
    label: I18nText
    items: I18nText[]
}

export interface Tour {
    id: string
    code: string
    name: I18nText
    summary: I18nText
    price: number
    days: TourDay[]
}

export interface Place {
    id: string
    name: I18nText
    tag: I18nText
    desc: I18nText
    image?: string
}

export interface TransportLeg {
    leg: I18nText
    mode: I18nText
    price: I18nText
}

// ------------------------------------------------------------ thư viện & tiện ích

/**
 * Một khung trong dải thư viện ảnh của trang chủ (section `gallery`).
 *
 * `image` optional vì file ảnh nằm trong `public/` của từng app, mỗi app một
 * cấu trúc khác nhau (xem `assets.ts`). Core giữ phần chữ nghĩa song ngữ —
 * thứ mọi theme dùng chung; app tự cấp đường dẫn ảnh của nó.
 */
export interface GalleryItem {
    id: string
    title: I18nText
    subtitle: I18nText
    image?: string
}

/**
 * Tiện ích của cơ sở lưu trú.
 *
 * `icon` là TÊN icon, không phải component — `core` không được chứa JSX
 * (luật R2). Theme tự ánh xạ tên này sang icon của bộ nó dùng.
 */
export interface Amenity {
    id: string
    icon: string
    label: I18nText
    desc?: I18nText
}

/** Đánh giá của khách, hiện trên trang chủ. */
export interface Review {
    id: string
    name: string
    date: string
    rating: number
    comment: I18nText
    avatar?: string
}

// ---------------------------------------------------------- khám phá & thực đơn

/** Điểm dừng chân trên đảo chính. */
export interface ExploreSpot {
    id: string
    name: I18nText
    /** Khoảng cách/thời gian di chuyển, vd "4 phút xe máy". */
    dist: I18nText
    text: I18nText
    /** Mẹo thực địa cho khách. */
    tip: I18nText
}

/** Đảo vệ tinh quanh quần đảo. */
export interface SatelliteIsland {
    id: string
    name: I18nText
    badge: I18nText
    text: I18nText
}

export interface ItineraryLeg {
    day: I18nText
    time: string
    title: I18nText
    text: I18nText
}

export interface CostItem {
    label: I18nText
    val: string
}

/** Lịch trình mẫu, vd 2 ngày 1 đêm. */
export interface TripPlan {
    key: string
    name: I18nText
    legs: ItineraryLeg[]
    costs: CostItem[]
    total: string
}

export interface MenuItem {
    id: number
    name: I18nText
    /** Giá VND. Dùng `formatPrice()` khi hiển thị. */
    price: number
}

export interface MenuCategory {
    key: string
    name: I18nText
    items: MenuItem[]
}

// ---------------------------------------------------------------------- blog

export interface BlogBlock {
    kind: 'h' | 'p' | 'q' | 'i' | 'l'
    text?: I18nText
    caption?: I18nText
    slotId?: string
    items?: I18nText[]
}

export interface BlogPost {
    id: string
    category: I18nText
    title: I18nText
    lede: I18nText
    author: I18nText
    role: I18nText
    date: I18nText
    readMin: number
    heroSlot: string
    heroCaption: I18nText
    tags: I18nText[]
    blocks: BlogBlock[]
}

// ------------------------------------------------------------------ nội dung phụ

export interface Fact {
    value: string
    label: I18nText
}

export interface Faq {
    q: I18nText
    a: I18nText
}

export interface About {
    title: I18nText
    kicker: I18nText
    body: I18nText[]
    services: I18nText[]
}

export interface Hero {
    kicker: I18nText
    title: I18nText
    sub: I18nText
    badges: I18nText[]
    images?: string[]
}

// -------------------------------------------------------------- gói dữ liệu site

/**
 * Toàn bộ nội dung của một cơ sở lưu trú.
 * Mọi theme đọc chung đúng một bản này (luật R8).
 */
export interface PropertyData {
    brand: Brand
    nav: NavItem[]
    hero: Hero
    facts: Fact[]
    about: About
    rooms: Room[]
    roomExtras: Record<string, RoomExtra>
    addons: Addon[]
    dining: Dining[]
    tours: Tour[]
    places: Place[]
    transport: TransportLeg[]
    faq: Faq[]
    notes: I18nText[]

    /**
     * Ba mục dưới đây để optional có chủ đích: các mẫu h1–h6 dựng trước khi
     * chúng tồn tại, và không phải cơ sở lưu trú nào cũng có. Theme phải tự
     * xử lý trường hợp thiếu thay vì giả định luôn có.
     */
    gallery?: GalleryItem[]
    amenities?: Amenity[]
    reviews?: Review[]
}
