'use client'

/**
 * Dashboard `/admin` — màn đầu tiên lễ tân thấy khi mở CMS mỗi ca.
 *
 * Dùng bộ `@repo/cms-ui`: `PageHeaderBar` → `FilterBar` → `MetricStrip` →
 * lưới 2 cột (`DataGrid` 2/3 · dòng sự kiện 1/3). Nền TRẮNG, phân tách bằng
 * đường kẻ 1px — không còn `bg-slate-100`/card lồng card của bản cũ.
 *
 * Bốn chỗ bịa số của bản cũ đã bỏ hẳn (xem `task-6-report.md`):
 * 1. `ACTIVITY_FEEDS` hardcode → đọc `ActivityLog` thật từ `booking.store`.
 * 2. "▲ 12% vs tuần trước" → bỏ, chưa có dữ liệu tuần trước để so sánh.
 * 3. "10/15 phòng sạch" → bỏ hẳn ô KPI, chưa có housekeeping store để nối.
 * 4. `units[idx % units.length]` → bỏ cột "mã phòng vật lý": vi phạm B0,
 *    `RoomUnit` chỉ được lễ tân gán lúc check-in, không suy ra từ vị trí mảng.
 */

import { EyeIcon, CalendarIcon } from '@/components/icons'
import { DataGrid, DotBadge, FilterBar, KpiCard, MetricStrip, PageHeaderBar, type CmsTone } from '@repo/cms-ui'
import type { Column } from '@repo/ui'
import { getPropertySync, pick, formatPrice } from '@repo/core'
import type { ActivityLog, Booking, BookingStatus, LogAction } from '@repo/core'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingsData } from '@/hooks/useAdminData'
import { useBookingStore } from '@/stores/booking.store'
import { S, STATUS_LABEL, tr } from '@/strings'

/** Badge trạng thái đơn → tone của `@repo/cms-ui` (D4: chấm màu + chữ). */
const STATUS_TONE_MAP: Record<BookingStatus, CmsTone> = {
    pending_payment: 'amber',
    confirmed: 'blue',
    checked_in: 'emerald',
    checked_out: 'slate',
    cancelled: 'rose',
    no_show: 'rose',
    expired: 'slate',
}

/** Nhãn hành động của `ActivityLog` — chỉ những action thật sự xuất hiện ở
 *  luồng hôm nay (duyệt cọc, check-in, check-out). Các action khác của cùng
 *  đơn (huỷ, ghi chú…) không nằm trong phạm vi "vừa diễn ra" của dashboard. */
const ACTIVITY_TITLE: Partial<Record<LogAction, { vi: string; en: string }>> = {
    'payment-recorded': { vi: 'Duyệt cọc', en: 'Deposit approved' },
    'checked-in': { vi: 'Check-in nhận phòng', en: 'Checked in' },
    'checked-out': { vi: 'Check-out trả phòng', en: 'Checked out' },
    'status-changed': { vi: 'Đổi trạng thái đơn', en: 'Status changed' },
}

interface BookingRow {
    id: string
    code: string
    guestName: string
    phone: string
    roomTypeName: string
    channelLabel: string
    nights: number
    checkInDate: string
    checkOutDate: string
    totalAmount: number
    paidAmount: number
    status: BookingStatus
}

const staffActor = { id: 'admin-1', name: 'Lễ tân ca trực', role: 'manager' as const }

