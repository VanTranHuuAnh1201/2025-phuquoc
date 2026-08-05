import type { BlogPost, Locale, MenuCategory, PropertyData } from '@repo/core'
import {
    BlogDetailPage as UiBlogDetailPage,
    BlogPage as UiBlogPage,
    CheckoutPage as UiCheckoutPage,
    ContactPage as UiContactPage,
    DiningPage as UiDiningPage,
    GalleryPage as UiGalleryPage,
    TourDetailPage as UiTourDetailPage,
    ToursPage as UiToursPage,
} from '@repo/domain-hotel'

import { meta } from '../meta'

/**
 * Các trang con dùng chung, gắn sẵn slug của mẫu này.
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

export function DiningPage({
    data,
    locale,
    menu,
}: PageProps & { menu?: Record<string, MenuCategory> }) {
    return <UiDiningPage data={data} locale={locale} slug={SLUG} menu={menu} />
}

export function BlogPage({ data, locale, posts }: PageProps & { posts?: BlogPost[] }) {
    return <UiBlogPage data={data} locale={locale} slug={SLUG} posts={posts} />
}

export function BlogDetailPage({
    data,
    locale,
    post,
    related,
}: PageProps & { post?: BlogPost; related?: BlogPost[] }) {
    return (
        <UiBlogDetailPage
            data={data}
            locale={locale}
            slug={SLUG}
            post={post}
            related={related}
        />
    )
}

export function CheckoutPage({
    data,
    locale,
    searchParams,
}: PageProps & { searchParams?: Record<string, string | string[] | undefined> }) {
    // Route truyền `?room=` để biết khách đang đặt hạng phòng nào.
    const roomId = typeof searchParams?.room === 'string' ? searchParams.room : undefined
    return <UiCheckoutPage data={data} locale={locale} slug={SLUG} roomId={roomId} />
}
