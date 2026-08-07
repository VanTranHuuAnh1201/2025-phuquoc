import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function verifyCronAuth(request: Request): boolean {
    const isVercelCron = request.headers.get('x-vercel-cron') !== null
    if (isVercelCron) return true

    const authHeader = request.headers.get('authorization')
    const secret = process.env.CRON_SECRET || 'demo_cron_secret_2026'

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false
    }

    const token = authHeader.substring(7).trim()

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest()
        const secretHash = crypto.createHash('sha256').update(secret).digest()
        return crypto.timingSafeEqual(tokenHash, secretHash)
    } catch {
        return false
    }
}

export async function POST(request: Request) {
    if (!verifyCronAuth(request)) {
        return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Cron secret unauthorized' } },
            { status: 401 }
        )
    }

    const startTime = Date.now()
    const adminSupabase = createAdminClient()

    const nowIso = new Date().toISOString()
    const { data: expiredBookings, error: selectError } = await adminSupabase
        .from('bookings')
        .select('id, code, room_type_id, check_in_date, check_out_date, room_unit_id')
        .eq('status', 'pending_payment')
        .not('hold_expires_at', 'is', null)
        .lt('hold_expires_at', nowIso)
        .limit(200)

    if (selectError) {
        console.error('[cron/release-holds] Error selecting expired bookings:', selectError)
        return NextResponse.json(
            { success: false, error: { code: 'DB_ERROR', message: selectError.message } },
            { status: 500 }
        )
    }

    const processedCodes: string[] = []
    const failedIds: string[] = []

    for (const booking of expiredBookings || []) {
        try {
            const { data: updated, error: updateError } = await adminSupabase
                .from('bookings')
                .update({
                    status: 'expired',
                    cancel_reason: 'Quá hạn giữ chỗ 15 phút (Cron system auto release)',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', booking.id)
                .eq('status', 'pending_payment')
                .select('id')

            if (updateError || !updated || updated.length === 0) {
                continue
            }

            await adminSupabase.from('activity_logs').insert({
                booking_id: booking.id,
                action: 'status-changed',
                actor_id: 'SYSTEM_CRON',
                actor_name: 'Hệ thống (tự động)',
                actor_role: 'owner',
                note: 'Quá hạn giữ chỗ 15 phút, hệ thống tự nhả phòng.',
                created_at: new Date().toISOString(),
            })

            processedCodes.push(booking.code)

            if (booking.room_unit_id) {
                await adminSupabase
                    .from('room_units')
                    .update({ status: 'available' })
                    .eq('id', booking.room_unit_id)
            }
        } catch (err) {
            console.error(`[cron/release-holds] Failed to release booking ${booking.id}:`, err)
            failedIds.push(booking.id)
        }
    }

    const durationMs = Date.now() - startTime

    return NextResponse.json({
        success: true,
        data: {
            task: 'release-holds',
            startedAt: new Date(startTime).toISOString(),
            durationMs,
            processed: processedCodes.length,
            failed: failedIds.length,
            codes: processedCodes,
            failedIds,
        },
        error: null,
    })
}

export async function GET(request: Request) {
    return POST(request)
}
