'use client'

/**
 * Ô tải ảnh cho CMS — kéo-thả hoặc bấm chọn, hệ thống tự nén.
 *
 * Thay cho ô textarea "mỗi dòng một đường dẫn" mà form hạng phòng đang dùng:
 * chủ resort không biết đường dẫn ảnh là gì, và cũng không nên phải biết.
 *
 * Đặt ở tầng app chứ không vào `@repo/ui`: nó gọi thẳng `/api/admin/upload`,
 * tức là biết đường dẫn API của app này (luật R15 — `ui` không được biết).
 *
 * DỮ LIỆU RA vẫn là `string[]` đường dẫn ảnh, y hệt ô textarea cũ — nên form
 * lưu xuống store không đổi một dòng nào.
 */

import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import type { I18nText } from '@repo/core'
import { S, tr } from '@/strings'
import { useLocale } from '@/components/LocaleProvider'
import { TrashIcon } from '@/components/icons'

export interface ImageUploadFieldProps {
    label: string
    hint?: string
    /** Danh sách đường dẫn ảnh hiện có. Ảnh đầu tiên là ảnh đại diện. */
    value: string[]
    onChange: (next: string[]) => void
    /** Trần số ảnh. Vượt thì nút chọn bị khoá kèm lời giải thích. */
    max?: number
}

/** Kết quả `data` của `POST /api/admin/upload`. */
interface UploadedImage {
    url: string
    fileName: string
    originalBytes: number
    optimizedBytes: number
}

interface ApiEnvelope {
    success: boolean
    data: UploadedImage | null
    error: { code: string; message: I18nText } | null
}

