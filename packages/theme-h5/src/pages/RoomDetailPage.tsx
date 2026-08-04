'use client'

import { useMemo, useState } from 'react'
import {
    buildQuote,
    childPolicy,
    formatPrice,
    pick,
    promotions,
    ratePlans,
    seasons,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
    type Quote,
} from '@repo/core'

import { meta } from '../meta'
import { fill, fitFor, ui } from '../strings'
import { BaseCss } from '../components/base'
import { IconCheck, IconClose, IconFerry } from '../components/icons'
import { ZaloFab } from '../components/ZaloFab'
import { roomCover, roomGallery } from '../components/photos'
import { SearchFields } from '../components/SearchWidget'
import {
    searchQuery,
    shortDate,
    toGuestCount,
    todayKey,
    useStaySearch,
    type StaySearch,
} from '../components/search'
import { Header } from '../sections/Header'
import { Contact } from '../sections/Contact'

/**
 * Trang `/h5/rooms/[id]` — trang MỚI HOÀN TOÀN so với site cũ (chỉ có popup
 * AJAX), lấp khoảng trống SEO lớn nhất của bản remake (spec §0.3).
 *
 * Booking-first (D-6): gallery trên, panel đặt phòng sticky phải. Breakdown
 * gọi `buildQuote()` của core — cùng hàm với checkout và CMS, không ai tính
 * lại (luật R8). Dòng "tàu hoãn → dời ngày miễn phí" nằm TRONG panel, cạnh
 * nút — câu trả lời cho objection số 1 của khách Nam Du.
 *
 * Mobile (K7): gallery swipe → nội dung 1 cột → sticky bottom bar mở
 * bottom-sheet chứa toàn bộ panel.
 */

const SLUG = meta.slug

