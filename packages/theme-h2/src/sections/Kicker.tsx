import type { ReactNode } from 'react'

/**
 * Kicker của mẫu 02: chữ IN HOA, giãn chữ 0.14em, màu cam, KHÔNG nền.
 *
 * Mẫu 01 dùng `Pill` nền nhạt cho vai trò này, nên `SectionHeader` của `ui`
 * (vốn bọc kicker trong `Pill`) không dùng lại được — mẫu 02 tự dựng cụm tiêu
 * đề bằng `Heading` ngay bên cạnh. Đây là hình thức riêng của mẫu, đúng chỗ
 * để nằm trong theme (luật R4).
 */

export function Kicker({ children }: { children: ReactNode }) {
    return (
        <div
            style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--accent)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-3)',
            }}
        >
            {children}
        </div>
    )
}

export interface HeadingProps {
    kicker?: ReactNode
    title: ReactNode
    sub?: ReactNode
    align?: 'start' | 'center'
    /** Đảo màu chữ khi cụm tiêu đề đặt trên nền teal. */
    onDark?: boolean
    maxWidth?: number | string
}

/** Cụm kicker · title · sub theo giọng của mẫu 02. */
export function Heading({
    kicker,
    title,
    sub,
    align = 'start',
    onDark = false,
    maxWidth,
}: HeadingProps) {
    const centered = align === 'center'

    return (
        <div
            style={{
                textAlign: centered ? 'center' : 'start',
                maxWidth,
                margin: centered ? '0 auto' : undefined,
            }}
        >
            {kicker ? <Kicker>{kicker}</Kicker> : null}

            <h2
                style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-2xl)',
                    lineHeight: 1.16,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: onDark ? 'var(--text-inverse)' : 'var(--brand)',
                    margin: 0,
                    textWrap: 'balance',
                }}
            >
                {title}
            </h2>

            {sub ? (
                <p
                    style={{
                        fontSize: 'var(--text-base)',
                        lineHeight: 1.7,
                        color: onDark ? 'var(--text-inverse)' : 'var(--text-muted)',
                        opacity: onDark ? 0.74 : 1,
                        margin: 'var(--space-2) auto 0',
                        maxWidth: centered ? 540 : undefined,
                        textWrap: 'pretty',
                    }}
                >
                    {sub}
                </p>
            ) : null}
        </div>
    )
}
