import type { CSSProperties, ReactNode } from 'react'

/**
 * Thẻ nội dung có viền — khung chung của card phòng, điểm đến, nhà hàng.
 *
 * Chỉ lo phần vỏ (nền, viền, bo góc, đổ bóng). Phần ruột do theme quyết định,
 * nên `ui` không cần biết đang hiển thị phòng hay điểm đến.
 */

export interface CardProps {
    children: ReactNode
    /** Ảnh/khối phủ kín mép trên, tràn ra sát viền thẻ. */
    media?: ReactNode
    tone?: 'default' | 'alt'
    style?: CSSProperties
}

export function Card({ children, media, tone = 'default', style }: CardProps) {
    return (
        <article
            style={{
                background: tone === 'alt' ? 'var(--surface-alt)' : 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                ...style,
            }}
        >
            {media}
            <div
                style={{
                    padding: 'var(--space-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                }}
            >
                {children}
            </div>
        </article>
    )
}
