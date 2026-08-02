import type { Locale, PropertyData, ThemeSectionId } from '@repo/core'

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
import { Themes } from './sections/Themes'
import { Tours } from './sections/Tours'

/**
 * Bố cục mẫu 03 — quyết định thứ tự và biến thể của từng section.
 *
 * Thứ tự lấy đúng từ prototype `Home 03 - Nam Du Hill.dc.html` và CỐ Ý khác cả
 * mẫu 01 lẫn 02: dải chủ đề mở màn ngay sau hero, places đứng trước rooms, còn
 * about lùi xuống SAU tours để cắt nhịp bằng một dải nền tối.
 *
 * `themes` là section riêng của mẫu này, không thuộc bộ id chuẩn của luật R7 —
 * core thừa nhận qua `CustomSectionId`.
 */

export const sections: readonly ThemeSectionId[] = [
    'top',
    'themes',
    'places',
    'rooms',
    'tours',
    'about',
    'dining',
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
        <div data-theme="h3" style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
            <Header data={data} locale={locale} />
            <main>
                <Hero data={data} locale={locale} />
                <Themes data={data} locale={locale} />
                <Places data={data} locale={locale} />
                <Rooms data={data} locale={locale} />
                <Tours data={data} locale={locale} />
                <About data={data} locale={locale} />
                <Dining data={data} locale={locale} />
                <Practical data={data} locale={locale} />
                <Gallery data={data} locale={locale} />
                <Booking data={data} locale={locale} />
            </main>
            <Contact data={data} locale={locale} />
        </div>
    )
}
