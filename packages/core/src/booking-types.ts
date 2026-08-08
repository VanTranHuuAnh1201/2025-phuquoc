/**
 * Kiểu dữ liệu nghiệp vụ đặt phòng — tồn kho, đơn hàng, khuyến mãi, tài khoản.
 *
 * Tách khỏi `types.ts` (nội dung marketing của cơ sở lưu trú) vì hai nhóm này
 * có vòng đời khác hẳn: nội dung do biên tập sửa, còn những thứ dưới đây do lễ
 * tân và hệ thống sinh ra hằng ngày.
 *
 * Không JSX, không CSS, không mã màu (luật R2).
 * Chi tiết nghiệp vụ: `.claude/rules/booking-domain.md`.
 */

import type { I18nText } from '@repo/utils'

// ============================================================ phòng: 2 thực thể

/**
 * Phòng vật lý — cái mà buồng phòng đi dọn.
 *
 * Khách KHÔNG chọn phòng này; khách chọn `RoomType`. Lễ tân gán `RoomUnit` cụ
 * thể lúc nhận phòng. Xem `.claude/rules/booking-domain.md` §B0 để hiểu vì sao
 * phải tách hai thực thể.
 */
export interface RoomUnit {
    id: string
    /** Số phòng hiển thị, ví dụ "201". */
    code: string
    roomTypeId: string
    floor?: string
    status: RoomUnitStatus
    /** Ghi chú của buồng phòng, ví dụ "điều hoà kêu". */
    note?: string
}

export type RoomUnitStatus =
    /** Sạch, sẵn sàng đón khách. */
    | 'available'
    /** Đang có khách ở. */
    | 'occupied'
    /** Khách đã trả, chờ dọn. */
    | 'dirty'
    /** Đang dọn. */
    | 'cleaning'
    /** Đóng để sửa chữa. */
    | 'maintenance'

// ================================================================= tồn kho

/**
 * Tồn kho + giá của MỘT hạng phòng trong MỘT ngày.
 *
 * Đây là bảng trung tâm của cả hệ thống: mọi câu hỏi "còn phòng không" và "giá
 * bao nhiêu" đều tra ở đây.
 */
export interface Inventory {
    /** YYYY-MM-DD. */
    date: string
    roomTypeId: string
    /** Tổng số phòng vật lý của hạng này. */
    totalUnits: number
    /** Đã bán. */
    bookedUnits: number
    /** Đóng thủ công: bảo trì, giữ chỗ tạm khi khách đang thanh toán. */
    blockedUnits: number
    /**
     * Đè giá ngày này. Có giá trị thì THAY THẾ hẳn kết quả tính theo mùa,
     * không cộng dồn — lễ tân set giá lễ là muốn đúng con số đó.
     */
    priceOverride?: number
    /** Số đêm tối thiểu khi nhận phòng vào ngày này. Hay dùng dịp lễ. */
    minNights?: number
    /** Cấm nhận phòng ngày này (khách vẫn có thể ở qua ngày này). */
    closedToArrival?: boolean
    /** Cấm trả phòng ngày này. */
    closedToDeparture?: boolean
    /**
     * Optimistic locking. Ghi mà version không khớp bản trên server → từ chối.
     * Đây là chốt chặn khi nhiều lễ tân thao tác cùng lúc trên nhiều thiết bị.
     */
    version: number
}

/** Kết quả tra cứu phòng trống, đã tính sẵn giá cho khoảng ngày được hỏi. */
export interface AvailabilityResult {
    roomTypeId: string
    available: boolean
    /** Số phòng còn lại của hạng, tính trên đêm khan hiếm nhất. */
    availableUnits: number
    /** Giá từng đêm, đã áp mùa + override + gói giá. */
    nightlyPrices: NightlyPrice[]
    /** Tổng tiền phòng cho cả kỳ. */
    roomTotal: number
    /** Vì sao không đặt được — theme tra chuỗi hiển thị từ mã này. */
    blockedReason?: AvailabilityBlockReason
    /** Số đêm tối thiểu bị vi phạm, kèm theo khi blockedReason là 'min-nights'. */
    requiredMinNights?: number
}

