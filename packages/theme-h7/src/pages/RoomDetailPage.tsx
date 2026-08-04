'use client'

import { useState } from 'react'
import {
    formatPrice,
    pick,
    telHref,
    type Locale,
    type PropertyData,
} from '@repo/core'

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
        <div
            data-theme="h7"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--text)', overflowX: 'hidden' }}
        >
            <PageHeader data={data} locale={locale} />

            <LightCrumbs
                crumbs={[
                    { label: t.home, href: '/h7' },
                    { label: t.roomsPage, href: '/h7/rooms' },
                    { label: pick(room.name, locale) },
                ]}
            />

            {/* ---- dải ảnh ---- */}
            <section style={{ background: 'var(--surface-alt)', padding: '0 24px 40px' }}>
                <div
                    className="h7-detail-gallery"
                    style={{ maxWidth: 'var(--container)', margin: '0 auto', display: 'grid', gap: 12 }}
                >
                    <GalleryTile src={images[0]} alt={pick(room.name, locale)} span2 />
                    <GalleryTile src={images[1]} alt={pick(room.name, locale)} />
                    <GalleryTile src={images[2]} alt={pick(room.name, locale)} />
                </div>
            </section>

            <section style={{ background: 'var(--surface)', padding: '44px 24px 88px' }}>
                <div
                    className="h7-detail-layout"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 40,
                        alignItems: 'start',
                    }}
                >
                    {/* ============================ cột trái ============================ */}
                    <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                            {room.tags.map((tag, i) => (
                                <span key={i} style={tagStyle}>
                                    {pick(tag, locale)}
                                </span>
                            ))}
                        </div>

                        <h1
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 38,
                                lineHeight: 1.14,
                                fontWeight: 800,
                                color: 'var(--text)',
                                margin: '0 0 12px',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            {pick(room.name, locale)}
                        </h1>

                        <p
                            style={{
                                fontSize: 16,
                                lineHeight: 1.7,
                                color: 'var(--text-muted)',
                                margin: '0 0 24px',
                                maxWidth: 640,
                            }}
                        >
                            {pick(room.desc, locale)}
                        </p>

                        {/* bảng thông số 4 ô, ngăn cách bằng gap 1px trên nền viền */}
                        <div
                            className="h7-spec-grid"
                            style={{
                                display: 'grid',
                                gap: 1,
                                background: 'var(--border)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                marginBottom: 34,
                            }}
                        >
                            {specs.map((spec) => (
                                <div
                                    key={spec.label}
                                    style={{ background: 'var(--surface)', padding: '18px 20px' }}
                                >
                                    <div
                                        style={{
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: 'var(--brand)',
                                            marginBottom: 6,
                                        }}
                                    >
                                        {spec.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14.5,
                                            fontWeight: 600,
                                            color: 'var(--text)',
                                            lineHeight: 1.45,
                                        }}
                                    >
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
                                <div
                                    className="h7-amenity-grid"
                                    style={{ display: 'grid', gap: 10, marginBottom: 36 }}
                                >
                                    {extra.amenities.map((amenity, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 11,
                                                padding: '12px 16px',
                                                borderRadius: 12,
                                                background: 'var(--surface-alt)',
                                            }}
                                        >
                                            <span aria-hidden="true" style={checkStyle}>
                                                ✓
                                            </span>
                                            <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>
                                                {pick(amenity, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div
                            className="h7-two-col"
                            style={{ display: 'grid', gap: 20, marginBottom: 36 }}
                        >
                            <div style={outlineCardStyle}>
                                <h3 style={subTitleStyle}>{t.viewTitle}</h3>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                                    <span aria-hidden="true" style={{ ...dotStyle, marginTop: 8 }} />
                                    <span style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                                        {extra ? pick(extra.view, locale) : t.viewDefault}
                                    </span>
                                </div>
                            </div>

                            <div style={outlineCardStyle}>
                                <h3 style={subTitleStyle}>{t.conditionsTitle}</h3>
                                <div style={{ display: 'grid', gap: 8 }}>
                                    {(extra?.conditions ?? []).map((condition, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                                            <span aria-hidden="true" style={{ ...dotStyle, marginTop: 8 }} />
                                            <span
                                                style={{
                                                    fontSize: 14,
                                                    lineHeight: 1.6,
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {pick(condition, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SectionTitle>{t.otherRooms}</SectionTitle>
                        <div className="h7-other-grid" style={{ display: 'grid', gap: 18 }}>
                            {others.map((other) => (
                                <a
                                    key={other.id}
                                    href={`/h7/rooms/${other.id}`}
                                    className="h7-other-card"
                                    style={{
                                        display: 'block',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        background: 'var(--surface)',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            height: 140,
                                            background: 'var(--surface-alt)',
                                        }}
                                    >
                                        {other.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={other.images[0]}
                                                alt={pick(other.name, locale)}
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                    </div>
                                    <div style={{ padding: '14px 16px 16px' }}>
                                        <div
                                            style={{
                                                fontSize: 14.5,
                                                fontWeight: 700,
                                                color: 'var(--text)',
                                                marginBottom: 6,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {pick(other.name, locale)}
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
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
                        className="h7-detail-aside"
                        style={{ display: 'grid', gap: 16, alignContent: 'start' }}
                    >
                        <div
                            style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow)',
                                padding: 24,
                                background: 'var(--surface)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                                <span
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 800,
                                        color: 'var(--text)',
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    {formatPrice(room.price, locale)}
                                </span>
                                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                    / {t.perNight}
                                </span>
                            </div>
                            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 20 }}>
                                {room.guests} {t.guestsWord}
                                {maxGuests > room.guests ? ` · tối đa ${maxGuests}` : ''}
                            </div>

                            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <DateField id="rd-in" label={t.checkIn} />
                                    <DateField id="rd-out" label={t.checkOut} />
                                </div>

                                <div style={{ display: 'grid', gap: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                                        {t.guests}
                                    </span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 12px',
                                            border: '1px solid var(--border)',
                                            borderRadius: 8,
                                            background: 'var(--surface-alt)',
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                            aria-label="Giảm số khách"
                                            style={stepperStyle}
                                        >
                                            −
                                        </button>
                                        <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)' }}>
                                            {guests} {t.guestsWord}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                                            aria-label="Tăng số khách"
                                            style={stepperStyle}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {extraBeds > 0 && (
                                        <span style={{ fontSize: 12, color: 'var(--brand)' }}>
                                            {t.extraBedNote}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    paddingTop: 16,
                                    borderTop: '1px solid var(--border)',
                                    display: 'grid',
                                    gap: 8,
                                    marginBottom: 18,
                                }}
                            >
                                <SumRow label={t.roomPrice} value={formatPrice(room.price, locale)} />
                                <SumRow label={t.extraBedLabel} value={formatPrice(extraBedTotal, locale)} />
                                <SumRow label={t.addonsTotal} value={formatPrice(addonsSubtotal, locale)} />
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingTop: 12,
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
                                        {formatPrice(total, locale)}
                                    </span>
                                </div>
                            </div>

                            <a
                                href={telHref(data.brand.phone)}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: 14,
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--accent)',
                                    color: 'var(--text-inverse)',
                                    fontSize: 14.5,
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                {pageUi[locale].confirmBooking}
                            </a>
                            <a
                                href="/h7/rooms"
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: 10,
                                    padding: 12,
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid var(--border-strong)',
                                    color: 'var(--text)',
                                    fontSize: 13.5,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                {t.backToRooms}
                            </a>
                        </div>

                        <div
                            style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '22px 24px',
                                background: 'var(--surface)',
                            }}
                        >
                            <div style={kickerStyle}>{t.addonsTitle}</div>
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
                    </aside>
                </div>
            </section>

            <PageFooter data={data} locale={locale} />

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
            style={{
                position: 'relative',
                gridRow: span2 ? 'span 2' : undefined,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--surface-alt)',
            }}
        >
            {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
        </div>
    )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2
            style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--text)',
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
            }}
        >
            {children}
        </h2>
    )
}

function Paragraph({ children, last }: { children: React.ReactNode; last?: boolean }) {
    return (
        <p
            style={{
                fontSize: 15.5,
                lineHeight: 1.85,
                color: 'var(--text-muted)',
                margin: last ? '0 0 36px' : '0 0 14px',
            }}
        >
            {children}
        </p>
    )
}

function DateField({ id, label }: { id: string; label: string }) {
    return (
        <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                {label}
            </label>
            <input
                id={id}
                type="date"
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text)',
                }}
            />
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

const tagStyle: React.CSSProperties = {
    padding: '5px 12px',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--surface-tint)',
    color: 'var(--brand)',
    fontSize: 12,
    fontWeight: 600,
}

const dotStyle: React.CSSProperties = {
    width: 5,
    height: 5,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--accent)',
    flexShrink: 0,
}

const checkStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--surface-tint)',
    color: 'var(--brand)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
    marginTop: 1,
}

const outlineCardStyle: React.CSSProperties = {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px 24px',
}

const subTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: 800,
    color: 'var(--text)',
    margin: '0 0 12px',
    letterSpacing: '-0.015em',
}

const kickerStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--brand)',
    marginBottom: 14,
}

const stepperStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: 'none',
    background: 'var(--surface)',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--brand)',
    fontFamily: 'var(--font-body)',
}
