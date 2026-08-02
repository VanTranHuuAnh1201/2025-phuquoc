import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Nút vô danh — mọi giá trị hình ảnh đọc từ CSS variable do theme cấp.
 * Nhìn vào file này phải KHÔNG đoán được đang là theme nào (luật R3).
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    children: ReactNode
}

const PADDING: Record<ButtonSize, string> = {
    sm: 'var(--space-2) var(--space-4)',
    md: 'var(--space-3) var(--space-6)',
    lg: 'var(--space-4) var(--space-8)',
}

const FONT_SIZE: Record<ButtonSize, string> = {
    sm: 'var(--text-sm)',
    md: 'var(--text-base)',
    lg: 'var(--text-lg)',
}

const SURFACE: Record<ButtonVariant, { background: string; color: string; border: string }> = {
    primary: {
        background: 'var(--accent)',
        color: 'var(--text-inverse)',
        border: '1px solid transparent',
    },
    secondary: {
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '1px solid var(--border-strong)',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--text)',
        border: '1px solid transparent',
    },
}

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    style,
    ...rest
}: ButtonProps) {
    return (
        <button
            {...rest}
            style={{
                ...SURFACE[variant],
                padding: PADDING[size],
                fontSize: FONT_SIZE[size],
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                borderRadius: 'var(--radius-pill)',
                cursor: rest.disabled ? 'not-allowed' : 'pointer',
                opacity: rest.disabled ? 0.55 : 1,
                transition: `background var(--duration) var(--ease), transform var(--duration) var(--ease)`,
                ...style,
            }}
        >
            {children}
        </button>
    )
}
