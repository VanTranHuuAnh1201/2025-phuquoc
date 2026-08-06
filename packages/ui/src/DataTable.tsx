'use client'

import type { ReactNode } from 'react'

/**
 * Bảng danh sách chuẩn — dùng cho CMS và trang "Đơn của tôi".
 *
 * Format và các thành phần bắt buộc: `.claude/rules/app-flows.md` §F6.
 * Dưới 640px tự đổi sang thẻ; KHÔNG cuộn ngang bảng vì trên điện thoại người
 * dùng sẽ không biết còn cột ở bên phải.
 */

export interface Column<T> {
    key: string
    /** Nhãn cột. Để trống với cột thao tác. */
    header: ReactNode
    /** Nội dung ô. */
    cell: (row: T) => ReactNode
    /** Canh phải cho số liệu. */
    align?: 'left' | 'right'
    /** Cột này có hiện trong thẻ mobile không. Mặc định có. */
    inCard?: boolean
    width?: string
}

export interface DataTableProps<T> {
    /** Mô tả bảng cho screen reader. Bắt buộc. */
    caption: string
    columns: Column<T>[]
    rows: T[]
    rowKey: (row: T) => string
    /** Hiện khi không có dòng nào. Phải nói rõ người dùng cần làm gì. */
    empty: ReactNode
    onRowClick?: (row: T) => void
    /** Nội dung thẻ trên mobile. Không truyền thì dựng từ `columns`. */
    renderCard?: (row: T) => ReactNode

    // ------------------------------------------------- chọn nhiều (tuỳ chọn)
    /**
     * Bật cột checkbox ở đầu bảng và góc thẻ mobile (§F6 "Chọn nhiều").
     *
     * Không truyền thì bảng hành xử y hệt bản chưa có tính năng này — nơi gọi
     * cũ không phải sửa dòng nào.
     */
    selectable?: boolean
    /** Khoá của các dòng đang chọn. Chỉ chuỗi nguyên thuỷ, `ui` không biết `T` là gì (R3/R15). */
    selectedKeys?: string[]
    onSelectionChange?: (keys: string[]) => void
    /** `aria-label` cho checkbox "chọn tất cả". Song ngữ do nơi gọi truyền. */
    selectAllLabel?: string
    /** `aria-label` cho checkbox từng dòng — phải cụ thể, không phải "Chọn". */
    rowLabel?: (row: T) => string
}

export function DataTable<T>({
    caption,
    columns,
    rows,
    rowKey,
    empty,
    onRowClick,
    renderCard,
    selectable = false,
    selectedKeys,
    onSelectionChange,
    selectAllLabel,
    rowLabel,
}: DataTableProps<T>) {
    const selected = selectedKeys ?? []
    const pageKeys = rows.map(rowKey)
    const allSelected = pageKeys.length > 0 && pageKeys.every((k) => selected.includes(k))
    const someSelected = !allSelected && pageKeys.some((k) => selected.includes(k))

    const toggleRow = (key: string) => {
        if (!onSelectionChange) return
        onSelectionChange(
            selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key],
        )
    }

    const toggleAll = () => {
        if (!onSelectionChange) return
        // Chỉ đụng tới các dòng ĐANG HIỂN THỊ: bỏ chọn cả trang không được xoá
        // lựa chọn ở trang khác, nếu không người dùng mất việc đã làm.
        onSelectionChange(
            allSelected
                ? selected.filter((k) => !pageKeys.includes(k))
                : [...selected, ...pageKeys.filter((k) => !selected.includes(k))],
        )
    }

    const checkboxStyle: React.CSSProperties = {
        width: 18,
        height: 18,
        flexShrink: 0,
        accentColor: 'var(--brand)',
        cursor: 'pointer',
    }

    if (rows.length === 0) {
        return (
            <div
                style={{
                    padding: 'var(--space-16) var(--space-6)',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-sm)',
                }}
            >
                {empty}
            </div>
        )
    }

    return (
        <>
            {/* Bảng — từ 640px trở lên */}
            <div className="dt-table">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <caption
                        style={{
                            position: 'absolute',
                            width: 1,
                            height: 1,
                            overflow: 'hidden',
                            clip: 'rect(0 0 0 0)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {caption}
                    </caption>
                    <thead>
                        <tr style={{ background: 'var(--surface-alt)' }}>
                            {selectable && (
                                <th
                                    scope="col"
                                    style={{
                                        padding: 'var(--space-3) var(--space-4)',
                                        width: 44,
                                        borderBottom: '1px solid var(--border)',
                                        // Target chạm ≥ 24px kể cả khi ô rất hẹp (WCAG 2.2 §2.5.8).
                                        lineHeight: 0,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someSelected
                                        }}
                                        onChange={toggleAll}
                                        aria-label={selectAllLabel}
                                        style={checkboxStyle}
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    style={{
                                        padding: 'var(--space-3) var(--space-4)',
                                        textAlign: col.align ?? 'left',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 600,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-muted)',
                                        whiteSpace: 'nowrap',
                                        width: col.width,
                                        borderBottom: '1px solid var(--border)',
                                    }}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={rowKey(row)}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                style={{
                                    borderBottom: '1px solid var(--border)',
                                    cursor: onRowClick ? 'pointer' : undefined,
                                }}
                                className="dt-row"
                            >
                                {selectable && (
                                    <td
                                        onClick={(event) => event.stopPropagation()}
                                        style={{ padding: 'var(--space-4)', lineHeight: 0, width: 44 }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(rowKey(row))}
                                            onChange={() => toggleRow(rowKey(row))}
                                            aria-label={rowLabel?.(row)}
                                            style={checkboxStyle}
                                        />
                                    </td>
                                )}
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        style={{
                                            padding: 'var(--space-4)',
                                            textAlign: col.align ?? 'left',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text)',
                                            verticalAlign: 'middle',
                                            fontVariantNumeric:
                                                col.align === 'right' ? 'tabular-nums' : undefined,
                                        }}
                                    >
                                        {col.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Thẻ — dưới 640px */}
            <div className="dt-cards">
                {rows.map((row) => (
                    <div
                        key={rowKey(row)}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        style={{
                            padding: 'var(--space-4)',
                            borderBottom: '1px solid var(--border)',
                            cursor: onRowClick ? 'pointer' : undefined,
                            display: 'grid',
                            gridTemplateColumns: selectable ? 'auto minmax(0, 1fr)' : undefined,
                            alignItems: selectable ? 'start' : undefined,
                            gap: 'var(--space-2)',
                        }}
                    >
                        {selectable && (
                            <label
                                onClick={(event) => event.stopPropagation()}
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 24,
                                    height: 24,
                                    marginRight: 'var(--space-2)',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(rowKey(row))}
                                    onChange={() => toggleRow(rowKey(row))}
                                    aria-label={rowLabel?.(row)}
                                    style={checkboxStyle}
                                />
                            </label>
                        )}
                        <div style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
                        {renderCard
                            ? renderCard(row)
                            : columns
                                  .filter((c) => c.inCard !== false)
                                  .map((col) => (
                                      <div
                                          key={col.key}
                                          style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              gap: 'var(--space-4)',
                                              fontSize: 'var(--text-sm)',
                                          }}
                                      >
                                          <span style={{ color: 'var(--text-muted)' }}>
                                              {col.header}
                                          </span>
                                          <span style={{ textAlign: 'right' }}>{col.cell(row)}</span>
                                      </div>
                                  ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
