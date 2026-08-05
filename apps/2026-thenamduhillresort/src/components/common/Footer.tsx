'use client'

import { UI, pick } from '@repo/core'
import { toFooterColumns, toSiteFooterBrand } from '@repo/domain-hotel'
import { SiteFooter } from '@repo/ui-layout'
import { usePathname } from 'next/navigation'

import { useLanguage } from '../../context/LanguageContext'
import { property } from '../../data/property'

/**
 * Chân trang của app này — lớp NỐI, markup nằm ở `@repo/ui-layout/SiteFooter`.
 * Cùng lý do với `Header.tsx`.
 *
 * Cột "Thông tin" (chính sách) CỐ Ý bỏ trống: bản trước render 5 link đều trỏ
 * `href="#"` — link chết còn tệ hơn không có link. Khi có trang chính sách
 * thật thì truyền `policy` vào `toFooterColumns`.
 */
export function Footer() {
    const { language } = useLanguage()
    const pathname = usePathname()
    const locale = language as 'vi' | 'en'

    // Luồng thanh toán và trang quản trị không có chân trang.
    if (pathname?.startsWith('/checkout') || pathname?.startsWith('/admin')) {
        return null
    }

    return (
        <SiteFooter
            brand={toSiteFooterBrand(property, locale)}
            intro={pick(UI.theNamDuHillBusinessHousehold, locale)}
            columns={toFooterColumns(locale, {
                rooms: '/rooms',
                dining: '/dining',
                explore: '/explore',
                blog: '/blog',
                contact: '/contact',
            })}
            socialTitle={pick(UI.connect, locale)}
            social={[
                { label: 'f', href: 'https://facebook.com/thenamduhill', external: true },
                { label: 'Za', href: 'https://zalo.me/0985000650', external: true },
            ]}
            badge={{ label: pick(UI.registeredWithMinistryOfCommerce, locale) }}
            copyright="© 2026 The Nam Du Hill Resort · thenamduhill.com"
            note={pick(UI.bestRatesWhenBookingDirect, locale)}
            // Chừa chỗ cho `MobileStickyCta` dính ở đáy màn hình.
            bottomInset
        />
    )
}
