'use client'

/**
 * `DataGrid` — bọc `DataTable` của `@repo/ui` cho diện mạo CMS.
 *
 * VÌ SAO BỌC, KHÔNG FORK: `DataTable` đã đọc phần lớn token qua inline style
 * (`var(--border)`, `var(--text-muted)`, `var(--surface-alt)`…) nên nó TỰ đổi
 * diện mạo khi nằm trong `[data-cms]` — xem khối ánh xạ cuối `tokens.css`.
 * Copy ruột `DataTable` sang file này sẽ tạo ra hai bản trôi dạt theo thời
 * gian: sửa bug/thêm tính năng ở bản gốc mà quên đồng bộ bản fork (rủi ro #4
 * trong spec §8). Vì vậy `DataGrid` CHỈ ghi đè đúng 3 chỗ `@repo/ui` hard-code
 * class Tailwind chống lại thiết kế CMS — không đụng gì khác:
 *
 * | Chỗ                | `DataTable` hiện tại (hard-code)          | Cách ghi đè ở đây |
 * |---------------------|--------------------------------------------|---|
 * | Wrapper              | `bg-white border-slate-200 rounded-lg shadow-sm` | truyền `containerClass` mặc định để triệt shadow/bo góc |
 * | Hover hàng           | `hover:bg-slate-50/70`                     | CSS `[data-cms] .dt-row:hover` trong `tokens.css` |
 * | Padding ô (`8px 12px`, inline style, không đọc qua prop) | không có prop tương ứng | CSS `[data-cms] .dt-table td { height: var(--cms-row-h) }` trong `tokens.css` |
 *
 * Hai chỗ sau nằm trong `tokens.css` vì `DataTable` không có prop nhận chúng —
 * ghi đè bằng CSS selector con là cách duy nhất không sửa `@repo/ui`.
 */

import { DataTable, type DataTableProps } from '@repo/ui'

export type DataGridProps<T> = DataTableProps<T>

/**
 * `containerClass` mặc định triệt `bg-white border-slate-200 rounded-lg
 * shadow-sm` của wrapper gốc — CMS dùng nền `--cms-bg` phẳng, phân tách bằng
 * đường kẻ 1px thay vì shadow (P7, cùng nguyên tắc với `AppShell`/`PageHeaderBar`).
 * Người gọi vẫn truyền thêm `containerClass` riêng nếu cần, hai chuỗi được nối.
 */
const CMS_CONTAINER_CLASS = 'bg-[var(--cms-bg)] border-[var(--cms-border)] rounded-none shadow-none'

export function DataGrid<T>(props: DataGridProps<T>) {
    const containerClass = props.containerClass
        ? `${CMS_CONTAINER_CLASS} ${props.containerClass}`
        : CMS_CONTAINER_CLASS

    return <DataTable {...props} containerClass={containerClass} />
}
