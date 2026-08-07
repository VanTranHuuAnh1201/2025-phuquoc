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
import type { CmsTone } from '@repo/cms-ui'
import type {
    AvailabilityBlockReason,
    BookingStatus,
    Channel,
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
    language: t('Ngôn ngữ', 'Language'),
    paginationPrev: t('Trước', 'Prev'),
    paginationNext: t('Sau', 'Next'),
    paginationPageSize: t('Dòng/trang:', 'Rows per page:'),
    paginationSummary: t('Hiển thị', 'Showing'),
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
        'Nhập email và mật khẩu để tiếp tục.',
        'Enter your email and password to continue.',
    ),
    emailLabel: t('Email', 'Email'),
    emailPlaceholder: t('ten@example.com', 'name@example.com'),
    passwordLabel: t('Mật khẩu', 'Password'),
    passwordPlaceholder: t('Ít nhất 8 ký tự', 'At least 8 characters'),
    backHome: t('Về trang chủ', 'Back to home'),
    loginRequired: t(
        'Đăng nhập để tiếp tục đặt phòng',
        'Sign in to continue your booking',
    ),
    loginProcessing: t('Đang đăng nhập…', 'Signing in…'),

    // ------------------------------------------------------- đăng ký
    registerTitle: t('Tạo tài khoản', 'Create account'),
    registerSubtitle: t(
        'Điền thông tin để đặt phòng nhanh hơn ở những lần sau.',
        'Fill in your details to book faster next time.',
    ),
    register: t('Đăng ký', 'Sign up'),
    registerProcessing: t('Đang tạo tài khoản…', 'Creating account…'),
    fullNameLabel: t('Họ và tên', 'Full name'),
    fullNamePlaceholder: t('Nguyễn Văn A', 'John Smith'),
    phoneLabel: t('Số điện thoại', 'Phone number'),
    phonePlaceholder: t('0901234567', '0901234567'),
    tabLogin: t('Đăng nhập', 'Sign in'),
    tabRegister: t('Đăng ký', 'Sign up'),
    noAccountYet: t('Chưa có tài khoản?', "Don't have an account?"),
    hadAccount: t('Đã có tài khoản?', 'Already have an account?'),

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
    stepperLabel: t('Các bước đặt phòng', 'Booking steps'),
    /** `{n}` và `{total}` được thay bằng số ở nơi hiển thị. */
    stepOf: t('Bước {n}/{total}', 'Step {n} of {total}'),

    /** `{count}` được thay bằng số hạng phòng còn trống. */
    roomsAvailable: t('{count} hạng phòng còn trống', '{count} room types available'),
    /** Trạng thái rỗng phải nói rõ LÀM GÌ TIẾP, không chỉ báo "không có kết
     *  quả" (luật FE7). `{range}` là khoảng ngày khách đang chọn. */
    soldOutForDates: t(
        'Hết phòng cho {range}. Thử ngày khác hoặc giảm số khách.',
        'Sold out for {range}. Try different dates or reduce the number of guests.',
    ),

    // thanh tóm tắt giá thu gọn trên mobile
    showPriceDetails: t('Xem chi tiết giá', 'Show price details'),
    hidePriceDetails: t('Ẩn chi tiết giá', 'Hide price details'),

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
    checkInCodeHint: t(
        'Đọc mã này cho lễ tân khi nhận phòng',
        'Read this code to reception at check-in',
    ),
    bookingNotFound: t('Không tìm thấy đơn', 'Booking not found'),
    bookingNotFoundHint: t(
        'Liên kết có thể đã cũ hoặc sai mã. Mở "Đơn của tôi" để xem toàn bộ đơn đã đặt.',
        'This link may be outdated or the code is wrong. Open "My bookings" to see all your bookings.',
    ),

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
    customersSearchPlaceholder: t('Tìm tên, SĐT, email…', 'Search name, phone, email…'),
    customersTierAll: t('Tất cả phân hạng', 'All tiers'),
    customersTierVip: t('VIP (>10 triệu)', 'VIP (>10m VND)'),
    customersTierReturning: t('Quay lại (>1 lần)', 'Returning (>1 stay)'),
    customersTierNew: t('Khách mới (1 lần)', 'New guests (1 stay)'),
    customersBadgeVip: t('Khách VIP', 'VIP guest'),
    customersBadgeReturning: t('Quay lại', 'Returning'),
    customersBadgeNew: t('Khách mới', 'New guest'),
    customersColGuestPhone: t('KHÁCH HÀNG & SĐT', 'GUEST & PHONE'),
    customersColTier: t('PHÂN HẠNG', 'TIER'),
    customersColBookings: t('SỐ ĐƠN', 'BOOKINGS'),
    customersColStays: t('ĐÃ Ở', 'STAYS'),
    customersColSpent: t('TỔNG CHI TIÊU', 'TOTAL SPENT'),
    customersNightsUnit: t('đêm', 'nights'),
    customersKpiTotal: t('TẤT CẢ KHÁCH', 'TOTAL GUESTS'),
    customersKpiReturning: t('KHÁCH QUAY LẠI', 'RETURNING GUESTS'),
    customersKpiVip: t('KHÁCH VIP (>10TR)', 'VIP (>10M VND)'),
    customersKpiNew: t('KHÁCH MỚI (1 LẦN)', 'NEW GUESTS (1 STAY)'),
    customersKpiAvgSpent: t('CHI TIÊU TB / KHÁCH', 'AVG SPEND / GUEST'),
    customersEmptySearch: t('Không tìm thấy khách nào.', 'No guests found.'),
    customersEmptyAll: t('Chưa có khách hàng nào.', 'No guests yet.'),
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
    roomBalanceDue: t('Còn nợ tiền phòng', 'Room balance due'),
    incidentalChargesTotal: t('Phát sinh tại phòng', 'Incidental charges'),
    lateCheckOutSurcharge: t('Phụ phí trả phòng muộn', 'Late check-out surcharge'),
    totalDueNow: t('TỔNG PHẢI THU BÂY GIỜ', 'TOTAL DUE NOW'),
    collectedAmountLabel: t('Số tiền thu thêm thực tế', 'Actual collected amount'),
    collectedAmountHint: t('Tự tính từ phát sinh + trả muộn. Sửa được nếu miễn giảm cho khách.', 'Calculated from incidentals + late fee. Editable for discounts.'),
    unsettledWarningText: t(
        'Chưa thu đủ {amount}đ. Tick "Đã thanh toán đủ" sau khi nhận tiền, hoặc ghi phần còn nợ vào Nhận xét kết thúc.',
        'Outstanding balance of {amount} VND. Check "Fully settled" after receiving payment, or note balance in Closing comment.',
    ),
    internalRatingHint: t('Chỉ hiển thị nội bộ, khách không nhìn thấy.', 'Internal view only, guests cannot see this.'),

    // ------------------------------------------------- tạo đơn thủ công (CMS)
    newBooking: t('Tạo đơn thủ công', 'New booking'),
    newBookingSubtitle: t(
        'Lễ tân nhập đơn hộ khách gọi điện hoặc tới thẳng quầy. Giá tính bằng đúng engine của web — không gõ tay tổng tiền.',
        'Reception enters a booking on behalf of a guest calling in or walking up. Prices come from the same engine as the website — totals are never typed by hand.',
    ),
    stayDetails: t('Kỳ lưu trú', 'Stay details'),
    channel: t('Kênh đặt', 'Booking channel'),
    channelHint: t(
        'Dùng cho báo cáo nguồn khách. Chọn đúng kênh thật khách đã liên hệ.',
        'Used for source-of-business reporting. Pick the channel the guest actually used.',
    ),
    channelPhone: t('Điện thoại', 'Phone'),
    channelWalkIn: t('Tới thẳng quầy', 'Walk-in'),
    channelWeb: t('Website', 'Website'),
    channelOta: t('Kênh OTA', 'OTA'),
    roomTypeLabel: t('Hạng phòng', 'Room type'),
    selectRoomFirst: t(
        'Chọn hạng phòng và khoảng ngày để xem giá.',
        'Pick a room type and dates to see the price.',
    ),
    createBookingCta: t('Tạo đơn', 'Create booking'),
    creatingBooking: t('Đang tạo đơn…', 'Creating booking…'),
    priceReadOnlyHint: t(
        'Tổng tiền do hệ thống tính, không sửa tay được. Cần giá khác thì dùng mã khuyến mãi.',
        'The total is calculated by the system and cannot be edited. Use a promo code if a different price is needed.',
    ),
    priceEditNoPermission: t(
        'Tài khoản của bạn không có quyền sửa giá.',
        'Your account cannot edit prices.',
    ),
    exportExcel: t('Xuất Excel', 'Export Excel'),
    selectedCount: t('đã chọn', 'selected'),
    clearSelection: t('Bỏ chọn', 'Clear selection'),
    selectAllRows: t('Chọn tất cả đơn trong trang', 'Select all bookings on this page'),
    emptyFilterBookings: t(
        'Chưa có đơn nào khớp bộ lọc. Bấm Đặt lại để xem tất cả.',
        'No bookings match the filters. Click Reset to view all.',
    ),
    resetFilters: t('Đặt lại bộ lọc', 'Reset filters'),
    searchBookingsAria: t(
        'Tìm đơn theo mã, tên khách hoặc số điện thoại',
        'Search bookings by code, guest name or phone',
    ),
    filterChannelAria: t('Lọc theo kênh đặt', 'Filter by channel'),
    filterStatusAria: t('Lọc theo trạng thái đơn', 'Filter by booking status'),
    filterRoomTypeAria: t('Lọc theo hạng phòng', 'Filter by room type'),
    viewBookingAria: t('Xem đơn', 'View booking'),
    allChannelsBooking: t('Tất cả kênh', 'All channels'),
    allRoomTypes: t('Tất cả hạng phòng', 'All room types'),
    housekeepingSearchPlaceholder: t('Tìm mã phòng (P-101)…', 'Search room code…'),
    housekeepingSearchAria: t('Tìm phòng theo mã hoặc hạng phòng', 'Search rooms by code or room type'),
    housekeepingRoomSuffix: t('phòng', 'rooms'),
    housekeepingAvailableShort: t('Sẵn sàng', 'Ready'),
    housekeepingOccupiedShort: t('Đang ở', 'Occupied'),
    housekeepingDirtyShort: t('Cần dọn', 'Needs cleaning'),
    housekeepingLocked: t('Khoá — trả phòng ở trang Đặt phòng', 'Locked — check out from the Bookings page'),
    housekeepingNextStatus: t('Bấm để chuyển sang', 'Tap to move to'),
    housekeepingEmpty: t(
        'Không có phòng nào ở tình trạng này. Bấm lại ô đã chọn để bỏ lọc.',
        'No rooms match this status. Tap the selected filter again to clear it.',
    ),
    kpiAllChannels: t('TẤT CẢ KÊNH', 'ALL CHANNELS'),
    kpiChannelWeb: t('WEBSITE', 'WEBSITE'),
    kpiChannelWalkIn: t('VÃNG LAI', 'WALK-IN'),
    kpiChannelOta: t('OTA', 'OTA'),
    kpiChannelPhone: t('HOTLINE', 'PHONE'),


    // lỗi ghi dữ liệu — mỗi mã một câu riêng, cấm gộp thành "Có lỗi xảy ra"
    errNotFound: t(
        'Không tìm thấy đơn. Có thể đơn vừa bị xoá ở máy khác — tải lại trang.',
        'Booking not found. It may have just been removed elsewhere — reload the page.',
    ),
    errInvalidTransition: t(
        'Đơn vừa đổi trạng thái ở nơi khác. Tải lại trang rồi thao tác lại.',
        'This booking changed status elsewhere. Reload the page and try again.',
    ),
    errUnitUnavailable: t(
        'Phòng đã chọn không còn trống. Chọn phòng khác trong danh sách.',
        'The selected room is no longer available. Pick another one from the list.',
    ),
    errSoldOut: t(
        'Hết phòng cho ngày đã chọn. Đổi ngày hoặc chọn hạng phòng khác.',
        'Sold out for the selected dates. Change the dates or pick another room type.',
    ),
    reloadPage: t('Tải lại trang', 'Reload page'),

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
    stackableShort: t('Cộng dồn', 'Stackable'),
    exclusiveShort: t('Độc quyền', 'Exclusive'),
    autoApplied: t('Tự động áp dụng', 'Automatic'),
    statusActive: t('Đang chạy', 'Active'),
    statusDisabled: t('Đã tắt', 'Disabled'),
    allDates: t('Tất cả các ngày', 'All dates'),
    allTypes: t('Tất cả loại', 'All types'),


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
    clickToDisable: t('Bấm để tắt', 'Click to disable'),
    clickToEnable: t('Bấm để bật', 'Click to enable'),
    activePromoCount: t('đang bật', 'active'),
    totalPromoCount: t('mã', 'promos'),
    kpiTotalPromos: t('TỔNG CHƯƠNG TRÌNH', 'TOTAL PROMOS'),
    kpiActivePromos: t('ĐANG KÍCH HOẠT', 'ACTIVE'),
    kpiStackablePromos: t('CHO PHÉP CỘNG DỒN', 'STACKABLE'),
    kpiTotalUsage: t('TỔNG LƯỢT ĐÃ DÙNG', 'TOTAL USAGE'),
    kpiConflicts: t('XUNG ĐỘT PHÁT HIỆN', 'CONFLICTS FOUND'),
    kpiUnitPromo: t('mã', 'promos'),
    kpiUnitTurns: t('lượt', 'uses'),
    kpiUnitWarnings: t('cảnh báo', 'warnings'),
    searchPromoPlaceholder: t('Tìm tên, mã…', 'Search name, code…'),
    formulaBreakdownTitle: t('1. Công thức giảm giá', '1. Discount formula'),
    stackingRulesTitle: t('2. Quy tắc thứ tự & cộng dồn', '2. Priority & stacking rules'),
    conditionsAppliedTitle: t('3. Điều kiện áp dụng', '3. Conditions applied'),
    priorityOrderLabel: t('Thứ tự ưu tiên', 'Priority order'),
    priorityValueLabel: t('Độ ưu tiên #{value}', 'Priority #{value}'),
    stackingModeLabel: t('Chế độ cộng dồn', 'Stacking mode'),
    stayWindowConditionLabel: t('Khung ngày ở', 'Stay window'),
    minNightsRequiredLabel: t('Yêu cầu số đêm tối thiểu', 'Minimum nights required'),
    nightsUnit: t('đêm', 'nights'),
    minAmountRequiredLabel: t('Giá trị đơn tối thiểu', 'Minimum order value'),
    usageLimitReachedLabel: t('Giới hạn số lần dùng', 'Usage limit'),
    turnsUnit: t('lượt', 'uses'),
    promosNotAppliedLabel: t('Khuyến mãi không đủ điều kiện', 'Promotions not applied'),

    // ------------------------------------------- CMS dữ liệu nền (100-04/100-05)
    roomTypesTitle: t('Hạng phòng & Giá gốc', 'Room Types & Base Rates'),
    roomTypesCount: t('hạng phòng', 'room types'),
    addRoomType: t('Thêm hạng phòng', 'Add room type'),
    editRoomType: t('Cập nhật hạng phòng', 'Edit room type'),
    searchRoomType: t('Tìm mã hạng, tên hạng phòng…', 'Search by ID or room type name…'),
    colRoomCode: t('Mã hạng', 'Type ID'),
    /** Nhãn ô nhập mã trong form — nói rõ hơn nhãn cột để không trùng tên
     *  với ô tìm kiếm khi đọc bằng screen reader. */
    idFieldLabel: t('Mã định danh (slug)', 'Identifier (slug)'),
    idFieldHint: t(
        'Chỉ chữ thường, số và dấu gạch ngang. Không đổi được sau khi tạo.',
        'Lowercase letters, digits and hyphens only. Cannot be changed after creation.',
    ),
    colRoomName: t('Tên hạng phòng', 'Room type'),
    colCapacity: t('Sức chứa', 'Capacity'),
    colBasePrice: t('Giá gốc / đêm', 'Base rate / night'),
    colPhysicalUnits: t('Số phòng vật lý', 'Physical units'),
    colStatus: t('Trạng thái', 'Status'),
    colActions: t('Thao tác', 'Actions'),
    maxGuests: t('Sức chứa tối đa', 'Maximum capacity'),
    standardGuests: t('Số khách tiêu chuẩn', 'Standard occupancy'),
    childCapacityHint: t(
        'Số trẻ em tối đa = sức chứa tối đa trừ số khách tiêu chuẩn. Chính sách tính tiền theo tuổi ở màn Gói giá.',
        'Maximum children = maximum capacity minus standard occupancy. Age-based pricing lives on the Rate Plans screen.',
    ),
    onSale: t('Đang kinh doanh', 'On sale'),
    stoppedSelling: t('Ngưng bán', 'Stopped selling'),
    unitsSuffix: t('phòng', 'units'),
    displayArea: t('Diện tích hiển thị', 'Displayed area'),
    basePriceLabel: t('Giá gốc 1 đêm (VNĐ)', 'Base rate per night (VND)'),
    priceHiddenForRole: t(
        'Tài khoản của bạn không có quyền sửa giá. Các ô giá đã được ẩn.',
        'Your account cannot edit prices. Price fields are hidden.',
    ),
    emptyRoomTypes: t(
        'Không có hạng phòng nào khớp bộ lọc. Bấm "Đặt lại" để xem toàn bộ danh sách.',
        'No room types match the current filters. Click "Reset" to see the full list.',
    ),

    // hộp xác nhận đổi giá gốc (100-04 §6.7)
    confirmPriceChange: t('Xác nhận đổi giá gốc', 'Confirm base rate change'),
    priceChangeImpact: t('ngày chưa đặt giá riêng trong 30 ngày tới sẽ đổi theo giá mới.',
        'days in the next 30 days without a custom price will follow the new rate.'),
    bookingsUnaffected: t(
        'Đơn đã đặt KHÔNG đổi — tiền đã chốt tại thời điểm khách đặt.',
        'Existing bookings are UNCHANGED — amounts were locked when the guest booked.',
    ),

    // tài khoản & RBAC
    accountsTitle: t('Tài khoản & Phân quyền RBAC', 'Accounts & RBAC'),
    accountsCount: t('tài khoản', 'accounts'),
    addAccount: t('Thêm tài khoản', 'Add account'),
    searchAccount: t('Tìm tên đăng nhập, họ tên, email…', 'Search username, full name, email…'),
    colUsername: t('Tên đăng nhập & email', 'Username & email'),
    colFullName: t('Họ và tên người dùng', 'Full name'),
    colRole: t('Vai trò & quyền RBAC', 'Role & permissions'),
    colLastActive: t('Đăng nhập cuối', 'Last sign-in'),
    phoneShort: t('SĐT', 'Phone'),
    allRoles: t('Tất cả vai trò', 'All roles'),
    accountActive: t('Hoạt động', 'Active'),
    accountSuspended: t('Tạm khoá', 'Suspended'),
    accountInvited: t('Đã mời', 'Invited'),
    emptyAccounts: t(
        'Không có tài khoản nào khớp bộ lọc. Bấm "Đặt lại" để xem toàn bộ danh sách.',
        'No accounts match the filters. Click "Reset" to see the full list.',
    ),

    // gói giá (RatePlan)
    ratePlansTitle: t('Gói giá (Rate Plan)', 'Rate Plans'),
    ratePlansCount: t('gói giá', 'rate plans'),
    addRatePlan: t('Thêm gói giá', 'Add rate plan'),
    editRatePlan: t('Cập nhật gói giá', 'Edit rate plan'),
    searchRatePlan: t('Tìm mã, tên gói giá…', 'Search by ID or rate plan name…'),
    adjustPercentLabel: t('Điều chỉnh giá (%)', 'Price adjustment (%)'),
    adjustPercentHint: t(
        'So với giá gốc. −15 nghĩa là rẻ hơn 15%. Cho phép từ −100% đến +200%.',
        'Relative to the base rate. −15 means 15% cheaper. Allowed range: −100% to +200%.',
    ),
    depositPercentLabel: t('Cọc (%)', 'Deposit (%)'),
    perksLabel: t('Quyền lợi kèm', 'Included perks'),
    descriptionLabel: t('Mô tả cho khách', 'Guest-facing description'),
    includesBreakfast: t('Có ăn sáng', 'Breakfast included'),
    refundable: t('Cho phép huỷ hoàn tiền', 'Refundable'),
    nonRefundable: t('Không hoàn huỷ', 'Non-refundable'),
    refundableHint: t(
        'Tắt: khách không được hoàn tiền trong mọi trường hợp, bậc hoàn tiền bên dưới sẽ bị bỏ qua.',
        'Off: the guest never receives a refund and the tiers below are ignored.',
    ),
    refundTiers: t('Bậc hoàn tiền', 'Refund tiers'),
    refundTiersHint: t(
        'Xếp theo số ngày GIẢM DẦN. Hệ thống lấy bậc đầu tiên khớp để tính tiền hoàn hiện ngay trên nút Huỷ của khách.',
        'Ordered by DECREASING days. The first matching tier decides the refund shown on the guest cancel button.',
    ),
    daysBeforeCheckIn: t('Huỷ trước (ngày)', 'Days before check-in'),
    refundPercentLabel: t('Hoàn (%)', 'Refund (%)'),
    ratePlanEngineNote: t(
        'Gói giá chỉ điều chỉnh giá; tiền cuối cùng luôn do buildQuote() tính, không có công thức nào ở màn này.',
        'Rate plans only adjust the rate; the final amount is always computed by buildQuote(), never on this screen.',
    ),
    emptyRatePlans: t(
        'Không có gói giá nào khớp bộ lọc. Bấm "Đặt lại" hoặc "Thêm gói giá" để tạo mới.',
        'No rate plans match the filters. Click "Reset" or "Add rate plan" to create one.',
    ),

    // phụ thu & dịch vụ
    addonsTitle: t('Phụ thu & Dịch vụ thêm', 'Add-ons & Extra Services'),
    addonsCount: t('dịch vụ', 'services'),
    addAddon: t('Thêm dịch vụ', 'Add service'),
    editAddon: t('Cập nhật dịch vụ', 'Edit service'),
    searchAddon: t('Tìm mã, tên dịch vụ…', 'Search by ID or service name…'),
    colAddonUnit: t('Đơn vị tính', 'Unit'),
    addonUnitLabel: t('Đơn vị tính', 'Unit of measure'),
    addonUnitHint: t(
        'Ví dụ: "khách / đêm", "xe / ngày". Hiện ngay cạnh giá ở màn khách chọn dịch vụ.',
        'For example "guest / night", "vehicle / day". Shown next to the price when guests pick services.',
    ),
    emptyAddons: t(
        'Chưa có dịch vụ nào khớp bộ lọc. Bấm "Đặt lại" hoặc "Thêm dịch vụ" để tạo mới.',
        'No services match the filters. Click "Reset" or "Add service" to create one.',
    ),

    // cấu hình ngân hàng
    bankConfigTitle: t('Tài khoản nhận cọc', 'Deposit bank account'),
    bankName: t('Ngân hàng', 'Bank'),
    accountNumber: t('Số tài khoản', 'Account number'),
    accountHolder: t('Chủ tài khoản', 'Account holder'),
    defaultDepositPercent: t('Phần trăm cọc mặc định (%)', 'Default deposit percentage (%)'),
    bankSaved: t('Đã lưu tài khoản nhận cọc.', 'Deposit account saved.'),
    accountNumberHint: t(
        'Chỉ chữ số, 6–20 ký tự. Số này hiện cho khách ở bước thanh toán.',
        'Digits only, 6–20 characters. Guests see this number at the payment step.',
    ),
    ownerOnlyNotice: t(
        'Chỉ chủ cơ sở (owner) mới sửa được tài khoản nhận cọc.',
        'Only the property owner can change the deposit account.',
    ),

    // xoá / chặn xoá
    deleteRoomTypeConfirm: t('Xoá hạng phòng này?', 'Delete this room type?'),
    cannotDeleteInUse: t(
        'Không xoá được: còn đơn đang dùng mục này.',
        'Cannot delete: bookings still reference this item.',
    ),
    duplicateId: t('Mã này đã tồn tại. Chọn mã khác.', 'This ID already exists. Choose another.'),
    saving: t('Đang lưu…', 'Saving…'),
    saveFailed: t(
        'Không lưu được. Kiểm tra lại dữ liệu rồi bấm Lưu lại.',
        'Could not save. Check the data and click Save again.',
    ),
    fixErrorsFirst: t(
        'Còn ô chưa hợp lệ. Sửa các dòng báo đỏ rồi bấm Lưu lại.',
        'Some fields are invalid. Fix the messages in red and click Save again.',
    ),

    // lịch tồn kho — bộ chọn khoảng ngày
    dateRangeLabel: t('Khoảng ngày hiển thị', 'Visible date range'),
    days14: t('14 ngày', '14 days'),
    days30: t('30 ngày', '30 days'),
    previousRange: t('Khoảng trước', 'Previous range'),
    nextRange: t('Khoảng sau', 'Next range'),
    soldOutShort: t('Hết', 'Sold out'),
    lowStockShort: t('Sắp hết', 'Low'),
    priceReadOnly: t(
        'Chỉ đọc — tài khoản của bạn không sửa được giá.',
        'Read-only — your account cannot edit prices.',
    ),

    // ticket sự cố (100-05)
    ticketsTitle: t('Ticket Sự cố & Bảo trì', 'Incident & Maintenance Tickets'),
    ticketsCount: t('ticket', 'tickets'),
    newTicket: t('Báo sự cố mới', 'Report incident'),
    createTicket: t('Tạo ticket', 'Create ticket'),
    searchTicket: t('Tìm mã ticket, số phòng, nội dung…', 'Search ticket ID, room, description…'),
    colTicketCode: t('Mã ticket', 'Ticket ID'),
    colRoomUnit: t('Phòng vật lý', 'Room unit'),
    colIncident: t('Nội dung sự cố & mô tả', 'Incident & description'),
    colPriority: t('Mức độ ưu tiên', 'Priority'),
    colAssignee: t('Người xử lý', 'Assignee'),
    colTicketStatus: t('Trạng thái & chuyển bước', 'Status & next step'),
    reportedBy: t('Báo bởi', 'Reported by'),
    priorityLow: t('Bình thường', 'Low'),
    priorityMedium: t('Trung bình', 'Medium'),
    priorityHigh: t('Ưu tiên cao', 'High'),
    priorityUrgent: t('Khẩn cấp', 'Urgent'),
    ticketPending: t('Chờ tiếp nhận', 'Pending'),
    ticketInProgress: t('Đang sửa chữa', 'In progress'),
    ticketResolved: t('Đã hoàn thành', 'Resolved'),
    allPriorities: t('Tất cả mức ưu tiên', 'All priorities'),
    allStatuses: t('Tất cả trạng thái', 'All statuses'),
    ticketRoomLabel: t('Phòng vật lý bị ảnh hưởng', 'Affected room unit'),
    ticketTitleLabel: t('Tiêu đề sự cố', 'Incident title'),
    ticketDescLabel: t('Mô tả chi tiết sự cố', 'Detailed description'),
    ticketAssigneeLabel: t('Phân công người xử lý', 'Assign to'),
    ticketTitleRequired: t(
        'Nhập tiêu đề sự cố để đội kỹ thuật biết phải xử lý gì.',
        'Enter an incident title so the maintenance team knows what to fix.',
    ),
    emptyTickets: t(
        'Không có ticket nào khớp bộ lọc. Bấm "Đặt lại" để xem toàn bộ, hoặc "Báo sự cố mới".',
        'No tickets match the filters. Click "Reset" to see all, or "Report incident".',
    ),
    totalTickets: t('Tổng ticket sự cố', 'Total tickets'),
    urgentTickets: t('Khẩn cấp / báo gấp', 'Urgent / escalated'),
    needsActionNow: t('Cần xử lý ngay', 'Needs action now'),
    awaitingAssignment: t('Chờ phân công', 'Awaiting assignment'),
    inProgressNow: t('Đang thực hiện', 'In progress'),
    deleteTicketConfirm: t('Xoá ticket này?', 'Delete this ticket?'),

    // --- My Orders & booking
    paidStatus: t('Đã thanh toán', 'Paid'),
    cancelledAtLabel: t('Huỷ lúc', 'Cancelled at'),
    reasonLabel: t('Lý do', 'Reason'),
    cancelReasonLabel: t('Lý do huỷ', 'Reason for cancelling'),
    noActivityYet: t('Chưa có diễn biến.', 'No activity yet.'),
    bookingsCountSuffix: t('đơn', 'bookings'),
    roomType: t('Hạng phòng', 'Room type'),
    status: t('Trạng thái', 'Status'),
    due: t('còn', 'due'),
    localeCode: t('vi-VN', 'en-US'),
    defaultAgeHint: t('Mặc định 8 tuổi', 'Defaults to age 8'),
    roomsLeft: t('Còn {count} phòng', '{count} left'),

    // --- Promotions admin UI
    promoNameAndCode: t('TÊN CHƯƠNG TRÌNH & MÃ CODE', 'PROMO NAME & CODE'),
    stacking: t('QUY TẮC CỘNG DỒN', 'STACKING'),
    usage: t('ĐÃ DÙNG', 'USAGE'),
    promoStatus: t('TRẠNG THÁI', 'STATUS'),
    promoAction: t('THAO TÁC', 'ACTION'),
    viewCalcFormula: t('Xem công thức & cách tính toán', 'View calculation formula'),
    listView: t('Danh sách mã', 'List View'),
    formulasAndCalc: t('Công thức & Tính toán', 'Formulas & Calc'),
    totalPromos: t('TẤT CẢ CHƯƠNG TRÌNH', 'TOTAL PROMOS'),
    showing: t('Hiển thị', 'Showing'),
    of: t('trong', 'of'),
    formulaAndCalcDetails: t('Công thức & Chi tiết tính toán', 'Formula & Calculation Details'),
    codeLabel: t('Mã Code', 'Code'),
    automatic: t('Tự động áp dụng', 'Automatic'),
    active: t('Đang chạy', 'Active'),
    disabled: t('Đã tắt', 'Disabled'),
    exclusive: t('Độc quyền (Không cộng dồn)', 'Exclusive'),
    ruleValue: t('Giá trị quy tắc', 'Rule value'),
    ruleValuePercentage: t('Nhập số phần trăm, ví dụ 15', 'Enter a percentage, e.g. 15'),
    ruleValueVND: t('Nhập số tiền VNĐ', 'Enter an amount in VND'),
    ruleValueN: t('Nhập N — đêm thứ N được tặng', 'Enter N — the Nth night is free'),
    selectRoomPreview: t('Chọn hạng phòng để xem.', 'Pick a room type to preview.'),
    contentGroup: t('Nội dung', 'Content'),
    discountMechanicsGroup: t('Cách giảm', 'Discount mechanics'),
    blankEqualsAutomatic: t('Để trống = tự động', 'Blank = automatic'),
    stackingRulesGroup: t('Quy tắc kết hợp', 'Stacking rules'),
    to: t('đến', 'to'),
    limitsGroup: t('Giới hạn', 'Limits'),
    activatePromo: t('Bật chương trình', 'Activate promotion'),
    nightNLabel: t('Đêm thứ {value}', 'Night {value}'),
    todayLabel: t('Hôm nay', 'Today'),
    bookedLabel: t('Đã bán', 'Booked'),

    // ---------------------------------------- CMS: nhãn 3 vùng rail (AppShell)
    adminZoneOperations: t('Vận hành', 'Operations'),
    adminZoneContent: t('Nội dung', 'Content'),
    adminZoneSystem: t('Hệ thống', 'System'),

    // ------------------------------------------------- CMS: dashboard /admin
    //
    // Round 5 mục 3: MẶC ĐỊNH TIẾNG VIỆT giữ nguyên — chỉ sửa lại các chuỗi
    // `en` cho đúng thuật ngữ nghiệp vụ khách sạn (bảng chủ dự án đưa).
    dashboardKicker: t('VẬN HÀNH — HÔM NAY', 'OPERATIONS — TODAY'),
    dashboardTitle: t('Tổng quan hôm nay', 'Today overview'),
    matchingBookings: t('đơn khớp bộ lọc', 'bookings match the filters'),
    shiftFilterLabel: t('CA TRỰC', 'SHIFT'),
    shiftAll: t('Tất cả', 'All'),
    shiftMorning: t('Ca sáng', 'Morning'),
    shiftAfternoon: t('Ca chiều', 'Afternoon'),
    segmentFilterLabel: t('HẠNG PHÒNG', 'ROOM TYPE'),
    segmentVilla: t('Villa', 'Villa'),
    segmentBungalow: t('Bungalow', 'Bungalow'),
    segmentDeluxe: t('Deluxe', 'Deluxe'),
    kpiOccupancyRate: t('CÔNG SUẤT PHÒNG', 'OCCUPANCY'),
    kpiCheckInToday: t('KHÁCH NHẬN PHÒNG', 'ARRIVALS'),
    kpiCheckOutToday: t('KHÁCH TRẢ PHÒNG', 'DEPARTURES'),
    kpiPendingDeposit: t('CHỜ XÁC NHẬN CỌC', 'AWAITING DEPOSIT'),
    kpiUnitSuffix: t('lượt', 'stays'),
    kpiOrderSuffix: t('đơn', 'bookings'),
    expectedBeforeNoon: t('trước 12:00', 'before 12:00'),
    checkDepositTransfer: t('cần kiểm tra CK', 'needs review'),
    // Round 3: nút ẩn/hiện MetricStrip — lễ tân trực cả ngày cần BẢNG, không
    // cần KPI thường trực (mục 3). `aria-expanded`/`aria-controls` bắt buộc
    // để screen reader biết đang ẩn hay hiện, và biết vùng nào bị điều khiển.
    hideMetrics: t('Ẩn số liệu', 'Hide metrics'),
    showMetrics: t('Hiện số liệu', 'Show metrics'),
    // Bộ lọc phạm vi thời gian (việc ngoài 5 round chính thức) — chi phối cả
    // KPI lẫn bảng: "Ngày" = hôm nay, "Tuần" = 7 ngày gần nhất (tính cả hôm
    // nay), "Tháng" = 30 ngày, "Năm" = 365 ngày. Mặc định "Ngày" — đúng ý
    // nghĩa ban đầu của các KPI (VD "khách nhận phòng hôm nay").
    timeRangeLabel: t('Phạm vi', 'Range'),
    timeRangeDay: t('Ngày', 'Day'),
    timeRangeWeek: t('Tuần', 'Week'),
    timeRangeMonth: t('Tháng', 'Month'),
    timeRangeYear: t('Năm', 'Year'),
    recentActivity: t('VỪA DIỄN RA', 'RECENT ACTIVITY'),
    todayLabelShort: t('hôm nay', 'today'),
    tapeChartView: t('Sơ đồ Tape Chart ▾', 'Tape chart view ▾'),
    consoleView: t('Bảng ca trực ▾', 'Shift board view ▾'),
    tapeChartTitle: t('Sơ đồ tồn kho lưới (Tape Chart)', 'Grid inventory chart (Tape Chart)'),
    tapeChartDesc: t(
        'Lịch mở/khoá phòng theo từng mốc giờ và ngày. Hỗ trợ kéo thả đổi phòng trực tiếp.',
        'Open/block schedule per room per day. Drag-and-drop room swaps.',
    ),
    tabAllRooms: t('Toàn bộ đơn', 'All bookings'),
    tabArrivalsToday: t('Check-in hôm nay', 'Arrivals today'),
    tabPendingDeposit: t('Chờ cọc', 'Awaiting deposit'),
    newBookingCta: t('+ Đặt phòng mới', '+ New booking'),
    // Round 5 mục 1: `F6` bắt buộc mọi bộ lọc phải có nút đặt lại — dashboard
    // trước đó THIẾU nút này. Khoá riêng `clearFilters` (không tái dùng
    // `S.reset`/`S.resetFilters` sẵn có) vì chủ dự án chốt đúng chữ "Clear"
    // cho màn này, khác "Reset"/"Reset filters" đang dùng ở các bảng khác —
    // giữ nguyên các bảng đó, không đổi lây.
    clearFilters: t('Đặt lại', 'Clear'),
    colUnitChannel: t('MÃ PHÒNG & KÊNH', 'ROOM & CHANNEL'),
    colGuestPhone: t('KHÁCH HÀNG & SĐT', 'GUEST & PHONE'),
    colRoomTypeNights: t('HẠNG PHÒNG', 'ROOM TYPE'),
    colTotalBalance: t('TỔNG TIỀN / CÒN THIẾU', 'TOTAL / BALANCE DUE'),
    balanceShort: t('Thiếu', 'Due'),
    balanceSettled: t('Đã thu đủ', 'Fully paid'),
    approveDeposit: t('Duyệt cọc', 'Confirm deposit'),
    approveDepositNote: t('Duyệt cọc tại bàn ca trực', 'Deposit approved at reception'),
    checkInCta: t('Check-in', 'Check in'),
    checkInNote: t('Check-in tại quầy', 'Checked in at reception'),
    checkOutCta: t('Check-out', 'Check out'),
    checkOutNote: t('Check-out đóng đơn', 'Checked out, booking closed'),
    noActivityToday: t(
        'Chưa có hoạt động nào hôm nay. Hoạt động sẽ hiện ở đây khi có đơn được duyệt cọc, check-in hoặc check-out.',
        'No activity yet today. Activity will appear here once a deposit is approved, or a guest checks in or out.',
    ),
    // Khác `noActivityToday`: đây là khi CHƯA TỪNG có log nào (store rỗng),
    // không phải "không có gì hôm nay". Gộp chung sẽ khiến admin nghĩ hôm qua
    // có hoạt động mà hôm nay không — sai sự thật khi store trống hoàn toàn.
    noActivityEver: t(
        'Chưa có hoạt động nào được ghi nhận. Nhật ký sẽ xuất hiện khi có đơn đầu tiên.',
        'No activity has been logged yet. The log will fill in once the first booking happens.',
    ),
    // Phân biệt "chưa có dữ liệu" (store rỗng — bấm Đặt lại vô ích) với
    // "bộ lọc không khớp" (`emptyFilterBookings` — bấm Đặt lại thì ra kết
    // quả). Gộp chung dẫn admin đi sai hướng khi bảng trống vì CHƯA CÓ đơn.
    noBookingsAtAll: t(
        'Chưa có đơn đặt phòng nào. Đơn sẽ hiện ở đây khi khách đặt trên website hoặc lễ tân tạo tại quầy.',
        'No bookings yet. Bookings will appear here once a guest books online or reception creates one at the desk.',
    ),
} satisfies Record<string, I18nText>

