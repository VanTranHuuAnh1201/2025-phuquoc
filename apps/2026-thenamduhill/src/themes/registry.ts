import type {
    BlogPost,
    Locale,
    MenuCategory,
    PropertyData,
    ThemeDefinition,
} from '@repo/core'
import themeH1 from '@repo/theme-h1'
import themeH2 from '@repo/theme-h2'

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

export type HomeComponent = (props: {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}) => React.ReactNode
export type RoomsComponent = (props: {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}) => React.ReactNode
export type RoomDetailComponent = (props: {
    data: PropertyData
    locale: Locale
    roomSlug?: string
    extra?: React.ReactNode
}) => React.ReactNode
export type CheckoutComponent = (props: {
    data: PropertyData
    locale: Locale
    searchParams?: Record<string, string | string[] | undefined>
    extra?: React.ReactNode
}) => React.ReactNode

/** Trang chi tiết combo — nhận slug từ URL, giống `RoomDetailComponent`. */
export type TourDetailComponent = (props: {
    data: PropertyData
    locale: Locale
    tourSlug?: string
    extra?: React.ReactNode
}) => React.ReactNode

/** Các trang tĩnh còn lại chỉ cần dữ liệu và ngôn ngữ. */
export type SimplePageComponent = (props: {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}) => React.ReactNode

/**
 * Ẩm thực và Cẩm nang đọc thêm nguồn ngoài `PropertyData` — thực đơn và danh
 * sách bài viết. Route lấy chúng qua `getDiningMenu()` / `getBlogPosts()` rồi
 * truyền xuống, nên theme vẫn không tự fetch (luật R4/R8).
 */
export type DiningPageComponent = (props: {
    data: PropertyData
    locale: Locale
    menu?: Record<string, MenuCategory>
    extra?: React.ReactNode
}) => React.ReactNode

export type BlogPageComponent = (props: {
    data: PropertyData
    locale: Locale
    posts?: BlogPost[]
    extra?: React.ReactNode
}) => React.ReactNode

/** Chi tiết một bài — nhận bài đang xem và vài bài gợi ý đọc tiếp. */
export type BlogDetailComponent = (props: {
    data: PropertyData
    locale: Locale
    post?: BlogPost
    related?: BlogPost[]
    extra?: React.ReactNode
}) => React.ReactNode

export type AnyThemeDefinition = ThemeDefinition<
    HomeComponent,
    RoomsComponent,
    RoomDetailComponent,
    CheckoutComponent,
    SimplePageComponent,
    TourDetailComponent,
    SimplePageComponent,
    SimplePageComponent,
    DiningPageComponent,
    BlogPageComponent,
    BlogDetailComponent
>

export const themes: readonly AnyThemeDefinition[] = [
    themeH1 as AnyThemeDefinition,
    themeH2 as AnyThemeDefinition,
]
