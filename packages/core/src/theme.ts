/**
 * Hợp đồng theme + registry.
 *
 * Đây là chỗ khiến luật R5 chạy được: thêm một mẫu mới chỉ gồm tạo folder
 * `packages/theme-xx/` và thêm một dòng vào registry ở `apps/2026-thenamduhill`. Không sửa
 * core, không sửa ui, không sửa route.
 *
 * Lưu ý: file này chỉ mô tả *hình dạng* của theme bằng type. Nó KHÔNG import
 * React và không chứa JSX — `core` phải chạy được trong Node thuần (luật R2).
 */

import type { I18nText } from './i18n'
import type { SectionId } from './types'

/** Thẻ mô tả một mẫu, dùng cho trang hub liệt kê các giao diện. */
export interface ThemeMeta {
    /** Slug trên URL, vd "h1" -> /h1 */
    slug: string
    /** Số thứ tự hiển thị, ví dụ "01". */
    num: string
    name: I18nText
    /** Mô tả tính cách của mẫu — khách đọc để chọn. */
    description: I18nText
    /** Ảnh xem trước cho trang hub. */
    preview: string
    /** Màu chủ đạo, chỉ để vẽ chip trên hub — không phải nguồn token. */
    swatch: {
        brand: string
        accent: string
    }
}

/**
 * Một theme đăng ký với registry.
 *
 * `Component` cố ý để kiểu rộng: core không được biết React là gì. Phía
 * `apps/2026-thenamduhill` sẽ ép về `ComponentType<ThemePageProps>` khi render.
 */
export interface ThemeDefinition<TComponent = unknown> {
    meta: ThemeMeta
    /** Thứ tự section mẫu này render — tập con của SECTION_IDS (luật R7). */
    sections: readonly SectionId[]
    /** Component trang chủ của mẫu. */
    Home: TComponent
}

/** Props mọi theme nhận được. Dữ liệu đến từ core, theme chỉ hiển thị. */
export interface ThemePageProps<TData = unknown> {
    data: TData
    locale: string
}

/** Tra theme theo slug. Trả undefined nếu không có — route sẽ trả 404. */
export function findTheme<T>(
    themes: readonly ThemeDefinition<T>[],
    slug: string,
): ThemeDefinition<T> | undefined {
    return themes.find((theme) => theme.meta.slug === slug)
}

/** Sinh danh sách slug cho generateStaticParams. */
export function themeSlugs<T>(
    themes: readonly ThemeDefinition<T>[],
): string[] {
    return themes.map((theme) => theme.meta.slug)
}
