'use client'

/**
 * Thông báo cho chuông trên header.
 *
 * Chỉ giữ dữ liệu — câu chữ do component dựng theo `kind` và `payload`, vì
 * `core` không chứa chuỗi giao diện (luật R2/R6).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification, NotificationKind } from '@repo/core'
import { getDemoData } from './demo-data'

interface NotifyState {
    items: Notification[]

    /** Thông báo của một tài khoản, mới nhất trước. */
    listFor: (accountId: string) => Notification[]
    unreadCount: (accountId: string) => number

    push: (input: Omit<Notification, 'id' | 'at' | 'read'> & { at?: string }) => void
    markRead: (id: string) => void
    markAllRead: (accountId: string) => void
    clear: (accountId: string) => void
}

let counter = 0

export const useNotifyStore = create<NotifyState>()(
    persist(
        (set, get) => ({
            items: getDemoData().notifications,

            listFor: (accountId) =>
                get()
                    .items.filter((n) => n.accountId === accountId)
                    .sort((a, b) => b.at.localeCompare(a.at)),

            unreadCount: (accountId) =>
                get().items.filter((n) => n.accountId === accountId && !n.read).length,

            push: (input) => {
                counter += 1
                const at = input.at ?? new Date().toISOString()
                set((state) => ({
                    items: [
                        { ...input, id: `ntf-${at}-${counter}`, at, read: false },
                        ...state.items,
                    ],
                }))
            },

            markRead: (id) =>
                set((state) => ({
                    items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
                })),

            markAllRead: (accountId) =>
                set((state) => ({
                    items: state.items.map((n) =>
                        n.accountId === accountId ? { ...n, read: true } : n,
                    ),
                })),

            clear: (accountId) =>
                set((state) => ({
                    items: state.items.filter((n) => n.accountId !== accountId),
                })),
        }),
        { name: 'namduhill.notifications', version: 1 },
    ),
)

/** Các loại thông báo có nút dẫn tới chi tiết đơn. */
export const KINDS_WITH_BOOKING: NotificationKind[] = [
    'booking-created',
    'payment-success',
    'booking-confirmed',
    'booking-cancelled',
    'check-in-reminder',
    'review-request',
]
