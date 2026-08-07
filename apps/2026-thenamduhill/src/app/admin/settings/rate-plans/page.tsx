'use client'

import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    TagIcon,
} from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { formatPrice } from '@repo/core'
import { DataTable, useDataTable, type Column, Modal, Field, SelectField, TextAreaField } from '@repo/ui'
import { useState } from 'react'

export interface RatePlanRowItem {
    id: string
    code: string
    nameVi: string
    nameEn: string
    type: 'standard' | 'seasonal' | 'promotion' | 'non_refundable'
    typeLabel: string
    discountPercent: number
    minNights: number
    includedServices: string
    status: 'active' | 'inactive' | 'draft'
    statusLabel: string
}

const RESORT_RATE_PLANS: RatePlanRowItem[] = [
    {
        id: 'rp-001',
        code: 'RP-STD-2026',
        nameVi: 'Giá Chuẩn Linh Hoạt (Tiêu chuẩn)',
        nameEn: 'Standard Flexible Rate',
        type: 'standard',
        typeLabel: 'Giá Tiêu chuẩn',
        discountPercent: 0,
        minNights: 1,
        includedServices: 'Bữa sáng buffet + Nước uống đón tiếp',
        status: 'active',
        statusLabel: 'Đang áp dụng',
    },
    {
        id: 'rp-002',
        code: 'RP-NRF-2026',
        nameVi: 'Gói Ưu Đãi Không Hoàn Hủy (-15%)',
        nameEn: 'Non-Refundable Promo (-15%)',
        type: 'non_refundable',
        typeLabel: 'Không hoàn hủy',
        discountPercent: 15,
        minNights: 2,
        includedServices: 'Bữa sáng + Xe đưa đón bến tàu Nam Du',
        status: 'active',
        statusLabel: 'Đang áp dụng',
    },
    {
        id: 'rp-003',
        code: 'RP-SUMMER-2026',
        nameVi: 'Mùa Hè Nam Du Hill (Giảm 20%)',
        nameEn: 'Summer Island Vacation (-20%)',
        type: 'seasonal',
        typeLabel: 'Mùa cao điểm',
        discountPercent: 20,
        minNights: 3,
        includedServices: 'Bữa sáng + 1 Bữa tối hải sản + Tour đảo',
        status: 'active',
        statusLabel: 'Đang áp dụng',
    },
    {
        id: 'rp-004',
        code: 'RP-EARLY-2026',
        nameVi: 'Đặt Sớm 30 Ngày (-10%)',
        nameEn: 'Early Bird Booking (-10%)',
        type: 'promotion',
        typeLabel: 'Khuyến mãi đặt sớm',
        discountPercent: 10,
        minNights: 2,
        includedServices: 'Bữa sáng + Miễn phí nhận phòng sớm',
        status: 'inactive',
        statusLabel: 'Tạm ngưng',
    },
]

