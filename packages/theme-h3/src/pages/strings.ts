import type { Locale } from '@repo/core'

/**
 * Nhãn riêng của trang Hạng phòng & Chi tiết phòng mẫu 03 — port nguyên văn từ
 * hằng `UI` trong `Rooms H3 / Room Detail H3 - Nam Du Hill.dc.html`.
 *
 * Vì sao không nhét vào `UiStrings` của `@repo/ui`: interface đó là hợp đồng mà
 * CẢ BỐN mẫu phải thoả. Nhãn của riêng trang con mẫu 03 không thuộc về nó.
 *
 * Song ngữ đầy đủ theo luật R6.
 */
export interface H3PageStrings {
    home: string
    pageTitle: string
    pageSub: string

    filterTitle: string
    filterAll: string
    filterCouple: string
    filterFamily: string
    filterGroup: string

    sortLabel: string
    sortRec: string
    sortAsc: string
    sortDesc: string

    countLabel: string
    priceNote: string
    perNight: string
    viewDetail: string
    select: string
    selectedLabel: string

    yourSelection: string
    noneSelected: string
    roomsTotal: string
    addonsTotal: string
    total: string
    addonsTitle: string
    goCheckout: string

    roomsWord: string
    guestsWord: string
    bedDefault: string

    // ---- Chi tiết phòng ----
    roomsPage: string
    descTitle: string
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
}

export const pageUi: Record<Locale, H3PageStrings> = {
    vi: {
        home: 'Trang chủ',
        pageTitle: 'Hạng phòng & Suite',
        pageSub:
            'Lọc theo nhóm khách ở cột bên trái, tổng tiền cập nhật ngay khi bạn chọn phòng.',

        filterTitle: 'Lọc phòng',
        filterAll: 'Tất cả hạng phòng',
        filterCouple: 'Cặp đôi · 2–3 khách',
        filterFamily: 'Gia đình · 4–6 khách',
        filterGroup: 'Nhóm bạn · 6+ khách',

        sortLabel: 'Sắp xếp theo',
        sortRec: 'Gợi ý',
        sortAsc: 'Giá thấp → cao',
        sortDesc: 'Giá cao → thấp',

        countLabel: 'hạng phòng phù hợp',
        priceNote: 'Giá cho 1 đêm, đã gồm ăn sáng',
        perNight: 'mỗi đêm',
        viewDetail: 'Chi tiết',
        select: 'Chọn',
        selectedLabel: 'Bỏ chọn',

        yourSelection: 'Đang chọn',
        noneSelected: 'Chưa chọn phòng nào',
        roomsTotal: 'Tiền phòng',
        addonsTotal: 'Tiện ích',
        total: 'Tạm tính',
        addonsTitle: 'Tiện ích đi kèm',
        goCheckout: 'Tiếp tục đặt phòng',

        roomsWord: 'phòng',
        guestsWord: 'khách',
        bedDefault: '01 giường đôi lớn',

        roomsPage: 'Hạng phòng',
        descTitle: 'Về hạng phòng này',
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
    },
    en: {
        home: 'Home',
        pageTitle: 'Rooms & Suites',
        pageSub:
            'Filter by party size on the left — the total updates the moment you pick a room.',

        filterTitle: 'Filter rooms',
        filterAll: 'All room types',
        filterCouple: 'Couples · 2–3 guests',
        filterFamily: 'Family · 4–6 guests',
        filterGroup: 'Groups · 6+ guests',

        sortLabel: 'Sort by',
        sortRec: 'Recommended',
        sortAsc: 'Price low → high',
        sortDesc: 'Price high → low',

        countLabel: 'matching room types',
        priceNote: 'Per night, breakfast included',
        perNight: 'per night',
        viewDetail: 'Details',
        select: 'Select',
        selectedLabel: 'Remove',

        yourSelection: 'Selected',
        noneSelected: 'No rooms selected yet',
        roomsTotal: 'Rooms',
        addonsTotal: 'Add-ons',
        total: 'Subtotal',
        addonsTitle: 'Add-ons',
        goCheckout: 'Continue booking',

        roomsWord: 'rooms',
        guestsWord: 'guests',
        bedDefault: 'One king bed',

        roomsPage: 'Rooms',
        descTitle: 'About this room type',
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
    },
}
