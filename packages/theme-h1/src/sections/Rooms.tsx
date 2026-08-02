import { formatPrice, pick, type Locale, type PropertyData } from '@repo/core'
import { Section } from '@repo/ui'

/**
 * Danh sách hạng phòng mẫu 01 — lưới thẻ, ảnh tỉ lệ 16/10.
 *
 * Giá lấy qua `formatPrice` của core — theme KHÔNG tự định dạng hay tính lại,
 * nhờ vậy N giao diện luôn hiện cùng một con số (luật R8).
 */

export function Rooms({ data, locale }: { data: PropertyData; locale: Locale }) {
    return (
        <Section id="rooms" tone="alt">
            <header style={{ marginBottom: 'var(--space-8)' }}>
                <h2
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 800,
                        color: 'var(--brand)',
                        margin: '0 0 var(--space-2)',
                    }}
                >
                    {locale === 'vi' ? 'Hạng phòng' : 'Rooms & Suites'}
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                    {locale === 'vi'
                        ? 'Chọn hạng phòng phù hợp với chuyến đi của bạn.'
                        : 'Choose the room that fits your trip.'}
                </p>
            </header>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-6)',
                }}
            >
                {data.rooms.map((room) => (
                    <article
                        key={room.id}
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                aspectRatio: '16 / 10',
                                background: 'var(--surface-alt)',
                            }}
                        />

                        <div
                            style={{
                                padding: 'var(--space-4)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-2)',
                                flex: 1,
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 700,
                                    margin: 0,
                                    lineHeight: 1.3,
                                }}
                            >
                                {pick(room.name, locale)}
                            </h3>

                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                    margin: 0,
                                }}
                            >
                                {pick(room.desc, locale)}
                            </p>

                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                    margin: 0,
                                }}
                            >
                                {room.area} ·{' '}
                                {locale === 'vi'
                                    ? `${room.guests} khách`
                                    : `${room.guests} guests`}
                            </p>

                            <ul
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--space-1)',
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 'var(--space-2) 0 0',
                                }}
                            >
                                {room.tags.map((tag) => (
                                    <li
                                        key={tag.en}
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            padding: '2px var(--space-2)',
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--surface-alt)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {pick(tag, locale)}
                                    </li>
                                ))}
                            </ul>

                            <p
                                style={{
                                    marginTop: 'auto',
                                    paddingTop: 'var(--space-4)',
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 800,
                                    color: 'var(--brand)',
                                }}
                            >
                                {formatPrice(room.price, locale)}
                                <span
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 400,
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    {locale === 'vi' ? ' / đêm' : ' / night'}
                                </span>
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </Section>
    )
}
