import {
    formatPrice,
    pick,
    roomPath,
    themePath,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { Card, ImageSlot, Pill, SectionHeader } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Lưới hạng phòng — ảnh trên, giá và nút đặt ở chân thẻ.
 *
 * Giá lấy qua `formatPrice` của core — theme KHÔNG tự định dạng hay tính lại,
 * nhờ vậy N giao diện luôn hiện cùng một con số (luật R8).
 */

export function Rooms({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="rooms"
            style={{
                background: 'var(--surface-alt)',
                padding: 'var(--space-16) var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader
                    kicker={t.roomsKicker}
                    title={t.roomsTitle}
                    sub={t.roomsSub}
                    action={
                        <a
                            href={themePath(SLUG, 'rooms')}
                            style={{
                                padding: '11px 22px',
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--border-strong)',
                                background: 'var(--surface)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                color: 'var(--text)',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {t.viewAll}
                        </a>
                    }
                />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                        gap: 'var(--space-6)',
                    }}
                >
                    {data.rooms.map((room) => (
                        <Card
                            key={room.id}
                            media={
                                <ImageSlot
                                    placeholder={pick(room.name, locale)}
                                    src={room.images?.[0]}
                                    height={208}
                                    style={{ borderRadius: 0 }}
                                />
                            }
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
                                    <Pill key={tag.en}>{pick(tag, locale)}</Pill>
                                ))}
                            </div>

                            <h3
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 700,
                                    color: 'var(--text)',
                                    margin: '0 0 var(--space-2)',
                                    lineHeight: 1.4,
                                }}
                            >
                                {pick(room.name, locale)}
                            </h3>

                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    lineHeight: 1.6,
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
                                    gap: 'var(--space-3)',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-muted)',
                                    paddingBottom: 'var(--space-3)',
                                    marginBottom: 'var(--space-3)',
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                <span>{room.area}</span>
                                <span>
                                    {room.guests} {t.guestsWord}
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
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 800,
                                            color: 'var(--text)',
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
                                <a
                                    href={roomPath(SLUG, room.id)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--accent)',
                                        color: 'var(--text-inverse)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t.bookNow}
                                </a>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
