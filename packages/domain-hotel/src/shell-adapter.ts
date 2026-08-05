import { pick, type Locale } from '@repo/utils'
import { UI, themeHref, themePath, themeRoot, type PropertyData } from '@repo/core'
import type {
    AccountMenuItem,
    BrandInfo,
    FooterColumn,
    NavItem,
    ShellStrings,
    SiteFooterBrand,
    SiteHeaderBrand,
    SiteHeaderStrings,
} from '@repo/ui-layout'

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

// ==================================================== khung trang đầy đủ (mới)
//
// Bộ dưới đây cấp prop cho `SiteHeader`/`SiteFooter` — bản gộp từ app resort,
// đầy đủ tính năng hơn `PageHeader`/`PageFooter` cũ. Mẫu mới nên dùng bộ này.

/**
 * Đường dẫn của các mục tài khoản.
 *
 * Khác nhau giữa hai app: app resort có domain riêng nên dùng đường dẫn gốc
 * (`/my-bookings`), app hub gắn slug của mẫu. Nơi gọi truyền vào.
 */
export interface AccountRoutes {
    myOrders: string
    admin?: string
}

export function toSiteHeaderBrand(data: PropertyData, locale: Locale): SiteHeaderBrand {
    const { brand } = data
    return {
        name: brand.name,
        tagline: pick(UI.cuTronVillageNamDuIsland, locale),
        logo: brand.logo,
    }
}

export function toSiteHeaderStrings(locale: Locale): SiteHeaderStrings {
    return {
        bookNow: pick(UI.bookNow2, locale),
        openMenu: pick(UI.openMenu, locale),
        closeMenu: pick(UI.closeMenu, locale),
        accountMenu: pick(UI.accountMenu, locale),
    }
}

/** Menu tài khoản — hai mục cố định của sản phẩm booking. */
export function toAccountMenu(locale: Locale, routes: AccountRoutes): AccountMenuItem[] {
    const items: AccountMenuItem[] = [
        {
            label: pick(UI.myBookings, locale),
            hint: pick(UI.viewBookingHistory, locale),
            href: routes.myOrders,
        },
    ]
    if (routes.admin) {
        items.push({
            label: pick(UI.adminCms, locale),
            hint: pick(UI.resortManagementPanel, locale),
            href: routes.admin,
        })
    }
    return items
}

export function toSiteFooterBrand(data: PropertyData, locale: Locale): SiteFooterBrand {
    const { brand } = data
    return {
        name: brand.name,
        tagline: brand.suffix,
        logo: brand.logo,
        address: pick(brand.address, locale),
        email: brand.email,
        phone: brand.phone,
    }
}

/**
 * Hai cột liên kết của chân trang: chính sách và khám phá.
 *
 * `policyHrefs` để trống thì cột chính sách bị bỏ — chưa có trang chính sách
 * thật thì đừng render link chết (bản resort đang trỏ `href="#"`, là lỗi).
 */
export function toFooterColumns(
    locale: Locale,
    hrefs: {
        rooms: string
        dining: string
        explore: string
        blog: string
        contact: string
        policy?: {
            privacy: string
            terms: string
            guide: string
            cancellation: string
            payment: string
        }
    },
): FooterColumn[] {
    const columns: FooterColumn[] = []

    if (hrefs.policy) {
        columns.push({
            title: pick(UI.information, locale),
            links: [
                { label: pick(UI.privacyPolicy, locale), href: hrefs.policy.privacy },
                { label: pick(UI.generalTerms, locale), href: hrefs.policy.terms },
                { label: pick(UI.bookingGuide, locale), href: hrefs.policy.guide },
                { label: pick(UI.cancellationPolicy, locale), href: hrefs.policy.cancellation },
                { label: pick(UI.paymentOptions, locale), href: hrefs.policy.payment },
            ],
        })
    }

    columns.push({
        title: pick(UI.explore, locale),
        links: [
            { label: pick(UI.roomList, locale), href: hrefs.rooms },
            { label: pick(UI.diningBbq, locale), href: hrefs.dining },
            { label: pick(UI.exploreNamDu, locale), href: hrefs.explore },
            { label: pick(UI.travelJournal, locale), href: hrefs.blog },
            { label: pick(UI.contactUs, locale), href: hrefs.contact },
        ],
    })

    return columns
}

/**
 * Gói trọn prop header cho một mẫu trong app hub.
 *
 * Khác bản của app resort ở hai chỗ: đường dẫn gắn slug của mẫu, và chuyển
 * ngôn ngữ dùng `?lang=` thay vì state — nhờ vậy trang chủ giữ được SSG.
 */
export function siteHeaderPropsOf(data: PropertyData, locale: Locale, slug: string) {
    return {
        brand: toSiteHeaderBrand(data, locale),
        nav: toNavItems(data, locale, slug),
        strings: toSiteHeaderStrings(locale),
        homeHref: themeRoot(slug),
        ctaHref: themePath(slug, 'rooms'),
        accountMenu: toAccountMenu(locale, { myOrders: '/my-orders' }),
        locales: [
            { code: 'vi', label: 'VI', href: '?lang=vi' },
            { code: 'en', label: 'EN', href: '?lang=en' },
        ],
        activeLocale: locale as string,
    }
}

/** Gói trọn prop chân trang cho một mẫu trong app hub. */
export function siteFooterPropsOf(data: PropertyData, locale: Locale, slug: string) {
    return {
        brand: toSiteFooterBrand(data, locale),
        intro: pick(UI.theNamDuHillBusinessHousehold, locale),
        columns: toFooterColumns(locale, {
            rooms: themePath(slug, 'rooms'),
            dining: themePath(slug, 'dining'),
            explore: themePath(slug, 'tours'),
            blog: themePath(slug, 'blog'),
            contact: themePath(slug, 'contact'),
        }),
        socialTitle: pick(UI.connect, locale),
        social: [
            { label: 'f', href: data.brand.site, external: true },
            { label: 'Za', href: `https://zalo.me/${data.brand.phone.replace(/\s/g, '')}`, external: true },
        ],
        badge: { label: pick(UI.registeredWithMinistryOfCommerce, locale) },
        copyright: `© 2026 ${data.brand.name} ${data.brand.suffix} · ${data.brand.site.replace(/^https?:\/\//, '')}`,
        note: pick(UI.bestRatesWhenBookingDirect, locale),
    }
}
