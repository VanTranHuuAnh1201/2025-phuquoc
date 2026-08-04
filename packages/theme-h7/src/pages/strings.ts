import type { Locale } from '@repo/core'

/**
 * Nhãn giao diện của các trang con mẫu 07 — port nguyên văn từ hằng `UI` trong
 * `Rooms / Room Detail / Tours / Tour Detail / Gallery / Contact - Nam Du Hill.dc.html`.
 *
 * VÌ SAO KHÔNG NHÉT VÀO `UiStrings` của `@repo/ui`: interface đó là hợp đồng mà
 * CẢ BỐN mẫu phải thoả. Thêm nhãn của trang con vào đó nghĩa là h2/h3/h4 cũng
 * phải khai theo dù chưa có trang con — đúng thứ luật R5 cấm. Khi mẫu khác dựng
 * trang con, nó khai bộ của riêng nó.
 */

export interface PageStrings {
    // ---- điều hướng chung của trang con ----
    home: string
    roomsPage: string
    toursPage: string
    galleryPage: string
    contactPage: string
    bookNow: string
    perNight: string
    perGuest: string
    fromPrice: string
    guestsWord: string

    // ---- Rooms ----
    roomsTitle: string
    roomsSub: string
    checkIn: string
    checkOut: string
    guests: string
    anyGuests: string
    sortLabel: string
    sortRec: string
    sortAsc: string
    sortDesc: string
    countLabel: string
    viewDetail: string
    select: string
    selected: string
    yourSelection: string
    emptySelection: string
    roomsTotal: string
    addonsTotal: string
    total: string
    totalNote: string
    confirmBooking: string
    addonsTitle: string
    addonsSub: string
    notesTitle: string
    bedDefault: string
    viewDefault: string
    perksDefault: string[]

    // ---- Room Detail ----
    descTitle: string
    amenitiesTitle: string
    viewTitle: string
    conditionsTitle: string
    otherRooms: string
    roomPrice: string
    extraBedLabel: string
    extraBedNote: string
    backToRooms: string
    specArea: string
    specGuests: string
    specBed: string
    specView: string

    // ---- Tours ----
    toursTitle: string
    toursSub: string
    combosTitle: string
    filterAll: string
    viewItinerary: string
    bookTour: string
    placesKicker: string
    placesTitle: string
    placesSub: string

    // ---- Tour Detail ----
    itineraryTitle: string
    includedTitle: string
    excludedTitle: string
    specDuration: string
    specGroup: string
    specDeparture: string
    specCode: string
    backToTours: string
    bookThisTour: string

    // ---- Gallery ----
    galleryTitle: string
    gallerySub: string
    catAll: string
    catRooms: string
    catDining: string
    catPlaces: string
    catResort: string
    photosWord: string
    galleryCtaTitle: string
    galleryCtaSub: string

    // ---- Contact ----
    contactTitle: string
    contactSub: string
    formTitle: string
    formSub: string
    fName: string
    fPhone: string
    fTopic: string
    fDate: string
    fMsg: string
    phName: string
    phMsg: string
    sendBtn: string
    sentNote: string
    topics: string[]
    locationTitle: string
    openMap: string
    transportTitle: string
    hoursTitle: string
    hours: { label: string; value: string }[]
    channelPhone: string
    channelZalo: string
    channelEmail: string
    channelAddress: string
    channelPhoneNote: string
    channelZaloNote: string
    channelEmailNote: string
    channelAddressNote: string
    faqTitle: string
    faqSub: string

    // ---- chân trang ----
    footerAbout: string
    footerNav: string
    footerContact: string
    footerFollow: string
}

