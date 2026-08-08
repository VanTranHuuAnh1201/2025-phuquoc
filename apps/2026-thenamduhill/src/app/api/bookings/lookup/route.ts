import type {
    AppliedPromotion,
    BookingPriceLine,
    BookingStatus,
    Channel,
    I18nText,
    PublicBookingDto,
    PublicBookingGuestDto,
    PublicCancellationDto,
} from '@repo/core'
import { countNights } from '@repo/core'
import { clientIpOf, consumeSharedRateLimit } from '@/lib/api/shared-rate-limit'
import { fail, ok, serverError } from '@/lib/auth/errors'
import { STATUS_LABEL } from '@/strings'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * `GET /api/bookings/lookup?code=…&phone=…` — tra cứu đơn **KHÔNG cần đăng nhập**
 * (ticket `390-03`, module MAP `M11`, hợp đồng `api-contracts.ts §M11`).
 *
 * ─── VÌ SAO PHẢI CÓ ROUTE RIÊNG ────────────────────────────────────────────
 *
 * Trang `/lookup` đang gọi `GET /api/bookings?code=&phone=`, mà route đó bọc
 * `withAuthGuard(..., 'booking.view.own')` ⇒ trả **401** cho khách chưa đăng
 * nhập (đo bằng `curl` không cookie). `app-flows.md §F4` yêu cầu tra cứu không
 * cần đăng nhập — rất hay dùng khi người này đặt hộ người khác (chồng đặt
 * phòng, vợ muốn xem mã đơn). Tính năng đó hiện coi như không tồn tại.
 *
 * ─── VÌ SAO KHÔNG DỰA VÀO RLS ──────────────────────────────────────────────
 *
 * Bảng `bookings` có ĐÚNG MỘT policy SELECT: `customer_id = current_account_id()`.
 * Khách chưa đăng nhập **không có** account id ⇒ hàm đó rỗng ⇒ policy không
 * khớp hàng nào ⇒ luôn trả `[]`, mà HTTP vẫn `200` nên không có lỗi để đọc.
 *
 * Vì vậy route dùng `createAdminClient()` (service role, bỏ qua RLS) và **tự
 * lọc ở tầng ứng dụng** bằng cặp `code` + `phone`. Điều này KHÔNG phải nới
 * lỏng bảo mật — bốn lớp thay thế nằm ngay dưới đây:
 *
 *   ① Bắt buộc **cả hai** tham số, thiếu một cái → 400. Chỉ có `code` thì ai
 *      đoán được mã đơn cũng đọc được thông tin khách.
 *   ② Truy vấn khoá bằng **cả** `code` **và** `guest_phone` đã chuẩn hoá —
 *      không có nhánh nào chỉ lọc theo một trường.
 *   ③ Trả về đi qua `toPublicBooking()` — **liệt kê tường minh** từng field.
 *      Xem khối chú thích của hàm đó về lý do không `return ok(row)`.
 *   ④ Rate limit theo IP bằng store **dùng chung** (Postgres), không phải bộ
 *      đếm in-memory.
 */

/** Ngưỡng chống dò: 10 lượt / 5 phút / IP.
 *
 * Vì sao chặt hơn nhiều so với `/api/availability/search` (60/60s): ở đó dò
 * được cũng chỉ ra giá phòng công khai. Ở đây mỗi lượt là một phép thử một cặp
 * (mã đơn, SĐT) trên dữ liệu khách thật. Người tra thật biết sẵn cả hai giá
 * trị nên gõ 1–2 lần là xong; 10 lượt đã rất rộng rãi cho việc gõ nhầm.
 */
const LOOKUP_RATE_LIMIT = 10
const LOOKUP_RATE_WINDOW_SEC = 300

/**
 * MỘT thông báo dùng chung cho **mọi** trường hợp không tìm thấy.
 *
 * ⚠️ ĐÂY LÀ ĐIỂM QUAN TRỌNG NHẤT CỦA ROUTE NÀY — đừng "cải thiện" thành hai
 * câu riêng cho dễ hiểu.
 *
 * Nếu "sai SĐT" trả câu khác "mã đơn không tồn tại" thì người dò biết ngay mã
 * nào có thật: quét dải mã bằng SĐT rác, mã nào trả "sai số điện thoại" là mã
 * thật ⇒ dò tiếp vào SĐT. Trả cùng một câu thì hai nhánh không phân biệt được
 * từ ngoài, và kẻ dò phải đoán đúng **cả cặp** cùng lúc.
 *
 * Cả hai nhánh dùng CHUNG hằng số này, không phải hai chuỗi giống nhau viết
 * hai chỗ — hai chuỗi rời sớm muộn cũng bị sửa lệch một cái.
 */