export interface NightlyPrice {
    /** YYYY-MM-DD. */
    date: string
    price: number
}

export type AvailabilityBlockReason =
    | 'sold-out'
    | 'min-nights'
    | 'closed-to-arrival'
    | 'closed-to-departure'
    | 'capacity-exceeded'

// ================================================================== mùa vụ

/** Hệ số giá theo khoảng ngày. Áp trước `priceOverride`. */
export interface Season {
    id: string
    name: I18nText
    /** YYYY-MM-DD. */
    from: string
    to: string
    /** Nhân vào giá gốc, ví dụ 1.4 = tăng 40%. */
    multiplier: number
    /** Hệ số riêng cho T6–T7. Không khai thì dùng `multiplier`. */
    weekendMultiplier?: number
    /** Số nhỏ áp trước khi hai mùa chồng nhau. */
    priority: number
}

// ================================================================ gói giá

/**
 * Gói giá — cùng một phòng, bán theo nhiều điều kiện khác nhau.
 * Ví dụ: "Tiêu chuẩn" hoàn huỷ được vs "Tiết kiệm" rẻ hơn 15% nhưng không hoàn.
 */
export interface RatePlan {
    id: string
    name: I18nText
    description: I18nText
    /**
     * Điều chỉnh so với giá gốc, tính theo %.
     * -15 = rẻ hơn 15%. 0 = đúng giá gốc.
     */
    adjustPercent: number
    /** Bao gồm ăn sáng? Hiện thành chip trên thẻ phòng. */
    includesBreakfast: boolean
    /** Cho phép huỷ? false = không hoàn tiền trong mọi trường hợp. */
    refundable: boolean
    /** Bậc thang hoàn tiền. Rỗng khi `refundable` là false. */
    cancellationRules: CancellationRule[]
    /** % tiền cọc yêu cầu khi đặt. */
    depositPercent: number
    /** Chỉ áp cho các hạng phòng này. Rỗng = mọi hạng. */
    roomTypeIds: string[]
    active: boolean
}

/** Một bậc trong chính sách huỷ. Xem `.claude/rules/booking-domain.md` §B5. */
export interface CancellationRule {
    /** Huỷ trước bao nhiêu ngày so với ngày nhận phòng. */
    daysBeforeCheckIn: number
    /** Hoàn bao nhiêu % tổng tiền. */
    refundPercent: number
}

// ============================================================== khuyến mãi

export type PromotionType =
    /** Giảm theo phần trăm. */
    | 'percent'
    /** Giảm số tiền cố định. */
    | 'fixed'
    /** Đêm thứ N miễn phí (value = N). */
    | 'nth-night-free'
    /** Giảm theo bậc số đêm. */
    | 'long-stay'
    /** Đặt sớm trước N ngày. */
    | 'early-bird'
    /** Đặt sát ngày, xả phòng ế. */
    | 'last-minute'
    /** Tặng kèm dịch vụ. */
    | 'free-addon'

/** Kênh bán. Cần cho báo cáo nguồn khách và cho điều kiện khuyến mãi. */
export type Channel = 'web' | 'phone' | 'walk-in' | 'ota'

