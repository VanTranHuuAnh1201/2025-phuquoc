import { themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'

const SLUG = meta.slug

/**
 * Đánh giá của khách + dải kêu gọi đặt phòng.
 *
 * Bản thiết kế đặt hai khối này cạnh nhau trong cùng một hàng: điểm trung
 * bình và một trích dẫn bên trái, thẻ CTA nền ảnh tối bên phải. Mobile xếp
 * dọc, CTA xuống dưới cùng và tràn hết bề ngang.
 *
 * Điểm số và trích dẫn hiện lấy từ hằng dưới đây vì `core` chưa có type
 * `Review`. Khi thêm vào `core`, thay nguồn ở đây và bỏ hằng — không đổi bố cục.
 */

const RATING = { score: '4.8', outOf: '5', count: 326 }

const QUOTE = {
    vi: {
        text: 'View biển tuyệt đẹp, phòng sạch sẽ, nhân viên thân thiện. Đến cầu cảng là có xe resort đón, rất tiện!',
        author: 'Minh Anh',
        from: 'Hà Nội',
    },
    en: {
        text: 'Stunning sea view, spotless rooms, friendly staff. The resort car meets you right at the pier — very convenient!',
        author: 'Minh Anh',
        from: 'Hanoi',
    },
} as const

function Stars({ label }: { label: string }) {
    return (
        <span className="h7-stars" role="img" aria-label={label}>
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

export function Booking({ locale }: { data: PropertyData; locale: Locale }) {
    const quote = QUOTE[locale]

    const reviewsTitle = locale === 'vi' ? 'Khách hàng nói gì về chúng tôi' : 'What our guests say'
    const reviewsCount =
        locale === 'vi' ? `${RATING.count} đánh giá` : `${RATING.count} reviews`
    const ratingLabel =
        locale === 'vi'
            ? `${RATING.score} trên ${RATING.outOf} sao`
            : `${RATING.score} out of ${RATING.outOf} stars`

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
        <section id="booking" className="h7-booking">
            <div className="h7-booking-grid">
                {/* --- Đánh giá --- */}
                <div className="h7-reviews">
                    <h2 className="h7-reviews-title">{reviewsTitle}</h2>

                    <div className="h7-reviews-body">
                        <div className="h7-rating">
                            <div className="h7-rating-score">
                                {RATING.score}
                                <span className="h7-rating-outof">/{RATING.outOf}</span>
                            </div>
                            <Stars label={ratingLabel} />
                            <div className="h7-rating-count">{reviewsCount}</div>
                        </div>

                        <figure className="h7-quote">
                            <blockquote className="h7-quote-text">“{quote.text}”</blockquote>
                            <figcaption className="h7-quote-author">
                                <span className="h7-quote-avatar" aria-hidden="true" />
                                <span>
                                    <strong>{quote.author}</strong>
                                    <span className="h7-quote-from"> – {quote.from}</span>
                                </span>
                            </figcaption>
                        </figure>
                    </div>
                </div>

                {/* --- CTA --- */}
                <div className="h7-cta-card">
                    <h3 className="h7-cta-title">{ctaTitle}</h3>
                    <a href={themePath(SLUG, 'rooms')} className="h7-cta-btn">
                        {ctaBtn}
                    </a>
                    <p className="h7-cta-note">* {ctaNote}</p>
                </div>
            </div>

            <style>{`
                .h7-booking {
                    background: var(--surface);
                    padding: 26px var(--space-4) 34px;
                    scroll-margin-top: 80px;
                }
                .h7-booking-grid {
                    max-width: var(--container);
                    margin: 0 auto;
                    display: grid;
                    gap: 16px;
                    align-items: stretch;
                }

                .h7-reviews {
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 18px 16px;
                    background: var(--surface);
                }
                .h7-reviews-title {
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: var(--text);
                    margin: 0 0 16px;
                }
                .h7-reviews-body { display: grid; gap: 16px; }

                .h7-rating { display: grid; gap: 6px; justify-items: start; }
                .h7-rating-score {
                    font-family: var(--font-display);
                    font-size: 40px;
                    font-weight: 700;
                    line-height: 1;
                    color: var(--text);
                }
                .h7-rating-outof {
                    font-size: 15px;
                    font-weight: 500;
                    color: var(--text-muted);
                }
                .h7-stars { display: inline-flex; gap: 2px; }
                .h7-rating-count { font-size: 12.5px; color: var(--text-muted); }

                .h7-quote { margin: 0; display: grid; gap: 12px; }
                .h7-quote-text {
                    margin: 0;
                    font-size: 13.5px;
                    line-height: 1.7;
                    color: var(--text);
                }
                .h7-quote-author {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    font-size: 12.5px;
                    color: var(--text);
                }
                .h7-quote-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 999px;
                    background: var(--surface-tint);
                    flex-shrink: 0;
                }
                .h7-quote-from { color: var(--text-muted); }

                .h7-cta-card {
                    border-radius: var(--radius);
                    background:
                        linear-gradient(180deg, rgba(9,29,51,0.86), rgba(9,29,51,0.92)),
                        var(--brand-dark);
                    padding: 26px 20px;
                    display: grid;
                    gap: 14px;
                    justify-items: center;
                    align-content: center;
                    text-align: center;
                }
                .h7-cta-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.1rem, 3.6vw, 1.35rem);
                    line-height: 1.34;
                    font-weight: 600;
                    color: #fff;
                    margin: 0;
                    text-wrap: balance;
                    max-width: 30ch;
                }
                .h7-cta-btn {
                    padding: 13px 28px;
                    border-radius: var(--radius-sm);
                    background: var(--accent);
                    /* Navy trên vàng ≈ 9.2:1 — trắng trên vàng trượt AA. */
                    color: var(--on-accent);
                    font-size: 14.5px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: background 180ms ease, transform 150ms ease;
                }
                .h7-cta-btn:hover  { background: var(--accent-dark); }
                .h7-cta-btn:active { transform: translateY(1px); }
                .h7-cta-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
                .h7-cta-note {
                    margin: 0;
                    font-size: 12px;
                    color: rgba(255,255,255,0.85);
                }

                @media (min-width: 960px) {
                    .h7-booking { padding: 36px var(--space-6) 44px; }
                    .h7-booking-grid {
                        grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
                        gap: 22px;
                    }
                    .h7-reviews { padding: 22px 24px; }
                    .h7-reviews-body {
                        grid-template-columns: auto minmax(0, 1fr);
                        gap: 26px;
                        align-items: start;
                    }
                    .h7-cta-card { padding: 32px 28px; }
                }
            `}</style>
        </section>
    )
}
