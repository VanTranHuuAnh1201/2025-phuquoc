import type { Locale } from '@repo/core'

/**
 * Hợp đồng chuỗi giao diện mà mọi mẫu phải cung cấp.
 *
 * VÌ SAO Ở ĐÂY MÀ KHÔNG Ở `core`: đây là chữ thuộc về *cách trình bày* —
 * "Không gian nghỉ dưỡng của bạn" là giọng của mẫu 01, mẫu 03 nói khác đi cho
 * cùng một section. Dữ liệu nghiệp vụ (tên phòng, giá, lịch trình) vẫn nằm ở
 * `core` và cả N mẫu dùng chung (luật R8).
 *
 * VÌ SAO KHÔNG ĐỂ MỖI THEME TỰ KHAI KIỂU RIÊNG: bốn mẫu lặp lại đúng bộ nhãn
 * này. Có một `interface` chung nghĩa là quên dịch một nhãn sẽ lỗi lúc biên
 * dịch chứ không phải lúc khách nhìn thấy ô trống.
 *
 * Nhãn riêng của một mẫu (`steps` của mẫu 02, `themes` của mẫu 03) khai thêm
 * trong chính theme đó bằng cách mở rộng interface này.
 */
export interface UiStrings {
    // thanh điều hướng & hành động chung
    phoneLabel: string
    bookNow: string
    viewAll: string

    // thanh tra cứu
    checkIn: string
    checkOut: string
    guests: string
    guestsWord: string
    stayType: string
    stayRoom: string
    stayCombo2: string
    stayCombo3: string
    search: string

    // ảnh hero
    heroImage: string

    // phòng
    perNight: string
    roomsKicker: string
    roomsTitle: string
    roomsSub: string

    // tour
    toursKicker: string
    toursTitle: string
    toursSub: string
    fromPrice: string
    perGuest: string
    bookTour: string

    // điểm đến
    placesKicker: string
    placesTitle: string
    placesSub: string

    // ẩm thực
    diningKicker: string
    diningTitle: string
    diningSub: string

    // đi lại & lưu ý
    transportTitle: string
    transportSub: string
    notesTitle: string

    // hỏi đáp
    faqTitle: string
    faqSub: string

    // thư viện ảnh
    galleryKicker: string
    galleryTitle: string

    // kêu gọi đặt phòng
    ctaTitle: string
    ctaSub: string
    emailUs: string

    // chân trang
    footerAbout: string
    footerNav: string
    footerContact: string
    footerFollow: string
}

/** Bộ chuỗi đầy đủ hai ngôn ngữ của một mẫu. */
export type UiStringSet<T extends UiStrings = UiStrings> = Record<Locale, T>
