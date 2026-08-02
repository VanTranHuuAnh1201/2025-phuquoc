/**
 * Chuỗi giao diện song ngữ cho luồng đặt phòng và CMS.
 *
 * Vì sao ở app chứ không ở `core`: đây là chữ trên nút và nhãn cột — thuộc về
 * tầng trình bày. `core` chỉ trả về MÃ (`BookingStatus`, `AvailabilityBlockReason`,
 * `PromotionRejectReason`…), tầng này tra ra câu (luật R2).
 *
 * Bắt buộc đủ cả `vi` và `en`, không có ngoại lệ (luật R6).
 */

import { t } from '@repo/core'
import type {
    AvailabilityBlockReason,
    BookingStatus,
    I18nText,
    Locale,
    NotificationKind,
    PromotionRejectReason,
    PromotionType,
    Role,
    RoomUnitStatus,
} from '@repo/core'

export const S = {
    // ------------------------------------------------------------ chung
    back: t('Quay lại', 'Back'),
    next: t('Tiếp tục', 'Continue'),
    cancel: t('Huỷ', 'Cancel'),
    save: t('Lưu', 'Save'),
    close: t('Đóng', 'Close'),
    confirm: t('Xác nhận', 'Confirm'),
    edit: t('Sửa', 'Edit'),
    view: t('Xem', 'View'),
    delete: t('Xoá', 'Delete'),
    reset: t('Đặt lại', 'Reset'),
    search: t('Tìm kiếm', 'Search'),
    all: t('Tất cả', 'All'),
    night: t('đêm', 'night'),
    nights: t('đêm', 'nights'),
    guest: t('khách', 'guest'),
    guests: t('khách', 'guests'),
    adults: t('Người lớn', 'Adults'),
    children: t('Trẻ em', 'Children'),
    from: t('Từ', 'From'),
    perNight: t('/đêm', '/night'),
    required: t('Bắt buộc', 'Required'),
    optional: t('Không bắt buộc', 'Optional'),
    loading: t('Đang tải…', 'Loading…'),

    // ------------------------------------------------------- đăng nhập
    login: t('Đăng nhập', 'Sign in'),
    logout: t('Đăng xuất', 'Sign out'),
    loginTitle: t('Đăng nhập', 'Sign in'),
    loginSubtitle: t(
        'Nhập số điện thoại hoặc email để tiếp tục.',
        'Enter your phone number or email to continue.',
    ),
    identifierLabel: t('Số điện thoại / Email', 'Phone number / Email'),
    identifierPlaceholder: t('0901234567', '0901234567'),
    otpLabel: t('Mã xác thực', 'Verification code'),
    otpSentTo: t('Mã đã gửi tới', 'Code sent to'),
    otpDemoHint: t(
        'Bản demo: nhập mã 1234',
        'Demo mode: enter code 1234',
    ),
    otpResend: t('Gửi lại mã', 'Resend code'),
    changeIdentifier: t('Đổi số khác', 'Use another number'),
    backHome: t('Về trang chủ', 'Back to home'),
    loginRequired: t(
        'Đăng nhập để tiếp tục đặt phòng',
        'Sign in to continue your booking',
    ),
    loginDemoStaff: t('Đăng nhập nhanh (demo)', 'Quick sign-in (demo)'),

    // lỗi đăng nhập
    errIdentifierInvalid: t(
        'Số điện thoại hoặc email không hợp lệ.',
        'Phone number or email is not valid.',
    ),
    errOtpWrong: t('Mã xác thực không đúng.', 'Verification code is incorrect.'),
    errAccountDisabled: t('Tài khoản đã bị khoá.', 'This account is disabled.'),

    // --------------------------------------------------- luồng đặt phòng
    bookNow: t('Đặt phòng', 'Book now'),
    searchRooms: t('Tìm phòng', 'Search rooms'),
    checkIn: t('Nhận phòng', 'Check-in'),
    checkOut: t('Trả phòng', 'Check-out'),
    stepSearch: t('Tìm phòng', 'Search'),
    stepSelect: t('Chọn phòng', 'Select'),
    stepGuest: t('Thông tin', 'Details'),
    stepPayment: t('Thanh toán', 'Payment'),
    stepDone: t('Hoàn tất', 'Done'),

    selectRoom: t('Chọn phòng này', 'Select this room'),
    selected: t('Đã chọn', 'Selected'),
    ratePlan: t('Gói giá', 'Rate plan'),
    addons: t('Dịch vụ thêm', 'Extra services'),
    promoCode: t('Mã khuyến mãi', 'Promo code'),
    promoPlaceholder: t('Nhập mã nếu có', 'Enter code if you have one'),
    applyPromo: t('Áp dụng', 'Apply'),
    promoInvalid: t('Mã không hợp lệ hoặc đã hết hạn.', 'Code is invalid or expired.'),
    promoApplied: t('Đã áp dụng mã', 'Code applied'),

    // giá
    priceSummary: t('Tóm tắt giá', 'Price summary'),
    roomCharge: t('Tiền phòng', 'Room charge'),
    extraBed: t('Giường phụ', 'Extra bed'),
    childCharge: t('Phụ phí trẻ em', 'Child surcharge'),
    subtotal: t('Tạm tính', 'Subtotal'),
    discount: t('Khuyến mãi', 'Discount'),
    totalAmount: t('Thành tiền', 'Total'),
    deposit: t('Cọc phải trả ngay', 'Deposit due now'),
    balanceDue: t('Còn lại trả tại quầy', 'Balance due at property'),
    includedFree: t('Miễn phí', 'Free'),

    // thông tin khách
    guestInfo: t('Thông tin người đặt', 'Guest details'),
    fullName: t('Họ và tên', 'Full name'),
    phone: t('Số điện thoại', 'Phone number'),
    email: t('Email', 'Email'),
    idNumber: t('CCCD / Hộ chiếu', 'ID / Passport'),
    arrivalTime: t('Giờ đến dự kiến', 'Estimated arrival time'),
    arrivalHint: t(
        'Nam Du phụ thuộc chuyến tàu — cho chúng tôi biết để giữ phòng.',
        'Nam Du depends on ferry schedules — let us know so we can hold your room.',
    ),
    specialRequests: t('Yêu cầu đặc biệt', 'Special requests'),
    specialRequestsHint: t(
        'Trăng mật, sinh nhật, ăn chay, phòng yên tĩnh…',
        'Honeymoon, birthday, vegetarian meals, quiet room…',
    ),
    needInvoice: t('Xuất hoá đơn VAT', 'Request VAT invoice'),
    taxCode: t('Mã số thuế', 'Tax code'),
    companyName: t('Tên công ty', 'Company name'),

    // lỗi form
    errNameRequired: t('Vui lòng nhập họ tên.', 'Please enter your full name.'),
    errPhoneRequired: t(
        'Số điện thoại không hợp lệ. Ví dụ: 0901234567',
        'Phone number is not valid. Example: 0901234567',
    ),
    errEmailInvalid: t('Email không hợp lệ.', 'Email is not valid.'),

    // thanh toán
    paymentMethod: t('Phương thức thanh toán', 'Payment method'),
    payBankTransfer: t('Chuyển khoản ngân hàng', 'Bank transfer'),
    payCard: t('Thẻ tín dụng / ghi nợ', 'Credit / debit card'),
    payMomo: t('Ví MoMo', 'MoMo wallet'),
    payAtProperty: t('Thanh toán tại quầy', 'Pay at property'),
    paymentDemoNote: t(
        'Đây là bản demo — không có giao dịch thật nào được thực hiện.',
        'This is a demo — no real transaction will be processed.',
    ),
    completeBooking: t('Xác nhận đặt phòng', 'Confirm booking'),

    // hoàn tất
    bookingSuccess: t('Đặt phòng thành công', 'Booking confirmed'),
    bookingCode: t('Mã đơn', 'Booking code'),
    successNote: t(
        'Chúng tôi đã gửi xác nhận tới email của bạn. Xuất trình mã đơn khi nhận phòng.',
        'We have sent a confirmation to your email. Show your booking code at check-in.',
    ),
    viewMyOrders: t('Xem đơn của tôi', 'View my bookings'),

    // ------------------------------------------------------ đơn của tôi
    myOrders: t('Đơn của tôi', 'My bookings'),
    tabUpcoming: t('Sắp tới', 'Upcoming'),
    tabPast: t('Đã ở', 'Past'),
    tabCancelled: t('Đã huỷ', 'Cancelled'),
    noBookings: t(
        'Chưa có đơn nào. Chọn ngày và tìm phòng để bắt đầu.',
        'No bookings yet. Pick your dates and search for rooms to get started.',
    ),
    cancelBooking: t('Huỷ đơn', 'Cancel booking'),
    cancelConfirmTitle: t('Huỷ đơn này?', 'Cancel this booking?'),
    refundAmount: t('Số tiền được hoàn', 'Refund amount'),
    bookAgain: t('Đặt lại', 'Book again'),
    bookingTimeline: t('Diễn biến đơn', 'Booking timeline'),

    // thông báo
    notifications: t('Thông báo', 'Notifications'),
    markAllRead: t('Đọc hết', 'Mark all read'),
    noNotifications: t('Chưa có thông báo nào.', 'No notifications yet.'),

    // ---------------------------------------------------------------- CMS
    adminPanel: t('Quản trị', 'Admin'),
    dashboard: t('Bảng hôm nay', 'Today'),
    orders: t('Đơn hàng', 'Bookings'),
    inventoryCalendar: t('Lịch tồn kho', 'Rates & availability'),
    customers: t('Khách hàng', 'Customers'),
    promotions: t('Khuyến mãi', 'Promotions'),
    housekeeping: t('Buồng phòng', 'Housekeeping'),
    contentMgmt: t('Nội dung', 'Content'),
    accounts: t('Tài khoản', 'Accounts'),
    activityLog: t('Nhật ký hoạt động', 'Activity log'),
    viewSite: t('Xem website', 'View site'),

    arrivals: t('Khách đến hôm nay', 'Arrivals today'),
    departures: t('Khách đi hôm nay', 'Departures today'),
    inHouse: t('Đang lưu trú', 'In-house'),
    occupancy: t('Công suất phòng', 'Occupancy'),
    revenue: t('Doanh thu', 'Revenue'),
    pendingReview: t('Chờ xác nhận', 'Awaiting confirmation'),

    doCheckIn: t('Nhận phòng', 'Check in'),
    doCheckOut: t('Trả phòng', 'Check out'),
    doConfirm: t('Xác nhận đơn', 'Confirm booking'),
    markNoShow: t('Đánh dấu vắng mặt', 'Mark as no-show'),
    assignRoom: t('Gán phòng', 'Assign room'),
    actualGuests: t('Số khách thực tế', 'Actual guests'),
    earlyCheckIn: t('Nhận phòng sớm', 'Early check-in'),
    lateCheckOut: t('Trả phòng muộn', 'Late check-out'),
    vehiclePlate: t('Biển số xe', 'Vehicle plate'),
    staffNote: t('Ghi chú lễ tân', 'Staff note'),
    incidentals: t('Phát sinh tại phòng', 'Incidental charges'),
    addIncidental: t('Thêm khoản phát sinh', 'Add charge'),
    settled: t('Đã thanh toán đủ', 'Fully settled'),
    settledHint: t(
        'Chưa tích thì không đóng được đơn — tiền phát sinh sẽ mất khỏi sổ sách.',
        'Cannot close the booking until checked — otherwise charges vanish from the books.',
    ),
    closingComment: t('Nhận xét kết thúc', 'Closing comment'),
    guestRating: t('Đánh giá khách (nội bộ)', 'Guest rating (internal)'),

    // tồn kho
    availableUnits: t('Còn trống', 'Available'),
    totalUnits: t('Tổng phòng', 'Total rooms'),
    blockedUnits: t('Khoá bảo trì', 'Blocked'),
    priceOverride: t('Đè giá ngày này', 'Override price'),
    priceOverrideHint: t(
        'Có giá trị thì THAY THẾ hẳn giá tính theo mùa, không cộng dồn.',
        'When set, this REPLACES the seasonal price entirely — it does not stack.',
    ),
    minNights: t('Số đêm tối thiểu', 'Minimum nights'),
    closedToArrival: t('Cấm nhận phòng', 'Closed to arrival'),
    closedToDeparture: t('Cấm trả phòng', 'Closed to departure'),
    versionConflict: t(
        'Ô này vừa được người khác sửa. Tải lại rồi thử lại.',
        'Someone else just changed this cell. Reload and try again.',
    ),

    // khuyến mãi
    newPromotion: t('Thêm khuyến mãi', 'New promotion'),
    promoName: t('Tên chương trình', 'Programme name'),
    promoDescription: t('Mô tả cho khách', 'Description shown to guests'),
    promoType: t('Kiểu khuyến mãi', 'Promotion type'),
    promoValue: t('Giá trị', 'Value'),
    promoCodeField: t('Mã khuyến mãi', 'Promo code'),
    promoCodeHint: t(
        'Có mã: khách phải nhập mới được giảm. Bỏ trống: tự động áp khi thoả điều kiện.',
        'With a code: guests must enter it. Leave blank: applied automatically when conditions match.',
    ),
    stackable: t('Cộng dồn với khuyến mãi khác', 'Stack with other promotions'),
    stackableHint: t(
        'Bật: cộng dồn được. Tắt: nếu đơn thoả nhiều khuyến mãi, CHỈ khuyến mãi này được áp và mọi cái khác bị huỷ.',
        'On: stacks with others. Off: if several promotions match, ONLY this one applies and all others are dropped.',
    ),
    priority: t('Thứ tự áp dụng', 'Priority'),
    priorityHint: t(
        'Số nhỏ áp trước. Cũng quyết định ai thắng khi có nhiều khuyến mãi độc quyền cùng thoả.',
        'Lower number applies first. Also decides the winner among competing exclusive promotions.',
    ),
    maxDiscount: t('Trần giảm giá', 'Maximum discount'),
    maxDiscountHint: t(
        'Ví dụ "giảm 20% nhưng tối đa 500.000đ". Bỏ trống là không giới hạn.',
        'For example "20% off, capped at 500,000₫". Leave blank for no cap.',
    ),
    usageLimit: t('Giới hạn lượt dùng', 'Usage limit'),
    perCustomerLimit: t('Mỗi khách tối đa', 'Per-guest limit'),
    conditionsTitle: t('Điều kiện áp dụng', 'Conditions'),
    stayWindow: t('Khoảng ngày ở', 'Stay window'),
    bookWindow: t('Khoảng ngày đặt', 'Booking window'),
    appliesToRooms: t('Áp cho hạng phòng', 'Applies to room types'),
    appliesToRoomsHint: t(
        'Không chọn gì = áp cho mọi hạng phòng.',
        'Select nothing = applies to all room types.',
    ),
    minAmountLabel: t('Đơn tối thiểu', 'Minimum order value'),
    daysBeforeLabel: t('Số ngày trước khi nhận phòng', 'Days before check-in'),
    previewTitle: t('Xem trước cách tính', 'Preview the calculation'),
    previewHint: t(
        'Nhập thử một kịch bản để xem đúng bảng giá mà khách sẽ thấy.',
        'Try a scenario to see exactly the price breakdown a guest would get.',
    ),
    conflictWarning: t('Cảnh báo xung đột', 'Conflict warning'),
    conflictBothExclusive: t(
        'Hai khuyến mãi này đều độc quyền và cùng phủ một khoảng ngày. Chỉ một cái được áp.',
        'Both promotions are exclusive and cover the same dates. Only one will apply.',
    ),
    conflictSamePriority: t(
        'Hai khuyến mãi trùng thứ tự áp dụng — kết quả có thể không ổn định.',
        'Two promotions share the same priority — results may be unstable.',
    ),
    winnerIs: t('Sẽ thắng', 'Winner'),
    applyOrder: t('Thứ tự áp dụng hiện tại', 'Current application order'),
    noPromotions: t(
        'Chưa có khuyến mãi nào. Bấm "Thêm khuyến mãi" để tạo chương trình đầu tiên.',
        'No promotions yet. Click "New promotion" to create your first one.',
    ),
    remainingAfter: t('Còn lại', 'Remaining'),
    cappedNote: t('đã cắt theo trần', 'capped'),
} satisfies Record<string, I18nText>

