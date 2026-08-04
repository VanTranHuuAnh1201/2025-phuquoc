/**
 * Lớp truy cập dữ liệu.
 *
 * Mọi theme đọc dữ liệu qua đây, không bao giờ import thẳng file nội dung và
 * không tự khai mock data (luật R8). Khi đổi sang Supabase hay REST API, chỉ
 * thay phần thân các hàm dưới đây — theme không phải sửa một dòng nào.
 *
 * Các hàm để `async` ngay từ đầu, dù hiện tại đọc từ bộ nhớ, để chữ ký không
 * phải đổi khi có backend thật.
 */

import { propertyData } from './data'
import type {
    Addon,
    Amenity,
    Dining,
    GalleryItem,
    Place,
    PropertyData,
    Review,
    Room,
    RoomExtra,
    Tour,
} from './types'

/** Id cơ sở lưu trú mặc định khi chưa có multi-tenant. */
export const DEFAULT_PROPERTY_ID = 'nam-du-hill'

/**
 * Nguồn dữ liệu chung cho cả N theme, đến từ đúng một đầu mối `./data`
 * (luật R8). Không import thẳng file nội dung ở đây — `./data/index.ts` mới là
 * nơi quyết định dùng bản thủ công hay bản ghép seed crawl.
 */
const properties: Record<string, PropertyData> = {
    [DEFAULT_PROPERTY_ID]: propertyData,
}

export async function getProperty(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<PropertyData> {
    return getPropertySync(propertyId)
}

/**
 * Bản đồng bộ của `getProperty()`.
 *
 * Chỉ dành cho những chỗ BẮT BUỘC phải đồng bộ — cụ thể là hàm khởi tạo state
 * của store phía client, nơi React không cho phép await.
 *
 * Mọi chỗ khác dùng `getProperty()`. Khi chuyển sang Supabase, hàm này sẽ phục
 * vụ từ bộ nhớ đệm đã nạp sẵn chứ không biến mất — nhờ vậy nơi gọi không phải
 * sửa. Đây là lý do nó tồn tại thay vì để mỗi nơi tự lách một kiểu.
 */
export function getPropertySync(
    propertyId: string = DEFAULT_PROPERTY_ID,
): PropertyData {
    const property = properties[propertyId]
    if (!property) {
        throw new Error(`Không tìm thấy dữ liệu cho property "${propertyId}"`)
    }
    return property
}

export async function getRooms(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Room[]> {
    return (await getProperty(propertyId)).rooms
}

export async function getRoom(
    roomId: string,
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Room | undefined> {
    return (await getRooms(propertyId)).find((room) => room.id === roomId)
}

export async function getRoomExtra(
    roomId: string,
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<RoomExtra | undefined> {
    return (await getProperty(propertyId)).roomExtras[roomId]
}

export async function getAddons(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Addon[]> {
    return (await getProperty(propertyId)).addons
}

export async function getTours(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Tour[]> {
    return (await getProperty(propertyId)).tours
}

export async function getDining(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Dining[]> {
    return (await getProperty(propertyId)).dining
}

export async function getPlaces(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Place[]> {
    return (await getProperty(propertyId)).places
}

/**
 * Ba hàm dưới trả mảng rỗng khi cơ sở lưu trú chưa khai — nơi gọi không phải
 * kiểm tra `undefined` rải rác.
 */
export async function getGallery(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<GalleryItem[]> {
    return (await getProperty(propertyId)).gallery ?? []
}

export async function getAmenities(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Amenity[]> {
    return (await getProperty(propertyId)).amenities ?? []
}

export async function getReviews(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<Review[]> {
    return (await getProperty(propertyId)).reviews ?? []
}
