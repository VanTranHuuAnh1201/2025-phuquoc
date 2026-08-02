export interface BlogBlock {
  kind: 'h' | 'p' | 'q' | 'i' | 'l'
  textVi?: string
  textEn?: string
  captionVi?: string
  captionEn?: string
  slotId?: string
  items?: Array<{ vi: string; en: string }>
}

export interface BlogPost {
  id: string
  categoryVi: string
  categoryEn: string
  titleVi: string
  titleEn: string
  ledeVi: string
  ledeEn: string
  authorVi: string
  authorEn: string
  roleVi: string
  roleEn: string
  dateVi: string
  dateEn: string
  readMin: number
  heroSlot: string
  heroCaptionVi: string
  heroCaptionEn: string
  tags: Array<{ vi: string; en: string }>
  blocks: BlogBlock[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'tau-ra-nam-du',
    categoryVi: 'DI CHUYỂN',
    categoryEn: 'GETTING THERE',
    titleVi: 'Đi tàu ra Nam Du: chuyến nào, giá bao nhiêu, say sóng thì làm sao',
    titleEn: 'The boat to Nam Du: which run, what it costs, and what to do about seasickness',
    ledeVi:
      'Từ bến Rạch Giá ra Củ Tron mất khoảng 2 giờ 15 phút. Đây là những gì chúng tôi dặn khách trước mỗi chuyến, sau bảy năm đón khách ở bến tàu.',
    ledeEn:
      'Rach Gia pier to Cu Tron takes about 2 hours 15 minutes. This is what we tell guests before every trip, after seven years of meeting them at the pier.',
    authorVi: 'Trần Minh Hải',
    authorEn: 'Hai Tran',
    roleVi: 'Quản lý khu nghỉ',
    roleEn: 'Resort manager',
    dateVi: '12 tháng 6, 2026',
    dateEn: '12 June 2026',
    readMin: 8,
    heroSlot: 'ndh-blog-tau-ra-nam-du-hero',
    heroCaptionVi: 'Bến tàu Rạch Giá lúc 7h sáng, chuyến đầu tiên trong ngày.',
    heroCaptionEn: 'Rach Gia pier at 7am, the first run of the day.',
    tags: [
      { vi: 'Tàu cao tốc', en: 'Speedboat' },
      { vi: 'Rạch Giá', en: 'Rach Gia' },
      { vi: 'Say sóng', en: 'Seasickness' },
      { vi: 'Lịch trình', en: 'Schedule' },
    ],
    blocks: [
      {
        kind: 'h',
        textVi: 'Chọn chuyến nào',
        textEn: 'Which run to take',
      },
      {
        kind: 'p',
        textVi:
          'Mỗi ngày có ba chuyến từ Rạch Giá: 7h15, 9h30 và 12h45. Chuyến sáng sớm gần như luôn êm nhất vì biển chưa nổi gió. Nếu bạn đi cuối tuần trong mùa cao điểm từ tháng 4 đến tháng 8, hãy đặt vé trước ít nhất hai ngày — chuyến 7h15 thường hết sạch từ chiều hôm trước.',
        textEn:
          'There are three runs a day from Rach Gia: 7:15, 9:30 and 12:45. The early one is almost always the calmest, before the wind picks up. If you are travelling on a weekend between April and August, book at least two days ahead — the 7:15 usually sells out the afternoon before.',
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
        textVi:
          'Khách hay hỏi có nên đi chuyến trưa cho thong thả. Câu trả lời của chúng tôi là không — biển chiều ở vùng này khác hẳn biển sáng.',
        textEn:
          'Guests often ask about the midday run so they can sleep in. Our answer is no — the afternoon sea here is a different sea.',
      },
      {
        kind: 'i',
        slotId: 'ndh-blog-tau-ra-nam-du-b4',
        textVi: 'Bên trong khoang tàu cao tốc',
        textEn: 'Inside the speedboat cabin',
        captionVi: 'Khoang ghế của tàu Superdong, hàng ghế giữa thân là chỗ êm nhất.',
        captionEn: 'Superdong cabin — the mid-hull rows ride the softest.',
      },
      {
        kind: 'h',
        textVi: 'Đến đảo rồi thì sao',
        textEn: 'Once you land',
      },
      {
        kind: 'p',
        textVi:
          'Tàu cập bến Củ Tron, xe của khu nghỉ đợi ngay đầu cầu cảng — bạn không cần đặt trước, chỉ cần nhắn giờ tàu vào Zalo trước một ngày. Đường lên đồi dài 1,8 km, dốc và hẹp, nên chúng tôi khuyên khách đừng tự thuê xe máy trong ngày đầu tiên khi chưa quen đường.',
        textEn:
          'The boat docks at Cu Tron and our car waits at the head of the pier — no booking needed, just send your boat time over Zalo the day before. The hill road is 1.8 km, steep and narrow, so we suggest not renting a motorbike on your first day.',
      },
      {
        kind: 'p',
        textVi:
          'Nếu tàu bị huỷ vì thời tiết — chuyện xảy ra vài lần mỗi năm vào mùa gió chướng — tiền cọc phòng của bạn được hoàn đủ, không cần giải thích gì thêm.',
        textEn:
          'If the boat is cancelled for weather — which happens a few times a year in the monsoon months — your deposit is refunded in full, no explanation needed.',
      },
    ],
  },
  {
    id: 'phong-hang-da',
    categoryVi: 'HẬU TRƯỜNG',
    categoryEn: 'BEHIND THE SCENES',
    titleVi: 'Chúng tôi đã xây phòng quanh một vách đá như thế nào',
    titleEn: 'How we built a room around a cliff',
    ledeVi:
      'Phòng 14 mất mười bốn tháng để hoàn thành, phần lớn thời gian là để tìm cách không chạm vào tảng đá.',
    ledeEn:
      'Room 14 took fourteen months, most of it spent working out how not to touch the rock.',
    authorVi: 'Nguyễn Thu Vân',
    authorEn: 'Van Nguyen',
    roleVi: 'Đồng sáng lập',
    roleEn: 'Co-founder',
    dateVi: '28 tháng 4, 2026',
    dateEn: '28 April 2026',
    readMin: 6,
    heroSlot: 'ndh-room-14',
    heroCaptionVi: 'Vách đá nguyên khối trong phòng ngủ số 14.',
    heroCaptionEn: 'The untouched cliff face inside room 14.',
    tags: [
      { vi: 'Phòng 14', en: 'Room 14' },
      { vi: 'Kiến trúc', en: 'Architecture' },
      { vi: 'Hang đá', en: 'Cave' },
      { vi: 'Xây dựng', en: 'Construction' },
    ],
    blocks: [
      {
        kind: 'p',
        textVi:
          'Khi dọn nền cho khối phòng phía đông, chúng tôi gặp một mỏm đá granite cao gần bốn mét chạy chéo qua đúng chỗ định đặt giường. Phương án đầu tiên của nhà thầu là phá bỏ. Chúng tôi đã dừng công trình hai tháng để nghĩ lại.',
        textEn:
          'Clearing the ground for the east block, we hit a granite outcrop nearly four metres tall running diagonally through exactly where the bed was meant to go. The contractor proposed removing it. We stopped work for two months instead.',
      },
      {
        kind: 'h',
        textVi: 'Không phá, thì phải đo',
        textEn: 'If you do not cut, you measure',
      },
      {
        kind: 'p',
        textVi:
          'Toàn bộ mặt đá được đo thủ công theo lưới 20 cm, rồi dựng lại trên bản vẽ. Tường phòng bám theo đường viền đá thay vì cắt qua nó, nên không có bức tường nào trong phòng 14 thật sự thẳng. Phòng tắm nằm lọt trong khe đá tự nhiên phía sau — chúng tôi chỉ thêm sàn, thoát nước và một ô cửa kính.',
        textEn:
          'The whole rock face was measured by hand on a 20 cm grid, then redrawn. The walls follow the stone rather than cut through it, so no wall in room 14 is truly straight. The bathroom sits inside the natural cleft behind it — we added a floor, drainage and one pane of glass.',
      },
      {
        kind: 'q',
        textVi: 'Đá không nứt vì mình xây quanh nó. Đá nứt vì mình ép nó thẳng.',
        textEn: 'Rock does not crack because you build around it. It cracks because you force it straight.',
      },
      {
        kind: 'i',
        slotId: 'ndh-blog-phong-hang-da-b4',
        textVi: 'Phòng tắm trong hang đá',
        textEn: 'Bathroom inside the rock cleft',
        captionVi: 'Phòng tắm nằm trong khe đá tự nhiên, chỉ thêm sàn và thoát nước.',
        captionEn: 'The bathroom inside the natural cleft — only floor and drainage were added.',
      },
      {
        kind: 'p',
        textVi:
          'Con suối chảy qua nền đá vẫn còn nguyên. Về đêm khách nghe rõ tiếng nước, và đó là lý do phòng 14 luôn kín trước các phòng khác ba tuần.',
        textEn:
          'The stream running under the rock is still there. At night you hear it clearly, and that is why room 14 books out three weeks ahead of every other room.',
      },
    ],
  },
  {
    id: 'an-gi-o-nam-du',
    categoryVi: 'ẨM THỰC',
    categoryEn: 'FOOD',
    titleVi: 'Ăn gì ở Nam Du: chín món và ba nơi khách hay bỏ lỡ',
    titleEn: 'Eating on Nam Du: nine dishes and three places most guests miss',
    ledeVi:
      'Chợ đêm chỉ là phần dễ thấy. Những bữa ngon nhất trên đảo thường nằm ở nơi không có biển hiệu.',
    ledeEn:
      'The night market is the obvious part. The best meals on the island tend to have no sign out front.',
    authorVi: 'Lê Quốc Bảo',
    authorEn: 'Bao Le',
    roleVi: 'Bếp trưởng',
    roleEn: 'Head chef',
    dateVi: '3 tháng 3, 2026',
    dateEn: '3 March 2026',
    readMin: 7,
    heroSlot: 'ndh-dish-goica',
    heroCaptionVi: 'Nhum biển nướng mỡ hành, món chỉ ngon từ tháng 3 đến tháng 7.',
    heroCaptionEn: 'Grilled sea urchin — only worth ordering March to July.',
    tags: [
      { vi: 'Chợ đêm', en: 'Night market' },
      { vi: 'Hải sản', en: 'Seafood' },
      { vi: 'Nhum biển', en: 'Sea urchin' },
      { vi: 'BBQ', en: 'BBQ' },
    ],
    blocks: [
      {
        kind: 'h',
        textVi: 'Món theo mùa, không phải theo thực đơn',
        textEn: 'Order by season, not by menu',
      },
      {
        kind: 'p',
        textVi:
          'Nhum biển ngon nhất từ tháng 3 đến tháng 7. Ngoài khoảng đó, hàng quán vẫn bán nhưng là hàng đông lạnh chở từ đất liền ra, và bạn sẽ trả giá tươi cho món không tươi. Cá bớp thì ngược lại — mùa gió chướng cá chắc thịt hơn hẳn.',
        textEn:
          'Sea urchin is at its best March to July. Outside that window it is still sold, but frozen and shipped from the mainland — you pay fresh prices for something that is not. Cobia is the opposite: it firms up in the windy months.',
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
        textVi: 'Chợ đêm Nam Du buổi tối',
        textEn: 'Nam Du night market',
        captionVi: 'Chợ đêm bắt đầu đông từ 18h30, quán ngon nhất nằm ở dãy trong cùng.',
        captionEn: 'The market fills from 6:30pm; the best stalls are in the back row.',
      },
      {
        kind: 'p',
        textVi:
          'Trên đồi, bếp của chúng tôi mua cá trực tiếp từ ba chiếc ghe quen mỗi sáng. Nếu hôm đó biển động và ghe không ra, thực đơn tối sẽ đổi — chúng tôi không nhập hàng đông lạnh để giữ đúng thực đơn in sẵn.',
        textEn:
          'Up on the hill, our kitchen buys from the same three boats each morning. If the sea is rough and they do not go out, the evening menu changes — we do not bring in frozen fish to keep a printed menu honest.',
      },
    ],
  },
  {
    id: 'ba-ngay-o-dao',
    categoryVi: 'LỊCH TRÌNH',
    categoryEn: 'ITINERARY',
    titleVi: 'Ba ngày ở Nam Du mà không phải chạy đua',
    titleEn: 'Three days on Nam Du without rushing',
    ledeVi:
      'Đảo nhỏ, nhưng đường đi lại chậm. Đây là lịch trình chúng tôi thật sự khuyên khách, không phải lịch trình nhồi đủ mười điểm check-in.',
    ledeEn:
      'The island is small but slow to move around. This is the itinerary we actually recommend, not the one that fits ten photo stops.',
    authorVi: 'Trần Minh Hải',
    authorEn: 'Hai Tran',
    roleVi: 'Quản lý khu nghỉ',
    roleEn: 'Resort manager',
    dateVi: '15 tháng 1, 2026',
    dateEn: '15 January 2026',
    readMin: 9,
    heroSlot: 'ndh-spot-haidang',
    heroCaptionVi: 'Bãi Mến lúc chiều muộn, thời điểm ít người nhất trong ngày.',
    heroCaptionEn: 'Bai Men in late afternoon, the emptiest hour of the day.',
    tags: [
      { vi: 'Lịch trình', en: 'Itinerary' },
      { vi: 'Bãi Mến', en: 'Bai Men' },
      { vi: 'Hòn Mấu', en: 'Hon Mau' },
      { vi: 'Hải đăng', en: 'Lighthouse' },
    ],
    blocks: [
      {
        kind: 'h',
        textVi: 'Ngày 1 — đừng đi đâu cả',
        textEn: 'Day 1 — go nowhere',
      },
      {
        kind: 'p',
        textVi:
          'Chuyến tàu sáng thả bạn xuống đảo lúc gần 10h. Nhận phòng, ăn trưa, ngủ một giấc. Chiều muộn đi bộ xuống Bãi Mến, cách khu nghỉ 900 m — đây là khung giờ bãi vắng nhất và nước trong nhất trong ngày.',
        textEn:
          'The morning boat puts you on the island around 10. Check in, eat, sleep. Late afternoon, walk down to Bai Men, 900 m from the resort — the emptiest and clearest hour of the day.',
      },
      {
        kind: 'h',
        textVi: 'Ngày 2 — ra các hòn nhỏ',
        textEn: 'Day 2 — the outer islets',
      },
      {
        kind: 'p',
        textVi:
          'Thuê ghe đi Hòn Mấu và Hòn Ngang từ sáng sớm, về trước 14h để tránh gió chiều. Hòn Mấu có hai bãi nằm sát nhau nhưng khác hẳn: một bên cát trắng mịn, một bên toàn đá cuội tròn.',
        textEn:
          'Hire a boat to Hon Mau and Hon Ngang early, and be back before 2pm to beat the afternoon wind. Hon Mau has two beaches side by side that could not be less alike: fine white sand on one, round pebbles on the other.',
      },
      {
        kind: 'q',
        textVi:
          'Nếu chỉ có một buổi để chọn, hãy chọn buổi sáng ở Hòn Mấu thay vì buổi chiều ở bất cứ đâu.',
        textEn:
          'If you only get one outing, take a morning at Hon Mau over an afternoon anywhere else.',
      },
      {
        kind: 'i',
        slotId: 'ndh-island-honmau',
        textVi: 'Hòn Mấu nhìn từ ghe',
        textEn: 'Hon Mau from the boat',
        captionVi: 'Hòn Mấu nhìn từ ghe, khoảng 25 phút từ Củ Tron.',
        captionEn: 'Hon Mau from the boat, about 25 minutes from Cu Tron.',
      },
      {
        kind: 'h',
        textVi: 'Ngày 3 — hải đăng rồi về',
        textEn: 'Day 3 — the lighthouse, then home',
      },
      {
        kind: 'p',
        textVi:
          'Lên hải đăng vào sáng sớm khi trời còn mát, mất khoảng 40 phút đi bộ từ khu nghỉ. Từ trên đó nhìn thấy toàn bộ quần đảo trong một khung hình. Xuống núi kịp ăn trưa rồi ra bến cho chuyến 12h45.',
        textEn:
          'Walk up to the lighthouse early while it is still cool, about 40 minutes from the resort. From the top the whole archipelago fits in one frame. Back down in time for lunch and the 12:45 boat.',
      },
    ],
  },
]
