'use client'

import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

/**
 * Ô nhập có nhãn, dòng gợi ý và thông báo lỗi.
 *
 * Nhãn luôn gắn với ô bằng `htmlFor`/`id` — click nhãn phải focus vào ô. Lỗi
 * hiện bằng CHỮ kèm `role="alert"`, không bao giờ chỉ đổi màu viền.
 */

/**
 * Chiều cao ô nhập và khoảng cách nhãn↔ô đi qua TOKEN, không phải số cứng.
 *
 * Hai bề mặt cần hai mật độ khác nhau và không thể chung một con số:
 * trang khách dùng bằng NGÓN TAY trên điện thoại (44px là ngưỡng chạm của
 * WCAG 2.2 §2.5.8, 40px đã là sát), còn CMS dùng bằng CHUỘT trên màn rộng và
 * cần nhìn được nhiều trường cùng lúc — lễ tân nhập một đơn 12 trường trong
 * lúc khách chờ máy.
 *
 * Mặc định giữ nguyên 40px/8px nên mọi nơi đang dùng không đổi; `[data-cms]`
 * hạ xuống 32px/4px trong `cms-ui/tokens.css`. Một component, hai mật độ.
 */
const INPUT_STYLE: React.CSSProperties = {
    width: '100%',
    height: 'var(--field-height, 40px)',
    padding: '0 var(--space-3)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-body)',
    color: 'var(--text)',
    background: 'var(--surface)',
    border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm, 6px)',
    boxSizing: 'border-box',
}

interface FieldShellProps {
    id: string
    label: ReactNode
    /** Dòng giải thích dưới nhãn. Dùng nhiều ở form khuyến mãi của admin. */
    hint?: ReactNode
    error?: ReactNode
    required?: boolean
    children: ReactNode
}

function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
    return (
        <div style={{ display: 'grid', gap: 'var(--field-gap, var(--space-2))' }}>
            <label
                htmlFor={id}
                style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text)',
                }}
            >
                {label}
                {required && (
                    <span style={{ color: 'var(--danger)', marginLeft: 4 }} aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            {children}

            {/* Gợi ý nằm DƯỚI ô nhập, không phải trên.
             *
             * Bản trước đặt nó giữa nhãn và ô nhập, khiến mắt phải đọc một câu
             * giải thích trước khi nhìn thấy thứ nó giải thích — và trên form
             * nhiều trường thì nhãn của ô này bị đẩy sát gợi ý của ô trước, hai
             * dòng chữ nhỏ dính nhau, không rõ dòng nào thuộc ô nào.
             *
             * Đây là hành vi ở TẦNG NỀN nên đổi một chỗ là 40 điểm dùng `hint`
             * trong repo đồng bộ theo. `aria-describedby` vẫn trỏ đúng `id` nên
             * trình đọc màn hình không đổi cách đọc — thứ tự DOM mới còn khớp
             * với thứ tự đọc hơn bản cũ. */}
            {hint && (
                <p
                    id={`${id}-hint`}
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                        margin: 0,
                        lineHeight: 1.5,
                    }}
                >
                    {hint}
                </p>
            )}

            {error && (
                <p
                    id={`${id}-error`}
                    role="alert"
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--danger)',
                        margin: 0,
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    )
}

// ------------------------------------------------------------------- text

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
    label: ReactNode
    hint?: ReactNode
    error?: ReactNode
    /**
     * `id` cố định thay cho `useId()` tự sinh.
     *
     * Dùng khi form cần **nhảy focus vào ô lỗi đầu tiên** sau khi kiểm dữ liệu
     * (luật FE1 trạng thái `error`) — `useId()` sinh chuỗi ngẫu nhiên nên bên
     * ngoài không trỏ tới được. Không truyền thì hành vi giữ nguyên như cũ.
     */
    fieldId?: string
}

export function Field({ label, hint, error, required, fieldId, ...rest }: FieldProps) {
    const generated = useId()
    const id = fieldId ?? generated
    return (
        <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
            <input
                {...rest}
                id={id}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={
                    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
                    undefined
                }
                style={{
                    ...INPUT_STYLE,
                    borderColor: error ? 'var(--danger)' : 'var(--border-strong)',
                    ...rest.style,
                }}
            />
        </FieldShell>
    )
}

// ----------------------------------------------------------------- select

export interface SelectFieldProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
    label: ReactNode
    hint?: ReactNode
    error?: ReactNode
    children: ReactNode
}

export function SelectField({
    label,
    hint,
    error,
    required,
    children,
    ...rest
}: SelectFieldProps) {
    const id = useId()
    return (
        <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
            <select
                {...rest}
                id={id}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={
                    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
                    undefined
                }
                style={{
                    ...INPUT_STYLE,
                    borderColor: error ? 'var(--danger)' : 'var(--border-strong)',
                    ...rest.style,
                }}
            >
                {children}
            </select>
        </FieldShell>
    )
}

// --------------------------------------------------------------- textarea

export interface TextAreaFieldProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
    label: ReactNode
    hint?: ReactNode
    error?: ReactNode
    /**
     * `id` cố định thay cho `useId()` tự sinh — cùng hợp đồng với `Field`.
     *
     * BẮT BUỘC CÓ, không phải tiện ích: form gọi
     * `document.getElementById(...)?.focus()` để nhảy vào ô lỗi đầu tiên (luật
     * FE1 trạng thái `error`). `useId()` sinh chuỗi ngẫu nhiên nên bên ngoài
     * không trỏ tới được, và ô nhiều dòng lặng lẽ bị bỏ qua khỏi luồng đó —
     * người dùng thấy báo lỗi nhưng con trỏ không đi tới ô nào.
     */
    fieldId?: string
}

export function TextAreaField({
    label,
    hint,
    error,
    required,
    fieldId,
    ...rest
}: TextAreaFieldProps) {
    const generated = useId()
    const id = fieldId ?? generated
    return (
        <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
            <textarea
                {...rest}
                id={id}
                required={required}
                rows={rest.rows ?? 3}
                aria-invalid={error ? true : undefined}
                aria-describedby={
                    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
                    undefined
                }
                style={{
                    ...INPUT_STYLE,
                    resize: 'vertical',
                    borderColor: error ? 'var(--danger)' : 'var(--border-strong)',
                    ...rest.style,
                }}
            />
        </FieldShell>
    )
}

// ---------------------------------------------------------------- checkbox

export interface CheckFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
    label: ReactNode
    hint?: ReactNode
}

export function CheckField({ label, hint, ...rest }: CheckFieldProps) {
    const id = useId()
    return (
        <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
            <label
                htmlFor={id}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    // Target chạm tối thiểu 24px theo WCAG 2.2 mục 2.5.8.
                    minHeight: 24,
                }}
            >
                <input
                    {...rest}
                    id={id}
                    type="checkbox"
                    aria-describedby={hint ? `${id}-hint` : undefined}
                    style={{ width: 18, height: 18, flexShrink: 0, accentColor: 'var(--brand)' }}
                />
                {label}
            </label>
            {hint && (
                <p
                    id={`${id}-hint`}
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                        margin: 0,
                        paddingLeft: 'calc(18px + var(--space-3))',
                        lineHeight: 1.5,
                    }}
                >
                    {hint}
                </p>
            )}
        </div>
    )
}
