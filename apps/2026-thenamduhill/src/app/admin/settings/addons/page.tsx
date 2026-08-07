'use client'

/**
 * Phụ thu & dịch vụ thêm (ticket `100-04` §2 hạng mục 3).
 *
 * CRUD trên `Addon` qua `catalog.store` — cùng lớp đè với hạng phòng và gói giá.
 *
 * Xoá là xoá MỀM (§6.12): `Booking.addons` của đơn cũ tham chiếu tới id này,
 * xoá cứng thì đơn cũ mất tên dịch vụ.
 *
 * Áp design system `@repo/cms-ui` (màn 3/7 nhóm Hệ thống) — cùng bố cục
 * `PageHeaderBar` + `FilterBar` + `DataGrid` như `/admin/customers` đã áp.
 * Đây là màn DANH SÁCH + CRUD (không phải form một cột như `settings/general`)
 * nên đi theo đúng khuôn customers.tsx: hàng 1 tiêu đề+đếm+nút thêm, hàng 2
 * tìm kiếm+bộ lọc+Đặt lại, bảng chiếm hết chỗ còn lại. Không có KPI vì màn
 * cấu hình danh mục không có số liệu vận hành đáng theo dõi (không bịa số).
 */

import { useMemo, useState } from 'react'
import { errorOf, formatPrice, pick, validateAddon } from '@repo/core'
import type { Addon, FieldError, I18nText } from '@repo/core'
import type { Column } from '@repo/ui'
import { DataGrid, DotBadge, FilterBar, InlineAlert, PageHeaderBar } from '@repo/cms-ui'
import { Button, Field, Modal } from '@repo/ui'
import { CoinsIcon, PencilIcon, PlusIcon, TrashIcon } from '@/components/icons'
import { I18nField } from '@/components/I18nField'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useCatalogStore } from '@/stores/catalog.store'
import { useAddons } from '@/stores/useCatalog'
import { S, tr } from '@/strings'

const PRICE_BANDS = [
    { value: 'all', vi: 'Mọi mức giá', en: 'All price bands' },
    { value: 'free', vi: 'Miễn phí', en: 'Free' },
    { value: 'paid', vi: 'Có thu phí', en: 'Chargeable' },
] as const

export default function AddonSettingsPage() {
    return (
        // Phụ thu & dịch vụ: chỉ `owner` / `manager` (ma trận `100-04` §4.3).
        <RequirePermission anyOf={['price.edit']}>
            <AddonSettingsScreen />
        </RequirePermission>
    )
}

interface AddonDraft {
    id: string
    name: I18nText
    unit: I18nText
    price: number
}

