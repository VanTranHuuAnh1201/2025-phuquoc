import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'
import { RoomsPage } from './pages/RoomsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import {
    CheckoutPage,
    ContactPage,
    GalleryPage,
    TourDetailPage,
    ToursPage,
} from './pages/shared'

/**
 * Mẫu 05 — Tropical Bright (spec v3, 2026-08-04).
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Giá và nghiệp vụ gọi qua
 * `@repo/core` (`checkAvailability`, `buildQuote`), không tự tính (luật R4/R8).
 *
 * Phạm vi vòng này: Home + Rooms + RoomDetail dựng riêng; Checkout/Tours/
 * Gallery/Contact nối bố cục mặc định của `@repo/ui` (spec §0.4).
 */
const themeH5: ThemeDefinition<
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

export default themeH5
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
