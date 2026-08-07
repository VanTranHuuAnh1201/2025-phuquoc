'use client'

/**
 * Khuyến mãi — admin thêm/sửa/bật/tắt.
 *
 * Toàn bộ logic áp giá nằm ở `@repo/core/promotion`. Store chỉ giữ danh sách.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { promotions as seedPromotions } from '@repo/core'
import type { Promotion } from '@repo/core'

interface PromotionState {
    items: Promotion[]

    /** Chỉ các khuyến mãi đang bật — dùng khi báo giá cho khách. */
    activeItems: () => Promotion[]
    get: (id: string) => Promotion | undefined

    fetchFromApi: () => Promise<void>
    upsert: (promotion: Promotion) => void
    toggle: (id: string) => void
    remove: (id: string) => void
    resetDemo: () => void
}

let promotionsInFlightPromise: Promise<void> | null = null

export const usePromotionStore = create<PromotionState>()(
    persist(
        (set, get) => ({
            items: seedPromotions,

            fetchFromApi: async () => {
                if (promotionsInFlightPromise) return promotionsInFlightPromise

                promotionsInFlightPromise = (async () => {
                    try {
                        const res = await fetch('/api/promotions')
                        if (!res.ok) return
                        const json = await res.json()
                        if (json && Array.isArray(json.data) && json.data.length > 0) {
                            set({ items: json.data })
                        }
                    } catch {
                        // Fallback to seed on network error
                    } finally {
                        promotionsInFlightPromise = null
                    }
                })()

                return promotionsInFlightPromise
            },

            activeItems: () => get().items.filter((p) => p.active),
            get: (id) => get().items.find((p) => p.id === id),

            upsert: (promotion) =>
                set((state) => {
                    const exists = state.items.some((p) => p.id === promotion.id)
                    return {
                        items: exists
                            ? state.items.map((p) => (p.id === promotion.id ? promotion : p))
                            : [...state.items, promotion],
                    }
                }),

            toggle: (id) =>
                set((state) => ({
                    items: state.items.map((p) =>
                        p.id === id ? { ...p, active: !p.active } : p,
                    ),
                })),

            remove: (id) => set((state) => ({ items: state.items.filter((p) => p.id !== id) })),

            resetDemo: () => set({ items: seedPromotions }),
        }),
        { name: 'namduhill.promotions', version: 1 },
    ),
)
