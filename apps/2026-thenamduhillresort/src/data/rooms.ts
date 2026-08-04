/**
 * Hạng phòng — đọc từ `@repo/core`, KHÔNG khai dữ liệu tại đây (luật R8).
 *
 * Trước đây file này chứa 1693 dòng dữ liệu chép tay. Nhưng `core` đã có đúng
 * 20 hạng phòng ấy, crawl từ cùng nguồn thenamduhill.com và phục vụ qua
 * repository — bản chép ở app chỉ là bản sao thừa, sửa giá một chỗ là lệch
 * ngay. Nay file chỉ còn là lớp CHUYỂN ĐỔI hình dạng.
 *
 * VÌ SAO CÒN LỚP CHUYỂN ĐỔI: giao diện app này dựng theo shape phẳng
 * (`name`/`nameEn`, `cap`, `exPrice`…) từ trước khi nối vào core. Giữ shape đó
 * để 8 file đang dùng không phải sửa cùng lúc; chuyển sang đọc thẳng
 * `I18nText` là việc riêng, làm sau.
 *
 * Nguồn thật: `packages/core/src/data/` — sửa nội dung phòng ở đó.
 */

import {
    getPropertySync,
    type Room as CoreRoom,
    type RoomExtra,
} from '@repo/core'

export interface RoomReview {
    who: string
    score: string
    text: string
    textEn: string
}

export interface Room {
    code: string
    name: string
    nameEn: string
    area: number
    cap: number
    price: number
    exPrice: number
    view: string
    viewEn: string
    group: 'couple' | 'family' | 'suite'
    tag?: string
    tagEn?: string
    hot?: number
    darkTag?: boolean
    blurb?: string
    blurbEn?: string
    amenities?: Array<[string, string]>
    conditions?: string[]
    description?: string[]
    images: string[]
    reviews?: RoomReview[]
    shots?: number
}

const property = getPropertySync()

/** "48 m²" → 48. Core giữ diện tích dạng chuỗi hiển thị, app cần số để lọc. */
function areaNumber(area: string): number {
    const n = parseInt(area.replace(/[^\d]/g, ''), 10)
    return Number.isFinite(n) ? n : 0
}

function toRoom(core: CoreRoom, extra: RoomExtra | undefined): Room {
    return {
        code: core.id,
        name: core.name.vi,
        nameEn: core.name.en,
        area: areaNumber(core.area),
        cap: extra?.maxGuests ?? core.guests,
        price: core.price,
        exPrice: core.extraBedFee ?? extra?.extraBed ?? 0,
        view: extra?.view.vi ?? '',
        viewEn: extra?.view.en ?? '',
        group: core.group ?? 'couple',
        hot: core.remaining,
        blurb: core.desc.vi,
        blurbEn: core.desc.en,
        amenities: extra?.amenities.map((a) => [a.vi, a.en] as [string, string]),
        conditions: extra?.conditions.map((c) => c.vi),
        description: [extra?.long.vi, extra?.long2?.vi].filter(
            (x): x is string => Boolean(x),
        ),
        images: core.images ?? [],
        reviews: core.reviews?.map((r) => ({
            who: r.who,
            score: r.score,
            text: r.text.vi,
            textEn: r.text.en,
        })),
        shots: core.images?.length,
    }
}

export const ROOMS: Room[] = property.rooms.map((room) =>
    toRoom(room, property.roomExtras[room.id]),
)

/**
 * Tiện nghi mặc định — hiện khi một hạng phòng chưa khai riêng.
 * Lấy từ tiện ích chung của cơ sở lưu trú trong core.
 */
export const BASE_AMENITIES: Array<[string, string]> = (property.amenities ?? [])
    .slice(0, 6)
    .map((a) => [a.label.vi, a.label.en] as [string, string])

/** Tiền VND định dạng Việt. Bản theo ngôn ngữ dùng `formatPrice()` của core. */
export function formatVND(amount: number): string {
    return amount.toLocaleString('vi-VN') + '₫'
}

/**
 * Id phòng dùng trên URL.
 *
 * Core đã dùng slug làm id sẵn (`phong-deluxe-06`) nên không phải sinh nữa.
 * Giữ hàm để nơi gọi không phải sửa, và để có đúng một chỗ quyết định dạng URL
 * nếu sau này đổi.
 */
export function roomSlug(code: string): string {
    return code
}
