import type { ReactNode } from 'react'

import { Pill } from './Pill'

/**
 * Cụm tiêu đề đứng đầu mỗi section: kicker · title · sub.
 *
 * Cả 4 mẫu trong prototype đều dùng đúng ba tầng này, chỉ khác căn lề và
 * việc có nút hành động bên phải hay không. Tham số hoá hai điểm đó là đủ
 * cho N theme — theme không cần chép lại khối markup này.
 */

export interface SectionHeaderProps {
    kicker?: ReactNode
    title: ReactNode
    sub?: ReactNode
    /** Nút "Xem tất cả" đặt ở mép phải, chỉ dùng khi align="start". */
    action?: ReactNode
    align?: 'start' | 'center'
    /** Đảo màu chữ khi đặt trên nền tối. */
    onDark?: boolean
    /**
     * Cách vẽ kicker.
     *
     * `pill` — nhãn bo tròn nền nhạt (mẫu 01).
     * `bare` — chữ trần IN HOA giãn cách, màu nhấn (mẫu 02, 03, 04).
     *
     * Hai kiểu này là toàn bộ khác biệt về kicker giữa bốn mẫu, nên tham số
     * hoá ở đây rẻ hơn việc mỗi theme tự dựng lại cụm tiêu đề.
     */
    kickerVariant?: 'pill' | 'bare'
}

export function SectionHeader({
    kicker,
    title,
    sub,
    action,
    align = 'start',
    onDark = false,
    kickerVariant = 'pill',
}: SectionHeaderProps) {
    const centered = align === 'center'

    const heading = (
        <div
            style={{
                textAlign: centered ? 'center' : 'start',
                maxWidth: centered ? '46rem' : undefined,
                margin: centered ? '0 auto' : undefined,
            }}
        >
            {kicker ? (
                <div style={{ marginBottom: 'var(--space-3)' }}>
                    {kickerVariant === 'pill' ? (
                        <Pill tone={onDark ? 'onDark' : 'brand'}>{kicker}</Pill>
                    ) : (
                        <span
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: onDark ? 'var(--text-inverse)' : 'var(--accent)',
                            }}
                        >
                            {kicker}
                        </span>
                    )}
                </div>
            ) : null}

            <h2
                style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-2xl)',
                    lineHeight: 1.18,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: onDark ? 'var(--text-inverse)' : 'var(--text)',
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
                        lineHeight: 1.6,
                        color: onDark ? 'var(--text-inverse)' : 'var(--text-muted)',
                        opacity: onDark ? 0.7 : 1,
                        margin: 'var(--space-2) 0 0',
                        textWrap: 'pretty',
                    }}
                >
                    {sub}
                </p>
            ) : null}
        </div>
    )

    if (!action) {
        return <div style={{ marginBottom: 'var(--space-8)' }}>{heading}</div>
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 'var(--space-8)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-8)',
            }}
        >
            {heading}
            {action}
        </div>
    )
}
