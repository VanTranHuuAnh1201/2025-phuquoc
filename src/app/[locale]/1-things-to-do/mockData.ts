export interface ThingItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  rating: number;
  reviews: number;
  bookings?: string;
  price: number;
  originalPrice?: number;
  image: string;
  badges?: string[];
  tags: string[]; // slugs for filtering
  availableDates?: string[]; // ISO dates 'YYYY-MM-DD'
}

export const CATEGORIES: { slug: string; name: string }[] = [
  { slug: 'cong-vien-giai-tri', name: 'Công viên giải trí' },
  { slug: 'bao-tang', name: 'Bảo tàng' },
  { slug: 'so-thu-thuy-cung', name: 'Sở thú & Thủy cung' },
  { slug: 'cap-treo', name: 'Cáp treo' },
  { slug: 'khu-vui-choi', name: 'Khu vui chơi' },
  { slug: 've-tham-quan', name: 'Vé tham quan' },
  { slug: 'tour-di-thuyen', name: 'Tour đi thuyền' },
  { slug: 'tour-nhieu-ngay', name: 'Tour nhiều ngày' },
  { slug: 'tour-mua-sam', name: 'Tour mua sắm' },
  { slug: 'tour-am-thuc', name: 'Tour ẩm thực' },
  { slug: 'tour-trong-ngay', name: 'Tour trong ngày' },
  { slug: 'du-thuyen-ngam-canh', name: 'Du thuyền ngắm cảnh' },
  { slug: 'spa-massage', name: 'Spa & Massage' },
  { slug: 'lan-ong-tho-lan-binh', name: 'Lặn ống thở & Lặn bình dưỡng khí' },
  { slug: 'thue-thuyen', name: 'Thuê thuyền' },
  { slug: 've-bai-bien-resort', name: 'Vé bãi biển/resort' },
  { slug: 'cam-trai', name: 'Cắm trại' },
  { slug: 'workshop', name: 'Workshop' },
  { slug: 'salon-lam-dep', name: 'Salon & Làm đẹp' }
];