const LOOKUP_FAILED_MESSAGE: I18nText = {
    vi: 'Không tìm thấy đơn khớp mã và SĐT đã nhập.',
    en: 'No booking matches the code and phone number entered.',
}

/**
 * Chuẩn hoá SĐT Việt Nam về dạng `0…` để so sánh.
 *
 * Khách gõ `+84 901 234 567`, `0084901234567`, `0901234567`, `090-123-4567`
 * đều là một số. DB lưu dạng người nhập lúc đặt, nên phải chuẩn hoá **cả hai
 * vế** rồi mới so — không phải chỉ chuẩn hoá đầu vào.
 */
function normalizePhone(raw: string): string {
    const digitsOnly = raw.replace(/[^\d+]/g, '')
    if (digitsOnly.startsWith('+84')) return `0${digitsOnly.slice(3)}`
    if (digitsOnly.startsWith('0084')) return `0${digitsOnly.slice(4)}`
    if (digitsOnly.startsWith('84') && digitsOnly.length >= 11) return `0${digitsOnly.slice(2)}`
    return digitsOnly.replace(/^\+/, '')
}

/**
 * Che email: `nguyenvana@gmail.com` → `n***@gmail.com`.
 *
 * Không bao giờ trả email đầy đủ (hợp đồng `PublicBookingGuestDto`). Giữ lại
 * ký tự đầu + domain là đủ để người tra nhận ra "đúng email của mình rồi" mà
 * không đủ để người nhìn trộm màn hình lấy được địa chỉ liên lạc.
 */
function maskEmail(email: string): string {
    const at = email.indexOf('@')
    if (at <= 0) return '***'
    const first = email.slice(0, 1)
    return `${first}***${email.slice(at)}`
}

/** Che SĐT: `0901234567` → `090****567`. Người tra đã biết số thật (phải nhập
 * mới tra được), trả lại đầy đủ chỉ tăng rủi ro nếu màn hình bị nhìn trộm. */
function maskPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7) return '***'
    return `${digits.slice(0, 3)}****${digits.slice(-3)}`
}

/** Hàng thô Supabase — `.select()` chưa gắn generic schema nên giá trị `unknown`. */
type DbRow = Record<string, unknown>

/** Cột `jsonb` song ngữ → `I18nText`, không dùng `any` (C1). */
function toI18nText(value: unknown, fallback: string): I18nText {
    if (value !== null && typeof value === 'object') {
        const obj = value as Record<string, unknown>
        return {
            vi: typeof obj.vi === 'string' ? obj.vi : fallback,
            en: typeof obj.en === 'string' ? obj.en : fallback,
        }
    }
    const text = value != null ? String(value) : fallback
    return { vi: text, en: text }
}

function optionalString(value: unknown): string | undefined {
    return value != null && String(value) !== '' ? String(value) : undefined
}

/**
 * Hàng `bookings` → `PublicBookingDto`, **liệt kê tường minh từng field**.
 *
 * ⚠️ KHÔNG được thay bằng `return ok(row)` hay spread `{...row}`.
 *
 * Nợ `M33` đã ghi nhận đúng lỗi đó ở `/cancel` + `/refund`: hai route
 * `return ok(updatedBooking)` với `updatedBooking` là kết quả RPC
 * `RETURNS public.bookings` ⇒ trả **nguyên 38 cột** ra ngoài, gồm
 * `guest_id_number` (CCCD), `customer_id`, `guest_email` đầy đủ, `guest_tax_code`.
 *
 * Ở route công khai này hậu quả nặng hơn hẳn: không cần đăng nhập gì cả.
 * Danh sách dưới đây là **danh sách trắng** — field không có tên ở đây thì
 * không ra ngoài, kể cả khi ai đó thêm cột mới vào bảng sau này.
 *
 * KHÔNG có và không được thêm: `guest_id_number` · `customer_id` ·
 * `guest_email` nguyên văn · `guest_tax_code` · `guest_company_name` ·
 * `check_in_record` · `check_out_record` · `assigned_room_unit_id` ·
 * `hold_expires_at` · `activity_logs`.
 */
