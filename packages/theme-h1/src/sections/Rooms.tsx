import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { fill, fitFor, ui } from '../strings'

/**
 * Section `rooms` — spec v4 §2.1 "ít card trang trí, nhiều dòng so sánh rõ":
 * 4 phòng nổi bật dựng thành DÒNG SO SÁNH ngang, đúng anatomy row của trang
 * Rooms (§5.2: ảnh · tên/giường/view · giá + CTA) — Home và Rooms nói cùng
 * một ngôn ngữ (§13.1).
 *
 * "Xem chi tiết" là CTA phụ trên từng dòng; CTA của section là nút xanh
 * "Xem tất cả N hạng phòng" (§4.5). Vàng để dành cho CTA booking (§2.1).
 */

const SLUG = meta.slug

export function Rooms({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const rooms = data.rooms.slice(0, 4)
    const roomsHref = `${themePath(SLUG, 'rooms')}${locale === 'vi' ? '' : '?lang=en'}`

    return (
        <section id="rooms" style={{ padding: 'var(--space-7) 0 0' }}>
            <div className="h6-container">
                <p className="h6-kicker" style={{ margin: '0 0 var(--space-2)' }}>
                    {t.roomsKicker}
                </p>
                <h2
                    className="h6-display"
                    style={{ fontSize: 'var(--font-size-3xl)', margin: '0 0 var(--space-5)' }}
                >
                    {t.roomsTitle}
                </h2>

                <div style={{ borderTop: '1px solid var(--color-border-default)' }}>
                    {rooms.map((room) => {
                        const extra = data.roomExtras[room.id]
                        const specs = [
                            extra ? pick(extra.bed, locale) : null,
                            extra ? pick(extra.view, locale) : null,
                            room.area,
                        ].filter(Boolean)

                        return (
                            <a
                                key={room.id}
                                className="h6-room-row"
                                href={`${themePath(SLUG, 'rooms')}/${room.id}${locale === 'vi' ? '' : '?lang=en'}`}
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-4)',
                                    padding: 'var(--space-4) 0',
                                    borderBottom: '1px solid var(--color-border-muted)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        aspectRatio: '3 / 2',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        background: 'var(--color-surface-sand)',
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

                                <div style={{ minWidth: 0 }}>
                                    <h3
                                        className="h6-display"
                                        style={{
                                            fontSize: 'var(--font-size-xl)',
                                            margin: '0 0 var(--space-2)',
                                        }}
                                    >
                                        {pick(room.name, locale)}
                                    </h3>
                                    {specs.length > 0 && (
                                        <p
                                            style={{
                                                margin: '0 0 var(--space-1)',
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-secondary)',
                                            }}
                                        >
                                            {specs.join(' · ')}
                                        </p>
                                    )}
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: 'var(--font-size-sm)',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        {t.fitLabel}: {fitFor(room, locale)}
                                    </p>
                                </div>

                                <div className="h6-room-price">
                                    <p style={{ margin: '0 0 var(--space-2)' }}>
                                        <span
                                            style={{
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-secondary)',
                                            }}
                                        >
                                            {t.fromPrice}{' '}
                                        </span>
                                        <strong
                                            style={{
                                                fontSize: 'var(--font-size-xl)',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            {formatPrice(room.price, locale)}
                                        </strong>
                                        <span
                                            style={{
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-secondary)',
                                            }}
                                        >
                                            {t.perNight}
                                        </span>
                                    </p>
                                    {/* CTA phụ — cả dòng đã là link nên đây là span tạo hình nút. */}
                                    <span className="h6-btn h6-btn-ghost" style={{ minHeight: 40 }}>
                                        {t.seeDetail}
                                    </span>
                                </div>
                            </a>
                        )
                    })}
                </div>

                <div style={{ textAlign: 'center', paddingTop: 'var(--space-5)' }}>
                    <a className="h6-btn h6-btn-brand" href={roomsHref}>
                        {fill(t.viewAllRooms, { n: data.rooms.length })}
                    </a>
                </div>
            </div>

            <style>{`
                .h6-room-row { grid-template-columns: minmax(0, 1fr); }
                .h6-room-row:hover h3 { color: var(--color-brand); }
                .h6-room-row h3 { transition: color var(--motion-instant) ease; }
                .h6-room-row:hover .h6-btn-ghost {
                    background: var(--color-surface-sand);
                    border-color: var(--border-strong);
                }
                @media (min-width: 900px) {
                    .h6-room-row { grid-template-columns: 280px minmax(0, 1fr) 220px; }
                    .h6-room-price { text-align: right; }
                }
            `}</style>
        </section>
    )
}
