import { createAdminClient } from '@/utils/supabase/admin'
import type { Actor } from '@/lib/auth/guard'

export interface RecordPaymentInput {
    bookingId: string
    amount: number
    /**
     * Phải khớp CHECK constraint `chk_payments_method` của bảng `payments`:
     * `bank-transfer | card | at-property | momo` — GẠCH NGANG, không gạch dưới.
     *
     * BUG ĐÃ SỬA: bản trước khai `bank_transfer | cash | vnpay` (gạch dưới, và
     * hai giá trị DB không biết). TypeScript không kiểm được ràng buộc nằm
     * trong Postgres nên build vẫn xanh; lỗi chỉ nổ lúc chạy thật bằng
     * `23514 violates check constraint` — tức MỌI lần duyệt cọc đều trả 500.
     * Sửa TS cho bám DB, không nới constraint (luật BE8).
     */
    paymentMethod: 'bank-transfer' | 'card' | 'at-property' | 'momo'
    reference?: string
    /** Khớp `chk_payments_kind`: `deposit | balance | refund | surcharge`. */
    kind?: 'deposit' | 'balance' | 'surcharge' | 'refund'
    /** Payload thô ghi kèm giao dịch (log đối soát) — hình dạng tuỳ cổng, không ép type domain. */
    rawPayload?: Record<string, unknown>
}

/**
 * Common payment recording logic (Ticket 200-04 / 300-01).
 *
 * `300-01` will verify HMAC signature for live webhooks and then call this exact function.
 */
export async function recordPayment(input: RecordPaymentInput, actor: Actor) {
    const isSimulated = process.env.PAYMENT_MODE !== 'live'
    const reference = input.reference || (isSimulated
        ? `SIM-${input.bookingId.slice(0, 8).toUpperCase()}-${Date.now()}`
        : `PAY-${input.bookingId.slice(0, 8).toUpperCase()}-${Date.now()}`)

    const adminSupabase = createAdminClient()

    const { data: updatedBooking, error } = await adminSupabase.rpc('confirm_booking_payment', {
        p_booking_id: input.bookingId,
        p_amount: input.amount,
        p_payment_method: input.paymentMethod,
        p_reference: reference,
        p_kind: input.kind || 'deposit',
        p_actor_id: actor.id,
        p_actor_name: actor.fullName,
        p_actor_role: actor.role,
        p_raw_payload: input.rawPayload || { mode: isSimulated ? 'simulated' : 'live' },
    })

    if (error) {
        console.error('[recordPayment RPC error]', error)
        throw error
    }

    return updatedBooking
}
