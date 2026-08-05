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
import { SECTION_HEADING } from './headings'

const SLUG = meta.slug

/**
 * Hạng phòng nổi bật.
 *
 * Desktop — lưới 4 thẻ đều nhau.
 * Mobile  — băng cuộn ngang, thẻ rộng 78vw để lộ mép thẻ kế tiếp, báo cho
 *           người dùng biết còn cuộn được. Đây là điểm khác biệt lớn nhất
 *           giữa hai bản thiết kế, và làm hoàn toàn bằng utility Tailwind:
 *           cùng một cây JSX, chỉ đổi grid-auto-flow + scroll-snap theo
 *           breakpoint.
 *
 * Giá lấy qua `formatPrice` của core — theme KHÔNG tự định dạng hay tính lại,
 * nhờ vậy N giao diện luôn hiện cùng một con số (luật R8).
 *
 * Breakpoint 960px là của bản thiết kế, không trùng thang mặc định của
 * Tailwind (md 768 · lg 1024) nên viết bằng biến tuỳ ý `min-[960px]:`.
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
        <section
            id="rooms"
            className="bg-surface-raised pt-[34px] pb-[10px] [scroll-margin-top:80px] min-[960px]:pt-[48px] min-[960px]:pb-3"
        >
            <div className="mx-auto max-w-[var(--container)]">
                <ScrollRail
                    className={[
                        // MOBILE: băng cuộn ngang, lộ mép thẻ kế tiếp.
                        'grid grid-flow-col [grid-auto-columns:78vw] gap-[12px]',
                        'overflow-x-auto [scroll-snap-type:x_mandatory]',
                        'pt-1 px-4 pb-[18px]',
                        '[-webkit-overflow-scrolling:touch] [scrollbar-width:none]',
                        '[&::-webkit-scrollbar]:hidden',
                        // Máy tính bảng: thẻ hẹp lại, vẫn một hàng.
                        'sm:[grid-auto-columns:42vw]',
                        // DESKTOP: vẫn MỘT hàng, chỉ đổi bề rộng thẻ. Bốn thẻ vừa
                        // khít container; phòng thứ 5 trở đi thì cuộn tiếp —
                        // không bao giờ xuống hàng thứ hai.
                        'min-[960px]:[grid-auto-columns:calc((var(--container)-var(--space-6)*2-20px*3)/4)]',
                        'min-[960px]:gap-[20px] min-[960px]:px-6',
                    ].join(' ')}
                    labels={railLabels}
                    head={(nav) => (
                        <div className="mb-3 flex items-center gap-3 px-4 min-[960px]:mb-[20px] min-[960px]:px-6">
                            {/* Tiêu đề đẩy cụm nút + link về sát mép phải. Dùng
                                mr-auto thay cho justify-between vì header có BA
                                phần tử — justify-between sẽ dàn đều và ném cụm
                                nút ra giữa. */}
                            <h2 className={SECTION_HEADING}>
                                {sectionTitle}
                            </h2>
                            {/* Nút cuộn đứng TRƯỚC link: nó điều khiển tại chỗ,
                                còn "Xem tất cả" là điều hướng rời trang nên
                                nằm cuối, sát mép. */}
                            {nav}
                            <a
                                href={themePath(slug, 'rooms')}
                                className="inline-flex items-center gap-[6px] text-[13px] font-semibold whitespace-nowrap text-brand no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                            >
                                {t.viewAll}
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    )}
                >
                    {data.rooms.map((room) => (
                        <article
                            key={room.id}
                            className="flex flex-col overflow-hidden rounded-md border border-border-default bg-surface-raised [scroll-snap-align:start] transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-2"
                        >
                            <div className="relative">
                                <ImageSlot
                                    placeholder={pick(room.name, locale)}
                                    src={room.images?.[0]}
                                    height={190}
                                    style={{ borderRadius: 0 }}
                                />
                                {room.tags[0] && (
                                    <span className="absolute top-[10px] left-[10px] rounded-sm bg-brand px-[11px] py-[5px] text-[11.5px] font-bold text-text-inverse">
                                        {pick(room.tags[0], locale)}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col px-[15px] pt-3 pb-[15px]">
                                <h3 className="mt-0 mb-[9px] text-[15px] leading-[1.38] font-bold text-text-primary">
                                    {pick(room.name, locale)}
                                </h3>

                                <div className="mb-2 flex flex-wrap gap-3">
                                    <span className="inline-flex items-center gap-[5px] text-[12.5px] text-text-secondary">
                                        <IconGuests />
                                        {room.guests} {t.guestsWord}
                                    </span>
                                    <span className="inline-flex items-center gap-[5px] text-[12.5px] text-text-secondary">
                                        <IconArea />
                                        {room.area}
                                    </span>
                                </div>

                                <p className="mt-0 mb-3 flex-1 text-[12.5px] leading-[1.55] text-text-secondary">
                                    {pick(room.desc, locale)}
                                </p>

                                <div className="mb-3 flex items-baseline gap-[5px]">
                                    <span className="text-[12.5px] text-text-secondary">{fromLabel}</span>
                                    <span className="text-[17px] font-extrabold tracking-[-0.01em] text-text-primary tabular-nums">
                                        {formatPrice(room.price, locale)}
                                    </span>
                                    <span className="text-[12px] text-text-secondary">/ {t.perNight}</span>
                                </div>

                                <a
                                    href={roomPath(slug, room.id)}
                                    className={[
                                        'block rounded-sm px-3 py-[11px] text-center text-[13.5px] font-bold no-underline',
                                        // Navy trên vàng ≈ 9.2:1 — trắng trên vàng trượt AA.
                                        'bg-[var(--accent)] text-[var(--on-accent)]',
                                        'transition-[background,transform] duration-200 ease-out',
                                        'hover:bg-[var(--accent-dark)] active:translate-y-px',
                                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                                    ].join(' ')}
                                    aria-label={`${detailLabel} — ${pick(room.name, locale)}`}
                                >
                                    {detailLabel}
                                </a>
                            </div>
                        </article>
                    ))}
                </ScrollRail>
            </div>
        </section>
    )
}
