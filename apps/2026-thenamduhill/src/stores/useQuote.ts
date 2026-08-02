'use client'

/**
 * Cầu nối duy nhất giữa store và engine giá của `@repo/core`.
 *
 * Mọi nơi cần con số — thẻ phòng, thanh tóm tắt, màn thanh toán, màn xem trước
 * của admin — đều gọi qua đây. Nhờ vậy không có hai chỗ nào tính khác nhau
 * (luật R8).
 */

import { useMemo } from 'react'
import {
    buildQuote,
    checkAvailability,
    childPolicy,
    getPropertySync,
    ratePlans,
    seasons,
} from '@repo/core'
import type { AvailabilityResult, Channel, GuestCount, Quote } from '@repo/core'
import { useBookingStore } from './booking.store'
import { useCartStore } from './cart.store'
import { usePromotionStore } from './promotion.store'
import { todayKey } from './demo-data'

/** Báo giá cho một hạng phòng cụ thể với lựa chọn hiện tại trong giỏ. */
export function useQuoteFor(roomTypeId: string | null): Quote | null {
    const cart = useCartStore()
    const inventory = useBookingStore((s) => s.inventory)
    const promotions = usePromotionStore((s) => s.items)

    return useMemo(() => {
        if (!roomTypeId) return null

        const property = getPropertySync()
        const room = property.rooms.find((r) => r.id === roomTypeId)
        if (!room) return null

        return buildQuote({
            room,
            roomExtra: property.roomExtras[room.id],
            checkIn: cart.checkIn,
            checkOut: cart.checkOut,
            guests: cart.guests,
            seasons,
            inventory,
            ratePlan: ratePlans.find((p) => p.id === cart.ratePlanId),
            addons: cart.addons,
            addonCatalog: property.addons,
            childPolicy,
            promotions: promotions.filter((p) => p.active),
            channel: 'web' as Channel,
            today: todayKey(),
            enteredCode: cart.promoCode || undefined,
        })
    }, [
        roomTypeId,
        cart.checkIn,
        cart.checkOut,
        cart.guests,
        cart.ratePlanId,
        cart.addons,
        cart.promoCode,
        inventory,
        promotions,
    ])
}

/** Báo giá cho hạng phòng đang chọn trong giỏ. */
export function useCurrentQuote(): Quote | null {
    const roomTypeId = useCartStore((s) => s.roomTypeId)
    return useQuoteFor(roomTypeId)
}

export interface RoomAvailability {
    roomTypeId: string
    result: AvailabilityResult
}

/**
 * Tình trạng còn phòng của TẤT CẢ hạng, cho khoảng ngày và số khách hiện tại.
 *
 * Dùng ở danh sách phòng: hạng nào hết thì vẫn hiện nhưng khoá lại, kèm lý do —
 * ẩn đi thì khách tưởng resort không có hạng đó.
 */
export function useAvailability(
    checkIn: string,
    checkOut: string,
    guests: GuestCount,
): RoomAvailability[] {
    const inventory = useBookingStore((s) => s.inventory)
    const ratePlanId = useCartStore((s) => s.ratePlanId)

    return useMemo(() => {
        const property = getPropertySync()
        const ratePlan = ratePlans.find((p) => p.id === ratePlanId)

        return property.rooms.map((room) => ({
            roomTypeId: room.id,
            result: checkAvailability({
                room,
                roomExtra: property.roomExtras[room.id],
                checkIn,
                checkOut,
                guests,
                seasons,
                inventory,
                ratePlan,
            }),
        }))
    }, [checkIn, checkOut, guests, inventory, ratePlanId])
}
