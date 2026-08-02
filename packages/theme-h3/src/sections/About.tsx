import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

/**
 * Giới thiệu mẫu 03 — nằm SAU tours (mẫu 01 đặt ngay dưới hero) và đặt trên
 * NỀN TEAL ĐẬM, chữ trắng: một dải tối chen giữa các dải sáng để cắt nhịp.
 *
 * Số liệu (`facts`) gộp luôn vào cột trái dưới dạng bốn ô mờ, không tách thành
 * dải riêng như mẫu 01. Bên phải là mosaic ba ảnh, ô lớn bo góc 50px.
 */

const MOSAIC = [
    { vi: 'Toàn cảnh resort', en: 'Resort overview' },
    { vi: 'Hồ bơi', en: 'Swimming pool' },
    { vi: 'Café & Bar', en: 'Café & Bar' },
] as const

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { about, facts } = data
    const images = data.rooms.flatMap((room) => room.images ?? [])

    return (
        <section
            id="about"
            style={{
                background: 'var(--surface-inverse)',
                padding: '76px var(--space-6) 84px',
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
                <div>
                    <div
                        style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            color: 'var(--accent)',
                            letterSpacing: '0.14em',
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
                            lineHeight: 1.18,
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: 'var(--text-inverse)',
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
                                color: 'var(--text-inverse)',
                                opacity: 0.78,
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
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                            gap: 'var(--space-3)',
                        }}
                    >
                        {facts.map((fact) => (
                            <div
                                key={fact.label.en}
                                style={{
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--overlay-soft)',
                                    padding: '18px var(--space-5)',
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '26px',
                                        fontWeight: 800,
                                        color: 'var(--accent)',
                                        letterSpacing: '-0.03em',
                                        marginBottom: 3,
                                    }}
                                >
                                    {fact.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-inverse)',
                                        opacity: 0.72,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {pick(fact.label, locale)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                        gridTemplateRows: '186px 186px',
                        gap: 'var(--space-3)',
                    }}
                >
                    {MOSAIC.map((tile, index) => (
                        <div
                            key={tile.en}
                            style={{
                                gridRow: index === 0 ? 'span 2' : undefined,
                                borderRadius: index === 0 ? 50 : 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}
                        >
                            <ImageSlot
                                placeholder={tile[locale]}
                                src={images[index]}
                                height="100%"
                                style={{
                                    borderRadius: index === 0 ? 50 : 'var(--radius-lg)',
                                    background: 'var(--overlay-soft)',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
