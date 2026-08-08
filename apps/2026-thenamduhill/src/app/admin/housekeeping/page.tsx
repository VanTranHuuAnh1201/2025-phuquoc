'use client'

/**
 * Buồng phòng — tình trạng từng phòng vật lý.
 *
 * Không có màn này thì lễ tân phải gọi điện hỏi buồng phòng xem phòng nào dọn
 * xong, và không gán được phòng lúc khách đến.
 *
 * THIẾT KẾ LẠI (phản hồi chủ dự án — xem hình chụp `e2e-out/all-housekeeping.png`):
 * bản trước lọc hạng phòng bằng 20 PILL TRÀN NGANG khỏi màn hình, và nhóm 120
 * phòng thành 20 khối THEO HẠNG — muốn biết "phòng nào cần dọn" phải cuộn qua
 * cả 20 khối. Sai với việc buồng phòng thật sự làm: buồng phòng nghĩ theo
 * TRẠNG THÁI ("còn bao nhiêu phòng cần dọn"), không theo hạng phòng.
 *
 * Ba thay đổi chính:
 * 1. Hạng phòng lọc bằng `<select>` gọn — đúng mẫu đã dùng ở màn Lịch tồn kho
 *    (`inventory/page.tsx`), không phải dải pill.
 * 2. MẶC ĐỊNH nhóm theo TRẠNG THÁI (5 nhóm cố định, "Cần dọn" luôn đứng đầu
 *    và có viền nhấn `--cms-tone-rose` — việc phải làm ngay). Có `<select>`
 *    nhỏ đổi sang nhóm theo hạng phòng khi cần (vd: quản lý muốn xem tổng
 *    quan một hạng phòng cụ thể).
 * 3. Thẻ phòng gọn lại nhiều — chỉ mã phòng + chấm trạng thái ở trạng thái
 *    nghỉ; nút hành động chỉ hiện khi hover/focus (không chiếm chỗ khi
 *    không dùng), nên nhét được nhiều cột hơn trên một hàng.
 *
 * Vẫn dùng `PageHeaderBar` (title+count, ô tìm ở `actions`) → hàng filter
 * (select hạng phòng + select cách nhóm + kết quả + Đặt lại) → `MetricStrip`/
 * `KpiCard` (bấm để lọc) → lưới thẻ phòng. Đơn vị hiển thị vẫn là NÚT bấm để
 * chuyển trạng thái kế tiếp (click-to-advance), không phải hàng `DataGrid`.
 *
 * Nền TRẮNG, phân tách bằng đường kẻ 1px — không `bg-slate-100`, không card
 * lồng card, không shadow trang trí (đúng phong cách `/admin` dashboard).
 */

import { useLocale } from '@/components/LocaleProvider'
import { useBookingsData } from '@/hooks/useAdminData'
import { useBookingStore } from '@/stores/booking.store'
import { S, tr, UNIT_STATUS_CMS_TONE, UNIT_STATUS_LABEL } from '@/strings'
import type { RoomUnitStatus } from '@repo/core'
import { getPropertySync, pick } from '@repo/core'
import { DotBadge, InlineAlert, KpiCard, MetricStrip, PageHeaderBar } from '@repo/cms-ui'
import { useMemo, useState } from 'react'

/** Vòng chuyển tình trạng: bấm một phòng là sang bước tiếp theo. */
const NEXT_STATUS: Record<RoomUnitStatus, RoomUnitStatus> = {
    dirty: 'cleaning',
    cleaning: 'available',
    available: 'maintenance',
    maintenance: 'available',
    // Phòng đang có khách chỉ đổi qua luồng trả phòng, không bấm tay ở đây.
    occupied: 'occupied',
}

/** Nhãn nút hành động theo từng bước chuyển — thay cho "→ Bảo trì" chung
 *  chung trước đó, để lễ tân đọc được NGAY hành động sẽ xảy ra khi bấm. */
const NEXT_ACTION_LABEL: Partial<Record<RoomUnitStatus, { vi: string; en: string }>> = {
    dirty: S.housekeepingStartCleaning,
    cleaning: S.housekeepingMarkClean,
    available: S.housekeepingSendMaintenance,
    maintenance: S.housekeepingBackToService,
}

const ALL_STATUSES: RoomUnitStatus[] = [
    'dirty',
    'cleaning',
    'occupied',
    'available',
    'maintenance',
]

