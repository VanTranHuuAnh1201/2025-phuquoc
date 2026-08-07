'use client'

/**
 * Badge trạng thái: chấm màu + CHỮ.
 *
 * VÌ SAO LUÔN CÓ CHỮ: `D4` cấm truyền tin chỉ bằng màu — người mù màu phải
 * đọc được trạng thái. Chấm là phụ trợ nhìn nhanh, chữ mới là nội dung.
 *
 * VÌ SAO CÓ `width` CỐ ĐỊNH: trong bảng, badge so le bề rộng làm cột nhảy
 * và mắt khó quét dọc. Truyền `width` để các badge cùng cột thẳng hàng.
 */

export type CmsTone = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'slate'

export interface DotBadgeProps {
    tone: CmsTone
    label: string
    /** Bề rộng cố định tính bằng px. Bỏ trống thì badge co theo nội dung. */
    width?: number
    title?: string
}

/**
 * Tone → class Tailwind. Khai TƯỜNG MINH từng tone thay vì nội suy chuỗi
 * (`bg-[var(--cms-tone-${tone})]`) — Tailwind quét source bằng regex tĩnh,
 * class ghép động lúc chạy KHÔNG được sinh ra. Đây là biến thể của cùng cái
 * bẫy "build xanh mà mất style" ở R14.
 */
const TONE_CLASS: Record<CmsTone, string> = {
    emerald: 'text-[var(--cms-tone-emerald)] bg-[var(--cms-tone-emerald-bg)] border-[var(--cms-tone-emerald-dot)]',
    blue: 'text-[var(--cms-tone-blue)] bg-[var(--cms-tone-blue-bg)] border-[var(--cms-tone-blue-dot)]',
    violet: 'text-[var(--cms-tone-violet)] bg-[var(--cms-tone-violet-bg)] border-[var(--cms-tone-violet-dot)]',
    amber: 'text-[var(--cms-tone-amber)] bg-[var(--cms-tone-amber-bg)] border-[var(--cms-tone-amber-dot)]',
    rose: 'text-[var(--cms-tone-rose)] bg-[var(--cms-tone-rose-bg)] border-[var(--cms-tone-rose-dot)]',
    slate: 'text-[var(--cms-tone-slate)] bg-[var(--cms-tone-slate-bg)] border-[var(--cms-tone-slate-dot)]',
}

const DOT_CLASS: Record<CmsTone, string> = {
    emerald: 'bg-[var(--cms-tone-emerald-dot)]',
    blue: 'bg-[var(--cms-tone-blue-dot)]',
    violet: 'bg-[var(--cms-tone-violet-dot)]',
    amber: 'bg-[var(--cms-tone-amber-dot)]',
    rose: 'bg-[var(--cms-tone-rose-dot)]',
    slate: 'bg-[var(--cms-tone-slate-dot)]',
}

export function DotBadge({ tone, label, width, title }: DotBadgeProps) {
    return (
        <span
            title={title}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[var(--cms-radius-sm)] text-[length:var(--cms-text-meta)] font-semibold leading-snug border whitespace-nowrap ${TONE_CLASS[tone]}`}
            style={width ? { width: `${width}px` } : undefined}
        >
            <span
                aria-hidden="true"
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_CLASS[tone]}`}
            />
            <span className="overflow-hidden text-ellipsis">{label}</span>
        </span>
    )
}
