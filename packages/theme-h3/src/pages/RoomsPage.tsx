'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Check, Eye, Maximize2, SlidersHorizontal, Users } from 'lucide-react'
import {
    UI,
    formatPrice,
    pick,
    roomPath,
    themeRoot,
    type Locale,
    type PropertyData,
    type Room,
} from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Trang danh sách hạng phòng của mẫu 03 — bản riêng, theo đúng thiết kế của
 * app resort.
 *
 * VÌ SAO KHÔNG DÙNG BẢN Ở `domain-hotel`: bản dùng chung có bố cục khác hẳn
 * (một cột, không sidebar lọc). Bản resort là hai cột — sidebar lọc 260px bên
 * trái, danh sách thẻ ngang bên phải — cùng một luồng mobile tách riêng. Đây là
 * Design DNA của mẫu 03, không phải biến thể màu của bản chung (luật P1).
 *
 * BA THỨ ĐÃ CẮT KHI ĐƯA LÊN PACKAGE:
 *
 *   1. `useLanguage()` → `locale` qua prop. Hai app có hai cơ chế i18n khác
 *      nhau mà theme phải chạy được ở cả hai (luật R4).
 *   2. `useRouter()`/`useSearchParams()` → điều hướng bằng `<a>`, tham số tìm
 *      kiếm nhận qua prop. Theme không phụ thuộc router của framework.
 *   3. `ROOMS` từ `data/rooms.ts` của app → `data.rooms` của `core`. Bản ở app
 *      chỉ là một lớp đổi tên trường; giữ nó là giữ hai nguồn sự thật (R8).
 *
 * HEX ĐỔI SANG TOKEN, HÌNH ẢNH KHÔNG ĐỔI: mọi mã màu của bản resort đã có
 * token khớp đúng từng giá trị trong `tokens.css` của mẫu này (#1D4E89 =
 * `--brand`, #0F2D52 = `--surface-inverse`…). Đổi sang token là hết vi phạm D0
 * mà pixel vẫn y nguyên.
 *
 * ⚠️ SPACING VIẾT NGOẶC VUÔNG: thang `--space-N` của dự án phi tuyến
 * (4·8·16·24·40·64·96·140px), nên `px-6` là 64px chứ không phải 24px. Con số
 * lấy từ bản resort phải viết `px-[24px]` mới ra đúng kích thước cũ.
 */

/** Nhóm lọc — khoá khớp `Room.group` của core, riêng `sea` lọc theo thẻ. */
const FILTERS = ['all', 'couple', 'family', 'suite', 'sea'] as const
type FilterKey = (typeof FILTERS)[number]

const SORTS = ['rec', 'asc', 'desc', 'area'] as const
type SortKey = (typeof SORTS)[number]

const filterLabel = (k: FilterKey, locale: Locale) =>
    pick(
        {
            all: H3.filterAll,
            couple: H3.filterCouple,
            family: H3.filterFamily,
            suite: H3.filterSuite,
            sea: H3.filterSeaView,
        }[k],
        locale,
    )

const sortLabel = (k: SortKey, locale: Locale) =>
    pick(
        {
            rec: H3.sortRecommended,
            asc: UI.priceLowToHigh,
            desc: UI.priceHighToLow,
            area: UI.largestArea,
        }[k],
        locale,
    )

/** "48 m²" → 48. Core giữ diện tích dạng chuỗi hiển thị, lọc cần số. */
function areaNumber(area: string): number {
    const n = parseFloat(area.replace(/[^\d.]/g, ''))
    return Number.isFinite(n) ? n : 0
}

/** Hạng phòng có hướng biển — core không có cờ riêng nên đọc từ thẻ. */
function isSeaView(room: Room): boolean {
    return room.tags.some((tag) => /biển|sea/i.test(tag.vi) || /biển|sea/i.test(tag.en))
}

export interface RoomsPageProps {
    data: PropertyData
    locale: Locale
    /**
     * Chèn thêm vào header — app hub cắm `<AccountBar />` vào đây.
     *
     * KHÔNG KHAI THÌ NÓ BỊ NUỐT LẶNG LẼ: route `[theme]/rooms` luôn truyền
     * `extra`, mà prop không khai trong type thì React bỏ qua — chuông thông
     * báo và menu tài khoản biến mất khỏi trang này mà build vẫn xanh.
     */
    extra?: ReactNode
}

/**
 * `slug` đọc từ `meta` chứ không nhận qua prop: theme luôn biết mình là mẫu
 * nào, và route dùng chung không truyền slug xuống (nó chỉ đưa
 * `data`/`locale`/`extra`). Khai `slug` bắt buộc ở đây là trang vỡ ngay khi
 * cắm vào registry. Bản của mẫu 02 cũng làm đúng vậy.
 */
export function RoomsPage({ data, locale, extra }: RoomsPageProps) {
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
    const [activeSort, setActiveSort] = useState<SortKey>('rec')
    const [filterOpen, setFilterOpen] = useState(false)

    const rooms = data.rooms ?? []

    const visibleRooms = useMemo(() => {
        const list = rooms.filter((room) => {
            if (activeFilter === 'all') return true
            if (activeFilter === 'sea') return isSeaView(room)
            return room.group === activeFilter
        })

        const sorted = [...list]
        if (activeSort === 'asc') sorted.sort((a, b) => a.price - b.price)
        else if (activeSort === 'desc') sorted.sort((a, b) => b.price - a.price)
        else if (activeSort === 'area')
            sorted.sort((a, b) => areaNumber(b.area) - areaNumber(a.area))
        return sorted
    }, [rooms, activeFilter, activeSort])

    const minPrice = visibleRooms.length ? Math.min(...visibleRooms.map((r) => r.price)) : 0

    /** Đếm theo nhóm cho nhãn sidebar — bản resort viết cứng "Deluxe (4)". */
    const countOf = (k: FilterKey) =>
        k === 'all'
            ? rooms.length
            : k === 'sea'
              ? rooms.filter(isSeaView).length
              : rooms.filter((r) => r.group === k).length

    return (
        <div data-theme="h3" className="font-primary overflow-x-clip">
            <SiteHeader {...siteHeaderPropsOf(data, locale, meta.slug)} extra={extra} />

            <main className="bg-surface-base text-text-primary min-h-screen pt-[64px] pb-[80px] sm:pb-[48px]">
                {/* ---------------------------------------------- mobile ---- */}
                {/*
                  * Mobile là một BỐ CỤC RIÊNG, không phải desktop xếp dọc: nó có
                  * thanh tóm tắt dính, danh sách thẻ ngang gọn, và bộ lọc mở
                  * bằng modal đáy màn (luật P9).
                  */}
                <div className="block md:hidden">
                    <div className="bg-surface-raised border-border-muted sticky top-[48px] z-40 flex items-center justify-between border-b px-[16px] py-[10px] shadow-1">
                        <span className="text-text-secondary text-xs font-semibold">
                            {visibleRooms.length} {pick(UI.matchingRooms, locale)}
                        </span>
                        <button
                            type="button"
                            onClick={() => setFilterOpen(true)}
                            className="bg-surface-raised border-border-muted hover:bg-[var(--surface-hover)] focus-visible:outline-brand flex items-center gap-1.5 rounded-[6px] border px-[12px] py-[6px] text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <span>{pick(UI.sortFilter, locale)}</span>
                            <SlidersHorizontal className="text-brand h-[14px] w-[14px]" />
                        </button>
                    </div>

                    <ul className="divide-border-muted list-none divide-y px-[16px]">
                        {visibleRooms.map((room) => (
                            <li key={room.id}>
                                <a
                                    href={roomPath(meta.slug, room.id)}
                                    className="group flex flex-row items-stretch gap-[12px] py-[14px] text-inherit no-underline"
                                >
                                    <div className="bg-[var(--surface-hover)] relative aspect-[4/3] w-[115px] shrink-0 overflow-hidden rounded-[10px]">
                                        {room.images?.[0] && (
                                            <img
                                                src={room.images[0]}
                                                alt={pick(room.name, locale)}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div className="min-w-0">
                                            <h2 className="font-display text-text-primary truncate text-[14px] font-bold">
                                                {pick(room.name, locale)}
                                            </h2>
                                            <div className="text-text-tertiary mt-[4px] flex items-center gap-[10px] text-[11px] font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Maximize2 className="text-brand h-[12px] w-[12px]" />
                                                    {room.area}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="text-brand h-[12px] w-[12px]" />
                                                    {room.guests} {pick(UI.guests, locale)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-[6px]">
                                            <span className="text-surface-strong text-[15px] font-bold">
                                                {formatPrice(room.price, locale)}
                                            </span>
                                            <span className="text-text-tertiary text-[11px]">
                                                /{pick(UI.nights, locale)}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --------------------------------------------- desktop ---- */}
                <div className="mx-auto hidden max-w-[var(--container)] px-[16px] sm:px-[24px] md:block lg:px-[32px]">
                    <nav aria-label="Breadcrumb" className="text-text-tertiary py-[16px] text-[11px]">
                        <a
                            href={themeRoot(meta.slug)}
                            className="hover:text-text-primary text-inherit underline-offset-2 hover:underline"
                        >
                            {pick(UI.home, locale)}
                        </a>
                        <span className="mx-1.5" aria-hidden="true">
                            /
                        </span>
                        <span className="text-text-primary">{pick(UI.roomList, locale)}</span>
                    </nav>

                    <div className="flex items-start gap-[32px]">
                        {/* --- sidebar lọc --- */}
                        <aside className="bg-surface-raised border-border-muted w-[260px] shrink-0 space-y-[24px] rounded-[12px] border p-[20px] shadow-1">
                            <div className="border-border-muted flex items-center justify-between border-b pb-[12px]">
                                <h3 className="text-text-primary text-sm font-bold">
                                    {pick(UI.filters, locale)}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setActiveFilter('all')}
                                    className="text-brand focus-visible:outline-brand rounded-xs text-xs font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    {pick(UI.clearAll, locale)}
                                </button>
                            </div>

                            <fieldset className="space-y-[10px] border-0 p-0">
                                <legend className="text-text-primary mb-[10px] text-xs font-bold tracking-wider uppercase">
                                    {pick(UI.roomType, locale)}
                                </legend>
                                <div className="space-y-2 text-xs">
                                    {FILTERS.map((k) => (
                                        <label
                                            key={k}
                                            className="text-text-secondary hover:text-text-primary flex cursor-pointer items-center gap-2"
                                        >
                                            {/*
                                              * `radio` chứ không `checkbox`: chỉ
                                              * một nhóm được chọn tại một thời
                                              * điểm. Bản resort dùng checkbox
                                              * nhưng hành vi thật là chọn một —
                                              * ô vuông nói dối người dùng và sai
                                              * ngữ nghĩa với screen reader (D4).
                                              */}
                                            <input
                                                type="radio"
                                                name="room-filter"
                                                checked={activeFilter === k}
                                                onChange={() => setActiveFilter(k)}
                                                className="border-border text-brand focus-visible:outline-brand"
                                            />
                                            <span>
                                                {filterLabel(k, locale)} ({countOf(k)})
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </aside>

                        {/* --- danh sách --- */}
                        <div className="flex-1 space-y-[16px]">
                            <div className="flex items-center justify-end">
                                <label className="text-text-tertiary flex items-center gap-2 text-xs font-medium">
                                    <span>{pick(UI.sortBy2, locale)}</span>
                                    <select
                                        value={activeSort}
                                        onChange={(e) => setActiveSort(e.target.value as SortKey)}
                                        className="bg-surface-raised border-border-muted text-text-primary focus-visible:outline-brand cursor-pointer rounded-[6px] border px-[12px] py-[6px] text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                                    >
                                        {SORTS.map((s) => (
                                            <option key={s} value={s}>
                                                {sortLabel(s, locale)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {visibleRooms.length === 0 ? (
                                /* Trạng thái rỗng nói rõ phải làm gì tiếp (luật D6). */
                                <p className="border-border-muted text-text-secondary rounded-[12px] border border-dashed px-[24px] py-[40px] text-center text-sm">
                                    {pick(H3.noRoomMatchesFilter, locale)}
                                </p>
                            ) : (
                                <div className="space-y-[16px]">
                                    {visibleRooms.map((room) => (
                                        <article
                                            key={room.id}
                                            className="bg-surface-raised border-border-muted group flex gap-[20px] rounded-[12px] border p-[16px] transition hover:shadow-2"
                                        >
                                            <div className="bg-[var(--surface-hover)] relative aspect-[16/10] w-[256px] shrink-0 overflow-hidden rounded-[10px]">
                                                {room.images?.[0] && (
                                                    <img
                                                        src={room.images[0]}
                                                        alt={pick(room.name, locale)}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between py-1">
                                                <div>
                                                    <h2 className="font-display text-text-primary group-hover:text-brand text-lg font-bold transition-colors">
                                                        <a
                                                            href={roomPath(meta.slug, room.id)}
                                                            className="text-inherit no-underline"
                                                        >
                                                            {pick(room.name, locale)}
                                                        </a>
                                                    </h2>

                                                    <div className="text-text-tertiary mt-1 flex items-center gap-[16px] text-xs font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <Maximize2 className="text-brand h-[14px] w-[14px]" />
                                                            {room.area}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="text-brand h-[14px] w-[14px]" />
                                                            {room.guests} {pick(UI.guests, locale)}
                                                        </span>
                                                        {room.tags[0] && (
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="text-brand h-[14px] w-[14px]" />
                                                                {pick(room.tags[0], locale)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <ul className="text-brand mt-[12px] list-none space-y-1 text-xs font-medium">
                                                        {[
                                                            UI.freeBreakfast,
                                                            UI.freeHighSpeedWiFi,
                                                            UI.freeCancellation,
                                                        ].map((label, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-center gap-1.5"
                                                            >
                                                                <Check
                                                                    className="text-success h-[14px] w-[14px]"
                                                                    aria-hidden="true"
                                                                />
                                                                <span>{pick(label, locale)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="border-border-muted flex w-[180px] flex-col items-end justify-between border-l py-1 pl-[20px] text-right">
                                                <div>
                                                    <span className="text-surface-strong block text-xl font-bold">
                                                        {formatPrice(room.price, locale)}
                                                    </span>
                                                    <span className="text-text-tertiary text-xs">
                                                        /{pick(UI.nights, locale)}
                                                    </span>
                                                </div>

                                                <a
                                                    href={roomPath(meta.slug, room.id)}
                                                    className="bg-surface-strong text-text-inverse hover:bg-[var(--brand-mid)] focus-visible:outline-brand inline-flex min-h-[44px] items-center rounded-[6px] px-[24px] text-sm font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                                                >
                                                    {pick(UI.viewDetails, locale)}
                                                </a>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --------------------------- thanh dính đáy (mobile) ------ */}
                {minPrice > 0 && (
                    <div className="bg-surface-raised border-border-muted fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t p-[12px] shadow-2 sm:hidden">
                        <div>
                            <span className="text-text-tertiary block text-[10px] leading-none">
                                {pick(UI.from, locale)}
                            </span>
                            <span className="text-surface-strong text-base font-bold">
                                {formatPrice(minPrice, locale)}
                            </span>
                            <span className="text-text-tertiary text-[10px]">
                                /{pick(UI.nights, locale)}
                            </span>
                        </div>
                        {visibleRooms[0] && (
                            <a
                                href={roomPath(meta.slug, visibleRooms[0].id)}
                                className="bg-brand text-text-inverse focus-visible:outline-brand inline-flex min-h-[44px] items-center rounded-[6px] px-[20px] text-sm font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                {pick(UI.viewRoom, locale)}
                            </a>
                        )}
                    </div>
                )}

                {/* --------------------------------- modal lọc (mobile) ----- */}
                {filterOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-xs sm:items-center sm:p-[16px]"
                        onClick={() => setFilterOpen(false)}
                        role="presentation"
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label={pick(UI.sortFilter2, locale)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface-raised max-h-[85vh] w-full max-w-md space-y-[16px] overflow-y-auto rounded-t-[20px] p-[20px] sm:rounded-[20px]"
                        >
                            <div className="border-border-muted flex items-center justify-between border-b pb-[12px]">
                                <h3 className="font-display text-text-primary text-base font-bold">
                                    {pick(UI.sortFilter2, locale)}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setFilterOpen(false)}
                                    aria-label={pick(UI.closeMenu, locale)}
                                    className="text-text-tertiary focus-visible:outline-brand rounded-xs text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-2">
                                <span className="text-text-tertiary block text-xs font-semibold tracking-wider uppercase">
                                    {pick(UI.roomCategory, locale)}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {FILTERS.map((k) => (
                                        <button
                                            key={k}
                                            type="button"
                                            aria-pressed={activeFilter === k}
                                            onClick={() => setActiveFilter(k)}
                                            className={`focus-visible:outline-brand min-h-[32px] rounded-[6px] px-[12px] py-[6px] text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                activeFilter === k
                                                    ? 'bg-brand text-text-inverse'
                                                    : 'bg-surface-raised text-text-secondary border-border-muted hover:bg-[var(--surface-hover)] border'
                                            }`}
                                        >
                                            {filterLabel(k, locale)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-border-muted space-y-2 border-t pt-[8px]">
                                <span className="text-text-tertiary block text-xs font-semibold tracking-wider uppercase">
                                    {pick(UI.sortBy, locale)}
                                </span>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {SORTS.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            aria-pressed={activeSort === s}
                                            onClick={() => {
                                                setActiveSort(s)
                                                setFilterOpen(false)
                                            }}
                                            className={`focus-visible:outline-brand flex min-h-[44px] items-center justify-between rounded-[8px] border p-[10px] text-left text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                activeSort === s
                                                    ? 'border-brand text-brand bg-[var(--surface-tint)] font-semibold'
                                                    : 'border-border-muted text-text-secondary hover:bg-[var(--surface-hover)]'
                                            }`}
                                        >
                                            <span>{sortLabel(s, locale)}</span>
                                            {activeSort === s && (
                                                <Check className="text-brand h-4 w-4" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-border-muted border-t pt-[12px]">
                                <button
                                    type="button"
                                    onClick={() => setFilterOpen(false)}
                                    className="bg-brand text-text-inverse focus-visible:outline-brand min-h-[44px] w-full rounded-[6px] text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    {pick(H3.applyFilter, locale)} ({visibleRooms.length})
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, meta.slug)} />
        </div>
    )
}
