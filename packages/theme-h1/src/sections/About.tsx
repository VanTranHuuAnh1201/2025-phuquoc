import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot, Pill } from '@repo/ui'

/**
 * Dải số liệu + giới thiệu.
 *
 * Prototype đặt bốn ô số liệu ngay dưới hero rồi mới tới khối about hai cột;
 * cả hai cùng nằm trên nền trắng nên gộp chung một khối liền mạch.
 */

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { facts, about } = data

    return (
        <>
            <section style={{ background: 'var(--surface)', padding: '56px var(--space-6) 8px' }}>
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--space-4)',
                    }}
                >
                    {facts.map((fact) => (
                        <div
                            key={fact.label.en}
                            style={{
                                background: 'var(--surface-alt)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                padding: '22px var(--space-6)',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '30px',
                                    fontWeight: 800,
                                    color: 'var(--accent)',
                                    letterSpacing: '-0.03em',
                                    marginBottom: 4,
                                }}
                            >
                                {fact.value}
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.5,
                                }}
                            >
                                {pick(fact.label, locale)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section
                id="about"
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-16) var(--space-6)',
                    scrollMarginTop: '80px',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                        gap: '56px',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <Pill>{pick(about.kicker, locale)}</Pill>
                        </div>

                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-2xl)',
                                lineHeight: 1.18,
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                color: 'var(--text)',
                                margin: '0 0 18px',
                            }}
                        >
                            {pick(about.title, locale)}
                        </h2>

                        {about.body.map((paragraph, index) => (
                            <p
                                key={paragraph.en}
                                style={{
                                    fontSize: 'var(--text-base)',
                                    lineHeight: 1.8,
                                    color: 'var(--text-muted)',
                                    margin:
                                        index === about.body.length - 1
                                            ? '0 0 28px'
                                            : '0 0 var(--space-3)',
                                    textWrap: 'pretty',
                                }}
                            >
                                {pick(paragraph, locale)}
                            </p>
                        ))}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            {about.services.map((service) => (
                                <Pill
                                    key={service.en}
                                    tone="neutral"
                                    dot
                                    style={{ padding: '10px var(--space-4)', fontSize: 'var(--text-sm)' }}
                                >
                                    {pick(service, locale)}
                                </Pill>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                            gridTemplateRows: '176px 176px',
                            gap: 'var(--space-3)',
                        }}
                    >
                        <div style={{ gridRow: 'span 2', borderRadius: 'var(--radius-lg)' }}>
                            <ImageSlot
                                placeholder={locale === 'vi' ? 'Toàn cảnh resort' : 'Resort overview'}
                                height="100%"
                                style={{ borderRadius: 'var(--radius-lg)' }}
                            />
                        </div>
                        <ImageSlot
                            placeholder={locale === 'vi' ? 'Hồ bơi' : 'Swimming pool'}
                            height="100%"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        />
                        <ImageSlot
                            placeholder={locale === 'vi' ? 'Café & Bar' : 'Café & Bar'}
                            height="100%"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}
