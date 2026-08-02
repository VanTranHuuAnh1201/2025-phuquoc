/**
 * Dữ liệu vận hành mặc định: mùa vụ, gói giá, khuyến mãi, phòng vật lý,
 * chính sách trẻ em.
 *
 * Đây là seed để demo chạy được ngay. Khi có CMS thật, admin sửa qua giao diện
 * và bản này chỉ còn là giá trị khởi tạo.
 *
 * Mọi chuỗi khách nhìn thấy đều song ngữ (luật R6).
 */

import { t } from '../i18n'
import type {
    ChildPolicy,
    Promotion,
    RatePlan,
    RoomUnit,
    Season,
} from '../booking-types'

// ================================================================== mùa vụ

/**
 * Mùa vụ của Nam Du — theo thực tế du lịch biển Tây Nam.
 * Cao điểm hè và Tết; mùa mưa T9–T11 biển động, giá giảm mạnh.
 */
export const seasons: Season[] = [
    {
        id: 'low',
        name: t('Mùa thấp điểm', 'Low season'),
        from: '2026-09-01',
        to: '2026-11-30',
        multiplier: 0.8,
        weekendMultiplier: 0.9,
        priority: 30,
    },
    {
        id: 'high-summer',
        name: t('Cao điểm hè', 'Summer peak'),
        from: '2026-06-01',
        to: '2026-08-31',
        multiplier: 1.25,
        weekendMultiplier: 1.45,
        priority: 20,
    },
    {
        id: 'high-winter',
        name: t('Cao điểm khô', 'Dry season peak'),
        from: '2026-12-01',
        to: '2027-04-30',
        multiplier: 1.2,
        weekendMultiplier: 1.4,
        priority: 20,
    },
    {
        id: 'holiday-30-4',
        name: t('Lễ 30/4 – 1/5', 'Reunification & Labour Day'),
        from: '2027-04-29',
        to: '2027-05-03',
        multiplier: 1.8,
        priority: 10,
    },
    {
        id: 'holiday-2-9',
        name: t('Lễ Quốc khánh 2/9', 'National Day'),
        from: '2026-08-31',
        to: '2026-09-03',
        multiplier: 1.7,
        priority: 10,
    },
]

// ================================================================= gói giá

export const ratePlans: RatePlan[] = [
    {
        id: 'standard',
        name: t('Tiêu chuẩn', 'Standard'),
        description: t(
            'Huỷ miễn phí trước 7 ngày. Cọc 30%, còn lại trả tại quầy.',
            'Free cancellation up to 7 days before arrival. 30% deposit, balance on arrival.',
        ),
        adjustPercent: 0,
        includesBreakfast: true,
        refundable: true,
        cancellationRules: [
            { daysBeforeCheckIn: 7, refundPercent: 100 },
            { daysBeforeCheckIn: 3, refundPercent: 50 },
            { daysBeforeCheckIn: 0, refundPercent: 0 },
        ],
        depositPercent: 30,
        roomTypeIds: [],
        active: true,
    },
    {
        id: 'saver',
        name: t('Tiết kiệm', 'Saver'),
        description: t(
            'Rẻ hơn 15% nhưng không hoàn tiền. Thanh toán đủ khi đặt.',
            '15% cheaper, non-refundable. Full payment on booking.',
        ),
        adjustPercent: -15,
        includesBreakfast: false,
        refundable: false,
        cancellationRules: [],
        depositPercent: 100,
        roomTypeIds: [],
        active: true,
    },
    {
        id: 'full-board',
        name: t('Trọn gói ăn uống', 'Full board'),
        description: t(
            'Bao gồm ăn sáng, trưa và tối tại nhà hàng. Huỷ miễn phí trước 7 ngày.',
            'Includes breakfast, lunch and dinner. Free cancellation up to 7 days before arrival.',
        ),
        adjustPercent: 35,
        includesBreakfast: true,
        refundable: true,
        cancellationRules: [
            { daysBeforeCheckIn: 7, refundPercent: 100 },
            { daysBeforeCheckIn: 3, refundPercent: 50 },
            { daysBeforeCheckIn: 0, refundPercent: 0 },
        ],
        depositPercent: 50,
        roomTypeIds: [],
        active: true,
    },
]

// ============================================================== khuyến mãi

/**
 * Bộ khuyến mãi mẫu — cố ý phủ đủ 7 kiểu, để màn hình admin có gì mà giải thích
 * và để kiểm chứng thuật toán cộng dồn.
 *
 * Quy ước `priority`: số nhỏ áp trước.
 *   10–19  khuyến mãi theo thời điểm đặt (đặt sớm, sát ngày)
 *   20–29  khuyến mãi theo độ dài kỳ nghỉ
 *   30–39  khuyến mãi có mã do khách nhập
 *   90+    khuyến mãi độc quyền, thường là chiến dịch lớn
 */
