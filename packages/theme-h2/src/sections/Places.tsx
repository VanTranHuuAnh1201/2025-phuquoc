import { formatPrice, pick, themePath, tourPath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { SECTION_HEADING } from './headings'

const SLUG = meta.slug

/**
 * Khám phá Nam Du — điểm đến quanh đảo, kèm cột combo bên phải.
 *
 * Bản thiết kế desktop chia section này làm hai phần trong cùng một hàng:
 * ba thẻ điểm đến bên trái, hai thẻ combo dạng ngang xếp dọc bên phải. Mobile
 * bỏ cột combo khỏi hàng ngang và cho cả hai cùng cuộn — combo vẫn tới được
 * qua trang `/h7/tours`, nên không mất đường dẫn nào.
 */

export function Places({ data, locale, slug = 'h7' }: { data: PropertyData; locale: Locale; slug?: string }) {
    const sectionTitle = locale === 'vi' ? 'Khám phá Nam Du' : 'Explore Nam Du'
    const linkLabel = locale === 'vi' ? 'Xem tất cả' : 'View all'

    const places = data.places.slice(0, 3)
    const tours = data.tours.slice(0, 2)

    return (
        <section
            id="places"
            className="bg-surface-raised pt-[26px] pb-2 [scroll-margin-top:80px] min-[960px]:pt-[36px] min-[960px]:pb-3"
        >
            <div className="mx-auto max-w-[var(--container)]">
                <div className="mb-3 flex items-center gap-3 px-4 min-[960px]:mb-[20px] min-[960px]:px-6">
                    <h2 className={SECTION_HEADING}>
                        {sectionTitle}
                    </h2>
                    <a
                        href={themePath(slug, 'blog')}
                        className="inline-flex items-center gap-[6px] text-[13px] font-semibold whitespace-nowrap text-brand no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                        {linkLabel}
                        <span aria-hidden="true">→</span>
                    </a>
                </div>

                <div
                    className={[
                        'grid gap-[14px]',
                        // DESKTOP: điểm đến rộng ~2.15 phần, cột combo 1 phần.
                        'min-[960px]:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]',
                        'min-[960px]:items-start min-[960px]:gap-5 min-[960px]:px-6',
                    ].join(' ')}
                >
                    <div
                        className={[
                            // MOBILE: băng cuộn ngang, lộ mép thẻ kế tiếp.
                            'grid grid-flow-col [grid-auto-columns:68vw] gap-3',
                            'overflow-x-auto [scroll-snap-type:x_mandatory]',
                            'pt-1 px-4 pb-[6px]',
                            '[-webkit-overflow-scrolling:touch] [scrollbar-width:none]',
                            '[&::-webkit-scrollbar]:hidden',
                            // Từ 640px trở lên: ba thẻ dàn đều, hết cuộn.
                            'sm:grid-flow-row sm:grid-cols-3 sm:[grid-auto-columns:auto] sm:overflow-x-visible',
                            'min-[960px]:gap-[18px] min-[960px]:px-0 min-[960px]:pb-0',
                        ].join(' ')}
                    >
                        {places.map((place) => (
                            <article key={place.id} className="min-w-0 [scroll-snap-align:start]">
                                <div className="relative">
                                    <ImageSlot
                                        placeholder={pick(place.name, locale)}
                                        src={place.image}
                                        height={150}
                                        style={{ borderRadius: 'var(--radius)' }}
                                    />
                                    <span className="absolute bottom-[9px] left-[9px] rounded-sm bg-surface-raised/90 px-[10px] py-1 text-[11px] font-bold text-text-primary">
                                        {pick(place.tag, locale)}
                                    </span>
                                </div>
                                <h3 className="mt-[10px] mb-1 text-[14.5px] leading-[1.4] font-bold text-text-primary">
                                    {pick(place.name, locale)}
                                </h3>
                                <p className="m-0 text-[12.5px] leading-[1.6] text-text-secondary">
                                    {pick(place.desc, locale)}
                                </p>
                            </article>
                        ))}
                    </div>

                    {/* Cột combo — thẻ ngang, ảnh trái, tên + giá phải. */}
                    <div
                        className={[
                            'grid gap-[10px] px-4 pb-3',
                            // Máy tính bảng: hai combo nằm cạnh nhau cho đỡ trống.
                            //
                            // `max-[959px]:` là BẮT BUỘC: ở 1440px cả `sm:` lẫn
                            // `min-[960px]:` đều khớp, mà Tailwind xếp biến thể
                            // arbitrary TRƯỚC `sm:` nên `sm:grid-cols-2` thắng
                            // `min-[960px]:grid-cols-1` — cột combo bị chia đôi
                            // trên desktop thay vì xếp dọc một cột.
                            'sm:max-[959px]:grid-cols-2',
                            'min-[960px]:grid-cols-1 min-[960px]:gap-[14px] min-[960px]:px-0 min-[960px]:pt-1 min-[960px]:pb-1',
                        ].join(' ')}
                    >
                        {tours.map((tour) => (
                            <a
                                key={tour.id}
                                href={tourPath(slug, tour.id)}
                                className={[
                                    'grid grid-cols-[92px_1fr] items-center gap-[11px] p-2',
                                    'rounded-md border border-border-default bg-surface-raised no-underline',
                                    'transition-[border-color,box-shadow] duration-200 ease-out',
                                    'hover:border-brand hover:shadow-1',
                                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                                ].join(' ')}
                            >
                                <span className="relative block">
                                    <ImageSlot
                                        placeholder={pick(tour.name, locale)}
                                        height={78}
                                        style={{ borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <span className="absolute top-[6px] left-[6px] rounded-xs bg-surface-raised/90 px-[7px] py-[2px] text-[10px] font-bold text-text-primary">
                                        {tour.code}
                                    </span>
                                </span>
                                <span className="grid min-w-0 gap-[6px]">
                                    <span className="text-[13.5px] leading-[1.4] font-semibold text-text-primary">
                                        {pick(tour.name, locale)}
                                    </span>
                                    <span className="text-[15px] font-extrabold text-text-primary tabular-nums">
                                        {formatPrice(tour.price, locale)}
                                    </span>
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
