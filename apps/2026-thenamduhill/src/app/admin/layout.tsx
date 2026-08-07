'use client'

import {
    BedIcon,
    CalendarIcon,
    CoinsIcon,
    ExternalIcon,
    FileTextIcon,
    GridIcon,
    MenuIcon,
    PlusIcon,
    SettingsIcon,
    TagIcon,
    TicketIcon,
    UsersIcon,
} from '@/components/icons'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import { ROLE_LABEL, tr } from '@/strings'
import type { Permission } from '@repo/core'
import { can, isStaffRole } from '@repo/core'
import { useRailCollapse } from '@repo/ui'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    permission?: Permission
}

interface NavSection {
    prefix: 'operations' | 'content' | 'system'
    title: string
    items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
    {
        prefix: 'operations',
        title: 'OPERATIONS',
        items: [
            { href: '/admin', label: 'Dashboard', icon: <GridIcon size={16} /> },
            { href: '/admin/orders', label: 'Quản lý Đơn hàng', icon: <FileTextIcon size={16} />, permission: 'booking.view.all' },
            { href: '/admin/inventory', label: 'Tồn kho & Giá', icon: <CalendarIcon size={16} />, permission: 'inventory.view' },
            { href: '/admin/housekeeping', label: 'Buồng phòng', icon: <BedIcon size={16} /> },
            { href: '/admin/customers', label: 'Khách hàng (CRM)', icon: <UsersIcon size={16} />, permission: 'booking.view.all' },
        ],
    },
    {
        prefix: 'content',
        title: 'CONTENT',
        items: [
            { href: '/admin/content/pages', label: 'Trang (Pages)', icon: <FileTextIcon size={16} />, permission: 'content.edit' },
            { href: '/admin/content/media', label: 'Media', icon: <GridIcon size={16} />, permission: 'content.edit' },
            { href: '/admin/promotions', label: 'Khuyến mãi', icon: <TagIcon size={16} />, permission: 'promotion.edit' },
        ],
    },
    {
        prefix: 'system',
        title: 'SYSTEM / SETUP',
        items: [
            { href: '/admin/settings', label: 'Setup & Cấu hình', icon: <SettingsIcon size={16} />, permission: 'content.edit' },
            { href: '/admin/settings/rooms', label: 'Hạng phòng', icon: <BedIcon size={16} />, permission: 'content.edit' },
            { href: '/admin/settings/rate-plans', label: 'Gói giá', icon: <TagIcon size={16} />, permission: 'price.edit' },
            { href: '/admin/settings/addons', label: 'Phụ thu & Dịch vụ', icon: <CoinsIcon size={16} />, permission: 'price.edit' },
            { href: '/admin/settings/tickets', label: 'Ticket sự cố', icon: <TicketIcon size={16} />, permission: 'content.edit' },
            { href: '/admin/settings/accounts', label: 'Tài khoản & RBAC', icon: <UsersIcon size={16} />, permission: 'account.manage' },
            { href: '/admin/settings/general', label: 'Cài đặt Ngân hàng & ZNS', icon: <SettingsIcon size={16} />, permission: 'settings.bank' },
        ],
    },
]

const TOP_NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Quản lý Đơn hàng' },
    { href: '/admin/inventory', label: 'Tồn kho & Giá' },
    { href: '/admin/housekeeping', label: 'Buồng phòng' },
    { href: '/admin/customers', label: 'Khách hàng' },
    { href: '/admin/settings', label: 'Setup' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <LocaleProvider>
            <AdminShell>{children}</AdminShell>
        </LocaleProvider>
    )
}

