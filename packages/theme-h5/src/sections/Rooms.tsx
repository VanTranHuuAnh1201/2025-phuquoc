import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { fill, fitFor, ui } from '../strings'
import { SectionHead } from '../components/SectionHead'
import { roomCover } from '../components/photos'

/**
 * Section `rooms` — 3 card đầu + link "Xem tất cả N hạng phòng".
 *
 * Tên phòng THẬT từ core (cụ thể = đáng tin, spec §3.1). Giá format qua core
 * (luật R8). Mobile: cuộn ngang snap, card 82vw lộ mép card sau (K7 — đây là
 * ngoại lệ cuộn ngang có chủ đích của carousel, không phải bảng).
 */

const SLUG = meta.slug

export function Rooms({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const rooms = data.rooms.slice(0, 3)
    const roomsHref = `${themePath(SLUG, 'rooms')}${locale === 'vi' ? '' : '?lang=en'}`

    return (
        <section id="rooms" style={{ padding: 'var(--space-7) 0 0' }}>
            <div className="h5-container">
                <SectionHead
                    kicker={t.roomsKicker}
                    title={t.roomsTitle}
                    aside={
                        <a className="h5-btn h5-btn-ghost" href={roomsHref}>
                            {fill(t.viewAllRooms, { n: data.rooms.length })} →
                        </a>
                    }
                />
            </div>

            <div className="h5-container h5-rooms-rail">
                {rooms.map((room) => (
                    <a
                        key={room.id}
                        className="h5-card h5-room-card"
                        href={`${themePath(SLUG, 'rooms')}/${room.id}${locale === 'vi' ? '' : '?lang=en'}`}
                        style={{
                            display: 'block',
                            overflow: 'hidden',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <div
                            style={{
                                aspectRatio: '4 / 5',
                                background: 'var(--color-surface-sand)',
                                overflow: 'hidden',
                            }}
                        >
                            {roomCover(room) && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={roomCover(room)}
                                    alt={pick(room.name, locale)}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <div style={{ padding: 'var(--space-4)' }}>
                            <h3
                                className="h5-display"
                                style={{
                                    fontSize: 'var(--font-size-xl)',
                                    margin: '0 0 var(--space-2)',
                                }}
                            >
                                {pick(room.name, locale)}
                            </h3>
                            <p
                                style={{
                                    margin: '0 0 var(--space-3)',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {t.fitLabel}: {fitFor(room, locale)} · {room.area}
                            </p>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {t.fromPrice}{' '}
                                <strong
                                    style={{
                                        fontSize: 'var(--font-size-lg)',
                                        color: 'var(--color-text-primary)',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {formatPrice(room.price, locale)}
                                </strong>
                                {t.perNight}
                            </p>
                        </div>
                    </a>
                ))}
            </div>

            <style>{`
                .h5-rooms-rail {
                    display: grid;
                    gap: var(--space-4);
                }
                @media (min-width: 900px) {
                    .h5-rooms-rail { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                .h5-room-card, .h5-room-card h3 { text-decoration: none; }
                @media (max-width: 899.98px) {
                    .h5-rooms-rail {
                        grid-auto-flow: column;
                        grid-auto-columns: 82vw;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        padding-bottom: var(--space-2);
                        -webkit-overflow-scrolling: touch;
                    }
                    .h5-room-card { scroll-snap-align: start; }
                }
            `}</style>
        </section>
    )
}
