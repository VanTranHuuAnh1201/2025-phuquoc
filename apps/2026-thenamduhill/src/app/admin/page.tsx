'use client'

import {
    BedIcon,
    CalendarIcon,
    EyeIcon,
    GridIcon,
    PlusIcon,
} from '@/components/icons'
import { DataTable, useDataTable, type Column } from '@repo/ui'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useBookingsData } from '@/hooks/useAdminData'
import { useBookingStore } from '@/stores/booking.store'

export interface BookingRowItem {
    id: string
    code: string
    guestName: string
    phone: string
    roomType: string
    unitNumber: string
    channel: 'website' | 'walk_in' | 'ota' | 'phone'
    channelLabel: string
    nights: number
    checkInDate: string
    checkOutDate: string
    totalAmount: number
    paidAmount: number
    status: 'confirmed' | 'checked_in' | 'checked_out' | 'pending_payment' | 'cancelled'
    statusLabel: string
    creator: string
}

const CHANNEL_LABELS: Record<string, string> = {
    web: 'Website',
    'walk-in': 'Walk-in',
    ota: 'OTA',
    phone: 'Hotline',
}

const CHANNEL_MAP: Record<string, 'website' | 'walk_in' | 'ota' | 'phone'> = {
    web: 'website',
    'walk-in': 'walk_in',
    ota: 'ota',
    phone: 'phone',
}

const STATUS_LABELS: Record<string, string> = {
    checked_in: 'Đang ở',
    confirmed: 'Đã cọc',
    pending_payment: 'Chờ cọc',
    checked_out: 'Check-out',
    cancelled: 'Đã hủy',
    no_show: 'Vắng mặt',
}

const ROOM_TYPE_NAMES: Record<string, string> = {
    'deluxe-ocean': 'Deluxe Ocean View',
    'bungalow-hillside': 'Bungalow Hillside',
    'villa-front-sea': 'Villa Front Sea',
}

interface ActivityLog {
    id: string
    time: string
    title: string
    subtitle: string
}

const ACTIVITY_FEEDS: ActivityLog[] = [
    {
        id: '1',
        time: '09:40',
        title: 'Lê Văn Tùng — Duyệt cọc VietQR',
        subtitle: 'Chuyển khoản 1.200.000đ (#ND-39) · Villa Front Sea',
    },
    {
        id: '2',
        time: '11:05',
        title: 'Bungalow 102 — Buồng phòng báo sạch',
        subtitle: 'Đã dọn dẹp sẵn sàng bàn giao khách check-in',
    },
    {
        id: '3',
        time: '13:20',
        title: 'Đoàn Thu Hà — Check-in nhận phòng',
        subtitle: 'Đã giao chìa khóa Villa 01 · 2 đêm',
    },
    {
        id: '4',
        time: '14:10',
        title: 'Bảo trì máy lạnh P.201',
        subtitle: 'Kỹ thuật đã hoàn tất sửa chữa bộ lọc',
    },
]