function AdminShell({ children }: { children: React.ReactNode }) {
    const { locale, setLocale } = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const logout = useAuthStore((s) => s.logout)

    // Reusing useRailCollapse hook from @repo/ui for collapse/expand
    const { collapsed, toggle, railRef } = useRailCollapse({
        storageKey: 'ndh-cms-sidebar-collapsed',
    })

    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (!hydrated) return
        if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
        else if (!isStaffRole(user.role)) router.replace('/my-orders')
    }, [hydrated, user, pathname, router])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setUserDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!hydrated || !user || !isStaffRole(user.role)) return null

    // Filter visible items based on permissions
    const visibleSections = NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(
            (item) => !item.permission || can(user.role, item.permission)
        ),
    })).filter((section) => section.items.length > 0)

    const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'

    return (
        <div
            data-theme="h1"
            className="h-screen w-full flex overflow-hidden bg-slate-100 text-slate-900 font-sans"
        >
            {/* Left Sidebar with Logo & Collapsible Tree Navigation */}
            <aside
                ref={railRef as any}
                className={`h-screen sticky top-0 left-0 z-50 shrink-0 bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 ease-in-out ${
                    collapsed ? 'w-14' : 'w-60'
                }`}
            >
                {/* Sidebar Header with Fixed Logo & Collapse Toggle */}
                <div
                    className={`border-b border-slate-800/80 shrink-0 transition-all ${
                        collapsed
                            ? 'py-3 flex flex-col items-center justify-center gap-2.5'
                            : 'h-13 px-3 flex items-center justify-between'
                    }`}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Fixed 28x28px Company Logo Image */}
                        <div className="w-7 h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] rounded-md overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60 shadow-xs flex items-center justify-center relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/brand/logo.png"
                                alt="The Nam Du Hill Logo"
                                className="w-full h-full object-contain p-0.5"
                            />
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <div className="font-extrabold text-xs text-white tracking-wide truncate">
                                    THE NAM DU HILL
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Collapse / Expand Toggle Button: Beside logo when expanded, directly below logo when collapsed */}
                    <button
                        type="button"
                        onClick={toggle}
                        title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                    >
                        <MenuIcon size={16} />
                    </button>
                </div>

                {/* Clean Vertical Navigation Tree */}
                <nav className="flex-1 px-2 py-2 space-y-3 overflow-y-auto custom-scrollbar">
                    {visibleSections.map((section) => (
                        <div key={section.prefix} className="space-y-0.5">
                            {!collapsed && (
                                <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    {section.title}
                                </div>
                            )}

                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const active =
                                        item.href === '/admin'
                                            ? pathname === '/admin'
                                            : pathname.startsWith(item.href)
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                                active
                                                    ? 'bg-slate-800 text-blue-400 font-semibold border-l-2 border-blue-500'
                                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                            } ${collapsed ? 'justify-center px-0' : ''}`}
                                        >
                                            <span className={active ? 'text-blue-400' : 'text-slate-400'}>
                                                {item.icon}
                                            </span>
                                            {!collapsed && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile & Dropdown */}
                <div className="p-2 border-t border-slate-800/80 bg-[#090D1A] shrink-0 relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className={`w-full flex items-center gap-2 p-1 rounded-md hover:bg-slate-800/70 transition-colors text-left ${
                            collapsed ? 'justify-center' : 'justify-between'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                {userInitial}
                            </div>
                            {!collapsed && (
                                <div className="min-w-0">
                                    <div className="text-xs font-semibold text-white truncate">
                                        {user.fullName || 'Admin User'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                        {tr(ROLE_LABEL[user.role], locale)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {!collapsed && (
                            <span className="text-slate-400 text-[9px]">▲</span>
                        )}
                    </button>

                    {/* User Dropdown Menu */}
                    {userDropdownOpen && (
                        <div
                            className={`absolute bottom-11 z-50 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl p-2 text-xs text-slate-200 space-y-2 ${
                                collapsed ? 'left-14 w-48' : 'left-2 right-2'
                            }`}
                        >
                            <div className="px-2 py-1 border-b border-slate-700">
                                <div className="font-semibold text-white truncate">
                                    {user.fullName || 'Admin User'}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    {user.email || 'Staff Account'}
                                </div>
                            </div>

                            <Link
                                href="/h1"
                                target="_blank"
                                className="flex items-center justify-between px-2 py-1 text-slate-300 hover:bg-slate-700/60 rounded transition-colors"
                            >
                                <span>Xem Trang Client</span>
                                <ExternalIcon size={12} />
                            </Link>

                            <div className="border-t border-slate-700 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserDropdownOpen(false)
                                        logout()
                                        router.replace('/login')
                                    }}
                                    className="w-full text-left px-2 py-1 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded font-medium transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Workspace with Streamlined Top-Nav Bar */}
            <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 bg-slate-100">
                {/* Streamlined Top-Nav Header (Height 40px) */}
                <header className="h-10 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 z-30 text-xs">
                    {/* Left: Operational Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar h-full">
                        {TOP_NAV_ITEMS.map((tab) => {
                            const active =
                                tab.href === '/admin'
                                    ? pathname === '/admin'
                                    : pathname.startsWith(tab.href)
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap ${
                                        active
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right: Primary Action Buttons, Role Switcher & Controls */}
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                        {/* Primary CTA Button */}
                        <button
                            type="button"
                            onClick={() => router.push('/admin/orders/new')}
                            className="flex items-center gap-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors shadow-xs"
                        >
                            <PlusIcon size={14} />
                            <span>+ Đặt phòng mới</span>
                        </button>

                        {/* Staff Role Switcher */}
                        <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-[11px]">
                            <span className="px-2 py-0.2 text-slate-500">Lễ tân</span>
                            <span className="px-2 py-0.2 font-bold bg-blue-600 text-white rounded shadow-xs">Manager</span>
                            <span className="px-2 py-0.2 text-slate-500">Chủ cơ sở</span>
                        </div>

                        {/* Language Selector */}
                        <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                            {(['vi', 'en'] as const).map((code) => (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => setLocale(code)}
                                    className={`px-1.5 py-0.2 text-[10px] font-bold uppercase rounded ${
                                        locale === code ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-3 min-w-0 w-full flex flex-col overflow-hidden h-full min-h-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
