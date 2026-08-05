import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `about` — spec v4 §4.2: "Đường ra đảo + câu chuyện resort trên đồi
 * Củ Tron", dựng theo ngôn ngữ DÒNG chứ không card:
 *
 *   trái: câu chuyện (serif) + dải facts kẻ dọc
 *   phải: BẢNG CHẶNG ĐƯỜNG RA ĐẢO — 4 chặng thật với phương tiện + giá thật
 *         từ `core.transport` (chi tiết thật = trust, spec §2.1)
 *
 * Nói thẳng cả điều bất lợi (tàu 2–3 giờ, xe đêm) thay vì slogan — người đọc
 * thấy resort hiểu hành trình của họ.
 */

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    return (
        <section id="about" className="pt-7">
            {/* ≥900px chia 7/5 — breakpoint riêng của mẫu, không nằm trong thang
                mặc định của Tailwind nên viết arbitrary variant. */}
            <div className="h6-container grid items-start gap-6 min-[900px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {/* ---- câu chuyện + facts ---- */}
                <div>
                    <p className="h6-kicker mt-0 mb-3">{t.aboutKicker}</p>
                    <h2 className="h6-display mt-0 mb-4 max-w-[22ch] text-3xl">
                        {pick(data.about.title, locale)}
                    </h2>
                    {data.about.body.map((paragraph, i) => (
                        <p key={i} className="mt-0 mb-3 max-w-[58ch] text-text-secondary">
                            {pick(paragraph, locale)}
                        </p>
                    ))}

                    {/* dải facts — số serif xanh, kẻ dọc ngăn cách */}
                    <dl className="mt-5 mb-0 flex flex-wrap gap-x-0 gap-y-3">
                        {data.facts.map((fact, i) => (
                            <div
                                key={i}
                                className={[
                                    'mr-4 pr-4',
                                    // Kẻ dọc giữa các fact — mục cuối không có vạch.
                                    i < data.facts.length - 1
                                        ? 'border-r border-border-default'
                                        : 'border-r-0',
                                ].join(' ')}
                            >
                                <dt className="h6-display text-2xl text-brand">{fact.value}</dt>
                                <dd className="m-0 text-sm text-text-secondary">
                                    {pick(fact.label, locale)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* ---- bảng chặng đường ra đảo ---- */}
                <div className="overflow-hidden rounded-lg border border-border-muted bg-surface-raised">
                    <p className="h6-kicker m-0 bg-[var(--color-surface-sand)] px-4 py-3">
                        {t.wayKicker}
                    </p>
                    <ol className="m-0 list-none p-0">
                        {data.transport.map((leg, i) => (
                            <li
                                key={i}
                                className={[
                                    'grid grid-cols-[24px_minmax(0,1fr)_auto] gap-x-3 gap-y-[2px] px-4 py-3',
                                    i > 0 ? 'border-t border-border-muted' : '',
                                ].join(' ')}
                            >
                                <span
                                    aria-hidden="true"
                                    className="row-[1/span_2] mt-[2px] grid h-[24px] w-[24px] place-items-center rounded-full bg-info-bg text-xs font-bold text-brand"
                                >
                                    {i + 1}
                                </span>
                                <span className="text-sm font-bold">{pick(leg.leg, locale)}</span>
                                <span className="text-sm font-medium whitespace-nowrap text-text-primary [font-variant-numeric:tabular-nums]">
                                    {pick(leg.price, locale)}
                                </span>
                                <span className="col-start-2 text-sm text-text-secondary">
                                    {pick(leg.mode, locale)}
                                </span>
                            </li>
                        ))}
                    </ol>
                    {/* Chốt chặng cuối bằng lời hứa thật của resort. */}
                    <p className="m-0 border-t border-border-muted px-4 py-3 text-sm font-medium text-brand">
                        {t.trustShuttle} · {t.weatherLine}
                    </p>
                </div>
            </div>
        </section>
    )
}
