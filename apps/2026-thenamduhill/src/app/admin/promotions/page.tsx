'use client'

/**
 * Khuyến mãi — màn hình tự giải thích.
 *
 * Khách yêu cầu rõ: phải GIẢI THÍCH cách tính ngay tại đây. Màn hình có đủ 5
 * phần theo `.claude/rules/booking-domain.md` §B4:
 *   1. bảng danh sách
 *   2. form có dòng giải thích dưới từng trường
 *   3. khối "Xem trước cách tính" — chạy đúng engine thật
 *   4. cảnh báo xung đột, nói rõ ai thắng và vì sao
 *   5. bảng thứ tự áp dụng trực quan
 */

import { useMemo, useState } from 'react'
import {
    addDays,
    buildQuote,
    childPolicy,
    findPromotionConflicts,
    formatPrice,
    getPropertySync,
    pick,
    ratePlans,
    seasons,
    t,
} from '@repo/core'
import type { Promotion, PromotionType } from '@repo/core'
import {
    Badge,
    Button,
    CheckField,
    DataTable,
    Field,
    Modal,
    SelectField,
    TextAreaField,
} from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { usePromotionStore } from '@/stores/promotion.store'
import { todayKey } from '@/stores/demo-data'
import { PriceBreakdown } from '@/components/PriceBreakdown'
import {
    PROMO_TYPE_HINT,
    PROMO_TYPE_LABEL,
    REJECT_REASON_LABEL,
    S,
    tr,
} from '@/strings'
import { PencilIcon } from '@/components/icons'

const TYPES: PromotionType[] = [
    'percent',
    'fixed',
    'nth-night-free',
    'long-stay',
    'early-bird',
    'last-minute',
    'free-addon',
]

