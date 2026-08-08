import { createHmac, timingSafeEqual } from 'node:crypto'
import { resolveGateway } from '@/lib/payment/gateways'
import { createAdminClient } from '@/utils/supabase/admin'
import { fail, ok } from '@/lib/auth/errors'

export const runtime = 'nodejs'

/**
 * Live Payment Webhook Endpoint (Ticket 300-01)
 * 
 * NOTE ON SECURITY: This endpoint is unauthenticated via session cookies
 * because requests originate from payment gateway servers (PayOS / VietQR).
 * Security and authentication are strictly enforced via HMAC-SHA256 signature verification.
 */
export async function POST(req: Request) {
    const rawBody = await req.text()

    // 1. Secret Verification Check
    const secret = process.env.PAYMENT_WEBHOOK_SECRET
    if (!secret) {
        console.error('[webhook/payment] PAYMENT_WEBHOOK_SECRET is not configured on server.')
        return fail(500, 'WEBHOOK_SECRET_MISSING', {
            vi: 'Chưa cấu hình khoá bí mật webhook thanh toán.',
            en: 'Payment webhook secret is not configured.',
        })
    }

    const gateway = resolveGateway()
    const signature = gateway.extractSignature(req, rawBody)

    if (!signature) {
        console.warn('[webhook/payment] Rejected: Missing signature header or field.')
        return fail(401, 'UNAUTHENTICATED', {
            vi: 'Thiếu chữ ký webhook.',
            en: 'Webhook signature is missing.',
        })
    }

    // 2. HMAC-SHA256 Timing-Safe Signature Verification
    try {
        const signingPayload = gateway.signingPayload(rawBody)
        const expectedBuffer = createHmac('sha256', secret).update(signingPayload, 'utf8').digest()
        const receivedBuffer = Buffer.from(signature, 'hex')

        const isLengthValid = receivedBuffer.length === expectedBuffer.length
        const isSignatureMatch = isLengthValid && timingSafeEqual(receivedBuffer, expectedBuffer)

        if (!isSignatureMatch) {
            console.warn('[webhook/payment] Rejected: HMAC signature mismatch.')
            return fail(401, 'UNAUTHENTICATED', {
                vi: 'Chữ ký webhook không hợp lệ.',
                en: 'Invalid webhook signature.',
            })
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.warn('[webhook/payment] Rejected: Exception during HMAC validation:', message)
        return fail(401, 'UNAUTHENTICATED', {
            vi: 'Không xác minh được chữ ký webhook.',
            en: 'Webhook signature verification failed.',
        })
    }

    // 3. Parse Event Payload
    const event = gateway.parse(rawBody)
    const reference = `${gateway.name.toUpperCase()}-${event.gatewayTxnId}`

    console.log(`[webhook/payment] Received valid webhook for reference: ${reference}, amount: ${event.amount}`)

    const supabase = createAdminClient()

    // 4. Idempotency Check
    const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('reference', reference)
        .maybeSingle()

    if (existingPayment) {
        console.log(`[webhook/payment] Idempotent hit: Reference ${reference} already processed. Returning 200.`)
        return ok({ reference, alreadyProcessed: true })
    }

    // 5. Locate Booking
    const bookingCode = event.bookingCode.trim()
    const { data: booking } = await supabase
        .from('bookings')
        .select('id, code, status, total_amount, paid_amount')
        .or(`code.eq.${bookingCode},id.eq.${bookingCode}`)
        .maybeSingle()

    if (!booking) {
        console.warn(`[webhook/payment] Warning: Booking not found for code '${bookingCode}'. Returning 200 for reconciliation.`)
        // Trả 200 là CHỦ Ý: gateway coi non-2xx là thất bại và gửi lại mãi.
        return ok({ reference, bookingFound: false })
    }

    // 6. Record Payment & Update Status
    const newPaidAmount = (booking.paid_amount || 0) + event.amount
    const isFullyPaid = newPaidAmount >= booking.total_amount
    const newStatus = isFullyPaid ? 'confirmed' : booking.status

    /*
     * Cột thật của `payments`: `method` + `kind` — KHÔNG có `payment_method`,
     * cũng KHÔNG có `status` (đối chiếu `information_schema.columns`). Bản
     * trước dùng hai tên không tồn tại ⇒ mọi webhook thật sẽ 500 ngay lần đầu
     * nối cổng. `kind` phải thuộc `chk_payments_kind`: đã trả đủ ⇒ 'balance',
     * chưa đủ ⇒ 'deposit'.
     */
    const { error: payErr } = await supabase.from('payments').insert({
        booking_id: booking.id,
        amount: event.amount,
        method: 'bank-transfer',
        kind: isFullyPaid ? 'balance' : 'deposit',
        reference: reference,
        raw_payload: { mode: 'live', gateway: gateway.name, event }
    })

    if (payErr) {
        console.error('[webhook/payment] Failed to insert payment record:', payErr.message)
        return fail(500, 'DATABASE_ERROR', {
            vi: 'Không ghi được giao dịch thanh toán.',
            en: 'Could not record the payment transaction.',
        })
    }

    // Update booking state
    await supabase.from('bookings').update({
        paid_amount: newPaidAmount,
        status: newStatus,
        hold_expires_at: null,
        updated_at: new Date().toISOString()
    }).eq('id', booking.id)

    /*
     * Ba lỗi của bản trước, cùng họ với bug cột ở cron (900-03):
     *   ① `actor_role: 'system'` vi phạm `chk_logs_role` (chỉ nhận 5 vai trò)
     *      ⇒ dòng log bị TỪ CHỐI im lặng vì route không đọc lỗi insert.
     *      Thống nhất dùng 'owner' như hai cron.
     *   ② `details` KHÔNG phải cột của `activity_logs` — dùng `new_data`/`old_data`.
     *   ③ `actor_id` là NOT NULL, bản trước bỏ trống.
     */
    const { error: logError } = await supabase.from('activity_logs').insert({
        booking_id: booking.id,
        actor_id: 'SYSTEM_WEBHOOK',
        actor_name: 'Hệ thống (webhook thanh toán)',
        actor_role: 'owner',
        action: 'payment-recorded',
        field: 'status',
        from: booking.status,
        to: newStatus,
        old_data: { status: booking.status, paidAmount: booking.paid_amount },
        new_data: { status: newStatus, paidAmount: newPaidAmount, reference },
        note: `Ghi nhận thanh toán ${event.amount} qua ${gateway.name}.`,
    })
    if (logError) {
        // C3: không nuốt lỗi — mất log là mất dấu vết đối soát tiền.
        console.error('[webhook/payment] Ghi activity_logs thất bại:', logError.message)
    }

    return ok({
        reference,
        bookingCode: booking.code,
        status: newStatus,
        paidAmount: newPaidAmount,
    })
}
