'use client'

import type { ReactNode } from 'react'
import { Pagination, type PaginationProps } from './Pagination'

export type SortDir = 'asc' | 'desc'

export interface Column<T> {
  key: string
  /** Nhãn/tiêu đề cột. */
  header: ReactNode
  /** Function render nội dung ô; mặc định đọc `row[key]`. */
  cell?: (row: T, index: number) => ReactNode
  /** Alias cho cell (khớp với DataTable cũ của 2026meetapp). */
  render?: (row: T, index: number) => ReactNode
  /** Căn lề nội dung ô + header. */
  align?: 'left' | 'right' | 'center'
  /** Cột có cho phép sort không. */
  sortable?: boolean
  /** Cột này có hiện trong thẻ mobile không. Mặc định có. */
  inCard?: boolean
  /** Bề rộng cố định (vd '120px', '20%'). */
  width?: string
  /** className thêm cho <td>. */
  cellClassName?: string
}

export interface DataTableProps<T> {
  /** Mô tả bảng cho screen reader (nếu có). */
  caption?: string
  columns: Column<T>[]
  rows?: T[]
  /** Alias cho rows (khớp với DataTable 2026meetapp). */
  data?: T[]
  rowKey: (row: T, index?: number) => string
  loading?: boolean
  loadingText?: ReactNode
  /** Hiển thị khi không có dữ liệu. */
  empty?: ReactNode
  onRowClick?: (row: T, index: number) => void
  renderCard?: (row: T) => ReactNode

  // ------------------------------------------------- Sorting (controlled)
  sortKey?: string | null
  sortDir?: SortDir
  onSort?: (key: string) => void

  // ------------------------------------------------- Selection
  selectable?: boolean
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  selectAllLabel?: string
  rowLabel?: (row: T) => string

  // ------------------------------------------------- Pagination (optional)
  pagination?: PaginationProps

  // ------------------------------------------------- Styling
  containerClass?: string
}

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  const glyph = !active ? '↕' : dir === 'asc' ? '▲' : '▼'
  return (
    <span
      aria-hidden="true"
      style={{
        marginLeft: 6,
        fontSize: '0.7em',
        opacity: active ? 1 : 0.4,
        display: 'inline-block',
      }}
    >
      {glyph}
    </span>
  )
}

