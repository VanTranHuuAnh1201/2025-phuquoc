'use client'

import { useMemo, useState } from 'react'
import {
    formatPrice,
    pick,
    telHref,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { pageUi } from './strings'
import { PageFooter, PageHeader, PageHero } from './PageShell'

/**
 * Trang danh sách hạng phòng — port từ `Rooms - Nam Du Hill.dc.html`.
 *
 * Bố cục bám sát prototype:
 *   hero 420px → thanh lọc 4 cột + nhãn đếm → lưới `1fr / 340px`
 *   trái: thẻ phòng ngang (ảnh 268px | nội dung)
 *   phải: sidebar dính — phòng đã chọn, tiện ích, lưu ý
 *
 * Chọn nhiều phòng là hành vi của prototype, không phải tôi thêm vào: sidebar
 * cộng dồn tiền phòng của mọi phòng đã chọn.
 *
 * STYLE: Tailwind v4 qua cầu nối token `@repo/styling-tailwind`. Các hằng
 * `*Class` ở cuối file là bộ class dùng lại nhiều chỗ — thay cho các object
 * `React.CSSProperties` trước đây. Biến ngoài hợp đồng D1 viết arbitrary trỏ
 * vào biến, không bao giờ ghi mã hex (luật D0).
 */

type SortKey = 'rec' | 'asc' | 'desc'

export function RoomsPage({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = pageUi[locale]

    const [sort, setSort] = useState<SortKey>('rec')
    const [minGuests, setMinGuests] = useState(0)
    const [picked, setPicked] = useState<string[]>([])
    const [addons, setAddons] = useState<Record<string, boolean>>({})

    const rooms = useMemo(() => {
        let list = data.rooms.slice()
        if (minGuests) list = list.filter((r) => r.guests >= minGuests)
        if (sort === 'asc') list.sort((a, b) => a.price - b.price)
        if (sort === 'desc') list.sort((a, b) => b.price - a.price)
        return list
    }, [data.rooms, minGuests, sort])

    const roomById = useMemo(
        () => Object.fromEntries(data.rooms.map((r) => [r.id, r])),
        [data.rooms],
    )

    // Tiền phòng cộng dồn mọi phòng đã chọn — đúng cách prototype tính.
    const roomsSubtotal = picked.reduce((sum, id) => sum + (roomById[id]?.price ?? 0), 0)

    /**
     * Số khách dùng để nhân giá tiện ích. Prototype lấy tổng sức chứa các phòng
     * đã chọn, mặc định 2 khi chưa chọn phòng nào.
     */
    const guestsCount =
        picked.reduce((sum, id) => sum + (roomById[id]?.guests ?? 0), 0) || 2

    const addonsSubtotal = data.addons.reduce((sum, a) => {
        if (!addons[a.id] || !a.price) return sum
        // Xe máy tính theo chiếc, các dịch vụ còn lại theo đầu khách.
        return sum + a.price * (a.id === 'addon-bike' ? 1 : guestsCount)
    }, 0)

    const toggleRoom = (id: string) =>
        setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    return (
        // `overflow-x-clip` chứ KHÔNG phải `hidden`: `hidden` trên một trục biến
        // trục kia thành scroll container, làm `position: sticky` của sidebar
        // dính vào div này thay vì vào viewport. Xem chú thích ở `globals.css`.
        <div
            data-theme="h7"
            className="overflow-x-clip font-primary text-text-primary"
        >
            <PageHeader data={data} locale={locale} />

            <PageHero
                title={t.roomsTitle}
                sub={t.roomsSub}
                crumbs={[{ label: t.home, href: '/h7' }, { label: t.roomsPage }]}
            />

            <section id="list" className="bg-surface-base px-4 pt-[32px] pb-[88px]">
                <div className="mx-auto max-w-[var(--container)]">
                    {/* ---- thanh lọc ---- */}
                    <div className="h7-rooms-filter mb-[26px] grid items-end gap-[14px] rounded-lg border border-border-default bg-surface-raised px-[20px] py-[18px] shadow-2">
                        <FilterDate id="rm-in" label={t.checkIn} />
                        <FilterDate id="rm-out" label={t.checkOut} />

                        <FilterField id="rm-guests" label={t.guests}>
                            <select
                                id="rm-guests"
                                value={minGuests}
                                onChange={(e) => setMinGuests(Number(e.target.value) || 0)}
                                className={controlClass}
                            >
                                <option value={0}>{t.anyGuests}</option>
                                {[2, 4, 6, 8].map((n) => (
                                    <option key={n} value={n}>
                                        {n}+
                                    </option>
                                ))}
                            </select>
                        </FilterField>

                        <FilterField id="rm-sort" label={t.sortLabel}>
                            <select
                                id="rm-sort"
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortKey)}
                                className={controlClass}
                            >
                                <option value="rec">{t.sortRec}</option>
                                <option value="asc">{t.sortAsc}</option>
                                <option value="desc">{t.sortDesc}</option>
                            </select>
                        </FilterField>

                        <span className="rounded-[var(--radius-pill)] bg-[var(--surface-tint)] px-[22px] py-[12px] text-center text-[13.5px] font-bold whitespace-nowrap text-brand">
                            {rooms.length} {t.countLabel}
                        </span>
                    </div>

                    {/* ---- list + sidebar ---- */}
                    <div className="h7-rooms-layout grid items-start gap-[26px]">
                        <div className="grid gap-[18px]">
                            {rooms.map((room) => {
                                const extra = data.roomExtras[room.id]
                                const isPicked = picked.includes(room.id)

                                return (
                                    <article
                                        key={room.id}
                                        className="h7-room-card grid gap-[22px] rounded-lg border border-border-default bg-surface-raised p-[14px]"
                                    >
                                        <div className="relative">
                                            <div className="relative h-full min-h-[210px] overflow-hidden rounded-md bg-surface-base">
                                                {room.images?.[0] && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={room.images[0]}
                                                        alt={pick(room.name, locale)}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="absolute top-[12px] left-[12px] rounded-[var(--radius-pill)] bg-[rgb(15_23_41/0.78)] px-[12px] py-[5px] text-[11.5px] font-bold text-text-inverse">
                                                {room.area}
                                            </span>
                                        </div>

                                        <div className="flex flex-col pt-[6px] pr-2 pb-2">
                                            <div className="mb-[10px] flex flex-wrap gap-[6px]">
                                                {room.tags.map((tag, i) => (
                                                    <span key={i} className={tagClass}>
                                                        {pick(tag, locale)}
                                                    </span>
                                                ))}
                                            </div>

                                            <h2 className="m-0 mb-2 font-display text-[19px] font-extrabold tracking-[-0.02em] text-text-primary">
                                                {pick(room.name, locale)}
                                            </h2>

                                            <p className="m-0 mb-[12px] text-[14px] leading-[1.65] text-text-secondary">
                                                {pick(room.desc, locale)}
                                            </p>

                                            <div className="mb-[14px] flex flex-wrap gap-3 text-[13px] text-text-secondary">
                                                <span>
                                                    {extra?.maxGuests
                                                        ? `${room.guests}–${extra.maxGuests}`
                                                        : room.guests}{' '}
                                                    {t.guestsWord}
                                                </span>
                                                <span>{extra ? pick(extra.bed, locale) : t.bedDefault}</span>
                                                <span>{extra ? pick(extra.view, locale) : t.viewDefault}</span>
                                            </div>

                                            <div className="mb-[16px] flex flex-wrap gap-2 border-b border-surface-base pb-[14px]">
                                                {(extra?.amenities.slice(0, 4).map((a) => pick(a, locale)) ??
                                                    t.perksDefault).map((perk, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-[7px] text-[12.5px] text-text-secondary"
                                                    >
                                                        <span aria-hidden="true" className={dotClass} />
                                                        {perk}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto flex flex-wrap items-end justify-between gap-[14px]">
                                                <div>
                                                    <div className="text-[22px] font-extrabold tracking-[-0.02em] text-text-primary">
                                                        {formatPrice(room.price, locale)}
                                                    </div>
                                                    <div className="text-[11.5px] text-text-secondary">
                                                        {t.perNight}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-[10px]">
                                                    <a
                                                        href={`/h7/rooms/${room.id}`}
                                                        className={ghostButtonClass}
                                                    >
                                                        {t.viewDetail}
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRoom(room.id)}
                                                        className={[
                                                            solidButtonClass,
                                                            // Đã chọn thì nút chuyển sang navy đậm để
                                                            // phân biệt với trạng thái mời chọn (vàng).
                                                            isPicked
                                                                ? 'bg-[var(--surface-inverse)]'
                                                                : 'bg-accent',
                                                        ].join(' ')}
                                                    >
                                                        {isPicked ? t.selected : t.select}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>

                        {/* ---- sidebar ---- */}
                        <aside className="h7-rooms-aside grid content-start gap-3">
                            <div className={cardClass}>
                                <div className={kickerClass}>{t.yourSelection}</div>

                                {picked.length > 0 ? (
                                    <div className="mb-[16px] grid gap-[10px]">
                                        {picked.map((id) => {
                                            const room = roomById[id]
                                            if (!room) return null
                                            return (
                                                <div
                                                    key={id}
                                                    className="flex items-start justify-between gap-[12px] border-b border-surface-base pb-[10px]"
                                                >
                                                    <div>
                                                        <div className="text-[13.5px] leading-[1.4] font-bold text-text-primary">
                                                            {pick(room.name, locale)}
                                                        </div>
                                                        <div className="text-[12px] text-text-secondary">
                                                            {room.area} · {room.guests} {t.guestsWord}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRoom(id)}
                                                        aria-label={`Bỏ ${pick(room.name, locale)}`}
                                                        className="cursor-pointer border-none bg-transparent px-1 py-[2px] text-[16px] leading-none text-[var(--border-strong)]"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="m-0 mb-[16px] text-[13.5px] leading-[1.65] text-text-secondary">
                                        {t.emptySelection}
                                    </p>
                                )}

                                <div className="grid gap-2 pt-1">
                                    <SumRow label={t.roomsTotal} value={formatPrice(roomsSubtotal, locale)} />
                                    <SumRow label={t.addonsTotal} value={formatPrice(addonsSubtotal, locale)} />
                                    <div className="mt-1 flex items-center justify-between border-t border-border-default pt-[12px]">
                                        <span className="text-[14px] font-bold text-text-primary">
                                            {t.total}
                                        </span>
                                        <span className="text-[22px] font-extrabold tracking-[-0.02em] text-brand">
                                            {formatPrice(roomsSubtotal + addonsSubtotal, locale)}
                                        </span>
                                    </div>
                                    <div className="text-[11.5px] text-text-secondary">
                                        {t.totalNote}
                                    </div>
                                </div>

                                <a
                                    href={telHref(data.brand.phone)}
                                    className="mt-[18px] block rounded-[var(--radius-pill)] bg-accent p-[14px] text-center text-[14.5px] font-bold text-text-inverse no-underline"
                                >
                                    {t.confirmBooking}
                                </a>
                            </div>

                            <div className={cardClass}>
                                <div className={kickerClass}>{t.addonsTitle}</div>
                                <p className="m-0 mb-[16px] text-[12.5px] leading-[1.6] text-text-secondary">
                                    {t.addonsSub}
                                </p>
                                <div className="grid gap-[10px]">
                                    {data.addons.map((addon) => (
                                        <label
                                            key={addon.id}
                                            className="flex cursor-pointer items-start gap-[11px] rounded-md bg-surface-base px-[12px] py-[11px]"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={Boolean(addons[addon.id])}
                                                onChange={() =>
                                                    setAddons((prev) => ({
                                                        ...prev,
                                                        [addon.id]: !prev[addon.id],
                                                    }))
                                                }
                                                className="mt-[3px] h-[16px] w-[16px] shrink-0 accent-[var(--accent)]"
                                            />
                                            <span className="grid flex-1 gap-[2px]">
                                                <span className="text-[13.5px] font-semibold text-text-primary">
                                                    {pick(addon.name, locale)}
                                                </span>
                                                <span className="text-[12px] text-text-secondary">
                                                    {addon.price
                                                        ? `${formatPrice(addon.price, locale)} / ${pick(addon.unit, locale)}`
                                                        : pick(addon.unit, locale)}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-lg border border-[var(--brand-light)] bg-[var(--surface-tint)] px-[22px] py-[20px]">
                                <div className="mb-[10px] text-[12.5px] font-bold text-brand">
                                    {t.notesTitle}
                                </div>
                                <div className="grid gap-2">
                                    {data.notes.map((note, i) => (
                                        <div key={i} className="flex items-start gap-[10px]">
                                            <span aria-hidden="true" className={`${dotClass} mt-[7px]`} />
                                            <span className="text-[12.5px] leading-[1.6] text-[var(--brand-dark)]">
                                                {pick(note, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <PageFooter data={data} locale={locale} />

            {/* GIỮ `<style>`: ba breakpoint 900/720px không nằm trong thang mặc
                định của Tailwind, và `grid-template-columns` ở đây là các track
                không đều (`minmax(150px, 268px)`…). Hover đổ bóng cũng giữ ở đây
                cho gọn — một khai báo thay vì hai class arbitrary. */}
            <style>{`
                @media (min-width: 900px) {
                    .h7-rooms-filter {
                        grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
                    }
                    .h7-rooms-layout {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
                    }
                    .h7-rooms-aside {
                        position: sticky;
                        top: 100px;
                    }
                }
                @media (min-width: 720px) {
                    .h7-room-card {
                        grid-template-columns: minmax(150px, 268px) minmax(0, 1fr);
                    }
                }
                .h7-room-card { transition: box-shadow 200ms ease; }
                .h7-room-card:hover { box-shadow: var(--shadow); }
            `}</style>
        </div>
    )
}

// ================================================================= mảnh nhỏ

function FilterField({
    id,
    label,
    children,
}: {
    id: string
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="grid min-w-0 gap-[6px]">
            <label htmlFor={id} className="text-[12px] font-semibold text-text-secondary">
                {label}
            </label>
            {children}
        </div>
    )
}

function FilterDate({ id, label }: { id: string; label: string }) {
    return (
        <FilterField id={id} label={label}>
            <input id={id} type="date" className={controlClass} />
        </FilterField>
    )
}

function SumRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-[13.5px] text-text-secondary">
            <span>{label}</span>
            <span className="font-bold text-text-primary">{value}</span>
        </div>
    )
}

// ==================================================================== style

const controlClass =
    'w-full rounded-[8px] border border-border-default bg-surface-base px-[12px] py-[10px] font-primary text-[14px] font-medium text-text-primary'

const tagClass =
    'rounded-[var(--radius-pill)] bg-[var(--surface-tint)] px-[10px] py-1 text-[11.5px] font-semibold text-brand'

const dotClass = 'h-[5px] w-[5px] shrink-0 rounded-[var(--radius-pill)] bg-accent'

const cardClass =
    'rounded-lg border border-border-default bg-surface-raised px-4 py-[22px]'

const kickerClass =
    'mb-[14px] text-[12px] font-bold tracking-[0.08em] uppercase text-brand'

const ghostButtonClass =
    'rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-[20px] py-[11px] text-[13.5px] font-semibold whitespace-nowrap text-text-primary no-underline'

const solidButtonClass =
    'cursor-pointer rounded-[var(--radius-pill)] border-none px-[22px] py-[11px] font-primary text-[13.5px] font-bold whitespace-nowrap text-text-inverse'
