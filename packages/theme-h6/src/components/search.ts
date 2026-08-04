'use client'

import { useEffect, useState } from 'react'
import { addDays, toDateKey, type GuestCount, type Locale } from '@repo/core'

/**
 * Trạng thái tìm phòng dùng chung cho Hero → Rooms → RoomDetail.
 *
 * Ngày mặc định là ĐỘNG (hôm nay +7, ở 2 đêm) — teardown phát hiện site cũ
 * hard-code `'15 Th8'` thành tín hiệu "site bỏ hoang" (spec §3.1).
 *
 * Lựa chọn đi giữa các trang bằng query (`?in=&out=&ad=&ch=`) vì theme không
 * được import store của app (luật R1); giỏ hàng thật do luồng checkout của app
 * quản. Đây chỉ là "ngày đang xem", không phải giỏ.
 */

export interface StaySearch {
    /** YYYY-MM-DD. */
    checkIn: string
    checkOut: string
    adults: number
    /** TUỔI từng trẻ (luật B2), không phải số lượng. */
    childAges: number[]
}

export function todayKey(): string {
    return toDateKey(Date.now())
}

export function defaultSearch(): StaySearch {
    const today = todayKey()
    return { checkIn: addDays(today, 7), checkOut: addDays(today, 9), adults: 2, childAges: [] }
}

export function toGuestCount(search: StaySearch): GuestCount {
    return { adults: search.adults, children: search.childAges }
}

/** Query string mang lựa chọn sang trang khác, giữ cả `lang`. */
export function searchQuery(search: StaySearch, locale: Locale, extra?: Record<string, string>): string {
    const params = new URLSearchParams()
    params.set('in', search.checkIn)
    params.set('out', search.checkOut)
    params.set('ad', String(search.adults))
    if (search.childAges.length > 0) params.set('ch', search.childAges.join(','))
    if (locale !== 'vi') params.set('lang', locale)
    for (const [key, value] of Object.entries(extra ?? {})) params.set(key, value)
    return `?${params.toString()}`
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Đọc lựa chọn từ URL hiện tại — phần thiếu giữ giá trị mặc định. */
export function readSearch(base: StaySearch, query: string): StaySearch {
    const params = new URLSearchParams(query)
    const checkIn = params.get('in')
    const checkOut = params.get('out')
    const adults = Number(params.get('ad'))
    const ch = params.get('ch')

    const next: StaySearch = { ...base }
    if (checkIn && DATE_RE.test(checkIn)) next.checkIn = checkIn
    if (checkOut && DATE_RE.test(checkOut) && checkOut > next.checkIn) next.checkOut = checkOut
    if (Number.isFinite(adults) && adults >= 1) next.adults = Math.min(10, Math.floor(adults))
    if (ch !== null) {
        next.childAges = ch
            .split(',')
            .map((age) => Number(age))
            .filter((age) => Number.isFinite(age) && age >= 0 && age <= 17)
            .slice(0, 6)
    }
    return next
}

/**
 * State tìm phòng, khởi tạo mặc định rồi đồng bộ từ URL sau khi mount.
 *
 * Đọc URL trong effect (không phải lúc render) để SSR và client render lần đầu
 * giống hệt nhau — tránh lệch hydration.
 */
export function useStaySearch(): [StaySearch, (next: StaySearch) => void] {
    const [search, setSearch] = useState<StaySearch>(defaultSearch)

    useEffect(() => {
        setSearch((prev) => readSearch(prev, window.location.search))
    }, [])

    const update = (next: StaySearch) => {
        setSearch(next)
        // Ghi lại lên URL để reload / chia sẻ link giữ nguyên lựa chọn.
        const params = new URLSearchParams(window.location.search)
        params.set('in', next.checkIn)
        params.set('out', next.checkOut)
        params.set('ad', String(next.adults))
        if (next.childAges.length > 0) params.set('ch', next.childAges.join(','))
        else params.delete('ch')
        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    }

    return [search, update]
}

/** 20/8 — hiển thị ngắn cho date bar và empty-state. */
export function shortDate(date: string, locale: Locale): string {
    const [, month, day] = date.split('-')
    if (!month || !day) return date
    return locale === 'vi'
        ? `${Number(day)}/${Number(month)}`
        : `${Number(day)}/${Number(month)}`
}

