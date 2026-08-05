import type { Locale, PropertyData, SectionId } from '@repo/core'
import {
    AboutSection,
    DiningSection,
    PlacesSection,
    PracticalSection,
    RoomsSection,
    siteFooterPropsOf,
} from '@repo/domain-hotel'
import { SiteFooter } from '@repo/ui-layout'

import { meta } from './meta'
import { ui } from './strings'
import { Booking } from './sections/Booking'
import { Contact } from './sections/Contact'
import { Gallery } from './sections/Gallery'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { SECTION_HEADINGS } from './sections/headings'

/**
 * Bố cục mẫu 02 — quyết định thứ tự và biến thể của từng section.
 *
 * Năm section dùng chung (About, Rooms, Dining, Places, Practical) đến từ
 * `@repo/domain-hotel`; mẫu này chỉ truyền xuống thứ THUỘC VỀ NÓ: `slug`, bộ
 * nhãn `ui` và bộ class tiêu đề `SECTION_HEADINGS`.
 *
 * Thứ tự lấy từ bản thiết kế desktop: cam kết và giới thiệu ngay dưới hero,
 * rồi phòng → ẩm thực → khám phá → thư viện ảnh → đánh giá & CTA → FAQ.
 *
 * `tours` bị bỏ khỏi trang chủ: bản thiết kế đưa hai combo nổi bật vào cột
 * phải của section `places`, còn danh sách đầy đủ nằm ở `/h2/tours`. Theme
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
                <AboutSection data={data} locale={locale} />
                <RoomsSection
                    data={data}
                    locale={locale}
                    slug={meta.slug}
                    ui={ui}
                    headingClass={SECTION_HEADINGS}
                />
                <DiningSection
                    data={data}
                    locale={locale}
                    slug={meta.slug}
                    headingClass={SECTION_HEADINGS}
                />
                <PlacesSection
                    data={data}
                    locale={locale}
                    slug={meta.slug}
                    headingClass={SECTION_HEADINGS}
                />
                <Gallery data={data} locale={locale} />
                <Booking data={data} locale={locale} />
                <PracticalSection
                    data={data}
                    locale={locale}
                    ui={ui}
                    headingClass={SECTION_HEADINGS}
                />
            </main>
            {/* `Contact` là section `#contact` của luật R7 — nội dung liên hệ,
                không phải chân trang. `SiteFooter` mới là chân trang thật. */}
            <Contact data={data} locale={locale} />
            <SiteFooter {...siteFooterPropsOf(data, locale, 'h2')} />
        </div>
    )
}
