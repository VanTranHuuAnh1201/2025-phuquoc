/**
 * Kiểm tra dữ liệu vào cho các màn quản lý dữ liệu nền (ticket `100-04` §6.6).
 *
 * Hàm THUẦN, trả về danh sách lỗi — không ném exception, không chạm trình
 * duyệt, không JSX (luật R2 / BE9). Đặt ở `core` chứ không ở app vì API
 * `200-05` phải kiểm lại đúng bộ luật này ở server (luật BE2); viết ở app thì
 * server chép lại lần thứ hai (luật C10).
 *
 * Thông báo lỗi song ngữ `{vi, en}` (luật C7/R6), giọng ngắn — hướng thực thi
 * (luật C8): nói người dùng phải làm gì, không phải "có vẻ như đã sai".
 */

import type { I18nText } from '@repo/utils'
import type { CancellationRule } from './booking-types'

/** Một lỗi gắn vào đúng một ô nhập. `field` khớp tên state của form. */
export interface FieldError {
    field: string
    message: I18nText
}

/**
 * Slug id hợp lệ — đúng ràng buộc `chk_room_types_id_slug` của `200-01`.
 * Bắt đầu bằng chữ thường hoặc số, dài 2–63 ký tự.
 */
export const ID_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,62}$/

/**
 * Chuỗi song ngữ bắt buộc điền cả hai ngôn ngữ.
 *
 * `.trim()` trước khi kiểm rỗng: chuỗi toàn dấu cách phải trượt, nếu không
 * admin gõ một dấu cách là lọt qua và dữ liệu ra rỗng ở phía khách (§6.6).
 */
function requireBothLocales(
    field: string,
    value: { vi: string; en: string } | undefined,
): FieldError[] {
    const vi = value?.vi?.trim() ?? ''
    const en = value?.en?.trim() ?? ''
    if (vi && en) return []
    return [
        {
            field,
            message: {
                vi: 'Phải nhập tên ở cả hai ngôn ngữ.',
                en: 'Enter the name in both languages.',
            },
        },
    ]
}

/**
 * Số nguyên trong khoảng đóng.
 *
 * Kiểm `Number.isFinite` trước: ô `type=number` trả chuỗi rỗng khi người dùng
 * xoá hết, `Number('')` ra `0` nhưng `Number(undefined)` ra `NaN` — không chặn
 * thì `NaN <= max` luôn false và lỗi lọt qua im lặng (§6.6).
 */
function requireNumberInRange(
    field: string,
    value: number | undefined,
    min: number,
    max: number,
    message: I18nText,
): FieldError[] {
    if (typeof value !== 'number' || !Number.isFinite(value)) return [{ field, message }]
    if (value < min || value > max) return [{ field, message }]
    return []
}

// -------------------------------------------------------------- hạng phòng

export interface RoomTypeInput {
    id?: string
    name?: { vi: string; en: string }
    /** Giá gốc một đêm, VNĐ nguyên. */
    price?: number
    /** Số khách tiêu chuẩn. */
    guests?: number
    /** Sức chứa tối đa — phải ≥ `guests` (DB có `CHECK (max_guests >= guests)`). */
    maxGuests?: number
    area?: string
    /** Id đã tồn tại, để chặn trùng khi tạo mới. */
    existingIds?: readonly string[]
}

