'use client'

/**
 * Dải KPI liền mạch.
 *
 * VÌ SAO KHÔNG PHẢI 5 CARD RỜI: card rời + gap + shadow tạo ra 5 khối nổi
 * tranh nhau gây chú ý (P11 "Calm"). Một dải liền chia bằng vách 1px đọc
 * như MỘT thông tin có 5 mặt — đúng cách ảnh mẫu làm. Vách ngăn dọc được
 * sinh từ CSS selector tại tokens.css, ô đầu không viền qua :first-child.
 */

export interface MetricStripProps {
    children: React.ReactNode
}

export function MetricStrip({ children }: MetricStripProps) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] overflow-hidden">
            {children}
        </div>
    )
}
