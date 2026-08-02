import type { Locale, PropertyData } from '@repo/core'

import { ui } from '../strings'
import { Heading } from './Kicker'

/**
 * Dải "ba bước là xong" — section RIÊNG của mẫu 02, không có trong bộ id
 * chuẩn của luật R7. Vì vậy `core` chỉ thừa nhận id `steps` là section riêng,
 * không cần biết nó chứa gì.
 *
 * Nội dung là chữ giao diện (cách mẫu 02 trấn an khách), không phải dữ liệu
 * nghiệp vụ — nên nằm trong `strings.ts` của theme chứ không phải `core`.
 */

export function Steps({ locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="steps"
            style={{
                background: 'var(--surface)',
                padding: '76px var(--space-6) var(--space-2)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <Heading
                        kicker={t.stepsKicker}
                        title={t.stepsTitle}
                        sub={t.stepsSub}
                        align="center"
                    />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                        gap: 'var(--space-6)',
                    }}
                >
                    {t.steps.map((step, index) => {
                        const num = `0${index + 1}`
                        return (
                            <div
                                key={step.title}
                                style={{
                                    position: 'relative',
                                    background: 'var(--surface-tint)',
                                    borderRadius: 30,
                                    padding: '34px 30px 32px',
                                }}
                            >
                                {/* Số mờ cỡ lớn ở góc — nhịp điệu riêng của mẫu 02. */}
                                <span
                                    aria-hidden="true"
                                    style={{
                                        position: 'absolute',
                                        top: 26,
                                        right: 28,
                                        fontSize: 40,
                                        fontWeight: 800,
                                        color: 'var(--brand)',
                                        opacity: 0.14,
                                        letterSpacing: '-0.04em',
                                    }}
                                >
                                    {num}
                                </span>

                                <span
                                    style={{
                                        display: 'flex',
                                        width: 52,
                                        height: 52,
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--accent)',
                                        color: 'var(--text)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 800,
                                        marginBottom: 'var(--space-5)',
                                    }}
                                >
                                    {num}
                                </span>

                                <h3
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 700,
                                        color: 'var(--brand)',
                                        margin: '0 0 var(--space-2)',
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.7,
                                        color: 'var(--text-muted)',
                                        margin: 0,
                                    }}
                                >
                                    {step.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