export function validateRoomType(input: RoomTypeInput): FieldError[] {
    const errors: FieldError[] = [...requireBothLocales('name', input.name)]

    errors.push(
        ...requireNumberInRange('price', input.price, 0, Number.MAX_SAFE_INTEGER, {
            vi: 'Giá phải là số không âm.',
            en: 'Price must be a non-negative number.',
        }),
    )

    errors.push(
        ...requireNumberInRange('guests', input.guests, 1, 99, {
            vi: 'Sức chứa tối thiểu 1 khách.',
            en: 'Capacity must be at least 1 guest.',
        }),
    )

    // Sức chứa tối đa nhỏ hơn sức chứa tiêu chuẩn là trạng thái vô nghĩa và
    // sẽ trượt `CHECK (max_guests >= guests)` khi lên Postgres ở `200-01`.
    if (
        typeof input.maxGuests === 'number' &&
        Number.isFinite(input.maxGuests) &&
        typeof input.guests === 'number' &&
        Number.isFinite(input.guests) &&
        input.maxGuests < input.guests
    ) {
        errors.push({
            field: 'maxGuests',
            message: {
                vi: 'Sức chứa tối đa phải lớn hơn hoặc bằng sức chứa tiêu chuẩn.',
                en: 'Maximum capacity must be greater than or equal to standard capacity.',
            },
        })
    }

    if (input.id !== undefined) {
        if (!ID_SLUG_PATTERN.test(input.id)) {
            errors.push({
                field: 'id',
                message: {
                    vi: 'Mã hạng chỉ gồm chữ thường, số và dấu gạch ngang, dài 2–63 ký tự.',
                    en: 'Room type ID accepts lowercase letters, digits and hyphens, 2–63 characters.',
                },
            })
        } else if (input.existingIds?.includes(input.id)) {
            errors.push({
                field: 'id',
                message: {
                    vi: 'Mã hạng này đã tồn tại. Chọn mã khác.',
                    en: 'This room type ID already exists. Choose another.',
                },
            })
        }
    }

    return errors
}

// ---------------------------------------------------------------- gói giá

export interface RatePlanInput {
    id?: string
    name?: { vi: string; en: string }
    adjustPercent?: number
    depositPercent?: number
    cancellationRules?: CancellationRule[]
    existingIds?: readonly string[]
}

export function validateRatePlan(input: RatePlanInput): FieldError[] {
    const errors: FieldError[] = [...requireBothLocales('name', input.name)]

    errors.push(
        ...requireNumberInRange('adjustPercent', input.adjustPercent, -100, 200, {
            vi: 'Điều chỉnh giá phải trong khoảng −100% đến +200%.',
            en: 'Price adjustment must be between −100% and +200%.',
        }),
    )

    errors.push(
        ...requireNumberInRange('depositPercent', input.depositPercent, 0, 100, {
            vi: 'Phần trăm cọc phải từ 0 đến 100.',
            en: 'Deposit percentage must be between 0 and 100.',
        }),
    )

    errors.push(...validateCancellationRules(input.cancellationRules))

    if (input.id !== undefined) {
        if (!ID_SLUG_PATTERN.test(input.id)) {
            errors.push({
                field: 'id',
                message: {
                    vi: 'Mã gói giá chỉ gồm chữ thường, số và dấu gạch ngang, dài 2–63 ký tự.',
                    en: 'Rate plan ID accepts lowercase letters, digits and hyphens, 2–63 characters.',
                },
            })
        } else if (input.existingIds?.includes(input.id)) {
            errors.push({
                field: 'id',
                message: {
                    vi: 'Mã gói giá này đã tồn tại. Chọn mã khác.',
                    en: 'This rate plan ID already exists. Choose another.',
                },
            })
        }
    }

    return errors
}

/**
 * Bậc thang hoàn tiền phải xếp theo `daysBeforeCheckIn` GIẢM DẦN NGHIÊM NGẶT.
 *
 * Hai bậc bằng nhau cũng là sai: `quoteRefund()` duyệt bậc đầu tiên khớp, nên
 * hai bậc cùng số ngày làm kết quả phụ thuộc thứ tự mảng — nghĩa là số tiền
 * hoàn của khách phụ thuộc vào cách admin tình cờ gõ (§6.6).
 */
export function validateCancellationRules(rules: CancellationRule[] | undefined): FieldError[] {
    if (!rules || rules.length === 0) return []
    const errors: FieldError[] = []

    for (const rule of rules) {
        if (
            !Number.isFinite(rule.refundPercent) ||
            rule.refundPercent < 0 ||
            rule.refundPercent > 100
        ) {
            errors.push({
                field: 'cancellationRules',
                message: {
                    vi: 'Phần trăm hoàn tiền phải từ 0 đến 100.',
                    en: 'Refund percentage must be between 0 and 100.',
                },
            })
            break
        }
        if (!Number.isFinite(rule.daysBeforeCheckIn) || rule.daysBeforeCheckIn < 0) {
            errors.push({
                field: 'cancellationRules',
                message: {
                    vi: 'Số ngày trước khi nhận phòng phải là số không âm.',
                    en: 'Days before check-in must be a non-negative number.',
                },
            })
            break
        }
    }

    for (let i = 1; i < rules.length; i += 1) {
        const current = rules[i]
        const previous = rules[i - 1]
        if (!current || !previous) continue
        if (current.daysBeforeCheckIn >= previous.daysBeforeCheckIn) {
            errors.push({
                field: 'cancellationRules',
                message: {
                    vi: 'Các bậc phải xếp theo số ngày giảm dần.',
                    en: 'Refund tiers must be ordered by decreasing days.',
                },
            })
            break
        }
    }

    return errors
}

