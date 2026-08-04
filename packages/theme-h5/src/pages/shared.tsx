import type { Locale, PropertyData } from '@repo/core'
import {
    CheckoutPage as UiCheckoutPage,
    ContactPage as UiContactPage,
    GalleryPage as UiGalleryPage,
    TourDetailPage as UiTourDetailPage,
    ToursPage as UiToursPage,
} from '@repo/ui'

import { meta } from '../meta'

/**
 * Các trang con ngoài phạm vi vòng này (spec v3 §0.4) — nối vào bố cục mặc
 * định của `@repo/ui`, gắn sẵn slug h5. Chúng ăn token của mẫu 05 qua bộ alias
 * trong `tokens.css` nên vẫn cùng bảng màu Tropical Bright.
 *
 * Checkout đặc biệt quan trọng: nút "Đặt phòng" của RoomDetail trỏ tới
 * `/h5/checkout?room=` — không khai slot này thì route rơi về Home và phễu đứt.
 */

interface PageProps {
    data: PropertyData
    locale: Locale
}

const SLUG = meta.slug

export function ToursPage({ data, locale }: PageProps) {
    return <UiToursPage data={data} locale={locale} slug={SLUG} />
}

export function TourDetailPage({ data, locale, tourSlug }: PageProps & { tourSlug?: string }) {
    return <UiTourDetailPage data={data} locale={locale} slug={SLUG} tourSlug={tourSlug} />
}

export function GalleryPage({ data, locale }: PageProps) {
    return <UiGalleryPage data={data} locale={locale} slug={SLUG} />
}

export function ContactPage({ data, locale }: PageProps) {
    return <UiContactPage data={data} locale={locale} slug={SLUG} />
}

export function CheckoutPage({
    data,
    locale,
    searchParams,
}: PageProps & { searchParams?: Record<string, string | string[] | undefined> }) {
    const roomId = typeof searchParams?.room === 'string' ? searchParams.room : undefined
    return <UiCheckoutPage data={data} locale={locale} slug={SLUG} roomId={roomId} />
}
