'use client'

import {
    DownloadIcon,
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'
import { DataTable, useDataTable, type Column } from '@repo/ui'
import Link from 'next/link'
import { useState } from 'react'

export interface BookingRowItem {
    id: string
    code: string
    guestName: string
    phone: string
    roomType: string
    channel: 'website' | 'walk_in' | 'ota' | 'phone'
    channelLabel: string
    nights: number
    checkInDate: string
    totalAmount: number
    status: 'confirmed' | 'checked_in' | 'checked_out' | 'pending_payment' | 'cancelled'
    statusLabel: string
    creator: string
}

const RESORT_BOOKINGS: BookingRowItem[] = [
    {
        id: 'bk-0039',
        code: 'ĐH-2026-0039',
        guestName: 'Nguyễn Văn Hải',
        phone: '0912 345 678',
        roomType: 'Deluxe Ocean View (Phòng Hướng Biển)',
        channel: 'website',
        channelLabel: 'Website Trực Tuyến',
        nights: 2,
        checkInDate: '23/07/2026 14:00',
        totalAmount: 3400000,
        status: 'checked_in',
        statusLabel: 'Đang ở',
        creator: 'Lễ tân (Tuấn)',
    },
    {
        id: 'bk-0038',
        code: 'ĐH-2026-0038',
        guestName: 'Trần Thị Mai',
        phone: '0988 765 432',
        roomType: 'Bungalow Hillside (Bungalow Đồi Hill)',
        channel: 'ota',
        channelLabel: 'Agoda / Booking.com',
        nights: 3,
        checkInDate: '23/07/2026 14:00',
        totalAmount: 5100000,
        status: 'confirmed',
        statusLabel: 'Đã xác nhận',
        creator: 'Tự động (OTA)',
    },
    {
        id: 'bk-0037',
        code: 'ĐH-2026-0037',
        guestName: 'Lê Hoàng Nam',
        phone: '0903 112 233',
        roomType: 'Villa Front Sea (Biệt Thự Mặt Biển)',
        channel: 'walk_in',
        channelLabel: 'Khách Vãng Lai',
        nights: 1,
        checkInDate: '22/07/2026 15:30',
        totalAmount: 4800000,
        status: 'checked_out',
        statusLabel: 'Hoàn tất',
        creator: 'Lễ tân (Lan)',
    },
    {
        id: 'bk-0036',
        code: 'ĐH-2026-0036',
        guestName: 'Phạm Thu Hương',
        phone: '0934 556 677',
        roomType: 'Executive Suite Beachfront',
        channel: 'phone',
        channelLabel: 'Điện Thoại / Hotline',
        nights: 2,
        checkInDate: '21/07/2026 14:00',
        totalAmount: 6200000,
        status: 'checked_out',
        statusLabel: 'Hoàn tất',
        creator: 'Chủ sở hữu (Owner)',
    },
    {
        id: 'bk-0035',
        code: 'ĐH-2026-0035',
        guestName: 'Vũ Đức Cường',
        phone: '0977 889 900',
        roomType: 'Deluxe Ocean View (Phòng Hướng Biển)',
        channel: 'website',
        channelLabel: 'Website Trực Tuyến',
        nights: 2,
        checkInDate: '20/07/2026 14:00',
        totalAmount: 3400000,
        status: 'pending_payment',
        statusLabel: 'Chờ cọc',
        creator: 'Khách tự đặt',
    },
    {
        id: 'bk-0034',
        code: 'ĐH-2026-0034',
        guestName: 'Đặng Ngọc Ánh',
        phone: '0918 223 344',
        roomType: 'Bungalow Hillside (Bungalow Đồi Hill)',
        channel: 'ota',
        channelLabel: 'Agoda / Booking.com',
        nights: 1,
        checkInDate: '20/07/2026 14:00',
        totalAmount: 1700000,
        status: 'cancelled',
        statusLabel: 'Đã hủy',
        creator: 'Hệ thống OTA',
    },
    {
        id: 'bk-0033',
        code: 'ĐH-2026-0033',
        guestName: 'Hoàng Văn Minh',
        phone: '0945 667 788',
        roomType: 'Villa Front Sea (Biệt Thự Mặt Biển)',
        channel: 'phone',
        channelLabel: 'Điện Thoại / Hotline',
        nights: 3,
        checkInDate: '19/07/2026 14:00',
        totalAmount: 14400000,
        status: 'checked_out',
        statusLabel: 'Hoàn tất',
        creator: 'Lễ tân (Tuấn)',
    },
    {
        id: 'bk-0032',
        code: 'ĐH-2026-0032',
        guestName: 'Trịnh Thị Loan',
        phone: '0962 114 455',
        roomType: 'Deluxe Ocean View (Phòng Hướng Biển)',
        channel: 'website',
        channelLabel: 'Website Trực Tuyến',
        nights: 2,
        checkInDate: '18/07/2026 14:00',
        totalAmount: 3400000,
        status: 'checked_out',
        statusLabel: 'Hoàn tất',
        creator: 'Khách tự đặt',
    },
]

export default function AdminDashboard() {
    const [search, setSearch] = useState('')
    const [dateRange, setDateRange] = useState('30days')
    const [channelFilter, setChannelFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const columns: Column<BookingRowItem>[] = [
        {
            key: 'channel',
            header: 'KÊNH ĐẶT',
            width: '160px',
            cell: (row) => {
                const toneMap: Record<string, string> = {
                    website: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    walk_in: 'bg-blue-50 text-blue-700 border-blue-200',
                    ota: 'bg-purple-50 text-purple-700 border-purple-200',
                    phone: 'bg-amber-50 text-amber-700 border-amber-200',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[144px] text-left shrink-0 ${toneMap[row.channel] || 'bg-slate-100'}`}>
                        {row.channel === 'website' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                        {row.channel === 'walk_in' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                        {row.channel === 'ota' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />}
                        {row.channel === 'phone' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                        <span className="truncate">{row.channelLabel}</span>
                    </span>
                )
            },

        },
        {
            key: 'guestName',
            header: 'KHÁCH HÀNG & MÃ ĐƠN',
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                        {row.guestName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                        {row.code} · {row.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'roomType',
            header: 'HẠNG PHÒNG',
            cell: (row) => <span className="text-slate-700 font-medium text-xs">{row.roomType}</span>,
        },
        {
            key: 'nights',
            header: 'SỐ ĐÊM',
            sortable: true,
            width: '90px',
            align: 'center',
            cell: (row) => <span className="text-slate-700 font-semibold text-xs">{row.nights} đêm</span>,
        },
        {
            key: 'checkInDate',
            header: 'NGÀY CHECK-IN',
            sortable: true,
            width: '160px',
            cell: (row) => <span className="text-slate-600 text-xs">{row.checkInDate}</span>,
        },
        {
            key: 'status',
            header: 'TRẠNG THÁI',
            width: '130px',
            cell: (row) => {
                const statusStyles: Record<string, string> = {
                    checked_in: 'bg-blue-50 text-blue-700 border-blue-200',
                    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
                    checked_out: 'bg-slate-100 text-slate-700 border-slate-200',
                    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                }
                const dotStyles: Record<string, string> = {
                    checked_in: 'bg-blue-500',
                    confirmed: 'bg-emerald-500',
                    pending_payment: 'bg-amber-500',
                    checked_out: 'bg-slate-500',
                    cancelled: 'bg-rose-500',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[108px] text-left shrink-0 ${statusStyles[row.status] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[row.status] || 'bg-slate-400'}`} />
                        <span className="truncate">{row.statusLabel}</span>
                    </span>
                )
            },
        },


        {
            key: 'totalAmount',
            header: 'TỔNG TIỀN',
            sortable: true,
            align: 'right',
            width: '130px',
            cell: (row) => (
                <span className="font-bold text-slate-900 text-xs">
                    {row.totalAmount.toLocaleString('vi-VN')}đ
                </span>
            ),
        },
        {
            key: 'action',
            header: 'THAO TÁC',
            align: 'right',
            width: '120px',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1 text-slate-500">
                    <Link
                        href={`/admin/orders/${row.id}`}
                        className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                        title="Xem chi tiết"
                    >
                        <EyeIcon size={16} />
                    </Link>
                    <button type="button" className="p-1 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors" title="In hóa đơn">
                        <DownloadIcon size={16} />
                    </button>
                    <button type="button" className="p-1 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors" title="Chỉnh sửa">
                        <PencilIcon size={16} />
                    </button>
                    <button type="button" className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors" title="Hủy đơn">
                        <TrashIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    const filteredData = RESORT_BOOKINGS.filter((item) => {
        if (search) {
            const q = search.toLowerCase()
            const matchName = item.guestName.toLowerCase().includes(q)
            const matchCode = item.code.toLowerCase().includes(q)
            const matchPhone = item.phone.includes(q)
            if (!matchName && !matchCode && !matchPhone) return false
        }
        if (channelFilter !== 'all' && item.channel !== channelFilter) return false
        if (statusFilter !== 'all' && item.status !== statusFilter) return false
        return true
    })

    const { tableProps } = useDataTable<BookingRowItem>({
        data: filteredData,
        columns,
        rowKey: (row) => row.id,
        selectable: true,
        pageSize: 10,
    })

    const handleReset = () => {
        setSearch('')
        setDateRange('30days')
        setChannelFilter('all')
        setStatusFilter('all')
    }

    const stats = {
        total: filteredData.length,
        totalRevenue: filteredData.reduce((acc, curr) => acc + curr.totalAmount, 0),
        website: filteredData.filter((i) => i.channel === 'website').length,
        websiteRev: filteredData.filter((i) => i.channel === 'website').reduce((acc, curr) => acc + curr.totalAmount, 0),
        walkIn: filteredData.filter((i) => i.channel === 'walk_in').length,
        walkInRev: filteredData.filter((i) => i.channel === 'walk_in').reduce((acc, curr) => acc + curr.totalAmount, 0),
        ota: filteredData.filter((i) => i.channel === 'ota').length,
        otaRev: filteredData.filter((i) => i.channel === 'ota').reduce((acc, curr) => acc + curr.totalAmount, 0),
        phone: filteredData.filter((i) => i.channel === 'phone').length,
        phoneRev: filteredData.filter((i) => i.channel === 'phone').reduce((acc, curr) => acc + curr.totalAmount, 0),
    }


    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 overflow-hidden">
            {/* Top Bar: Title + All Filters & Actions in Header */}
            <div className="w-full bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Left: Title & Count */}
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        Đặt phòng
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {stats.total} đơn
                    </span>
                </div>

                {/* Right: All Filters & Actions in Header */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* Search Field */}
                    <div className="relative w-44 sm:w-56">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm mã đơn, tên, sđt…"
                            className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                        <div className="absolute left-2 top-1.5 text-slate-400">
                            <EyeIcon size={13} />
                        </div>
                    </div>

                    {/* Date Range Select */}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="30days">30 ngày qua</option>
                        <option value="7days">7 ngày qua</option>
                        <option value="today">Hôm nay</option>
                    </select>

                    {/* Channel Select */}
                    <select
                        value={channelFilter}
                        onChange={(e) => setChannelFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">Tất cả kênh</option>
                        <option value="website">Website Trực Tuyến</option>
                        <option value="walk_in">Khách Vãng Lai</option>
                        <option value="ota">Agoda / Booking.com</option>
                        <option value="phone">Hotline / Điện thoại</option>
                    </select>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="checked_in">Đang ở</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="pending_payment">Chờ cọc</option>
                        <option value="checked_out">Hoàn tất</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>

                    {/* Reset Button */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-2 py-1 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                    >
                        Đặt lại
                    </button>

                    {/* Primary Action Button */}
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-md transition-all shadow-sm active:scale-[0.98] shrink-0 min-h-[32px]"
                    >
                        <PlusIcon size={14} />
                        <span>+ Đặt phòng mới</span>
                    </Link>
                </div>
            </div>

            {/* Channel KPI Statistics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 shrink-0">
                {/* Total Stats */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        TẤT CẢ KÊNH
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.total} đơn</span>
                        <span className="text-[11px] font-semibold text-amber-700">
                            {stats.totalRevenue.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                {/* Website Stats */}
                <div className="bg-white p-2 rounded-sm border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            WEBSITE TRỰC TUYẾN
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.website} đơn</span>
                        <span className="text-[11px] font-semibold text-emerald-700">
                            {stats.websiteRev.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                {/* Walk-in Stats */}
                <div className="bg-white p-2 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            KHÁCH VÃNG LAI
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.walkIn} đơn</span>
                        <span className="text-[11px] font-semibold text-blue-700">
                            {stats.walkInRev.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                {/* OTA Stats */}
                <div className="bg-white p-2 rounded-sm border border-purple-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                            AGODA / BOOKING (OTA)
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.ota} đơn</span>
                        <span className="text-[11px] font-semibold text-purple-700">
                            {stats.otaRev.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                {/* Hotline Stats */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                            HOTLINE / ĐIỆN THOẠI
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.phone} đơn</span>
                        <span className="text-[11px] font-semibold text-amber-700">
                            {stats.phoneRev.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>
            </div>

            {/* DataTable Component - Maximized Full Height */}
            <div className="w-full flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <DataTable {...tableProps} />
            </div>
        </div>
    )
}




