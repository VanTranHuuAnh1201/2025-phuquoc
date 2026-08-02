import type { Locale, PropertyData, ThemeDefinition } from '@repo/core'
import themeH1 from '@repo/theme-h1'
import themeH2 from '@repo/theme-h2'
import themeH3 from '@repo/theme-h3'
import themeH4 from '@repo/theme-h4'

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

export type HomeComponent = (props: { data: PropertyData; locale: Locale }) => React.ReactNode
export type RoomsComponent = (props: { data: PropertyData; locale: Locale }) => React.ReactNode
export type RoomDetailComponent = (props: {
    data: PropertyData
    locale: Locale
    roomSlug?: string
}) => React.ReactNode
export type CheckoutComponent = (props: {
    data: PropertyData
    locale: Locale
    searchParams?: Record<string, string | string[] | undefined>
}) => React.ReactNode

/** Trang chi tiết combo — nhận slug từ URL, giống `RoomDetailComponent`. */
export type TourDetailComponent = (props: {
    data: PropertyData
    locale: Locale
    tourSlug?: string
}) => React.ReactNode

/** Các trang tĩnh còn lại chỉ cần dữ liệu và ngôn ngữ. */
export type SimplePageComponent = (props: {
    data: PropertyData
    locale: Locale
}) => React.ReactNode

export type AnyThemeDefinition = ThemeDefinition<
    HomeComponent,
    RoomsComponent,
    RoomDetailComponent,
    CheckoutComponent,
    SimplePageComponent,
    TourDetailComponent,
    SimplePageComponent,
    SimplePageComponent
>

export const themes: readonly AnyThemeDefinition[] = [
    themeH1 as AnyThemeDefinition,
    themeH2 as AnyThemeDefinition,
    themeH3 as AnyThemeDefinition,
    themeH4 as AnyThemeDefinition,
]
