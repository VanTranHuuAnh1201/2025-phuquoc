'use client'

/**
 * Điểm hợp nhất DUY NHẤT để đọc dữ liệu nền đã merge (ticket `100-04` §6.2).
 *
 * Cùng tầng với `useQuote.ts` — tầng app, không phải `core`, không phải theme.
 *
 * Mọi nơi cần hạng phòng / gói giá / dịch vụ thêm ở phía CLIENT đều đi qua
 * đây, kể cả `useQuote.ts`. Không làm vậy thì admin sửa giá gốc ở CMS mà
 * `buildQuote()` vẫn đọc hằng số seed cũ ⇒ **giá trên CMS khác giá khách
 * thấy** (AC-5/AC-6).
 */

import { useMemo } from 'react'
import type { Addon, BankConfig, RatePlan, Room, RoomExtra } from '@repo/core'
import {
    mergeAddons,
    mergeRatePlans,
    mergeRoomExtras,
    mergeRooms,
    useCatalogStore,
} from './catalog.store'

/** Ảnh chụp phần state tham gia merge — dùng làm dependency của `useMemo`. */
function useCatalogSnapshot() {
    const roomOverrides = useCatalogStore((s) => s.roomOverrides)
    const ratePlanOverrides = useCatalogStore((s) => s.ratePlanOverrides)
    const addonOverrides = useCatalogStore((s) => s.addonOverrides)
    const roomsAdded = useCatalogStore((s) => s.roomsAdded)
    const ratePlansAdded = useCatalogStore((s) => s.ratePlansAdded)
    const addonsAdded = useCatalogStore((s) => s.addonsAdded)
    const removedIds = useCatalogStore((s) => s.removedIds)

    return useMemo(
        () => ({
            roomOverrides,
            ratePlanOverrides,
            addonOverrides,
            roomsAdded,
            ratePlansAdded,
            addonsAdded,
            removedIds,
        }),
        [
            roomOverrides,
            ratePlanOverrides,
            addonOverrides,
            roomsAdded,
            ratePlansAdded,
            addonsAdded,
            removedIds,
        ],
    )
}

/** Hạng phòng: seed + admin thêm − admin xoá, đã áp override. */
export function useRoomTypes(): Room[] {
    const snapshot = useCatalogSnapshot()
    return useMemo(() => mergeRooms(snapshot), [snapshot])
}

export function useRoomType(id: string | null | undefined): Room | undefined {
    const rooms = useRoomTypes()
    return useMemo(() => (id ? rooms.find((r) => r.id === id) : undefined), [rooms, id])
}

/** Phần mở rộng của hạng phòng (sức chứa tối đa, giường, tiện nghi…). */
export function useRoomExtras(): Record<string, RoomExtra> {
    const snapshot = useCatalogSnapshot()
    return useMemo(() => mergeRoomExtras(snapshot), [snapshot])
}

export function useRatePlans(): RatePlan[] {
    const snapshot = useCatalogSnapshot()
    return useMemo(() => mergeRatePlans(snapshot), [snapshot])
}

export function useAddons(): Addon[] {
    const snapshot = useCatalogSnapshot()
    return useMemo(() => mergeAddons(snapshot), [snapshot])
}

/** Tài khoản nhận cọc — bước 4 của luồng đặt phòng đọc hàm này (AC-16). */
export function useBankConfig(): BankConfig {
    return useCatalogStore((s) => s.bank)
}
