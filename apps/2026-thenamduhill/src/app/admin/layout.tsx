'use client'

/**
 * Khung CMS — MỘT layout dùng chung cho cả N theme.
 *
 * Vì sao không phải mỗi theme một CMS: admin sửa NỘI DUNG, không sửa MÀN HÌNH.
 * Cùng một bộ dữ liệu chảy vào cả 4 giao diện; nếu CMS gắn với từng theme thì
 * thêm mẫu thứ 20 là phải làm thêm bộ quản trị thứ 20 — vi phạm luật R5.
 * Xem `.claude/rules/app-flows.md` §F5.
 *
 * CMS là công cụ nội bộ nên cố định theme `h1`, không đổi theo mẫu đang xem.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import {
    BedIcon,
    CalendarIcon,
    ExternalIcon,
    FileTextIcon,
    GridIcon,
    TagIcon,
    UsersIcon,
} from '@/components/icons'
import { ROLE_LABEL, S, tr } from '@/strings'
import type { Role } from '@repo/core'

interface NavItem {
    href: string
    labelKey: keyof typeof S
    icon: React.ReactNode
    /** Vai trò được thấy mục này. Rỗng = mọi vai trò nội bộ. */
    roles?: Role[]
}

const NAV: { group: keyof typeof S; items: NavItem[] }[] = [
    {
        group: 'dashboard',
        items: [{ href: '/admin', labelKey: 'dashboard', icon: <GridIcon size={18} /> }],
    },
    {
        group: 'orders',
        items: [
            { href: '/admin/orders', labelKey: 'orders', icon: <FileTextIcon size={18} /> },
            {
                href: '/admin/inventory',
                labelKey: 'inventoryCalendar',
                icon: <CalendarIcon size={18} />,
                roles: ['owner', 'manager'],
            },
            { href: '/admin/housekeeping', labelKey: 'housekeeping', icon: <BedIcon size={18} /> },
            { href: '/admin/customers', labelKey: 'customers', icon: <UsersIcon size={18} /> },
        ],
    },
    {
        group: 'promotions',
        items: [
            {
                href: '/admin/promotions',
                labelKey: 'promotions',
                icon: <TagIcon size={18} />,
                roles: ['owner', 'manager'],
            },
        ],
    },
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

    // Chặn: phải đăng nhập VÀ không phải tài khoản khách.
    useEffect(() => {
        if (!hydrated) return
        if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
        else if (user.role === 'customer') router.replace('/my-orders')
    }, [hydrated, user, pathname, router])

    if (!hydrated || !user || user.role === 'customer') return null

    const visible = NAV.map((section) => ({
        ...section,
        items: section.items.filter((item) => !item.roles || item.roles.includes(user.role)),
    })).filter((section) => section.items.length > 0)

    return (
        <div
            data-theme="h1"
            style={{
                minHeight: '100vh',
                display: 'flex',
                background: 'var(--surface-alt)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
            }}
        >
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'var(--overlay-scrim)',
                        zIndex: 40,
                    }}
                    className="admin-backdrop"
                />
            )}

            <aside
                className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}
                style={{
                    width: 240,
                    flexShrink: 0,
                    background: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        padding: 'var(--space-5)',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 'var(--text-sm)',
                            color: 'var(--brand)',
                            letterSpacing: '0.04em',
                        }}
                    >
                        THE NAM DU HILL
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {tr(S.adminPanel, locale)}
                    </div>
                </div>

                <nav style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
                    {visible.map((section) => (
                        <div key={section.group} style={{ marginBottom: 'var(--space-5)' }}>
                            <div
                                style={{
                                    padding: '0 var(--space-3) var(--space-2)',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                {tr(S[section.group], locale)}
                            </div>
                            {section.items.map((item) => {
                                const active =
                                    item.href === '/admin'
                                        ? pathname === '/admin'
                                        : pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        aria-current={active ? 'page' : undefined}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-3)',
                                            borderRadius: 'var(--radius)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: active ? 600 : 400,
                                            color: active ? 'var(--brand)' : 'var(--text-muted)',
                                            background: active ? 'var(--surface-tint)' : 'transparent',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {item.icon}
                                        {tr(S[item.labelKey], locale)}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>

                <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        {user.fullName}
                    </div>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {tr(ROLE_LABEL[user.role], locale)}
                    </div>
                    <Link
                        href="/h1"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        <ExternalIcon size={14} />
                        {tr(S.viewSite, locale)}
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            logout()
                            router.replace('/login')
                        }}
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontFamily: 'var(--font-body)',
                            color: 'var(--danger)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            minHeight: 24,
                        }}
                    >
                        {tr(S.logout, locale)}
                    </button>
                </div>
            </aside>

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <header
                    className="admin-topbar"
                    style={{
                        background: 'var(--surface)',
                        borderBottom: '1px solid var(--border)',
                        padding: 'var(--space-3) var(--space-5)',
                        display: 'none',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        aria-label={locale === 'vi' ? 'Mở menu' : 'Open menu'}
                        style={{
                            width: 36,
                            height: 36,
                            display: 'grid',
                            placeItems: 'center',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            fontSize: 18,
                        }}
                    >
                        ☰
                    </button>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>
                        {tr(S.adminPanel, locale)}
                    </strong>
                </header>

                <main style={{ flex: 1, padding: 'var(--space-6) var(--space-5)', minWidth: 0 }}>
                    {children}
                </main>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .admin-sidebar {
                        position: fixed;
                        inset: 0 auto 0 0;
                        z-index: 50;
                        transform: translateX(-100%);
                        transition: transform var(--duration) var(--ease);
                    }
                    .admin-sidebar.is-open { transform: translateX(0); }
                    .admin-topbar { display: flex !important; }
                }
                @media (min-width: 901px) {
                    .admin-backdrop { display: none; }
                }
            `}</style>
        </div>
    )
}
