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

import { EyeIcon, MenuIcon } from '@/components/icons'
import { DataGrid, DotBadge, FilterBar, KpiCard, MetricStrip, PageHeaderBar, type CmsTone } from '@repo/cms-ui'
import type { Column } from '@repo/ui'
import { getPropertySync, pick, formatPrice } from '@repo/core'
import type {
    ActivityLog,
    Booking,
    BookingStatus,
    I18nText,
    Locale,
    LogAction,
    Room,
} from '@repo/core'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingsData } from '@/hooks/useAdminData'
import { useMetricsCollapsed } from '@/hooks/useMetricsCollapsed'
import { useBookingStore } from '@/stores/booking.store'
import { todayKey } from '@/stores/demo-data'
import { S, STATUS_LABEL, tr } from '@/strings'
import { useNewBookingDrawer } from './orders/_shared/NewBookingForm'
import { useOrderDrawer } from './orders/_shared/OrderDetailPanel'

/** Khoá `localStorage` cho trạng thái ẩn/hiện MetricStrip — riêng với khoá
 *  sidebar (`namduhill-cms-rail-collapsed` ở `AppShell`) và riêng với khoá
 *  của các màn CMS khác (mỗi màn nhớ trạng thái của chính nó, xem
 *  `useMetricsCollapsed`). */
const METRICS_COLLAPSED_KEY = 'namduhill-cms-dashboard-metrics-collapsed'

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
    roomTypeId: string
    roomTypeName: string
    channelLabel: string
    nights: number
    checkInDate: string
    checkOutDate: string
    totalAmount: number
    paidAmount: number
    status: BookingStatus
    /** Giờ đến dự kiến `HH:mm` — nguồn của bộ lọc ca trực. Rỗng = chưa khai. */
    arrivalTime: string
}

/**
 * Ranh giới ca sáng / ca chiều, tính bằng giờ trong ngày.
 *
 * VÌ SAO 14:00: đây là giờ nhận phòng chuẩn của cơ sở — trước mốc này là ca
 * sáng chuẩn bị phòng, sau mốc này là ca chiều đón khách. Đặt thành hằng số
 * để đổi giờ nhận phòng chỉ phải sửa một chỗ.
 */
const SHIFT_BOUNDARY_HOUR = 14

/**
 * Đơn này thuộc ca nào, suy từ `estimatedArrivalTime` của khách.
 *
 * Trả `null` khi đơn CHƯA khai giờ đến — không đoán bừa vào một ca. Khách gọi
 * điện đặt phòng rất hay bỏ trống trường này; xếp đại vào ca sáng thì lễ tân
 * ca chiều mất luôn đơn khỏi danh sách của mình.
 */
function shiftOf(arrivalTime: string): 'morning' | 'afternoon' | null {
    const hour = Number(arrivalTime.slice(0, 2))
    if (!Number.isFinite(hour)) return null
    return hour < SHIFT_BOUNDARY_HOUR ? 'morning' : 'afternoon'
}

type TimeRange = 'day' | 'week' | 'month' | 'year'

/**
 * Bán kính mỗi phạm vi, tính bằng ngày về MỖI PHÍA quanh hôm nay.
 *
 * VÌ SAO ÔM CẢ HAI PHÍA CHỨ KHÔNG CHỈ LÙI VỀ QUÁ KHỨ: đây là màn vận hành,
 * không phải báo cáo. Lễ tân cần thấy khách SẮP đến để chuẩn bị phòng, chứ
 * không chỉ khách đã đến. "Tuần" = 7 ngày quanh hôm nay (−3..+3), hữu ích hơn
 * nhiều so với 7 ngày đã qua.
 */
const RANGE_RADIUS: Record<TimeRange, number> = {
    day: 0,
    week: 3,
    month: 15,
    year: 182,
}

/** Cộng/trừ ngày trên chuỗi `YYYY-MM-DD`, giữ nguyên dạng chuỗi.
 *  Parse UTC đúng cách `packages/core/src/pricing.ts` xử lý ngày lịch không
 *  giờ — không tự "sửa" thành ép múi giờ địa phương (luật C6). */
