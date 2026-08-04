'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { Testimonial } from '../../data/property'

/**
 * Các cột đánh giá cuộn vô hạn.
 *
 * VÌ SAO CHIA CỘT CHỨ KHÔNG PHẢI MỘT DANH SÁCH DÀI: ba cột chạy lệch tốc độ và
 * lệch chiều tạo cảm giác chuyển động sống, trong khi một cột duy nhất trông
 * như trang đang tự cuộn — dễ nhầm là lỗi.
 *
 * VÌ SAO CHIỀU CAO NÉN CÒN ~360px: mọi section khác của trang chạy nhịp
 * `py-5 sm:py-7` và cao khoảng 300–400px. Một khối cao 700px lại còn chuyển
 * động liên tục sẽ hút hết mắt khỏi phần phòng và nút đặt — đó là thứ trang
 * này thật sự cần bán.
 *
 * VÌ SAO CSS THUẦN: đây là một phép tịnh tiến tuyến tính lặp vô hạn. CSS chạy
 * nó trên compositor, không tốn main thread và không cần thêm dependency nào.
 * Keyframes nằm ở `globals.css`.
 */

/** Nền avatar — xoay vòng theo index để hai card cạnh nhau không trùng màu. */
const AVATAR_TONES = ['bg-[#1D4E89]', 'bg-[#0F2D52]', 'bg-[#2563A6]'] as const

const toneAt = (i: number) => AVATAR_TONES[i % AVATAR_TONES.length] ?? AVATAR_TONES[0]

function TestimonialCard({ item, tone }: { item: Testimonial; tone: string }) {
    const { language } = useLanguage()

    return (
        <figure className="bg-white border border-[#ECECEC] rounded-[12px] p-3.5 shadow-2xs">
            {/* Sao — số sao đọc được bằng chữ ở `aria-label`, không chỉ bằng màu (luật D4) */}
            <div
                className="flex gap-0.5 mb-2"
                role="img"
                aria-label={
                    language === 'vi'
                        ? `${item.rating} trên 5 sao`
                        : `${item.rating} out of 5 stars`
                }
            >
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        aria-hidden="true"
                        className={
                            i < item.rating
                                ? 'w-3 h-3 fill-[#FFB800] text-[#FFB800]'
                                : 'w-3 h-3 text-[#E5E7EB]'
                        }
                    />
                ))}
            </div>

            <blockquote className="text-[11px] sm:text-xs text-[#1A1A1A] leading-relaxed font-normal">
                &ldquo;{item.quote[language]}&rdquo;
            </blockquote>

            <figcaption className="flex items-center gap-2 mt-2.5">
                {/* Chữ cái đầu thay ảnh: review demo, không dựng mặt người thật */}
                <span
                    aria-hidden="true"
                    className={`w-6 h-6 rounded-full ${tone} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
                >
                    {item.name.charAt(0)}
                </span>
                <span className="text-[10px] font-bold text-[#0F2D52] uppercase tracking-wider leading-tight">
                    {item.name}
                    <span className="text-[#6B7280] font-medium normal-case tracking-normal">
                        {' · '}
                        {item.from[language]}
                    </span>
                </span>
            </figcaption>
        </figure>
    )
}

/**
 * Một cột cuộn.
 *
 * Danh sách được render HAI lần trong cùng track: track chạy tới -50% rồi lặp,
 * đúng lúc bản sao thứ hai về đúng chỗ bản đầu — nên không thấy điểm nối.
 * Bản sao thứ hai `aria-hidden` để screen reader không đọc lại.
 */
function ScrollingColumn({
    items,
    duration,
    reverse = false,
    className = '',
}: {
    items: Testimonial[]
    duration: number
    reverse?: boolean
    className?: string
}) {
    return (
        <div className={`testimonial-viewport ${className}`}>
            <div
                className={`testimonial-track flex flex-col gap-3 ${reverse ? 'testimonial-track--reverse' : ''}`}
                style={{ '--testimonial-duration': `${duration}s` } as React.CSSProperties}
            >
                {[0, 1].map((copy) => (
                    <React.Fragment key={copy}>
                        {items.map((item, i) => (
                            <div key={`${copy}-${item.id}`} aria-hidden={copy === 1 || undefined}>
                                <TestimonialCard item={item} tone={toneAt(i)} />
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

/**
 * Khối ba cột. Mobile chỉ hiện một cột, tablet hai, desktop đủ ba — cột thứ ba
 * hẹp quá thì chữ vỡ thành từng dòng một hai chữ, đọc không nổi.
 *
 * Tốc độ ba cột cố ý lệch nhau (nguyên tố cùng nhau) để chu kỳ không trùng khớp
 * và mắt không bắt được quy luật lặp.
 */
export function TestimonialColumns({ items }: { items: Testimonial[] }) {
    const size = Math.ceil(items.length / 3)
    const [first = [], second = [], third = []] = [
        items.slice(0, size),
        items.slice(size, size * 2),
        items.slice(size * 2),
    ]

    return (
        <div
            className="
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3
                h-[300px] sm:h-[340px] lg:h-[360px] overflow-hidden
                [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]
                [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]
            "
        >
            <ScrollingColumn items={first} duration={38} />
            <ScrollingColumn items={second} duration={47} reverse className="hidden sm:block" />
            <ScrollingColumn items={third} duration={43} className="hidden lg:block" />
        </div>
    )
}
