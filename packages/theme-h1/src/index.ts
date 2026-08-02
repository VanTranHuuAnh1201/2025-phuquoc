import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'

/**
 * Mẫu 01 — Coastal Blue.
 *
 * Theme chỉ chứa HÌNH THỨC: token, section, bố cục. Không nghiệp vụ, không
 * gọi API, không định nghĩa type dữ liệu (luật R4).
 */
const themeH1: ThemeDefinition<typeof Home> = {
    meta,
    sections,
    Home,
}

export default themeH1
export { meta, Home, sections }
