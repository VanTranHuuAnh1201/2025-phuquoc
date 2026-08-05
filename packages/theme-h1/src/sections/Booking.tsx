import { pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'
import { IconChevronDown } from '../components/icons'

/**
 * Section `booking` — dải đậm thứ nhất của trang (tối đa 2, cùng footer).
 *
 * Lý do đặt trực tiếp là ưu đãi THẬT (đưa đón bến tàu miễn phí — có trong
 * dữ liệu hero.badges), KHÔNG treo "giảm 20%" khi không có promotion seed (M4).
 * FAQ dùng <details> — accordion tĩnh, không JS (D-9), target ≥44px.
 */

const SLUG = meta.slug

export function Booking({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const roomsHref = `${themePath(SLUG, 'rooms')}${locale === 'vi' ? '' : '?lang=en'}`
    const faq = data.faq.slice(0, 4)

    return (
        <section id="booking" className="pt-7">
            <div className="bg-surface-strong py-6 text-text-inverse">
                <div className="h6-container flex flex-wrap items-center justify-between gap-5">
                    <h2 className="h6-display m-0 max-w-[26ch] text-2xl">{t.bookingTitle}</h2>
                    {/* Dưới 640px CTA chiếm trọn bề ngang để ngón cái không phải nhắm. */}
                    <div className="w-full sm:w-auto">
                        <a className="h6-btn h6-btn-primary w-full" href={roomsHref}>
                            {t.bookingCta}
                        </a>
                        {/* Spec §6.4: dòng tàu hoãn phải nằm SÁT CTA đặt phòng. */}
                        <p className="mt-2 mb-0 text-center text-sm opacity-[0.88]">
                            {t.weatherLine}
                        </p>
                    </div>
                </div>
            </div>

            {faq.length > 0 && (
                <div className="h6-container max-w-[820px] pt-5">
                    <h3 className="h6-display mt-0 mb-3 text-xl">{t.faqTitle}</h3>
                    {faq.map((item, i) => (
                        <details key={i} className="group border-b border-border-muted">
                            <summary
                                className={[
                                    'flex min-h-[44px] cursor-pointer list-none items-center',
                                    'justify-between gap-3 py-2 font-medium',
                                ].join(' ')}
                            >
                                {pick(item.q, locale)}
                                <span
                                    aria-hidden="true"
                                    className={[
                                        'text-text-tertiary',
                                        'transition-transform duration-[var(--motion-instant)] ease-out',
                                        'group-open:rotate-180',
                                    ].join(' ')}
                                >
                                    <IconChevronDown size={18} />
                                </span>
                            </summary>
                            <p className="mt-0 mb-3 max-w-[68ch] text-sm text-text-secondary">
                                {pick(item.a, locale)}
                            </p>
                        </details>
                    ))}
                </div>
            )}

            {/* GIỮ NGUYÊN: `::-webkit-details-marker` là pseudo-element riêng của
                WebKit, Tailwind không có variant cho nó. `list-none` ở trên đã xử
                lý Firefox/Chromium mới, dòng này dọn nốt Safari cũ. */}
            <style>{`
                #booking summary::-webkit-details-marker { display: none; }
            `}</style>
        </section>
    )
}
