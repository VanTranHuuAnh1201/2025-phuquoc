/**
 * Nội dung khám phá đảo: điểm dừng chân, đảo vệ tinh, lịch trình mẫu.
 *
 * Mọi chuỗi song ngữ `{ vi, en }` theo luật R6. Không JSX, không CSS (luật R2).
 */

import { t } from '@repo/utils'
import type { ExploreSpot, SatelliteIsland, TripPlan } from '../types'

export const exploreSpots: ExploreSpot[] = [
    {
        id: 'caymen',
        name: t('Bãi Cây Mến', 'Cay Men Beach'),
        dist: t('4 phút xe', '4 min ride'),
        text: t('Bãi tắm đẹp nhất Nam Du, nằm trong vịnh kín gió. Cát trắng mịn, nước xanh lơ và hàng dừa cổ thụ 70–80 năm tuổi nghiêng bóng xuống mặt nước.', 'The prettiest beach on Nam Du, tucked into a sheltered bay. Fine white sand, pale blue water and 70–80-year-old coconut palms leaning over it.'),
        tip: t('Nước êm, hợp bơi và bắt ốc ở gờ đá', 'Calm water; good for swimming and rock-pooling'),
    },
    {
        id: 'haidang',
        name: t('Hải đăng Nam Du', 'Nam Du Lighthouse'),
        dist: t('309 m', '309 m'),
        text: t('Một trong những ngọn hải đăng cao nhất Việt Nam. Từ trên đỉnh thu trọn cả 21 hòn đảo vào tầm mắt giữa biển trời mênh mông.', 'One of the highest lighthouses in Vietnam. From the top you take in all 21 islands at once.'),
        tip: t('Đi lúc 16:30 để kịp hoàng hôn trên đường về', 'Go at 16:30 to catch sunset on the way down'),
    },
    {
        id: 'baingu',
        name: t('Bãi Ngự & Giếng Vua', 'Bai Ngu & the King’s Well'),
        dist: t('Phía Tây đảo', 'West side'),
        text: t('Nơi vua Gia Long từng dừng chân lánh nạn. Giếng Ngự là giếng nước ngọt tự nhiên sát bờ biển nhưng chưa bao giờ cạn, kể cả những mùa khô khốc liệt nhất.', 'Where Emperor Gia Long once sheltered. The King’s Well is a natural freshwater well beside the sea that has never run dry.'),
        tip: t('Ghé kèm khi chạy vòng đảo buổi sáng', 'Fold into the morning island loop'),
    },
    {
        id: 'baichet',
        name: t('Bãi Chệt & chợ hải sản', 'Bai Chet & the fish market'),
        dist: t('Bến tàu chính', 'Main pier'),
        text: t('Trung tâm giao thương của đảo: bến tàu chính, chợ hải sản tươi sống, quán ăn và dịch vụ. Tên gọi bắt nguồn từ truyền thuyết giao chiến thương thuyền thế kỷ 16.', 'The island’s trading centre: main pier, live seafood market, eateries and services.'),
        tip: t('Mua hải sản chiều rồi mang lên đồi nướng', 'Buy your catch here and grill it up at the resort'),
    },
    {
        id: 'dinhong',
        name: t('Dinh Ông Nam Hải', 'Dinh Ong Nam Hai shrine'),
        dist: t('Ven biển', 'Coastal'),
        text: t('Nơi thờ và bảo tồn bộ xương cá Ông dài hơn 15 m do ngư dân phát hiện dạt vào bờ. Cạnh đó là Miếu Bà Chúa Xứ, chốn tâm linh của cư dân đảo.', 'Home to a 15-metre whale skeleton found washed ashore by fishermen, beside the Ba Chua Xu shrine.'),
        tip: t('Đi cùng buổi sáng ngày cuối trước khi rời đảo', 'Good for the last morning before the boat'),
    },
    {
        id: 'chodem',
        name: t('Chợ đêm Nam Du', 'Nam Du night market'),
        dist: t('Dưới chân đồi', 'Below the hill'),
        text: t('Hải sản nướng xiên, mực một nắng, đồ lưu niệm. Từ sân hiên resort nhìn thẳng xuống thấy cả dãy đèn chợ sáng lên lúc 19 giờ.', 'Grilled skewers, one-sun-dried squid, souvenirs. From the resort terrace you look straight down on its lights coming on at seven.'),
        tip: t('Đi bộ xuống mất 8 phút, lên dốc thì gọi xe', '8 minutes downhill; call for a ride back up'),
    },
]