export default function RatePlansSettingsPage() {
    const { locale } = useLocale()
    const [ratePlans, setRatePlans] = useState<RatePlanRowItem[]>(RESORT_RATE_PLANS)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    // Modal Create State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [code, setCode] = useState('')
    const [nameVi, setNameVi] = useState('')
    const [nameEn, setNameEn] = useState('')
    const [discountPercent, setDiscountPercent] = useState(10)
    const [minNights, setMinNights] = useState(1)
    const [includedServices, setIncludedServices] = useState('')

    const columns: Column<RatePlanRowItem>[] = [
        {
            key: 'code',
            header: 'MÃ GÓI GIÁ',
            width: '140px',
            sortable: true,
            cell: (row) => (
                <span className="font-mono text-xs font-bold text-slate-800">{row.code}</span>
            ),
        },
        {
            key: 'nameVi',
            header: 'TÊN GÓI GIÁ & TIỆN ÍCH KÈM THEO',
            cell: (row) => (
                <div>
                    <div className="font-bold text-xs text-slate-900">
                        {locale === 'vi' ? row.nameVi : row.nameEn}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{row.includedServices}</div>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'LOẠI GÓI GIÁ',
            width: '160px',
            cell: (row) => {
                const toneMap: Record<string, string> = {
                    standard: 'bg-blue-50 text-blue-700 border-blue-200',
                    non_refundable: 'bg-amber-50 text-amber-700 border-amber-200',
                    seasonal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    promotion: 'bg-purple-50 text-purple-700 border-purple-200',
                }
                const dotMap: Record<string, string> = {
                    standard: 'bg-blue-500',
                    non_refundable: 'bg-amber-500',
                    seasonal: 'bg-emerald-500',
                    promotion: 'bg-purple-500',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[140px] text-left shrink-0 ${toneMap[row.type] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[row.type]}`} />
                        <span className="truncate">{row.typeLabel}</span>
                    </span>
                )
            },
        },
        {
            key: 'discountPercent',
            header: 'MỨC GIẢM GIÁ',
            width: '120px',
            align: 'center',
            cell: (row) => (
                <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {row.discountPercent > 0 ? `-${row.discountPercent}%` : 'Giá gốc'}
                </span>
            ),
        },
        {
            key: 'minNights',
            header: 'ĐÊM TỐI THIỂU',
            width: '120px',
            align: 'center',
            cell: (row) => <span className="text-xs font-medium text-slate-700">{row.minNights} đêm</span>,
        },
        {
            key: 'status',
            header: 'TRẠNG THÁI',
            width: '140px',
            cell: (row) => {
                const statusStyles: Record<string, string> = {
                    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
                    draft: 'bg-amber-50 text-amber-700 border-amber-200',
                }
                const dotStyles: Record<string, string> = {
                    active: 'bg-emerald-500',
                    inactive: 'bg-slate-400',
                    draft: 'bg-amber-500',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[116px] text-left shrink-0 ${statusStyles[row.status] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[row.status] || 'bg-slate-400'}`} />
                        <span className="truncate">{row.statusLabel}</span>
                    </span>
                )
            },
        },
        {
            key: 'action',
            header: 'THAO TÁC',
            align: 'right',
            width: '90px',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1 text-slate-500">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Xác nhận xóa gói giá này?')) {
                                setRatePlans((prev) => prev.filter((r) => r.id !== row.id))
                            }
                        }}
                        className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                        title="Xóa gói giá"
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    const filteredData = ratePlans.filter((item) => {
        if (search) {
            const q = search.toLowerCase()
            const matchCode = item.code.toLowerCase().includes(q)
            const matchNameVi = item.nameVi.toLowerCase().includes(q)
            const matchNameEn = item.nameEn.toLowerCase().includes(q)
            if (!matchCode && !matchNameVi && !matchNameEn) return false
        }
        if (typeFilter !== 'all' && item.type !== typeFilter) return false
        if (statusFilter !== 'all' && item.status !== statusFilter) return false
        return true
    })

    const { tableProps } = useDataTable<RatePlanRowItem>({
        data: filteredData,
        columns,
        rowKey: (row) => row.id,
        selectable: true,
        pageSize: 10,
    })

    const handleReset = () => {
        setSearch('')
        setTypeFilter('all')
        setStatusFilter('all')
    }

    const handleCreateRatePlan = () => {
        if (!nameVi.trim() || !code.trim()) return
        const newPlan: RatePlanRowItem = {
            id: `rp-00${ratePlans.length + 1}`,
            code: code.toUpperCase(),
            nameVi,
            nameEn: nameEn || nameVi,
            type: 'promotion',
            typeLabel: 'Khuyến mãi mới',
            discountPercent,
            minNights,
            includedServices: includedServices || 'Bữa sáng miễn phí',
            status: 'active',
            statusLabel: 'Đang áp dụng',
        }
        setRatePlans([newPlan, ...ratePlans])
        setIsModalOpen(false)
        setCode('')
        setNameVi('')
        setNameEn('')
        setIncludedServices('')
    }

    const stats = {
        total: filteredData.length,
        active: filteredData.filter((i) => i.status === 'active').length,
        maxDiscount: Math.max(...filteredData.map((i) => i.discountPercent), 0),
        standard: filteredData.filter((i) => i.type === 'standard').length,
    }

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 overflow-hidden">
            {/* Top Bar: Title + All Filters & Actions in Header (Today Format) */}
            <div className="w-full bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Left: Title & Count */}
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        Gói Giá & Addons
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {stats.total} gói giá
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
                            placeholder="Tìm mã gói giá, tên gói…"
                            className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                        <div className="absolute left-2 top-1.5 text-slate-400">
                            <EyeIcon size={13} />
                        </div>
                    </div>

                    {/* Type Select */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">Tất cả loại gói giá</option>
                        <option value="standard">Giá Tiêu chuẩn</option>
                        <option value="non_refundable">Không hoàn hủy</option>
                        <option value="seasonal">Mùa cao điểm</option>
                        <option value="promotion">Khuyến mãi</option>
                    </select>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang áp dụng</option>
                        <option value="inactive">Tạm ngưng</option>
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
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-md transition-all shadow-sm active:scale-[0.98] shrink-0 min-h-[32px]"
                    >
                        <PlusIcon size={14} />
                        <span>+ Tạo Gói Giá Mới</span>
                    </button>
                </div>
            </div>

            {/* KPI Statistics Summary Cards (Today Format) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
                {/* Total Stats */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        TỔNG SỐ GÓI GIÁ
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.total} gói</span>
                        <span className="text-[11px] font-semibold text-amber-700">Hệ thống</span>
                    </div>
                </div>

                {/* Active Stats */}
                <div className="bg-white p-2 rounded-sm border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            ĐANG ÁP DỤNG
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.active} gói</span>
                        <span className="text-[11px] font-semibold text-emerald-700">Đang bán trực tuyến</span>
                    </div>
                </div>

                {/* Max Discount */}
                <div className="bg-white p-2 rounded-sm border border-purple-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                            MỨC GIẢM TỐI ĐA
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">-{stats.maxDiscount}%</span>
                        <span className="text-[11px] font-semibold text-purple-700">Gói khuyến mãi</span>
                    </div>
                </div>

                {/* Standard Plan Stats */}
                <div className="bg-white p-2 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            GÓI TIÊU CHUẨN
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.standard} gói</span>
                        <span className="text-[11px] font-semibold text-blue-700">Giá gốc cơ sở</span>
                    </div>
                </div>
            </div>

            {/* Table Container (Today Format) */}
            <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <DataTable<RatePlanRowItem> {...tableProps} />
            </div>

            {/* Modal Create Rate Plan */}
            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Tạo Gói Giá & Addons Mới"
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateRatePlan}
                                className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded"
                            >
                                Tạo Gói Giá
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Mã Gói Giá (Code)"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Ví dụ: RP-SUMMER-2026"
                                required
                            />
                            <Field
                                label="Mức giảm giá (%)"
                                type="number"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Tên Gói Giá (Tiếng Việt)"
                                value={nameVi}
                                onChange={(e) => setNameVi(e.target.value)}
                                placeholder="Ví dụ: Mùa Hè Nam Du Hill"
                                required
                            />
                            <Field
                                label="Tên Gói Giá (English)"
                                value={nameEn}
                                onChange={(e) => setNameEn(e.target.value)}
                                placeholder="Example: Summer Island Vacation"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Số đêm tối thiểu"
                                type="number"
                                value={minNights}
                                onChange={(e) => setMinNights(Number(e.target.value) || 1)}
                            />
                            <Field
                                label="Dịch vụ bao gồm"
                                value={includedServices}
                                onChange={(e) => setIncludedServices(e.target.value)}
                                placeholder="Ví dụ: Bữa sáng buffet + Đón bến tàu"
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
