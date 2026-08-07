'use client'

/**
 * Danh sách đơn hàng — bảng chính của CMS.
 *
 * Theo đúng format ở `.claude/rules/app-flows.md` §F6: tiêu đề + đếm, ô tìm,
 * bộ lọc có nút Đặt lại, chọn nhiều, badge có chữ, phân trang, trạng thái rỗng
 * nói rõ việc cần làm.
 *
 * Dưới 640px `DataTable` tự đổi bảng sang thẻ — không bọc `overflow-x` quanh
 * bảng ở đây, đó chính là thứ AC-7 cấm.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { can, formatPrice, getPropertySync, pick } from '@repo/core'
import type { Booking, BookingStatus, Channel } from '@repo/core'
import { Badge, Button, DataTable, FilterSelect, Toolbar } from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { CHANNEL_LABEL, S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'
import { DownloadIcon, EyeIcon, PlusIcon } from '@/components/icons'

const PAGE_SIZE = 10

const STATUSES: BookingStatus[] = [
    'pending_payment',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled',
    'no_show',
]

const CHANNELS: Channel[] = ['web', 'phone', 'walk-in', 'ota']

export default function AdminOrdersPage() {
    const { locale } = useLocale()
    const router = useRouter()
    const bookings = useBookingStore((s) => s.bookings)
    const user = useAuthStore((s) => s.user)
    const property = getPropertySync()

    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [roomType, setRoomType] = useState('')
    const [channel, setChannel] = useState('')
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState<string[]>([])

    const isFiltered = Boolean(search || status || roomType || channel)

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return bookings
            .filter((b) => {
                if (status && b.status !== status) return false
                if (roomType && b.roomTypeId !== roomType) return false
                if (channel && b.channel !== channel) return false
                if (!needle) return true
                return (
                    b.code.toLowerCase().includes(needle) ||
                    b.guest.fullName.toLowerCase().includes(needle) ||
                    b.guest.phone.includes(needle)
                )
            })
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }, [bookings, search, status, roomType, channel])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    const resetFilters = () => {
        setSearch('')
        setStatus('')
        setRoomType('')
        setChannel('')
        setPage(1)
    }

    // Ẩn nút KHÔNG phải bảo mật — chỉ để lễ tân đỡ bấm nhầm vào thứ sẽ bị từ
    // chối. Chặn thật nằm ở Route Handler (000-03) và RLS (000-02); bản GD1
    // chạy trên store nên chưa có lớp đó, `200-06` trả nợ này.
    const canCreate = user ? can(user.role, 'booking.create') : false
    const canViewAll = user ? can(user.role, 'booking.view.all') : false

    const roomName = (id: string) => {
        const room = property.rooms.find((r) => r.id === id)
        return room ? pick(room.name, locale) : id
    }

    // ---- xuất Excel: CSV mở được bằng Excel, không kéo thêm thư viện ----
    const exportCsv = () => {
        const rows = selected.length
            ? filtered.filter((b) => selected.includes(b.id))
            : filtered
        const header = [
            tr(S.bookingCode, locale),
            tr(S.fullName, locale),
            tr(S.phone, locale),
            tr(S.roomTypeLabel, locale),
            tr(S.checkIn, locale),
            tr(S.checkOut, locale),
            tr(S.totalAmount, locale),
            tr(S.channel, locale),
        ]
        const body = rows.map((b) => [
            b.code,
            b.guest.fullName,
            b.guest.phone,
            roomName(b.roomTypeId),
            b.checkIn,
            b.checkOut,
            String(b.totalAmount),
            tr(CHANNEL_LABEL[b.channel], locale),
        ])
        const csv = [header, ...body]
            .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
            .join('\r\n')
        // BOM để Excel đọc đúng dấu tiếng Việt.
        const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    // Hook phải nằm TRƯỚC mọi nhánh return sớm (rules-of-hooks): nhánh thiếu
    // quyền ở dưới làm số hook giữa hai lần render lệch nhau, React đọc sai ô
    // trạng thái. Đặt ở đây thì mọi nhánh đều chạy đúng thứ tự hook.
    const stats = useMemo(() => {
        return {
            total: filtered.length,
            totalRevenue: filtered.reduce((acc, curr) => acc + curr.totalAmount, 0),
            website: filtered.filter((i) => i.channel === 'web').length,
            websiteRev: filtered.filter((i) => i.channel === 'web').reduce((acc, curr) => acc + curr.totalAmount, 0),
            walkIn: filtered.filter((i) => i.channel === 'walk-in').length,
            walkInRev: filtered.filter((i) => i.channel === 'walk-in').reduce((acc, curr) => acc + curr.totalAmount, 0),
            ota: filtered.filter((i) => i.channel === 'ota').length,
            otaRev: filtered.filter((i) => i.channel === 'ota').reduce((acc, curr) => acc + curr.totalAmount, 0),
            phone: filtered.filter((i) => i.channel === 'phone').length,
            phoneRev: filtered.filter((i) => i.channel === 'phone').reduce((acc, curr) => acc + curr.totalAmount, 0),
        }
    }, [filtered])

    // Chặn thiếu quyền: đặt SAU toàn bộ hook (xem ghi chú rules-of-hooks ở trên).
    // Đây chỉ là lớp tiện lợi cho người dùng — chặn thật nằm ở Route Handler
    // bằng requirePermission() (luật BE2), không dựa vào UI.
    if (user && !canViewAll) {
        return (
            <p role="alert" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {pick(
                    {
                        vi: 'Tài khoản của bạn không có quyền xem đơn hàng.',
                        en: 'Your account cannot view bookings.',
                    },
                    locale,
                )}
            </p>
        )
    }

    const columns: Column<Booking>[] = [
        {
            key: 'channel',
            header: pick({ vi: 'KÊNH ĐẶT', en: 'CHANNEL' }, locale),
            width: '160px',
            cell: (b) => {
                const toneMap: Record<string, string> = {
                    web: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'walk-in': 'bg-blue-50 text-blue-700 border-blue-200',
                    ota: 'bg-purple-50 text-purple-700 border-purple-200',
                    phone: 'bg-amber-50 text-amber-700 border-amber-200',
                }
                const dotMap: Record<string, string> = {
                    web: 'bg-emerald-500',
                    'walk-in': 'bg-blue-500',
                    ota: 'bg-purple-500',
                    phone: 'bg-amber-500',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[144px] text-left shrink-0 ${toneMap[b.channel] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[b.channel] || 'bg-slate-400'}`} />
                        <span className="truncate">{tr(CHANNEL_LABEL[b.channel], locale)}</span>
                    </span>
                )
            },
        },
        {
            key: 'code',
            header: pick({ vi: 'KHÁCH HÀNG & MÃ ĐƠN', en: 'GUEST & CODE' }, locale),
            cell: (b) => (
                <div>
                    <div className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                        {b.guest.fullName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                        {b.code} · {b.guest.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'room',
            header: pick({ vi: 'HẠNG PHÒNG', en: 'ROOM TYPE' }, locale),
            cell: (b) => <span className="text-slate-700 font-medium text-xs">{roomName(b.roomTypeId)}</span>,
        },
        {
            key: 'nights',
            header: pick({ vi: 'SỐ ĐÊM', en: 'NIGHTS' }, locale),
            width: '90px',
            align: 'center',
            cell: (b) => <span className="text-slate-700 font-semibold text-xs">{b.nights} {tr(S.nights, locale)}</span>,
        },
        {
            key: 'dates',
            header: pick({ vi: 'CHECK-IN / CHECK-OUT', en: 'DATES' }, locale),
            width: '160px',
            cell: (b) => <span className="text-slate-600 text-xs">{b.checkIn} → {b.checkOut}</span>,
        },
        {
            key: 'status',
            header: pick({ vi: 'TRẠNG THÁI', en: 'STATUS' }, locale),
            width: '130px',
            cell: (b) => {
                const statusStyles: Record<string, string> = {
                    checked_in: 'bg-blue-50 text-blue-700 border-blue-200',
                    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
                    checked_out: 'bg-slate-100 text-slate-700 border-slate-200',
                    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                    no_show: 'bg-purple-50 text-purple-700 border-purple-200',
                }
                const dotStyles: Record<string, string> = {
                    checked_in: 'bg-blue-500',
                    confirmed: 'bg-emerald-500',
                    pending_payment: 'bg-amber-500',
                    checked_out: 'bg-slate-500',
                    cancelled: 'bg-rose-500',
                    no_show: 'bg-purple-500',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[108px] text-left shrink-0 ${statusStyles[b.status] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[b.status] || 'bg-slate-400'}`} />
                        <span className="truncate">{tr(STATUS_LABEL[b.status], locale)}</span>
                    </span>
                )
            },
        },
        {
            key: 'total',
            header: pick({ vi: 'TỔNG TIỀN', en: 'TOTAL' }, locale),
            align: 'right',
            width: '130px',
            cell: (b) => (
                <span className="font-bold text-slate-900 text-xs">
                    {formatPrice(b.totalAmount, locale)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: pick({ vi: 'THAO TÁC', en: 'ACTION' }, locale),
            align: 'right',
            width: '100px',
            inCard: false,
            cell: (b) => (
                <div className="flex items-center justify-end gap-1 text-slate-500">
                    <Link
                        href={`/admin/orders/${b.id}`}
                        className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                        title={tr(S.view, locale)}
                        aria-label={`${tr(S.viewBookingAria, locale)} ${b.code}`}
                    >
                        <EyeIcon size={16} />
                    </Link>
                </div>
            ),
        },
    ]

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2.5 p-3 bg-slate-100 overflow-hidden">
            {/* Top Bar: Title + All Filters & Actions in Header */}
            <div className="w-full bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0">
                {/* Left: Title & Count */}
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        {tr(S.orders, locale)}
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {filtered.length} {tr(S.bookingsCountSuffix, locale)}
                    </span>
                </div>

                {/* Right: All Filters & Actions */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* Search Field */}
                    <div className="relative w-44 sm:w-56">
                        <input
                            type="search"
                            aria-label={tr(S.searchBookingsAria, locale)}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            placeholder={tr(S.search, locale)}
                            className="w-full pl-3 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                    </div>

                    {/* Channel Select */}
                    <select
                        aria-label={tr(S.filterChannelAria, locale)}
                        value={channel}
                        onChange={(e) => {
                            setChannel(e.target.value)
                            setPage(1)
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="">{pick({ vi: 'Tất cả kênh', en: 'All channels' }, locale)}</option>
                        <option value="web">Website Trực Tuyến</option>
                        <option value="walk-in">Khách Vãng Lai</option>
                        <option value="ota">Agoda / Booking.com</option>
                        <option value="phone">Hotline / Điện thoại</option>
                    </select>

                    {/* Status Select */}
                    <select
                        aria-label={tr(S.filterStatusAria, locale)}
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value)
                            setPage(1)
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="">{pick({ vi: 'Tất cả trạng thái', en: 'All statuses' }, locale)}</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {tr(STATUS_LABEL[s], locale)}
                            </option>
                        ))}
                    </select>

                    {/* Room Type Select */}
                    <select
                        aria-label={tr(S.filterRoomTypeAria, locale)}
                        value={roomType}
                        onChange={(e) => {
                            setRoomType(e.target.value)
                            setPage(1)
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="">{pick({ vi: 'Tất cả hạng phòng', en: 'All room types' }, locale)}</option>
                        {property.rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                                {pick(r.name, locale)}
                            </option>
                        ))}
                    </select>

                    {/* Reset Button */}
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="px-2 py-1 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                        >
                            {tr(S.reset, locale)}
                        </button>
                    )}

                    {/* Export CSV */}
                    <button
                        type="button"
                        onClick={exportCsv}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors inline-flex items-center gap-1 shrink-0"
                    >
                        <DownloadIcon size={13} />
                        <span>{tr(S.exportExcel, locale)}</span>
                    </button>

                    {/* Primary Action Button */}
                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => router.push('/admin/orders/new')}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-md transition-all shadow-sm active:scale-[0.98] shrink-0 border border-amber-400/50"
                        >
                            <PlusIcon size={14} />
                            <span>+ {tr(S.newBooking, locale)}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Channel KPI Statistics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 shrink-0">
                {/* Total Stats */}
                <div className="bg-white p-2.5 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {pick({ vi: 'TẤT CẢ KÊNH', en: 'ALL CHANNELS' }, locale)}
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.total} {tr(S.bookingsCountSuffix, locale)}</span>
                        <span className="text-[11px] font-semibold text-amber-700">
                            {formatPrice(stats.totalRevenue, locale)}
                        </span>
                    </div>
                </div>

                {/* Website Stats */}
                <div className="bg-white p-2.5 rounded-sm border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            WEBSITE TRỰC TUYẾN
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.website} {tr(S.bookingsCountSuffix, locale)}</span>
                        <span className="text-[11px] font-semibold text-emerald-700">
                            {formatPrice(stats.websiteRev, locale)}
                        </span>
                    </div>
                </div>

                {/* Walk-in Stats */}
                <div className="bg-white p-2.5 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            KHÁCH VÃNG LAI
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.walkIn} {tr(S.bookingsCountSuffix, locale)}</span>
                        <span className="text-[11px] font-semibold text-blue-700">
                            {formatPrice(stats.walkInRev, locale)}
                        </span>
                    </div>
                </div>

                {/* OTA Stats */}
                <div className="bg-white p-2.5 rounded-sm border border-purple-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                            AGODA / BOOKING.COM
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.ota} {tr(S.bookingsCountSuffix, locale)}</span>
                        <span className="text-[11px] font-semibold text-purple-700">
                            {formatPrice(stats.otaRev, locale)}
                        </span>
                    </div>
                </div>

                {/* Phone/Hotline Stats */}
                <div className="bg-white p-2.5 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                            HOTLINE / ĐIỆN THOẠI
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.phone} {tr(S.bookingsCountSuffix, locale)}</span>
                        <span className="text-[11px] font-semibold text-amber-700">
                            {formatPrice(stats.phoneRev, locale)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Selection banner */}
            {selected.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md flex items-center justify-between text-xs text-amber-900 shrink-0">
                    <span><strong>{selected.length}</strong> {tr(S.selectedCount, locale)}</span>
                    <button
                        type="button"
                        onClick={() => setSelected([])}
                        className="text-xs font-semibold text-amber-700 hover:underline"
                    >
                        {tr(S.clearSelection, locale)}
                    </button>
                </div>
            )}

            {/* DataTable Component - Maximized Full Height */}
            <div className="w-full flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <DataTable
                    caption={tr(S.orders, locale)}
                    columns={columns}
                    rows={pageRows}
                    rowKey={(b) => b.id}
                    onRowClick={(b) => router.push(`/admin/orders/${b.id}`)}
                    selectable
                    selectedKeys={selected}
                    onSelectionChange={setSelected}
                    selectAllLabel={tr(S.selectAllRows, locale)}
                    rowLabel={(b) => `${pick({ vi: 'Chọn đơn', en: 'Select booking' }, locale)} ${b.code}`}
                    empty={
                        <div className="py-6 text-center space-y-2">
                            <p className="text-sm text-slate-600">
                                {tr(isFiltered ? S.emptyFilterBookings : S.noBookings, locale)}
                            </p>
                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                                >
                                    {tr(S.resetFilters, locale)}
                                </button>
                            )}
                        </div>
                    }
                />

                {filtered.length > 0 && (
                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap text-xs text-slate-500 shrink-0 mt-auto">
                        <span>
                            {tr(S.showing, locale)}{' '}
                            <strong className="text-slate-900 font-semibold">
                                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
                            </strong>{' '}
                            {tr(S.of, locale)}{' '}
                            <strong className="text-slate-900 font-semibold">{filtered.length}</strong>{' '}
                            {tr(S.bookingsCountSuffix, locale)}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={safePage === 1}
                                onClick={() => setPage(safePage - 1)}
                                className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← {tr(S.paginationPrev, locale)}
                            </button>
                            <span className="px-2 font-semibold text-slate-700">
                                {safePage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                disabled={safePage === totalPages}
                                onClick={() => setPage(safePage + 1)}
                                className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {tr(S.paginationNext, locale)} →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


function PageButton({
    disabled,
    onClick,
    label,
    children,
}: {
    disabled: boolean
    onClick: () => void
    label: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-label={label}
            style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-body)',
                color: disabled ? 'var(--text-muted)' : 'var(--text)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                minHeight: 32,
            }}
        >
            {children}
        </button>
    )
}