export const satelliteIslands: SatelliteIsland[] = [
    {
        id: 'haibodap',
        name: t('Hòn Hai Bờ Đập', 'Hon Hai Bo Dap'),
        badge: t('MALDIVES THU NHỎ', 'MINI MALDIVES'),
        text: t('Hai đảo nhỏ nối nhau bằng dải đá tự nhiên vắt ngang biển. Nước nông và trong, tàu thả neo cho khách lặn ngắm san hô và chèo SUP.', 'Two islets joined by a natural stone causeway. Shallow, clear water — boats anchor here for snorkelling and SUP.'),
    },
    {
        id: 'honmau',
        name: t('Hòn Mấu', 'Hon Mau'),
        badge: t('5 BÃI BIỂN', 'FIVE BEACHES'),
        text: t('Hơn 120 hộ dân sống bằng nghề lưới ghẹ. Năm bãi mỗi bãi một kiểu: Bãi Chướng và Bãi Nam cát trắng, Bãi Đá Đen phủ đá cuội đen bóng.', 'A crab-netting village of 120 households. Five beaches, each different — white sand at Bai Chuong, polished black pebbles at Bai Da Den.'),
    },
    {
        id: 'hondau',
        name: t('Hòn Dầu', 'Hon Dau'),
        badge: t('90% RỪNG NGUYÊN SINH', '90% PRIMARY FOREST'),
        text: t('Hoang sơ, hơn 90% diện tích là rừng nguyên sinh. Rặng dừa ngả ra biển, xích đu gỗ trên nước và tổ chim bằng rễ cây là những góc chụp quen thuộc.', 'Almost untouched, over 90% primary forest. Palms leaning over the water, a wooden swing and a nest woven from roots.'),
    },
    {
        id: 'honngang',
        name: t('Hòn Ngang', 'Hon Ngang'),
        badge: t('LÀNG BÈ NỔI', 'FLOATING FARMS'),
        text: t('Vùng biển êm nhất quần đảo, nơi neo đậu tàu thuyền và nuôi hải sản lồng bè. Lên nhà bè ăn cá mú hấp, tôm hùm, nhum nướng ngay trên mặt nước.', 'The calmest water in the archipelago, full of floating fish farms. Eat steamed grouper and grilled urchin right on the water.'),
    },
]

