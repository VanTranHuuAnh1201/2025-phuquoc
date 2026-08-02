import type { ThemeDefinition } from '@repo/core'

import {
    CheckoutView as Checkout,
    Home,
    RoomDetailView as RoomDetail,
    RoomsView as Rooms,
    sections,
} from './composition'
import { meta } from './meta'
import { ContactPage, GalleryPage, TourDetailPage, ToursPage } from './pages/shared'

/**
 * Mẫu 02 — Teal & Amber.
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Không nghiệp vụ, không
 * gọi API, không định nghĩa type dữ liệu (luật R4).
 *
 * `Rooms`, `RoomDetail`, `Checkout` có bản riêng vì prototype có
 * `Rooms H2 / Room Detail H2 / Checkout H2`. Bốn trang còn lại chỉ có một bản
 * thiết kế duy nhất nên dùng chung từ `@repo/ui` (luật R1).
 */
const themeH2: ThemeDefinition<
    typeof Home,
    typeof Rooms,
    typeof RoomDetail,
    typeof Checkout,
    typeof ToursPage,
    typeof TourDetailPage,
    typeof GalleryPage,
    typeof ContactPage
> = {
    meta,
    sections,
    Home,
    Rooms,
    RoomDetail,
    Checkout,
    Tours: ToursPage,
    TourDetail: TourDetailPage,
    Gallery: GalleryPage,
    Contact: ContactPage,
}

export default themeH2
export { meta, Home, Rooms, RoomDetail, Checkout, sections }
export { ToursPage, TourDetailPage, GalleryPage, ContactPage }
