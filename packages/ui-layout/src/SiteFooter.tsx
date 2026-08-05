import type { ReactNode } from 'react'

/**
 * Chân trang dùng chung cho mọi mẫu.
 *
 * NGUỒN: bản của `apps/2026-thenamduhillresort` — 4 cột, nền đậm, có cột chính
 * sách và badge pháp lý. Ba bản từng tồn tại (`ui-layout/PageFooter`,
 * `theme-h2/pages/PageShell`, `theme-h2/sections/Contact`) đều là tập con.
 *
 * Cắt đi khi đưa lên đây: hex cứng (#0F2D52, #C6A86A…) → token; đường dẫn tuyệt
 * đối → prop; `useLanguage()` context → prop. Cùng lý do với `SiteHeader`.
 *
 * `--color-accent` thay cho vàng đồng `#C6A86A` của bản gốc: mỗi mẫu có màu
 * nhấn riêng, chốt cứng một mã ở đây là bắt mẫu thứ 20 phải theo (luật R5).
 */

export interface FooterLink {
    label: string
    href: string
    /** Mở tab mới — dùng cho mạng xã hội. */
    external?: boolean
}

export interface FooterColumn {
    title: string
    links: FooterLink[]
}

export interface SiteFooterBrand {
    name: string
    tagline?: string
    logo?: string
    address: string
    email: string
    phone: string
}

export interface SiteFooterProps {
    brand: SiteFooterBrand
    /** Mô tả ngắn dưới logo. */
    intro?: string
    /** Các cột liên kết. Thường là "Thông tin" + "Khám phá". */
    columns?: FooterColumn[]
    /** Tiêu đề cột mạng xã hội. */
    socialTitle?: string
    social?: FooterLink[]
    /** Badge tin cậy — đăng ký kinh doanh, chứng nhận. */
    badge?: { label: string; icon?: ReactNode }
    /** Dòng cuối trang. */
    copyright: string
    /** Câu chốt bên phải dòng cuối. */
    note?: string
    /** Đệm dưới khi mẫu có thanh tab dính ở đáy màn hình. */
    bottomInset?: boolean
}

function IconPin() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[2px] shrink-0">
            <path
                d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.75" />
        </svg>
    )
}

function IconMail() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
            <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
    )
}

function IconPhone() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path
                d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function SiteFooter({
    brand,
    intro,
    columns = [],
    socialTitle,
    social = [],
    badge,
    copyright,
    note,
    bottomInset = false,
}: SiteFooterProps) {
    return (
        <footer
            className={[
                'mt-6 bg-surface-strong text-text-inverse',
                bottomInset ? 'pb-[64px] md:pb-0' : '',
            ].join(' ')}
        >
            <div className="mx-auto grid max-w-[var(--container)] grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
                {/* ---- cột 1: thương hiệu + liên hệ ---- */}
                <div className="space-y-4">
                    <div className="flex items-center gap-[10px]">
                        {brand.logo && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={brand.logo}
                                alt=""
                                className="h-[40px] w-[40px] shrink-0 rounded-full bg-white object-contain p-1 shadow-1"
                            />
                        )}
                        <span className="flex flex-col leading-none">
                            <span className="font-display text-sm font-bold tracking-tight uppercase">
                                {brand.name}
                            </span>
                            {brand.tagline && (
                                <span className="text-[10px] font-medium tracking-widest uppercase opacity-70">
                                    {brand.tagline}
                                </span>
                            )}
                        </span>
                    </div>

                    {intro && <p className="text-xs leading-relaxed opacity-70">{intro}</p>}

                    <div className="space-y-2 text-xs opacity-90">
                        <span className="flex items-start gap-2">
                            <span className="text-accent">
                                <IconPin />
                            </span>
                            <span>{brand.address}</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-accent">
                                <IconMail />
                            </span>
                            <a
                                href={`mailto:${brand.email}`}
                                className="text-text-inverse no-underline hover:underline"
                            >
                                {brand.email}
                            </a>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-accent">
                                <IconPhone />
                            </span>
                            <a
                                href={`tel:${brand.phone.replace(/\s/g, '')}`}
                                className="text-base font-bold text-text-inverse no-underline transition hover:text-accent"
                            >
                                {brand.phone}
                            </a>
                        </span>
                    </div>
                </div>

                {/* ---- các cột liên kết ---- */}
                {columns.map((col) => (
                    <div key={col.title} className="space-y-3">
                        <h3 className="text-xs font-semibold tracking-wider uppercase">{col.title}</h3>
                        <span aria-hidden="true" className="block h-[2px] w-8 rounded-full bg-accent" />
                        <ul className="list-none space-y-2 p-0 text-xs opacity-80">
                            {col.links.map((link) => (
                                <li key={`${col.title}-${link.label}`}>
                                    <a
                                        href={link.href}
                                        className="text-text-inverse no-underline transition hover:opacity-100"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* ---- cột mạng xã hội + badge ---- */}
                {(social.length > 0 || badge) && (
                    <div className="space-y-4">
                        {socialTitle && (
                            <>
                                <h3 className="text-xs font-semibold tracking-wider uppercase">
                                    {socialTitle}
                                </h3>
                                <span
                                    aria-hidden="true"
                                    className="block h-[2px] w-8 rounded-full bg-accent"
                                />
                            </>
                        )}

                        {social.length > 0 && (
                            <div className="flex gap-2">
                                {social.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noreferrer' : undefined}
                                        className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/10 text-xs font-bold text-text-inverse no-underline transition hover:bg-white/20"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}

                        {badge && (
                            <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 p-3">
                                {badge.icon && <span className="text-accent">{badge.icon}</span>}
                                <span className="text-[10px] leading-tight font-semibold opacity-90">
                                    {badge.label}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ---- dòng cuối ---- */}
            <div className="border-t border-white/10 py-4">
                <div className="mx-auto flex max-w-[var(--container)] flex-col items-center justify-between gap-2 px-4 text-xs opacity-60 sm:flex-row sm:px-6">
                    <span>{copyright}</span>
                    {note && <span>{note}</span>}
                </div>
            </div>
        </footer>
    )
}