// ============================================================== bảng tra mã

export const STATUS_LABEL: Record<BookingStatus, I18nText> = {
    pending_payment: t('Chờ thanh toán', 'Awaiting payment'),
    confirmed: t('Đã xác nhận', 'Confirmed'),
    checked_in: t('Đang lưu trú', 'Checked in'),
    checked_out: t('Đã trả phòng', 'Checked out'),
    cancelled: t('Đã huỷ', 'Cancelled'),
    no_show: t('Vắng mặt', 'No-show'),
    expired: t('Hết hạn giữ chỗ', 'Hold expired'),
}

export const STATUS_TONE: Record<
    BookingStatus,
    'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
    pending_payment: 'warning',
    confirmed: 'info',
    checked_in: 'success',
    checked_out: 'neutral',
    cancelled: 'danger',
    no_show: 'danger',
    expired: 'neutral',
}

export const UNIT_STATUS_LABEL: Record<RoomUnitStatus, I18nText> = {
    available: t('Sẵn sàng', 'Available'),
    occupied: t('Có khách', 'Occupied'),
    dirty: t('Chờ dọn', 'Needs cleaning'),
    cleaning: t('Đang dọn', 'Being cleaned'),
    maintenance: t('Bảo trì', 'Maintenance'),
}

export const UNIT_STATUS_TONE: Record<
    RoomUnitStatus,
    'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
    available: 'success',
    occupied: 'info',
    dirty: 'warning',
    cleaning: 'warning',
    maintenance: 'danger',
}

