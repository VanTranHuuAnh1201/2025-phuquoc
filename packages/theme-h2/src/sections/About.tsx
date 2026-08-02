import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { Heading } from './Kicker'

/**
 * Dải số liệu + giới thiệu.
 *
 * Khác mẫu 01 ở hai điểm: ô số liệu chỉ có viền (không nền), và cụm ảnh nằm
 * bên TRÁI còn chữ bên phải. Chip dịch vụ nền teal nhạt, chấm cam.
 */

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { facts, about } = data

    return (
        <>
            <section style={{ background: 'var(--surface)', padding: '56px var(--space-6) var(--space-2)' }}>
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                        gap: 'var(--space-5)',
                    }}
                >
                    {facts.map((fact) => (
                        <div
                            key={fact.label.en}
                            style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '24px 26px',
                                background: 'var(--surface)',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 32,
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
                    padding: '72px var(--space-6)',
                    scrollMarginTop: '80px',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                        gap: 60,
                        alignItems: 'center',
                    }}
                >
                    {/* Cụm ảnh bên trái: một ô cao gấp đôi + hai ô nhỏ. */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                            gridTemplateRows: '180px 180px',
                            gap: 14,
                        }}
                    >
                        <div style={{ gridRow: 'span 2', borderRadius: 30, overflow: 'hidden' }}>
                            <ImageSlot
                                placeholder={locale === 'vi' ? 'Toàn cảnh resort' : 'Resort overview'}
                                height="100%"
                                style={{ borderRadius: 30 }}
                            />
                        </div>
                        <ImageSlot
                            placeholder={locale === 'vi' ? 'Hồ bơi' : 'Swimming pool'}
                            height="100%"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        />
                        <ImageSlot
                            placeholder="Café & Bar"
                            height="100%"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        />
                    </div>

                    <div>
                        <Heading
                            kicker={pick(about.kicker, locale)}
                            title={pick(about.title, locale)}
                        />

                        <div style={{ marginTop: 18 }}>
                            {about.body.map((paragraph, index) => (
                                <p
                                    key={paragraph.en}
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        lineHeight: 1.8,
                                        color: 'var(--text-muted)',
                                        margin:
                                            index === about.body.length - 1
                                                ? '0 0 var(--space-6)'
                                                : '0 0 var(--space-3)',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    {pick(paragraph, locale)}
                                </p>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            {about.services.map((service) => (
                                <span
                                    key={service.en}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        padding: '10px var(--space-4)',
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--surface-tint)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 700,
                                        color: 'var(--brand)',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--accent)',
                                            flexShrink: 0,
                                        }}
                                    />
                                    {pick(service, locale)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
