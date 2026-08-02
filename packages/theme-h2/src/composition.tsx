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
import { Promo } from './sections/Promo'
import { Rooms } from './sections/Rooms'
import { Steps } from './sections/Steps'
import { Tours } from './sections/Tours'

import { RoomsPage } from './pages/RoomsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { CheckoutPage } from './pages/CheckoutPage'

/**
 * Bố cục mẫu 02 — quyết định thứ tự và biến thể của từng section.
 *
 * Thứ tự lấy đúng từ prototype `Home 02 - Nam Du Hill.dc.html` và KHÁC mẫu 01:
 * ngay sau hero là dải `steps` riêng của mẫu này, và `places` đứng TRƯỚC
 * `rooms` — chủ ý dẫn khách nhìn điểm đến trước rồi mới tới giá phòng.
 */

export const sections: readonly ThemeSectionId[] = [
    'top',
    'steps',
    'about',
    'places',
    'rooms',
    'tours',
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
        <div data-theme="h2" style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
            <Header data={data} locale={locale} />
            <main>
                <Hero data={data} locale={locale} />
                <Steps data={data} locale={locale} />
                <About data={data} locale={locale} />
                <Places data={data} locale={locale} />
                <Promo data={data} locale={locale} />
                <Rooms data={data} locale={locale} />
                <Tours data={data} locale={locale} />
                <Dining data={data} locale={locale} />
                <Practical data={data} locale={locale} />
                <Gallery data={data} locale={locale} />
                <Booking data={data} locale={locale} />
            </main>
            <Contact data={data} locale={locale} />
        </div>
    )
}

export function RoomsView({ data, locale }: HomeProps) {
    return (
        <div data-theme="h2">
            <RoomsPage data={data} locale={locale} />
        </div>
    )
}

export function RoomDetailView({
    data,
    locale,
    roomSlug,
}: HomeProps & { roomSlug?: string }) {
    return (
        <div data-theme="h2">
            <RoomDetailPage data={data} locale={locale} roomSlug={roomSlug} />
        </div>
    )
}

export function CheckoutView({
    data,
    locale,
    searchParams,
}: HomeProps & { searchParams?: Record<string, string | string[] | undefined> }) {
    return (
        <div data-theme="h2">
            <CheckoutPage data={data} locale={locale} searchParams={searchParams} />
        </div>
    )
}
