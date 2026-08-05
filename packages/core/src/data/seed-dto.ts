/**
 * Lớp DTO — chuyển dữ liệu crawl thô sang kiểu nghiệp vụ của core.
 *
 * Ranh giới rõ ràng: phần trên file là hình dạng RAW của `seed-data.json`
 * (tiếng Việt một ngôn ngữ, chuỗi lộn xộn đúng như website nguồn nhả ra), phần
 * dưới là hàm ánh xạ sang `Room` / `RoomExtra` / `PropertyData` — đã song ngữ,
 * đã chuẩn hoá. Ngoài file này không nơi nào được biết tới hình dạng RAW.
 *
 * Không JSX, không CSS, chạy được trong Node thuần (luật R2).
 */

import { t, type I18nText } from '@repo/utils'
import type { PropertyData, Room, RoomExtra } from '../types'
import { roomBusinessInfo } from './room-business'

// ============================================================ tầng ngoài (RAW)

/** Một hạng phòng đúng như crawler nhả ra. Mọi chuỗi đều chỉ có tiếng Việt. */
export interface SeedRoomType {
    /** Slug từ website nguồn — dùng luôn làm `Room.id`, không sinh id mới. */
    id: string
    name: string
    /** Số phòng trên website nguồn, vd "01", "03-04". */
    roomNumber: string
    /** Tóm tắt ngắn hiển thị ở card danh sách. */
    summary: string
    /** Mô tả dài, mỗi phần tử là một đoạn văn. */
    description: string[]
    /** Diện tích ghi ở trang danh sách — hay rỗng. */
    size: string
    /** Diện tích ghi trong mô tả chi tiết — đáng tin hơn `size`. */
    detailSize: string
    /** Sức chứa tối đa. */
    capacity: number
    /** Giá mỗi đêm, VND. */
    price: number
    /** Phụ thu mỗi giường phụ, 0 nếu không áp dụng. */
    extraBedFee: number
    /** Hướng nhìn suy ra từ tóm tắt — có phòng để rỗng. */
    view: string
    /** Mục "HƯỚNG TẦM NHÌN" trên trang chi tiết. */
    viewDetail: string[]
    hasBalcony: boolean
    amenities: string[]
    conditions: string[]
    images: string[]
    availability: boolean
}

export interface SeedHotel {
    id: string
    name: string
    location: string
    address: string
    phone: string
    email: string
    taxId: string
    images: string[]
}

export interface SeedDining {
    title: string
    banner: string
    paragraphs: string[]
}

export interface SeedPolicies {
    checkIn: string
    checkOut: string
    cancellation: string
    children: string
    extraBed: string
    smoking: string
    quietHours: string
}

export interface SeedPayment {
    methods: string[]
    guide: string[]
}

export interface SeedContact {
    address: string
    phone: string
    email: string
}

/**
 * Toàn bộ gói crawl.
 *
 * Chỉ khai những nhánh core thực sự dùng. Seed gốc còn `experiences`, `events`,
 * `news`, `policies.pages` — là nội dung bài viết, chưa có chỗ trong
 * `PropertyData`, nên cố ý bỏ qua thay vì khai kiểu rồi để không.
 */
export interface SeedData {
    hotel: SeedHotel
    roomTypes: SeedRoomType[]
    dining: SeedDining
    gallery: string[]
    banners: string[]
    policies: SeedPolicies
    payment: SeedPayment
    contact: SeedContact
}

// ============================================================== ảnh & bản quyền

/**
 * Ảnh của cơ sở lưu trú.
 *
 * Mọi URL trong seed trỏ về `https://thenamduhill.com/...`. Bản demo này dựng
 * cho CHÍNH The Nam Du Hill xem, nên ảnh của họ được hiển thị kể cả trên
 * production — đây là ngoại lệ có chủ đích so với luật R9, phạm vi đúng một
 * bản POC này.
 *
 * Hai điều phải xử lý trước khi coi là bản chạy thật:
 * 1. Đang HOTLINK về máy chủ khách hàng — họ đổi đường dẫn là ảnh chết. Tải về
 *    CDN của mình rồi trỏ lại vào đây.
 * 2. Bán cho khách KHÁC thì bộ ảnh này không dùng lại được. Tắt nguồn seed
 *    (`USE_CRAWLED_SEED=0`) và thay bằng ảnh của họ.
 *
 * Giữ hàm này làm một chỗ duy nhất để đổi khi hai việc trên xảy ra — đừng rải
 * đường dẫn ảnh khắp nơi.
 */
