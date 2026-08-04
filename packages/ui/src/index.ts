/**
 * @repo/ui — primitive không mang bản sắc thương hiệu.
 *
 * Mọi giá trị hình ảnh đọc từ CSS variable trong `tokens.css`. Cấm hard-code
 * màu, font, radius ở đây (luật R3).
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

export type { UiStrings, UiStringSet } from './strings'

// ------------------------------------------------------ primitive cho booking & CMS

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

export { BookingCalendarModal } from './BookingCalendarModal'
export type { BookingCalendarModalProps } from './BookingCalendarModal'

export { StatCard } from './StatCard'
export type { StatCardProps } from './StatCard'

export { Toolbar, FilterSelect } from './Toolbar'
export type { ToolbarProps, FilterSelectProps } from './Toolbar'

// ----------------------------------------------------- trang con dùng chung
//
// Bốn trang Tours / Tour Detail / Gallery / Contact chỉ có MỘT bản thiết kế
// trong `resources/design/project/` (không có bản H2/H3/H4 như Rooms hay
// Checkout), nên cả N mẫu dùng chung bố cục và chỉ khác token. Để mỗi theme
// chép lại là vi phạm luật R1.
//
// Mỗi trang nhận `slug` để tự dựng đường dẫn — thêm mẫu thứ 20 không phải sửa
// file nào ở đây (luật R5).

export { ToursPage } from './pages/ToursPage'
export type { ToursPageProps } from './pages/ToursPage'

export { TourDetailPage } from './pages/TourDetailPage'
export type { TourDetailPageProps } from './pages/TourDetailPage'

export { GalleryPage } from './pages/GalleryPage'
export type { GalleryPageProps } from './pages/GalleryPage'

export { ContactPage } from './pages/ContactPage'
export type { ContactPageProps } from './pages/ContactPage'

export { CheckoutPage } from './pages/CheckoutPage'
export type { CheckoutPageProps } from './pages/CheckoutPage'

export { DiningPage } from './pages/DiningPage'
export type { DiningPageProps } from './pages/DiningPage'

export { BlogPage } from './pages/BlogPage'
export type { BlogPageProps } from './pages/BlogPage'

export { BlogDetailPage } from './pages/BlogDetailPage'
export type { BlogDetailPageProps } from './pages/BlogDetailPage'

export {
    PageBody,
    PageHeader,
    PageHero,
    PageFooter,
    Breadcrumbs,
    LightCrumbs,
} from './pages/PageShell'
export type { Crumb, ShellProps } from './pages/PageShell'

export { defaultPageStrings } from './pages/strings'
export type { PageStrings, PageStringSet } from './pages/strings'
