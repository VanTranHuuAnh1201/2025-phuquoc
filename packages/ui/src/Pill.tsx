import type { CSSProperties, ReactNode } from 'react'

/**
 * Nhãn bo tròn — dùng cho kicker, tag phòng, badge hero, chip dịch vụ.
 *
 * Prototype lặp lại hình dạng này ở gần như mọi section, mỗi theme chỉ khác
 * màu nền và độ đậm chữ. Vì vậy nó thuộc về `ui`, không phải theme (luật R1).
 */

export type PillTone = 'brand' | 'neutral' | 'onDark'

export interface PillProps {
    children: ReactNode
    tone?: PillTone
    /** Chấm tròn nhỏ phía trước, như chip dịch vụ ở section about. */
    dot?: boolean
    style?: CSSProperties
}

const SURFACE: Record<PillTone, CSSProperties> = {
    brand: {
        background: 'var(--surface-tint)',
        color: 'var(--brand)',
    },
    neutral: {
        background: 'var(--surface-alt)',
        color: 'var(--text-muted)',
        border: '1px solid var(--border)',
    },
    onDark: {
        background: 'var(--overlay-soft)',
        color: 'var(--text-inverse)',
        border: '1px solid var(--overlay-line)',
    },
}

export function Pill({ children, tone = 'brand', dot = false, style }: PillProps) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                ...SURFACE[tone],
                ...style,
            }}
        >
            {dot ? (
                <span
                    style={{
                        width: 7,
                        height: 7,
                        borderRadius: 'var(--radius-pill)',
                        background: 'currentColor',
                        flexShrink: 0,
                    }}
                />
            ) : null}
            {children}
        </span>
    )
}
