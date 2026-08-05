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
        <section id="booking" style={{ padding: 'var(--space-7) 0 0' }}>
            <div
                style={{
                    background: 'var(--color-surface-strong)',
                    color: 'var(--color-text-inverse)',
                    padding: 'var(--space-6) 0',
                }}
            >
                <div
                    className="h5-container h5-booking-band"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-5)',
                        flexWrap: 'wrap',
                    }}
                >
                    <h2
                        className="h5-display"
                        style={{
                            fontSize: 'var(--font-size-2xl)',
                            maxWidth: '26ch',
                            margin: 0,
                        }}
                    >
                        {t.bookingTitle}
                    </h2>
                    <a className="h5-btn h5-btn-primary h5-booking-cta" href={roomsHref}>
                        {t.bookingCta}
                    </a>
                </div>
            </div>

            {faq.length > 0 && (
                <div style={{ background: 'var(--color-surface-sand)' }}>
                <div
                    className="h5-container"
                    style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-5)' }}
                >
                    <h3
                        className="h5-display"
                        style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--space-3)' }}
                    >
                        {t.faqTitle}
                    </h3>
                    {faq.map((item, i) => (
                        <details
                            key={i}
                            style={{ borderBottom: '1px solid var(--color-border-default)', maxWidth: 820 }}
                        >
                            <summary
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 'var(--space-3)',
                                    minHeight: 44,
                                    padding: 'var(--space-2) 0',
                                    cursor: 'pointer',
                                    fontWeight: 'var(--font-weight-medium)' as never,
                                    listStyle: 'none',
                                }}
                            >
                                {pick(item.q, locale)}
                                <span aria-hidden="true" style={{ color: 'var(--color-text-tertiary)' }}>
                                    <IconChevronDown size={18} />
                                </span>
                            </summary>
                            <p
                                style={{
                                    margin: '0 0 var(--space-3)',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                    maxWidth: '68ch',
                                }}
                            >
                                {pick(item.a, locale)}
                            </p>
                        </details>
                    ))}
                </div>
                </div>
            )}

            <style>{`
                #booking summary::-webkit-details-marker { display: none; }
                #booking details[open] summary span[aria-hidden] { transform: rotate(180deg); }
                #booking summary span[aria-hidden] { transition: transform var(--motion-instant) ease; }
                @media (max-width: 639.98px) {
                    .h5-booking-cta { width: 100%; }
                }
            `}</style>
        </section>
    )
}
