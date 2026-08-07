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

import { EyeIcon, CalendarIcon, ChevronDownIcon } from '@/components/icons'
import { DataGrid, DotBadge, FilterBar, KpiCard, MetricStrip, PageHeaderBar, type CmsTone } from '@repo/cms-ui'
import type { Column } from '@repo/ui'
import { getPropertySync, pick, formatPrice } from '@repo/core'
import type { ActivityLog, Booking, BookingStatus, LogAction } from '@repo/core'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingsData } from '@/hooks/useAdminData'
import { useBookingStore } from '@/stores/booking.store'
import { todayKey } from '@/stores/demo-data'
import { S, STATUS_LABEL, tr } from '@/strings'

/** Khoá `localStorage` RIÊNG cho trạng thái ẩn/hiện MetricStrip — round 3
 *  mục 3 yêu cầu KHÔNG dùng chung khoá sidebar (`namduhill-cms-rail-collapsed`
 *  ở `AppShell`), vì đây là hai lựa chọn độc lập của người dùng: có thể muốn
 *  sidebar thu gọn nhưng vẫn thấy KPI, hoặc ngược lại. */
const METRICS_COLLAPSE_KEY = 'namduhill-cms-dashboard-metrics-collapsed'

/** Đọc/ghi trạng thái ẩn/hiện MetricStrip qua `localStorage`. Không dùng
 *  `useRailCollapse` của `@repo/ui` vì hook đó gắn kèm hành vi click-outside
 *  tự thu gọn — đúng cho sidebar (không gian hẹp, tạm mở), SAI cho một khối
 *  nội dung tĩnh mà người dùng bấm ẩn/hiện có chủ đích (round 3 mục 3). */
