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
 *
 * Áp design system `@repo/cms-ui` (màn 5/7 nhóm Hệ thống) — đi theo đúng khuôn
 * `settings/addons/page.tsx` đã áp: cùng là màn CRUD danh mục giá (id/tên
 * i18n/số tiền/modal), gần với rate-plans nhất trong nhóm đã xong. Bố cục:
 * hàng 1 tiêu đề+đếm+nút thêm (`PageHeaderBar`), hàng 2 tìm kiếm+`FilterBar`
 * (trạng thái)+Đặt lại, bảng (`DataGrid`) chiếm hết chỗ còn lại. Không có
 * KPI vì màn cấu hình danh mục không có số liệu vận hành đáng theo dõi.
 */

import { CheckCircleIcon, PencilIcon, PlusIcon, TrashIcon } from '@/components/icons'
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
import { DataGrid, DotBadge, FilterBar, InlineAlert, PageHeaderBar } from '@repo/cms-ui'
import { Button, CheckField, Field, Modal } from '@repo/ui'
import type { Column } from '@repo/ui'
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

    const resetFilters = () => {
        setSearch('')
        setStatusFilter('all')
    }

    const columns: Column<RatePlan>[] = [
        {
            key: 'id',
            header: tr(S.colRoomCode, locale),
            width: '150px',
            cell: (plan) => (
                <span className="font-mono text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)]">
                    {plan.id}
                </span>
            ),
        },
        {
            key: 'name',
            header: tr(S.colRoomName, locale),
            cell: (plan) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={tr(plan.name, locale)}
                    >
                        {tr(plan.name, locale)}
                    </div>
                    <div
                        className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]"
                        title={tr(plan.description, locale)}
                    >
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
            cell: (plan) => (
                // Giảm giá (âm) là tin tốt cho khách — dùng tone emerald để
                // lễ tân nhận ra ngay không cần đọc dấu, cùng nguyên tắc D4
                // (chấm+chữ ở badge) áp cho số liệu: màu chỉ là gợi ý, con số
                // có dấu +/− đã tự nói rõ nghĩa.
                <span
                    className={`font-semibold text-[length:var(--cms-text-body)] tabular-nums ${
                        plan.adjustPercent < 0 ? 'text-[var(--cms-tone-emerald)]' : 'text-[var(--cms-text)]'
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
                <span className="text-[length:var(--cms-text-body)] text-[var(--cms-text)] tabular-nums">
                    {plan.depositPercent}%
                </span>
            ),
        },
        {
            key: 'perks',
            header: tr(S.perksLabel, locale),
            width: '210px',
            cell: (plan) => (
                <div className="flex flex-wrap gap-1">
                    {plan.includesBreakfast && (
                        <DotBadge tone="blue" label={tr(S.includesBreakfast, locale)} />
                    )}
                    <DotBadge
                        tone={plan.refundable ? 'emerald' : 'amber'}
                        label={tr(plan.refundable ? S.refundable : S.nonRefundable, locale)}
                    />
                </div>
            ),
        },
        {
            key: 'status',
            header: tr(S.colStatus, locale),
            width: '140px',
            cell: (plan) =>
                plan.active ? (
                    <DotBadge tone="emerald" label={tr(S.onSale, locale)} width={108} />
                ) : (
                    <DotBadge tone="slate" label={tr(S.stoppedSelling, locale)} width={108} />
                ),
        },
        {
            key: 'actions',
            header: tr(S.colActions, locale),
            align: 'right',
            width: '90px',
            cell: (plan) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => openModal(plan)}
                        aria-label={`${tr(S.edit, locale)} ${tr(plan.name, locale)}`}
                        style={{ minWidth: 28, minHeight: 28 }}
                        className="inline-flex items-center justify-center rounded-[var(--cms-radius-sm)] text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <PencilIcon size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(plan)}
                        aria-label={`${tr(S.delete, locale)} ${tr(plan.name, locale)}`}
                        style={{ minWidth: 28, minHeight: 28 }}
                        className="inline-flex items-center justify-center rounded-[var(--cms-radius-sm)] text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <TrashIcon size={14} />
                    </button>
                </div>
            ),
        },
    ]

    const statusGroups = [
        {
            legend: tr(S.colStatus, locale),
            value: statusFilter,
            onChange: setStatusFilter,
            options: STATUS_FILTERS.map((f) => ({ value: f.value, label: f[locale] })),
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: tiêu đề + đếm bên trái, nút thêm gói giá bên phải. */}
            <PageHeaderBar
                title={tr(S.ratePlansTitle, locale)}
                count={{ value: filtered.length, suffix: tr(S.ratePlansCount, locale) }}
                actions={
                    <Button onClick={() => openModal()}>
                        <PlusIcon size={16} />
                        <span>{tr(S.addRatePlan, locale)}</span>
                    </Button>
                }
            />

            {/* HÀNG 2: ô tìm kiếm tự do + FilterBar (trạng thái) — cùng khuôn
                addons.tsx: input thô token hoá vì `FilterBar` không nhận chữ
                tự do, đặt cạnh pill lọc trong cùng khối, Đặt lại ở cuối. */}
            <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={tr(S.searchRatePlan, locale)}
                    aria-label={tr(S.searchRatePlan, locale)}
                    className="w-44 sm:w-64 px-3 py-1 text-[length:var(--cms-text-body)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    style={{ minHeight: 28 }}
                />

                <FilterBar
                    groups={statusGroups}
                    resultText={`${filtered.length} ${tr(S.ratePlansCount, locale)}`}
                    onReset={resetFilters}
                />
            </div>

            {notice && (
                <div className="px-[var(--cms-pad)] pt-3">
                    <InlineAlert tone="rose">{tr(notice, locale)}</InlineAlert>
                </div>
            )}

            {/* Vùng nội dung: DataGrid chiếm hết chỗ còn lại — tối ưu chiều
                cao là ưu tiên số 1 cho màn lễ tân/quản lý dùng hằng ngày. */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-[var(--cms-border)]">
                <DataGrid<RatePlan>
                    caption={tr(S.ratePlansTitle, locale)}
                    columns={columns}
                    rows={filtered}
                    rowKey={(plan) => plan.id}
                    empty={
                        <div className="h-full flex items-center justify-center text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                            {tr(S.emptyRatePlans, locale)}
                        </div>
                    }
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
                    <div className="space-y-3 text-[length:var(--cms-text-body)]">
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
                            <fieldset className="border border-[var(--cms-border)] rounded-[var(--cms-radius)] p-2.5 space-y-2">
                                <legend className="px-1 text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)] uppercase tracking-wider">
                                    {tr(S.refundTiers, locale)}
                                </legend>
                                <p className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] m-0 leading-relaxed">
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
                                        className="text-[length:var(--cms-text-meta)] text-[var(--cms-tone-rose)] font-medium m-0"
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

                        <div className="flex items-center gap-2 p-2 bg-[var(--cms-bg-subtle)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
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