export const ROLE_LABEL: Record<Role, I18nText> = {
    owner: t('Chủ sở hữu', 'Owner'),
    manager: t('Quản lý', 'Manager'),
    receptionist: t('Lễ tân', 'Receptionist'),
    editor: t('Biên tập', 'Editor'),
    customer: t('Khách hàng', 'Customer'),
}

export const PROMO_TYPE_LABEL: Record<PromotionType, I18nText> = {
    percent: t('Giảm theo %', 'Percentage off'),
    fixed: t('Giảm số tiền cố định', 'Fixed amount off'),
    'nth-night-free': t('Đêm thứ N miễn phí', 'Nth night free'),
    'long-stay': t('Ở dài ngày', 'Long stay'),
    'early-bird': t('Đặt sớm', 'Early bird'),
    'last-minute': t('Đặt sát ngày', 'Last minute'),
    'free-addon': t('Tặng dịch vụ', 'Free service'),
}

/** Giải thích từng kiểu khuyến mãi — hiện ngay dưới ô chọn kiểu trong CMS. */
export const PROMO_TYPE_HINT: Record<PromotionType, I18nText> = {
    percent: t(
        'Giảm phần trăm trên số tiền còn lại. Ví dụ: giảm 10% hạng Bungalow trong tháng 9.',
        'Percentage off the remaining amount. Example: 10% off Bungalow in September.',
    ),
    fixed: t(
        'Trừ thẳng một số tiền. Không bao giờ trừ quá số tiền còn lại của đơn.',
        'Subtracts a fixed amount. Never exceeds the remaining order value.',
    ),
    'nth-night-free': t(
        'Tặng một đêm khi ở đủ N đêm. Hệ thống tặng đêm RẺ NHẤT trong kỳ, không phải đêm cuối.',
        'One free night when staying N nights. The CHEAPEST night is discounted, not the last one.',
    ),
    'long-stay': t(
        'Giảm theo bậc số đêm. Ở càng lâu giảm càng nhiều; lấy bậc cao nhất còn thoả.',
        'Tiered discount by length of stay. The highest matching tier applies.',
    ),
    'early-bird': t(
        'Giảm khi khách đặt TRƯỚC ngày nhận phòng ít nhất N ngày.',
        'Discount when booking at least N days BEFORE arrival.',
    ),
    'last-minute': t(
        'Giảm khi khách đặt TRONG VÒNG N ngày trước khi nhận phòng. Dùng để xả phòng ế.',
        'Discount when booking WITHIN N days of arrival. Used to sell remaining rooms.',
    ),
    'free-addon': t(
        'Tặng kèm một dịch vụ. Giá trị dịch vụ được trừ khỏi tổng đơn.',
        'Bundles a free service. Its value is deducted from the total.',
    ),
}

