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

    // ------------------------------------------------- trust & giải toả nỗi sợ
    /*
     * Ba khối dưới đây phục vụ chuẩn V3-Fixed: nỗi sợ lớn nhất của khách ra đảo
     * là "đặt rồi tàu không chạy thì mất tiền". Câu trả lời phải nằm NGAY cạnh
     * nút đặt phòng, không chôn trong trang chính sách — đọc sau khi đã do dự
     * thì đã muộn (luật P10).
     *
     * Giữ ở H3 chứ chưa đẩy lên `domain-hotel`: mới một mẫu dùng. Có mẫu thứ
     * hai cần thì mới nâng lên (luật R12).
     */
    /** Nhãn nút gọi trên hero. Số máy nối vào sau, lấy từ `data.brand.phone`. */
    hotlineDirect: t('Hotline chính chủ', 'Owner direct line'),
    /** Câu giải toả nỗi sợ số một khi đặt phòng ngoài đảo. */
    ferryDelayFree: t(
        'Tàu hoãn do thời tiết: dời ngày miễn phí',
        'Ferry delayed by weather: free date change',
    ),

    /** Ba cột của dải tín nhiệm ngay dưới hero. */
    trustOwnerTitle: t('Chính chủ sở hữu', 'Owner-operated'),
    trustOwnerDesc: t(
        'Resort do người bản địa Nam Du xây dựng và vận hành trực tiếp — đặt phòng không qua trung gian.',
        'Built and run directly by a Nam Du local family — book with no middleman.',
    ),
    trustTransferTitle: t('Hỗ trợ di chuyển', 'Travel support'),
    trustTransferDesc: t(
        'Xe điện đón tận bến tàu Nam Du, hỗ trợ đặt vé tàu cao tốc Rạch Giá – Nam Du.',
        'Electric shuttle meets you at Nam Du pier; we help book the Rach Gia ferry.',
    ),
    trustRefundTitle: t('Cam kết hoàn huỷ', 'Cancellation promise'),
    trustRefundDesc: t(
        'Thời tiết xấu tàu không chạy: dời ngày miễn phí hoặc hoàn 100% tiền cọc.',
        'If bad weather stops the ferry: free date change or a full deposit refund.',
    ),

    /**
     * Hậu tố giá trên thanh đặt phòng dính đáy màn hình (mobile).
     * "Từ" đã có ở `UI.from` của core nên không khai lại (luật R12).
     */
    stickyPerNight: t('/đêm', '/night'),
    /** Tiêu đề và mô tả của thư viện ảnh thật. */
    realPhotosTitle: t('Ảnh thật tại resort', 'Real photos at the resort'),
    realPhotosDesc: t(
        'Phòng nghỉ, hồ bơi, nhà hàng và sân hiên',
        'Rooms, pool, restaurant and terraces',
    ),

    // ------------------------------------------------------ trang thư viện ảnh
    /** Nhãn breadcrumb và tiêu đề hero của `/[theme]/gallery`. */
    galleryPage: t('Thư viện ảnh', 'Gallery'),
    galleryTitle: t('Thư viện ảnh', 'Photo gallery'),
    gallerySub: t(
        'Hình ảnh thực tế phòng nghỉ, khuôn viên và các điểm đến quanh đảo.',
        'Real photos of the rooms, the grounds and destinations around the island.',
    ),
    /** Nhãn nhóm trên thanh lọc ảnh. Khoá khớp `ResortPhotoCategory` của domain. */
    photoGroupAll: t('Tất cả', 'All'),
    photoGroupRooms: t('Phòng nghỉ', 'Rooms'),
    photoGroupDining: t('Ẩm thực', 'Dining'),
    photoGroupPlaces: t('Điểm đến', 'Destinations'),
    photoGroupResort: t('Khuôn viên', 'Grounds'),
    photoGroupViews: t('Cảnh quan', 'Views'),
    /** Đơn vị đếm sau con số: "128 ảnh". */
    photosWord: t('ảnh', 'photos'),
    /** Trạng thái rỗng phải nói rõ làm gì tiếp (luật D6). */
    galleryEmpty: t(
        'Nhóm này chưa có ảnh. Chọn “Tất cả” để xem toàn bộ thư viện.',
        'No photos in this group yet. Choose “All” to see the full gallery.',
    ),
    galleryCtaTitle: t('Thích không gian này?', 'Like what you see?'),
    galleryCtaSub: t(
        'Kiểm tra phòng trống và đặt trực tiếp với resort.',
        'Check availability and book your stay directly with us.',
    ),
    viewRooms: t('Xem phòng', 'View rooms'),

    // ----------------------------------------------------------- trang liên hệ
    /** Nhãn `title` của iframe bản đồ — bắt buộc để trình đọc màn hình gọi tên. */
    mapTitle: t('Bản đồ đường tới resort', 'Map to the resort'),

    // ------------------------------------------------------------ trang cẩm nang
    blogFilterAll: t('Tất cả bài viết', 'All articles'),
    blogEmpty: t(
        'Chuyên mục này chưa có bài. Chọn “Tất cả bài viết” để xem toàn bộ.',
        'No articles in this category yet. Choose “All articles” to see everything.',
    ),
    /** Nhãn hai nút trong khối mời đặt phòng ở sidebar bài viết. */
    seeRoomTypes: t('Xem các hạng phòng', 'See room types'),
    callHotline: t('Gọi', 'Call'),

    // ------------------------------------------- trang danh sách hạng phòng
    /** Nhãn các nhóm lọc. Khoá khớp `Room.group` của core, riêng `sea` lọc theo thẻ. */
    filterAll: t('Tất cả', 'All'),
    filterCouple: t('2 khách', 'For two'),
    filterFamily: t('Gia đình', 'Family'),
    filterSuite: t('Suite', 'Suites'),
    filterSeaView: t('View biển', 'Sea view'),
    /** Bậc sắp xếp mặc định — ba bậc còn lại đã có trong `UI` của core. */
    sortRecommended: t('Khuyên dùng', 'Recommended'),
    /** Nút chốt trong modal lọc; số phòng khớp được nối vào sau. */
    applyFilter: t('Áp dụng', 'Apply'),
    /** Trạng thái rỗng — nói rõ phải làm gì tiếp, không chỉ "không có kết quả" (D6). */
    noRoomMatchesFilter: t(
        'Không có hạng phòng nào khớp bộ lọc. Bỏ bớt điều kiện hoặc chọn "Tất cả".',
        'No room type matches these filters. Remove a condition or pick "All".',
    ),

    // ------------------------------------------------------------ trang ẩm thực
    /** Badge giá trên thẻ "Outdoor BBQ" — con số này là giá niêm yết của quán. */
    bbqPerTable: t('300.000Đ / BÀN', '300,000₫ / TABLE'),

    // -------------------------------------------------- trang khám phá (Tours)
    /** Khối "Tiện nghi & dịch vụ" — nội dung biên tập của khách hàng. */
    amenitiesKicker: t('Tiện nghi & dịch vụ', 'Amenities & services'),
    amenitiesTitle: t(
        'Tiện nghi & dịch vụ tại The Nam Du Hill Resort',
        'Amenities & services at The Nam Du Hill Resort',
    ),
    amenitiesLead: t(
        'Hệ thống tiện nghi và dịch vụ tại The Nam Du Hill Resort được thiết kế hài hòa với thiên nhiên, mang đến cho du khách cảm giác thư giãn trọn vẹn giữa không gian biển đảo yên bình.',
        'Amenities and services at The Nam Du Hill Resort are designed in harmony with nature, giving guests a full sense of ease within the calm of the islands.',
    ),
    amenitiesLead2: t(
        'Dù bạn đến Nam Du để nghỉ dưỡng, khám phá hay đơn giản là tìm lại sự cân bằng, chúng tôi luôn sẵn sàng đáp ứng bằng sự hiếu khách chân thành và chu đáo.',
        'Whether you come to Nam Du to rest, to explore, or simply to find your balance again, we are ready with genuine and attentive hospitality.',
    ),
    amenityNatureBadge: t('Hài hòa với thiên nhiên', 'Designed with nature'),
    /** Bốn điểm nhấn dịch vụ dưới đoạn mở đầu. */
    amenitySeaviewBar: t('Café & bar hướng biển', 'Sea-view café & bar'),
    amenityIslandTours: t('Tour tham quan đảo', 'Island tours'),
    amenitySnorkelling: t('Lặn ngắm san hô', 'Coral snorkelling'),
    amenityTransfers: t('Di chuyển cano', 'Speedboat transfers'),
    amenityCafeTitle: t('Café & bar hướng biển', 'Café & bar facing the sea'),
    amenityCafeText: t(
        'Du khách có thể tận hưởng khu café & bar với tầm nhìn hướng biển, lý tưởng để ngắm bình minh hay hoàng hôn trên đảo. Đội ngũ resort hỗ trợ sắp xếp tour tham quan đảo, trải nghiệm biển, lặn ngắm san hô và di chuyển cano, giúp hành trình của bạn trở nên thuận tiện và trọn vẹn hơn.',
        'Guests can enjoy the café & bar looking out to sea, an ideal spot to watch sunrise or sunset over the island. Our team helps arrange island tours, sea experiences, coral snorkelling and speedboat transfers, making your journey easier and more complete.',
    ),
    amenityQuietTitle: t('Không gian yên tĩnh để thả lỏng', 'A quiet place to unwind'),
    amenityQuietText: t(
        'Với không gian yên tĩnh, gần gũi thiên nhiên cùng các tiện ích thiết yếu phục vụ nghỉ dưỡng, The Nam Du Hill Resort là điểm dừng chân lý tưởng để bạn thả lỏng cơ thể, tái tạo năng lượng và tận hưởng nhịp sống chậm giữa vẻ đẹp nguyên sơ của Nam Du.',
        'With quiet surroundings close to nature and the essentials for a restful stay, The Nam Du Hill Resort is an ideal place to unwind, recover your energy and enjoy the slower pace of life amid the untouched beauty of Nam Du.',
    ),
    /** Kicker và nhãn liên kết của khối cẩm nang trên trang khám phá. */
    guideKicker: t('Cẩm nang & Kinh nghiệm du lịch', 'Travel guide & tips'),
    allArticles: t('Tất cả bài viết', 'All articles'),
    readArticle: t('Xem bài viết', 'Read the article'),
    articleDetail: t('Chi tiết bài viết', 'Read more'),

    // ------------------------------------------------------- trang thanh toán
    /** Mô tả phương thức MoMo; số hotline nối vào sau. */
    transferToHotline: t('Chuyển tiền tới Hotline', 'Transfer to hotline'),
    /** Nói thẳng đây là bản demo — không để khách tưởng đã có đơn thật (luật D6). */
    demoNote: t(
        'Bản demo — đơn này chưa được tạo thật và chưa có cổng thanh toán nào được gọi.',
        'Demo build — no real booking was created and no payment gateway was called.',
    ),

    // -------------------------------------------------- trang chi tiết hạng phòng
    /**
     * Nhãn nhóm tiện nghi. Đây là cách MẪU NÀY gom danh sách phẳng
     * `RoomExtra.amenities` của core thành từng cụm có icon — hình thức, không
     * phải nghiệp vụ, nên ở lại theme (luật R12).
     */
    amenityGroupBedroom: t('Phòng ngủ', 'Bedroom'),
    amenityGroupLiving: t('Khu vực phòng khách', 'Living area'),
    amenityGroupKitchen: t('Tiện nghi nhà bếp', 'Kitchen facilities'),
    amenityGroupBathroom: t('Phòng tắm', 'Bathroom'),
    amenityGroupOutdoor: t('Ngoài trời & Tầm nhìn', 'Outdoor & view'),
    amenityGroupInRoom: t('Tiện ích trong phòng', 'Room amenities'),
    amenityGroupGeneral: t('Tổng quát', 'General'),
    /** Dòng "Giá cho N người lớn"; số và từ "người lớn" (`UI.adults`) nối vào sau. */
    priceForAdults: t('Giá cho', 'Price for'),
    /**
     * Nhãn cho trình đọc màn hình của ba nút chỉ có icon / chỉ có số.
     * Nhãn mơ hồ kiểu "Xem" là điều luật D5 cấm thẳng.
     */
    saveRoom: t('Lưu hạng phòng này', 'Save this room type'),
    copyLink: t('Sao chép liên kết trang', 'Copy link to this page'),
    changeDatesGuests: t('Thay đổi ngày và số khách', 'Change dates and guests'),
    changeStayDates: t(
        'Thay đổi ngày nhận và trả phòng',
        'Change check-in and check-out dates',
    ),
    changeGuestCount: t('Thay đổi số khách', 'Change number of guests'),
    /** Slug không khớp hạng phòng nào — nói rõ phải làm gì tiếp (luật D6). */
    roomNotFoundTitle: t('Không tìm thấy hạng phòng', 'Room type not found'),
    roomNotFoundBody: t(
        'Đường dẫn này không trỏ tới hạng phòng nào. Xem toàn bộ hạng phòng đang mở bán.',
        'This link does not point to any room type. Browse every room type on sale.',
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
