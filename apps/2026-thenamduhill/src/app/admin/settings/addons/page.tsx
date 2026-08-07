'use client'

/**
 * Phụ thu & dịch vụ thêm (ticket `100-04` §2 hạng mục 3).
 *
 * CRUD trên `Addon` qua `catalog.store` — cùng lớp đè với hạng phòng và gói giá.
 *
 * Xoá là xoá MỀM (§6.12): `Booking.addons` của đơn cũ tham chiếu tới id này,
 * xoá cứng thì đơn cũ mất tên dịch vụ.
 */

import { CoinsIcon, PencilIcon, PlusIcon, TagIcon, TrashIcon } from '@/components/icons'
import { I18nField } from '@/components/I18nField'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useCatalogStore } from '@/stores/catalog.store'
import { useAddons } from '@/stores/useCatalog'
import { S, tr } from '@/strings'
import { errorOf, formatPrice, pick, validateAddon } from '@repo/core'
import type { Addon, FieldError, I18nText } from '@repo/core'
import {
    Badge,
    Button,
    DataTable,
    Field,
    FilterSelect,
    Modal,
    Toolbar,
    useDataTable,
} from '@repo/ui'
import { useMemo, useState } from 'react'

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

    const isFiltered = search !== '' || priceBand !== 'all'

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

    const { tableProps } = useDataTable<Addon>({
        data: filtered,
        rowKey: (addon) => addon.id,
        pageSize: 10,
        columns: [
            {
                key: 'id',
                header: tr(S.colRoomCode, locale),
                width: '150px',
                sortable: true,
                cell: (addon) => (
                    <span className="font-mono text-xs font-bold text-slate-700">{addon.id}</span>
                ),
            },
            {
                key: 'name',
                header: tr(S.colRoomName, locale),
                cell: (addon) => (
                    <div>
                        <div className="font-bold text-xs text-slate-900">{tr(addon.name, locale)}</div>
                        <div className="text-[10px] text-slate-400">
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
                    <span className="text-xs text-slate-700">{tr(addon.unit, locale)}</span>
                ),
            },
            {
                key: 'price',
                header: tr(S.colBasePrice, locale),
                align: 'right',
                width: '150px',
                sortable: true,
                cell: (addon) => (
                    <span className="font-extrabold text-xs text-slate-900 tabular-nums">
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
                        <Badge tone="neutral">{tr(S.stoppedSelling, locale)}</Badge>
                    ) : (
                        <Badge tone="success">{tr(S.onSale, locale)}</Badge>
                    ),
            },
            {
                key: 'actions',
                header: tr(S.colActions, locale),
                align: 'right',
                width: '100px',
                cell: (addon) => (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal(addon)}
                            aria-label={`${tr(S.edit, locale)} ${tr(addon.name, locale)}`}
                        >
                            <PencilIcon size={14} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(addon)}
                            aria-label={`${tr(S.delete, locale)} ${tr(addon.name, locale)}`}
                        >
                            <TrashIcon size={14} />
                        </Button>
                    </div>
                ),
            },
        ],
    })

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
                            {tr(S.addonsTitle, locale)}
                        </h1>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 tabular-nums">
                            {filtered.length} {tr(S.addonsCount, locale)}
                        </span>
                    </div>
                    <Button onClick={() => openModal()}>
                        <PlusIcon size={16} />
                        <span>{tr(S.addAddon, locale)}</span>
                    </Button>
                </div>

                <Toolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder={tr(S.searchAddon, locale)}
                    isFiltered={isFiltered}
                    onReset={() => {
                        setSearch('')
                        setPriceBand('all')
                    }}
                    resetLabel={tr(S.reset, locale)}
                >
                    <FilterSelect
                        label={tr(S.colBasePrice, locale)}
                        value={priceBand}
                        onChange={setPriceBand}
                        options={PRICE_BANDS.map((b) => ({ value: b.value, label: b[locale] }))}
                    />
                </Toolbar>

                <DataTable<Addon>
                    {...tableProps}
                    caption={tr(S.addonsTitle, locale)}
                    pagination={{
                        ...tableProps.pagination,
                        prevLabel: tr(S.paginationPrev, locale),
                        nextLabel: tr(S.paginationNext, locale),
                        pageSizeLabel: tr(S.paginationPageSize, locale),
                        summaryText: (a, b, c) =>
                            `${tr(S.paginationSummary, locale)} ${a}–${b} / ${c} ${tr(S.addonsCount, locale)}`,
                    }}
                    empty={tr(S.emptyAddons, locale)}
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
                    <div className="space-y-3 text-xs">
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

                        <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
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