/** Thứ tự nhóm khi xem theo TRẠNG THÁI — "Cần dọn"/"Đang dọn" đứng đầu vì đó
 *  là việc buồng phòng phải xử lý ngay; "Bảo trì" đứng cuối vì không phải
 *  việc thường nhật. */
const STATUS_GROUP_ORDER: RoomUnitStatus[] = [
    'dirty',
    'cleaning',
    'available',
    'occupied',
    'maintenance',
]

type GroupBy = 'status' | 'roomType'

export default function HousekeepingPage() {
    const { locale } = useLocale()
    const { roomUnits } = useBookingsData()
    const setUnitStatus = useBookingStore((s) => s.setUnitStatus)
    const property = getPropertySync()

    const [search, setSearch] = useState('')
    const [roomTypeFilter, setRoomTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState<RoomUnitStatus | 'all'>('all')
    // Mặc định nhóm theo TRẠNG THÁI — đúng cách buồng phòng nghĩ về công việc
    // ("còn phòng nào cần dọn"), không phải theo hạng phòng.
    const [groupBy, setGroupBy] = useState<GroupBy>('status')

    const isFiltered = search !== '' || roomTypeFilter !== 'all' || statusFilter !== 'all'

    const handleReset = () => {
        setSearch('')
        setRoomTypeFilter('all')
        setStatusFilter('all')
    }

    const counts = useMemo(() => {
        const result = {
            total: roomUnits.length,
            available: 0,
            occupied: 0,
            dirty: 0,
            cleaning: 0,
            maintenance: 0,
        }
        for (const unit of roomUnits) {
            if (unit.status in result) {
                result[unit.status as keyof typeof result] += 1
            }
        }
        return result
    }, [roomUnits])

    const needsCleaning = counts.dirty + counts.cleaning

    const roomName = (roomTypeId: string) => {
        const room = property.rooms.find((r) => r.id === roomTypeId)
        return room ? pick(room.name, locale) : roomTypeId
    }

    const filteredUnits = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return roomUnits.filter((u) => {
            if (statusFilter !== 'all' && u.status !== statusFilter) return false
            if (roomTypeFilter !== 'all' && u.roomTypeId !== roomTypeFilter) return false
            if (needle) {
                const roomNameStr = roomName(u.roomTypeId).toLowerCase()
                const matchCode = u.code.toLowerCase().includes(needle)
                const matchRoom = roomNameStr.includes(needle)
                if (!matchCode && !matchRoom) return false
            }
            return true
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomUnits, statusFilter, roomTypeFilter, search, property.rooms, locale])

    // Nhóm theo TRẠNG THÁI (mặc định) — 5 nhóm cố định theo `STATUS_GROUP_ORDER`,
    // ẩn nhóm rỗng để không tốn chỗ cho "0 phòng".
    const byStatus = useMemo(() => {
        return STATUS_GROUP_ORDER.map((status) => ({
            key: status,
            title: tr(UNIT_STATUS_LABEL[status], locale),
            units: filteredUnits.filter((u) => u.status === status),
        })).filter((group) => group.units.length > 0)
    }, [filteredUnits, locale])

    // Nhóm theo HẠNG PHÒNG — giữ lại cho lúc quản lý cần xem tổng quan một
    // hạng phòng cụ thể, chọn bằng select "Xem theo".
    const byRoomType = useMemo(() => {
        return property.rooms
            .map((room) => ({
                key: room.id,
                title: pick(room.name, locale),
                units: filteredUnits.filter((u) => u.roomTypeId === room.id),
            }))
            .filter((group) => group.units.length > 0)
    }, [property.rooms, filteredUnits, locale])

    const groups = groupBy === 'status' ? byStatus : byRoomType

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: title + đếm ở trái · ô tìm mã phòng ở phải (actions) —
                ô tìm là input tự viết, dùng token `--cms-*`. */}
            <PageHeaderBar
                title={tr(S.housekeeping, locale)}
                count={{ value: filteredUnits.length, suffix: tr(S.housekeepingRoomSuffix, locale) }}
                actions={
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={tr(S.housekeepingSearchPlaceholder, locale)}
                        aria-label={tr(S.housekeepingSearchAria, locale)}
                        className="w-44 sm:w-56 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 py-1.5 text-[length:var(--cms-text-body)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    />
                }
            />

            {/* HÀNG 2: select hạng phòng + select trạng thái + select cách
                nhóm, kết quả + Đặt lại đẩy về cuối hàng — cùng mẫu `<select>`
                gọn đã dùng ở màn Lịch tồn kho (`inventory/page.tsx`), THAY
                cho 20 pill hạng phòng tràn ngang trước đó. */}
            <div className="cms-row-filters flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3">
                <select
                    value={roomTypeFilter}
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                    aria-label={tr(S.housekeepingRoomTypeAria, locale)}
                    className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                >
                    <option value="all">{tr(S.allRoomTypes, locale)}</option>
                    {property.rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                            {pick(r.name, locale)}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as RoomUnitStatus | 'all')}
                    aria-label={tr(S.filterStatusAria, locale)}
                    className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                >
                    <option value="all">{tr(S.allStatuses, locale)}</option>
                    {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                            {tr(UNIT_STATUS_LABEL[st], locale)}
                        </option>
                    ))}
                </select>

                {/* Ngăn cách trực quan giữa cụm LỌC (trên) và cụm NHÓM (dưới) —
                    một đường kẻ dọc mảnh, không phải khoảng trắng đơn thuần,
                    vì chúng là hai loại điều khiển khác nhau. */}
                <span className="h-5 w-px bg-[var(--cms-border)]" aria-hidden="true" />

                <label className="flex items-center gap-1.5 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                    {tr(S.housekeepingGroupByLabel, locale)}
                    <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                        aria-label={tr(S.housekeepingGroupByAria, locale)}
                        className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-2.5 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <option value="status">{tr(S.housekeepingGroupByStatus, locale)}</option>
                        <option value="roomType">{tr(S.housekeepingGroupByRoomType, locale)}</option>
                    </select>
                </label>

                <span className="ml-auto text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                    {filteredUnits.length} {tr(S.housekeepingRoomSuffix, locale)}
                </span>

                {isFiltered && (
                    <button
                        type="button"
                        onClick={handleReset}
                        style={{ minHeight: 24 }}
                        className="inline-flex items-center rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text-muted)] transition-colors hover:text-[var(--cms-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        {tr(S.reset, locale)}
                    </button>
                )}
            </div>

            {/* 5 KPI liền mạch, bấm để lọc. "Cần dọn" đứng gần đầu (ngay sau
                Tất cả) vì đó là con số lễ tân cần thấy trước tiên. */}
            <div className="border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2">
                <MetricStrip>
                    <KpiCard
                        label={tr(S.all, locale)}
                        value={`${counts.total}`}
                        tone="slate"
                        selected={statusFilter === 'all'}
                        onClick={() => setStatusFilter('all')}
                    />
                    <KpiCard
                        label={tr(S.housekeepingDirtyShort, locale)}
                        value={`${needsCleaning}`}
                        tone="rose"
                        selected={statusFilter === 'dirty' || statusFilter === 'cleaning'}
                        onClick={() => setStatusFilter('dirty')}
                    />
                    <KpiCard
                        label={tr(S.housekeepingAvailableShort, locale)}
                        value={`${counts.available}`}
                        tone="emerald"
                        selected={statusFilter === 'available'}
                        onClick={() => setStatusFilter('available')}
                    />
                    <KpiCard
                        label={tr(S.housekeepingOccupiedShort, locale)}
                        value={`${counts.occupied}`}
                        tone="blue"
                        selected={statusFilter === 'occupied'}
                        onClick={() => setStatusFilter('occupied')}
                    />
                    <KpiCard
                        label={tr(UNIT_STATUS_LABEL.maintenance, locale)}
                        value={`${counts.maintenance}`}
                        tone="slate"
                        selected={statusFilter === 'maintenance'}
                        onClick={() => setStatusFilter('maintenance')}
                    />
                </MetricStrip>
            </div>

            {/* Cảnh báo ưu tiên: chỉ hiện khi thật sự có phòng cần dọn và
                đang KHÔNG lọc riêng nhóm đó — nhắc lễ tân việc phải làm ngay
                mà không lặp lại con số đã có trên KPI. */}
            {needsCleaning > 0 && statusFilter === 'all' && (
                <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-2">
                    <InlineAlert tone="rose">
                        {needsCleaning} {tr(S.housekeepingNeedsAttention, locale)}
                    </InlineAlert>
                </div>
            )}

            {/* Lưới thẻ theo nhóm đã chọn — vùng nội dung chính, chiếm hết chỗ
                còn lại (flex-1, tự cuộn). */}
            <div className="flex-1 min-h-0 overflow-y-auto px-[var(--cms-pad)] py-3 space-y-3">
                {groups.map((group) => {
                    // Viền nhấn màu rose CHỈ cho nhóm "Chờ dọn"/"Đang dọn" khi
                    // đang nhóm theo trạng thái — ưu tiên thị giác đúng yêu
                    // cầu chủ dự án, không nhấn khi đang nhóm theo hạng phòng
                    // (lúc đó không có khái niệm "một nhóm là trạng thái").
                    const isUrgent =
                        groupBy === 'status' && (group.key === 'dirty' || group.key === 'cleaning')

                    return (
                        <section
                            key={group.key}
                            className={`rounded-[var(--cms-radius)] border ${
                                isUrgent ? 'border-[var(--cms-tone-rose)]' : 'border-[var(--cms-border)]'
                            }`}
                        >
                            {/* Header nhẹ của nhóm — đường kẻ 1px, không shadow. */}
                            <div
                                className={`flex items-center justify-between gap-2 px-3 py-2 border-b ${
                                    isUrgent
                                        ? 'border-[var(--cms-tone-rose)] bg-[var(--cms-tone-rose-bg)]'
                                        : 'border-[var(--cms-border)]'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <h2
                                        className={`text-[length:var(--cms-text-body)] font-semibold ${
                                            isUrgent ? 'text-[var(--cms-tone-rose)]' : 'text-[var(--cms-text)]'
                                        }`}
                                    >
                                        {group.title}
                                    </h2>
                                    <span className="rounded-[var(--cms-radius-sm)] bg-[var(--cms-bg)] px-2 py-0.5 text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)] tabular-nums">
                                        {group.units.length} {tr(S.housekeepingRoomSuffix, locale)}
                                    </span>
                                </div>
                            </div>

                            {/* Lưới phòng vật lý — mỗi ô vừa hiển thị trạng thái vừa
                                là nút bấm để chuyển sang trạng thái kế tiếp. Nhiều
                                cột hơn bản trước (đến 10 cột ở màn rộng) vì thẻ đã
                                gọn lại: mã + chấm trạng thái là đủ để nhận biết,
                                hành động chỉ hiện khi hover/focus. */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 p-2.5">
                                {group.units.map((unit) => {
                                    const locked = unit.status === 'occupied'
                                    const tone = UNIT_STATUS_CMS_TONE[unit.status]
                                    const nextStatus = NEXT_STATUS[unit.status]
                                    const actionLabel = NEXT_ACTION_LABEL[unit.status]

                                    return (
                                        <button
                                            key={unit.id}
                                            type="button"
                                            disabled={locked}
                                            onClick={() => setUnitStatus(unit.id, nextStatus)}
                                            title={
                                                locked
                                                    ? tr(S.housekeepingLocked, locale)
                                                    : `${tr(S.housekeepingNextStatus, locale)}: ${tr(UNIT_STATUS_LABEL[nextStatus], locale)}`
                                            }
                                            // Nhóm theo hạng phòng thì mã phòng không tự
                                            // giải thích hạng nào — thêm tên hạng vào
                                            // `title` (tooltip) để vẫn tra được, không
                                            // in thêm chữ trên thẻ (giữ thẻ gọn).
                                            aria-label={
                                                groupBy === 'roomType'
                                                    ? unit.code
                                                    : `${unit.code} · ${roomName(unit.roomTypeId)}`
                                            }
                                            className={`group relative flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-1.5 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                                locked
                                                    ? 'cursor-not-allowed opacity-90'
                                                    : 'hover:bg-[var(--cms-bg-subtle)] cursor-pointer'
                                            }`}
                                        >
                                            <span className="text-[length:var(--cms-text-body)] font-bold tracking-tight text-[var(--cms-text)]">
                                                {unit.code}
                                            </span>

                                            <DotBadge tone={tone} label={tr(UNIT_STATUS_LABEL[unit.status], locale)} />

                                            {/* Hành động kế tiếp — chỉ hiện khi hover/focus
                                                (không chiếm chỗ lúc nghỉ), đúng yêu cầu
                                                "thẻ gọn hơn, hành động hiện khi hover".
                                                `pointer-events-none` khi ẩn để không chặn
                                                click vào chính thẻ ở dưới. */}
                                            {!locked && actionLabel && (
                                                <span
                                                    className="pointer-events-none absolute inset-x-1 bottom-1 truncate rounded-[var(--cms-radius-sm)] bg-[var(--cms-text)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[var(--cms-bg)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                                                    aria-hidden="true"
                                                >
                                                    {tr(actionLabel, locale)}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}

                {groups.length === 0 && (
                    <InlineAlert tone="slate">{tr(S.housekeepingEmpty, locale)}</InlineAlert>
                )}
            </div>
        </div>
    )
}
