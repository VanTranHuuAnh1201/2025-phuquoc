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
import { Tours } from './sections/Tours'

/**
 * Bố cục mẫu 07 — quyết định thứ tự và biến thể của từng section.
 *
 * Thứ tự lấy đúng từ prototype `Home 01 - Nam Du Hill.dc.html`: rooms đứng
 * trước tours, còn places xen giữa tours và dining.
 *
 * Theme được bỏ bớt section, nhưng KHÔNG được đổi tên id (luật R7).
 */

export const sections: readonly SectionId[] = [
    'top',
    'about',
    'rooms',
    'tours',
    'places',
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
        <div data-theme="h7" style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
            <Header data={data} locale={locale} />
            <main>
                <Hero data={data} locale={locale} />
                <About data={data} locale={locale} />
                <Rooms data={data} locale={locale} />
                <Tours data={data} locale={locale} />
                <Places data={data} locale={locale} />
                <Dining data={data} locale={locale} />
                <Practical data={data} locale={locale} />
                <Gallery data={data} locale={locale} />
                <Booking data={data} locale={locale} />
            </main>
            <Contact data={data} locale={locale} />
        </div>
    )
}
