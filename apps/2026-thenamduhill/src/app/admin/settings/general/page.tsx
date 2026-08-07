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
 *
 * Áp design system `@repo/cms-ui` (màn 2/7 nhóm Hệ thống) — cùng `PageHeaderBar`
 * + `InlineAlert` như các màn Vận hành đã áp. Đây là MÀN FORM MỘT CỘT, không
 * phải danh sách: không có `DataGrid`/`FilterBar`/`MetricStrip` vì không có gì
 * để lọc hay liệt kê — chỉ 4 trường cấu hình. Giữ nguyên bố cục dọc, chỉ đổi
 * toàn bộ màu/khoảng cách sang token `--cms-*` và bỏ card lồng card.
 */

import { CoinsIcon } from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import { useCatalogStore } from '@/stores/catalog.store'
import { useBankConfig } from '@/stores/useCatalog'
import { S, tr } from '@/strings'
import { errorOf, pick, validateBankConfig } from '@repo/core'

import type { FieldError, I18nText } from '@repo/core'
import { InlineAlert, PageHeaderBar } from '@repo/cms-ui'
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
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)] overflow-y-auto">
            {/* HÀNG 1: tiêu đề bên trái — không có `count`/`actions`, màn này
                không phải danh sách nên không có gì để đếm hay xuất. */}
            <PageHeaderBar title={tr(S.bankConfigTitle, locale)} />

            {/* Form một cột, KHÔNG áp DataGrid/FilterBar — chỉ 4 trường cấu
                hình, không có gì để lọc hay liệt kê (ghi chú theo yêu cầu:
                "không phù hợp áp máy móc" → giữ nguyên tinh thần form một cột,
                chỉ token hoá màu/khoảng cách). `max-w-2xl` giữ độ rộng đọc
                thoải mái, không kéo input dài hết màn rộng. */}
            <div className="flex-1 min-h-0 px-[var(--cms-pad)] py-4">
                <div className="max-w-2xl w-full space-y-4">
                    {notice && (
                        <InlineAlert tone={saved ? 'emerald' : 'rose'}>{tr(notice, locale)}</InlineAlert>
                    )}

                    <p className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] leading-relaxed m-0">
                        {tr(S.ownerOnlyNotice, locale)}
                    </p>

                    <div className="border border-[var(--cms-border)] rounded-[var(--cms-radius)] p-4 space-y-4 bg-[var(--cms-bg)]">
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

                        <div className="flex items-center justify-between gap-3 pt-1 border-t border-[var(--cms-border)]">
                            <div className="flex items-center gap-2 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] pt-3">
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
                            <div className="pt-3">
                                <Button onClick={handleSave} disabled={saving}>
                                    {tr(saving ? S.saving : S.save, locale)}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function maybe(text: I18nText | undefined, locale: 'vi' | 'en'): string | undefined {
    return text ? tr(text, locale) : undefined
}
