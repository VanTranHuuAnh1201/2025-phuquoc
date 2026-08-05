import { pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'

const SLUG = meta.slug

/**
 * Đánh giá của khách + dải kêu gọi đặt phòng.
 *
 * Bản thiết kế đặt hai khối này cạnh nhau trong cùng một hàng: điểm trung
 * bình và một trích dẫn bên trái, thẻ CTA nền tối bên phải. Mobile xếp dọc,
 * CTA xuống dưới cùng và tràn hết bề ngang.
 */

function Stars({ label }: { label: string }) {
    return (
        <span className="inline-flex gap-[2px]" role="img" aria-label={label}>
            {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z"
                        fill="var(--accent)"
                    />
                </svg>
            ))}
        </span>
    )
}

export function Booking({ data, locale }: { data: PropertyData; locale: Locale }) {
    const reviews = data.reviews && data.reviews.length > 0 ? data.reviews : []
    const firstReview = reviews[0]

    const reviewsTitle = locale === 'vi' ? 'Khách hàng nói gì về chúng tôi' : 'What our guests say'
    const reviewsCount =
        locale === 'vi' ? `${reviews.length || 9}+ đánh giá` : `${reviews.length || 9}+ reviews`
    const ratingLabel = locale === 'vi' ? '5 trên 5 sao' : '5 out of 5 stars'

    const ctaTitle =
        locale === 'vi'
            ? 'Đặt trực tiếp — đưa đón bến tàu miễn phí, giá không qua trung gian'
            : 'Book direct — free pier transfer, no middleman markup'
    const ctaBtn = locale === 'vi' ? 'Chọn ngày & xem phòng' : 'Choose dates & view rooms'
    const ctaNote =
        locale === 'vi'
            ? 'Tàu hoãn do thời tiết: dời ngày miễn phí'
            : 'Weather delays: free date change'

    return (
        <section
            id="booking"
            className="bg-surface-raised px-4 pt-[26px] pb-[34px] [scroll-margin-top:80px] min-[960px]:px-6 min-[960px]:pt-9 min-[960px]:pb-11"
        >
            <div className="mx-auto grid max-w-[var(--container)] items-stretch gap-4 min-[960px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[960px]:gap-[22px]">
                {/* --- Đánh giá --- */}
                <div className="rounded-md border border-border-default bg-surface-raised px-4 py-[18px] min-[960px]:px-6 min-[960px]:py-[22px]">
                    <h2 className="mt-0 mb-4 text-[14px] font-bold tracking-[0.06em] text-text-primary uppercase">
                        {reviewsTitle}
                    </h2>

                    <div className="grid gap-4 min-[960px]:grid-cols-[auto_minmax(0,1fr)] min-[960px]:items-start min-[960px]:gap-[26px]">
                        <div className="grid justify-items-start gap-[6px]">
                            <div className="font-display text-[40px] leading-none font-bold text-text-primary">
                                5.0
                                <span className="text-[15px] font-medium text-text-secondary">
                                    /5
                                </span>
                            </div>
                            <Stars label={ratingLabel} />
                            <div className="text-[12.5px] text-text-secondary">{reviewsCount}</div>
                        </div>

                        {firstReview && (
                            <figure className="m-0 grid gap-3">
                                <blockquote className="m-0 text-[13.5px] leading-[1.7] text-text-primary">
                                    “{typeof firstReview.comment === 'string' ? firstReview.comment : pick(firstReview.comment, locale)}”
                                </blockquote>
                                <figcaption className="flex items-center gap-[9px] text-[12.5px] text-text-primary">
                                    <span
                                        className="h-[30px] w-[30px] shrink-0 rounded-full bg-[var(--surface-tint)]"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        <strong>{firstReview.name}</strong>
                                    </span>
                                </figcaption>
                            </figure>
                        )}
                    </div>
                </div>

                {/* --- CTA ---
                    Nền: lớp phủ tối chồng lên navy đậm, để chữ trắng vẫn đủ
                    tương phản dù về sau có thay bằng ảnh. */}
                <div className="grid content-center justify-items-center gap-[14px] rounded-md bg-[linear-gradient(180deg,var(--overlay-scrim),var(--overlay-scrim)),var(--brand-dark)] px-5 py-[26px] text-center min-[960px]:px-7 min-[960px]:py-8">
                    <h3 className="m-0 max-w-[30ch] font-display text-[clamp(1.1rem,3.6vw,1.35rem)] leading-[1.34] font-semibold text-text-inverse text-balance">
                        {ctaTitle}
                    </h3>
                    <a
                        href={themePath(SLUG, 'rooms')}
                        className={[
                            'rounded-sm bg-accent px-7 py-[13px]',
                            'text-[14.5px] font-bold no-underline',
                            // Navy trên vàng ≈ 9.2:1 — trắng trên vàng trượt AA.
                            'text-[var(--on-accent)]',
                            'transition-[background-color,transform] duration-200 ease-out',
                            'motion-reduce:transition-none',
                            'hover:bg-[var(--accent-dark)]',
                            'active:translate-y-px',
                            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverse',
                        ].join(' ')}
                    >
                        {ctaBtn}
                    </a>
                    <p className="m-0 text-xs text-text-inverse opacity-85">* {ctaNote}</p>
                </div>
            </div>
        </section>
    )
}
