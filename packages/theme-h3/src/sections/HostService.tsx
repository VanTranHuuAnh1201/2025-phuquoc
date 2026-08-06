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
            {/*
              * KHUNG ĐỌC TỪ `--container`, PADDING ĐẶT Ở CON — đúng khuôn mà
              * các section dùng chung của `domain-hotel` đang theo.
              *
              * Bản trước là `max-w-[1280px] px-4 sm:px-6 lg:px-8`: padding nằm
              * trên CHÍNH phần tử mang `max-w`, nên 32px mỗi bên ăn VÀO trong
              * 1280px và nội dung chỉ còn 1216px. Section ngay trên
              * (`PlacesSection`) đặt padding ở con nên giữ đủ 1280px. Kết quả:
              * thẻ này thụt vào 32px mỗi bên, mép trái không thẳng hàng với
              * tiêu đề phía trên — thấy rõ ở màn rộng.
              *
              * Con số cũng phải đọc từ token: `1280px` viết cứng là một bản sao
              * của `--container`, sửa một chỗ thì hai chỗ lệch nhau (luật D0).
              */}
            <div className="mx-auto max-w-[var(--container)]">
                <div
                    className={`bg-surface-base border-border-muted mx-4 grid grid-cols-1 items-center gap-6 rounded-md border p-5 sm:mx-6 sm:p-8 ${
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
