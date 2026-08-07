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
    sm: '6px 14px',
    md: '10px 20px',
    lg: '12px 24px',
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

// Chiều cao TỐI THIỂU, không phải chiều cao cố định.
//
// Dùng minHeight để nút còn cao lên được khi nhãn xuống dòng (nhãn tiếng Việt
// dài hơn tiếng Anh ~30%, ở 375px là xuống dòng thật) — `height` cứng làm chữ
// tràn ra ngoài viền.
//
// `lg` là cỡ của CTA chính, phải ≥ 44px theo FE5 và WCAG 2.2 §2.5.8 (target
// chạm). 42px trượt ngưỡng đúng 2px — đủ để hỏng, không đủ để ai nhìn ra.
// `sm`/`md` là nút phụ trong bảng CMS, ngưỡng áp dụng là 24×24px.
const MIN_HEIGHT: Record<ButtonSize, number> = {
    sm: 32,
    md: 38,
    lg: 44,
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
                minHeight: MIN_HEIGHT[size],
                padding: PADDING[size],
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm, 6px)',
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
