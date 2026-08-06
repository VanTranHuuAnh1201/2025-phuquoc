'use client'

import { useEffect, useState } from 'react'
import { formatPrice, pick, UI, type Locale } from '@repo/core'

import { H3 } from '../strings'

/**
 * Thanh đặt phòng dính đáy màn hình — CHỈ mobile.
 *
 * VÌ SAO CẦN: trên 375px, thanh tìm phòng của hero trôi khỏi màn hình ngay sau
 * cú vuốt đầu tiên, và phần còn lại của trang chủ dài gần chục section. Không
 * có thanh này thì từ section thứ hai trở đi khách không còn lối vào đặt phòng
 * nào trong tầm mắt (luật P10 — booking luôn nhìn thấy).
 *
 * VÌ SAO CHỈ MOBILE: desktop luôn còn header dính mang nút đặt phòng, thêm một
 * thanh nữa là hai CTA cùng cấp trên một viewport (luật P10 cấm).
 *
 * VÌ SAO ĐỢI CUỘN QUA HERO MỚI HIỆN: hiện ngay từ đầu thì nó che mất chính
 * thanh tìm phòng của hero — hai chỗ làm cùng một việc, chồng lên nhau.
 *
 * FORM CỦA NÓ khớp thanh đã có ở `RoomsPage`/`RoomDetailPage`: cùng nền, cùng
 * viền, cùng chiều cao chạm 44px. Ba thanh trông khác nhau trong cùng một mẫu
 * là dấu hiệu chưa có ngôn ngữ component (luật P7).
 */

export interface StickyBookBarProps {
    locale: Locale
    /** Giá thấp nhất trong các hạng phòng, VND. 0 hoặc âm thì thanh không hiện. */
    fromPrice: number
    /** Đích của nút — thường là trang danh sách phòng của mẫu. */
    href: string
}

export function StickyBookBar({ locale, fromPrice, href }: StickyBookBarProps) {
    const [shown, setShown] = useState(false)

    useEffect(() => {
        /*
         * Mốc 70vh ≈ chiều cao tối thiểu của hero (`min-h-[70vh]`). Cuộn quá đó
         * là thanh tìm phòng của hero chắc chắn đã ra khỏi tầm mắt.
         *
         * `passive: true` — handler không bao giờ gọi `preventDefault()`, khai
         * rõ để trình duyệt không phải chờ nó trước khi cuộn.
         */
        const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (fromPrice <= 0) return null

    return (
        <div
            /*
             * `translate-y-full` thay vì tháo khỏi DOM: giữ phần tử để chuyển
             * động trượt lên có chỗ bám, và để trình đọc màn hình không thấy
             * một khối nhảy vào giữa cây. `aria-hidden` + `inert` khi ẩn để nó
             * không nằm trong luồng Tab lúc chưa nhìn thấy được.
             */
            aria-hidden={!shown}
            inert={!shown ? true : undefined}
            className={`bg-surface-raised border-border-muted shadow-2 fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t p-[12px] transition-transform duration-[var(--motion-fast)] motion-reduce:transition-none md:hidden ${
                shown ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            <div className="min-w-0">
                <span className="text-text-tertiary block text-[10px] leading-none">
                    {pick(UI.from, locale)}
                </span>
                <span className="text-surface-strong text-base font-bold">
                    {formatPrice(fromPrice, locale)}
                </span>
                <span className="text-text-tertiary text-[10px]">
                    {pick(H3.stickyPerNight, locale)}
                </span>
            </div>
            <a
                href={href}
                className="bg-brand text-text-inverse focus-visible:outline-brand inline-flex min-h-[44px] shrink-0 items-center rounded-[6px] px-[20px] text-sm font-semibold no-underline transition-colors duration-150 hover:bg-[var(--brand-dark)] active:bg-[var(--brand-darker)] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                {pick(UI.bookNow, locale)}
            </a>
        </div>
    )
}
