'use client'

import { useState, type ReactNode } from 'react'

/**
 * Danh sách đóng/mở — dùng cho FAQ.
 *
 * Cả bốn mẫu đều có FAQ với đúng hành vi này (mở một mục, bấm lại thì đóng).
 * Logic trạng thái và thuộc tính trợ năng nằm ở đây; theme chỉ quyết định
 * cách vẽ mục qua `renderItem`.
 */

export interface AccordionItem {
    /** Khoá ổn định — không dùng chỉ số mảng để tránh mở nhầm khi đổi thứ tự. */
    key: string
    question: ReactNode
    answer: ReactNode
}

export interface AccordionProps {
    items: AccordionItem[]
    /** Mục mở sẵn khi vào trang. Đặt -1 để đóng hết. */
    defaultOpen?: number
    gap?: string
}

export function Accordion({ items, defaultOpen = 0, gap = 'var(--space-2)' }: AccordionProps) {
    const [openKey, setOpenKey] = useState<string | null>(items[defaultOpen]?.key ?? null)

    return (
        <div style={{ display: 'grid', gap }}>
            {items.map((item) => {
                const expanded = openKey === item.key
                return (
                    <div
                        key={item.key}
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            overflow: 'hidden',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setOpenKey(expanded ? null : item.key)}
                            aria-expanded={expanded}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: 'var(--space-4)',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 'var(--space-3)',
                                fontSize: 'var(--text-base)',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 600,
                                color: 'var(--text)',
                            }}
                        >
                            <span>{item.question}</span>
                            <span
                                aria-hidden="true"
                                style={{
                                    fontSize: 20,
                                    lineHeight: 1,
                                    color: 'var(--accent)',
                                    flexShrink: 0,
                                    transition: 'transform var(--duration) var(--ease)',
                                    transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
                                }}
                            >
                                +
                            </span>
                        </button>

                        {expanded ? (
                            <div
                                style={{
                                    padding: '0 var(--space-4) var(--space-4)',
                                    fontSize: 'var(--text-sm)',
                                    lineHeight: 1.7,
                                    color: 'var(--text-muted)',
                                }}
                            >
                                {item.answer}
                            </div>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}