export default function AdminDashboard() {
    const { locale } = useLocale()
    const { bookings: rawBookings, roomUnits } = useBookingsData()
    const logs = useBookingStore((s) => s.logs)
    const changeStatus = useBookingStore((s) => s.changeStatus)
    const property = getPropertySync()

    const [viewMode, setViewMode] = useState<'console' | 'timeline'>('console')
    const [shift, setShift] = useState<'all' | 'morning' | 'afternoon'>('all')
    const [segment, setSegment] = useState<'all' | 'villa' | 'bungalow' | 'deluxe'>('all')
    const [tab, setTab] = useState<'all' | 'pending' | 'arrivals'>('all')

    const roomName = (id: string) => {
        const room = property.rooms.find((r) => r.id === id)
        return room ? pick(room.name, locale) : id
    }

    const bookings: BookingRow[] = useMemo(
        () =>
            rawBookings.map((b: Booking) => ({
                id: b.id,
                code: b.code,
                guestName: b.guest?.fullName || pick({ vi: 'Khách vãng lai', en: 'Walk-in guest' }, locale),
                phone: b.guest?.phone || '—',
                roomTypeName: roomName(b.roomTypeId),
                channelLabel: tr(
                    { web: S.channelWeb, phone: S.channelPhone, 'walk-in': S.channelWalkIn, ota: S.channelOta }[
                        b.channel
                    ],
                    locale,
                ),
                nights: b.nights || 1,
                checkInDate: b.checkIn,
                checkOutDate: b.checkOut,
                totalAmount: b.totalAmount || 0,
                paidAmount: b.paidAmount || 0,
                status: b.status,
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rawBookings, locale],
    )

    const filteredData = bookings.filter((item) => {
        if (tab === 'pending' && item.status !== 'pending_payment') return false
        if (tab === 'arrivals' && item.status !== 'confirmed') return false
        if (segment !== 'all') {
            const matchesSegment = item.roomTypeName.toLowerCase().includes(segment)
            if (!matchesSegment) return false
        }
        return true
    })

    const columns: Column<BookingRow>[] = [
        {
            key: 'guestName',
            header: tr(S.colGuestPhone, locale),
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]">
                        {row.guestName}
                    </div>
                    <div className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] font-mono">
                        {row.code} · {row.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'roomType',
            header: tr(S.colRoomTypeNights, locale),
            cell: (row) => (
                <div>
                    <div className="text-[var(--cms-text)] text-[length:var(--cms-text-body)]">
                        {row.roomTypeName}
                    </div>
                    <div className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {row.nights} {tr(S.nights, locale)} ({row.checkInDate})
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: tr(S.status, locale),
            width: '150px',
            cell: (row) => (
                <DotBadge tone={STATUS_TONE_MAP[row.status]} label={tr(STATUS_LABEL[row.status], locale)} width={120} />
            ),
        },
        {
            key: 'totalAmount',
            header: tr(S.colTotalBalance, locale),
            sortable: true,
            align: 'right',
            width: '170px',
            cell: (row) => {
                const remaining = row.totalAmount - row.paidAmount
                return (
                    <div className="text-right">
                        <div className="font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)] tabular-nums">
                            {formatPrice(row.totalAmount, locale)}
                        </div>
                        <div className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] tabular-nums">
                            {remaining > 0
                                ? `${tr(S.balanceShort, locale)}: ${formatPrice(remaining, locale)}`
                                : tr(S.balanceSettled, locale)}
                        </div>
                    </div>
                )
            },
        },
        {
            key: 'action',
            header: tr(S.colActions, locale),
            align: 'right',
            width: '190px',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    {row.status === 'pending_payment' && (
                        <button
                            type="button"
                            onClick={() => changeStatus(row.id, 'confirmed', staffActor, tr(S.approveDepositNote, locale))}
                            className="px-2.5 py-1 text-[length:var(--cms-text-meta)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {tr(S.approveDeposit, locale)}
                        </button>
                    )}
                    {row.status === 'confirmed' && (
                        <button
                            type="button"
                            onClick={() => changeStatus(row.id, 'checked_in', staffActor, tr(S.checkInNote, locale))}
                            className="px-2.5 py-1 text-[length:var(--cms-text-meta)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {tr(S.checkInCta, locale)}
                        </button>
                    )}
                    {row.status === 'checked_in' && (
                        <button
                            type="button"
                            onClick={() => changeStatus(row.id, 'checked_out', staffActor, tr(S.checkOutNote, locale))}
                            className="px-2.5 py-1 text-[length:var(--cms-text-meta)] font-semibold bg-[var(--cms-text)] hover:opacity-90 text-white rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {tr(S.checkOutCta, locale)}
                        </button>
                    )}
                    <Link
                        href={`/admin/orders/${row.id}`}
                        className="p-1 text-[var(--cms-text-muted)] hover:text-[var(--cms-accent)] rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        aria-label={`${tr(S.viewBookingAria, locale)} ${row.code}`}
                    >
                        <EyeIcon size={15} />
                    </Link>
                </div>
            ),
        },
    ]

    const stats = useMemo(() => {
        const checkInToday = bookings.filter((b) => b.status === 'confirmed').length
        const checkOutToday = bookings.filter((b) => b.status === 'checked_in').length
        const pendingDeposit = bookings.filter((b) => b.status === 'pending_payment').length
        // Mẫu số dùng SỐ PHÒNG VẬT LÝ thật (`RoomUnit`), không phải số hạng
        // phòng — đúng B0: hạng phòng chỉ là danh mục, phòng vật lý mới là
        // thứ có thể "đang có khách". Tử số đếm đơn đang giữ chỗ chắc chắn
        // (confirmed/checked_in), là ước lượng — KHÔNG so với "tuần trước" vì
        // chưa có dữ liệu lịch sử để so (bỏ chỗ bịa số "▲ 12%" của bản cũ).
        const occupiedUnits = bookings.filter(
            (b) => b.status === 'checked_in' || b.status === 'confirmed',
        ).length
        const occupancyRate =
            roomUnits.length > 0 ? Math.round((occupiedUnits / roomUnits.length) * 100) : 0
        return { checkInToday, checkOutToday, pendingDeposit, occupancyRate }
    }, [bookings, roomUnits])

    // Sự kiện thật trong `ActivityLog`, không phải dữ liệu bịa. Lấy 8 dòng gần
    // nhất trong ngày hôm nay, mới nhất trước.
    const todayActivities = useMemo(() => {
        const todayPrefix = new Date().toISOString().slice(0, 10)
        return logs
            .filter((l: ActivityLog) => l.at.startsWith(todayPrefix) && ACTIVITY_TITLE[l.action])
            .sort((a, b) => b.at.localeCompare(a.at))
            .slice(0, 8)
    }, [logs])

    const shiftGroups = [
        {
            legend: tr(S.shiftFilterLabel, locale),
            value: shift,
            onChange: (v: string) => setShift(v as typeof shift),
            options: [
                { value: 'all', label: tr(S.shiftAll, locale) },
                { value: 'morning', label: tr(S.shiftMorning, locale) },
                { value: 'afternoon', label: tr(S.shiftAfternoon, locale) },
            ],
        },
        {
            legend: tr(S.segmentFilterLabel, locale),
            value: segment,
            onChange: (v: string) => setSegment(v as typeof segment),
            options: [
                { value: 'all', label: tr(S.all, locale) },
                { value: 'villa', label: tr(S.segmentVilla, locale) },
                { value: 'bungalow', label: tr(S.segmentBungalow, locale) },
                { value: 'deluxe', label: tr(S.segmentDeluxe, locale) },
            ],
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            <PageHeaderBar
                kicker={tr(S.dashboardKicker, locale)}
                title={tr(S.dashboardTitle, locale)}
                actions={
                    <>
                        <button
                            type="button"
                            onClick={() => setViewMode(viewMode === 'console' ? 'timeline' : 'console')}
                            className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] hover:bg-[var(--cms-bg-subtle)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {viewMode === 'console' ? tr(S.tapeChartView, locale) : tr(S.consoleView, locale)}
                        </button>
                        <Link
                            href="/admin/orders/new"
                            className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {tr(S.newBookingCta, locale)}
                        </Link>
                    </>
                }
            />

            <FilterBar
                groups={shiftGroups}
                resultText={`${filteredData.length} ${tr(S.matchingBookings, locale)}`}
            />

            <div className="px-[var(--cms-pad)] pb-4">
                <MetricStrip>
                    <KpiCard
                        label={tr(S.kpiOccupancyRate, locale)}
                        value={`${stats.occupancyRate}%`}
                        tone="blue"
                    />
                    <KpiCard
                        label={tr(S.kpiCheckInToday, locale)}
                        value={`${stats.checkInToday}`}
                        note={`${tr(S.kpiUnitSuffix, locale)}`}
                        tone="emerald"
                    />
                    <KpiCard
                        label={tr(S.kpiCheckOutToday, locale)}
                        value={`${stats.checkOutToday}`}
                        note={tr(S.expectedBeforeNoon, locale)}
                        tone="slate"
                    />
                    <KpiCard
                        label={tr(S.kpiPendingDeposit, locale)}
                        value={`${stats.pendingDeposit}`}
                        note={tr(S.checkDepositTransfer, locale)}
                        tone="amber"
                    />
                </MetricStrip>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3">
                <div className="flex bg-[var(--cms-bg-subtle)] p-0.5 rounded-[var(--cms-radius)] border border-[var(--cms-border)] text-[length:var(--cms-text-body)]">
                    {(
                        [
                            { key: 'all', label: tr(S.tabAllRooms, locale) },
                            { key: 'arrivals', label: tr(S.tabArrivalsToday, locale) },
                            { key: 'pending', label: tr(S.tabPendingDeposit, locale) },
                        ] as const
                    ).map((t2) => (
                        <button
                            key={t2.key}
                            type="button"
                            aria-pressed={tab === t2.key}
                            onClick={() => setTab(t2.key)}
                            className={`px-3 py-1 rounded-[var(--cms-radius-sm)] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                tab === t2.key
                                    ? 'bg-[var(--cms-accent)] text-white'
                                    : 'text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]'
                            }`}
                        >
                            {t2.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lưới 2 cột: bảng đơn (2/3) · dòng sự kiện thật trong ngày (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-0 flex-1 border-t border-[var(--cms-border)]">
                <div className="lg:col-span-2 flex flex-col min-h-0 lg:border-r border-[var(--cms-border)]">
                    {viewMode === 'console' ? (
                        <div className="flex-1 overflow-y-auto">
                            <DataGrid<BookingRow>
                                caption={tr(S.dashboardTitle, locale)}
                                columns={columns}
                                rows={filteredData}
                                rowKey={(row) => row.id}
                                onRowClick={(row) => {
                                    window.location.href = `/admin/orders/${row.id}`
                                }}
                                empty={
                                    <div className="py-8 text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                                        {tr(S.emptyFilterBookings, locale)}
                                    </div>
                                }
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
                            <span className="text-[var(--cms-text-muted)]">
                                <CalendarIcon size={36} />
                            </span>
                            <div className="font-semibold text-[length:var(--cms-text-body)] text-[var(--cms-text)]">
                                {tr(S.tapeChartTitle, locale)}
                            </div>
                            <p className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] max-w-sm">
                                {tr(S.tapeChartDesc, locale)}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col min-h-0">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--cms-border)]">
                        <span className="text-[length:var(--cms-text-label)] font-semibold uppercase tracking-wide text-[var(--cms-text-muted)]">
                            {tr(S.recentActivity, locale)}
                        </span>
                        <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                            {tr(S.todayLabelShort, locale)}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-2">
                        {todayActivities.length === 0 ? (
                            <p className="p-3 text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                                {tr(S.noActivityToday, locale)}
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {todayActivities.map((log: ActivityLog) => {
                                    const title = ACTIVITY_TITLE[log.action]
                                    const booking = bookings.find((b) => b.id === log.bookingId)
                                    const timeLabel = new Date(log.at).toLocaleTimeString(
                                        locale === 'vi' ? 'vi-VN' : 'en-US',
                                        { hour: '2-digit', minute: '2-digit' },
                                    )
                                    return (
                                        <div
                                            key={log.id}
                                            className="flex gap-2.5 p-2 rounded-[var(--cms-radius-sm)] hover:bg-[var(--cms-bg-subtle)] transition-colors text-[length:var(--cms-text-body)]"
                                        >
                                            <div className="text-[length:var(--cms-text-meta)] font-mono text-[var(--cms-text-muted)] pt-0.5 shrink-0">
                                                {timeLabel}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold text-[var(--cms-text)]">
                                                    {title ? title[locale] : log.action} — {log.actorName}
                                                </div>
                                                <div className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] mt-0.5 leading-relaxed">
                                                    {booking
                                                        ? `${booking.code} · ${booking.roomTypeName}`
                                                        : log.note || log.bookingId}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
