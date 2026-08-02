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
        <div
            data-theme="h1"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--text)', overflowX: 'hidden' }}
        >
            <PageHeader data={data} locale={locale} />

            <PageHero
                title={t.roomsTitle}
                sub={t.roomsSub}
                crumbs={[{ label: t.home, href: '/h1' }, { label: t.roomsPage }]}
            />

            <section id="list" style={{ background: 'var(--surface-alt)', padding: '32px 24px 88px' }}>
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    {/* ---- thanh lọc ---- */}
                    <div
                        className="h1-rooms-filter"
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow)',
                            padding: '18px 20px',
                            display: 'grid',
                            gap: 14,
                            alignItems: 'end',
                            marginBottom: 26,
                        }}
                    >
                        <FilterDate id="rm-in" label={t.checkIn} />
                        <FilterDate id="rm-out" label={t.checkOut} />

                        <FilterField id="rm-guests" label={t.guests}>
                            <select
                                id="rm-guests"
                                value={minGuests}
                                onChange={(e) => setMinGuests(Number(e.target.value) || 0)}
                                style={controlStyle}
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
                                style={controlStyle}
                            >
                                <option value="rec">{t.sortRec}</option>
                                <option value="asc">{t.sortAsc}</option>
                                <option value="desc">{t.sortDesc}</option>
                            </select>
                        </FilterField>

                        <span
                            style={{
                                padding: '12px 22px',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--surface-tint)',
                                color: 'var(--brand)',
                                fontSize: 13.5,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                            }}
                        >
                            {rooms.length} {t.countLabel}
                        </span>
                    </div>

                    {/* ---- list + sidebar ---- */}
                    <div className="h1-rooms-layout" style={{ display: 'grid', gap: 26, alignItems: 'start' }}>
                        <div style={{ display: 'grid', gap: 18 }}>
                            {rooms.map((room) => {
                                const extra = data.roomExtras[room.id]
                                const isPicked = picked.includes(room.id)

                                return (
                                    <article
                                        key={room.id}
                                        className="h1-room-card"
                                        style={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-lg)',
                                            padding: 14,
                                            display: 'grid',
                                            gap: 22,
                                        }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    height: '100%',
                                                    minHeight: 210,
                                                    borderRadius: 12,
                                                    overflow: 'hidden',
                                                    background: 'var(--surface-alt)',
                                                }}
                                            >
                                                {room.images?.[0] && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={room.images[0]}
                                                        alt={pick(room.name, locale)}
                                                        loading="lazy"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                    padding: '5px 12px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    background: 'rgba(15,23,41,0.78)',
                                                    color: '#FFFFFF',
                                                    fontSize: 11.5,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {room.area}
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                padding: '6px 8px 8px 0',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 6,
                                                    marginBottom: 10,
                                                }}
                                            >
                                                {room.tags.map((tag, i) => (
                                                    <span key={i} style={tagStyle}>
                                                        {pick(tag, locale)}
                                                    </span>
                                                ))}
                                            </div>

                                            <h2
                                                style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: 19,
                                                    fontWeight: 800,
                                                    color: 'var(--text)',
                                                    margin: '0 0 8px',
                                                    letterSpacing: '-0.02em',
                                                }}
                                            >
                                                {pick(room.name, locale)}
                                            </h2>

                                            <p
                                                style={{
                                                    fontSize: 14,
                                                    lineHeight: 1.65,
                                                    color: 'var(--text-muted)',
                                                    margin: '0 0 12px',
                                                }}
                                            >
                                                {pick(room.desc, locale)}
                                            </p>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 16,
                                                    fontSize: 13,
                                                    color: 'var(--text-muted)',
                                                    marginBottom: 14,
                                                }}
                                            >
                                                <span>
                                                    {extra?.maxGuests
                                                        ? `${room.guests}–${extra.maxGuests}`
                                                        : room.guests}{' '}
                                                    {t.guestsWord}
                                                </span>
                                                <span>{extra ? pick(extra.bed, locale) : t.bedDefault}</span>
                                                <span>{extra ? pick(extra.view, locale) : t.viewDefault}</span>
                                            </div>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 8,
                                                    marginBottom: 16,
                                                    paddingBottom: 14,
                                                    borderBottom: '1px solid var(--surface-alt)',
                                                }}
                                            >
                                                {(extra?.amenities.slice(0, 4).map((a) => pick(a, locale)) ??
                                                    t.perksDefault).map((perk, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 7,
                                                            fontSize: 12.5,
                                                            color: 'var(--text-muted)',
                                                        }}
                                                    >
                                                        <span aria-hidden="true" style={dotStyle} />
                                                        {perk}
                                                    </span>
                                                ))}
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: 'auto',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    justifyContent: 'space-between',
                                                    gap: 14,
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                <div>
                                                    <div
                                                        style={{
                                                            fontSize: 22,
                                                            fontWeight: 800,
                                                            color: 'var(--text)',
                                                            letterSpacing: '-0.02em',
                                                        }}
                                                    >
                                                        {formatPrice(room.price, locale)}
                                                    </div>
                                                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                                                        {t.perNight}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                    <a
                                                        href={`/h1/rooms/${room.id}`}
                                                        style={ghostButtonStyle}
                                                    >
                                                        {t.viewDetail}
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRoom(room.id)}
                                                        style={{
                                                            ...solidButtonStyle,
                                                            background: isPicked
                                                                ? 'var(--surface-inverse)'
                                                                : 'var(--accent)',
                                                        }}
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
                        <aside
                            className="h1-rooms-aside"
                            style={{ display: 'grid', gap: 16, alignContent: 'start' }}
                        >
                            <div style={cardStyle}>
                                <div style={kickerStyle}>{t.yourSelection}</div>

                                {picked.length > 0 ? (
                                    <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
                                        {picked.map((id) => {
                                            const room = roomById[id]
                                            if (!room) return null
                                            return (
                                                <div
                                                    key={id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'space-between',
                                                        gap: 12,
                                                        paddingBottom: 10,
                                                        borderBottom: '1px solid var(--surface-alt)',
                                                    }}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                fontSize: 13.5,
                                                                fontWeight: 700,
                                                                color: 'var(--text)',
                                                                lineHeight: 1.4,
                                                            }}
                                                        >
                                                            {pick(room.name, locale)}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: 'var(--text-muted)',
                                                            }}
                                                        >
                                                            {room.area} · {room.guests} {t.guestsWord}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRoom(id)}
                                                        aria-label={`Bỏ ${pick(room.name, locale)}`}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: 16,
                                                            lineHeight: 1,
                                                            color: 'var(--border-strong)',
                                                            padding: '2px 4px',
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p
                                        style={{
                                            fontSize: 13.5,
                                            lineHeight: 1.65,
                                            color: 'var(--text-muted)',
                                            margin: '0 0 16px',
                                        }}
                                    >
                                        {t.emptySelection}
                                    </p>
                                )}

                                <div style={{ display: 'grid', gap: 8, paddingTop: 4 }}>
                                    <SumRow label={t.roomsTotal} value={formatPrice(roomsSubtotal, locale)} />
                                    <SumRow label={t.addonsTotal} value={formatPrice(addonsSubtotal, locale)} />
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: 12,
                                            marginTop: 4,
                                            borderTop: '1px solid var(--border)',
                                        }}
                                    >
                                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                                            {t.total}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 22,
                                                fontWeight: 800,
                                                color: 'var(--brand)',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            {formatPrice(roomsSubtotal + addonsSubtotal, locale)}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                                        {t.totalNote}
                                    </div>
                                </div>

                                <a
                                    href={telHref(data.brand.phone)}
                                    style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        marginTop: 18,
                                        padding: 14,
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--accent)',
                                        color: 'var(--text-inverse)',
                                        fontSize: 14.5,
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t.confirmBooking}
                                </a>
                            </div>

                            <div style={cardStyle}>
                                <div style={kickerStyle}>{t.addonsTitle}</div>
                                <p
                                    style={{
                                        fontSize: 12.5,
                                        lineHeight: 1.6,
                                        color: 'var(--text-muted)',
                                        margin: '0 0 16px',
                                    }}
                                >
                                    {t.addonsSub}
                                </p>
                                <div style={{ display: 'grid', gap: 10 }}>
                                    {data.addons.map((addon) => (
                                        <label
                                            key={addon.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 11,
                                                cursor: 'pointer',
                                                padding: '11px 12px',
                                                borderRadius: 12,
                                                background: 'var(--surface-alt)',
                                            }}
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
                                                style={{
                                                    margin: '3px 0 0',
                                                    width: 16,
                                                    height: 16,
                                                    accentColor: 'var(--accent)',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span style={{ display: 'grid', gap: 2, flex: 1 }}>
                                                <span
                                                    style={{
                                                        fontSize: 13.5,
                                                        fontWeight: 600,
                                                        color: 'var(--text)',
                                                    }}
                                                >
                                                    {pick(addon.name, locale)}
                                                </span>
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                    {addon.price
                                                        ? `${formatPrice(addon.price, locale)} / ${pick(addon.unit, locale)}`
                                                        : pick(addon.unit, locale)}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div
                                style={{
                                    background: 'var(--surface-tint)',
                                    border: '1px solid var(--brand-light)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '20px 22px',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 12.5,
                                        fontWeight: 700,
                                        color: 'var(--brand)',
                                        marginBottom: 10,
                                    }}
                                >
                                    {t.notesTitle}
                                </div>
                                <div style={{ display: 'grid', gap: 8 }}>
                                    {data.notes.map((note, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                            <span aria-hidden="true" style={{ ...dotStyle, marginTop: 7 }} />
                                            <span
                                                style={{
                                                    fontSize: 12.5,
                                                    lineHeight: 1.6,
                                                    color: 'var(--brand-dark)',
                                                }}
                                            >
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

            <style>{`
                @media (min-width: 900px) {
                    .h1-rooms-filter {
                        grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
                    }
                    .h1-rooms-layout {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
                    }
                    .h1-rooms-aside {
                        position: sticky;
                        top: 100px;
                    }
                }
                @media (min-width: 720px) {
                    .h1-room-card {
                        grid-template-columns: minmax(150px, 268px) minmax(0, 1fr);
                    }
                }
                .h1-room-card { transition: box-shadow 200ms ease; }
                .h1-room-card:hover { box-shadow: var(--shadow); }
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
        <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
            <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                {label}
            </label>
            {children}
        </div>
    )
}

function FilterDate({ id, label }: { id: string; label: string }) {
    return (
        <FilterField id={id} label={label}>
            <input id={id} type="date" style={controlStyle} />
        </FilterField>
    )
}

function SumRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 13.5,
                color: 'var(--text-muted)',
            }}
        >
            <span>{label}</span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{value}</span>
        </div>
    )
}

// ==================================================================== style

const controlStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    background: 'var(--surface-alt)',
    color: 'var(--text)',
}

const tagStyle: React.CSSProperties = {
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--surface-tint)',
    color: 'var(--brand)',
    fontSize: 11.5,
    fontWeight: 600,
}

const dotStyle: React.CSSProperties = {
    width: 5,
    height: 5,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--accent)',
    flexShrink: 0,
}

const cardStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px 24px',
}

const kickerStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--brand)',
    marginBottom: 14,
}

const ghostButtonStyle: React.CSSProperties = {
    padding: '11px 20px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border-strong)',
    color: 'var(--text)',
    fontSize: 13.5,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
}

const solidButtonStyle: React.CSSProperties = {
    padding: '11px 22px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13.5,
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
    color: 'var(--text-inverse)',
}
