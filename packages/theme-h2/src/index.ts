import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'
import { RoomsPage } from './pages/RoomsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import {
    BlogDetailPage,
    BlogPage,
    CheckoutPage,
    ContactPage,
    DiningPage,
    GalleryPage,
    TourDetailPage,
    ToursPage,
} from './pages/shared'

/**
 * Mẫu 07 — Coastal Blue.
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Không nghiệp vụ, không
 * gọi API, không định nghĩa type dữ liệu (luật R4).
 *
 * `Rooms` và `RoomDetail` là hai slot tuỳ chọn của `ThemeDefinition`: route
 * `[theme]/rooms/**` đọc chúng từ registry, mẫu nào chưa dựng thì tự rơi về
 * `Home`. Nhờ vậy thêm trang con cho mẫu 07 không đụng tới h2/h3/h4 (luật R5).
 */
const themeH2: ThemeDefinition<
    typeof Home,
    typeof RoomsPage,
    typeof RoomDetailPage,
    typeof CheckoutPage,
    typeof ToursPage,
    typeof TourDetailPage,
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
    TourDetail: TourDetailPage,
    Gallery: GalleryPage,
    Contact: ContactPage,
    Dining: DiningPage,
    Blog: BlogPage,
    BlogDetail: BlogDetailPage,
}

export default themeH2
export { meta, Home, sections }
export {
    RoomsPage,
    RoomDetailPage,
    CheckoutPage,
    ToursPage,
    TourDetailPage,
    GalleryPage,
    ContactPage,
    DiningPage,
    BlogPage,
    BlogDetailPage,
}

export { About as H2About } from './sections/About'
export { Rooms as H2Rooms } from './sections/Rooms'
export { Dining as H2Dining } from './sections/Dining'
export { Places as H2Places } from './sections/Places'
export { Practical as H2Practical } from './sections/Practical'

