import { pick, type Locale, type PropertyData } from '@repo/core'
import { Accordion } from '@repo/ui'

import type { UiStrings, UiStringSet } from '../strings'
import { DEFAULT_SECTION_HEADINGS, type SectionHeadingClasses } from './headings'

/**
 * Dải thông tin thực dụng: cách đến đảo + lưu ý bên trái, FAQ dạng accordion
 * bên phải.
 *
 * Prototype không gán id cho khối này — nó không nằm trong bộ section id của
 * luật R7, mà là phần bổ trợ cho `#booking` ngay bên dưới.
 *
 * Section này sống ở `domain-hotel` cho nhiều mẫu của domain lưu trú dùng
 * chung; bộ nhãn `ui` (giọng văn của mẫu) đi vào qua prop (luật R1).
 */

/** Câu dẫn dưới mỗi tiêu đề cột. */
const COL_SUB = 'mt-0 mb-[var(--space-6)] text-base text-text-secondary'

export interface PracticalSectionProps {
    data: PropertyData
    locale: Locale
    /** Bộ nhãn giao diện của mẫu — giọng văn là quyết định của theme. */
    ui: UiStringSet<UiStrings>
    /** Class tiêu đề của mẫu. Không truyền thì dùng bộ trung tính. */
    headingClass?: SectionHeadingClasses
}

export function PracticalSection({
    data,
    locale,
    ui,
    headingClass = DEFAULT_SECTION_HEADINGS,
}: PracticalSectionProps) {
    const t = ui[locale]
    const COL_HEADING = headingClass.column

    return (
        <section className="bg-surface-base px-6 pt-[var(--space-16)] pb-[var(--space-20)]">
            <div className="mx-auto grid max-w-[var(--container)] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[var(--space-12)]">
                <div>
                    <h2 className={COL_HEADING}>{t.transportTitle}</h2>
                    <p className={COL_SUB}>{t.transportSub}</p>

                    <div className="overflow-hidden rounded-lg border border-border-default bg-surface-raised">
                        {data.transport.map((leg, index) => (
                            <div
                                key={leg.leg.en}
                                className={[
                                    'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4',
                                    'px-[var(--space-5)] py-[18px]',
                                    // Chặng cuối không kẻ đáy — viền của khối bao
                                    // ngoài đã đóng lại rồi.
                                    index === data.transport.length - 1
                                        ? ''
                                        : 'border-b border-border-default',
                                ].join(' ')}
                            >
                                <div>
                                    <div className="mb-1 text-base font-bold text-text-primary">
                                        {pick(leg.leg, locale)}
                                    </div>
                                    <div className="text-sm leading-[1.55] text-text-secondary">
                                        {pick(leg.mode, locale)}
                                    </div>
                                </div>
                                <div className="text-sm font-bold whitespace-nowrap text-brand">
                                    {pick(leg.price, locale)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-[var(--space-5)] rounded-lg border border-border-default bg-[var(--surface-tint)] p-[var(--space-5)]">
                        <div className="mb-2 text-sm font-bold text-brand">{t.notesTitle}</div>
                        <div className="grid gap-2">
                            {data.notes.map((note) => (
                                <div key={note.en} className="flex items-start gap-2">
                                    <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />
                                    <span className="text-sm leading-[1.6] text-[var(--brand-dark)]">
                                        {pick(note, locale)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className={COL_HEADING}>{t.faqTitle}</h2>
                    <p className={COL_SUB}>{t.faqSub}</p>

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
