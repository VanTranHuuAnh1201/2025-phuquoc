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

/**
 * Một yêu cầu báo giá đầy đủ — mọi thứ engine cần, không thiếu gì.
 *
 * Có kiểu này thì CMS báo giá được mà không phải mượn `cart.store` của khách.
 */
export interface QuoteRequest {
    roomTypeId: string
    checkIn: string
    checkOut: string
    guests: GuestCount
    ratePlanId: string
    addons: Record<string, number>
    promoCode?: string
    /** `web` cho khách tự đặt; `phone` / `walk-in` cho lễ tân nhập hộ. */
    channel: Channel
}

/**
 * Báo giá theo tham số truyền vào — KHÔNG đọc `cart.store`.
 *
 * Đây là engine thật. `useQuoteFor()` chỉ là lớp mỏng nạp tham số từ giỏ hàng.
 * Lý do tách: màn tạo đơn thủ công của CMS mà đọc/ghi `cart.store` thì lễ tân
 * nhập đơn hộ sẽ giẫm lên giỏ hàng của khách đang mở tab bên cạnh.
 *
 * Một engine, hai lối vào ⇒ giá lễ tân nhập luôn khớp từng đồng với giá web
 * (luật R8), do dùng chung hàm chứ không do trùng hợp.
 */
export function useQuoteOf(req: QuoteRequest | null): Quote | null {
    const inventory = useBookingStore((s) => s.inventory)
    const promotions = usePromotionStore((s) => s.items)

    const { roomTypeId, checkIn, checkOut, guests, ratePlanId, addons, promoCode, channel } =
        req ?? {}

    return useMemo(() => {
        if (!roomTypeId || !checkIn || !checkOut || !guests || !ratePlanId || !channel) return null

        const property = getPropertySync()
        const room = property.rooms.find((r) => r.id === roomTypeId)
        if (!room) return null

        return buildQuote({
            room,
            roomExtra: property.roomExtras[room.id],
            checkIn,
            checkOut,
            guests,
            seasons,
            inventory,
            ratePlan: ratePlans.find((p) => p.id === ratePlanId),
            addons: addons ?? {},
            addonCatalog: property.addons,
            childPolicy,
            promotions: promotions.filter((p) => p.active),
            channel,
            today: todayKey(),
            enteredCode: promoCode || undefined,
        })
    }, [
        roomTypeId,
        checkIn,
        checkOut,
        guests,
        ratePlanId,
        addons,
        promoCode,
        channel,
        inventory,
        promotions,
    ])
}

/** Báo giá cho một hạng phòng cụ thể với lựa chọn hiện tại trong giỏ. */
export function useQuoteFor(roomTypeId: string | null): Quote | null {
    const cart = useCartStore()

    return useQuoteOf(
        roomTypeId
            ? {
                  roomTypeId,
                  checkIn: cart.checkIn,
                  checkOut: cart.checkOut,
                  guests: cart.guests,
                  ratePlanId: cart.ratePlanId,
                  addons: cart.addons,
                  promoCode: cart.promoCode,
                  channel: 'web',
              }
            : null,
    )
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
