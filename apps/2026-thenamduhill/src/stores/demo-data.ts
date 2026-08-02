/**
 * Nguồn dữ liệu demo dùng chung cho mọi store.
 *
 * Sinh MỘT LẦN rồi cache, không sinh lại mỗi lần store khởi tạo — nếu sinh lại
 * thì mỗi store sẽ có một bộ đơn hàng khác nhau và CMS không khớp client.
 *
 * Nội dung lấy qua `getPropertySync()` của repository, không import thẳng file
 * trong `core/src/data/` (luật R8).
 */

import { buildRoomUnits, generateDemoData, getPropertySync } from '@repo/core'
import type { DemoData } from '@repo/core'

/** Hôm nay dạng YYYY-MM-DD. */
export function todayKey(): string {
    return new Date().toISOString().slice(0, 10)
}

let demoCache: DemoData | undefined

/** Dữ liệu demo. Gọi bao nhiêu lần cũng trả cùng một bộ. */
export function getDemoData(): DemoData {
    if (!demoCache) {
        const property = getPropertySync()
        const roomUnits = buildRoomUnits(property.rooms.map((r) => r.id))
        demoCache = generateDemoData({
            rooms: property.rooms,
            roomExtras: property.roomExtras,
            addons: property.addons,
            roomUnits,
            today: todayKey(),
        })
    }
    return demoCache
}
