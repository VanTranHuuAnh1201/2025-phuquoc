'use client'

import { PlusIcon, SearchIcon, TrashIcon } from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { S, tr } from '@/strings'
import { DataTable, useDataTable, type Column, Modal, Field, SelectField } from '@repo/ui'
import { useState } from 'react'

export interface AccountRowItem {
    id: string
    username: string
    fullName: string
    email: string
    role: 'superadmin' | 'owner' | 'manager' | 'receptionist' | 'housekeeping'
    roleLabel: string
    phone: string
    status: 'active' | 'suspended' | 'invited'
    statusLabel: string
    lastActive: string
}

const RESORT_ACCOUNTS: AccountRowItem[] = [
    {
        id: 'usr-001',
        username: 'admin.namdu',
        fullName: 'Nguyễn Văn Hải (SuperAdmin)',
        email: 'admin@thenamduhill.vn',
        role: 'superadmin',
        roleLabel: 'Super Admin',
        phone: '0912 345 678',
        status: 'active',
        statusLabel: 'Hoạt động',
        lastActive: 'Hôm nay 15:30',
    },
    {
        id: 'usr-002',
        username: 'owner.namdu',
        fullName: 'Trần Thị Mai (Chủ đầu tư)',
        email: 'owner@thenamduhill.vn',
        role: 'owner',
        roleLabel: 'Chủ cơ sở (Owner)',
        phone: '0988 765 432',
        status: 'active',
        statusLabel: 'Hoạt động',
        lastActive: 'Hôm qua 18:20',
    },
    {
        id: 'usr-003',
        username: 'reception.tuan',
        fullName: 'Lê Văn Tuấn (Lễ tân ca sáng)',
        email: 'letan.tuan@thenamduhill.vn',
        role: 'receptionist',
        roleLabel: 'Lễ tân (Receptionist)',
        phone: '0903 112 233',
        status: 'active',
        statusLabel: 'Hoạt động',
        lastActive: 'Hôm nay 08:00',
    },
    {
        id: 'usr-004',
        username: 'housekeeping.huong',
        fullName: 'Phạm Thu Hương (Tổ trưởng Buồng)',
        email: 'buongphong.huong@thenamduhill.vn',
        role: 'housekeeping',
        roleLabel: 'Buồng phòng (Housekeeping)',
        phone: '0934 556 677',
        status: 'active',
        statusLabel: 'Hoạt động',
        lastActive: '05/08/2026',
    },
]

export default function AccountsSettingsPage() {
    return (
        // Quản trị tài khoản: chỉ `owner` (`account.manage`). Ẩn menu không phải
        // phân quyền — gõ thẳng URL cũng phải bị chặn (`100-05` AC-6).
        <RequirePermission anyOf={['account.manage']}>
            <AccountsSettingsScreen />
        </RequirePermission>
    )
}

