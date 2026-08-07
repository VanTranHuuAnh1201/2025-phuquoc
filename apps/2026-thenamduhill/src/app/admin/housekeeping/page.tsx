'use client'

/**
 * Buồng phòng — tình trạng từng phòng vật lý.
 *
 * Không có màn này thì lễ tân phải gọi điện hỏi buồng phòng xem phòng nào dọn
 * xong, và không gán được phòng lúc khách đến.
 *
 * Áp design system `@repo/cms-ui`: `PageHeaderBar` (title+count, ô tìm ở
 * `actions`) → `FilterBar` (pill hạng phòng + trạng thái, cùng hàng filter
 * dưới header) → `MetricStrip`/`KpiCard` (5 ô đếm liền mạch, bấm để lọc) →
 * lưới thẻ `RoomUnit` theo từng hạng phòng, `DotBadge` cho trạng thái. Đây
 * KHÔNG phải `DataGrid` — đơn vị hiển thị là NÚT bấm để chuyển trạng thái kế
 * tiếp (click-to-advance), không phải hàng để xem chi tiết, nên tự viết layout
 * lưới bằng token `--cms-*` thay vì ép vào `DataGrid`.
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
import { DotBadge, FilterBar, InlineAlert, KpiCard, MetricStrip, PageHeaderBar } from '@repo/cms-ui'
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

const ALL_STATUSES: RoomUnitStatus[] = [
    'available',
    'occupied',
    'dirty',
    'cleaning',
    'maintenance',
]

export default function HousekeepingPage() {
    const { locale } = useLocale()
    const { roomUnits } = useBookingsData()
    const setUnitStatus = useBookingStore((s) => s.setUnitStatus)
    const property = getPropertySync()

    const [search, setSearch] = useState('')
    const [roomTypeFilter, setRoomTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState<RoomUnitStatus | 'all'>('all')

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

    const filteredUnits = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return roomUnits.filter((u) => {
            if (statusFilter !== 'all' && u.status !== statusFilter) return false
            if (roomTypeFilter !== 'all' && u.roomTypeId !== roomTypeFilter) return false
            if (needle) {
                const room = property.rooms.find((r) => r.id === u.roomTypeId)
                const roomNameStr = room ? pick(room.name, locale).toLowerCase() : ''
                const matchCode = u.code.toLowerCase().includes(needle)
                const matchRoom = roomNameStr.includes(needle)
                if (!matchCode && !matchRoom) return false
            }
            return true
        })
    }, [roomUnits, statusFilter, roomTypeFilter, search, property.rooms, locale])

    const byRoomType = useMemo(() => {
        return property.rooms
            .map((room) => {
                const roomTypeUnits = filteredUnits.filter((u) => u.roomTypeId === room.id)
                return {
                    room,
                    allUnits: roomUnits.filter((u) => u.roomTypeId === room.id),
                    units: roomTypeUnits,
                }
            })
            .filter((group) => group.units.length > 0)
    }, [property.rooms, filteredUnits, roomUnits])

    // Pill hạng phòng cho `FilterBar` — B0 chốt mỗi property chỉ có 5-8 hạng,
    // nên pill rời (không phải dropdown) vẫn gọn trong một hàng.
    const roomTypeGroups = [
        {
            legend: tr(S.allRoomTypes, locale),
            value: roomTypeFilter,
            onChange: setRoomTypeFilter,
            options: [
                { value: 'all', label: tr(S.allRoomTypes, locale) },
                ...property.rooms.map((r) => ({ value: r.id, label: pick(r.name, locale) })),
            ],
        },
        {
            legend: tr(S.allStatuses, locale),
            value: statusFilter,
            onChange: (v: string) => setStatusFilter(v as RoomUnitStatus | 'all'),
            options: [
                { value: 'all', label: tr(S.allStatuses, locale) },
                ...ALL_STATUSES.map((st) => ({ value: st, label: tr(UNIT_STATUS_LABEL[st], locale) })),
            ],
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: title + đếm ở trái · ô tìm mã phòng ở phải (actions) —
                `FilterBar` không có ô tìm tự do (chỉ nhận pill giá trị rời
                rạc), nên ô tìm là input tự viết, dùng token `--cms-*`. */}
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

            {/* HÀNG 2: pill hạng phòng + trạng thái, kết quả + Đặt lại ở cuối
                hàng — dùng đúng `resultText`/`onReset` có sẵn của `FilterBar`. */}
            <div className="cms-row-filters border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3">
                <FilterBar
                    groups={roomTypeGroups}
                    resultText={`${filteredUnits.length} ${tr(S.housekeepingRoomSuffix, locale)}`}
                    onReset={isFiltered ? handleReset : undefined}
                />
            </div>

            {/* 5 KPI liền mạch, bấm để lọc — thay 5 card rời tự vẽ trước đó. */}
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
                        label={tr(S.housekeepingDirtyShort, locale)}
                        value={`${counts.dirty + counts.cleaning}`}
                        tone="rose"
                        selected={statusFilter === 'dirty' || statusFilter === 'cleaning'}
                        onClick={() => setStatusFilter('dirty')}
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

            {/* Lưới thẻ theo từng hạng phòng — vùng nội dung chính, chiếm hết
                chỗ còn lại (flex-1, tự cuộn). */}
            <div className="flex-1 min-h-0 overflow-y-auto px-[var(--cms-pad)] py-3 space-y-3">
                {byRoomType.map(({ room, allUnits, units }) => {
                    const availCount = allUnits.filter((u) => u.status === 'available').length
                    const occupiedCount = allUnits.filter((u) => u.status === 'occupied').length
                    const dirtyCount = allUnits.filter((u) => u.status === 'dirty' || u.status === 'cleaning').length

                    return (
                        <section key={room.id} className="border border-[var(--cms-border)] rounded-[var(--cms-radius)]">
                            {/* Header nhẹ của section — đường kẻ 1px, không shadow. */}
                            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-[var(--cms-border)]">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text)]">
                                        {pick(room.name, locale)}
                                    </h2>
                                    <span className="rounded-[var(--cms-radius-sm)] bg-[var(--cms-bg-subtle)] px-2 py-0.5 text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)] tabular-nums">
                                        {allUnits.length} {tr(S.housekeepingRoomSuffix, locale)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-[length:var(--cms-text-meta)] font-medium text-[var(--cms-text-muted)]">
                                    <span className="font-semibold text-[var(--cms-tone-emerald)]">
                                        {availCount} {tr(S.housekeepingAvailableShort, locale)}
                                    </span>
                                    <span>·</span>
                                    <span className="font-semibold text-[var(--cms-tone-blue)]">
                                        {occupiedCount} {tr(S.housekeepingOccupiedShort, locale)}
                                    </span>
                                    {dirtyCount > 0 && (
                                        <>
                                            <span>·</span>
                                            <span className="font-semibold text-[var(--cms-tone-rose)]">
                                                {dirtyCount} {tr(S.housekeepingDirtyShort, locale)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Lưới phòng vật lý — mỗi ô vừa hiển thị trạng thái vừa
                                là nút bấm để chuyển sang trạng thái kế tiếp. */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-3">
                                {units.map((unit) => {
                                    const locked = unit.status === 'occupied'
                                    const tone = UNIT_STATUS_CMS_TONE[unit.status]
                                    const nextStatus = NEXT_STATUS[unit.status]

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
                                            className={`flex flex-col justify-between gap-2 min-h-[76px] rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                                locked
                                                    ? 'cursor-not-allowed opacity-90'
                                                    : 'hover:bg-[var(--cms-bg-subtle)] cursor-pointer'
                                            }`}
                                        >
                                            <span className="text-[length:var(--cms-text-body)] font-bold tracking-tight text-[var(--cms-text)]">
                                                {unit.code}
                                            </span>

                                            <div className="flex items-center justify-between gap-1">
                                                <DotBadge tone={tone} label={tr(UNIT_STATUS_LABEL[unit.status], locale)} />
                                                {!locked && (
                                                    <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] font-medium">
                                                        → {tr(UNIT_STATUS_LABEL[nextStatus], locale)}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}

                {byRoomType.length === 0 && (
                    <InlineAlert tone="slate">{tr(S.housekeepingEmpty, locale)}</InlineAlert>
                )}
            </div>
        </div>
    )
}
