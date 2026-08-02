export interface Spot {
  id: string
  nameVi: string
  nameEn: string
  distVi: string
  distEn: string
  textVi: string
  textEn: string
  tipVi: string
  tipEn: string
}

export interface SatelliteIsland {
  id: string
  nameVi: string
  nameEn: string
  badgeVi: string
  badgeEn: string
  textVi: string
  textEn: string
}

export interface ItineraryLeg {
  dayVi: string
  dayEn: string
  time: string
  titleVi: string
  titleEn: string
  textVi: string
  textEn: string
}

export interface CostItem {
  labelVi: string
  labelEn: string
  val: string
}

export interface TripPlan {
  key: 'd2' | 'd3'
  nameVi: string
  nameEn: string
  legs: ItineraryLeg[]
  costs: CostItem[]
  total: string
}

export const SPOTS: Spot[] = [
  {
    id: 'caymen',
    nameVi: 'Bãi Cây Mến',
    nameEn: 'Cay Men Beach',
    distVi: '4 phút xe',
    distEn: '4 min ride',
    textVi:
      'Bãi tắm đẹp nhất Nam Du, nằm trong vịnh kín gió. Cát trắng mịn, nước xanh lơ và hàng dừa cổ thụ 70–80 năm tuổi nghiêng bóng xuống mặt nước.',
    textEn:
      'The prettiest beach on Nam Du, tucked into a sheltered bay. Fine white sand, pale blue water and 70–80-year-old coconut palms leaning over it.',
    tipVi: 'Nước êm, hợp bơi và bắt ốc ở gờ đá',
    tipEn: 'Calm water; good for swimming and rock-pooling',
  },
  {
    id: 'haidang',
    nameVi: 'Hải đăng Nam Du',
    nameEn: 'Nam Du Lighthouse',
    distVi: '309 m',
    distEn: '309 m',
    textVi:
      'Một trong những ngọn hải đăng cao nhất Việt Nam. Từ trên đỉnh thu trọn cả 21 hòn đảo vào tầm mắt giữa biển trời mênh mông.',
    textEn:
      'One of the highest lighthouses in Vietnam. From the top you take in all 21 islands at once.',
    tipVi: 'Đi lúc 16:30 để kịp hoàng hôn trên đường về',
    tipEn: 'Go at 16:30 to catch sunset on the way down',
  },
  {
    id: 'baingu',
    nameVi: 'Bãi Ngự & Giếng Vua',
    nameEn: 'Bai Ngu & the King’s Well',
    distVi: 'Phía Tây đảo',
    distEn: 'West side',
    textVi:
      'Nơi vua Gia Long từng dừng chân lánh nạn. Giếng Ngự là giếng nước ngọt tự nhiên sát bờ biển nhưng chưa bao giờ cạn, kể cả những mùa khô khốc liệt nhất.',
    textEn:
      'Where Emperor Gia Long once sheltered. The King’s Well is a natural freshwater well beside the sea that has never run dry.',
    tipVi: 'Ghé kèm khi chạy vòng đảo buổi sáng',
    tipEn: 'Fold into the morning island loop',
  },
  {
    id: 'baichet',
    nameVi: 'Bãi Chệt & chợ hải sản',
    nameEn: 'Bai Chet & the fish market',
    distVi: 'Bến tàu chính',
    distEn: 'Main pier',
    textVi:
      'Trung tâm giao thương của đảo: bến tàu chính, chợ hải sản tươi sống, quán ăn và dịch vụ. Tên gọi bắt nguồn từ truyền thuyết giao chiến thương thuyền thế kỷ 16.',
    textEn:
      'The island’s trading centre: main pier, live seafood market, eateries and services.',
    tipVi: 'Mua hải sản chiều rồi mang lên đồi nướng',
    tipEn: 'Buy your catch here and grill it up at the resort',
  },
  {
    id: 'dinhong',
    nameVi: 'Dinh Ông Nam Hải',
    nameEn: 'Dinh Ong Nam Hai shrine',
    distVi: 'Ven biển',
    distEn: 'Coastal',
    textVi:
      'Nơi thờ và bảo tồn bộ xương cá Ông dài hơn 15 m do ngư dân phát hiện dạt vào bờ. Cạnh đó là Miếu Bà Chúa Xứ, chốn tâm linh của cư dân đảo.',
    textEn:
      'Home to a 15-metre whale skeleton found washed ashore by fishermen, beside the Ba Chua Xu shrine.',
    tipVi: 'Đi cùng buổi sáng ngày cuối trước khi rời đảo',
    tipEn: 'Good for the last morning before the boat',
  },
  {
    id: 'chodem',
    nameVi: 'Chợ đêm Nam Du',
    nameEn: 'Nam Du night market',
    distVi: 'Dưới chân đồi',
    distEn: 'Below the hill',
    textVi:
      'Hải sản nướng xiên, mực một nắng, đồ lưu niệm. Từ sân hiên resort nhìn thẳng xuống thấy cả dãy đèn chợ sáng lên lúc 19 giờ.',
    textEn:
      'Grilled skewers, one-sun-dried squid, souvenirs. From the resort terrace you look straight down on its lights coming on at seven.',
    tipVi: 'Đi bộ xuống mất 8 phút, lên dốc thì gọi xe',
    tipEn: '8 minutes downhill; call for a ride back up',
  },
]

