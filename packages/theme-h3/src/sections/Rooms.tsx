import {
    formatPrice,
    pick,
    roomPath,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { ImageSlot, Pill, SectionHeader } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Hạng phòng mẫu 03 — danh sách HÀNG NGANG, không phải lưới thẻ như mẫu 01:
 * ảnh trái · mô tả giữa · giá và nút đặt dồn về phải, trên nền teal nhạt.
 *
 * Giá lấy qua `formatPrice` của core — theme không tự định dạng (luật R8).
 */

export function Rooms({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="rooms"
            style={{
                background: 'var(--surface-tint)',
                padding: '72px var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader kicker={t.roomsKicker} title={t.roomsTitle} sub={t.roomsSub} />

                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    {data.rooms.map((room) => (
                        <article
                            key={room.id}
                            style={{
                                background: 'var(--surface)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-3)',
                                display: 'grid',
                                /**
                                 * Ba cột CỐ ĐỊNH: ảnh · nội dung · giá.
                                 *
                                 * Trước đây dùng `repeat(auto-fit, minmax(…,
                                 * auto))`, nên bề rộng cột co theo nội dung và
                                 * mỗi hàng phòng lệch nhau một kiểu — nhìn như
                                 * bố cục vỡ. Cột ảnh và cột giá nay cố định,
                                 * cột giữa nhận phần còn lại, nên mọi hàng
                                 * thẳng lối.
                                 */
                                gridTemplateColumns: '260px minmax(0, 1fr) 200px',
                                gap: 'var(--space-6)',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: 'var(--radius)',
                                    overflow: 'hidden',
                                    minWidth: 0,
                                }}
                            >
                                <ImageSlot
                                    placeholder={pick(room.name, locale)}
                                    src={room.images?.[0]}
                                    height={170}
                                    style={{
                                        borderRadius: 'var(--radius)',
                                        background: 'var(--surface-tint)',
                                    }}
                                />
                            </div>

                            <div style={{ padding: '6px 0', minWidth: 0 }}>
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
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 800,
                                        color: 'var(--brand)',
                                        margin: '0 0 var(--space-2)',
                                        letterSpacing: '-0.02em',
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
                                    }}
                                >
                                    {pick(room.desc, locale)}
                                </p>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 18,
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <span>{room.area}</span>
                                    <span>
                                        {room.guests} {t.guestsWord}
                                    </span>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-3)',
                                    justifyItems: 'end',
                                    textAlign: 'right',
                                    paddingRight: 18,
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
                                        padding: 'var(--space-3) var(--space-6)',
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--accent)',
                                        color: 'var(--text)',
                                        fontSize: '13.5px',
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t.bookNow}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
