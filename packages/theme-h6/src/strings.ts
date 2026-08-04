import type { Locale, Room } from '@repo/core'

/**
 * Nhãn giao diện của mẫu 06 — thông điệp chuẩn theo spec v3 §4.
 *
 * Chuỗi GIAO DIỆN sống ở đây; chuỗi NỘI DUNG (tên phòng, mô tả, FAQ…) sống ở
 * `core` và dùng chung cả N mẫu (luật R6/R8). Mọi khoá đều đủ {vi, en}.
 */

const STRINGS = {
    vi: {
        // ---- hero / định danh chính chủ ----
        heroTitle: 'Nghỉ trên đồi, thức dậy giữa biển Nam Du',
        identityPrefix: 'Resort chính chủ trên đồi Củ Tron · Hotline/Zalo',
        ctaMain: 'Chọn ngày & xem phòng',
        searchSheetOpen: 'Chọn ngày & xem phòng',
        heroTrustNote: 'Đưa đón bến tàu · Cọc 50% · Tàu hoãn do thời tiết: dời ngày miễn phí',
        trustShuttle: 'Xe resort đón tại cầu cảng',
        trustHotline: 'Hotline/Zalo',
        stickyFrom: 'Từ',
        stickyPerNight: '/đêm',
        stickyFind: 'Tìm phòng',

        // ---- widget tìm phòng ----
        checkIn: 'Ngày nhận phòng',
        checkOut: 'Ngày trả phòng',
        guests: 'Số khách',
        adults: 'Người lớn',
        children: 'Trẻ em',
        childAge: 'Tuổi trẻ',
        guestsWord: 'khách',
        nightsWord: 'đêm',
        edit: 'Sửa',
        close: 'Đóng',
        apply: 'Áp dụng',
        emptyTitle: 'Hết phòng cho {from}–{to}.',
        emptyBody: 'Thử ngày khác hoặc giảm số khách.',
        emptyZalo: 'Hỏi ngày còn trống qua Zalo',

        // ---- section home ----
        aboutKicker: 'Về resort',
        wayKicker: 'Đường ra đảo',
        wayFerry: 'Tàu cao tốc Rạch Giá – Nam Du, khoảng 2 giờ trên biển',
        wayPickup: 'Xe resort đón miễn phí ngay tại cầu cảng Củ Tron',
        wayHill: 'Đường lên đồi 1,8 km — xe resort đưa lên tận nơi, không phải tự đi bộ',
        roomsKicker: 'Hạng phòng',
        roomsTitle: 'Phòng thật, tên thật, giá thật',
        viewAllRooms: 'Xem tất cả {n} hạng phòng',
        fromPrice: 'từ',
        perNight: '/đêm',
        fitLabel: 'Phù hợp',
        diningKicker: 'Ẩm thực',
        placesKicker: 'Quanh đảo',
        toursLabel: 'Tour trong ngày',
        galleryKicker: 'Ảnh thật tại resort',
        bookingTitle: 'Đặt trực tiếp — đưa đón bến tàu miễn phí, giá không qua trung gian',
        bookingCta: 'Chọn ngày & xem phòng',
        faqTitle: 'Câu hỏi trước khi đặt',
        contactKicker: 'Liên hệ',
        followUs: 'Theo dõi',
        policyBooking: 'Chính sách đặt phòng & huỷ',
        policyNote: 'Tóm tắt chính sách nằm ở mục câu hỏi phía trên — bản đầy đủ sẽ bổ sung.',
        taxLabel: 'MST',
        taxPending: '(đang chờ chủ resort xác minh)',

        // ---- trang rooms ----
        roomsPageTitle: 'Chọn hạng phòng',
        roomsPageSub: 'Giá dưới đây tính cho đúng khoảng ngày bạn chọn, đã gồm thuế phí.',
        pricedForRange: 'Giá dưới đây tính cho {n} đêm',
        taxIncluded: 'đã gồm thuế phí',
        selectRoom: 'Chọn phòng',
        capacityOver: 'Vượt sức chứa cho số khách đã chọn',
        cancelShort: 'Huỷ trước {d} ngày: hoàn {p}%',
        emptyRoomsHint: 'Hoặc hỏi nhanh qua Zalo — lễ tân trả lời trong giờ hành chính.',
        home: 'Trang chủ',
        roomsCrumb: 'Hạng phòng',

        // ---- trang room detail ----
        bookRoom: 'Đặt phòng',
        askZalo: 'Hỏi phòng này qua Zalo',
        specArea: 'Diện tích',
        specGuests: 'Sức chứa',
        specBed: 'Giường',
        specView: 'Hướng nhìn',
        amenities: 'Tiện nghi',
        conditions: 'Điều kiện phòng',
        descTitle: 'Về phòng này',
        otherRooms: 'Các hạng phòng khác',
        priceRoomLine: 'Tiền phòng {n} đêm',
        priceExtraBed: 'Giường phụ',
        priceChild: 'Phụ thu trẻ em',
        priceAddon: 'Dịch vụ thêm',
        priceDiscount: 'Khuyến mãi',
        totalLabel: 'Thành tiền',
        depositLabel: 'Cọc trả khi đặt ({p}%)',
        balanceLabel: 'Còn lại trả tại quầy',
        policyTitle: 'Chính sách huỷ',
        policyRule: 'Huỷ trước {d} ngày: hoàn {p}% cọc',
        policyNoRefund: 'Sát ngày: không hoàn cọc',
        weatherLine: 'Tàu hoãn do thời tiết: dời ngày miễn phí',
        payTitle: 'Thanh toán',
        payCard: 'Thẻ tín dụng (OnePay)',
        payTransfer: 'Chuyển khoản',
        payCounter: 'Tại quầy',
        payNote: 'Hỗ trợ MoMo/QR khi thanh toán tại quầy. Bản demo chưa nối cổng thanh toán.',
        seeDetail: 'Xem chi tiết',
        gallery: 'Ảnh phòng',
        photoOf: 'Ảnh {name}',
        prevPhoto: 'Ảnh trước',
        nextPhoto: 'Ảnh sau',
    },
    en: {
        heroTitle: 'Sleep on the hill, wake up to the Nam Du sea',
        identityPrefix: 'Officially run by the resort on Cu Tron hill · Hotline',
        ctaMain: 'Pick dates & see rooms',
        searchSheetOpen: 'Pick dates & see rooms',
        heroTrustNote: 'Pier pick-up · 50% deposit · Ferry cancelled by weather: reschedule free',
        trustShuttle: 'Resort shuttle pickup at the pier',
        trustHotline: 'Hotline/Zalo',
        stickyFrom: 'From',
        stickyPerNight: '/night',
        stickyFind: 'Find a room',

        checkIn: 'Check-in',
        checkOut: 'Check-out',
        guests: 'Guests',
        adults: 'Adults',
        children: 'Children',
        childAge: 'Child age',
        guestsWord: 'guests',
        nightsWord: 'nights',
        edit: 'Edit',
        close: 'Close',
        apply: 'Apply',
        emptyTitle: 'No rooms for {from}–{to}.',
        emptyBody: 'Try other dates or fewer guests.',
        emptyZalo: 'Ask about open dates on Zalo',

        aboutKicker: 'About the resort',
        wayKicker: 'Getting to the island',
        wayFerry: 'Rach Gia – Nam Du express ferry, about 2 hours at sea',
        wayPickup: 'Free resort shuttle waiting right at Cu Tron pier',
        wayHill: 'A 1.8 km hill road — our shuttle takes you all the way up',
        roomsKicker: 'Rooms',
        roomsTitle: 'Real rooms, real names, real rates',
        viewAllRooms: 'See all {n} room types',
        fromPrice: 'from',
        perNight: '/night',
        fitLabel: 'Great for',
        diningKicker: 'Dining',
        placesKicker: 'Around the island',
        toursLabel: 'Day tours',
        galleryKicker: 'Real photos from the resort',
        bookingTitle: 'Book direct — free pier pick-up, no middleman on the rate',
        bookingCta: 'Pick dates & see rooms',
        faqTitle: 'Before you book',
        contactKicker: 'Contact',
        followUs: 'Follow',
        policyBooking: 'Booking & cancellation policy',
        policyNote: 'A summary lives in the questions above — the full page is coming.',
        taxLabel: 'Tax ID',
        taxPending: '(pending verification by the owner)',

        roomsPageTitle: 'Choose your room',
        roomsPageSub: 'Rates below are computed for your exact dates, taxes included.',
        pricedForRange: 'Rates below are for {n} nights',
        taxIncluded: 'taxes & fees included',
        selectRoom: 'Select room',
        capacityOver: 'Over capacity for the selected guests',
        cancelShort: 'Cancel {d}+ days ahead: {p}% refund',
        emptyRoomsHint: 'Or ask on Zalo — reception replies during office hours.',
        home: 'Home',
        roomsCrumb: 'Rooms',

        bookRoom: 'Book this room',
        askZalo: 'Chat about this room (Zalo)',
        specArea: 'Area',
        specGuests: 'Sleeps',
        specBed: 'Beds',
        specView: 'View',
        amenities: 'Amenities',
        conditions: 'Room conditions',
        descTitle: 'About this room',
        otherRooms: 'Other room types',
        priceRoomLine: 'Room · {n} nights',
        priceExtraBed: 'Extra bed',
        priceChild: 'Child surcharge',
        priceAddon: 'Add-ons',
        priceDiscount: 'Promotion',
        totalLabel: 'Total',
        depositLabel: 'Deposit due now ({p}%)',
        balanceLabel: 'Balance paid at check-in',
        policyTitle: 'Cancellation policy',
        policyRule: 'Cancel {d}+ days ahead: {p}% of deposit back',
        policyNoRefund: 'Last minute: deposit not refunded',
        weatherLine: 'Ferry cancelled by weather: reschedule free',
        payTitle: 'Payment',
        payCard: 'Credit card (OnePay)',
        payTransfer: 'Bank transfer',
        payCounter: 'At the desk',
        payNote: 'MoMo/QR accepted at the desk. Demo build — no gateway connected yet.',
        seeDetail: 'View details',
        gallery: 'Room photos',
        photoOf: 'Photo of {name}',
        prevPhoto: 'Previous photo',
        nextPhoto: 'Next photo',
    },
} as const

export type UiKey = keyof (typeof STRINGS)['vi']

export function ui(locale: Locale) {
    return STRINGS[locale]
}

/** Điền `{placeholder}` — chuỗi nhãn có tham số (số đêm, %, ngày…). */
export function fill(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? ''))
}

/**
 * "Phù hợp: …" cho card phòng — suy từ sức chứa, KHÔNG bịa dữ liệu mới.
 * Đây là cách diễn đạt (hình thức), nên nó thuộc theme chứ không phải core.
 */
export function fitFor(room: Room, locale: Locale): string {
    const n = room.guests
    if (locale === 'vi') {
        if (n <= 2) return 'cặp đôi · 2 khách'
        if (n === 3) return 'nhóm 3 bạn'
        if (n === 4) return 'gia đình 2+2 / nhóm 4 bạn'
        return `nhóm ${n} khách / đại gia đình`
    }
    if (n <= 2) return 'couples · 2 guests'
    if (n === 3) return 'a trio'
    if (n === 4) return 'family of 4 / group of 4'
    return `groups of ${n}`
}

