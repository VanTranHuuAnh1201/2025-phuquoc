import { cookies } from 'next/headers'
import { buildQuote } from '@repo/core'
import type { Addon, Channel, Inventory, Promotion, RatePlan, Season } from '@repo/core'
import { HOLD_MINUTES } from '@/lib/booking/constants'
import { type Actor, withAuthGuard } from '@/lib/auth/guard'
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
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

async function postBookingHandler(request: Request, actor: Actor): Promise<Response> {
    try {
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
            guest,
        } = body ?? {}

        // Validate basic inputs
        if (!roomTypeId || typeof roomTypeId !== 'string') {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng cung cấp mã hạng phòng.',
                en: 'Room type ID is required.',
            })
        }

        if (!guest || !guest.fullName || !guest.phone || !guest.email) {
            return fail(400, 'INVALID_INPUT', {
                vi: 'Vui lòng điền đầy đủ thông tin khách hàng (họ tên, số điện thoại, email).',
                en: 'Please provide required guest details (full name, phone, email).',
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

        const ciDate = new Date(`${checkIn}T00:00:00Z`)
        const coDate = new Date(`${checkOut}T00:00:00Z`)
        const diffNights = Math.round((coDate.getTime() - ciDate.getTime()) / (1000 * 3600 * 24))
        if (diffNights > 30) {
            return fail(400, 'STAY_TOO_LONG', {
                vi: 'Thời gian lưu trú tối đa là 30 đêm.',
                en: 'Maximum stay duration is 30 nights.',
            })
        }

        // Determine channel & customer ID
        const channel: Channel = actor.role === 'customer'
            ? 'web'
            : (rawChannel === 'phone' || rawChannel === 'walk-in' || rawChannel === 'ota' ? rawChannel : 'web')

        let customerId: string | null = actor.role === 'customer' ? actor.id : null

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const adminSupabase = createAdminClient()

        // If staff creating for a guest, check if an account exists for guest phone
        if (actor.role !== 'customer' && guest.phone) {
            const { data: acc } = await adminSupabase
                .from('accounts')
                .select('id')
                .eq('phone', String(guest.phone).trim())
                .maybeSingle()
            if (acc) {
                customerId = acc.id
            }
        }

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

        // Fetch Inventory
        const { data: invRows } = await supabase
            .from('inventory')
            .select('*')
            .eq('room_type_id', roomTypeId)
            .gte('date', checkIn)
            .lte('date', checkOut)

        const inventoryMap: Record<string, Inventory> = {}
        if (invRows) {
            for (const r of invRows) {
                const inv = mapInventoryRow(r)
                inventoryMap[`${inv.roomTypeId}|${inv.date}`] = inv
            }
        }

        // Fetch Seasons
        const { data: seasonRows } = await supabase.from('seasons').select('*')
        const seasons: Season[] = (seasonRows ?? []).map(mapSeasonRow)

        // Fetch Rate Plan
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

        // Fetch Addons
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

        const adults = Number(guests?.adults ?? 1)
        const children = Array.isArray(guests?.children) ? guests.children.map((c: any) => Number(c)) : []
        const addonsInput: Record<string, number> = typeof rawAddons === 'object' && rawAddons !== null ? rawAddons : {}
        const today = new Date().toISOString().slice(0, 10)

        // Build pure quote in server
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

        if (!quote.availability.available) {
            if (quote.availability.blockedReason === 'sold-out') {
                return fail(409, 'SOLD_OUT', {
                    vi: 'Phòng vừa được khách khác đặt. Chọn ngày khác hoặc hạng phòng khác.',
                    en: 'This room was just booked by someone else. Try other dates or another room type.',
                })
            }
            if (quote.availability.blockedReason === 'min-nights') {
                return fail(400, 'MIN_NIGHTS_VIOLATION', {
                    vi: `Hạng phòng này yêu cầu lưu trú tối thiểu ${quote.availability.requiredMinNights} đêm.`,
                    en: `This room type requires a minimum stay of ${quote.availability.requiredMinNights} nights.`,
                })
            }
            if (quote.availability.blockedReason === 'closed-to-arrival') {
                return fail(400, 'CLOSED_TO_ARRIVAL', {
                    vi: 'Hạng phòng không nhận khách vào ngày đã chọn.',
                    en: 'Check-in is closed on the selected date.',
                })
            }
            if (quote.availability.blockedReason === 'capacity-exceeded') {
                return fail(400, 'CAPACITY_EXCEEDED', {
                    vi: 'Số lượng khách vượt quá sức chứa tối đa của phòng.',
                    en: 'Number of guests exceeds room capacity.',
                })
            }
        }

        // Build payload for RPC execution
        const payload = {
            room_type_id: roomTypeId,
            rate_plan_id: ratePlanId || (ratePlan ? ratePlan.id : 'standard'),
            check_in: checkIn,
            check_out: checkOut,
            num_adults: adults,
            child_ages: children,
            addons: addonsInput,
            guest_full_name: String(guest.fullName).trim(),
            guest_phone: String(guest.phone).trim(),
            guest_email: String(guest.email).trim(),
            guest_id_number: guest.idNumber ? String(guest.idNumber).trim() : null,
            guest_estimated_arrival_time: guest.estimatedArrivalTime ? String(guest.estimatedArrivalTime).trim() : null,
            guest_special_requests: guest.specialRequests ? String(guest.specialRequests).trim() : null,
            guest_tax_code: guest.taxCode ? String(guest.taxCode).trim() : null,
            guest_company_name: guest.companyName ? String(guest.companyName).trim() : null,
            customer_id: customerId,
            channel: channel,
            actor_id: actor.id,
            actor_name: actor.fullName,
            actor_role: actor.role,
            subtotal: quote.subtotal,
            discount_total: quote.discountTotal,
            total_amount: quote.totalAmount,
            deposit_amount: quote.depositAmount,
            price_lines: quote.lines,
            applied_promotions: quote.promotion.applied,
            hold_minutes: HOLD_MINUTES,
        }

        const { data: createdBooking, error: rpcError } = await adminSupabase.rpc('create_booking_atomic', {
            p_payload: payload,
        })

        if (rpcError) {
            console.error('[create_booking_atomic RPC error]', rpcError)
            if (rpcError.message?.includes('SOLD_OUT') || rpcError.code === 'P0001' || rpcError.code === '23514') {
                return fail(409, 'SOLD_OUT', {
                    vi: 'Phòng vừa được khách khác đặt. Chọn ngày khác hoặc hạng phòng khác.',
                    en: 'This room was just booked by someone else. Try other dates or another room type.',
                })
            }
            return serverError()
        }

        return ok(createdBooking, 201)
    } catch (err: any) {
        console.error('[create booking API error]', err)
        return serverError()
    }
}

export const POST = withAuthGuard(postBookingHandler, 'booking.create')
