'use client'

/**
 * `AppShell` — khung CMS dùng chung: rail dọc trái (VÙNG, thu gọn được) +
 * header (menu chính + hành động) + nội dung cao hết viewport.
 *
 * VÌ SAO BỎ TAB BAR TẦNG 2 (fix round 1): bản trước có rail (vùng) + header +
 * tab bar riêng (màn trong vùng) — ba tầng ngang chiếm quá nhiều chiều cao và
 * để lại một khoảng trắng lớn giữa logo và nút hành động trong header (ảnh
 * `dashboard-1440.png` chủ dự án gửi). Chuyển các mục MÀN vào chính header,
 * ngay khoảng trống đó — còn 2 tầng ngang (rail + header), tiết kiệm
 * `--cms-tabbar-h` (40px) chiều cao cho nội dung thật.
 *
 * VÌ SAO RAIL THU GỌN ĐƯỢC: màn hình laptop hẹp cần tiết kiệm bề ngang (yêu
 * cầu chủ dự án). Trạng thái collapse dùng `useRailCollapse` của `@repo/ui`
 * (đã có sẵn — không viết lại): tự nhớ qua `localStorage`, tự thu gọn khi
 * click ra ngoài rail, tự mở khi click vào rail lúc đang thu gọn.
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
import { useRailCollapse } from '@repo/ui'

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
    /** Sinh ra mục menu chính trong header khi vùng này đang active. */
    items: ShellNavItem[]
}

export interface AppShellProps {
    /** Rail dọc trái, rộng `var(--cms-rail-w)` lúc mở, hẹp hơn lúc thu gọn. */
    zones: ShellZone[]
    /** Đường dẫn hiện tại — dùng để suy ra vùng active và mục active. */
    currentPath: string
    /** Logo + tên sản phẩm, hiện ở đầu rail. */
    brand: ReactNode
    /** Vùng bên phải header: chuyển ngôn ngữ, avatar… (KHÔNG còn CTA chính —
     *  P10 cấm 2 CTA cùng cấp, CTA chính đã chuyển vào `PageHeaderBar`). */
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
    const menuItems = activeZone?.items ?? []
    // Mục "gốc" của menu là item đầu của vùng active — quyết định so khớp
    // chính xác (trang gốc của vùng) hay so khớp tiền tố (trang con).
    const menuRootPath = menuItems[0]?.href ?? ''

    // `collapsed` ở đây có nghĩa NGƯỢC với "đang mở rộng": hook coi trạng
    // thái mặc định (false) là ĐANG MỞ. Đặt tên biến cục bộ rõ nghĩa hơn để
    // không đọc nhầm khi lướt qua JSX bên dưới.
    const { collapsed: isNarrow, railRef } = useRailCollapse({
        storageKey: 'namduhill-cms-rail-collapsed',
    })

    return (
        <div data-cms className="flex h-screen w-full overflow-hidden bg-[var(--cms-bg-subtle)] text-[var(--cms-text)]">
            {/* Rail dọc trái — thu gọn còn 44px (hẹp hơn 64px hiện/mở), hover
                khi thu gọn hiện flyout tên vùng qua `title` (tooltip trình
                duyệt) + `group-hover` (nhãn chữ trượt ra, xem CSS bên dưới). */}
            <aside
                ref={railRef as React.RefObject<HTMLElement>}
                className="group/rail flex h-screen shrink-0 flex-col items-center border-r border-[var(--cms-border)] bg-[var(--cms-bg)] transition-[width] duration-150"
                style={{ width: isNarrow ? '44px' : 'var(--cms-rail-w)' }}
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
                            <div key={zone.key} className="group/item relative flex w-full justify-center">
                                <a
                                    href={href}
                                    title={zone.label}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex flex-col items-center gap-0.5 rounded-[var(--cms-radius)] py-2 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                        isNarrow ? 'w-9' : 'w-14'
                                    } ${
                                        active
                                            ? 'bg-[var(--cms-accent-weak)] text-[var(--cms-accent)]'
                                            : 'text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)]'
                                    }`}
                                >
                                    {zone.icon}
                                    {/* Thu gọn: ẩn nhãn chữ, chỉ còn icon + `title` (tooltip gốc
                                        trình duyệt) làm gợi ý khi hover. Mở rộng: nhãn hiện đúng
                                        như bản gốc. */}
                                    {!isNarrow && (
                                        <span className="w-full text-center text-[length:var(--cms-text-meta)] font-semibold leading-tight break-words">
                                            {zone.label}
                                        </span>
                                    )}
                                </a>
                                {/* Flyout tên vùng khi thu gọn — bổ sung cho `title` vì tooltip
                                    trình duyệt có độ trễ; flyout hiện ngay khi hover (D4: mọi
                                    thông tin ẩn phải có cách khác để lấy lại, không chỉ tooltip
                                    hệ điều hành vốn không nhất quán giữa các trình duyệt). */}
                                {isNarrow && (
                                    <span
                                        role="tooltip"
                                        className="pointer-events-none absolute left-full top-1/2 z-50 ml-1 -translate-y-1/2 whitespace-nowrap rounded-[var(--cms-radius-sm)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-2 py-1 text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text)] opacity-0 shadow-[var(--cms-shadow-pop)] transition-opacity group-hover/item:opacity-100"
                                    >
                                        {zone.label}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </nav>
            </aside>

            {/* Vùng làm việc chính: header (menu chính + hành động) + nội dung
                cao HẾT phần còn lại của viewport — `min-h-0 flex-1` bắt buộc để
                `<main>` co giãn đúng, không để lại khoảng trắng dưới bảng như
                ảnh `dashboard-1440.png`. */}
            <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                <header
                    className="flex shrink-0 items-center gap-4 border-b border-[var(--cms-border)] bg-[var(--cms-bg)] px-4"
                    style={{ height: 'var(--cms-header-h)' }}
                >
                    {/* Menu chính của vùng đang active — thế chỗ tab bar tầng 2 cũ,
                        lấp đúng khoảng trống giữa logo và khối hành động bên phải. */}
                    {menuItems.length > 0 && (
                        <nav className="flex h-full min-w-0 flex-1 items-center gap-1 overflow-x-auto">
                            {menuItems.map((item) => {
                                const active = isItemActive(item.href, currentPath, menuRootPath)
                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex h-8 shrink-0 items-center whitespace-nowrap rounded-[var(--cms-radius)] px-3 text-[length:var(--cms-text-body)] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                            active
                                                ? 'bg-[var(--cms-accent-weak)] text-[var(--cms-accent)]'
                                                : 'text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)]'
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                )
                            })}
                        </nav>
                    )}

                    {headerRight && (
                        <div className="flex shrink-0 items-center gap-2.5">{headerRight}</div>
                    )}
                </header>

                <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    )
}
