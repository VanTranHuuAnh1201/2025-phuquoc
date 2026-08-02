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
 * Trang danh sách hạng phòng mẫu 04 — port từ `Rooms H4 - Nam Du Hill.dc.html`.
 *
 * Bố cục KHÁC cả ba mẫu kia, đúng như prototype:
 *   hero nền sáng, ảnh cắt chéo bên phải (`clip-path`), chữ căn TRÁI
 *   → thanh công cụ ngang (ngày · sắp xếp · số lượng) trên nền nhạt
 *   → hàng nút lọc → lưới thẻ 3 CỘT
 *   → cuối trang là hai khối cạnh nhau: tiện ích (trái) và tóm tắt tiền (phải)
 *
 * Khác mẫu 03 ở chỗ tóm tắt tiền KHÔNG dính bên trái mà nằm cuối trang — đây
 * là chủ ý của prototype, giữ nguyên.
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
    const guestsCount =
        picked.reduce((sum, id) => sum + (roomById[id]?.guests ?? 0), 0) || 2

    const addonsSubtotal = data.addons.reduce((sum, addon) => {
        if (!addons[addon.id]) return sum
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
            data-theme="h4"
            style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                background: 'var(--surface)',
                overflowX: 'hidden',
                minHeight: '100vh',
            }}
        >
            <Header data={data} locale={locale} />

            {/* ---- hero: nền sáng, ảnh cắt chéo bên phải ---- */}
            <section
                style={{
                    position: 'relative',
                    background: 'var(--surface-alt)',
                    padding: '132px var(--space-6) var(--space-12)',
                    overflow: 'hidden',
                }}
            >
                <div
                    aria-hidden="true"
                    className="h4-hero-art"
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '40%',
                        clipPath: 'polygon(28% 0, 100% 0, 100% 100%, 0 100%)',
                        overflow: 'hidden',
                        background: 'var(--surface-tint)',
                    }}
                >
                    {data.rooms[0]?.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={data.rooms[0].images[0]}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}
                </div>

                <div style={{ position: 'relative', maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <div style={{ maxWidth: 'min(54%, 660px)', minWidth: 300 }}>
                        <nav
                            aria-label="Breadcrumb"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            <a
                                href={themeRoot(SLUG)}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                {t.home}
                            </a>
                            <span aria-hidden="true">/</span>
                            <span
                                aria-current="page"
                                style={{ color: 'var(--brand)', fontWeight: 700 }}
                            >
                                {t.pageTitle}
                            </span>
                        </nav>

                        <h1
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-3xl)',
                                lineHeight: 1.08,
                                fontWeight: 900,
                                color: 'var(--brand)',
                                margin: '0 0 var(--space-3)',
                                letterSpacing: '-0.04em',
                            }}
                        >
                            {t.pageTitle}
                        </h1>
                        <p
                            style={{
                                fontSize: 'var(--text-base)',
                                lineHeight: 1.68,
                                color: 'var(--text-muted)',
                                margin: '0 0 var(--space-5)',
                            }}
                        >
                            {t.pageSub}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            {data.facts.map((fact, i) => (
                                <span
                                    key={i}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'baseline',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-2) var(--space-4)',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--surface)',
                                        boxShadow: 'var(--shadow-sm)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-base)',
                                            fontWeight: 900,
                                            color: 'var(--brand)',
                                        }}
                                    >
                                        {fact.value}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {pick(fact.label, locale)}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
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
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    {/* ---- thanh công cụ ---- */}
                    <div
                        className="h4-toolbar"
                        style={{
                            background: 'var(--surface-alt)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-4) var(--space-5)',
                            display: 'grid',
                            gap: 'var(--space-3)',
                            alignItems: 'end',
                            marginBottom: 'var(--space-6)',
                        }}
                    >
                        <DateField id="h4rm-in" label={t.checkIn} />
                        <DateField id="h4rm-out" label={t.checkOut} />

                        <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
                            <label htmlFor="h4rm-sort" style={FIELD_LABEL}>
                                {t.sortLabel}
                            </label>
                            <select
                                id="h4rm-sort"
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortKey)}
                                style={FIELD_INPUT}
                            >
                                <option value="rec">{t.sortRec}</option>
                                <option value="asc">{t.sortAsc}</option>
                                <option value="desc">{t.sortDesc}</option>
                            </select>
                        </div>

                        <span
                            aria-live="polite"
                            style={{
                                padding: 'var(--space-3) var(--space-5)',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--accent)',
                                color: 'var(--text)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 900,
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                            }}
                        >
                            {rooms.length} {t.countLabel}
                        </span>
                    </div>

                    {/* ---- nút lọc ---- */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 'var(--space-2)',
                            flexWrap: 'wrap',
                            marginBottom: 'var(--space-6)',
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
                                        padding: 'var(--space-2) var(--space-5)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: `1px solid ${
                                            active ? 'transparent' : 'var(--border-strong)'
                                        }`,
                                        cursor: 'pointer',
                                        fontSize: 'var(--text-sm)',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: 800,
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

                    {/* ---- lưới thẻ 3 cột ---- */}
                    <div
                        className="h4-rooms-grid"
                        style={{
                            display: 'grid',
                            gap: 'var(--space-6)',
                            marginBottom: 'var(--space-12)',
                        }}
                    >
                        {rooms.map((room) => {
                            const selected = picked.includes(room.id)
                            return (
                                <article
                                    key={room.id}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 'var(--radius)',
                                        overflow: 'hidden',
                                        background: 'var(--surface)',
                                        border: `1px solid ${
                                            selected ? 'var(--accent)' : 'var(--border)'
                                        }`,
                                        boxShadow: selected ? 'var(--shadow)' : 'var(--shadow-sm)',
                                        transition:
                                            'border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            height: 210,
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
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: 14,
                                                left: 14,
                                                padding: '6px 13px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--accent)',
                                                color: 'var(--text)',
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 900,
                                            }}
                                        >
                                            {formatPrice(room.price, locale)}
                                        </span>
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: 14,
                                                right: 14,
                                                padding: '6px 13px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--brand)',
                                                color: 'var(--text-inverse)',
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 800,
                                            }}
                                        >
                                            {room.area}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            padding: 'var(--space-5)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flex: 1,
                                        }}
                                    >
                                        <h2
                                            style={{
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 900,
                                                color: 'var(--brand)',
                                                margin: '0 0 var(--space-2)',
                                                lineHeight: 1.35,
                                                letterSpacing: '-0.025em',
                                            }}
                                        >
                                            {pick(room.name, locale)}
                                        </h2>
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
                                                        borderRadius: 'var(--radius-sm)',
                                                        background: 'var(--surface-alt)',
                                                        color: 'var(--brand-light)',
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
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <a
                                                href={roomPath(SLUG, room.id)}
                                                style={{
                                                    flex: 1,
                                                    textAlign: 'center',
                                                    padding: 'var(--space-3) var(--space-4)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--surface-alt)',
                                                    color: 'var(--brand)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 800,
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
                                                    padding: 'var(--space-3) var(--space-5)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: 'var(--text-sm)',
                                                    fontFamily: 'var(--font-body)',
                                                    fontWeight: 900,
                                                    whiteSpace: 'nowrap',
                                                    minHeight: 40,
                                                    background: selected
                                                        ? 'var(--surface-tint)'
                                                        : 'var(--accent)',
                                                    color: 'var(--text)',
                                                    transition:
                                                        'background var(--duration) var(--ease)',
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

                    {/* ---- tiện ích + tóm tắt ---- */}
                    <div
                        className="h4-summary-layout"
                        style={{ display: 'grid', gap: 'var(--space-6)', alignItems: 'start' }}
                    >
                        <div
                            style={{
                                borderRadius: 'var(--radius)',
                                background: 'var(--surface-alt)',
                                padding: 'var(--space-8)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 900,
                                    color: 'var(--accent-dark)',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {t.addonsTitle}
                            </div>
                            <h2
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 900,
                                    color: 'var(--brand)',
                                    margin: '0 0 var(--space-1)',
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                {t.addonsHeadline}
                            </h2>
                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    lineHeight: 1.65,
                                    color: 'var(--text-muted)',
                                    margin: '0 0 var(--space-5)',
                                    maxWidth: 520,
                                }}
                            >
                                {t.addonsSub}
                            </p>

                            <div className="h4-addons-grid" style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                {data.addons.map((addon) => {
                                    const on = !!addons[addon.id]
                                    return (
                                        <label
                                            key={addon.id}
                                            htmlFor={`h4-addon-${addon.id}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-3)',
                                                padding: 'var(--space-3) var(--space-4)',
                                                borderRadius: 'var(--radius-sm)',
                                                background: on ? 'var(--surface-tint)' : 'var(--surface)',
                                                border: `1px solid ${
                                                    on ? 'var(--accent)' : 'var(--border)'
                                                }`,
                                                cursor: 'pointer',
                                                transition:
                                                    'background var(--duration) var(--ease), border-color var(--duration) var(--ease)',
                                            }}
                                        >
                                            <input
                                                id={`h4-addon-${addon.id}`}
                                                type="checkbox"
                                                checked={on}
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
                                                    accentColor: 'var(--accent)',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span style={{ display: 'grid', gap: 2, flex: 1 }}>
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 800,
                                                        color: 'var(--brand)',
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
                                    )
                                })}
                            </div>
                        </div>

                        {/* ---- tóm tắt tiền ---- */}
                        <div
                            style={{
                                borderRadius: 'var(--radius)',
                                background: 'var(--brand)',
                                padding: 'var(--space-8)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 900,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'var(--accent)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {t.yourSelection}
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 900,
                                    color: 'var(--text-inverse)',
                                    marginBottom: 'var(--space-5)',
                                }}
                            >
                                {selectionLabel}
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-2)',
                                    paddingTop: 'var(--space-4)',
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
                                        paddingTop: 'var(--space-3)',
                                        marginTop: 4,
                                        borderTop: '1px solid var(--overlay-line)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 900,
                                            color: 'var(--text-inverse)',
                                        }}
                                    >
                                        {t.total}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 900,
                                            color: 'var(--accent)',
                                            letterSpacing: '-0.03em',
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
                                    marginTop: 'var(--space-5)',
                                    padding: 'var(--space-4)',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 900,
                                    textDecoration: 'none',
                                }}
                            >
                                {t.goCheckout}
                            </a>

                            <button
                                type="button"
                                onClick={() => setPicked([])}
                                style={{
                                    width: '100%',
                                    marginTop: 'var(--space-2)',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid var(--overlay-line)',
                                    background: 'transparent',
                                    color: 'var(--text-inverse)',
                                    fontSize: 'var(--text-sm)',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    minHeight: 44,
                                }}
                            >
                                {t.clear}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Contact data={data} locale={locale} />

            <style>{`
                .h4-rooms-grid { grid-template-columns: minmax(0, 1fr); }
                .h4-addons-grid { grid-template-columns: minmax(0, 1fr); }
                .h4-toolbar { grid-template-columns: minmax(0, 1fr); }
                @media (min-width: 640px) {
                    .h4-rooms-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h4-addons-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h4-toolbar { grid-template-columns: repeat(3, minmax(0, 1fr)) auto; }
                }
                @media (min-width: 1040px) {
                    .h4-rooms-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .h4-summary-layout { grid-template-columns: minmax(0, 1fr) minmax(0, 380px); }
                }
                /* Ảnh cắt chéo chỉ hợp lý khi còn đủ bề ngang cho chữ. */
                @media (max-width: 860px) {
                    .h4-hero-art { display: none; }
                }
            `}</style>
        </div>
    )
}

function DateField({ id, label }: { id: string; label: string }) {
    return (
        <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
            <label htmlFor={id} style={FIELD_LABEL}>
                {label}
            </label>
            <input id={id} type="date" style={FIELD_INPUT} />
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
            <span style={{ fontWeight: 900, opacity: 1 }}>{value}</span>
        </div>
    )
}

const FIELD_LABEL: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--brand)',
}

const FIELD_INPUT: CSSProperties = {
    width: '100%',
    padding: 'var(--space-3)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    background: 'var(--surface)',
    color: 'var(--text)',
    minHeight: 44,
}
