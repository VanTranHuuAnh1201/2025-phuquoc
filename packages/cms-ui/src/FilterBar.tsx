'use client'

/**
 * `FilterBar` — dải pill lọc. Từ round 2, render làm children INLINE bên
 * trong `PageHeaderBar` (cùng hàng với title) thay vì một khối riêng bên
 * dưới — mục tiêu round này là TIẾT KIỆM CHIỀU CAO. Component không còn
 * padding/justify-between của chính nó; layout ngoài cùng do nơi gọi
 * (`PageHeaderBar`) quyết định.
 *
 * VÌ SAO MỖI NHÓM VẪN LÀ `<fieldset>` + `<legend>`: nhóm pill cùng một tiêu
 * chí lọc (ví dụ "Trạng thái") về bản chất là một nhóm radio-like. `<fieldset>`
 * cho screen reader biết ranh giới nhóm, `<legend>` đọc tên nhóm trước khi
 * đọc từng pill — không có nó, đọc rời rạc mất ngữ cảnh (D4/FE11).
 *
 * VÌ SAO LEGEND CHUYỂN SANG `sr-only` (fix round 2 mục 2): hiển thị đủ cả
 * "CA TRỰC"/"HẠNG PHÒNG" bằng chữ hoa cách rộng tốn ngang đáng kể khi đã dồn
 * chung một hàng với title. Bản thân các pill ("Tất cả/Ca sáng/Ca chiều") đã
 * đủ tự giải thích bằng mắt — legend chỉ còn cần cho screen reader, nên ẩn
 * khỏi mắt (`sr-only`) chứ KHÔNG xoá khỏi DOM: a11y vẫn nguyên vẹn, chỉ mất
 * phần thị giác thừa.
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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {groups.map((group) => (
                // `gap-x-5` GIỮA các fieldset (khoảng cách nhóm) rộng hơn
                // `gap-1.5` BÊN TRONG một fieldset (khoảng cách giữa các pill
                // cùng nhóm) — khi legend đã ẩn khỏi mắt (sr-only), khoảng
                // cách là tín hiệu DUY NHẤT còn lại giúp mắt phân biệt "Tất
                // cả/Ca sáng/Ca chiều" là một nhóm khác với "Tất cả/Villa/…".
                <fieldset key={group.legend} className="m-0 flex items-center gap-1.5 border-0 p-0">
                    <legend className="sr-only">{group.legend}</legend>
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
                </fieldset>
            ))}

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
    )
}
