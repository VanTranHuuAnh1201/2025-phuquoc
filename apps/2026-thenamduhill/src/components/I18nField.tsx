'use client'

/**
 * Ô nhập một chuỗi song ngữ `{vi, en}` — hai ô cạnh nhau dưới một nhãn
 * (ticket `100-04` §6.4).
 *
 * Đặt ở tầng app chứ không vào `@repo/ui`: nó biết khái niệm `I18nText` của
 * `@repo/utils`, và hiện chỉ CMS dùng (luật R11 — chưa có nơi thứ hai).
 *
 * Đây là chỗ thực thi AC-2 (bắt buộc cả hai ngôn ngữ) MỘT LẦN cho cả bốn màn
 * dữ liệu nền: dấu `*` bắt buộc nằm ở nhãn chung, lỗi hiện bằng CHỮ dưới ô.
 */

import type { I18nText } from '@repo/core'
import { Field, TextAreaField } from '@repo/ui'
import type { ReactNode } from 'react'

export interface I18nFieldProps {
    label: ReactNode
    value: I18nText
    onChange: (next: I18nText) => void
    /** Thông báo lỗi bằng chữ, đã dịch sang ngôn ngữ đang xem. */
    error?: ReactNode
    hint?: ReactNode
    required?: boolean
    placeholderVi?: string
    placeholderEn?: string
    disabled?: boolean
    /** `id` của ô VI — để form nhảy focus vào ô lỗi đầu tiên (FE1 `error`). */
    fieldId?: string
    /**
     * Đổi sang ô nhiều dòng — dùng cho mô tả hạng phòng, chính sách, giới thiệu.
     *
     * Cùng component chứ không tách `I18nTextArea` riêng: mọi thứ khác (nhãn
     * chung, dấu bắt buộc, hint, vùng lỗi `aria-live`) giống hệt nhau, tách ra
     * là hai chỗ phải sửa mỗi khi đổi cách hiện lỗi.
     */
    multiline?: boolean
    /** Số dòng của ô nhiều dòng. Bỏ qua khi `multiline` không bật. */
    rows?: number
}

export function I18nField({
    label,
    value,
    onChange,
    error,
    hint,
    required,
    placeholderVi,
    placeholderEn,
    disabled,
    fieldId,
    multiline,
    rows = 3,
}: I18nFieldProps) {
    /**
     * Một ô của cặp VI/EN.
     *
     * VÌ SAO KHÔNG DÙNG `const Input = multiline ? TextAreaField : Field`:
     * `Field` nhận `ChangeEvent<HTMLInputElement>` còn `TextAreaField` nhận
     * `ChangeEvent<HTMLTextAreaElement>`, và chỉ `Field` có `fieldId`. Gộp
     * thành một biến component thì TypeScript phải hợp nhất hai chữ ký không
     * tương thích — sẽ phải `as any` để qua, đúng thứ luật C1 cấm.
     */
    const renderInput = (lang: 'vi' | 'en') => {
        const shared = {
            label: (
                <>
                    {label}{' '}
                    <span className="text-slate-400 font-normal">({lang.toUpperCase()})</span>
                </>
            ),
            value: value[lang],
            placeholder: lang === 'vi' ? placeholderVi : placeholderEn,
            required,
            disabled,
            'aria-invalid': error ? true : undefined,
        }

        // `fieldId` chỉ gắn cho ô VI: đó là đích nhảy focus khi form báo lỗi
        // (một trường = một id, không nhân đôi id trong DOM).
        const idForLang = lang === 'vi' ? fieldId : undefined

        return multiline ? (
            <TextAreaField
                {...shared}
                fieldId={idForLang}
                rows={rows}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
            />
        ) : (
            <Field
                {...shared}
                fieldId={idForLang}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
            />
        )
    }

    return (
        <div className="grid gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderInput('vi')}
                {renderInput('en')}
            </div>

            {hint && <p className="text-[11px] text-slate-500 leading-relaxed m-0">{hint}</p>}

            {error && (
                <p role="alert" aria-live="polite" className="text-[11px] text-rose-600 font-medium m-0">
                    {error}
                </p>
            )}
        </div>
    )
}
