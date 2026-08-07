'use client'

/**
 * Tài khoản & Phân quyền RBAC — màn 4/7 nhóm Hệ thống.
 *
 * Áp design system `@repo/cms-ui` — cùng bố cục 2 hàng + MetricStrip +
 * DataGrid như `/admin/customers`. Nền TRẮNG, phân tách bằng đường kẻ 1px,
 * không còn card lồng card/shadow trang trí của bản cũ.
 *
 * GIỮ NGUYÊN toàn bộ logic: `useAccountsData()` gọi REST thật
 * (`/api/admin/accounts`), `RequirePermission anyOf={['account.manage']}`
 * chặn cả menu lẫn gõ thẳng URL (100-05 AC-6). Modal tạo tài khoản vẫn chỉ
 * cập nhật state cục bộ vì backend chưa có POST — không tự thêm hành vi mới.
 *
 * Vai trò/trạng thái là 2 hệ tone riêng (không dùng chung một bảng): vai trò
 * cần 5 tone phân biệt rõ rệt vì đây là màn PHÂN QUYỀN — nhầm superadmin với
 * lễ tân bằng mắt là rủi ro bảo mật, không chỉ lỗi trình bày.
 */

import { useMemo, useState } from 'react'
import { PlusIcon, SearchIcon, TrashIcon } from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAccountsData } from '@/hooks/useAdminData'
import { S, tr } from '@/strings'
import { DataGrid, DotBadge, FilterBar, KpiCard, MetricStrip, PageHeaderBar, type CmsTone } from '@repo/cms-ui'
import { Field, Modal, SelectField, type Column } from '@repo/ui'

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

/** Vai trò → tone `@repo/cms-ui`. Khai TƯỜNG MINH từng key (không nội suy
 *  chuỗi) — Tailwind quét class bằng regex tĩnh, ghép động không sinh ra. */
const ROLE_TONE: Record<AccountRowItem['role'], CmsTone> = {
    superadmin: 'rose',
    owner: 'amber',
    manager: 'violet',
    receptionist: 'blue',
    housekeeping: 'emerald',
}

const STATUS_TONE: Record<AccountRowItem['status'], CmsTone> = {
    active: 'emerald',
    suspended: 'rose',
    invited: 'amber',
}

/** Nhãn vai trò song ngữ — khoá `{vi,en}` trong `strings.ts` (luật C7/R6),
 *  không phải chuỗi tiếng Việt cứng như bản cũ. */
const ROLE_LABEL_KEY: Record<AccountRowItem['role'], typeof S.roleOwner> = {
    superadmin: S.roleSuperadmin,
    owner: S.roleOwner,
    manager: S.roleManager,
    receptionist: S.roleReceptionist,
    housekeeping: S.roleHousekeeping,
}

export default function AccountsSettingsPage() {
    return (
        // Quản trị tài khoản: chỉ `owner` (`account.manage`). Ẩn menu không
        // phải phân quyền — gõ thẳng URL cũng phải bị chặn (100-05 AC-6).
        <RequirePermission anyOf={['account.manage']}>
            <AccountsSettingsScreen />
        </RequirePermission>
    )
}

