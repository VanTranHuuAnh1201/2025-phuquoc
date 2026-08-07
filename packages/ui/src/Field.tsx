'use client'

import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

/**
 * Ô nhập có nhãn, dòng gợi ý và thông báo lỗi.
 *
 * Nhãn luôn gắn với ô bằng `htmlFor`/`id` — click nhãn phải focus vào ô. Lỗi
 * hiện bằng CHỮ kèm `role="alert"`, không bao giờ chỉ đổi màu viền.
 */

const INPUT_STYLE: React.CSSProperties = {
    width: '100%',
    height: 40,
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
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
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

            {children}

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
}

export function TextAreaField({
    label,
    hint,
    error,
    required,
    ...rest
}: TextAreaFieldProps) {
    const id = useId()
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
