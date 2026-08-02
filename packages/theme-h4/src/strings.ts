import type { UiStrings, UiStringSet } from '@repo/ui'

/**
 * Nhãn giao diện của mẫu 04 — port từ hằng `UI` trong prototype
 * `Home 04 - Nam Du Hill.dc.html`.
 *
 * Mẫu 04 có vài nhãn riêng không nằm trong hợp đồng chung: dòng chào ở thanh
 * trên cùng (`topline`), cụm tiêu đề hero tách hai vế (`heroLead`,
 * `heroTitleA`, `heroTitleB`), thẻ nổi điểm đánh giá (`ratingLabel`,
 * `reviews`) và nút gọi nhanh (`moreInfo`). Chúng là giọng riêng của mẫu này
 * nên khai thêm bằng cách mở rộng `UiStrings`, không đẩy lên `ui`.
 */
export interface H4Strings extends UiStrings {
    /** Dòng chữ nghiêng ở thanh trên cùng. */
    topline: string
    /** Vế dẫn nhỏ phía trên tiêu đề hero. */
    heroLead: string
    /** Vế đầu tiêu đề hero — màu teal. */
    heroTitleA: string
    /** Vế sau tiêu đề hero — màu nhấn. */
    heroTitleB: string
    /** Nhãn cạnh nút gọi điện ở hero. */
    moreInfo: string
    /** Nhãn thẻ nổi điểm đánh giá. */
    ratingLabel: string
    /** Số lượt đánh giá. */
    reviews: string
    /** Nhãn liên kết quay về trang tổng ở chân trang. */
    backHub: string
}

export const ui: UiStringSet<H4Strings> = {
    vi: {
        topline: 'Hành trình tiếp theo đang chờ bạn — Nam Du mùa biển đẹp 2026',
        phoneLabel: 'Tư vấn nhanh',
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
        search: 'Tìm phòng',
        heroImage: 'Ảnh hero chính — vịnh biển Nam Du',
        heroLead: 'Đã đến lúc',
        heroTitleA: 'Nghỉ dưỡng trên đồi,',
        heroTitleB: 'thức giấc cùng 21 hòn đảo',
        moreInfo: 'Tư vấn nhanh',
        ratingLabel: 'Khách đánh giá',
        reviews: '412 lượt',
        perNight: 'mỗi đêm',
        roomsKicker: 'Hạng phòng',
        roomsTitle: 'Sáu hạng phòng, một tầm nhìn',
        roomsSub: 'Từ 26 m² đến 56 m², tất cả đều hướng biển hoặc thung lũng.',
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
        backHub: 'Về trang tổng',
    },
    en: {
        topline: "Your next escape is waiting — Nam Du's best season, 2026",
        phoneLabel: 'Talk to us',
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
        search: 'Search rooms',
        heroImage: 'Main hero image — Nam Du bay',
        heroLead: "It's time for",
        heroTitleA: 'A hillside retreat',
        heroTitleB: 'above 21 islands',
        moreInfo: 'Talk to us',
        ratingLabel: 'Guest rating',
        reviews: '412 reviews',
        perNight: 'per night',
        roomsKicker: 'Rooms & Suites',
        roomsTitle: 'Six room types, one view',
        roomsSub: 'From 26 m² to 56 m², all facing the sea or the valley.',
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
        backHub: 'Back to showcase',
    },
}
