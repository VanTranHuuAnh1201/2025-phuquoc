import { t, type I18nText } from '@repo/core'

/**
 * Giọng riêng của mẫu 04 — những chuỗi `@repo/core` chưa có.
 *
 * VÌ SAO Ở ĐÂY CHỨ KHÔNG ĐẨY LÊN `UI` CỦA CORE (luật R12): phần lớn dưới đây
 * là KHẨU HIỆU và giọng điệu editorial của riêng mẫu này — "Nơi đại dương
 * chạm mây trời", "Vị thế tĩnh lặng". Chuỗi mang bản sắc một mẫu thì ở lại
 * mẫu đó; đẩy lên hợp đồng chung là làm phình nó vì một nơi dùng.
 *
 * Nhãn dùng chung (Đặt phòng ngay, Kiểm tra phòng trống, Xem chi tiết, Tiện
 * nghi, Hướng nhìn…) KHÔNG khai lại ở đây — đã có trong `UI` của core.
 *
 * Song ngữ là bắt buộc kể cả ở đây (luật R6).
 */
export const H4 = {
    // ----------------------------------------------------------------- hero
    heroEyebrow: t(
        'THE NAM DU HILL · ĐẢO CỦ TRON',
        'THE NAM DU HILL · CU TRON ISLAND',
    ),
    heroTitle: t('Nơi đại dương chạm mây trời', 'Where the ocean meets the sky'),
    heroLede: t(
        'Một triền đồi hướng thẳng ra vịnh Củ Tron, nơi ngày mở đầu bằng tiếng sóng và khép lại bằng ánh hoàng hôn trên hòn Hàng Bè.',
        'A hillside opening straight onto Cu Tron bay, where the day begins with the sound of surf and closes on the sunset behind Hon Hang Be.',
    ),
    scrollHint: t('Cuộn để khám phá', 'Scroll to explore'),

    // ------------------------------------------------- thanh đặt phòng concierge
    concierge: t('Đặt phòng cùng lễ tân', 'Reserve with our concierge'),
    arrival: t('Ngày đến', 'Arrival'),
    departure: t('Ngày đi', 'Departure'),
    slide: t('Ảnh', 'Slide'),

    // ---------------------------------------------------------------- về resort
    aboutEyebrow: t('VỊ THẾ', 'THE SETTING'),
    aboutTitle: t('Vị thế tĩnh lặng', 'A place of stillness'),
    aboutBody: t(
        'The Nam Du Hill nằm trên triền cao của đảo Củ Tron, tách khỏi nhịp ồn ào của bến tàu nhưng chỉ cách vài phút xe. Từ mỗi ban công, vịnh biển mở ra trọn vẹn — nước trong tới mức nhìn rõ đáy cát, và đến chiều thì cả đường chân trời nhuộm vàng.',
        'The Nam Du Hill sits high on Cu Tron island, set apart from the bustle of the pier yet only minutes from it. From every balcony the bay opens out whole — water clear enough to read the sand beneath it, and by late afternoon a horizon washed in gold.',
    ),
    aboutBody2: t(
        'Resort do chính chủ vận hành. Người đón bạn ở bến tàu cũng là người pha cà phê buổi sáng và chỉ bạn lối ra bãi tắm vắng nhất đảo.',
        'The resort is owner-run. Whoever meets you at the pier is the same person who makes your morning coffee and points you to the quietest stretch of beach on the island.',
    ),
    watchFilm: t('Xem phim giới thiệu', 'Watch the film'),
    closeFilm: t('Đóng video', 'Close video'),
    filmLabel: t('Phim giới thiệu resort', 'Resort introduction film'),

    // ------------------------------------------------------------------ phòng
    roomsEyebrow: t('LƯU TRÚ', 'ACCOMMODATION'),
    roomsTitle: t('Không gian nghỉ', 'The sanctuaries'),
    roomsLede: t(
        'Mỗi hạng phòng hướng ra một góc vịnh khác nhau. Tất cả đều có ban công riêng, điều hoà và nước nóng — thứ không phải resort đảo nào cũng có.',
        'Each room type faces a different reach of the bay. All have a private balcony, air conditioning and hot water — not a given on an island.',
    ),
    exploreRoom: t('Khám phá không gian', 'Explore this space'),
    allRooms: t('Xem toàn bộ hạng phòng', 'View all room types'),

    // -------------------------------------------------------------- ẩm thực
    diningEyebrow: t('ẨM THỰC', 'DINING'),
    diningTitle: t('Hải sản lên thẳng từ bến', 'Straight from the pier'),
    diningBody: t(
        'Ghẹ, mực, ốc và cá được mua ngay tại bến Củ Tron mỗi sáng — không qua kho lạnh, không qua trung gian. Chiều xuống, bếp than được nhóm trên sân hiên đỉnh đồi, ngay lúc mặt trời chạm mặt biển.',
        'Crab, squid, sea snails and fish bought at the Cu Tron pier each morning — no cold storage, no middlemen. At dusk the charcoal is lit on the hilltop terrace, just as the sun touches the water.',
    ),

    // ------------------------------------------------------------- tín nhiệm
    trustEyebrow: t('CAM KẾT', 'OUR COMMITMENT'),
    trustTitle: t('Đặt trực tiếp, yên tâm đi biển', 'Book direct, travel easy'),
    trustOwner: t('Resort chính chủ đồi Củ Tron', 'Owner-run, on Cu Tron hill'),
    trustOwnerDesc: t(
        'Không qua đại lý. Bạn nói chuyện trực tiếp với người vận hành resort.',
        'No agency in between. You speak directly with the people who run the resort.',
    ),
    trustBoat: t('Hỗ trợ vé tàu & đón bến', 'Ferry tickets & pier transfer'),
    trustBoatDesc: t(
        'Chúng tôi giữ vé tàu cao tốc Rạch Giá – Nam Du và đón bạn tận bến.',
        'We hold your Rach Gia – Nam Du speedboat tickets and meet you at the pier.',
    ),
    trustWeather: t('Tàu hoãn do thời tiết: dời ngày miễn phí 100%', 'Ferry cancelled by weather: free date change, 100%'),
    trustWeatherDesc: t(
        'Biển động là chuyện của trời, không phải lỗi của bạn. Dời ngày không mất phí.',
        'Rough seas are nobody’s fault. Move your dates at no charge.',
    ),

    // -------------------------------------------------------- trang danh sách
    roomsPageTitle: t('Hạng phòng & Suite', 'Rooms & Suites'),
    /* KHÔNG ghi số lượng cứng trong câu dẫn: số hạng phòng do `core` quyết
       định và đổi theo dữ liệu. Bản trước viết "Sáu hạng phòng" trong khi seed
       có 20 — câu dẫn nói dối ngay trên đầu trang. Số thật hiện ở bộ đếm. */
    roomsPageLede: t(
        'Từ phòng đôi có ban công tới suite gia đình sáu khách, tất cả đều nhìn ra vịnh Củ Tron. Giá đã gồm ăn sáng và đón bến tàu.',
        'From a double with a balcony to a family suite for six, every room looks onto Cu Tron bay. Rates include breakfast and pier transfer.',
    ),
    sortLabel: t('Sắp xếp', 'Sort'),
    sortRecommended: t('Gợi ý', 'Recommended'),
    sortPriceAsc: t('Giá thấp đến cao', 'Price, low to high'),
    sortPriceDesc: t('Giá cao đến thấp', 'Price, high to low'),
    guestsFilter: t('Số khách', 'Guests'),
    anyGuests: t('Mọi sức chứa', 'Any size'),
    roomCount: t('hạng phòng', 'room types'),
    emptyTitle: t('Không có hạng phòng nào phù hợp', 'No room types match'),
    emptyBody: t(
        'Thử bỏ bớt bộ lọc số khách, hoặc gọi lễ tân để chúng tôi sắp xếp phòng ghép.',
        'Try relaxing the guest filter, or call us and we will arrange connecting rooms.',
    ),
    resetFilters: t('Đặt lại bộ lọc', 'Reset filters'),
    /** Phân trang. `{a}`/`{b}`/`{n}` thay bằng số thật. */
    showingRange: t('Đang xem {a}–{b} trong {n} hạng phòng', 'Showing {a}–{b} of {n} room types'),
    showMore: t('Xem thêm hạng phòng', 'Show more room types'),

    // --------------------------------------------------------- trang chi tiết
    theSpace: t('Không gian', 'The space'),
    goodToKnow: t('Cần biết trước khi đến', 'Good to know'),
    reserveThisRoom: t('Giữ hạng phòng này', 'Reserve this room'),
    otherRooms: t('Hạng phòng khác', 'Other room types'),
    roomNotFound: t('Không tìm thấy hạng phòng', 'Room type not found'),
    roomNotFoundBody: t(
        'Hạng phòng này có thể đã đổi tên. Xem toàn bộ danh sách hiện có.',
        'This room type may have been renamed. Browse the full list instead.',
    ),
    includedNote: t('Đã gồm ăn sáng · đón bến tàu', 'Breakfast and pier transfer included'),

    /**
     * Hai nhãn thông số mà `UI` của core chưa có (`UI.view` thì đã có).
     * Để ở đây thay vì thêm vào core: mới một mẫu dùng, và mở rộng hợp đồng
     * chung vì một nơi dùng là làm nó phình ra (luật R12). Có mẫu thứ hai cần
     * thì lúc đó mới đẩy lên `domain-hotel/strings.ts`.
     */
    area: t('Diện tích', 'Area'),
    bed: t('Giường', 'Bed'),

    /**
     * Cảnh báo còn ít phòng. `{n}` được thay bằng SỐ THẬT từ `Room.remaining`.
     * Chỉ render khi trường đó thực sự có — bịa khan hiếm là dark pattern mà
     * P10 cấm thẳng.
     */
    onlyRoomsLeft: t('Chỉ còn {n} phòng cho hạng này', 'Only {n} rooms left in this category'),
} satisfies Record<string, I18nText>