function toPublicBooking(
    row: DbRow,
    roomTypeName: I18nText,
    ratePlanName: I18nText,
): PublicBookingDto {
    const checkIn = String(row.check_in)
    const checkOut = String(row.check_out)
    const status = String(row.status) as BookingStatus

    const guest: PublicBookingGuestDto = {
        fullName: String(row.guest_full_name ?? ''),
        phoneMasked: maskPhone(String(row.guest_phone ?? '')),
        emailMasked: maskEmail(String(row.guest_email ?? '')),
        estimatedArrivalTime: optionalString(row.guest_estimated_arrival_time),
        // Yêu cầu đặc biệt là thứ CHÍNH khách đã gõ vào ("phòng tầng cao",
        // "kỷ niệm ngày cưới") — trả lại để họ kiểm chứng đơn đúng của mình.
        // Khác hẳn ghi chú nội bộ của lễ tân, thứ nằm trong `check_in_record`
        // và KHÔNG có trong danh sách trắng này.
        specialRequests: optionalString(row.guest_special_requests),
    }

    const totalAmount = Number(row.total_amount ?? 0)
    const paidAmount = Number(row.paid_amount ?? 0)

    const dto: PublicBookingDto = {
        id: String(row.id),
        code: String(row.code),
        status,
        // Nhãn song ngữ trả từ server để FE không phải tự map (luật R6/C7).
        statusLabel: STATUS_LABEL[status] ?? { vi: String(row.status), en: String(row.status) },
        checkIn,
        checkOut,
        nights: Number(row.nights ?? 0) || countNights(checkIn, checkOut),
        roomTypeId: String(row.room_type_id),
        roomTypeName,
        ratePlanId: String(row.rate_plan_id ?? ''),
        ratePlanName,
        guests: {
            adults: Number(row.num_adults ?? 1),
            children: Array.isArray(row.child_ages) ? row.child_ages.map(Number) : [],
        },
        guest,
        subtotal: Number(row.subtotal ?? 0),
        discountTotal: Number(row.discount_total ?? 0),
        totalAmount,
        depositAmount: Number(row.deposit_amount ?? 0),
        paidAmount,
        /*
         * Cột sinh trong DB tên là `remaining_amount`, KHÔNG phải `balance_due`.
         * Hợp đồng gọi nó là `balanceDue` — đổi tên ở đúng ranh giới này, và
         * `?? (total - paid)` chỉ là dự phòng cho hàng cũ chưa có cột sinh.
         */
        balanceDue: row.remaining_amount != null
            ? Number(row.remaining_amount)
            : totalAmount - paidAmount,
        priceLines: Array.isArray(row.price_lines) ? (row.price_lines as BookingPriceLine[]) : [],
        appliedPromotions: Array.isArray(row.applied_promotions)
            ? (row.applied_promotions as AppliedPromotion[])
            : [],
        channel: String(row.channel ?? 'web') as Channel,
        createdAt: String(row.created_at ?? ''),
    }

    /*
     * `cancellation` là jsonb `{at, by, reason, refundAmount}`. Chỉ lấy 3 field
     * hợp đồng khai — `reason` là lý do huỷ do lễ tân gõ, thuộc ghi chú nội bộ.
     */
    if (status === 'cancelled' && row.cancellation !== null && typeof row.cancellation === 'object') {
        const c = row.cancellation as Record<string, unknown>
        const cancellation: PublicCancellationDto = {
            at: String(c.at ?? row.cancelled_at ?? ''),
            by: c.by === 'admin' ? 'admin' : 'customer',
            refundAmount: Number(c.refundAmount ?? 0),
        }
        dto.cancellation = cancellation
    }

    return dto
}

/**
 * KHÔNG bọc `withAuthGuard` — đó chính là bug đang sửa. Route công khai có
 * chủ ý; bốn lớp bảo vệ nêu ở khối chú thích đầu file thay cho lớp xác thực.
 */
