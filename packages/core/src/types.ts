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

export interface NavItem {
    href: string
    label: I18nText
}

// ----------------------------------------------------------------------- phòng

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
}
