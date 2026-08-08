'use client'

import {
    BedIcon,
    BuildingIcon,
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
import { ROLE_LABEL, S, tr } from '@/strings'
import type { Permission } from '@repo/core'
import { can, isStaffRole } from '@repo/core'
import { AppShell, DrawerRightProvider, type ShellZone } from '@repo/cms-ui'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    permission?: Permission
}

// Ba nhóm này ánh xạ trực tiếp sang 3 ShellZone của rail — icon zone lấy từ
// mục đầu tiên trong nhóm (`ZONE_ICON` dưới), nhãn zone qua `S.adminZone*`.
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
            { href: '/admin/orders', label: 'Đặt phòng', icon: <FileTextIcon size={20} />, permission: 'booking.view.all' },
            { href: '/admin/inventory', label: 'Phòng trống & Giá', icon: <CalendarIcon size={20} />, permission: 'inventory.view' },
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

// Icon riêng cho từng zone ở rail — khác icon của mục đầu trong nhóm để zone
// tự đứng được như một biểu tượng nhóm, không phải "tình cờ trùng" icon con.
const ZONE_ICON: Record<NavSection['prefix'], React.ReactNode> = {
    operations: <GridIcon size={20} />,
    content: <FileTextIcon size={20} />,
    system: <BuildingIcon size={20} />,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <LocaleProvider>
            <AdminDrawerHost>
                <AdminShell>{children}</AdminShell>
            </AdminDrawerHost>
        </LocaleProvider>
    )
}

/**
 * Đặt `DrawerRightProvider` ở TẦNG LAYOUT, không phải trong từng màn: nhờ vậy
 * mọi màn CMS chỉ cần gọi `useDrawerRight().show({...})` là mở được bảng trượt,
 * không phải tự khai state và tự nhớ render component ở cuối JSX.
 *
 * Nằm TRONG `LocaleProvider` vì nhãn nút của drawer phải song ngữ (luật C7) —
 * `cms-ui` thuộc tầng nền, không được biết hệ i18n của app, nên nhận nhãn đã
 * dịch qua prop.
 */
function AdminDrawerHost({ children }: { children: React.ReactNode }) {
    const { locale } = useLocale()
    return (
        <DrawerRightProvider
            labels={{
                close: tr(S.close, locale),
                back: tr(S.back, locale),
                cancel: tr(S.cancel, locale),
            }}
        >
            {children}
        </DrawerRightProvider>
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

    // Ba nhóm sẵn có (operations/content/system) ánh xạ 1:1 sang 3 ShellZone
    // — rail giữ được phân nhóm và nhãn chữ, tab bar sinh từ items của zone
    // đang active thay vì một hằng TOP_NAV_ITEMS cứng tách rời khỏi menu.
    const zones: ShellZone[] = visibleSections.map((section) => ({
        key: section.prefix,
        label:
            section.prefix === 'operations'
                ? tr(S.adminZoneOperations, locale)
                : section.prefix === 'content'
                  ? tr(S.adminZoneContent, locale)
                  : tr(S.adminZoneSystem, locale),
        icon: ZONE_ICON[section.prefix],
        items: section.items,
    }))

    const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'
    const roleLabel = tr(ROLE_LABEL[user.role], locale)

    return (
        <AppShell
            zones={zones}
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
                <>
                    {/* CTA "+ Đặt phòng mới" đã BỎ khỏi header (fix round 1, mục 2):
                        nó lặp lại y hệt nút trong `PageHeaderBar` của từng trang, hai
                        CTA cùng cấp cách nhau ~100px dọc vi phạm P10 (mỗi section
                        không quá 1 CTA chính). Giữ đúng một bản trong `PageHeaderBar`. */}

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

                    {/* Khối user chỉ còn AVATAR ICON (fix round 1, mục 3) — tên đầy
                        đủ + vai trò chuyển hẳn vào dropdown, không chiếm chỗ ngang
                        trên header nữa. */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            aria-haspopup="true"
                            aria-expanded={userDropdownOpen}
                            aria-label={`${user.fullName || 'Admin User'} — ${roleLabel}`}
                            className="flex items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <div className="w-8 h-8 rounded-full bg-[var(--cms-accent)] text-white flex items-center justify-center font-bold text-[length:var(--cms-text-body)] shrink-0">
                                {userInitial}
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
                </>
            }
        >
            {children}
        </AppShell>
    )
}
