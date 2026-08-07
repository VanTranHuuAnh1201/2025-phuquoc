'use client'

import {
    BedIcon,
    CalendarIcon,
    CoinsIcon,
    ExternalIcon,
    FileTextIcon,
    GridIcon,
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
import { AppShell, type ShellNavItem } from '@repo/cms-ui'
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
            { href: '/admin', label: 'Dashboard', icon: <GridIcon size={20} /> },
            { href: '/admin/orders', label: 'Quản lý Đơn hàng', icon: <FileTextIcon size={20} />, permission: 'booking.view.all' },
            { href: '/admin/inventory', label: 'Tồn kho & Giá', icon: <CalendarIcon size={20} />, permission: 'inventory.view' },
            { href: '/admin/housekeeping', label: 'Buồng phòng', icon: <BedIcon size={20} /> },
            { href: '/admin/customers', label: 'Khách hàng (CRM)', icon: <UsersIcon size={20} />, permission: 'booking.view.all' },
        ],
    },
    {
        prefix: 'content',
        title: 'CONTENT',
        items: [
            { href: '/admin/content/pages', label: 'Trang (Pages)', icon: <FileTextIcon size={20} />, permission: 'content.edit' },
            { href: '/admin/content/media', label: 'Media', icon: <GridIcon size={20} />, permission: 'content.edit' },
            { href: '/admin/promotions', label: 'Khuyến mãi', icon: <TagIcon size={20} />, permission: 'promotion.edit' },
        ],
    },
    {
        prefix: 'system',
        title: 'SYSTEM / SETUP',
        items: [
            { href: '/admin/settings', label: 'Setup & Cấu hình', icon: <SettingsIcon size={20} />, permission: 'content.edit' },
            { href: '/admin/settings/rooms', label: 'Hạng phòng', icon: <BedIcon size={20} />, permission: 'content.edit' },
            { href: '/admin/settings/rate-plans', label: 'Gói giá', icon: <TagIcon size={20} />, permission: 'price.edit' },
            { href: '/admin/settings/addons', label: 'Phụ thu & Dịch vụ', icon: <CoinsIcon size={20} />, permission: 'price.edit' },
            { href: '/admin/settings/tickets', label: 'Ticket sự cố', icon: <TicketIcon size={20} />, permission: 'content.edit' },
            { href: '/admin/settings/accounts', label: 'Tài khoản & RBAC', icon: <UsersIcon size={20} />, permission: 'account.manage' },
            { href: '/admin/settings/general', label: 'Cài đặt Ngân hàng & ZNS', icon: <SettingsIcon size={20} />, permission: 'settings.bank' },
        ],
    },
]

const TOP_NAV_ITEMS: ShellNavItem[] = [
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

    // Lọc mục theo quyền — mỗi vai trò thấy đúng phần việc của mình (§B8).
    const visibleSections = NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(
            (item) => !item.permission || can(user.role, item.permission)
        ),
    })).filter((section) => section.items.length > 0)

    // AppShell chỉ nhận một mảng phẳng railItems — gộp mọi section lại vì
    // rail 64px cố định không còn chỗ cho tiêu đề nhóm (khác cây menu cũ).
    const railItems: ShellNavItem[] = visibleSections.flatMap((section) => section.items)

    const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'
    const roleLabel = tr(ROLE_LABEL[user.role], locale)

    return (
        <AppShell
            railItems={railItems}
            tabItems={TOP_NAV_ITEMS}
            currentPath={pathname}
            brand={
                <Link href="/admin" title="THE NAM DU HILL" aria-label="THE NAM DU HILL">
                    <div className="w-8 h-8 rounded-[var(--cms-radius-sm)] overflow-hidden bg-[var(--cms-bg-subtle)] border border-[var(--cms-border)] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/brand/logo.png"
                            alt="The Nam Du Hill Logo"
                            className="w-full h-full object-contain p-0.5"
                        />
                    </div>
                </Link>
            }
            headerRight={
                <div className="flex items-center gap-2.5">
                    {/* CTA chính */}
                    <button
                        type="button"
                        onClick={() => router.push('/admin/orders/new')}
                        className="flex items-center gap-1 py-1.5 px-3 bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white font-semibold text-[length:var(--cms-text-body)] rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <span>+ Đặt phòng mới</span>
                    </button>

                    {/* Chuyển ngôn ngữ */}
                    <div className="flex bg-[var(--cms-bg-subtle)] p-0.5 rounded-[var(--cms-radius)] border border-[var(--cms-border)]">
                        {(['vi', 'en'] as const).map((code) => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => setLocale(code)}
                                aria-pressed={locale === code}
                                className={`px-2 py-1 text-[length:var(--cms-text-meta)] font-bold uppercase rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                    locale === code
                                        ? 'bg-[var(--cms-bg)] text-[var(--cms-text)] shadow-[var(--cms-shadow-pop)]'
                                        : 'text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]'
                                }`}
                            >
                                {code}
                            </button>
                        ))}
                    </div>

                    {/* Dropdown người dùng — hiện vai trò THẬT, không phải role switcher giả */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-2 py-1 px-1.5 rounded-[var(--cms-radius)] hover:bg-[var(--cms-bg-subtle)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <div className="w-6 h-6 rounded-full bg-[var(--cms-accent)] text-white flex items-center justify-center font-bold text-[length:var(--cms-text-meta)] shrink-0">
                                {userInitial}
                            </div>
                            <div className="hidden sm:block text-left min-w-0">
                                <div className="text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text)] truncate leading-tight">
                                    {user.fullName || 'Admin User'}
                                </div>
                                <div className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] truncate leading-tight">
                                    {roleLabel}
                                </div>
                            </div>
                        </button>

                        {userDropdownOpen && (
                            <div className="absolute top-full right-0 mt-1 z-50 w-56 bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] shadow-[var(--cms-shadow-pop)] p-2 text-[length:var(--cms-text-body)] text-[var(--cms-text)] space-y-1">
                                <div className="px-2 py-1.5 border-b border-[var(--cms-border)]">
                                    <div className="font-semibold truncate">{user.fullName || 'Admin User'}</div>
                                    <div className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] truncate">
                                        {user.email || roleLabel}
                                    </div>
                                </div>

                                <Link
                                    href="/h1"
                                    target="_blank"
                                    className="flex items-center justify-between px-2 py-1.5 text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                                >
                                    <span>Xem Trang Client</span>
                                    <ExternalIcon size={14} />
                                </Link>

                                <div className="border-t border-[var(--cms-border)] pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserDropdownOpen(false)
                                            logout()
                                            router.replace('/login')
                                        }}
                                        className="w-full text-left px-2 py-1.5 text-[var(--cms-tone-rose)] hover:bg-[var(--cms-tone-rose-bg)] rounded-[var(--cms-radius-sm)] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            {children}
        </AppShell>
    )
}
