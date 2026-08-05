import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { RoomsPage } from './pages/RoomsPage'

/**
 * Mẫu 04 — "Nam Du Quiet Luxury" (`v5_amanoi`).
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Không nghiệp vụ, không
 * gọi API, không định nghĩa type dữ liệu (luật R4).
 *
 * Bản này dựng ba trang theo yêu cầu: `Home`, `Rooms`, `RoomDetail`. Các slot
 * còn lại của `ThemeDefinition` đều tuỳ chọn — route `[theme]/**` không thấy
 * slot nào thì tự rơi về `Home`, nên bổ sung trang con sau này không đụng tới
 * h1/h2/h3 (luật R5).
 */
const themeH4: ThemeDefinition<typeof Home, typeof RoomsPage, typeof RoomDetailPage> = {
    meta,
    sections,
    Home,
    Rooms: RoomsPage,
    RoomDetail: RoomDetailPage,
}

export default themeH4
export { meta, Home, sections, RoomsPage, RoomDetailPage }
export type { HomeProps } from './composition'

// -------------------------------------------------------------- section lẻ
//
// Export rời để app thứ hai dùng lại từng khối mà không phải lấy cả trang chủ
// — cùng mục tiêu "một nơi code, hai nơi hiển thị" của mẫu 03.

export { Hero } from './sections/Hero'
export type { HeroProps, HeroSlide, HeroSearchParams } from './sections/Hero'

export { Setting } from './sections/Setting'
export type { SettingProps } from './sections/Setting'

export { Sanctuaries } from './sections/Sanctuaries'
export type { SanctuariesProps } from './sections/Sanctuaries'

export { Culinary } from './sections/Culinary'
export type { CulinaryProps } from './sections/Culinary'

export { Assurance } from './sections/Assurance'
export type { AssuranceProps } from './sections/Assurance'

export { H4 } from './strings'
