import type {
    BankSettingsDto,
    GetBankSettingsResponse,
    UpdateBankSettingsResponse,
} from '@repo/core'
import { ok } from '@/lib/auth/errors'
import { type Actor, withAuthGuard } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'
import { invalidBody, validationFailed, type DbRow } from '@/lib/api/catalog'
import { readJsonObject, Validator } from '@/lib/api/validate'

export const dynamic = 'force-dynamic'

/**
 * Cấu hình một cơ sở = đúng MỘT hàng (`property_settings.id` default
 * `'nam-du-hill'`). Hằng ở đây thay vì rải chuỗi trong hai handler.
 */
const PROPERTY_ID = 'nam-du-hill'

/**
 * `unknown` (cột jsonb) → `BankSettingsDto`.
 *
 * MỌI trường tuỳ chọn là chủ ý, không phải lỏng lẻo: cơ sở mới cài đặt thì
 * `bank = '{}'` — đó là trạng thái **hợp lệ**, không phải trạng thái lỗi. FE
 * phải chịu được object rỗng và **không được** giả định đã có số tài khoản
 * (SA chốt `380-02 §8.3` điểm 1).
 */
function mapBank(value: unknown): BankSettingsDto {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return {}
    const obj = value as Record<string, unknown>
    const dto: BankSettingsDto = {}
    if (typeof obj.bankName === 'string') dto.bankName = obj.bankName
    if (typeof obj.accountNumber === 'string') dto.accountNumber = obj.accountNumber
    if (typeof obj.accountHolder === 'string') dto.accountHolder = obj.accountHolder
    const percent = obj.defaultDepositPercent
    if (typeof percent === 'number' && Number.isFinite(percent)) {
        dto.defaultDepositPercent = percent
    }
    return dto
}

/**
 * `GET /api/admin/settings/bank` — đọc tài khoản ngân hàng nhận cọc.
 *
 * Quyền: `settings.bank` — **chỉ `owner`**. `manager` và lễ tân đều KHÔNG có
 * (đối chiếu `ROLE_PERMISSIONS`): đây là tài khoản nhận tiền của cơ sở, không
 * phải dữ liệu vận hành hằng ngày.
 *
 * ⚠️ NỢ SCHEMA ĐÃ TRẢ Ở TICKET NÀY (`M30`): cột `property_settings.bank` **chưa
 * từng tồn tại** — `booking-types.ts` khai `BankConfig` map vào nó, nhưng
 * `information_schema.columns` ngày 08/08/2026 cho thấy bảng chỉ có 11 cột và
 * không có `bank`. Viết route trước khi thêm cột là `42703 column does not
 * exist`, mà build + typecheck vẫn xanh. Migration
 * `20260104000000_add_property_settings_bank.sql` đặt **trước** file này.
 */
export const GET = withAuthGuard(async (): Promise<Response> => {
    const { data, error } = await createAdminClient()
        .from('property_settings')
        .select('bank')
        .eq('id', PROPERTY_ID)
        .maybeSingle()

    if (error) throw new Error(`Không đọc được property_settings: ${error.message}`)

    // Hàng chưa tồn tại → `{}`, không phải 404: "cơ sở chưa nhập số tài khoản"
    // và "không có cơ sở nào" là hai chuyện khác nhau với người dùng, nhưng ở
    // màn hình này cả hai đều dẫn tới cùng một việc — nhập vào rồi lưu.
    const body: GetBankSettingsResponse = { bank: mapBank((data as DbRow | null)?.bank) }
    return ok(body)
}, 'settings.bank')

/**
 * `PATCH /api/admin/settings/bank` — sửa cấu hình ngân hàng.
 * Quyền: `settings.bank`.
 *
 * Đây là thông tin khách chuyển tiền vào. **Sai một chữ số là tiền cọc đi lạc**,
 * nên hai điều bắt buộc:
 *
 * ① `accountNumber` chỉ nhận chữ số. Số tài khoản Việt Nam không có khoảng
 *    trắng hay dấu gạch; cho lọt ký tự lạ nghĩa là QR sinh ra sai và không ai
 *    phát hiện cho tới khi có khách chuyển nhầm.
 * ② Ghi vết mọi lần sửa kèm giá trị cũ.
 *
 * ⚠️ NỢ `M41` — ĐIỀU ② HIỆN **CHƯA GHI ĐƯỢC VÀO `activity_logs`**:
 * `activity_logs.booking_id` là `uuid NOT NULL` + FK `REFERENCES bookings(id)`
 * (đã đọc `information_schema` + `pg_constraint`). Bảng đó gắn cứng vào **một
 * đơn hàng**; thay đổi cấu hình cơ sở không thuộc đơn nào nên **không có hàng
 * hợp lệ nào để chèn**. Chèn bừa một `booking_id` là làm bẩn nhật ký đơn của
 * khách — tệ hơn hẳn việc thiếu vết.
 *
 * Fallback đang dùng: ghi log server có ngữ cảnh đầy đủ (actor + giá trị cũ +
 * giá trị mới). Cách sửa đúng là một bảng `audit_logs` cấp hệ thống, hoặc nới
 * `booking_id` thành nullable + thêm `entity`/`entity_id` — **cả hai đều là
 * thay đổi schema ngoài phạm vi `390-01`**, đã ghi nợ vào MANUAL.md.
 */
