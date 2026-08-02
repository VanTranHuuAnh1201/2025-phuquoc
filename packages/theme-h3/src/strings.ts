import type { UiStrings, UiStringSet } from '@repo/ui'

/**
 * Nhãn giao diện của mẫu 03 — port từ hằng `UI` trong prototype
 * `Home 03 - Nam Du Hill.dc.html`.
 *
 * Mẫu 03 có thêm dải "chọn theo chủ đề" mà ba mẫu kia không có, nên mở rộng
 * `UiStrings` thay vì đẩy nhãn riêng lên `ui` (xem chú thích trong
 * `packages/ui/src/strings.ts`).
 *
 * Vài nhãn prototype không khai vì layout không dùng (`heroImage`, `fromPrice`,
 * `perGuest`): hợp đồng `UiStrings` vẫn bắt buộc có, nên điền chuỗi hợp lý
 * theo giọng của mẫu này để lỡ sau có dùng thì đã sẵn sàng.
 */

export interface H3Strings extends UiStrings {
    themesKicker: string
    themesTitle: string
    themesSub: string
    themes: string[]
}

export const ui: UiStringSet<H3Strings> = {
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
        search: 'Tìm phòng',
        heroImage: 'Ảnh hero — resort trên đồi hướng biển Nam Du',
        perNight: 'mỗi đêm',
        roomsKicker: 'Hạng phòng',
        roomsTitle: 'Sáu hạng phòng, một tầm nhìn',
        roomsSub: 'Từ 26 m² đến 56 m², tất cả đều hướng biển hoặc thung lũng.',
        toursKicker: 'Lịch trình',
        toursTitle: 'Combo trọn gói, không lo lịch trình',
        toursSub: 'Chọn một combo bên trái để xem lịch trình chi tiết từng ngày.',
        fromPrice: 'Giá từ',
        perGuest: 'mỗi khách',
        bookTour: 'Đặt combo này',
        themesKicker: 'Chọn theo sở thích',
        themesTitle: 'Bạn muốn chuyến đi thế nào?',
        themesSub: 'Chọn một chủ đề, chúng tôi gợi ý lịch trình và hạng phòng phù hợp.',
        themes: ['Nghỉ dưỡng', 'Cặp đôi', 'Gia đình', 'Lặn san hô', 'Ẩm thực', 'Nhóm bạn'],
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
        search: 'Search rooms',
        heroImage: 'Hero image — hillside resort facing the sea, Nam Du',
        perNight: 'per night',
        roomsKicker: 'Rooms & Suites',
        roomsTitle: 'Six room types, one view',
        roomsSub: 'From 26 m² to 56 m², all facing the sea or the valley.',
        toursKicker: 'Itineraries',
        toursTitle: 'All-in bundles, no planning needed',
        toursSub: 'Pick a bundle on the left to see the day-by-day plan.',
        fromPrice: 'From',
        perGuest: 'per guest',
        bookTour: 'Book this bundle',
        themesKicker: 'Browse by theme',
        themesTitle: 'What kind of trip do you want?',
        themesSub: "Pick a theme and we'll suggest the itinerary and room type to match.",
        themes: ['Retreat', 'Couples', 'Family', 'Snorkelling', 'Food', 'Groups'],
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
    },
}
