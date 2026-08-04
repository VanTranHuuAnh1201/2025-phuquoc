import type { ThemeDefinition } from '@repo/core'

import { Home, sections } from './composition'
import { meta } from './meta'

/**
 * Mẫu 06 — khung trống.
 *
 * Chỉ khai `Home`. Bảy trang con là tuỳ chọn, route tự rơi về `Home` khi mẫu
 * chưa dựng chúng — nên đăng ký một mẫu mới không cần đủ tám trang mới chạy.
 */
const themeH6: ThemeDefinition<typeof Home> = {
    meta,
    sections,
    Home,
}

export default themeH6
export { meta, Home, sections }

