'use client'

/**
 * Ticket sự cố & bảo trì (ticket `100-05` màn 2).
 *
 * Dữ liệu ở `ticket.store` (persist) — F5 còn nguyên (AC-4).
 * Trạng thái đi MỘT CHIỀU theo `canTransitionTicket()`, không nhảy tự do (AC-5).
 */

import {
    AlertTriangleIcon,
    ClockIcon,
    PlusIcon,
    SearchIcon,
    TicketIcon,
    TrashIcon,
    WrenchIcon,
} from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import {
    nextTicketStatuses,
    useTicketStore,
    type MaintenanceTicket,
    type TicketPriority,
    type TicketStatus,
} from '@/stores/ticket.store'
import { S, tr } from '@/strings'
import type { I18nText } from '@repo/core'
import { formatDate, pick } from '@repo/core'
import {
    DataTable,
    Field,
    Modal,
    SelectField,
    TextAreaField,
    useDataTable,
    type Column,
} from '@repo/ui'
import { useMemo, useState } from 'react'

const PRIORITY_LABEL: Record<TicketPriority, I18nText> = {
    low: S.priorityLow,
    medium: S.priorityMedium,
    high: S.priorityHigh,
    urgent: S.priorityUrgent,
}

const STATUS_LABEL: Record<TicketStatus, I18nText> = {
    pending: S.ticketPending,
    in_progress: S.ticketInProgress,
    resolved: S.ticketResolved,
}

const ROOM_UNITS = [
    '101 (Bungalow Hill)',
    '102 (Bungalow Hill)',
    '201 (Deluxe Ocean)',
    '202 (Deluxe Ocean)',
    '305 (Villa Front Sea)',
]

const ASSIGNEES = [
    'Nguyễn Văn Minh (Kỹ thuật)',
    'Trần Văn Hoàng (Bảo trì)',
    'Đội IT Nam Du',
]

export default function MaintenanceTicketsPage() {
    return (
        // Lễ tân KHÔNG vào được màn cấu hình hệ thống (`100-05` AC-6).
        // Ẩn menu không phải phân quyền — gõ URL vẫn phải bị chặn.
        <RequirePermission anyOf={['content.edit', 'account.manage']}>
            <MaintenanceTicketsScreen />
        </RequirePermission>
    )
}

