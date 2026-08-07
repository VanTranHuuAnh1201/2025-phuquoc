import type {
    Addon,
    ChildPolicy,
    Inventory,
    Promotion,
    RatePlan,
    Room,
    RoomExtra,
    Season,
} from '@repo/core'

/**
 * Maps a row from `room_types` table to Room and optional RoomExtra.
 */
export function mapRoomTypeRow(row: Record<string, any>): { room: Room; roomExtra?: RoomExtra } {
    const basePrice = Number(row.base_price ?? row.price ?? 0)

    const room: Room = {
        id: row.id,
        name: typeof row.name === 'object' ? row.name : { vi: String(row.name ?? ''), en: String(row.name ?? '') },
        desc: typeof row.description === 'object' ? row.description : { vi: String(row.description ?? ''), en: String(row.description ?? '') },
        price: basePrice,
        guests: Number(row.max_occupancy ?? row.capacity ?? row.guests ?? 2),
        area: String(row.area_sqm ? `${row.area_sqm} m²` : (row.size ? `${row.size} m²` : '30 m²')),
        tags: Array.isArray(row.tags) ? row.tags : [],
        images: Array.isArray(row.images) ? row.images : [],
    }

    let roomExtra: RoomExtra | undefined = undefined
    if (row.extra_bed_price != null || row.max_extra_beds != null || row.max_occupancy != null) {
        roomExtra = {
            maxGuests: Number(row.max_occupancy ?? 4),
            defaultGuests: Number(row.capacity ?? row.guests ?? 2),
            extraBed: Number(row.extra_bed_price ?? 200000),
            bed: typeof row.bed_type === 'object' ? row.bed_type : { vi: String(row.bed_type ?? '1 giường đôi'), en: String(row.bed_type ?? '1 Double Bed') },
            view: typeof row.view === 'object' ? row.view : { vi: String(row.view ?? 'Hướng biển'), en: String(row.view ?? 'Sea View') },
            long: typeof row.description === 'object' ? row.description : { vi: String(row.description ?? ''), en: String(row.description ?? '') },
            amenities: Array.isArray(row.amenities) ? row.amenities : [],
            conditions: [],
        }
    }

    return { room, roomExtra }
}

/**
 * Maps a row from `inventory` table to Core Inventory type.
 */
export function mapInventoryRow(row: Record<string, any>): Inventory {
    const rawDate = String(row.date ?? '')
    const dateStr = rawDate.includes('T') ? rawDate.split('T')[0]! : rawDate

    return {
        roomTypeId: String(row.room_type_id),
        date: dateStr,
        totalUnits: Number(row.total_units ?? 0),
        bookedUnits: Number(row.booked_units ?? 0),
        blockedUnits: Number(row.blocked_units ?? 0),
        priceOverride: row.price_override != null ? Number(row.price_override) : undefined,
        minNights: row.min_stay != null ? Number(row.min_stay) : (row.min_nights != null ? Number(row.min_nights) : undefined),
        closedToArrival: Boolean(row.closed_to_arrival ?? false),
        closedToDeparture: Boolean(row.closed_to_departure ?? false),
        version: Number(row.version ?? 1),
    }
}

/**
 * Maps a row from `seasons` table to Core Season type.
 */
export function mapSeasonRow(row: Record<string, any>): Season {
    return {
        id: String(row.id),
        name: typeof row.name === 'object' ? row.name : { vi: String(row.name ?? ''), en: String(row.name ?? '') },
        from: String(row.date_from ?? row.from ?? ''),
        to: String(row.date_to ?? row.to ?? ''),
        multiplier: Number(row.multiplier ?? 1),
        weekendMultiplier: row.weekend_multiplier != null ? Number(row.weekend_multiplier) : undefined,
        priority: Number(row.priority ?? 1),
    }
}

/**
 * Maps a row from `rate_plans` table to Core RatePlan type.
 */
export function mapRatePlanRow(row: Record<string, any>): RatePlan {
    return {
        id: String(row.id),
        name: typeof row.name === 'object' ? row.name : { vi: String(row.name ?? ''), en: String(row.name ?? '') },
        description: typeof row.description === 'object' ? row.description : { vi: String(row.description ?? ''), en: String(row.description ?? '') },
        adjustPercent: Number(row.adjust_percent ?? 0),
        includesBreakfast: Boolean(row.includes_breakfast ?? true),
        refundable: Boolean(row.refundable ?? true),
        depositPercent: row.deposit_percent != null ? Number(row.deposit_percent) : 100,
        cancellationRules: Array.isArray(row.cancellation_rules) ? row.cancellation_rules : [],
        roomTypeIds: Array.isArray(row.room_type_ids) ? row.room_type_ids : [],
        active: Boolean(row.active ?? true),
    }
}

/**
 * Maps a row from `addons` table to Core Addon type.
 */
