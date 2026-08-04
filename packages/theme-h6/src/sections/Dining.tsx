import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `dining` — dải cát toàn khổ, trình bày như BẢNG THÔNG TIN ở quầy
 * lễ tân: tên quầy đối xứng giờ mở cửa (chi tiết trust, spec §2.1), mô tả một
 * dòng dưới. Không ảnh, không card — nhịp chữ giữa hai section nhiều ảnh
 * (rooms trước, places sau).
 */

export function Dining({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    return (
        <section id="dining" style={{ padding: 'var(--space-7) 0 0' }}>
            <div style={{ background: 'var(--color-surface-sand)', padding: 'var(--space-6) 0' }}>
                <div
                    className="h6-container h6-dining-grid"
                    style={{ display: 'grid', gap: 'var(--space-5)' }}
                >
                    <div>
                        <p className="h6-kicker" style={{ margin: '0 0 var(--space-2)' }}>
                            {t.diningKicker}
                        </p>
                        <h2
                            className="h6-display"
                            style={{ fontSize: 'var(--font-size-3xl)', margin: 0, maxWidth: '14ch' }}
                        >
                            {locale === 'vi'
                                ? 'Ăn ngay tại resort, không phải xuống núi'
                                : 'Eat well without leaving the hill'}
                        </h2>
                    </div>

                    <ul
                        className="h6-dining-list"
                        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 0 }}
                    >
                        {data.dining.map((item) => (
                            <li
                                key={item.id}
                                style={{
                                    padding: 'var(--space-3) 0',
                                    borderTop: '1px solid var(--color-border-default)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        gap: 'var(--space-3)',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: 'var(--font-size-lg)',
                                            fontWeight: 'var(--font-weight-bold)' as never,
                                        }}
                                    >
                                        {pick(item.name, locale)}
                                    </h3>
                                    <span
                                        style={{
                                            fontSize: 'var(--font-size-sm)',
                                            color: 'var(--color-brand)',
                                            fontWeight: 'var(--font-weight-medium)' as never,
                                            fontVariantNumeric: 'tabular-nums',
                                        }}
                                    >
                                        {pick(item.note, locale)}
                                    </span>
                                </div>
                                <p
                                    style={{
                                        margin: '4px 0 0',
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-secondary)',
                                        maxWidth: '56ch',
                                    }}
                                >
                                    {pick(item.desc, locale)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .h6-dining-grid {
                        grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
                        align-items: start;
                    }
                }
            `}</style>
        </section>
    )
}
