import { pick, type Locale, type PropertyData } from '@repo/core'
import { Accordion } from '@repo/ui'

import { ui } from '../strings'

/**
 * Dải thông tin thực dụng: cách đến đảo + lưu ý bên trái, FAQ dạng accordion
 * bên phải.
 *
 * Prototype không gán id cho khối này — nó không nằm trong bộ section id của
 * luật R7, mà là phần bổ trợ cho `#booking` ngay bên dưới.
 */

export function Practical({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            style={{
                background: 'var(--surface-alt)',
                padding: 'var(--space-16) var(--space-6) var(--space-20)',
            }}
        >
            <div
                style={{
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                    gap: 'var(--space-12)',
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
                            color: 'var(--text)',
                            margin: '0 0 var(--space-2)',
                        }}
                    >
                        {t.transportTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-muted)',
                            margin: '0 0 var(--space-6)',
                        }}
                    >
                        {t.transportSub}
                    </p>

                    <div
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                        }}
                    >
                        {data.transport.map((leg, index) => (
                            <div
                                key={leg.leg.en}
                                style={{
                                    padding: '18px var(--space-5)',
                                    borderBottom:
                                        index === data.transport.length - 1
                                            ? 'none'
                                            : '1px solid var(--border)',
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0,1fr) auto',
                                    gap: 'var(--space-4)',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-base)',
                                            fontWeight: 700,
                                            color: 'var(--text)',
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
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 700,
                                        color: 'var(--brand)',
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
                            marginTop: 'var(--space-5)',
                            padding: 'var(--space-5)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--surface-tint)',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                color: 'var(--brand)',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {t.notesTitle}
                        </div>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
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
                                            background: 'var(--accent)',
                                            marginTop: 7,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            lineHeight: 1.6,
                                            color: 'var(--brand-dark)',
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
                            color: 'var(--text)',
                            margin: '0 0 var(--space-2)',
                        }}
                    >
                        {t.faqTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-muted)',
                            margin: '0 0 var(--space-6)',
                        }}
                    >
                        {t.faqSub}
                    </p>

                    <Accordion
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