export function propertyImages(urls: string[]): string[] {
    return urls
}

// ================================================================ từ điển VI→EN

/**
 * Bảng dịch cho các nhãn CỐ ĐỊNH lặp lại nhiều lần trong seed.
 *
 * Chỉ dịch những cụm đã kiểm chứng bằng mắt. Chuỗi tự do (mô tả dài, tóm tắt)
 * KHÔNG dịch máy — xem `viOnly()` bên dưới.
 *
 * Khoá đã chuẩn hoá: thường hoá + gộp khoảng trắng, vì seed có nhiều biến thể
 * gõ sai ("Trà, cà phê( túi lọc ) miễn phí", "Tra cà phê ( túi lọc) miễn phí").
 */
const DICTIONARY: Record<string, string> = {
    // hướng nhìn
    'hướng biển': 'Sea view',
    'hướng vườn': 'Garden view',
    'hướng thung lũng / biển': 'Valley / sea view',
    'nhìn ra biển': 'Sea view',
    'nhìn hướng biển': 'Sea view',
    'nhìn ra vườn': 'Garden view',
    'nhìn hướng vườn': 'Garden view',
    'nhìn ra sân vườn': 'Garden view',
    'hướngsân vườn': 'Garden view',
    'nhìn ra biển và sân vườn': 'Sea and garden view',
    'nhìn ra biển và chợ đêm': 'Sea and night-market view',
    'nhìn ra biển và thung lũng': 'Sea and valley view',
    'nhìn ra biển và thung lủng': 'Sea and valley view',
    'nhìn hướng biển, hồ bơi': 'Sea and pool view',
    'hướng biển, trung tâm, chợ đêm': 'Sea, town and night-market view',

    // tiện nghi
    'phòng không hút thuốc': 'Non-smoking room',
    'đồ vệ sinh cá nhân miễn phí': 'Free toiletries',
    'sử dụng hồ bơi và bida': 'Pool and billiards access',
    'có máy điều hòa': 'Air conditioning',
    'điều hòa không khí': 'Air conditioning',
    'máy điều hòa độc lập cho từng phòng': 'Individually controlled air conditioning',
    'trang bị két sắt an toàn': 'In-room safe',
    'két an toàn': 'In-room safe',
    'mini bar( có tính phí)': 'Mini bar (chargeable)',
    'dép mang trong nhà': 'Indoor slippers',
    dép: 'Slippers',
    'ấm đun nước': 'Electric kettle',
    'máy sấy tóc': 'Hair dryer',
    'áo choàng tắm': 'Bathrobe',
    'vòi sen': 'Shower',
    'nhà vệ sinh': 'Toilet',
    'giấy vệ sinh': 'Toilet paper',
    'khăn tắm': 'Towels',
    'tủ lạnh': 'Refrigerator',
    'ra trải giường': 'Bed linen',
    'sàn lát gạch/đá cẩm thạch': 'Tile / marble floor',
    'các tầng trên chỉ lên được bằng cầu thang': 'Upper floors accessible by stairs only',
    'ghế sofa': 'Sofa',
    'quạt máy': 'Electric fan',
    'tủ hoặc phòng để quần áo': 'Wardrobe or closet',
    'khu vực tiếp khách': 'Seating area',
    'ổ điện gần giường': 'Socket near the bed',
    'máy pha trà/cà phê': 'Tea / coffee maker',
    'giá treo quần áo': 'Clothes rack',
    'truy cập wifi miễn phí': 'Free wifi',
    'trà, cà phê(túi lọc ) miễn phí': 'Free tea and coffee (sachets)',
    'trà, cà phê ( túi lọc) miễn phí': 'Free tea and coffee (sachets)',
    'trà, cà phê( túi lọc ) miễn phí': 'Free tea and coffee (sachets)',
    'tra cà phê ( túi lọc) miễn phí': 'Free tea and coffee (sachets)',
    'trà, cà phê (túi lộc) miễn phí': 'Free tea and coffee (sachets)',
    'trà, cà phê ( túi lọc) miễng phí': 'Free tea and coffee (sachets)',

    // điều kiện phòng
    'không hút thuốc': 'No smoking',
}

