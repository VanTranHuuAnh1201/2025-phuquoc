'use client'

import { pick, UI, type Amenity, type Locale, type Review } from '@repo/core'

import { iconFor } from '../icons'
import { H3 } from '../strings'
import { TestimonialColumns } from './TestimonialColumns'

/**
 * Section `about` — chủ nhà & tiện ích đi kèm, cạnh lời khách đã ở.
 *
 * VÌ SAO MAP VÀO `about` CHỨ KHÔNG PHẢI MỘT ID MỚI: bản gốc ở app đeo
 * `id="experience"`, không nằm trong bộ id của luật R7 — điều hướng và CMS
 * không neo vào nó được. Nội dung ở đây trả lời đúng câu "ở đây là nơi thế
 * nào, ai đón mình" nên `about` là chỗ của nó.
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
            id="about"
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