export const BLOCK_REASON_LABEL: Record<AvailabilityBlockReason, I18nText> = {
    'sold-out': t('Hết phòng cho ngày đã chọn', 'Sold out for the selected dates'),
    'min-nights': t('Chưa đủ số đêm tối thiểu', 'Below the minimum stay'),
    'closed-to-arrival': t('Không nhận phòng ngày này', 'No arrivals on this date'),
    'closed-to-departure': t('Không trả phòng ngày này', 'No departures on this date'),
    'capacity-exceeded': t('Vượt sức chứa của hạng phòng', 'Exceeds this room type capacity'),
}

export const REJECT_REASON_LABEL: Record<PromotionRejectReason, I18nText> = {
    inactive: t('Đang tắt', 'Switched off'),
    'code-required': t('Cần nhập mã', 'Requires a code'),
    'code-mismatch': t('Mã không khớp', 'Code does not match'),
    'stay-window': t('Ngoài khoảng ngày ở', 'Outside the stay window'),
    'book-window': t('Ngoài khoảng ngày đặt', 'Outside the booking window'),
    'room-type': t('Không áp cho hạng phòng này', 'Not valid for this room type'),
    'rate-plan': t('Không áp cho gói giá này', 'Not valid for this rate plan'),
    'min-nights': t('Chưa đủ số đêm tối thiểu', 'Below the minimum nights'),
    'max-nights': t('Vượt số đêm tối đa', 'Above the maximum nights'),
    'min-amount': t('Chưa đạt giá trị đơn tối thiểu', 'Below the minimum order value'),
    weekday: t('Không rơi vào thứ được áp', 'Nights fall outside allowed weekdays'),
    'lead-time': t('Không đúng thời điểm đặt', 'Booking lead time does not match'),
    channel: t('Không áp cho kênh này', 'Not valid for this channel'),
    'usage-limit': t('Đã hết lượt dùng', 'Usage limit reached'),
    'per-customer-limit': t('Khách đã dùng hết lượt', 'Guest has used all allowed times'),
    'superseded-by-exclusive': t(
        'Bị khuyến mãi độc quyền loại bỏ',
        'Dropped by an exclusive promotion',
    ),
}

export const NOTIFICATION_TITLE: Record<NotificationKind, I18nText> = {
    'booking-created': t('Đã tạo đơn', 'Booking created'),
    'payment-success': t('Thanh toán thành công', 'Payment successful'),
    'booking-confirmed': t('Đơn đã được xác nhận', 'Booking confirmed'),
    'booking-cancelled': t('Đơn đã huỷ', 'Booking cancelled'),
    'check-in-reminder': t('Sắp tới ngày nhận phòng', 'Check-in coming up'),
    'review-request': t('Mời đánh giá kỳ nghỉ', 'Tell us about your stay'),
}

// ================================================================ tiện ích

/** Lấy đúng ngôn ngữ. Rút gọn `pick(S.xxx, locale)` thành `tr(S.xxx, locale)`. */
export function tr(text: I18nText, locale: Locale): string {
    return text[locale] ?? text.vi
}
