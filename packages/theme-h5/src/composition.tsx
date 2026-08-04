import type { Locale, PropertyData, SectionId } from '@repo/core'

import { meta } from './meta'
import { BaseCss } from './components/base'
import { ZaloFab } from './components/ZaloFab'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Rooms } from './sections/Rooms'
import { Dining } from './sections/Dining'
import { Places } from './sections/Places'
import { Gallery } from './sections/Gallery'
import { Booking } from './sections/Booking'
import { Contact } from './sections/Contact'

/**
 * Bố cục mẫu 05 "Tropical Bright" — spec v3 §3.1.
 *
 * Bỏ `tours` khỏi Home (dữ liệu tour hiện gọn trong `places`) — bỏ bớt hợp lệ
 * theo luật R7, KHÔNG đổi tên id. Nhịp so le: hai section liền nhau không bao
 * giờ cùng bố cục (hero full → cát 3 cột → lưới card → 2 cột chữ/ảnh →
 * full-bleed → lưới bất đối xứng → dải đậm → footer).
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
        <div data-theme={meta.slug} style={{ overflowX: 'hidden' }}>
            <BaseCss />
            <Header data={data} locale={locale} />
            <main>
                <Hero data={data} locale={locale} />
                <About data={data} locale={locale} />
                <Rooms data={data} locale={locale} />
                <Dining data={data} locale={locale} />
                <Places data={data} locale={locale} />
                <Gallery data={data} locale={locale} />
                <Booking data={data} locale={locale} />
            </main>
            <Contact data={data} locale={locale} />
            <ZaloFab brand={data.brand} locale={locale} />
        </div>
    )
}
