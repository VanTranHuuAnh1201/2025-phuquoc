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
 * Chi tiết hạng phòng mẫu 03 — port từ `Room Detail H3 - Nam Du Hill.dc.html`.
 *
 * Bố cục bám sát prototype:
 *   hero 460px ảnh tràn + breadcrumb, thẻ tag, tên phòng
 *   → dải 3 ảnh phụ cao 150px
 *   → lưới `1fr / 370px`: trái là 4 thẻ thông số + TAB (mô tả · tiện nghi ·
 *     điều kiện) + "hạng phòng khác"; phải là thẻ đặt phòng DÍNH
 *
 * Trang không tự tính giá — `room.price` đến từ core, hiển thị qua
 * `formatPrice` (luật R8).
 */

const SLUG = meta.slug

type Tab = 'desc' | 'amenities' | 'conditions'

export function RoomDetailPage({
    data,
    locale,
    roomSlug,
}: {
    data: PropertyData
    locale: Locale
    roomSlug?: string
}) {
    const t = pageUi[locale]
    const [tab, setTab] = useState<Tab>('desc')

    const room = data.rooms.find((r) => r.id === roomSlug) ?? data.rooms[0]

    const extra = room ? data.roomExtras[room.id] : undefined

    const others = useMemo(
        () => data.rooms.filter((r) => r.id !== room?.id).slice(0, 3),
        [data.rooms, room?.id],
    )

    if (!room) return null

    const specs = [
        { label: t.specArea, value: room.area },
        { label: t.specGuests, value: `${room.guests} ${t.guestsWord}` },
        { label: t.specBed, value: extra ? pick(extra.bed, locale) : t.bedDefault },
        { label: t.specView, value: extra ? pick(extra.view, locale) : t.viewDefault },
    ]

    const tabs: { id: Tab; label: string }[] = [
        { id: 'desc', label: t.descTitle },
        { id: 'amenities', label: t.amenitiesTitle },
        { id: 'conditions', label: t.conditionsTitle },
    ]

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

            {/* ---- hero ---- */}
            <section
                style={{
                    position: 'relative',
                    height: 460,
                    background: 'var(--brand)',
                    overflow: 'hidden',
                }}
            >
                {room.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={room.images[0]}
                        alt=""
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                )}
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
                        padding: '128px var(--space-6) var(--space-8)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
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
                            flexWrap: 'wrap',
                        }}
                    >
                        <a href={themeRoot(SLUG)} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {t.home}
                        </a>
                        <span aria-hidden="true">/</span>
                        <a
                            href={themePath(SLUG, 'rooms')}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                            {t.roomsPage}
                        </a>
                        <span aria-hidden="true">/</span>
                        <span aria-current="page" style={{ opacity: 1 }}>
                            {pick(room.name, locale)}
                        </span>
                    </nav>

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
                                    padding: '5px 12px',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 800,
                                }}
                            >
                                {pick(tag, locale)}
                            </span>
                        ))}
                    </div>

                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-3xl)',
                            lineHeight: 1.12,
                            fontWeight: 800,
                            color: 'var(--text-inverse)',
                            margin: '0 0 var(--space-2)',
                            maxWidth: 760,
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {pick(room.name, locale)}
                    </h1>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            lineHeight: 1.65,
                            color: 'var(--text-inverse)',
                            opacity: 0.85,
                            margin: 0,
                            maxWidth: 620,
                        }}
                    >
                        {pick(room.desc, locale)}
                    </p>
                </div>
            </section>

            {/* ---- dải 3 ảnh phụ ---- */}
            <section style={{ background: 'var(--surface)', padding: 'var(--space-8) var(--space-6) 0' }}>
                <div
                    className="h3-strip"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 'var(--space-3)',
                    }}
                >
                    {(room.images ?? []).slice(1, 4).map((src, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'relative',
                                height: 150,
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                background: 'var(--surface-tint)',
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={src}
                                alt=""
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ---- nội dung ---- */}
            <section
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8) var(--space-6) var(--space-20)',
                }}
            >
                <div
                    className="h3-detail-layout"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    {/* ---- cột trái ---- */}
                    <div>
                        <div
                            className="h3-specs"
                            style={{
                                display: 'grid',
                                gap: 'var(--space-3)',
                                marginBottom: 'var(--space-8)',
                            }}
                        >
                            {specs.map((spec) => (
                                <div key={spec.label} style={PANEL}>
                                    <div style={{ ...KICKER, color: 'var(--accent-dark)' }}>
                                        {spec.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 800,
                                            color: 'var(--brand)',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {spec.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ---- tab ---- */}
                        <div
                            role="tablist"
                            aria-label={t.descTitle}
                            style={{
                                display: 'flex',
                                gap: 'var(--space-2)',
                                flexWrap: 'wrap',
                                marginBottom: 'var(--space-6)',
                                paddingBottom: 'var(--space-5)',
                                borderBottom: '1px solid var(--border)',
                            }}
                        >
                            {tabs.map((item) => {
                                const active = tab === item.id
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setTab(item.id)}
                                        style={{
                                            padding: 'var(--space-2) var(--space-5)',
                                            borderRadius: 'var(--radius-pill)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: 'var(--text-sm)',
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: 800,
                                            minHeight: 40,
                                            background: active ? 'var(--brand)' : 'var(--surface-alt)',
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

                        {tab === 'desc' && (
                            <div>
                                <p style={PARAGRAPH}>
                                    {extra ? pick(extra.long, locale) : pick(room.desc, locale)}
                                </p>
                                {extra?.long2 && <p style={PARAGRAPH}>{pick(extra.long2, locale)}</p>}

                                <div
                                    style={{
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--brand)',
                                        padding: 'var(--space-6)',
                                        marginTop: 'var(--space-6)',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 800,
                                            color: 'var(--accent)',
                                            margin: '0 0 var(--space-2)',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {t.specView}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            lineHeight: 1.68,
                                            color: 'var(--text-inverse)',
                                            opacity: 0.86,
                                            margin: 0,
                                        }}
                                    >
                                        {extra ? pick(extra.view, locale) : t.viewDefault}
                                    </p>
                                </div>
                            </div>
                        )}

                        {tab === 'amenities' && (
                            <div className="h3-amenities" style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                {(extra?.amenities ?? []).map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-3) var(--space-4)',
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'var(--surface-alt)',
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: 'var(--radius-pill)',
                                                background: 'var(--accent)',
                                                color: 'var(--text)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 11,
                                                fontWeight: 800,
                                                flexShrink: 0,
                                                marginTop: 1,
                                            }}
                                        >
                                            ✓
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                lineHeight: 1.55,
                                                color: 'var(--text)',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {pick(item, locale)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {tab === 'conditions' && (
                            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                {(extra?.conditions ?? []).map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-4) var(--space-5)',
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'var(--surface-alt)',
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                width: 7,
                                                height: 7,
                                                borderRadius: 'var(--radius-pill)',
                                                background: 'var(--brand)',
                                                marginTop: 7,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                lineHeight: 1.65,
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {pick(item, locale)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ---- hạng phòng khác ---- */}
                        <h2
                            style={{
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 800,
                                color: 'var(--brand)',
                                margin: 'var(--space-12) 0 var(--space-5)',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            {t.otherRooms}
                        </h2>
                        <div className="h3-others" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                            {others.map((other) => (
                                <a
                                    key={other.id}
                                    href={roomPath(SLUG, other.id)}
                                    className="h3-other-card"
                                    style={{
                                        display: 'block',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-3) var(--space-3) var(--space-4)',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            height: 120,
                                            borderRadius: 'var(--radius)',
                                            overflow: 'hidden',
                                            background: 'var(--surface-tint)',
                                            marginBottom: 'var(--space-3)',
                                        }}
                                    >
                                        {other.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={other.images[0]}
                                                alt={pick(other.name, locale)}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 800,
                                            color: 'var(--brand)',
                                            marginBottom: 5,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {pick(other.name, locale)}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {other.area} · {formatPrice(other.price, locale)}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ---- thẻ đặt phòng dính ---- */}
                    <aside className="h3-detail-aside" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <div
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--brand)',
                                padding: 'var(--space-6)',
                            }}
                        >
                            <div style={{ ...KICKER, color: 'var(--accent)' }}>{t.total}</div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: 'var(--space-2)',
                                    marginBottom: 'var(--space-5)',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 'var(--text-3xl)',
                                        fontWeight: 800,
                                        color: 'var(--text-inverse)',
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    {formatPrice(room.price, locale)}
                                </span>
                                <span
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-inverse)',
                                        opacity: 0.66,
                                    }}
                                >
                                    / {t.perNight}
                                </span>
                            </div>

                            <a
                                href={themePath(SLUG, 'checkout')}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 800,
                                    textDecoration: 'none',
                                }}
                            >
                                {t.bookThisRoom}
                            </a>

                            <a
                                href={themePath(SLUG, 'rooms')}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: 'var(--space-2)',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid var(--overlay-line)',
                                    color: 'var(--text-inverse)',
                                    fontSize: 'var(--text-sm)',
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

            <style>{`
                .h3-strip { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .h3-specs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .h3-amenities { grid-template-columns: minmax(0, 1fr); }
                .h3-others { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                @media (min-width: 720px) {
                    .h3-specs { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .h3-amenities { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h3-others { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (min-width: 1040px) {
                    .h3-detail-layout { grid-template-columns: minmax(0, 1fr) minmax(0, 370px); }
                    .h3-detail-aside { position: sticky; top: 100px; }
                }
                .h3-other-card { transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease); }
                .h3-other-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
            `}</style>
        </div>
    )
}

const KICKER: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 'var(--space-1)',
}

const PANEL: CSSProperties = {
    borderRadius: 'var(--radius-lg)',
    background: 'var(--surface-alt)',
    padding: 'var(--space-4) var(--space-5)',
}

const PARAGRAPH: CSSProperties = {
    fontSize: 'var(--text-base)',
    lineHeight: 1.85,
    color: 'var(--text-muted)',
    margin: '0 0 var(--space-4)',
    textWrap: 'pretty',
}