// -------------------------------------------------------- phụ thu / dịch vụ

export interface AddonInput {
    id?: string
    name?: { vi: string; en: string }
    price?: number
    unit?: { vi: string; en: string }
    existingIds?: readonly string[]
}

export function validateAddon(input: AddonInput): FieldError[] {
    const errors: FieldError[] = [...requireBothLocales('name', input.name)]

    errors.push(
        ...requireNumberInRange('price', input.price, 0, Number.MAX_SAFE_INTEGER, {
            vi: 'Giá phải là số không âm.',
            en: 'Price must be a non-negative number.',
        }),
    )

    const unitVi = input.unit?.vi?.trim() ?? ''
    const unitEn = input.unit?.en?.trim() ?? ''
    if (!unitVi || !unitEn) {
        errors.push({
            field: 'unit',
            message: {
                vi: 'Phải nhập đơn vị tính ở cả hai ngôn ngữ.',
                en: 'Enter the unit of measure in both languages.',
            },
        })
    }

    if (input.id !== undefined) {
        if (!ID_SLUG_PATTERN.test(input.id)) {
            errors.push({
                field: 'id',
                message: {
                    vi: 'Mã dịch vụ chỉ gồm chữ thường, số và dấu gạch ngang, dài 2–63 ký tự.',
                    en: 'Add-on ID accepts lowercase letters, digits and hyphens, 2–63 characters.',
                },
            })
        } else if (input.existingIds?.includes(input.id)) {
            errors.push({
                field: 'id',
                message: {
                    vi: 'Mã dịch vụ này đã tồn tại. Chọn mã khác.',
                    en: 'This add-on ID already exists. Choose another.',
                },
            })
        }
    }

    return errors
}

// ------------------------------------------------------- cấu hình ngân hàng

export interface BankConfigInput {
    bankName?: string
    accountNumber?: string
    accountHolder?: string
    defaultDepositPercent?: number
}

const ACCOUNT_NUMBER_PATTERN = /^[0-9]{6,20}$/

export function validateBankConfig(input: BankConfigInput): FieldError[] {
    const errors: FieldError[] = []

    if (!input.bankName?.trim()) {
        errors.push({
            field: 'bankName',
            message: { vi: 'Chọn ngân hàng nhận cọc.', en: 'Select the receiving bank.' },
        })
    }

    if (!ACCOUNT_NUMBER_PATTERN.test(input.accountNumber?.trim() ?? '')) {
        errors.push({
            field: 'accountNumber',
            message: {
                vi: 'Số tài khoản chỉ gồm chữ số, 6–20 ký tự.',
                en: 'Account number must be 6–20 digits only.',
            },
        })
    }

    if (!input.accountHolder?.trim()) {
        errors.push({
            field: 'accountHolder',
            message: {
                vi: 'Nhập tên chủ tài khoản đúng như trên sổ ngân hàng.',
                en: 'Enter the account holder name exactly as registered with the bank.',
            },
        })
    }

    errors.push(
        ...requireNumberInRange('defaultDepositPercent', input.defaultDepositPercent, 0, 100, {
            vi: 'Phần trăm cọc phải từ 0 đến 100.',
            en: 'Deposit percentage must be between 0 and 100.',
        }),
    )

    return errors
}

// ------------------------------------------------------------------- tiện ích

/** Lỗi của đúng một ô, để form gắn vào prop `error` của `Field`. */
export function errorOf(errors: readonly FieldError[], field: string): I18nText | undefined {
    return errors.find((e) => e.field === field)?.message
}
