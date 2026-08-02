import type { Locale, PropertyData, ThemeDefinition } from '@repo/core'
import themeH1 from '@repo/theme-h1'

/**
 * REGISTRY THEME — đây là file DUY NHẤT phải sửa khi thêm một mẫu mới.
 *
 * Thêm mẫu thứ 20:
 *   1. tạo `packages/theme-h20/`
 *   2. thêm `"@repo/theme-h20": "workspace:*"` vào package.json của app
 *   3. thêm một dòng import + một phần tử vào mảng dưới đây
 *
 * Không sửa core, không sửa ui, không sửa route. Nếu buộc phải sửa —
 * kiến trúc đang rò rỉ, phải trừu tượng hoá lại (luật R5).
 */

type HomeComponent = (props: { data: PropertyData; locale: Locale }) => React.ReactNode

export const themes: readonly ThemeDefinition<HomeComponent>[] = [
    themeH1 as ThemeDefinition<HomeComponent>,
    // theme-h2, theme-h3, theme-h4 …
]
