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
import { blogPosts } from './data/blog'
import { diningMenu } from './data/dining-menu'
import { exploreSpots, satelliteIslands, tripPlans } from './data/explore'
import type {
    Addon,
    Amenity,
    BlogPost,
    Dining,
    ExploreSpot,
    GalleryItem,
    MenuCategory,
    Place,
    PropertyData,
    Review,
    Room,
    RoomExtra,
    SatelliteIsland,
    Tour,
    TripPlan,
} from './types'

/** Id cơ sở lưu trú mặc định khi chưa có multi-tenant. */
export const DEFAULT_PROPERTY_ID = 'nam-du-hill'

/**
 * Seed tĩnh — nguồn dự phòng khi chưa ai tiêm nguồn dữ liệu thật.
 *
 * Đến từ đúng một đầu mối `./data` (luật R8). Không import thẳng file nội dung
 * ở đây — `./data/index.ts` mới là nơi quyết định dùng bản thủ công hay bản
 * ghép seed crawl.
 */
const staticProperties: Record<string, PropertyData> = {
    [DEFAULT_PROPERTY_ID]: propertyData,
}

/**
 * Cổng tiêm nguồn dữ liệu — ticket 200-01 §6.3.
 *
 * Vì sao `core` KHÔNG tự tạo Supabase client:
 *
 *   1. `@repo/core` phải chạy được trong Node thuần, không kéo dependency
 *      runtime (luật BE9/R2). Import `@supabase/supabase-js` ở đây là phá luật.
 *   2. Cả 4 theme import `core` vào **bundle client**. Kéo client Supabase vào
 *      nghĩa là mọi trang công khai tải thêm SDK và lộ cấu hình.
 *
 * Nên `core` chỉ khai một cổng; app gọi `setPropertySource()` đúng một lần ở
 * `src/lib/data/bootstrap.ts` (server-only) với client Supabase của nó.
 */
export interface PropertySource {
    load(propertyId: string): Promise<PropertyData>
}

let source: PropertySource | null = null

/**
 * Bộ nhớ đệm những cơ sở lưu trú đã nạp xong.
 *
 * Đây là thứ giữ cho `getPropertySync()` không chết sau khi chuyển sang
 * Supabase: nó phục vụ từ đây thay vì biến mất (§6.3 điều 2).
 */
const cache: Record<string, PropertyData> = {}

/**
 * Khai nguồn dữ liệu thật. Gọi một lần lúc khởi động phía server.
 *
 * Chưa gọi → mọi hàm dưới đây dùng seed tĩnh trong `./data` như trước. Nhờ vậy
 * 4 theme và `pnpm build:safe` không vỡ khi chưa có DB (AC-13).
 */
export function setPropertySource(next: PropertySource): void {
    source = next
}

/** Xoá bộ nhớ đệm — dùng khi CMS vừa sửa nội dung và cần nạp lại. */
export function clearPropertyCache(propertyId?: string): void {
    if (propertyId) {
        delete cache[propertyId]
        return
    }
    for (const key of Object.keys(cache)) delete cache[key]
}

export async function getProperty(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<PropertyData> {
    const cached = cache[propertyId]
    if (cached) return cached

    if (source) {
        // Không bọc try/catch nuốt lỗi ở đây (luật C3): nguồn thật hỏng thì nơi
        // gọi phải biết, chứ không được âm thầm rơi về seed tĩnh rồi hiện dữ
        // liệu cũ như thể mọi thứ bình thường.
        const loaded = await source.load(propertyId)
        cache[propertyId] = loaded
        return loaded
    }

    return getPropertySync(propertyId)
}

/**
 * Bản đồng bộ của `getProperty()`.
 *
 * Chỉ dành cho những chỗ BẮT BUỘC phải đồng bộ — cụ thể là hàm khởi tạo state
 * của store phía client, nơi React không cho phép await.
 *
 * Mọi chỗ khác dùng `getProperty()`. Thứ tự phục vụ: bộ nhớ đệm đã nạp → seed
 * tĩnh. **Chưa nạp thì trả seed tĩnh, KHÔNG ném lỗi** — ném ở đây là giết render
 * phía client (§6.3 điều 2 / AC-13).
 */
export function getPropertySync(
    propertyId: string = DEFAULT_PROPERTY_ID,
): PropertyData {
    const property = cache[propertyId] ?? staticProperties[propertyId]
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

/**
 * Bốn nguồn dưới đây hiện chung cho mọi cơ sở lưu trú (chưa multi-tenant) nên
 * chưa nhận `propertyId`. Chữ ký sẽ thêm tham số đó khi tách theo tenant —
 * vẫn `async` sẵn nên nơi gọi không phải sửa.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
    return blogPosts
}

export async function getBlogPost(id: string): Promise<BlogPost | undefined> {
    return blogPosts.find((post) => post.id === id)
}

export async function getExploreSpots(): Promise<ExploreSpot[]> {
    return exploreSpots
}

export async function getSatelliteIslands(): Promise<SatelliteIsland[]> {
    return satelliteIslands
}

export async function getTripPlans(): Promise<Record<string, TripPlan>> {
    return tripPlans
}

export async function getDiningMenu(): Promise<Record<string, MenuCategory>> {
    return diningMenu
}
