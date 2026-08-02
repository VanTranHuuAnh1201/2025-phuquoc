import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

/**
 * Giới thiệu + dải số liệu.
 *
 * Mẫu 04 đảo thứ tự so với mẫu 01: khối about hai cột đứng trước, dải số liệu
 * theo sau. Chip dịch vụ xếp thành lưới hai cột chứ không trôi tự do, và ô ảnh
 * lớn bo góc rất mềm (radius-lg gấp đôi) tạo dáng "viên sỏi" đặc trưng.
 */

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { about, facts, rooms } = data
    const images = rooms.flatMap((room) => room.images ?? [])

    return (
        <>
            <section
                id="about"
                style={{
                    background: 'var(--surface)',
                    padding: '84px var(--space-6) var(--space-5)',
                    scrollMarginTop: '110px',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                        gap: 56,
                        alignItems: 'center',
                    }}
                >
                    <div>
                        {/* Kicker của mẫu 04 là chữ hoa trần, không phải viên pill. */}
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
                            {pick(about.kicker, locale)}
                        </div>

                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-2xl)',
                                lineHeight: 1.16,
                                fontWeight: 900,
                                color: 'var(--brand)',
                                letterSpacing: '-0.035em',
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
                                            ? '0 0 var(--space-6)'
                                            : '0 0 var(--space-3)',
                                    textWrap: 'pretty',
                                }}
                            >
                                {pick(paragraph, locale)}
                            </p>
                        ))}

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                                gap: 'var(--space-3)',
                            }}
                        >
                            {about.services.map((service) => (
                                <div
                                    key={service.en}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: '14px 16px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--surface-alt)',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--accent)',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 700,
                                            color: 'var(--brand)',
                                        }}
                                    >
                                        {pick(service, locale)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                            gridTemplateRows: '184px 184px',
                            gap: 'var(--space-3)',
                        }}
                    >
                        <div
                            style={{
                                gridRow: 'span 2',
                                // Ô lớn bo cực mềm — dấu nhận biết của mẫu 04.
                                borderRadius: 'calc(var(--radius-lg) * 2)',
                                overflow: 'hidden',
                            }}
                        >
                            <ImageSlot
                                placeholder={locale === 'vi' ? 'Toàn cảnh resort' : 'Resort overview'}
                                src={images[0]}
                                height="100%"
                                style={{ borderRadius: 'inherit' }}
                            />
                        </div>
                        <ImageSlot
                            placeholder={locale === 'vi' ? 'Hồ bơi' : 'Swimming pool'}
                            src={images[1]}
                            height="100%"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        />
                        <ImageSlot
                            placeholder="Café & Bar"
                            src={images[2]}
                            height="100%"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        />
                    </div>
                </div>
            </section>

            <section style={{ background: 'var(--surface)', padding: '48px var(--space-6) 8px' }}>
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                        gap: 'var(--space-4)',
                    }}
                >
                    {facts.map((fact) => (
                        <div
                            key={fact.label.en}
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--surface-alt)',
                                padding: '24px 26px',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 32,
                                    fontWeight: 900,
                                    color: 'var(--brand)',
                                    letterSpacing: '-0.035em',
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
        </>
    )
}
