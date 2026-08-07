'use client'

/**
 * Thẻ KPI — một ô chứa số, nhãn, ghi chú.
 *
 * VÌ SAO VALUE KHÔNG ĐẬM: `value` dùng font-weight 400, KHÔNG bold/semibold.
 * Số lớn mà nhẹ = hierarchy do CỠ gánh, không do độ đậm. Đây là chi tiết CÓ
 * ý của ảnh mẫu, tạo cảm giác clean (P11).
 *
 * VÌ SAO `note` NẰM CÙNG DÒNG VỚI `value` (fix round 3 mục 1): bản round 1/2
 * đặt `note` thành một dòng khối riêng bên dưới (`mt-2 block`) — cộng thêm
 * margin + line-height của cả dòng, đẩy `MetricStrip` từ ~96px lên ~140px.
 * Đo bằng Playwright cho thấy khối cố định này ăn hết chỗ đúng lúc màn hẹp
 * cần tiết kiệm nhất (zoom 150%: bảng còn 0 hàng). Gộp `note` vào cuối dòng
 * `value` (`items-baseline`, cỡ chữ nhỏ hơn) tiết kiệm trọn một dòng dọc mà
 * vẫn giữ đủ thông tin — không xoá `note`, chỉ đổi hướng đặt.
 *
 * VÌ SAO CÓ THẺ <button>: nếu có onClick, render <button type="button">
 * để bàn phím dùng được (ArrowUp/ArrowDown, Space/Enter kích hoạt). Không
 * được dùng <div onClick> vì vi phạm a11y — người dùng chỉ phím không tương
 * tác được.
 *
 * VÌ SAO CÓ `cms-kpi` CLASS: vách ngăn dọc giữa các ô được set bằng CSS
 * selector `.cms-kpi + .cms-kpi` tại tokens.css, ô đầu không có viền qua
 * :first-child. Đây là cách sinh vách ngăn "liền mạch" trong dải grid.
 */

import { CmsTone } from './DotBadge'

export interface KpiCardProps {
    label: string
    value: string
    note?: string
    tone?: CmsTone
    selected?: boolean
    onClick?: () => void
}

/**
 * Tone → class Tailwind. Khai TƯỜNG MINH từng tone thay vì nội suy chuỗi
 * (`border-[var(--cms-tone-${tone})]`) — Tailwind quét source bằng regex
 * tĩnh, class ghép động lúc chạy KHÔNG được sinh ra. Bẫy "build xanh mà
 * mất style" ở R14.
 */
const TONE_UNDERLINE: Record<CmsTone, string> = {
    emerald: 'border-[var(--cms-tone-emerald)]',
    blue: 'border-[var(--cms-tone-blue)]',
    violet: 'border-[var(--cms-tone-violet)]',
    amber: 'border-[var(--cms-tone-amber)]',
    rose: 'border-[var(--cms-tone-rose)]',
    slate: 'border-[var(--cms-tone-slate)]',
}

export function KpiCard({
    label,
    value,
    note,
    tone = 'slate',
    selected = false,
    onClick,
}: KpiCardProps) {
    const Element = onClick ? 'button' : 'div'
    // Viền dưới LUÔN chiếm 2px trong box model (`border-b-2 border-b-transparent`
    // mặc định), chỉ đổi MÀU khi `selected` bật/tắt — nếu không, bật/tắt
    // `border-b-2` làm chiều cao ô nhảy 2px mỗi lần chọn (P12 — pixel quality).
    const accentClass = selected ? TONE_UNDERLINE[tone] : 'border-b-transparent'

    return (
        <Element
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`cms-kpi flex flex-col items-start justify-center gap-1.5 p-3 text-left border-b-2 transition-colors [&:hover]:bg-[var(--cms-bg-subtle)] ${accentClass} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* NHÃN */}
            <span className="block text-[length:var(--cms-text-label)] font-semibold uppercase tracking-wide text-[var(--cms-text-muted)]">
                {label}
            </span>

            {/* SỐ KPI + GHI CHÚ cùng một dòng (`items-baseline`) — round 3 nén
                MetricStrip từ ~140px xuống ~96px bằng cách bỏ dòng riêng cho
                `note` (xem giải thích ở khối JSDoc phía trên). */}
            <span className="flex items-baseline gap-1.5 min-w-0">
                <span
                    className="text-[length:var(--cms-text-metric)] font-normal leading-none text-[var(--cms-text)] tabular-nums"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                    {value}
                </span>
                {note && (
                    <span className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]" title={note}>
                        {note}
                    </span>
                )}
            </span>
        </Element>
    )
}
