'use client'

/**
 * `AppShell` — khung CMS dùng chung: rail dọc trái (VÙNG) + header + tab bar
 * (MÀN trong vùng đang chọn).
 *
 * VÌ SAO HAI TẦNG ĐIỀU HƯỚNG, KHÔNG PHẢI RAIL PHẲNG 21 MỤC: bản đầu tiên làm
 * phẳng toàn bộ menu vào rail 64px chỉ-icon — mất nhãn chữ, mất phân nhóm, và
 * icon-only 21 mục không phân biệt được bằng mắt (hồi quy so với cây menu cũ).
 * Theo đúng ảnh mẫu (kiểu Sales Cloud: SALES/SVC/WORK/EXEC/PLAN/RPTS): rail
 * chỉ giữ ~3-6 VÙNG LỚN (icon + nhãn chữ nhỏ dưới icon), còn tab bar ngang mới
 * liệt kê các MÀN thuộc vùng đang chọn. Vùng ít nên rail vẫn đọc được dù nhãn
 * ngắn; màn nhiều thì đã có tab bar cuộn ngang lo.
 *
 * VÌ SAO CHỈ NHẬN PROPS NGUYÊN THUỶ (`href`/`label`/`icon`): đây là tầng nền
 * (R15) — không được biết "đơn hàng", "tồn kho" là gì. App gọi truyền `zones`
 * đã lọc quyền + đã dịch ngôn ngữ vào, `AppShell` chỉ lo bố cục và suy ra vùng
 * nào đang active từ `currentPath`.
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

export interface ShellZone {
    key: string
    /** Nhãn ngắn hiện dưới icon trong rail, ví dụ "VẬN HÀNH". */
    label: string
    icon: ReactNode
    /** Sinh ra tab bar khi vùng này đang active. */
    items: ShellNavItem[]
}

export interface AppShellProps {
    /** Rail dọc trái, rộng `var(--cms-rail-w)` = 64px. ~3-6 vùng lớn. */
    zones: ShellZone[]
    /** Đường dẫn hiện tại — dùng để suy ra vùng active và mục active. */
    currentPath: string
    /** Logo + tên sản phẩm, hiện ở đầu rail. */
    brand: ReactNode
    /** Vùng bên phải header: role switcher, chuyển ngôn ngữ, avatar… */
    headerRight?: ReactNode
    children: ReactNode
}

/** Một mục có đang active không: so khớp chính xác hoặc theo tiền tố `/`. */
function isItemActive(href: string, currentPath: string, rootPath: string): boolean {
    if (href === rootPath) return currentPath === rootPath
    return currentPath === href || currentPath.startsWith(`${href}/`)
}

/**
 * Vùng nào đang active: vùng có ít nhất một mục khớp `currentPath`. Không cần
 * state riêng — suy thẳng từ URL nên back/forward trình duyệt và deep-link
 * đều tự động đúng vùng. Không khớp vùng nào thì mặc định vùng đầu tiên.
 */
function findActiveZone(zones: ShellZone[], currentPath: string): ShellZone | undefined {
    const matched = zones.find((zone) =>
        zone.items.some((item) => isItemActive(item.href, currentPath, zone.items[0]?.href ?? ''))
    )
    return matched ?? zones[0]
}

export function AppShell({ zones, currentPath, brand, headerRight, children }: AppShellProps) {
    const activeZone = findActiveZone(zones, currentPath)
    const tabItems = activeZone?.items ?? []
    // Mục "gốc" của tab bar là item đầu của vùng active — quyết định so khớp
    // chính xác (trang gốc của vùng) hay so khớp tiền tố (trang con).
    const tabRootPath = tabItems[0]?.href ?? ''

    return (
        <div data-cms className="flex h-screen w-full overflow-hidden bg-[var(--cms-bg-subtle)] text-[var(--cms-text)]">
            {/* Rail dọc trái — icon + nhãn ngắn, luôn 64px, không thu gọn:
                chỉ ~3-6 vùng nên bề rộng cố định vẫn đọc được (D4 target 24px). */}
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
                    {zones.map((zone) => {
                        const active = zone.key === activeZone?.key
                        // Vào vùng bằng href của mục đầu tiên trong vùng đó.
                        const href = zone.items[0]?.href ?? '#'
                        return (
                            <a
                                key={zone.key}
                                href={href}
                                title={zone.label}
                                aria-current={active ? 'page' : undefined}
                                className={`flex w-14 flex-col items-center gap-0.5 rounded-[var(--cms-radius)] py-2 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                    active
                                        ? 'bg-[var(--cms-accent-weak)] text-[var(--cms-accent)]'
                                        : 'text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)]'
                                }`}
                            >
                                {zone.icon}
                                <span className="w-full truncate px-0.5 text-[9px] font-semibold leading-tight">
                                    {zone.label}
                                </span>
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

                {/* Tab bar ngang — các màn thuộc vùng đang chọn ở rail. */}
                {tabItems.length > 0 && (
                    <nav
                        className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-[var(--cms-border)] bg-[var(--cms-bg)] px-3"
                        style={{ height: 'var(--cms-tabbar-h)' }}
                    >
                        {tabItems.map((tab) => {
                            const active = isItemActive(tab.href, currentPath, tabRootPath)
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
