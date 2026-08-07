'use client'

import {
    BedIcon,
    CalendarIcon,
    ExternalIcon,
    FileTextIcon,
    GridIcon,
    MenuIcon,
    PlusIcon,
    SettingsIcon,
    TagIcon,
    TicketIcon,
    UsersIcon
} from '@/components/icons'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import { ROLE_LABEL, S, tr } from '@/strings'
import type { Permission } from '@repo/core'
import { can, isStaffRole } from '@repo/core'
import { type SidebarRecentItem } from '@repo/ui'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavItem {
    href: string
    label: { vi: string; en: string }
    icon: React.ReactNode
    permission?: Permission
    badge?: string
}

interface NavGroup {
    title: { vi: string; en: string }
    items: NavItem[]
}

interface NavPrefixSection {
    prefix: 'client' | 'system'
    prefixTitle: { vi: string; en: string }
    badgeTone: string
    groups: NavGroup[]
}

const NAV_SECTIONS: NavPrefixSection[] = [
    {
        prefix: 'client',
        prefixTitle: { vi: 'VẬN HÀNH & ĐƠN HÀNG (BOOKINGS & ROOMS)', en: 'BOOKINGS & ROOM OPERATIONS' },
        badgeTone: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        groups: [
            {
                title: { vi: 'Tổng quan ca trực', en: 'Shift Overview' },
                items: [
                    { href: '/admin', label: { vi: 'Bảng hôm nay', en: 'Today Dashboard' }, icon: <GridIcon size={18} /> }
                ],
            },
            {
                title: { vi: 'Tác nghiệp hàng ngày', en: 'Daily Operations' },
                items: [
                    { href: '/admin/orders', label: { vi: 'Quản lý Đơn hàng', en: 'Bookings' }, icon: <FileTextIcon size={18} />, permission: 'booking.view.all' },
                    { href: '/admin/inventory', label: { vi: 'Lịch tồn kho & Giá', en: 'Rates & Availability' }, icon: <CalendarIcon size={18} />, permission: 'inventory.edit' },
                    { href: '/admin/housekeeping', label: { vi: 'Quản lý Buồng phòng', en: 'Housekeeping' }, icon: <BedIcon size={18} /> },
                    { href: '/admin/customers', label: { vi: 'Danh sách Khách hàng', en: 'Customers' }, icon: <UsersIcon size={18} />, permission: 'booking.view.all' },
                ],
            },
        ],
    },
    {
        prefix: 'system',
        prefixTitle: { vi: 'SYSTEM ADMIN (CẤU HÌNH & KHUYẾN MÃI)', en: 'SYSTEM ADMIN & CONFIG' },
        badgeTone: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        groups: [
            {
                title: { vi: 'Ưu đãi & Chương trình', en: 'Promotions & Deals' },
                items: [
                    { href: '/admin/promotions', label: { vi: 'Chương trình Khuyến mãi', en: 'Promotions Engine' }, icon: <TagIcon size={18} />, permission: 'promotion.edit', badge: 'Admin' },
                ],
            },
            {
                title: { vi: 'Cấu hình Cơ sở & Hạng phòng', en: 'Property & Room Setup' },
                items: [
                    { href: '/admin/settings/rooms', label: { vi: 'Tạo & Quản lý Hạng phòng', en: 'Room Types & Units' }, icon: <BedIcon size={18} />, permission: 'content.edit', badge: 'Hot' },
                    { href: '/admin/settings/rate-plans', label: { vi: 'Gói giá & Addons', en: 'Rate Plans & Addons' }, icon: <TagIcon size={18} />, permission: 'content.edit' },
                ],
            },
            {
                title: { vi: 'Hạ tầng & Bảo trì', en: 'System & Maintenance' },
                items: [
                    { href: '/admin/settings/tickets', label: { vi: 'Ticket Sự cố & Bảo trì', en: 'Incident Tickets' }, icon: <TicketIcon size={18} />, badge: 'New' },
                    { href: '/admin/settings/accounts', label: { vi: 'Tài khoản & Quyền RBAC', en: 'Accounts & RBAC' }, icon: <UsersIcon size={18} />, permission: 'account.manage' },
                    { href: '/admin/settings/general', label: { vi: 'Cài đặt Ngân hàng & ZNS', en: 'Bank & Notification' }, icon: <SettingsIcon size={18} />, permission: 'settings.bank' },
                ],
            },
        ],
    },
]

// Mock recent bookings list for SidebarRecentList
const RECENT_BOOKINGS: SidebarRecentItem[] = [
    { id: '1', title: 'ĐH-2026-0039 (Lê Văn Tùng)', subtitle: 'Deluxe Ocean · 23/07', status: 'done' },
    { id: '2', title: 'ĐH-2026-0038 (Nguyễn Thu Hà)', subtitle: 'Bungalow Hill · 23/07', status: 'done' },
    { id: '3', title: 'ĐH-2026-0037 (Trần Quốc Bảo)', subtitle: 'Villa Front Sea · 22/07', status: 'error' },
    { id: '4', title: 'ĐH-2026-0036 (Phạm Minh Đức)', subtitle: 'Deluxe Ocean · 21/07', status: 'done' },
    { id: '5', title: 'ĐH-2026-0035 (Hoàng Mai Chi)', subtitle: 'Executive Suite · 20/07', status: 'processing' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <LocaleProvider>
            <AdminShell>{children}</AdminShell>
        </LocaleProvider>
    )
}

