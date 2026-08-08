'use client'

/**
 * Hồ sơ khách — gộp theo số điện thoại.
 *
 * Giá trị thật của màn này là cột "Đã ở" và "Tổng chi tiêu": lễ tân nhìn thấy
 * ngay ai là khách quen để đối xử khác đi.
 *
 * Áp design system `@repo/cms-ui` — cùng bố cục 2 hàng + MetricStrip +
 * DataGrid như `/admin` (page.tsx dashboard). Nền TRẮNG, phân tách bằng
 * đường kẻ 1px, không còn `bg-slate-100`/card lồng card của bản cũ.
 *
 * Hai đặc thù khiến không copy y nguyên bố cục dashboard:
 * 1. Ô tìm kiếm tự do (tên/SĐT/email) — `FilterBar` chỉ nhận pill giá trị cố
 *    định, không có input chữ tự do. Giữ input thô nhưng token hoá màu, đặt
 *    cạnh `FilterBar` trong cùng khối hàng 2.
 * 2. Phân trang (Trước/Sau) — `cms-ui` chưa có component Pagination. Giữ
 *    thanh phân trang tự viết, chỉ đổi sang token `--cms-*`.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatPrice, getPropertySync, pick } from '@repo/core'
import type { Booking, Customer } from '@repo/core'
import type { Column } from '@repo/ui'
import { Modal } from '@repo/ui'
import { DataGrid, DotBadge, FilterBar, KpiCard, MetricStrip, PageHeaderBar } from '@repo/cms-ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingsData } from '@/hooks/useAdminData'
import { useMetricsCollapsed } from '@/hooks/useMetricsCollapsed'
import { EyeIcon, MenuIcon } from '@/components/icons'
import { S, STATUS_CMS_TONE, STATUS_LABEL, tr } from '@/strings'

/** Khoá `localStorage` riêng cho màn khách hàng — mỗi màn CMS nhớ trạng thái
 *  ẩn/hiện của chính mình (xem giải thích trong `useMetricsCollapsed`). */
const METRICS_COLLAPSED_KEY = 'namduhill-cms-customers-metrics-collapsed'

