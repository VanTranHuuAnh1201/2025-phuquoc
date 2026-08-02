'use client'

import { useEffect, useState } from 'react'

/**
 * Đã cuộn quá ngưỡng chưa.
 *
 * Cả bốn mẫu đều đổi diện mạo header khi cuộn (trong suốt → nền đặc). Hành vi
 * giống hệt nhau, chỉ khác cách vẽ — nên logic nằm ở `ui`, còn hình thức do
 * theme quyết định.
 */
export function useScrolled(threshold = 60): boolean {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > threshold)
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [threshold])

    return scrolled
}
