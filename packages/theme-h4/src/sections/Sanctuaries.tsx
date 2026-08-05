import { formatPrice, pick, UI, type Locale, type Room } from '@repo/core'

import { H4 } from '../strings'
import {
    Container,
    Frame,
    FrameCaption,
    Section,
    SectionHeading,
    ghostButtonClass,
    quietLinkClass,
} from './primitives'

/**
 * Section `rooms` — ba hạng phòng tiêu biểu, lưới so le.
 *
 * BỐ CỤC SO LE, KHÔNG PHẢI LƯỚI ĐỀU:
 * Ba thẻ bằng nhau xếp ngang là ngôn ngữ của trang danh sách, không phải của
 * trang chủ resort. Ở đây thẻ đầu cao hơn (4:5) và lệch xuống, hai thẻ sau
 * theo nhịp riêng — mắt đi theo đường zigzag thay vì quét ngang một hàng. Đây
 * là "nhịp" mà P5 đòi và là thứ khiến trang không thành "wall of cards".
 *
 * GIÁ HIỆN NGAY TRÊN THẺ: P15 §4 — khách phải ra quyết định được mà không
 * phải bấm vào từng phòng để biết giá.
 *
 * DỮ LIỆU VÀO QUA PROP (luật R13): section không gọi `getRooms()`, không tính
 * giá. Nó nhận `rooms` đã chọn sẵn và chỉ hiển thị.
 */

export interface SanctuariesProps {
    locale: Locale
    /** Hạng phòng đem trưng bày. Rỗng thì section tự ẩn. */
    rooms: readonly Room[]
    /** Ảnh thay thế theo id phòng — app cấp, vì file nằm trong `public/`. */
    imageFor?: (room: Room) => string | undefined
    /** Đường dẫn tới chi tiết một hạng phòng. */
    roomHref: (room: Room) => string
    /** Đường dẫn tới trang danh sách đầy đủ. */
    allRoomsHref: string
}

export function Sanctuaries({
    locale,
    rooms,
    imageFor,
    roomHref,
    allRoomsHref,
}: SanctuariesProps) {
    const list = rooms.slice(0, 3)
    if (list.length === 0) return null

    return (
        <Section id="rooms" tone="sand">
            <Container>
                <SectionHeading
                    eyebrow={pick(H4.roomsEyebrow, locale)}
                    title={pick(H4.roomsTitle, locale)}
                    lede={pick(H4.roomsLede, locale)}
                />

                <div className="mt-[var(--space-6)] grid gap-[var(--space-5)] md:grid-cols-2 lg:gap-[var(--space-6)]">
                    {list.map((room, index) => {
                        const image = imageFor?.(room) ?? room.images?.[0]
                        const name = pick(room.name, locale)

                        /* Thẻ đầu chiếm trọn cột trái và cao hơn — nó là điểm
                           nhìn của section. Hai thẻ sau nhỏ hơn, xếp cột phải.
                           `lg:mt-*` tạo độ lệch so le. */
                        const featured = index === 0

                        return (
                            <article
                                key={room.id}
                                className={`h4-reveal flex flex-col gap-5 ${
                                    featured ? 'md:row-span-2' : index === 1 ? 'lg:mt-[var(--space-6)]' : ''
                                }`}
                            >
                                {image && (
                                    <a
                                        href={roomHref(room)}
                                        className="group block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
                                        tabIndex={-1}
                                        aria-hidden="true"
                                    >
                                        <Frame
                                            src={image}
                                            alt=""
                                            ratio={featured ? '4/5' : '16/9'}
                                            className="transition-transform duration-[var(--motion-normal)]"
                                        >
                                            {/* Nhãn sức chứa + diện tích đặt trên
                                                scrim — không bao giờ chữ trần
                                                trên ảnh (P15). */}
                                            <FrameCaption>
                                                <p className="m-0 text-xs tracking-[0.14em] uppercase">
                                                    {room.area} · {room.guests} {pick(UI.guests, locale)}
                                                </p>
                                            </FrameCaption>
                                        </Frame>
                                    </a>
                                )}

                                <div className="flex flex-col gap-3">
                                    <h3 className="m-0 font-display text-xl leading-[1.2] font-normal text-text-primary md:text-2xl">
                                        <a
                                            href={roomHref(room)}
                                            className="text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
                                        >
                                            {name}
                                        </a>
                                    </h3>

                                    <p className="m-0 max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary">
                                        {pick(room.desc, locale)}
                                    </p>

                                    <p className="m-0 flex items-baseline gap-2">
                                        <span className="text-xs tracking-[0.14em] text-text-tertiary uppercase">
                                            {pick(UI.from, locale)}
                                        </span>
                                        {/* `tabular-nums` để cột số thẳng hàng
                                            giữa các thẻ (F6/P12). */}
                                        <span className="text-lg font-medium text-text-primary tabular-nums">
                                            {formatPrice(room.price, locale)}
                                        </span>
                                        <span className="text-sm text-text-secondary">
                                            / {pick(UI.night, locale)}
                                        </span>
                                    </p>

                                    <div className="mt-1">
                                        <a href={roomHref(room)} className={quietLinkClass}>
                                            {pick(H4.exploreRoom, locale)}
                                        </a>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>

                {/* CTA phụ của section — ghost, không phải màu accent. Toàn
                    trang chỉ MỘT màu CTA chính (P2/P10). */}
                <div className="mt-[var(--space-6)]">
                    <a href={allRoomsHref} className={ghostButtonClass}>
                        {pick(H4.allRooms, locale)}
                    </a>
                </div>
            </Container>
        </Section>
    )
}
