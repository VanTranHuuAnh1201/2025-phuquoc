'use client'

import {
    formatPrice,
    pick,
    roomPath,
    telHref,
    themePath,
    UI,
    type Locale,
    type PropertyData,
    type Room,
} from '@repo/core'

import * as art from '../images'
import { meta } from '../meta'
import { H4 } from '../strings'
import {
    Container,
    Frame,
    Rule,
    SectionTitle,
    ghostButtonClass,
    primaryButtonClass,
    quietLinkClass,
} from '../sections/primitives'
import { PageOpening, PageShell } from './PageShell'

/**
 * Trang chi tiết một hạng phòng — mẫu 04.
 *
 * BỐ CỤC: ảnh lớn mở đầu → hai cột (nội dung trái | thẻ đặt phòng DÍNH phải).
 *
 * VÌ SAO THẺ ĐẶT PHÒNG DÍNH: đây là trang dài nhất của luồng, và P10 đòi lối
 * vào booking LUÔN nhìn thấy. Trên desktop thẻ `sticky` chạy theo; trên mobile
 * nó thành một dải cố định ở đáy màn hình (bottom sheet) — khác biệt CÓ CHỦ
 * ĐÍCH giữa hai kích thước, không phải `flex-direction: column` (P9).
 *
 * KHÔNG CÓ "CHỈ CÒN 3 PHÒNG": `room.remaining` là dữ liệu tuỳ chọn, bản demo
 * chưa nối tồn kho thật. Hiện con số bịa là dark pattern (P10). Chỉ khi
 * `remaining` thật sự có mới hiện — và lúc đó nó là số từ `Inventory`.
 *
 * Trang này KHÔNG tính giá (luật R8/R13): `room.price` và `extraBedFee` do
 * `core` cấp, ở đây chỉ định dạng và hiển thị.
 */

export interface RoomDetailPageProps {
    data: PropertyData
    locale: Locale
    roomSlug?: string
    extra?: React.ReactNode
}