function AddonSettingsScreen() {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    const addons = useAddons()
    const removedIds = useCatalogStore((s) => s.removedIds)
    const createAddon = useCatalogStore((s) => s.createAddon)
    const updateAddon = useCatalogStore((s) => s.updateAddon)
    const removeCatalog = useCatalogStore((s) => s.remove)
    const bookings = useBookingStore((s) => s.bookings)

    const [search, setSearch] = useState('')
    const [priceBand, setPriceBand] = useState('all')
    const [editing, setEditing] = useState<Addon | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [draft, setDraft] = useState<AddonDraft | null>(null)
    const [errors, setErrors] = useState<FieldError[]>([])
    const [notice, setNotice] = useState<I18nText | null>(null)
    const [saving, setSaving] = useState(false)

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        return addons.filter((addon) => {
            if (query) {
                const hit =
                    addon.id.toLowerCase().includes(query) ||
                    addon.name.vi.toLowerCase().includes(query) ||
                    addon.name.en.toLowerCase().includes(query)
                if (!hit) return false
            }
            if (priceBand === 'free' && addon.price > 0) return false
            if (priceBand === 'paid' && addon.price === 0) return false
            return true
        })
    }, [addons, search, priceBand])

    function openModal(addon?: Addon) {
        setErrors([])
        setNotice(null)
        if (addon) {
            setEditing(addon)
            setDraft({
                id: addon.id,
                name: { ...addon.name },
                unit: { ...addon.unit },
                price: addon.price,
            })
        } else {
            setEditing(null)
            setDraft({
                id: '',
                name: { vi: '', en: '' },
                unit: { vi: 'khách / đêm', en: 'guest / night' },
                price: 0,
            })
        }
        setModalOpen(true)
    }

    function handleSave() {
        if (!draft || !user) return

        const found = validateAddon({
            name: draft.name,
            unit: draft.unit,
            price: draft.price,
            ...(editing ? {} : { id: draft.id, existingIds: addons.map((a) => a.id) }),
        })

        const first = found[0]
        if (first) {
            setErrors(found)
            setNotice(S.fixErrorsFirst)
            document.getElementById(`addon-field-${first.field}`)?.focus()
            return
        }

        setErrors([])
        setNotice(null)
        setSaving(true)

        const actor = { id: user.id, name: user.fullName || user.id, role: user.role }
        const result = editing
            ? updateAddon(editing.id, { name: draft.name, unit: draft.unit, price: draft.price }, actor)
            : createAddon(
                  { id: draft.id, name: draft.name, unit: draft.unit, price: draft.price },
                  actor,
              )

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

    function handleDelete(addon: Addon) {
        if (!user) return
        // Đơn cũ có dịch vụ này thì xoá MỀM — vẫn hiện trong bảng, đánh dấu
        // ngưng bán, để `Booking.addons` không trỏ vào khoảng không (§6.12).
        const inUse = bookings.filter((b) => Object.keys(b.addons ?? {}).includes(addon.id)).length

        if (
            !window.confirm(
                inUse > 0
                    ? pick(
                          {
                              vi: `Ngưng bán "${addon.name.vi}"? Còn ${inUse} đơn đang dùng nên dịch vụ vẫn giữ trong danh sách.`,
                              en: `Stop selling "${addon.name.en}"? ${inUse} booking(s) still use it, so it stays in the list.`,
                          },
                          locale,
                      )
                    : `${tr(S.delete, locale)} — ${tr(addon.name, locale)}`,
            )
        ) {
            return
        }

        const actor = { id: user.id, name: user.fullName || user.id, role: user.role }
        const result = removeCatalog('addon', addon.id, actor)
        if (result) setNotice(S.saveFailed)
    }

    const resetFilters = () => {
        setSearch('')
        setPriceBand('all')
    }

    const columns: Column<Addon>[] = [
        {
            key: 'id',
            header: tr(S.colRoomCode, locale),
            width: '150px',
            cell: (addon) => (
                <span className="font-mono text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)]">
                    {addon.id}
                </span>
            ),
        },
        {
            key: 'name',
            header: tr(S.colRoomName, locale),
            cell: (addon) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={tr(addon.name, locale)}
                    >
                        {tr(addon.name, locale)}
                    </div>
                    <div
                        className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]"
                        title={pick({ vi: addon.name.en, en: addon.name.vi }, locale)}
                    >
                        {pick({ vi: addon.name.en, en: addon.name.vi }, locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'unit',
            header: tr(S.colAddonUnit, locale),
            width: '160px',
            cell: (addon) => (
                <span className="text-[length:var(--cms-text-body)] text-[var(--cms-text)]">
                    {tr(addon.unit, locale)}
                </span>
            ),
        },
        {
            key: 'price',
            header: tr(S.colBasePrice, locale),
            align: 'right',
            width: '150px',
            cell: (addon) => (
                <span className="font-semibold text-[length:var(--cms-text-body)] text-[var(--cms-text)] tabular-nums">
                    {formatPrice(addon.price, locale)}
                </span>
            ),
        },
        {
            key: 'status',
            header: tr(S.colStatus, locale),
            width: '140px',
            cell: (addon) =>
                removedIds.includes(addon.id) ? (
                    <DotBadge tone="slate" label={tr(S.stoppedSelling, locale)} width={108} />
                ) : (
                    <DotBadge tone="emerald" label={tr(S.onSale, locale)} width={108} />
                ),
        },
        {
            key: 'actions',
            header: tr(S.colActions, locale),
            align: 'right',
            width: '90px',
            cell: (addon) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => openModal(addon)}
                        aria-label={`${tr(S.edit, locale)} ${tr(addon.name, locale)}`}
                        style={{ minWidth: 28, minHeight: 28 }}
                        className="inline-flex items-center justify-center rounded-[var(--cms-radius-sm)] text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <PencilIcon size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(addon)}
                        aria-label={`${tr(S.delete, locale)} ${tr(addon.name, locale)}`}
                        style={{ minWidth: 28, minHeight: 28 }}
                        className="inline-flex items-center justify-center rounded-[var(--cms-radius-sm)] text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <TrashIcon size={14} />
                    </button>
                </div>
            ),
        },
    ]

    const priceBandGroups = [
        {
            legend: tr(S.colBasePrice, locale),
            value: priceBand,
            onChange: setPriceBand,
            options: PRICE_BANDS.map((b) => ({ value: b.value, label: b[locale] })),
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: tiêu đề + đếm bên trái, nút thêm dịch vụ bên phải. */}
            <PageHeaderBar
                title={tr(S.addonsTitle, locale)}
                count={{ value: filtered.length, suffix: tr(S.addonsCount, locale) }}
                actions={
                    <Button onClick={() => openModal()}>
                        <PlusIcon size={16} />
                        <span>{tr(S.addAddon, locale)}</span>
                    </Button>
                }
            />

            {/* HÀNG 2: ô tìm kiếm tự do + FilterBar (mức giá) — cùng khuôn
                customers.tsx: input thô token hoá vì `FilterBar` không nhận
                chữ tự do, đặt cạnh pill lọc trong cùng khối. */}
            <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={tr(S.searchAddon, locale)}
                    aria-label={tr(S.searchAddon, locale)}
                    className="w-44 sm:w-64 px-3 py-1 text-[length:var(--cms-text-body)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    style={{ minHeight: 28 }}
                />

                <FilterBar
                    groups={priceBandGroups}
                    resultText={`${filtered.length} ${tr(S.addonsCount, locale)}`}
                    onReset={resetFilters}
                />
            </div>

            {notice && (
                <div className="px-[var(--cms-pad)] pt-3">
                    <InlineAlert tone="rose">{tr(notice, locale)}</InlineAlert>
                </div>
            )}

            {/* Vùng nội dung: DataGrid chiếm hết chỗ còn lại — tối ưu chiều
                cao là ưu tiên số 1. */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-[var(--cms-border)]">
                <DataGrid<Addon>
                    caption={tr(S.addonsTitle, locale)}
                    columns={columns}
                    rows={filtered}
                    rowKey={(addon) => addon.id}
                    empty={
                        <div className="h-full flex items-center justify-center text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                            {tr(S.emptyAddons, locale)}
                        </div>
                    }
                />
            </div>

            {modalOpen && draft && (
                <Modal
                    open
                    onClose={() => setModalOpen(false)}
                    title={tr(editing ? S.editAddon : S.addAddon, locale)}
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
                                fieldId="addon-field-id"
                                label={tr(S.idFieldLabel, locale)}
                                hint={tr(S.idFieldHint, locale)}
                                value={draft.id}
                                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                                placeholder="ferry-transfer"
                                required
                                error={maybe(errorOf(errors, 'id'), locale)}
                            />
                        )}

                        <I18nField
                            fieldId="addon-field-name"
                            label={tr(S.colRoomName, locale)}
                            value={draft.name}
                            onChange={(name) => setDraft({ ...draft, name })}
                            required
                            placeholderVi="Đưa đón tàu Rạch Giá"
                            placeholderEn="Rach Gia ferry transfer"
                            error={maybe(errorOf(errors, 'name'), locale)}
                        />

                        <I18nField
                            fieldId="addon-field-unit"
                            label={tr(S.addonUnitLabel, locale)}
                            value={draft.unit}
                            onChange={(unit) => setDraft({ ...draft, unit })}
                            required
                            hint={tr(S.addonUnitHint, locale)}
                            placeholderVi="khách / lượt"
                            placeholderEn="guest / trip"
                            error={maybe(errorOf(errors, 'unit'), locale)}
                        />

                        <Field
                            fieldId="addon-field-price"
                            label={tr(S.colBasePrice, locale)}
                            type="number"
                            min={0}
                            step={10000}
                            value={draft.price}
                            onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                            required
                            error={maybe(errorOf(errors, 'price'), locale)}
                        />

                        <div className="flex items-center gap-2 p-2 bg-[var(--cms-bg-subtle)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                            <CoinsIcon size={14} />
                            <span>
                                {pick(
                                    {
                                        vi: 'Giá này cộng vào tạm tính của đơn, trước khi áp khuyến mãi.',
                                        en: 'This price is added to the booking subtotal, before promotions apply.',
                                    },
                                    locale,
                                )}
                            </span>
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
