import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'
import { BlogDetailPage } from './pages/BlogDetailPage'
import { BlogPage } from './pages/BlogPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactPage } from './pages/ContactPage'
import { DiningPage } from './pages/DiningPage'
import { GalleryPage } from './pages/GalleryPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { RoomsPage } from './pages/RoomsPage'
import { ToursPage } from './pages/ToursPage'

/**
 * Mẫu 03 — Coastal Navy.
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Không nghiệp vụ, không
 * gọi API, không định nghĩa type dữ liệu (luật R4).
 *
 * CHÍN TRANG CON LÀ BẢN RIÊNG CỦA MẪU NÀY, không dùng bản ở `domain-hotel`.
 *
 * Mẫu 02 nối vào các trang dùng chung vì prototype chỉ có một bản thiết kế cho
 * chúng. Mẫu 03 thì khác: bản resort có thiết kế riêng cho từng trang — danh
 * sách phòng hai cột có sidebar lọc, thư viện ảnh có hero và thanh lọc dính,
 * thanh toán ba bước… Chép chúng vào đây là ĐÚNG, vì khác biệt nằm ở hình thức
 * và hình thức là việc của theme (luật R4). Thứ KHÔNG được chép là nghiệp vụ:
 * mọi trang nhận dữ liệu qua prop, không tự tính giá, không gọi repository.
 *
 * `Tours` trỏ vào nội dung mà bản resort đặt ở `/explore` — cùng một trang
 * "khám phá đảo", chỉ khác tên slot. Giữ tên slot của hợp đồng để route và
 * điều hướng không phải biết mẫu nào gọi nó là gì (luật R7).
 *
 * Các section được export lẻ để app resort dùng lại từng khối mà không phải
 * lấy cả trang chủ — đúng mục tiêu "dùng chung được cho cả hai app".
 */
const themeH3: ThemeDefinition<
    typeof Home,
    typeof RoomsPage,
    typeof RoomDetailPage,
    typeof CheckoutPage,
    typeof ToursPage,
    never,
    typeof GalleryPage,
    typeof ContactPage,
    typeof DiningPage,
    typeof BlogPage,
    typeof BlogDetailPage
> = {
    meta,
    sections,
    Home,
    Rooms: RoomsPage,
    RoomDetail: RoomDetailPage,
    Checkout: CheckoutPage,
    Tours: ToursPage,
    // `TourDetail` chưa dựng: bản resort không có trang chi tiết combo riêng,
    // `/explore` đã kể trọn lịch trình. Slot bỏ trống thì route tự rơi về
    // `Home`, không phải dựng cho đủ (luật R5).
    Gallery: GalleryPage,
    Contact: ContactPage,
    Dining: DiningPage,
    Blog: BlogPage,
    BlogDetail: BlogDetailPage,
}

export default themeH3
export { meta, Home, sections }

// -------------------------------------------------------------- section lẻ
export { Hero } from './sections/Hero'
export type { HeroProps, HeroSlide, HeroSearchParams } from './sections/Hero'

export { HostService } from './sections/HostService'
export type { HostServiceProps } from './sections/HostService'

export { Panorama } from './sections/Panorama'
export type { PanoramaProps } from './sections/Panorama'

export { Gallery } from './sections/Gallery'
export type { GalleryProps, GalleryPhoto } from './sections/Gallery'

export { SectionHeading } from './sections/SectionHeading'
export { TestimonialColumns } from './sections/TestimonialColumns'

export { iconFor } from './icons'
export { H3, ui } from './strings'
export type { HomeProps } from './composition'

// ------------------------------------------------------------- trang con lẻ
//
// Export riêng để app resort cắm thẳng vào route của nó — cùng một bộ code
// phục vụ cả URL riêng của app đó lẫn `/h3/**` trên trang hub.

export { RoomsPage } from './pages/RoomsPage'
export type { RoomsPageProps } from './pages/RoomsPage'

export { RoomDetailPage } from './pages/RoomDetailPage'
export type { RoomDetailPageProps } from './pages/RoomDetailPage'

export { CheckoutPage } from './pages/CheckoutPage'
export type { CheckoutPageProps } from './pages/CheckoutPage'

export { ToursPage } from './pages/ToursPage'
export type { ToursPageProps } from './pages/ToursPage'

export { GalleryPage } from './pages/GalleryPage'
export type { GalleryPageProps } from './pages/GalleryPage'

export { ContactPage } from './pages/ContactPage'
export type { ContactPageProps } from './pages/ContactPage'

export { DiningPage } from './pages/DiningPage'
export type { DiningPageProps } from './pages/DiningPage'

export { BlogPage } from './pages/BlogPage'
export type { BlogPageProps } from './pages/BlogPage'

export { BlogDetailPage } from './pages/BlogDetailPage'
export type { BlogDetailPageProps } from './pages/BlogDetailPage'
