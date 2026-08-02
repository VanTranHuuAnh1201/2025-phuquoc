'use client'

import type { ReactNode } from 'react'

/**
 * Thanh tìm kiếm + bộ lọc phía trên bảng.
 *
 * Nút "Đặt lại" là bắt buộc và chỉ hiện khi thật sự có bộ lọc đang bật — hiện
 * thường trực thì người dùng không biết mình có đang lọc hay không.
 */

export interface ToolbarProps {
    searchValue: string
    onSearchChange: (value: string) => void
    searchPlaceholder: string
    /** Các dropdown lọc. */
    children?: ReactNode
    /** Có bộ lọc nào đang bật không. */
    isFiltered: boolean
    onReset: () => void
    resetLabel: string
    /** Nút hành động bên phải, ví dụ "Xuất Excel". */
    actions?: ReactNode
}

export function Toolbar({
    searchValue,
    onSearchChange,
    searchPlaceholder,
    children,
    isFiltered,
    onReset,
    resetLabel,
    actions,
}: ToolbarProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                borderBottom: '1px solid var(--border)',
            }}
        >
            <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                style={{
                    flex: '1 1 240px',
                    minWidth: 180,
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius)',
                }}
            />

            {children}

            {isFiltered && (
                <button
                    type="button"
                    onClick={onReset}
                    style={{
                        padding: 'var(--space-2) var(--space-4)',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-body)',
                        color: 'var(--brand)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        minHeight: 24,
                    }}
                >
                    {resetLabel}
                </button>
            )}

            {actions && <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>{actions}</div>}
        </div>
    )
}

/** Dropdown lọc, dùng bên trong `Toolbar`. */
export interface FilterSelectProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
}

export function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={label}
            style={{
                padding: 'var(--space-3) var(--space-4)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                background: 'var(--surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
            }}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}
