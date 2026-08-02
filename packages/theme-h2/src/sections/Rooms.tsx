import { formatPrice, pick, roomPath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'
import { Heading } from './Kicker'

const SLUG = meta.slug

/**
 * Lưới hạng phòng — thẻ bo 30px, ảnh KHÔNG tràn mép mà thụt vào 10px và tự bo
 * góc 22px. Đây là điểm khác rõ nhất so với thẻ của mẫu 01 (ảnh tràn sát viền),
 * nên thẻ dựng tay thay vì dùng `Card` của `ui`.
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
                background: 'var(--surface)',
                padding: '72px var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div style={{ marginBottom: 38 }}>
                    <Heading
                        kicker={t.roomsKicker}
                        title={t.roomsTitle}
                        sub={t.roomsSub}
                        align="center"
                    />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                        gap: 'var(--space-6)',
                    }}
                >
                    {data.rooms.map((room) => (
                        <article
                            key={room.id}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 30,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ margin: '10px 10px 0' }}>
                                <ImageSlot
                                    placeholder={pick(room.name, locale)}
                                    src={room.images?.[0]}
                                    height={214}
                                    style={{
                                        borderRadius: 22,
                                        background: 'var(--surface-tint)',
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    padding: '20px 22px 24px',
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
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {pick(room.name, locale)}
                                </h3>

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
                                    <a
                                        href={roomPath(SLUG, room.id)}
                                        style={{
                                            padding: '11px 20px',
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--accent)',
                                            color: 'var(--text)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 700,
                                            whiteSpace: 'nowrap',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {t.bookNow}
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
