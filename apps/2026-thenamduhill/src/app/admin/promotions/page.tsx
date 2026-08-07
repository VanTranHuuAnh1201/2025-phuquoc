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
    Button,
    CheckField,
    Field,
    Modal,
    SelectField,
    TextAreaField,
} from '@repo/ui'
import type { Column } from '@repo/ui'
import {
    DataGrid,
    DotBadge,
    FilterBar,
    InlineAlert,
    KpiCard,
    MetricStrip,
    PageHeaderBar,
    type CmsTone,
} from '@repo/cms-ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { usePromotionStore } from '@/stores/promotion.store'
import { usePromotionsData } from '@/hooks/useAdminData'
import { todayKey } from '@/stores/demo-data'
import { PriceBreakdown } from '@/components/PriceBreakdown'
import {
    PROMO_TYPE_HINT,
    PROMO_TYPE_LABEL,
    REJECT_REASON_LABEL,
    S,
    tr,
} from '@/strings'
import { PencilIcon, SearchIcon, TicketIcon, GridIcon, InfoIcon } from '@/components/icons'

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
    const { promotions, toggle, upsert } = usePromotionsData()

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

    // Badge cộng dồn/độc quyền — dùng chung tone `emerald`/`amber` với badge
    // trạng thái ở dashboard (STATUS_TONE_MAP), không tự chế thang màu riêng.
    const STACKING_TONE: Record<'stackable' | 'exclusive', CmsTone> = {
        stackable: 'emerald',
        exclusive: 'amber',
    }
    const ACTIVE_TONE: Record<'active' | 'inactive', CmsTone> = {
        active: 'emerald',
        inactive: 'slate',
    }

    const columns: Column<Promotion>[] = [
        {
            key: 'name',
            header: tr(S.promoNameAndCode, locale),
            cell: (p) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={pick(p.name, locale)}
                    >
                        {pick(p.name, locale)}
                    </div>
                    <div className="mt-0.5 text-[length:var(--cms-text-meta)] font-mono">
                        {p.code ? (
                            <span className="rounded-[var(--cms-radius-sm)] border border-[var(--cms-tone-amber-dot)] bg-[var(--cms-tone-amber-bg)] px-1.5 py-0.5 font-semibold text-[var(--cms-tone-amber)]">
                                {p.code}
                            </span>
                        ) : (
                            <span className="italic text-[var(--cms-text-muted)]">
                                {tr(S.autoApplied, locale)}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: tr(S.promoType, locale),
            cell: (p) => (
                <div className="min-w-0">
                    <div className="truncate text-[length:var(--cms-text-body)] text-[var(--cms-text)]">
                        {tr(PROMO_TYPE_LABEL[p.type], locale)}
                    </div>
                    <div className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {describeValue(p, locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'window',
            header: tr(S.stayWindow, locale),
            cell: (p) =>
                p.conditions.stayFrom || p.conditions.stayTo ? (
                    <span className="whitespace-nowrap font-mono text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {p.conditions.stayFrom ?? '…'} → {p.conditions.stayTo ?? '…'}
                    </span>
                ) : (
                    <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {tr(S.allDates, locale)}
                    </span>
                ),
        },
        {
            key: 'stacking',
            header: tr(S.stacking, locale),
            width: '130px',
            cell: (p) => (
                <DotBadge
                    tone={STACKING_TONE[p.stackable ? 'stackable' : 'exclusive']}
                    label={p.stackable ? tr(S.stackableShort, locale) : tr(S.exclusiveShort, locale)}
                    width={108}
                />
            ),
        },
        {
            key: 'usage',
            header: tr(S.usage, locale),
            align: 'right',
            width: '100px',
            cell: (p) => (
                <span className="text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text)] tabular-nums">
                    {p.usageCount}
                    {p.usageLimit !== undefined ? ` / ${p.usageLimit}` : ''}
                </span>
            ),
        },
        {
            key: 'active',
            header: tr(S.promoStatus, locale),
            width: '130px',
            cell: (p) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        toggle(p.id)
                    }}
                    title={p.active ? tr(S.clickToDisable, locale) : tr(S.clickToEnable, locale)}
                    className="rounded-[var(--cms-radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                >
                    <DotBadge
                        tone={ACTIVE_TONE[p.active ? 'active' : 'inactive']}
                        label={p.active ? tr(S.statusActive, locale) : tr(S.statusDisabled, locale)}
                        width={108}
                    />
                </button>
            ),
        },
        {
            key: 'actions',
            header: tr(S.promoAction, locale),
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
                        className="rounded-[var(--cms-radius-sm)] p-1 text-[var(--cms-accent)] transition-colors hover:bg-[var(--cms-accent-weak)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        title={tr(S.viewCalcFormula, locale)}
                        aria-label={`${tr(S.viewCalcFormula, locale)} — ${pick(p.name, locale)}`}
                    >
                        <InfoIcon size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditing(p)
                        }}
                        className="rounded-[var(--cms-radius-sm)] p-1 text-[var(--cms-text-muted)] transition-colors hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        title={tr(S.edit, locale)}
                        aria-label={`${tr(S.edit, locale)} — ${pick(p.name, locale)}`}
                    >
                        <PencilIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    // Bộ lọc kiểu KM + trạng thái đưa vào `FilterBar` — cùng pattern dashboard
    // (`shiftGroups`), không tự vẽ `<select>` cứng nữa. Ô tìm kiếm tự do
    // (theo tên/mã) KHÔNG có slot trong `FilterBar` (component chỉ có nhóm
    // pill rời rạc) nên giữ input riêng, style bằng token `--cms-*`.
    const filterGroups = [
        {
            legend: tr(S.promoType, locale),
            value: typeFilter,
            onChange: (v: string) => {
                setTypeFilter(v)
                setPage(1)
            },
            options: [
                { value: 'all', label: tr(S.allTypes, locale) },
                ...TYPES.map((tKey) => ({ value: tKey, label: tr(PROMO_TYPE_LABEL[tKey], locale) })),
            ],
        },
        {
            legend: tr(S.promoStatus, locale),
            value: statusFilter,
            onChange: (v: string) => {
                setStatusFilter(v)
                setPage(1)
            },
            options: [
                { value: 'all', label: tr(S.allStatuses, locale) },
                { value: 'active', label: tr(S.statusActive, locale) },
                { value: 'inactive', label: tr(S.statusDisabled, locale) },
            ],
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: tiêu đề + đếm bên trái · tab Danh sách/Công thức + nút
                Thêm khuyến mãi bên phải — cùng pattern `PageHeaderBar` của
                dashboard. `filters` KHÔNG dùng ở đây vì bộ lọc kiểu/trạng thái
                cần cả hàng riêng cùng ô tìm kiếm (xem hàng 2 bên dưới). */}
            <PageHeaderBar
                title={tr(S.promotions, locale)}
                count={{ value: activeCount, suffix: `/ ${promotions.length} ${tr(S.activePromoCount, locale)}` }}
                actions={
                    <>
                        <div
                            role="tablist"
                            aria-label={tr(S.promotions, locale)}
                            className="flex items-center gap-0.5 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] p-0.5"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'list'}
                                onClick={() => setActiveTab('list')}
                                className={`flex items-center gap-1.5 rounded-[var(--cms-radius-sm)] px-2.5 py-1 text-[length:var(--cms-text-body)] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                    activeTab === 'list'
                                        ? 'bg-[var(--cms-bg)] text-[var(--cms-text)]'
                                        : 'text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]'
                                }`}
                            >
                                <TicketIcon size={14} />
                                {tr(S.listView, locale)}
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'calc'}
                                onClick={() => setActiveTab('calc')}
                                className={`flex items-center gap-1.5 rounded-[var(--cms-radius-sm)] px-2.5 py-1 text-[length:var(--cms-text-body)] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                    activeTab === 'calc'
                                        ? 'bg-[var(--cms-bg)] text-[var(--cms-text)]'
                                        : 'text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]'
                                }`}
                            >
                                <GridIcon size={14} />
                                {tr(S.formulasAndCalc, locale)}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setEditing(blankPromotion())}
                            className="rounded-[var(--cms-radius)] bg-[var(--cms-accent)] px-3 py-1.5 text-[length:var(--cms-text-body)] font-semibold text-white transition-colors hover:bg-[var(--cms-accent)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            + {tr(S.newPromotion, locale)}
                        </button>
                    </>
                }
            />

            {/* HÀNG 2: ô tìm kiếm + bộ lọc kiểu/trạng thái + số kết quả + Đặt
                lại — đúng format §F6 (ô tìm kiếm, bộ lọc, nút Đặt lại). */}
            <div className="cms-row-filters flex flex-wrap items-center gap-3 border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3">
                <div className="relative">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--cms-text-muted)]">
                        <SearchIcon size={14} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        placeholder={tr(S.searchPromoPlaceholder, locale)}
                        className="w-48 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] py-1.5 pl-8 pr-2 text-[length:var(--cms-text-body)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] sm:w-64"
                    />
                </div>

                <FilterBar
                    groups={filterGroups}
                    resultText={`${filtered.length} ${tr(S.promotions, locale).toLowerCase()}`}
                    onReset={resetFilters}
                />
            </div>

            {/* Dải KPI liền mạch — cùng `MetricStrip`/`KpiCard` của dashboard,
                không còn 5 card rời tự vẽ shadow/viền màu riêng. */}
            <div className="border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2">
                <MetricStrip>
                    <KpiCard
                        label={tr(S.kpiTotalPromos, locale)}
                        value={`${promotions.length}`}
                        note={tr(S.kpiUnitPromo, locale)}
                        tone="slate"
                    />
                    <KpiCard
                        label={tr(S.kpiActivePromos, locale)}
                        value={`${activeCount}`}
                        note={tr(S.kpiUnitPromo, locale)}
                        tone="emerald"
                    />
                    <KpiCard
                        label={tr(S.kpiStackablePromos, locale)}
                        value={`${stackableCount}`}
                        note={tr(S.kpiUnitPromo, locale)}
                        tone="blue"
                    />
                    <KpiCard
                        label={tr(S.kpiTotalUsage, locale)}
                        value={`${totalUsage}`}
                        note={tr(S.kpiUnitTurns, locale)}
                        tone="violet"
                    />
                    <KpiCard
                        label={tr(S.kpiConflicts, locale)}
                        value={`${conflicts.length}`}
                        note={tr(S.kpiUnitWarnings, locale)}
                        tone={conflicts.length > 0 ? 'rose' : 'slate'}
                    />
                </MetricStrip>
            </div>

            {/* TAB 1: bảng danh sách — dùng `DataGrid` (bọc `DataTable` cho
                diện mạo CMS phẳng, không shadow/rounded-lg riêng). */}
            {activeTab === 'list' && (
                <div className="flex w-full flex-1 flex-col min-h-0 overflow-hidden">
                    <DataGrid<Promotion>
                        caption={tr(S.promotions, locale)}
                        columns={columns}
                        rows={pageRows}
                        rowKey={(p) => p.id}
                        empty={tr(S.noPromotions, locale)}
                    />

                    {filtered.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2.5 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] shrink-0">
                            <span>
                                {tr(S.showing, locale)}{' '}
                                <strong className="font-semibold text-[var(--cms-text)]">
                                    {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
                                </strong>{' '}
                                {tr(S.of, locale)}{' '}
                                <strong className="font-semibold text-[var(--cms-text)]">{filtered.length}</strong>{' '}
                                {tr(S.promotions, locale)}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={safePage === 1}
                                    onClick={() => setPage(safePage - 1)}
                                    className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-2.5 py-1 font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                                >
                                    ← {tr(S.paginationPrev, locale)}
                                </button>
                                <span className="px-2 font-semibold text-[var(--cms-text)]">
                                    {safePage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={safePage === totalPages}
                                    onClick={() => setPage(safePage + 1)}
                                    className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-2.5 py-1 font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                                >
                                    {tr(S.paginationNext, locale)} →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: Dedicated Calculation & Engine Mechanics View - Side-by-Side Single Screen */}
            {activeTab === 'calc' && (
                <div className="grid w-full flex-1 min-h-0 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-12">
                    {/* Cột trái (5/12): công thức, cảnh báo xung đột, thứ tự
                        áp dụng — không phải bảng dữ liệu nên KHÔNG dùng
                        `DataGrid`, giữ layout 2 cột đặc thù của màn này. */}
                    <div className="custom-scrollbar flex min-h-0 flex-col space-y-2.5 overflow-y-auto pr-1 lg:col-span-5">
                        <HowItWorks />

                        {conflicts.length > 0 && (
                            <ConflictWarnings conflicts={conflicts} promotions={promotions} />
                        )}

                        <ApplyOrder promotions={promotions.filter((p) => p.active)} />
                    </div>

                    {/* Cột phải (7/12): công cụ xem trước cách tính, chạy
                        đúng engine thật qua `buildQuote()`. */}
                    <div className="custom-scrollbar flex min-h-0 flex-col overflow-y-auto pr-1 lg:col-span-7">
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
            title={`${tr(S.formulaAndCalcDetails, locale)}: ${pick(promotion.name, locale)}`}
            onClose={onClose}
        >
            <div className="space-y-4 text-[length:var(--cms-text-body)] text-[var(--cms-text)]">
                <div className="flex items-center justify-between rounded-[var(--cms-radius)] border border-[var(--cms-tone-amber-dot)] bg-[var(--cms-tone-amber-bg)] p-3">
                    <div>
                        <div className="text-[length:var(--cms-text-title)] font-semibold text-[var(--cms-tone-amber)]">
                            {pick(promotion.name, locale)}
                        </div>
                        <div className="mt-0.5 font-mono font-semibold text-[var(--cms-tone-amber)]">
                            {tr(S.codeLabel, locale)}: {promotion.code || tr(S.automatic, locale)}
                        </div>
                    </div>
                    <DotBadge
                        tone={promotion.active ? 'emerald' : 'slate'}
                        label={promotion.active ? tr(S.active, locale) : tr(S.disabled, locale)}
                    />
                </div>

                {/* Công thức giảm giá */}
                <div className="space-y-2 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-3">
                    <h4 className="border-b border-[var(--cms-border)] pb-1 text-[length:var(--cms-text-label)] font-bold uppercase tracking-wider text-[var(--cms-text)]">
                        {tr(S.formulaBreakdownTitle, locale)} ({tr(PROMO_TYPE_LABEL[promotion.type], locale)})
                    </h4>
                    <p className="font-medium text-[var(--cms-text-muted)]">
                        {describeValue(promotion, locale)}
                    </p>
                    <div className="rounded-[var(--cms-radius-sm)] border border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] p-2 font-mono text-[length:var(--cms-text-meta)] text-[var(--cms-text)]">
                        {tr(PROMO_TYPE_HINT[promotion.type], locale)}
                    </div>
                </div>

                {/* Quy tắc thứ tự & cộng dồn */}
                <div className="space-y-2 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-3">
                    <h4 className="border-b border-[var(--cms-border)] pb-1 text-[length:var(--cms-text-label)] font-bold uppercase tracking-wider text-[var(--cms-text)]">
                        {tr(S.stackingRulesTitle, locale)}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-[var(--cms-radius-sm)] border border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] p-2">
                            <span className="block font-medium text-[var(--cms-text-muted)]">
                                {tr(S.priorityOrderLabel, locale)}:
                            </span>
                            <span className="font-bold text-[var(--cms-text)]">
                                {tr(S.priorityValueLabel, locale).replace('{value}', String(promotion.priority))}
                            </span>
                        </div>
                        <div className="rounded-[var(--cms-radius-sm)] border border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] p-2">
                            <span className="block font-medium text-[var(--cms-text-muted)]">
                                {tr(S.stackingModeLabel, locale)}:
                            </span>
                            <span
                                className={`font-bold ${
                                    promotion.stackable ? 'text-[var(--cms-tone-emerald)]' : 'text-[var(--cms-tone-amber)]'
                                }`}
                            >
                                {promotion.stackable ? tr(S.stackable, locale) : tr(S.exclusive, locale)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Điều kiện áp dụng */}
                <div className="space-y-2 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-3">
                    <h4 className="border-b border-[var(--cms-border)] pb-1 text-[length:var(--cms-text-label)] font-bold uppercase tracking-wider text-[var(--cms-text)]">
                        {tr(S.conditionsAppliedTitle, locale)}
                    </h4>
                    <ul className="list-disc space-y-1 pl-4 text-[var(--cms-text-muted)]">
                        <li>
                            {tr(S.stayWindowConditionLabel, locale)}:{' '}
                            {promotion.conditions.stayFrom || promotion.conditions.stayTo
                                ? `${promotion.conditions.stayFrom ?? '…'} ${tr(S.to, locale)} ${promotion.conditions.stayTo ?? '…'}`
                                : tr(S.allDates, locale)}
                        </li>
                        {promotion.conditions.minNights && (
                            <li>
                                {tr(S.minNightsRequiredLabel, locale)}:{' '}
                                <strong>
                                    {promotion.conditions.minNights} {tr(S.nightsUnit, locale)}
                                </strong>
                            </li>
                        )}
                        {promotion.conditions.minAmount && (
                            <li>
                                {tr(S.minAmountRequiredLabel, locale)}:{' '}
                                <strong>{formatPrice(promotion.conditions.minAmount, locale)}</strong>
                            </li>
                        )}
                        {promotion.usageLimit && (
                            <li>
                                {tr(S.usageLimitReachedLabel, locale)}:{' '}
                                <strong>
                                    {promotion.usageCount} / {promotion.usageLimit} {tr(S.turnsUnit, locale)}
                                </strong>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={onClose}>{tr(S.close, locale)}</Button>
                </div>
            </div>
        </Modal>
    )
}

// ================================================== khối giải thích thuật toán

function HowItWorks() {
    const { locale } = useLocale()
    const [open, setOpen] = useState(true)

    const steps = [
        pick({ vi: 'Lọc các khuyến mãi đang kích hoạt & thoả điều kiện.', en: 'Filter active promotions meeting conditions.' }, locale),
        pick({ vi: 'Sắp xếp theo thứ tự ưu tiên (Priority số nhỏ áp trước).', en: 'Sort by priority (lower number applies first).' }, locale),
        pick({ vi: 'Nếu có KM độc quyền: giữ DUY NHẤT 1 mã ưu tiên cao nhất.', en: 'Exclusive promo: keeps ONLY the top priority promo.' }, locale),
        pick({ vi: 'Tính giảm giá trên SỐ TIỀN CÒN LẠI sau các lần áp trước.', en: 'Calculate discount on the REMAINING amount.' }, locale),
        pick({ vi: 'Áp dụng trần giảm tối đa (Max Discount) nếu có.', en: 'Apply maximum discount cap if set.' }, locale),
    ]

    return (
        <section className="space-y-2 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-3">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex w-full items-center justify-between text-[length:var(--cms-text-body)] font-bold text-[var(--cms-text)] transition-colors hover:text-[var(--cms-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
            >
                <span>
                    {pick(
                        {
                            vi: 'Quy tắc thuật toán tính khuyến mãi',
                            en: 'Promotion Calculation Rules',
                        },
                        locale,
                    )}
                </span>
                <span className="font-mono text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                    {open ? '▾' : '▸'}
                </span>
            </button>

            {open && (
                <div className="space-y-2 pt-1 text-[length:var(--cms-text-body)] text-[var(--cms-text)]">
                    <ol className="list-decimal space-y-1 pl-4 font-medium text-[var(--cms-text-muted)]">
                        {steps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ol>

                    <div className="rounded-[var(--cms-radius-sm)] border border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] p-2.5 text-[length:var(--cms-text-meta)]">
                        <strong className="block font-semibold text-[var(--cms-text)]">
                            {pick(
                                {
                                    vi: 'Ví dụ tính phép nhân cộng dồn (1.000.000đ, 10% + 20%):',
                                    en: 'Multiplicative compound example (1,000,000₫, 10% + 20%):',
                                },
                                locale,
                            )}
                        </strong>
                        <div className="mt-1 space-y-0.5 font-mono">
                            <div className="text-[var(--cms-tone-rose)]">
                                ✗ Cộng dồn %: 1.000.000 × 30% = giảm 300.000đ
                            </div>
                            <div className="font-bold text-[var(--cms-tone-emerald)]">
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
        <InlineAlert tone="amber">
            <h2 className="mb-2 font-bold">
                {tr(S.conflictWarning, locale)} ({conflicts.length})
            </h2>
            <ul className="m-0 grid list-disc gap-2 pl-5">
                {conflicts.map((conflict, i) => (
                    <li key={i} className="leading-relaxed">
                        <strong>
                            {nameOf(conflict.a)} ↔ {nameOf(conflict.b)}
                        </strong>
                        <div>
                            {conflict.kind === 'both-exclusive'
                                ? tr(S.conflictBothExclusive, locale)
                                : tr(S.conflictSamePriority, locale)}
                            {conflict.winnerId && (
                                <>
                                    {' '}
                                    <strong>
                                        {tr(S.winnerIs, locale)}: {nameOf(conflict.winnerId)}
                                    </strong>{' '}
                                    (
                                    {pick(
                                        {
                                            vi: 'thứ tự áp dụng nhỏ hơn',
                                            en: 'lower priority number',
                                        },
                                        locale,
                                    )}
                                    )
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </InlineAlert>
    )
}

// ================================================== bảng thứ tự áp dụng

function ApplyOrder({ promotions }: { promotions: Promotion[] }) {
    const { locale } = useLocale()
    const ordered = [...promotions].sort((a, b) => a.priority - b.priority)

    if (ordered.length === 0) return null

    return (
        <section className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-3">
            <h2 className="mb-3 text-[length:var(--cms-text-body)] font-bold text-[var(--cms-text)]">
                {tr(S.applyOrder, locale)}
            </h2>
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                {ordered.map((promo, index) => (
                    <li key={promo.id} className="flex items-center gap-2">
                        {index > 0 && <span className="text-[var(--cms-text-muted)]">→</span>}
                        <span
                            className={`whitespace-nowrap rounded-[var(--cms-radius)] border px-3 py-2 text-[length:var(--cms-text-meta)] ${
                                promo.stackable
                                    ? 'border-[var(--cms-border)] bg-[var(--cms-bg-subtle)]'
                                    : 'border-[var(--cms-tone-amber-dot)] bg-[var(--cms-tone-amber-bg)]'
                            }`}
                        >
                            <strong>{promo.priority}</strong> · {pick(promo.name, locale)}
                            {!promo.stackable && (
                                <span className="text-[var(--cms-tone-amber)]">
                                    {' '}
                                    ({pick({ vi: 'độc quyền', en: 'exclusive' }, locale)})
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
        <section className="custom-scrollbar flex flex-1 flex-col space-y-3 overflow-y-auto rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-3.5">
            <div>
                <h2 className="flex items-center gap-1.5 text-[length:var(--cms-text-label)] font-bold uppercase tracking-wider text-[var(--cms-text)]">
                    <GridIcon size={14} />
                    <span>{tr(S.previewTitle, locale)}</span>
                </h2>
                <p className="mt-0.5 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                    {tr(S.previewHint, locale)}
                </p>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-12 min-h-0">
                {/* Inputs Form */}
                <div className="shrink-0 space-y-2.5 self-start rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] p-2.5 md:col-span-5">
                    <SelectField
                        label={tr(S.roomType, locale)}
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
                            label={tr(S.nights, locale)}
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
                        hint={pick({ vi: 'Thử NAMDU10 hoặc WELCOME', en: 'Try NAMDU10 or WELCOME' }, locale)}
                    />
                </div>

                {/* Calculation Engine Result Output */}
                <div className="custom-scrollbar flex flex-col justify-between overflow-y-auto rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] p-3 md:col-span-7">
                    {quote ? (
                        <div className="space-y-3">
                            <PriceBreakdown quote={quote} locale={locale} explainPromotions />

                            {rejected.length > 0 && (
                                <div className="border-t border-[var(--cms-border)] pt-2.5">
                                    <div className="mb-1.5 text-[length:var(--cms-text-label)] font-bold uppercase tracking-wider text-[var(--cms-text-muted)]">
                                        {tr(S.promosNotAppliedLabel, locale)}
                                    </div>
                                    <ul className="space-y-1">
                                        {rejected.map((item) => (
                                            <li
                                                key={item.promotion.id}
                                                className="flex items-center justify-between rounded-[var(--cms-radius-sm)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-2 py-1 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]"
                                            >
                                                <span className="font-medium text-[var(--cms-text)]">
                                                    {pick(item.promotion.name, locale)}
                                                </span>
                                                <span className="font-semibold text-[var(--cms-tone-rose)]">
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
                        <p className="italic text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                            {tr(S.selectRoomPreview, locale)}
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
                <FormGroup title={tr(S.contentGroup, locale)}>
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
                            pick(
                                {
                                    vi: 'Bắt buộc — mọi chuỗi khách nhìn thấy phải có cả hai ngôn ngữ.',
                                    en: 'Required — every guest-facing string needs both languages.',
                                },
                                locale,
                            )
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
                <FormGroup title={tr(S.discountMechanicsGroup, locale)}>
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
                        placeholder={tr(S.blankEqualsAutomatic, locale)}
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
                <FormGroup title={tr(S.stackingRulesGroup, locale)}>
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
                            label={`${tr(S.stayWindow, locale)} — ${tr(S.to, locale)}`}
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
                                    ? pick(
                                          {
                                              vi: 'Khách phải đặt SỚM HƠN số ngày này.',
                                              en: 'Guest must book EARLIER than this many days.',
                                          },
                                          locale,
                                      )
                                    : pick(
                                          {
                                              vi: 'Khách phải đặt TRONG VÒNG số ngày này.',
                                              en: 'Guest must book WITHIN this many days.',
                                          },
                                          locale,
                                      )
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
                <FormGroup title={tr(S.limitsGroup, locale)}>
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
                        label={tr(S.activatePromo, locale)}
                        checked={draft.active}
                        onChange={(e) => patch({ active: e.target.checked })}
                        hint={
                            pick(
                                {
                                    vi: 'Chỉ khuyến mãi đang bật mới được áp vào giá khách thấy.',
                                    en: 'Only active promotions affect the price guests see.',
                                },
                                locale,
                            )
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
            return tr(S.nightNLabel, locale).replace('{value}', String(promo.value))
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
            return tr(S.ruleValuePercentage, locale)
        case 'fixed':
        case 'free-addon':
            return tr(S.ruleValueVND, locale)
        case 'nth-night-free':
            return tr(S.ruleValueN, locale)
        default:
            return ''
    }
}
