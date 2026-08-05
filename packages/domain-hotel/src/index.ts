/**
 * `@repo/domain-hotel` — TẦNG DOMAIN: nghiệp vụ lưu trú.
 *
 * Đây là nơi từ vựng của ngành được phép xuất hiện: hạng phòng, tồn kho, gói
 * giá, tour, thực đơn, đặt cọc. Tầng nền (`utils`, `ui`, `ui-layout`) không
 * được biết tới chúng (luật R15).
 *
 * Đồ thị phụ thuộc:
 *
 *     theme-* → domain-hotel → ui-layout → ui → utils
 *
 * Domain khác (`domain-saas`, `domain-clinic`…) đứng NGANG HÀNG với package
 * này và không được import nó — cùng lý do hai theme không được import nhau.
 *
 * `shell-adapter` là chỗ duy nhất biết cả hai thế giới: nó dịch `PropertyData`
 * sang prop nguyên thuỷ mà `@repo/ui-layout` nhận.
 */

// ------------------------------------------------------------------ khung trang
export {
    shellPropsOf,
    toBrandInfo,
    toNavItems,
    toShellStrings,
    // khung trang đầy đủ — bản gộp từ app resort
    toSiteHeaderBrand,
    toSiteHeaderStrings,
    toAccountMenu,
    toSiteFooterBrand,
    toFooterColumns,
    siteFooterPropsOf,
} from './shell-adapter'
export type { AccountRoutes } from './shell-adapter'

// -------------------------------------------------------------- chuỗi giao diện
export type { UiStrings, UiStringSet } from './strings'

export { defaultPageStrings } from './pages/strings'
export type { PageStrings, PageStringSet } from './pages/strings'

// ------------------------------------------------------------- component riêng
export { BookingCalendarModal } from './BookingCalendarModal'
export type { BookingCalendarModalProps } from './BookingCalendarModal'

// ------------------------------------------------------------------ trang con
//
// Các trang này chỉ có MỘT bản thiết kế trong `resources/design/project/`
// (không có bản riêng cho từng mẫu như Rooms hay Home), nên cả N mẫu dùng
// chung bố cục và chỉ khác token. Để mỗi theme chép lại là vi phạm luật R1.
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
