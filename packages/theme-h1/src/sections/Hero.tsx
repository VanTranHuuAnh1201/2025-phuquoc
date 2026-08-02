import { pick, type Locale, type PropertyData } from '@repo/core'
import { Button } from '@repo/ui'

/**
 * Hero mẫu 01 — căn giữa, nền đậm, badge xếp ngang.
 *
 * Section này chỉ lo HÌNH THỨC. Không gọi API, không tính giá, không định
 * nghĩa type dữ liệu (luật R4).
 */

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { hero, brand } = data

    return (
        <section
            id="top"
            style={{
                background: 'var(--surface-inverse)',
                color: 'var(--text-inverse)',
                padding: 'var(--space-16) var(--space-4)',
                textAlign: 'center',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <p
                    style={{
                        fontSize: 'var(--text-sm)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--brand-light)',
                        marginBottom: 'var(--space-4)',
                    }}
                >
                    {pick(hero.kicker, locale)}
                </p>

                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-3xl)',
                        lineHeight: 1.15,
                        fontWeight: 800,
                        maxWidth: '20ch',
                        margin: '0 auto var(--space-6)',
                    }}
                >
                    {pick(hero.title, locale)}
                </h1>

                <p
                    style={{
                        fontSize: 'var(--text-lg)',
                        lineHeight: 1.7,
                        maxWidth: '60ch',
                        margin: '0 auto var(--space-8)',
                        opacity: 0.85,
                    }}
                >
                    {pick(hero.sub, locale)}
                </p>

                <ul
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--space-3)',
                        justifyContent: 'center',
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 var(--space-8)',
                    }}
                >
                    {hero.badges.map((badge) => (
                        <li
                            key={badge.en}
                            style={{
                                fontSize: 'var(--text-sm)',
                                padding: 'var(--space-2) var(--space-4)',
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--brand-light)',
                            }}
                        >
                            {pick(badge, locale)}
                        </li>
                    ))}
                </ul>

                <Button size="lg">
                    <a href="#booking" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {locale === 'vi' ? 'Đặt phòng ngay' : 'Book now'}
                    </a>
                </Button>

                <p
                    style={{
                        marginTop: 'var(--space-8)',
                        fontSize: 'var(--text-sm)',
                        opacity: 0.6,
                    }}
                >
                    {pick(brand.address, locale)} · {brand.phone}
                </p>
            </div>
        </section>
    )
}
