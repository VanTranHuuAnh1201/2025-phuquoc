import { pick, telHref, themeHref, themeRoot, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { IconPhone } from '../components/icons'

/**
 * Header mẫu 06 — nền ngà ĐẶC từ pixel đầu tiên (spec v4 §2.1: sáng, sạch,
 * chính chủ). Không transparent-trên-hero như các mẫu trước: một website
 * booking đáng tin trông như quầy lễ tân, không như poster.
 *
 * Hairline xanh brand 3px trên cùng là dấu nhận diện duy nhất. Icon đăng
 * nhập/chuông do `SiteOverlay` của app render, header chừa khoảng phải.
 */

const SLUG = meta.slug

export function Header({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { brand, nav } = data

    return (
        <header className="fixed top-0 right-0 left-0 z-60 border-t-[3px] border-b border-t-brand border-b-border-muted bg-surface-base">
            {/* `pr-[170px]`: chừa chỗ cho SiteOverlay (đăng nhập + chuông) của app
                ở góc phải. */}
            <div className="h6-container flex min-h-[64px] items-center gap-4 pr-[170px]">
                <a
                    href={themeRoot(SLUG)}
                    className="flex shrink-0 items-center gap-2 no-underline"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={brand.logo || '/OP5.png'}
                        alt={`${brand.name} ${brand.suffix}`}
                        className="h-[36px] w-auto object-contain"
                    />
                    <span className="h6-display text-lg whitespace-nowrap text-text-primary">
                        {brand.name}
                    </span>
                </a>

                {/* Nav ẩn dưới 1080px — breakpoint riêng của mẫu. */}
                <nav
                    aria-label={locale === 'vi' ? 'Điều hướng chính' : 'Main navigation'}
                    className="ml-auto hidden items-center gap-[2px] overflow-hidden min-[1081px]:flex"
                >
                    {nav.map((item) => (
                        <a
                            key={item.href}
                            href={themeHref(SLUG, item.href, true)}
                            className="rounded-sm px-3 py-[10px] text-sm font-medium whitespace-nowrap text-text-secondary no-underline transition-colors duration-[var(--motion-instant)] ease-linear hover:text-brand"
                        >
                            {pick(item.label, locale)}
                        </a>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-3">
                    <a
                        href={telHref(brand.phone)}
                        aria-label={
                            locale === 'vi'
                                ? `Gọi hotline ${brand.phone}`
                                : `Call hotline ${brand.phone}`
                        }
                        className="inline-flex min-h-[24px] items-center gap-[8px] text-sm font-bold whitespace-nowrap text-brand no-underline [font-variant-numeric:tabular-nums]"
                    >
                        <IconPhone size={16} />
                        {/* Dưới 640px chỉ còn icon — số điện thoại ẩn để nhường chỗ. */}
                        <span className="hidden sm:inline">{brand.phone}</span>
                    </a>

                    <span className="inline-flex gap-[2px] text-xs font-bold">
                        <a
                            href="?lang=vi"
                            aria-label="Tiếng Việt"
                            aria-current={locale === 'vi' ? 'true' : undefined}
                            className={[
                                'min-w-[24px] p-[6px] text-center [text-underline-offset:4px]',
                                locale === 'vi'
                                    ? 'text-text-primary underline'
                                    : 'text-text-tertiary no-underline',
                            ].join(' ')}
                        >
                            VI
                        </a>
                        <a
                            href="?lang=en"
                            aria-label="English"
                            aria-current={locale === 'en' ? 'true' : undefined}
                            className={[
                                'min-w-[24px] p-[6px] text-center [text-underline-offset:4px]',
                                locale === 'en'
                                    ? 'text-text-primary underline'
                                    : 'text-text-tertiary no-underline',
                            ].join(' ')}
                        >
                            EN
                        </a>
                    </span>
                </div>
            </div>
        </header>
    )
}
