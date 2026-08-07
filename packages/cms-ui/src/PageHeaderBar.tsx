'use client'

/**
 * `PageHeaderBar` — tiêu đề trang CMS: tiêu đề + số đếm + filter inline +
 * hành động, TRÊN CÙNG MỘT HÀNG.
 *
 * VÌ SAO GỘP VỚI FILTER (fix round 2 mục 1): bản round 1 tốn 2 tầng dọc —
 * kicker+title (PageHeaderBar) rồi filter pill (FilterBar) ở một khối riêng
 * bên dưới. Chủ đề round này là TIẾT KIỆM CHIỀU CAO cho màn vận hành (thấy
 * nhiều đơn hơn không cuộn). Gộp `filters` làm children ngay cạnh title —
 * chỉ xuống hàng khi `flex-wrap` bắt buộc ở màn hẹp (<1280px), không phải
 * mặc định.
 *
 * VÌ SAO BỎ HẲN `kicker`: "VẬN HÀNH — HÔM NAY" là thông tin ĐÃ CÓ ở tab
 * "Dashboard" đang active trên header (AppShell) — lặp lại tốn một dòng dọc
 * mà không thêm thông tin mới. Xoá field này khỏi props luôn (không chỉ ẩn)
 * để không ai vô tình dùng lại nó ở trang khác và tái tạo vấn đề.
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
    title: string
    /** Số đếm hiện cạnh tiêu đề, ví dụ { value: 128, suffix: 'mục' }. */
    count?: { value: number; suffix: string }
    /** Filter inline (thường là `<FilterBar>`) — render CÙNG HÀNG với title,
     *  giữa title và `actions`. Tự `flex-wrap` xuống hàng 2 khi không đủ chỗ
     *  ngang (<1280px), KHÔNG cố ép vừa một hàng bằng cách thu nhỏ chữ. */
    filters?: ReactNode
    /** Slot nút hành động bên phải (nút Xuất, nút Tạo mới…). */
    actions?: ReactNode
}

export function PageHeaderBar({ title, count, filters, actions }: PageHeaderBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--cms-border)] px-[var(--cms-pad)] py-2.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0">
                <div className="flex shrink-0 items-baseline gap-2">
                    <h1 className="text-[length:var(--cms-text-title)] font-normal leading-tight text-[var(--cms-text)]">
                        {title}
                    </h1>
                    {count && (
                        <span className="rounded-[var(--cms-radius-sm)] bg-[var(--cms-bg-subtle)] px-2 py-0.5 text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)] tabular-nums">
                            {count.value} {count.suffix}
                        </span>
                    )}
                </div>

                {filters}
            </div>

            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    )
}
