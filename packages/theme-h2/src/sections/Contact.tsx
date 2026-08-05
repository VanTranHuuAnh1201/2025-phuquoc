import { pick, telHref, themeHref, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Chân trang kiêm section liên hệ.
 *
 * Prototype dùng chính `<footer id="contact">` làm section contact — giữ
 * nguyên cách đó để bộ id của luật R7 vẫn đủ.
 */

const SOCIAL = ['Facebook', 'Instagram', 'TikTok', 'Google Maps']

/** Tiêu đề một cột trong chân trang — lặp ở cả bốn cột nên gom lại một chỗ. */
const COLUMN_TITLE = 'mb-3 text-xs font-bold text-text-primary'

/** Link chân trang — cùng cỡ, cùng màu, không gạch chân. */
const LINK = 'text-sm text-text-secondary no-underline'

export function Contact({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { brand, nav } = data
    const tel = telHref(brand.phone)

    return (
        <footer
            id="contact"
            className="border-t border-border-default bg-surface-base px-6 pt-[var(--space-16)] pb-7 [scroll-margin-top:80px]"
        >
            <div className="mx-auto max-w-[var(--container)]">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[var(--space-8)] border-b border-border-default pb-9">
                    <div>
                        <div className="mb-3 font-display text-base font-bold text-text-primary">
                            {brand.name} {brand.suffix}
                        </div>
                        <p className="mt-0 mb-3 max-w-[320px] text-sm leading-[1.7] text-text-secondary">
                            {t.footerAbout}
                        </p>
                        <div className="text-sm leading-[1.7] text-text-secondary">
                            {pick(brand.address, locale)}
                        </div>
                    </div>

                    <div>
                        <div className={COLUMN_TITLE}>{t.footerNav}</div>
                        <div className="grid gap-[9px]">
                            {nav.map((item) => (
                                <a
                                    key={item.href}
                                    href={themeHref(SLUG, item.href)}
                                    className={LINK}
                                >
                                    {pick(item.label, locale)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className={COLUMN_TITLE}>{t.footerContact}</div>
                        <div className="grid gap-[9px]">
                            <a href={tel} className={LINK}>
                                {brand.phone}
                            </a>
                            <a href={`mailto:${brand.email}`} className={LINK}>
                                {brand.email}
                            </a>
                            <a
                                href={`https://${brand.site}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={LINK}
                            >
                                {brand.site}
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className={COLUMN_TITLE}>{t.footerFollow}</div>
                        <div className="grid gap-[9px]">
                            {SOCIAL.map((name) => (
                                <span key={name} className={LINK}>
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-[var(--space-5)] text-xs text-text-secondary">
                    <span>
                        © {new Date().getFullYear()} {brand.name} {brand.suffix}
                    </span>
                    <a href="/" className="text-text-secondary no-underline">
                        ← {locale === 'vi' ? 'Về trang tổng' : 'Back to showcase'}
                    </a>
                </div>
            </div>
        </footer>
    )
}
