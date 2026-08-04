'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

/**
 * Tiêu đề khối dùng chung cho mọi section trang chủ.
 *
 * VÌ SAO CÓ FILE NÀY: năm khối trang chủ trước đây tự khai lại header, mỗi khối
 * lệch một chút — chỗ có mô tả chỗ không, cỡ chữ mô tả khác nhau, ExploreSection
 * còn đặt mô tả sang bên phải. Gom về một chỗ để năm tiêu đề đọc như một hệ.
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
    /** Nhãn của link; mặc định "Xem tất cả" / "View all". */
    actionLabel?: string
    /** Thay hẳn khối canh phải khi cần thứ khác một link. */
    action?: React.ReactNode
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
            className={`flex items-start justify-between gap-3 mb-4${className ? ` ${className}` : ''}`}
        >
            <div className="min-w-0">
                {eyebrow && (
                    <span className="text-xs font-extrabold text-[#FFB800] uppercase tracking-widest block">
                        {eyebrow}
                    </span>
                )}

                <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight mt-0.5">
                    {title}
                </h2>

                {description && (
                    <p className="text-xs font-normal text-[#6B7280] mt-0.5 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>

            {action
                ? <div className="shrink-0">{action}</div>
                : href && (
                    <Link
                        href={href}
                        className="shrink-0 group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1D4E89] hover:text-[#163B6C] transition-colors rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E89] mt-0.5"
                    >
                        <span>{actionLabel}</span>
                        <ArrowRight
                            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                )}
        </div>
    )
}
