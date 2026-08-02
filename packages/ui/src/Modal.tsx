'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * Hộp thoại — dùng cho form nhận phòng, trả phòng, sửa ô tồn kho.
 *
 * Bàn phím: Esc để đóng, focus bị giữ trong hộp thoại (focus trap) và trả về
 * đúng phần tử đã mở nó khi đóng. Đây là yêu cầu bắt buộc, không phải tuỳ chọn.
 */

export interface ModalProps {
    open: boolean
    onClose: () => void
    title: ReactNode
    /** Mô tả ngắn dưới tiêu đề. */
    description?: ReactNode
    children: ReactNode
    /** Nút hành động ở chân hộp thoại. */
    footer?: ReactNode
    width?: number
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    width = 560,
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null)
    const restoreRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (!open) return

        restoreRef.current = document.activeElement as HTMLElement | null
        const panel = panelRef.current
        panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

        // Khoá cuộn nền — nếu không, cuộn chuột sẽ cuộn trang phía sau.
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
                return
            }
            if (event.key !== 'Tab' || !panel) return

            // Giữ focus trong hộp thoại: Tab ở phần tử cuối quay về đầu và ngược lại.
            const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
            if (items.length === 0) return
            const first = items[0]!
            const last = items[items.length - 1]!

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = previousOverflow
            restoreRef.current?.focus()
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            role="presentation"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'var(--overlay-scrim)',
                display: 'grid',
                placeItems: 'center',
                padding: 'var(--space-4)',
                zIndex: 100,
                overflowY: 'auto',
            }}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={typeof title === 'string' ? title : undefined}
                style={{
                    width: '100%',
                    maxWidth: width,
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <header
                    style={{
                        padding: 'var(--space-6)',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-xl)',
                                fontFamily: 'var(--font-display)',
                                color: 'var(--text)',
                            }}
                        >
                            {title}
                        </h2>
                        {description && (
                            <p
                                style={{
                                    margin: 'var(--space-2) 0 0',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        style={{
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                            display: 'grid',
                            placeItems: 'center',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius)',
                            fontSize: 20,
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </header>

                <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1 }}>
                    {children}
                </div>

                {footer && (
                    <footer
                        style={{
                            padding: 'var(--space-6)',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            flexWrap: 'wrap',
                        }}
                    >
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    )
}