function MaintenanceTicketsScreen() {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    const tickets = useTicketStore((s) => s.tickets)
    const createTicket = useTicketStore((s) => s.createTicket)
    const changeStatus = useTicketStore((s) => s.changeStatus)
    const removeTicket = useTicketStore((s) => s.removeTicket)

    const [search, setSearch] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const [modalOpen, setModalOpen] = useState(false)
    const [roomUnit, setRoomUnit] = useState(ROOM_UNITS[0] ?? '')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TicketPriority>('medium')
    const [assignedTo, setAssignedTo] = useState(ASSIGNEES[0] ?? '')
    const [titleError, setTitleError] = useState<I18nText | null>(null)
    const [notice, setNotice] = useState<I18nText | null>(null)
    const [saving, setSaving] = useState(false)

    const isFiltered = search !== '' || priorityFilter !== 'all' || statusFilter !== 'all'

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        return tickets.filter((item) => {
            if (query) {
                const hit =
                    item.code.toLowerCase().includes(query) ||
                    item.roomUnit.toLowerCase().includes(query) ||
                    item.title.toLowerCase().includes(query)
                if (!hit) return false
            }
            if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false
            if (statusFilter !== 'all' && item.status !== statusFilter) return false
            return true
        })
    }, [tickets, search, priorityFilter, statusFilter])

    const columns: Column<MaintenanceTicket>[] = [
        {
            key: 'code',
            header: tr(S.colTicketCode, locale),
            width: '130px',
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-mono text-xs font-bold text-slate-800">{row.code}</div>
                    <div className="text-[10px] text-slate-400 tabular-nums">
                        {formatDate(new Date(row.createdAt), locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'roomUnit',
            header: tr(S.colRoomUnit, locale),
            width: '170px',
            cell: (row) => (
                <span className="inline-flex items-center gap-1 font-semibold text-xs text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    <TicketIcon size={12} />
                    {row.roomUnit}
                </span>
            ),
        },
        {
            key: 'title',
            header: tr(S.colIncident, locale),
            cell: (row) => (
                <div>
                    <div className="font-bold text-xs text-slate-900">{row.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{row.description}</div>
                </div>
            ),
        },
        {
            key: 'priority',
            header: tr(S.colPriority, locale),
            width: '140px',
            cell: (row) => {
                const toneMap: Record<TicketPriority, string> = {
                    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
                    high: 'bg-amber-50 text-amber-700 border-amber-200',
                    medium: 'bg-blue-50 text-blue-700 border-blue-200',
                    low: 'bg-slate-100 text-slate-700 border-slate-200',
                }
                const dotMap: Record<TicketPriority, string> = {
                    urgent: 'bg-rose-500',
                    high: 'bg-amber-500',
                    medium: 'bg-blue-500',
                    low: 'bg-slate-400',
                }
                return (
                    // Badge có CHẤM MÀU + CHỮ, không truyền tin chỉ bằng màu (luật D4).
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[120px] ${toneMap[row.priority]}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[row.priority]}`} />
                        <span className="truncate">{tr(PRIORITY_LABEL[row.priority], locale)}</span>
                    </span>
                )
            },
        },
        {
            key: 'assignedTo',
            header: tr(S.colAssignee, locale),
            width: '180px',
            cell: (row) => (
                <div className="text-xs text-slate-700">
                    <div className="font-semibold text-slate-900">{row.assignedTo}</div>
                    <div className="text-[10px] text-slate-400">
                        {tr(S.reportedBy, locale)}: {row.reportedBy}
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: tr(S.colTicketStatus, locale),
            width: '170px',
            align: 'right',
            cell: (row) => {
                const statusStyles: Record<TicketStatus, string> = {
                    pending: 'bg-amber-50 text-amber-800 border-amber-300',
                    in_progress: 'bg-blue-50 text-blue-800 border-blue-300',
                    resolved: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                }
                return (
                    <select
                        value={row.status}
                        aria-label={`${tr(S.colTicketStatus, locale)} ${row.code}`}
                        onChange={(e) => {
                            const result = changeStatus(row.id, e.target.value as TicketStatus)
                            if (result === 'invalid-transition') setNotice(S.errInvalidTransition)
                            else if (result) setNotice(S.saveFailed)
                            else setNotice(null)
                        }}
                        // KHÔNG `focus:outline-none` trần — luôn phải có viền focus
                        // nhìn thấy được (luật FE1/D3).
                        className={`text-xs font-bold px-2.5 py-1 rounded border cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${statusStyles[row.status]}`}
                    >
                        {nextTicketStatuses(row.status).map((status) => (
                            <option key={status} value={status}>
                                {tr(STATUS_LABEL[status], locale)}
                            </option>
                        ))}
                    </select>
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
                        aria-label={`${tr(S.delete, locale)} ${row.code}`}
                        onClick={() => {
                            if (!window.confirm(`${tr(S.deleteTicketConfirm, locale)} ${row.code}`)) return
                            const result = removeTicket(row.id)
                            if (result) setNotice(S.saveFailed)
                        }}
                        className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center hover:text-rose-600 hover:bg-slate-100 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    const { tableProps } = useDataTable<MaintenanceTicket>({
        data: filtered,
        columns,
        rowKey: (row) => row.id,
        selectable: true,
        pageSize: 10,
    })

    function handleReset() {
        setSearch('')
        setPriorityFilter('all')
        setStatusFilter('all')
    }

    function handleCreate() {
        setNotice(null)

        // Nuốt lỗi im lặng là vi phạm C3 + FE1 `error`: người dùng bấm nút mà
        // không có gì xảy ra thì không biết mình sai ở đâu (AC-4).
        if (!title.trim()) {
            setTitleError(S.ticketTitleRequired)
            document.getElementById('ticket-field-title')?.focus()
            return
        }
        setTitleError(null)
        setSaving(true)

        const result = createTicket({
            roomUnit,
            category: 'appliance',
            title,
            description,
            priority,
            assignedTo,
            reportedBy: user ? `${user.fullName || user.id}` : 'System',
        })

        setSaving(false)
        if (result) {
            setNotice(S.saveFailed)
            return
        }

        setModalOpen(false)
        setTitle('')
        setDescription('')
    }

    const stats = {
        total: filtered.length,
        pending: filtered.filter((i) => i.status === 'pending').length,
        inProgress: filtered.filter((i) => i.status === 'in_progress').length,
        urgent: filtered.filter((i) => i.priority === 'urgent' || i.priority === 'high').length,
    }

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 overflow-hidden">
            {/* Thanh trên: tiêu đề + đếm + tìm kiếm + bộ lọc + Đặt lại (§F6) */}
            <div className="w-full bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        {tr(S.ticketsTitle, locale)}
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 tabular-nums">
                        {stats.total} {tr(S.ticketsCount, locale)}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <div className="relative w-44 sm:w-56">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={tr(S.searchTicket, locale)}
                            aria-label={tr(S.searchTicket, locale)}
                            className="w-full pl-7 pr-2 py-1 min-h-[32px] text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600"
                        />
                        <div className="absolute left-2 top-2 text-slate-400 pointer-events-none">
                            <SearchIcon size={13} />
                        </div>
                    </div>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        aria-label={tr(S.colPriority, locale)}
                        className="px-2 py-1 min-h-[32px] text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600"
                    >
                        <option value="all">{tr(S.allPriorities, locale)}</option>
                        {(['urgent', 'high', 'medium', 'low'] as const).map((p) => (
                            <option key={p} value={p}>
                                {tr(PRIORITY_LABEL[p], locale)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label={tr(S.colTicketStatus, locale)}
                        className="px-2 py-1 min-h-[32px] text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600"
                    >
                        <option value="all">{tr(S.allStatuses, locale)}</option>
                        {(['pending', 'in_progress', 'resolved'] as const).map((s) => (
                            <option key={s} value={s}>
                                {tr(STATUS_LABEL[s], locale)}
                            </option>
                        ))}
                    </select>

                    {/* "Đặt lại" luôn có mặt (§F6), `disabled` khi chưa lọc gì. */}
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={!isFiltered}
                        className="px-2 py-1 min-h-[32px] text-xs font-medium rounded transition-colors text-amber-700 hover:text-amber-900 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                        {tr(S.reset, locale)}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setTitleError(null)
                            setNotice(null)
                            setModalOpen(true)
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 min-h-[32px] bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-md transition-colors shadow-sm active:scale-[0.98] shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                    >
                        <PlusIcon size={14} />
                        <span>{tr(S.newTicket, locale)}</span>
                    </button>
                </div>
            </div>

            {notice && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="shrink-0 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-medium"
                >
                    {tr(notice, locale)}
                </div>
            )}

            {/* KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
                <TicketKpi
                    label={tr(S.totalTickets, locale)}
                    value={`${stats.total} ${tr(S.ticketsCount, locale)}`}
                    icon={<TicketIcon size={14} />}
                    border="border-amber-200"
                />
                <TicketKpi
                    label={tr(S.urgentTickets, locale)}
                    value={`${stats.urgent} ${tr(S.ticketsCount, locale)}`}
                    note={tr(S.needsActionNow, locale)}
                    icon={<AlertTriangleIcon size={14} />}
                    border="border-rose-200"
                    tone="text-rose-700"
                />
                <TicketKpi
                    label={tr(S.ticketPending, locale)}
                    value={`${stats.pending} ${tr(S.ticketsCount, locale)}`}
                    note={tr(S.awaitingAssignment, locale)}
                    icon={<ClockIcon size={14} />}
                    border="border-amber-200"
                    tone="text-amber-700"
                />
                <TicketKpi
                    label={tr(S.ticketInProgress, locale)}
                    value={`${stats.inProgress} ${tr(S.ticketsCount, locale)}`}
                    note={tr(S.inProgressNow, locale)}
                    icon={<WrenchIcon size={14} />}
                    border="border-blue-200"
                    tone="text-blue-700"
                />
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <DataTable<MaintenanceTicket>
                    {...tableProps}
                    caption={tr(S.ticketsTitle, locale)}
                    pagination={{
                        ...tableProps.pagination,
                        prevLabel: tr(S.paginationPrev, locale),
                        nextLabel: tr(S.paginationNext, locale),
                        pageSizeLabel: tr(S.paginationPageSize, locale),
                        summaryText: (a, b, c) =>
                            `${tr(S.paginationSummary, locale)} ${a}–${b} / ${c} ${tr(S.ticketsCount, locale)}`,
                    }}
                    empty={tr(S.emptyTickets, locale)}
                />
            </div>

            {modalOpen && (
                <Modal
                    open
                    onClose={() => setModalOpen(false)}
                    title={tr(S.newTicket, locale)}
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-3 py-1.5 min-h-[32px] text-xs text-slate-600 hover:bg-slate-100 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                            >
                                {tr(S.cancel, locale)}
                            </button>
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={saving}
                                className="px-3 py-1.5 min-h-[32px] text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                            >
                                {tr(saving ? S.saving : S.createTicket, locale)}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <SelectField
                                label={tr(S.ticketRoomLabel, locale)}
                                value={roomUnit}
                                onChange={(e) => setRoomUnit(e.target.value)}
                            >
                                {ROOM_UNITS.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label={tr(S.colPriority, locale)}
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                            >
                                {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                                    <option key={p} value={p}>
                                        {tr(PRIORITY_LABEL[p], locale)}
                                    </option>
                                ))}
                            </SelectField>
                        </div>

                        <Field
                            fieldId="ticket-field-title"
                            label={tr(S.ticketTitleLabel, locale)}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                if (titleError) setTitleError(null)
                            }}
                            placeholder={pick(
                                {
                                    vi: 'Máy lạnh hỏng, rò rỉ nước…',
                                    en: 'Air conditioner broken, water leak…',
                                },
                                locale,
                            )}
                            required
                            error={titleError ? tr(titleError, locale) : undefined}
                        />

                        <TextAreaField
                            label={tr(S.ticketDescLabel, locale)}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={pick(
                                {
                                    vi: 'Ghi rõ vị trí và mức độ hư hỏng…',
                                    en: 'Describe the location and extent of the damage…',
                                },
                                locale,
                            )}
                        />


                        <SelectField
                            label={tr(S.ticketAssigneeLabel, locale)}
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                        >
                            {ASSIGNEES.map((person) => (
                                <option key={person} value={person}>
                                    {person}
                                </option>
                            ))}
                        </SelectField>
                    </div>
                </Modal>
            )}
        </div>
    )
}

function TicketKpi({
    label,
    value,
    note,
    icon,
    border,
    tone = 'text-slate-700',
}: {
    label: string
    value: string
    note?: string
    icon: React.ReactNode
    border: string
    tone?: string
}) {
    return (
        <div className={`bg-white p-2 rounded-sm border shadow-sm flex flex-col justify-between ${border}`}>
            <div className="flex items-center justify-between gap-1">
                <span
                    className={`text-[11px] font-semibold uppercase tracking-wider truncate ${tone}`}
                >
                    {label}
                </span>
                <span className={`shrink-0 ${tone}`}>{icon}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1 gap-2">
                <span className="text-base font-bold text-slate-900 tabular-nums truncate">{value}</span>
                {note && <span className={`text-[11px] font-semibold truncate ${tone}`}>{note}</span>}
            </div>
        </div>
    )
}
