import type { I18nText } from '@repo/core'

/**
 * Bộ kiểm dữ liệu vào dùng chung cho các route danh mục (ticket `390-01`).
 *
 * ─── VÌ SAO TỒN TẠI ────────────────────────────────────────────────────────
 *
 * Ba nhóm route (`room-types`, `rate-plans`, `addons`) kiểm cùng một loại thứ:
 * `I18nText` đủ hai vế, số không âm, slug đúng pattern. Viết lại ở mỗi route là
 * 3 bản sao, và bản sao thứ ba luôn là bản quên một nhánh (C10).
 *
 * ─── VÌ SAO KHÔNG ĐẶT Ở `packages/core` ────────────────────────────────────
 *
 * Đây là kiểm **dữ liệu vào của HTTP request** — thứ chỉ tồn tại ở tầng app.
 * `core` giữ quy tắc nghiệp vụ (tính giá, vòng đời đơn), không giữ hình dạng
 * body JSON. Nhét vào đó là kéo mối bận tâm của tầng vận chuyển xuống tầng
 * nghiệp vụ (R2/R11).
 *
 * ─── VÌ SAO GOM LỖI, KHÔNG NÉM Ở LỖI ĐẦU TIÊN ──────────────────────────────
 *
 * `Validator` tích luỹ vào `fields[]` rồi trả một lần. Ném ở lỗi đầu buộc admin
 * sửa → gửi → lại đỏ ô khác → sửa → gửi, mỗi vòng một request. Form CMS có
 * ~20 ô, đó là trải nghiệm điền form tệ nhất có thể (C8: hướng thực thi).
 */

/** Một lỗi gắn vào đúng ô nhập. Khớp `ValidationFieldError` của hợp đồng. */
export interface FieldError {
    field: string
    message: I18nText
}

/**
 * Slug của danh mục — `room_types.id`, `rate_plans.id`, `addons.id`.
 *
 * Pattern lấy NGUYÊN VĂN từ `chk_room_types_id_slug` / `chk_rate_plans_id_slug`
 * / `chk_addons_id_slug` đọc bằng `pg_get_constraintdef()` trên DB sống. Kiểm ở
 * tầng app để trả **400 có tên ô sai**, thay vì để Postgres ném `23514` mà route
 * chỉ dịch được thành 500 chung chung.
 *
 * ⚠️ Hai lớp này phải khớp nhau. Lệch thì app từ chối cái DB chấp nhận (mất tính
 * năng, im lặng) hoặc app chấp nhận cái DB từ chối (500 ở tầng dưới).
 */
export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,62}$/

/**
 * Sinh slug từ `name.en` khi client không gửi `id`.
 *
 * Bỏ dấu bằng `NFD` + xoá dải kết hợp: "Bungalow Hướng Biển" → `bungalow-huong-bien`.
 * Không bỏ dấu thì `ư`/`ơ` rơi vào nhánh xoá ký tự lạ và slug mất chữ.
 */
export function slugify(source: string): string {
    return source
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 63)
}

/** Thu hẹp body đã parse về object đọc được, không dùng `any` (C1). */
export type JsonObject = Record<string, unknown>

/**
 * Đọc body JSON. `null` = body hỏng hoặc không phải object ⇒ route trả 400.
 *
 * Trả `null` thay vì ném: thân route đã nằm trong `withAuthGuard` (bắt mọi lỗi
 * thành 500), nên ném ở đây sẽ biến "client gửi JSON hỏng" — lỗi **của client**
 * — thành 500 "lỗi hệ thống". Sai mã là sai địa chỉ trách nhiệm.
 */
export async function readJsonObject(req: Request): Promise<JsonObject | null> {
    try {
        const parsed: unknown = await req.json()
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null
        return parsed as JsonObject
    } catch {
        return null
    }
}

/** Gom lỗi theo ô để trả một lần. */
export class Validator {
    private readonly errors: FieldError[] = []

    add(field: string, message: I18nText): void {
        this.errors.push({ field, message })
    }

    get failed(): boolean {
        return this.errors.length > 0
    }

    get fields(): FieldError[] {
        return this.errors
    }

    /**
     * `I18nText` bắt buộc — phải có **cả** `vi` và `en`, cả hai khác rỗng (R6).
     *
     * Đây là luật R6 chứ không phải sự khó tính: dữ liệu thiếu một ngôn ngữ đi
     * vào DB thì trang khách ở ngôn ngữ đó hiện **ô trống**, và không có gì đỏ
     * ở bất kỳ đâu để ai biết. `room_types.name` có CHECK ở DB, nhưng
     * `addons.unit` thì không — nên chốt chặn phải ở đây, không ỷ vào DB.
     */
    requireI18n(field: string, value: unknown): I18nText | undefined {
        if (value === null || typeof value !== 'object' || Array.isArray(value)) {
            this.add(field, {
                vi: `Thiếu ${field}. Nhập đủ cả tiếng Việt và tiếng Anh.`,
                en: `${field} is required. Provide both Vietnamese and English.`,
            })
            return undefined
        }
        const obj = value as JsonObject
        const vi = typeof obj.vi === 'string' ? obj.vi.trim() : ''
        const en = typeof obj.en === 'string' ? obj.en.trim() : ''
        if (vi === '' || en === '') {
            this.add(field, {
                vi: `${field} phải có đủ hai ngôn ngữ: tiếng Việt và tiếng Anh.`,
                en: `${field} must include both Vietnamese and English.`,
            })
            return undefined
        }
        return { vi, en }
    }

