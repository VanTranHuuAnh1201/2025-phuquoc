/**
 * `@repo/cms-ui` — DESIGN SYSTEM CỦA CMS, dùng chung cho mọi sản phẩm.
 *
 * Khác `@repo/ui` ở chỗ: `ui` là primitive vô danh không mang bản sắc, còn
 * package này CÓ bản sắc — bản sắc của công cụ quản trị nội bộ, cố ý giữ
 * nguyên qua mọi khách hàng (app-flows.md §F5: "một layout admin duy nhất").
 *
 * Vẫn thuộc TẦNG NỀN nên phép thử R15 vẫn áp: không file nào ở đây được
 * nhắc "phòng", "đơn hàng", "tồn kho". Chỉ có `label`, `value`, `tone`.
 */

export { DotBadge } from './DotBadge'
export type { DotBadgeProps, CmsTone } from './DotBadge'

export { AppShell } from './AppShell'
export type { AppShellProps, ShellNavItem, ShellZone } from './AppShell'
