import type { ReactNode } from 'react'

/**
 * Nhãn trạng thái: chấm màu + CHỮ.
 *
 * Bắt buộc có chữ, không bao giờ chỉ dùng màu — người mù màu phải đọc được
 * trạng thái đơn hàng (WCAG 2.2 AA, xem `.claude/rules/design-tokens.md` §D4).
 */

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
    tone?: BadgeTone
    children: ReactNode
    /** Ẩn chấm màu khi nhãn đã đủ rõ, ví dụ nhãn "2 đêm". */
    hideDot?: boolean
}

const TONE: Record<BadgeTone, { fg: string; bg: string }> = {
    neutral: { fg: 'var(--text-muted)', bg: 'var(--surface-alt)' },
    success: { fg: 'var(--success)', bg: 'var(--success-bg)' },
    warning: { fg: 'var(--warning)', bg: 'var(--warning-bg)' },
    danger: { fg: 'var(--danger)', bg: 'var(--danger-bg)' },
    info: { fg: 'var(--info)', bg: 'var(--info-bg)' },
}

export function Badge({ tone = 'neutral', children, hideDot = false }: BadgeProps) {
    const colors = TONE[tone]
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-pill)',
                background: colors.bg,
                color: colors.fg,
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                lineHeight: 1.6,
            }}
        >
            {!hideDot && (
                <span
                    aria-hidden="true"
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'currentColor',
                        flexShrink: 0,
                    }}
                />
            )}
            {children}
        </span>
    )
}
