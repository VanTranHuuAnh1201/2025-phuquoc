import type { Locale, PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Dải khuyến mãi nền cam — điểm nhấn riêng của mẫu 02, không có ở mẫu 01.
 *
 * Prototype không gán id cho khối này nên nó không thuộc bộ id của luật R7;
 * nó chỉ là cầu nối dẫn xuống `#booking`.
 *
 * Con số 15% là giá trị hiển thị trong prototype. Đây là mức ưu đãi nghiệp vụ
 * đáng lẽ thuộc `core`, nhưng `PropertyData` hiện chưa có trường nào cho nó —
 * xem ghi chú trong báo cáo bàn giao.
 */

const DISCOUNT = '15%'

export function Promo({ locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section style={{ background: 'var(--surface)', padding: '64px var(--space-6) var(--space-2)' }}>
            <div
                style={{
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    borderRadius: 30,
                    background: 'var(--accent)',
                    padding: '34px 44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-8)',
                    flexWrap: 'wrap',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-6)',
                        flexWrap: 'wrap',
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 56,
                            fontWeight: 800,
                            color: 'var(--text)',
                            letterSpacing: '-0.04em',
                            lineHeight: 1,
                        }}
                    >
                        {DISCOUNT}
                    </span>
                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                color: 'var(--text)',
                                opacity: 0.72,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                marginBottom: 4,
                            }}
                        >
                            {t.promoKicker}
                        </div>
                        <div
                            style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 800,
                                color: 'var(--text)',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {t.promoTitle}
                        </div>
                    </div>
                </div>

                <a
                    href="#booking"
                    style={{
                        padding: '15px 32px',
                        borderRadius: 'var(--radius-pill)',
                        background: 'var(--brand)',
                        color: 'var(--text-inverse)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        textDecoration: 'none',
                    }}
                >
                    {t.promoCta}
                </a>
            </div>
        </section>
    )
}
