'use client'

import {
    formatPrice,
    pick,
    roomPath,
    themePath,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'
import { ScrollRail } from './ScrollRail'

const SLUG = meta.slug

/**
 * Hạng phòng nổi bật.
 *
 * Desktop — lưới 4 thẻ đều nhau.
 * Mobile  — băng cuộn ngang, thẻ rộng 78vw để lộ mép thẻ kế tiếp, báo cho
 *           người dùng biết còn cuộn được. Đây là điểm khác biệt lớn nhất
 *           giữa hai bản thiết kế, và làm hoàn toàn bằng CSS: cùng một cây
 *           JSX, chỉ đổi grid-auto-flow + scroll-snap.
 *
 * Giá lấy qua `formatPrice` của core — theme KHÔNG tự định dạng hay tính lại,
 * nhờ vậy N giao diện luôn hiện cùng một con số (luật R8).
 */

function IconGuests() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M5.5 19.5c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

function IconArea() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
            <path d="M9 4v3M4 9h3M15 20v-3M20 15h-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

export function Rooms({ data, locale, slug = 'h7' }: { data: PropertyData; locale: Locale; slug?: string }) {
    const t = ui[locale]
    const sectionTitle = locale === 'vi' ? 'Hạng phòng nổi bật' : 'Featured rooms'
    const detailLabel = locale === 'vi' ? 'Xem chi tiết' : 'View details'
    const fromLabel = locale === 'vi' ? 'từ' : 'from'

    const railLabels =
        locale === 'vi'
            ? {
                  prev: 'Xem các hạng phòng trước đó',
                  next: 'Xem các hạng phòng tiếp theo',
                  group: 'Danh sách hạng phòng nổi bật',
              }
            : {
                  prev: 'Previous room types',
                  next: 'Next room types',
                  group: 'Featured room types',
              }

    return (
        <section id="rooms" className="h7-rooms">
            <div className="h7-rooms-inner">
                <ScrollRail
                    className="h7-rooms-rail"
                    labels={railLabels}
                    head={(nav) => (
                        <div className="h7-sec-head">
                            <h2 className="h7-sec-title">{sectionTitle}</h2>
                            {/* Nút cuộn đứng TRƯỚC link: nó điều khiển tại chỗ,
                                còn "Xem tất cả" là điều hướng rời trang nên
                                nằm cuối, sát mép. */}
                            {nav}
                            <a href={themePath(slug, 'rooms')} className="h7-sec-link">
                                {t.viewAll}
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    )}
                >
                    {data.rooms.map((room) => (
                        <article key={room.id} className="h7-room">
                            <div className="h7-room-media">
                                <ImageSlot
                                    placeholder={pick(room.name, locale)}
                                    src={room.images?.[0]}
                                    height={190}
                                    style={{ borderRadius: 0 }}
                                />
                                {room.tags[0] && (
                                    <span className="h7-room-tag">{pick(room.tags[0], locale)}</span>
                                )}
                            </div>

                            <div className="h7-room-body">
                                <h3 className="h7-room-name">{pick(room.name, locale)}</h3>

                                <div className="h7-room-specs">
                                    <span className="h7-room-spec">
                                        <IconGuests />
                                        {room.guests} {t.guestsWord}
                                    </span>
                                    <span className="h7-room-spec">
                                        <IconArea />
                                        {room.area}
                                    </span>
                                </div>

                                <p className="h7-room-desc">{pick(room.desc, locale)}</p>

                                <div className="h7-room-price">
                                    <span className="h7-room-from">{fromLabel}</span>
                                    <span className="h7-room-amount">{formatPrice(room.price, locale)}</span>
                                    <span className="h7-room-per">/ {t.perNight}</span>
                                </div>

                                <a
                                    href={roomPath(slug, room.id)}
                                    className="h7-room-cta"
                                    aria-label={`${detailLabel} — ${pick(room.name, locale)}`}
                                >
                                    {detailLabel}
                                </a>
                            </div>
                        </article>
                    ))}
                </ScrollRail>
            </div>

            <style>{`
                .h7-rooms {
                    background: var(--surface);
                    padding: 34px 0 10px;
                    scroll-margin-top: 80px;
                }
                .h7-rooms-inner { max-width: var(--container); margin: 0 auto; }

                .h7-sec-head {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 0 var(--space-4);
                    margin-bottom: 16px;
                }
                /* Tiêu đề đẩy cụm nút + link về sát mép phải. Dùng margin-left
                   auto thay cho space-between vì header có BA phần tử —
                   space-between sẽ dàn đều và ném cụm nút ra giữa. */
                .h7-sec-title {
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    color: var(--text);
                    margin: 0 auto 0 0;
                }
                .h7-sec-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--brand);
                    text-decoration: none;
                    white-space: nowrap;
                }
                .h7-sec-link:hover { text-decoration: underline; }
                .h7-sec-link:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

                /* ---- MOBILE: băng cuộn ngang, lộ mép thẻ kế tiếp ---- */
                .h7-rooms-rail {
                    display: grid;
                    grid-auto-flow: column;
                    grid-auto-columns: 78vw;
                    gap: 12px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding: 4px var(--space-4) 18px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .h7-rooms-rail::-webkit-scrollbar { display: none; }

                .h7-room {
                    scroll-snap-align: start;
                    display: flex;
                    flex-direction: column;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    transition: box-shadow 200ms ease, transform 200ms ease;
                }
                .h7-room:hover { box-shadow: var(--shadow); transform: translateY(-3px); }

                .h7-room-media { position: relative; }
                .h7-room-tag {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    padding: 5px 11px;
                    border-radius: var(--radius-sm);
                    background: var(--brand);
                    color: #fff;
                    font-size: 11.5px;
                    font-weight: 700;
                }

                .h7-room-body {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 14px 15px 15px;
                }
                .h7-room-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text);
                    line-height: 1.38;
                    margin: 0 0 9px;
                }
                .h7-room-specs {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                    margin-bottom: 8px;
                }
                .h7-room-spec {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12.5px;
                    color: var(--text-muted);
                }
                .h7-room-desc {
                    font-size: 12.5px;
                    line-height: 1.55;
                    color: var(--text-muted);
                    margin: 0 0 12px;
                    flex: 1;
                }
                .h7-room-price {
                    display: flex;
                    align-items: baseline;
                    gap: 5px;
                    margin-bottom: 12px;
                }
                .h7-room-from { font-size: 12.5px; color: var(--text-muted); }
                .h7-room-amount {
                    font-size: 17px;
                    font-weight: 800;
                    color: var(--text);
                    letter-spacing: -0.01em;
                    font-variant-numeric: tabular-nums;
                }
                .h7-room-per { font-size: 12px; color: var(--text-muted); }

                .h7-room-cta {
                    display: block;
                    padding: 11px 16px;
                    border-radius: var(--radius-sm);
                    background: var(--accent);
                    /* Navy trên vàng ≈ 9.2:1 — trắng trên vàng trượt AA. */
                    color: var(--on-accent);
                    font-size: 13.5px;
                    font-weight: 700;
                    text-align: center;
                    text-decoration: none;
                    transition: background 180ms ease, transform 150ms ease;
                }
                .h7-room-cta:hover  { background: var(--accent-dark); }
                .h7-room-cta:active { transform: translateY(1px); }
                .h7-room-cta:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

                /* ---- Máy tính bảng: thẻ hẹp lại, vẫn một hàng ---- */
                @media (min-width: 640px) {
                    .h7-rooms-rail { grid-auto-columns: 42vw; }
                }

                /* ---- DESKTOP: vẫn MỘT hàng, chỉ đổi bề rộng thẻ ---- */
                @media (min-width: 960px) {
                    .h7-rooms { padding: 48px 0 16px; }
                    .h7-sec-head { padding: 0 var(--space-6); margin-bottom: 20px; }
                    .h7-sec-title { font-size: 16px; }
                    .h7-rooms-rail {
                        /* Bốn thẻ vừa khít container; phòng thứ 5 trở đi thì
                           cuộn tiếp — không bao giờ xuống hàng thứ hai. */
                        grid-auto-columns: calc((var(--container) - var(--space-6) * 2 - 20px * 3) / 4);
                        gap: 20px;
                        padding: 4px var(--space-6) 18px;
                    }
                }
            `}</style>
        </section>
    )
}