export const tripPlans: Record<string, TripPlan> = {
    d2: {
        key: 'd2',
        name: t('2 ngày 1 đêm', '2 days · 1 night'),
        legs: [
            {
                day: t('ĐÊM 1', 'Night 1'),
                time: '22:00 – 06:00',
                title: t('Xe giường nằm TP.HCM → Rạch Giá', 'Overnight coach HCMC → Rach Gia'),
                text: t('Bắt xe từ Bến xe Miền Tây, ngủ trên xe. Phương Trang ~230.000₫, Kumho ~210.000₫.', 'Depart Mien Tay station and sleep on board. Around 210,000–230,000 VND.'),
            },
            {
                day: t('NGÀY 1', 'Day 1'),
                time: '06:00 – 11:00',
                title: t('Tàu cao tốc ra đảo, nhận phòng', 'Speedboat out, check in'),
                text: t('Ăn sáng ở Rạch Giá, lên tàu 07:30. Cập bến Củ Tron 10:30 — xe resort đón sẵn. Gửi đồ, ăn trưa hải sản.', 'Breakfast in Rach Gia, boat at 07:30, ashore by 10:30 where our car is waiting.'),
            },
            {
                day: t('NGÀY 1', 'Day 1'),
                time: '13:00 – 17:30',
                title: t('Tàu gỗ đi 3 đảo nhỏ', 'Wooden boat, three islands'),
                text: t('Hòn Dầu chụp rặng dừa → Hòn Mấu tắm Bãi Chướng → Hòn Hai Bờ Đập lặn san hô, chèo SUP, ăn cháo nhum nóng trên tàu.', 'Hon Dau for the palms, Hon Mau to swim, Hon Hai Bo Dap to snorkel and paddle.'),
            },
            {
                day: t('NGÀY 1', 'Day 1'),
                time: '18:30 – 21:30',
                title: t('BBQ hải sản trên đồi', 'Seafood BBQ on the hill'),
                text: t('Ghẹ hấp, cá xương xanh nướng, nhum mỡ hành. Sau đó tự do dạo chợ đêm ngay dưới chân đồi.', 'Steamed crab, grilled needlefish, urchin with spring onion, then the night market below.'),
            },
            {
                day: t('NGÀY 2', 'Day 2'),
                time: '06:00 – 11:30',
                title: t('Bình minh, rồi vòng quanh Hòn Lớn', 'Sunrise, then the island loop'),
                text: t('Cà phê trên sân hiên lúc mặt trời lên. Xe máy đi Miếu Bà Chúa Xứ, Ba Hòn Nồm, Bãi Ngự, Giếng Vua, tắm Bãi Cây Mến, ghé Dinh Ông.', 'Coffee on the terrace at sunrise, then the 11 km loop by scooter.'),
            },
            {
                day: t('NGÀY 2', 'Day 2'),
                time: '11:30 – 18:00',
                title: t('Trả phòng và về bờ', 'Check out and head back'),
                text: t('Cơm trưa, mua khô cá xương xanh làm quà. Tàu 14:00 về Rạch Giá, 16:30 cập bến, lên xe về TP.HCM.', 'Lunch, buy dried fish, 14:00 boat, ashore 16:30, coach home.'),
            },
        ],
        costs: [
            {
                label: t('Xe khách khứ hồi TP.HCM – Rạch Giá', 'Return coach HCMC – Rach Gia'),
                val: '460 – 500K',
            },
            {
                label: t('Tàu cao tốc khứ hồi', 'Return speedboat'),
                val: '450 – 500K',
            },
            {
                label: t('Xe máy + tàu gỗ đi đảo', 'Scooter + island boat'),
                val: '250 – 350K',
            },
            {
                label: t('Lưu trú', 'Accommodation'),
                val: '250 – 500K',
            },
            {
                label: t('Ăn uống & tiệc BBQ', 'Food and the BBQ'),
                val: '600 – 800K',
            },
            {
                label: t('Vé tham quan, dụng cụ lặn', 'Entry fees, snorkel gear'),
                val: '100 – 150K',
            },
        ],
        total: '2.110.000 – 2.800.000₫',
    },
    d3: {
        key: 'd3',
        name: t('3 ngày 2 đêm', '3 days · 2 nights'),
        legs: [
            {
                day: t('ĐÊM 1', 'Night 1'),
                time: '23:00 – 06:00',
                title: t('Xe giường nằm TP.HCM → Rạch Giá', 'Overnight coach HCMC → Rach Gia'),
                text: t('Ngủ trên xe, sáng có mặt ở cảng Rạch Giá.', 'Sleep on board, arrive at Rach Gia port in the morning.'),
            },
            {
                day: t('NGÀY 1', 'Day 1'),
                time: '06:30 – 11:00',
                title: t('Ra đảo, nhận phòng, ăn trưa', 'Out to the island, check in'),
                text: t('Tàu cao tốc ra Nam Du, xe resort đón tại bến Củ Tron. Nhận phòng, cơm trưa hải sản.', 'Speedboat out, our car meets you at the pier, then a seafood lunch.'),
            },
            {
                day: t('NGÀY 1', 'Day 1'),
                time: '14:00 – 17:30',
                title: t('Chinh phục Hòn Lớn', 'The main island'),
                text: t('Lên hải đăng 309 m ngắm toàn cảnh 21 đảo. Bãi Ngự, Giếng Vua, tắm Bãi Cây Mến, hoàng hôn ở Sunset Bar.', 'Up to the 309 m lighthouse, then Bai Ngu, the King’s Well, a swim at Cay Men and sunset at the bar.'),
            },
            {
                day: t('NGÀY 2', 'Day 2'),
                time: '08:00 – 17:00',
                title: t('Trọn ngày trên tàu, bốn hòn đảo', 'A full day at sea, four islands'),
                text: t('08:00 Hòn Mấu tắm Bãi Chướng · 10:30 Hòn Dầu rừng nguyên sinh · 12:00 Hòn Ngang ăn trưa trên bè nổi · 14:00 Hòn Hai Bờ Đập lặn san hô, chèo SUP, cháo nhum trên đường về.', 'Hon Mau, Hon Dau, lunch on a floating farm at Hon Ngang, then snorkelling at Hon Hai Bo Dap.'),
            },
            {
                day: t('NGÀY 2', 'Day 2'),
                time: '18:30 – 22:00',
                title: t('BBQ ngoài trời & lửa trại', 'Outdoor BBQ and a fire'),
                text: t('Tiệc nướng hải sản trên đỉnh đồi, karaoke và lửa trại bên bờ biển.', 'Seafood on the grill up on the hill, karaoke, and a fire by the water.'),
            },
            {
                day: t('NGÀY 3', 'Day 3'),
                time: '06:00 – 11:00',
                title: t('Bình minh và phần văn hoá', 'Sunrise and the cultural half-day'),
                text: t('Đón bình minh ở Bãi Sỏi. Viếng Dinh Ông xem bộ xương cá Ông, thắp nhang Miếu Bà. Ghé chợ Bãi Chệt mua khô hải sản.', 'Sunrise at Bai Soi, the whale shrine, then the market for dried seafood.'),
            },
            {
                day: t('NGÀY 3', 'Day 3'),
                time: '11:30 – 17:30',
                title: t('Trả phòng và về bờ', 'Check out and head back'),
                text: t('Cơm trưa, trả phòng, 13:30 ra cảng. Tàu 14:00 về Rạch Giá, xe đón về TP.HCM.', 'Lunch, check out, 14:00 boat, coach home from Rach Gia.'),
            },
        ],
        costs: [
            {
                label: t('Xe khách khứ hồi TP.HCM – Rạch Giá', 'Return coach HCMC – Rach Gia'),
                val: '460 – 500K',
            },
            {
                label: t('Tàu cao tốc khứ hồi', 'Return speedboat'),
                val: '450 – 500K',
            },
            {
                label: t('Xe máy + tàu gỗ đi đảo', 'Scooter + island boat'),
                val: '350 – 450K',
            },
            {
                label: t('Lưu trú 2 đêm', 'Two nights’ accommodation'),
                val: '500K – 1tr',
            },
            {
                label: t('Ăn uống & tiệc BBQ', 'Food and the BBQ'),
                val: '900K – 1,3tr',
            },
            {
                label: t('Vé tham quan, dụng cụ lặn', 'Entry fees, snorkel gear'),
                val: '150 – 250K',
            },
        ],
        total: '2.810.000 – 4.000.000₫',
    },
}