/** Chuẩn hoá khoá tra từ điển: bỏ khoảng trắng thừa, thường hoá. */
function normalize(vi: string): string {
    return vi.trim().replace(/\s+/g, ' ').toLowerCase()
}

/**
 * Dịch một nhãn cố định. Không có trong từ điển thì giữ nguyên tiếng Việt ở cả
 * hai ngôn ngữ — thà hiện tiếng Việt cho khách quốc tế còn hơn dịch sai.
 */
export function translate(vi: string): I18nText {
    const en = DICTIONARY[normalize(vi)]
    return en ? t(vi, en) : viOnly(vi)
}

/**
 * Chuỗi tự do chưa có bản dịch người.
 * Vẫn đúng dạng `{ vi, en }` để không phá luật R6, nhưng `en` chỉ là bản sao.
 * TODO: dịch — cần người dịch duyệt, không dịch máy ở tầng dữ liệu.
 */
export function viOnly(vi: string): I18nText {
    return t(vi, vi)
}

// ============================================================== ánh xạ hạng phòng

/** Ưu tiên `detailSize` (lấy từ trang chi tiết), lùi về `size` khi rỗng. */
function pickArea(raw: SeedRoomType): string {
    const area = raw.detailSize.trim() || raw.size.trim()
    // Seed viết liền "28m²"; chèn khoảng trắng cho khớp cách hiển thị của core.
    return area.replace(/(\d)\s*m²/, '$1 m²')
}

/** Số khách tiêu chuẩn. Seed chỉ có sức chứa tối đa nên phải suy ra. */
function pickStandardGuests(raw: SeedRoomType): number {
    // Tóm tắt hay ghi thẳng "Mặc định 2 người" — tin con số đó trước.
    const explicit = raw.summary.match(/mặc định\s*(\d+)\s*(?:người|khách)/i)
    if (explicit?.[1]) return Number(explicit[1])
    // Không ghi rõ: có phụ thu giường phụ nghĩa là sức chứa max cần trả thêm,
    // nên số tiêu chuẩn thấp hơn; quy ước 2 người như lễ tân vẫn báo.
    if (raw.extraBedFee > 0 && raw.capacity > 2) return 2
    return raw.capacity
}

/**
 * Nhãn phân loại cho card phòng.
 *
 * Suy ra từ dữ liệu có sẵn, KHÔNG bịa: hướng nhìn → ban công → quy mô khách.
 * Giới hạn 3 nhãn để card của mọi theme không vỡ layout.
 */
function buildTags(raw: SeedRoomType): I18nText[] {
    const tags: I18nText[] = []

    const view = raw.view.trim() || raw.viewDetail[0]?.trim() || ''
    // Bỏ qua phần tử viewDetail là cả một câu văn (phòng #06) — không phải nhãn.
    if (view && view.length <= 40) tags.push(translate(view))

    if (raw.hasBalcony) tags.push(t('Ban công', 'Balcony'))

    if (raw.capacity >= 6) tags.push(t('Nhóm lớn', 'Large group'))
    else if (raw.capacity >= 4) tags.push(t('Gia đình', 'Family'))
    else if (raw.capacity === 3) tags.push(t('03 khách', '3 guests'))
    else tags.push(t('Đôi', 'Couple'))

    return tags.slice(0, 3)
}

/** Một hạng phòng RAW → `Room` của core. */
export function mapSeedToRoom(raw: SeedRoomType): Room {
    return {
        id: raw.id,
        name: viOnly(raw.name), // TODO: dịch tên phòng
        desc: viOnly(raw.summary.trim()), // TODO: dịch tóm tắt
        area: pickArea(raw),
        guests: pickStandardGuests(raw),
        price: raw.price,
        tags: buildTags(raw),
        images: propertyImages(raw.images),
        // Phần biên tập viên quyết định, không có trong bản crawl.
        ...(roomBusinessInfo[raw.id] ?? {}),
    }
}

