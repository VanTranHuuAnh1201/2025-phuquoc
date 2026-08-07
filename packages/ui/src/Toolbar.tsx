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

            {/* "Đặt lại" LUÔN có mặt (format bảng §F6) nhưng `disabled` khi chưa
                lọc gì — người dùng vẫn thấy lối thoát, đồng thời biết mình đang
                lọc hay không qua trạng thái nút. Ẩn hẳn thì nút nhấp nháy ra/vào
                và bộ lọc bị coi là thiếu khi nghiệm thu. */}
            <button
                type="button"
                onClick={onReset}
                disabled={!isFiltered}
                style={{
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-body)',
                    color: isFiltered ? 'var(--brand)' : 'var(--text-muted)',
                    background: 'transparent',
                    border: 'none',
                    cursor: isFiltered ? 'pointer' : 'not-allowed',
                    textDecoration: isFiltered ? 'underline' : 'none',
                    minHeight: 24,
                }}
            >
                {resetLabel}
            </button>

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
                // Nhãn dài (tên hạng phòng) không được đẩy select tràn khỏi
                // thanh công cụ trên màn hẹp — đó là nguồn cuộn ngang (FE5).
                maxWidth: '100%',
                minWidth: 0,
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
