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

import { namDuHill } from './data/nam-du-hill'
import type { Addon, Dining, Place, PropertyData, Room, RoomExtra, Tour } from './types'

/** Id cơ sở lưu trú mặc định khi chưa có multi-tenant. */
export const DEFAULT_PROPERTY_ID = 'nam-du-hill'

const properties: Record<string, PropertyData> = {
    [DEFAULT_PROPERTY_ID]: namDuHill,
}

export async function getProperty(
    propertyId: string = DEFAULT_PROPERTY_ID,
): Promise<PropertyData> {
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