function AdminShell({ children }: { children: React.ReactNode }) {
    const { locale } = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const logout = useAuthStore((s) => s.logout)

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (!hydrated) return
        if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
        else if (!isStaffRole(user.role)) router.replace('/my-orders')
    }, [hydrated, user, pathname, router])

    if (!hydrated || !user || !isStaffRole(user.role)) return null

    // Filter visible items based on permissions
    const visibleSections = NAV_SECTIONS.map((section) => ({
        ...section,
        groups: section.groups
            .map((group) => ({
                ...group,
                items: group.items.filter(
                    (item) => !item.permission || can(user.role, item.permission)
                ),
            }))
            .filter((group) => group.items.length > 0),
    })).filter((section) => section.groups.length > 0)

    const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'

    return (
        <div
            data-theme="h1"
            className="h-screen w-full flex overflow-hidden bg-slate-100 text-slate-900 font-sans"
        >
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
                />
            )}

            {/* Dark Navy Sidebar 100vh */}
            <aside
                className={`admin-sidebar h-screen sticky top-0 z-50 w-64 shrink-0 bg-[#0b192c] text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Header / Brand with 24x24px logo indicator */}
                <div className="h-14 px-4 border-b border-slate-800/80 flex items-center gap-2.5 shrink-0">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 text-[10px] shadow-sm shrink-0 border border-amber-300/40">
                        ND
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-sm text-white tracking-wider truncate">
                            THE NAM DU HILL
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                            {tr(S.adminPanel, locale)}
                        </div>
                    </div>
                </div>

                {/* Primary Action Button */}
                <div className="p-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/orders')}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-[6px] shadow-sm transition-all active:scale-[0.98] min-h-[36px]"
                    >
                        <PlusIcon size={15} />
                        <span>+ Đặt phòng mới</span>
                    </button>
                </div>


                {/* Navigation List grouped by Client vs System Admin */}
                <nav className="flex-1 px-2.5 py-2 space-y-4 overflow-y-auto custom-scrollbar">
                    {visibleSections.map((section) => (
                        <div key={section.prefix} className="space-y-2">
                            {/* Category Prefix Badge */}
                            <div className="px-2 py-1 flex items-center justify-between">
                                <span className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded border uppercase ${section.badgeTone}`}>
                                    {section.prefixTitle[locale]}
                                </span>
                            </div>

                            {/* Subtabs Groups */}
                            <div className="space-y-3">
                                {section.groups.map((group, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            {group.title[locale]}
                                        </div>
                                        <div className="space-y-0.5">
                                            {group.items.map((item) => {
                                                const active =
                                                    item.href === '/admin'
                                                        ? pathname === '/admin'
                                                        : pathname.startsWith(item.href)
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${active
                                                            ? 'bg-[#163b6c] text-white shadow-sm font-semibold'
                                                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <span className={active ? 'text-amber-400' : 'text-slate-400'}>
                                                                {item.icon}
                                                            </span>
                                                            <span className="truncate">{item.label[locale]}</span>
                                                        </div>
                                                        {item.badge && (
                                                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Recent Bookings Component */}
                    {/* <div className="pt-2 border-t border-slate-800/70">
                        <SidebarRecentList
                            title="Đơn gần đây"
                            items={RECENT_BOOKINGS}
                            onItemClick={() => router.push(`/admin/orders`)}
                        />
                    </div> */}
                </nav>

                {/* Footer User Profile & System Actions */}
                <div className="p-3 border-t border-slate-800/80 bg-[#091322] shrink-0 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 px-2 py-1">
                        <Link
                            href="/h1"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                            <ExternalIcon size={14} />
                            <span>{tr(S.viewSite, locale)}</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                logout()
                                router.replace('/login')
                            }}
                            className="text-rose-400 hover:text-rose-300 transition-colors text-xs font-medium"
                        >
                            {tr(S.logout, locale)}
                        </button>
                    </div>

                    {/* User profile card */}
                    <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-white truncate">
                                {user.fullName || 'Admin User'}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                                {tr(ROLE_LABEL[user.role], locale)}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Full Width & Height (100vw, 100vh, 12px padding) */}
            <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 bg-slate-50">
                <header className="lg:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                    >
                        <MenuIcon size={18} />
                    </button>
                    <strong className="text-sm text-slate-900">
                        {tr(S.adminPanel, locale)}
                    </strong>
                </header>

                <main className="flex-1 p-3 min-w-0 w-full flex flex-col overflow-hidden h-full min-h-0">
                    {children}
                </main>
            </div>
        </div>
    )
}



