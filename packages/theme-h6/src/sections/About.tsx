import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `about` — spec v4 §4.2: "Đường ra đảo + câu chuyện resort trên đồi
 * Củ Tron", dựng theo ngôn ngữ DÒNG chứ không card:
 *
 *   trái: câu chuyện (serif) + dải facts kẻ dọc
 *   phải: BẢNG CHẶNG ĐƯỜNG RA ĐẢO — 4 chặng thật với phương tiện + giá thật
 *         từ `core.transport` (chi tiết thật = trust, spec §2.1)
 *
 * Nói thẳng cả điều bất lợi (tàu 2–3 giờ, xe đêm) thay vì slogan — người đọc
 * thấy resort hiểu hành trình của họ.
 */

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    return (
        <section id="about" style={{ padding: 'var(--space-7) 0 0' }}>
            <div
                className="h6-container h6-about-grid"
                style={{ display: 'grid', gap: 'var(--space-6)', alignItems: 'start' }}
            >
                {/* ---- câu chuyện + facts ---- */}
                <div>
                    <p className="h6-kicker" style={{ margin: '0 0 var(--space-3)' }}>
                        {t.aboutKicker}
                    </p>
                    <h2
                        className="h6-display"
                        style={{
                            fontSize: 'var(--font-size-3xl)',
                            margin: '0 0 var(--space-4)',
                            maxWidth: '22ch',
                        }}
                    >
                        {pick(data.about.title, locale)}
                    </h2>
                    {data.about.body.map((paragraph, i) => (
                        <p
                            key={i}
                            style={{
                                margin: '0 0 var(--space-3)',
                                color: 'var(--color-text-secondary)',
                                maxWidth: '58ch',
                            }}
                        >
                            {pick(paragraph, locale)}
                        </p>
                    ))}

                    {/* dải facts — số serif xanh, kẻ dọc ngăn cách */}
                    <dl
                        className="h6-facts"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--space-3) 0',
                            margin: 'var(--space-5) 0 0',
                        }}
                    >
                        {data.facts.map((fact, i) => (
                            <div
                                key={i}
                                style={{
                                    paddingRight: 'var(--space-4)',
                                    marginRight: 'var(--space-4)',
                                    borderRight:
                                        i < data.facts.length - 1
                                            ? '1px solid var(--color-border-default)'
                                            : 'none',
                                }}
                            >
                                <dt
                                    className="h6-display"
                                    style={{
                                        fontSize: 'var(--font-size-2xl)',
                                        color: 'var(--color-brand)',
                                    }}
                                >
                                    {fact.value}
                                </dt>
                                <dd
                                    style={{
                                        margin: 0,
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-secondary)',
                                    }}
                                >
                                    {pick(fact.label, locale)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* ---- bảng chặng đường ra đảo ---- */}
                <div
                    style={{
                        background: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border-muted)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                    }}
                >
                    <p
                        className="h6-kicker"
                        style={{
                            margin: 0,
                            padding: 'var(--space-3) var(--space-4)',
                            background: 'var(--color-surface-sand)',
                        }}
                    >
                        {t.wayKicker}
                    </p>
                    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {data.transport.map((leg, i) => (
                            <li
                                key={i}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '24px minmax(0, 1fr) auto',
                                    gap: '2px var(--space-3)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderTop: i > 0 ? '1px solid var(--color-border-muted)' : 'none',
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        gridRow: '1 / span 2',
                                        width: 24,
                                        height: 24,
                                        borderRadius: 999,
                                        display: 'grid',
                                        placeItems: 'center',
                                        background: 'var(--color-info-bg)',
                                        color: 'var(--color-brand)',
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 'var(--font-weight-bold)' as never,
                                        marginTop: 2,
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <span
                                    style={{
                                        fontWeight: 'var(--font-weight-bold)' as never,
                                        fontSize: 'var(--font-size-sm)',
                                    }}
                                >
                                    {pick(leg.leg, locale)}
                                </span>
                                <span
                                    style={{
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 'var(--font-weight-medium)' as never,
                                        color: 'var(--color-text-primary)',
                                        fontVariantNumeric: 'tabular-nums',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {pick(leg.price, locale)}
                                </span>
                                <span
                                    style={{
                                        gridColumn: 2,
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-secondary)',
                                    }}
                                >
                                    {pick(leg.mode, locale)}
                                </span>
                            </li>
                        ))}
                    </ol>
                    {/* Chốt chặng cuối bằng lời hứa thật của resort. */}
                    <p
                        style={{
                            margin: 0,
                            padding: 'var(--space-3) var(--space-4)',
                            borderTop: '1px solid var(--color-border-muted)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-brand)',
                            fontWeight: 'var(--font-weight-medium)' as never,
                        }}
                    >
                        {t.trustShuttle} · {t.weatherLine}
                    </p>
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .h6-about-grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
                }
            `}</style>
        </section>
    )
}
