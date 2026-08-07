'use client'

/**
 * `InlineAlert` — thông báo trạng thái nằm trong luồng nội dung (không phải
 * toast nổi).
 *
 * VÌ SAO `role="alert"` + `aria-live="polite"` LUÔN CÓ SẴN, KHÔNG PHẢI PROP:
 * `FE11` bắt vùng lỗi phải được screen reader đọc ngay khi xuất hiện. Nếu để
 * người gọi tự truyền thì rất dễ quên ở một trong N chỗ dùng — bắt buộc ở
 * ngay component là cách duy nhất đảm bảo không lọt trường hợp nào.
 *
 * VÌ SAO DÙNG CHUNG `CmsTone` CỦA `DotBadge`: alert cũng biểu đạt cùng một tập
 * trạng thái (thành công/lỗi/cảnh báo/thông tin…) — tách type riêng sẽ trùng
 * lặp và có nguy cơ lệch nhau theo thời gian (R12 — một khái niệm, một nhà).
 */

import type { ReactNode } from 'react'
import { CmsTone } from './DotBadge'

export interface InlineAlertProps {
    tone: CmsTone
    children: ReactNode
}

/**
 * Tone → class Tailwind. Khai TƯỜNG MINH từng tone thay vì nội suy chuỗi
 * (`border-[var(--cms-tone-${tone})]`) — Tailwind quét source bằng regex
 * tĩnh, class ghép động lúc chạy KHÔNG được sinh ra (R14).
 */
const TONE_CLASS: Record<CmsTone, string> = {
    emerald: 'border-[var(--cms-tone-emerald-dot)] bg-[var(--cms-tone-emerald-bg)] text-[var(--cms-tone-emerald)]',
    blue: 'border-[var(--cms-tone-blue-dot)] bg-[var(--cms-tone-blue-bg)] text-[var(--cms-tone-blue)]',
    violet: 'border-[var(--cms-tone-violet-dot)] bg-[var(--cms-tone-violet-bg)] text-[var(--cms-tone-violet)]',
    amber: 'border-[var(--cms-tone-amber-dot)] bg-[var(--cms-tone-amber-bg)] text-[var(--cms-tone-amber)]',
    rose: 'border-[var(--cms-tone-rose-dot)] bg-[var(--cms-tone-rose-bg)] text-[var(--cms-tone-rose)]',
    slate: 'border-[var(--cms-tone-slate-dot)] bg-[var(--cms-tone-slate-bg)] text-[var(--cms-tone-slate)]',
}

export function InlineAlert({ tone, children }: InlineAlertProps) {
    return (
        <div
            role="alert"
            aria-live="polite"
            className={`rounded-[var(--cms-radius)] border px-3 py-2 text-[length:var(--cms-text-body)] leading-snug ${TONE_CLASS[tone]}`}
        >
            {children}
        </div>
    )
}