export const pageUi: Record<Locale, PageStrings> = {
    vi: {
        home: 'Trang chủ',
        roomsPage: 'Hạng phòng',
        toursPage: 'Combo & Tour',
        galleryPage: 'Thư viện ảnh',
        contactPage: 'Liên hệ',
        bookNow: 'Đặt phòng',
        perNight: 'mỗi đêm',
        perGuest: 'mỗi khách',
        fromPrice: 'Giá từ',
        guestsWord: 'khách',

        roomsTitle: 'Hạng phòng & Suite',
        roomsSub:
            'Bảy hạng phòng trên sườn đồi, tất cả đều hướng biển hoặc thung lũng. Chọn phòng và thêm tiện ích ngay trên trang.',
        checkIn: 'Ngày nhận phòng',
        checkOut: 'Ngày trả phòng',
        guests: 'Số khách',
        anyGuests: 'Tất cả',
        sortLabel: 'Sắp xếp',
        sortRec: 'Gợi ý',
        sortAsc: 'Giá thấp → cao',
        sortDesc: 'Giá cao → thấp',
        countLabel: 'hạng phòng',
        viewDetail: 'Chi tiết',
        select: 'Chọn phòng',
        selected: 'Đã chọn ✓',
        yourSelection: 'Phòng bạn chọn',
        emptySelection: 'Chưa chọn phòng nào. Bấm “Chọn phòng” ở danh sách bên cạnh.',
        roomsTotal: 'Tiền phòng',
        addonsTotal: 'Tiện ích',
        total: 'Tạm tính',
        totalNote: 'Giá cho 1 đêm, chưa gồm phụ thu ngày lễ.',
        confirmBooking: 'Xác nhận qua Zalo',
        addonsTitle: 'Tiện ích đi kèm',
        addonsSub: 'Chọn thêm dịch vụ, chúng tôi chuẩn bị trước khi bạn đến.',
        notesTitle: 'Lưu ý',
        bedDefault: '01 giường đôi lớn',
        viewDefault: 'Hướng biển / thung lũng',
        perksDefault: ['Wifi miễn phí', 'Điều hòa', 'Hồ bơi & bida', 'Đồ vệ sinh miễn phí'],

        descTitle: 'Về hạng phòng này',
        amenitiesTitle: 'Tiện nghi trong phòng',
        viewTitle: 'Tầm nhìn',
        conditionsTitle: 'Điều kiện đặt phòng',
        otherRooms: 'Hạng phòng khác',
        roomPrice: 'Tiền phòng',
        extraBedLabel: 'Giường phụ',
        extraBedNote: 'Vượt số khách tiêu chuẩn — đã tính giường phụ.',
        backToRooms: 'Xem hạng phòng khác',
        specArea: 'Diện tích',
        specGuests: 'Sức chứa',
        specBed: 'Giường',
        specView: 'Hướng nhìn',

        toursTitle: 'Combo & Tour đảo',
        toursSub:
            'Vé tàu khứ hồi, phòng nghỉ và lịch trình khám phá quần đảo — trọn gói trong một lần đặt.',
        combosTitle: 'Combo trọn gói',
        filterAll: 'Tất cả',
        viewItinerary: 'Xem lịch trình',
        bookTour: 'Đặt combo này',
        placesKicker: 'Điểm đến',
        placesTitle: '21 hòn đảo, tám điểm không nên bỏ qua',
        placesSub:
            'Từ bãi tắm kín gió đến hải đăng cao nhất Việt Nam — tất cả trong bán kính một chuyến tàu gỗ.',

        itineraryTitle: 'Lịch trình chi tiết',
        includedTitle: 'Giá đã bao gồm',
        excludedTitle: 'Chưa bao gồm',
        specDuration: 'Thời lượng',
        specGroup: 'Quy mô nhóm',
        specDeparture: 'Khởi hành',
        specCode: 'Mã combo',
        backToTours: 'Xem combo khác',
        bookThisTour: 'Đặt combo này',

        galleryTitle: 'Thư viện ảnh',
        gallerySub:
            'Không gian thật tại resort — phòng nghỉ, nhà hàng, hồ bơi và những hòn đảo quanh Nam Du.',
        catAll: 'Tất cả',
        catRooms: 'Phòng nghỉ',
        catDining: 'Ẩm thực',
        catPlaces: 'Điểm đến',
        catResort: 'Khuôn viên',
        photosWord: 'ảnh',
        galleryCtaTitle: 'Thích không gian này?',
        galleryCtaSub: 'Chọn hạng phòng và giữ chỗ ngay hôm nay.',

        contactTitle: 'Liên hệ & Đặt chỗ',
        contactSub:
            'Gọi, nhắn Zalo hoặc gửi biểu mẫu — chúng tôi phản hồi trong vòng 15 phút giờ hành chính.',
        formTitle: 'Gửi yêu cầu',
        formSub: 'Điền thông tin, chúng tôi gọi lại để xác nhận phòng và vé tàu.',
        fName: 'Họ và tên',
        fPhone: 'Số điện thoại',
        fTopic: 'Nội dung',
        fDate: 'Ngày dự kiến',
        fMsg: 'Lời nhắn',
        phName: 'Nguyễn Văn A',
        phMsg: 'Số khách, hạng phòng quan tâm, yêu cầu đặc biệt…',
        sendBtn: 'Gửi yêu cầu',
        sentNote: '✓ Đã ghi nhận. Chúng tôi sẽ liên hệ sớm.',
        topics: ['Đặt phòng', 'Combo & tour', 'Vé tàu', 'Sự kiện / đoàn'],
        locationTitle: 'Vị trí resort',
        openMap: 'Mở Google Maps',
        transportTitle: 'Cách đến Nam Du',
        hoursTitle: 'Giờ làm việc',
        hours: [
            { label: 'Lễ tân', value: '24/7' },
            { label: 'Nhà hàng', value: '06:00 – 22:00' },
            { label: 'Hotline đặt phòng', value: '07:00 – 21:00' },
        ],
        channelPhone: 'Hotline',
        channelZalo: 'Zalo',
        channelEmail: 'Email',
        channelAddress: 'Địa chỉ',
        channelPhoneNote: 'Gọi trực tiếp, phản hồi ngay.',
        channelZaloNote: 'Nhắn tin, gửi ảnh phòng nhanh nhất.',
        channelEmailNote: 'Dành cho đoàn và yêu cầu xuất hoá đơn.',
        channelAddressNote: 'Hòn Củ Tron, quần đảo Nam Du.',
        faqTitle: 'Câu hỏi thường gặp',
        faqSub: 'Những điều khách hay hỏi nhất trước khi đặt.',

        footerAbout: 'Khu nghỉ dưỡng trên đồi hướng biển tại Hòn Củ Tron, quần đảo Nam Du.',
        footerNav: 'Liên kết',
        footerContact: 'Liên hệ',
        footerFollow: 'Theo dõi',
    },

    en: {
        home: 'Home',
        roomsPage: 'Rooms',
        toursPage: 'Tours & Combos',
        galleryPage: 'Gallery',
        contactPage: 'Contact',
        bookNow: 'Book now',
        perNight: 'per night',
        perGuest: 'per guest',
        fromPrice: 'From',
        guestsWord: 'guests',

        roomsTitle: 'Rooms & Suites',
        roomsSub:
            'Seven hillside room types, all facing the sea or the valley. Pick a room and add extras right here.',
        checkIn: 'Check in',
        checkOut: 'Check out',
        guests: 'Guests',
        anyGuests: 'Any',
        sortLabel: 'Sort by',
        sortRec: 'Recommended',
        sortAsc: 'Price low → high',
        sortDesc: 'Price high → low',
        countLabel: 'room types',
        viewDetail: 'Details',
        select: 'Select room',
        selected: 'Selected ✓',
        yourSelection: 'Your selection',
        emptySelection: 'No rooms selected yet. Hit “Select room” in the list.',
        roomsTotal: 'Rooms',
        addonsTotal: 'Extras',
        total: 'Subtotal',
        totalNote: 'One night, excluding holiday surcharges.',
        confirmBooking: 'Confirm on Zalo',
        addonsTitle: 'Add-ons',
        addonsSub: "Pick extra services and we'll have them ready before you arrive.",
        notesTitle: 'Good to know',
        bedDefault: 'One king bed',
        viewDefault: 'Sea / valley view',
        perksDefault: ['Free wifi', 'Air conditioning', 'Pool & billiards', 'Free toiletries'],

        descTitle: 'About this room',
        amenitiesTitle: 'In-room amenities',
        viewTitle: 'The view',
        conditionsTitle: 'Booking conditions',
        otherRooms: 'Other room types',
        roomPrice: 'Room',
        extraBedLabel: 'Extra bed',
        extraBedNote: 'Above standard occupancy — extra bed included.',
        backToRooms: 'Browse other rooms',
        specArea: 'Size',
        specGuests: 'Sleeps',
        specBed: 'Bed',
        specView: 'View',

        toursTitle: 'Tours & Island Combos',
        toursSub:
            'Return ferry, accommodation and island itineraries — everything in a single booking.',
        combosTitle: 'All-inclusive combos',
        filterAll: 'All',
        viewItinerary: 'View itinerary',
        bookTour: 'Book this combo',
        placesKicker: 'Destinations',
        placesTitle: '21 islands, eight you should not miss',
        placesSub:
            'From sheltered beaches to the tallest lighthouse in Vietnam — all within one wooden-boat ride.',

        itineraryTitle: 'Detailed itinerary',
        includedTitle: 'What is included',
        excludedTitle: 'Not included',
        specDuration: 'Duration',
        specGroup: 'Group size',
        specDeparture: 'Departure',
        specCode: 'Combo code',
        backToTours: 'Browse other combos',
        bookThisTour: 'Book this combo',

        galleryTitle: 'Gallery',
        gallerySub:
            'Real spaces at the resort — rooms, restaurant, pool and the islands around Nam Du.',
        catAll: 'All',
        catRooms: 'Rooms',
        catDining: 'Dining',
        catPlaces: 'Destinations',
        catResort: 'Grounds',
        photosWord: 'photos',
        galleryCtaTitle: 'Like what you see?',
        galleryCtaSub: 'Pick a room type and secure your dates today.',

        contactTitle: 'Contact & Reservations',
        contactSub:
            'Call, message us on Zalo or send the form — we reply within 15 minutes during office hours.',
        formTitle: 'Send a request',
        formSub: 'Fill in your details and we will call back to confirm rooms and ferry tickets.',
        fName: 'Full name',
        fPhone: 'Phone number',
        fTopic: 'Topic',
        fDate: 'Preferred date',
        fMsg: 'Message',
        phName: 'John Smith',
        phMsg: 'Number of guests, room type of interest, special requests…',
        sendBtn: 'Send request',
        sentNote: '✓ Received. We will be in touch shortly.',
        topics: ['Room booking', 'Tours & combos', 'Ferry tickets', 'Events / groups'],
        locationTitle: 'Resort location',
        openMap: 'Open in Google Maps',
        transportTitle: 'Getting to Nam Du',
        hoursTitle: 'Opening hours',
        hours: [
            { label: 'Front desk', value: '24/7' },
            { label: 'Restaurant', value: '06:00 – 22:00' },
            { label: 'Reservations hotline', value: '07:00 – 21:00' },
        ],
        channelPhone: 'Hotline',
        channelZalo: 'Zalo',
        channelEmail: 'Email',
        channelAddress: 'Address',
        channelPhoneNote: 'Call us directly for an instant answer.',
        channelZaloNote: 'Message us — fastest way to get room photos.',
        channelEmailNote: 'For groups and invoice requests.',
        channelAddressNote: 'Hon Cu Tron, Nam Du archipelago.',
        faqTitle: 'Frequently asked questions',
        faqSub: 'What guests ask most before booking.',

        footerAbout: 'A hillside resort facing the sea on Hon Cu Tron, Nam Du archipelago.',
        footerNav: 'Links',
        footerContact: 'Contact',
        footerFollow: 'Follow',
    },
}
