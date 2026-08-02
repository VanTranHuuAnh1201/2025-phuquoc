import type { ReactNode } from 'react'

/**
 * Ô số liệu trên bảng điều khiển.
 *
 * Cố ý KHÔNG có icon trang trí: bốn ô cạnh nhau mà mỗi ô một icon thì mắt bị
 * kéo về icon thay vì về con số — thứ duy nhất đáng nhìn ở đây.
 */

export interface StatCardProps {
    label: ReactNode
    value: ReactNode
    /** Dòng phụ: so với kỳ trước, tỉ lệ, đơn vị. */
    note?: ReactNode
    tone?: 'default' | 'success' | 'warning' | 'danger'
}

const TONE: Record<NonNullable<StatCardProps['tone']>, string> = {
    default: 'var(--text)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
}

export function StatCard({ label, value, note, tone = 'default' }: StatCardProps) {
    return (
        <div
            style={{
                padding: 'var(--space-5)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                display: 'grid',
                gap: 'var(--space-2)',
            }}
        >
            <span
                style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                }}
            >
                {label}
            </span>
            <strong
                style={{
                    fontSize: 'var(--text-2xl)',
                    fontFamily: 'var(--font-display)',
                    color: TONE[tone],
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1.1,
                }}
            >
                {value}
            </strong>
            {note && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {note}
                </span>
            )}
        </div>
    )
}
