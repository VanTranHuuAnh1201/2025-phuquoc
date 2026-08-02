'use client'

/**
 * Lựa chọn đang đặt, giữ xuyên suốt 4 bước.
 *
 * Persist là BẮT BUỘC, không phải tiện nghi: khách bấm "Đặt phòng" ở bước 2 sẽ
 * bị đẩy sang màn đăng nhập; nếu giỏ mất thì quay lại phải chọn phòng từ đầu và
 * gần như chắc chắn rời trang. Xem `.claude/rules/app-flows.md` §F1.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addDays } from '@repo/core'
import type { GuestCount } from '@repo/core'
import { todayKey } from './demo-data'

export interface GuestForm {
    fullName: string
    phone: string
    email: string
    idNumber: string
    estimatedArrivalTime: string
    specialRequests: string
    needInvoice: boolean
    taxCode: string
    companyName: string
}

const EMPTY_GUEST: GuestForm = {
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    estimatedArrivalTime: '',
    specialRequests: '',
    needInvoice: false,
    taxCode: '',
    companyName: '',
}

interface CartState {
    /** YYYY-MM-DD. */
    checkIn: string
    checkOut: string
    guests: GuestCount
    roomTypeId: string | null
    ratePlanId: string
    /** id addon → số lượng. */
    addons: Record<string, number>
    /** Mã khuyến mãi khách đã nhập. */
    promoCode: string
    guest: GuestForm

    setDates: (checkIn: string, checkOut: string) => void
    setGuests: (guests: GuestCount) => void
    selectRoom: (roomTypeId: string) => void
    selectRatePlan: (ratePlanId: string) => void
    setAddon: (addonId: string, quantity: number) => void
    setPromoCode: (code: string) => void
    updateGuest: (patch: Partial<GuestForm>) => void
    reset: () => void
    /** Đã chọn đủ để sang bước thông tin chưa. */
    isSelectionComplete: () => boolean
}

/** Mặc định: nhận phòng ngày mai, ở 2 đêm — lựa chọn hay gặp nhất. */
function defaultDates() {
    const today = todayKey()
    return { checkIn: addDays(today, 1), checkOut: addDays(today, 3) }
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            ...defaultDates(),
            guests: { adults: 2, children: [] },
            roomTypeId: null,
            ratePlanId: 'standard',
            addons: {},
            promoCode: '',
            guest: EMPTY_GUEST,

            setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
            setGuests: (guests) => set({ guests }),
            selectRoom: (roomTypeId) => set({ roomTypeId }),
            selectRatePlan: (ratePlanId) => set({ ratePlanId }),

            setAddon: (addonId, quantity) =>
                set((state) => {
                    const addons = { ...state.addons }
                    if (quantity <= 0) delete addons[addonId]
                    else addons[addonId] = quantity
                    return { addons }
                }),

            setPromoCode: (promoCode) => set({ promoCode }),
            updateGuest: (patch) => set((state) => ({ guest: { ...state.guest, ...patch } })),

            reset: () =>
                set({
                    ...defaultDates(),
                    guests: { adults: 2, children: [] },
                    roomTypeId: null,
                    ratePlanId: 'standard',
                    addons: {},
                    promoCode: '',
                    guest: EMPTY_GUEST,
                }),

            isSelectionComplete: () => {
                const s = get()
                return Boolean(s.roomTypeId && s.checkIn && s.checkOut && s.checkOut > s.checkIn)
            },
        }),
        { name: 'namduhill.cart' },
    ),
)
