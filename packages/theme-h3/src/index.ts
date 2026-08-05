import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'

/**
 * Mẫu 03 — Coastal Navy.
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Không nghiệp vụ, không
 * gọi API, không định nghĩa type dữ liệu (luật R4).
 *
 * Bản chuyển này mới có trang chủ. Các slot trang con của `ThemeDefinition`
 * đều tuỳ chọn — route `[theme]/**` chưa thấy slot nào thì tự rơi về `Home`,
 * nên thêm trang con sau này không đụng tới h1/h2 (luật R5).
 *
 * Các section được export lẻ để app resort dùng lại từng khối mà không phải
 * lấy cả trang chủ — đúng mục tiêu "dùng chung được cho cả hai app".
 */
const themeH3: ThemeDefinition<typeof Home> = {
    meta,
    sections,
    Home,
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
export { H3 } from './strings'
export type { HomeProps } from './composition'
