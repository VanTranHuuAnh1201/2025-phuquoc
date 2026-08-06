import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * Tiêu đề khối dùng chung cho mọi section của mẫu 03.
 *
 * VÌ SAO CÓ FILE NÀY: các khối trang chủ trước đây tự khai lại header, mỗi khối
 * lệch một chút — chỗ có mô tả chỗ không, cỡ chữ mô tả khác nhau. Gom về một
 * chỗ để mọi tiêu đề đọc như một hệ.
 *
 * VÌ SAO Ở TRONG THEME MÀ KHÔNG LÊN `ui-layout`: nó mang bảng màu và nhịp chữ
 * riêng của mẫu này. Mẫu khác cần tiêu đề khác — đó là hình thức, thuộc về
 * theme (luật R4). Khi có mẫu thứ hai cần ĐÚNG khuôn này mới đẩy lên trên.
 *
 * VÌ SAO `<a>` CHỨ KHÔNG PHẢI `next/link`: theme không được phụ thuộc router
 * của app. Điều hướng nội bộ vẫn chạy, chỉ là không prefetch — cái giá rất nhỏ
 * so với việc khoá theme vào một framework.
 *
 * Khuôn chuẩn: [eyebrow tuỳ chọn] → h2 → [mô tả tuỳ chọn], hành động canh phải.
 */

interface SectionHeadingProps {
    /** Nhãn nhỏ in hoa phía trên tiêu đề — chỉ dùng khi thật sự cần phân loại. */
    eyebrow?: string
    title: string
    description?: string
    /** Đích của link "Xem tất cả" canh phải. Bỏ trống thì không hiện link. */
    href?: string
    /** Nhãn của link. */
    actionLabel?: string
    /** Thay hẳn khối canh phải khi cần thứ khác một link. */
    action?: ReactNode
    className?: string
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    href,
    actionLabel,
    action,
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={`mb-3 flex items-start justify-between gap-3${className ? ` ${className}` : ''}`}
        >
            <div className="min-w-0">
                {/* `--accent-text` chứ không phải `--accent`: đây là chữ
                    thật trên nền sáng, mà #ffb800 chỉ đạt 1.73:1 (luật
                    D4/P15). Ngôi sao đánh giá vẫn dùng `--accent` vì chúng
                    là hình trang trí có `aria-hidden`. */}
                {eyebrow && (
                    <span className="block text-xs font-extrabold tracking-widest text-[var(--accent-text)] uppercase">
                        {eyebrow}
                    </span>
                )}

                <h2 className="font-display text-text-primary mt-0.5 text-base font-bold tracking-tight sm:text-xl md:text-2xl">
                    {title}
                </h2>

                {description && (
                    <p className="text-text-tertiary mt-0.5 max-w-2xl text-xs font-normal">
                        {description}
                    </p>
                )}
            </div>

            {action ? (
                <div className="shrink-0">{action}</div>
            ) : (
                href && (
                    <a
                        href={href}
                        className="text-brand focus-visible:outline-brand group mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-xs text-xs font-semibold no-underline transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm"
                    >
                        <span>{actionLabel}</span>
                        <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                )
            )}
        </div>
    )
}
