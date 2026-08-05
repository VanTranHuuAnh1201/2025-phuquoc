import { t, type I18nText } from '@repo/core'
import type { UiStrings, UiStringSet } from '@repo/domain-hotel'

/**
 * Nhãn riêng của mẫu 03 — những chuỗi `@repo/core` chưa có.
 *
 * VÌ SAO Ở ĐÂY CHỨ KHÔNG THÊM VÀO `UI` CỦA CORE (luật R12): ba chuỗi dưới đây
 * chỉ mẫu này dùng. Chuỗi nào sau này có mẫu thứ hai cần thì mới đẩy lên
 * `domain-hotel/strings.ts` — đẩy sớm là làm phình hợp đồng chung vì một nơi
 * dùng.
 *
 * Song ngữ là bắt buộc kể cả ở đây (luật R6).
 */
export const H3 = {
    /** Giá trị mặc định của ô "Số khách" trên thanh tìm phòng. */
    defaultGuests: t('2 khách', '2 guests'),
    /** Giá trị mặc định của ô "Chọn phòng" — chưa lọc hạng nào. */
    defaultRoomType: t('Tất cả hạng phòng', 'All room types'),
    /** Nhãn của chấm chỉ vị trí slide hero; số thứ tự nối vào sau. */
    slide: t('Ảnh', 'Slide'),
    /** Tiêu đề khối đánh giá trong section `about`. */
    pastGuestsSay: t('Khách đã ở nói gì', 'What past guests say'),
    /** Tiêu đề và mô tả của thư viện ảnh thật. */
    realPhotosTitle: t('Ảnh thật tại resort', 'Real photos at the resort'),
    realPhotosDesc: t(
        'Phòng nghỉ, hồ bơi, nhà hàng và sân hiên',
        'Rooms, pool, restaurant and terraces',
    ),
} satisfies Record<string, I18nText>

/**
 * Bộ nhãn giao diện của mẫu 03, cấp cho các section dùng chung của
 * `@repo/domain-hotel` (Rooms, Practical).
 *
 * VÌ SAO MỖI MẪU MỘT BỘ CHỨ KHÔNG DÙNG CHUNG MỘT: giọng văn là bản sắc của
 * mẫu, không phải nghiệp vụ lưu trú (luật R12 — "khẩu hiệu, giọng điệu riêng
 * của một mẫu thì ở lại theme đó"). Mẫu 02 mời gọi và giàu hình ảnh; mẫu 03 là
 * navy trầm nên câu ngắn, nói thẳng vào việc.
 *
 * ĐÂY KHÔNG PHẢI BẢN CHÉP CỦA MẪU 02: cùng bộ KHOÁ (hợp đồng `UiStrings`),
 * khác GIÁ TRỊ. Nếu hai mẫu rồi ra dùng đúng từng chữ như nhau thì chuỗi đó
 * mới nên đẩy lên `domain-hotel/strings.ts`.
 */
