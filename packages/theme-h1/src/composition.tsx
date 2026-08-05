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
 * Mẫu 06 "Sunlit Booking" — bản thực thi của spec v4.
 *
 * Vòng này chỉ chốt Home full: đủ hero, trust, rooms preview, dining, places,
 * gallery, booking FAQ và contact. Rooms/RoomDetail riêng dừng sau checkpoint
 * review Home.
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

/**
 * `overflow-x-clip` chứ KHÔNG phải `overflow-x-hidden`.
 *
 * Spec CSS: khi một trục là `hidden` còn trục kia `visible`, trình duyệt âm thầm
 * đổi trục `visible` thành `auto`. Nên `overflow-x: hidden` biến phần tử này
 * thành scroll container, và mọi `position: sticky` bên trong dính vào NÓ thay
 * vì vào viewport — thanh đặt phòng dính ở Hero trôi mất khi cuộn.
 *
 * `clip` chặn tràn ngang y hệt nhưng không tạo scroll container.
 */
export function Home({ data, locale }: HomeProps) {
    return (
        <div data-theme={meta.slug} className="overflow-x-clip">
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