function AccountsSettingsScreen() {
    const { locale } = useLocale()
    const [accounts, setAccounts] = useState<AccountRowItem[]>(RESORT_ACCOUNTS)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    // Modal Create State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState<AccountRowItem['role']>('receptionist')

    const columns: Column<AccountRowItem>[] = [
        {
            key: 'username',
            header: tr(S.colUsername, locale),
            width: '220px',
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-bold text-xs text-slate-900">{row.username}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{row.email}</div>
                </div>
            ),
        },
        {
            key: 'fullName',
            header: tr(S.colFullName, locale),
            cell: (row) => (
                <div>
                    <div className="font-semibold text-xs text-slate-900">{row.fullName}</div>
                    <div className="text-[10px] text-slate-400">{tr(S.phoneShort, locale)}: {row.phone}</div>
                </div>
            ),
        },
        {
            key: 'role',
            header: tr(S.colRole, locale),
            width: '200px',
            cell: (row) => {
                const toneMap: Record<string, string> = {
                    superadmin: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
                    owner: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
                    manager: 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
                    receptionist: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
                    housekeeping: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
                }
                const dotMap: Record<string, string> = {
                    superadmin: 'bg-rose-500',
                    owner: 'bg-amber-500',
                    manager: 'bg-purple-500',
                    receptionist: 'bg-blue-500',
                    housekeeping: 'bg-emerald-500',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs border rounded-[4px] w-[180px] text-left shrink-0 ${toneMap[row.role] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[row.role]}`} />
                        <span className="truncate">{row.roleLabel}</span>
                    </span>
                )
            },
        },
        {
            key: 'lastActive',
            header: tr(S.colLastActive, locale),
            width: '140px',
            cell: (row) => <span className="text-xs text-slate-600 font-mono">{row.lastActive}</span>,
        },
        {
            key: 'status',
            header: tr(S.colStatus, locale),
            width: '130px',
            cell: (row) => {
                const statusStyles: Record<string, string> = {
                    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    suspended: 'bg-rose-50 text-rose-700 border-rose-200',
                    invited: 'bg-amber-50 text-amber-700 border-amber-200',
                }
                const dotStyles: Record<string, string> = {
                    active: 'bg-emerald-500',
                    suspended: 'bg-rose-500',
                    invited: 'bg-amber-500',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2 py-0.5 text-xs font-semibold border rounded-[4px] w-[100px] text-left shrink-0 ${statusStyles[row.status] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[row.status] || 'bg-slate-400'}`} />
                        <span className="truncate">{row.statusLabel}</span>
                    </span>
                )
            },
        },
        {
            key: 'action',
            header: tr(S.colActions, locale),
            align: 'right',
            width: '90px',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1 text-slate-500">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Xác nhận xóa tài khoản này?')) {
                                setAccounts((prev) => prev.filter((a) => a.id !== row.id))
                            }
                        }}
                        className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                        title="Xóa tài khoản"
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    const filteredData = accounts.filter((item) => {
        if (search) {
            const q = search.toLowerCase()
            const matchUser = item.username.toLowerCase().includes(q)
            const matchName = item.fullName.toLowerCase().includes(q)
            const matchEmail = item.email.toLowerCase().includes(q)
            if (!matchUser && !matchName && !matchEmail) return false
        }
        if (roleFilter !== 'all' && item.role !== roleFilter) return false
        if (statusFilter !== 'all' && item.status !== statusFilter) return false
        return true
    })

    const { tableProps } = useDataTable<AccountRowItem>({
        data: filteredData,
        columns,
        rowKey: (row) => row.id,
        selectable: true,
        pageSize: 10,
    })

    const handleReset = () => {
        setSearch('')
        setRoleFilter('all')
        setStatusFilter('all')
    }

    const handleCreateAccount = () => {
        if (!username.trim() || !fullName.trim()) return
        const roleLabels: Record<AccountRowItem['role'], string> = {
            superadmin: 'Super Admin',
            owner: 'Chủ cơ sở (Owner)',
            manager: 'Quản lý (Manager)',
            receptionist: 'Lễ tân (Receptionist)',
            housekeeping: 'Buồng phòng (Housekeeping)',
        }
        const newAcc: AccountRowItem = {
            id: `usr-00${accounts.length + 1}`,
            username,
            fullName,
            email: email || `${username}@thenamduhill.vn`,
            phone: phone || '0900 000 000',
            role,
            roleLabel: roleLabels[role],
            status: 'active',
            statusLabel: 'Hoạt động',
            lastActive: 'Mới tạo',
        }
        setAccounts([newAcc, ...accounts])
        setIsModalOpen(false)
        setUsername('')
        setFullName('')
        setEmail('')
        setPhone('')
    }

    const stats = {
        total: filteredData.length,
        active: filteredData.filter((i) => i.status === 'active').length,
        superadmin: filteredData.filter((i) => i.role === 'superadmin' || i.role === 'owner').length,
        reception: filteredData.filter((i) => i.role === 'receptionist').length,
    }

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 overflow-hidden">
            {/* Top Bar: Title + All Filters & Actions in Header (Today Format) */}
            <div className="w-full bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Left: Title & Count */}
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        {tr(S.accountsTitle, locale)}
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {stats.total} {tr(S.accountsCount, locale)}
                    </span>
                </div>

                {/* Right: All Filters & Actions in Header */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* Search Field */}
                    <div className="relative w-44 sm:w-56">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={tr(S.searchAccount, locale)}
                            aria-label={tr(S.searchAccount, locale)}
                            className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                        <div className="absolute left-2 top-1.5 text-slate-400">
                            <SearchIcon size={13} />
                        </div>
                    </div>

                    {/* Role Select */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">{tr(S.allRoles, locale)}</option>
                        <option value="superadmin">Super Admin / Owner</option>
                        <option value="receptionist">Lễ tân</option>
                        <option value="housekeeping">Buồng phòng</option>
                    </select>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">{tr(S.allStatuses, locale)}</option>
                        <option value="active">{tr(S.accountActive, locale)}</option>
                        <option value="suspended">{tr(S.accountSuspended, locale)}</option>
                    </select>

                    {/* Reset Button */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-2 py-1 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                    >
                        {tr(S.reset, locale)}
                    </button>

                    {/* Primary Action Button */}
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-md transition-all shadow-sm active:scale-[0.98] shrink-0 min-h-[32px]"
                    >
                        <PlusIcon size={14} />
                        <span>{tr(S.addAccount, locale)}</span>
                    </button>
                </div>
            </div>

            {/* KPI Statistics Summary Cards (Today Format) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
                {/* Total Stats */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        TỔNG SỐ TÀI KHOẢN
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.total} tài khoản</span>
                        <span className="text-[11px] font-semibold text-amber-700">RBAC System</span>
                    </div>
                </div>

                {/* Active Stats */}
                <div className="bg-white p-2 rounded-sm border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            ĐANG HOẠT ĐỘNG
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.active} tài khoản</span>
                        <span className="text-[11px] font-semibold text-emerald-700">100% Sẵn sàng</span>
                    </div>
                </div>

                {/* SuperAdmin Stats */}
                <div className="bg-white p-2 rounded-sm border border-rose-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                            QUẢN TRỊ VIÊN
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.superadmin} admin</span>
                        <span className="text-[11px] font-semibold text-rose-700">Full Access</span>
                    </div>
                </div>

                {/* Receptionist Stats */}
                <div className="bg-white p-2 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            LỄ TÂN & VẬN HÀNH
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.reception} tài khoản</span>
                        <span className="text-[11px] font-semibold text-blue-700">Ca trực hàng ngày</span>
                    </div>
                </div>
            </div>

            {/* Table Container (Today Format) */}
            <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <DataTable<AccountRowItem>
                    {...tableProps}
                    caption={tr(S.accountsTitle, locale)}
                    pagination={{
                        ...tableProps.pagination,
                        prevLabel: tr(S.paginationPrev, locale),
                        nextLabel: tr(S.paginationNext, locale),
                        pageSizeLabel: tr(S.paginationPageSize, locale),
                        summaryText: (a, b, c) =>
                            `${tr(S.paginationSummary, locale)} ${a}–${b} / ${c} ${tr(S.accountsCount, locale)}`,
                    }}
                    empty={tr(S.emptyAccounts, locale)}
                />
            </div>

            {/* Modal Create Account */}
            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Cấp Tài Khoản & Phân Quyền Mới"
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateAccount}
                                className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded"
                            >
                                Tạo Tài Khoản
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Tên đăng nhập (Username)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ví dụ: letan.namdu"
                                required
                            />
                            <SelectField
                                label="Vai trò hệ thống (RBAC Role)"
                                value={role}
                                onChange={(e) => setRole(e.target.value as AccountRowItem['role'])}
                            >
                                <option value="receptionist">Lễ tân (Receptionist)</option>
                                <option value="housekeeping">Buồng phòng (Housekeeping)</option>
                                <option value="manager">Quản lý (Manager)</option>
                                <option value="owner">Chủ cơ sở (Owner)</option>
                                <option value="superadmin">Super Admin</option>
                            </SelectField>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Họ và Tên người dùng"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Ví dụ: Nguyễn Văn Hải"
                                required
                            />
                            <Field
                                label="Số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ví dụ: 0912 345 678"
                            />
                        </div>

                        <Field
                            label="Địa chỉ Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ví dụ: user@thenamduhill.vn"
                        />
                    </div>
                </Modal>
            )}
        </div>
    )
}