export function DataTable<T>({
  caption,
  columns,
  rows: rowsProp,
  data: dataProp,
  rowKey,
  loading = false,
  loadingText = 'Đang tải…',
  empty,
  onRowClick,
  renderCard,
  sortKey = null,
  sortDir = 'asc',
  onSort,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  selectAllLabel = 'Chọn tất cả',
  rowLabel,
  pagination,
  containerClass = '',
}: DataTableProps<T>) {
  const rows = rowsProp ?? dataProp ?? []
  const selected = selectedKeys ?? []
  const pageKeys = rows.map((r, i) => rowKey(r, i))
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
    accentColor: 'var(--brand, #0F172A)',
    cursor: 'pointer',
  }

  const renderCellContent = (col: Column<T>, row: T, index: number): ReactNode => {
    if (col.cell) return col.cell(row, index)
    if (col.render) return col.render(row, index)
    const raw = (row as Record<string, unknown>)[col.key]
    if (raw == null) return '—'
    if (typeof raw === 'string' || typeof raw === 'number') return raw
    return String(raw)
  }

  const colCount = columns.length + (selectable ? 1 : 0)

  return (
    <div className={`dt-wrapper bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col justify-between h-full min-h-0 overflow-hidden ${containerClass}`.trim()}>
      {/* Desktop Table View */}
      <div className="dt-table overflow-x-auto overflow-y-auto flex-1 min-h-0">

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {caption && (
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
          )}
          <thead>
            <tr style={{ background: 'var(--surface-alt, #F8FAFC)' }}>
              {selectable && (
                <th
                  scope="col"
                  style={{
                    padding: 'var(--space-3, 12px) var(--space-4, 16px)',
                    width: 44,
                    borderBottom: '1px solid var(--border, #E2E8F0)',
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
              {columns.map((col) => {
                const canSort = !!col.sortable && !!onSort
                const isActive = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={canSort ? () => onSort!(col.key) : undefined}
                    style={{
                      padding: '8px 12px',
                      textAlign: col.align ?? 'left',
                      fontSize: 'var(--text-xs, 12px)',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted, #64748B)',
                      whiteSpace: 'nowrap',
                      width: col.width,
                      borderBottom: '1px solid var(--border, #E2E8F0)',
                      cursor: canSort ? 'pointer' : undefined,
                      userSelect: canSort ? 'none' : undefined,
                    }}
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {canSort && <SortArrow active={isActive} dir={sortDir} />}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colCount} className="text-center text-slate-500 py-6">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                    <span>{loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="text-center text-slate-500 py-6">
                  {empty ?? <div className="text-sm">Không có dữ liệu</div>}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const key = rowKey(row, index)
                const isSelected = selected.includes(key)
                return (
                  <tr
                    key={key}
                    data-row-key={key}
                    onClick={
                      onRowClick
                        ? (e) => {
                            // Focus tường minh vào hàng vừa bấm — click chuột vào
                            // `<tr>` không tự set `document.activeElement` như click
                            // vào `<button>`. Modal đọc `document.activeElement` lúc
                            // mở để biết trả focus về đâu khi đóng (a11y bắt buộc,
                            // xem `Modal.tsx`); thiếu bước này thì focus rơi mất vào
                            // `<body>` sau khi đóng modal.
                            e.currentTarget.focus()
                            onRowClick(row, index)
                          }
                        : undefined
                    }
                    // Hàng có `onRowClick` phải bấm được bằng bàn phím (Enter/Space),
                    // không chỉ bằng chuột — nếu không thì hành động mở modal/điều
                    // hướng chỉ tới được bằng chuột, vi phạm FE11 "điều hướng bàn
                    // phím đầy đủ". `tabIndex=0` đưa hàng vào thứ tự Tab; `role="button"`
                    // báo cho screen reader đây là phần tử tương tác, không phải hàng
                    // dữ liệu thuần.
                    tabIndex={onRowClick ? 0 : undefined}
                    role={onRowClick ? 'button' : undefined}
                    // `rowLabel` phục vụ hai vai trò tuỳ ngữ cảnh: aria-label của
                    // checkbox khi `selectable`, aria-label của CHÍNH hàng khi hàng
                    // tự nó là nút bấm (`onRowClick` không đi kèm `selectable`).
                    // Không đọc chỉ số cột đầu tiên làm tên hàng — dữ liệu bảng nào
                    // cũng khác nhau, phải để nơi gọi tự đặt câu.
                    aria-label={onRowClick && !selectable ? rowLabel?.(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key !== 'Enter' && e.key !== ' ') return
                            e.preventDefault()
                            onRowClick(row, index)
                          }
                        : undefined
                    }
                    style={{
                      borderBottom: '1px solid var(--border, #E2E8F0)',
                      cursor: onRowClick ? 'pointer' : undefined,
                      background: isSelected ? 'var(--surface-selected, #F1F5F9)' : undefined,
                    }}
                    className={`dt-row hover:bg-slate-50/70 transition-colors${onRowClick ? ' focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand)]' : ''}`}
                  >
                    {selectable && (
                      <td
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '8px 12px', lineHeight: 0, width: 44 }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          aria-label={rowLabel?.(row)}
                          style={checkboxStyle}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={col.cellClassName}
                        style={{
                          padding: '8px 12px',
                          textAlign: col.align ?? 'left',
                          fontSize: 'var(--text-xs, 12px)',
                          color: 'var(--text, #0F172A)',
                          verticalAlign: 'middle',
                          fontVariantNumeric:
                            col.align === 'right' ? 'tabular-nums' : undefined,
                        }}
                      >
                        {renderCellContent(col, row, index)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards (under 640px) */}
      {!loading && rows.length > 0 && (
        <div className="dt-cards sm:hidden">
          {rows.map((row, index) => {
            const key = rowKey(row, index)
            const isSelected = selected.includes(key)
            return (
              <div
                key={key}
                data-row-key={key}
                onClick={
                  onRowClick
                    ? (e) => {
                        e.currentTarget.focus()
                        onRowClick(row, index)
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                aria-label={onRowClick && !selectable ? rowLabel?.(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key !== 'Enter' && e.key !== ' ') return
                        e.preventDefault()
                        onRowClick(row, index)
                      }
                    : undefined
                }
                className={`p-4 border-b border-slate-200 transition-colors${onRowClick ? ' cursor-pointer hover:bg-slate-50/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand)]' : ''} ${
                  isSelected ? 'bg-slate-50' : ''
                }`}
              >
                {selectable && (
                  <div className="mb-2 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(key)}
                      aria-label={rowLabel?.(row)}
                      style={checkboxStyle}
                    />
                  </div>
                )}
                {renderCard
                  ? renderCard(row)
                  : columns
                      .filter((c) => c.inCard !== false)
                      .map((col) => (
                        <div
                          key={col.key}
                          className="flex justify-between items-center py-1 text-sm border-b border-slate-100 last:border-0"
                        >
                          <span className="text-xs text-slate-500 font-medium">{col.header}</span>
                          <span>{renderCellContent(col, row, index)}</span>
                        </div>
                      ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Footer - Sticky Bottom */}
      {pagination && (
        <Pagination
          {...pagination}
          className="sticky bottom-0 bg-white border-t border-slate-200 mt-auto py-2.5 px-4 shrink-0 z-10"
        />
      )}
    </div>
  )
}

