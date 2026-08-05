/**
 * `@repo/ui` — TẦNG NỀN: primitive rời, không mang bản sắc thương hiệu và
 * không biết domain nào tồn tại.
 *
 * Mọi giá trị hình ảnh đọc từ CSS variable trong `tokens.css`. Cấm hard-code
 * màu, font, radius ở đây (luật R3).
 *
 * Phép thử trước khi thêm bất cứ thứ gì vào đây (luật R15):
 *
 *     "Component này có nhắc tới phòng, đơn hàng, tour, thực đơn không?"
 *
 * Không nhắc → thuộc về đây. Có nhắc → `packages/domain-*`.
 *
 * Ranh giới với hai package láng giềng:
 *
 *     ui           primitive rời — Button, Modal, Field, DataTable
 *     ui-layout    bố cục trang  — Header, Hero, Breadcrumbs, Footer
 *     domain-hotel nghiệp vụ     — CheckoutPage, ToursPage, DiningPage
 */

export { Button } from './Button'
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button'

export { Section } from './Section'
export type { SectionProps } from './Section'

export { SectionHeader } from './SectionHeader'
export type { SectionHeaderProps } from './SectionHeader'

export { Pill } from './Pill'
export type { PillProps, PillTone } from './Pill'

export { Card } from './Card'
export type { CardProps } from './Card'

export { ImageSlot } from './ImageSlot'
export type { ImageSlotProps } from './ImageSlot'

export { Accordion } from './Accordion'
export type { AccordionItem, AccordionProps } from './Accordion'

export { useScrolled } from './useScrolled'

// ---------------------------------------------------- primitive cho bảng & form

export { Badge } from './Badge'
export type { BadgeProps, BadgeTone } from './Badge'

export { DataTable } from './DataTable'
export type { Column, DataTableProps } from './DataTable'

export { Field, SelectField, TextAreaField, CheckField } from './Field'
export type {
    FieldProps,
    SelectFieldProps,
    TextAreaFieldProps,
    CheckFieldProps,
} from './Field'

export { Modal } from './Modal'
export type { ModalProps } from './Modal'

export { StatCard } from './StatCard'
export type { StatCardProps } from './StatCard'

export { Toolbar, FilterSelect } from './Toolbar'
export type { ToolbarProps, FilterSelectProps } from './Toolbar'
