import type { UiStrings, UiStringSet } from '@repo/ui'

/**
 * Nhãn giao diện của mẫu 02 — port từ hằng `UI` trong prototype
 * `Home 02 - Nam Du Hill.dc.html`.
 *
 * Mẫu 02 có thêm hai dải riêng không nằm trong hợp đồng chung: `steps`
 * (ba bước đặt phòng) và dải khuyến mãi `promo`. Đúng theo chú thích ở
 * `@repo/ui/strings`, nhãn riêng của một mẫu được khai bằng cách MỞ RỘNG
 * `UiStrings` ngay trong theme, không đẩy ngược lên `ui`.
 *
 * Dữ liệu nghiệp vụ (tên phòng, giá, lịch trình) vẫn ở `core` và dùng chung
 * với mẫu 01 (luật R8).
 */

/** Một bước trong dải "ba bước là xong". */
export interface H2Step {
    title: string
    desc: string
}

export interface H2Strings extends UiStrings {
    stepsKicker: string
    stepsTitle: string
    stepsSub: string
    steps: H2Step[]
    promoKicker: string
    promoTitle: string
    promoCta: string

    // Rooms page
    home: string
    roomsPageTitle: string
    roomsPageSub: string
    filterAll: string
    filterCouple: string
    filterFamily: string
    filterGroup: string
    sortLabel: string
    sortRec: string
    sortAsc: string
    sortDesc: string
    countLabel: string
    viewDetail: string
    selectRoom: string
    deselectRoom: string
    selectedBadge: string
    addonsTitle: string
    addonsHeadline: string
    addonsSub: string
    yourSelection: string
    noneSelected: string
    roomsTotal: string
    addonsTotal: string
    subtotal: string
    clearAll: string
    goCheckout: string
    backHub: string

    // Room detail page
    roomsPage: string
    descKicker: string
    descTitle: string
    amenitiesKicker: string
    amenitiesTitle: string
    viewTitle: string
    conditionsTitle: string
    otherRooms: string
    bookTitle: string
    extraBedLabel: string
    backToRooms: string
    helpTitle: string
    helpSub: string
    specArea: string
    specGuests: string
    specBed: string
    specView: string

    // Checkout page
    checkoutPageTitle: string
    needHelp: string
    stepGuest: string
    stepPay: string
    stepDone: string
    step1Title: string
    step1Sub: string
    step2Title: string
    step2Sub: string
    step3Title: string
    step3Sub: string
    fName: string
    phName: string
    fPhone: string
    fEmail: string
    fId: string
    phId: string
    fNote: string
    phNote: string
    nextPay: string
    nextConfirm: string
    back: string
    orderTitle: string
    orderSub: string
    nights: string
    nightsWord: string
    vat: string
    total: string
    deposit: string
    payNow: string
    payDisabled: string
    agree: string
    successTitle: string
    successSub: string
}