/** Điều kiện để một khuyến mãi được áp. Mọi điều kiện khai ra đều phải thoả. */
export interface PromotionConditions {
    /** Đêm ở phải nằm trong khoảng này. */
    stayFrom?: string
    stayTo?: string
    /** Đơn phải được TẠO trong khoảng này. */
    bookFrom?: string
    bookTo?: string
    /** Chỉ áp cho các hạng này. Rỗng/không khai = mọi hạng. */
    roomTypeIds?: string[]
    ratePlanIds?: string[]
    minNights?: number
    maxNights?: number
    /** Đơn tối thiểu bao nhiêu tiền mới được áp. */
    minAmount?: number
    /** 0=CN … 6=T7. Chỉ áp cho đêm rơi vào các thứ này. */
    weekdays?: number[]
    /**
     * Khoảng cách từ ngày đặt tới ngày nhận phòng.
     * `early-bird` cần đặt SỚM HƠN số này; `last-minute` cần MUỘN HƠN.
     */
    daysBeforeCheckIn?: number
    channels?: Channel[]
    /** Cho `free-addon`: tặng addon nào. */
    freeAddonIds?: string[]
    /** Cho `long-stay`: bậc thang giảm giá. */
    tiers?: LongStayTier[]
}

export interface LongStayTier {
    minNights: number
    /** Giảm bao nhiêu %. */
    percent: number
}

/**
 * Một chương trình khuyến mãi.
 *
 * Khuyến mãi CAN THIỆP vào giá tại thời điểm áp — không sửa `basePrice` cũng
 * không sửa `priceOverride`. Nhờ vậy tắt khuyến mãi là giá trở về nguyên trạng.
 */
export interface Promotion {
    id: string
    /** Có mã → khách phải nhập. Không có → tự động áp khi thoả điều kiện. */
    code?: string
    name: I18nText
    /** Hiện cho khách thấy trên breakdown giá. */
    description: I18nText
    type: PromotionType
    /** % với `percent`, VNĐ với `fixed`, số N với `nth-night-free`. */
    value: number
    conditions: PromotionConditions
    /**
     * Cộng dồn được với khuyến mãi khác không?
     * false = độc quyền: nếu được chọn thì huỷ mọi khuyến mãi còn lại.
     */
    stackable: boolean
    /** Số nhỏ áp trước. Cũng quyết định ai thắng khi có nhiều KM độc quyền. */
    priority: number
    /** Trần giảm giá, ví dụ "giảm 20% nhưng tối đa 500.000đ". */
    maxDiscount?: number
    /** Tổng số lượt được dùng. Không khai = không giới hạn. */
    usageLimit?: number
    usageCount: number
    /** Mỗi khách được dùng bao nhiêu lần. */
    perCustomerLimit?: number
    active: boolean
}

/** Một khuyến mãi đã được áp vào đơn, kèm số tiền giảm thực tế. */
export interface AppliedPromotion {
    promotionId: string
    code?: string
    name: I18nText
    type: PromotionType
    /** Số tiền giảm được. */
    discount: number
    /** Tiền còn lại sau khi áp khuyến mãi này — để dựng bảng giải thích. */
    remainingAfter: number
    /** Có bị cắt bởi `maxDiscount` không. */
    cappedByMax: boolean
}

// ==================================================== chính sách trẻ em & khách

export interface ChildPolicy {
    /** Dưới tuổi này: miễn phí. */
    freeUnderAge: number
    /** Từ `freeUnderAge` đến tuổi này: tính nửa giá. */
    halfPriceUntilAge: number
    /** Phụ phí nửa giá tính trên con số này mỗi đêm. */
    childRate: number
}

/**
 * Số khách. Trẻ em lưu TUỔI từng cháu, không phải số lượng — vì chính sách giá
 * và việc chuẩn bị cũi/giường phụ đều phụ thuộc tuổi.
 */
export interface GuestCount {
    adults: number
    /** Tuổi từng trẻ. Mảng rỗng = không có trẻ em. */
    children: number[]
}

// ================================================================= đơn hàng

export type BookingStatus =
    /** Vừa submit, chưa trả tiền. Giữ chỗ tạm 15 phút. */
    | 'pending_payment'
    /** Đã cọc hoặc trả đủ, phòng được giữ chắc chắn. */
    | 'confirmed'
    /** Khách đã đến, lễ tân đã gán phòng vật lý. */
    | 'checked_in'
    /** Đã trả phòng, đơn đóng. */
    | 'checked_out'
    /** Huỷ bởi khách hoặc admin. */
    | 'cancelled'
    /** Tới ngày không thấy khách. */
    | 'no_show'
    /** Quá hạn giữ chỗ mà không thanh toán. */
    | 'expired'

