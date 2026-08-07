import { cookies } from 'next/headers'
import { checkAvailability } from '@repo/core'
import type { Inventory, Season } from '@repo/core'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { fail, ok, serverError } from '@/lib/auth/errors'
import {
    mapInventoryRow,
    mapRatePlanRow,
    mapRoomTypeRow,
    mapSeasonRow,
} from '@/lib/db/mappers'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Payload thô gửi lên từ client — mọi field `unknown` vì `request.json()`
 * không tự ép kiểu; validate bên dưới thu hẹp trước khi dùng (luật C1).
 */
interface AvailabilitySearchRequestBody {
    checkIn?: unknown
    checkOut?: unknown
    guests?: { adults?: unknown; children?: unknown }
    ratePlanId?: unknown
}

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
        const rateCheck = checkRateLimit(ip, 60, 60_000)
        if (!rateCheck.allowed) {
            return fail(429, 'RATE_LIMITED', {
                vi: 'Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.',
                en: 'Too many requests. Please try again shortly.',
            })
        }

        let body: AvailabilitySearchRequestBody
        try {
            body = await request.json()
        } catch {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Dữ liệu đầu vào không hợp lệ.',
                en: 'Invalid JSON request payload.',
            })
        }

        const { checkIn, checkOut, guests, ratePlanId } = body ?? {}

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (
            typeof checkIn !== 'string' || !dateRegex.test(checkIn) ||
            typeof checkOut !== 'string' || !dateRegex.test(checkOut)
        ) {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Ngày nhận/trả phòng không đúng định dạng YYYY-MM-DD.',
                en: 'Check-in and check-out dates must be in YYYY-MM-DD format.',
            })
        }

        if (checkOut <= checkIn) {
            return fail(400, 'INVALID_DATE_RANGE', {
                vi: 'Ngày trả phòng phải sau ngày nhận phòng.',
                en: 'Check-out date must be after check-in date.',
            })
        }

        const adults = Number(guests?.adults ?? 1)
        const children = Array.isArray(guests?.children)
            ? guests.children.map((c: unknown) => Number(c))
            : []

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // Fetch All Active Room Types
        const { data: roomRows, error: roomError } = await supabase
            .from('room_types')
            .select('*')
            .eq('active', true)

        if (roomError || !roomRows || roomRows.length === 0) {
            return ok({ rooms: [] })
        }

        // Fetch All Inventory for the date range
        const { data: invRows } = await supabase
            .from('inventory')
            .select('*')
            .gte('date', checkIn)
            .lte('date', checkOut)

        const inventoryMap: Record<string, Inventory> = {}
        if (invRows) {
            for (const row of invRows) {
                const inv = mapInventoryRow(row)
                inventoryMap[`${inv.roomTypeId}|${inv.date}`] = inv
            }
        }

        // Fetch Seasons
        const { data: seasonRows } = await supabase.from('seasons').select('*')
        const seasons: Season[] = (seasonRows ?? []).map(mapSeasonRow)

        // Fetch Rate Plan if provided
        let ratePlan = undefined
        if (ratePlanId) {
            const { data: planRow } = await supabase
                .from('rate_plans')
                .select('*')
                .eq('id', ratePlanId)
                .eq('active', true)
                .maybeSingle()
            if (planRow) {
                ratePlan = mapRatePlanRow(planRow)
            }
        }

        const searchResults = roomRows.map((row) => {
            const { room, roomExtra } = mapRoomTypeRow(row)
            const avail = checkAvailability({
                room,
                roomExtra,
                checkIn,
                checkOut,
                guests: { adults, children },
                seasons,
                inventory: inventoryMap,
                ratePlan,
            })
            return {
                room,
                availability: avail,
            }
        })

        return ok({ rooms: searchResults })
    } catch (err: unknown) {
        console.error('[availability search API error]', err)
        return serverError()
    }
}
