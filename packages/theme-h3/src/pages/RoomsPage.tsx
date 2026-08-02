'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import {
    formatPrice,
    pick,
    roomPath,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { meta } from '../meta'
import { Header } from '../sections/Header'
import { Contact } from '../sections/Contact'
import { pageUi } from './strings'

/**
 * Trang danh sách hạng phòng mẫu 03 — port từ `Rooms H3 - Nam Du Hill.dc.html`.
 *
 * Bố cục KHÁC hẳn mẫu 01 và 02, đúng như prototype:
 *   hero 380px nền teal, dải 3 ảnh phía sau, chữ CĂN GIỮA
 *   → lưới `270px / 1fr`: cột trái là aside DÍNH gồm ba khối (đang chọn ·
 *     lọc & sắp xếp · tiện ích), cột phải là lưới thẻ 2 cột
 *
 * Giá lấy qua `formatPrice` của core, không tự tính (luật R8).
 */

const SLUG = meta.slug

type SortKey = 'rec' | 'asc' | 'desc'
type FilterKey = 'all' | 'couple' | 'family' | 'group'

export function RoomsPage({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = pageUi[locale]

    const [filter, setFilter] = useState<FilterKey>('all')
    const [sort, setSort] = useState<SortKey>('rec')
    const [picked, setPicked] = useState<string[]>([])
    const [addons, setAddons] = useState<Record<string, boolean>>({ 'addon-ferry': true })

    const rooms = useMemo(() => {
        let list = data.rooms.slice()

        if (filter === 'couple') list = list.filter((r) => r.guests <= 3)
        else if (filter === 'family') list = list.filter((r) => r.guests >= 4 && r.guests <= 6)
        else if (filter === 'group') list = list.filter((r) => r.guests >= 6)

        if (sort === 'asc') list.sort((a, b) => a.price - b.price)
        else if (sort === 'desc') list.sort((a, b) => b.price - a.price)

        return list
    }, [data.rooms, filter, sort])

    const roomById = useMemo(
        () => Object.fromEntries(data.rooms.map((r) => [r.id, r])),
        [data.rooms],
    )

    const roomsSubtotal = picked.reduce((sum, id) => sum + (roomById[id]?.price ?? 0), 0)

    // Số khách dùng để nhân giá tiện ích — tổng sức chứa phòng đã chọn, tối thiểu 2.
    const guestsCount =
        picked.reduce((sum, id) => sum + (roomById[id]?.guests ?? 0), 0) || 2

    const addonsSubtotal = data.addons.reduce((sum, addon) => {
        if (!addons[addon.id] || !addon.price) return sum
        return sum + addon.price * (addon.id === 'addon-bike' ? 1 : guestsCount)
    }, 0)

    const total = roomsSubtotal + addonsSubtotal

    const toggleRoom = (id: string) =>
        setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    const filters: { id: FilterKey; label: string }[] = [
        { id: 'all', label: t.filterAll },
        { id: 'couple', label: t.filterCouple },
        { id: 'family', label: t.filterFamily },
        { id: 'group', label: t.filterGroup },
    ]

    const selectionLabel =
        picked.length === 0
            ? t.noneSelected
            : `${picked.length} ${t.roomsWord} · ${guestsCount} ${t.guestsWord}`

    return (
        <div
            data-theme="h3"
            style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                background: 'var(--surface)',
                overflowX: 'hidden',
                minHeight: '100vh',
            }}
        >
            <Header data={data} locale={locale} />

            {/* ---- hero: dải 3 ảnh, chữ căn giữa ---- */}
            <section
                style={{
                    position: 'relative',
                    height: 380,
                    background: 'var(--brand)',
                    overflow: 'hidden',
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 6,
                    }}
                >
                    {data.rooms.slice(0, 3).map((room, i) => (
                        <div
                            key={room.id}
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                // Ô giữa lệch xuống 34px — nhịp so le của prototype.
                                marginTop: i === 1 ? 34 : 0,
                                background: 'var(--brand-dark)',
                            }}
                        >
                            {room.images?.[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={room.images[0]}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--overlay-scrim)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        position: 'relative',
                        height: '100%',
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: '132px var(--space-6) var(--space-8)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <nav
                        aria-label="Breadcrumb"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-inverse)',
                            opacity: 0.78,
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        <a href={themeRoot(SLUG)} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {t.home}
                        </a>
                        <span aria-hidden="true">/</span>
                        <span aria-current="page" style={{ opacity: 1 }}>
                            {t.pageTitle}
                        </span>
                    </nav>

                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-3xl)',
                            lineHeight: 1.12,
                            fontWeight: 800,
                            color: 'var(--text-inverse)',
                            margin: '0 0 var(--space-3)',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {t.pageTitle}
                    </h1>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            lineHeight: 1.62,
                            color: 'var(--text-inverse)',
                            opacity: 0.85,
                            margin: 0,
                            maxWidth: 600,
                        }}
                    >
                        {t.pageSub}
                    </p>
                </div>
            </section>

            {/* ---- danh sách ---- */}
            <section
                id="rooms"
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8) var(--space-6) var(--space-20)',
                    scrollMarginTop: '80px',
                }}
            >
                <div
                    className="h3-rooms-layout"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    {/* ---- cột trái: aside dính ---- */}
                    <aside
                        className="h3-rooms-aside"
                        style={{ display: 'grid', gap: 'var(--space-3)' }}
                    >
                        {/* khối "đang chọn" */}
                        <div
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--brand)',
                                padding: 'var(--space-5)',
                            }}
                        >
                            <div style={{ ...KICKER, color: 'var(--accent)' }}>{t.yourSelection}</div>
                            <div
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 800,
                                    color: 'var(--text-inverse)',
                                    marginBottom: 'var(--space-3)',
                                }}
                            >
                                {selectionLabel}
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 7,
                                    paddingTop: 'var(--space-3)',
                                    borderTop: '1px solid var(--overlay-line)',
                                }}
                            >
                                <SumRow label={t.roomsTotal} value={formatPrice(roomsSubtotal, locale)} />
                                <SumRow label={t.addonsTotal} value={formatPrice(addonsSubtotal, locale)} />
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        justifyContent: 'space-between',
                                        paddingTop: 'var(--space-2)',
                                        marginTop: 4,
                                        borderTop: '1px solid var(--overlay-line)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 800,
                                            color: 'var(--text-inverse)',
                                        }}
                                    >
                                        {t.total}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 800,
                                            color: 'var(--accent)',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {formatPrice(total, locale)}
                                    </span>
                                </div>
                            </div>

                            <a
                                href={themePath(SLUG, 'checkout')}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: 'var(--space-4)',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 800,
                                    textDecoration: 'none',
                                }}
                            >
                                {t.goCheckout}
                            </a>
                        </div>

                        {/* khối lọc + sắp xếp */}
                        <div style={PANEL}>
                            <div style={{ ...KICKER, color: 'var(--accent-dark)' }}>{t.filterTitle}</div>
                            <div
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-2)',
                                    marginBottom: 'var(--space-4)',
                                }}
                            >
                                {filters.map((item) => {
                                    const active = filter === item.id
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setFilter(item.id)}
                                            aria-pressed={active}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: 'var(--space-3) var(--space-4)',
                                                borderRadius: 'var(--radius-pill)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: 'var(--text-sm)',
                                                fontFamily: 'var(--font-body)',
                                                fontWeight: 700,
                                                minHeight: 40,
                                                background: active ? 'var(--brand)' : 'var(--surface)',
                                                color: active ? 'var(--text-inverse)' : 'var(--brand)',
                                                transition:
                                                    'background var(--duration) var(--ease), color var(--duration) var(--ease)',
                                            }}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-1)',
                                    paddingTop: 'var(--space-3)',
                                    borderTop: '1px solid var(--border-strong)',
                                }}
                            >
                                <label
                                    htmlFor="h3-sort"
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 700,
                                        color: 'var(--brand)',
                                        marginBottom: 'var(--space-1)',
                                    }}
                                >
                                    {t.sortLabel}
                                </label>
                                <select
                                    id="h3-sort"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value as SortKey)}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3)',
                                        border: 'none',
                                        borderRadius: 'var(--radius)',
                                        fontSize: 'var(--text-sm)',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: 700,
                                        color: 'var(--brand)',
                                        background: 'var(--surface)',
                                        minHeight: 40,
                                    }}
                                >
                                    <option value="rec">{t.sortRec}</option>
                                    <option value="asc">{t.sortAsc}</option>
                                    <option value="desc">{t.sortDesc}</option>
                                </select>
                            </div>
                        </div>

                        {/* khối tiện ích */}
                        <div style={PANEL}>
                            <div style={{ ...KICKER, color: 'var(--accent-dark)' }}>{t.addonsTitle}</div>
                            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                {data.addons.map((addon) => (
                                    <label
                                        key={addon.id}
                                        htmlFor={`h3-addon-${addon.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--space-2)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <input
                                            id={`h3-addon-${addon.id}`}
                                            type="checkbox"
                                            checked={!!addons[addon.id]}
                                            onChange={() =>
                                                setAddons((prev) => ({
                                                    ...prev,
                                                    [addon.id]: !prev[addon.id],
                                                }))
                                            }
                                            style={{
                                                margin: '2px 0 0',
                                                width: 16,
                                                height: 16,
                                                accentColor: 'var(--brand)',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span style={{ display: 'grid', gap: 2, flex: 1 }}>
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 700,
                                                    color: 'var(--text)',
                                                }}
                                            >
                                                {pick(addon.name, locale)}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {formatPrice(addon.price, locale)} /{' '}
                                                {pick(addon.unit, locale)}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* ---- cột phải: lưới thẻ ---- */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 'var(--space-4)',
                                flexWrap: 'wrap',
                                marginBottom: 'var(--space-5)',
                            }}
                        >
                            <h2
                                aria-live="polite"
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 800,
                                    color: 'var(--brand)',
                                    margin: 0,
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                {rooms.length} {t.countLabel}
                            </h2>
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                {t.priceNote}
                            </span>
                        </div>

                        <div className="h3-rooms-grid" style={{ display: 'grid', gap: 'var(--space-6)' }}>
                            {rooms.map((room) => {
                                const selected = picked.includes(room.id)
                                return (
                                    <article
                                        key={room.id}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: 'var(--space-5)',
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'var(--surface)',
                                            border: `1px solid ${
                                                selected ? 'var(--brand)' : 'var(--border)'
                                            }`,
                                            boxShadow: selected ? 'var(--shadow)' : undefined,
                                            transition:
                                                'border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'relative',
                                                height: 200,
                                                borderRadius: 'var(--radius-lg)',
                                                overflow: 'hidden',
                                                background: 'var(--surface-tint)',
                                                marginBottom: 'var(--space-4)',
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
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 12,
                                                    left: 12,
                                                    padding: '6px 13px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    background: 'var(--brand)',
                                                    color: 'var(--text-inverse)',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {room.area}
                                            </span>
                                        </div>

                                        <h3
                                            style={{
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 800,
                                                color: 'var(--brand)',
                                                margin: '0 0 7px',
                                                lineHeight: 1.35,
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            {pick(room.name, locale)}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                lineHeight: 1.65,
                                                color: 'var(--text-muted)',
                                                margin: '0 0 var(--space-3)',
                                                flex: 1,
                                            }}
                                        >
                                            {pick(room.desc, locale)}
                                        </p>

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 6,
                                                marginBottom: 'var(--space-3)',
                                            }}
                                        >
                                            {room.tags.map((tag) => (
                                                <span
                                                    key={tag.en}
                                                    style={{
                                                        padding: '4px 11px',
                                                        borderRadius: 'var(--radius-pill)',
                                                        background: 'var(--surface-tint)',
                                                        color: 'var(--brand)',
                                                        fontSize: 'var(--text-xs)',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {pick(tag, locale)}
                                                </span>
                                            ))}
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--text-muted)',
                                                paddingBottom: 'var(--space-3)',
                                                marginBottom: 'var(--space-3)',
                                                borderBottom: '1px solid var(--border)',
                                            }}
                                        >
                                            <span>
                                                {room.guests} {t.guestsWord}
                                            </span>
                                            <span>{t.bedDefault}</span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'space-between',
                                                gap: 'var(--space-3)',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xl)',
                                                        fontWeight: 800,
                                                        color: 'var(--brand)',
                                                        letterSpacing: '-0.025em',
                                                    }}
                                                >
                                                    {formatPrice(room.price, locale)}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    {t.perNight}
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: 'var(--space-2)',
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                <a
                                                    href={roomPath(SLUG, room.id)}
                                                    style={{
                                                        padding: '10px 18px',
                                                        borderRadius: 'var(--radius-pill)',
                                                        border: '1px solid var(--border-strong)',
                                                        color: 'var(--brand)',
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 700,
                                                        whiteSpace: 'nowrap',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    {t.viewDetail}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRoom(room.id)}
                                                    aria-pressed={selected}
                                                    style={{
                                                        padding: '10px 18px',
                                                        borderRadius: 'var(--radius-pill)',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: 'var(--text-sm)',
                                                        fontFamily: 'var(--font-body)',
                                                        fontWeight: 800,
                                                        whiteSpace: 'nowrap',
                                                        minHeight: 40,
                                                        background: selected
                                                            ? 'var(--surface-tint)'
                                                            : 'var(--accent)',
                                                        color: selected ? 'var(--brand)' : 'var(--text)',
                                                        transition:
                                                            'background var(--duration) var(--ease), color var(--duration) var(--ease)',
                                                    }}
                                                >
                                                    {selected ? t.selectedLabel : t.select}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <Contact data={data} locale={locale} />

            <style>{`
                .h3-rooms-grid { grid-template-columns: minmax(0, 1fr); }
                @media (min-width: 720px) {
                    .h3-rooms-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 1040px) {
                    .h3-rooms-layout { grid-template-columns: minmax(0, 270px) minmax(0, 1fr); }
                    .h3-rooms-aside { position: sticky; top: 100px; }
                }
            `}</style>
        </div>
    )
}

function SumRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-inverse)',
                opacity: 0.78,
            }}
        >
            <span>{label}</span>
            <span style={{ fontWeight: 800, opacity: 1 }}>{value}</span>
        </div>
    )
}

const KICKER: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: 'var(--space-2)',
}

const PANEL: CSSProperties = {
    borderRadius: 'var(--radius-lg)',
    background: 'var(--surface-alt)',
    padding: 'var(--space-5)',
}
