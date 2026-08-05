'use client'

import { useMemo, useState } from 'react'
import {
    formatPrice,
    pick,
    roomPath,
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
    ghostButtonClass,
    primaryButtonClass,
    quietLinkClass,
} from '../sections/primitives'
import { PageOpening, PageShell } from './PageShell'

/**
 * Trang danh sách hạng phòng — mẫu 04.
 *
 * BỐ CỤC: hàng ngang, một phòng một dòng (ảnh 4:5 bên trái | nội dung bên
 * phải), so le trái–phải theo chỉ số chẵn lẻ.
 *
 * VÌ SAO KHÔNG PHẢI LƯỚI 3 CỘT: lưới thẻ nhỏ ép ảnh xuống ~380px, mà ảnh
 * phòng ở đây chụp bằng điện thoại — thu nhỏ thì chi tiết nát, phóng to thì
 * lộ nguồn. Hàng ngang cho ảnh khổ vừa phải và trả lại chỗ cho THÔNG SỐ, thứ
 * khách thật sự cần để quyết định (P15 §4: đủ dữ kiện, không bắt đoán).
 *
 * Mỗi dòng hiện đủ: giá/đêm · diện tích · sức chứa · giường · hướng nhìn ·
 * một dòng chính sách. Đó là bộ tối thiểu để chọn phòng mà không phải bấm vào.
 *
 * LỌC/SẮP XẾP là state của trang, không phải nghiệp vụ — không có công thức
 * giá nào ở đây (luật R8/R13). Giá lấy thẳng `room.price` do `core` cấp.
 */

type SortKey = 'rec' | 'asc' | 'desc'

/**
 * Số hạng phòng hiện mỗi lần.
 *
 * VÌ SAO PHẢI CÓ: seed có 20 hạng phòng. Mỗi dòng cao ~830px, nên đổ hết một
 * lượt là trang dài hơn 16.000px trên desktop và gần 29.000px trên mobile —
 * không ai cuộn hết, và nó phá luôn nhịp mà P5 dựng lên. Sáu dòng là vừa đủ
 * để thấy có lựa chọn mà chưa mỏi.
 */
const PAGE_SIZE = 6

/** Ô chọn trong thanh lọc — viền mảnh, không nền, đúng ngôn ngữ theme. */
function FilterSelect({
    label,
    value,
    onChange,
    children,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    children: React.ReactNode
}) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.16em] text-text-tertiary uppercase">
                {label}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[44px] cursor-pointer rounded-[var(--radius)] border border-solid border-[var(--border)] bg-surface-raised px-4 text-base text-text-primary transition-colors duration-[var(--motion-instant)] hover:border-[var(--brand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
            >
                {children}
            </select>
        </label>
    )
}

