import type { Locale } from '@repo/core'

/**
 * Nhãn giao diện của các TRANG CON dùng chung (Tours, Tour Detail, Gallery,
 * Contact).
 *
 * VÌ SAO Ở `ui` CHỨ KHÔNG Ở TỪNG THEME: bốn trang này chỉ có MỘT bản thiết kế
 * trong `resources/design/project/` — không có `Tours H2`, `Gallery H3`… như
 * Rooms hay Checkout. Bốn mẫu vì thế dùng chung một bố cục, chỉ khác token màu
 * và font. Để mỗi theme tự khai lại bộ nhãn này là chép code giữa các mẫu, đúng
 * thứ luật R1 cấm.
 *
 * Khác với `UiStrings` (mỗi mẫu tự viết vì giọng văn trang chủ khác nhau), bộ
 * này có bản mặc định dùng được ngay ở `defaultPageStrings`. Mẫu nào muốn đổi
 * giọng thì truyền `strings` riêng vào trang — không bắt buộc.
 */
export interface PageStrings {
    // ---- điều hướng chung ----
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

    // ---- Tours ----
    toursTitle: string
    toursSub: string
    combosTitle: string
    viewItinerary: string
    bookTour: string
    placesKicker: string
    placesTitle: string
    placesSub: string

    // ---- Tour Detail ----
    itineraryTitle: string
    includedTitle: string
    excludedTitle: string
    tourNotesTitle: string
    otherTours: string
    backToTours: string
    departureTitle: string
    durationLabel: string
    groupSizeLabel: string

    // ---- Gallery ----
    galleryTitle: string
    gallerySub: string
    filterAll: string
    galleryCtaTitle: string
    galleryCtaSub: string
    viewRooms: string
    contactUs: string

    // ---- Dining ----
    diningPage: string
    diningTitle: string
    diningSub: string
    venuesTitle: string
    menuTitle: string
    menuSub: string
    menuNote: string
    diningCtaTitle: string
    diningCtaSub: string

    // ---- Blog ----
    blogPage: string
    blogTitle: string
    blogSub: string
    readMore: string
    minRead: string
    latestTitle: string
    blogEmpty: string
    byAuthor: string
    backToBlog: string
    tagsTitle: string
    relatedTitle: string

    // ---- Contact ----
    contactTitle: string
    contactSub: string
    formTitle: string
    formName: string
    formPhone: string
    formEmail: string
    formMessage: string
    formSubmit: string
    formNote: string
    addressTitle: string
    hotlineTitle: string
    emailTitle: string
    hoursTitle: string
    hoursValue: string
    mapTitle: string
    faqTitle: string

    // ---- chân trang ----
    footerAbout: string
    footerNav: string
    footerContact: string
    footerFollow: string
    backToHub: string
}

/** Bộ chuỗi đầy đủ hai ngôn ngữ. */
export type PageStringSet = Record<Locale, PageStrings>

/**
 * Bản mặc định — port nguyên văn từ hằng `UI` trong các prototype
 * `Tours / Tour Detail / Gallery / Contact - Nam Du Hill.dc.html`.
 *
 * Song ngữ đầy đủ theo luật R6.
 */