function shiftDate(date: string, days: number): string {
    if (days === 0) return date
    const d = new Date(`${date}T00:00:00Z`)
    d.setUTCDate(d.getUTCDate() + days)
    return d.toISOString().slice(0, 10)
}

/** Hai đầu của khoảng đang xem, dạng `YYYY-MM-DD` — so sánh CHUỖI trực tiếp
 *  với `checkInDate`/`checkOutDate` (cùng định dạng), đúng luật C6. */
function rangeBounds(range: TimeRange, today: string): { start: string; end: string } {
    const r = RANGE_RADIUS[range]
    return { start: shiftDate(today, -r), end: shiftDate(today, r) }
}


export default function AdminDashboard() {
    const { locale } = useLocale()
    const { openOrder } = useOrderDrawer()
    const { openNewBooking } = useNewBookingDrawer()
    const { bookings: rawBookings, roomUnits } = useBookingsData()
    const logs = useBookingStore((s) => s.logs)
    const changeStatusViaApi = useBookingStore((s) => s.changeStatusViaApi)
    /** Lỗi server khi duyệt cọc ngay trên bảng — hiện bằng chữ (luật FE4). */
    const [rowError, setRowError] = useState<I18nText | null>(null)
    /** Id đơn đang chờ server, để khoá đúng nút đó thay vì khoá cả bảng. */
    const [pendingRow, setPendingRow] = useState<string | null>(null)
    const property = getPropertySync()

    const [viewMode, setViewMode] = useState<'console' | 'timeline'>('console')
    // Hook dùng chung (`src/hooks/useMetricsCollapsed.ts`) — KHÔNG dùng
    // `useRailCollapse` (xem giải thích trong file hook đó). Sidebar ở
    // `AppShell` VẪN dùng `useRailCollapse` bình thường, không đổi.
    const [metricsCollapsed, toggleMetrics] = useMetricsCollapsed(METRICS_COLLAPSED_KEY)
    // Bộ lọc phạm vi thời gian (việc ngoài 5 round) — chi phối KPI + bảng.
    // Mặc định 'day' theo đúng yêu cầu.
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('day')
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
                roomTypeId: b.roomTypeId,
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
                arrivalTime: b.guest?.estimatedArrivalTime || '',
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rawBookings, locale],
    )

    // Bộ lọc phạm vi thời gian chi phối cả bảng lẫn KPI (`stats` bên dưới) —
    // "hôm nay" chỉ là trường hợp `range='day'`.
    //
    // Khoảng xem là `[rangeStart, rangeEnd]` và ôm CẢ HAI PHÍA quanh hôm nay:
    // lễ tân cần thấy khách sắp đến chứ không chỉ khách đã đến. Chọn "Tuần" là
    // 7 ngày quanh hôm nay, không phải 7 ngày đã qua.
    const today = todayKey()
    const { start: rangeStart, end: rangeEnd } = rangeBounds(timeRange, today)

    const filteredData = bookings.filter((item) => {
        // GIAO NHAU với khoảng, KHÔNG phải `checkInDate` nằm trong khoảng:
        // khách nhận phòng hôm qua và trả ngày mai thì HÔM NAY vẫn đang ở —
        // lọc theo `checkInDate` sẽ đánh rơi đúng những đơn lễ tân cần nhất.
        if (item.checkOutDate < rangeStart || item.checkInDate > rangeEnd) return false
        if (tab === 'pending' && item.status !== 'pending_payment') return false
        if (tab === 'arrivals' && item.status !== 'confirmed') return false
        if (segment !== 'all') {
            const matchesSegment = item.roomTypeName.toLowerCase().includes(segment)
            if (!matchesSegment) return false
        }
        // Ca trực lọc theo GIỜ ĐẾN DỰ KIẾN. Đơn chưa khai giờ (`null`) vẫn hiện
        // ở mọi ca — giấu nó đi thì không ca nào biết đơn đó tồn tại.
        if (shift !== 'all') {
            const itemShift = shiftOf(item.arrivalTime)
            if (itemShift !== null && itemShift !== shift) return false
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
                    {/* DUYỆT CỌC — một chạm, gọi thẳng server.
                        Đây là thao tác KHÔNG cần thêm dữ liệu: route
                        `payments` tự lấy `depositAmount` của đơn. */}
                    {row.status === 'pending_payment' && (
                        <button
                            type="button"
                            disabled={pendingRow === row.id}
                            onClick={async () => {
                                setRowError(null)
                                setPendingRow(row.id)
                                const failure = await changeStatusViaApi(row.id, 'confirmed', {
                                    note: tr(S.approveDepositNote, locale),
                                })
                                setPendingRow(null)
                                setRowError(failure)
                            }}
                            className="px-2.5 py-1 text-[length:var(--cms-text-meta)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius-sm)] transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {tr(pendingRow === row.id ? S.saving : S.approveDeposit, locale)}
                        </button>
                    )}

                    {/* NHẬN / TRẢ PHÒNG — MỞ DRAWER, không đổi thẳng.
                        Bản cũ bấm một cái là `checked_in` ngay, bỏ qua việc gán
                        phòng vật lý và ghi số CCCD — hai thứ BẮT BUỘC theo §F5
                        (khai báo lưu trú) và cũng là điều kiện của route
                        `check-in`. Nút một chạm ở đây chỉ tạo ra đơn thiếu dữ
                        liệu; mở đúng form là cách duy nhất không nói dối. */}
                    {(row.status === 'confirmed' || row.status === 'checked_in') && (
                        <button
                            type="button"
                            onClick={() => openOrder(row.id)}
                            className={`px-2.5 py-1 text-[length:var(--cms-text-meta)] font-semibold text-white rounded-[var(--cms-radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                row.status === 'confirmed'
                                    ? 'bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90'
                                    : 'bg-[var(--cms-text)] hover:opacity-90'
                            }`}
                        >
                            {tr(row.status === 'confirmed' ? S.checkInCta : S.checkOutCta, locale)}
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
        // BUG round 1 (fix round 2 mục 6): "khách nhận phòng hôm nay" đếm MỌI
        // đơn `confirmed`, bất kể ngày check-in là hôm nay hay tháng sau — đó
        // là lý do "13 khách nhận phòng" nhưng "công suất 11%" không khớp
        // nhau: hai con số không cùng đang đo "hôm nay". Sửa: phải lọc thêm
        // `checkIn === today` để đúng nghĩa "hôm nay".
        //
        // Bộ lọc phạm vi thời gian: "khách nhận/trả phòng" đếm trong CẢ KHOẢNG
        // `[rangeStart, rangeEnd]` — khoảng ôm hai phía quanh hôm nay nên
        // `range='day'` vẫn thu về đúng một ngày (bán kính 0), còn "Tuần" cho
        // thấy cả khách sắp đến, đúng thứ lễ tân cần để chuẩn bị phòng.
        const checkInRange = bookings.filter(
            (b) => b.status === 'confirmed' && b.checkInDate >= rangeStart && b.checkInDate <= rangeEnd,
        ).length
        const checkOutRange = bookings.filter(
            (b) => b.status === 'checked_in' && b.checkOutDate >= rangeStart && b.checkOutDate <= rangeEnd,
        ).length
        const pendingDeposit = bookings.filter((b) => b.status === 'pending_payment').length
        // Công suất phòng LUÔN là ảnh chụp HÔM NAY, không đổi theo phạm vi —
        // "công suất trung bình một tuần/tháng" là một khái niệm khác (đòi
        // hỏi dữ liệu lịch sử theo từng ngày mà `Booking` hiện có không đủ để
        // tính đúng — chỉ có ngày nhận/trả, không có snapshot mỗi ngày quá
        // khứ). Giữ nguyên là số ĐÚNG cho ngày hôm nay còn hơn suy diễn sai
        // cho cả khoảng (không bịa khái niệm không có trong `@repo/core`,
        // cùng nguyên tắc round 2 mục 6). Công thức: số phòng đang thật sự có
        // khách hôm nay / tổng số phòng vật lý khả dụng để bán (B0).
        const occupiedToday = bookings.filter(
            (b) =>
                b.status === 'checked_in' ||
                (b.status === 'confirmed' && b.checkInDate <= today && b.checkOutDate > today),
        ).length
        const occupancyRate =
            roomUnits.length > 0 ? Math.round((occupiedToday / roomUnits.length) * 100) : 0
        return { checkInToday: checkInRange, checkOutToday: checkOutRange, pendingDeposit, occupancyRate }
    }, [bookings, roomUnits, rangeStart, rangeEnd, today])

    /**
     * Số phòng vật lý của mỗi hạng — mẫu số của ô Tape Chart.
     *
     * Đếm `RoomUnit` THẬT theo `roomTypeId` (luật B0: hạng phòng và phòng vật
     * lý là hai thực thể tách bạch). Không dùng `Room.remaining` của seed vì
     * đó là con số hiển thị "chỉ còn N phòng" phía khách, không phải tổng số
     * phòng của hạng.
     */
    const unitsOf = useMemo(() => {
        const map = new Map<string, number>()
        for (const unit of roomUnits) {
            map.set(unit.roomTypeId, (map.get(unit.roomTypeId) ?? 0) + 1)
        }
        return map
    }, [roomUnits])

    /** 14 ngày kể từ hôm nay — bề ngang Tape Chart đọc được không cuộn ngang. */
    const tapeDates = useMemo(
        () => Array.from({ length: 14 }, (_, i) => shiftDate(today, i)),
        [today],
    )

    // Sự kiện thật trong `ActivityLog`, không phải dữ liệu bịa. Lấy 8 dòng gần
    // nhất trong ngày hôm nay, mới nhất trước.
    const todayActivities = useMemo(() => {
        const todayPrefix = new Date().toISOString().slice(0, 10)
        return logs
            .filter((l: ActivityLog) => l.at.startsWith(todayPrefix) && ACTIVITY_TITLE[l.action])
            .sort((a, b) => b.at.localeCompare(a.at))
            .slice(0, 8)
    }, [logs])

    // Round 5 mục 1: theo đúng đặc tả chủ dự án — tab trạng thái ("Toàn bộ
    // đơn/Check-in hôm nay/Chờ cọc") LÊN lại hàng filter (hàng 2), làm nhóm
    // pill thứ ba trong `shiftGroups`. Khác round 3 ở chỗ round 5 chốt bố cục
    // 2 HÀNG CỤ THỂ (hàng 1: title + hành động; hàng 2: filter + tab + kết
    // quả + Đặt lại) — không phải "gộp hết vào 1 hàng" như round 2/3.
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

    // Round 5 mục 1: `F6` bắt buộc mọi bộ lọc có nút đặt lại — dashboard
    // trước đó THIẾU. Đưa 3 filter về mặc định, không đụng `metricsCollapsed`
    // hay `viewMode` (đó không phải "bộ lọc dữ liệu").
    const resetFilters = () => {
        setShift('all')
        setSegment('all')
        setTab('all')
    }

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1 (round 5 mục 1, đặc tả chủ dự án): trái = title, phải =
                3 nút hành động (Ẩn số liệu/Sơ đồ Tape Chart/+ Đặt phòng mới).
                `filters` KHÔNG còn truyền vào đây — chuyển xuống hàng 2. */}
            <PageHeaderBar
                title={tr(S.dashboardTitle, locale)}
                actions={
                    <>
                        {/* Bộ lọc phạm vi thời gian (việc ngoài 5 round) — đặt
                            CẠNH nút "Ẩn số liệu" theo đúng vị trí chủ dự án chọn:
                            cùng nhóm "điều khiển phạm vi dữ liệu". DÙNG DROPDOWN
                            gọn (`<select>`), không phải 4 pill — ràng buộc ngân
                            sách chiều cao của hàng 1 (không được cao thêm/wrap)
                            khiến 4 pill riêng không khả thi, một `<select>` cao
                            bằng đúng các nút khác bên cạnh là lựa chọn duy nhất
                            không phá layout. `aria-label` bù cho việc không có
                            `<label>` hiện — tên bộ lọc đã rõ qua các option. */}
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            aria-label={tr(S.timeRangeLabel, locale)}
                            // Cùng `px-3 py-1.5` với các nút liền kề (không phải
                            // giá trị `h-[…]` tự chế) — chiều cao TỰ khớp nhau vì
                            // cùng công thức padding + line-height, đúng thang 8pt
                            // (P5) thay vì một con số px lẻ riêng cho ô này.
                            className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <option value="day">{tr(S.timeRangeDay, locale)}</option>
                            <option value="week">{tr(S.timeRangeWeek, locale)}</option>
                            <option value="month">{tr(S.timeRangeMonth, locale)}</option>
                            <option value="year">{tr(S.timeRangeYear, locale)}</option>
                        </select>
                        {/* Nút ẩn/hiện MetricStrip — trạng thái đọc từ
                            `useMetricsCollapsed` (state riêng, xem định nghĩa đầu
                            file — KHÔNG còn `useRailCollapse` sau khi sửa bug click-
                            outside). Icon `MenuIcon` vẫn dùng đồ có sẵn của
                            `icons.tsx`, không tự chế. */}
                        <button
                            type="button"
                            onClick={toggleMetrics}
                            aria-expanded={!metricsCollapsed}
                            aria-controls="dashboard-metric-strip"
                            className="flex items-center gap-1 px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] hover:bg-[var(--cms-bg-subtle)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <MenuIcon size={14} />
                            <span>{tr(metricsCollapsed ? S.showMetrics : S.hideMetrics, locale)}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode(viewMode === 'console' ? 'timeline' : 'console')}
                            className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] hover:bg-[var(--cms-bg-subtle)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {viewMode === 'console' ? tr(S.tapeChartView, locale) : tr(S.consoleView, locale)}
                        </button>
                        {/* Drawer chứ không `<Link>` sang `/admin/orders/new`:
                            lễ tân đang dò bảng hôm nay mà rời trang là mất chỗ
                            đang xem. Route kia vẫn sống cho deep-link. */}
                        <button
                            type="button"
                            onClick={openNewBooking}
                            className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {tr(S.newBookingCta, locale)}
                        </button>
                    </>
                }
            />

            {/* HÀNG 2 (round 5 mục 1): CA TRỰC + HẠNG PHÒNG + tab trạng thái,
                đẩy kết quả + Đặt lại về cuối hàng bằng `resultText`/`onReset`
                có sẵn của `FilterBar` — không viết nút Đặt lại riêng.
                `border-t` phân tách khỏi hàng 1 bằng đường kẻ 1px (không
                shadow, đúng P7); `py-3` cho khoảng thở dọc RÕ hơn `py-2.5`
                của hàng 1 — round 4 để 2 hàng dính sát, round 5 mục 4 yêu
                cầu thêm nhịp thở giữa các khối, cả hai giá trị đều nằm trên
                thang 8pt (P5): 10px/12px là bội số 2, không phải số lẻ tuỳ
                tiện — 12px (`py-3`) tại đây tạo chênh lệch rõ ràng hơn với
                10px (`py-2.5`) của hàng 1. */}
            {/* `cms-row-filters` là móc cho quy tắc màn-thấp ở `tokens.css`
                (giảm padding dọc khi viewport ngắn). Không dùng biến thể
                `[@media(max-height:…)]:` của Tailwind vì class đó không được
                sinh ra — đã kiểm trên CSS phục vụ thật. */}
            {/* Lỗi khi duyệt cọc ngay trên bảng. Không có khối này thì server
                từ chối mà lễ tân chỉ thấy badge không đổi — im lặng là kiểu
                hỏng tệ nhất (luật FE4/C3). */}
            {rowError && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="border-t border-[var(--cms-border)] bg-[var(--cms-tone-rose-bg)] px-[var(--cms-pad)] py-2 text-[length:var(--cms-text-body)] text-[var(--cms-tone-rose)]"
                >
                    {tr(rowError, locale)}
                </div>
            )}

            <div className="cms-row-filters border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3">
                <FilterBar
                    groups={shiftGroups}
                    resultText={`${filteredData.length} ${tr(S.matchingBookings, locale)}`}
                    onReset={resetFilters}
                />
            </div>

            {/* Ẩn hẳn khỏi DOM (không phải `display:none` giữ chỗ) khi thu gọn
                — tiết kiệm TRỌN chiều cao ~96px của MetricStrip, đúng yêu cầu
                round 3 mục 3 "phải tiết kiệm trọn ~96px". `id` khớp
                `aria-controls` của nút toggle ở trên. Nền `--cms-bg-subtle`
                (round 5 mục 4): trước đó khối này trong suốt, ngồi trực tiếp
                trên nền trắng của trang — không phân biệt được bằng mắt với
                hàng filter phía trên (cùng là nền trắng dính liền). Đổi nền
                nhẹ + `border-t` để MetricStrip tự đứng thành MỘT khối tách
                bạch, khớp nguyên tắc "phân tách bằng khoảng trắng + đường kẻ
                1px" — không phải thêm shadow trang trí. `py-2` (8px, không
                phải `py-3`): việc PHÂN TÁCH đã do `border-t` + đổi nền đảm
                nhiệm — không cần thêm padding dọc để "trông tách biệt", và
                giữ ngân sách chiều cao không tụt dưới mức đã đo (laptop 640px
                ≥6 hàng bảng, zoom150% ≥2 hàng — ràng buộc cứng round 5 mục 4). */}
            {!metricsCollapsed && (
                <div
                    id="dashboard-metric-strip"
                    className="border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2"
                >
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

            {/* Lưới 2 cột: bảng đơn (3/4) · dòng sự kiện thật trong ngày (1/4).
                Round 1 dùng 2/3+1/3 — cột "Vừa diễn ra" thường chỉ có 1-2 dòng
                nội dung mà chiếm 1/3 màn hình, lãng phí không gian đúng lúc
                bảng đơn (nội dung chính, cần thấy nhiều đơn nhất) cần nó nhất
                (fix round 2 mục 7). 1/4 vẫn đủ rộng để đọc "HH:mm · hành động
                · mã đơn" trên một dòng ở 1440px.

                MẮT XÍCH THIẾU ở zoom150% (điều tra thêm sau round 4, đọc từng
                cấp như coordinator yêu cầu — không đoán): dưới breakpoint `lg`
                (1024px, Tailwind mặc định), `grid-cols-1` biến 2 con
                (bảng + hoạt động) thành HAI HÀNG grid xếp dọc thay vì 2 CỘT
                cùng hàng. `grid-auto-rows` mặc định là `auto` — hàng grid
                KHÔNG đọc `flex-1`/`h-full` của phần tử con (những class đó
                chỉ có tác dụng trong `display:flex`, không có tác dụng lên
                KÍCH THƯỚC TRACK của `display:grid`). Round 4 đã thông chuỗi
                flex từ `<main>` xuống `.dt-table`, nhưng chuỗi đó đứt lại ở
                CHÍNH BƯỚC CHUYỂN flex→grid này khi ở dưới `lg:` — container
                `flex-1` có chiều cao thật, nhưng hàng chứa bảng bên trong grid
                vẫn tự co theo nội dung (giống hệt triệu chứng round 4: 87px
                thay vì 177px). `grid-rows-[1fr_auto]` SỬA ĐÚNG CHỖ: hàng đầu
                (bảng) nhận `1fr` = phần còn lại của container, hàng sau (dòng
                hoạt động) `auto` = co theo nội dung. Ở `lg:` trở lên đổi lại
                `lg:grid-rows-1` (một hàng, hai cột) — hành vi cũ giữ nguyên,
                không hồi quy màn rộng. */}
            <div className="grid grid-cols-1 grid-rows-[1fr_auto] lg:grid-cols-4 lg:grid-rows-1 gap-0 min-h-0 flex-1 border-t border-[var(--cms-border)]">
                {/* `cms-table-pane`: ở màn THẤP (<1024px, grid xếp 2 hàng dọc)
                    khối này đo được cao 0px dù bảng có nội dung — grid track
                    `1fr` vẫn co về 0 khi không có chiều cao xác định để chia.
                    `tokens.css` đặt `min-height` cho nó ở đúng breakpoint đó,
                    đảm bảo luôn còn chỗ cho ít nhất 2 hàng bảng. */}
                <div className="cms-table-pane lg:col-span-3 flex flex-col min-h-0 lg:border-r border-[var(--cms-border)]">
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
                                // Trước đây là `window.location.href` — tải lại
                                // TOÀN BỘ trang, mất hết bộ lọc ca trực và hạng
                                // phòng đang đặt. Bảng trượt giữ nguyên màn hình
                                // nền, đóng lại là quản lý ở đúng chỗ vừa đứng.
                                onRowClick={(row) => openOrder(row.id)}
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
                        <TapeChart
                            rooms={property.rooms}
                            dates={tapeDates}
                            bookings={bookings}
                            unitsOf={unitsOf}
                            locale={locale}
                            today={today}
                            onPickBooking={openOrder}
                        />
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
                                                    {/* Mã đơn trước đây in ra chữ thường: quản lý
                                                        thấy "vừa nhận phòng NDH-…" nhưng muốn xem
                                                        thì phải tự đi tìm lại trong bảng. Giờ bấm
                                                        thẳng vào là mở đơn đó. */}
                                                    {booking ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="cms-crosslink"
                                                                onClick={() => openOrder(booking.id)}
                                                            >
                                                                {booking.code}
                                                            </button>
                                                            {` · ${booking.roomTypeName}`}
                                                        </>
                                                    ) : (
                                                        log.note || log.bookingId
                                                    )}
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

/* ---------------------------------------------------------------------------
   TAPE CHART — lưới NGÀY × HẠNG PHÒNG.

   Đây là màn hình lễ tân nhìn cả ngày (`app-flows.md §F5`). Bản trước chỉ là
   một khối chữ "sắp có" — bấm nút xong ra màn trống, tệ hơn cả không có nút.

   VÌ SAO DỰNG ĐƯỢC NGAY: mọi số đều suy ra từ dữ liệu đã có — `RoomUnit` cho
   mẫu số, `Booking` cho tử số. Không cần thêm store nào.

   KHÔNG BỊA KHAN HIẾM (luật FE13/P10): ô hiện số phòng trống THẬT tính từ đơn
   đang giữ chỗ, không phải con số trang trí.
--------------------------------------------------------------------------- */

interface TapeChartProps {
    rooms: Room[]
    dates: string[]
    bookings: BookingRow[]
    unitsOf: Map<string, number>
    locale: Locale
    today: string
    onPickBooking: (id: string) => void
}

/** Trạng thái đơn ĐANG giữ phòng trong kho. Đơn huỷ/hết hạn không chiếm chỗ. */
const OCCUPYING: BookingStatus[] = ['confirmed', 'checked_in', 'pending_payment']

function TapeChart({ rooms, dates, bookings, unitsOf, locale, today, onPickBooking }: TapeChartProps) {
    if (rooms.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                {tr(S.tapeChartEmpty, locale)}
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Chú giải màu — BẮT BUỘC vì ô lưới quá nhỏ để chứa chữ trạng
                thái. Luật D4 cấm truyền tin CHỈ bằng màu; chữ nằm trong chú
                giải + `title`/`aria-label` của từng ô, nên người dùng screen
                reader và người mù màu vẫn đọc được. */}
            <div className="flex items-center gap-4 border-b border-[var(--cms-border)] px-[var(--cms-pad)] py-2 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                <LegendSwatch tone="free" label={tr(S.tapeChartLegendFree, locale)} />
                <LegendSwatch tone="tight" label={tr(S.tapeChartLegendTight, locale)} />
                <LegendSwatch tone="full" label={tr(S.tapeChartLegendFull, locale)} />
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <caption className="sr-only">{tr(S.tapeChartTitle, locale)}</caption>
                    <thead>
                        <tr>
                            {/* `sticky left-0` giữ cột tên hạng phòng luôn thấy
                                khi cuộn ngang — thiếu nó thì cuộn tới ngày thứ
                                10 là mất luôn thông tin đang xem hàng nào. */}
                            <th
                                scope="col"
                                className="sticky left-0 top-0 z-20 bg-[var(--cms-bg)] border-b border-r border-[var(--cms-border)] px-3 py-2 text-left text-[length:var(--cms-text-label)] font-semibold uppercase tracking-wide text-[var(--cms-text-muted)]"
                            >
                                {tr(S.tapeChartRoomType, locale)}
                            </th>
                            {dates.map((date) => (
                                <th
                                    key={date}
                                    scope="col"
                                    className={`sticky top-0 z-10 bg-[var(--cms-bg)] border-b border-[var(--cms-border)] px-1 py-2 text-center text-[length:var(--cms-text-meta)] font-semibold tabular-nums ${
                                        date === today
                                            ? 'text-[var(--cms-accent)]'
                                            : 'text-[var(--cms-text-muted)]'
                                    }`}
                                >
                                    {date.slice(8, 10)}/{date.slice(5, 7)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => {
                            const total = unitsOf.get(room.id) ?? 0
                            return (
                                <tr key={room.id}>
                                    <th
                                        scope="row"
                                        className="sticky left-0 z-10 bg-[var(--cms-bg)] border-b border-r border-[var(--cms-border)] px-3 py-2 text-left align-middle"
                                    >
                                        <div
                                            className="truncate max-w-[190px] font-semibold text-[length:var(--cms-text-body)] text-[var(--cms-text)]"
                                            title={pick(room.name, locale)}
                                        >
                                            {pick(room.name, locale)}
                                        </div>
                                        <div className="text-[length:var(--cms-text-meta)] font-normal text-[var(--cms-text-muted)] tabular-nums">
                                            {total} {tr(S.unitsSuffix, locale)}
                                        </div>
                                    </th>

                                    {dates.map((date) => {
                                        // Đơn CHIẾM đêm `date` khi khoảng ở của
                                        // nó bao đêm đó: nhận ≤ date < trả.
                                        // Dùng `<` ở đầu trả phòng vì đêm cuối
                                        // khách đã đi, phòng bán lại được.
                                        const taken = bookings.filter(
                                            (b) =>
                                                b.roomTypeId === room.id &&
                                                OCCUPYING.includes(b.status) &&
                                                b.checkInDate <= date &&
                                                date < b.checkOutDate,
                                        )
                                        const free = Math.max(0, total - taken.length)
                                        const tone: CellTone =
                                            total === 0 || free === 0 ? 'full' : free <= 1 ? 'tight' : 'free'
                                        const first = taken[0]
                                        const label = `${pick(room.name, locale)} — ${free}/${total} ${tr(S.tapeChartCellAria, locale)} ${date}`

                                        return (
                                            <td
                                                key={date}
                                                className="border-b border-[var(--cms-border)] p-0.5 text-center"
                                            >
                                                {/* Ô có khách → bấm mở đơn đầu
                                                    tiên. Ô trống render `<div>`
                                                    chứ không phải nút disabled:
                                                    nút disabled vẫn nằm trong
                                                    luồng đọc của screen reader
                                                    và làm rối điều hướng. */}
                                                {first ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => onPickBooking(first.id)}
                                                        title={label}
                                                        aria-label={label}
                                                        className={`${cellClass(tone)} w-full cursor-pointer hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--cms-accent)]`}
                                                    >
                                                        {free}
                                                    </button>
                                                ) : (
                                                    <div title={label} aria-label={label} className={cellClass(tone)}>
                                                        {free}
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

type CellTone = 'free' | 'tight' | 'full'

/**
 * Nền ô theo mức còn trống.
 *
 * Dùng đúng bộ `--cms-tone-*` mà `DotBadge` đang dùng cho badge trạng thái —
 * cùng một bảng màu cho cùng một ý nghĩa (hết = rose, sắp hết = amber, còn =
 * emerald). Không khai token mới và không hex (luật D0/P7).
 */
function cellClass(tone: CellTone): string {
    const base =
        'block rounded-[var(--cms-radius-sm)] py-1.5 text-[length:var(--cms-text-meta)] font-semibold tabular-nums transition-[filter]'
    if (tone === 'full') return `${base} bg-[var(--cms-tone-rose-bg)] text-[var(--cms-tone-rose)]`
    if (tone === 'tight') return `${base} bg-[var(--cms-tone-amber-bg)] text-[var(--cms-tone-amber)]`
    return `${base} bg-[var(--cms-tone-emerald-bg)] text-[var(--cms-tone-emerald)]`
}

function LegendSwatch({ tone, label }: { tone: CellTone; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className={`${cellClass(tone)} h-3 w-6 py-0`} />
            <span>{label}</span>
        </span>
    )
}