function useMetricsCollapsed(): [boolean, (next: boolean) => void] {
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        try {
            setCollapsed(localStorage.getItem(METRICS_COLLAPSE_KEY) === '1')
        } catch {
            // localStorage không khả dụng (SSR/trình duyệt chặn) — giữ mặc định hiện.
        }
    }, [])

    const update = (next: boolean) => {
        setCollapsed(next)
        try {
            localStorage.setItem(METRICS_COLLAPSE_KEY, next ? '1' : '0')
        } catch {
            // Không lưu được thì vẫn cho đổi trạng thái trong phiên hiện tại.
        }
    }

    return [collapsed, update]
}

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
    const [metricsCollapsed, setMetricsCollapsed] = useMetricsCollapsed()
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
            // `min-w-0` + `truncate` + `title` (round 3 mục 4): round 2 đo
            // được rowH nhảy 56→68px khi cột hẹp lại (laptop 640px, zoom
            // 150%) vì hai dòng chữ ở ô này XUỐNG DÒNG THỨ BA khi không đủ
            // ngang. `truncate` ép mỗi dòng ở lại ĐÚNG một dòng, cắt bằng "…"
            // — thông tin đầy đủ vẫn còn trong `title` (hover xem được),
            // không mất hẳn như cắt cứng số ký tự. `min-w-0` bắt buộc trên
            // `<div>` cha vì flex/table cell mặc định không co dưới nội dung,
            // `truncate` không có tác dụng nếu thiếu nó.
            cell: (row) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={row.guestName}
                    >
                        {row.guestName}
                    </div>
                    <div
                        className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] font-mono"
                        title={`${row.code} · ${row.phone}`}
                    >
                        {row.code} · {row.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'roomType',
            header: tr(S.colRoomTypeNights, locale),
            cell: (row) => (
                <div className="min-w-0">
                    <div
                        className="truncate text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={row.roomTypeName}
                    >
                        {row.roomTypeName}
                    </div>
                    <div className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {row.nights} {tr(S.nights, locale)} ({row.checkInDate})
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: tr(S.status, locale),
            width: '164px',
            cell: (row) => (
                // width=140: đủ chỗ cho nhãn dài nhất trong `STATUS_LABEL`
                // ("Hết hạn giữ chỗ"/"Hold expired") + chấm màu + padding,
                // không cắt chữ (D4). Round 1 dùng 120px và "Đã cọc — chờ
                // nhận" bị cắt còn "Đã cọc — chờ n…" — đã rút ngắn nhãn
                // (xem `STATUS_LABEL.confirmed`) NHƯNG cũng nới width ở đây
                // để chống tái phát khi có nhãn dài khác trong tương lai.
                <DotBadge tone={STATUS_TONE_MAP[row.status]} label={tr(STATUS_LABEL[row.status], locale)} width={140} />
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
                        {/* `whitespace-nowrap` phòng ngừa: cột này có `width` cố
                            định (170px) nên ít rủi ro hơn 2 cột co giãn ở trên,
                            nhưng số tiền dài (7 chữ số + "đ") ở màn rất hẹp vẫn
                            có thể xuống dòng nếu không chặn tường minh. */}
                        <div className="whitespace-nowrap font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)] tabular-nums">
                            {formatPrice(row.totalAmount, locale)}
                        </div>
                        <div className="whitespace-nowrap text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] tabular-nums">
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
        const today = todayKey()
        // BUG round 1 (fix round 2 mục 6): "khách nhận phòng hôm nay" đếm MỌI
        // đơn `confirmed`, bất kể ngày check-in là hôm nay hay tháng sau — đó
        // là lý do "13 khách nhận phòng" nhưng "công suất 11%" không khớp
        // nhau: hai con số không cùng đang đo "hôm nay". Sửa: phải lọc thêm
        // `checkIn === today` để đúng nghĩa "hôm nay".
        const checkInToday = bookings.filter((b) => b.status === 'confirmed' && b.checkInDate === today).length
        const checkOutToday = bookings.filter((b) => b.status === 'checked_in' && b.checkOutDate === today).length
        const pendingDeposit = bookings.filter((b) => b.status === 'pending_payment').length
        // Công suất phòng HÔM NAY = số phòng đang thật sự có khách hôm nay /
        // tổng số phòng vật lý khả dụng để bán (B0: `RoomUnit`, không phải số
        // hạng phòng). "Đang có khách hôm nay" = `checked_in` (đã nhận phòng,
        // chưa trả) HOẶC `confirmed` mà HÔM NAY nằm trong khoảng lưu trú
        // [checkIn, checkOut) — round 1 đếm MỌI đơn confirmed/checked_in bất
        // kể ngày, ra 11% trong khi có 13 lượt nhận phòng hôm nay là vô lý
        // (13 > 11% của bất kỳ số phòng thực tế nào ở quy mô resort này).
        // Không có field "ngừng bán/bảo trì dài hạn" tách biệt trong
        // `RoomUnit.status` để loại khỏi mẫu số — coi TOÀN BỘ `roomUnits` là
        // khả dụng để bán là giả định hợp lý duy nhất với dữ liệu hiện có,
        // KHÔNG bịa thêm khái niệm không có trong `@repo/core`.
        const occupiedToday = bookings.filter(
            (b) =>
                b.status === 'checked_in' ||
                (b.status === 'confirmed' && b.checkInDate <= today && b.checkOutDate > today),
        ).length
        const occupancyRate =
            roomUnits.length > 0 ? Math.round((occupiedToday / roomUnits.length) * 100) : 0
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

    // Round 3 mục 2: gộp tab "Toàn bộ đơn/Check-in hôm nay/Chờ cọc" (trước là
    // một tầng `<div>` riêng ~52px bên dưới) làm NHÓM PILL THỨ BA ngay trong
    // `shiftGroups` — cùng cơ chế `<fieldset>`/pill với CA TRỰC, HẠNG PHÒNG.
    // Cả 3 nhóm giờ render chung một hàng trong `FilterBar`, tự `flex-wrap`
    // xuống dòng khi màn hẹp (đúng tinh thần ảnh mẫu Sales Cloud: mọi filter
    // dồn về một hàng).
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
        {
            legend: tr(S.status, locale),
            value: tab,
            onChange: (v: string) => setTab(v as typeof tab),
            options: [
                { value: 'all', label: tr(S.tabAllRooms, locale) },
                { value: 'arrivals', label: tr(S.tabArrivalsToday, locale) },
                { value: 'pending', label: tr(S.tabPendingDeposit, locale) },
            ],
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* Gộp title + filter thành MỘT hàng (fix round 2 mục 1/2) — bỏ
                hẳn kicker "VẬN HÀNH — HÔM NAY" vì tab "Dashboard" đang active
                trên header (AppShell) đã nói rõ đang ở đâu, lặp lại tốn một
                dòng dọc. `filters` tự `flex-wrap` xuống hàng 2 khi màn hẹp. */}
            <PageHeaderBar
                title={tr(S.dashboardTitle, locale)}
                filters={
                    <FilterBar
                        groups={shiftGroups}
                        resultText={`${filteredData.length} ${tr(S.matchingBookings, locale)}`}
                    />
                }
                actions={
                    <>
                        {/* Nút ẩn/hiện MetricStrip (round 3 mục 3) — lễ tân trực cả
                            ngày cần BẢNG hơn KPI thường trực. `aria-expanded` báo
                            đúng trạng thái, `aria-controls` trỏ tới id của khối bị
                            điều khiển để screen reader biết vùng nào vừa đổi. */}
                        <button
                            type="button"
                            onClick={() => setMetricsCollapsed(!metricsCollapsed)}
                            aria-expanded={!metricsCollapsed}
                            aria-controls="dashboard-metric-strip"
                            className="flex items-center gap-1 px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] hover:bg-[var(--cms-bg-subtle)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <span>{tr(metricsCollapsed ? S.showMetrics : S.hideMetrics, locale)}</span>
                            <ChevronDownIcon size={14} />
                        </button>
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

            {/* Ẩn hẳn khỏi DOM (không phải `display:none` giữ chỗ) khi thu gọn
                — tiết kiệm TRỌN chiều cao ~96px của MetricStrip, đúng yêu cầu
                round 3 mục 3 "phải tiết kiệm trọn ~96px". `id` khớp
                `aria-controls` của nút toggle ở trên. */}
            {!metricsCollapsed && (
                <div id="dashboard-metric-strip" className="px-[var(--cms-pad)] pb-3">
                    <MetricStrip>
                        <KpiCard
                            label={tr(S.kpiOccupancyRate, locale)}
                            value={`${stats.occupancyRate}%`}
                            tone="blue"
                        />
                        <KpiCard
                            label={tr(S.kpiCheckInToday, locale)}
                            value={`${stats.checkInToday}`}
                            note={tr(S.kpiUnitSuffix, locale)}
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
            )}

            {/* Tab "Toàn bộ đơn/Check-in hôm nay/Chờ cọc" (round 1) ĐÃ GỘP vào
                `shiftGroups` làm nhóm pill thứ ba trong `FilterBar` ở trên
                (round 3 mục 2) — không còn tầng `<div>` riêng ~52px ở đây. */}

            {/* Lưới 2 cột: bảng đơn (3/4) · dòng sự kiện thật trong ngày (1/4).
                Round 1 dùng 2/3+1/3 — cột "Vừa diễn ra" thường chỉ có 1-2 dòng
                nội dung mà chiếm 1/3 màn hình, lãng phí không gian đúng lúc
                bảng đơn (nội dung chính, cần thấy nhiều đơn nhất) cần nó nhất
                (fix round 2 mục 7). 1/4 vẫn đủ rộng để đọc "HH:mm · hành động
                · mã đơn" trên một dòng ở 1440px. */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 min-h-0 flex-1 border-t border-[var(--cms-border)]">
                <div className="lg:col-span-3 flex flex-col min-h-0 lg:border-r border-[var(--cms-border)]">
                    {viewMode === 'console' ? (
                        // `flex flex-col min-h-0` BẮT BUỘC ở wrapper này: `DataGrid`
                        // bên trong dùng `h-full` để cao hết khung cha — thiếu
                        // `min-h-0` thì flex item mặc định `min-height: auto` co
                        // theo NỘI DUNG, `h-full` vô nghĩa và bảng rỗng vẫn để lại
                        // khoảng trắng (fix round 2 mục 3).
                        <div className="flex-1 flex flex-col min-h-0">
                            <DataGrid<BookingRow>
                                caption={tr(S.dashboardTitle, locale)}
                                columns={columns}
                                rows={filteredData}
                                rowKey={(row) => row.id}
                                onRowClick={(row) => {
                                    window.location.href = `/admin/orders/${row.id}`
                                }}
                                empty={
                                    // `h-full flex items-center justify-center` thay vì
                                    // `py-8 text-center`: nội dung rỗng giờ giãn ĐẦY khung
                                    // (kế thừa từ CSS `height:100%` bắc cầu ở tokens.css),
                                    // không co lại theo chiều cao dòng chữ.
                                    <div className="h-full flex items-center justify-center text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                                        {/* Phân biệt "chưa có đơn nào" (store rỗng — bấm Đặt lại
                                            vô ích) với "bộ lọc không khớp" (đổi bộ lọc thì ra kết
                                            quả). Gộp chung dẫn admin đi sai hướng (fix round 1
                                            mục 7). */}
                                        {tr(bookings.length === 0 ? S.noBookingsAtAll : S.emptyFilterBookings, locale)}
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
                                {/* Cùng nguyên tắc với bảng đơn: log RỖNG HOÀN TOÀN (chưa
                                    từng có hoạt động) khác với "không có gì HÔM NAY" (có log
                                    cũ, chỉ là không log nào rơi vào hôm nay). */}
                                {tr(logs.length === 0 ? S.noActivityEver : S.noActivityToday, locale)}
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