    /** `I18nText` tuỳ chọn — không gửi thì bỏ qua, gửi thì phải đủ hai vế. */
    optionalI18n(field: string, value: unknown): I18nText | undefined {
        if (value === undefined) return undefined
        return this.requireI18n(field, value)
    }

    /** Mảng `I18nText` — mỗi phần tử phải đủ hai vế. */
    optionalI18nArray(field: string, value: unknown): I18nText[] | undefined {
        if (value === undefined) return undefined
        if (!Array.isArray(value)) {
            this.add(field, {
                vi: `${field} phải là danh sách.`,
                en: `${field} must be a list.`,
            })
            return undefined
        }
        const out: I18nText[] = []
        for (let i = 0; i < value.length; i += 1) {
            const item = this.requireI18n(`${field}[${i}]`, value[i])
            if (item) out.push(item)
        }
        return out
    }

    /** Mảng chuỗi — dùng cho `images`, `roomTypeIds`. */
    optionalStringArray(field: string, value: unknown): string[] | undefined {
        if (value === undefined) return undefined
        if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) {
            this.add(field, {
                vi: `${field} phải là danh sách chuỗi.`,
                en: `${field} must be a list of strings.`,
            })
            return undefined
        }
        return value as string[]
    }

    /**
     * Số trong khoảng `[min, max]`.
     *
     * `Number.isFinite` chứ không `typeof === 'number'`: `NaN` và `Infinity`
     * đều lọt qua `typeof`, và `NaN` gửi vào numeric của Postgres ăn `22P02`
     * — 500 thay vì 400, lại sai địa chỉ trách nhiệm.
     */
    requireNumber(field: string, value: unknown, min: number, max: number): number | undefined {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            this.add(field, {
                vi: `${field} phải là một con số.`,
                en: `${field} must be a number.`,
            })
            return undefined
        }
        if (value < min || value > max) {
            this.add(field, {
                vi: `${field} phải nằm trong khoảng ${min} đến ${max}.`,
                en: `${field} must be between ${min} and ${max}.`,
            })
            return undefined
        }
        return value
    }

    optionalNumber(field: string, value: unknown, min: number, max: number): number | undefined {
        if (value === undefined) return undefined
        return this.requireNumber(field, value, min, max)
    }

    /** Số nguyên trong khoảng — sức chứa, `sortOrder`. */
    requireInt(field: string, value: unknown, min: number, max: number): number | undefined {
        const n = this.requireNumber(field, value, min, max)
        if (n === undefined) return undefined
        if (!Number.isInteger(n)) {
            this.add(field, {
                vi: `${field} phải là số nguyên.`,
                en: `${field} must be a whole number.`,
            })
            return undefined
        }
        return n
    }

    optionalInt(field: string, value: unknown, min: number, max: number): number | undefined {
        if (value === undefined) return undefined
        return this.requireInt(field, value, min, max)
    }

    requireString(field: string, value: unknown, maxLen = 500): string | undefined {
        if (typeof value !== 'string' || value.trim() === '') {
            this.add(field, {
                vi: `Thiếu ${field}.`,
                en: `${field} is required.`,
            })
            return undefined
        }
        if (value.length > maxLen) {
            this.add(field, {
                vi: `${field} không được dài quá ${maxLen} ký tự.`,
                en: `${field} must be at most ${maxLen} characters.`,
            })
            return undefined
        }
        return value.trim()
    }

    optionalString(field: string, value: unknown, maxLen = 500): string | undefined {
        if (value === undefined) return undefined
        return this.requireString(field, value, maxLen)
    }

    optionalBoolean(field: string, value: unknown): boolean | undefined {
        if (value === undefined) return undefined
        if (typeof value !== 'boolean') {
            this.add(field, {
                vi: `${field} phải là true hoặc false.`,
                en: `${field} must be true or false.`,
            })
            return undefined
        }
        return value
    }

    /**
     * Slug do client gửi. Không gửi → `undefined`, route tự sinh từ `name.en`.
     * Gửi sai định dạng → lỗi có ví dụ, không chỉ nói "sai".
     */
    optionalSlug(field: string, value: unknown): string | undefined {
        if (value === undefined) return undefined
        if (typeof value !== 'string' || !SLUG_RE.test(value)) {
            this.add(field, {
                vi: 'Mã định danh chỉ gồm chữ thường, số và dấu gạch ngang, dài 2–63 ký tự.'
                    + ' Ví dụ: bungalow-huong-bien.',
                en: 'The id may contain only lowercase letters, digits and hyphens, 2–63 characters.'
                    + ' Example: bungalow-huong-bien.',
            })
            return undefined
        }
        return value
    }
}
