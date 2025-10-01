const activities = [
    {
        "id": 1,
        "title": "Vé Sun World Hon Thom",
        "subtitle": "Cáp treo • Phú Quốc",
        "rating": "4.7",
        "reviews": "5,177",
        "bookings": "200K+",
        "price": "590,000",
        "originalPrice": "1,300,000",
        "badges": ["Xác nhận tức thời"],
        "category": "Cáp treo",
        "image": "/images/1.webp"
    },
    {
        "id": 2,
        "title": "Vé VinWonders Phú Quốc",
        "subtitle": "Công viên giải trí • Phú Quốc",
        "rating": "4.6",
        "reviews": "3,954",
        "bookings": "100K+",
        "price": "950,000",
        "originalPrice": null,
        "badges": ["Đặt ngay hôm nay", "Xác nhận tức thời"],
        "category": "Công viên giải trí",
        "image": "/images/2.webp"
    },
    {
        "id": 3,
        "title": "Vé Vinpearl Safari Phú Quốc",
        "subtitle": "Sở thú & Thủy cung • Phú Quốc",
        "rating": "4.6",
        "reviews": "3,246",
        "bookings": "100K+",
        "price": "660,000",
        "originalPrice": null,
        "badges": ["Đặt ngay hôm nay", "Xác nhận tức thời"],
        "category": "Sở thú & Thủy cung",
        "image": "/images/3.webp"
    },
    {
        "id": 4,
        "title": "Vé Show Kiss of the Sea Phú Quốc",
        "subtitle": "Sự kiện & Show diễn • Phú Quốc",
        "rating": "4.6",
        "reviews": "612",
        "bookings": "30K+",
        "price": "637,200",
        "originalPrice": "1,300,000",
        "badges": ["Xác nhận tức thời"],
        "category": "Sự kiện & Show diễn",
        "image": "/images/4.webp"
    },
    {
        "id": 5,
        "title": "Grand World Phú Quốc - Vé Các Show Diễn và Điểm Tham Quan",
        "subtitle": "Bảo tàng • Phú Quốc",
        "rating": "4.5",
        "reviews": "1,265",
        "bookings": "50K+",
        "price": "200,000",
        "originalPrice": null,
        "badges": ["Đặt ngay hôm nay", "Xác nhận tức thời"],
        "category": "Bảo tàng",
        "image": "/images/5.webp"
    },
    {
        "id": 6,
        "title": "Tour 4 Đảo Phú Quốc Bao Gồm Công Viên Nước Aquatopia và...",
        "subtitle": "Tour • Phú Quốc",
        "rating": "4.3",
        "reviews": "506",
        "bookings": "10K+",
        "price": "1,436,000",
        "originalPrice": null,
        "badges": ["Đón tại khách sạn"],
        "category": "Tour",
        "image": "/images/6.webp"
    },
    {
        "id": 7,
        "title": "Tour 3 Đảo Tham Quan Hòn Bườm, Hòn Gầm Ghì Và Hòn...",
        "subtitle": "Tour • Phú Quốc",
        "rating": "4.3",
        "reviews": "904",
        "bookings": "20K+",
        "price": "585,900",
        "originalPrice": null,
        "badges": ["Đón tại khách sạn"],
        "category": "Tour",
        "image": "/images/7.webp"
    },
    {
        "id": 8,
        "title": "Trải Nghiệm Spa Tắm Bùn Versailles ở Phú Quốc",
        "subtitle": "Massages • Phú Quốc",
        "rating": "4.5",
        "reviews": "215",
        "bookings": "10K+",
        "price": "559,725",
        "originalPrice": null,
        "badges": ["Đặt ngay hôm nay", "Miễn phí huỷ"],
        "category": "Massages",
        "image": "/images/8.webp"
    },
    {
        "id": 9,
        "title": "PhoGroup Pass Phú Quốc",
        "subtitle": "Vé tham quan • Phú Quốc",
        "rating": "4.4",
        "reviews": "506",
        "bookings": "20K+",
        "price": "1,609,000",
        "originalPrice": "1,700,000",
        "badges": ["Miễn phí huỷ", "Xác nhận tức thời"],
        "category": "Vé tham quan",
        "image": "/images/9.webp"
    },
    {
        "id": 10,
        "title": "Tour Lặn Biển Nhóm Nhỏ Tại Phú Quốc Bằng Tàu Cao Tốc...",
        "subtitle": "Tour • Phú Quốc",
        "rating": "5.0",
        "reviews": "659",
        "bookings": "10K+",
        "price": "1,300,000",
        "originalPrice": null,
        "badges": ["Đón tại khách sạn", "Nhóm nhỏ"],
        "category": "Tour",
        "image": "/images/10.webp"
    },
    {
        "id": 11,
        "title": "Tour Tham Quan 3 Đảo Phú Quốc Trong Ngày Bằng Tàu Ca...",
        "subtitle": "Tour • Phú Quốc",
        "rating": "4.2",
        "reviews": "608",
        "bookings": "10K+",
        "price": "620,000",
        "originalPrice": null,
        "badges": ["Đón tại khách sạn"],
        "category": "Tour",
        "image": "/images/11.webp"
    },
    {
        "id": 12,
        "title": "Tour Trong Ngày Câu Cá và Lặn ở Phú Quốc",
        "subtitle": "Hoạt động dưới nước • Phú Quốc",
        "rating": "4.5",
        "reviews": "123",
        "bookings": "3K+",
        "price": "625,000",
        "originalPrice": null,
        "badges": ["Đặt trước cho ngày mai"],
        "category": "Hoạt động dưới nước",
        "image": "/images/12.webp"
    }
]


