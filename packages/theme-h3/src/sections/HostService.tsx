'use client'

import { pick, UI, type Amenity, type Locale, type Review } from '@repo/core'

import { iconFor } from '../icons'
import { H3 } from '../strings'
import { TestimonialColumns } from './TestimonialColumns'

/**
 * Section `host` — chủ nhà & tiện ích đi kèm, cạnh lời khách đã ở.
 *
 * VÌ SAO `host` CHỨ KHÔNG PHẢI `about`: mẫu này render CẢ `AboutSection` dùng
 * chung của `domain-hotel` (đeo `id="about"`) lẫn khối này. Hai thẻ cùng một
 * id thì `#about` neo vào cái đầu tiên và cái sau vĩnh viễn không tới được —
 * deep-link và CMS hỏng lặng lẽ, build vẫn xanh.
 *
 * `host` là `CustomSectionId` (xem `types.ts`): id riêng của một mẫu, cố ý
 * KHÔNG thêm vào `SECTION_IDS` vì bộ đó là hợp đồng mà MỌI mẫu phải hiểu
 * (luật R7). Một khối chỉ mẫu 03 có thì không thuộc hợp đồng chung.
 *
 * VÌ SAO CÓ REVIEW TRONG CÙNG KHỐI: social proof đặt cạnh lời hứa dịch vụ thì
 * lời hứa mới có sức nặng — tách ra hai section là mất hiệu ứng đó (luật P10).
 */

export interface HostServiceProps {
    locale: Locale
    /** Tiện ích đi kèm, hiện thành các viên badge. */
    perks: readonly Amenity[]
    /** Đánh giá của khách. Rỗng thì cột cuộn bị bỏ, khối tự về một cột. */
    reviews: readonly Review[]
}

export function HostService({ locale, perks, reviews }: HostServiceProps) {
    const hasReviews = reviews.length > 0

    return (
        <section
            id="host"
            className="bg-surface-raised border-border-muted border-b py-5 [scroll-margin-top:80px] sm:py-7"
        >
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <div
                    className={`bg-surface-base border-border-muted grid grid-cols-1 items-center gap-6 rounded-md border p-5 sm:p-8 ${
                        hasReviews ? 'lg:grid-cols-2' : ''
                    }`}
                >
                    {/* Cột trái — lời hứa dịch vụ */}
                    <div className="space-y-3">
                        <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                            {pick(UI.hostAmenities, locale)}
                        </span>
                        {/*
                          * CỠ CHỮ VIẾT THẲNG THEO PX, KHÔNG DÙNG BẬC TOKEN.
                          *
                          * Bản trước là `text-base sm:text-xl md:text-2xl` —
                          * trông như một thang tăng dần, nhưng thang chữ của
                          * mẫu này rất nhỏ (trích từ bảng Travlla base 14px):
                          * `--text-base` 14px · `--text-xl` 16px · `--text-2xl`
                          * 20px. Nghĩa là tiêu đề chính của section chỉ 14px
                          * trên mobile — nhỏ hơn thân bài của mẫu 02 và gần
                          * bằng chính câu dẫn ngay dưới nó (13px). Thứ bậc thị
                          * giác biến mất (luật P4).
                          *
                          * Các bậc `--text-*` của mẫu này phục vụ THÂN BÀI. Cỡ
                          * tiêu đề là quyết định riêng, khớp với
                          * `SECTION_HEADINGS` của cùng mẫu (19/22px).
                          */}
                        <h2 className="font-display text-text-primary text-[19px] leading-[1.25] font-bold sm:text-[22px] md:text-[26px]">
                            {pick(UI.youArePickedUpAtThe, locale)}
                        </h2>
                        <p className="text-text-secondary text-[13px] leading-relaxed font-normal sm:text-[14px]">
                            {pick(UI.privateRoundtripCarTransferFromCu, locale)}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {perks.map((perk) => {
                                const IconComp = iconFor(perk.icon)
                                return (
                                    <span
                                        key={perk.id}
                                        className="bg-surface-raised border-border-muted text-surface-strong inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-1"
                                    >
                                        <IconComp
                                            className="text-brand h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />
                                        <span>{pick(perk.label, locale)}</span>
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    {/* Cột phải — đánh giá của khách, ba cột cuộn lệch chiều */}
                    {hasReviews && (
                        <div>
                            <p className="text-text-tertiary mb-2.5 text-[10px] font-bold tracking-wider uppercase">
                                {pick(H3.pastGuestsSay, locale)}
                            </p>
                            <TestimonialColumns items={[...reviews]} locale={locale} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
