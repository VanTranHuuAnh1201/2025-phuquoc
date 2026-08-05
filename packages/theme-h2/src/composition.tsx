import type { Locale, PropertyData, SectionId } from '@repo/core'
import { siteFooterPropsOf } from '@repo/domain-hotel'
import { SiteFooter } from '@repo/ui-layout'

import { About } from './sections/About'
import { Booking } from './sections/Booking'
import { Contact } from './sections/Contact'
import { Dining } from './sections/Dining'
import { Gallery } from './sections/Gallery'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Places } from './sections/Places'
import { Practical } from './sections/Practical'
import { Rooms } from './sections/Rooms'

/**
 * Bố cục mẫu 07 — quyết định thứ tự và biến thể của từng section.
 *
 * Thứ tự lấy từ bản thiết kế desktop: cam kết và giới thiệu ngay dưới hero,
 * rồi phòng → ẩm thực → khám phá → thư viện ảnh → đánh giá & CTA → FAQ.
 *
 * `tours` bị bỏ khỏi trang chủ: bản thiết kế đưa hai combo nổi bật vào cột
 * phải của section `places`, còn danh sách đầy đủ nằm ở `/h7/tours`. Theme
 * được bỏ bớt section, nhưng KHÔNG được đổi tên id (luật R7) — nên `tours`
 * cũng không còn trong mảng dưới đây.
 */

export const sections: readonly SectionId[] = [
    'top',
    'about',
    'rooms',
    'dining',
    'places',
    'gallery',
    'booking',
    'contact',
] as const

export interface HomeProps {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}

/**
 * `overflow-x-clip` chứ KHÔNG phải `overflow-x-hidden`.
 *
 * Spec CSS: khi một trục là `hidden` còn trục kia `visible`, trình duyệt âm thầm
 * đổi trục `visible` thành `auto`. Nên `overflow-x: hidden` biến phần tử này
 * thành scroll container, và mọi `position: sticky` bên trong dính vào NÓ thay
 * vì vào viewport — thanh tóm tắt của Booking trôi mất khi cuộn.
 *
 * `clip` chặn tràn ngang y hệt nhưng không tạo scroll container.
 */
export function Home({ data, locale, extra }: HomeProps) {
    return (
        <div data-theme="h2" className="font-primary overflow-x-clip">
            <Header data={data} locale={locale} extra={extra} />
            <main>
                <Hero data={data} locale={locale} />
                <About data={data} locale={locale} />
                <Rooms data={data} locale={locale} />
                <Dining data={data} locale={locale} />
                <Places data={data} locale={locale} />
                <Gallery data={data} locale={locale} />
                <Booking data={data} locale={locale} />
                <Practical data={data} locale={locale} />
            </main>
            {/* `Contact` là section `#contact` của luật R7 — nội dung liên hệ,
                không phải chân trang. `SiteFooter` mới là chân trang thật. */}
            <Contact data={data} locale={locale} />
            <SiteFooter {...siteFooterPropsOf(data, locale, 'h2')} />
        </div>
    )
}
