'use client'

import { useMemo, useState } from 'react'
import {
    checkAvailability,
    countNights,
    formatPrice,
    pick,
    ratePlans,
    seasons,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
    type Room,
} from '@repo/core'

import { meta } from '../meta'
import { fill, fitFor, ui } from '../strings'
import { BaseCss } from '../components/base'
import { IconCheck } from '../components/icons'
import { ZaloFab } from '../components/ZaloFab'
import { SearchFields } from '../components/SearchWidget'
import { searchQuery, shortDate, toGuestCount, useStaySearch } from '../components/search'
import { Header } from '../sections/Header'
import { Contact } from '../sections/Contact'

/**
 * Trang `/h5/rooms` — mỗi hạng MỘT HÀNG NGANG so sánh (quyết định D-5):
 * ảnh 3:2 trái · thông tin giữa · giá + CTA phải. Mobile đổi thẻ dọc, không
 * cuộn ngang (F6).
 *
 * Giá tính THEO TỪNG ĐÊM qua `checkAvailability()` của core (luật B3/R8) —
 * theme không có công thức nào. Tồn kho thật sống trong store của app (theme
 * không import được, luật R1) nên trang này KHÔNG hiển thị "Còn X phòng" —
 * không bịa con số (M4); trạng thái hết phòng thật do luồng checkout xác nhận.
 */

const SLUG = meta.slug

