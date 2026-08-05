'use client'

import { useId } from 'react'
import { addDays, themePath, type Locale } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'
import { searchQuery, todayKey, type StaySearch } from './search'

/**
 * Bộ field Nhận · Trả · Khách — dùng ở 3 chỗ: widget hero, bottom-sheet mobile,
 * thanh sửa ngày trên trang Rooms. Mỗi field có <label> gắn đúng (luật D4).
 */
export function SearchFields({
    locale,
    value,
    onChange,
    columns,
}: {
    locale: Locale
    value: StaySearch
    onChange: (next: StaySearch) => void
    /** true = xếp ngang trên desktop (widget hero). */
    columns?: boolean
}) {
    const t = ui(locale)
    const idBase = useId()
    const today = todayKey()

    return (
        <div
            className={[
                'grid gap-3',
                // 900px là ngưỡng riêng của mẫu, không phải md/lg mặc định.
                columns
                    ? 'min-[900px]:grid-cols-[1.1fr_1.1fr_0.7fr_0.7fr] min-[900px]:items-end'
                    : '',
            ].join(' ')}
        >
            <div className="h6-field">
                <label htmlFor={`${idBase}-in`}>{t.checkIn}</label>
                <input
                    id={`${idBase}-in`}
                    className="h6-input"
                    type="date"
                    value={value.checkIn}
                    min={today}
                    onChange={(e) => {
                        const checkIn = e.target.value || value.checkIn
                        // Trả phòng luôn sau nhận phòng — đẩy theo thay vì báo lỗi.
                        const checkOut =
                            value.checkOut <= checkIn ? addDays(checkIn, 1) : value.checkOut
                        onChange({ ...value, checkIn, checkOut })
                    }}
                />
            </div>

            <div className="h6-field">
                <label htmlFor={`${idBase}-out`}>{t.checkOut}</label>
                <input
                    id={`${idBase}-out`}
                    className="h6-input"
                    type="date"
                    value={value.checkOut}
                    min={addDays(value.checkIn, 1)}
                    onChange={(e) =>
                        onChange({ ...value, checkOut: e.target.value || value.checkOut })
                    }
                />
            </div>

            <div className="h6-field">
                <label htmlFor={`${idBase}-ad`}>{t.adults}</label>
                <select
                    id={`${idBase}-ad`}
                    className="h6-input"
                    value={value.adults}
                    onChange={(e) => onChange({ ...value, adults: Number(e.target.value) })}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h6-field">
                <label htmlFor={`${idBase}-ch`}>{t.children}</label>
                <select
                    id={`${idBase}-ch`}
                    className="h6-input"
                    value={value.childAges.length}
                    onChange={(e) => {
                        const count = Number(e.target.value)
                        // Giữ tuổi đã nhập, chỉ thêm/bớt phần cuối. Mặc định 8 tuổi.
                        const childAges = Array.from(
                            { length: count },
                            (_, i) => value.childAges[i] ?? 8,
                        )
                        onChange({ ...value, childAges })
                    }}
                >
                    {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>

            {/* `col-[1/-1]` cho khối tuổi chiếm trọn hàng của lưới cha, để nó
                không chen vào 4 cột Nhận · Trả · Người lớn · Trẻ em. */}
            {value.childAges.length > 0 && (
                <div className="col-[1/-1] grid grid-cols-[repeat(auto-fit,minmax(90px,1fr))] gap-2">
                    {value.childAges.map((age, index) => (
                        <div className="h6-field" key={index}>
                            <label htmlFor={`${idBase}-age-${index}`}>
                                {t.childAge} {index + 1}
                            </label>
                            <select
                                id={`${idBase}-age-${index}`}
                                className="h6-input"
                                value={age}
                                onChange={(e) => {
                                    const childAges = [...value.childAges]
                                    childAges[index] = Number(e.target.value)
                                    onChange({ ...value, childAges })
                                }}
                            >
                                {Array.from({ length: 18 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/** Điều hướng sang trang Rooms kèm lựa chọn — CTA chính của Home. */
export function submitHref(search: StaySearch, locale: Locale): string {
    return `${themePath(meta.slug, 'rooms')}${searchQuery(search, locale)}`
}

