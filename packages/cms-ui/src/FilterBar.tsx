'use client'

/**
 * `FilterBar` — dải pill lọc nằm THẲNG trên nền trang, không bọc card.
 *
 * VÌ SAO KHÔNG BỌC CARD: khác bản mẫu cũ đang bọc filter trong khung viền —
 * ảnh thiết kế mới đặt pill trực tiếp trên `--cms-bg-subtle` của trang, để
 * dải lọc nhẹ hơn nội dung bảng bên dưới (P5 — nhịp layout, không phải mọi
 * khối đều cần khung).
 *
 * VÌ SAO MỖI NHÓM LÀ `<fieldset>` + `<legend>`: nhóm pill cùng một tiêu chí
 * lọc (ví dụ "Trạng thái") về bản chất là một nhóm radio-like. `<fieldset>`
 * cho screen reader biết ranh giới nhóm, `<legend>` đọc tên nhóm trước khi
 * đọc từng pill — không có nó, đọc rời rạc mất ngữ cảnh (D4/FE11).
 *
 * VÌ SAO PILL LÀ `<button type="button">` CAO ≥24PX: target chạm tối thiểu
 * theo WCAG 2.2 §2.5.8 (D4). `type="button"` để không vô tình submit form
 * bao ngoài nếu `FilterBar` được đặt trong `<form>`.
 */

const PILL_BASE =
    'inline-flex items-center rounded-[var(--cms-radius)] border px-3 text-[length:var(--cms-text-body)] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]'

export interface FilterGroup {
    legend: string
    options: { value: string; label: string }[]
    value: string
    onChange: (v: string) => void
}

export interface FilterBarProps {
    groups: FilterGroup[]
    /** Chuỗi tóm tắt kết quả, ví dụ "128 mục". */
    resultText?: string
    onReset?: () => void
}

export function FilterBar({ groups, resultText, onReset }: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-[var(--cms-pad)] py-3">
            <div className="flex flex-wrap items-center gap-4">
                {groups.map((group) => (
                    <fieldset key={group.legend} className="m-0 flex items-center gap-2 border-0 p-0">
                        <legend className="mr-1 text-[length:var(--cms-text-label)] font-semibold uppercase tracking-wide text-[var(--cms-text-muted)]">
                            {group.legend}
                        </legend>
                        <div className="flex flex-wrap gap-1.5">
                            {group.options.map((opt) => {
                                const active = opt.value === group.value
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => group.onChange(opt.value)}
                                        style={{ minHeight: 24 }}
                                        className={`${PILL_BASE} ${
                                            active
                                                ? 'border-[var(--cms-accent)] bg-[var(--cms-accent)] text-white'
                                                : 'border-[var(--cms-border)] bg-[var(--cms-bg)] text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>
                ))}
            </div>

            <div className="flex shrink-0 items-center gap-3">
                {resultText && (
                    <span className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {resultText}
                    </span>
                )}
                {onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        style={{ minHeight: 24 }}
                        className={`${PILL_BASE} border-[var(--cms-border)] bg-[var(--cms-bg)] text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]`}
                    >
                        Đặt lại
                    </button>
                )}
            </div>
        </div>
    )
}
