'use client'

/**
 * Hồ sơ khách — gộp theo số điện thoại.
 *
 * Giá trị thật của màn này là cột "Đã ở" và "Tổng chi tiêu": lễ tân nhìn thấy
 * ngay ai là khách quen để đối xử khác đi.
 */

import { useMemo, useState } from 'react'
import { formatPrice, pick } from '@repo/core'
import type { Customer } from '@repo/core'
import { DataTable, StatCard, Toolbar } from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { S, tr } from '@/strings'

export default function CustomersPage() {
    const { locale } = useLocale()
    const customers = useBookingStore((s) => s.customers)
    const bookings = useBookingStore((s) => s.bookings)

    const [search, setSearch] = useState('')
    const [tierFilter, setTierFilter] = useState('all')
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 10

    const rows = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return customers
            .filter((c) => {
                if (tierFilter === 'returning' && c.stayCount <= 1) return false
                if (tierFilter === 'vip' && c.totalSpent < 10000000) return false
                if (tierFilter === 'new' && c.stayCount > 1) return false
                if (!needle) return true
                return (
                    c.fullName.toLowerCase().includes(needle) ||
                    c.phone.includes(needle) ||
                    c.email.toLowerCase().includes(needle)
                )
            })
            .sort((a, b) => b.totalSpent - a.totalSpent)
    }, [customers, search, tierFilter])

    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    const returning = customers.filter((c) => c.stayCount > 1).length
    const vipCount = customers.filter((c) => c.totalSpent >= 10000000).length
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const avgSpent = customers.length > 0 ? totalRevenue / customers.length : 0

    const bookingCount = (customerId: string) =>
        bookings.filter((b) => b.customerId === customerId).length

    const resetFilters = () => {
        setSearch('')
        setTierFilter('all')
        setPage(1)
    }

    const exportCsv = () => {
        const header = ['Tên khách', 'Số điện thoại', 'Email', 'Số đơn', 'Số đêm ở', 'Tổng chi tiêu']
        const body = rows.map((c) => [
            c.fullName,
            c.phone,
            c.email || '',
            String(bookingCount(c.id)),
            String(c.stayCount),
            String(c.totalSpent),
        ])
        const csv = [header, ...body]
            .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
            .join('\r\n')
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    const columns: Column<Customer>[] = [
        {
            key: 'name',
            header: pick({ vi: 'KHÁCH HÀNG & SĐT', en: 'GUEST & PHONE' }, locale),
            cell: (c) => (
                <div>
                    <div className="font-semibold text-slate-900">{c.fullName}</div>
                    <div className="text-xs text-slate-500 font-mono">{c.phone}</div>
                </div>
            ),
        },
        {
            key: 'email',
            header: tr(S.email, locale),
            cell: (c) => <span className="text-xs text-slate-600">{c.email || '—'}</span>,
        },
        {
            key: 'tier',
            header: pick({ vi: 'PHÂN HẠNG', en: 'TIER' }, locale),
            width: '130px',
            cell: (c) => {
                if (c.totalSpent >= 10000000) {
                    return (
                        <span className="inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[108px] text-left bg-amber-50 text-amber-800 border-amber-300 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span className="truncate">Khách VIP</span>
                        </span>
                    )
                }
                if (c.stayCount > 1) {
                    return (
                        <span className="inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[108px] text-left bg-emerald-50 text-emerald-800 border-emerald-300 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">Quay lại</span>
                        </span>
                    )
                }
                return (
                    <span className="inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[108px] text-left bg-slate-50 text-slate-700 border-slate-200 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span className="truncate">Khách mới</span>
                    </span>
                )
            },
        },
        {
            key: 'bookings',
            header: pick({ vi: 'SỐ ĐƠN', en: 'BOOKINGS' }, locale),
            align: 'right',
            width: '90px',
            cell: (c) => <span className="text-xs font-semibold text-slate-800">{bookingCount(c.id)}</span>,
        },
        {
            key: 'stays',
            header: pick({ vi: 'ĐÃ Ở', en: 'STAYS' }, locale),
            align: 'right',
            width: '90px',
            cell: (c) => <span className="text-xs font-semibold text-slate-800">{c.stayCount} đêm</span>,
        },
        {
            key: 'spent',
            header: pick({ vi: 'TỔNG CHI TIÊU', en: 'TOTAL SPENT' }, locale),
            align: 'right',
            width: '140px',
            cell: (c) => (
                <span className="font-bold text-amber-700 text-xs">
                    {formatPrice(c.totalSpent, locale)}
                </span>
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
                        {tr(S.customers, locale)}
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {rows.length} {pick({ vi: 'khách', en: 'guests' }, locale)}
                    </span>
                </div>

                {/* Right: All Filters & Actions */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* Search Field */}
                    <div className="relative w-44 sm:w-56">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            placeholder={pick({ vi: 'Tìm tên, SĐT, email…', en: 'Search name, phone, email…' }, locale)}
                            className="w-full pl-3 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                    </div>

                    {/* Tier Select */}
                    <select
                        value={tierFilter}
                        onChange={(e) => {
                            setTierFilter(e.target.value)
                            setPage(1)
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">{pick({ vi: 'Tất cả phân hạng', en: 'All tiers' }, locale)}</option>
                        <option value="vip">{pick({ vi: 'Khách VIP (>10 triệu)', en: 'VIP (>10m VND)' }, locale)}</option>
                        <option value="returning">{pick({ vi: 'Khách quay lại (>1 lần)', en: 'Returning (>1 stay)' }, locale)}</option>
                        <option value="new">{pick({ vi: 'Khách mới (1 lần)', en: 'New guests (1 stay)' }, locale)}</option>
                    </select>

                    {/* Reset Button */}
                    {(search || tierFilter !== 'all') && (
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
                        <span>{tr(S.exportExcel, locale)}</span>
                    </button>
                </div>
            </div>

            {/* KPI Statistics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 shrink-0">
                {/* Total Customers */}
                <div className="bg-white p-2.5 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {pick({ vi: 'TẤT CẢ KHÁCH', en: 'TOTAL GUESTS' }, locale)}
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{customers.length} khách</span>
                        <span className="text-[11px] font-semibold text-amber-700">
                            {formatPrice(totalRevenue, locale)}
                        </span>
                    </div>
                </div>

                {/* Returning Guests */}
                <div className="bg-white p-2.5 rounded-sm border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            KHÁCH QUAY LẠI
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{returning} khách</span>
                        <span className="text-[11px] font-semibold text-emerald-700">
                            {customers.length > 0 ? `${Math.round((returning / customers.length) * 100)}%` : '0%'}
                        </span>
                    </div>
                </div>

                {/* VIP Guests */}
                <div className="bg-white p-2.5 rounded-sm border border-purple-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                            KHÁCH VIP (&gt;10TR)
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{vipCount} khách</span>
                    </div>
                </div>

                {/* New Guests */}
                <div className="bg-white p-2.5 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            KHÁCH MỚI (1 LẦN)
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{customers.length - returning} khách</span>
                    </div>
                </div>

                {/* Average Spent */}
                <div className="bg-white p-2.5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        CHI TIÊU TB / KHÁCH
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">
                        {formatPrice(avgSpent, locale)}
                    </div>
                </div>
            </div>

            {/* DataTable Component - Maximized Full Height */}
            <div className="w-full flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <DataTable
                    caption={tr(S.customers, locale)}
                    columns={columns}
                    rows={pageRows}
                    rowKey={(c) => c.id}
                    empty={
                        search
                            ? pick({ vi: 'Không tìm thấy khách nào.', en: 'No guests found.' }, locale)
                            : pick({ vi: 'Chưa có khách hàng nào.', en: 'No guests yet.' }, locale)
                    }
                />

                {rows.length > 0 && (
                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap text-xs text-slate-500 shrink-0 mt-auto">
                        <span>
                            {tr(S.showing, locale)}{' '}
                            <strong className="text-slate-900 font-semibold">
                                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, rows.length)}
                            </strong>{' '}
                            {tr(S.of, locale)}{' '}
                            <strong className="text-slate-900 font-semibold">{rows.length}</strong>{' '}
                            {pick({ vi: 'khách', en: 'guests' }, locale)}
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


