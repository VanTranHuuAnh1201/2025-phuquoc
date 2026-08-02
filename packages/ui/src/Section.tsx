import type { CSSProperties, ReactNode } from 'react'
import type { ThemeSectionId } from '@repo/core'

/**
 * Khung section chuẩn.
 *
 * Bọc `id` để deep-link và điều hướng hoạt động đồng nhất trên mọi theme
 * (luật R7). Theme quyết định nội dung và cách bố cục bên trong.
 */

export interface SectionProps {
    id: ThemeSectionId
    children: ReactNode
    /** Nền xen kẽ để phân tách các dải nội dung. */
    tone?: 'default' | 'alt' | 'inverse'
    style?: CSSProperties
}

const BACKGROUND: Record<NonNullable<SectionProps['tone']>, string> = {
    default: 'var(--surface)',
    alt: 'var(--surface-alt)',
    inverse: 'var(--surface-inverse)',
}

const FOREGROUND: Record<NonNullable<SectionProps['tone']>, string> = {
    default: 'var(--text)',
    alt: 'var(--text)',
    inverse: 'var(--text-inverse)',
}

export function Section({ id, children, tone = 'default', style }: SectionProps) {
    return (
        <section
            id={id}
            style={{
                background: BACKGROUND[tone],
                color: FOREGROUND[tone],
                padding: 'var(--space-16) var(--space-4)',
                scrollMarginTop: '80px',
                ...style,
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>{children}</div>
        </section>
    )
}