export const thingsMock: ThingItem[] = [
  {
    id: 1,
    title: 'Vé Sun World Hòn Thơm',
    subtitle: 'Cáp treo • Phú Quốc',
    category: 'Cáp treo',
    rating: 4.7,
    reviews: 5173,
    bookings: '200K+',
    price: 590000,
    originalPrice: 1300000,
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=1200',
    badges: ['Xác nhận tức thời'],
    tags: ['cap-treo', 'cong-vien-giai-tri'],
    availableDates: []
  },
  {
    id: 2,
    title: 'Vé VinWonders Phú Quốc',
    subtitle: 'Công viên giải trí • Phú Quốc',
    category: 'Công viên giải trí',
    rating: 4.6,
    reviews: 3952,
    bookings: '100K+',
    price: 940000,
    originalPrice: 950000,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1200',
    badges: ['Đặt trước cho ngày mai', 'Xác nhận tức thời'],
    tags: ['cong-vien-giai-tri', 've-tham-quan'],
    availableDates: []
  },
  {
    id: 3,
    title: 'Vé Vinpearl Safari Phú Quốc',
    subtitle: 'Sở thú & Thủy cung • Phú Quốc',
    category: 'Sở thú & Thủy cung',
    rating: 4.7,
    reviews: 3244,
    bookings: '100K+',
    price: 660000,
    image: 'https://images.unsplash.com/photo-1585391805862-3c2a8d7d436a?q=80&w=1200',
    badges: ['Đặt trước cho ngày mai', 'Xác nhận tức thời'],
    tags: ['so-thu-thuy-cung', 've-tham-quan'],
    availableDates: []
  },
  {
    id: 4,
    title: 'Grand World Phú Quốc - Vé Các Show & Điểm Tham Quan',
    subtitle: 'Bảo tàng • Phú Quốc',
    category: 'Bảo tàng',
    rating: 4.5,
    reviews: 1260,
    price: 200000,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200',
    badges: ['Xác nhận tức thời'],
    tags: ['bao-tang', 've-tham-quan'],
    availableDates: []
  },
  {
    id: 5,
    title: 'Tour 3 đảo - Lặn ngắm san hô',
    subtitle: 'Tour đi thuyền • Phú Quốc',
    category: 'Tour đi thuyền',
    rating: 4.8,
    reviews: 2310,
    price: 950000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    badges: ['Đón tại khách sạn'],
    tags: ['tour-di-thuyen', 'tour-trong-ngay', 'lan-ong-tho-lan-binh'],
    availableDates: []
  },
  {
    id: 6,
    title: 'Massage thư giãn 60 phút',
    subtitle: 'Spa & Massage • Phú Quốc',
    category: 'Spa & Massage',
    rating: 4.4,
    reviews: 580,
    price: 350000,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200',
    badges: ['Xác nhận tức thời'],
    tags: ['spa-massage'],
    availableDates: []
  },
  {
    id: 7,
    title: 'Lặn bình dưỡng khí ở Nam đảo',
    subtitle: 'Lặn ống thở & Lặn bình dưỡng khí • Phú Quốc',
    category: 'Lặn ống thở & Lặn bình dưỡng khí',
    rating: 4.6,
    reviews: 742,
    price: 1600000,
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200',
    badges: ['Hướng dẫn viên chuyên nghiệp'],
    tags: ['lan-ong-tho-lan-binh', 'tour-di-thuyen'],
    availableDates: []
  },
  {
    id: 8,
    title: 'Khu vui chơi trẻ em Grand World',
    subtitle: 'Khu vui chơi • Phú Quốc',
    category: 'Khu vui chơi',
    rating: 4.3,
    reviews: 310,
    price: 120000,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200',
    badges: ['Phù hợp gia đình'],
    tags: ['khu-vui-choi', 've-tham-quan'],
    availableDates: []
  },
  {
    id: 9,
    title: 'Vé tham quan Vườn tiêu',
    subtitle: 'Vé tham quan • Phú Quốc',
    category: 'Vé tham quan',
    rating: 4.2,
    reviews: 190,
    price: 100000,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    badges: ['Hướng dẫn tại chỗ'],
    tags: ['ve-tham-quan'],
    availableDates: []
  },
  {
    id: 10,
    title: 'Cáp treo + Công viên nước combo',
    subtitle: 'Combo • Phú Quốc',
    category: 'Công viên giải trí',
    rating: 4.6,
    reviews: 820,
    price: 1450000,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f5?q=80&w=1200',
    badges: ['Tiết kiệm'],
    tags: ['cap-treo', 'cong-vien-giai-tri'],
    availableDates: []
  },
  {
    id: 11,
    title: 'Tour trong ngày check-in Bắc đảo',
    subtitle: 'Tour trong ngày • Phú Quốc',
    category: 'Tour trong ngày',
    rating: 4.5,
    reviews: 430,
    price: 890000,
    image: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1200',
    badges: ['Đưa đón tận nơi'],
    tags: ['tour-trong-ngay'],
    availableDates: []
  },
  {
    id: 12,
    title: 'Bảo tàng Gấu Teddy - Grand World',
    subtitle: 'Bảo tàng • Phú Quốc',
    category: 'Bảo tàng',
    rating: 4.1,
    reviews: 1020,
    price: 180000,
    image: 'https://images.unsplash.com/photo-1535319833720-2885f0bf89c8?q=80&w=1200',
    badges: [],
    tags: ['bao-tang', 'khu-vui-choi'],
    availableDates: []
  },
  {
    id: 13,
    title: 'Tour 4 Đảo bao gồm Công viên nước Aquatopia',
    subtitle: 'Tour đi thuyền • Phú Quốc',
    category: 'Tour đi thuyền',
    rating: 4.3,
    reviews: 507,
    bookings: '10K+',
    price: 1436000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    badges: ['Đón tại khách sạn', 'Hướng dẫn tiếng Việt', 'Miễn phí hủy'],
    tags: ['tour-di-thuyen', 'tour-trong-ngay'],
    availableDates: []
  },
  {
    id: 14,
    title: 'PhoGroup Pass Phú Quốc',
    subtitle: 'Vé tham quan • Phú Quốc',
    category: 'Vé tham quan',
    rating: 4.4,
    reviews: 506,
    bookings: '20K+',
    price: 1609000,
    originalPrice: 1700000,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200',
    badges: ['Miễn phí hủy', 'PhoGroup độc quyền'],
    tags: ['ve-tham-quan'],
    availableDates: []
  },
  {
    id: 15,
    title: 'Show Kiss of the Sea Phú Quốc',
    subtitle: 'Sự kiện & Show diễn • Phú Quốc',
    category: 'Sự kiện & Show diễn',
    rating: 4.6,
    reviews: 612,
    bookings: '30K+',
    price: 637200,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200',
    badges: ['Xác nhận tức thời'],
    tags: ['ve-tham-quan', 'tour-trong-ngay'],
    availableDates: []
  },
  {
    id: 16,
    title: 'Trải nghiệm La Spa & Massage',
    subtitle: 'Spa & Massage • Phú Quốc',
    category: 'Spa & Massage',
    rating: 4.9,
    reviews: 70,
    bookings: '800+',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200',
    badges: ['Đặt lịch trên ứng dụng', 'Miễn phí hủy'],
    tags: ['spa-massage'],
    availableDates: []
  },
  {
    id: 17,
    title: 'Vé Sunset Sanato Beach Club',
    subtitle: 'Vé bãi biển/resort • Phú Quốc',
    category: 'Vé bãi biển/resort',
    rating: 4.4,
    reviews: 301,
    bookings: '10K+',
    price: 97500,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    badges: ['Đặt trước cho ngày mai', 'Hướng dẫn tiếng Việt'],
    tags: ['ve-bai-bien-resort'],
    availableDates: []
  },
  {
    id: 18,
    title: 'Tour lặn biển nhóm nhỏ bằng tàu cao tốc',
    subtitle: 'Lặn ống thở & Lặn bình dưỡng khí • Phú Quốc',
    category: 'Lặn ống thở & Lặn bình dưỡng khí',
    rating: 5.0,
    reviews: 659,
    bookings: '10K+',
    price: 1300000,
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1200',
    badges: ['Đón tại khách sạn', 'Nhóm nhỏ', 'Hướng dẫn tiếng Việt'],
    tags: ['lan-ong-tho-lan-binh', 'tour-di-thuyen'],
    availableDates: []
  },
  {
    id: 19,
    title: 'Vé Công viên Ice Jungle Phú Quốc',
    subtitle: 'Khu vui chơi • Phú Quốc',
    category: 'Khu vui chơi',
    rating: 4.4,
    reviews: 78,
    bookings: '1K+',
    price: 190000,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200',
    badges: ['Đặt trước cho ngày mai'],
    tags: ['khu-vui-choi', 've-tham-quan'],
    availableDates: []
  },
  {
    id: 20,
    title: 'Tour câu cá và lặn trong ngày',
    subtitle: 'Hoạt động dưới nước • Phú Quốc',
    category: 'Hoạt động dưới nước',
    rating: 4.6,
    reviews: 122,
    bookings: '3K+',
    price: 625000,
    image: 'https://images.unsplash.com/photo-1445906442117-16d991f2e3de?q=80&w=1200',
    badges: ['Hướng dẫn tiếng Việt', 'Khởi hành buổi sáng'],
    tags: ['lan-ong-tho-lan-binh', 'tour-trong-ngay'],
    availableDates: []
  }
];