function AccountsSettingsScreen() {
    const { locale } = useLocale()
    const { accounts, setAccounts, loading, error } = useAccountsData()
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    // Modal tạo tài khoản — chỉ cập nhật state cục bộ, backend chưa có POST
    // (đúng hành vi bản cũ, không tự thêm gọi API mới).
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState<AccountRowItem['role']>('receptionist')

    const rows: AccountRowItem[] = accounts

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return rows.filter((item) => {
            if (needle) {
                const matchUser = item.username.toLowerCase().includes(needle)
                const matchName = item.fullName.toLowerCase().includes(needle)
                const matchEmail = item.email.toLowerCase().includes(needle)
                if (!matchUser && !matchName && !matchEmail) return false
            }
            if (roleFilter !== 'all' && item.role !== roleFilter) return false
            if (statusFilter !== 'all' && item.status !== statusFilter) return false
            return true
        })
    }, [rows, search, roleFilter, statusFilter])

    const columns: Column<AccountRowItem>[] = [
        {
            key: 'username',
            header: tr(S.colUsername, locale),
            cell: (row) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={row.username}
                    >
                        {row.username}
                    </div>
                    <div
                        className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] font-mono"
                        title={row.email}
                    >
                        {row.email}
                    </div>
                </div>
            ),
        },
        {
            key: 'fullName',
            header: tr(S.colFullName, locale),
            cell: (row) => (
                <div className="min-w-0">
                    <div
                        className="truncate text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={row.fullName}
                    >
                        {row.fullName}
                    </div>
                    <div className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {tr(S.phoneShort, locale)}: {row.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            header: tr(S.colRole, locale),
            width: '190px',
            cell: (row) => <DotBadge tone={ROLE_TONE[row.role]} label={row.roleLabel} width={172} />,
        },
        {
            key: 'lastActive',
            header: tr(S.colLastActive, locale),
            width: '130px',
            cell: (row) => (
                <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] font-mono">
                    {row.lastActive}
                </span>
            ),
        },
        {
            key: 'status',
            header: tr(S.colStatus, locale),
            width: '120px',
            cell: (row) => <DotBadge tone={STATUS_TONE[row.status]} label={row.statusLabel} width={100} />,
        },
        {
            key: 'action',
            header: tr(S.colActions, locale),
            align: 'right',
            width: '80px',
            cell: (row) => (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm(tr(S.deleteAccountConfirm, locale))) {
                                setAccounts((prev: AccountRowItem[]) => prev.filter((a) => a.id !== row.id))
                            }
                        }}
                        className="p-1 text-[var(--cms-text-muted)] hover:text-[var(--cms-tone-rose)] rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        aria-label={`${tr(S.deleteAccountAria, locale)} ${row.username}`}
                    >
                        <TrashIcon size={15} />
                    </button>
                </div>
            ),
        },
    ]

    const handleReset = () => {
        setSearch('')
        setRoleFilter('all')
        setStatusFilter('all')
    }

    const handleCreateAccount = () => {
        if (!username.trim() || !fullName.trim()) return
        const newAcc: AccountRowItem = {
            id: `usr-local-${Date.now()}`,
            username,
            fullName,
            email: email || `${username}@thenamduhill.vn`,
            phone: phone || '0900 000 000',
            role,
            roleLabel: tr(ROLE_LABEL_KEY[role], locale),
            status: 'active',
            statusLabel: tr(S.accountActive, locale),
            lastActive: tr(S.accountJustCreated, locale),
        }
        setAccounts((prev: AccountRowItem[]) => [newAcc, ...prev])
        setIsModalOpen(false)
        setUsername('')
        setFullName('')
        setEmail('')
        setPhone('')
    }

    const stats = useMemo(
        () => ({
            total: rows.length,
            active: rows.filter((i) => i.status === 'active').length,
            admin: rows.filter((i) => i.role === 'superadmin' || i.role === 'owner').length,
            reception: rows.filter((i) => i.role === 'receptionist').length,
        }),
        [rows],
    )

    const roleGroups = [
        {
            legend: tr(S.colRole, locale),
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
                { value: 'all', label: tr(S.allRoles, locale) },
                { value: 'superadmin', label: tr(S.roleSuperadminOwnerFilter, locale) },
                { value: 'receptionist', label: tr(ROLE_LABEL_KEY.receptionist, locale) },
                { value: 'housekeeping', label: tr(ROLE_LABEL_KEY.housekeeping, locale) },
            ],
        },
        {
            legend: tr(S.colStatus, locale),
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { value: 'all', label: tr(S.allStatuses, locale) },
                { value: 'active', label: tr(S.accountActive, locale) },
                { value: 'suspended', label: tr(S.accountSuspended, locale) },
            ],
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: tiêu đề + đếm bên trái, nút Thêm tài khoản bên phải. */}
            <PageHeaderBar
                title={tr(S.accountsTitle, locale)}
                count={{ value: stats.total, suffix: tr(S.accountsCount, locale) }}
                actions={
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <PlusIcon size={14} />
                        <span>{tr(S.addAccount, locale)}</span>
                    </button>
                }
            />

            {/* HÀNG 2: ô tìm kiếm tự do + FilterBar (vai trò, trạng thái) +
                kết quả + Đặt lại — border-t 1px phân tách khỏi hàng 1. */}
            <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="relative w-44 sm:w-56">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={tr(S.searchAccount, locale)}
                        aria-label={tr(S.searchAccount, locale)}
                        className="w-full pl-7 pr-2 py-1 text-[length:var(--cms-text-body)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        style={{ minHeight: 28 }}
                    />
                    <div className="absolute left-2 top-1.5 text-[var(--cms-text-muted)]">
                        <SearchIcon size={13} />
                    </div>
                </div>

                <FilterBar
                    groups={roleGroups}
                    resultText={`${filteredData.length} ${tr(S.accountsCount, locale)}`}
                    onReset={handleReset}
                />
            </div>

            {/* MetricStrip — 4 KPI liền mạch thay 4 card rời (P11 Calm). */}
            <div className="border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2">
                <MetricStrip>
                    <KpiCard label={tr(S.accountsKpiTotal, locale)} value={`${stats.total}`} tone="slate" />
                    <KpiCard
                        label={tr(S.accountsKpiActive, locale)}
                        value={`${stats.active}`}
                        note={stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%'}
                        tone="emerald"
                    />
                    <KpiCard
                        label={tr(S.accountsKpiAdmin, locale)}
                        value={`${stats.admin}`}
                        note={tr(S.accountsFullAccessNote, locale)}
                        tone="rose"
                    />
                    <KpiCard
                        label={tr(S.accountsKpiReception, locale)}
                        value={`${stats.reception}`}
                        note={tr(S.accountsDailyShiftNote, locale)}
                        tone="blue"
                    />
                </MetricStrip>
            </div>

            {/* Vùng nội dung: DataGrid chiếm hết chỗ còn lại. */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-[var(--cms-border)]">
                {error && (
                    <div className="px-[var(--cms-pad)] pt-3">
                        <div
                            role="alert"
                            aria-live="polite"
                            className="rounded-[var(--cms-radius)] border px-3 py-2 text-[length:var(--cms-text-body)] leading-snug border-[var(--cms-tone-rose-dot)] bg-[var(--cms-tone-rose-bg)] text-[var(--cms-tone-rose)]"
                        >
                            {tr(S.loadAccountsFailed, locale)}
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col min-h-0">
                    <DataGrid<AccountRowItem>
                        caption={tr(S.accountsTitle, locale)}
                        columns={columns}
                        rows={filteredData}
                        rowKey={(row) => row.id}
                        loading={loading}
                        loadingText={tr(S.loadingAccounts, locale)}
                        empty={
                            <div className="h-full flex items-center justify-center text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                                {tr(rows.length === 0 ? S.emptyAccountsAll : S.emptyAccounts, locale)}
                            </div>
                        }
                    />
                </div>
            </div>

            {/* Modal tạo tài khoản — giữ `Modal`/`Field`/`SelectField` của
                `@repo/ui`, chỉ đổi nhãn/placeholder sang song ngữ qua `tr()`. */}
            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={tr(S.createAccountModalTitle, locale)}
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 py-1.5 text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                            >
                                {tr(S.cancel, locale)}
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateAccount}
                                className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold text-white bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                            >
                                {tr(S.createAccountCta, locale)}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3 text-[length:var(--cms-text-body)]">
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label={tr(S.fieldUsername, locale)}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={tr(S.fieldUsernamePlaceholder, locale)}
                                required
                            />
                            <SelectField
                                label={tr(S.fieldRbacRole, locale)}
                                value={role}
                                onChange={(e) => setRole(e.target.value as AccountRowItem['role'])}
                            >
                                <option value="receptionist">{tr(ROLE_LABEL_KEY.receptionist, locale)}</option>
                                <option value="housekeeping">{tr(ROLE_LABEL_KEY.housekeeping, locale)}</option>
                                <option value="manager">{tr(ROLE_LABEL_KEY.manager, locale)}</option>
                                <option value="owner">{tr(ROLE_LABEL_KEY.owner, locale)}</option>
                                <option value="superadmin">{tr(ROLE_LABEL_KEY.superadmin, locale)}</option>
                            </SelectField>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label={tr(S.fieldFullName, locale)}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder={tr(S.fieldFullNamePlaceholder, locale)}
                                required
                            />
                            <Field
                                label={tr(S.fieldPhone, locale)}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder={tr(S.fieldPhonePlaceholder, locale)}
                            />
                        </div>

                        <Field
                            label={tr(S.email, locale)}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={tr(S.fieldEmailPlaceholder, locale)}
                        />
                    </div>
                </Modal>
            )}
        </div>
    )
}
