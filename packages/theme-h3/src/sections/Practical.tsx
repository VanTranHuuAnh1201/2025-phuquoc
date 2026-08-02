import { pick, type Locale, type PropertyData } from '@repo/core'
import { Accordion } from '@repo/ui'

import { ui } from '../strings'

/**
 * Dải thực dụng: cách đến đảo + lưu ý bên trái, FAQ bên phải.
 *
 * Prototype không gán id cho khối này — nó không thuộc bộ id của luật R7.
 * Khác mẫu 01: nền teal nhạt, mỗi chặng là một thẻ trắng rời (không phải danh
 * sách có đường kẻ), và khối lưu ý là một tấm CAM đặc để hút mắt.
 */

export function Practical({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            style={{
                background: 'var(--surface-tint)',
                padding: '76px var(--space-6) 84px',
            }}
        >
            <div
                style={{
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                    gap: 44,
                    alignItems: 'start',
                }}
            >
                <div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-xl)',
                            lineHeight: 1.2,
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: 'var(--brand)',
                            margin: '0 0 var(--space-2)',
                        }}
                    >
                        {t.transportTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-muted)',
                            margin: '0 0 22px',
                        }}
                    >
                        {t.transportSub}
                    </p>

                    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                        {data.transport.map((leg) => (
                            <div
                                key={leg.leg.en}
                                style={{
                                    background: 'var(--surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '18px var(--space-6)',
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0,1fr) auto',
                                    gap: 'var(--space-4)',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: '14.5px',
                                            fontWeight: 800,
                                            color: 'var(--brand)',
                                            marginBottom: 4,
                                        }}
                                    >
                                        {pick(leg.leg, locale)}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-muted)',
                                            lineHeight: 1.55,
                                        }}
                                    >
                                        {pick(leg.mode, locale)}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: '13.5px',
                                        fontWeight: 800,
                                        color: 'var(--accent-dark)',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {pick(leg.price, locale)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: 18,
                            padding: '22px 26px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--accent)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 800,
                                color: 'var(--accent-dark)',
                                marginBottom: 'var(--space-3)',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {t.notesTitle}
                        </div>
                        <div style={{ display: 'grid', gap: 9 }}>
                            {data.notes.map((note) => (
                                <div
                                    key={note.en}
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--space-2)',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--text)',
                                            marginTop: 7,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            lineHeight: 1.65,
                                            color: 'var(--text)',
                                        }}
                                    >
                                        {pick(note, locale)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-xl)',
                            lineHeight: 1.2,
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: 'var(--brand)',
                            margin: '0 0 var(--space-2)',
                        }}
                    >
                        {t.faqTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-muted)',
                            margin: '0 0 22px',
                        }}
                    >
                        {t.faqSub}
                    </p>

                    <Accordion
                        gap="var(--space-3)"
                        items={data.faq.map((item) => ({
                            key: item.q.en,
                            question: pick(item.q, locale),
                            answer: pick(item.a, locale),
                        }))}
                    />
                </div>
            </div>
        </section>
    )
}
