'use client'

/**
 * `PageHeaderBar` — tiêu đề trang CMS: kicker + tiêu đề + số đếm + hành động.
 *
 * VÌ SAO KHÔNG KHUNG BAO / KHÔNG SHADOW: cùng nguyên tắc với `AppShell` (P7) —
 * shadow chỉ dành cho lớp nổi thật (dropdown, modal). Đây là phần tử tĩnh nằm
 * ngay trên nội dung trang, chỉ cần một đường kẻ 1px để tách khỏi phần dưới.
 *
 * VÌ SAO `<h1>` WEIGHT 400: giống `KpiCard` — hierarchy do CỠ chữ
 * (`--cms-text-title`) gánh, không do độ đậm. Đây là chi tiết nhất quán xuyên
 * suốt design system CMS (P11 — cảm giác "được thiết kế trong cùng một ngày").
 */

import type { ReactNode } from 'react'

export interface PageHeaderBarProps {
    /** Nhãn nhỏ phía trên tiêu đề, ví dụ tên vùng/mục cha. */
    kicker?: string
    title: string
    /** Số đếm hiện cạnh tiêu đề, ví dụ { value: 128, suffix: 'mục' }. */
    count?: { value: number; suffix: string }
    /** Slot nút hành động bên phải (nút Xuất, nút Tạo mới…). */
    actions?: ReactNode
}

export function PageHeaderBar({ kicker, title, count, actions }: PageHeaderBarProps) {
    return (
        <div
            className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--cms-border)] px-[var(--cms-pad)] py-4"
        >
            <div className="min-w-0">
                {kicker && (
                    <span className="mb-1 block text-[length:var(--cms-text-label)] font-semibold uppercase tracking-wide text-[var(--cms-text-muted)]">
                        {kicker}
                    </span>
                )}
                <div className="flex flex-wrap items-baseline gap-2">
                    <h1 className="text-[length:var(--cms-text-title)] font-normal leading-tight text-[var(--cms-text)]">
                        {title}
                    </h1>
                    {count && (
                        <span className="rounded-[var(--cms-radius-sm)] bg-[var(--cms-bg-subtle)] px-2 py-0.5 text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)] tabular-nums">
                            {count.value} {count.suffix}
                        </span>
                    )}
                </div>
            </div>

            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    )
}