export function RoomDetailPage({
    data,
    locale,
    roomSlug,
}: {
    data: PropertyData
    locale: Locale
    roomSlug?: string
}) {
    const t = ui(locale)
    const [search, setSearch] = useStaySearch()
    const [lightbox, setLightbox] = useState<number | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    const room = data.rooms.find((r) => r.id === roomSlug) ?? data.rooms[0]
    const extra = room ? data.roomExtras[room.id] : undefined
    const ratePlan = ratePlans.find((plan) => plan.id === 'standard')

    const quote = useMemo(() => {
        if (!room) return null
        return buildQuote({
            room,
            roomExtra: extra,
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            guests: toGuestCount(search),
            seasons,
            inventory: {},
            ratePlan,
            addons: {},
            addonCatalog: data.addons,
            childPolicy,
            promotions: promotions.filter((promo) => promo.active),
            channel: 'web',
            today: todayKey(),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room?.id, extra, search.checkIn, search.checkOut, search.adults, search.childAges.join(',')])

    if (!room) return null

    const images = roomGallery(room, 5)
    const others = data.rooms.filter((r) => r.id !== room.id).slice(0, 3)
    const zaloContext = `${pick(room.name, locale)} · ${shortDate(search.checkIn, locale)}–${shortDate(search.checkOut, locale)}`

    const specs = [
        { label: t.specArea, value: room.area },
        {
            label: t.specGuests,
            value: `${room.guests}${extra && extra.maxGuests > room.guests ? `–${extra.maxGuests}` : ''} ${t.guestsWord}`,
        },
        ...(extra ? [{ label: t.specBed, value: pick(extra.bed, locale) }] : []),
        ...(extra ? [{ label: t.specView, value: pick(extra.view, locale) }] : []),
    ]

    /* Schema.org HotelRoom + Offer — để Google hiện giá (F8). */
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HotelRoom',
        name: pick(room.name, locale),
        description: pick(room.desc, locale),
        occupancy: {
            '@type': 'QuantitativeValue',
            maxValue: extra?.maxGuests ?? room.guests,
        },
        offers: {
            '@type': 'Offer',
            price: room.price,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
        },
        containedInPlace: { '@type': 'Hotel', name: `${data.brand.name} ${data.brand.suffix}` },
    }

    return (
        <div data-theme={SLUG} style={{ overflowX: 'hidden' }}>
            <BaseCss />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header data={data} locale={locale} />

            {/* Header trong suốt cần nền — dải đệm mỏng trên gallery. */}
            <div style={{ height: 84, background: 'var(--color-surface-strong)' }} aria-hidden="true" />

            {/* ---- gallery: 1 lớn + 4 thumb ---- */}
            <section className="h5-container" style={{ paddingTop: 'var(--space-3)' }} aria-label={t.gallery}>
                <div className="h5-rd-gallery">
                    {images.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            className={i === 0 ? 'h5-rd-shot h5-rd-shot-big' : 'h5-rd-shot'}
                            onClick={() => setLightbox(i)}
                            aria-label={`${fill(t.photoOf, { name: pick(room.name, locale) })} ${i + 1}/${images.length}`}
                            style={{
                                padding: 0,
                                border: 'none',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                cursor: 'zoom-in',
                                background: 'var(--color-surface-sand)',
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={src}
                                alt={fill(t.photoOf, { name: pick(room.name, locale) })}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </button>
                    ))}
                </div>
            </section>

            {/* ---- lightbox ---- */}
            {lightbox !== null && images[lightbox] && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t.gallery}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 90,
                        background: 'var(--overlay-modal)',
                        display: 'grid',
                        placeItems: 'center',
                        padding: 'var(--space-4)',
                    }}
                    onClick={() => setLightbox(null)}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={images[lightbox]}
                        alt={fill(t.photoOf, { name: pick(room.name, locale) })}
                        style={{ maxWidth: '92vw', maxHeight: '82vh', objectFit: 'contain' }}
                    />
                    <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                        <button
                            type="button"
                            aria-label={t.close}
                            onClick={() => setLightbox(null)}
                            style={lightboxButtonStyle}
                        >
                            <IconClose size={20} />
                        </button>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 12,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label={t.prevPhoto}
                            onClick={() => setLightbox((lightbox + images.length - 1) % images.length)}
                            style={lightboxButtonStyle}
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            aria-label={t.nextPhoto}
                            onClick={() => setLightbox((lightbox + 1) % images.length)}
                            style={lightboxButtonStyle}
                        >
                            →
                        </button>
                    </div>
                </div>
            )}

            {/* ---- nội dung + panel ---- */}
            <main
                className="h5-container h5-rd-layout"
                style={{
                    display: 'grid',
                    gap: 'var(--space-6)',
                    alignItems: 'start',
                    paddingTop: 'var(--space-5)',
                    paddingBottom: 'var(--space-7)',
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <nav aria-label="Breadcrumb" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                        <a className="h5-link" href={themeRoot(SLUG)}>{t.home}</a>
                        {' / '}
                        <a className="h5-link" href={`${themePath(SLUG, 'rooms')}${searchQuery(search, locale)}`}>{t.roomsCrumb}</a>
                        {' / '}
                        <span aria-current="page">{pick(room.name, locale)}</span>
                    </nav>

                    <h1 className="h5-display" style={{ fontSize: 'var(--font-size-3xl)', margin: '0 0 var(--space-2)' }}>
                        {pick(room.name, locale)}
                    </h1>
                    <p style={{ margin: '0 0 var(--space-4)', color: 'var(--color-text-secondary)' }}>
                        {t.fitLabel}: {fitFor(room, locale)}
                    </p>

                    <dl
                        className="h5-rd-specs"
                        style={{
                            display: 'grid',
                            gap: 1,
                            background: 'var(--color-border-muted)',
                            border: '1px solid var(--color-border-muted)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            margin: '0 0 var(--space-5)',
                        }}
                    >
                        {specs.map((spec) => (
                            <div key={spec.label} style={{ background: 'var(--color-surface-raised)', padding: 'var(--space-3)' }}>
                                <dt
                                    style={{
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 'var(--font-weight-bold)' as never,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-brand)',
                                        marginBottom: 4,
                                    }}
                                >
                                    {spec.label}
                                </dt>
                                <dd style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>{spec.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <h2 className="h5-display" style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--space-3)' }}>
                        {t.descTitle}
                    </h2>
                    <p style={{ margin: '0 0 var(--space-3)', color: 'var(--color-text-secondary)', maxWidth: '65ch' }}>
                        {pick(room.desc, locale)}
                    </p>
                    {extra?.long && (
                        <p style={{ margin: '0 0 var(--space-3)', color: 'var(--color-text-secondary)', maxWidth: '65ch' }}>
                            {pick(extra.long, locale)}
                        </p>
                    )}
                    {extra?.long2 && (
                        <p style={{ margin: '0 0 var(--space-5)', color: 'var(--color-text-secondary)', maxWidth: '65ch' }}>
                            {pick(extra.long2, locale)}
                        </p>
                    )}

                    {extra && extra.amenities.length > 0 && (
                        <>
                            <h2 className="h5-display" style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--space-3)' }}>
                                {t.amenities}
                            </h2>
                            <ul
                                className="h5-rd-amenities"
                                style={{
                                    listStyle: 'none',
                                    margin: '0 0 var(--space-5)',
                                    padding: 0,
                                    display: 'grid',
                                    gap: 'var(--space-2) var(--space-4)',
                                }}
                            >
                                {extra.amenities.map((amenity, i) => (
                                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        <span aria-hidden="true" style={{ color: 'var(--color-success)', marginTop: 2 }}>
                                            <IconCheck size={14} />
                                        </span>
                                        {pick(amenity, locale)}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {extra && extra.conditions.length > 0 && (
                        <>
                            <h2 className="h5-display" style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--space-3)' }}>
                                {t.conditions}
                            </h2>
                            <ul style={{ margin: '0 0 var(--space-5)', paddingLeft: 20, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'grid', gap: 6 }}>
                                {extra.conditions.map((condition, i) => (
                                    <li key={i}>{pick(condition, locale)}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {/* Giữ khách trong phễu: 3 hạng khác dạng hàng rút gọn. */}
                    <h2 className="h5-display" style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--space-3)' }}>
                        {t.otherRooms}
                    </h2>
                    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                        {others.map((other) => (
                            <a
                                key={other.id}
                                className="h5-card"
                                href={`${themePath(SLUG, 'rooms')}/${other.id}${searchQuery(search, locale)}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-2) var(--space-3)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <span
                                    style={{
                                        width: 72,
                                        height: 48,
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden',
                                        background: 'var(--color-surface-sand)',
                                        flexShrink: 0,
                                    }}
                                >
                                    {roomCover(other) && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={roomCover(other)}
                                            alt=""
                                            loading="lazy"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    )}
                                </span>
                                <span style={{ fontWeight: 'var(--font-weight-medium)' as never, minWidth: 0 }}>
                                    {pick(other.name, locale)}
                                </span>
                                <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                                    {t.fromPrice} {formatPrice(other.price, locale)}{t.perNight}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ---- panel desktop ---- */}
                <aside className="h5-rd-aside" aria-label={t.bookRoom}>
                    <BookingPanel
                        data={data}
                        locale={locale}
                        roomId={room.id}
                        quote={quote}
                        search={search}
                        onSearch={setSearch}
                        zaloContext={zaloContext}
                    />
                </aside>
            </main>

            {/* ---- sticky bottom bar mobile ---- */}
            {quote && (
                <div
                    className="h5-rd-bar"
                    style={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 50,
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-3)',
                        background: 'var(--color-surface-raised)',
                        borderTop: '1px solid var(--color-border-muted)',
                        boxShadow: 'var(--shadow-up)',
                        padding: '10px var(--space-4) calc(10px + env(safe-area-inset-bottom, 0px))',
                    }}
                >
                    <span style={{ minWidth: 0 }}>
                        <strong style={{ fontVariantNumeric: 'tabular-nums', fontSize: 'var(--font-size-lg)' }}>
                            {formatPrice(quote.totalAmount, locale)}
                        </strong>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {' '}· {quote.nights} {t.nightsWord}
                        </span>
                    </span>
                    <button
                        type="button"
                        className="h5-btn h5-btn-primary"
                        style={{ minHeight: 44, flexShrink: 0 }}
                        onClick={() => setSheetOpen(true)}
                    >
                        {t.bookRoom}
                    </button>
                </div>
            )}

            {/* ---- bottom-sheet mobile chứa toàn bộ panel ---- */}
            {sheetOpen && (
                <div role="dialog" aria-modal="true" aria-label={t.bookRoom} style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
                    <button
                        type="button"
                        aria-label={t.close}
                        onClick={() => setSheetOpen(false)}
                        style={{ position: 'absolute', inset: 0, background: 'var(--overlay-scrim)', border: 'none', cursor: 'pointer' }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            maxHeight: '88vh',
                            overflowY: 'auto',
                            background: 'var(--color-surface-raised)',
                            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                            padding: 'var(--space-3) var(--space-3) calc(var(--space-3) + env(safe-area-inset-bottom, 0px))',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setSheetOpen(false)}
                                aria-label={t.close}
                                style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                            >
                                <IconClose size={22} />
                            </button>
                        </div>
                        <BookingPanel
                            data={data}
                            locale={locale}
                            roomId={room.id}
                            quote={quote}
                            search={search}
                            onSearch={setSearch}
                            zaloContext={zaloContext}
                            inSheet
                        />
                    </div>
                </div>
            )}

            <Contact data={data} locale={locale} />
            <ZaloFab brand={data.brand} locale={locale} context={zaloContext} />

            <style>{`
                .h5-rd-gallery {
                    display: grid;
                    gap: 8px;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    grid-auto-rows: 130px;
                }
                .h5-rd-shot-big { grid-column: span 2; grid-row: span 2; }
                .h5-rd-specs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                @media (min-width: 900px) {
                    .h5-rd-layout { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
                    .h5-rd-aside { position: sticky; top: 96px; }
                    .h5-rd-specs { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .h5-rd-amenities { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h5-rd-gallery { grid-auto-rows: 170px; }
                }
                @media (max-width: 899.98px) {
                    /* K7: gallery swipe ngang full-width. */
                    .h5-rd-gallery {
                        grid-template-columns: none;
                        grid-auto-flow: column;
                        grid-auto-columns: 86vw;
                        grid-auto-rows: 230px;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                    }
                    .h5-rd-shot { scroll-snap-align: start; }
                    .h5-rd-shot-big { grid-column: auto; grid-row: auto; }
                    .h5-rd-aside { display: none; }
                    .h5-rd-bar { display: flex !important; }
                }
            `}</style>
        </div>
    )
}

// ============================================================== panel đặt phòng

function BookingPanel({
    data,
    locale,
    roomId,
    quote,
    search,
    onSearch,
    zaloContext,
    inSheet,
}: {
    data: PropertyData
    locale: Locale
    roomId: string
    quote: Quote | null
    search: StaySearch
    onSearch: (next: StaySearch) => void
    zaloContext: string
    inSheet?: boolean
}) {
    const t = ui(locale)
    const ratePlan = ratePlans.find((plan) => plan.id === 'standard')
    const depositPercent = ratePlan?.depositPercent ?? 100
    const [payMethod, setPayMethod] = useState('card')
    const zaloPhone = data.brand.phone.replace(/\s/g, '')

    const checkoutHref = `${themePath(SLUG, 'checkout')}${searchQuery(search, locale, { room: roomId })}`

    const lineLabel: Record<string, string> = {
        room: fill(t.priceRoomLine, { n: quote?.nights ?? 0 }),
        'extra-bed': t.priceExtraBed,
        child: t.priceChild,
        addon: t.priceAddon,
    }

    return (
        <div
            style={{
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: inSheet ? 'none' : 'var(--shadow-2)',
                border: inSheet ? 'none' : '1px solid var(--color-border-muted)',
                padding: 'var(--space-4)',
                display: 'grid',
                gap: 'var(--space-4)',
            }}
        >
            <SearchFields locale={locale} value={search} onChange={onSearch} />

            {quote && (
                <div
                    style={{
                        borderTop: '1px solid var(--color-border-muted)',
                        paddingTop: 'var(--space-3)',
                        display: 'grid',
                        gap: 8,
                        fontSize: 'var(--font-size-sm)',
                    }}
                >
                    {quote.lines.map((line, i) => (
                        <PriceRow
                            key={i}
                            label={lineLabel[line.kind] ?? line.kind}
                            value={formatPrice(line.total, locale)}
                        />
                    ))}
                    {quote.discountTotal > 0 && (
                        <PriceRow
                            label={t.priceDiscount}
                            value={`−${formatPrice(quote.discountTotal, locale)}`}
                            tone="success"
                        />
                    )}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            borderTop: '1px solid var(--color-border-default)',
                            paddingTop: 10,
                            gap: 'var(--space-3)',
                        }}
                    >
                        <strong>{t.totalLabel}</strong>
                        <strong
                            className="h5-display"
                            style={{ fontSize: 'var(--font-size-2xl)', fontVariantNumeric: 'tabular-nums' }}
                        >
                            {formatPrice(quote.totalAmount, locale)}
                        </strong>
                    </div>
                    <PriceRow
                        label={fill(t.depositLabel, { p: depositPercent })}
                        value={formatPrice(quote.depositAmount, locale)}
                        strong
                    />
                    <PriceRow label={t.balanceLabel} value={formatPrice(quote.balanceDue, locale)} />
                </div>
            )}

            {/* ---- chính sách huỷ bậc thang + dòng thời tiết (B5) ---- */}
            <div
                style={{
                    background: 'var(--color-surface-sand)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    display: 'grid',
                    gap: 6,
                    fontSize: 'var(--font-size-sm)',
                }}
            >
                <strong>{t.policyTitle}</strong>
                {(ratePlan?.cancellationRules ?? []).map((rule, i) =>
                    rule.refundPercent > 0 ? (
                        <span key={i} style={{ color: 'var(--color-text-secondary)' }}>
                            {fill(t.policyRule, { d: rule.daysBeforeCheckIn, p: rule.refundPercent })}
                        </span>
                    ) : (
                        <span key={i} style={{ color: 'var(--color-text-secondary)' }}>
                            {t.policyNoRefund}
                        </span>
                    ),
                )}
                <span
                    style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                        color: 'var(--color-text-primary)',
                        fontWeight: 'var(--font-weight-medium)' as never,
                    }}
                >
                    <span aria-hidden="true" style={{ color: 'var(--color-brand)', marginTop: 2 }}>
                        <IconFerry size={16} />
                    </span>
                    {t.weatherLine}
                </span>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <a className="h5-btn h5-btn-primary" href={checkoutHref} style={{ width: '100%' }}>
                    {t.bookRoom}
                </a>
                <a
                    className="h5-btn h5-btn-ghost"
                    href={`https://zalo.me/${zaloPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.askZalo} — ${zaloContext}`}
                    style={{ width: '100%' }}
                >
                    {t.askZalo}
                </a>
            </div>

            {/* ---- phương thức thanh toán — CHỈ là giao diện (D-7/M4) ---- */}
            <fieldset style={{ border: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
                <legend
                    style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-bold)' as never,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 6,
                    }}
                >
                    {t.payTitle}
                </legend>
                {[
                    { id: 'card', label: t.payCard },
                    { id: 'transfer', label: t.payTransfer },
                    { id: 'counter', label: t.payCounter },
                ].map((method) => (
                    <label
                        key={method.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            minHeight: 32,
                            fontSize: 'var(--font-size-sm)',
                            cursor: 'pointer',
                        }}
                    >
                        <input
                            type="radio"
                            name={`h5-pay${inSheet ? '-sheet' : ''}`}
                            checked={payMethod === method.id}
                            onChange={() => setPayMethod(method.id)}
                            style={{ width: 18, height: 18, accentColor: 'var(--color-brand)' }}
                        />
                        {method.label}
                    </label>
                ))}
                <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {t.payNote}
                </p>
            </fieldset>
        </div>
    )
}

function PriceRow({
    label,
    value,
    strong,
    tone,
}: {
    label: string
    value: string
    strong?: boolean
    tone?: 'success'
}) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                color: tone === 'success' ? 'var(--color-success)' : 'var(--color-text-secondary)',
                fontWeight: strong ? ('var(--font-weight-bold)' as never) : undefined,
            }}
        >
            <span>{label}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: tone === 'success' ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                {value}
            </span>
        </div>
    )
}

const lightboxButtonStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 999,
    border: '1px solid var(--overlay-line)',
    background: 'var(--overlay-soft)',
    color: 'var(--color-text-inverse)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    fontSize: 18,
}
