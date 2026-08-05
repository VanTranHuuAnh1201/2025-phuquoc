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
    siteHeaderPropsOf,
    siteFooterPropsOf,
} from './shell-adapter'
export type { AccountRoutes } from './shell-adapter'

// ------------------------------------------------------------------ ảnh
//
// Bảng ánh xạ đường dẫn ảnh cho nội dung lưu trú. `core` giữ phần CHỮ, chỗ này
// giữ ĐƯỜNG DẪN — nhờ vậy app hub và app resort dùng chung một bộ ảnh thay vì
// mỗi app tự khai một bản (xem docblock của `media.ts`).
export {
    UPLOAD_DIR,
    HERO_SLIDES,
    RESORT_PHOTOS,
    FEATURED_PLACE_IDS,
    galleryWithImages,
    featuredPlaces,
    allPhotos,
    facilityAmenities,
    hostPerks,
} from './media'
export type {
    HeroSlideAsset,
    ResortPhoto,
    ResortPhotoCategory,
    RoomImageSource,
} from './media'

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

// ------------------------------------------------------- section của trang chủ
//
// Các section này có cùng BỐ CỤC ở nhiều mẫu của domain lưu trú — khác biệt
// nằm trọn trong `tokens.css` cùng hai prop thuộc về mẫu: `ui` (giọng nhãn) và
// `headingClass` (bản sắc tiêu đề). Để mỗi theme chép lại là đúng thứ luật R1
// cấm.
//
// `slug` là prop BẮT BUỘC ở mọi section dựng đường dẫn: một mặc định sai làm
// link trỏ nhầm mẫu mà build vẫn xanh.

export { AboutSection } from './sections/About'
export type { AboutSectionProps } from './sections/About'

export { RoomsSection } from './sections/Rooms'
export type { RoomsSectionProps } from './sections/Rooms'

export { DiningSection } from './sections/Dining'
export type { DiningSectionProps } from './sections/Dining'

export { PlacesSection } from './sections/Places'
export type { PlacesSectionProps } from './sections/Places'

export { PracticalSection } from './sections/Practical'
export type { PracticalSectionProps } from './sections/Practical'

export { ScrollRail } from './sections/ScrollRail'
export type { ScrollRailProps } from './sections/ScrollRail'

export { DEFAULT_SECTION_HEADINGS } from './sections/headings'
export type { SectionHeadingClasses } from './sections/headings'
