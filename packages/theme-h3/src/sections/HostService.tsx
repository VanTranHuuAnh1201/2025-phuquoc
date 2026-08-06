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
            className="bg-surface-raised border-border-muted border-b pt-[26px] pb-[26px] [scroll-margin-top:80px] min-[960px]:pt-[36px] min-[960px]:pb-[36px]"
        >
            {/*
              * ⚠️ SỐ TRONG CLASS SPACING KHÔNG PHẢI PIXEL.
              *
              * Thang của dự án phi tuyến: p-4=24 · p-5=40 · p-6=64 · p-7=96 ·
              * p-8=140px. `sm:p-8` từng ở đây cho ra padding 140px MỖI BÊN —
              * thẻ phình ra, nội dung dồn vào giữa và hai bên trống hoác.
              *
              * Cần một giá trị cụ thể thì viết trong ngoặc (`p-[28px]`); chỉ
              * dùng số trần khi thật sự muốn bậc đó của thang.
              */}
            <div className="mx-auto max-w-[var(--container)] px-4 min-[960px]:px-6">
                <div
                    className={`bg-surface-base border-border-muted grid grid-cols-1 items-center gap-5 rounded-md border p-4 sm:p-[28px] ${
                        hasReviews ? 'lg:grid-cols-2' : ''
                    }`}
                >
                    {/* Cột trái — lời hứa dịch vụ */}
                    <div className="space-y-3">
                        <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                            {pick(UI.hostAmenities, locale)}
                        </span>
                        <h2 className="font-display text-text-primary text-base leading-snug font-bold sm:text-xl md:text-2xl">
                            {pick(UI.youArePickedUpAtThe, locale)}
                        </h2>
                        <p className="text-text-secondary text-xs leading-relaxed font-normal sm:text-sm">
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
