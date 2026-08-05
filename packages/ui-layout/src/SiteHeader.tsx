'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Header dùng chung cho mọi mẫu.
 *
 * NGUỒN: bản của `apps/2026-thenamduhillresort` — đầy đủ tính năng nhất trong
 * bốn bản từng tồn tại (avatar dropdown, nav active-state, drawer mobile,
 * badge checkout, chuyển ngôn ngữ). Ba bản còn lại đều là tập con của nó.
 *
 * BA THỨ PHẢI CẮT KHI ĐƯA LÊN ĐÂY:
 *
 * 1. ~15 mã hex cứng (#1D4E89, #0F2D52…) → token. Không cắt thì mẫu nào dùng
 *    cũng ra màu của resort, và vi phạm luật D0.
 * 2. Đường dẫn tuyệt đối (`/rooms`, `/my-bookings`) → prop. App resort cần
 *    `/rooms`, mẫu trong app hub cần `/h3/rooms`.
 * 3. `useLanguage()` context của app → prop. Tầng nền không được phụ thuộc
 *    context của một app cụ thể (luật R15).
 *
 * Nơi gọi tự dịch dữ liệu của mình sang các prop dưới đây — xem
 * `packages/domain-hotel/src/shell-adapter.ts`.
 */

// ------------------------------------------------------------------- kiểu

export interface HeaderNavItem {
    /** Nhãn ĐÃ chọn ngôn ngữ. */
    label: string
    /** Đường dẫn ĐÃ dựng xong (đã gắn slug nếu cần). */
    href: string
}

/** Một mục trong menu tài khoản. */
export interface AccountMenuItem {
    label: string
    /** Dòng mô tả nhỏ dưới nhãn. Không có thì bỏ trống. */
    hint?: string
    href: string
    /** Icon SVG. Không dùng emoji trong sản phẩm mới (luật D5). */
    icon?: ReactNode
}

export interface SiteHeaderBrand {
    name: string
    /** Dòng phụ dưới tên — địa danh, hoặc hậu tố thương hiệu. */
    tagline?: string
    logo?: string
}

export interface SiteHeaderStrings {
    bookNow: string
    openMenu: string
    closeMenu: string
    accountMenu: string
}

export interface SiteHeaderProps {
    brand: SiteHeaderBrand
    nav: HeaderNavItem[]
    strings: SiteHeaderStrings
    /** Đường dẫn trang chủ của mẫu đang render. */
    homeHref: string
    /** Nút hành động chính. Bỏ trống thì ẩn nút. */
    ctaHref?: string

    /**
     * Đường dẫn hiện tại, để tô mục nav đang mở.
     * Nơi gọi tự lấy (`usePathname()` ở app, hoặc chuỗi rỗng nếu không cần).
     */
    currentHref?: string

    /** Menu tài khoản. Rỗng thì ẩn nút avatar. */
    accountMenu?: AccountMenuItem[]

    /**
     * Bộ chuyển ngôn ngữ. Hai cơ chế cùng được hỗ trợ vì hai app làm khác nhau:
     *
     *   `onSelect`  app resort — đổi state của `LanguageContext`
     *   `href`      app hub    — điều hướng `?lang=vi`, giữ được SSG
     *
     * Truyền `href` thì render `<a>`, truyền `onSelect` thì render `<button>`.
     */
    locales?: Array<{
        code: string
        label: string
        onSelect?: () => void
        href?: string
    }>
    activeLocale?: string

    /**
     * Trong suốt khi ở đỉnh trang, đặc lại khi cuộn. Mẫu nào có hero ảnh full
     * width thì bật; mẫu nền sáng thì tắt.
     */
    transparentOnTop?: boolean

    /** Thay toàn bộ nav bằng một badge — dùng ở luồng thanh toán. */
    focusBadge?: string

    /** Chỗ cho app cắm thêm (chuông thông báo…). */
    extra?: ReactNode
}

// ------------------------------------------------------------------ icon

function IconUser() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function IconMenu({ open }: { open: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d={open ? 'M18 6 6 18M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

// ---------------------------------------------------------------- component

export function SiteHeader({
    brand,
    nav,
    strings,
    homeHref,
    ctaHref,
    currentHref = '',
    accountMenu = [],
    locales = [],
    activeLocale,
    transparentOnTop = false,
    focusBadge,
    extra,
}: SiteHeaderProps) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [accountOpen, setAccountOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Đóng menu tài khoản khi bấm ra ngoài.
    useEffect(() => {
        if (!accountOpen) return
        const onClick = (e: MouseEvent) => {
            const el = e.target as HTMLElement
            if (!el.closest('[data-account-menu]')) setAccountOpen(false)
        }
        document.addEventListener('click', onClick)
        return () => document.removeEventListener('click', onClick)
    }, [accountOpen])

    const solid = !transparentOnTop || scrolled

    // Hai bảng màu: nền đặc dùng token, nền trong suốt dùng trắng/đen trực
    // tiếp vì chữ nằm trên ảnh chứ không nằm trên surface của theme.
    const tone = {
        text: solid ? 'text-text-primary' : 'text-white',
        textMuted: solid ? 'text-text-secondary' : 'text-white/80',
        border: solid ? 'border-border-default' : 'border-white/40',
        hoverBg: solid ? 'hover:bg-surface-base' : 'hover:bg-white/10',
    }

    return (
        <header
            className={[
                'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
                solid
                    ? 'border-b border-border-default bg-surface-raised/95 py-[10px] shadow-1 backdrop-blur-md'
                    : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-3',
                tone.text,
            ].join(' ')}
        >
            <div className="mx-auto flex max-w-[var(--container)] items-center justify-between gap-4 px-4 sm:px-6">
                {/* ---- thương hiệu ---- */}
                {/* `shrink-0` trên chính thẻ `<a>`: nó là flex item, thiếu thì
                    khi hàng chật trình duyệt bóp nó lại và tên thương hiệu
                    xuống dòng từng chữ một — "The / Nam / Du / Hill". */}
                <a
                    href={focusBadge ? undefined : homeHref}
                    className={[
                        'group flex shrink-0 items-center gap-[10px] no-underline',
                        focusBadge ? 'pointer-events-none cursor-default' : '',
                    ].join(' ')}
                >
                    {brand.logo && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={brand.logo}
                            alt=""
                            className="h-[36px] w-[36px] shrink-0 rounded-full bg-white object-contain p-[2px] shadow-1 transition-transform group-hover:scale-105"
                        />
                    )}
                    <span className="flex flex-col leading-none">
                        <span
                            className={`font-display text-[13px] font-bold whitespace-nowrap tracking-tight sm:text-sm ${tone.text}`}
                        >
                            {brand.name}
                        </span>
                        {brand.tagline && (
                            /* Dòng phụ có thể dài (địa chỉ đầy đủ) — cắt bằng
                               `truncate` thay vì cho xuống dòng, và chỉ hiện từ
                               màn vừa trở lên để mobile không chật. */
                            <span
                                className={`mt-[2px] hidden max-w-[220px] truncate text-[10px] font-medium sm:block ${tone.textMuted}`}
                            >
                                {brand.tagline}
                            </span>
                        )}
                    </span>
                </a>

                {/* ---- badge thay nav, dùng ở luồng thanh toán ---- */}
                {focusBadge && (
                    <span className="rounded-[999px] border border-brand/20 bg-info-bg px-3 py-1 text-xs font-semibold text-brand">
                        {focusBadge}
                    </span>
                )}

                {/* Cụm phải: nav + ngôn ngữ + tài khoản + CTA, dồn sát mép phải
                    trên MỘT hàng.

                    `min-w-0` là bắt buộc: mặc định flex item không co xuống dưới
                    kích thước nội dung, nên cụm này đẩy hàng vỡ khi menu dài.
                    `flex-nowrap` chặn xuống dòng, `whitespace-nowrap` ở từng mục
                    nav giữ mỗi nhãn nguyên vẹn. */}
                {!focusBadge && (
                    <div className="flex min-w-0 flex-nowrap items-center gap-3 lg:gap-4">
                        {/* ---- điều hướng desktop ---- */}
                        <nav className="hidden min-w-0 items-center gap-4 md:flex lg:gap-5">
                            {nav.map((item) => {
                                const active = currentHref === item.href
                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={[
                                            'relative py-1 text-sm font-medium whitespace-nowrap no-underline transition-colors hover:text-brand',
                                            active
                                                ? 'font-semibold text-brand after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-brand'
                                                : tone.textMuted,
                                        ].join(' ')}
                                    >
                                        {item.label}
                                    </a>
                                )
                            })}
                        </nav>

                        <div className="flex shrink-0 items-center gap-2">
                            {/* ---- chuyển ngôn ngữ ---- */}
                            {locales.length > 1 && (
                                <div className="flex shrink-0 items-center text-xs font-medium">
                                    {locales.map((loc, i) => {
                                        const active = activeLocale === loc.code
                                        const cls = [
                                            'cursor-pointer border-0 bg-transparent px-[6px] py-[2px] text-center text-xs uppercase no-underline transition',
                                            active ? `font-bold ${tone.text}` : tone.textMuted,
                                        ].join(' ')
                                        return (
                                            <span key={loc.code} className="flex items-center">
                                                {i > 0 && (
                                                    <span
                                                        aria-hidden="true"
                                                        className={
                                                            solid ? 'text-border-default' : 'text-white/40'
                                                        }
                                                    >
                                                        |
                                                    </span>
                                                )}
                                                {loc.href ? (
                                                    <a
                                                        href={loc.href}
                                                        aria-current={active ? 'true' : undefined}
                                                        className={cls}
                                                    >
                                                        {loc.label}
                                                    </a>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={loc.onSelect}
                                                        aria-current={active ? 'true' : undefined}
                                                        className={cls}
                                                    >
                                                        {loc.label}
                                                    </button>
                                                )}
                                            </span>
                                        )
                                    })}
                                </div>
                            )}

                            {extra}

                            {/* ---- menu tài khoản ---- */}
                            {accountMenu.length > 0 && (
                                <div className="relative" data-account-menu>
                                    <button
                                        type="button"
                                        onClick={() => setAccountOpen((v) => !v)}
                                        aria-expanded={accountOpen}
                                        aria-label={strings.accountMenu}
                                        className={`flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border bg-transparent transition ${tone.border} ${tone.text} ${tone.hoverBg}`}
                                    >
                                        <IconUser />
                                    </button>

                                    {accountOpen && (
                                        <div className="absolute right-0 z-50 mt-2 w-[224px] rounded-lg border border-border-muted bg-surface-raised py-2 text-xs text-text-primary shadow-2">
                                            {accountMenu.map((item, i) => (
                                                <a
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setAccountOpen(false)}
                                                    className={[
                                                        'flex items-center gap-[10px] px-4 py-[10px] font-medium text-text-secondary no-underline transition hover:bg-surface-base',
                                                        i > 0 ? 'border-t border-border-muted' : '',
                                                    ].join(' ')}
                                                >
                                                    {item.icon}
                                                    <span className="grid gap-[2px]">
                                                        <span className="font-bold text-text-primary">
                                                            {item.label}
                                                        </span>
                                                        {item.hint && (
                                                            <span className="text-[10px] text-text-tertiary">
                                                                {item.hint}
                                                            </span>
                                                        )}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ---- nút hành động chính ---- */}
                            {ctaHref && (
                                <a
                                    href={ctaHref}
                                    className="hidden shrink-0 rounded-md bg-accent px-[14px] py-[8px] text-[13px] font-bold whitespace-nowrap text-text-inverse no-underline shadow-1 transition hover:brightness-95 sm:inline-block"
                                >
                                    {strings.bookNow}
                                </a>
                            )}

                            {/* ---- mở drawer mobile ---- */}
                            <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-expanded={menuOpen}
                                aria-label={menuOpen ? strings.closeMenu : strings.openMenu}
                                className={`flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border-0 transition md:hidden ${solid ? 'bg-surface-base text-text-primary' : 'bg-white/20 text-white'}`}
                            >
                                <IconMenu open={menuOpen} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ---- drawer mobile ---- */}
            {!focusBadge && menuOpen && (
                <div className="fixed inset-x-0 top-[53px] max-h-[85vh] space-y-4 overflow-y-auto border-b border-border-default bg-surface-raised p-5 text-text-primary shadow-2">
                    <div className="grid gap-1">
                        {nav.map((item) => {
                            const active = currentHref === item.href
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    aria-current={active ? 'page' : undefined}
                                    className={[
                                        'flex items-center justify-between rounded-lg px-3 py-[10px] text-sm font-medium no-underline transition',
                                        active
                                            ? 'bg-info-bg font-semibold text-brand'
                                            : 'text-text-secondary hover:bg-surface-base',
                                    ].join(' ')}
                                >
                                    <span>{item.label}</span>
                                    {active && (
                                        <span
                                            aria-hidden="true"
                                            className="h-[6px] w-[6px] rounded-full bg-brand"
                                        />
                                    )}
                                </a>
                            )
                        })}

                        {accountMenu.length > 0 && (
                            <>
                                <span className="my-1 block border-t border-border-muted" />
                                {accountMenu.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={[
                                            'flex items-center gap-2 rounded-lg px-3 py-[10px] text-sm font-medium no-underline transition',
                                            currentHref === item.href
                                                ? 'bg-info-bg font-semibold text-brand'
                                                : 'text-text-secondary hover:bg-surface-base',
                                        ].join(' ')}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </a>
                                ))}
                            </>
                        )}
                    </div>

                    {ctaHref && (
                        <div className="border-t border-border-muted pt-3">
                            <a
                                href={ctaHref}
                                onClick={() => setMenuOpen(false)}
                                className="block rounded-md bg-accent px-4 py-3 text-center text-sm font-bold text-text-inverse no-underline"
                            >
                                {strings.bookNow}
                            </a>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
