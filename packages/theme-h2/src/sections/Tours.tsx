'use client'

import { useState } from 'react'
import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { SectionHeader } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Lịch trình combo — tab chọn tour, lịch trình từng ngày bên trái, thẻ giá
 * dính (sticky) bên phải.
 *
 * Đây là section duy nhất của mẫu 07 cần trạng thái, nên chỉ file này là
 * client component; phần còn lại của trang vẫn render trên server.
 *
 * LƯU Ý: không đặt `overflow-x-hidden` lên bất kỳ phần tử cha nào của thẻ giá
 * — sticky sẽ dính vào phần tử đó thay vì vào viewport. Cần cắt tràn thì dùng
 * `overflow-x-clip`.
 */

export function Tours({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const [current, setCurrent] = useState(0)

    const active = data.tours[current] ?? data.tours[0]
    if (!active) return null

    return (
        <section
            id="tours"
            className="bg-surface-raised px-6 pt-[var(--space-16)] pb-[var(--space-20)] [scroll-margin-top:80px]"
        >
            <div className="mx-auto max-w-[var(--container)]">
                <SectionHeader
                    kicker={t.toursKicker}
                    title={t.toursTitle}
                    sub={t.toursSub}
                    align="center"
                />

                <div className="mb-[var(--space-8)] flex flex-wrap justify-center gap-2">
                    {data.tours.map((tour, index) => {
                        const selected = index === current
                        return (
                            <button
                                key={tour.id}
                                type="button"
                                onClick={() => setCurrent(index)}
                                aria-pressed={selected}
                                className={[
                                    'cursor-pointer rounded-full border px-6 py-[11px]',
                                    'font-primary text-sm font-semibold',
                                    'transition-colors duration-200 ease-out',
                                    'motion-reduce:transition-none',
                                    selected
                                        ? 'border-surface-strong bg-surface-strong text-text-inverse'
                                        : 'border-border-default bg-surface-raised text-text-secondary',
                                ].join(' ')}
                            >
                                {pick(tour.name, locale)}
                            </button>
                        )
                    })}
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[var(--space-8)]">
                    <div className="grid gap-4">
                        {active.days.map((day, index) => (
                            <div
                                key={day.label.en}
                                className="rounded-lg border border-border-default bg-surface-raised p-[var(--space-6)]"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-text-inverse">
                                        {index + 1}
                                    </span>
                                    <h3 className="m-0 text-lg font-bold text-text-primary">
                                        {pick(day.label, locale)}
                                    </h3>
                                </div>

                                <div className="grid gap-3">
                                    {day.items.map((item) => (
                                        <div key={item.en} className="flex items-start gap-3">
                                            <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full bg-accent" />
                                            <span className="text-base leading-[1.65] text-text-secondary">
                                                {pick(item, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="sticky top-24 max-w-[360px] rounded-lg bg-surface-strong p-[var(--space-6)]">
                        <div className="mb-2 text-xs font-semibold text-[var(--brand-light)]">
                            {active.code}
                        </div>
                        <div className="mb-2 font-display text-xl leading-[1.3] font-bold text-text-inverse">
                            {pick(active.name, locale)}
                        </div>
                        <p className="mt-0 mb-[var(--space-5)] text-sm leading-[1.65] text-text-inverse opacity-[0.66]">
                            {pick(active.summary, locale)}
                        </p>

                        <div className="mb-[var(--space-5)] border-t border-b border-[var(--overlay-line)] py-4">
                            <div className="mb-1 text-xs text-text-inverse opacity-50">
                                {t.fromPrice}
                            </div>
                            <div className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-text-inverse">
                                {formatPrice(active.price, locale)}
                            </div>
                            <div className="text-xs text-text-inverse opacity-50">{t.perGuest}</div>
                        </div>

                        <a
                            href={themePath(SLUG, 'tours')}
                            className="block rounded-full bg-accent p-3 text-center text-base font-bold text-text-inverse no-underline"
                        >
                            {t.bookTour}
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    )
}
