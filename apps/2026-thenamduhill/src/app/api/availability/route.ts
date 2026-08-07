import { cookies } from 'next/headers'
import { buildQuote } from '@repo/core'
import type { Addon, Channel, Inventory, Promotion, RatePlan, Season } from '@repo/core'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { formatPromotionReason } from '@/lib/api/promotion-messages'
import { fail, ok, serverError } from '@/lib/auth/errors'
import {
    mapAddonRow,
    mapChildPolicy,
    mapInventoryRow,
    mapPromotionRow,
    mapRatePlanRow,
    mapRoomTypeRow,
    mapSeasonRow,
} from '@/lib/db/mappers'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
        const rateCheck = checkRateLimit(ip, 60, 60_000)
        if (!rateCheck.allowed) {
            return fail(429, 'RATE_LIMITED', {
                vi: 'Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.',
                en: 'Too many requests. Please try again shortly.',
            })
        }

        let body: any
        try {
            body = await request.json()
        } catch {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Dữ liệu đầu vào không hợp lệ.',
                en: 'Invalid JSON request payload.',
            })
        }

        const {
            roomTypeId,
            checkIn,
            checkOut,
            guests,
            ratePlanId,
            addons: rawAddons,
            promoCode,
            channel: rawChannel,
        } = body ?? {}

        // Validate basic inputs
        if (!roomTypeId || typeof roomTypeId !== 'string') {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng cung cấp mã hạng phòng.',
                en: 'Room type ID is required.',
            })
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!checkIn || !dateRegex.test(checkIn) || !checkOut || !dateRegex.test(checkOut)) {
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

        // Night count check
        const ciDate = new Date(`${checkIn}T00:00:00Z`)
        const coDate = new Date(`${checkOut}T00:00:00Z`)
        const diffNights = Math.round((coDate.getTime() - ciDate.getTime()) / (1000 * 3600 * 24))
        if (diffNights > 30) {
            return fail(400, 'STAY_TOO_LONG', {
                vi: 'Thời gian lưu trú tối đa là 30 đêm.',
                en: 'Maximum stay duration is 30 nights.',
            })
        }

        const adults = Number(guests?.adults ?? 1)
        const children = Array.isArray(guests?.children)
            ? guests.children.map((c: any) => Number(c))
            : []
        const channel: Channel = rawChannel === 'phone' || rawChannel === 'walk-in' || rawChannel === 'ota' ? rawChannel : 'web'
        const addonsInput: Record<string, number> = typeof rawAddons === 'object' && rawAddons !== null ? rawAddons : {}

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // Fetch Room Type
        const { data: roomRow, error: roomError } = await supabase
            .from('room_types')
            .select('*')
            .eq('id', roomTypeId)
            .eq('active', true)
            .maybeSingle()

        if (roomError || !roomRow) {
            return fail(404, 'ROOM_TYPE_NOT_FOUND', {
                vi: 'Không tìm thấy hạng phòng hoặc hạng phòng tạm ngưng phục vụ.',
                en: 'Room type not found or currently inactive.',
            })
        }

        const { room, roomExtra } = mapRoomTypeRow(roomRow)

        // Fetch Inventory (gte checkIn, lte checkOut)
        const { data: invRows } = await supabase
            .from('inventory')
            .select('*')
            .eq('room_type_id', roomTypeId)
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

        // Fetch Rate Plans
        let ratePlan: RatePlan | undefined = undefined
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

        // Fetch Addons Catalog
        const { data: addonRows } = await supabase.from('addons').select('*').eq('active', true)
        const addonCatalog: Addon[] = (addonRows ?? []).map(mapAddonRow)

        // Fetch Active Promotions
        const { data: promoRows } = await supabase.from('promotions').select('*').eq('active', true)
        const promotions: Promotion[] = (promoRows ?? []).map(mapPromotionRow)

        // Fetch Child Policy
        const { data: settingRow } = await supabase
            .from('property_settings')
            .select('*')
            .eq('key', 'child_policy')
            .maybeSingle()
        const childPolicy = mapChildPolicy(settingRow?.value ?? settingRow)

        const today = new Date().toISOString().slice(0, 10)

        // Build Quote using Core pure logic
        const quote = buildQuote({
            room,
            roomExtra,
            checkIn,
            checkOut,
            guests: { adults, children },
            seasons,
            inventory: inventoryMap,
            ratePlan,
            addons: addonsInput,
            addonCatalog,
            childPolicy,
            promotions,
            channel,
            today,
            enteredCode: typeof promoCode === 'string' ? promoCode.trim() : undefined,
        })

        if (quote.availability.blockedReason === 'sold-out') {
            return fail(409, 'SOLD_OUT', {
                vi: 'Rất tiếc, phòng đã được đặt hết trong khoảng thời gian này.',
                en: 'Sorry, this room is sold out for the selected dates.',
            })
        }

        // Format evaluation messages
        const promotionMessages = quote.promotion.evaluations.map((ev) => ({
            promotionId: ev.promotion.id,
            reason: ev.reason!,
            message: ev.reason ? formatPromotionReason(ev.reason) : { vi: '', en: '' },
        })).filter((m) => m.reason !== undefined)

        return ok({
            ...quote,
            promotionMessages,
        })
    } catch (err: any) {
        console.error('[availability API error]', err)
        return serverError()
    }
}