export default function PromotionsPage() {
    const { locale } = useLocale()
    const promotions = usePromotionStore((s) => s.items)
    const toggle = usePromotionStore((s) => s.toggle)
    const upsert = usePromotionStore((s) => s.upsert)

    const [editing, setEditing] = useState<Promotion | null>(null)
    const [infoPromo, setInfoPromo] = useState<Promotion | null>(null)
    const [activeTab, setActiveTab] = useState<'list' | 'calc'>('list')
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 10

    const conflicts = useMemo(() => findPromotionConflicts(promotions), [promotions])

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return promotions.filter((p) => {
            if (statusFilter === 'active' && !p.active) return false
            if (statusFilter === 'inactive' && p.active) return false
            if (typeFilter !== 'all' && p.type !== typeFilter) return false
            if (!needle) return true
            const nameStr = pick(p.name, locale).toLowerCase()
            const codeStr = (p.code || '').toLowerCase()
            return nameStr.includes(needle) || codeStr.includes(needle)
        })
    }, [promotions, search, typeFilter, statusFilter, locale])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    const activeCount = promotions.filter((p) => p.active).length
    const stackableCount = promotions.filter((p) => p.stackable).length
    const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0)

    const resetFilters = () => {
        setSearch('')
        setTypeFilter('all')
        setStatusFilter('all')
        setPage(1)
    }

    const columns: Column<Promotion>[] = [
        {
            key: 'name',
            header: locale === 'vi' ? 'TÊN CHƯƠNG TRÌNH & MÃ CODE' : 'PROMO NAME & CODE',
            cell: (p) => (
                <div>
                    <div className="font-semibold text-slate-900">{pick(p.name, locale)}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {p.code ? (
                            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-semibold text-[11px]">
                                {p.code}
                            </span>
                        ) : (
                            <span className="text-slate-400 italic">
                                {locale === 'vi' ? 'Tự động áp dụng' : 'Automatic'}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: locale === 'vi' ? 'LOẠI KHUYẾN MÃI' : 'TYPE',
            cell: (p) => (
                <div>
                    <div className="font-medium text-slate-800 text-xs">{tr(PROMO_TYPE_LABEL[p.type], locale)}</div>
                    <div className="text-xs text-slate-500">{describeValue(p, locale)}</div>
                </div>
            ),
        },
        {
            key: 'window',
            header: locale === 'vi' ? 'THỜI GIAN ÁP DỤNG' : 'STAY WINDOW',
            cell: (p) =>
                p.conditions.stayFrom || p.conditions.stayTo ? (
                    <span className="text-xs text-slate-600 font-mono whitespace-nowrap">
                        {p.conditions.stayFrom ?? '…'} → {p.conditions.stayTo ?? '…'}
                    </span>
                ) : (
                    <span className="text-xs text-slate-400">
                        {locale === 'vi' ? 'Tất cả các ngày' : 'All dates'}
                    </span>
                ),
        },
        {
            key: 'stacking',
            header: locale === 'vi' ? 'QUY TẮC CỘNG DỒN' : 'STACKING',
            width: '130px',
            cell: (p) => (
                <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[108px] text-left shrink-0 ${p.stackable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.stackable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="truncate">{p.stackable ? (locale === 'vi' ? 'Cộng dồn' : 'Stackable') : (locale === 'vi' ? 'Độc quyền' : 'Exclusive')}</span>
                </span>
            ),
        },
        {
            key: 'usage',
            header: locale === 'vi' ? 'ĐÃ DÙNG' : 'USAGE',
            align: 'right',
            width: '100px',
            cell: (p) => (
                <span className="text-xs font-semibold text-slate-800">
                    {p.usageCount}
                    {p.usageLimit !== undefined ? ` / ${p.usageLimit}` : ''}
                </span>
            ),
        },
        {
            key: 'active',
            header: locale === 'vi' ? 'TRẠNG THÁI' : 'STATUS',
            width: '130px',
            cell: (p) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        toggle(p.id)
                    }}
                    title={p.active ? 'Bấm để tắt' : 'Bấm để bật'}
                    className="focus:outline-none"
                >
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[108px] text-left shrink-0 cursor-pointer transition-colors ${p.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span className="truncate">{p.active ? (locale === 'vi' ? 'Đang chạy' : 'Active') : (locale === 'vi' ? 'Đã tắt' : 'Disabled')}</span>
                    </span>
                </button>
            ),
        },
        {
            key: 'actions',
            header: locale === 'vi' ? 'THAO TÁC' : 'ACTION',
            align: 'right',
            width: '100px',
            inCard: false,
            cell: (p) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            setInfoPromo(p)
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title={locale === 'vi' ? 'Xem công thức & cách tính toán' : 'View calculation formula'}
                    >
                        <span className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center text-[10px] font-bold">i</span>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditing(p)
                        }}
                        className="p-1 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                        title={tr(S.edit, locale)}
                    >
                        <PencilIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 p-3 bg-slate-100 overflow-hidden">
            {/* Top Bar: Title + Tab Switcher + Filters & Actions */}
            <div className="w-full bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0">
                {/* Left: Title, Count & Tab Navigation */}
                <div className="flex items-center gap-3 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        {tr(S.promotions, locale)}
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {activeCount} {locale === 'vi' ? 'đang chạy' : 'active'} / {promotions.length}
                    </span>

                    {/* View Switcher Tabs */}
                    <div className="flex items-center p-0.5 bg-slate-100 rounded-md border border-slate-200 shrink-0">
                        <button
                            type="button"
                            onClick={() => setActiveTab('list')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                                activeTab === 'list'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            📋 {locale === 'vi' ? 'Danh sách mã' : 'List View'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('calc')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                                activeTab === 'calc'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            🧮 {locale === 'vi' ? 'Công thức & Tính toán' : 'Formulas & Calc'}
                        </button>
                    </div>
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
                            placeholder={locale === 'vi' ? 'Tìm tên mã, code…' : 'Search code or name…'}
                            className="w-full pl-3 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                    </div>

                    {/* Type Select */}
                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value)
                            setPage(1)
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">{locale === 'vi' ? 'Tất cả loại' : 'All types'}</option>
                        {TYPES.map((tKey) => (
                            <option key={tKey} value={tKey}>
                                {tr(PROMO_TYPE_LABEL[tKey], locale)}
                            </option>
                        ))}
                    </select>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value)
                            setPage(1)
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">{locale === 'vi' ? 'Tất cả trạng thái' : 'All statuses'}</option>
                        <option value="active">{locale === 'vi' ? 'Đang chạy' : 'Active'}</option>
                        <option value="inactive">{locale === 'vi' ? 'Đã tắt' : 'Disabled'}</option>
                    </select>

                    {/* Reset Button */}
                    {(search || typeFilter !== 'all' || statusFilter !== 'all') && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="px-2 py-1 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                        >
                            {locale === 'vi' ? 'Đặt lại' : 'Reset'}
                        </button>
                    )}

                    {/* Primary Action Button */}
                    <button
                        type="button"
                        onClick={() => setEditing(blankPromotion())}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-md transition-all shadow-sm active:scale-[0.98] shrink-0 border border-amber-400/50 min-h-[32px]"
                    >
                        <span>+ {tr(S.newPromotion, locale)}</span>
                    </button>
                </div>
            </div>

            {/* Promotions KPI Statistics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 shrink-0">
                {/* Total Promotions */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {locale === 'vi' ? 'TẤT CẢ CHƯƠNG TRÌNH' : 'TOTAL PROMOS'}
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">{promotions.length} mã</div>
                </div>

                {/* Active Promotions */}
                <div className="bg-white p-2 rounded-sm border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            ĐANG KÍCH HOẠT
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">{activeCount} mã</div>
                </div>

                {/* Stackable Promotions */}
                <div className="bg-white p-2 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            CHO PHÉP CỘNG DỒN
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">{stackableCount} mã</div>
                </div>

                {/* Total Usage Count */}
                <div className="bg-white p-2 rounded-sm border border-purple-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                            TỔNG LƯỢT ĐÃ DÙNG
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">{totalUsage} lượt</div>
                </div>

                {/* Conflict Warnings */}
                <div className="bg-white p-2 rounded-sm border border-rose-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                            XUNG ĐỘT PHÁT HIỆN
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${conflicts.length > 0 ? 'bg-rose-500' : 'bg-slate-300'}`} />
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">{conflicts.length} cảnh báo</div>
                </div>
            </div>

            {/* TAB 1: Standalone High-Density Datatable View (100% Today Parity) */}
            {activeTab === 'list' && (
                <div className="w-full flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <DataTable
                        caption={tr(S.promotions, locale)}
                        columns={columns}
                        rows={pageRows}
                        rowKey={(p) => p.id}
                        empty={tr(S.noPromotions, locale)}
                    />

                    {filtered.length > 0 && (
                        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap text-xs text-slate-500 shrink-0">
                            <span>
                                {locale === 'vi' ? 'Hiển thị' : 'Showing'}{' '}
                                <strong className="text-slate-900 font-semibold">
                                    {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
                                </strong>{' '}
                                {locale === 'vi' ? 'trong' : 'of'}{' '}
                                <strong className="text-slate-900 font-semibold">{filtered.length}</strong>{' '}
                                {locale === 'vi' ? 'mã' : 'promotions'}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={safePage === 1}
                                    onClick={() => setPage(safePage - 1)}
                                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← {locale === 'vi' ? 'Trước' : 'Prev'}
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
                                    {locale === 'vi' ? 'Sau' : 'Next'} →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: Dedicated Calculation & Engine Mechanics View - Side-by-Side Single Screen */}
            {activeTab === 'calc' && (
                <div className="w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
                    {/* Left Column (5 Cols): Formulas, Rules & Priority Order */}
                    <div className="lg:col-span-5 flex flex-col space-y-2.5 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                        <HowItWorks />

                        {conflicts.length > 0 && (
                            <ConflictWarnings conflicts={conflicts} promotions={promotions} />
                        )}

                        <ApplyOrder promotions={promotions.filter((p) => p.active)} />
                    </div>

                    {/* Right Column (7 Cols): Live Formula Engine Price Calculator */}
                    <div className="lg:col-span-7 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-1">
                        <PreviewCalculator />
                    </div>
                </div>
            )}

            {/* Modal Show Calculation Breakdown & Engine Formula for Specific Promo */}
            {infoPromo && (
                <CalculationInfoModal
                    promotion={infoPromo}
                    onClose={() => setInfoPromo(null)}
                />
            )}

            {/* Edit / New Promotion Modal */}
            {editing && (
                <PromotionForm
                    promotion={editing}
                    onClose={() => setEditing(null)}
                    onSave={(next) => {
                        upsert(next)
                        setEditing(null)
                    }}
                />
            )}
        </div>
    )
}

// ================================================== Modal Giải Thích Công Thức
function CalculationInfoModal({
    promotion,
    onClose,
}: {
    promotion: Promotion
    onClose: () => void
}) {
    const { locale } = useLocale()
    return (
        <Modal
            open={true}
            title={`ℹ️ ${locale === 'vi' ? 'Công thức & Chi tiết tính toán' : 'Formula & Calculation Details'}: ${pick(promotion.name, locale)}`}
            onClose={onClose}
        >
            <div className="space-y-4 text-xs text-slate-700">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                    <div>
                        <div className="font-bold text-amber-900 text-sm">{pick(promotion.name, locale)}</div>
                        <div className="font-mono text-amber-800 font-semibold mt-0.5">
                            Mã Code: {promotion.code || (locale === 'vi' ? 'Tự động áp dụng' : 'Automatic')}
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded border ${promotion.active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                        {promotion.active ? (locale === 'vi' ? 'Đang chạy' : 'Active') : (locale === 'vi' ? 'Đã tắt' : 'Disabled')}
                    </span>
                </div>

                {/* Formula Breakdown */}
                <div className="bg-white p-3 border border-slate-200 rounded-lg space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b pb-1">
                        1. Công thức giảm giá ({tr(PROMO_TYPE_LABEL[promotion.type], locale)})
                    </h4>
                    <p className="text-slate-600 font-medium">
                        {describeValue(promotion, locale)}
                    </p>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-mono text-[11px]">
                        {tr(PROMO_TYPE_HINT[promotion.type], locale)}
                    </div>
                </div>

                {/* Stacking & Priority Rules */}
                <div className="bg-white p-3 border border-slate-200 rounded-lg space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b pb-1">
                        2. Quy tắc thứ tự & Cộng dồn (Priority & Stacking)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-slate-50 rounded border border-slate-200">
                            <span className="text-slate-500 font-medium block">Thứ tự ưu tiên:</span>
                            <span className="font-bold text-slate-900">Độ ưu tiên #{promotion.priority}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200">
                            <span className="text-slate-500 font-medium block">Chế độ cộng dồn:</span>
                            <span className={`font-bold ${promotion.stackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {promotion.stackable ? (locale === 'vi' ? 'Cho phép cộng dồn' : 'Stackable') : (locale === 'vi' ? 'Độc quyền (Không cộng dồn)' : 'Exclusive')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Conditions */}
                <div className="bg-white p-3 border border-slate-200 rounded-lg space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b pb-1">
                        3. Điều kiện áp dụng (Conditions)
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>
                            Khung ngày ở: {promotion.conditions.stayFrom || promotion.conditions.stayTo ? `${promotion.conditions.stayFrom ?? '…'} đến ${promotion.conditions.stayTo ?? '…'}` : (locale === 'vi' ? 'Áp dụng mọi ngày' : 'All dates')}
                        </li>
                        {promotion.conditions.minNights && (
                            <li>Yêu cầu số đêm tối thiểu: <strong>{promotion.conditions.minNights} đêm</strong></li>
                        )}
                        {promotion.conditions.minAmount && (
                            <li>Giá trị đơn tối thiểu: <strong>{formatPrice(promotion.conditions.minAmount, locale)}</strong></li>
                        )}
                        {promotion.usageLimit && (
                            <li>Giới hạn số lần dùng: <strong>{promotion.usageCount} / {promotion.usageLimit} lượt</strong></li>
                        )}
                    </ul>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow-sm transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    )
}

// ================================================== khối giải thích thuật toán

function HowItWorks() {
    const { locale } = useLocale()
    const [open, setOpen] = useState(true)

    const steps =
        locale === 'vi'
            ? [
                  'Lọc các khuyến mãi đang kích hoạt & thoả điều kiện.',
                  'Sắp xếp theo thứ tự ưu tiên (Priority số nhỏ áp trước).',
                  'Nếu có KM độc quyền: giữ DUY NHẤT 1 mã ưu tiên cao nhất.',
                  'Tính giảm giá trên SỐ TIỀN CÒN LẠI sau các lần áp trước.',
                  'Áp dụng trần giảm tối đa (Max Discount) nếu có.',
              ]
            : [
                  'Filter active promotions meeting conditions.',
                  'Sort by priority (lower number applies first).',
                  'Exclusive promo: keeps ONLY the top priority promo.',
                  'Calculate discount on the REMAINING amount.',
                  'Apply maximum discount cap if set.',
              ]

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 space-y-2">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors"
            >
                <span className="flex items-center gap-1.5">
                    <span>💡</span>
                    <span>
                        {locale === 'vi'
                            ? 'Quy tắc thuật toán tính khuyến mãi'
                            : 'Promotion Calculation Rules'}
                    </span>
                </span>
                <span className="text-slate-400 text-sm font-mono">{open ? '▾' : '▸'}</span>
            </button>

            {open && (
                <div className="space-y-2 text-xs text-slate-700 pt-1">
                    <ol className="list-decimal pl-4 space-y-1 text-slate-600 font-medium">
                        {steps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ol>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-[11px]">
                        <strong className="text-slate-900 block font-semibold">
                            {locale === 'vi'
                                ? 'Ví dụ tính phép nhân cộng dồn (1.000.000đ, 10% + 20%):'
                                : 'Multiplicative compound example (1,000,000₫, 10% + 20%):'}
                        </strong>
                        <div className="mt-1 font-mono space-y-0.5">
                            <div className="text-rose-600">
                                ✗ Cộng dồn %: 1.000.000 × 30% = giảm 300.000đ
                            </div>
                            <div className="text-emerald-700 font-bold">
                                ✓ Nhân nối tiếp: 1.000.000 × 0.9 × 0.8 = 720.000đ (Giảm 280.000đ)
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

// ==================================================== cảnh báo xung đột

function ConflictWarnings({
    conflicts,
    promotions,
}: {
    conflicts: ReturnType<typeof findPromotionConflicts>
    promotions: Promotion[]
}) {
    const { locale } = useLocale()
    const nameOf = (id: string) => {
        const promo = promotions.find((p) => p.id === id)
        return promo ? pick(promo.name, locale) : id
    }

    return (
        <section
            style={{
                background: 'var(--warning-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
            }}
        >
            <h2
                style={{
                    margin: '0 0 var(--space-3)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--warning)',
                }}
            >
                {tr(S.conflictWarning, locale)} ({conflicts.length})
            </h2>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)' }}>
                {conflicts.map((conflict, i) => (
                    <li key={i} style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                        <strong>
                            {nameOf(conflict.a)} ↔ {nameOf(conflict.b)}
                        </strong>
                        <div style={{ color: 'var(--text-muted)' }}>
                            {conflict.kind === 'both-exclusive'
                                ? tr(S.conflictBothExclusive, locale)
                                : tr(S.conflictSamePriority, locale)}
                            {conflict.winnerId && (
                                <>
                                    {' '}
                                    <strong style={{ color: 'var(--text)' }}>
                                        {tr(S.winnerIs, locale)}: {nameOf(conflict.winnerId)}
                                    </strong>{' '}
                                    (
                                    {locale === 'vi'
                                        ? 'thứ tự áp dụng nhỏ hơn'
                                        : 'lower priority number'}
                                    )
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

// ================================================== bảng thứ tự áp dụng

function ApplyOrder({ promotions }: { promotions: Promotion[] }) {
    const { locale } = useLocale()
    const ordered = [...promotions].sort((a, b) => a.priority - b.priority)

    if (ordered.length === 0) return null

    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
            }}
        >
            <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-display)' }}>
                {tr(S.applyOrder, locale)}
            </h2>
            <ol
                style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    flexWrap: 'wrap',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    alignItems: 'center',
                }}
            >
                {ordered.map((promo, index) => (
                    <li key={promo.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {index > 0 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
                        <span
                            style={{
                                padding: 'var(--space-2) var(--space-3)',
                                background: promo.stackable ? 'var(--surface-tint)' : 'var(--warning-bg)',
                                border: `1px solid ${promo.stackable ? 'var(--border)' : 'var(--warning)'}`,
                                borderRadius: 'var(--radius)',
                                fontSize: 'var(--text-xs)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <strong>{promo.priority}</strong> · {pick(promo.name, locale)}
                            {!promo.stackable && (
                                <span style={{ color: 'var(--warning)' }}>
                                    {' '}
                                    ({locale === 'vi' ? 'độc quyền' : 'exclusive'})
                                </span>
                            )}
                        </span>
                    </li>
                ))}
            </ol>
        </section>
    )
}

// ================================================== khối xem trước cách tính

function PreviewCalculator() {
    const { locale } = useLocale()
    const property = getPropertySync()
    const inventory = useBookingStore((s) => s.inventory)
    const promotions = usePromotionStore((s) => s.items)

    const today = todayKey()
    const [roomTypeId, setRoomTypeId] = useState(property.rooms[0]?.id ?? '')
    const [checkIn, setCheckIn] = useState(addDays(today, 40))
    const [nights, setNights] = useState(3)
    const [adults, setAdults] = useState(2)
    const [code, setCode] = useState('')

    const quote = useMemo(() => {
        const room = property.rooms.find((r) => r.id === roomTypeId)
        if (!room) return null
        return buildQuote({
            room,
            roomExtra: property.roomExtras[room.id],
            checkIn,
            checkOut: addDays(checkIn, nights),
            guests: { adults, children: [] },
            seasons,
            inventory,
            ratePlan: ratePlans[0],
            addons: {},
            addonCatalog: property.addons,
            childPolicy,
            promotions: promotions.filter((p) => p.active),
            channel: 'web',
            today,
            enteredCode: code || undefined,
        })
    }, [roomTypeId, checkIn, nights, adults, code, inventory, promotions, property, today])

    const rejected = quote?.promotion.evaluations.filter((e) => !e.eligible) ?? []

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-3.5 space-y-3 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
            <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🧮</span>
                    <span>{tr(S.previewTitle, locale)}</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                    {tr(S.previewHint, locale)}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-0">
                {/* Inputs Form */}
                <div className="md:col-span-5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2.5 shrink-0 self-start">
                    <SelectField
                        label={locale === 'vi' ? 'Hạng phòng' : 'Room type'}
                        value={roomTypeId}
                        onChange={(e) => setRoomTypeId(e.target.value)}
                    >
                        {property.rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {pick(room.name, locale)}
                            </option>
                        ))}
                    </SelectField>

                    <Field
                        label={tr(S.checkIn, locale)}
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <Field
                            label={locale === 'vi' ? 'Số đêm' : 'Nights'}
                            type="number"
                            min={1}
                            max={14}
                            value={nights}
                            onChange={(e) => setNights(Math.max(1, Number(e.target.value) || 1))}
                        />
                        <Field
                            label={tr(S.adults, locale)}
                            type="number"
                            min={1}
                            value={adults}
                            onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                        />
                    </div>

                    <Field
                        label={tr(S.promoCode, locale)}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        hint={locale === 'vi' ? 'Thử NAMDU10 hoặc WELCOME' : 'Try NAMDU10 or WELCOME'}
                    />
                </div>

                {/* Calculation Engine Result Output */}
                <div className="md:col-span-7 bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                    {quote ? (
                        <div className="space-y-3">
                            <PriceBreakdown quote={quote} locale={locale} explainPromotions />

                            {rejected.length > 0 && (
                                <div className="pt-2.5 border-t border-slate-200">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        {locale === 'vi'
                                            ? 'Khuyến mãi không đủ điều kiện'
                                            : 'Promotions not applied'}
                                    </div>
                                    <ul className="space-y-1">
                                        {rejected.map((item) => (
                                            <li
                                                key={item.promotion.id}
                                                className="flex items-center justify-between text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200"
                                            >
                                                <span className="font-medium text-slate-800">{pick(item.promotion.name, locale)}</span>
                                                <span className="text-[10px] font-semibold text-rose-600">
                                                    {item.reason
                                                        ? tr(REJECT_REASON_LABEL[item.reason], locale)
                                                        : ''}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">
                            {locale === 'vi' ? 'Chọn hạng phòng để xem.' : 'Pick a room type to preview.'}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}

// ==================================================================== form

function blankPromotion(): Promotion {
    return {
        id: `promo-${Date.now()}`,
        name: t('', ''),
        description: t('', ''),
        type: 'percent',
        value: 10,
        conditions: {},
        stackable: true,
        priority: 50,
        usageCount: 0,
        active: false,
    }
}

function PromotionForm({
    promotion,
    onClose,
    onSave,
}: {
    promotion: Promotion
    onClose: () => void
    onSave: (promotion: Promotion) => void
}) {
    const { locale } = useLocale()
    const property = getPropertySync()
    const [draft, setDraft] = useState<Promotion>(promotion)

    const patch = (changes: Partial<Promotion>) => setDraft({ ...draft, ...changes })
    const patchConditions = (changes: Partial<Promotion['conditions']>) =>
        setDraft({ ...draft, conditions: { ...draft.conditions, ...changes } })

    const ready = draft.name.vi.trim() && draft.name.en.trim()

    return (
        <Modal
            open
            onClose={onClose}
            title={promotion.name.vi ? tr(S.edit, locale) : tr(S.newPromotion, locale)}
            width={640}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        {tr(S.cancel, locale)}
                    </Button>
                    <Button disabled={!ready} onClick={() => onSave(draft)}>
                        {tr(S.save, locale)}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                {/* --- tên song ngữ: bắt buộc theo luật R6 --- */}
                <FormGroup title={locale === 'vi' ? 'Nội dung' : 'Content'}>
                    <Field
                        label={`${tr(S.promoName, locale)} (VI)`}
                        value={draft.name.vi}
                        onChange={(e) => patch({ name: { ...draft.name, vi: e.target.value } })}
                        required
                    />
                    <Field
                        label={`${tr(S.promoName, locale)} (EN)`}
                        value={draft.name.en}
                        onChange={(e) => patch({ name: { ...draft.name, en: e.target.value } })}
                        hint={
                            locale === 'vi'
                                ? 'Bắt buộc — mọi chuỗi khách nhìn thấy phải có cả hai ngôn ngữ.'
                                : 'Required — every guest-facing string needs both languages.'
                        }
                        required
                    />
                    <TextAreaField
                        label={`${tr(S.promoDescription, locale)} (VI)`}
                        value={draft.description.vi}
                        onChange={(e) =>
                            patch({ description: { ...draft.description, vi: e.target.value } })
                        }
                    />
                    <TextAreaField
                        label={`${tr(S.promoDescription, locale)} (EN)`}
                        value={draft.description.en}
                        onChange={(e) =>
                            patch({ description: { ...draft.description, en: e.target.value } })
                        }
                    />
                </FormGroup>

                {/* --- kiểu và giá trị --- */}
                <FormGroup title={locale === 'vi' ? 'Cách giảm' : 'Discount mechanics'}>
                    <SelectField
                        label={tr(S.promoType, locale)}
                        value={draft.type}
                        onChange={(e) => patch({ type: e.target.value as PromotionType })}
                        hint={tr(PROMO_TYPE_HINT[draft.type], locale)}
                    >
                        {TYPES.map((type) => (
                            <option key={type} value={type}>
                                {tr(PROMO_TYPE_LABEL[type], locale)}
                            </option>
                        ))}
                    </SelectField>

                    {draft.type !== 'long-stay' && (
                        <Field
                            label={tr(S.promoValue, locale)}
                            type="number"
                            min={0}
                            value={draft.value}
                            onChange={(e) => patch({ value: Number(e.target.value) || 0 })}
                            hint={valueHint(draft.type, locale)}
                        />
                    )}

                    <Field
                        label={tr(S.promoCodeField, locale)}
                        value={draft.code ?? ''}
                        onChange={(e) => patch({ code: e.target.value.toUpperCase() || undefined })}
                        hint={tr(S.promoCodeHint, locale)}
                        placeholder={locale === 'vi' ? 'Để trống = tự động' : 'Blank = automatic'}
                    />

                    <Field
                        label={tr(S.maxDiscount, locale)}
                        type="number"
                        min={0}
                        step={50000}
                        value={draft.maxDiscount ?? ''}
                        onChange={(e) =>
                            patch({ maxDiscount: e.target.value ? Number(e.target.value) : undefined })
                        }
                        hint={tr(S.maxDiscountHint, locale)}
                    />
                </FormGroup>

                {/* --- quy tắc kết hợp: phần dễ sai nhất --- */}
                <FormGroup title={locale === 'vi' ? 'Quy tắc kết hợp' : 'Stacking rules'}>
                    <CheckField
                        label={tr(S.stackable, locale)}
                        checked={draft.stackable}
                        onChange={(e) => patch({ stackable: e.target.checked })}
                        hint={tr(S.stackableHint, locale)}
                    />
                    <Field
                        label={tr(S.priority, locale)}
                        type="number"
                        min={0}
                        value={draft.priority}
                        onChange={(e) => patch({ priority: Number(e.target.value) || 0 })}
                        hint={tr(S.priorityHint, locale)}
                    />
                </FormGroup>

                {/* --- điều kiện --- */}
                <FormGroup title={tr(S.conditionsTitle, locale)}>
                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                        <Field
                            label={`${tr(S.stayWindow, locale)} — ${tr(S.from, locale)}`}
                            type="date"
                            value={draft.conditions.stayFrom ?? ''}
                            onChange={(e) => patchConditions({ stayFrom: e.target.value || undefined })}
                        />
                        <Field
                            label={`${tr(S.stayWindow, locale)} — ${locale === 'vi' ? 'đến' : 'to'}`}
                            type="date"
                            value={draft.conditions.stayTo ?? ''}
                            onChange={(e) => patchConditions({ stayTo: e.target.value || undefined })}
                        />
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                        <Field
                            label={tr(S.minNights, locale)}
                            type="number"
                            min={1}
                            value={draft.conditions.minNights ?? ''}
                            onChange={(e) =>
                                patchConditions({
                                    minNights: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        />
                        <Field
                            label={tr(S.minAmountLabel, locale)}
                            type="number"
                            min={0}
                            step={100000}
                            value={draft.conditions.minAmount ?? ''}
                            onChange={(e) =>
                                patchConditions({
                                    minAmount: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        />
                    </div>

                    {(draft.type === 'early-bird' || draft.type === 'last-minute') && (
                        <Field
                            label={tr(S.daysBeforeLabel, locale)}
                            type="number"
                            min={0}
                            value={draft.conditions.daysBeforeCheckIn ?? ''}
                            onChange={(e) =>
                                patchConditions({
                                    daysBeforeCheckIn: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                            hint={
                                draft.type === 'early-bird'
                                    ? locale === 'vi'
                                        ? 'Khách phải đặt SỚM HƠN số ngày này.'
                                        : 'Guest must book EARLIER than this many days.'
                                    : locale === 'vi'
                                      ? 'Khách phải đặt TRONG VÒNG số ngày này.'
                                      : 'Guest must book WITHIN this many days.'
                            }
                        />
                    )}

                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {tr(S.appliesToRooms, locale)}
                        </div>
                        <p
                            style={{
                                margin: '0 0 var(--space-3)',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            {tr(S.appliesToRoomsHint, locale)}
                        </p>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                            {property.rooms.map((room) => {
                                const list = draft.conditions.roomTypeIds ?? []
                                const checked = list.includes(room.id)
                                return (
                                    <CheckField
                                        key={room.id}
                                        label={pick(room.name, locale)}
                                        checked={checked}
                                        onChange={(e) =>
                                            patchConditions({
                                                roomTypeIds: e.target.checked
                                                    ? [...list, room.id]
                                                    : list.filter((id) => id !== room.id),
                                            })
                                        }
                                    />
                                )
                            })}
                        </div>
                    </div>
                </FormGroup>

                {/* --- hạn mức --- */}
                <FormGroup title={locale === 'vi' ? 'Giới hạn' : 'Limits'}>
                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                        <Field
                            label={tr(S.usageLimit, locale)}
                            type="number"
                            min={0}
                            value={draft.usageLimit ?? ''}
                            onChange={(e) =>
                                patch({ usageLimit: e.target.value ? Number(e.target.value) : undefined })
                            }
                        />
                        <Field
                            label={tr(S.perCustomerLimit, locale)}
                            type="number"
                            min={0}
                            value={draft.perCustomerLimit ?? ''}
                            onChange={(e) =>
                                patch({
                                    perCustomerLimit: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                        />
                    </div>
                    <CheckField
                        label={locale === 'vi' ? 'Bật chương trình' : 'Activate promotion'}
                        checked={draft.active}
                        onChange={(e) => patch({ active: e.target.checked })}
                        hint={
                            locale === 'vi'
                                ? 'Chỉ khuyến mãi đang bật mới được áp vào giá khách thấy.'
                                : 'Only active promotions affect the price guests see.'
                        }
                    />
                </FormGroup>
            </div>
        </Modal>
    )
}

function FormGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            <legend
                style={{
                    padding: 0,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                }}
            >
                {title}
            </legend>
            {children}
        </fieldset>
    )
}

// ================================================================ tiện ích

function describeValue(promo: Promotion, locale: 'vi' | 'en'): string {
    switch (promo.type) {
        case 'percent':
        case 'early-bird':
        case 'last-minute':
            return `−${promo.value}%`
        case 'fixed':
        case 'free-addon':
            return `−${formatPrice(promo.value, locale)}`
        case 'nth-night-free':
            return locale === 'vi' ? `Đêm thứ ${promo.value}` : `Night ${promo.value}`
        case 'long-stay':
            return (promo.conditions.tiers ?? [])
                .map((tier) => `≥${tier.minNights}đ: −${tier.percent}%`)
                .join(' · ')
    }
}

function valueHint(type: PromotionType, locale: 'vi' | 'en'): string {
    switch (type) {
        case 'percent':
        case 'early-bird':
        case 'last-minute':
            return locale === 'vi' ? 'Nhập số phần trăm, ví dụ 15' : 'Enter a percentage, e.g. 15'
        case 'fixed':
        case 'free-addon':
            return locale === 'vi' ? 'Nhập số tiền VNĐ' : 'Enter an amount in VND'
        case 'nth-night-free':
            return locale === 'vi' ? 'Nhập N — đêm thứ N được tặng' : 'Enter N — the Nth night is free'
        default:
            return ''
    }
}
