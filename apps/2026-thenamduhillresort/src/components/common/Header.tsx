'use client'

import { UI, namDuHill, pick } from '@repo/core'
import {
    toAccountMenu,
    toSiteHeaderBrand,
    toSiteHeaderStrings,
} from '@repo/domain-hotel'
import { SiteHeader } from '@repo/ui-layout'
import { usePathname } from 'next/navigation'

import { useLanguage } from '../../context/LanguageContext'
import { property } from '../../data/property'

/**
 * Header của app này — nay chỉ là lớp NỐI, không còn chứa markup.
 *
 * Markup nằm ở `@repo/ui-layout/SiteHeader`, được trích ra từ chính file này
 * vì nó là bản đầy đủ tính năng nhất trong bốn bản header từng tồn tại. Ba
 * việc file này còn làm:
 *
 *   1. đọc `useLanguage()` — context riêng của app, tầng nền không được biết
 *   2. đọc `usePathname()` — điều hướng của Next, cũng riêng của app
 *   3. dựng đường dẫn gốc (`/rooms`) — app này có domain riêng nên không gắn
 *      slug mẫu như app hub
 *
 * Đổi giao diện header thì sửa `SiteHeader`; đổi cách nối dữ liệu thì sửa ở đây.
 */

/** Section id trong dữ liệu chung → route thật của app này. */
const HREF_MAP: Record<string, string> = {
    '#rooms': '/rooms',
    '#dining': '/dining',
    '#places': '/explore',
    '#gallery': '/gallery',
    '#contact': '/contact',
}

export function Header({ forceSolid = false }: { forceSolid?: boolean }) {
    const { language, setLanguage } = useLanguage()
    const pathname = usePathname()

    // Trang quản trị có khung riêng, không dùng header công khai.
    if (pathname?.startsWith('/admin')) return null

    const locale = language as 'vi' | 'en'
    const isHome = pathname === '/'
    const isCheckout = pathname?.startsWith('/checkout') ?? false

    const nav = namDuHill.nav
        // Tour bán qua trang Khám phá, không đứng riêng trên menu.
        .filter((item) => item.href !== '#tours')
        .map((item) => ({
            label: pick(item.label, locale),
            href: HREF_MAP[item.href] ?? item.href,
        }))

    return (
        <SiteHeader
            brand={toSiteHeaderBrand(property, locale)}
            nav={nav}
            strings={toSiteHeaderStrings(locale)}
            homeHref="/"
            ctaHref="/rooms"
            currentHref={pathname ?? ''}
            accountMenu={toAccountMenu(locale, { myOrders: '/my-bookings', admin: '/admin' })}
            locales={[
                { code: 'vi', label: 'VI', onSelect: () => setLanguage('vi') },
                { code: 'en', label: 'EN', onSelect: () => setLanguage('en') },
            ]}
            activeLocale={locale}
            // Trang chủ có hero ảnh tràn viền nên header trong suốt ở đỉnh;
            // các trang khác nền sáng nên đặc ngay.
            transparentOnTop={isHome && !forceSolid}
            // Luồng thanh toán bỏ hết điều hướng để khách không rời giữa chừng.
            focusBadge={isCheckout ? pick(UI.secureCheckout, locale) : undefined}
        />
    )
}