/** Thông tin liên hệ của người đứng tên đơn. */
export interface BookingGuest {
    fullName: string
    phone: string
    email: string
    /** CCCD/hộ chiếu — lễ tân ghi lúc nhận phòng, khai báo lưu trú. */
    idNumber?: string
    /** Giờ đến dự kiến. Nam Du phụ thuộc chuyến tàu nên rất quan trọng. */
    estimatedArrivalTime?: string
    specialRequests?: string
    /** Xuất hoá đơn VAT. */
    taxCode?: string
    companyName?: string
}

export type PaymentMethod = 'bank-transfer' | 'card' | 'at-property' | 'momo'

export interface Payment {
    id: string
    bookingId: string
    /** ISO timestamp. */
    at: string
    amount: number
    method: PaymentMethod
    /** Cọc hay tất toán. */
    kind: 'deposit' | 'balance' | 'refund' | 'surcharge'
    /** Mã giao dịch của cổng thanh toán. Bản demo để trống. */
    reference?: string
    note?: string
}

/** Một dòng phát sinh ghi lúc trả phòng: minibar, hư hỏng, phụ phí. */
export interface IncidentalCharge {
    id: string
    description: string
    amount: number
}

/** Thông tin lễ tân ghi lúc khách nhận phòng. */
export interface CheckInRecord {
    at: string
    /** Phòng vật lý được gán. */
    roomUnitId: string
    idNumber: string
    actualGuests: GuestCount
    earlyCheckIn: boolean
    vehiclePlate?: string
    note?: string
    staffId: string
    staffName: string
}

/** Thông tin lễ tân ghi lúc khách trả phòng. */
export interface CheckOutRecord {
    at: string
    lateCheckOut: boolean
    lateCheckOutFee: number
    incidentals: IncidentalCharge[]
    computedDue: number
    collectedAmount: number
    /** Đã thu đủ chưa. Chưa đủ thì không cho đóng đơn. */
    settled: boolean
    /** Nhận xét kết thúc lượt lưu trú. */
    comment?: string
    /** Đánh giá nội bộ về khách, 1–5. */
    guestRating?: number
    staffId: string
    staffName: string
}

export interface Booking {
    id: string
    /** Mã khách nhìn thấy, ví dụ "ĐH-2026-0042". */
    code: string
    propertyId: string
    roomTypeId: string
    ratePlanId: string
    /** YYYY-MM-DD. */
    checkIn: string
    checkOut: string
    nights: number
    guests: GuestCount
    /** id addon → số lượng. */
    addons: Record<string, number>

    guest: BookingGuest
    /** Tài khoản đặt đơn. Đơn nhập tay ở quầy có thể không có. */
    customerId?: string
    channel: Channel

    status: BookingStatus
    /** ISO timestamp. */
    createdAt: string
    updatedAt: string
    /** Hết hạn giữ chỗ, chỉ có ý nghĩa khi status là pending_payment. */
    holdExpiresAt?: string

    // ---- tiền: bốn con số, xem booking-domain §B1 ----
    /** Tiền phòng + giường phụ + dịch vụ, TRƯỚC khuyến mãi. */
    subtotal: number
    /** Tổng giảm giá. */
    discountTotal: number
    /** subtotal - discountTotal. */
    totalAmount: number
    /** Cọc yêu cầu theo % của gói giá. */
    depositAmount: number
    /** Đã thu thực tế. */
    paidAmount: number

    /** Chi tiết từng dòng tiền, để dựng bảng breakdown. */
    priceLines: BookingPriceLine[]
    appliedPromotions: AppliedPromotion[]

