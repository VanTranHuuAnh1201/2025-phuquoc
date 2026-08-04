import type { Locale, PropertyData, SectionId } from '@repo/core'

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
}

export function Home({ data, locale }: HomeProps) {
    return (
        <div data-theme="h7" style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
            <Header data={data} locale={locale} />
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
            <Contact data={data} locale={locale} />
        </div>
    )
}
