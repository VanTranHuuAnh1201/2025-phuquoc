'use client'

import { useState } from 'react'
import {
    formatPrice,
    pick,
    roomPath,
    telHref,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { meta } from '../meta'
import { pageUi } from './strings'
import { LightCrumbs, PageFooter, PageHeader } from './PageShell'

/**
 * Trang chi tiết hạng phòng — port từ `Room Detail - Nam Du Hill.dc.html`.
 *
 * Bố cục bám sát prototype:
 *   breadcrumb nền sáng → dải ảnh `2fr/1fr` hai hàng 200px
 *   → nội dung `1fr / 360px`, sidebar đặt phòng dính ở top 100px
 *
 * Đây là màn mà nút "Đặt phòng" trên thẻ phòng phải dẫn tới — khách xem đúng
 * phòng vừa bấm rồi chọn ngày ngay tại đây, không phải chọn lại ở màn khác.
 *
 * STYLE: Tailwind v4 qua cầu nối token `@repo/styling-tailwind`. Các hằng
 * `*Class` ở cuối file là bộ class dùng lại nhiều chỗ — thay cho các object
 * `React.CSSProperties` trước đây. Biến ngoài hợp đồng D1 viết arbitrary trỏ
 * vào biến, không bao giờ ghi mã hex (luật D0).
 */

export function RoomDetailPage({
    data,
    locale,
    roomSlug,
}: {
    data: PropertyData
    locale: Locale
    /** Id hạng phòng lấy từ URL. Không khớp thì rơi về hạng đầu tiên. */
    roomSlug?: string
}) {
    const t = pageUi[locale]

    const room = data.rooms.find((r) => r.id === roomSlug) ?? data.rooms[0]
    const extra = room ? data.roomExtras[room.id] : undefined

    // Hook phải chạy trước mọi lối thoát sớm — React yêu cầu số lần gọi hook
    // không đổi giữa các lần render.
    const [guests, setGuests] = useState(extra?.defaultGuests ?? room?.guests ?? 2)
    const [addons, setAddons] = useState<Record<string, boolean>>({})

    if (!room) return null

    const maxGuests = extra?.maxGuests ?? room.guests

    // Giường phụ khi vượt số khách tiêu chuẩn — cùng quy tắc với `countExtraBeds`
    // của core, nhưng ở đây chỉ cần con số hiển thị cho một đêm.
    const extraBeds = guests > room.guests ? guests - room.guests : 0
    const extraBedTotal = extraBeds * (extra?.extraBed ?? 0)

    const addonsSubtotal = data.addons.reduce((sum, a) => {
        if (!addons[a.id] || !a.price) return sum
        return sum + a.price * (a.id === 'addon-bike' ? 1 : guests)
    }, 0)

    const total = room.price + extraBedTotal + addonsSubtotal

    const specs = [
        { label: t.specArea, value: room.area },
        {
            label: t.specGuests,
            value: `${room.guests}${maxGuests > room.guests ? `–${maxGuests}` : ''} ${t.guestsWord}`,
        },
        { label: t.specBed, value: extra ? pick(extra.bed, locale) : t.bedDefault },
        { label: t.specView, value: extra ? pick(extra.view, locale) : t.viewDefault },
    ]

    const others = data.rooms.filter((r) => r.id !== room.id).slice(0, 3)
    const images = room.images ?? []

    return (
        // `overflow-x-clip` chứ KHÔNG phải `hidden`: `hidden` trên một trục biến
        // trục kia thành scroll container, làm `position: sticky` của sidebar
        // đặt phòng dính vào div này thay vì vào viewport. Xem `globals.css`.
        <div
            data-theme={meta.slug}
            className="overflow-x-clip font-primary text-text-primary"
        >
            <PageHeader data={data} locale={locale} />

            <LightCrumbs
                crumbs={[
                    { label: t.home, href: themeRoot(meta.slug) },
                    { label: t.roomsPage, href: themePath(meta.slug, 'rooms') },
                    { label: pick(room.name, locale) },
                ]}
            />

            {/* ---- dải ảnh ---- */}
            <section className="bg-surface-base px-4 pb-5">
                <div className="h7-detail-gallery mx-auto grid max-w-[var(--container)] gap-[12px]">
                    <GalleryTile src={images[0]} alt={pick(room.name, locale)} span2 />
                    <GalleryTile src={images[1]} alt={pick(room.name, locale)} />
                    <GalleryTile src={images[2]} alt={pick(room.name, locale)} />
                </div>
            </section>

            <section className="bg-surface-raised px-4 pt-[44px] pb-[88px]">
                <div className="h7-detail-layout mx-auto grid max-w-[var(--container)] items-start gap-5">
                    {/* ============================ cột trái ============================ */}
                    <div>
                        <div className="mb-[14px] flex flex-wrap gap-[6px]">
                            {room.tags.map((tag, i) => (
                                <span key={i} className={tagClass}>
                                    {pick(tag, locale)}
                                </span>
                            ))}
                        </div>

                        <h1 className="m-0 mb-[12px] font-display text-[38px] leading-[1.14] font-extrabold tracking-[-0.03em] text-text-primary">
                            {pick(room.name, locale)}
                        </h1>

                        <p className="m-0 mb-4 max-w-[640px] text-[16px] leading-[1.7] text-text-secondary">
                            {pick(room.desc, locale)}
                        </p>

                        {/* bảng thông số 4 ô, ngăn cách bằng gap 1px trên nền viền */}
                        <div className="h7-spec-grid mb-[34px] grid gap-px overflow-hidden rounded-lg border border-border-default bg-border-default">
                            {specs.map((spec) => (
                                <div
                                    key={spec.label}
                                    className="bg-surface-raised px-[20px] py-[18px]"
                                >
                                    <div className="mb-[6px] text-[11.5px] font-bold tracking-[0.08em] uppercase text-brand">
                                        {spec.label}
                                    </div>
                                    <div className="text-[14.5px] leading-[1.45] font-semibold text-text-primary">
                                        {spec.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <SectionTitle>{t.descTitle}</SectionTitle>
                        {extra && (
                            <>
                                <Paragraph>{pick(extra.long, locale)}</Paragraph>
                                {extra.long2 && <Paragraph last>{pick(extra.long2, locale)}</Paragraph>}
                            </>
                        )}

                        {extra && extra.amenities.length > 0 && (
                            <>
                                <SectionTitle>{t.amenitiesTitle}</SectionTitle>
                                <div className="h7-amenity-grid mb-[36px] grid gap-[10px]">
                                    {extra.amenities.map((amenity, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-[11px] rounded-md bg-surface-base px-3 py-[12px]"
                                        >
                                            <span aria-hidden="true" className={checkClass}>
                                                ✓
                                            </span>
                                            <span className="text-[14px] leading-[1.5] text-text-primary">
                                                {pick(amenity, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="h7-two-col mb-[36px] grid gap-[20px]">
                            <div className={outlineCardClass}>
                                <h3 className={subTitleClass}>{t.viewTitle}</h3>
                                <div className="flex items-start gap-[11px]">
                                    <span aria-hidden="true" className={`${dotClass} mt-2`} />
                                    <span className="text-[14px] leading-[1.6] text-text-secondary">
                                        {extra ? pick(extra.view, locale) : t.viewDefault}
                                    </span>
                                </div>
                            </div>

                            <div className={outlineCardClass}>
                                <h3 className={subTitleClass}>{t.conditionsTitle}</h3>
                                <div className="grid gap-2">
                                    {(extra?.conditions ?? []).map((condition, i) => (
                                        <div key={i} className="flex items-start gap-[11px]">
                                            <span aria-hidden="true" className={`${dotClass} mt-2`} />
                                            <span className="text-[14px] leading-[1.6] text-text-secondary">
                                                {pick(condition, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SectionTitle>{t.otherRooms}</SectionTitle>
                        <div className="h7-other-grid grid gap-[18px]">
                            {others.map((other) => (
                                <a
                                    key={other.id}
                                    href={roomPath(meta.slug, other.id)}
                                    className="h7-other-card block overflow-hidden rounded-lg border border-border-default bg-surface-raised text-inherit no-underline"
                                >
                                    <div className="relative h-[140px] bg-surface-base">
                                        {other.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={other.images[0]}
                                                alt={pick(other.name, locale)}
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="px-3 pt-[14px] pb-3">
                                        <div className="mb-[6px] text-[14.5px] leading-[1.4] font-bold text-text-primary">
                                            {pick(other.name, locale)}
                                        </div>
                                        <div className="text-[13px] text-text-secondary">
                                            {other.area} · {formatPrice(other.price, locale)}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ========================= sidebar đặt phòng ========================= */}
                    <aside
                        id="book"
                        className="h7-detail-aside grid content-start gap-3"
                    >
                        <div className="rounded-lg border border-border-default bg-surface-raised p-4 shadow-2">
                            <div className="mb-1 flex items-baseline gap-2">
                                <span className="text-[28px] font-extrabold tracking-[-0.03em] text-text-primary">
                                    {formatPrice(room.price, locale)}
                                </span>
                                <span className="text-[13px] text-text-secondary">
                                    / {t.perNight}
                                </span>
                            </div>
                            <div className="mb-[20px] text-[12.5px] text-text-secondary">
                                {room.guests} {t.guestsWord}
                                {maxGuests > room.guests ? ` · tối đa ${maxGuests}` : ''}
                            </div>

                            <div className="mb-[18px] grid gap-[12px]">
                                <div className="grid grid-cols-2 gap-[10px]">
                                    <DateField id="rd-in" label={t.checkIn} />
                                    <DateField id="rd-out" label={t.checkOut} />
                                </div>

                                <div className="grid gap-[6px]">
                                    <span className="text-[12px] font-semibold text-text-secondary">
                                        {t.guests}
                                    </span>
                                    <div className="flex items-center justify-between rounded-[8px] border border-border-default bg-surface-base px-[12px] py-2">
                                        <button
                                            type="button"
                                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                            aria-label="Giảm số khách"
                                            className={stepperClass}
                                        >
                                            −
                                        </button>
                                        <span className="text-[14.5px] font-bold text-text-primary">
                                            {guests} {t.guestsWord}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                                            aria-label="Tăng số khách"
                                            className={stepperClass}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {extraBeds > 0 && (
                                        <span className="text-[12px] text-brand">
                                            {t.extraBedNote}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-[18px] grid gap-2 border-t border-border-default pt-[16px]">
                                <SumRow label={t.roomPrice} value={formatPrice(room.price, locale)} />
                                <SumRow label={t.extraBedLabel} value={formatPrice(extraBedTotal, locale)} />
                                <SumRow label={t.addonsTotal} value={formatPrice(addonsSubtotal, locale)} />
                                <div className="flex items-center justify-between border-t border-border-default pt-[12px]">
                                    <span className="text-[14px] font-bold text-text-primary">
                                        {t.total}
                                    </span>
                                    <span className="text-[22px] font-extrabold tracking-[-0.02em] text-brand">
                                        {formatPrice(total, locale)}
                                    </span>
                                </div>
                            </div>

                            <a
                                href={telHref(data.brand.phone)}
                                className="block rounded-[var(--radius-pill)] bg-accent p-[14px] text-center text-[14.5px] font-bold text-text-inverse no-underline"
                            >
                                {pageUi[locale].confirmBooking}
                            </a>
                            <a
                                href={themePath(meta.slug, 'rooms')}
                                className="mt-[10px] block rounded-[var(--radius-pill)] border border-[var(--border-strong)] p-[12px] text-center text-[13.5px] font-semibold text-text-primary no-underline"
                            >
                                {t.backToRooms}
                            </a>
                        </div>

                        <div className="rounded-lg border border-border-default bg-surface-raised px-4 py-[22px]">
                            <div className={kickerClass}>{t.addonsTitle}</div>
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
                    </aside>
                </div>
            </section>

            <PageFooter data={data} locale={locale} />

            {/* GIỮ `<style>`: dải ảnh là lưới hai hàng 200px cố định với ô đầu
                span 2 hàng, và các breakpoint 720/980/640px không có trong thang
                mặc định của Tailwind. `:not(:first-child)` để ẩn hai ô phụ trên
                mobile cũng không có utility tương đương. */}
            <style>{`
                .h7-detail-gallery {
                    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
                    grid-template-rows: 200px 200px;
                }
                @media (max-width: 720px) {
                    .h7-detail-gallery {
                        grid-template-columns: minmax(0, 1fr);
                        grid-template-rows: 220px;
                    }
                    .h7-detail-gallery > *:not(:first-child) { display: none; }
                }
                @media (min-width: 980px) {
                    .h7-detail-layout {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
                    }
                    .h7-detail-aside { position: sticky; top: 100px; }
                }
                @media (min-width: 640px) {
                    .h7-spec-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .h7-amenity-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h7-two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h7-other-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                .h7-other-card { transition: box-shadow 200ms ease, transform 200ms ease; }
                .h7-other-card:hover { box-shadow: var(--shadow); transform: translateY(-4px); }
            `}</style>
        </div>
    )
}

// ================================================================= mảnh nhỏ

function GalleryTile({ src, alt, span2 }: { src?: string; alt: string; span2?: boolean }) {
    return (
        <div
            className={[
                'relative overflow-hidden rounded-lg bg-surface-base',
                span2 ? 'row-span-2' : '',
            ].join(' ')}
        >
            {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                />
            )}
        </div>
    )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="m-0 mb-[16px] font-display text-[22px] font-extrabold tracking-[-0.02em] text-text-primary">
            {children}
        </h2>
    )
}

function Paragraph({ children, last }: { children: React.ReactNode; last?: boolean }) {
    return (
        <p
            className={[
                'm-0 text-[15.5px] leading-[1.85] text-text-secondary',
                last ? 'mb-[36px]' : 'mb-[14px]',
            ].join(' ')}
        >
            {children}
        </p>
    )
}

function DateField({ id, label }: { id: string; label: string }) {
    return (
        <div className="grid gap-[6px]">
            <label htmlFor={id} className="text-[12px] font-semibold text-text-secondary">
                {label}
            </label>
            <input
                id={id}
                type="date"
                className="w-full rounded-[8px] border border-border-default bg-surface-base px-[12px] py-[10px] font-primary text-[13.5px] font-medium text-text-primary"
            />
        </div>
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

const tagClass =
    'rounded-[var(--radius-pill)] bg-[var(--surface-tint)] px-[12px] py-[5px] text-[12px] font-semibold text-brand'

const dotClass = 'h-[5px] w-[5px] shrink-0 rounded-[var(--radius-pill)] bg-accent'

const checkClass =
    'mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--surface-tint)] text-[11px] font-extrabold text-brand'

const outlineCardClass =
    'rounded-lg border border-border-default px-4 py-[22px]'

const subTitleClass =
    'm-0 mb-[12px] font-display text-[16px] font-extrabold tracking-[-0.015em] text-text-primary'

const kickerClass =
    'mb-[14px] text-[12px] font-bold tracking-[0.08em] uppercase text-brand'

const stepperClass =
    'h-[30px] w-[30px] cursor-pointer rounded-[8px] border-none bg-surface-raised font-primary text-[16px] font-bold text-brand'
