import type { Locale, PropertyData } from '@repo/core'
import {
    ContactPage as UiContactPage,
    GalleryPage as UiGalleryPage,
    TourDetailPage as UiTourDetailPage,
    ToursPage as UiToursPage,
} from '@repo/ui'

import { meta } from '../meta'

/**
 * Bốn trang con dùng chung, gắn sẵn slug của mẫu này.
 *
 * Bố cục nằm ở `@repo/ui` vì prototype chỉ có MỘT bản cho mỗi trang trong số
 * này — không có `Tours H2`, `Gallery H3`… như Rooms hay Checkout. Mẫu nào
 * cũng render cùng bố cục và chỉ khác `tokens.css` của chính nó.
 *
 * File này cố ý mỏng: nó chỉ nối slug vào, không chứa bố cục. Khi khách duyệt
 * một thiết kế riêng cho mẫu này, thay thân hàm bằng bản riêng — registry và
 * route không phải đổi một dòng nào.
 */

interface PageProps {
    data: PropertyData
    locale: Locale
}

const SLUG = meta.slug

export function ToursPage({ data, locale }: PageProps) {
    return <UiToursPage data={data} locale={locale} slug={SLUG} />
}

export function TourDetailPage({
    data,
    locale,
    tourSlug,
}: PageProps & { tourSlug?: string }) {
    return <UiTourDetailPage data={data} locale={locale} slug={SLUG} tourSlug={tourSlug} />
}

export function GalleryPage({ data, locale }: PageProps) {
    return <UiGalleryPage data={data} locale={locale} slug={SLUG} />
}

export function ContactPage({ data, locale }: PageProps) {
    return <UiContactPage data={data} locale={locale} slug={SLUG} />
}
