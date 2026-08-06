'use client'

import { useMemo, useState } from 'react'
import {
    pick,
    themePath,
    themeRoot,
    UI,
    type I18nText,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { allPhotos, siteFooterPropsOf, siteHeaderPropsOf, type ResortPhotoCategory } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Thư viện ảnh — BẢN RIÊNG CỦA MẪU 03.
 *
 * VÌ SAO KHÔNG DÙNG `GalleryPage` CỦA `@repo/domain-hotel`: bản dùng chung port
 * từ prototype `Gallery - Nam Du Hill.dc.html` — hero 400px, lưới 4 cột với ô
 * rộng gấp đôi mỗi 7 ô. Mẫu 03 lấy bố cục của app resort: hero ảnh tràn viền
 * cao theo `vh`, thanh lọc DÍNH ngay dưới header, lưới 2/3 cột tỉ lệ 4:3. Đó là
 * hai hình thức khác nhau chứ không phải hai bản của cùng một hình thức, nên
 * theo luật R4 nó thuộc về theme. Bản dùng chung vẫn nguyên vẹn cho h1/h2.
 *
 * VÌ SAO NHẬN `data` RỒI TỰ GOM ẢNH BẰNG `allPhotos()`: route `[theme]/gallery`
 * chỉ truyền `data`/`locale` cho mọi mẫu (luật R5 — thêm mẫu không sửa route).
 * `allPhotos()` sống ở tầng domain và là nguồn duy nhất của bộ ảnh này, nên
 * theme chỉ đọc kết quả chứ không tự khai danh sách ảnh (luật R8/R13).
 *
 * `slug` mặc định về `meta.slug` vì registry hiện không truyền nó xuống; mọi
 * đường dẫn vẫn dựng bằng `themePath()` nên đổi tên mẫu là link tự theo.
 *
 * ⚠️ Luật R9: `allPhotos()` gộp cả ảnh crawl từ thenamduhill.com. Cờ
 * `allowCrawled` để mặc định `true` cho môi trường dev; trước khi lên production
 * app phải truyền `false` hoặc thay bằng ảnh chụp thật.
 */

type Filter = 'all' | ResortPhotoCategory

/** Thứ tự nhóm trên thanh lọc — theo đúng bản resort. */
const CATEGORY_ORDER: ResortPhotoCategory[] = ['rooms', 'dining', 'places', 'resort', 'views']

const FILTER_LABELS: Record<Filter, I18nText> = {
    all: H3.photoGroupAll,
    rooms: H3.photoGroupRooms,
    dining: H3.photoGroupDining,
    places: H3.photoGroupPlaces,
    resort: H3.photoGroupResort,
    views: H3.photoGroupViews,
}

export interface GalleryPageProps {
    data: PropertyData
    locale: Locale
    /** Mặc định về slug của chính mẫu — registry chưa truyền prop này. */
    slug?: string
    /** Chèn thêm vào header — vd nút chuyển ngôn ngữ riêng của app. */
    extra?: React.ReactNode
    /** Ảnh mở đầu. Bỏ trống thì dùng đúng file của bản resort. */
    heroImage?: string
    /** Cho phép ảnh crawl hay không (luật R9). App đọc cờ môi trường rồi truyền. */
    allowCrawled?: boolean
}

export function GalleryPage({
    data,
    locale,
    slug = meta.slug,
    extra,
    heroImage = '/uploads/hero-3.png',
    allowCrawled = true,
}: GalleryPageProps) {
    const [filter, setFilter] = useState<Filter>('all')

    /**
     * `allPhotos()` cần danh sách phòng ở dạng chuỗi một ngôn ngữ (`RoomImageSource`).
     * Dữ liệu của `core` là `I18nText`, nên dịch tại chỗ — đây là ánh xạ hình
     * thức, không phải nghiệp vụ.
     */
    const photos = useMemo(
        () =>
            allPhotos(
                data,
                data.rooms.map((room) => ({
                    name: room.name.vi,
                    nameEn: room.name.en,
                    images: room.images ?? [],
                })),
                allowCrawled,
            ),
        [data, allowCrawled],
    )

    /** Chỉ hiện nhóm THỰC SỰ có ảnh — nút lọc luôn trả về rỗng là ngõ cụt. */
    const filters: Filter[] = useMemo(
        () => [
            'all',
            ...CATEGORY_ORDER.filter((cat) => photos.some((photo) => photo.category === cat)),
        ],
        [photos],
    )

    const visible =
        filter === 'all' ? photos : photos.filter((photo) => photo.category === filter)

    return (
        // `overflow-x-clip` chứ KHÔNG phải `hidden`: `hidden` trên một trục biến
        // trục kia thành scroll container, làm thanh lọc `sticky` dính vào div
        // này thay vì vào viewport.
        <div data-theme="h3" className="font-primary overflow-x-clip">
            <SiteHeader {...siteHeaderPropsOf(data, locale, slug)} extra={extra} />

            <main className="bg-surface-base text-text-primary min-h-screen pt-[56px] pb-[80px]">
                {/* Hero */}
                <section className="bg-[var(--surface-inverse)] relative flex min-h-[38vh] items-end overflow-hidden pt-[80px] sm:min-h-[46vh]">
                    <img
                        src={heroImage}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-inverse)] via-[rgb(15_45_82/0.6)] to-[rgb(0_0_0/0.4)]" />
                    <div className="relative mx-auto w-full max-w-[var(--container)] px-[16px] pb-[32px] sm:px-[24px] lg:px-[32px]">
                        <nav
                            aria-label="Breadcrumb"
                            className="mb-[8px] text-[11px] text-[rgb(255_255_255/0.7)]"
                        >
                            <a
                                href={themeRoot(slug)}
                                className="underline-offset-2 hover:text-[var(--text-inverse)] hover:underline"
                            >
                                {pick(UI.home, locale)}
                            </a>
                            <span className="mx-[6px]" aria-hidden="true">
                                /
                            </span>
                            <span className="text-text-inverse">{pick(H3.galleryPage, locale)}</span>
                        </nav>
                        <h1 className="text-text-inverse font-display text-[24px] font-bold tracking-tight sm:text-[30px] md:text-[36px]">
                            {pick(H3.galleryTitle, locale)}
                        </h1>
                        <p className="mt-[6px] max-w-[576px] text-[12px] font-normal text-[rgb(255_255_255/0.8)] sm:text-[14px]">
                            {pick(H3.gallerySub, locale)}
                        </p>
                    </div>
                </section>

                {/*
                 * Bộ lọc dính ngay dưới top header.
                 *
                 * VÌ SAO HAI MỐC `top`: header cao khác nhau theo breakpoint vì
                 * nút hành động bị ẩn dưới `sm`. Đặt thấp hơn mốc đó thì thanh
                 * lọc chui xuống dưới header.
                 *
                 * VÌ SAO KHÔNG BỌC THÊM DIV CÓ `overflow`: bất kỳ tổ tiên nào
                 * mang `overflow: hidden/auto` đều vô hiệu hoá `position: sticky`
                 * — kể cả `overflow-x: hidden`, vì trình duyệt tự đổi trục còn
                 * lại thành `auto`.
                 *
                 * Lề âm bù lại padding ngang của section để dải nền chạy hết
                 * chiều rộng màn hình khi dính, không bị hụt hai mép.
                 */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] py-[24px] sm:px-[24px] sm:py-[32px] lg:px-[32px]">
                    <div className="border-border-muted sticky top-[56px] z-30 mx-[-16px] mb-[16px] flex items-center justify-between gap-[12px] border-b bg-[rgb(250_250_248/0.95)] px-[16px] py-[12px] backdrop-blur-md sm:top-[62px] sm:mx-[-24px] sm:gap-[16px] sm:px-[24px] lg:mx-[-32px] lg:px-[32px]">
                        {/*
                         * Mobile cuộn ngang thay vì xuống dòng: sáu nút wrap
                         * thành hai hàng làm thanh dính cao gấp đôi, ăn mất phần
                         * ảnh vốn là thứ trang này cần hiện.
                         */}
                        <div className="flex min-w-0 gap-[8px] overflow-x-auto sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                            {filters.map((id) => {
                                const active = filter === id
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setFilter(id)}
                                        aria-pressed={active}
                                        className={`h-[36px] shrink-0 rounded-[6px] px-[14px] text-[12px] font-bold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${
                                            active
                                                ? 'bg-brand text-text-inverse border border-transparent shadow-1'
                                                : 'bg-surface-raised border-border-muted text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)] border'
                                        }`}
                                    >
                                        {pick(FILTER_LABELS[id], locale)}
                                    </button>
                                )
                            })}
                        </div>
                        <span
                            aria-live="polite"
                            className="shrink-0 text-[12px] text-[var(--text-soft)]"
                        >
                            {visible.length} {pick(H3.photosWord, locale)}
                        </span>
                    </div>

                    {visible.length === 0 ? (
                        // Trạng thái rỗng phải nói rõ làm gì tiếp (luật D6)
                        <p className="bg-surface-raised border-border-muted rounded-[12px] border p-[24px] text-center text-[14px] text-[var(--text-muted)]">
                            {pick(H3.galleryEmpty, locale)}
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-[12px] sm:gap-[16px] md:grid-cols-3">
                            {visible.map((photo) => (
                                <figure
                                    key={photo.id}
                                    className="bg-surface-raised group relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-1 transition-all duration-300 hover:shadow-2"
                                >
                                    <img
                                        src={photo.src}
                                        alt={pick(photo.title, locale)}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[rgb(0_0_0/0.8)] via-[rgb(0_0_0/0.15)] to-transparent" />
                                    <figcaption className="text-text-inverse absolute right-[12px] bottom-[12px] left-[12px] text-[12px] leading-tight font-bold drop-shadow-sm sm:text-[14px]">
                                        {pick(photo.title, locale)}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    )}

                    {/* Dải kêu gọi đặt phòng */}
                    <div className="bg-[var(--surface-alt)] border-border-muted mt-[32px] flex flex-wrap items-center justify-between gap-[20px] rounded-[12px] border p-[20px] sm:p-[32px]">
                        <div>
                            <h2 className="text-text-primary font-display text-[16px] font-bold sm:text-[20px]">
                                {pick(H3.galleryCtaTitle, locale)}
                            </h2>
                            <p className="mt-[2px] text-[12px] font-normal text-[var(--text-muted)] sm:text-[14px]">
                                {pick(H3.galleryCtaSub, locale)}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-[8px]">
                            <a
                                href={themePath(slug, 'rooms')}
                                className={`${buttonBaseClass} bg-brand text-text-inverse shadow-1 hover:bg-[var(--brand-mid)] hover:shadow-2`}
                            >
                                {pick(H3.viewRooms, locale)}
                            </a>
                            <a
                                href={themePath(slug, 'contact')}
                                className={`${buttonBaseClass} bg-[var(--surface-hover)] text-brand hover:bg-[var(--border)]`}
                            >
                                {pick(UI.contactUs, locale)}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />
        </div>
    )
}

/**
 * Kích thước của `<Button size="sm" radius="6px">` bên app resort, viết lại
 * thành class: cao 36px, ngang 14px, chữ 12px đậm.
 *
 * VÌ SAO KHÔNG IMPORT COMPONENT ĐÓ: nó nằm trong `apps/`, theme không được phụ
 * thuộc vào app. Và ở đây là thẻ `<a>` chứ không phải `<button>` — theme không
 * phụ thuộc router nên điều hướng phải là liên kết thật.
 */
const buttonBaseClass =
    'inline-flex h-[36px] items-center justify-center rounded-[6px] px-[14px] text-[12px] font-semibold whitespace-nowrap no-underline transition-all duration-200 active:scale-[0.98]'