export function RoomDetailPage({ data, locale, roomSlug, extra }: RoomDetailPageProps) {
    const room = data.rooms.find((r) => r.id === roomSlug)
    const roomsHref = themePath(meta.slug, 'rooms')

    // Không tìm thấy: nói rõ chuyện gì xảy ra và đưa lối đi tiếp (D6), không
    // để trang trắng.
    if (!room) {
        return (
            <PageShell data={data} locale={locale} extra={extra}>
                <PageOpening
                    crumbs={[
                        { label: pick(UI.home, locale), href: `/${meta.slug}` },
                        { label: pick(H4.roomsPageTitle, locale), href: roomsHref },
                        { label: pick(H4.roomNotFound, locale) },
                    ]}
                    title={pick(H4.roomNotFound, locale)}
                    lede={pick(H4.roomNotFoundBody, locale)}
                />
                <section className="bg-surface-base py-[var(--space-6)]">
                    <Container>
                        <a href={roomsHref} className={primaryButtonClass}>
                            {pick(H4.allRooms, locale)}
                        </a>
                    </Container>
                </section>
            </PageShell>
        )
    }

    const detail = data.roomExtras[room.id]
    const image = art.roomImage(room.id)
    const others = data.rooms.filter((r) => r.id !== room.id).slice(0, 3)
    const bookHref = themePath(meta.slug, 'checkout')

    return (
        <PageShell data={data} locale={locale} extra={extra}>
            <PageOpening
                crumbs={[
                    { label: pick(UI.home, locale), href: `/${meta.slug}` },
                    { label: pick(H4.roomsPageTitle, locale), href: roomsHref },
                    { label: pick(room.name, locale) },
                ]}
                title={pick(room.name, locale)}
                lede={pick(room.desc, locale)}
            />

            {/* ------------------------------------------------- ảnh mở đầu */}
            <section className="bg-surface-base pt-[var(--space-5)]">
                <Container>
                    <Frame
                        src={image}
                        alt={pick(room.name, locale)}
                        ratio="16/9"
                        priority
                    />
                </Container>
            </section>

            {/* --------------------------------------------- thân hai cột */}
            <section className="bg-surface-base py-[var(--space-6)] md:py-[var(--space-7)]">
                <Container>
                    <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[var(--space-6)]">
                        {/* -------------------------------------- cột nội dung */}
                        <div className="flex flex-col gap-[var(--space-5)]">
                            <div className="flex flex-col gap-5">
                                <SectionTitle as="h2">{pick(H4.theSpace, locale)}</SectionTitle>
                                {detail?.long && (
                                    <p className="m-0 max-w-[var(--measure)] text-lg leading-[var(--line-height-base)] text-text-secondary">
                                        {pick(detail.long, locale)}
                                    </p>
                                )}
                                {detail?.long2 && (
                                    <p className="m-0 max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary">
                                        {pick(detail.long2, locale)}
                                    </p>
                                )}
                            </div>

                            {/* Thông số — dạng dl, đọc được bằng screen reader. */}
                            <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-solid border-[var(--border)] py-6 md:grid-cols-4">
                                <Spec label={pick(H4.area, locale)} value={room.area} />
                                <Spec
                                    label={pick(UI.guests2, locale)}
                                    value={`${detail?.maxGuests ?? room.guests} ${pick(UI.guests, locale)}`}
                                />
                                {detail?.bed && (
                                    <Spec label={pick(H4.bed, locale)} value={pick(detail.bed, locale)} />
                                )}
                                {detail?.view && (
                                    <Spec label={pick(UI.view, locale)} value={pick(detail.view, locale)} />
                                )}
                            </dl>

                            {/* Tiện nghi */}
                            {detail?.amenities && detail.amenities.length > 0 && (
                                <div className="flex flex-col gap-5">
                                    <SectionTitle as="h2">
                                        {pick(UI.amenities, locale)}
                                    </SectionTitle>
                                    <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                                        {detail.amenities.map((item) => (
                                            <li
                                                key={item.vi}
                                                className="flex items-start gap-3 text-base leading-[var(--line-height-base)] text-text-secondary"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    aria-hidden="true"
                                                    className="mt-[6px] shrink-0 text-brand"
                                                >
                                                    <path
                                                        d="m5 12.5 4.5 4.5L19 7.5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                {pick(item, locale)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Điều kiện — thứ khách hay bỏ qua rồi tranh cãi
                                sau. Hiện thẳng, không giấu trong accordion. */}
                            {detail?.conditions && detail.conditions.length > 0 && (
                                <div className="flex flex-col gap-5 bg-[var(--surface-sand)] p-[var(--space-4)]">
                                    <h2 className="m-0 font-display text-xl font-normal text-text-primary">
                                        {pick(H4.goodToKnow, locale)}
                                    </h2>
                                    <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                        {detail.conditions.map((item) => (
                                            <li
                                                key={item.vi}
                                                className="max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary"
                                            >
                                                {pick(item, locale)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* ------------------------------------- thẻ đặt phòng */}
                        <aside className="lg:sticky lg:top-[calc(var(--space-6)+var(--space-4))] lg:self-start">
                            <div className="flex flex-col gap-5 border border-solid border-[var(--border)] bg-surface-raised p-[var(--space-4)]">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs tracking-[0.14em] text-text-tertiary uppercase">
                                        {pick(UI.from, locale)}
                                    </span>
                                    <span className="flex items-baseline gap-2">
                                        <span className="text-2xl font-medium text-text-primary tabular-nums">
                                            {formatPrice(room.price, locale)}
                                        </span>
                                        <span className="text-sm text-text-secondary">
                                            / {pick(UI.night, locale)}
                                        </span>
                                    </span>
                                    <span className="text-sm text-text-secondary">
                                        {pick(H4.includedNote, locale)}
                                    </span>
                                </div>

                                <Rule />

                                {/* Phụ thu giường phụ — dữ liệu thật từ `core`,
                                    hiện ngay để không có bất ngờ ở bước cuối. */}
                                {room.extraBedFee ? (
                                    <p className="m-0 flex items-baseline justify-between gap-4 text-sm">
                                        <span className="text-text-secondary">
                                            {pick(UI.extraBed, locale)}
                                        </span>
                                        <span className="font-medium text-text-primary tabular-nums">
                                            {formatPrice(room.extraBedFee, locale)}
                                        </span>
                                    </p>
                                ) : null}

                                {/* Khan hiếm CHỈ hiện khi có số thật (P10). */}
                                {typeof room.remaining === 'number' && room.remaining > 0 && (
                                    <p className="m-0 flex items-center gap-2 bg-[var(--color-warning-bg)] px-3 py-2 text-sm text-[var(--color-warning)]">
                                        <span
                                            aria-hidden="true"
                                            className="h-[6px] w-[6px] rounded-full bg-[var(--color-warning)]"
                                        />
                                        {pick(H4.onlyRoomsLeft, locale).replace(
                                            '{n}',
                                            String(room.remaining),
                                        )}
                                    </p>
                                )}

                                <a href={bookHref} className={`${primaryButtonClass} w-full`}>
                                    {pick(H4.reserveThisRoom, locale)}
                                </a>

                                <a
                                    href={telHref(data.brand.phone)}
                                    className={`${ghostButtonClass} w-full`}
                                >
                                    {data.brand.phone}
                                </a>

                                <p className="m-0 text-center text-sm leading-[var(--line-height-base)] text-text-secondary">
                                    {pick(H4.trustWeather, locale)}
                                </p>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>

            {/* ---------------------------------------------- hạng phòng khác */}
            {others.length > 0 && (
                <section className="bg-[var(--surface-sand)] py-[var(--space-6)] md:py-[var(--space-7)]">
                    <Container>
                        <SectionTitle as="h2">{pick(H4.otherRooms, locale)}</SectionTitle>
                        <ul className="mt-[var(--space-5)] m-0 grid list-none gap-[var(--space-5)] p-0 md:grid-cols-3">
                            {others.map((other) => (
                                <OtherRoomCard key={other.id} room={other} locale={locale} />
                            ))}
                        </ul>
                    </Container>
                </section>
            )}
        </PageShell>
    )
}

function Spec({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs tracking-[0.14em] text-text-tertiary uppercase">{label}</dt>
            <dd className="m-0 text-base text-text-primary">{value}</dd>
        </div>
    )
}

function OtherRoomCard({ room, locale }: { room: Room; locale: Locale }) {
    const href = roomPath(meta.slug, room.id)

    return (
        <li className="flex flex-col gap-4">
            <a href={href} tabIndex={-1} aria-hidden="true" className="block no-underline">
                <Frame src={art.roomImage(room.id)} alt="" ratio="16/9" />
            </a>
            <h3 className="m-0 font-display text-lg leading-[1.25] font-normal text-text-primary">
                <a
                    href={href}
                    className="text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
                >
                    {pick(room.name, locale)}
                </a>
            </h3>
            <p className="m-0 flex items-baseline gap-2 text-sm">
                <span className="text-text-tertiary">{pick(UI.from, locale)}</span>
                <span className="font-medium text-text-primary tabular-nums">
                    {formatPrice(room.price, locale)}
                </span>
            </p>
            <a href={href} className={quietLinkClass}>
                {pick(UI.viewDetails, locale)}
            </a>
        </li>
    )
}