export default function CustomersPage() {
    const { locale } = useLocale()
    const { customers, bookings } = useBookingsData()
    const property = getPropertySync()

    const [search, setSearch] = useState('')
    const [tierFilter, setTierFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [metricsCollapsed, toggleMetrics] = useMetricsCollapsed(METRICS_COLLAPSED_KEY)
    // Khách đang mở modal lịch sử — `null` = đóng. Giữ NGUYÊN đối tượng `Customer`
    // (không chỉ id) để modal không phải tra lại `customers` mỗi lần render.
    const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null)
    const PAGE_SIZE = 10

    // Tra tên hạng phòng từ id — cùng khuôn `roomName()` đã dùng ở
    // `orders/page.tsx`, không tạo cách tra thứ hai cho cùng một dữ liệu (R12).
    const roomName = (id: string) => {
        const room = property.rooms.find((r) => r.id === id)
        return room ? pick(room.name, locale) : id
    }

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
    // BUG ĐÃ SỬA: "2.480.600,967đ" — số ĐÚNG (74.418.029 / 30 = 2.480.600,97),
    // chỉ SAI ĐỊNH DẠNG. `formatPrice()` gọi `toLocaleString('vi-VN')`, hàm này
    // không tự làm tròn — phép chia còn phần thập phân bị in thẳng ra thành cụm
    // 3 chữ số sau dấu phẩy (",967"), nhìn giống một số khác hẳn và bị đọc nhầm
    // là "lớn hơn tổng chi tiêu". Tiền VNĐ là số nguyên (luật C6: không FLOAT),
    // nên làm tròn TRƯỚC khi đưa vào `formatPrice`, không sửa ở `formatPrice`
    // (hàm dùng chung, các nơi gọi khác luôn truyền số nguyên sẵn).
    const avgSpent = customers.length > 0 ? Math.round(totalRevenue / customers.length) : 0

    const bookingCount = (customerId: string) =>
        bookings.filter((b) => b.customerId === customerId).length

    // Phân hạng khách — MỘT hàm duy nhất dùng cả ở cột bảng lẫn header modal
    // (R12: một khái niệm, một nhà). Ngưỡng đã chốt ở booking-domain §B0: VIP
    // >= 10tr, Quay lại = đã ở > 1 lần, còn lại là Khách mới. Không đụng.
    const tierBadge = (c: Customer) => {
        if (c.totalSpent >= 10000000) {
            return <DotBadge tone="amber" label={tr(S.customersBadgeVip, locale)} width={108} />
        }
        if (c.stayCount > 1) {
            return <DotBadge tone="emerald" label={tr(S.customersBadgeReturning, locale)} width={108} />
        }
        return <DotBadge tone="slate" label={tr(S.customersBadgeNew, locale)} width={108} />
    }

    // Đơn của đúng khách đang mở modal — LỌC theo `customerId`, không bịa dữ
    // liệu. Mới nhất lên trước để "lần gần nhất" luôn là phần tử đầu.
    const historyBookings: Booking[] = useMemo(() => {
        if (!historyCustomer) return []
        return bookings
            .filter((b) => b.customerId === historyCustomer.id)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }, [bookings, historyCustomer])

    const historyNights = historyBookings.reduce((sum, b) => sum + b.nights, 0)
    const lastVisit = historyBookings[0]?.checkIn

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
        const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
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
            header: tr(S.customersColGuestPhone, locale),
            cell: (c) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={c.fullName}
                    >
                        {c.fullName}
                    </div>
                    <div
                        className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] font-mono"
                        title={c.phone}
                    >
                        {c.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'email',
            header: tr(S.email, locale),
            cell: (c) => (
                <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                    {c.email || '—'}
                </span>
            ),
        },
        {
            key: 'tier',
            header: tr(S.customersColTier, locale),
            width: '130px',
            cell: (c) => tierBadge(c),
        },
        {
            key: 'bookings',
            header: tr(S.customersColBookings, locale),
            align: 'right',
            width: '90px',
            cell: (c) => (
                <span className="text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text)] tabular-nums">
                    {bookingCount(c.id)}
                </span>
            ),
        },
        {
            key: 'stays',
            header: tr(S.customersColStays, locale),
            align: 'right',
            width: '90px',
            cell: (c) => (
                <span className="text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text)] tabular-nums">
                    {c.stayCount} {tr(S.customersNightsUnit, locale)}
                </span>
            ),
        },
        {
            key: 'spent',
            header: tr(S.customersColSpent, locale),
            align: 'right',
            width: '140px',
            cell: (c) => (
                // Không tô màu nhấn cho tiền — dashboard mẫu chỉ đậm chữ, giữ
                // nhất quán cách trình bày tiền trong toàn CMS (P11 Calm).
                <span className="font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)] tabular-nums">
                    {formatPrice(c.totalSpent, locale)}
                </span>
            ),
        },
    ]

    const tierGroups = [
        {
            legend: tr(S.customersColTier, locale),
            value: tierFilter,
            onChange: (v: string) => {
                setTierFilter(v)
                setPage(1)
            },
            options: [
                { value: 'all', label: tr(S.all, locale) },
                { value: 'vip', label: tr(S.customersTierVip, locale) },
                { value: 'returning', label: tr(S.customersTierReturning, locale) },
                { value: 'new', label: tr(S.customersTierNew, locale) },
            ],
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: tiêu đề + đếm bên trái, nút Xuất Excel bên phải. */}
            <PageHeaderBar
                title={tr(S.customers, locale)}
                count={{ value: rows.length, suffix: pick({ vi: 'khách', en: 'guests' }, locale) }}
                actions={
                    <>
                        {/* Nút ẩn/hiện MetricStrip — mặc định HIỆN số liệu. */}
                        <button
                            type="button"
                            onClick={toggleMetrics}
                            aria-expanded={!metricsCollapsed}
                            aria-controls="customers-metric-strip"
                            className="flex items-center gap-1 px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] hover:bg-[var(--cms-bg-subtle)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <MenuIcon size={14} />
                            <span>{tr(metricsCollapsed ? S.showMetrics : S.hideMetrics, locale)}</span>
                        </button>
                        <button
                            type="button"
                            onClick={exportCsv}
                            className="px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold bg-[var(--cms-accent)] hover:bg-[var(--cms-accent)]/90 text-white rounded-[var(--cms-radius)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            {tr(S.exportExcel, locale)}
                        </button>
                    </>
                }
            />

            {/* HÀNG 2: ô tìm kiếm tự do + FilterBar (phân hạng) + kết quả + Đặt
                lại — border-t 1px phân tách khỏi hàng 1, không shadow (P7). */}
            <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                    }}
                    placeholder={tr(S.customersSearchPlaceholder, locale)}
                    aria-label={tr(S.customersSearchPlaceholder, locale)}
                    className="w-44 sm:w-56 px-3 py-1 text-[length:var(--cms-text-body)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    style={{ minHeight: 28 }}
                />

                <FilterBar
                    groups={tierGroups}
                    resultText={`${rows.length} ${pick({ vi: 'khách khớp bộ lọc', en: 'guests matched' }, locale)}`}
                    onReset={resetFilters}
                />
            </div>

            {/* MetricStrip — 5 KPI liền mạch thay 5 card rời (P11 Calm). Ẩn/hiện
                được qua nút ở hàng 1, mặc định HIỆN. */}
            {!metricsCollapsed && (
            <div
                id="customers-metric-strip"
                className="border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2"
            >
                <MetricStrip>
                    <KpiCard
                        label={tr(S.customersKpiTotal, locale)}
                        value={`${customers.length}`}
                        note={formatPrice(totalRevenue, locale)}
                        tone="slate"
                    />
                    <KpiCard
                        label={tr(S.customersKpiReturning, locale)}
                        value={`${returning}`}
                        note={customers.length > 0 ? `${Math.round((returning / customers.length) * 100)}%` : '0%'}
                        tone="emerald"
                    />
                    <KpiCard
                        label={tr(S.customersKpiVip, locale)}
                        value={`${vipCount}`}
                        tone="violet"
                    />
                    <KpiCard
                        label={tr(S.customersKpiNew, locale)}
                        value={`${customers.length - returning}`}
                        tone="blue"
                    />
                    <KpiCard
                        label={tr(S.customersKpiAvgSpent, locale)}
                        value={formatPrice(avgSpent, locale)}
                        tone="slate"
                    />
                </MetricStrip>
            </div>
            )}

            {/* Vùng nội dung: DataGrid chiếm hết chỗ còn lại — tối ưu chiều
                cao là ưu tiên số 1 cho màn lễ tân dùng hằng ngày. */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-[var(--cms-border)]">
                <div className="flex-1 flex flex-col min-h-0">
                    <DataGrid<Customer>
                        caption={tr(S.customers, locale)}
                        columns={columns}
                        rows={pageRows}
                        rowKey={(c) => c.id}
                        onRowClick={(c) => setHistoryCustomer(c)}
                        rowLabel={(c) => `${tr(S.customersRowViewHistoryAria, locale)} ${c.fullName}`}
                        empty={
                            <div className="h-full flex items-center justify-center text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                                {tr(search ? S.customersEmptySearch : S.customersEmptyAll, locale)}
                            </div>
                        }
                    />
                </div>

                {rows.length > 0 && (
                    <div className="px-[var(--cms-pad)] py-2.5 border-t border-[var(--cms-border)] flex items-center justify-between gap-4 flex-wrap text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] shrink-0">
                        <span>
                            {tr(S.showing, locale)}{' '}
                            <strong className="text-[var(--cms-text)] font-semibold">
                                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, rows.length)}
                            </strong>{' '}
                            {tr(S.of, locale)}{' '}
                            <strong className="text-[var(--cms-text)] font-semibold">{rows.length}</strong>{' '}
                            {pick({ vi: 'khách', en: 'guests' }, locale)}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={safePage === 1}
                                onClick={() => setPage(safePage - 1)}
                                className="px-2.5 py-1 text-[length:var(--cms-text-meta)] font-medium text-[var(--cms-text)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius-sm)] hover:bg-[var(--cms-bg-subtle)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                            >
                                ← {tr(S.paginationPrev, locale)}
                            </button>
                            <span className="px-2 font-semibold text-[var(--cms-text)] tabular-nums">
                                {safePage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                disabled={safePage === totalPages}
                                onClick={() => setPage(safePage + 1)}
                                className="px-2.5 py-1 text-[length:var(--cms-text-meta)] font-medium text-[var(--cms-text)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius-sm)] hover:bg-[var(--cms-bg-subtle)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                            >
                                {tr(S.paginationNext, locale)} →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL LỊCH SỬ KHÁCH — mở khi bấm một dòng trong bảng. `Modal`
                của `@repo/ui` đã tự lo Esc + click nền + focus trap + trả focus
                về phần tử đã mở nó (xem `Modal.tsx`); ở đây chỉ đưa nội dung. */}
            <Modal
                open={historyCustomer !== null}
                onClose={() => setHistoryCustomer(null)}
                title={historyCustomer?.fullName ?? ''}
                description={
                    historyCustomer && (
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>{historyCustomer.phone}</span>
                            {historyCustomer.email && (
                                <>
                                    <span aria-hidden="true">·</span>
                                    <span>{historyCustomer.email}</span>
                                </>
                            )}
                        </span>
                    )
                }
                width={720}
            >
                {historyCustomer && (
                    <div className="flex flex-col gap-4">
                        {/* Badge phân hạng — tách khỏi header của Modal vì `title`/
                            `description` chỉ nhận text/inline, đặt ngay dưới cho rõ. */}
                        <div>{tierBadge(historyCustomer)}</div>

                        {/* Số liệu tóm tắt — 4 ô, cùng khuôn KpiCard/MetricStrip đã
                            dùng ở toàn CMS thay vì tự vẽ card mới (P0 — một hệ
                            thống, không phải mỗi màn một kiểu số liệu). */}
                        <MetricStrip>
                            <KpiCard
                                label={tr(S.customersHistoryBookingsSummary, locale)}
                                value={`${historyBookings.length}`}
                                tone="slate"
                            />
                            <KpiCard
                                label={tr(S.customersHistoryNightsSummary, locale)}
                                value={`${historyNights}`}
                                tone="slate"
                            />
                            <KpiCard
                                label={tr(S.customersHistorySpentSummary, locale)}
                                value={formatPrice(historyCustomer.totalSpent, locale)}
                                tone="slate"
                            />
                            <KpiCard
                                label={tr(S.customersHistoryLastVisit, locale)}
                                value={lastVisit ?? tr(S.customersHistoryLastVisitNever, locale)}
                                tone="slate"
                            />
                        </MetricStrip>

                        {/* Bảng lịch sử đơn — LỌC theo đúng khách này (`historyBookings`
                            ở trên), không có dữ liệu bịa. Dùng lại cùng cột
                            hạng phòng/trạng thái với `/admin/orders` để nhất quán
                            cách đọc trên toàn CMS (R12). */}
                        <div>
                            <h3 className="mb-2 text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text)]">
                                {tr(S.customersHistoryTableTitle, locale)}
                            </h3>
                            <div className="border border-[var(--cms-border)]">
                                <DataGrid<Booking>
                                    caption={tr(S.customersHistoryTableTitle, locale)}
                                    rows={historyBookings}
                                    rowKey={(b) => b.id}
                                    empty={
                                        <div className="py-6 text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                                            {tr(S.customersHistoryEmpty, locale)}
                                        </div>
                                    }
                                    columns={[
                                        {
                                            key: 'code',
                                            header: tr(S.customersHistoryColCode, locale),
                                            cell: (b) => (
                                                <Link
                                                    href={`/admin/orders/${b.id}`}
                                                    aria-label={`${tr(S.customersHistoryViewOrderAria, locale)} ${b.code}`}
                                                    className="inline-flex items-center gap-1 font-semibold text-[var(--cms-accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                                                >
                                                    <EyeIcon size={14} />
                                                    {b.code}
                                                </Link>
                                            ),
                                        },
                                        {
                                            key: 'room',
                                            header: tr(S.customersHistoryColRoom, locale),
                                            cell: (b) => (
                                                <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text)]">
                                                    {roomName(b.roomTypeId)}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: 'dates',
                                            header: tr(S.customersHistoryColDates, locale),
                                            cell: (b) => (
                                                <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] tabular-nums">
                                                    {b.checkIn} → {b.checkOut}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: 'nights',
                                            header: tr(S.customersHistoryColNights, locale),
                                            align: 'right',
                                            width: '70px',
                                            cell: (b) => (
                                                <span className="tabular-nums text-[var(--cms-text)]">{b.nights}</span>
                                            ),
                                        },
                                        {
                                            key: 'total',
                                            header: tr(S.customersHistoryColTotal, locale),
                                            align: 'right',
                                            width: '130px',
                                            cell: (b) => (
                                                <span className="font-semibold tabular-nums text-[var(--cms-text)]">
                                                    {formatPrice(b.totalAmount, locale)}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: 'status',
                                            header: tr(S.customersHistoryColStatus, locale),
                                            width: '120px',
                                            cell: (b) => (
                                                <DotBadge
                                                    tone={STATUS_CMS_TONE[b.status]}
                                                    label={tr(STATUS_LABEL[b.status], locale)}
                                                    width={104}
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
