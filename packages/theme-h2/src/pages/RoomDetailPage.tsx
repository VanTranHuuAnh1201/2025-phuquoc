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

interface RoomDetailPageProps {
    data: PropertyData
    locale: Locale
    roomSlug?: string
}

export function RoomDetailPage({ data, locale, roomSlug }: RoomDetailPageProps) {
    const t = ui[locale]

    // Find requested room or fallback to first room
    const room = useMemo(() => {
        if (roomSlug) {
            const found = data.rooms.find((r) => r.id === roomSlug)
            if (found) return found
        }
        return data.rooms[0]!
    }, [data.rooms, roomSlug])

    const extraInfo = useMemo(() => {
        const info = data.roomExtras?.[room.id]
        if (info) return info

        const defaultTag = room.tags[0] || { vi: 'View biển', en: 'Sea view' }
        return {
            maxGuests: room.guests + 2,
            defaultGuests: room.guests,
            extraBed: 450000,
            bed: pick(room.desc, locale),
            view: pick(defaultTag, locale),
            long: pick(room.desc, locale),
            long2: '',
            amenities: [
                t.specArea,
                t.specGuests,
                t.specBed,
                t.specView,
            ],
            conditions: [
                'Huỷ miễn phí trước 72 giờ so với ngày nhận phòng.',
                'Đổi lịch miễn phí nếu tàu cao tốc ngừng chạy do biển động.',
                'Nhận phòng từ 14:00, trả phòng trước 12:00.',
                'Vui lòng mang CCCD hoặc hộ chiếu để làm thủ tục lên tàu.',
            ],
        }
    }, [data.roomExtras, room, locale, t])

    const [nights, setNights] = useState(1)
    const [guests, setGuests] = useState(extraInfo.defaultGuests || room.guests)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
        'addon-ferry': true,
    })

    const extraGuestsCount = Math.max(0, guests - (extraInfo.defaultGuests || room.guests))
    const extraBedSurcharge = extraGuestsCount * (extraInfo.extraBed || 450000) * nights
    const roomSubtotal = room.price * nights

    const addonsSubtotal = useMemo(() => {
        return data.addons.reduce((sum, a) => {
            if (!selectedAddons[a.id] || !a.price) return sum
            const multiplier = a.id === 'addon-bike' ? nights : guests
            return sum + a.price * multiplier
        }, 0)
    }, [data.addons, selectedAddons, nights, guests])

    const totalEstimate = roomSubtotal + extraBedSurcharge + addonsSubtotal

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const otherRooms = useMemo(
        () => data.rooms.filter((r) => r.id !== room.id).slice(0, 3),
        [data.rooms, room.id]
    )

    const checkoutUrl = `${themePath(SLUG, 'checkout')}?room=${room.id}&guests=${guests}&nights=${nights}&checkin=${checkIn}&checkout=${checkOut}`

    const bedText = typeof extraInfo.bed === 'string' ? extraInfo.bed : pick(extraInfo.bed, locale)
    const viewText = typeof extraInfo.view === 'string' ? extraInfo.view : pick(extraInfo.view, locale)

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

            {/* Header Hero */}
            <section
                style={{
                    background: 'var(--brand-dark)',
                    color: 'var(--surface)',
                    padding: 'calc(var(--space-20) + var(--space-12)) var(--space-6) var(--space-10)',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            color: 'rgba(255,255,255,0.72)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <a
                            href={themeRoot(SLUG)}
                            style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
                        >
                            {t.home}
                        </a>
                        <span>/</span>
                        <a
                            href={themePath(SLUG, 'rooms')}
                            style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
                        >
                            {t.roomsPage}
                        </a>
                        <span>/</span>
                        <span style={{ color: 'var(--surface)' }}>{pick(room.name, locale)}</span>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: 'var(--space-2)',
                            flexWrap: 'wrap',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {room.tags.map((tag) => (
                            <span
                                key={tag.en}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--overlay-soft)',
                                    color: 'var(--accent)',
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
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: 'var(--space-4)',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    fontWeight: 800,
                                    lineHeight: 1.2,
                                    margin: '0 0 var(--space-2)',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {pick(room.name, locale)}
                            </h1>
                            <p
                                style={{
                                    fontSize: 'var(--text-base)',
                                    color: 'rgba(255,255,255,0.8)',
                                    margin: 0,
                                }}
                            >
                                {pick(room.desc, locale)}
                            </p>
                        </div>

                        <div>
                            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent)' }}>
                                {formatPrice(room.price, locale)}
                            </span>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.74)', marginLeft: 6 }}>
                                / {t.perNight}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section style={{ background: 'var(--surface-tint)', padding: 'var(--space-8) var(--space-6)' }}>
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                            gap: 'var(--space-4)',
                            borderRadius: 24,
                            overflow: 'hidden',
                        }}
                    >
                        <ImageSlot
                            placeholder={`${pick(room.name, locale)} - Main View`}
                            src={room.images?.[0]}
                            height={340}
                            style={{ borderRadius: 16 }}
                        />
                        <ImageSlot
                            placeholder={`${pick(room.name, locale)} - Balcony View`}
                            src={room.images?.[1]}
                            height={340}
                            style={{ borderRadius: 16 }}
                        />
                    </div>
                </div>
            </section>

            {/* Detail Content & Sticky Sidebar */}
            <section style={{ background: 'var(--surface)', padding: 'var(--space-12) var(--space-6) var(--space-20)', flex: 1 }}>
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    {/* Left Details Column */}
                    <div>
                        {/* Specs Grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: 'var(--space-3)',
                                padding: 'var(--space-6)',
                                borderRadius: 20,
                                background: 'var(--surface-tint)',
                                marginBottom: 'var(--space-8)',
                            }}
                        >
                            <div>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block' }}>
                                    {t.specArea}
                                </span>
                                <strong style={{ fontSize: 'var(--text-base)', color: 'var(--brand)' }}>{room.area}</strong>
                            </div>
                            <div>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block' }}>
                                    {t.specGuests}
                                </span>
                                <strong style={{ fontSize: 'var(--text-base)', color: 'var(--brand)' }}>
                                    {room.guests} {t.guestsWord} (max {extraInfo.maxGuests || room.guests + 2})
                                </strong>
                            </div>
                            <div>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block' }}>
                                    {t.specBed}
                                </span>
                                <strong style={{ fontSize: 'var(--text-base)', color: 'var(--brand)' }}>
                                    {bedText}
                                </strong>
                            </div>
                            <div>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block' }}>
                                    {t.specView}
                                </span>
                                <strong style={{ fontSize: 'var(--text-base)', color: 'var(--brand)' }}>
                                    {viewText}
                                </strong>
                            </div>
                        </div>

                        {/* Room Description */}
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                                {t.descKicker}
                            </div>
                            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--brand)', margin: '0 0 var(--space-4)' }}>
                                {t.descTitle}
                            </h2>
                            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                                {typeof extraInfo.long === 'string' ? extraInfo.long : pick(extraInfo.long, locale)}
                            </p>
                            {extraInfo.long2 && (
                                <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                                    {typeof extraInfo.long2 === 'string' ? extraInfo.long2 : pick(extraInfo.long2, locale)}
                                </p>
                            )}
                        </div>

                        {/* Amenities */}
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                                {t.amenitiesKicker}
                            </div>
                            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--brand)', margin: '0 0 var(--space-5)' }}>
                                {t.amenitiesTitle}
                            </h2>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: 'var(--space-3)',
                                }}
                            >
                                {extraInfo.amenities.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-3) var(--space-4)',
                                            borderRadius: 'var(--radius)',
                                            background: 'var(--surface-tint)',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--brand)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        <span style={{ color: 'var(--brand)', fontWeight: 800 }}>✓</span>
                                        <span>{typeof item === 'string' ? item : pick(item, locale)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conditions */}
                        <div
                            style={{
                                padding: 'var(--space-6)',
                                borderRadius: 20,
                                background: 'var(--surface-tint)',
                                marginBottom: 'var(--space-12)',
                            }}
                        >
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--brand)', margin: '0 0 var(--space-4)' }}>
                                {t.conditionsTitle}
                            </h3>
                            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                {extraInfo.conditions.map((cond: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--brand)' }}>•</span>
                                        <span>{typeof cond === 'string' ? cond : pick(cond, locale)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Other Rooms */}
                        <div>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--brand)', margin: '0 0 var(--space-5)' }}>
                                {t.otherRooms}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                                {otherRooms.map((or) => (
                                    <a
                                        key={or.id}
                                        href={roomPath(SLUG, or.id)}
                                        style={{
                                            padding: 'var(--space-4)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border)',
                                            background: 'var(--surface)',
                                            textDecoration: 'none',
                                            display: 'block',
                                            transition: 'all 150ms ease',
                                        }}
                                    >
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--brand)', marginBottom: 4 }}>
                                            {pick(or.name, locale)}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>
                                            {or.area} · {or.guests} {t.guestsWord}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--brand)' }}>
                                            {formatPrice(or.price, locale)}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sticky Sidebar Booking Form */}
                    <aside style={{ position: 'sticky', top: 100 }}>
                        <div
                            style={{
                                borderRadius: 30,
                                background: 'var(--surface-tint)',
                                padding: 'var(--space-6) var(--space-6)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow)',
                            }}
                        >
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--brand)', margin: '0 0 var(--space-4)' }}>
                                {t.bookTitle}
                            </h3>

                            {/* Dates Selection */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <div>
                                    <label htmlFor="h2rd-in" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)', display: 'block', marginBottom: 4 }}>
                                        {t.checkIn}
                                    </label>
                                    <input
                                        id="h2rd-in"
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--border)',
                                            fontSize: 'var(--text-xs)',
                                            background: 'var(--surface)',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="h2rd-out" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)', display: 'block', marginBottom: 4 }}>
                                        {t.checkOut}
                                    </label>
                                    <input
                                        id="h2rd-out"
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--border)',
                                            fontSize: 'var(--text-xs)',
                                            background: 'var(--surface)',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Nights Selector */}
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)', display: 'block', marginBottom: 4 }}>
                                    {t.nights}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setNights(Math.max(1, nights - 1))}
                                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--surface-tint)', cursor: 'pointer', fontWeight: 800 }}
                                    >
                                        −
                                    </button>
                                    <span style={{ fontWeight: 800, color: 'var(--brand)', fontSize: 'var(--text-sm)' }}>
                                        {nights} {t.nightsWord}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setNights(nights + 1)}
                                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--accent)', cursor: 'pointer', fontWeight: 800 }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Guests Selector */}
                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)', display: 'block', marginBottom: 4 }}>
                                    {t.guests}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--surface-tint)', cursor: 'pointer', fontWeight: 800 }}
                                    >
                                        −
                                    </button>
                                    <span style={{ fontWeight: 800, color: 'var(--brand)', fontSize: 'var(--text-sm)' }}>
                                        {guests} {t.guestsWord}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setGuests(Math.min(extraInfo.maxGuests || 10, guests + 1))}
                                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--accent)', cursor: 'pointer', fontWeight: 800 }}
                                    >
                                        +
                                    </button>
                                </div>
                                {extraGuestsCount > 0 && (
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--brand)', display: 'block', marginTop: 4 }}>
                                        + {t.extraBedLabel}: {formatPrice(extraBedSurcharge, locale)}
                                    </span>
                                )}
                            </div>

                            {/* Addons Selection */}
                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)', marginBottom: 8 }}>
                                    {t.addonsTitle}
                                </div>
                                <div style={{ display: 'grid', gap: 8 }}>
                                    {data.addons.slice(0, 4).map((a) => {
                                        const active = !!selectedAddons[a.id]
                                        return (
                                            <label
                                                key={a.id}
                                                htmlFor={`addon-sidebar-${a.id}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    fontSize: 'var(--text-xs)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <input
                                                    id={`addon-sidebar-${a.id}`}
                                                    type="checkbox"
                                                    checked={active}
                                                    onChange={() => toggleAddon(a.id)}
                                                    style={{ accentColor: 'var(--brand)' }}
                                                />
                                                <span style={{ flex: 1, color: 'var(--text)' }}>{pick(a.name, locale)}</span>
                                                <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                                                    {a.price ? formatPrice(a.price, locale) : pick(a.unit, locale)}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Subtotal */}
                            <div style={{ padding: 'var(--space-4) 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-5)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>
                                    <span>{t.roomsTotal}</span>
                                    <span>{formatPrice(roomSubtotal, locale)}</span>
                                </div>
                                {extraBedSurcharge > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>
                                        <span>{t.extraBedLabel}</span>
                                        <span>{formatPrice(extraBedSurcharge, locale)}</span>
                                    </div>
                                )}
                                {addonsSubtotal > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>
                                        <span>{t.addonsTotal}</span>
                                        <span>{formatPrice(addonsSubtotal, locale)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--brand)', marginTop: 8 }}>
                                    <span>{t.subtotal}</span>
                                    <span>{formatPrice(totalEstimate, locale)}</span>
                                </div>
                            </div>

                            <a
                                href={checkoutUrl}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: '14px',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 800,
                                    textDecoration: 'none',
                                    marginBottom: 'var(--space-3)',
                                }}
                            >
                                {t.goCheckout} →
                            </a>

                            <a
                                href={themePath(SLUG, 'rooms')}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--brand)',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                {t.backToRooms}
                            </a>
                        </div>
                    </aside>
                </div>
            </section>

            <Contact data={data} locale={locale} />
        </div>
    )
}
