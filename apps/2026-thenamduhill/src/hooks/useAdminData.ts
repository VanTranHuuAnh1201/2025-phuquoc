'use client'

import { useCallback, useEffect, useState } from 'react'
import { useBookingStore } from '@/stores/booking.store'
import { usePromotionStore } from '@/stores/promotion.store'

/**
 * Hook tập trung quản lý fetching đơn hàng từ REST API với đầy đủ trạng thái loading & error.
 */
export function useBookingsData() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const bookings = useBookingStore((s) => s.bookings)
    const customers = useBookingStore((s) => s.customers)
    const roomUnits = useBookingStore((s) => s.roomUnits)
    const inventory = useBookingStore((s) => s.inventory)
    const fetchBookingsFromApi = useBookingStore((s) => s.fetchBookingsFromApi)

    const refetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            await fetchBookingsFromApi()
        } catch (err: any) {
            setError(err?.message || 'Không thể tải dữ liệu đơn hàng.')
        } finally {
            setLoading(false)
        }
    }, [fetchBookingsFromApi])

    useEffect(() => {
        let mounted = true
        refetch().then(() => {
            if (!mounted) return
        })
        return () => {
            mounted = false
        }
    }, [refetch])

    return {
        bookings,
        customers,
        roomUnits,
        inventory,
        loading,
        error,
        refetch,
    }
}

/**
 * Hook tập trung quản lý danh sách khuyến mãi từ REST API.
 */
export function usePromotionsData() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const promotions = usePromotionStore((s) => s.items)
    const toggle = usePromotionStore((s) => s.toggle)
    const upsert = usePromotionStore((s) => s.upsert)
    const fetchFromApi = usePromotionStore((s) => s.fetchFromApi)

    const refetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            await fetchFromApi()
        } catch (err: any) {
            setError(err?.message || 'Không thể tải danh sách khuyến mãi.')
        } finally {
            setLoading(false)
        }
    }, [fetchFromApi])

    useEffect(() => {
        let mounted = true
        refetch().then(() => {
            if (!mounted) return
        })
        return () => {
            mounted = false
        }
    }, [refetch])

    return {
        promotions,
        loading,
        error,
        toggle,
        upsert,
        refetch,
    }
}

let accountsInFlightPromise: Promise<any> | null = null

/**
 * Hook tập trung quản lý danh sách tài khoản nhân viên từ REST API.
 */
export function useAccountsData() {
    const [accounts, setAccounts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            if (!accountsInFlightPromise) {
                accountsInFlightPromise = fetch('/api/admin/accounts').then((res) => res.json())
            }
            const json = await accountsInFlightPromise
            if (json.success && Array.isArray(json.data)) {
                setAccounts(json.data)
            } else {
                setError(json.error?.message || 'Không thể tải tài khoản.')
            }
        } catch (err: any) {
            setError(err?.message || 'Lỗi mạng khi tải tài khoản.')
        } finally {
            accountsInFlightPromise = null
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let mounted = true
        refetch().then(() => {
            if (!mounted) return
        })
        return () => {
            mounted = false
        }
    }, [refetch])

    return {
        accounts,
        setAccounts,
        loading,
        error,
        refetch,
    }
}