export default function AdminDashboard() {
    const { bookings: rawBookings } = useBookingsData()
    const { changeStatus } = useBookingStore()

    const [activeViewMode, setActiveViewMode] = useState<'console' | 'timeline'>('console')
    const [ownerFilter, setOwnerFilter] = useState<'everyone' | 'mine' | 'team'>('everyone')
    const [segmentFilter, setSegmentFilter] = useState<'all' | 'villa' | 'bungalow' | 'deluxe'>('all')
    const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'arrivals' | 'departures'>('all')

    const [search, setSearch] = useState('')

    const bookings: BookingRowItem[] = useMemo(() => {
        return rawBookings.map((b, idx) => {
            const ch = CHANNEL_MAP[b.channel] || 'website'
            const units = ['P.101', 'P.102', 'Villa 01', 'Bungalow 03', 'P.201']
            const unitNumber = units[idx % units.length] || 'P.101'
            return {
                id: b.id,
                code: b.code,
                guestName: b.guest?.fullName || 'Khách vãng lai',
                phone: b.guest?.phone || 'N/A',
                roomType: ROOM_TYPE_NAMES[b.roomTypeId] || b.roomTypeId,
                unitNumber,
                channel: ch,
                channelLabel: CHANNEL_LABELS[b.channel] || 'Website',
                nights: b.nights || 1,
                checkInDate: b.checkIn || '2026-08-07',
                checkOutDate: b.checkOut || '2026-08-08',
                totalAmount: b.totalAmount || 0,
                paidAmount: b.depositAmount || (b.status === 'confirmed' || b.status === 'checked_in' ? b.totalAmount * 0.5 : 0),
                status: (b.status as any) || 'confirmed',
                statusLabel: STATUS_LABELS[b.status] || b.status,
                creator: b.channel === 'web' ? 'Khách tự đặt' : 'Lễ tân',
            }
        })
    }, [rawBookings])

    const staffActor = { id: 'admin-1', name: 'Lễ tân ca trực', role: 'manager' as const }

    const columns: Column<BookingRowItem>[] = [
        {
            key: 'unitNumber',
            header: 'MÃ PHÒNG & KÊNH',
            width: '140px',
            cell: (row) => (
                <div>
                    <span className="font-semibold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {row.unitNumber}
                    </span>
                    <div className="mt-1 text-[10px] text-slate-500">
                        {row.channelLabel}
                    </div>
                </div>
            ),
        },
        {
            key: 'guestName',
            header: 'KHÁCH HÀNG & SĐT',
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-semibold text-slate-900 text-xs">
                        {row.guestName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                        {row.code} · {row.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'roomType',
            header: 'HẠNG PHÒNG',
            cell: (row) => (
                <div>
                    <div className="text-slate-800 text-xs">{row.roomType}</div>
                    <div className="text-[10px] text-slate-500">{row.nights} đêm ({row.checkInDate})</div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'TRẠNG THÁI',
            width: '130px',
            cell: (row) => {
                const statusStyles: Record<string, string> = {
                    checked_in: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
                    confirmed: 'bg-slate-100 text-slate-800 border-slate-300 font-medium',
                    pending_payment: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
                    checked_out: 'bg-slate-50 text-slate-600 border-slate-200',
                    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                }
                return (
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs border rounded w-full text-center ${statusStyles[row.status] || 'bg-slate-100'}`}>
                        {row.statusLabel}
                    </span>
                )
            },
        },
        {
            key: 'totalAmount',
            header: 'TỔNG TIỀN / CÒN THIẾU',
            sortable: true,
            align: 'right',
            width: '160px',
            cell: (row) => {
                const remaining = row.totalAmount - row.paidAmount
                return (
                    <div className="text-right">
                        <div className="font-semibold text-slate-900 text-xs">
                            {row.totalAmount.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-[10px] text-slate-500">
                            {remaining > 0 ? `Thiếu: ${remaining.toLocaleString('vi-VN')}đ` : 'Đã thu đủ'}
                        </div>
                    </div>
                )
            },
        },
        {
            key: 'action',
            header: 'THAO TÁC',
            align: 'right',
            width: '160px',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    {row.status === 'pending_payment' && (
                        <button
                            type="button"
                            onClick={() => changeStatus(row.id, 'confirmed', staffActor, 'Duyệt cọc tại bàn ca trực')}
                            className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                            Duyệt cọc
                        </button>
                    )}
                    {row.status === 'confirmed' && (
                        <button
                            type="button"
                            onClick={() => changeStatus(row.id, 'checked_in', staffActor, 'Check-in tại quầy')}
                            className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                            Check-in
                        </button>
                    )}
                    {row.status === 'checked_in' && (
                        <button
                            type="button"
                            onClick={() => changeStatus(row.id, 'checked_out', staffActor, 'Check-out đóng đơn')}
                            className="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded transition-colors"
                        >
                            Check-out
                        </button>
                    )}
                    <Link
                        href={`/admin/orders/${row.id}`}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors ml-1"
                        title="Xem chi tiết"
                    >
                        <EyeIcon size={15} />
                    </Link>
                </div>
            ),
        },
    ]

    const filteredData = bookings.filter((item) => {
        if (selectedTab === 'pending' && item.status !== 'pending_payment') return false
        if (selectedTab === 'arrivals' && item.status !== 'confirmed') return false
        if (selectedTab === 'departures' && item.status !== 'checked_in') return false

        if (search) {
            const q = search.toLowerCase()
            const matchName = item.guestName.toLowerCase().includes(q)
            const matchCode = item.code.toLowerCase().includes(q)
            const matchPhone = item.phone.includes(q)
            const matchUnit = item.unitNumber.toLowerCase().includes(q)
            if (!matchName && !matchCode && !matchPhone && !matchUnit) return false
        }
        return true
    })

    const { tableProps } = useDataTable<BookingRowItem>({
        data: filteredData,
        columns,
        rowKey: (row) => row.id,
        selectable: true,
        pageSize: 10,
    })

    const stats = useMemo(() => {
        const totalRooms = 15
        const occupied = bookings.filter((b) => b.status === 'checked_in').length
        const confirmed = bookings.filter((b) => b.status === 'confirmed').length
        const pending = bookings.filter((b) => b.status === 'pending_payment').length
        const occupancyRate = Math.round(((occupied + confirmed) / totalRooms) * 100)
        const pendingCollect = bookings
            .filter((b) => b.status === 'confirmed' || b.status === 'checked_in')
            .reduce((acc, b) => acc + (b.totalAmount - b.paidAmount), 0)

        return { totalRooms, occupied, confirmed, pending, occupancyRate, pendingCollect }
    }, [bookings])

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50/50 p-1">
            {/* Top Page Header (Sales Console Exact Title Bar) */}
            <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                        OPERATIONS CONSOLE — TODAY OVERVIEW
                    </div>
                    <h1 className="text-2xl font-normal text-slate-900 tracking-tight mt-0.5">
                        Occupancy overview
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveViewMode(activeViewMode === 'console' ? 'timeline' : 'console')}
                        className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                        {activeViewMode === 'console' ? 'Sơ đồ Tape Chart ▾' : 'Bảng ca trực ▾'}
                    </button>
                    <Link
                        href="/admin/orders/new"
                        className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-2xs"
                    >
                        + Đặt phòng mới
                    </Link>
                </div>
            </div>

            {/* Horizontal Pill Filters Bar (Exact Salesforce Filter Bar) */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Owner Filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-400 text-[11px] uppercase">CA TRỰC:</span>
                        <div className="flex bg-slate-100 p-0.5 rounded-full border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setOwnerFilter('everyone')}
                                className={`px-3 py-0.5 rounded-full text-xs transition-colors ${
                                    ownerFilter === 'everyone' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Tất cả
                            </button>
                            <button
                                type="button"
                                onClick={() => setOwnerFilter('mine')}
                                className={`px-3 py-0.5 rounded-full text-xs transition-colors ${
                                    ownerFilter === 'mine' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Ca sáng
                            </button>
                            <button
                                type="button"
                                onClick={() => setOwnerFilter('team')}
                                className={`px-3 py-0.5 rounded-full text-xs transition-colors ${
                                    ownerFilter === 'team' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Ca chiều
                            </button>
                        </div>
                    </div>

                    {/* Segment Filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-400 text-[11px] uppercase">HẠNG PHÒNG:</span>
                        <div className="flex bg-slate-100 p-0.5 rounded-full border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setSegmentFilter('all')}
                                className={`px-3 py-0.5 rounded-full text-xs transition-colors ${
                                    segmentFilter === 'all' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Tất cả
                            </button>
                            <button
                                type="button"
                                onClick={() => setSegmentFilter('villa')}
                                className={`px-3 py-0.5 rounded-full text-xs transition-colors ${
                                    segmentFilter === 'villa' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Villa
                            </button>
                            <button
                                type="button"
                                onClick={() => setSegmentFilter('bungalow')}
                                className={`px-3 py-0.5 rounded-full text-xs transition-colors ${
                                    segmentFilter === 'bungalow' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Bungalow
                            </button>
                            <button
                                type="button"
                                onClick={() => setSegmentFilter('deluxe')}
                                className={`px-3 py-0.5 rounded-full text-xs transition-colors ${
                                    segmentFilter === 'deluxe' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Deluxe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-slate-500 text-xs">
                    {filteredData.length} phòng/đơn khớp điều kiện
                </div>
            </div>

            {/* 5 KPI Metric Strip Cards (Exact Salesforce Style: Unbolded Large Numbers font-normal) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
                {/* KPI 1 */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        OCCUPANCY RATE
                    </div>
                    <div className="mt-2 text-3xl font-normal text-slate-900 tracking-tight">
                        {stats.occupancyRate}%
                    </div>
                    <div className="mt-1.5 text-xs text-blue-600 font-medium">
                        ▲ 12% vs tuần trước
                    </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        CHECK-IN HÔM NAY
                    </div>
                    <div className="mt-2 text-3xl font-normal text-slate-900 tracking-tight">
                        {stats.confirmed} <span className="text-base text-slate-500 font-normal">lượt</span>
                    </div>
                    <div className="mt-1.5 text-xs text-blue-600 font-medium">
                        ▲ 2 lượt chuẩn bị nhận
                    </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        CHECK-OUT HÔM NAY
                    </div>
                    <div className="mt-2 text-3xl font-normal text-slate-900 tracking-tight">
                        {stats.occupied} <span className="text-base text-slate-500 font-normal">lượt</span>
                    </div>
                    <div className="mt-1.5 text-xs text-slate-500 font-medium">
                        Dự kiến trước 12:00
                    </div>
                </div>

                {/* KPI 4 */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        CHỜ DUYỆT CỌC
                    </div>
                    <div className="mt-2 text-3xl font-normal text-slate-900 tracking-tight">
                        {stats.pending} <span className="text-base text-slate-500 font-normal">đơn</span>
                    </div>
                    <div className="mt-1.5 text-xs text-amber-600 font-medium">
                        Cần kiểm tra VietQR
                    </div>
                </div>

                {/* KPI 5 */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        BUỒNG PHÒNG SẠCH
                    </div>
                    <div className="mt-2 text-3xl font-normal text-slate-900 tracking-tight">
                        10/15 <span className="text-base text-slate-500 font-normal">phòng</span>
                    </div>
                    <div className="mt-1.5 text-xs text-slate-500 font-medium">
                        3 bẩn · 2 bảo trì
                    </div>
                </div>
            </div>

            {/* Rhythm Operational Activity Section Header */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between shrink-0">
                <div className="text-xs text-slate-600 font-medium">
                    <span className="font-semibold text-slate-900">Rhythm today</span>, Thứ Sáu 7 Tháng 8 · Lễ tân Ca Sáng
                </div>
                <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                    <button
                        type="button"
                        onClick={() => setSelectedTab('all')}
                        className={`px-3 py-0.5 rounded transition-colors ${
                            selectedTab === 'all' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Tất cả phòng
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('arrivals')}
                        className={`px-3 py-0.5 rounded transition-colors ${
                            selectedTab === 'arrivals' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Check-in hôm nay
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('pending')}
                        className={`px-3 py-0.5 rounded transition-colors ${
                            selectedTab === 'pending' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Chờ cọc
                    </button>
                </div>
            </div>

            {/* Main Content 2-Column Split: Left Table/Timeline (65%) + Right What Moved For Me (35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0 flex-1">
                {/* Left 2 Columns: Data Table or Timeline */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden min-h-0">
                    {activeViewMode === 'console' ? (
                        <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                            <DataTable {...tableProps} />
                        </div>
                    ) : (
                        <div className="p-6 flex-1 flex flex-col justify-center items-center text-center text-slate-500">
                            <span className="text-slate-400 mb-2"><CalendarIcon size={36} /></span>
                            <div className="font-bold text-sm text-slate-800">Sơ Đồ Tồn Kho Lưới (Tape Chart Grid)</div>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm">
                                Lịch mở/khóa 15 phòng master theo từng mốc giờ và ngày. Hỗ trợ kéo thả đổi phòng trực tiếp.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right 1 Column: WHAT MOVED FOR ME Event Stream */}
                <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-2xs p-3.5 min-h-0">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            WHAT MOVED FOR ME
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                            today
                        </span>
                    </div>

                    <div className="mt-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                        {ACTIVITY_FEEDS.map((feed) => (
                            <div
                                key={feed.id}
                                className="flex gap-2.5 p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-xs"
                            >
                                <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                                    {feed.time}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-slate-800">
                                        {feed.title}
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                        {feed.subtitle}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
