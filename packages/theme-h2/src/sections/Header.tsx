'use client'

import { useState } from 'react'
import { pick, telHref, themeHref, themePath, themeRoot, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

/**
 * Thanh điều hướng mẫu 07 — hai bố cục tách hẳn nhau theo bản thiết kế.
 *
 * Desktop (≥ 960px): logo trái · nav ngang · khối hotline · nút vàng phải.
 * Mobile  (< 960px): hamburger trái · logo giữa · icon gọi phải — không nav
 *                    ngang, không nút vàng (CTA nằm trong hero).
 *
 * Hai nhánh cùng nằm trong một component, ẩn/hiện bằng biến thể `min-[960px]:`
 * của Tailwind. Không dùng useMediaQuery vì render phía server phải ra đúng
 * markup cho cả hai — tránh nhấp nháy khi hydrate. Breakpoint 960px không
 * trùng thang mặc định (md 768 · lg 1024) nên phải viết dạng tuỳ ý.
 *
 * Đường dẫn đi qua `themeHref` của core: prototype nối trang bằng anchor
 * (`#rooms`), nhưng ở app thật `#rooms` phải dẫn sang `/h7/rooms`. Bảng ánh xạ
 * nằm ở core nên các mẫu dùng chung một luật, không mẫu nào tự chép (luật R1).
 */

const SLUG = meta.slug

/** Icon SVG — luật D5 cấm dùng emoji làm icon ở sản phẩm mới. */
function IconPhone({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.3 2.2Z"
                fill="currentColor"
            />
        </svg>
    )
}

function IconMenu({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function IconClose({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

export function Header({
    data,
    locale,
    extra,
}: {
    data: PropertyData
    locale: Locale
    extra?: React.ReactNode
}) {
    const t = ui[locale]
    const { brand, nav } = data
    const scrolled = useScrolled()
    const [menuOpen, setMenuOpen] = useState(false)

    const tel = telHref(brand.phone)
    /** Trên nền ảnh hero chữ phải trắng; cuộn qua rồi thì đổi sang navy. */
    const onDark = !scrolled
    const fg = onDark ? 'text-text-inverse' : 'text-text-primary'

    const navItems = nav.filter((item) => item.href !== '#top' && item.href !== '/')

    return (
        <div className="fixed top-0 right-0 left-0 z-[60]">
            <header
                className={[
                    'border-b transition-[background,box-shadow] duration-200 ease-out',
                    scrolled
                        ? 'border-border-default bg-surface-raised/97 shadow-1 [backdrop-filter:blur(14px)]'
                        : 'border-transparent bg-transparent',
                ].join(' ')}
            >
                {/* ---------- DESKTOP ---------- */}
                <div className="mx-auto hidden max-w-[var(--container)] items-center gap-5 px-6 py-3 min-h-[72px] min-[960px]:flex">
                    <a
                        href={themeRoot(SLUG)}
                        className="flex shrink-0 items-center gap-[10px] no-underline"
                    >
                        <img
                            src={brand.logo || '/OP5.png'}
                            alt={brand.name}
                            className="h-[38px] w-[38px] rounded-full bg-surface-raised object-contain p-[2px]"
                        />
                        <div className="flex flex-col leading-[1.1]">
                            <span
                                className={`font-display text-[15px] font-bold tracking-[-0.01em] ${fg}`}
                            >
                                {brand.name || 'The Nam Du Hill'}
                            </span>
                            <span
                                className={`mt-[2px] text-[11px] font-medium ${
                                    onDark ? 'text-text-inverse/75' : 'text-text-secondary'
                                }`}
                            >
                                Nam Du, Kiên Giang
                            </span>
                        </div>
                    </a>

                    <nav className="ml-auto flex min-w-0 items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={themeHref(SLUG, item.href, true)}
                                className={[
                                    'rounded-sm px-[14px] py-2 text-[14.5px] font-medium whitespace-nowrap no-underline',
                                    'transition-colors duration-200 ease-out',
                                    fg,
                                    'hover:text-[var(--accent)]',
                                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
                                ].join(' ')}
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <div className="flex shrink-0 items-center gap-3">
                        {extra && (
                            <div key="extra-desktop" className={`flex items-center ${fg}`}>
                                {extra}
                            </div>
                        )}

                        <a
                            href={themePath(SLUG, 'rooms')}
                            className={[
                                'shrink-0 rounded-sm px-5 py-[10px] text-[14px] font-bold whitespace-nowrap no-underline',
                                'bg-[var(--accent)] text-[var(--on-accent)]',
                                'transition-[background,transform] duration-200 ease-out',
                                'hover:bg-[var(--accent-dark)] active:translate-y-px',
                                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
                            ].join(' ')}
                        >
                            {t.bookNow}
                        </a>
                    </div>
                </div>

                {/* ---------- MOBILE ---------- */}
                <div className="flex min-h-[60px] items-center justify-between gap-3 px-4 py-[10px] min-[960px]:hidden">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
                        aria-expanded={menuOpen}
                        className={`grid h-10 w-10 cursor-pointer place-items-center border-none bg-none p-0 ${
                            menuOpen ? 'text-text-primary' : fg
                        }`}
                    >
                        {menuOpen ? <IconClose /> : <IconMenu />}
                    </button>

                    <a href={themeRoot(SLUG)} className="flex no-underline">
                        <img
                            src={brand.logo || '/OP5.png'}
                            alt={brand.name}
                            className="h-[38px] w-auto object-contain"
                        />
                    </a>

                    <div className={`flex items-center gap-[6px] ${fg}`}>
                        {extra && <div key="extra-mobile">{extra}</div>}
                        <a
                            href={tel}
                            aria-label={`${t.phoneLabel} ${brand.phone}`}
                            className={`grid h-10 w-10 place-items-center no-underline ${fg}`}
                        >
                            <IconPhone size={20} />
                        </a>
                    </div>
                </div>

                {/* Panel menu mobile — đổ xuống dưới thanh, nền trắng. */}
                {menuOpen && (
                    <nav className="grid max-h-[calc(100vh-60px)] overflow-y-auto border-t border-border-default bg-surface-raised px-4 pt-2 pb-4 shadow-2 min-[960px]:hidden">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={themeHref(SLUG, item.href, true)}
                                onClick={() => setMenuOpen(false)}
                                className="border-b border-border-default px-1 py-[14px] text-[15px] font-semibold text-text-primary no-underline"
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                        <a
                            href={themePath(SLUG, 'rooms')}
                            onClick={() => setMenuOpen(false)}
                            className="mt-4 rounded-sm bg-[var(--accent)] px-5 py-[14px] text-center text-[15px] font-bold text-[var(--on-accent)] no-underline"
                        >
                            {t.bookNow}
                        </a>
                    </nav>
                )}
            </header>
        </div>
    )
}
