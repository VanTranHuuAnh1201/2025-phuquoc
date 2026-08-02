import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'
import {
    CheckoutPage,
    ContactPage,
    GalleryPage,
    TourDetailPage,
    ToursPage,
} from './pages/shared'
import { RoomsPage } from './pages/RoomsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'

/**
 * Mẫu 04 — Teal & Lime.
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Không nghiệp vụ, không
 * gọi API, không định nghĩa type dữ liệu (luật R4).
 *
 * Bốn trang `Tours`, `TourDetail`, `Gallery`, `Contact` dùng bố cục chung từ
 * `@repo/ui` — prototype chỉ có MỘT bản thiết kế cho mỗi trang này, nên mẫu 04
 * hiện chúng bằng chính token của mình thay vì chép lại bố cục (luật R1).
 */
const themeH4: ThemeDefinition<
    typeof Home,
    typeof RoomsPage,
    typeof RoomDetailPage,
    typeof CheckoutPage,
    typeof ToursPage,
    typeof TourDetailPage,
    typeof GalleryPage,
    typeof ContactPage
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
}

export default themeH4
export { meta, Home, sections }
export {
    RoomsPage,
    RoomDetailPage,
    CheckoutPage,
    ToursPage,
    TourDetailPage,
    GalleryPage,
    ContactPage,
}