    checkInRecord?: CheckInRecord
    checkOutRecord?: CheckOutRecord
    /** Lý do huỷ, mã để theme tra chuỗi. */
    cancellation?: {
        at: string
        by: 'customer' | 'admin'
        reason?: string
        refundAmount: number
    }
}

export interface BookingPriceLine {
    kind: 'room' | 'extra-bed' | 'child' | 'addon' | 'surcharge'
    /** id của hạng phòng hoặc addon tương ứng. */
    refId: string
    /** Nhãn tự do cho dòng phụ phí; các dòng khác theme tự tra chuỗi. */
    label?: I18nText
    quantity: number
    unitPrice: number
    total: number
}

// ============================================================== nhật ký đơn

export type LogAction =
    | 'created'
    | 'status-changed'
    | 'payment-recorded'
    | 'checked-in'
    | 'checked-out'
    | 'note-added'
    | 'room-assigned'
    | 'price-adjusted'
    | 'cancelled'
    // Hoàn tiền tách riêng khỏi 'payment-recorded': nhật ký phải phân biệt được
    // chiều tiền vào/ra khi tranh chấp với khách (§B1). Khớp `chk_logs_action`
    // sau migration 20260103000000 (ticket 900-01).
    | 'refund-processed'

/**
 * Một dòng nhật ký trên đơn. BẤT BIẾN — không bao giờ sửa hay xoá.
 * Đây là thứ cứu bạn khi có tranh chấp với khách.
 */
export interface ActivityLog {
    id: string
    bookingId: string
    /** ISO timestamp. */
    at: string
    actorId: string
    actorName: string
    actorRole: Role
    action: LogAction
    /** Trường bị đổi, nếu có. */
    field?: string
    from?: string
    to?: string
    note?: string
}

// ============================================================ tài khoản, quyền

export type Role = 'owner' | 'manager' | 'receptionist' | 'editor' | 'customer'

export interface Account {
    id: string
    role: Role
    fullName: string
    phone: string
    email: string
    /** ISO timestamp. */
    createdAt: string
    active: boolean
}

/** Hồ sơ khách, gộp theo số điện thoại. */
export interface Customer extends Account {
    role: 'customer'
    /** Tổng chi tiêu qua mọi đơn đã hoàn thành. */
    totalSpent: number
    /** Số lượt đã lưu trú. */
    stayCount: number
    /** Ghi chú nội bộ: "khách quen, thích tầng cao". */
    internalNote?: string
}

// ============================================================== cấu hình thanh toán

/**
 * Tài khoản ngân hàng nhận cọc của cơ sở (ticket `100-04` §6.3).
 *
 * Map vào `property_settings.bank` (jsonb) theo `ndh-schema-mapping.md §9.10`
 * — cùng chỗ với `child_policy` và `brand`, KHÔNG tạo bảng riêng.
 *
 * Đặt ở `core` vì đây là nguồn sự thật để SQL bám theo (luật BE8): API `200-05`
 * và RLS sẽ đọc đúng bộ trường này, không được khai lại ở tầng app.
 */
export interface BankConfig {
    bankName: string
    accountNumber: string
    accountHolder: string
    /** % cọc mặc định khi `RatePlan` không khai riêng. */
    defaultDepositPercent: number
}

// ============================================================== thông báo

export type NotificationKind =
    | 'booking-created'
    | 'payment-success'
    | 'booking-confirmed'
    | 'booking-cancelled'
    | 'check-in-reminder'
    | 'review-request'

export interface Notification {
    id: string
    /** Tài khoản nhận. */
    accountId: string
    kind: NotificationKind
    /** ISO timestamp. */
    at: string
    read: boolean
    bookingId?: string
    bookingCode?: string
    /** Dữ liệu để theme dựng câu — core không chứa chuỗi giao diện. */
    payload?: {
        roomTypeName?: I18nText
        nights?: number
        amount?: number
    }
}