export const SATELLITE_ISLANDS: SatelliteIsland[] = [
  {
    id: 'haibodap',
    nameVi: 'Hòn Hai Bờ Đập',
    nameEn: 'Hon Hai Bo Dap',
    badgeVi: 'MALDIVES THU NHỎ',
    badgeEn: 'MINI MALDIVES',
    textVi:
      'Hai đảo nhỏ nối nhau bằng dải đá tự nhiên vắt ngang biển. Nước nông và trong, tàu thả neo cho khách lặn ngắm san hô và chèo SUP.',
    textEn:
      'Two islets joined by a natural stone causeway. Shallow, clear water — boats anchor here for snorkelling and SUP.',
  },
  {
    id: 'honmau',
    nameVi: 'Hòn Mấu',
    nameEn: 'Hon Mau',
    badgeVi: '5 BÃI BIỂN',
    badgeEn: 'FIVE BEACHES',
    textVi:
      'Hơn 120 hộ dân sống bằng nghề lưới ghẹ. Năm bãi mỗi bãi một kiểu: Bãi Chướng và Bãi Nam cát trắng, Bãi Đá Đen phủ đá cuội đen bóng.',
    textEn:
      'A crab-netting village of 120 households. Five beaches, each different — white sand at Bai Chuong, polished black pebbles at Bai Da Den.',
  },
  {
    id: 'hondau',
    nameVi: 'Hòn Dầu',
    nameEn: 'Hon Dau',
    badgeVi: '90% RỪNG NGUYÊN SINH',
    badgeEn: '90% PRIMARY FOREST',
    textVi:
      'Hoang sơ, hơn 90% diện tích là rừng nguyên sinh. Rặng dừa ngả ra biển, xích đu gỗ trên nước và tổ chim bằng rễ cây là những góc chụp quen thuộc.',
    textEn:
      'Almost untouched, over 90% primary forest. Palms leaning over the water, a wooden swing and a nest woven from roots.',
  },
  {
    id: 'honngang',
    nameVi: 'Hòn Ngang',
    nameEn: 'Hon Ngang',
    badgeVi: 'LÀNG BÈ NỔI',
    badgeEn: 'FLOATING FARMS',
    textVi:
      'Vùng biển êm nhất quần đảo, nơi neo đậu tàu thuyền và nuôi hải sản lồng bè. Lên nhà bè ăn cá mú hấp, tôm hùm, nhum nướng ngay trên mặt nước.',
    textEn:
      'The calmest water in the archipelago, full of floating fish farms. Eat steamed grouper and grilled urchin right on the water.',
  },
]

