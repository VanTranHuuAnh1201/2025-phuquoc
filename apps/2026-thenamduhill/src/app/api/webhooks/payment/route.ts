import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { resolveGateway } from '@/lib/payment/gateways'
import { createAdminClient } from '@/utils/supabase/admin'

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
        return NextResponse.json(
            { success: false, error: 'WEBHOOK_SECRET_MISSING', message: 'Payment webhook secret not configured' },
            { status: 500 }
        )
    }

    const gateway = resolveGateway()
    const signature = gateway.extractSignature(req, rawBody)

    if (!signature) {
        console.warn('[webhook/payment] Rejected: Missing signature header or field.')
        return NextResponse.json(
            { success: false, error: 'UNAUTHENTICATED', message: 'Signature missing' },
            { status: 401 }
        )
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
            return NextResponse.json(
                { success: false, error: 'UNAUTHENTICATED', message: 'Invalid HMAC signature' },
                { status: 401 }
            )
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.warn('[webhook/payment] Rejected: Exception during HMAC validation:', message)
        return NextResponse.json(
            { success: false, error: 'UNAUTHENTICATED', message: 'HMAC verification failed' },
            { status: 401 }
        )
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
        return NextResponse.json({ success: true, message: 'Already processed' }, { status: 200 })
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
        return NextResponse.json({ success: true, message: 'Booking not found; logged for manual reconciliation' }, { status: 200 })
    }

    // 6. Record Payment & Update Status
    const newPaidAmount = (booking.paid_amount || 0) + event.amount
    const isFullyPaid = newPaidAmount >= booking.total_amount
    const newStatus = isFullyPaid ? 'confirmed' : booking.status

    const { error: payErr } = await supabase.from('payments').insert({
        booking_id: booking.id,
        amount: event.amount,
        payment_method: 'bank_transfer',
        status: 'completed',
        reference: reference,
        raw_payload: { mode: 'live', gateway: gateway.name, event }
    })

    if (payErr) {
        console.error('[webhook/payment] Failed to insert payment record:', payErr.message)
        return NextResponse.json({ success: false, error: 'DATABASE_ERROR' }, { status: 500 })
    }

    // Update booking state
    await supabase.from('bookings').update({
        paid_amount: newPaidAmount,
        status: newStatus,
        hold_expires_at: null,
        updated_at: new Date().toISOString()
    }).eq('id', booking.id)

    // Insert Activity Log
    await supabase.from('activity_logs').insert({
        booking_id: booking.id,
        actor_name: 'Hệ thống (webhook thanh toán)',
        actor_role: 'system',
        action: 'status-changed',
        details: {
            previousStatus: booking.status,
            newStatus,
            amountPaid: event.amount,
            gatewayReference: reference
        }
    })

    return NextResponse.json({
        success: true,
        data: {
            reference,
            bookingCode: booking.code,
            status: newStatus,
            paidAmount: newPaidAmount
        }
    }, { status: 200 })
}
