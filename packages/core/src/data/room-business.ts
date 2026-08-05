/**
 * Bổ sung nghiệp vụ cho từng hạng phòng, khớp theo `Room.id` của seed crawl.
 *
 * VÌ SAO TÁCH RIÊNG: `nam-du-hill.seed.generated.ts` là file SINH TỰ ĐỘNG —
 * crawl lại là ghi đè sạch. Những thông tin dưới đây do người biên tập quyết
 * định (xếp nhóm để lọc, số phòng còn lại, đánh giá của khách) nên không thể
 * nằm trong file đó. Tách ra đây thì crawl lại vẫn giữ được.
 *
 * Khớp theo id — id đổi thì phải cập nhật bảng này.
 */

import { t } from '@repo/utils'
import type { RoomGroup, RoomReview } from '../types'

export interface RoomBusinessInfo {
    group: RoomGroup
    extraBedFee?: number
    remaining?: number
    reviews?: RoomReview[]
}

export const roomBusinessInfo: Record<string, RoomBusinessInfo> = {
    'phong-gia-dinh-nhin-ra-bien-01': {
        group: 'family',
        extraBedFee: 450000,
    },
    'phong-gia-dinh-view-bien-08-08': {
        group: 'family',
    },
    'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04': {
        group: 'suite',
    },
    'phong-tieu-chuan-giuong-doi-luc-giac-05': {
        group: 'couple',
        remaining: 1,
        reviews: [
            { who: 'Ngọc Anh · TP.HCM', score: '9.4', text: t('Nằm trên giường ngắm được cả hoàng hôn lẫn đèn chợ đêm. Không cần đi đâu.', 'From the bed you catch both the sunset and the night-market lights. No need to go anywhere.') },
        ],
    },
    'phong-deluxe-06': {
        group: 'couple',
    },
    'phong-superior-co-giuong-co-king-07': {
        group: 'family',
        extraBedFee: 410000,
        remaining: 1,
        reviews: [
            { who: 'Minh Trí · Cần Thơ', score: '9.5', text: t('Ngâm Jacuzzi lúc mặt trời lặn là thứ đáng tiền nhất chuyến đi.', 'Sitting in the Jacuzzi at sunset was the best value of the whole trip.') },
        ],
    },
    'phong-giuong-doi-nhin-ra-vuon-02': {
        group: 'family',
        extraBedFee: 410000,
    },
    'phong-gia-dinh-view-bien-09-09': {
        group: 'family',
    },
    'phong-giuong-doi-co-san-trong-10': {
        group: 'family',
        extraBedFee: 410000,
    },
    'phong-gia-dinh-view-bien-11': {
        group: 'family',
    },
    'phong-giuong-doi-co-ban-cong-12': {
        group: 'couple',
    },
    'second-floor-family-with-sea-view-13': {
        group: 'family',
    },
    'rock-deluxe-room-14': {
        group: 'couple',
        remaining: 2,
        reviews: [
            { who: 'Hoài Thu · Hà Nội', score: '9.6', text: t('Phòng 14 không phải phòng trang trí theo chủ đề. Đó là vách đá thật trong phòng ngủ, đêm nghe rõ tiếng suối.', 'Room 14 is not a themed room. That is an actual cliff in the bedroom, and you can hear the stream at night.') },
            { who: 'Đức Anh · Đà Nẵng', score: '9.2', text: t('Ngủ trong hang đá nghe hơi lạ nhưng ấm và rất yên. Sáng dậy mở cửa là thấy vườn.', 'Sleeping in a cave sounds odd but it is warm and very quiet. You open the door onto the garden.') },
        ],
    },
    'phong-giuong-doi-15': {
        group: 'couple',
    },
    'first-floor-family-with-sea-view-16': {
        group: 'family',
    },
    'phong-03-nguoi-huong-thung-lung-bien-17': {
        group: 'family',
    },
    'phong-03-nguoi-co-ban-cong-18': {
        group: 'family',
    },
    'suite-02-phong-ngu-08-khach-08-09': {
        group: 'suite',
        remaining: 1,
        reviews: [
            { who: 'Gia đình Bảo Long · Rạch Giá', score: '9.0', text: t('Nhà tôi 8 người ở vừa đủ, không phải thuê 3 phòng rời.', 'Eight of us fitted comfortably instead of renting three separate rooms.') },
        ],
    },
    'suite-02-phong-ngu-06-khach-10-11': {
        group: 'suite',
    },
    'suite-02-phong-ngu-06-khach-15-16': {
        group: 'suite',
    },
}
