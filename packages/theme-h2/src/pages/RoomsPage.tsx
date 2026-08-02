'use client'

import { useMemo, useState } from 'react'
import {
    formatPrice,
    pick,
    roomPath,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'
import { Header } from '../sections/Header'
import { Contact } from '../sections/Contact'

const SLUG = meta.slug

interface RoomsPageProps {
    data: PropertyData
    locale: Locale
}

export function RoomsPage({ data, locale }: RoomsPageProps) {
    const t = ui[locale]
    const isVi = locale === 'vi'

    const [filterCategory, setFilterCategory] = useState<'all' | 'couple' | 'family' | 'group'>('all')
    const [sortBy, setSortBy] = useState<'rec' | 'asc' | 'desc'>('rec')
    const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([])
    const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
        'addon-ferry': true,
    })

    const filteredRooms = useMemo(() => {
        let list = [...data.rooms]

        if (filterCategory === 'couple') {
            list = list.filter((r) => r.guests <= 3)
        } else if (filterCategory === 'family') {
            list = list.filter((r) => r.guests >= 4 && r.guests <= 6)
        } else if (filterCategory === 'group') {
            list = list.filter((r) => r.guests >= 6)
        }

        if (sortBy === 'asc') {
            list.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'desc') {
            list.sort((a, b) => b.price - a.price)
        }

        return list
    }, [data.rooms, filterCategory, sortBy])

    const toggleRoom = (id: string) => {
        setSelectedRoomIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const selectedRooms = useMemo(
        () => data.rooms.filter((r) => selectedRoomIds.includes(r.id)),
        [data.rooms, selectedRoomIds]
    )

    const totalGuests = useMemo(
        () => selectedRooms.reduce((sum, r) => sum + r.guests, 0),
        [selectedRooms]
    )

    const roomsSubtotal = useMemo(
        () => selectedRooms.reduce((sum, r) => sum + r.price, 0),
        [selectedRooms]
    )

    const addonsSubtotal = useMemo(() => {
        const guestCount = totalGuests || 1
        return data.addons.reduce((sum, a) => {
            if (!selectedAddons[a.id] || !a.price) return sum
            const multiplier = a.id === 'addon-bike' ? 1 : guestCount
            return sum + a.price * multiplier
        }, 0)
    }, [data.addons, selectedAddons, totalGuests])

    const grandTotal = roomsSubtotal + addonsSubtotal

    return (
        <div
            style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                background: 'var(--surface)',
                overflowX: 'hidden',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Header data={data} locale={locale} />

            {/* Hero Header */}
            <section
                style={{
                    background: 'var(--brand)',
                    padding: 'calc(var(--space-20) + var(--space-12)) var(--space-6) var(--space-12)',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--overlay-soft)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <a
                            href={themeRoot(SLUG)}
                            style={{ color: 'rgba(255,255,255,0.76)', textDecoration: 'none' }}
                        >
                            {t.home}
                        </a>
                        <span>/</span>
                        <span style={{ color: 'var(--surface)' }}>{t.roomsPageTitle}</span>
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                            lineHeight: 1.15,
                            fontWeight: 800,
                            color: 'var(--surface)',
                            margin: '0 0 var(--space-3)',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {t.roomsPageTitle}
                    </h1>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'rgba(255,255,255,0.84)',
                            margin: '0 0 var(--space-6)',
                            maxWidth: '680px',
                            lineHeight: 1.6,
                        }}
                    >
                        {t.roomsPageSub}
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: 'var(--space-3)',
                            flexWrap: 'wrap',
                        }}
                    >
                        {data.facts.map((fact, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    background: 'var(--overlay-soft)',
                                    padding: 'var(--space-2) var(--space-4)',
                                    borderRadius: 'var(--radius-pill)',
                                    color: 'var(--surface)',
                                    fontSize: 'var(--text-xs)',
                                }}
                            >
                                <span style={{ fontWeight: 800, color: 'var(--accent)' }}>
                                    {fact.value}
                                </span>
                                <span>{pick(fact.label, locale)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter & Listing Section */}
            <section
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8) var(--space-6) var(--space-20)',
                    flex: 1,
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    {/* Controls Bar */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 'var(--space-4)',
                            flexWrap: 'wrap',
                            marginBottom: 'var(--space-8)',
                            paddingBottom: 'var(--space-4)',
                            borderBottom: '1px solid var(--border)',
                        }}
                    >
                        {/* Filter Tabs */}
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-2)',
                                flexWrap: 'wrap',
                            }}
                        >
                            {[
                                { key: 'all', label: t.filterAll },
                                { key: 'couple', label: t.filterCouple },
                                { key: 'family', label: t.filterFamily },
                                { key: 'group', label: t.filterGroup },
                            ].map((tab) => {
                                const active = filterCategory === tab.key
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setFilterCategory(tab.key as any)}
                                        style={{
                                            padding: 'var(--space-2) var(--space-4)',
                                            borderRadius: 'var(--radius-pill)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 700,
                                            background: active ? 'var(--brand)' : 'var(--surface-tint)',
                                            color: active ? 'var(--surface)' : 'var(--brand)',
                                            transition: 'all 150ms ease',
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Sort & Count */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-4)',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-muted)',
                                    fontWeight: 600,
                                }}
                            >
                                {filteredRooms.length} {t.countLabel}
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <label
                                    htmlFor="rooms-sort-select"
                                    style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}
                                >
                                    {t.sortLabel}:
                                </label>
                                <select
                                    id="rooms-sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    style={{
                                        padding: 'var(--space-2) var(--space-3)',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 600,
                                        color: 'var(--brand)',
                                        background: 'var(--surface)',
                                        outline: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="rec">{t.sortRec}</option>
                                    <option value="asc">{t.sortAsc}</option>
                                    <option value="desc">{t.sortDesc}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Room Cards Grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
                            gap: 'var(--space-6)',
                            marginBottom: 'var(--space-12)',
                        }}
                    >
                        {filteredRooms.map((room) => {
                            const isSelected = selectedRoomIds.includes(room.id)
                            const roomUrl = roomPath(SLUG, room.id)

                            return (
                                <article
                                    key={room.id}
                                    style={{
                                        borderRadius: 30,
                                        background: isSelected ? 'var(--surface-tint)' : 'var(--surface)',
                                        border: isSelected
                                            ? '2px solid var(--brand)'
                                            : '1px solid var(--border)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 200ms ease',
                                        boxShadow: isSelected ? 'var(--shadow)' : 'none',
                                    }}
                                >
                                    <div style={{ margin: '10px 10px 0', position: 'relative' }}>
                                        <ImageSlot
                                            placeholder={pick(room.name, locale)}
                                            src={room.images?.[0]}
                                            height={220}
                                            style={{
                                                borderRadius: 22,
                                                background: 'var(--surface-tint)',
                                            }}
                                        />
                                        {isSelected && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    background: 'var(--brand)',
                                                    color: 'var(--surface)',
                                                    padding: '4px 12px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 800,
                                                }}
                                            >
                                                ✓ {t.selectedBadge}
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            padding: 'var(--space-5) var(--space-6) var(--space-6)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flex: 1,
                                        }}
                                    >
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

                                        <h3
                                            style={{
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 800,
                                                color: 'var(--brand)',
                                                margin: '0 0 var(--space-2)',
                                                lineHeight: 1.35,
                                            }}
                                        >
                                            <a
                                                href={roomUrl}
                                                style={{ color: 'inherit', textDecoration: 'none' }}
                                            >
                                                {pick(room.name, locale)}
                                            </a>
                                        </h3>

                                        <p
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                lineHeight: 1.6,
                                                color: 'var(--text-muted)',
                                                margin: '0 0 var(--space-4)',
                                                flex: 1,
                                            }}
                                        >
                                            {pick(room.desc, locale)}
                                        </p>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 'var(--space-4)',
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--text-muted)',
                                                paddingBottom: 'var(--space-3)',
                                                marginBottom: 'var(--space-4)',
                                                borderBottom: '1px solid var(--border)',
                                            }}
                                        >
                                            <span>
                                                📐 <strong>{room.area}</strong>
                                            </span>
                                            <span>
                                                👥 <strong>{room.guests} {t.guestsWord}</strong>
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 'var(--space-3)',
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xl)',
                                                        fontWeight: 800,
                                                        color: 'var(--brand)',
                                                        letterSpacing: '-0.02em',
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
                                                }}
                                            >
                                                <a
                                                    href={roomUrl}
                                                    style={{
                                                        padding: '10px 16px',
                                                        borderRadius: 'var(--radius-pill)',
                                                        border: '1px solid var(--brand)',
                                                        background: 'transparent',
                                                        color: 'var(--brand)',
                                                        fontSize: 'var(--text-xs)',
                                                        fontWeight: 700,
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    {t.viewDetail}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRoom(room.id)}
                                                    style={{
                                                        padding: '10px 18px',
                                                        borderRadius: 'var(--radius-pill)',
                                                        border: 'none',
                                                        background: isSelected
                                                            ? 'var(--brand)'
                                                            : 'var(--accent)',
                                                        color: isSelected
                                                            ? 'var(--surface)'
                                                            : 'var(--text)',
                                                        fontSize: 'var(--text-xs)',
                                                        fontWeight: 800,
                                                        cursor: 'pointer',
                                                        transition: 'all 150ms ease',
                                                    }}
                                                >
                                                    {isSelected ? t.deselectRoom : t.selectRoom}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>

                    {/* Addons Section */}
                    <div
                        style={{
                            background: 'var(--surface-tint)',
                            borderRadius: 30,
                            padding: 'var(--space-8) var(--space-8)',
                            marginBottom: 'var(--space-12)',
                        }}
                    >
                        <div style={{ marginBottom: 'var(--space-6)' }}>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    color: 'var(--brand)',
                                    letterSpacing: '0.08em',
                                    marginBottom: 4,
                                }}
                            >
                                {t.addonsTitle}
                            </div>
                            <h2
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 800,
                                    color: 'var(--brand)',
                                    margin: '0 0 var(--space-2)',
                                }}
                            >
                                {t.addonsHeadline}
                            </h2>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                                {t.addonsSub}
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                                gap: 'var(--space-4)',
                            }}
                        >
                            {data.addons.map((addon) => {
                                const active = !!selectedAddons[addon.id]
                                return (
                                    <label
                                        key={addon.id}
                                        htmlFor={`addon-check-${addon.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-4) var(--space-4)',
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'var(--surface)',
                                            border: active
                                                ? '2px solid var(--brand)'
                                                : '1px solid var(--border)',
                                            cursor: 'pointer',
                                            transition: 'all 150ms ease',
                                        }}
                                    >
                                        <input
                                            id={`addon-check-${addon.id}`}
                                            type="checkbox"
                                            checked={active}
                                            onChange={() => toggleAddon(addon.id)}
                                            style={{
                                                width: 18,
                                                height: 18,
                                                accentColor: 'var(--brand)',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 700,
                                                    color: 'var(--brand)',
                                                }}
                                            >
                                                {pick(addon.name, locale)}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {addon.price
                                                    ? `${formatPrice(addon.price, locale)} / ${pick(addon.unit, locale)}`
                                                    : pick(addon.unit, locale)}
                                            </div>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Fixed Selection Summary Bar */}
            {selectedRooms.length > 0 && (
                <aside
                    aria-label="Room Selection Bar"
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 70,
                        background: 'var(--brand)',
                        color: 'var(--surface)',
                        boxShadow: 'var(--shadow-lg)',
                        padding: 'var(--space-4) var(--space-6)',
                        borderTop: '2px solid var(--accent)',
                    }}
                >
                    <div
                        style={{
                            maxWidth: 'var(--container)',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 'var(--space-4)',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div>
                                <span
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'rgba(255,255,255,0.8)',
                                        display: 'block',
                                    }}
                                >
                                    {t.yourSelection} ({selectedRooms.length} phòng · {totalGuests} {t.guestsWord})
                                </span>
                                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--accent)' }}>
                                    {formatPrice(grandTotal, locale)}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <button
                                type="button"
                                onClick={() => setSelectedRoomIds([])}
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    background: 'transparent',
                                    color: 'var(--surface)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                {t.clearAll}
                            </button>
                            <a
                                href={`${themePath(SLUG, 'checkout')}?rooms=${selectedRoomIds.join(',')}`}
                                style={{
                                    padding: '12px 28px',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 800,
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {t.goCheckout} →
                            </a>
                        </div>
                    </div>
                </aside>
            )}

            <Contact data={data} locale={locale} />
        </div>
    )
}
