'use client'

import { useMemo, type CSSProperties } from 'react'
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
 * Chi tiết hạng phòng mẫu 04 — port từ `Room Detail H4 - Nam Du Hill.dc.html`.
 *
 * Bố cục KHÁC mẫu 03 (vốn dùng hero ảnh tràn + tab):
 *   hero nền sáng CHIA ĐÔI — trái là tên phòng, mô tả và giá; phải là lưới ảnh
 *   kiểu mosaic (một ô cao gấp đôi bên trái, hai ô nhỏ bên phải)
 *   → lưới `1fr / 370px`: trái là dải 4 thông số liền mạch, rồi các mục XẾP
 *     CHỒNG (mô tả · tiện nghi · hai thẻ màu view + điều kiện), không dùng tab;
 *     phải là thẻ đặt phòng dính
 *
 * Trang không tự tính giá (luật R8).
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
    const t = pageUi[locale]

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

    const mosaic = (room.images ?? []).slice(0, 3)

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

            {/* ---- hero chia đôi ---- */}
            <section
                style={{
                    position: 'relative',
                    background: 'var(--surface-alt)',
                    padding: '124px var(--space-6) 0',
                    overflow: 'hidden',
                }}
            >
                <div style={{ position: 'relative', maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <nav
                        aria-label="Breadcrumb"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                            padding: 'var(--space-3) 0 var(--space-5)',
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
                        <span aria-current="page" style={{ color: 'var(--brand)', fontWeight: 700 }}>
                            {pick(room.name, locale)}
                        </span>
                    </nav>

                    <div
                        className="h4-hero-split"
                        style={{
                            display: 'grid',
                            gap: 'var(--space-8)',
                            alignItems: 'end',
                            paddingBottom: 'var(--space-8)',
                        }}
                    >
                        <div>
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
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--accent)',
                                            color: 'var(--text)',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 900,
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
                                    lineHeight: 1.08,
                                    fontWeight: 900,
                                    color: 'var(--brand)',
                                    margin: '0 0 var(--space-3)',
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                {pick(room.name, locale)}
                            </h1>
                            <p
                                style={{
                                    fontSize: 'var(--text-base)',
                                    lineHeight: 1.68,
                                    color: 'var(--text-muted)',
                                    margin: '0 0 var(--space-5)',
                                }}
                            >
                                {pick(room.desc, locale)}
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: 'var(--space-2)',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 'var(--text-2xl)',
                                        fontWeight: 900,
                                        color: 'var(--brand)',
                                        letterSpacing: '-0.035em',
                                    }}
                                >
                                    {formatPrice(room.price, locale)}
                                </span>
                                <span
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    / {t.perNight}
                                </span>
                            </div>
                        </div>

                        {/* lưới ảnh mosaic: ô đầu cao gấp đôi */}
                        <div
                            className="h4-mosaic"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                gridTemplateRows: '130px 130px',
                                gap: 'var(--space-3)',
                            }}
                        >
                            {mosaic.map((src, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: 'relative',
                                        gridRow: i === 0 ? 'span 2' : undefined,
                                        borderRadius: i === 0 ? 'var(--radius-lg)' : 'var(--radius)',
                                        overflow: 'hidden',
                                        background: 'var(--surface-tint)',
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={src}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
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
                    className="h4-detail-layout"
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
                        {/* dải thông số liền mạch — viền là khe 1px của nền */}
                        <div
                            className="h4-specs"
                            style={{
                                display: 'grid',
                                gap: 1,
                                background: 'var(--border)',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                                marginBottom: 'var(--space-8)',
                            }}
                        >
                            {specs.map((spec) => (
                                <div
                                    key={spec.label}
                                    style={{
                                        background: 'var(--surface)',
                                        padding: 'var(--space-5)',
                                    }}
                                >
                                    <div style={KICKER}>{spec.label}</div>
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

                        {/* ---- mô tả ---- */}
                        <div style={KICKER}>{t.descKicker}</div>
                        <h2 style={SECTION_TITLE}>{t.descTitle}</h2>
                        <p style={PARAGRAPH}>
                            {extra ? pick(extra.long, locale) : pick(room.desc, locale)}
                        </p>
                        {extra?.long2 && (
                            <p style={{ ...PARAGRAPH, marginBottom: 'var(--space-8)' }}>
                                {pick(extra.long2, locale)}
                            </p>
                        )}

                        {/* ---- tiện nghi ---- */}
                        {extra && extra.amenities.length > 0 && (
                            <>
                                <div style={KICKER}>{t.amenitiesKicker}</div>
                                <h2 style={SECTION_TITLE}>{t.amenitiesTitle}</h2>
                                <div
                                    className="h4-amenities"
                                    style={{
                                        display: 'grid',
                                        gap: 'var(--space-2)',
                                        marginBottom: 'var(--space-8)',
                                    }}
                                >
                                    {extra.amenities.map((item, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                padding: 'var(--space-3) var(--space-4)',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--surface-alt)',
                                            }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 'var(--radius-pill)',
                                                    background: 'var(--accent)',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 700,
                                                    color: 'var(--brand)',
                                                }}
                                            >
                                                {pick(item, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ---- hai thẻ màu: hướng nhìn + điều kiện ---- */}
                        <div
                            className="h4-cards"
                            style={{
                                display: 'grid',
                                gap: 'var(--space-5)',
                                marginBottom: 'var(--space-8)',
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: 'var(--radius)',
                                    background: 'var(--brand)',
                                    padding: 'var(--space-6)',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 900,
                                        color: 'var(--accent)',
                                        margin: '0 0 var(--space-3)',
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
                                        opacity: 0.88,
                                        margin: 0,
                                    }}
                                >
                                    {extra ? pick(extra.view, locale) : t.viewDefault}
                                </p>
                            </div>

                            <div
                                style={{
                                    borderRadius: 'var(--radius)',
                                    background: 'var(--accent)',
                                    padding: 'var(--space-6)',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 900,
                                        color: 'var(--text)',
                                        margin: '0 0 var(--space-3)',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {t.conditionsTitle}
                                </h3>
                                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                    {(extra?.conditions ?? []).map((item, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                gap: 'var(--space-2)',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                style={{
                                                    width: 5,
                                                    height: 5,
                                                    borderRadius: 'var(--radius-pill)',
                                                    background: 'var(--text)',
                                                    marginTop: 8,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-sm)',
                                                    lineHeight: 1.6,
                                                    color: 'var(--text)',
                                                }}
                                            >
                                                {pick(item, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ---- hạng phòng khác ---- */}
                        <h2 style={{ ...SECTION_TITLE, marginTop: 0 }}>{t.otherRooms}</h2>
                        <div className="h4-others" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                            {others.map((other) => (
                                <a
                                    key={other.id}
                                    href={roomPath(SLUG, other.id)}
                                    className="h4-other-card"
                                    style={{
                                        display: 'block',
                                        borderRadius: 'var(--radius)',
                                        overflow: 'hidden',
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
                                            background: 'var(--surface-alt)',
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
                                    <div style={{ padding: 'var(--space-4)' }}>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 900,
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
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ---- thẻ đặt phòng dính ---- */}
                    <aside className="h4-detail-aside">
                        <div
                            style={{
                                borderRadius: 'var(--radius)',
                                background: 'var(--brand)',
                                padding: 'var(--space-6)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 900,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'var(--accent)',
                                    marginBottom: 'var(--space-1)',
                                }}
                            >
                                {t.fromPrice}
                            </div>
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
                                        fontSize: 'var(--text-2xl)',
                                        fontWeight: 900,
                                        color: 'var(--text-inverse)',
                                        letterSpacing: '-0.035em',
                                    }}
                                >
                                    {formatPrice(room.price, locale)}
                                </span>
                                <span
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-inverse)',
                                        opacity: 0.7,
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
                                    padding: 'var(--space-4)',
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 900,
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
                                    fontWeight: 800,
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
                .h4-hero-split { grid-template-columns: minmax(0, 1fr); }
                .h4-specs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .h4-amenities { grid-template-columns: minmax(0, 1fr); }
                .h4-cards { grid-template-columns: minmax(0, 1fr); }
                .h4-others { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                @media (min-width: 720px) {
                    .h4-specs { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .h4-amenities { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h4-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .h4-others { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (min-width: 900px) {
                    .h4-hero-split { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 1040px) {
                    .h4-detail-layout { grid-template-columns: minmax(0, 1fr) minmax(0, 370px); }
                    .h4-detail-aside { position: sticky; top: 100px; }
                }
                .h4-other-card { transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease); }
                .h4-other-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
            `}</style>
        </div>
    )
}

const KICKER: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 900,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--accent-dark)',
    marginBottom: 'var(--space-2)',
}

const SECTION_TITLE: CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 900,
    color: 'var(--brand)',
    margin: '0 0 var(--space-4)',
    letterSpacing: '-0.035em',
}

const PARAGRAPH: CSSProperties = {
    fontSize: 'var(--text-base)',
    lineHeight: 1.85,
    color: 'var(--text-muted)',
    margin: '0 0 var(--space-3)',
    textWrap: 'pretty',
}
