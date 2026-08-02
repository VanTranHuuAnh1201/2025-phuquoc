/**
 * Engine giá — mùa vụ, đè giá theo ngày, gói giá.
 *
 * Đây là nơi DUY NHẤT biết một đêm giá bao nhiêu. Theme và store gọi vào đây,
 * nhờ vậy N giao diện luôn hiện cùng con số (luật R8).
 *
 * Thứ tự áp giá — cố định, xem `.claude/rules/booking-domain.md` §B3:
 *   ① basePrice của hạng phòng
 *   ② Season        → nhân hệ số mùa / cuối tuần
 *   ③ priceOverride → nếu ngày đó có thì ĐÈ HẲN kết quả ②
 *   ④ RatePlan      → cộng/trừ theo gói (±%)
 */

import type {
    ChildPolicy,
    GuestCount,
    Inventory,
    NightlyPrice,
    RatePlan,
    Season,
} from './booking-types'
import type { Room, RoomExtra } from './types'

const MS_PER_DAY = 86_400_000

// ================================================================== ngày tháng

/** Parse YYYY-MM-DD về mốc UTC. NaN nếu chuỗi không hợp lệ. */
function parseDay(date: string): number {
    return Date.parse(`${date}T00:00:00Z`)
}

/** YYYY-MM-DD của một mốc UTC. */
export function toDateKey(ms: number): string {
    return new Date(ms).toISOString().slice(0, 10)
}

/** Số đêm giữa hai mốc. 0 nếu không hợp lệ hoặc trả trước khi nhận. */
export function countNights(checkIn: string, checkOut: string): number {
    const start = parseDay(checkIn)
    const end = parseDay(checkOut)
    if (Number.isNaN(start) || Number.isNaN(end)) return 0
    const nights = Math.round((end - start) / MS_PER_DAY)
    return nights > 0 ? nights : 0
}

/**
 * Liệt kê các ĐÊM của một kỳ lưu trú.
 *
 * Nhận 20/8 trả 22/8 → hai đêm: 20/8 và 21/8. Ngày trả phòng KHÔNG tính, vì
 * khách không ngủ đêm đó — đây là quy ước của mọi hệ khách sạn.
 */
export function listStayDates(checkIn: string, checkOut: string): string[] {
    const nights = countNights(checkIn, checkOut)
    if (nights === 0) return []
    const start = parseDay(checkIn)
    return Array.from({ length: nights }, (_, i) => toDateKey(start + i * MS_PER_DAY))
}

/** 0=CN … 6=T7. -1 nếu chuỗi không hợp lệ. */
export function weekdayOf(date: string): number {
    const ms = parseDay(date)
    return Number.isNaN(ms) ? -1 : new Date(ms).getUTCDay()
}

/** T7 hoặc CN — hai đêm cuối tuần được tính giá cao ở Việt Nam. */
export function isWeekend(date: string): boolean {
    const day = weekdayOf(date)
    return day === 0 || day === 6
}

/** Số ngày từ `from` tới `to`. Âm nếu `to` ở quá khứ. */
export function daysBetween(from: string, to: string): number {
    const a = parseDay(from)
    const b = parseDay(to)
    if (Number.isNaN(a) || Number.isNaN(b)) return 0
    return Math.round((b - a) / MS_PER_DAY)
}

/** Cộng thêm n ngày vào một mốc YYYY-MM-DD. */
export function addDays(date: string, n: number): string {
    const ms = parseDay(date)
    if (Number.isNaN(ms)) return date
    return toDateKey(ms + n * MS_PER_DAY)
}

// ==================================================================== mùa vụ

/** Mùa áp cho một ngày. Nhiều mùa chồng nhau thì `priority` nhỏ nhất thắng. */
export function findSeason(date: string, seasons: Season[]): Season | undefined {
    return seasons
        .filter((s) => date >= s.from && date <= s.to)
        .sort((a, b) => a.priority - b.priority)[0]
}

// =============================================================== giá một đêm

export interface NightlyPriceInput {
    date: string
    basePrice: number
    seasons: Season[]
    /** Bản ghi tồn kho của đúng ngày + hạng đó, nếu có. */
    inventory?: Inventory
    ratePlan?: RatePlan
}

/**
 * Giá một đêm sau khi qua đủ 4 bước.
 *
 * `priceOverride` ĐÈ chứ không cộng dồn: lễ tân set 1.800.000đ cho đêm 30/4 là
 * muốn đúng con số đó, không muốn hệ thống nhân thêm hệ số mùa lên nữa.
 */
export function calculateNightlyPrice(input: NightlyPriceInput): number {
    const { date, basePrice, seasons, inventory, ratePlan } = input

    let price = basePrice

    // ② mùa vụ
    const season = findSeason(date, seasons)
    if (season) {
        const multiplier =
            isWeekend(date) && season.weekendMultiplier !== undefined
                ? season.weekendMultiplier
                : season.multiplier
        price = price * multiplier
    }

    // ③ đè giá theo ngày — thay thế hẳn, không nhân tiếp
    if (inventory?.priceOverride !== undefined) {
        price = inventory.priceOverride
    }

    // ④ gói giá
    if (ratePlan && ratePlan.adjustPercent !== 0) {
        price = price * (1 + ratePlan.adjustPercent / 100)
    }

    return Math.round(price)
}

/** Giá từng đêm của cả kỳ lưu trú. */
export function calculateNightlyPrices(
    checkIn: string,
    checkOut: string,
    basePrice: number,
    seasons: Season[],
    inventoryByDate: Record<string, Inventory>,
    ratePlan?: RatePlan,
): NightlyPrice[] {
    return listStayDates(checkIn, checkOut).map((date) => ({
        date,
        price: calculateNightlyPrice({
            date,
            basePrice,
            seasons,
            inventory: inventoryByDate[date],
            ratePlan,
        }),
    }))
}

/**
 * Tổng tiền phòng.
 *
 * Cộng TỪNG ĐÊM, không lấy `giá × số đêm` — vì mỗi đêm có thể một giá khác
 * nhau (cuối tuần, lễ). Đây là lỗi hay gặp nhất trong hệ booking.
 */
export function sumNightly(prices: NightlyPrice[]): number {
    return prices.reduce((sum, n) => sum + n.price, 0)
}

// ================================================================ khách & giường

/** Tổng số khách quy đổi để kiểm sức chứa: người lớn + mọi trẻ em. */
export function totalGuests(guests: GuestCount): number {
    return guests.adults + guests.children.length
}

/** Số giường phụ cần thêm khi vượt số khách tiêu chuẩn của hạng phòng. */
export function countExtraBeds(
    guests: GuestCount,
    room: Room,
    extra?: RoomExtra,
): number {
    const capacity = extra?.maxGuests ?? room.guests
    const billable = Math.min(totalGuests(guests), capacity)
    return billable > room.guests ? billable - room.guests : 0
}

/**
 * Phụ phí trẻ em theo tuổi.
 *
 * Dưới `freeUnderAge`: miễn phí. Tới `halfPriceUntilAge`: nửa giá.
 * Lớn hơn: đã được tính như người lớn ở phần giường phụ, nên không tính lại.
 */
export function calculateChildCharge(
    guests: GuestCount,
    policy: ChildPolicy,
    nights: number,
): { count: number; total: number } {
    const billable = guests.children.filter(
        (age) => age >= policy.freeUnderAge && age <= policy.halfPriceUntilAge,
    )
    return {
        count: billable.length,
        total: billable.length * policy.childRate * nights,
    }
}
