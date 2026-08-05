import { pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { DEFAULT_SECTION_HEADINGS, type SectionHeadingClasses } from './headings'

/**
 * Ẩm thực — bốn điểm ăn uống trong resort.
 *
 * Desktop: lưới 4 cột, mỗi thẻ ảnh trên · tên · giờ mở cửa · mô tả.
 * Mobile : băng cuộn ngang cùng cơ chế với Rooms — cùng một quy tắc thị giác
 *          (grid-flow-col + snap + ẩn thanh cuộn), khai tại chỗ bằng utility
 *          nên không phụ thuộc thứ tự render của section nào khác.
 *
 * Section này sống ở `domain-hotel` cho nhiều mẫu của domain lưu trú dùng
 * chung; bản sắc tiêu đề đi vào qua `headingClass` (luật R1).
 */

export interface DiningSectionProps {
    data: PropertyData
    locale: Locale
    /** Mẫu đang render — dựng đường dẫn `/{slug}/dining`. BẮT BUỘC (xem Rooms). */
    slug: string
    /** Class tiêu đề của mẫu. Không truyền thì dùng bộ trung tính. */
    headingClass?: SectionHeadingClasses
}

export function DiningSection({
    data,
    locale,
    slug,
    headingClass = DEFAULT_SECTION_HEADINGS,
}: DiningSectionProps) {
    const sectionTitle = locale === 'vi' ? 'Ẩm thực' : 'Dining'
    const linkLabel = locale === 'vi' ? 'Xem tất cả' : 'View all'

    return (
        <section
            id="dining"
            className="bg-surface-raised pt-[26px] pb-2 [scroll-margin-top:80px] min-[960px]:pt-[36px] min-[960px]:pb-3"
        >
            <div className="mx-auto max-w-[var(--container)]">
                <div className="mb-3 flex items-center gap-3 px-4 min-[960px]:mb-[20px] min-[960px]:px-6">
                    <h2 className={headingClass.section}>
                        {sectionTitle}
                    </h2>
                    <a
                        href={themePath(slug, 'dining')}
                        className="inline-flex items-center gap-[6px] text-[13px] font-semibold whitespace-nowrap text-brand no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                        {linkLabel}
                        <span aria-hidden="true">→</span>
                    </a>
                </div>

                <div
                    className={[
                        // MOBILE: băng cuộn ngang, lộ mép thẻ kế tiếp.
                        'grid grid-flow-col [grid-auto-columns:68vw] gap-[12px]',
                        'overflow-x-auto [scroll-snap-type:x_mandatory]',
                        'pt-1 px-4 pb-[18px]',
                        '[-webkit-overflow-scrolling:touch] [scrollbar-width:none]',
                        '[&::-webkit-scrollbar]:hidden',
                        // Máy tính bảng: 2 cột, hết cuộn.
                        //
                        // `max-[959px]:` trên `grid-cols-2` là BẮT BUỘC: ở
                        // 1440px cả `sm:` (≥640px) lẫn `min-[960px]:` đều khớp,
                        // mà Tailwind xếp biến thể arbitrary TRƯỚC `sm:` trong
                        // output nên `sm:grid-cols-2` thắng `min-[960px]:grid-cols-4`
                        // → desktop hiện 2 cột thay vì 4.
                        //
                        // Ba class còn lại không cần chặn: chúng chỉ tắt chế độ
                        // cuộn ngang của mobile, và desktop cũng muốn thế.
                        'sm:grid-flow-row sm:[grid-auto-columns:auto] sm:overflow-x-visible',
                        'sm:max-[959px]:grid-cols-2',
                        // DESKTOP: 4 cột dàn đều.
                        'min-[960px]:grid-cols-4 min-[960px]:gap-[20px]',
                        'min-[960px]:px-6 min-[960px]:pb-2',
                    ].join(' ')}
                >
                    {data.dining.map((venue) => (
                        <article
                            key={venue.id}
                            className="min-w-0 [scroll-snap-align:start]"
                        >
                            <ImageSlot
                                src={venue.image}
                                placeholder={pick(venue.name, locale)}
                                height={160}
                                style={{ borderRadius: 'var(--radius)' }}
                            />
                            <h3 className="mt-[11px] mb-1 text-[14.5px] leading-[1.4] font-bold text-text-primary">
                                {pick(venue.name, locale)}
                            </h3>
                            <p className="mt-0 mb-[5px] text-[12.5px] font-semibold text-brand">
                                {pick(venue.note, locale)}
                            </p>
                            <p className="m-0 text-[12.5px] leading-[1.6] text-text-secondary">
                                {pick(venue.desc, locale)}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
