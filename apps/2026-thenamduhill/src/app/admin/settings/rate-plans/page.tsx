'use client'

/**
 * Gói giá (RatePlan) — ticket `100-04` màn 2.
 *
 * Dùng đúng type `RatePlan` của `@repo/core` (nguồn sự thật, luật BE8) thay
 * cho hàng dữ liệu tự chế trước đây — nhờ vậy `buildQuote()` đọc được ngay
 * gói giá admin vừa sửa mà không phải chuyển đổi hình dạng.
 *
 * Kiểm dữ liệu vào bằng `validateRatePlan()` của `core`: `adjustPercent` phải
 * trong −100…+200 (AC-11) và bậc hoàn tiền phải giảm dần nghiêm ngặt (AC-12).
 */

import { CheckCircleIcon, PencilIcon, PlusIcon, TagIcon, TrashIcon } from '@/components/icons'
import { I18nField } from '@/components/I18nField'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useCatalogStore } from '@/stores/catalog.store'
import { useRatePlans } from '@/stores/useCatalog'
import { S, tr } from '@/strings'
import { errorOf, validateRatePlan } from '@repo/core'
import type { CancellationRule, FieldError, I18nText, RatePlan } from '@repo/core'
import {
    Badge,
    Button,
    CheckField,
    DataTable,
    Field,
    FilterSelect,
    Modal,
    Toolbar,
    useDataTable,
} from '@repo/ui'
import { useMemo, useState } from 'react'

const STATUS_FILTERS = [
    { value: 'all', vi: 'Mọi trạng thái', en: 'All statuses' },
    { value: 'active', vi: 'Đang áp dụng', en: 'Active' },
    { value: 'inactive', vi: 'Tạm ngưng', en: 'Paused' },
] as const

export default function RatePlansSettingsPage() {
    return (
        // Gói giá: chỉ `owner` / `manager` (ma trận `100-04` §4.3).
        <RequirePermission anyOf={['price.edit']}>
            <RatePlansScreen />
        </RequirePermission>
    )
}

interface RatePlanDraft {
    id: string
    name: I18nText
    description: I18nText
    adjustPercent: number
    depositPercent: number
    includesBreakfast: boolean
    refundable: boolean
    cancellationRules: CancellationRule[]
    active: boolean
}

