'use client'

/**
 * Ticket sự cố & bảo trì (ticket `100-05` màn 2), màn 6/7 nhóm Hệ thống.
 *
 * Dữ liệu ở `ticket.store` (persist) — F5 còn nguyên (AC-4).
 * Trạng thái đi MỘT CHIỀU theo `canTransitionTicket()`, không nhảy tự do (AC-5).
 *
 * Áp design system `@repo/cms-ui` — cùng bố cục 2 hàng + MetricStrip +
 * DataGrid như `/admin` (dashboard) và `/admin/customers` (màn danh sách gần
 * nhất). Nền TRẮNG, phân tách bằng đường kẻ 1px, không còn `bg-slate-100`/card
 * lồng card/shadow trang trí của bản cũ.
 *
 * Đặc thù riêng của màn này so với `customers.tsx`:
 * 1. Có 2 bộ lọc rời (ưu tiên + trạng thái) — cả hai đưa vào CÙNG MỘT
 *    `FilterBar`, mỗi bộ một `fieldset` riêng (đúng cách `FilterBar` đã hỗ
 *    trợ nhiều `groups`), không viết 2 `<select>` tự do như bản cũ.
 * 2. Trạng thái đơn không phải badge tĩnh — vẫn là `<select>` để lễ tân
 *    chuyển bước ngay trong bảng. Giữ hành vi cũ, chỉ đổi token màu.
 * 3. Modal tạo ticket giữ nguyên `Modal`/`Field`/`SelectField`/`TextAreaField`
 *    của `@repo/ui` — các field này đọc token qua `[data-cms]` nên tự đổi
 *    diện mạo, không cần viết lại.
 */

import { MenuIcon, PlusIcon, TicketIcon, TrashIcon } from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import { useMetricsCollapsed } from '@/hooks/useMetricsCollapsed'
import {
    nextTicketStatuses,
    useTicketStore,
    type MaintenanceTicket,
    type TicketPriority,
    type TicketStatus,
} from '@/stores/ticket.store'
import { S, tr } from '@/strings'

/** Khoá `localStorage` riêng cho màn ticket — mỗi màn CMS nhớ trạng thái
 *  ẩn/hiện của chính mình (xem giải thích trong `useMetricsCollapsed`). */
const METRICS_COLLAPSED_KEY = 'namduhill-cms-tickets-metrics-collapsed'
import type { I18nText } from '@repo/core'
import { formatDate, pick } from '@repo/core'
import {
    DataGrid,
    DotBadge,
    FilterBar,
    InlineAlert,
    KpiCard,
    MetricStrip,
    PageHeaderBar,
    type CmsTone,
} from '@repo/cms-ui'
import { Field, Modal, SelectField, TextAreaField, type Column } from '@repo/ui'
import { useMemo, useState } from 'react'

const PRIORITY_LABEL: Record<TicketPriority, I18nText> = {
    low: S.priorityLow,
    medium: S.priorityMedium,
    high: S.priorityHigh,
    urgent: S.priorityUrgent,
}

// Tone của `@repo/cms-ui` — khai TƯỜNG MINH từng key, không nội suy chuỗi
// (Tailwind quét bằng regex tĩnh, class ghép động lúc chạy không được sinh ra).
const PRIORITY_TONE: Record<TicketPriority, CmsTone> = {
    urgent: 'rose',
    high: 'amber',
    medium: 'blue',
    low: 'slate',
}

const STATUS_LABEL: Record<TicketStatus, I18nText> = {
    pending: S.ticketPending,
    in_progress: S.ticketInProgress,
    resolved: S.ticketResolved,
}