const destinations = [
    {
        "id": 1,
        "title": "Bãi Sao",
        "description": "Bãi Sao Phú Quốc được xếp vào Top 10 bãi biển hoang sơ và yên bình nhất trên thế giới.",
        "category": "Địa điểm du lịch",
        "rating": "4.9",
        "reviews": "6K+",
        "images": "/images/diemthamquan-1.webp"
    },
    {
        "id": 2,
        "title": "Grand World Phú Quốc",
        "description": "Grand World Phú Quốc là một khu vui chơi và mua sắm sầm uất nằm ở trung tâm của...",
        "category": "Cảnh quan du lịch",
        "rating": "4.8",
        "reviews": "12K+",
        "images": "/images/diemthamquan-2.webp"
    },
    {
        "id": 3,
        "title": "Vinpearl Safari Phú Quốc",
        "description": "Bắt đầu cuộc phiêu lưu hoang dã tại Vinpearl Safari ở Phú Quốc, công viên safari lớn nhất...",
        "category": "Cảnh quan du lịch",
        "rating": "4.8",
        "reviews": "11K+",
        "images": "/images/diemthamquan-3.webp"
    },
    {
        "id": 4,
        "title": "Hòn Thơm",
        "description": "Đảo Hòn Thơm, còn được biết đến với tên gọi hòn thơm, là một hòn đảo tuyệt đẹp ở...",
        "category": "Cảnh quan du lịch",
        "rating": "4.7",
        "reviews": "800+",
        "images": "/images/diemthamquan-4.webp"
    },
    {
        "id": 5,
        "title": "Dương Đông Phú Quốc",
        "description": "Chào mừng bạn đến với thị trấn Dương Đông ở Phú Quốc, một thủ đô sôi động và...",
        "category": "Cảnh quan du lịch",
        "rating": "4.8",
        "reviews": "9K+",
        "images": "/images/diemthamquan-5.webp"
    },
    {
        "id": 6,
        "title": "Vườn Tiêu Phú Quốc",
        "description": "Bắt đầu hành trình đầy hương vị đến Phú Quốc, một hòn đảo nổi tiếng với các trang...",
        "category": "Cảnh quan du lịch",
        "rating": "4.8",
        "reviews": "4K+",
        "images": "/images/diemthamquan-6.webp"
    },
    {
        "id": 7,
        "title": "Nhà tù Phú Quốc",
        "description": "Khu di tích nhà tù phú quốc là một bảo tàng sống động về lịch sử của Phú Quốc trong q...",
        "category": "Bảo tàng",
        "rating": "4.9",
        "reviews": "5K+",
        "images": "/images/diemthamquan-7.webp"
    },
    {
        "id": 8,
        "title": "Bãi Khem",
        "description": "Bãi Khem ở Phú Quốc là một viên ngọc ẩn chưa đợi để được khám phá bởi những du...",
        "category": "Bãi biển",
        "rating": "4.9",
        "reviews": "6K+",
        "images": "/images/diemthamquan-8.webp"
    }

]
export { activities, destinations };