function RatePlansScreen() {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    const ratePlans = useRatePlans()
    const createRatePlan = useCatalogStore((s) => s.createRatePlan)
    const updateRatePlan = useCatalogStore((s) => s.updateRatePlan)
    const removeCatalog = useCatalogStore((s) => s.remove)
    const bookings = useBookingStore((s) => s.bookings)

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [editing, setEditing] = useState<RatePlan | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [draft, setDraft] = useState<RatePlanDraft | null>(null)
    const [errors, setErrors] = useState<FieldError[]>([])
    const [notice, setNotice] = useState<I18nText | null>(null)
    const [saving, setSaving] = useState(false)

    const isFiltered = search !== '' || statusFilter !== 'all'

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        return ratePlans.filter((plan) => {
            if (query) {
                const hit =
                    plan.id.toLowerCase().includes(query) ||
                    plan.name.vi.toLowerCase().includes(query) ||
                    plan.name.en.toLowerCase().includes(query)
                if (!hit) return false
            }
            if (statusFilter === 'active' && !plan.active) return false
            if (statusFilter === 'inactive' && plan.active) return false
            return true
        })
    }, [ratePlans, search, statusFilter])

    const { tableProps } = useDataTable<RatePlan>({
        data: filtered,
        rowKey: (plan) => plan.id,
        pageSize: 10,
        columns: [
            {
                key: 'id',
                header: tr(S.colRoomCode, locale),
                width: '150px',
                sortable: true,
                cell: (plan) => (
                    <span className="font-mono text-xs font-bold text-slate-800">{plan.id}</span>
                ),
            },
            {
                key: 'name',
                header: tr(S.colRoomName, locale),
                cell: (plan) => (
                    <div>
                        <div className="font-bold text-xs text-slate-900">{tr(plan.name, locale)}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                            {tr(plan.description, locale)}
                        </div>
                    </div>
                ),
            },
            {
                key: 'adjustPercent',
                header: tr(S.adjustPercentLabel, locale),
                align: 'right',
                width: '130px',
                sortable: true,
                cell: (plan) => (
                    <span
                        className={`font-bold text-xs tabular-nums ${
                            plan.adjustPercent < 0 ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                    >
                        {plan.adjustPercent > 0 ? '+' : ''}
                        {plan.adjustPercent}%
                    </span>
                ),
            },
            {
                key: 'depositPercent',
                header: tr(S.depositPercentLabel, locale),
                align: 'right',
                width: '120px',
                cell: (plan) => (
                    <span className="text-xs tabular-nums text-slate-800">{plan.depositPercent}%</span>
                ),
            },
            {
                key: 'perks',
                header: tr(S.perksLabel, locale),
                width: '190px',
                cell: (plan) => (
                    <div className="flex flex-wrap gap-1">
                        {plan.includesBreakfast && (
                            <Badge tone="info">{tr(S.includesBreakfast, locale)}</Badge>
                        )}
                        <Badge tone={plan.refundable ? 'success' : 'warning'}>
                            {tr(plan.refundable ? S.refundable : S.nonRefundable, locale)}
                        </Badge>
                    </div>
                ),
            },
            {
                key: 'status',
                header: tr(S.colStatus, locale),
                width: '130px',
                cell: (plan) => (
                    <Badge tone={plan.active ? 'success' : 'neutral'}>
                        {tr(plan.active ? S.onSale : S.stoppedSelling, locale)}
                    </Badge>
                ),
            },
            {
                key: 'actions',
                header: tr(S.colActions, locale),
                align: 'right',
                width: '100px',
                cell: (plan) => (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal(plan)}
                            aria-label={`${tr(S.edit, locale)} ${tr(plan.name, locale)}`}
                        >
                            <PencilIcon size={14} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(plan)}
                            aria-label={`${tr(S.delete, locale)} ${tr(plan.name, locale)}`}
                        >
                            <TrashIcon size={14} />
                        </Button>
                    </div>
                ),
            },
        ],
    })

    function openModal(plan?: RatePlan) {
        setErrors([])
        setNotice(null)
        if (plan) {
            setEditing(plan)
            setDraft({
                id: plan.id,
                name: { ...plan.name },
                description: { ...plan.description },
                adjustPercent: plan.adjustPercent,
                depositPercent: plan.depositPercent,
                includesBreakfast: plan.includesBreakfast,
                refundable: plan.refundable,
                cancellationRules: plan.cancellationRules.map((r) => ({ ...r })),
                active: plan.active,
            })
        } else {
            setEditing(null)
            setDraft({
                id: '',
                name: { vi: '', en: '' },
                description: { vi: '', en: '' },
                adjustPercent: 0,
                depositPercent: 30,
                includesBreakfast: true,
                refundable: true,
                cancellationRules: [
                    { daysBeforeCheckIn: 7, refundPercent: 100 },
                    { daysBeforeCheckIn: 3, refundPercent: 50 },
                    { daysBeforeCheckIn: 0, refundPercent: 0 },
                ],
                active: true,
            })
        }
        setModalOpen(true)
    }

    function handleSave() {
        if (!draft || !user) return

        const found = validateRatePlan({
            name: draft.name,
            adjustPercent: draft.adjustPercent,
            depositPercent: draft.depositPercent,
            // Gói không hoàn huỷ thì bậc hoàn tiền để rỗng, không kiểm thứ tự.
            cancellationRules: draft.refundable ? draft.cancellationRules : [],
            ...(editing ? {} : { id: draft.id, existingIds: ratePlans.map((p) => p.id) }),
        })

        const first = found[0]
        if (first) {
            setErrors(found)
            setNotice(S.fixErrorsFirst)
            document.getElementById(`plan-field-${first.field}`)?.focus()
            return
        }

        setErrors([])
        setNotice(null)
        setSaving(true)

        const actor = { id: user.id, name: user.fullName || user.id, role: user.role }
        const payload = {
            name: draft.name,
            description: draft.description,
            adjustPercent: draft.adjustPercent,
            depositPercent: draft.depositPercent,
            includesBreakfast: draft.includesBreakfast,
            refundable: draft.refundable,
            cancellationRules: draft.refundable ? draft.cancellationRules : [],
            active: draft.active,
        }

        const result = editing
            ? updateRatePlan(editing.id, payload, actor)
            : createRatePlan({ id: draft.id, roomTypeIds: [], ...payload }, actor)

        setSaving(false)

        if (result === 'duplicate-id') {
            setErrors([{ field: 'id', message: S.duplicateId }])
            setNotice(S.duplicateId)
            return
        }
        if (result) {
            setNotice(S.saveFailed)
            return
        }

        setModalOpen(false)
        setDraft(null)
    }

    function handleDelete(plan: RatePlan) {
        if (!user) return
        // `quoteRefund()` đọc `cancellationRules` của gói trên đơn cũ — xoá là
        // không tính được tiền hoàn cho đơn đó nữa (§6.12).
        const inUse = bookings.filter(
            (b) => b.ratePlanId === plan.id && b.status !== 'cancelled' && b.status !== 'checked_out',
        ).length

        if (inUse > 0) {
            setNotice({
                vi: `Không xoá được: còn ${inUse} đơn đang dùng gói "${plan.name.vi}".`,
                en: `Cannot delete: ${inUse} booking(s) still use "${plan.name.en}".`,
            })
            return
        }

        if (!window.confirm(`${tr(S.delete, locale)} — ${tr(plan.name, locale)}`)) return
        const actor = { id: user.id, name: user.fullName || user.id, role: user.role }
        const result = removeCatalog('rate-plan', plan.id, actor)
        if (result) setNotice(S.saveFailed)
    }

    function updateRule(index: number, patch: Partial<CancellationRule>) {
        if (!draft) return
        setDraft({
            ...draft,
            cancellationRules: draft.cancellationRules.map((rule, i) =>
                i === index ? { ...rule, ...patch } : rule,
            ),
        })
    }

    return (
        <div className="h-full flex flex-col min-h-0 bg-slate-100 p-2 gap-2 overflow-hidden">
            {notice && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="shrink-0 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-medium"
                >
                    {tr(notice, locale)}
                </div>
            )}

            <div className="flex-1 min-h-0 bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">
                            <TagIcon size={16} />
                        </span>
                        <h1 className="text-base font-bold text-slate-900 tracking-tight">
                            {tr(S.ratePlansTitle, locale)}
                        </h1>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 tabular-nums">
                            {filtered.length} {tr(S.ratePlansCount, locale)}
                        </span>
                    </div>
                    <Button onClick={() => openModal()}>
                        <PlusIcon size={16} />
                        <span>{tr(S.addRatePlan, locale)}</span>
                    </Button>
                </div>

                <Toolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder={tr(S.searchRatePlan, locale)}
                    isFiltered={isFiltered}
                    onReset={() => {
                        setSearch('')
                        setStatusFilter('all')
                    }}
                    resetLabel={tr(S.reset, locale)}
                >
                    <FilterSelect
                        label={tr(S.colStatus, locale)}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={STATUS_FILTERS.map((f) => ({ value: f.value, label: f[locale] }))}
                    />
                </Toolbar>

                <DataTable<RatePlan>
                    {...tableProps}
                    caption={tr(S.ratePlansTitle, locale)}
                    pagination={{
                        ...tableProps.pagination,
                        prevLabel: tr(S.paginationPrev, locale),
                        nextLabel: tr(S.paginationNext, locale),
                        pageSizeLabel: tr(S.paginationPageSize, locale),
                        summaryText: (a, b, c) =>
                            `${tr(S.paginationSummary, locale)} ${a}–${b} / ${c} ${tr(S.ratePlansCount, locale)}`,
                    }}
                    empty={tr(S.emptyRatePlans, locale)}
                />
            </div>

            {modalOpen && draft && (
                <Modal
                    open
                    onClose={() => setModalOpen(false)}
                    title={tr(editing ? S.editRatePlan : S.addRatePlan, locale)}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setModalOpen(false)}>
                                {tr(S.cancel, locale)}
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {tr(saving ? S.saving : S.save, locale)}
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-3 text-xs">
                        {!editing && (
                            <Field
                                fieldId="plan-field-id"
                                label={tr(S.idFieldLabel, locale)}
                                hint={tr(S.idFieldHint, locale)}
                                value={draft.id}
                                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                                placeholder="early-bird"
                                required
                                error={maybe(errorOf(errors, 'id'), locale)}
                            />
                        )}

                        <I18nField
                            fieldId="plan-field-name"
                            label={tr(S.colRoomName, locale)}
                            value={draft.name}
                            onChange={(name) => setDraft({ ...draft, name })}
                            required
                            placeholderVi="Gói tiết kiệm"
                            placeholderEn="Saver rate"
                            error={maybe(errorOf(errors, 'name'), locale)}
                        />

                        <I18nField
                            label={tr(S.descriptionLabel, locale)}
                            value={draft.description}
                            onChange={(description) => setDraft({ ...draft, description })}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field
                                fieldId="plan-field-adjustPercent"
                                label={tr(S.adjustPercentLabel, locale)}
                                type="number"
                                min={-100}
                                max={200}
                                value={draft.adjustPercent}
                                onChange={(e) =>
                                    setDraft({ ...draft, adjustPercent: Number(e.target.value) })
                                }
                                hint={tr(S.adjustPercentHint, locale)}
                                required
                                error={maybe(errorOf(errors, 'adjustPercent'), locale)}
                            />
                            <Field
                                fieldId="plan-field-depositPercent"
                                label={tr(S.depositPercentLabel, locale)}
                                type="number"
                                min={0}
                                max={100}
                                value={draft.depositPercent}
                                onChange={(e) =>
                                    setDraft({ ...draft, depositPercent: Number(e.target.value) })
                                }
                                required
                                error={maybe(errorOf(errors, 'depositPercent'), locale)}
                            />
                        </div>

                        <CheckField
                            label={tr(S.includesBreakfast, locale)}
                            checked={draft.includesBreakfast}
                            onChange={(e) =>
                                setDraft({ ...draft, includesBreakfast: e.target.checked })
                            }
                        />

                        <CheckField
                            label={tr(S.refundable, locale)}
                            checked={draft.refundable}
                            onChange={(e) => setDraft({ ...draft, refundable: e.target.checked })}
                            hint={tr(S.refundableHint, locale)}
                        />

                        {draft.refundable && (
                            <fieldset className="border border-slate-200 rounded p-2.5 space-y-2">
                                <legend className="px-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                    {tr(S.refundTiers, locale)}
                                </legend>
                                <p className="text-[11px] text-slate-500 m-0 leading-relaxed">
                                    {tr(S.refundTiersHint, locale)}
                                </p>

                                {draft.cancellationRules.map((rule, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2">
                                        <Field
                                            fieldId={index === 0 ? 'plan-field-cancellationRules' : undefined}
                                            label={tr(S.daysBeforeCheckIn, locale)}
                                            type="number"
                                            min={0}
                                            value={rule.daysBeforeCheckIn}
                                            onChange={(e) =>
                                                updateRule(index, {
                                                    daysBeforeCheckIn: Number(e.target.value),
                                                })
                                            }
                                        />
                                        <Field
                                            label={tr(S.refundPercentLabel, locale)}
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={rule.refundPercent}
                                            onChange={(e) =>
                                                updateRule(index, {
                                                    refundPercent: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                ))}

                                {errorOf(errors, 'cancellationRules') && (
                                    <p
                                        role="alert"
                                        aria-live="polite"
                                        className="text-[11px] text-rose-600 font-medium m-0"
                                    >
                                        {maybe(errorOf(errors, 'cancellationRules'), locale)}
                                    </p>
                                )}
                            </fieldset>
                        )}

                        <CheckField
                            label={tr(S.onSale, locale)}
                            checked={draft.active}
                            onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                        />

                        <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
                            <CheckCircleIcon size={14} />
                            <span>{tr(S.ratePlanEngineNote, locale)}</span>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

function maybe(text: I18nText | undefined, locale: 'vi' | 'en'): string | undefined {
    return text ? tr(text, locale) : undefined
}