export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url)
        const rawCode = url.searchParams.get('code')?.trim() ?? ''
        const rawPhone = url.searchParams.get('phone')?.trim() ?? ''

        /*
         * Rate limit chạy TRƯỚC cả validate đầu vào.
         *
         * Đặt sau validate thì người dò gửi request thiếu tham số vô hạn không
         * tốn lượt nào — mà đúng loại request đó mới là thứ dùng để đo tốc độ
         * phản hồi của server (timing) trước khi dò thật.
         */
        const ip = clientIpOf(request)
        const rate = await consumeSharedRateLimit(
            'booking-lookup',
            ip,
            LOOKUP_RATE_LIMIT,
            LOOKUP_RATE_WINDOW_SEC,
        )
        if (!rate.allowed) {
            return fail(
                429,
                'RATE_LIMITED',
                {
                    vi: `Bạn đã tra cứu quá nhiều lần. Thử lại sau ${rate.retryAfterSeconds} giây.`,
                    en: `Too many lookup attempts. Try again in ${rate.retryAfterSeconds} seconds.`,
                },
                { retryAfterSeconds: rate.retryAfterSeconds },
            )
        }

        // ① Bắt buộc CẢ HAI. Thiếu một cái là 400, không phải "tra theo cái còn lại".
        if (!rawCode || !rawPhone) {
            return fail(400, 'VALIDATION_FAILED', {
                vi: 'Nhập cả mã đơn và số điện thoại đã dùng khi đặt phòng.',
                en: 'Enter both the booking code and the phone number used when booking.',
            })
        }

        const phone = normalizePhone(rawPhone)
        if (!phone) {
            return fail(400, 'VALIDATION_FAILED', {
                vi: 'Số điện thoại không hợp lệ.',
                en: 'Phone number is not valid.',
            })
        }

        /*
         * Service role — bỏ qua RLS có chủ ý, lý do ở khối chú thích đầu file.
         * Bù lại, lọc ở tầng ứng dụng phải KHOÁ CẢ HAI trường trong cùng một
         * truy vấn: không có nhánh nào chỉ lọc theo `code`.
         *
         * `ilike` cho `code` vì mã đơn khách chép từ email hay bị đổi hoa
         * thường; `%` KHÔNG được dùng ở đây — `ilike` không có ký tự đại diện
         * là so sánh bằng, không phân biệt hoa thường. Dùng `%` là biến route
         * này thành công cụ liệt kê.
         */
        const supabase = createAdminClient()
        const { data: rows, error } = await supabase
            .from('bookings')
            .select('*')
            .ilike('code', rawCode)
            .limit(20)

        if (error) {
            console.error('[GET /api/bookings/lookup DB error]', error.message)
            return serverError()
        }

        /*
         * So SĐT ở tầng ứng dụng chứ không `.eq('guest_phone', phone)`: DB lưu
         * đúng chuỗi khách gõ lúc đặt (`+84 901…`, `090-123-4567`), nên so
         * bằng trực tiếp trượt với chính số đó viết cách khác. Phải chuẩn hoá
         * **cả hai vế** rồi mới so.
         */
        const matched = (rows ?? []).find(
            (row) => normalizePhone(String((row as DbRow).guest_phone ?? '')) === phone,
        ) as DbRow | undefined

        /*
         * ⚠️ MỘT nhánh 404 duy nhất cho CẢ HAI trường hợp:
         *   - `rows` rỗng  → mã đơn không tồn tại
         *   - `matched` rỗng → mã đơn có thật nhưng SĐT sai
         *
         * Gộp làm một là CỐ Ý. Tách thành hai câu là lộ mã đơn nào có thật.
         * Xem khối chú thích của `LOOKUP_FAILED_MESSAGE`.
         */
        if (!matched) {
            return fail(404, 'LOOKUP_FAILED', LOOKUP_FAILED_MESSAGE)
        }

        // Tên hạng phòng / gói giá: chỉ lấy `name`, không kéo cả bản ghi.
        const [roomTypeResult, ratePlanResult] = await Promise.all([
            supabase.from('room_types').select('name').eq('id', String(matched.room_type_id)).maybeSingle(),
            supabase.from('rate_plans').select('name').eq('id', String(matched.rate_plan_id)).maybeSingle(),
        ])

        const roomTypeName = toI18nText(
            (roomTypeResult.data as DbRow | null)?.name,
            String(matched.room_type_id),
        )
        const ratePlanName = toI18nText(
            (ratePlanResult.data as DbRow | null)?.name,
            String(matched.rate_plan_id ?? ''),
        )

        // ② Trả ĐÚNG MỘT đơn, bọc trong object — không phải mảng.
        //    Trả mảng là mở cửa liệt kê, và FE sẽ có chỗ để hiện "n kết quả".
        return ok({ booking: toPublicBooking(matched, roomTypeName, ratePlanName) })
    } catch (err: unknown) {
        console.error(
            '[GET /api/bookings/lookup error]',
            err instanceof Error ? err.message : err,
        )
        return serverError()
    }
}