/** Toàn bộ hạng phòng còn nhận đặt. */
export function mapSeedToRooms(seed: SeedData): Room[] {
    return seed.roomTypes.filter((raw) => raw.availability).map(mapSeedToRoom)
}

/** Một hạng phòng RAW → `RoomExtra`. */
export function mapSeedToRoomExtra(raw: SeedRoomType): RoomExtra {
    // Loại phần tử viewDetail là câu văn dài (phòng #06 lẫn nguyên đoạn mô tả).
    const viewLabel =
        raw.viewDetail.find((v) => v.trim().length > 0 && v.trim().length <= 40) ??
        raw.view.trim()

    return {
        maxGuests: raw.capacity,
        defaultGuests: pickStandardGuests(raw),
        extraBed: raw.extraBedFee,
        // Seed không tách riêng cấu hình giường — tóm tắt là chỗ duy nhất nhắc
        // tới nó. TODO: tách "01 giường đôi lớn" thành trường riêng khi crawl lại.
        bed: viOnly(raw.summary.trim()),
        view: viewLabel ? translate(viewLabel) : t('Đang cập nhật', 'To be updated'),
        long: viOnly(raw.description[0]?.trim() ?? ''), // TODO: dịch mô tả dài
        ...(raw.description[1]
            ? { long2: viOnly(raw.description[1].trim()) } // TODO: dịch
            : {}),
        amenities: raw.amenities.map(translate),
        conditions: raw.conditions.map(translate),
    }
}

/** Bảng tra `Room.id` → `RoomExtra`, khớp đúng tập phòng của `mapSeedToRooms`. */
export function mapSeedToRoomExtras(seed: SeedData): Record<string, RoomExtra> {
    const extras: Record<string, RoomExtra> = {}
    for (const raw of seed.roomTypes) {
        if (!raw.availability) continue
        extras[raw.id] = mapSeedToRoomExtra(raw)
    }
    return extras
}

// ==================================================================== hợp nhất

/**
 * Ghép seed crawl lên trên dữ liệu thủ công.
 *
 * NGUYÊN TẮC: `base` là nền, seed chỉ ĐÈ những phần nó thực sự có. Seed crawl
 * chỉ chứa hạng phòng, thông tin liên hệ và vài đoạn giới thiệu ẩm thực — nó
 * KHÔNG có tours, places, hero, about, facts, faq, addons, transport, notes.
 * Những nhánh đó phải giữ nguyên của `base`, nếu không giao diện sẽ trống hàng
 * loạt section. Đây là điểm dễ sai nhất của cả file, đừng "đơn giản hoá" thành
 * spread cả object.
 *
 * Hai nhánh được đè:
 * - `rooms` / `roomExtras`: seed có 20 hạng phòng thật, hơn hẳn dữ liệu mẫu.
 * - `brand`: lấy địa chỉ / điện thoại / email thật từ trang liên hệ.
 *
 * `dining` KHÔNG đè: seed chỉ có 3 đoạn văn giới thiệu chung, không tách được
 * thành danh sách `Dining[]` có id — đè vào sẽ làm mất dữ liệu tốt hơn của base.
 */
export function mergeSeed(base: PropertyData, seed: SeedData): PropertyData {
    const rooms = mapSeedToRooms(seed)
    const roomExtras = mapSeedToRoomExtras(seed)

    return {
        ...base,

        brand: {
            ...base.brand,
            address: viOnly(seed.contact.address), // TODO: dịch địa chỉ
            phone: seed.contact.phone,
            email: seed.contact.email,
        },

        // Chỉ thay khi seed thật sự có phòng — tránh trường hợp seed hỏng làm
        // trắng cả trang.
        rooms: rooms.length > 0 ? rooms : base.rooms,
        roomExtras: rooms.length > 0 ? roomExtras : base.roomExtras,
    }
}
