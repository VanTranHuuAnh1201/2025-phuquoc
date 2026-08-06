'use client'

/**
 * Thanh 5 bước của luồng đặt phòng.
 *
 * TÁCH RA KHỎI `page.tsx` VÌ CÓ HAI ROUTE DÙNG NÓ: bước 1–4 nằm trong state của
 * `/booking`, còn bước 5 là route riêng `/booking/success` — đơn đã tạo xong,
 * khách F5 hay gửi link cho người khác không được tạo lại đơn. Copy sang file
 * thứ hai là vi phạm C10; hai bản sẽ lệch nhau ngay lần sửa đầu tiên.
 */

import { useLocale } from '@/components/LocaleProvider'
import { S, tr } from '@/strings'

/** Bước 5 chỉ đạt được ở `/booking/success`, không phải state của `/booking`. */
export type Step = 1 | 2 | 3 | 4 | 5

export function Stepper({ current }: { current: Step }) {
    const { locale } = useLocale()
    const steps = [
        { n: 1, label: tr(S.stepSearch, locale) },
        { n: 2, label: tr(S.stepSelect, locale) },
        { n: 3, label: tr(S.stepGuest, locale) },
        { n: 4, label: tr(S.stepPayment, locale) },
        { n: 5, label: tr(S.stepDone, locale) },
    ]

    return (
        <nav aria-label={tr(S.stepperLabel, locale)}>
            {/* Người dùng screen reader cần biết đang ở đâu trong bao nhiêu bước
                trước khi nghe hết danh sách. `aria-current` một mình không nói
                được "bước mấy trên mấy". */}
            <p className="booking-stepper__status" role="status">
                {tr(S.stepOf, locale)
                    .replace('{n}', String(current))
                    .replace('{total}', String(steps.length))}
            </p>

            <ol className="booking-stepper">
                {steps.map((step) => {
                    const state =
                        step.n < current ? 'done' : step.n === current ? 'current' : 'todo'

                    return (
                        <li
                            key={step.n}
                            aria-current={state === 'current' ? 'step' : undefined}
                            className="booking-stepper__item"
                            data-state={state}
                        >
                            <span className="booking-stepper__bullet" aria-hidden="true">
                                {state === 'done' ? <CheckIcon /> : step.n}
                            </span>
                            <span className="booking-stepper__label">{step.label}</span>
                        </li>
                    )
                })}
            </ol>

            <style>{`
                .booking-stepper__status {
                    margin: 0 0 var(--space-3);
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                .booking-stepper {
                    display: flex;
                    gap: var(--space-2);
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    flex-wrap: wrap;
                }

                .booking-stepper__item {
                    flex: 1 1 120px;
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-3) var(--space-3);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    /* WCAG 2.2 §2.5.8 — ô bước cũng là mốc chạm khi cuộn ngang. */
                    min-height: 44px;
                }

                .booking-stepper__item[data-state='current'] {
                    background: var(--surface);
                    border-color: var(--brand);
                    color: var(--text);
                    font-weight: 600;
                }

                .booking-stepper__item[data-state='done'] {
                    color: var(--text);
                }

                .booking-stepper__bullet {
                    width: 24px;
                    height: 24px;
                    display: grid;
                    place-items: center;
                    border-radius: 50%;
                    font-size: var(--text-xs);
                    font-weight: 700;
                    flex-shrink: 0;
                    background: var(--border);
                    color: var(--text-muted);
                }

                .booking-stepper__item[data-state='done'] .booking-stepper__bullet {
                    background: var(--success);
                    color: var(--text-inverse);
                }

                .booking-stepper__item[data-state='current'] .booking-stepper__bullet {
                    background: var(--brand);
                    color: var(--text-inverse);
                }

                /* Dưới 640px: 5 ô cạnh nhau thì mỗi ô còn ~60px, nhãn vỡ chữ.
                   Cuộn ngang ĐÚNG ở đây — đây là thanh tiến trình, không phải
                   bảng dữ liệu (thứ mà luật F6/FE5 cấm cuộn ngang). Dòng
                   "Bước n/5" ở trên đã nói đủ thông tin cho người không cuộn. */
                @media (max-width: 639px) {
                    .booking-stepper {
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        scrollbar-width: none;
                        /* Chừa chỗ cho viền focus khỏi bị cắt khi cuộn. */
                        padding: 2px;
                        margin: -2px;
                    }

                    .booking-stepper::-webkit-scrollbar {
                        display: none;
                    }

                    .booking-stepper__item {
                        flex: 0 0 auto;
                    }

                    /* Chỉ bước đang đứng mới cần nhãn chữ — các bước khác thu về
                       số thứ tự để cả 5 ô nằm gần trọn màn 375px. */
                    .booking-stepper__item:not([data-state='current']) .booking-stepper__label {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    )
}

/** Icon SVG, không dùng emoji trong sản phẩm mới (luật FE9/D5). */
export function CheckIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