export const TRIPS: Record<string, TripPlan> = {
  d2: {
    key: 'd2',
    nameVi: '2 ngày 1 đêm',
    nameEn: '2 days · 1 night',
    legs: [
      {
        dayVi: 'ĐÊM 1',
        dayEn: 'Night 1',
        time: '22:00 – 06:00',
        titleVi: 'Xe giường nằm TP.HCM → Rạch Giá',
        titleEn: 'Overnight coach HCMC → Rach Gia',
        textVi: 'Bắt xe từ Bến xe Miền Tây, ngủ trên xe. Phương Trang ~230.000₫, Kumho ~210.000₫.',
        textEn: 'Depart Mien Tay station and sleep on board. Around 210,000–230,000 VND.',
      },
      {
        dayVi: 'NGÀY 1',
        dayEn: 'Day 1',
        time: '06:00 – 11:00',
        titleVi: 'Tàu cao tốc ra đảo, nhận phòng',
        titleEn: 'Speedboat out, check in',
        textVi: 'Ăn sáng ở Rạch Giá, lên tàu 07:30. Cập bến Củ Tron 10:30 — xe resort đón sẵn. Gửi đồ, ăn trưa hải sản.',
        textEn: 'Breakfast in Rach Gia, boat at 07:30, ashore by 10:30 where our car is waiting.',
      },
      {
        dayVi: 'NGÀY 1',
        dayEn: 'Day 1',
        time: '13:00 – 17:30',
        titleVi: 'Tàu gỗ đi 3 đảo nhỏ',
        titleEn: 'Wooden boat, three islands',
        textVi: 'Hòn Dầu chụp rặng dừa → Hòn Mấu tắm Bãi Chướng → Hòn Hai Bờ Đập lặn san hô, chèo SUP, ăn cháo nhum nóng trên tàu.',
        textEn: 'Hon Dau for the palms, Hon Mau to swim, Hon Hai Bo Dap to snorkel and paddle.',
      },
      {
        dayVi: 'NGÀY 1',
        dayEn: 'Day 1',
        time: '18:30 – 21:30',
        titleVi: 'BBQ hải sản trên đồi',
        titleEn: 'Seafood BBQ on the hill',
        textVi: 'Ghẹ hấp, cá xương xanh nướng, nhum mỡ hành. Sau đó tự do dạo chợ đêm ngay dưới chân đồi.',
        textEn: 'Steamed crab, grilled needlefish, urchin with spring onion, then the night market below.',
      },
      {
        dayVi: 'NGÀY 2',
        dayEn: 'Day 2',
        time: '06:00 – 11:30',
        titleVi: 'Bình minh, rồi vòng quanh Hòn Lớn',
        titleEn: 'Sunrise, then the island loop',
        textVi: 'Cà phê trên sân hiên lúc mặt trời lên. Xe máy đi Miếu Bà Chúa Xứ, Ba Hòn Nồm, Bãi Ngự, Giếng Vua, tắm Bãi Cây Mến, ghé Dinh Ông.',
        textEn: 'Coffee on the terrace at sunrise, then the 11 km loop by scooter.',
      },
      {
        dayVi: 'NGÀY 2',
        dayEn: 'Day 2',
        time: '11:30 – 18:00',
        titleVi: 'Trả phòng và về bờ',
        titleEn: 'Check out and head back',
        textVi: 'Cơm trưa, mua khô cá xương xanh làm quà. Tàu 14:00 về Rạch Giá, 16:30 cập bến, lên xe về TP.HCM.',
        textEn: 'Lunch, buy dried fish, 14:00 boat, ashore 16:30, coach home.',
      },
    ],
    costs: [
      { labelVi: 'Xe khách khứ hồi TP.HCM – Rạch Giá', labelEn: 'Return coach HCMC – Rach Gia', val: '460 – 500K' },
      { labelVi: 'Tàu cao tốc khứ hồi', labelEn: 'Return speedboat', val: '450 – 500K' },
      { labelVi: 'Xe máy + tàu gỗ đi đảo', labelEn: 'Scooter + island boat', val: '250 – 350K' },
      { labelVi: 'Lưu trú', labelEn: 'Accommodation', val: '250 – 500K' },
      { labelVi: 'Ăn uống & tiệc BBQ', labelEn: 'Food and the BBQ', val: '600 – 800K' },
      { labelVi: 'Vé tham quan, dụng cụ lặn', labelEn: 'Entry fees, snorkel gear', val: '100 – 150K' },
    ],
    total: '2.110.000 – 2.800.000₫',
  },
  d3: {
    key: 'd3',
    nameVi: '3 ngày 2 đêm',
    nameEn: '3 days · 2 nights',
    legs: [
      {
        dayVi: 'ĐÊM 1',
        dayEn: 'Night 1',
        time: '23:00 – 06:00',
        titleVi: 'Xe giường nằm TP.HCM → Rạch Giá',
        titleEn: 'Overnight coach HCMC → Rach Gia',
        textVi: 'Ngủ trên xe, sáng có mặt ở cảng Rạch Giá.',
        textEn: 'Sleep on board, arrive at Rach Gia port in the morning.',
      },
      {
        dayVi: 'NGÀY 1',
        dayEn: 'Day 1',
        time: '06:30 – 11:00',
        titleVi: 'Ra đảo, nhận phòng, ăn trưa',
        titleEn: 'Out to the island, check in',
        textVi: 'Tàu cao tốc ra Nam Du, xe resort đón tại bến Củ Tron. Nhận phòng, cơm trưa hải sản.',
        textEn: 'Speedboat out, our car meets you at the pier, then a seafood lunch.',
      },
      {
        dayVi: 'NGÀY 1',
        dayEn: 'Day 1',
        time: '14:00 – 17:30',
        titleVi: 'Chinh phục Hòn Lớn',
        titleEn: 'The main island',
        textVi: 'Lên hải đăng 309 m ngắm toàn cảnh 21 đảo. Bãi Ngự, Giếng Vua, tắm Bãi Cây Mến, hoàng hôn ở Sunset Bar.',
        textEn: 'Up to the 309 m lighthouse, then Bai Ngu, the King’s Well, a swim at Cay Men and sunset at the bar.',
      },
      {
        dayVi: 'NGÀY 2',
        dayEn: 'Day 2',
        time: '08:00 – 17:00',
        titleVi: 'Trọn ngày trên tàu, bốn hòn đảo',
        titleEn: 'A full day at sea, four islands',
        textVi: '08:00 Hòn Mấu tắm Bãi Chướng · 10:30 Hòn Dầu rừng nguyên sinh · 12:00 Hòn Ngang ăn trưa trên bè nổi · 14:00 Hòn Hai Bờ Đập lặn san hô, chèo SUP, cháo nhum trên đường về.',
        textEn: 'Hon Mau, Hon Dau, lunch on a floating farm at Hon Ngang, then snorkelling at Hon Hai Bo Dap.',
      },
      {
        dayVi: 'NGÀY 2',
        dayEn: 'Day 2',
        time: '18:30 – 22:00',
        titleVi: 'BBQ ngoài trời & lửa trại',
        titleEn: 'Outdoor BBQ and a fire',
        textVi: 'Tiệc nướng hải sản trên đỉnh đồi, karaoke và lửa trại bên bờ biển.',
        textEn: 'Seafood on the grill up on the hill, karaoke, and a fire by the water.',
      },
      {
        dayVi: 'NGÀY 3',
        dayEn: 'Day 3',
        time: '06:00 – 11:00',
        titleVi: 'Bình minh và phần văn hoá',
        titleEn: 'Sunrise and the cultural half-day',
        textVi: 'Đón bình minh ở Bãi Sỏi. Viếng Dinh Ông xem bộ xương cá Ông, thắp nhang Miếu Bà. Ghé chợ Bãi Chệt mua khô hải sản.',
        textEn: 'Sunrise at Bai Soi, the whale shrine, then the market for dried seafood.',
      },
      {
        dayVi: 'NGÀY 3',
        dayEn: 'Day 3',
        time: '11:30 – 17:30',
        titleVi: 'Trả phòng và về bờ',
        titleEn: 'Check out and head back',
        textVi: 'Cơm trưa, trả phòng, 13:30 ra cảng. Tàu 14:00 về Rạch Giá, xe đón về TP.HCM.',
        textEn: 'Lunch, check out, 14:00 boat, coach home from Rach Gia.',
      },
    ],
    costs: [
      { labelVi: 'Xe khách khứ hồi TP.HCM – Rạch Giá', labelEn: 'Return coach HCMC – Rach Gia', val: '460 – 500K' },
      { labelVi: 'Tàu cao tốc khứ hồi', labelEn: 'Return speedboat', val: '450 – 500K' },
      { labelVi: 'Xe máy + tàu gỗ đi đảo', labelEn: 'Scooter + island boat', val: '350 – 450K' },
      { labelVi: 'Lưu trú 2 đêm', labelEn: 'Two nights’ accommodation', val: '500K – 1tr' },
      { labelVi: 'Ăn uống & tiệc BBQ', labelEn: 'Food and the BBQ', val: '900K – 1,3tr' },
      { labelVi: 'Vé tham quan, dụng cụ lặn', labelEn: 'Entry fees, snorkel gear', val: '150 – 250K' },
    ],
    total: '2.810.000 – 4.000.000₫',
  },
}
