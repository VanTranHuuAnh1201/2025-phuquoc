import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug
import { Heading } from './Kicker'

/**
 * Lịch trình combo — mẫu 02 bày SONG SONG tất cả combo, mỗi combo là một thẻ
 * có đầu thẻ nền teal (mã · tên · giá) rồi tới lịch trình từng ngày.
 *
 * Vì vậy section này KHÔNG cần trạng thái, khác mẫu 01 (tab chọn tour). Không
 * `'use client'` — cả section render trên server.
 */

export function Tours({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="tours"
            style={{
                background: 'var(--surface-tint)',
                padding: '76px var(--space-6) 84px',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div style={{ marginBottom: 38 }}>
                    <Heading
                        kicker={t.toursKicker}
                        title={t.toursTitle}
                        sub={t.toursSub}
                        align="center"
                    />
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
                                background: 'var(--surface)',
                                borderRadius: 30,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--surface-inverse)',
                                    padding: '26px 30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 'var(--space-5)',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            color: 'var(--accent)',
                                            letterSpacing: '0.12em',
                                            marginBottom: 6,
                                        }}
                                    >
                                        {tour.code}
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 800,
                                            color: 'var(--text-inverse)',
                                            margin: '0 0 6px',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {pick(tour.name, locale)}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-inverse)',
                                            opacity: 0.74,
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
                                            color: 'var(--text-inverse)',
                                            opacity: 0.6,
                                        }}
                                    >
                                        {t.fromPrice}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 24,
                                            fontWeight: 800,
                                            color: 'var(--accent)',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {formatPrice(tour.price, locale)}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-inverse)',
                                            opacity: 0.6,
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
                                    alignContent: 'start',
                                }}
                            >
                                {tour.days.map((day, index) => (
                                    <div key={day.label.en}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                marginBottom: 'var(--space-3)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 26,
                                                    height: 26,
                                                    borderRadius: 'var(--radius-pill)',
                                                    background: 'var(--accent)',
                                                    color: 'var(--text)',
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
                                                    letterSpacing: '-0.01em',
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
                                                            background: 'var(--brand)',
                                                            marginTop: 8,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            fontSize: 'var(--text-sm)',
                                                            lineHeight: 1.65,
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
                                        background: 'var(--brand)',
                                        color: 'var(--text-inverse)',
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 700,
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