export const ui: UiStringSet<UiStrings> = {
    vi: {
        phoneLabel: 'Hotline / Zalo',
        bookNow: 'Đặt phòng',
        checkIn: 'Nhận phòng',
        checkOut: 'Trả phòng',
        guests: 'Số khách',
        guestsWord: 'khách',
        stayType: 'Hình thức',
        stayRoom: 'Chỉ phòng nghỉ',
        stayCombo2: 'Combo 2N1Đ',
        stayCombo3: 'Combo 3N2Đ',
        search: 'Kiểm tra phòng trống',
        perNight: '/ đêm',
        viewAll: 'Xem tất cả',
        heroImage: 'Toàn cảnh resort trên đồi, hướng ra vịnh Nam Du',
        roomsKicker: 'Hạng phòng',
        roomsTitle: 'Chọn nơi bạn sẽ thức dậy',
        roomsSub: 'Sáu hạng phòng, tất cả đều có ban công riêng hướng biển hoặc thung lũng.',
        toursKicker: 'Combo',
        toursTitle: 'Đặt một lần, đi được ngay',
        toursSub: 'Vé tàu khứ hồi, phòng nghỉ và tour đảo gộp trong một đơn.',
        fromPrice: 'Từ',
        perGuest: '/ khách',
        bookTour: 'Đặt combo',
        placesKicker: 'Trên đảo',
        placesTitle: 'Tám điểm đáng đi trong quần đảo',
        placesSub: 'Bãi tắm kín gió, hải đăng, rạn san hô — tất cả trong một chuyến tàu gỗ.',
        diningKicker: 'Ăn uống',
        diningTitle: 'Hải sản lên bờ buổi sáng, lên bàn buổi trưa',
        diningSub: 'Mua trực tiếp từ ghe và lồng bè Hòn Ngang.',
        transportTitle: 'Đường ra đảo',
        transportSub: 'Hai chặng: xe tới Rạch Giá, rồi tàu cao tốc ra Nam Du.',
        notesTitle: 'Cần biết trước khi đi',
        faqTitle: 'Câu hỏi thường gặp',
        faqSub: 'Những điều khách hay hỏi nhất.',
        galleryKicker: 'Thư viện',
        galleryTitle: 'Ảnh thật tại resort',
        ctaTitle: 'Chọn ngày, phần còn lại để chúng tôi lo.',
        ctaSub: 'Nhắn Zalo hoặc gửi email — xác nhận phòng và vé tàu trong 15 phút.',
        emailUs: 'Gửi email',
        footerAbout: 'Khu nghỉ dưỡng trên đồi hướng biển tại Hòn Củ Tron, quần đảo Nam Du.',
        footerNav: 'Liên kết',
        footerContact: 'Liên hệ',
        footerFollow: 'Theo dõi',
    },
    en: {
        phoneLabel: 'Hotline / Zalo',
        bookNow: 'Book now',
        checkIn: 'Check in',
        checkOut: 'Check out',
        guests: 'Guests',
        guestsWord: 'guests',
        stayType: 'Stay type',
        stayRoom: 'Room only',
        stayCombo2: '2D1N bundle',
        stayCombo3: '3D2N bundle',
        search: 'Check availability',
        perNight: '/ night',
        viewAll: 'View all',
        heroImage: 'The hillside resort overlooking Nam Du bay',
        roomsKicker: 'Rooms',
        roomsTitle: 'Choose where you wake up',
        roomsSub: 'Six room types, each with a private balcony over the sea or the valley.',
        toursKicker: 'Bundles',
        toursTitle: 'Book once, travel ready',
        toursSub: 'Return ferry, room and island tour in a single order.',
        fromPrice: 'From',
        perGuest: '/ guest',
        bookTour: 'Book bundle',
        placesKicker: 'On the islands',
        placesTitle: 'Eight places worth the trip',
        placesSub:
            'Sheltered beaches, a lighthouse, coral reefs — all within one wooden-boat ride.',
        diningKicker: 'Dining',
        diningTitle: 'Landed in the morning, served at noon',
        diningSub: "Bought straight off the boats and Hon Ngang's floating pens.",
        transportTitle: 'Getting there',
        transportSub: 'Two legs: overland to Rach Gia, then a speedboat to Nam Du.',
        notesTitle: 'Before you travel',
        faqTitle: 'Frequently asked',
        faqSub: 'What guests ask most.',
        galleryKicker: 'Gallery',
        galleryTitle: 'Real photos at the resort',
        ctaTitle: 'Pick your dates. We handle the rest.',
        ctaSub: 'Message us on Zalo or email — rooms and ferry tickets confirmed within 15 minutes.',
        emailUs: 'Email us',
        footerAbout: 'A hillside resort facing the sea on Hon Cu Tron, Nam Du archipelago.',
        footerNav: 'Links',
        footerContact: 'Contact',
        footerFollow: 'Follow',
    },
}