export const promotions: Promotion[] = [
    {
        id: 'early-bird-30',
        name: t('Đặt sớm 30 ngày', 'Early bird 30 days'),
        description: t(
            'Giảm 15% khi đặt trước ngày nhận phòng ít nhất 30 ngày.',
            'Save 15% when booking at least 30 days before arrival.',
        ),
        type: 'early-bird',
        value: 15,
        conditions: { daysBeforeCheckIn: 30, channels: ['web'] },
        stackable: true,
        priority: 10,
        usageCount: 0,
        active: true,
    },
    {
        id: 'last-minute',
        name: t('Đặt sát ngày', 'Last minute'),
        description: t(
            'Giảm 20% khi đặt trong vòng 3 ngày trước khi nhận phòng.',
            'Save 20% when booking within 3 days of arrival.',
        ),
        type: 'last-minute',
        value: 20,
        conditions: { daysBeforeCheckIn: 3, channels: ['web'] },
        stackable: true,
        priority: 15,
        maxDiscount: 800_000,
        usageCount: 0,
        active: true,
    },
    {
        id: 'long-stay',
        name: t('Ở dài ngày', 'Long stay'),
        description: t(
            'Ở từ 3 đêm giảm 10%, từ 5 đêm giảm 15%.',
            'Stay 3+ nights save 10%, 5+ nights save 15%.',
        ),
        type: 'long-stay',
        value: 0,
        conditions: {
            tiers: [
                { minNights: 3, percent: 10 },
                { minNights: 5, percent: 15 },
            ],
        },
        stackable: true,
        priority: 20,
        usageCount: 0,
        active: true,
    },
    {
        id: 'fourth-night-free',
        name: t('Đêm thứ 4 miễn phí', '4th night free'),
        description: t(
            'Ở 4 đêm trở lên được tặng một đêm.',
            'Stay 4 nights or more and get one night free.',
        ),
        type: 'nth-night-free',
        value: 4,
        conditions: { minNights: 4, stayFrom: '2026-09-01', stayTo: '2026-11-30' },
        stackable: false,
        priority: 90,
        usageCount: 0,
        active: true,
    },
    {
        id: 'code-namdu10',
        code: 'NAMDU10',
        name: t('Mã NAMDU10', 'Code NAMDU10'),
        description: t(
            'Giảm 10% cho mọi hạng phòng, tối đa 500.000đ.',
            'Save 10% on any room type, up to 500,000₫.',
        ),
        type: 'percent',
        value: 10,
        conditions: { minAmount: 1_000_000 },
        stackable: true,
        priority: 30,
        maxDiscount: 500_000,
        usageLimit: 200,
        perCustomerLimit: 1,
        usageCount: 47,
        active: true,
    },
    {
        id: 'code-welcome',
        code: 'WELCOME',
        name: t('Khách mới', 'First-time guest'),
        description: t(
            'Giảm ngay 200.000đ cho lần đặt đầu tiên.',
            'Get 200,000₫ off your first booking.',
        ),
        type: 'fixed',
        value: 200_000,
        conditions: { channels: ['web'] },
        stackable: true,
        priority: 35,
        perCustomerLimit: 1,
        usageCount: 12,
        active: true,
    },
    {
        id: 'free-ferry',
        name: t('Tặng vé tàu Rạch Giá', 'Free Rach Gia ferry'),
        description: t(
            'Tặng đưa đón tàu cao tốc khứ hồi khi ở từ 3 đêm.',
            'Complimentary return speedboat transfer for stays of 3+ nights.',
        ),
        type: 'free-addon',
        value: 700_000,
        conditions: { minNights: 3, freeAddonIds: ['ferry'] },
        stackable: true,
        priority: 25,
        usageCount: 0,
        active: false,
    },
]

// ========================================================== chính sách trẻ em

export const childPolicy: ChildPolicy = {
    freeUnderAge: 6,
    halfPriceUntilAge: 11,
    childRate: 250_000,
}

// ============================================================= phòng vật lý

/**
 * Sinh phòng vật lý cho một hạng.
 *
 * Quy ước số phòng theo kiểu khách sạn Việt Nam: tầng + số thứ tự, ví dụ tầng 2
 * phòng 1 là "201". Bungalow không có tầng nên đánh số thẳng.
 */
function makeUnits(
    roomTypeId: string,
    prefix: string,
    count: number,
    floor?: string,
): RoomUnit[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `${roomTypeId}-${i + 1}`,
        code: `${prefix}${String(i + 1).padStart(2, '0')}`,
        roomTypeId,
        floor,
        status: 'available' as const,
    }))
}

/**
 * Số phòng vật lý mỗi hạng.
 *
 * Khoá phải khớp `Room.id` trong dữ liệu nội dung. Hạng nào không khai ở đây thì
 * `buildRoomUnits()` dùng `DEFAULT_UNITS_PER_TYPE`.
 */
export const unitsPerRoomType: Record<string, { count: number; prefix: string; floor?: string }> = {
    'bungalow-bien': { count: 10, prefix: 'B' },
    'bungalow-vuon': { count: 8, prefix: 'G' },
    'villa-gia-dinh': { count: 4, prefix: 'V' },
    'phong-doi': { count: 12, prefix: '2', floor: '2' },
    'phong-don': { count: 10, prefix: '1', floor: '1' },
}

const DEFAULT_UNITS_PER_TYPE = 6

/** Dựng toàn bộ phòng vật lý từ danh sách hạng phòng thật trong dữ liệu. */
export function buildRoomUnits(roomTypeIds: string[]): RoomUnit[] {
    return roomTypeIds.flatMap((id, index) => {
        const config = unitsPerRoomType[id]
        return makeUnits(
            id,
            config?.prefix ?? String.fromCharCode(65 + index),
            config?.count ?? DEFAULT_UNITS_PER_TYPE,
            config?.floor,
        )
    })
}
