'use client'

/**
 * Buồng phòng — tình trạng từng phòng vật lý.
 *
 * Không có màn này thì lễ tân phải gọi điện hỏi buồng phòng xem phòng nào dọn
 * xong, và không gán được phòng lúc khách đến.
 */

import { useMemo, useState } from 'react'
import { getPropertySync, pick } from '@repo/core'
import type { RoomUnitStatus } from '@repo/core'
import { Badge, StatCard } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { S, tr, UNIT_STATUS_LABEL, UNIT_STATUS_TONE } from '@/strings'

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
    const roomUnits = useBookingStore((s) => s.roomUnits)
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

    const statusCardStyles: Record<RoomUnitStatus, { bg: string; border: string; text: string; dot: string; hover: string }> = {
        available: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-300',
            text: 'text-emerald-900',
            dot: 'bg-emerald-500',
            hover: 'hover:bg-emerald-100/80 hover:border-emerald-400',
        },
        occupied: {
            bg: 'bg-blue-50/80',
            border: 'border-blue-200',
            text: 'text-blue-900',
            dot: 'bg-blue-500',
            hover: 'cursor-not-allowed opacity-90',
        },
        dirty: {
            bg: 'bg-rose-50',
            border: 'border-rose-300',
            text: 'text-rose-900',
            dot: 'bg-rose-500',
            hover: 'hover:bg-rose-100/80 hover:border-rose-400',
        },
        cleaning: {
            bg: 'bg-amber-50',
            border: 'border-amber-300',
            text: 'text-amber-900',
            dot: 'bg-amber-500',
            hover: 'hover:bg-amber-100/80 hover:border-amber-400',
        },
        maintenance: {
            bg: 'bg-slate-100',
            border: 'border-slate-300',
            text: 'text-slate-800',
            dot: 'bg-slate-500',
            hover: 'hover:bg-slate-200 hover:border-slate-400',
        },
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-2.5 p-3 bg-slate-100 overflow-hidden">
            {/* Top Bar: Title + All Filters & Actions in Header */}
            <div className="w-full bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0">
                {/* Left: Title & Count */}
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        {tr(S.housekeeping, locale)}
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {filteredUnits.length} {pick({ vi: 'phòng', en: 'rooms' }, locale)}
                    </span>
                </div>

                {/* Right: All Filters & Actions */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* Search Field */}
                    <div className="relative w-44 sm:w-56">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={pick({ vi: 'Tìm mã phòng (P-101)…', en: 'Search room code…' }, locale)}
                            className="w-full pl-3 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                    </div>

                    {/* Room Type Select */}
                    <select
                        value={roomTypeFilter}
                        onChange={(e) => setRoomTypeFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">{pick({ vi: 'Tất cả hạng phòng', en: 'All room types' }, locale)}</option>
                        {property.rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                                {pick(r.name, locale)}
                            </option>
                        ))}
                    </select>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as RoomUnitStatus | 'all')}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">{pick({ vi: 'Tất cả trạng thái', en: 'All statuses' }, locale)}</option>
                        {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {tr(UNIT_STATUS_LABEL[s], locale)}
                            </option>
                        ))}
                    </select>

                    {/* Reset Button */}
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-2 py-1 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                        >
                            {tr(S.reset, locale)}
                        </button>
                    )}
                </div>
            </div>

            {/* Housekeeping KPI Statistics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 shrink-0">
                {/* Total Rooms */}
                <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`p-2.5 rounded-sm border shadow-sm flex flex-col justify-between text-left transition-all ${
                        statusFilter === 'all'
                            ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-white border-amber-200 hover:border-amber-300'
                    }`}
                >
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {pick({ vi: 'TẤT CẢ PHÒNG', en: 'ALL ROOMS' }, locale)}
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{counts.total} phòng</span>
                    </div>
                </button>

                {/* Available Rooms */}
                <button
                    type="button"
                    onClick={() => setStatusFilter('available')}
                    className={`p-2.5 rounded-sm border shadow-sm flex flex-col justify-between text-left transition-all ${
                        statusFilter === 'available'
                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-white border-emerald-200 hover:border-emerald-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            SẴN SÀNG đón khách
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{counts.available} phòng</span>
                    </div>
                </button>

                {/* Occupied Rooms */}
                <button
                    type="button"
                    onClick={() => setStatusFilter('occupied')}
                    className={`p-2.5 rounded-sm border shadow-sm flex flex-col justify-between text-left transition-all ${
                        statusFilter === 'occupied'
                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-white border-blue-200 hover:border-blue-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            ĐANG CÓ KHÁCH
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{counts.occupied} phòng</span>
                    </div>
                </button>

                {/* Dirty / Cleaning Rooms */}
                <button
                    type="button"
                    onClick={() => setStatusFilter('dirty')}
                    className={`p-2.5 rounded-sm border shadow-sm flex flex-col justify-between text-left transition-all ${
                        statusFilter === 'dirty' || statusFilter === 'cleaning'
                            ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500'
                            : 'bg-white border-rose-200 hover:border-rose-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                            CẦN DỌN / ĐANG DỌN
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">
                            {counts.dirty + counts.cleaning} phòng
                        </span>
                    </div>
                </button>

                {/* Maintenance Rooms */}
                <button
                    type="button"
                    onClick={() => setStatusFilter('maintenance')}
                    className={`p-2.5 rounded-sm border shadow-sm flex flex-col justify-between text-left transition-all ${
                        statusFilter === 'maintenance'
                            ? 'bg-slate-100 border-slate-500 ring-1 ring-slate-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                            BẢO TRÌ
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{counts.maintenance} phòng</span>
                    </div>
                </button>
            </div>


            {/* Room List Content - Flex-1 Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 custom-scrollbar pr-0.5">
                {byRoomType.map(({ room, allUnits, units }) => {
                    const availCount = allUnits.filter((u) => u.status === 'available').length
                    const occupiedCount = allUnits.filter((u) => u.status === 'occupied').length
                    const dirtyCount = allUnits.filter((u) => u.status === 'dirty' || u.status === 'cleaning').length

                    return (
                        <section
                            key={room.id}
                            className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm space-y-2.5"
                        >
                            {/* Room Type Title & Quick Count Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-slate-900">
                                        {pick(room.name, locale)}
                                    </h2>
                                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                                        {allUnits.length} phòng
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                    <span className="text-emerald-700 font-semibold">{availCount} Sẵn sàng</span>
                                    <span>·</span>
                                    <span className="text-blue-700 font-semibold">{occupiedCount} Đang ở</span>
                                    {dirtyCount > 0 && (
                                        <>
                                            <span>·</span>
                                            <span className="text-rose-600 font-semibold">{dirtyCount} Cần dọn</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Room Units Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {units.map((unit) => {
                                    const locked = unit.status === 'occupied'
                                    const style = statusCardStyles[unit.status]
                                    const nextStatus = NEXT_STATUS[unit.status]

                                    return (
                                        <button
                                            key={unit.id}
                                            type="button"
                                            disabled={locked}
                                            onClick={() => setUnitStatus(unit.id, nextStatus)}
                                            title={
                                                locked
                                                    ? 'Phòng đang có khách (Trả phòng ở trang Đặt phòng)'
                                                    : `Chuyển sang: ${tr(UNIT_STATUS_LABEL[nextStatus], locale)}`
                                            }
                                            className={`p-2.5 rounded-md border text-left transition-all flex flex-col justify-between min-h-[76px] ${style.bg} ${style.border} ${style.text} ${style.hover}`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-sm font-extrabold tracking-tight">
                                                    {unit.code}
                                                </span>
                                                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-[4px] border bg-white/80 border-slate-200/80 shadow-2xs">
                                                    {tr(UNIT_STATUS_LABEL[unit.status], locale)}
                                                </span>

                                                {!locked && (
                                                    <span className="text-[10px] text-slate-500 font-medium hover:underline">
                                                        → {tr(UNIT_STATUS_LABEL[nextStatus], locale)}
                                                    </span>
                                                )}
                                                {locked && (
                                                    <span className="text-[10px] text-blue-600 font-medium">
                                                        Khóa
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
                    <div className="p-12 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-xs font-medium">
                        {pick(
                            {
                                vi: 'Không có phòng nào ở tình trạng này. Bấm lại ô đã chọn để bỏ lọc.',
                                en: 'No rooms in this status. Click the selected card again to clear the filter.',
                            },
                            locale,
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