/** Byte → chuỗi đọc được. Dùng cho dòng "đã giảm từ 8.2MB còn 340KB". */
function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`
    return `${Math.round(bytes / 1024)}KB`
}

export function ImageUploadField({ label, hint, value, onChange, max = 12 }: ImageUploadFieldProps) {
    const { locale } = useLocale()
    const inputRef = useRef<HTMLInputElement>(null)

    const [busy, setBusy] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    /** Tóm tắt lần nén gần nhất — bằng chứng cho người dùng thấy đã tối ưu. */
    const [savedNote, setSavedNote] = useState<string | null>(null)

    const full = value.length >= max

    /**
     * Tải lần lượt từng ảnh.
     *
     * TUẦN TỰ chứ không `Promise.all`: mỗi ảnh phải qua `sharp` ở phía máy chủ,
     * bắn 10 ảnh cùng lúc là 10 tiến trình nén song song — máy chủ nhỏ sẽ hết
     * bộ nhớ. Chậm hơn vài giây nhưng không sập.
     */
    async function uploadAll(files: File[]) {
        if (files.length === 0) return

        setBusy(true)
        setError(null)
        setSavedNote(null)

        const uploaded: string[] = []
        let originalTotal = 0
        let optimizedTotal = 0

        for (const file of files) {
            if (value.length + uploaded.length >= max) break

            const body = new FormData()
            body.append('file', file)

            try {
                const res = await fetch('/api/admin/upload', { method: 'POST', body })
                const json = (await res.json()) as ApiEnvelope

                if (!json.success || !json.data) {
                    // Lỗi API hiện bằng CHỮ, đúng ngôn ngữ đang xem (luật FE4).
                    setError(json.error ? tr(json.error.message, locale) : tr(S.uploadFailed, locale))
                    break
                }

                uploaded.push(json.data.url)
                originalTotal += json.data.originalBytes
                optimizedTotal += json.data.optimizedBytes
            } catch (e) {
                // C3 — không nuốt lỗi: ghi log có ngữ cảnh rồi báo người dùng.
                console.error('[ImageUploadField] Tải ảnh thất bại', { name: file.name, error: e })
                setError(tr(S.uploadNetworkError, locale))
                break
            }
        }

        if (uploaded.length > 0) {
            onChange([...value, ...uploaded])
            setSavedNote(
                `${uploaded.length} ${tr(S.uploadDoneCount, locale)} · ${formatBytes(originalTotal)} → ${formatBytes(optimizedTotal)}`,
            )
        }

        setBusy(false)
        // Xoá giá trị input để chọn LẠI ĐÚNG file vừa xoá vẫn kích hoạt onChange.
        if (inputRef.current) inputRef.current.value = ''
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDragging(false)
        if (busy || full) return
        void uploadAll(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')))
    }

    function removeAt(index: number) {
        onChange(value.filter((_, i) => i !== index))
    }

    /** Đưa một ảnh lên đầu danh sách — ảnh đầu là ảnh đại diện. */
    function makeCover(index: number) {
        if (index === 0) return
        const next = [...value]
        const [picked] = next.splice(index, 1)
        if (picked) next.unshift(picked)
        onChange(next)
    }

    return (
        <div className="grid gap-2">
            <span className="text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)]">
                {label}
            </span>

            {/* Vùng kéo-thả. `<div>` mang sự kiện kéo-thả, nút bấm nằm BÊN
                TRONG là phần tử nhận Tab — không biến cả khối thành `<button>`
                vì bên trong còn có nút xoá của từng ảnh (nút lồng nút là HTML
                không hợp lệ và screen reader đọc sai). */}
            <div
                onDragOver={(e) => {
                    e.preventDefault()
                    if (!busy && !full) setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-[var(--cms-radius)] border border-dashed p-2.5 transition-colors ${
                    dragging
                        ? 'border-[var(--cms-accent)] bg-[var(--cms-accent-weak)]'
                        : 'border-[var(--cms-border)] bg-[var(--cms-bg-subtle)]'
                }`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={busy || full}
                        className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        {/* Trạng thái `loading` giữ NGUYÊN kích thước nút (chỉ
                            đổi chữ) để layout không nhảy — luật FE1. */}
                        {tr(busy ? S.uploading : S.chooseImages, locale)}
                    </button>

                    <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {full
                            ? `${tr(S.uploadLimitReached, locale)} (${max})`
                            : tr(S.dropImagesHere, locale)}
                    </span>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="sr-only"
                    aria-label={label}
                    onChange={(e) => void uploadAll(Array.from(e.target.files ?? []))}
                />

                {value.length > 0 && (
                    /* 6 cột thay vì 4: ảnh nhỏ hơn nhưng một hàng chứa được
                       nhiều hơn — với 6–12 ảnh thì đây là chênh lệch giữa một
                       hàng và ba hàng trong form. */
                    <ul className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                        {value.map((src, index) => (
                            <li
                                key={src}
                                className="group relative overflow-hidden rounded-[var(--cms-radius-sm)] border border-[var(--cms-border)] bg-[var(--cms-bg)]"
                            >
                                {/* Ảnh do người dùng vừa tải lên, kích thước
                                    không biết trước và đã được nén ở máy chủ —
                                    `next/image` không thêm giá trị gì ở đây. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={src}
                                    alt=""
                                    className="block aspect-[4/3] w-full object-cover"
                                />

                                {index === 0 && (
                                    <span className="absolute left-1 top-1 rounded-[var(--cms-radius-sm)] bg-[var(--cms-accent)] px-1.5 py-0.5 text-[length:var(--cms-text-meta)] font-semibold text-white">
                                        {tr(S.coverImage, locale)}
                                    </span>
                                )}

                                <div className="flex items-center justify-between gap-1 px-1.5 py-1">
                                    <button
                                        type="button"
                                        onClick={() => makeCover(index)}
                                        disabled={index === 0}
                                        className="truncate text-left text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] transition-colors hover:text-[var(--cms-accent)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--cms-accent)]"
                                    >
                                        {tr(S.setAsCover, locale)}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => removeAt(index)}
                                        aria-label={`${tr(S.removeImage, locale)} ${index + 1}`}
                                        style={{ minWidth: 24, minHeight: 24 }}
                                        className="inline-flex shrink-0 items-center justify-center rounded-[var(--cms-radius-sm)] text-[var(--cms-text-muted)] transition-colors hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-tone-rose)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--cms-accent)]"
                                    >
                                        <TrashIcon size={13} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {hint && (
                <p className="m-0 text-[length:var(--cms-text-meta)] leading-relaxed text-[var(--cms-text-muted)]">
                    {hint}
                </p>
            )}

            {savedNote && (
                <p className="m-0 text-[length:var(--cms-text-meta)] font-medium text-[var(--cms-tone-emerald)]">
                    {savedNote}
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    aria-live="polite"
                    className="m-0 text-[length:var(--cms-text-meta)] font-medium text-[var(--cms-tone-rose)]"
                >
                    {error}
                </p>
            )}
        </div>
    )
}
