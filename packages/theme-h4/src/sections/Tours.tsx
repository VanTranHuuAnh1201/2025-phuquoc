import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Lịch trình combo — mọi tour hiện SONG SONG, không có tab.
 *
 * Đây là khác biệt cấu trúc rõ nhất so với mẫu 01: prototype mẫu 04 đặt hai
 * thẻ tour cạnh nhau, mỗi thẻ có đầu thẻ nền trắng (mã · tên · giá) rồi thân
 * thẻ nền nhạt liệt kê đủ lịch trình từng ngày. Vì không có trạng thái nên
 * section này render hoàn toàn trên server.
 */

export function Tours({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="tours"
            style={{
                background: 'var(--surface)',
                padding: '76px var(--space-6) var(--space-20)',
                scrollMarginTop: '110px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 34 }}>
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
                        {t.toursKicker}
                    </div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            lineHeight: 1.16,
                            fontWeight: 900,
                            color: 'var(--brand)',
                            letterSpacing: '-0.035em',
                            margin: '0 0 10px',
                            textWrap: 'balance',
                        }}
                    >
                        {t.toursTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-muted)',
                            margin: '0 auto',
                            maxWidth: 520,
                            textWrap: 'pretty',
                        }}
                    >
                        {t.toursSub}
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                        gap: 'var(--space-6)',
                    }}
                >
                    {data.tours.map((tour) => (
                        <article
                            key={tour.id}
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                background: 'var(--surface-alt)',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    padding: '26px 30px',
                                    background: 'var(--surface)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: 'var(--space-5)',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            padding: '4px 11px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--accent)',
                                            color: 'var(--text)',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 800,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {tour.code}
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 900,
                                            color: 'var(--brand)',
                                            letterSpacing: '-0.03em',
                                            margin: '0 0 6px',
                                        }}
                                    >
                                        {pick(tour.name, locale)}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-muted)',
                                            margin: 0,
                                        }}
                                    >
                                        {pick(tour.summary, locale)}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {t.fromPrice}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 24,
                                            fontWeight: 900,
                                            color: 'var(--accent-dark)',
                                            letterSpacing: '-0.03em',
                                        }}
                                    >
                                        {formatPrice(tour.price, locale)}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {t.perGuest}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: '24px 30px 26px',
                                    display: 'grid',
                                    gap: 18,
                                    flex: 1,
                                }}
                            >
                                {tour.days.map((day, index) => (
                                    <div key={day.label.en}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                marginBottom: 10,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 26,
                                                    height: 26,
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--brand)',
                                                    color: 'var(--text-inverse)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 800,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {index + 1}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-base)',
                                                    fontWeight: 800,
                                                    color: 'var(--brand)',
                                                    letterSpacing: '-0.015em',
                                                }}
                                            >
                                                {pick(day.label, locale)}
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'grid',
                                                gap: 'var(--space-2)',
                                                paddingLeft: 36,
                                            }}
                                        >
                                            {day.items.map((item) => (
                                                <div
                                                    key={item.en}
                                                    style={{
                                                        display: 'flex',
                                                        gap: 'var(--space-3)',
                                                        alignItems: 'flex-start',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: 5,
                                                            height: 5,
                                                            borderRadius: 'var(--radius-pill)',
                                                            background: 'var(--accent)',
                                                            marginTop: 8,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            fontSize: 'var(--text-sm)',
                                                            lineHeight: 1.68,
                                                            color: 'var(--text-muted)',
                                                        }}
                                                    >
                                                        {pick(item, locale)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '0 30px 28px' }}>
                                <a
                                    href={themePath(SLUG, 'tours')}
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
                                    {t.bookTour}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
