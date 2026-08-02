import type { Locale } from '@repo/core'

/**
 * Nhãn riêng của trang Hạng phòng & Chi tiết phòng mẫu 04 — port nguyên văn từ
 * hằng `UI` trong `Rooms H4 / Room Detail H4 - Nam Du Hill.dc.html`.
 *
 * Song ngữ đầy đủ theo luật R6.
 */
export interface H4PageStrings {
    home: string
    pageTitle: string
    pageSub: string

    checkIn: string
    checkOut: string
    sortLabel: string
    sortRec: string
    sortAsc: string
    sortDesc: string

    filterAll: string
    filterCouple: string
    filterFamily: string
    filterGroup: string

    countLabel: string
    perNight: string
    viewDetail: string
    select: string
    selectedLabel: string

    addonsTitle: string
    addonsHeadline: string
    addonsSub: string

    yourSelection: string
    noneSelected: string
    roomsTotal: string
    addonsTotal: string
    total: string
    goCheckout: string
    clear: string

    roomsWord: string
    guestsWord: string
    bedDefault: string

    // ---- Chi tiết phòng ----
    roomsPage: string
    descKicker: string
    descTitle: string
    amenitiesKicker: string
    amenitiesTitle: string
    conditionsTitle: string
    otherRooms: string
    backToRooms: string
    bookThisRoom: string
    specArea: string
    specGuests: string
    specBed: string
    specView: string
    viewDefault: string
    fromPrice: string
}

export const pageUi: Record<Locale, H4PageStrings> = {
    vi: {
        home: 'Trang chủ',
        pageTitle: 'Hạng phòng & Suite',
        pageSub:
            'Chọn ngày, lọc theo nhóm khách rồi thêm tiện ích — tổng tiền hiện ngay bên dưới.',

        checkIn: 'Nhận phòng',
        checkOut: 'Trả phòng',
        sortLabel: 'Sắp xếp theo',
        sortRec: 'Gợi ý',
        sortAsc: 'Giá thấp → cao',
        sortDesc: 'Giá cao → thấp',

        filterAll: 'Tất cả',
        filterCouple: 'Cặp đôi · 2–3 khách',
        filterFamily: 'Gia đình · 4–6 khách',
        filterGroup: 'Nhóm bạn · 6+ khách',

        countLabel: 'hạng phòng',
        perNight: 'mỗi đêm',
        viewDetail: 'Chi tiết',
        select: 'Chọn',
        selectedLabel: 'Bỏ chọn',

        addonsTitle: 'Tiện ích',
        addonsHeadline: 'Thêm dịch vụ cho chuyến đi',
        addonsSub:
            'Đưa đón tàu cao tốc Rạch Giá là dịch vụ được chọn nhiều nhất — nên đặt trước vì số chỗ có hạn.',

        yourSelection: 'Đang chọn',
        noneSelected: 'Chưa chọn phòng nào',
        roomsTotal: 'Tiền phòng',
        addonsTotal: 'Tiện ích',
        total: 'Tạm tính',
        goCheckout: 'Tiếp tục đặt phòng',
        clear: 'Xoá lựa chọn',

        roomsWord: 'phòng',
        guestsWord: 'khách',
        bedDefault: '01 giường đôi lớn',

        roomsPage: 'Hạng phòng',
        descKicker: 'Không gian',
        descTitle: 'Về hạng phòng này',
        amenitiesKicker: 'Tiện nghi',
        amenitiesTitle: 'Tiện nghi trong phòng',
        conditionsTitle: 'Điều kiện đặt phòng',
        otherRooms: 'Hạng phòng khác',
        backToRooms: 'Xem tất cả hạng phòng',
        bookThisRoom: 'Đặt hạng phòng này',
        specArea: 'Diện tích',
        specGuests: 'Sức chứa',
        specBed: 'Giường',
        specView: 'Hướng nhìn',
        viewDefault: 'Hướng biển',
        fromPrice: 'Chỉ từ',
    },
    en: {
        home: 'Home',
        pageTitle: 'Rooms & Suites',
        pageSub:
            'Pick your dates, filter by party size, then add extras — the total appears just below.',

        checkIn: 'Check-in',
        checkOut: 'Check-out',
        sortLabel: 'Sort by',
        sortRec: 'Recommended',
        sortAsc: 'Price low → high',
        sortDesc: 'Price high → low',

        filterAll: 'All',
        filterCouple: 'Couples · 2–3 guests',
        filterFamily: 'Family · 4–6 guests',
        filterGroup: 'Groups · 6+ guests',

        countLabel: 'room types',
        perNight: 'per night',
        viewDetail: 'Details',
        select: 'Select',
        selectedLabel: 'Remove',

        addonsTitle: 'Add-ons',
        addonsHeadline: 'Add services to your trip',
        addonsSub:
            'The Rach Gia speedboat transfer is the most popular extra — book ahead, seats are limited.',

        yourSelection: 'Selected',
        noneSelected: 'No rooms selected yet',
        roomsTotal: 'Rooms',
        addonsTotal: 'Add-ons',
        total: 'Subtotal',
        goCheckout: 'Continue booking',
        clear: 'Clear selection',

        roomsWord: 'rooms',
        guestsWord: 'guests',
        bedDefault: 'One king bed',

        roomsPage: 'Rooms',
        descKicker: 'The space',
        descTitle: 'About this room type',
        amenitiesKicker: 'Amenities',
        amenitiesTitle: 'In-room amenities',
        conditionsTitle: 'Booking conditions',
        otherRooms: 'Other room types',
        backToRooms: 'View all room types',
        bookThisRoom: 'Book this room type',
        specArea: 'Size',
        specGuests: 'Sleeps',
        specBed: 'Bed',
        specView: 'View',
        viewDefault: 'Sea view',
        fromPrice: 'From',
    },
}