export function RoomsPage({
    data,
    locale,
    extra,
}: {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}) {
    const [sort, setSort] = useState<SortKey>('rec')
    const [minGuests, setMinGuests] = useState('0')
    const [shown, setShown] = useState(PAGE_SIZE)

    const rooms = useMemo(() => {
        let list = data.rooms.slice()
        const min = Number(minGuests)
        if (min > 0) list = list.filter((room) => room.guests >= min)
        if (sort === 'asc') list.sort((a, b) => a.price - b.price)
        if (sort === 'desc') list.sort((a, b) => b.price - a.price)
        return list
    }, [data.rooms, minGuests, sort])

    const visible = rooms.slice(0, shown)

    /** Đổi bộ lọc thì quay về trang đầu — giữ nguyên số cũ là gây bối rối. */
    const changeSort = (value: SortKey) => {
        setSort(value)
        setShown(PAGE_SIZE)
    }
    const changeGuests = (value: string) => {
        setMinGuests(value)
        setShown(PAGE_SIZE)
    }

    const reset = () => {
        setSort('rec')
        setMinGuests('0')
        setShown(PAGE_SIZE)
    }

    return (
        <PageShell data={data} locale={locale} extra={extra}>
            <PageOpening
                crumbs={[
                    { label: pick(UI.home, locale), href: `/${meta.slug}` },
                    { label: pick(H4.roomsPageTitle, locale) },
                ]}
                title={pick(H4.roomsPageTitle, locale)}
                lede={pick(H4.roomsPageLede, locale)}
            />

            {/* -------------------------------------------------- thanh lọc */}
            <section className="border-b border-solid border-[var(--border)] bg-surface-base py-5">
                <Container>
                    {/* `items-end` + gap vừa phải. Bản trước dùng `py-6` kèm
                        `gap-6` và đẩy bộ đếm ra mép phải bằng `ml-auto`, tạo
                        một khoảng chết rất rộng giữa ô lọc và con số. Giờ bộ
                        đếm đứng ngay cạnh bộ lọc — nó là PHẢN HỒI của bộ lọc,
                        đặt xa nhau thì mất liên hệ nhân quả. */}
                    <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                        <FilterSelect
                            label={pick(H4.sortLabel, locale)}
                            value={sort}
                            onChange={(v) => changeSort(v as SortKey)}
                        >
                            <option value="rec">{pick(H4.sortRecommended, locale)}</option>
                            <option value="asc">{pick(H4.sortPriceAsc, locale)}</option>
                            <option value="desc">{pick(H4.sortPriceDesc, locale)}</option>
                        </FilterSelect>

                        <FilterSelect
                            label={pick(H4.guestsFilter, locale)}
                            value={minGuests}
                            onChange={changeGuests}
                        >
                            <option value="0">{pick(H4.anyGuests, locale)}</option>
                            <option value="2">2+</option>
                            <option value="4">4+</option>
                            <option value="6">6+</option>
                        </FilterSelect>

                        {/* Đếm kết quả — thành phần bắt buộc của mọi danh sách
                            theo F6, và là thứ khách nhìn để biết bộ lọc có ăn. */}
                        <p
                            aria-live="polite"
                            className="m-0 pb-3 text-sm text-text-secondary tabular-nums"
                        >
                            {rooms.length} {pick(H4.roomCount, locale)}
                        </p>
                    </div>
                </Container>
            </section>

            {/* ---------------------------------------------- danh sách phòng */}
            <section className="bg-surface-base py-[var(--space-6)] md:py-[var(--space-7)]">
                <Container>
                    {rooms.length === 0 ? (
                        /* Trạng thái rỗng nói rõ phải làm gì tiếp (F6/D6) —
                           không phải "Không có kết quả". */
                        <div className="flex flex-col items-start gap-5 border border-solid border-[var(--border)] bg-surface-raised p-[var(--space-5)]">
                            <h2 className="m-0 font-display text-xl font-normal text-text-primary">
                                {pick(H4.emptyTitle, locale)}
                            </h2>
                            <p className="m-0 max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary">
                                {pick(H4.emptyBody, locale)}
                            </p>
                            <button type="button" onClick={reset} className={ghostButtonClass}>
                                {pick(H4.resetFilters, locale)}
                            </button>
                        </div>
                    ) : (
                        <>
                            <ul className="m-0 flex list-none flex-col gap-[var(--space-6)] p-0 lg:gap-[var(--space-7)]">
                                {visible.map((room, index) => (
                                    <RoomRow
                                        key={room.id}
                                        room={room}
                                        extra={data.roomExtras[room.id]}
                                        locale={locale}
                                        /* So le: dòng lẻ đảo ảnh sang phải. Đây là
                                           nhịp của P5, không phải trang trí. */
                                        flipped={index % 2 === 1}
                                    />
                                ))}
                            </ul>

                            {/* Phân trang "xem thêm" — F6 đòi câu "Hiển thị
                                x–y trong z", và nó cho biết còn bao nhiêu nữa
                                thay vì để người dùng cuộn mù. */}
                            <div className="mt-[var(--space-6)] flex flex-col items-center gap-4 border-t border-solid border-[var(--border)] pt-[var(--space-5)]">
                                <p
                                    aria-live="polite"
                                    className="m-0 text-sm text-text-secondary tabular-nums"
                                >
                                    {pick(H4.showingRange, locale)
                                        .replace('{a}', '1')
                                        .replace('{b}', String(visible.length))
                                        .replace('{n}', String(rooms.length))}
                                </p>
                                {visible.length < rooms.length && (
                                    <button
                                        type="button"
                                        onClick={() => setShown((n) => n + PAGE_SIZE)}
                                        className={ghostButtonClass}
                                    >
                                        {pick(H4.showMore, locale)}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </Container>
            </section>
        </PageShell>
    )
}

/** Một dòng hạng phòng. Tách riêng để `RoomsPage` chỉ còn lo lọc và nhịp. */
function RoomRow({
    room,
    extra,
    locale,
    flipped,
}: {
    room: Room
    extra?: PropertyData['roomExtras'][string]
    locale: Locale
    flipped: boolean
}) {
    const href = roomPath(meta.slug, room.id)
    const image = art.roomImage(room.id)

    return (
        <li className="h4-reveal grid items-center gap-[var(--space-5)] lg:grid-cols-2 lg:gap-[var(--space-6)]">
            <div className={flipped ? 'lg:order-2' : ''}>
                {/* Link ảnh là BẢN SAO của link tiêu đề ngay bên cạnh, nên nó
                    bị ẩn khỏi cây trợ năng (`aria-hidden` + `tabIndex={-1}`) —
                    người dùng bàn phím không phải Tab hai lần cho cùng một
                    đích. Ảnh trong đó vì vậy để `alt=""` là ĐÚNG: nội dung đã
                    được tiêu đề mang. */}
                <a
                    href={href}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block no-underline"
                >
                    <Frame src={image} alt="" ratio="4/5" className="lg:aspect-[4/3]" />
                </a>
            </div>

            <div className={`flex flex-col gap-5 ${flipped ? 'lg:order-1' : ''}`}>
                <h2 className="m-0 font-display text-xl leading-[1.18] font-normal text-balance text-text-primary md:text-2xl">
                    <a
                        href={href}
                        className="text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
                    >
                        {pick(room.name, locale)}
                    </a>
                </h2>

                <p className="m-0 max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary">
                    {pick(room.desc, locale)}
                </p>

                {/* Thông số quyết định — hiện thẳng, không giấu sau nút. */}
                <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-solid border-[var(--border)] py-5">
                    <Spec label={pick(H4.area, locale)} value={room.area} />
                    <Spec
                        label={pick(UI.guests2, locale)}
                        value={`${room.guests} ${pick(UI.guests, locale)}`}
                    />
                    {extra?.bed && <Spec label={pick(H4.bed, locale)} value={pick(extra.bed, locale)} />}
                    {extra?.view && (
                        <Spec label={pick(UI.view, locale)} value={pick(extra.view, locale)} />
                    )}
                </dl>

                <div className="flex flex-wrap items-end justify-between gap-5">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs tracking-[0.14em] text-text-tertiary uppercase">
                            {pick(UI.from, locale)}
                        </span>
                        <span className="flex items-baseline gap-2">
                            <span className="text-xl font-medium text-text-primary tabular-nums">
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

                    <div className="flex flex-wrap items-center gap-5">
                        <a href={href} className={quietLinkClass}>
                            {pick(UI.viewDetails, locale)}
                        </a>
                        <a href={href} className={primaryButtonClass}>
                            {pick(UI.bookNow2, locale)}
                        </a>
                    </div>
                </div>
            </div>
        </li>
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