export const defaultPageStrings: PageStringSet = {
    vi: {
        home: 'Trang chủ',
        roomsPage: 'Hạng phòng',
        toursPage: 'Combo & Tour',
        galleryPage: 'Thư viện ảnh',
        contactPage: 'Liên hệ',
        bookNow: 'Đặt phòng',
        perNight: '/ đêm',
        perGuest: '/ khách',
        fromPrice: 'Chỉ từ',
        guestsWord: 'khách',

        toursTitle: 'Combo & Tour đảo Nam Du',
        toursSub:
            'Trọn gói tàu cao tốc, phòng nghỉ và lịch trình khám phá quần đảo. Giá đã bao gồm mọi chi phí chính.',
        combosTitle: 'Các combo đang mở bán',
        viewItinerary: 'Xem lịch trình',
        bookTour: 'Đặt combo',
        placesKicker: 'Điểm đến',
        placesTitle: 'Những nơi bạn sẽ đi qua',
        placesSub: 'Bãi tắm, hòn đảo nhỏ và điểm ngắm hoàng hôn nằm trong lịch trình.',

        itineraryTitle: 'Lịch trình chi tiết',
        includedTitle: 'Giá đã bao gồm',
        excludedTitle: 'Chưa bao gồm',
        tourNotesTitle: 'Lưu ý khi đi tour',
        otherTours: 'Combo khác',
        backToTours: 'Xem tất cả combo',
        departureTitle: 'Khởi hành',
        durationLabel: 'Thời lượng',
        groupSizeLabel: 'Quy mô đoàn',

        galleryTitle: 'Thư viện ảnh',
        gallerySub: 'Hình ảnh thực tế phòng nghỉ, bãi biển và các điểm đến quanh đảo.',
        filterAll: 'Tất cả',
        galleryCtaTitle: 'Thích không gian này?',
        galleryCtaSub: 'Xem hạng phòng còn trống hoặc liên hệ để được tư vấn lịch trình.',
        viewRooms: 'Xem hạng phòng',
        contactUs: 'Liên hệ tư vấn',

        diningPage: 'Ẩm thực',
        diningTitle: 'Ẩm thực tại Nam Du Hill',
        diningSub:
            'Hải sản đánh bắt trong ngày, bếp Việt và quầy bar hướng biển. Thực đơn đổi theo mẻ cá về mỗi sáng.',
        venuesTitle: 'Các điểm ăn uống',
        menuTitle: 'Thực đơn tham khảo',
        menuSub: 'Giá đã bao gồm thuế và phí phục vụ.',
        menuNote: 'Hải sản tính theo giá thị trường trong ngày — lễ tân báo giá trước khi chế biến.',
        diningCtaTitle: 'Đặt bàn hoặc báo suất ăn',
        diningCtaSub: 'Báo trước một ngày để bếp chuẩn bị, nhất là với đoàn đông hoặc khách ăn chay.',

        blogPage: 'Cẩm nang',
        blogTitle: 'Cẩm nang Nam Du',
        blogSub:
            'Kinh nghiệm đi lại, lịch trình gợi ý và những điều nên biết trước chuyến đi — viết bởi đội ngũ tại đảo.',
        readMore: 'Đọc tiếp',
        minRead: 'phút đọc',
        latestTitle: 'Bài viết mới nhất',
        blogEmpty: 'Chưa có bài viết trong mục này. Chọn mục khác hoặc xem tất cả bài viết.',
        byAuthor: 'bởi',
        backToBlog: '← Xem tất cả bài viết',
        tagsTitle: 'Chủ đề',
        relatedTitle: 'Bài viết khác',

        contactTitle: 'Liên hệ & Đặt chỗ',
        contactSub:
            'Gọi hotline để giữ phòng nhanh nhất, hoặc để lại thông tin — chúng tôi gọi lại trong 15 phút.',
        formTitle: 'Gửi yêu cầu',
        formName: 'Họ và tên',
        formPhone: 'Số điện thoại',
        formEmail: 'Email',
        formMessage: 'Nội dung',
        formSubmit: 'Gửi yêu cầu',
        formNote: 'Bản demo — biểu mẫu chưa gửi đi đâu.',
        addressTitle: 'Địa chỉ',
        hotlineTitle: 'Hotline / Zalo',
        emailTitle: 'Email',
        hoursTitle: 'Giờ làm việc',
        hoursValue: 'Nhận phòng 14:00 · Trả phòng 12:00 · Lễ tân 24/7',
        mapTitle: 'Bản đồ',
        faqTitle: 'Câu hỏi thường gặp',

        footerAbout:
            'Khu nghỉ dưỡng trên đảo Nam Du — phòng hướng biển, combo tàu cao tốc và tour khám phá quần đảo.',
        footerNav: 'Điều hướng',
        footerContact: 'Liên hệ',
        footerFollow: 'Theo dõi',
        backToHub: '← Về trang tổng',
    },
    en: {
        home: 'Home',
        roomsPage: 'Rooms',
        toursPage: 'Tours & Packages',
        galleryPage: 'Gallery',
        contactPage: 'Contact',
        bookNow: 'Book now',
        perNight: '/ night',
        perGuest: '/ guest',
        fromPrice: 'From',
        guestsWord: 'guests',

        toursTitle: 'Nam Du Island packages',
        toursSub:
            'Speedboat transfers, accommodation and a guided island itinerary in one price. All core costs included.',
        combosTitle: 'Packages on sale',
        viewItinerary: 'View itinerary',
        bookTour: 'Book package',
        placesKicker: 'Destinations',
        placesTitle: 'Where the itinerary takes you',
        placesSub: 'Beaches, outlying islets and sunset points included in the route.',

        itineraryTitle: 'Detailed itinerary',
        includedTitle: 'Price includes',
        excludedTitle: 'Not included',
        tourNotesTitle: 'Before you go',
        otherTours: 'Other packages',
        backToTours: 'View all packages',
        departureTitle: 'Departure',
        durationLabel: 'Duration',
        groupSizeLabel: 'Group size',

        galleryTitle: 'Gallery',
        gallerySub: 'Real photos of the rooms, the beach and destinations around the island.',
        filterAll: 'All',
        galleryCtaTitle: 'Like what you see?',
        galleryCtaSub: 'Check room availability, or reach out and we will plan the itinerary with you.',
        viewRooms: 'View rooms',
        contactUs: 'Talk to us',

        diningPage: 'Dining',
        diningTitle: 'Dining at Nam Du Hill',
        diningSub:
            'Seafood landed the same morning, a Vietnamese kitchen and a bar facing the water. The menu shifts with each catch.',
        venuesTitle: 'Where to eat',
        menuTitle: 'Sample menu',
        menuSub: 'Prices include tax and service charge.',
        menuNote: 'Seafood is charged at the day rate — the front desk quotes you before cooking.',
        diningCtaTitle: 'Reserve a table or pre-order meals',
        diningCtaSub: 'Give the kitchen a day of notice, especially for large groups or vegetarian guests.',

        blogPage: 'Guides',
        blogTitle: 'The Nam Du guide',
        blogSub:
            'How to get here, itineraries worth copying and what to know before you go — written by the team on the island.',
        readMore: 'Read on',
        minRead: 'min read',
        latestTitle: 'Latest articles',
        blogEmpty: 'No articles in this category yet. Pick another, or view all articles.',
        byAuthor: 'by',
        backToBlog: '← View all articles',
        tagsTitle: 'Topics',
        relatedTitle: 'More articles',

        contactTitle: 'Contact & Booking',
        contactSub:
            'Call the hotline to hold a room straight away, or leave your details — we call back within 15 minutes.',
        formTitle: 'Send a request',
        formName: 'Full name',
        formPhone: 'Phone number',
        formEmail: 'Email',
        formMessage: 'Message',
        formSubmit: 'Send request',
        formNote: 'Demo build — this form does not submit anywhere.',
        addressTitle: 'Address',
        hotlineTitle: 'Hotline / Zalo',
        emailTitle: 'Email',
        hoursTitle: 'Opening hours',
        hoursValue: 'Check-in 14:00 · Check-out 12:00 · Front desk 24/7',
        mapTitle: 'Map',
        faqTitle: 'Frequently asked questions',

        footerAbout:
            'An island resort on Nam Du — sea-facing rooms, speedboat packages and guided archipelago tours.',
        footerNav: 'Navigation',
        footerContact: 'Contact',
        footerFollow: 'Follow',
        backToHub: '← Back to showcase',
    },
}
