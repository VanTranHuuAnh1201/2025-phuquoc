'use client'

/**
 * Cấu hình thanh toán — tài khoản nhận cọc (ticket `100-04` màn 4).
 *
 * CHỈ `owner` vào được (AC-10): `manager` cũng bị chặn. Gõ thẳng URL không lọt
 * vì trang tự gate bằng `can(role, 'settings.bank')`.
 *
 * Lưu vào `catalog.store` có `persist` — số tài khoản này chảy thẳng sang
 * bước 4 của luồng đặt phòng qua `useBankConfig()` (AC-16).
 *
 * ⚠️ Giá trị mặc định là dữ liệu ghi nợ `MANUAL.md` M1, chưa phải số tài khoản
 * thật của khách. Không dừng workflow vì việc này.
 */

import { CheckCircleIcon, CoinsIcon, SettingsIcon } from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import { useCatalogStore } from '@/stores/catalog.store'
import { useBankConfig } from '@/stores/useCatalog'
import { S, tr } from '@/strings'
import { errorOf, pick, validateBankConfig } from '@repo/core'

import type { FieldError, I18nText } from '@repo/core'
import { Button, Field, SelectField } from '@repo/ui'
import { useEffect, useState } from 'react'

const BANKS = [
    'MB Bank',
    'Vietcombank (VCB)',
    'Techcombank (TCB)',
    'ACB (Á Châu)',
    'BIDV',
    'VietinBank',
]

export default function GeneralSettingsPage() {
    return (
        // `settings.bank` chỉ `owner` có — `manager` KHÔNG (AC-10).
        <RequirePermission anyOf={['settings.bank']}>
            <BankSettingsScreen />
        </RequirePermission>
    )
}

function BankSettingsScreen() {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)
    const bank = useBankConfig()
    const setBank = useCatalogStore((s) => s.setBank)

    const [bankName, setBankName] = useState(bank.bankName)
    const [accountNumber, setAccountNumber] = useState(bank.accountNumber)
    const [accountHolder, setAccountHolder] = useState(bank.accountHolder)
    const [depositPercent, setDepositPercent] = useState(bank.defaultDepositPercent)

    const [errors, setErrors] = useState<FieldError[]>([])
    const [notice, setNotice] = useState<I18nText | null>(null)
    const [saving, setSaving] = useState(false)

    // `persist` nạp `localStorage` sau lần render đầu — đồng bộ lại form khi
    // giá trị thật về, nếu không admin thấy giá trị mặc định thay vì giá trị đã lưu.
    useEffect(() => {
        setBankName(bank.bankName)
        setAccountNumber(bank.accountNumber)
        setAccountHolder(bank.accountHolder)
        setDepositPercent(bank.defaultDepositPercent)
    }, [bank])

    function handleSave() {
        if (!user) return

        const found = validateBankConfig({
            bankName,
            accountNumber,
            accountHolder,
            defaultDepositPercent: depositPercent,
        })

        const first = found[0]
        if (first) {
            setErrors(found)
            setNotice(S.fixErrorsFirst)
            document.getElementById(`bank-field-${first.field}`)?.focus()
            return
        }

        setErrors([])
        setSaving(true)
        const result = setBank(
            {
                bankName: bankName.trim(),
                accountNumber: accountNumber.trim(),
                accountHolder: accountHolder.trim().toUpperCase(),
                defaultDepositPercent: depositPercent,
            },
            { id: user.id, name: user.fullName || user.id, role: user.role },
        )
        setSaving(false)
        setNotice(result ? S.saveFailed : S.bankSaved)
    }

    const saved = notice === S.bankSaved

    return (
        <div className="h-full flex flex-col min-h-0 bg-slate-100 p-2 gap-2 overflow-y-auto">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 shrink-0">
                <span className="text-slate-500">
                    <SettingsIcon size={18} />
                </span>
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                    {tr(S.bankConfigTitle, locale)}
                </h1>
            </div>

            {notice && (
                <div
                    role="alert"
                    aria-live="polite"
                    className={`shrink-0 p-2.5 rounded-md text-xs font-medium border flex items-center gap-2 ${
                        saved
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                >
                    {saved && <CheckCircleIcon size={14} />}
                    {tr(notice, locale)}
                </div>
            )}

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-2xl w-full space-y-4">
                <p className="text-[11px] text-slate-500 leading-relaxed m-0">
                    {tr(S.ownerOnlyNotice, locale)}
                </p>

                <SelectField
                    label={tr(S.bankName, locale)}
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    error={maybe(errorOf(errors, 'bankName'), locale)}
                    required
                >
                    {BANKS.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </SelectField>

                <Field
                    fieldId="bank-field-accountNumber"
                    label={tr(S.accountNumber, locale)}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    inputMode="numeric"
                    placeholder="9999999999"
                    hint={tr(S.accountNumberHint, locale)}
                    required
                    error={maybe(errorOf(errors, 'accountNumber'), locale)}
                />

                <Field
                    fieldId="bank-field-accountHolder"
                    label={tr(S.accountHolder, locale)}
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="RESORT NAM DU HILL"
                    required
                    error={maybe(errorOf(errors, 'accountHolder'), locale)}
                />

                <Field
                    fieldId="bank-field-defaultDepositPercent"
                    label={tr(S.defaultDepositPercent, locale)}
                    type="number"
                    min={0}
                    max={100}
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                    required
                    error={maybe(errorOf(errors, 'defaultDepositPercent'), locale)}
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <CoinsIcon size={14} />
                        <span>
                            {pick(
                                {
                                    vi: 'Số tài khoản này hiện cho khách ở bước thanh toán.',
                                    en: 'Guests see this account number at the payment step.',
                                },
                                locale,
                            )}
                        </span>

                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {tr(saving ? S.saving : S.save, locale)}
                    </Button>
                </div>
            </div>
        </div>
    )
}

function maybe(text: I18nText | undefined, locale: 'vi' | 'en'): string | undefined {
    return text ? tr(text, locale) : undefined
}
