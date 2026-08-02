export interface RoomReview {
  who: string
  score: string
  text: string
  textEn: string
}

export interface Room {
  code: string
  name: string
  nameEn: string
  area: number
  cap: number
  price: number
  exPrice: number
  view: string
  viewEn: string
  group: 'couple' | 'family' | 'suite'
  tag?: string
  tagEn?: string
  hot?: number
  darkTag?: boolean
  blurb?: string
  blurbEn?: string
  amenities?: Array<[string, string]>
  conditions?: string[]
  description?: string[]
  images: string[]
  reviews?: RoomReview[]
  shots?: number
}

export const ROOMS: Room[] = [
  {
    "code": "#01",
    "name": "Phòng gia đình nhìn ra biển",
    "nameEn": "Family Room with Sea View",
    "area": 28,
    "cap": 4,
    "price": 1886000,
    "exPrice": 450000,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "family",
    "blurb": "Mặc định 2 người. Phụ thu giường phụ 450.000đ/khách. Tối đa 4 người View nhìn ra biển",
    "blurbEn": "Mặc định 2 người. Phụ thu giường phụ 450.000đ/khách. Tối đa 4 người View nhìn ra biển",
    "amenities": [
      [
        "Phòng không hút thuốc",
        "Phòng không hút thuốc"
      ],
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, diện tích khoảng 28 m2, có trang bị tủ áo, bố trí 01 ghế hình trứng thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và nhìn từ trên đồi cao xuống thung lủng là một mảng xanh của hoa lá xung quanh tạo cho khách cảm giác thư giảng, thoải mái và rất gần gủi với thiên nhiên."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/1-full.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghep-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghep-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghep-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-6.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-8.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-9.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/1%20(4).jpg"
    ],
    "reviews": [],
    "shots": 13
  },
  {
    "code": "#08",
    "name": "Phòng gia đình view biển (08)",
    "nameEn": "Family Sea View, Mezzanine",
    "area": 40,
    "cap": 4,
    "price": 3088000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "family",
    "blurb": "Phòng 03 giường - 01 giường đôi & 02 giường đơn View nhìn ra biển",
    "blurbEn": "Phòng 03 giường - 01 giường đôi & 02 giường đơn View nhìn ra biển",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 bàn, truy cập wifi miễn phí, 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) , dép mang trong nhà. Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển, chợ đêm với nhiều ánh đèn lấp lánh đầy màu sắc."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/cover8.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/daidien1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/daidien2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-6.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-7.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-9.jpg"
    ],
    "reviews": [],
    "shots": 10
  },
  {
    "code": "#03-04",
    "name": "Phòng giường đôi có ban công nhìn ra biển",
    "nameEn": "Double Room, Balcony & Sea View",
    "area": 15,
    "cap": 2,
    "price": 1546000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "suite",
    "blurb": "1 giường đôi lớn, có ban công & Nhìn ra Biển",
    "blurbEn": "1 giường đôi lớn, có ban công & Nhìn ra Biển",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, diện tích khoảng 15 m2, có trang bị tủ áo, bố trí 01 ghế, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và bao quanh bởi mảng xanh của hoa lá xung quanh tạo cho khách cảm giác thư giảng, thoải mái và gần rủi với thiên nhiên."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/cover3_4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/dai-dien.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/ghepfull1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien6.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien5.jpg"
    ],
    "reviews": [],
    "shots": 8
  },
  {
    "code": "#05",
    "name": "Phòng tiêu chuẩn giường đôi (lục giác)",
    "nameEn": "Hexagon 360° Glass Room",
    "area": 18,
    "cap": 2,
    "price": 1546000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "couple",
    "tag": "KÍNH 360°",
    "tagEn": "360° GLASS",
    "hot": 1,
    "blurb": "Khối lục giác hai tầng bọc kính hoàn toàn. Nằm trên giường là thấy rừng, thấy vịnh, thấy trời — và về đêm thấy đèn chợ đêm Nam Du dưới chân đồi.",
    "blurbEn": "A two-storey hexagon wrapped entirely in glass. From the bed you see forest, bay and sky — and at night the lights of the Nam Du night market below.",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê ( túi lọc) miễn phí",
        "Trà, cà phê ( túi lọc) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng hình Lục giác được lắp đặt bởi khung kính, khách có thể nhìn cảnh thiên nhiên xung quanh ngay tại giường, diện tích khoảng 18 m2, gồm 01 trệt , 01 lầu, có trang bị tủ áo, phòng tắm , bàn lavabo bố trí riêng biệt, 01 phòng tắm và wc. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities), truy cập wiwi miễn phí."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/5-phong-tieu-chuan-luc-giac/full.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/5-phong-tieu-chuan-luc-giac/ghepfull.jpg"
    ],
    "reviews": [
      {
        "who": "Ngọc Anh · TP.HCM",
        "score": "9.4",
        "text": "Nằm trên giường ngắm được cả hoàng hôn lẫn đèn chợ đêm. Không cần đi đâu.",
        "textEn": "From the bed you catch both the sunset and the night-market lights. No need to go anywhere."
      }
    ],
    "shots": 2
  },
  {
    "code": "#06",
    "name": "Phòng Deluxe",
    "nameEn": "Deluxe with Sea & Pool View",
    "area": 20,
    "cap": 2,
    "price": 1776000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "couple",
    "blurb": "1 giường đôi lớn, Diện tích phòng: 20m2, View nhìn ra biển và hồ bơi",
    "blurbEn": "1 giường đôi lớn, Diện tích phòng: 20m2, View nhìn ra biển và hồ bơi",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ],
      [
        "Trà, cà phê( túi lọc ) miễn phí",
        "Trà, cà phê( túi lọc ) miễn phí"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công chung, diện tích sàn khoảng 20 m2, bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 ghế hình trứng, C 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) ,",
      "Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bàn lavabo, phòng tắm, wc bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom), wifi miễn phí. Ngoài ra phòng ở có cửa sổ rộng, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển và hồ bơi, đặt biệt mở cửa sổ là khách có thể ngắm bình minh từ phòng."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-11.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-12.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-13.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-14.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-15.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-16.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/p-6.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/p6.1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/p6.2.jpg"
    ],
    "reviews": [],
    "shots": 11
  },
  {
    "code": "#07",
    "name": "Phòng Superior có giường cỡ King",
    "nameEn": "Superior King with Jacuzzi",
    "area": 53,
    "cap": 4,
    "price": 2971000,
    "exPrice": 410000,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "family",
    "tag": "JACUZZI",
    "tagEn": "JACUZZI",
    "hot": 1,
    "blurb": "Rộng 53 m², bồn sục Jacuzzi riêng hướng thung lũng và bàn trang điểm gỗ mộc. Đây là phòng duy nhất đón được cả bình minh lẫn hoàng hôn mà không cần rời khỏi ban công.",
    "blurbEn": "53 m² with a private Jacuzzi facing the valley and a raw-wood dressing table. The one room that catches both sunrise and sunset without leaving the balcony.",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, diện tích sàn khoảng 53 m2, được bố trí 02 giường đơn, 01 giường đôi, có bàn trang điểm làm từ gổ mộc tinh tế, tủ áo, 01 jacozzi, 01 bàn lavabo bố trí riêng biệt, 01 phòng tắm, 01 wc, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) , truy cập wifi miễn phí. Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên. Phòng 02 hướng biển, hồ bơi. Ưu điểm đật biệt của vị trí phòng là ngắm đươc cả bình minh và hoàng hôn."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/dai-dien-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/daidien-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-6.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-7.jpg"
    ],
    "reviews": [
      {
        "who": "Minh Trí · Cần Thơ",
        "score": "9.5",
        "text": "Ngâm Jacuzzi lúc mặt trời lặn là thứ đáng tiền nhất chuyến đi.",
        "textEn": "Sitting in the Jacuzzi at sunset was the best value of the whole trip."
      }
    ],
    "shots": 8
  },
  {
    "code": "#02",
    "name": "Phòng giường đôi nhìn ra vườn",
    "nameEn": "Double Room with Garden View",
    "area": 24,
    "cap": 3,
    "price": 1546000,
    "exPrice": 410000,
    "view": "Hướng vườn",
    "viewEn": "Garden view",
    "group": "family",
    "blurb": "Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View nhìn ra vườn",
    "blurbEn": "Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View nhìn ra vườn",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Tra cà phê ( túi lọc) miễn phí",
        "Tra cà phê ( túi lọc) miễn phí"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có diện tích khoảng 24 m2, có trang bị tủ áo, bố trí 01 ghế hình trứng thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lớn giúp đón ánh sáng và khách cảm nhận không khí trong lành từ trên đồi cao khách sạn The Nam Du Hill"
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/2-phong-giuong-doi-nhin-ra-vuon/nhin-ra-vuon1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/2-phong-giuong-doi-nhin-ra-vuon/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/2-phong-giuong-doi-nhin-ra-vuon/nhin-ra-vuon2.jpg"
    ],
    "reviews": [],
    "shots": 3
  },
  {
    "code": "#09",
    "name": "Phòng gia đình view biển (09)",
    "nameEn": "Family Sea View, Mezzanine",
    "area": 40,
    "cap": 4,
    "price": 3088000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "family",
    "blurb": "Phòng 2 giường đôi lớn. View nhìn ra biển",
    "blurbEn": "Phòng 2 giường đôi lớn. View nhìn ra biển",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 bàn, truy cập wifi miễn phí, 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển, chợ đêm với nhiều ánh đèn lấp lánh đầy màu sắc."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/cover9.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.10.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.11.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.7.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.8.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.9.jpg"
    ],
    "reviews": [],
    "shots": 11
  },
  {
    "code": "#10",
    "name": "Phòng giường đôi có sân trong",
    "nameEn": "Double Room with Courtyard",
    "area": 20,
    "cap": 3,
    "price": 1776000,
    "exPrice": 410000,
    "view": "Hướng vườn",
    "viewEn": "Garden view",
    "group": "family",
    "blurb": "Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View Nhìn ra vườn",
    "blurbEn": "Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View Nhìn ra vườn",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Vòi sen",
        "Vòi sen"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ],
      [
        "Nhà vệ sinh",
        "Nhà vệ sinh"
      ],
      [
        "Dép",
        "Dép"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Giấy vệ sinh",
        "Giấy vệ sinh"
      ],
      [
        "Tủ lạnh",
        "Tủ lạnh"
      ],
      [
        "Ra trải giường",
        "Ra trải giường"
      ],
      [
        "Két an toàn",
        "Két an toàn"
      ],
      [
        "Sàn lát gạch/đá cẩm thạch",
        "Sàn lát gạch/đá cẩm thạch"
      ],
      [
        "Các tầng trên chỉ lên được bằng cầu thang",
        "Các tầng trên chỉ lên được bằng cầu thang"
      ],
      [
        "Ghế sofa",
        "Ghế sofa"
      ],
      [
        "Máy điều hòa độc lập cho từng phòng",
        "Máy điều hòa độc lập cho từng phòng"
      ],
      [
        "Quạt máy",
        "Quạt máy"
      ],
      [
        "Khăn tắm",
        "Khăn tắm"
      ],
      [
        "Tủ hoặc phòng để quần áo",
        "Tủ hoặc phòng để quần áo"
      ],
      [
        "Khu vực tiếp khách",
        "Khu vực tiếp khách"
      ],
      [
        "Ổ điện gần giường",
        "Ổ điện gần giường"
      ],
      [
        "Điều hòa không khí",
        "Điều hòa không khí"
      ],
      [
        "Máy pha trà/cà phê",
        "Máy pha trà/cà phê"
      ],
      [
        "Giá treo quần áo",
        "Giá treo quần áo"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng đôi này cung cấp đồ dùng vệ sinh cá nhân và áo choàng tắm miễn phí, có phòng tắm riêng với vòi sen, máy sấy tóc và dép đi trong nhà. Phòng đôi có sàn lát gạch, khu vực tiếp khách, máy điều hòa, máy pha trà và cà phê cũng như tầm nhìn ra khu vườn. Phòng có 1 giường."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/dai-dien.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-4.jpg"
    ],
    "reviews": [],
    "shots": 6
  },
  {
    "code": "#11",
    "name": "Phòng gia đình view biển",
    "nameEn": "Family Room, Direct Sea View",
    "area": 30,
    "cap": 4,
    "price": 3088000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "family",
    "blurb": "View nhìn ra biển - 02 giường đôi - Gia đình 4 khách",
    "blurbEn": "View nhìn ra biển - 02 giường đôi - Gia đình 4 khách",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, ghế sofa, diện tích khoảng 30 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và hướng phòng nhìn ra biển. Đặt biệt, khách có thể ngắm bình minh vào buổi sơm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ trực tiếp tại phòng của mình cảm giác thư giảng, thoải mái và rất gần rủi với thiên nhiên."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/cover11.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-11.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-12.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-9.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-8.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/p11.jpg"
    ],
    "reviews": [],
    "shots": 7
  },
  {
    "code": "#12",
    "name": "Phòng giường đôi có ban công",
    "nameEn": "Double Room with Balcony",
    "area": 19,
    "cap": 2,
    "price": 1862000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "couple",
    "blurb": "Diện tích phòng: 19m2, View Nhìn ra biển",
    "blurbEn": "Diện tích phòng: 19m2, View Nhìn ra biển",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Vòi sen",
        "Vòi sen"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ],
      [
        "Nhà vệ sinh",
        "Nhà vệ sinh"
      ],
      [
        "Dép",
        "Dép"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Giấy vệ sinh",
        "Giấy vệ sinh"
      ],
      [
        "Tủ lạnh",
        "Tủ lạnh"
      ],
      [
        "Ra trải giường",
        "Ra trải giường"
      ],
      [
        "Két an toàn",
        "Két an toàn"
      ],
      [
        "Sàn lát gạch/đá cẩm thạch",
        "Sàn lát gạch/đá cẩm thạch"
      ],
      [
        "Các tầng trên chỉ lên được bằng cầu thang",
        "Các tầng trên chỉ lên được bằng cầu thang"
      ],
      [
        "Ghế sofa",
        "Ghế sofa"
      ],
      [
        "Máy điều hòa độc lập cho từng phòng",
        "Máy điều hòa độc lập cho từng phòng"
      ],
      [
        "Quạt máy",
        "Quạt máy"
      ],
      [
        "Khăn tắm",
        "Khăn tắm"
      ],
      [
        "Tủ hoặc phòng để quần áo",
        "Tủ hoặc phòng để quần áo"
      ],
      [
        "Khu vực tiếp khách",
        "Khu vực tiếp khách"
      ],
      [
        "Ổ điện gần giường",
        "Ổ điện gần giường"
      ],
      [
        "Điều hòa không khí",
        "Điều hòa không khí"
      ],
      [
        "Máy pha trà/cà phê",
        "Máy pha trà/cà phê"
      ],
      [
        "Giá treo quần áo",
        "Giá treo quần áo"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng đôi này cung cấp đồ dùng vệ sinh cá nhân và áo choàng tắm miễn phí, có phòng tắm riêng với vòi sen, máy sấy tóc và dép đi trong nhà. Phòng đôi có sàn lát gạch, khu vực tiếp khách, máy điều hòa, máy pha trà và cà phê cũng như tầm nhìn ra khu vườn. Phòng có 1 giường."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/cover12.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ghepfull.jpg"
    ],
    "reviews": [],
    "shots": 7
  },
  {
    "code": "#13",
    "name": "Second Floor Family with Sea View",
    "nameEn": "Second Floor Family, Sea View",
    "area": 35,
    "cap": 4,
    "price": 3088000,
    "exPrice": 0,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "family",
    "blurb": "2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 35m2",
    "blurbEn": "2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 35m2",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, ghế sofa, diện tích khoảng 35 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và hướng phòng nhìn ra biển. Đặt biệt, khách có thể ngắm trực tiếp tại phòng của mình khi bình minh ló vạng vào buổi sớm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ như một bức tranh thủy mạc, tạo cho khách cảm giác thư giảng, thoải mái và rất an yên, trầm lăng."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/cover_13.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view9.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view7.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view8.jpg"
    ],
    "reviews": [],
    "shots": 8
  },
  {
    "code": "#14",
    "name": "Rock Deluxe Room",
    "nameEn": "Rock Deluxe — Cave Room",
    "area": 24,
    "cap": 2,
    "price": 1776000,
    "exPrice": 0,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "couple",
    "tag": "ĐỘC BẢN",
    "tagEn": "ONE OF A KIND",
    "hot": 2,
    "darkTag": true,
    "blurb": "Phòng duy nhất trên đảo giữ nguyên vách đá tự nhiên trong phòng ngủ. Giường đặt trên mỏm đá nguyên khối, phòng tắm nằm trong hang, và đêm xuống nghe rõ tiếng suối chảy ngay ngoài cửa.",
    "blurbEn": "The only room on the island that keeps its natural cliff face indoors. The bed sits on a single boulder, the bathroom is carved into the cave, and at night you hear the stream just outside.",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Tra cà phê ( túi lọc) miễn phí",
        "Tra cà phê ( túi lọc) miễn phí"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Đặt biệt phòng được thiết kế trong vách đá tự nhiên, chủ nhân cố tình giữ những tảng đá to thô cứng đễ tạo nên 01 căn phòng tinh tế , mát lạnh và gần gủi với thiên nhiên. Phòng có diện tích khoảng 24 m2, 01 giường đôi lớn được đặt trên mõm đá vững chắc, có kệ treo quần áo, bố trí 01 lòa sưởi kiểu Châu Âu, suối nước, phòng tắm , bàn lavabo, wc được bố trí trong hang đá tự nhiên, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lớn bắng khung gổ và kính trong suốt tạo điều kiện cho khách nằm ngay tại giường ngủ có thể ngắm cây cỏ, hoa lá tự nhiên xanh mượt nhấp nhơ dưới thung lũng hoặc thỉnh thoảng bắt gặp các chú mèo hoang nằm tắm nắng trên các tảng đá to, phẳng như mặt bàn giúp khách có kỳ nghỉ đáng nhớ tại đây."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/cover14.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/dai-dien.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-10.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-11.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-12.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-13.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-14.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-16.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-7.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-8.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-9.jpg"
    ],
    "reviews": [
      {
        "who": "Hoài Thu · Hà Nội",
        "score": "9.6",
        "text": "Phòng 14 không phải phòng trang trí theo chủ đề. Đó là vách đá thật trong phòng ngủ, đêm nghe rõ tiếng suối.",
        "textEn": "Room 14 is not a themed room. That is an actual cliff in the bedroom, and you can hear the stream at night."
      },
      {
        "who": "Đức Anh · Đà Nẵng",
        "score": "9.2",
        "text": "Ngủ trong hang đá nghe hơi lạ nhưng ấm và rất yên. Sáng dậy mở cửa là thấy vườn.",
        "textEn": "Sleeping in a cave sounds odd but it is warm and very quiet. You open the door onto the garden."
      }
    ],
    "shots": 13
  },
  {
    "code": "#15",
    "name": "Phòng giường đôi",
    "nameEn": "Standard Double Room",
    "area": 18,
    "cap": 2,
    "price": 1587000,
    "exPrice": 0,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "couple",
    "blurb": "1 giường đôi lớn, Diện tích 18 m2",
    "blurbEn": "1 giường đôi lớn, Diện tích 18 m2",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Tra cà phê ( túi lọc) miễn phí",
        "Tra cà phê ( túi lọc) miễn phí"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có diện tích khoảng 18 m2, có trang bị tủ áo, bố trí 01 ghế bật thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí tiện lợi, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lấy không khí từ bên ngoài, thoáng, trong lành ngay trên đồi cao của khách sạn The Nam Du Hill"
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/cover15.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.4.jpg"
    ],
    "reviews": [],
    "shots": 10
  },
  {
    "code": "#16",
    "name": "First Floor Family with Sea View",
    "nameEn": "First Floor Family, Sea View",
    "area": 31,
    "cap": 4,
    "price": 2987000,
    "exPrice": 0,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "family",
    "blurb": "2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 31m2",
    "blurbEn": "2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 31m2",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có diện tích khoảng 31 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên, hướng phòng nhìn ra biển/ rừng cây. Đặt biệt, phòng được trang trí bởi một bức tranh với chủ đề sóng biễn nhấp nhô cùng đàn cá được khắc từ gổ nhiều màu tạo cho khách cảm giác thư giảng và rất gần gủi với thiên nhiên."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/cover-16.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-3.jpg"
    ],
    "reviews": [],
    "shots": 4
  },
  {
    "code": "#17",
    "name": "Phòng 03 người - Hướng thung lũng/ biển",
    "nameEn": "Triple Room, Valley Side",
    "area": 26,
    "cap": 3,
    "price": 2411000,
    "exPrice": 0,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "family",
    "blurb": "Diện tích phòng: 26 m2, hướng nhìn ra biển/ thung lũng",
    "blurbEn": "Diện tích phòng: 26 m2, hướng nhìn ra biển/ thung lũng",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Trà, cà phê (túi lộc) miễn phí",
        "Trà, cà phê (túi lộc) miễn phí"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có diện tích khoảng 26 m2, có trang bị tủ áo, phòng tắm, wc, bàn lavabo bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn đón ánh sáng tự nhiên và thoáng mát, trong lành."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/cover-17.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-7.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-8.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-10.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-5.jpg"
    ],
    "reviews": [],
    "shots": 8
  },
  {
    "code": "#18",
    "name": "Phòng 03 người - Có ban công",
    "nameEn": "Triple Room with Balcony",
    "area": 32,
    "cap": 3,
    "price": 2411000,
    "exPrice": 0,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "family",
    "blurb": "Diện tích phòng: 32 m2 / Ban công rộng/ Hướng thung lũng/ Biển",
    "blurbEn": "Diện tích phòng: 32 m2 / Ban công rộng/ Hướng thung lũng/ Biển",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Trà, cà phê ( túi lọc) miễng phí",
        "Trà, cà phê ( túi lọc) miễng phí"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, sofa, ghế nằm ngoài trời, diện tích khoảng 32 m2, có trang bị tủ áo, phòng tắm , bàn lavabo, wc, bàn lavabo bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và nhìn từ trên đồi cao xuống thung lủng là một mảng rừng cây xanh hòa huyện cùng những bồn hoa trồng xung quanh tạo cho khách cảm giác thư giảng, thoải mái và rất gần gủi với thiên nhiên."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/cover-18.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-10.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-9.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ghepfull.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/p18.jpg"
    ],
    "reviews": [],
    "shots": 10
  },
  {
    "code": "#08-09",
    "name": "Suite 02 phòng ngủ (08 khách)",
    "nameEn": "Two-Bedroom Suite for 8",
    "area": 70,
    "cap": 8,
    "price": 5662000,
    "exPrice": 0,
    "view": "Hướng thung lũng / biển",
    "viewEn": "Valley & sea view",
    "group": "suite",
    "tag": "LỚN NHẤT",
    "tagEn": "LARGEST",
    "hot": 1,
    "blurb": "Hai phòng ngủ gác lửng thông nhau, 70 m² cho tám người. Phù hợp cho gia đình nhiều thế hệ hoặc nhóm bạn muốn ở chung mà vẫn có không gian riêng.",
    "blurbEn": "Two connected mezzanine bedrooms, 70 m² for eight. Right for multi-generation families or groups who want to stay together but keep some privacy.",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, diện tích sàn khoảng 70 m2, bố trí 02 phòng ngủ riêng biệt, mỗi phòng có 01 tầng trệt và 01 tầng lửng, tầng trệt đặt 02 giường đơn , tầng lửng được bố trí 01 giường đôi cực lớn, 02 tủ áo, 02 bàn, 04 wc và bàn lavabo được bố trí khu riêng biệt, 04 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ, thoáng mát, đón ánh sáng tự nhiên, không khí rất trong lành, tầm nhìn hướng biển, trung tâm đảo, chợ đêm."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/cover-809.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-5.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/p89.1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/p89.3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/p89.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-10.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-11.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-12.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-14.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-15.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-16.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-17.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-18.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-20.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-21.jpg"
    ],
    "reviews": [
      {
        "who": "Gia đình Bảo Long · Rạch Giá",
        "score": "9.0",
        "text": "Nhà tôi 8 người ở vừa đủ, không phải thuê 3 phòng rời.",
        "textEn": "Eight of us fitted comfortably instead of renting three separate rooms."
      }
    ],
    "shots": 16
  },
  {
    "code": "#10-11",
    "name": "Suite 02 phòng ngủ (06 khách)",
    "nameEn": "Two-Bedroom Suite for 6",
    "area": 50,
    "cap": 6,
    "price": 4287000,
    "exPrice": 0,
    "view": "Hướng biển",
    "viewEn": "Sea view",
    "group": "suite",
    "blurb": "Gồm 02 phòng ngủ, 3 giường đôi /view biển",
    "blurbEn": "Gồm 02 phòng ngủ, 3 giường đôi /view biển",
    "amenities": [
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Phòng có ban công riêng, ghế sofa, diện tích khoảng 50 m2, 02 phòng ngủ ,phòng 01 bố trí 02 giường đôi, phòng 02 bố trí 01 giường đôi lớn. Gồm 02 tủ áo, 02 ghế trứng mỹ thuật, 02 wc,02 bàn lavabo được bố trí khu riêng biệt, 02 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ trực diện hướng biển giúp phòng thông thoáng, mát, lấy ánh sáng tự nhiên. Ưu điểm của phòng này là ôm trọn hướng biển, khách có thể ngắm bình minh vào buổi sớm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ trực tiếp tại phòng của mình cảm giác thư giảng, thoải mái và rất gần rủi với thiên nhiên."
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/10-11-suite-6-khach/cover.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/dai-dien.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-12.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-11.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/10-11-suite-6-khach/p10_11.1.jpg"
    ],
    "reviews": [],
    "shots": 8
  },
  {
    "code": "#15-16",
    "name": "Suite 02 phòng ngủ (06 khách)",
    "nameEn": "Two-Bedroom Suite for 6",
    "area": 50,
    "cap": 6,
    "price": 4287000,
    "exPrice": 0,
    "view": "Hướng vườn",
    "viewEn": "Garden view",
    "group": "suite",
    "blurb": "Gồm 03 giường đôi - 02 phòng phòng ngủ / view vườn",
    "blurbEn": "Gồm 03 giường đôi - 02 phòng phòng ngủ / view vườn",
    "amenities": [
      [
        "Truy cập wifi miễn phí",
        "Truy cập wifi miễn phí"
      ],
      [
        "Đồ vệ sinh cá nhân miễn phí",
        "Đồ vệ sinh cá nhân miễn phí"
      ],
      [
        "Sử dụng hồ bơi và bida",
        "Sử dụng hồ bơi và bida"
      ],
      [
        "Có máy điều hòa",
        "Có máy điều hòa"
      ],
      [
        "Trang bị két sắt an toàn",
        "Trang bị két sắt an toàn"
      ],
      [
        "Mini bar( có tính phí)",
        "Mini bar( có tính phí)"
      ],
      [
        "Dép mang trong nhà",
        "Dép mang trong nhà"
      ],
      [
        "Ấm đun nước",
        "Ấm đun nước"
      ],
      [
        "Trà, cà phê(túi lọc ) miễn phí",
        "Trà, cà phê(túi lọc ) miễn phí"
      ],
      [
        "Máy sấy tóc",
        "Máy sấy tóc"
      ],
      [
        "Áo choàng tắm",
        "Áo choàng tắm"
      ]
    ],
    "conditions": [
      "Không hút thuốc"
    ],
    "description": [
      "Diện tích phòng khoảng 50 m2, được bố trí 02 phòng ngủ. Phòng 01 bố trí 02 giường đôi, phòng 02 bố trí 01 giường đôi lớn. Gồm 02 tủ áo, 01 ghế trứng mỹ thuật và 01 ghế bập bênh, 02 wc, 02 bàn lavabo được bố trí riêng, 02 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ hướng biển giúp phòng thông thoáng, mát và lấy ánh sáng tự nhiên"
    ],
    "images": [
      "https://thenamduhill.com/image/catalog/room-suite/15-16-suite-6-khach/cover-15-16.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-3.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-4.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-1.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-2.jpg",
      "https://thenamduhill.com/image/catalog/room-suite/15-16-suite-6-khach/p15_161.jpg"
    ],
    "reviews": [],
    "shots": 7
  }
]

export const BASE_AMENITIES: Array<[string, string]> = [
  ['Phòng tắm riêng', 'Private bathroom'],
  ['Két an toàn', 'In-room safe'],
  ['Ấm đun nước', 'Electric kettle'],
  ['Wi-Fi miễn phí', 'Free Wi-Fi'],
  ['Ga trải giường & khăn tắm', 'Linen & towels'],
  ['Đưa đón bến tàu miễn phí', 'Free pier transfer'],
]

export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫'
}

export function roomSlug(code: string): string {
  return 'ndh-room-' + code.replace(/[#]/g, '').replace(/-/g, '_')
}
