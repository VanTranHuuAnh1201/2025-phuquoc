'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Vỏ cuộn ngang dùng cho các dải thẻ của mẫu 07.
 *
 * Vì sao tách riêng khỏi `Rooms.tsx`: theo dõi vị trí cuộn cần ref + state +
 * listener, tức bắt buộc là client component. Nếu đánh `'use client'` thẳng
 * lên section thì toàn bộ thẻ phòng cũng bị kéo sang client, phá SSG/ISR của
 * `apps/2026-thenamduhill` (route `[theme]` không đánh 'use client'). Tách vỏ
 * ra, thẻ vẫn render phía server và truyền xuống qua `children`.
 *
 * Nút cuộn nằm trong header section, còn dải thẻ nằm dưới — hai vị trí tách
 * rời. Nên component này bọc CẢ CỤM và nhận header qua render prop `head`,
 * để nút và rail dùng chung state mà vẫn đặt đúng chỗ trong cây DOM.
 *
 * Component này KHÔNG biết gì về phòng — nó chỉ là một cái khung cuộn.
 */

function IconChevron({ dir }: { dir: 'left' | 'right' }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

/**
 * Class của một nút cuộn.
 *
 * `aria-disabled` thay cho thuộc tính `disabled`: screen reader vẫn đọc được
 * và thứ tự Tab không bị nhảy cóc. Đổi lại, mọi hiệu ứng hover phải tự tay
 * huỷ ở trạng thái vô hiệu — trình duyệt không làm hộ như với `disabled`.
 */
const RAIL_BTN = [
    'inline-flex items-center justify-center',
    // 32px — vượt ngưỡng target chạm 24px của WCAG 2.2 §2.5.8.
    'h-8 w-8 p-0',
    'rounded-full border border-border-default bg-surface-raised text-text-primary',
    'cursor-pointer',
    'transition-[background-color,color,border-color,transform] duration-150 ease-out',
    'motion-reduce:transition-none',
    'hover:bg-brand hover:border-brand hover:text-text-inverse',
    'active:translate-y-px',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-[0.38]',
    'aria-disabled:hover:bg-surface-raised aria-disabled:hover:border-border-default aria-disabled:hover:text-text-primary',
].join(' ')

export function ScrollRail({
    children,
    className = '',
    head,
    labels,
}: {
    children: React.ReactNode
    /** Class đặt lên chính phần tử cuộn — section tự quyết bề rộng thẻ. */
    className?: string
    /** Nhận cụm nút để section tự quyết đặt ở đâu trong header của nó. */
    head: (nav: React.ReactNode) => React.ReactNode
    labels: { prev: string; next: string; group: string }
}) {
    const railRef = useRef<HTMLDivElement>(null)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(true)

    const sync = useCallback(() => {
        const el = railRef.current
        if (!el) return
        const { scrollLeft, scrollWidth, clientWidth } = el
        // Dung sai 1px: trình duyệt làm tròn scrollLeft thành số lẻ khi trang
        // được phóng to, nên so sánh === 0 không bao giờ đúng.
        setAtStart(scrollLeft <= 1)
        setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1)
    }, [])

    useEffect(() => {
        const el = railRef.current
        if (!el) return

        let frame = 0
        const onScroll = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(sync)
        }

        sync()
        el.addEventListener('scroll', onScroll, { passive: true })

        // Bề rộng thẻ tính theo vw/container nên đổi kích thước cửa sổ là
        // biên cuộn đổi theo.
        const ro = new ResizeObserver(sync)
        ro.observe(el)

        return () => {
            cancelAnimationFrame(frame)
            el.removeEventListener('scroll', onScroll)
            ro.disconnect()
        }
    }, [sync])

    const scrollBy = (dir: -1 | 1) => {
        const el = railRef.current
        if (!el) return
        // aria-disabled không chặn click như thuộc tính disabled — chặn ở đây.
        if (dir === -1 ? atStart : atEnd) return
        // Cuộn đúng một thẻ + gap. Đọc thẳng từ DOM thay vì hard-code, để
        // section nào dùng cũng đúng dù bề rộng thẻ khác nhau.
        const first = el.firstElementChild as HTMLElement | null
        const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
        const step = first ? first.offsetWidth + gap : el.clientWidth * 0.8
        el.scrollBy({ left: dir * step, behavior: 'smooth' })
    }

    const nav = (
        // Cụm nút — CHỈ desktop. Mobile đã vuốt chạm được, và mép thẻ kế tiếp
        // lộ ra sẵn nên không cần tín hiệu thêm.
        <div className="hidden gap-2 min-[960px]:inline-flex">
            <button
                type="button"
                className={RAIL_BTN}
                onClick={() => scrollBy(-1)}
                aria-disabled={atStart}
                aria-label={labels.prev}
            >
                <IconChevron dir="left" />
            </button>
            <button
                type="button"
                className={RAIL_BTN}
                onClick={() => scrollBy(1)}
                aria-disabled={atEnd}
                aria-label={labels.next}
            >
                <IconChevron dir="right" />
            </button>
        </div>
    )

    return (
        <>
            {head(nav)}

            <div className="relative">
                <div
                    ref={railRef}
                    className={className}
                    role="group"
                    aria-label={labels.group}
                    tabIndex={0}
                >
                    {children}
                </div>
            </div>
        </>
    )
}
