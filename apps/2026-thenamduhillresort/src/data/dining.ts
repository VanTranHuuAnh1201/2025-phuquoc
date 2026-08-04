/**
 * Thực đơn — đọc từ `@repo/core`, KHÔNG khai dữ liệu tại đây (luật R8).
 *
 * Nguồn thật: `packages/core/src/data/dining-menu.ts`.
 *
 * Ở core giá là SỐ (35000) để đổi định dạng theo ngôn ngữ được; giao diện hiện
 * tại hiển thị dạng rút gọn "35K" nên lớp này quy đổi lại. Khi màn hình chuyển
 * sang `formatPrice()` thì bỏ được phần quy đổi.
 */

import { diningMenu, type MenuCategory as CoreMenuCategory } from '@repo/core'

export interface MenuItem {
    id: number
    nameVi: string
    nameEn: string
    price: string
}

export interface MenuCategory {
    key: 'coffee' | 'tea' | 'hot'
    nameVi: string
    nameEn: string
    items: MenuItem[]
}

/** 35000 → "35K" — dạng rút gọn quán dùng trên bảng menu. */
function shortPrice(vnd: number): string {
    return `${Math.round(vnd / 1000)}K`
}

function toCategory(cat: CoreMenuCategory): MenuCategory {
    return {
        key: cat.key as MenuCategory['key'],
        nameVi: cat.name.vi,
        nameEn: cat.name.en,
        items: cat.items.map((item) => ({
            id: item.id,
            nameVi: item.name.vi,
            nameEn: item.name.en,
            price: shortPrice(item.price),
        })),
    }
}

export const DINING_MENU: Record<string, MenuCategory> = Object.fromEntries(
    Object.entries(diningMenu).map(([key, cat]) => [key, toCategory(cat)]),
)
