import {
    formatPrice,
    pick,
    roomPath,
    themePath,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Lưới hạng phòng.
 *
 * Khác mẫu 01 ở chỗ giá là một badge xanh lá dán lên góc ảnh chứ không nằm
 * ở chân thẻ, và thẻ không có viền — chỉ đổ bóng nhẹ. Chân thẻ là một dòng
 * duy nhất: diện tích · số khách bên trái, liên kết đặt phòng bên phải.
 *
 * Giá lấy qua `formatPrice` của core (luật R8).
 */

export function Rooms({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="rooms"
            style={{
                background: 'var(--surface)',
                padding: '72px var(--space-6) var(--space-20)',
                scrollMarginTop: '110px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: 'var(--space-8)',
                        flexWrap: 'wrap',
                        marginBottom: 'var(--space-8)',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 800,
                                color: 'var(--accent-dark)',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            {t.roomsKicker}
                        </div>
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-2xl)',
                                lineHeight: 1.16,
                                fontWeight: 900,
                                color: 'var(--brand)',
                                letterSpacing: '-0.035em',
                                margin: '0 0 var(--space-2)',
                            }}
                        >
                            {t.roomsTitle}
                        </h2>
                        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', margin: 0 }}>
                            {t.roomsSub}
                        </p>
                    </div>

                    <a
                        href={themePath(SLUG, 'rooms')}
                        style={{
                            padding: '13px 26px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--surface-alt)',
                            color: 'var(--brand)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                        }}
                    >
                        {t.viewAll}
                    </a>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 330px), 1fr))',
                        gap: 'var(--space-6)',
                    }}
                >
                    {data.rooms.map((room) => (
                        <article
                            key={room.id}
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                background: 'var(--surface)',
                                boxShadow: 'var(--shadow-sm)',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                <ImageSlot
                                    placeholder={pick(room.name, locale)}
                                    src={room.images?.[0]}
                                    height={216}
                                    style={{ borderRadius: 0 }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: 14,
                                        left: 14,
                                        padding: '6px 13px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--accent)',
                                        // Xanh rừng trên nền xanh lá cho đủ tương phản.
                                        color: 'var(--text)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 800,
                                    }}
                                >
                                    {formatPrice(room.price, locale)}
                                </span>
                            </div>

                            <div
                                style={{
                                    padding: '20px 22px 24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 1,
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 800,
                                        color: 'var(--brand)',
                                        margin: '0 0 var(--space-2)',
                                        lineHeight: 1.35,
                                        letterSpacing: '-0.015em',
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
                                        flexWrap: 'wrap',
                                        gap: 6,
                                        marginBottom: 'var(--space-4)',
                                    }}
                                >
                                    {room.tags.map((tag) => (
                                        <span
                                            key={tag.en}
                                            style={{
                                                padding: '4px 11px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--surface-alt)',
                                                color: 'var(--brand-light)',
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
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 'var(--space-3)',
                                        paddingTop: 'var(--space-3)',
                                        borderTop: '1px solid var(--border)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {room.area} · {room.guests} {t.guestsWord}
                                    </span>
                                    <a
                                        href={roomPath(SLUG, room.id)}
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 800,
                                            color: 'var(--brand)',
                                            textDecoration: 'none',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {t.bookNow} →
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