// ============================================================== bảng tra mã

export const STATUS_LABEL: Record<BookingStatus, I18nText> = {
    pending_payment: t('Chờ thanh toán', 'Awaiting payment'),
    // Round 1 đổi thành "Đã cọc — chờ nhận" nhưng dài hơn width cố định của
    // `DotBadge` (120px trong bảng dashboard) → bị cắt chữ, vi phạm D4 (badge
    // PHẢI đọc được đủ chữ, không chỉ chấm màu). Rút gọn còn "Đã cọc" — vẫn
    // đúng nghĩa nghiệp vụ (khách đã đặt cọc, đang chờ tới ngày nhận phòng),
    // ngắn hơn "Chờ thanh toán"/"Hết hạn giữ chỗ" nên chắc chắn vừa badge.
    confirmed: t('Đã cọc', 'Deposit paid'),
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

/**
 * Trạng thái đơn → tone của `@repo/cms-ui` (dùng cho `DotBadge`/`KpiCard`
 * trong CMS). Tách riêng khỏi `STATUS_TONE` ở trên vì đó là tone ngữ nghĩa cũ
 * (`neutral|success|warning|danger|info`) đang phục vụ nơi khác (my-orders,
 * booking/success) — đổi kiểu của nó sẽ vỡ những chỗ đó. `CmsTone` là bảng màu
 * khác (`emerald|blue|violet|amber|rose|slate`), một khái niệm khác, một nhà
 * khác (R12) dù cùng ánh xạ từ `BookingStatus`.
 */
export const STATUS_CMS_TONE: Record<BookingStatus, CmsTone> = {
    pending_payment: 'amber',
    confirmed: 'blue',
    checked_in: 'emerald',
    checked_out: 'slate',
    cancelled: 'rose',
    no_show: 'rose',
    expired: 'slate',
}

/**
 * Kênh đặt → tone của `@repo/cms-ui`. Chưa có nơi nào khai trước đó (dashboard
 * không có cột kênh dạng badge) — khai một lần ở đây để mọi màn CMS khác dùng
 * lại được, không tự vẽ `toneMap` cục bộ trong từng trang (R12).
 */
export const CHANNEL_CMS_TONE: Record<Channel, CmsTone> = {
    web: 'emerald',
    'walk-in': 'blue',
    ota: 'violet',
    phone: 'amber',
}

/**
 * Lỗi ghi dữ liệu → câu song ngữ.
 *
 * Mỗi mã một câu riêng, nói rõ phải làm gì tiếp (luật C3/C8/FE4). Gộp tất cả
 * thành "Có lỗi xảy ra" là lấy đi thông tin duy nhất giúp lễ tân xử lý được.
 *
 * Kiểu khoá cố ý viết bằng chuỗi thay vì import `WriteError` từ store: `strings`
 * là tầng trình bày, không được phụ thuộc ngược vào store.
 */
export const WRITE_ERROR_LABEL: Record<
    'not-found' | 'invalid-transition' | 'version-conflict' | 'sold-out' | 'unit-unavailable' | 'not-settled',
    I18nText
> = {
    'not-found': S.errNotFound,
    'invalid-transition': S.errInvalidTransition,
    'version-conflict': S.versionConflict,
    'sold-out': S.errSoldOut,
    'unit-unavailable': S.errUnitUnavailable,
    'not-settled': S.settledHint,
}

export const CHANNEL_LABEL: Record<Channel, I18nText> = {
    web: S.channelWeb,
    phone: S.channelPhone,
    'walk-in': S.channelWalkIn,
    ota: S.channelOta,
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

/** Trạng thái phòng vật lý → tone của `@repo/cms-ui` (dùng cho `DotBadge` và
 *  `KpiCard` ở màn Buồng phòng). Riêng với `UNIT_STATUS_TONE` ở trên vì đó là
 *  hệ tone cũ (`success/warning/...`) không khớp `CmsTone` — không đổi lại vì
 *  không rõ còn nơi nào khác định hình theo tên cũ đó. */
export const UNIT_STATUS_CMS_TONE: Record<RoomUnitStatus, CmsTone> = {
    available: 'emerald',
    occupied: 'blue',
    dirty: 'rose',
    cleaning: 'amber',
    maintenance: 'slate',
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