export function mapAddonRow(row: Record<string, any>): Addon {
    return {
        id: String(row.id),
        name: typeof row.name === 'object' ? row.name : (typeof row.title === 'object' ? row.title : { vi: String(row.name ?? row.title ?? ''), en: String(row.name ?? row.title ?? '') }),
        price: Number(row.price ?? 0),
        unit: typeof row.unit === 'object' ? row.unit : { vi: String(row.unit ?? ''), en: String(row.unit ?? '') },
    }
}

/**
 * Maps a row from `promotions` table to Core Promotion type.
 */
export function mapPromotionRow(row: Record<string, any>): Promotion {
    return {
        id: String(row.id),
        code: row.code ? String(row.code) : undefined,
        name: typeof row.name === 'object' ? row.name : { vi: String(row.name ?? ''), en: String(row.name ?? '') },
        description: typeof row.description === 'object' ? row.description : { vi: String(row.description ?? ''), en: String(row.description ?? '') },
        type: row.type ?? 'percent',
        value: Number(row.value ?? 0),
        conditions: {
            minNights: row.min_nights != null ? Number(row.min_nights) : undefined,
            minAmount: row.min_amount != null ? Number(row.min_amount) : undefined,
            stayFrom: row.stay_window?.from ?? row.stay_from,
            stayTo: row.stay_window?.to ?? row.stay_to,
            bookFrom: row.book_window?.from ?? row.book_from,
            bookTo: row.book_window?.to ?? row.book_to,
            roomTypeIds: Array.isArray(row.room_type_ids) ? row.room_type_ids : undefined,
            ratePlanIds: Array.isArray(row.rate_plan_ids) ? row.rate_plan_ids : undefined,
            daysBeforeCheckIn: row.lead_time_days != null ? Number(row.lead_time_days) : (row.days_before_check_in != null ? Number(row.days_before_check_in) : undefined),
            channels: Array.isArray(row.channels) ? row.channels : undefined,
        },
        stackable: Boolean(row.stackable ?? true),
        priority: Number(row.priority ?? 1),
        maxDiscount: row.max_discount != null ? Number(row.max_discount) : undefined,
        usageLimit: row.usage_limit != null ? Number(row.usage_limit) : undefined,
        perCustomerLimit: row.per_customer_limit != null ? Number(row.per_customer_limit) : undefined,
        usageCount: Number(row.usage_count ?? 0),
        active: Boolean(row.active ?? true),
    }
}

/**
 * Maps property settings row to ChildPolicy type.
 */
export function mapChildPolicy(settingRow?: Record<string, any>): ChildPolicy {
    if (!settingRow || !settingRow.child_policy) {
        return {
            freeUnderAge: 6,
            halfPriceUntilAge: 12,
            childRate: 150000,
        }
    }
    const policy = settingRow.child_policy
    return {
        freeUnderAge: Number(policy.freeUnderAge ?? policy.free_under_age ?? 6),
        halfPriceUntilAge: Number(policy.halfPriceUntilAge ?? policy.half_price_until_age ?? policy.halfPriceUnderAge ?? 12),
        childRate: Number(policy.childRate ?? policy.child_rate ?? 150000),
    }
}

/**
 * Maps a row from `bookings` table to Core Booking type.
 */
export function mapBookingRow(row: Record<string, any>): any {
    return {
        id: String(row.id),
        code: String(row.code),
        status: String(row.status),
        checkIn: String(row.check_in),
        checkOut: String(row.check_out),
        roomTypeId: String(row.room_type_id),
        ratePlanId: row.rate_plan_id ? String(row.rate_plan_id) : undefined,
        guests: {
            adults: Number(row.num_adults ?? 1),
            children: Array.isArray(row.child_ages) ? row.child_ages.map(Number) : [],
        },
        addons: typeof row.addons === 'object' && row.addons !== null ? row.addons : {},
        guest: {
            fullName: String(row.guest_full_name ?? ''),
            phone: String(row.guest_phone ?? ''),
            email: String(row.guest_email ?? ''),
            idNumber: row.guest_id_number ? String(row.guest_id_number) : undefined,
            estimatedArrivalTime: row.guest_estimated_arrival_time ? String(row.guest_estimated_arrival_time) : undefined,
            specialRequests: row.guest_special_requests ? String(row.guest_special_requests) : undefined,
            taxCode: row.guest_tax_code ? String(row.guest_tax_code) : undefined,
            companyName: row.guest_company_name ? String(row.guest_company_name) : undefined,
        },
        channel: String(row.channel ?? 'web'),
        createdAt: String(row.created_at ?? ''),
        subtotal: Number(row.subtotal ?? 0),
        discountTotal: Number(row.discount_total ?? 0),
        totalAmount: Number(row.total_amount ?? 0),
        paidAmount: Number(row.paid_amount ?? 0),
        depositAmount: Number(row.deposit_amount ?? 0),
        holdExpiresAt: row.hold_expires_at ? String(row.hold_expires_at) : undefined,
        assignedRoomUnitId: row.assigned_room_unit_id ? String(row.assigned_room_unit_id) : undefined,
        customerId: row.customer_id ? String(row.customer_id) : undefined,
    }
}


