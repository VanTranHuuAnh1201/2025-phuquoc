'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { pick, type Locale, type Review } from '@repo/core'

/**
 * Các cột đánh giá cuộn vô hạn.
 *
 * VÌ SAO NHẬN `Review` CỦA CORE CHỨ KHÔNG PHẢI TYPE RIÊNG: bản ở app khai một
 * interface `Testimonial` rồi ánh xạ `Review` sang nó — một lớp trung gian chỉ
 * để đổi tên trường. Theme không được định nghĩa type dữ liệu (luật R4), nên
 * ở đây đọc thẳng `Review`: `comment` thay cho `quote`, `from` optional.
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
 * Keyframes nằm ở `tokens.css` của chính mẫu này.
 */

/**
 * Nền avatar — xoay vòng theo index để hai card cạnh nhau không trùng màu.
 *
 * Ba tông đều là bậc của cùng một màu navy, đọc thẳng từ token. Bản gốc viết
 * ba hex thô; ở đây trỏ vào biến nên đổi bảng màu là ba tông đổi theo.
 */
const AVATAR_TONES = [
    'bg-[var(--brand)]',
    'bg-[var(--brand-dark)]',
    'bg-[var(--brand-light)]',
] as const

const toneAt = (i: number) => AVATAR_TONES[i % AVATAR_TONES.length] ?? AVATAR_TONES[0]

function TestimonialCard({
    item,
    tone,
    locale,
}: {
    item: Review
    tone: string
    locale: Locale
}) {
    return (
        <figure className="bg-surface-raised border-border-muted rounded-md border p-3.5 shadow-1">
            {/* Sao — số sao đọc được bằng chữ ở `aria-label`, không chỉ bằng màu (luật D4) */}
            <div
                className="mb-2 flex gap-0.5"
                role="img"
                aria-label={
                    locale === 'vi'
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
                                ? 'fill-accent text-accent h-3 w-3'
                                : 'text-border-default h-3 w-3'
                        }
                    />
                ))}
            </div>

            <blockquote className="text-text-primary text-[11px] leading-relaxed font-normal sm:text-xs">
                &ldquo;{pick(item.comment, locale)}&rdquo;
            </blockquote>

            <figcaption className="mt-2.5 flex items-center gap-2">
                {/* Chữ cái đầu thay ảnh: review demo, không dựng mặt người thật */}
                <span
                    aria-hidden="true"
                    className={`h-6 w-6 rounded-full ${tone} text-text-inverse flex shrink-0 items-center justify-center text-[10px] font-bold`}
                >
                    {item.name.charAt(0)}
                </span>
                <span className="text-surface-strong text-[10px] leading-tight font-bold tracking-wider uppercase">
                    {item.name}
                    {item.from && (
                        <span className="text-text-tertiary font-medium tracking-normal normal-case">
                            {' · '}
                            {pick(item.from, locale)}
                        </span>
                    )}
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
    locale,
    reverse = false,
    className = '',
}: {
    items: Review[]
    duration: number
    locale: Locale
    reverse?: boolean
    className?: string
}) {
    return (
        <div className={`h3-testimonial-viewport ${className}`}>
            <div
                className={`h3-testimonial-track flex flex-col gap-3 ${reverse ? 'h3-testimonial-track--reverse' : ''}`}
                style={{ '--h3-testimonial-duration': `${duration}s` } as React.CSSProperties}
            >
                {[0, 1].map((copy) => (
                    <React.Fragment key={copy}>
                        {items.map((item, i) => (
                            <div key={`${copy}-${item.id}`} aria-hidden={copy === 1 || undefined}>
                                <TestimonialCard item={item} tone={toneAt(i)} locale={locale} />
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
export function TestimonialColumns({ items, locale }: { items: Review[]; locale: Locale }) {
    const size = Math.ceil(items.length / 3)
    const [first = [], second = [], third = []] = [
        items.slice(0, size),
        items.slice(size, size * 2),
        items.slice(size * 2),
    ]

    return (
        <div
            className="
                grid h-[300px] grid-cols-1 gap-3 overflow-hidden
                [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]
                [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]
                sm:h-[340px] sm:grid-cols-2 lg:h-[360px] lg:grid-cols-3
            "
        >
            <ScrollingColumn items={first} duration={38} locale={locale} />
            <ScrollingColumn
                items={second}
                duration={47}
                locale={locale}
                reverse
                className="hidden sm:block"
            />
            <ScrollingColumn
                items={third}
                duration={43}
                locale={locale}
                className="hidden lg:block"
            />
        </div>
    )
}
