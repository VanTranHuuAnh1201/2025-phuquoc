import { pick, type Locale } from '@repo/utils'
import { themeHref, themePath, themeRoot, type PropertyData } from '@repo/core'
import type { BrandInfo, NavItem, ShellStrings } from '@repo/ui-layout'

import type { PageStrings } from './pages/strings'

/**
 * Cầu nối giữa dữ liệu lưu trú và khung trang vô danh.
 *
 * VÌ SAO TỒN TẠI: `@repo/ui-layout` nhận prop nguyên thuỷ (chuỗi, mảng
 * nhãn+href) chứ không nhận `PropertyData` — nếu nó nhận, cả khung trang bị
 * khoá vào domain khách sạn và domain thứ hai phải chép code (luật R15).
 *
 * VÌ SAO Ở ĐÂY CHỨ KHÔNG Ở `ui-layout`: hàm này biết `brand.suffix`,
 * `themePath(slug, 'rooms')` — từ vựng của ngành lưu trú. Đó đúng là việc của
 * tầng domain: dịch dữ liệu của mình sang hợp đồng chung của tầng nền.
 *
 * Đây là chỗ DUY NHẤT biết cả hai thế giới. Thêm một trang mới thì sửa ở đây,
 * không phải sửa `ui-layout`.
 */

/** Tên địa danh hiện cạnh tên thương hiệu trên header. */
const LOCALITY = 'Nam Du Island'

export function toBrandInfo(data: PropertyData, locale: Locale): BrandInfo {
    const { brand } = data
    return {
        name: brand.name,
        suffix: brand.suffix,
        locality: LOCALITY,
        address: pick(brand.address, locale),
        phone: brand.phone,
        email: brand.email,
        site: brand.site,
    }
}

/** Menu điều hướng — nhãn đã chọn ngôn ngữ, đường dẫn đã gắn slug của mẫu. */
export function toNavItems(data: PropertyData, locale: Locale, slug: string): NavItem[] {
    return data.nav.map((item) => ({
        label: pick(item.label, locale),
        href: themeHref(slug, item.href),
    }))
}

/** Nhãn cố định của khung trang, rút từ bộ chuỗi của tầng domain. */
export function toShellStrings(t: PageStrings): ShellStrings {
    return {
        hotlineTitle: t.hotlineTitle,
        bookNow: t.bookNow,
        footerAbout: t.footerAbout,
        footerNav: t.footerNav,
        footerContact: t.footerContact,
        footerFollow: t.footerFollow,
        backToHub: t.backToHub,
    }
}

/**
 * Gói trọn các prop của header/footer cho một mẫu.
 * Nơi gọi chỉ cần trải ra: `<PageHeader {...shellPropsOf(data, locale, slug, t)} />`
 */
export function shellPropsOf(
    data: PropertyData,
    locale: Locale,
    slug: string,
    t: PageStrings,
) {
    return {
        brand: toBrandInfo(data, locale),
        nav: toNavItems(data, locale, slug),
        strings: toShellStrings(t),
        homeHref: themeRoot(slug),
        ctaHref: themePath(slug, 'rooms'),
    }
}
