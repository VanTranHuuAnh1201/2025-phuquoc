import { t, type I18nText } from '@repo/core'

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