// Class Tailwind cho `<select>` chuyển trạng thái — khai TƯỜNG MINH từng
// tone thay vì nội suy chuỗi `text-[var(--cms-tone-${tone})]`. Tailwind quét
// source bằng regex TĨNH, class ghép động lúc chạy KHÔNG được sinh ra (R14).
const STATUS_SELECT_CLASS: Record<TicketStatus, string> = {
    pending: 'text-[var(--cms-tone-amber)] bg-[var(--cms-tone-amber-bg)] border-[var(--cms-tone-amber-dot)]',
    in_progress: 'text-[var(--cms-tone-blue)] bg-[var(--cms-tone-blue-bg)] border-[var(--cms-tone-blue-dot)]',
    resolved: 'text-[var(--cms-tone-emerald)] bg-[var(--cms-tone-emerald-bg)] border-[var(--cms-tone-emerald-dot)]',
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
    const [metricsCollapsed, toggleMetrics] = useMetricsCollapsed(METRICS_COLLAPSED_KEY)

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
            width: '120px',
            cell: (row) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-mono font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={row.code}
                    >
                        {row.code}
                    </div>
                    <div className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] tabular-nums">
                        {formatDate(new Date(row.createdAt), locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'roomUnit',
            header: tr(S.colRoomUnit, locale),
            width: '160px',
            cell: (row) => (
                <span className="inline-flex items-center gap-1 text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-tone-blue)] bg-[var(--cms-tone-blue-bg)] border border-[var(--cms-tone-blue-dot)] rounded-[var(--cms-radius-sm)] px-2 py-1">
                    <TicketIcon size={12} />
                    {row.roomUnit}
                </span>
            ),
        },
        {
            key: 'title',
            header: tr(S.colIncident, locale),
            cell: (row) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={row.title}
                    >
                        {row.title}
                    </div>
                    <div
                        className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]"
                        title={row.description}
                    >
                        {row.description}
                    </div>
                </div>
            ),
        },
        {
            key: 'priority',
            header: tr(S.colPriority, locale),
            width: '130px',
            cell: (row) => (
                // Badge có CHẤM MÀU + CHỮ, không truyền tin chỉ bằng màu (D4).
                <DotBadge tone={PRIORITY_TONE[row.priority]} label={tr(PRIORITY_LABEL[row.priority], locale)} width={112} />
            ),
        },
        {
            key: 'assignedTo',
            header: tr(S.colAssignee, locale),
            width: '170px',
            cell: (row) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={row.assignedTo}
                    >
                        {row.assignedTo}
                    </div>
                    <div
                        className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]"
                        title={row.reportedBy}
                    >
                        {tr(S.reportedBy, locale)}: {row.reportedBy}
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: tr(S.colTicketStatus, locale),
            width: '180px',
            align: 'right',
            cell: (row) => (
                // Vẫn là `<select>` — lễ tân chuyển bước ngay trong bảng, không
                // phải badge tĩnh. Đổi màu qua token thay vì hex/class cứng.
                <select
                    value={row.status}
                    aria-label={`${tr(S.colTicketStatus, locale)} ${row.code}`}
                    onChange={(e) => {
                        const result = changeStatus(row.id, e.target.value as TicketStatus)
                        if (result === 'invalid-transition') setNotice(S.errInvalidTransition)
                        else if (result) setNotice(S.saveFailed)
                        else setNotice(null)
                    }}
                    className={`w-full text-[length:var(--cms-text-meta)] font-semibold px-2 py-1 rounded-[var(--cms-radius-sm)] border cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${STATUS_SELECT_CLASS[row.status]}`}
                >
                    {nextTicketStatuses(row.status).map((status) => (
                        <option key={status} value={status}>
                            {tr(STATUS_LABEL[status], locale)}
                        </option>
                    ))}
                </select>
            ),
        },
        {
            key: 'action',
            header: tr(S.colActions, locale),
            align: 'right',
            width: '70px',
            cell: (row) => (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        aria-label={`${tr(S.delete, locale)} ${row.code}`}
                        onClick={() => {
                            if (!window.confirm(`${tr(S.deleteTicketConfirm, locale)} ${row.code}`)) return
                            const result = removeTicket(row.id)
                            if (result) setNotice(S.saveFailed)
                        }}
                        className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center text-[var(--cms-text-muted)] hover:text-[var(--cms-tone-rose)] hover:bg-[var(--cms-bg-subtle)] rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

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

    const filterGroups = [
        {
            legend: tr(S.colPriority, locale),
            value: priorityFilter,
            onChange: setPriorityFilter,
            options: [
                { value: 'all', label: tr(S.allPriorities, locale) },
                ...(['urgent', 'high', 'medium', 'low'] as const).map((p) => ({
                    value: p,
                    label: tr(PRIORITY_LABEL[p], locale),
                })),
            ],
        },
        {
            legend: tr(S.colTicketStatus, locale),
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { value: 'all', label: tr(S.allStatuses, locale) },
                ...(['pending', 'in_progress', 'resolved'] as const).map((st) => ({
                    value: st,
                    label: tr(STATUS_LABEL[st], locale),
                })),
            ],
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: title + đếm ở trái · nút "Báo sự cố mới" ở phải. */}
            <PageHeaderBar
                title={tr(S.ticketsTitle, locale)}
                count={{ value: stats.total, suffix: tr(S.ticketsCount, locale) }}
                actions={
                    <>
                        {/* Nút ẩn/hiện MetricStrip — mặc định HIỆN số liệu. */}
                        <button
                            type="button"
                            onClick={toggleMetrics}
                            aria-expanded={!metricsCollapsed}
                            aria-controls="tickets-metric-strip"
                            className="flex items-center gap-1 px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] hover:bg-[var(--cms-bg-subtle)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <MenuIcon size={14} />
                            <span>{tr(metricsCollapsed ? S.showMetrics : S.hideMetrics, locale)}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTitleError(null)
                                setNotice(null)
                                setModalOpen(true)
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <PlusIcon size={14} />
                            {tr(S.newTicket, locale)}
                        </button>
                    </>
                }
            />

            {/* HÀNG 2: ô tìm kiếm tự do + FilterBar (ưu tiên + trạng thái) + kết
                quả + Đặt lại — `FilterBar` không có ô tìm tự do (chỉ nhận pill
                giá trị rời rạc), nên ô tìm là input tự viết, dùng token. */}
            <div className="cms-row-filters border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={tr(S.searchTicket, locale)}
                    aria-label={tr(S.searchTicket, locale)}
                    className="w-44 sm:w-56 px-3 py-1.5 text-[length:var(--cms-text-body)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                />

                <FilterBar
                    groups={filterGroups}
                    resultText={`${filtered.length} ${tr(S.ticketsCount, locale)}`}
                    onReset={isFiltered ? handleReset : undefined}
                />
            </div>

            {notice && (
                <div className="px-[var(--cms-pad)] pt-3">
                    <InlineAlert tone="rose">{tr(notice, locale)}</InlineAlert>
                </div>
            )}

            {/* MetricStrip — 4 KPI liền mạch thay 4 card rời tự vẽ (P11 Calm).
                Ẩn/hiện được qua nút ở hàng 1, mặc định HIỆN. */}
            {!metricsCollapsed && (
            <div
                id="tickets-metric-strip"
                className="border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2"
            >
                <MetricStrip>
                    <KpiCard label={tr(S.totalTickets, locale)} value={`${stats.total}`} tone="slate" />
                    <KpiCard
                        label={tr(S.urgentTickets, locale)}
                        value={`${stats.urgent}`}
                        note={tr(S.needsActionNow, locale)}
                        tone="rose"
                    />
                    <KpiCard
                        label={tr(S.ticketPending, locale)}
                        value={`${stats.pending}`}
                        note={tr(S.awaitingAssignment, locale)}
                        tone="amber"
                    />
                    <KpiCard
                        label={tr(S.ticketInProgress, locale)}
                        value={`${stats.inProgress}`}
                        note={tr(S.inProgressNow, locale)}
                        tone="blue"
                    />
                </MetricStrip>
            </div>
            )}

            {/* Vùng nội dung: DataGrid chiếm hết chỗ còn lại — tối ưu chiều cao
                là ưu tiên số 1 cho màn lễ tân/kỹ thuật dùng hằng ngày. */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-[var(--cms-border)]">
                <DataGrid<MaintenanceTicket>
                    caption={tr(S.ticketsTitle, locale)}
                    columns={columns}
                    rows={filtered}
                    rowKey={(row) => row.id}
                    empty={
                        <div className="h-full flex items-center justify-center text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                            {tr(S.emptyTickets, locale)}
                        </div>
                    }
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
                                className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                            >
                                {tr(S.cancel, locale)}
                            </button>
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={saving}
                                className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold text-white bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 rounded-[var(--cms-radius)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                            >
                                {tr(saving ? S.saving : S.createTicket, locale)}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3 text-[length:var(--cms-text-body)]">
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
