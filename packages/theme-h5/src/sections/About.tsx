import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'
import { SectionHead } from '../components/SectionHead'
import { IconFerry, IconHill, IconShuttle } from '../components/icons'

/**
 * Section `about` — mở đầu bằng BAND CÁT FULL-WIDTH "Đường ra đảo" dính liền
 * mép hero (widget tìm phòng đậu vắt lên band này — mô liên kết của trang),
 * rồi tới khối giới thiệu ảnh trái · chữ phải + dải facts.
 *
 * Trust bằng chi tiết thật: tàu ~2h, đường đồi 1,8km (nói cả điều bất lợi) —
 * spec §3.1.
 */

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    const ways = [
        { icon: <IconFerry size={26} />, text: t.wayFerry },
        { icon: <IconShuttle size={26} />, text: t.wayPickup },
        { icon: <IconHill size={26} />, text: t.wayHill },
    ]

    return (
        <section id="about">
            {/* ---- band cát: Đường ra đảo ---- */}
            <div style={{ background: 'var(--color-surface-sand)' }}>
                <div className="h5-container h5-way-inner">
                    <p className="h5-kicker" style={{ margin: '0 0 var(--space-4)' }}>
                        {t.wayKicker}
                    </p>
                    <div className="h5-way-grid" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        {ways.map((way, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    gap: 'var(--space-3)',
                                    alignItems: 'flex-start',
                                    color: 'var(--color-text-primary)',
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 999,
                                        display: 'grid',
                                        placeItems: 'center',
                                        background: 'var(--color-surface-raised)',
                                        color: 'var(--color-brand)',
                                        boxShadow: 'var(--shadow-1)',
                                        flexShrink: 0,
                                    }}
                                >
                                    {way.icon}
                                </span>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 'var(--font-size-base)',
                                        lineHeight: 1.55,
                                    }}
                                >
                                    {way.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- giới thiệu: ảnh dọc trái + chữ phải ---- */}
            <div
                className="h5-container h5-about-grid"
                style={{
                    display: 'grid',
                    gap: 'var(--space-6)',
                    alignItems: 'center',
                    paddingTop: 'var(--space-7)',
                }}
            >
                <div
                    className="h5-about-photo"
                    style={{
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        aspectRatio: '4 / 5',
                        background: 'var(--color-surface-sand)',
                    }}
                >
                    {/* Ảnh crawl — DEV-ONLY theo R9, thay bằng ảnh khách chụp (spec §8.3). */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://thenamduhill.com/image/catalog/banner/namdu-2.jpg"
                        alt={
                            locale === 'vi'
                                ? 'Góc nghỉ tại The Nam Du Hill nhìn ra biển'
                                : 'A corner of The Nam Du Hill facing the sea'
                        }
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div>
                    <SectionHead
                        kicker={t.aboutKicker}
                        title={pick(data.about.title, locale)}
                    />
                    {data.about.body.map((paragraph, i) => (
                        <p
                            key={i}
                            style={{
                                margin: '0 0 var(--space-3)',
                                color: 'var(--color-text-secondary)',
                                maxWidth: '60ch',
                            }}
                        >
                            {pick(paragraph, locale)}
                        </p>
                    ))}

                    {/* dải facts — 21 đảo · 309m · 9,12km² · T12–T3 */}
                    <dl
                        className="h5-facts"
                        style={{
                            display: 'grid',
                            gap: 'var(--space-4)',
                            margin: 'var(--space-5) 0 0',
                            paddingTop: 'var(--space-4)',
                            borderTop: '1px solid var(--color-border-muted)',
                        }}
                    >
                        {data.facts.map((fact, i) => (
                            <div key={i}>
                                <dt
                                    className="h5-display"
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
            </div>

            <style>{`
                .h5-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .h5-way-inner { padding-top: var(--space-5); padding-bottom: var(--space-5); }
                @media (min-width: 900px) {
                    /* Chừa chỗ cho widget hero đang đậu 60px lên band này. */
                    .h5-way-inner {
                        padding-top: calc(var(--space-5) + 60px);
                        padding-bottom: var(--space-5);
                    }
                    .h5-way-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .h5-about-grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
                    .h5-facts { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
                @media (max-width: 899.98px) {
                    /* K7: ảnh lên trước chữ, facts lưới 2×2, không cuộn ngang. */
                    .h5-about-photo { max-width: 420px; }
                }
            `}</style>
        </section>
    )
}