export const PATCH = withAuthGuard(async (req: Request, actor: Actor): Promise<Response> => {
    const body = await readJsonObject(req)
    if (!body) return invalidBody()

    const v = new Validator()
    const bankName = v.optionalString('bankName', body.bankName, 120)
    const accountHolder = v.optionalString('accountHolder', body.accountHolder, 120)
    const defaultDepositPercent = v.optionalNumber(
        'defaultDepositPercent',
        body.defaultDepositPercent,
        0,
        100,
    )

    let accountNumber: string | undefined
    if (body.accountNumber !== undefined) {
        if (typeof body.accountNumber !== 'string' || !/^\d{4,20}$/.test(body.accountNumber.trim())) {
            v.add('accountNumber', {
                vi: 'Số tài khoản chỉ gồm chữ số, dài 4–20 ký tự. Bỏ khoảng trắng và dấu gạch.',
                en: 'The account number must be 4–20 digits only. Remove spaces and dashes.',
            })
        } else {
            accountNumber = body.accountNumber.trim()
        }
    }

    if (v.failed) return validationFailed(v.fields)

    const db = createAdminClient()
    const { data: current, error: readError } = await db
        .from('property_settings')
        .select('bank')
        .eq('id', PROPERTY_ID)
        .maybeSingle()

    if (readError) throw new Error(`Không đọc được property_settings: ${readError.message}`)

    const before = mapBank((current as DbRow | null)?.bank)

    // Trộn lên giá trị hiện có: PATCH là sửa MỘT PHẦN. Ghi đè cả object bằng
    // body gửi lên sẽ xoá mất các trường admin không đụng tới — sửa mỗi tên chủ
    // tài khoản mà mất luôn số tài khoản là đúng loại lỗi mất tiền.
    const next: BankSettingsDto = { ...before }
    if (bankName !== undefined) next.bankName = bankName
    if (accountNumber !== undefined) next.accountNumber = accountNumber
    if (accountHolder !== undefined) next.accountHolder = accountHolder
    if (defaultDepositPercent !== undefined) next.defaultDepositPercent = defaultDepositPercent

    if (Object.keys(next).length === 0) {
        return validationFailed([{
            field: 'body',
            message: { vi: 'Không có trường nào để cập nhật.', en: 'No fields to update.' },
        }])
    }

    const updatedAt = new Date().toISOString()
    // `upsert` chứ không `update`: cơ sở mới cài đặt có thể chưa có hàng nào, và
    // lúc đó `update` báo thành công với 0 hàng — admin bấm Lưu, thấy xanh, mà
    // không có gì được ghi. Đó là im lặng sai, thứ khó phát hiện nhất.
    const { data, error } = await db
        .from('property_settings')
        .upsert({ id: PROPERTY_ID, bank: next, updated_at: updatedAt }, { onConflict: 'id' })
        .select('bank, updated_at')
        .single()

    if (error) throw new Error(`Không lưu được cấu hình ngân hàng: ${error.message}`)

    const row = data as unknown as DbRow

    // Vết kiểm toán tạm thời — xem nợ `M41` ở đầu handler. Che 4 số cuối là đủ
    // để đối chiếu mà không đổ số tài khoản đầy đủ vào log tập trung.
    console.info('[settings.bank] Cấu hình ngân hàng đã đổi', {
        actorId: actor.id,
        actorRole: actor.role,
        at: updatedAt,
        from: { ...before, accountNumber: maskAccount(before.accountNumber) },
        to: { ...next, accountNumber: maskAccount(next.accountNumber) },
    })

    const response: UpdateBankSettingsResponse = {
        bank: mapBank(row.bank),
        updatedAt: typeof row.updated_at === 'string' ? row.updated_at : updatedAt,
    }
    return ok(response)
}, 'settings.bank')

/** `1234567890` → `••••7890`. Không có số thì trả `undefined`, không trả `'••••'`. */
function maskAccount(value: string | undefined): string | undefined {
    if (!value) return undefined
    return `••••${value.slice(-4)}`
}
