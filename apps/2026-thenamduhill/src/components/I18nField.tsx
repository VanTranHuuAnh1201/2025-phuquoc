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
import { Field } from '@repo/ui'
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
}: I18nFieldProps) {
    return (
        <div className="grid gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                    label={
                        <>
                            {label} <span className="text-slate-400 font-normal">(VI)</span>
                        </>
                    }
                    fieldId={fieldId}
                    value={value.vi}
                    onChange={(e) => onChange({ ...value, vi: e.target.value })}
                    placeholder={placeholderVi}
                    required={required}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                />
                <Field
                    label={
                        <>
                            {label} <span className="text-slate-400 font-normal">(EN)</span>
                        </>
                    }
                    value={value.en}
                    onChange={(e) => onChange({ ...value, en: e.target.value })}
                    placeholder={placeholderEn}
                    required={required}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                />
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
