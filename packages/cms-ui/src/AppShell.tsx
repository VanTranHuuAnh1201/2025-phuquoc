'use client'

/**
 * `AppShell` — khung CMS dùng chung: rail dọc trái + header + tab bar ngang.
 *
 * VÌ SAO CHỈ NHẬN PROPS NGUYÊN THUỶ (`href`/`label`/`icon`): đây là tầng nền
 * (R15) — không được biết "đơn hàng", "tồn kho" là gì. App gọi truyền menu
 * đã lọc quyền + đã dịch ngôn ngữ vào, `AppShell` chỉ lo bố cục và trạng thái
 * active/hover/focus.
 *
 * VÌ SAO `data-cms` GẮN Ở PHẦN TỬ GỐC: toàn bộ `tokens.css` ghi trong phạm vi
 * `[data-cms]` (không phải `:root`) để không rò sang trang client `/h1`–`/h4`.
 * Thiếu thuộc tính này thì mọi `var(--cms-*)` bên trong đều rỗng.
 */

import type { ReactNode } from 'react'

export interface ShellNavItem {
    href: string
    label: string
    icon?: ReactNode
}

export interface AppShellProps {
    /** Rail dọc trái, rộng `var(--cms-rail-w)` = 64px. */
    railItems: ShellNavItem[]
    /** Tab bar ngang trong header, cao `var(--cms-tabbar-h)` = 40px. */
    tabItems: ShellNavItem[]
    /** Đường dẫn hiện tại — dùng để tính mục nào đang active. */
    currentPath: string
    /** Logo + tên sản phẩm, hiện ở đầu rail. */
    brand: ReactNode
    /** Vùng bên phải header: role switcher, chuyển ngôn ngữ, avatar… */
    headerRight?: ReactNode
    children: ReactNode
}

/**
 * Một mục có đang active không. So khớp chính xác cho trang gốc (`/admin`),
 * còn lại so bằng tiền tố — con của một mục vẫn giữ mục cha sáng.
 */
function isItemActive(href: string, currentPath: string, rootPath: string): boolean {
    if (href === rootPath) return currentPath === rootPath
    return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function AppShell({ railItems, tabItems, currentPath, brand, headerRight, children }: AppShellProps) {
    // Mục "gốc" của rail là item đầu tiên (thường là Dashboard) — dùng để
    // quyết định so khớp chính xác hay so khớp tiền tố cho toàn bộ shell.
    const rootPath = railItems[0]?.href ?? ''

    return (
        <div data-cms className="flex h-screen w-full overflow-hidden bg-[var(--cms-bg-subtle)] text-[var(--cms-text)]">
            {/* Rail dọc trái — chỉ icon, luôn 64px, không thu gọn thêm nữa vì
                đây đã là bề rộng tối thiểu chứa được target chạm 24px (D4). */}
            <aside
                className="flex h-screen shrink-0 flex-col items-center border-r border-[var(--cms-border)] bg-[var(--cms-bg)]"
                style={{ width: 'var(--cms-rail-w)' }}
            >
                <div
                    className="flex w-full shrink-0 items-center justify-center border-b border-[var(--cms-border)]"
                    style={{ height: 'var(--cms-header-h)' }}
                >
                    {brand}
                </div>

                <nav className="flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto py-2">
                    {railItems.map((item) => {
                        const active = isItemActive(item.href, currentPath, rootPath)
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                title={item.label}
                                aria-current={active ? 'page' : undefined}
                                className={`flex h-10 w-10 items-center justify-center rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                    active
                                        ? 'bg-[var(--cms-accent-weak)] text-[var(--cms-accent)]'
                                        : 'text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)]'
                                }`}
                            >
                                {item.icon}
                                <span className="sr-only">{item.label}</span>
                            </a>
                        )
                    })}
                </nav>
            </aside>

            {/* Vùng làm việc chính: header + tab bar + nội dung. */}
            <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                {/* Header — phân tách bằng đường kẻ 1px, KHÔNG shadow (P7). */}
                <header
                    className="flex shrink-0 items-center justify-end border-b border-[var(--cms-border)] bg-[var(--cms-bg)] px-4"
                    style={{ height: 'var(--cms-header-h)' }}
                >
                    {headerRight}
                </header>

                {/* Tab bar ngang — điều hướng cấp hai, gạch chân 2px khi active. */}
                {tabItems.length > 0 && (
                    <nav
                        className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-[var(--cms-border)] bg-[var(--cms-bg)] px-3"
                        style={{ height: 'var(--cms-tabbar-h)' }}
                    >
                        {tabItems.map((tab) => {
                            const active = isItemActive(tab.href, currentPath, rootPath)
                            return (
                                <a
                                    key={tab.href}
                                    href={tab.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex h-full shrink-0 items-center whitespace-nowrap border-b-2 px-2.5 text-[length:var(--cms-text-body)] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--cms-accent)] ${
                                        active
                                            ? 'border-[var(--cms-accent)] bg-[var(--cms-accent-weak)] text-[var(--cms-accent)]'
                                            : 'border-transparent text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]'
                                    }`}
                                >
                                    {tab.label}
                                </a>
                            )
                        })}
                    </nav>
                )}

                <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    )
}
