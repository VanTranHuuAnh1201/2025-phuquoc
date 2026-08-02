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
}

export function DataTable<T>({
    caption,
    columns,
    rows,
    rowKey,
    empty,
    onRowClick,
    renderCard,
}: DataTableProps<T>) {
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
                            gap: 'var(--space-2)',
                        }}
                    >
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
                ))}
            </div>
        </>
    )
}
