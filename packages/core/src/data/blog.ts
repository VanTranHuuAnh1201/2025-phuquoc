/**
 * Bài viết blog — nội dung do khách hàng biên tập, dùng chung cho mọi theme.
 *
 * Mọi chuỗi song ngữ `{ vi, en }` theo luật R6. Không JSX, không CSS (luật R2).
 */

import { t } from '@repo/utils'
import type { BlogPost } from '../types'

export const blogPosts: BlogPost[] = [
    {
        id: 'tau-ra-nam-du',
        category: t('DI CHUYỂN', 'GETTING THERE'),
        title: t('Đi tàu ra Nam Du: chuyến nào, giá bao nhiêu, say sóng thì làm sao', 'The boat to Nam Du: which run, what it costs, and what to do about seasickness'),
        lede: t('Từ bến Rạch Giá ra Củ Tron mất khoảng 2 giờ 15 phút. Đây là những gì chúng tôi dặn khách trước mỗi chuyến, sau bảy năm đón khách ở bến tàu.', 'Rach Gia pier to Cu Tron takes about 2 hours 15 minutes. This is what we tell guests before every trip, after seven years of meeting them at the pier.'),
        author: t('Trần Minh Hải', 'Hai Tran'),
        role: t('Quản lý khu nghỉ', 'Resort manager'),
        date: t('12 tháng 6, 2026', '12 June 2026'),
        readMin: 8,
        heroSlot: 'ndh-blog-tau-ra-nam-du-hero',
        heroCaption: t('Bến tàu Rạch Giá lúc 7h sáng, chuyến đầu tiên trong ngày.', 'Rach Gia pier at 7am, the first run of the day.'),
        tags: [
            {
                vi: 'Tàu cao tốc',
                en: 'Speedboat',
            },
            {
                vi: 'Rạch Giá',
                en: 'Rach Gia',
            },
            {
                vi: 'Say sóng',
                en: 'Seasickness',
            },
            {
                vi: 'Lịch trình',
                en: 'Schedule',
            },
        ],
        blocks: [
            {
                kind: 'h',
                text: t('Chọn chuyến nào', 'Which run to take'),
            },
            {
                kind: 'p',
                text: t('Mỗi ngày có ba chuyến từ Rạch Giá: 7h15, 9h30 và 12h45. Chuyến sáng sớm gần như luôn êm nhất vì biển chưa nổi gió. Nếu bạn đi cuối tuần trong mùa cao điểm từ tháng 4 đến tháng 8, hãy đặt vé trước ít nhất hai ngày — chuyến 7h15 thường hết sạch từ chiều hôm trước.', 'There are three runs a day from Rach Gia: 7:15, 9:30 and 12:45. The early one is almost always the calmest, before the wind picks up. If you are travelling on a weekend between April and August, book at least two days ahead — the 7:15 usually sells out the afternoon before.'),
            },
            {
                kind: 'l',
                items: [
                    {
                        vi: 'Ngồi giữa thân tàu, hàng ghế thấp — ít xóc nhất',
                        en: 'Sit mid-hull in a lower row — the least motion',
                    },
                    {
                        vi: 'Uống thuốc chống say 30 phút trước giờ khởi hành',
                        en: 'Take motion-sickness tablets 30 minutes before departure',
                    },
                    {
                        vi: 'Mang theo một chai nước và ít bánh mặn',
                        en: 'Bring water and something salty to nibble',
                    },
                    {
                        vi: 'Đừng đọc điện thoại trong 20 phút đầu ra khơi',
                        en: 'Do not look at your phone for the first 20 minutes',
                    },
                ],
            },
            {
                kind: 'q',
                text: t('Khách hay hỏi có nên đi chuyến trưa cho thong thả. Câu trả lời của chúng tôi là không — biển chiều ở vùng này khác hẳn biển sáng.', 'Guests often ask about the midday run so they can sleep in. Our answer is no — the afternoon sea here is a different sea.'),
            },
            {
                kind: 'i',
                slotId: 'ndh-blog-tau-ra-nam-du-b4',
                text: t('Bên trong khoang tàu cao tốc', 'Inside the speedboat cabin'),
                caption: t('Khoang ghế của tàu Superdong, hàng ghế giữa thân là chỗ êm nhất.', 'Superdong cabin — the mid-hull rows ride the softest.'),
            },
            {
                kind: 'h',
                text: t('Đến đảo rồi thì sao', 'Once you land'),
            },
            {
                kind: 'p',
                text: t('Tàu cập bến Củ Tron, xe của khu nghỉ đợi ngay đầu cầu cảng — bạn không cần đặt trước, chỉ cần nhắn giờ tàu vào Zalo trước một ngày. Đường lên đồi dài 1,8 km, dốc và hẹp, nên chúng tôi khuyên khách đừng tự thuê xe máy trong ngày đầu tiên khi chưa quen đường.', 'The boat docks at Cu Tron and our car waits at the head of the pier — no booking needed, just send your boat time over Zalo the day before. The hill road is 1.8 km, steep and narrow, so we suggest not renting a motorbike on your first day.'),
            },
            {
                kind: 'p',
                text: t('Nếu tàu bị huỷ vì thời tiết — chuyện xảy ra vài lần mỗi năm vào mùa gió chướng — tiền cọc phòng của bạn được hoàn đủ, không cần giải thích gì thêm.', 'If the boat is cancelled for weather — which happens a few times a year in the monsoon months — your deposit is refunded in full, no explanation needed.'),
            },
        ],
    },
    {
        id: 'phong-hang-da',
        category: t('HẬU TRƯỜNG', 'BEHIND THE SCENES'),
        title: t('Chúng tôi đã xây phòng quanh một vách đá như thế nào', 'How we built a room around a cliff'),
        lede: t('Phòng 14 mất mười bốn tháng để hoàn thành, phần lớn thời gian là để tìm cách không chạm vào tảng đá.', 'Room 14 took fourteen months, most of it spent working out how not to touch the rock.'),
        author: t('Nguyễn Thu Vân', 'Van Nguyen'),
        role: t('Đồng sáng lập', 'Co-founder'),
        date: t('28 tháng 4, 2026', '28 April 2026'),
        readMin: 6,
        heroSlot: 'ndh-room-14',
        heroCaption: t('Vách đá nguyên khối trong phòng ngủ số 14.', 'The untouched cliff face inside room 14.'),
        tags: [
            {
                vi: 'Phòng 14',
                en: 'Room 14',
            },
            {
                vi: 'Kiến trúc',
                en: 'Architecture',
            },
            {
                vi: 'Hang đá',
                en: 'Cave',
            },
            {
                vi: 'Xây dựng',
                en: 'Construction',
            },
        ],
        blocks: [
            {
                kind: 'p',
                text: t('Khi dọn nền cho khối phòng phía đông, chúng tôi gặp một mỏm đá granite cao gần bốn mét chạy chéo qua đúng chỗ định đặt giường. Phương án đầu tiên của nhà thầu là phá bỏ. Chúng tôi đã dừng công trình hai tháng để nghĩ lại.', 'Clearing the ground for the east block, we hit a granite outcrop nearly four metres tall running diagonally through exactly where the bed was meant to go. The contractor proposed removing it. We stopped work for two months instead.'),
            },
            {
                kind: 'h',
                text: t('Không phá, thì phải đo', 'If you do not cut, you measure'),
            },
            {
                kind: 'p',
                text: t('Toàn bộ mặt đá được đo thủ công theo lưới 20 cm, rồi dựng lại trên bản vẽ. Tường phòng bám theo đường viền đá thay vì cắt qua nó, nên không có bức tường nào trong phòng 14 thật sự thẳng. Phòng tắm nằm lọt trong khe đá tự nhiên phía sau — chúng tôi chỉ thêm sàn, thoát nước và một ô cửa kính.', 'The whole rock face was measured by hand on a 20 cm grid, then redrawn. The walls follow the stone rather than cut through it, so no wall in room 14 is truly straight. The bathroom sits inside the natural cleft behind it — we added a floor, drainage and one pane of glass.'),
            },
            {
                kind: 'q',
                text: t('Đá không nứt vì mình xây quanh nó. Đá nứt vì mình ép nó thẳng.', 'Rock does not crack because you build around it. It cracks because you force it straight.'),
            },
            {
                kind: 'i',
                slotId: 'ndh-blog-phong-hang-da-b4',
                text: t('Phòng tắm trong hang đá', 'Bathroom inside the rock cleft'),
                caption: t('Phòng tắm nằm trong khe đá tự nhiên, chỉ thêm sàn và thoát nước.', 'The bathroom inside the natural cleft — only floor and drainage were added.'),
            },
            {
                kind: 'p',
                text: t('Con suối chảy qua nền đá vẫn còn nguyên. Về đêm khách nghe rõ tiếng nước, và đó là lý do phòng 14 luôn kín trước các phòng khác ba tuần.', 'The stream running under the rock is still there. At night you hear it clearly, and that is why room 14 books out three weeks ahead of every other room.'),
            },
        ],
    },
    {
        id: 'an-gi-o-nam-du',
        category: t('ẨM THỰC', 'FOOD'),
        title: t('Ăn gì ở Nam Du: chín món và ba nơi khách hay bỏ lỡ', 'Eating on Nam Du: nine dishes and three places most guests miss'),
        lede: t('Chợ đêm chỉ là phần dễ thấy. Những bữa ngon nhất trên đảo thường nằm ở nơi không có biển hiệu.', 'The night market is the obvious part. The best meals on the island tend to have no sign out front.'),
        author: t('Lê Quốc Bảo', 'Bao Le'),
        role: t('Bếp trưởng', 'Head chef'),
        date: t('3 tháng 3, 2026', '3 March 2026'),
        readMin: 7,
        heroSlot: 'ndh-dish-goica',
        heroCaption: t('Nhum biển nướng mỡ hành, món chỉ ngon từ tháng 3 đến tháng 7.', 'Grilled sea urchin — only worth ordering March to July.'),
        tags: [
            {
                vi: 'Chợ đêm',
                en: 'Night market',
            },
            {
                vi: 'Hải sản',
                en: 'Seafood',
            },
            {
                vi: 'Nhum biển',
                en: 'Sea urchin',
            },
            {
                vi: 'BBQ',
                en: 'BBQ',
            },
        ],
        blocks: [
            {
                kind: 'h',
                text: t('Món theo mùa, không phải theo thực đơn', 'Order by season, not by menu'),
            },
            {
                kind: 'p',
                text: t('Nhum biển ngon nhất từ tháng 3 đến tháng 7. Ngoài khoảng đó, hàng quán vẫn bán nhưng là hàng đông lạnh chở từ đất liền ra, và bạn sẽ trả giá tươi cho món không tươi. Cá bớp thì ngược lại — mùa gió chướng cá chắc thịt hơn hẳn.', 'Sea urchin is at its best March to July. Outside that window it is still sold, but frozen and shipped from the mainland — you pay fresh prices for something that is not. Cobia is the opposite: it firms up in the windy months.'),
            },
            {
                kind: 'l',
                items: [
                    {
                        vi: 'Nhum nướng mỡ hành — chỉ gọi trong mùa',
                        en: 'Grilled sea urchin with scallion oil — in season only',
                    },
                    {
                        vi: 'Cá bớp nấu ngót, ăn buổi trưa',
                        en: 'Cobia in clear sour broth, best at lunch',
                    },
                    {
                        vi: 'Ốc giác hấp gừng ở dãy quán cuối chợ đêm',
                        en: 'Steamed sea snail with ginger at the far end of the market',
                    },
                    {
                        vi: 'Bánh canh ghẹ ở quán không tên gần trạm y tế',
                        en: 'Crab noodle soup at the unnamed stall near the clinic',
                    },
                ],
            },
            {
                kind: 'i',
                slotId: 'ndh-dish-lau',
                text: t('Chợ đêm Nam Du buổi tối', 'Nam Du night market'),
                caption: t('Chợ đêm bắt đầu đông từ 18h30, quán ngon nhất nằm ở dãy trong cùng.', 'The market fills from 6:30pm; the best stalls are in the back row.'),
            },
            {
                kind: 'p',
                text: t('Trên đồi, bếp của chúng tôi mua cá trực tiếp từ ba chiếc ghe quen mỗi sáng. Nếu hôm đó biển động và ghe không ra, thực đơn tối sẽ đổi — chúng tôi không nhập hàng đông lạnh để giữ đúng thực đơn in sẵn.', 'Up on the hill, our kitchen buys from the same three boats each morning. If the sea is rough and they do not go out, the evening menu changes — we do not bring in frozen fish to keep a printed menu honest.'),
            },
        ],
    },
    {
        id: 'ba-ngay-o-dao',
        category: t('SỰ KIỆN', 'EVENT'),
        title: t('Ba ngày ở Nam Du mà không phải chạy đua', 'Three days on Nam Du without rushing'),
        lede: t('Đảo nhỏ, nhưng đường đi lại chậm. Đây là lịch trình chúng tôi thật sự khuyên khách, không phải lịch trình nhồi đủ mười điểm check-in.', 'The island is small but slow to move around. This is the itinerary we actually recommend, not the one that fits ten photo stops.'),
        author: t('Trần Minh Hải', 'Hai Tran'),
        role: t('Quản lý khu nghỉ', 'Resort manager'),
        date: t('15 tháng 1, 2026', '15 January 2026'),
        readMin: 9,
        heroSlot: 'ndh-spot-haidang',
        heroCaption: t('Bãi Mến lúc chiều muộn, thời điểm ít người nhất trong ngày.', 'Bai Men in late afternoon, the emptiest hour of the day.'),
        tags: [
            {
                vi: 'Lịch trình',
                en: 'Itinerary',
            },
            {
                vi: 'Bãi Mến',
                en: 'Bai Men',
            },
            {
                vi: 'Hòn Mấu',
                en: 'Hon Mau',
            },
            {
                vi: 'Hải đăng',
                en: 'Lighthouse',
            },
        ],
        blocks: [
            {
                kind: 'h',
                text: t('Ngày 1 — đừng đi đâu cả', 'Day 1 — go nowhere'),
            },
            {
                kind: 'p',
                text: t('Chuyến tàu sáng thả bạn xuống đảo lúc gần 10h. Nhận phòng, ăn trưa, ngủ một giấc. Chiều muộn đi bộ xuống Bãi Mến, cách khu nghỉ 900 m — đây là khung giờ bãi vắng nhất và nước trong nhất trong ngày.', 'The morning boat puts you on the island around 10. Check in, eat, sleep. Late afternoon, walk down to Bai Men, 900 m from the resort — the emptiest and clearest hour of the day.'),
            },
            {
                kind: 'h',
                text: t('Ngày 2 — ra các hòn nhỏ', 'Day 2 — the outer islets'),
            },
            {
                kind: 'p',
                text: t('Thuê ghe đi Hòn Mấu và Hòn Ngang từ sáng sớm, về trước 14h để tránh gió chiều. Hòn Mấu có hai bãi nằm sát nhau nhưng khác hẳn: một bên cát trắng mịn, một bên toàn đá cuội tròn.', 'Hire a boat to Hon Mau and Hon Ngang early, and be back before 2pm to beat the afternoon wind. Hon Mau has two beaches side by side that could not be less alike: fine white sand on one, round pebbles on the other.'),
            },
            {
                kind: 'q',
                text: t('Nếu chỉ có một buổi để chọn, hãy chọn buổi sáng ở Hòn Mấu thay vì buổi chiều ở bất cứ đâu.', 'If you only get one outing, take a morning at Hon Mau over an afternoon anywhere else.'),
            },
            {
                kind: 'i',
                slotId: 'ndh-island-honmau',
                text: t('Hòn Mấu nhìn từ ghe', 'Hon Mau from the boat'),
                caption: t('Hòn Mấu nhìn từ ghe, khoảng 25 phút từ Củ Tron.', 'Hon Mau from the boat, about 25 minutes from Cu Tron.'),
            },
            {
                kind: 'h',
                text: t('Ngày 3 — hải đăng rồi về', 'Day 3 — the lighthouse, then home'),
            },
            {
                kind: 'p',
                text: t('Lên hải đăng vào sáng sớm khi trời còn mát, mất khoảng 40 phút đi bộ từ khu nghỉ. Từ trên đó nhìn thấy toàn bộ quần đảo trong một khung hình. Xuống núi kịp ăn trưa rồi ra bến cho chuyến 12h45.', 'Walk up to the lighthouse early while it is still cool, about 40 minutes from the resort. From the top the whole archipelago fits in one frame. Back down in time for lunch and the 12:45 boat.'),
            },
        ],
    },
    {
        id: 'tau-lan-bien-ngu-dao',
        category: t('TRẢI NGHIỆM', 'EXPERIENCES'),
        title: t('Trải nghiệm đi tàu – lặn biển – ngủ đảo khi du lịch Nam Du', 'Boat rides, snorkelling and a night on the island in Nam Du'),
        lede: t('Ba trải nghiệm làm nên một chuyến Nam Du trọn vẹn: chuyến tàu ra đảo, buổi lặn ngắm san hô và một đêm ngủ lại giữa biển.', 'Three things make a Nam Du trip complete: the crossing, a morning among the coral, and one night spent out on the island.'),
        author: t('The Nam Du Hill Resort', 'The Nam Du Hill Resort'),
        role: t('Đội ngũ khu nghỉ', 'Resort team'),
        date: t('15 tháng 1, 2026', '15 January 2026'),
        readMin: 6,
        heroSlot: 'ndh-blog-tau-ra-nam-du-hero',
        heroCaption: t('Chuyến tàu sáng rời bến Rạch Giá ra quần đảo Nam Du.', 'The morning boat leaving Rach Gia for the Nam Du archipelago.'),
        tags: [
            {
                vi: 'Lặn biển',
                en: 'Snorkelling',
            },
            {
                vi: 'Tàu cao tốc',
                en: 'Speedboat',
            },
            {
                vi: 'Ngủ đảo',
                en: 'Island stay',
            },
        ],
        blocks: [
            {
                kind: 'h',
                text: t('Chuyến tàu ra đảo', 'The crossing'),
            },
            {
                kind: 'p',
                text: t('Hành trình bắt đầu từ bến Rạch Giá, mất khoảng hai giờ mười lăm phút để tới Củ Tron. Đây là quãng thời gian đẹp nhất để nhìn quần đảo hiện dần lên phía chân trời — nên chọn chuyến sáng sớm khi biển còn êm.', 'The trip starts at Rach Gia pier and takes about two hours fifteen to reach Cu Tron. It is the best window to watch the archipelago rise on the horizon — take an early run, while the sea is still calm.'),
            },
            {
                kind: 'h',
                text: t('Lặn ngắm san hô', 'Among the coral'),
            },
            {
                kind: 'p',
                text: t('Đội ngũ khu nghỉ hỗ trợ sắp xếp ghe ra các hòn nhỏ, nơi nước trong và rạn san hô còn nguyên vẹn. Buổi sáng là thời điểm nước lặng và tầm nhìn dưới mặt nước rõ nhất trong ngày.', 'Our team arranges boats out to the smaller islets, where the water is clear and the reefs are still intact. Mornings bring the flattest water and the best visibility below the surface.'),
            },
            {
                kind: 'h',
                text: t('Một đêm ngủ lại đảo', 'A night on the island'),
            },
            {
                kind: 'p',
                text: t('Điều khiến Nam Du khác với một chuyến đi trong ngày là buổi tối. Khi tàu cuối cùng rời bến, đảo trở nên rất yên — chỉ còn tiếng sóng và bầu trời sao gần như không bị ánh đèn thành phố che khuất.', 'What separates Nam Du from a day trip is the evening. Once the last boat leaves, the island goes quiet — just the surf and a sky almost untouched by city light.'),
            },
        ],
    },
    {
        id: 'trai-nghiem-nam-du-lan-dau',
        category: t('TRẢI NGHIỆM', 'EXPERIENCES'),
        title: t('Trải nghiệm không thể bỏ lỡ khi du lịch đảo Nam Du lần đầu', 'What not to miss on your first trip to Nam Du'),
        lede: t('Lần đầu ra Nam Du thường chỉ có hai đến ba ngày. Đây là những gì chúng tôi khuyên khách nên ưu tiên, và những gì có thể để dành cho lần sau.', 'A first trip to Nam Du usually means two or three days. Here is what we suggest putting first, and what can wait for next time.'),
        author: t('The Nam Du Hill Resort', 'The Nam Du Hill Resort'),
        role: t('Đội ngũ khu nghỉ', 'Resort team'),
        date: t('15 tháng 1, 2026', '15 January 2026'),
        readMin: 5,
        heroSlot: 'ndh-spot-haidang',
        heroCaption: t('Đường lên hải đăng, điểm nhìn cao nhất quần đảo.', 'The lighthouse road, the highest viewpoint in the archipelago.'),
        tags: [
            {
                vi: 'Lần đầu',
                en: 'First visit',
            },
            {
                vi: 'Hải đăng',
                en: 'Lighthouse',
            },
            {
                vi: 'Bãi Mến',
                en: 'Bai Men',
            },
        ],
        blocks: [
            {
                kind: 'h',
                text: t('Lên hải đăng một lần', 'Climb to the lighthouse once'),
            },
            {
                kind: 'p',
                text: t('Ở độ cao 309 m, đây là điểm duy nhất nhìn thấy toàn bộ quần đảo trong một khung hình. Đi vào sáng sớm khi trời còn mát, mất khoảng 40 phút đi bộ từ khu nghỉ.', 'At 309 m this is the only place the whole archipelago fits in one frame. Go early while it is still cool — about 40 minutes on foot from the resort.'),
            },
            {
                kind: 'h',
                text: t('Đi vòng quanh đảo', 'Ride the coastal loop'),
            },
            {
                kind: 'p',
                text: t('Đường ven biển dài khoảng 11 km, chạy hết chưa tới một buổi. Nên đi ngược chiều kim đồng hồ để mặt trời không chiếu thẳng vào mắt lúc chiều muộn.', 'The coastal road runs about 11 km and takes less than half a day. Go anticlockwise so the late sun stays out of your eyes.'),
            },
            {
                kind: 'h',
                text: t('Để dành cho lần sau', 'Save it for next time'),
            },
            {
                kind: 'p',
                text: t('Đừng cố đi hết các hòn nhỏ trong một chuyến. Chọn một hòn và ở lại đó lâu hơn — Nam Du là nơi càng đi chậm càng đáng đi.', 'Do not try to reach every islet in one trip. Pick one and stay longer — Nam Du rewards the slower pace.'),
            },
        ],
    },
    {
        id: 'nam-du-thien-duong-hoang-so',
        category: t('TRẢI NGHIỆM', 'EXPERIENCES'),
        title: t('Trải nghiệm du lịch đảo Nam Du: thiên đường biển hoang sơ đáng đi nhất miền Tây', 'Nam Du: the most worthwhile untouched island in the Mekong Delta'),
        lede: t('Quần đảo 21 hòn nằm cách bờ 90 km, vẫn giữ được nhịp sống chậm và những bãi biển chưa bị lấp đầy bởi hàng quán.', 'Twenty-one islands lying 90 km offshore, still holding on to a slow rhythm and beaches not yet crowded out by concessions.'),
        author: t('The Nam Du Hill Resort', 'The Nam Du Hill Resort'),
        role: t('Đội ngũ khu nghỉ', 'Resort team'),
        date: t('15 tháng 1, 2026', '15 January 2026'),
        readMin: 7,
        heroSlot: 'ndh-island-honmau',
        heroCaption: t('Một trong các hòn vệ tinh của quần đảo Nam Du.', 'One of the satellite islets in the Nam Du archipelago.'),
        tags: [
            {
                vi: 'Nam Du',
                en: 'Nam Du',
            },
            {
                vi: 'Biển hoang sơ',
                en: 'Untouched coast',
            },
            {
                vi: 'Miền Tây',
                en: 'Mekong Delta',
            },
        ],
        blocks: [
            {
                kind: 'h',
                text: t('Vì sao Nam Du còn hoang sơ', 'Why Nam Du is still quiet'),
            },
            {
                kind: 'p',
                text: t('Khoảng cách chính là thứ giữ cho đảo yên tĩnh. Không có sân bay, không có cầu — mọi người đến đây đều phải đi tàu, và điều đó tự nó lọc bớt lượng khách.', 'Distance is what keeps the island quiet. There is no airport and no bridge — everyone arrives by boat, and that alone thins the crowd.'),
            },
            {
                kind: 'h',
                text: t('Mùa nào nên đi', 'When to come'),
            },
            {
                kind: 'p',
                text: t('Từ tháng 12 đến tháng 3 là khoảng đẹp nhất: biển lặng, trời trong và ít mưa. Mùa gió chướng biển động hơn, tàu có thể huỷ chuyến vài lần mỗi năm.', 'December to March is the best stretch: calm sea, clear sky, little rain. In the monsoon months the water is rougher and boats are cancelled a few times a year.'),
            },
            {
                kind: 'h',
                text: t('Đi rồi nên làm gì', 'What to do once there'),
            },
            {
                kind: 'p',
                text: t('Lặn ngắm san hô ở các hòn nhỏ, chạy vòng đường ven biển, lên hải đăng, và dành ít nhất một buổi chiều không có kế hoạch gì cả. Khu nghỉ hỗ trợ sắp xếp ghe, tour đảo và đón tàu tại bến Củ Tron.', 'Snorkel around the islets, ride the coastal loop, climb to the lighthouse — and leave at least one afternoon with nothing planned. We help arrange boats, island tours and pier pickup at Cu Tron.'),
            },
        ],
    },
]
