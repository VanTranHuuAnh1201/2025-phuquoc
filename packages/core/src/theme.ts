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

import type { I18nText } from '@repo/utils'
import type { ThemeSectionId } from './types'

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
export interface ThemeDefinition<
    THomeComponent = unknown,
    TRoomsComponent = unknown,
    TRoomDetailComponent = unknown,
    TCheckoutComponent = unknown,
    TToursComponent = unknown,
    TTourDetailComponent = unknown,
    TGalleryComponent = unknown,
    TContactComponent = unknown,
    TDiningComponent = unknown,
    TBlogComponent = unknown,
    TBlogDetailComponent = unknown,
> {
    meta: ThemeMeta
    /**
     * Thứ tự section mẫu này render.
     *
     * Phần lớn là tập con của `SECTION_IDS` (luật R7); mẫu nào có dải riêng
     * thì thêm id của nó vào đây để trang hub và điều hướng biết mà bỏ qua.
     */
    sections: readonly ThemeSectionId[]
    /** Component trang chủ của mẫu. Bắt buộc. */
    Home: THomeComponent

    /*
     * Các trang con — TUỲ CHỌN.
     *
     * Mẫu nào chưa dựng thì route tự rơi về `Home`, nên thêm mẫu mới không phải
     * dựng đủ tám trang mới chạy được. Route đọc slot từ registry chứ không
     * kiểm tra tên mẫu — nếu route phải viết `slug === 'h1'` thì kiến trúc đang
     * rò rỉ (luật R5).
     */
    /** Danh sách hạng phòng. */
    Rooms?: TRoomsComponent
    /** Chi tiết một hạng phòng. */
    RoomDetail?: TRoomDetailComponent
    /** Trang thanh toán / chốt đặt phòng. */
    Checkout?: TCheckoutComponent
    /** Danh sách combo & tour. */
    Tours?: TToursComponent
    /** Chi tiết một combo. */
    TourDetail?: TTourDetailComponent
    /** Thư viện ảnh. */
    Gallery?: TGalleryComponent
    /** Trang liên hệ. */
    Contact?: TContactComponent
    /** Trang ẩm thực — điểm ăn uống + thực đơn. */
    Dining?: TDiningComponent
    /** Cẩm nang / blog. */
    Blog?: TBlogComponent
    /** Chi tiết một bài cẩm nang. */
    BlogDetail?: TBlogDetailComponent
}

/** Props mọi theme nhận được. Dữ liệu đến từ core, theme chỉ hiển thị. */
export interface ThemePageProps<TData = unknown> {
    data: TData
    locale: string
    extra?: unknown
}

/**
 * Bất kỳ `ThemeDefinition` nào, không quan tâm kiểu component cụ thể.
 *
 * Hai hàm tra cứu dưới đây chỉ đọc `meta.slug`, nên chúng không cần biết theme
 * mang những component gì. Nhận qua một tham số kiểu duy nhất thay vì liệt kê
 * từng slot — thêm slot thứ chín sau này không phải sửa chữ ký hàm.
 */
export type AnyTheme = ThemeDefinition<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
>

/** Tra theme theo slug. Trả undefined nếu không có — route sẽ trả 404. */
export function findTheme<T extends AnyTheme>(
    themes: readonly T[],
    slug: string,
): T | undefined {
    return themes.find((theme) => theme.meta.slug === slug)
}

/** Sinh danh sách slug cho generateStaticParams. */
export function themeSlugs<T extends AnyTheme>(themes: readonly T[]): string[] {
    return themes.map((theme) => theme.meta.slug)
}