export const ui: UiStringSet<H2Strings> = {
    vi: {
        phoneLabel: 'Hotline / Zalo',
        bookNow: 'Đặt phòng',
        viewAll: 'Xem tất cả',
        checkIn: 'Ngày nhận phòng',
        checkOut: 'Ngày trả phòng',
        guests: 'Khách / phòng',
        guestsWord: 'khách',
        stayType: 'Hình thức',
        stayRoom: 'Chỉ phòng nghỉ',
        stayCombo2: 'Combo 2N1Đ',
        stayCombo3: 'Combo 3N2Đ',
        search: 'Kiểm tra giá',
        heroImage: 'Ảnh banner — resort hướng biển',
        perNight: 'mỗi đêm',
        roomsKicker: 'Hạng phòng',
        roomsTitle: 'Không gian nghỉ dưỡng của bạn',
        roomsSub: 'Sáu hạng phòng từ 26 m² đến 56 m², tất cả đều hướng biển hoặc thung lũng.',
        toursKicker: 'Lịch trình',
        toursTitle: 'Combo trọn gói, không lo lịch trình',
        toursSub: 'Vé tàu khứ hồi, phòng nghỉ và tour đảo trong một lần đặt.',
        fromPrice: 'Giá từ',
        perGuest: 'mỗi khách',
        bookTour: 'Đặt combo này',
        placesKicker: 'Điểm đến',
        placesTitle: '21 hòn đảo, tám điểm không nên bỏ qua',
        placesSub:
            'Từ bãi tắm kín gió đến hải đăng cao nhất Việt Nam — tất cả trong bán kính một chuyến tàu gỗ.',
        diningKicker: 'Nhà hàng & Bar',
        diningTitle: 'Ẩm thực đảo, đánh bắt trong ngày',
        diningSub: 'Hải sản mua trực tiếp từ ghe thuyền và lồng bè Hòn Ngang.',
        transportTitle: 'Cách đến Nam Du',
        transportSub: 'Hai chặng: đường bộ tới Rạch Giá, rồi tàu cao tốc ra đảo.',
        notesTitle: 'Lưu ý trước chuyến đi',
        faqTitle: 'Câu hỏi thường gặp',
        faqSub: 'Những điều khách hay hỏi nhất trước khi đặt.',
        galleryKicker: 'Thư viện ảnh',
        galleryTitle: 'Không gian thực tế tại resort',
        ctaTitle: 'Chọn ngày, phần còn lại để chúng tôi lo.',
        ctaSub: 'Nhắn Zalo hoặc gửi email — chúng tôi xác nhận phòng và vé tàu trong vòng 15 phút.',
        emailUs: 'Gửi email',
        footerAbout: 'Khu nghỉ dưỡng trên đồi hướng biển tại Hòn Củ Tron, quần đảo Nam Du.',
        footerNav: 'Liên kết',
        footerContact: 'Liên hệ',
        footerFollow: 'Theo dõi',

        stepsKicker: 'Đặt phòng dễ dàng',
        stepsTitle: 'Ba bước là xong',
        stepsSub: 'Không cần gọi điện qua lại, không chờ báo giá.',
        steps: [
            {
                title: 'Chọn ngày & hạng phòng',
                desc: 'Xem phòng trống và giá thật theo từng ngày, không cần hỏi giá.',
            },
            {
                title: 'Chốt combo hoặc chỉ phòng',
                desc: 'Thêm vé tàu khứ hồi và tour đảo nếu bạn muốn đi trọn gói.',
            },
            {
                title: 'Nhận xác nhận trong 15 phút',
                desc: 'Chúng tôi giữ phòng, giữ vé và đón bạn tại bến tàu Bãi Chệt.',
            },
        ],
        promoKicker: 'Ưu đãi combo',
        promoTitle: 'Giảm cho khách đặt trọn gói tàu + phòng + tour',
        promoCta: 'Nhận ưu đãi',

        // Rooms page
        home: 'Trang chủ',
        roomsPageTitle: 'Hạng phòng & Suite',
        roomsPageSub: 'Bảy hạng phòng trên sườn đồi Hòn Củ Tron. Chọn phòng, thêm tiện ích, thanh toán trong một luồng.',
        filterAll: 'Tất cả',
        filterCouple: 'Cặp đôi',
        filterFamily: 'Gia đình',
        filterGroup: 'Nhóm bạn',
        sortLabel: 'Sắp xếp',
        sortRec: 'Gợi ý',
        sortAsc: 'Giá thấp → cao',
        sortDesc: 'Giá cao → thấp',
        countLabel: 'hạng phòng',
        viewDetail: 'Chi tiết',
        selectRoom: 'Chọn phòng',
        deselectRoom: 'Bỏ chọn',
        selectedBadge: 'Đã chọn',
        addonsTitle: 'Tiện ích',
        addonsHeadline: 'Thêm dịch vụ cho chuyến đi',
        addonsSub: 'Bấm để thêm hoặc bỏ. Giá tính theo số khách của các phòng bạn đã chọn.',
        yourSelection: 'Đang chọn',
        noneSelected: 'Chưa chọn phòng nào',
        roomsTotal: 'Tiền phòng',
        addonsTotal: 'Tiện ích',
        subtotal: 'Tạm tính',
        clearAll: 'Bỏ hết',
        goCheckout: 'Tiếp tục đặt phòng',
        backHub: 'Về trang tổng',

        // Room detail page
        roomsPage: 'Hạng phòng',
        descKicker: 'Mô tả',
        descTitle: 'Chi tiết phòng',
        amenitiesKicker: 'Quyền lợi',
        amenitiesTitle: 'Tiện nghi trong phòng',
        viewTitle: 'Hướng tầm nhìn',
        conditionsTitle: 'Điều kiện phòng',
        otherRooms: 'Hạng phòng khác',
        bookTitle: 'Đặt phòng này',
        extraBedLabel: 'Giường phụ',
        backToRooms: 'Xem hạng phòng khác',
        helpTitle: 'Cần tư vấn?',
        helpSub: 'Nhắn Zalo để được giữ phòng và vé tàu ngay trong hôm nay.',
        specArea: 'Diện tích',
        specGuests: 'Số khách',
        specBed: 'Giường',
        specView: 'Tầm nhìn',

        // Checkout page
        checkoutPageTitle: 'Hoàn tất đặt phòng',
        needHelp: 'Cần hỗ trợ?',
        stepGuest: 'Thông tin khách',
        stepPay: 'Thanh toán',
        stepDone: 'Xác nhận',
        step1Title: 'Thông tin người đặt',
        step1Sub: 'Chúng tôi dùng thông tin này để giữ phòng và làm thủ tục lên tàu.',
        step2Title: 'Phương thức thanh toán',
        step2Sub: 'Cọc 30% khi đặt, phần còn lại thanh toán khi nhận phòng.',
        step3Title: 'Chính sách & xác nhận',
        step3Sub: 'Đọc nhanh các điều kiện trước khi hoàn tất.',
        fName: 'Họ và tên',
        phName: 'Nguyễn Văn A',
        fPhone: 'Số điện thoại / Zalo',
        fEmail: 'Email',
        fId: 'CCCD / Hộ chiếu',
        phId: 'Số giấy tờ dùng để lên tàu',
        fNote: 'Ghi chú thêm',
        phNote: 'Giờ đến dự kiến, yêu cầu giường phụ, dị ứng thực phẩm…',
        nextPay: 'Tiếp tục · Thanh toán',
        nextConfirm: 'Tiếp tục · Xác nhận',
        back: 'Quay lại',
        orderTitle: 'Đơn của bạn',
        orderSub: 'Giữ chỗ trong 30 phút',
        nights: 'Số đêm',
        nightsWord: 'đêm',
        vat: 'Thuế & phí dịch vụ (8%)',
        total: 'Tổng cộng',
        deposit: 'Cọc 30% khi đặt',
        payNow: 'Thanh toán',
        payDisabled: 'Vui lòng đồng ý điều kiện',
        agree: 'Tôi đã đọc và đồng ý với chính sách huỷ, đổi lịch và điều kiện lưu trú của resort.',
        successTitle: 'Đặt phòng thành công!',
        successSub: 'Mã đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ Zalo/SĐT trong 15 phút.',
    },
    en: {
        phoneLabel: 'Hotline / Zalo',
        bookNow: 'Book now',
        viewAll: 'View all',
        checkIn: 'Check in',
        checkOut: 'Check out',
        guests: 'Guests / rooms',
        guestsWord: 'guests',
        stayType: 'Stay type',
        stayRoom: 'Room only',
        stayCombo2: '2D1N bundle',
        stayCombo3: '3D2N bundle',
        search: 'Check rates',
        heroImage: 'Banner image — resort facing the sea',
        perNight: 'per night',
        roomsKicker: 'Rooms & Suites',
        roomsTitle: 'Your space on the island',
        roomsSub: 'Six room types from 26 m² to 56 m², all facing the sea or the valley.',
        toursKicker: 'Itineraries',
        toursTitle: 'All-in bundles, no planning needed',
        toursSub: 'Return ferry, accommodation and island tour in a single booking.',
        fromPrice: 'From',
        perGuest: 'per guest',
        bookTour: 'Book this bundle',
        placesKicker: 'Destinations',
        placesTitle: "21 islands, eight you shouldn't miss",
        placesSub:
            "From sheltered beaches to one of Vietnam's highest lighthouses — all within one boat ride.",
        diningKicker: 'Wining & Dining',
        diningTitle: 'Island food, caught the same day',
        diningSub: "Seafood bought straight off the boats and Hon Ngang's floating pens.",
        transportTitle: 'Getting to Nam Du',
        transportSub: 'Two legs: overland to Rach Gia, then a speedboat to the island.',
        notesTitle: 'Before you travel',
        faqTitle: 'Frequently asked',
        faqSub: 'What guests ask most before booking.',
        galleryKicker: 'Gallery',
        galleryTitle: 'Real spaces at the resort',
        ctaTitle: 'Pick your dates. We handle the rest.',
        ctaSub: 'Message us on Zalo or send an email — we confirm rooms and ferry tickets within 15 minutes.',
        emailUs: 'Email us',
        footerAbout: 'A hillside resort facing the sea on Hon Cu Tron, Nam Du archipelago.',
        footerNav: 'Links',
        footerContact: 'Contact',
        footerFollow: 'Follow',

        stepsKicker: 'Easy booking',
        stepsTitle: "Three steps and you're done",
        stepsSub: 'No phone tag, no waiting on a quote.',
        steps: [
            {
                title: 'Pick dates & room type',
                desc: 'See real availability and per-night rates without asking.',
            },
            {
                title: 'Choose a bundle or room only',
                desc: 'Add the return ferry and island tour if you want it all handled.',
            },
            {
                title: 'Confirmed within 15 minutes',
                desc: 'We hold the room, hold the tickets and meet you at Bai Chet pier.',
            },
        ],
        promoKicker: 'Bundle offer',
        promoTitle: 'Off when you book ferry + room + tour together',
        promoCta: 'Claim the offer',

        // Rooms page
        home: 'Home',
        roomsPageTitle: 'Rooms & Suites',
        roomsPageSub: 'Seven room types on the Hon Cu Tron hillside. Pick a room, add extras, check out in one flow.',
        filterAll: 'All',
        filterCouple: 'Couples',
        filterFamily: 'Family',
        filterGroup: 'Groups',
        sortLabel: 'Sort by',
        sortRec: 'Recommended',
        sortAsc: 'Price low → high',
        sortDesc: 'Price high → low',
        countLabel: 'room types',
        viewDetail: 'Details',
        selectRoom: 'Select room',
        deselectRoom: 'Remove',
        selectedBadge: 'Selected',
        addonsTitle: 'Add-ons',
        addonsHeadline: 'Add services to your stay',
        addonsSub: 'Tap to add or remove. Priced by the guest count of the rooms you picked.',
        yourSelection: 'Selected',
        noneSelected: 'No rooms selected yet',
        roomsTotal: 'Rooms',
        addonsTotal: 'Add-ons',
        subtotal: 'Subtotal',
        clearAll: 'Clear all',
        goCheckout: 'Continue booking',
        backHub: 'Back to showcase',

        // Room detail page
        roomsPage: 'Rooms',
        descKicker: 'Description',
        descTitle: 'Room details',
        amenitiesKicker: 'Benefits',
        amenitiesTitle: 'In-room amenities',
        viewTitle: 'View',
        conditionsTitle: 'Room conditions',
        otherRooms: 'Other room types',
        bookTitle: 'Book this room',
        extraBedLabel: 'Extra bed',
        backToRooms: 'See other rooms',
        helpTitle: 'Need advice?',
        helpSub: "Message us on Zalo and we'll hold the room and ferry seats today.",
        specArea: 'Size',
        specGuests: 'Occupancy',
        specBed: 'Bed',
        specView: 'View',

        // Checkout page
        checkoutPageTitle: 'Complete your booking',
        needHelp: 'Need help?',
        stepGuest: 'Guest details',
        stepPay: 'Payment',
        stepDone: 'Confirm',
        step1Title: "Who's booking",
        step1Sub: 'We use these details to hold the room and clear ferry boarding.',
        step2Title: 'Payment method',
        step2Sub: '30% deposit now, the balance is due at check-in.',
        step3Title: 'Policies & confirmation',
        step3Sub: 'A quick read before you finish.',
        fName: 'Full name',
        phName: 'Jane Doe',
        fPhone: 'Phone / Zalo',
        fEmail: 'Email',
        fId: 'ID / Passport',
        phId: "The document you'll board with",
        fNote: 'Notes',
        phNote: 'Arrival time, extra bed request, food allergies…',
        nextPay: 'Continue · Payment',
        nextConfirm: 'Continue · Confirm',
        back: 'Back',
        orderTitle: 'Your order',
        orderSub: 'Held for 30 minutes',
        nights: 'Nights',
        nightsWord: 'nights',
        vat: 'Tax & service (8%)',
        total: 'Total',
        deposit: '30% deposit now',
        payNow: 'Pay now',
        payDisabled: 'Please accept the conditions',
        agree: 'I have read and accept the cancellation, rescheduling and stay conditions.',
        successTitle: 'Booking confirmed!',
        successSub: 'Your order is recorded. We will contact you on Zalo/Phone within 15 minutes.',
    },
}