export function RoomsPage({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const [search, setSearch] = useStaySearch()
    const [editing, setEditing] = useState(false)

    const nights = countNights(search.checkIn, search.checkOut)
    const guests = toGuestCount(search)
    const ratePlan = ratePlans.find((plan) => plan.id === 'standard')
    const cancelRule = ratePlan?.cancellationRules[0]

    const rows = useMemo(() => {
        return data.rooms
            .map((room) => ({
                room,
                result: checkAvailability({
                    room,
                    roomExtra: data.roomExtras[room.id],
                    checkIn: search.checkIn,
                    checkOut: search.checkOut,
                    guests,
                    seasons,
                    // Tồn kho demo nằm ở store của app; ở đây coi như còn phòng
                    // và để bước checkout kiểm tra thật.
                    inventory: {},
                    ratePlan,
                }),
            }))
            .sort((a, b) => (a.result.roomTotal || a.room.price) - (b.result.roomTotal || b.room.price))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.rooms, data.roomExtras, search.checkIn, search.checkOut, search.adults, search.childAges.join(',')])

    const availableRows = rows.filter(({ result }) => result.available)
    const zaloPhone = data.brand.phone.replace(/\s/g, '')

    const detailHref = (room: Room) =>
        `${themePath(SLUG, 'rooms')}/${room.id}${searchQuery(search, locale)}`

    return (
        <div data-theme={SLUG} style={{ overflowX: 'hidden' }}>
            <BaseCss />
            <Header data={data} locale={locale} />

            {/* ---- banner mỏng ---- */}
            <div style={{ position: 'relative', minHeight: '30vh', display: 'flex', alignItems: 'flex-end' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={data.hero.images?.[1] ?? '/hero-2.jpg'}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--scrim-banner)',
                    }}
                />
                <div
                    className="h5-container"
                    style={{ position: 'relative', width: '100%', paddingBottom: 'var(--space-4)', color: 'var(--color-text-inverse)' }}
                >
                    <nav aria-label="Breadcrumb" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 6 }}>
                        <a href={themeRoot(SLUG)} style={{ color: 'var(--color-text-inverse)', opacity: 0.85 }}>
                            {t.home}
                        </a>{' '}
                        / <span aria-current="page">{t.roomsCrumb}</span>
                    </nav>
                    <h1 className="h5-display" style={{ fontSize: 'var(--font-size-3xl)', margin: 0 }}>
                        {t.roomsPageTitle}
                    </h1>
                </div>
            </div>

            {/* ---- sticky date bar ---- */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    background: 'var(--color-surface-raised)',
                    borderBottom: '1px solid var(--color-border-muted)',
                    boxShadow: 'var(--shadow-1)',
                }}
            >
                <div
                    className="h5-container"
                    style={{
                        minHeight: 56,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        flexWrap: 'wrap',
                        paddingTop: 8,
                        paddingBottom: 8,
                    }}
                >
                    <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {shortDate(search.checkIn, locale)} → {shortDate(search.checkOut, locale)} ·{' '}
                        {search.adults + search.childAges.length} {t.guestsWord}
                    </strong>
                    <button
                        type="button"
                        className="h5-btn h5-btn-ghost"
                        onClick={() => setEditing((open) => !open)}
                        aria-expanded={editing}
                        style={{ minHeight: 36, padding: '0 var(--space-3)', fontSize: 'var(--font-size-sm)' }}
                    >
                        {editing ? t.close : t.edit}
                    </button>
                    <span className="h5-datebar-note" style={{ marginLeft: 'auto', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {fill(t.pricedForRange, { n: nights })} · {t.taxIncluded}
                    </span>
                </div>
                {editing && (
                    <div className="h5-container" style={{ paddingBottom: 'var(--space-3)' }}>
                        <SearchFields locale={locale} value={search} onChange={setSearch} columns />
                    </div>
                )}
            </div>

            {/* ---- danh sách ---- */}
            <main className="h5-container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
                {availableRows.length === 0 ? (
                    <div
                        role="status"
                        style={{
                            background: 'var(--color-surface-sand)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-5)',
                            maxWidth: 560,
                        }}
                    >
                        <p className="h5-display" style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--space-2)' }}>
                            {fill(t.emptyTitle, {
                                from: shortDate(search.checkIn, locale),
                                to: shortDate(search.checkOut, locale),
                            })}
                        </p>
                        <p style={{ margin: '0 0 var(--space-3)', color: 'var(--color-text-secondary)' }}>
                            {t.emptyBody} {t.emptyRoomsHint}
                        </p>
                        <a
                            className="h5-btn h5-btn-ghost"
                            href={`https://zalo.me/${zaloPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t.emptyZalo}
                        </a>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        {rows.map(({ room, result }) => {
                            const extra = data.roomExtras[room.id]
                            const amenities = extra?.amenities.slice(0, 3) ?? []
                            const overCapacity = result.blockedReason === 'capacity-exceeded'

                            return (
                                <article
                                    key={room.id}
                                    className="h5-card h5-room-row"
                                    style={{ overflow: 'hidden', opacity: overCapacity ? 0.6 : 1 }}
                                >
                                    <a
                                        href={detailHref(room)}
                                        className="h5-room-row-photo"
                                        aria-label={pick(room.name, locale)}
                                        style={{ display: 'block', background: 'var(--color-surface-sand)' }}
                                    >
                                        {room.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={room.images[0]}
                                                alt={pick(room.name, locale)}
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                    </a>

                                    <div style={{ padding: 'var(--space-4)', minWidth: 0 }}>
                                        <h2 className="h5-display" style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 4px' }}>
                                            <a href={detailHref(room)} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {pick(room.name, locale)}
                                            </a>
                                        </h2>
                                        <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            {t.fitLabel}: {fitFor(room, locale)} · {room.area}
                                            {extra ? ` · ${pick(extra.view, locale)}` : ''}
                                        </p>
                                        <ul
                                            style={{
                                                listStyle: 'none',
                                                margin: '0 0 var(--space-3)',
                                                padding: 0,
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 'var(--space-2) var(--space-3)',
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-secondary)',
                                            }}
                                        >
                                            {amenities.map((amenity, i) => (
                                                <li key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                    <span aria-hidden="true" style={{ color: 'var(--color-success)' }}>
                                                        <IconCheck size={14} />
                                                    </span>
                                                    {pick(amenity, locale)}
                                                </li>
                                            ))}
                                        </ul>
                                        {cancelRule && (
                                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>
                                                {fill(t.cancelShort, {
                                                    d: cancelRule.daysBeforeCheckIn,
                                                    p: cancelRule.refundPercent,
                                                })}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className="h5-room-row-price"
                                        style={{
                                            padding: 'var(--space-4)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            gap: 6,
                                            borderLeft: '1px solid var(--color-border-muted)',
                                        }}
                                    >
                                        {overCapacity ? (
                                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)', textAlign: 'right' }}>
                                                {t.capacityOver}
                                            </p>
                                        ) : (
                                            <>
                                                {/* Giá là phần tử ĐẬM NHẤT hàng (spec §3.2). */}
                                                <span
                                                    className="h5-display"
                                                    style={{
                                                        fontSize: 'var(--font-size-2xl)',
                                                        fontWeight: 'var(--font-weight-bold)' as never,
                                                        fontVariantNumeric: 'tabular-nums',
                                                    }}
                                                >
                                                    {formatPrice(result.roomTotal, locale)}
                                                </span>
                                                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                    {nights} {t.nightsWord} · {t.taxIncluded}
                                                </span>
                                                <a
                                                    className="h5-btn h5-btn-primary h5-room-row-cta"
                                                    href={detailHref(room)}
                                                    style={{ marginTop: 6, minWidth: 150 }}
                                                >
                                                    {t.selectRoom}
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </main>

            <Contact data={data} locale={locale} />
            <ZaloFab brand={data.brand} locale={locale} />

            <style>{`
                @media (min-width: 900px) {
                    .h5-room-row {
                        display: grid;
                        grid-template-columns: 360px minmax(0, 1fr) 240px;
                    }
                    .h5-room-row-photo { aspect-ratio: 3 / 2; }
                }
                @media (max-width: 899.98px) {
                    .h5-room-row { display: block; }
                    .h5-room-row-photo { aspect-ratio: 16 / 9; }
                    .h5-room-row-price {
                        align-items: stretch !important;
                        border-left: none !important;
                        border-top: 1px solid var(--color-border-muted);
                        text-align: left;
                    }
                    .h5-room-row-cta { width: 100%; }
                    .h5-datebar-note { display: none; }
                }
            `}</style>
        </div>
    )
}
