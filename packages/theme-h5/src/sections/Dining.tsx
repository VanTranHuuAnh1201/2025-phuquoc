import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'
import { SectionHead } from '../components/SectionHead'

/**
 * Section `dining` — chữ trái (danh sách 4 mục kèm giờ mở cụ thể) · ảnh phải.
 * Giờ mở cửa cụ thể là chi tiết trust (spec §3.1). Bố cục 7:5 khác hẳn lưới
 * card của `rooms` liền trước (nhịp so le).
 */

export function Dining({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    return (
        <section id="dining" style={{ padding: 'var(--space-7) 0 0' }}>
            <div
                className="h5-container h5-dining-grid"
                style={{ display: 'grid', gap: 'var(--space-6)', alignItems: 'stretch' }}
            >
                <div>
                    <SectionHead
                        kicker={t.diningKicker}
                        title={
                            locale === 'vi'
                                ? 'Ăn ngay tại resort, không phải xuống núi'
                                : 'Eat well without leaving the hill'
                        }
                    />

                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {data.dining.map((item) => (
                            <li
                                key={item.id}
                                style={{
                                    padding: 'var(--space-3) 0',
                                    borderBottom: '1px solid var(--color-border-muted)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 'var(--space-3)',
                                        flexWrap: 'wrap',
                                        alignItems: 'baseline',
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
                                        maxWidth: '52ch',
                                    }}
                                >
                                    {pick(item.desc, locale)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Ảnh kéo đủ chiều cao cột chữ — tránh khoảng trắng lửng dưới ảnh. */}
                <div
                    className="h5-dining-photo"
                    style={{
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        minHeight: 380,
                        background: 'var(--color-surface-sand)',
                    }}
                >
                    {/* Ảnh crawl — DEV-ONLY theo R9 (spec §8.3 đề nghị ảnh BBQ thật). */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://thenamduhill.com/image/catalog/banner/restaurant.jpg"
                        alt={
                            locale === 'vi'
                                ? 'Nhà hàng của resort nhìn ra biển'
                                : 'The resort restaurant facing the sea'
                        }
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .h5-dining-grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
                }
                @media (max-width: 899.98px) {
                    /* K7: mobile bỏ ảnh, giữ danh sách chữ + đường kẻ (spec §3.1). */
                    .h5-dining-photo { display: none; }
                }
            `}</style>
        </section>
    )
}
