/**
 * Seed data — The Nam Du Hill Resort (https://thenamduhill.com)
 *
 * Crawl tự động ngày 02/08/2026 từ 14 trang (home, rooms-suites, room-list,
 * winning-dinning, experiences-feel, events, news-list, gallery, contact và
 * 5 trang chính sách) cùng 13 bài viết con — tổng 27 trang.
 * Sinh bởi: scripts/crawl/crawl-pages.mjs -> build-seed.mjs -> emit-ts.mjs
 *
 * Toàn bộ URL ảnh đã được kiểm tra trả về HTTP 200 và trỏ tới bản gốc full-size
 * (đã bỏ /cache/ và hậu tố -WxH).
 *
 * ---------------------------------------------------------------------------
 * LƯU Ý BẢN QUYỀN
 * Đây là dữ liệu và hình ảnh của The Nam Du Hill Resort — một cơ sở lưu trú
 * khác. Dùng làm mẫu cấu trúc để dựng UI ở môi trường dev thì được; đưa lên
 * production, hotlink ảnh hoặc tải ảnh về dùng cho khách sạn của bạn là vi phạm
 * bản quyền. Trước khi lên production hãy thay toàn bộ bằng nội dung của bạn.
 * ---------------------------------------------------------------------------
 */

export interface SeedRoomType {
    id: string;
    name: string;
    roomNumber: string;
    description: string;
    size: string;
    capacity: number;
    price: number;
    /** Phụ thu mỗi khách/giường phụ, 0 nếu không áp dụng. */
    extraBedFee: number;
    view: string;
    hasBalcony: boolean;
    images: string[];
    availability: boolean;
}

export interface SeedArticle {
    title: string;
    url: string;
}

export const hotelInfo = {
    id: "namdu-hill",
    name: "The Nam Du Hill Resort",
    location: "Nam Du, Kiên Hải, An Giang",
    address: "Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam",
    phone: "0985 000 650",
    email: "thenamduhill@gmail.com",
    taxId: "1702244746",
};

/** 20 loại phòng, giá VND/đêm. */
export const roomTypes: SeedRoomType[] = [
    {
        id: "phong-gia-dinh-nhin-ra-bien-01",
        name: "Phòng gia đình nhìn ra biển",
        roomNumber: "01",
        description: "Mặc định 2 người. Phụ thu giường phụ 450.000đ/khách. Tối đa 4 người View nhìn ra biển",
        size: "",
        capacity: 4,
        price: 1886000,
        extraBedFee: 450000,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/1-full.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-gia-dinh-view-bien-08-08",
        name: "Phòng gia đình view biển (08)",
        roomNumber: "08",
        description: "Phòng 03 giường - 01 giường đôi & 02 giường đơn View nhìn ra biển",
        size: "",
        capacity: 4,
        price: 3088000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/cover8.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04",
        name: "Phòng giường đôi có ban công nhìn ra biển",
        roomNumber: "03-04",
        description: "1 giường đôi lớn, có ban công & Nhìn ra Biển",
        size: "",
        capacity: 2,
        price: 1546000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: true,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/cover3_4.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-tieu-chuan-giuong-doi-luc-giac-05",
        name: "Phòng tiêu chuẩn giường đôi (lục giác)",
        roomNumber: "05",
        description: "1 giường đôi lớn, 21m2, View nhìn ra biển",
        size: "21m²",
        capacity: 2,
        price: 1546000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/5-phong-tieu-chuan-luc-giac/full.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-deluxe-06",
        name: "Phòng Deluxe",
        roomNumber: "06",
        description: "1 giường đôi lớn, Diện tích phòng: 20m2, View nhìn ra  biển và hồ bơi",
        size: "20m²",
        capacity: 2,
        price: 1776000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-superior-co-giuong-co-king-07",
        name: "Phòng Superior có giường cỡ King",
        roomNumber: "07",
        description: "Diện tích 53m2, Mặc định 2 người. Phụ thu 410.000đ/người. Tối đa 4 người",
        size: "53m²",
        capacity: 4,
        price: 2971000,
        extraBedFee: 410000,
        view: "",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/dai-dien-2.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-giuong-doi-nhin-ra-vuon-02",
        name: "Phòng giường đôi nhìn ra vườn",
        roomNumber: "02",
        description: "Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View nhìn ra vườn",
        size: "",
        capacity: 3,
        price: 1546000,
        extraBedFee: 410000,
        view: "Hướng vườn",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/2-phong-giuong-doi-nhin-ra-vuon/nhin-ra-vuon1.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-gia-dinh-view-bien-09-09",
        name: "Phòng gia đình view biển (09)",
        roomNumber: "09",
        description: "Phòng 2 giường đôi lớn. View nhìn ra biển",
        size: "",
        capacity: 4,
        price: 3088000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/cover9.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-giuong-doi-co-san-trong-10",
        name: "Phòng giường đôi có sân trong",
        roomNumber: "10",
        description: "Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View Nhìn ra vườn",
        size: "",
        capacity: 3,
        price: 1776000,
        extraBedFee: 410000,
        view: "Hướng vườn",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/dai-dien.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-gia-dinh-view-bien-11",
        name: "Phòng gia đình view biển",
        roomNumber: "11",
        description: "View nhìn ra biển - 02 giường đôi - Gia đình 4 khách",
        size: "",
        capacity: 4,
        price: 3088000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/cover11.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-giuong-doi-co-ban-cong-12",
        name: "Phòng giường đôi có ban công",
        roomNumber: "12",
        description: "Diện tích phòng: 19m2, View Nhìn ra biển",
        size: "19m²",
        capacity: 2,
        price: 1862000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/cover12.jpg",
        ],
        availability: true,
    },
    {
        id: "second-floor-family-with-sea-view-13",
        name: "Second Floor Family with Sea View",
        roomNumber: "13",
        description: "2 giường đôi - 01 giường đôi trung  và 1 giường đôi lớn. Diện tích 35m2",
        size: "35m²",
        capacity: 4,
        price: 3088000,
        extraBedFee: 0,
        view: "",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/cover_13.jpg",
        ],
        availability: true,
    },
    {
        id: "rock-deluxe-room-14",
        name: "Rock Deluxe Room",
        roomNumber: "14",
        description: "Diện tích phòng: 21m2 - 01 giường đôi",
        size: "21m²",
        capacity: 2,
        price: 1776000,
        extraBedFee: 0,
        view: "",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/cover14.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-giuong-doi-15",
        name: "Phòng giường đôi",
        roomNumber: "15",
        description: "1 giường đôi lớn, Diện tích 18 m2",
        size: "18m²",
        capacity: 2,
        price: 1587000,
        extraBedFee: 0,
        view: "",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/cover15.jpg",
        ],
        availability: true,
    },
    {
        id: "first-floor-family-with-sea-view-16",
        name: "First Floor Family with Sea View",
        roomNumber: "16",
        description: "2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 31m2",
        size: "31m²",
        capacity: 4,
        price: 2987000,
        extraBedFee: 0,
        view: "",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/cover-16.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-03-nguoi-huong-thung-lung-bien-17",
        name: "Phòng 03 người - Hướng thung lũng/ biển",
        roomNumber: "17",
        description: "Diện tích phòng: 26 m2,  hướng nhìn ra biển/ thung lũng",
        size: "26m²",
        capacity: 3,
        price: 2411000,
        extraBedFee: 0,
        view: "Hướng thung lũng / biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/cover-17.jpg",
        ],
        availability: true,
    },
    {
        id: "phong-03-nguoi-co-ban-cong-18",
        name: "Phòng 03 người - Có ban công",
        roomNumber: "18",
        description: "Diện tích phòng: 32 m2 / Ban công rộng/ Hướng thung lũng/ Biển",
        size: "32m²",
        capacity: 3,
        price: 2411000,
        extraBedFee: 0,
        view: "Hướng thung lũng / biển",
        hasBalcony: true,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/cover-18.jpg",
        ],
        availability: true,
    },
    {
        id: "suite-02-phong-ngu-08-khach-08-09",
        name: "Suite 02 phòng ngủ (08 khách)",
        roomNumber: "08-09",
        description: "02 Phòng ngủ: gồm 04 giường đơn - 2 giường đôi cực lớn",
        size: "",
        capacity: 8,
        price: 5662000,
        extraBedFee: 0,
        view: "",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/cover-809.jpg",
        ],
        availability: true,
    },
    {
        id: "suite-02-phong-ngu-06-khach-10-11",
        name: "Suite 02 phòng ngủ (06 khách)",
        roomNumber: "10-11",
        description: "Gồm 02 phòng ngủ, 3 giường đôi /view biển",
        size: "",
        capacity: 6,
        price: 4287000,
        extraBedFee: 0,
        view: "Hướng biển",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/10-11-suite-6-khach/cover.jpg",
        ],
        availability: true,
    },
    {
        id: "suite-02-phong-ngu-06-khach-15-16",
        name: "Suite 02 phòng ngủ (06 khách)",
        roomNumber: "15-16",
        description: "Gồm  03 giường đôi  - 02 phòng phòng ngủ / view vườn",
        size: "",
        capacity: 6,
        price: 4287000,
        extraBedFee: 0,
        view: "Hướng vườn",
        hasBalcony: false,
        images: [
            "https://thenamduhill.com/image/catalog/room-suite/15-16-suite-6-khach/cover-15-16.jpg",
        ],
        availability: true,
    },
];

export const dining = {
    title: "Trải nghiệm ẩm thực tại The Nam Du Hill Resort",
    banner: "https://thenamduhill.com/image/catalog/banner/restaurant.jpg",
    paragraphs: [
        "Hãy bắt đầu hành trình ẩm thực đáng nhớ tại The Nam Du Hill Resort, nơi tinh hoa ẩm thực hòa quyện cùng không gian nghỉ dưỡng giữa thiên nhiên biển đảo trong lành. Tọa lạc trên đảo Nam Du thơ mộng, trải nghiệm ẩm thực của chúng tôi là sự kết hợp hài hòa giữa hương vị truyền thống địa phương và phong cách chế biến hiện đại.",
        "Từ những món hải sản tươi ngon đánh bắt trong ngày, đậm đà hương vị biển Nam Du, đến các món ăn Việt Nam quen thuộc được nâng tầm tinh tế, đội ngũ bếp của chúng tôi mang đến một hành trình vị giác mộc mạc nhưng đầy cuốn hút. Dù bạn thưởng thức bữa ăn ấm cúng tại nhà hàng hay nhâm nhi món ngon bên ly đồ uống tại khu café & bar ngắm hoàng hôn, mỗi khoảnh khắc đều là một trải nghiệm đáng nhớ.",
        "Hãy đến The Nam Du Hill Resort và để vị giác của bạn khám phá trọn vẹn tinh thần ẩm thực biển đảo – giản dị, tươi mới và đậm chất Nam Du.",
    ],
};

export const experiences = {
    title: "Tiện nghi & dịch vụ tại The Nam Du Hill Resort",
    banner: "https://thenamduhill.com/image/catalog/banner/rooms.jpg",
    images: [
        "https://thenamduhill.com/image/catalog/gallery/sua-tam-7.jpg",
        "https://thenamduhill.com/image/catalog/gallery/sua-tam-8.jpg",
        "https://thenamduhill.com/image/catalog/gallery/sua-tam-5.jpg",
    ],
    paragraphs: [
        "Hệ thống tiện nghi và dịch vụ tại The Nam Du Hill Resort được thiết kế hài hòa với thiên nhiên, mang đến cho du khách cảm giác thư giãn trọn vẹn giữa không gian biển đảo yên bình. Dù bạn đến Nam Du để nghỉ dưỡng, khám phá hay đơn giản là tìm lại sự cân bằng, chúng tôi luôn sẵn sàng đáp ứng bằng sự hiếu khách chân thành và chu đáo.",
        "Du khách có thể tận hưởng khu café & bar với tầm nhìn hướng biển, lý tưởng để ngắm bình minh hay hoàng hôn trên đảo. Đội ngũ resort hỗ trợ sắp xếp tour tham quan đảo, trải nghiệm biển, lặn ngắm san hô và di chuyển cano, giúp hành trình của bạn trở nên thuận tiện và trọn vẹn hơn.",
        "Với không gian yên tĩnh, gần gũi thiên nhiên cùng các tiện ích thiết yếu phục vụ nghỉ dưỡng, The Nam Du Hill Resort là điểm dừng chân lý tưởng để bạn thả lỏng cơ thể, tái tạo năng lượng và tận hưởng nhịp sống chậm giữa vẻ đẹp nguyên sơ của Nam Du.",
    ],
    articles: [
        { title: "Trải Nghiệm Đi Tàu – Lặn Biển – Ngủ Đảo Khi Du Lịch Nam Du", url: "/article/experiences-feel/trai-nghiem-di-tau-lan-bien-ngu-dao-khi-du-lich-nam-du" },
        { title: "Trải Nghiệm Không Thể Bỏ Lỡ Khi Du Lịch Đảo Nam Du Lần Đầu", url: "/article/experiences-feel/trai-nghiem-khong-the-bo-lo-khi-du-lich-dao-nam-du-lan-dau" },
        { title: "Trải Nghiệm Du Lịch Đảo Nam Du: Thiên Đường Biển Hoang Sơ Đáng Đi Nhất Miền Tây", url: "/article/experiences-feel/trai-nghiem-du-lich-dao-nam-du-thien-duong-bien-hoang-so-dang-di-nhat-mien-tay" },
    ] as SeedArticle[],
};

/** Trang Event hiện chưa có nội dung trên website nguồn. */
export const events = {
    banner: "https://thenamduhill.com/image/catalog/banner/event.jpg",
    items: [] as SeedArticle[],
};

export const news = {
    banner: "https://thenamduhill.com/image/catalog/banner/news.jpg",
    thumbnails: [
        "https://thenamduhill.com/image/catalog/news/news-1.png",
        "https://thenamduhill.com/image/catalog/news/news-2.png",
        "https://thenamduhill.com/image/catalog/news/news-3.png",
        "https://thenamduhill.com/image/catalog/news/news-4.png",
        "https://thenamduhill.com/image/catalog/news/news-5.png",
        "https://thenamduhill.com/image/catalog/news/news-6.png",
        "https://thenamduhill.com/image/catalog/news/news-7.png",
        "https://thenamduhill.com/image/catalog/news/news-8.jpg",
        "https://thenamduhill.com/image/catalog/news/news-11.png",
    ],
    articles: [
        { title: "Top 10 điểm đến không thể bỏ qua khi du lịch đảo Nam Du", url: "/article/top-10-diem-den-khong-the-bo-qua-khi-du-lich-dao-nam-du/news-list" },
        { title: "Hướng dẫn chi tiết các lộ trình đến đảo Nam Du từ Hồ Chí Minh", url: "/article/huong-dan-chi-tiet-cac-lo-trinh-den-dao-nam-du-tu-ho-chi-minh/news-list" },
        { title: "Review các homestay và resort đẹp ở đảo Nam Du", url: "/article/review-cac-homestay-va-resort-dep-o-dao-nam-du/news-list" },
        { title: "Ẩm thực đảo Nam Du: Những món ăn đặc sản không thể bỏ qua", url: "/article/am-thuc-dao-nam-du-nhung-mon-an-dac-san-khong-the-bo-qua/news-list" },
        { title: "Kinh nghiệm du lịch đảo Nam Du tự túc: Chi phí và lịch trình 3 ngày 2 đêm", url: "/article/kinh-nghiem-du-lich-dao-nam-du-tu-tuc-chi-phi-va-lich-trinh-3-ngay-2-dem/news-list" },
        { title: "Thời điểm tốt nhất để du lịch đảo Nam Du - Mùa nào đẹp nhất?", url: "/article/thoi-diem-tot-nhat-de-du-lich-dao-nam-du-mua-nao-dep-nhat/news-list" },
        { title: "Các hoạt động vui chơi giải trí không thể bỏ qua tại đảo Nam Du", url: "/article/cac-hoat-dong-vui-choi-giai-tri-khong-the-bo-qua-tai-dao-nam-du/news-list" },
        { title: "Hướng dẫn di chuyển giữa các đảo trong quần đảo Nam Du", url: "/article/huong-dan-di-chuyen-giua-cac-dao-trong-quan-dao-nam-du/news-list" },
        { title: "Lưu ý quan trọng khi du lịch đảo Nam Du: An toàn và chuẩn bị", url: "/article/luu-y-quan-trong-khi-du-lich-dao-nam-du-an-toan-va-chuan-bi/news-list" },
        { title: "Checklist đồ dùng cần mang khi đi du lịch đảo Nam Du", url: "/article/checklist-do-dung-can-mang-khi-di-du-lich-dao-nam-du/news-list" },
    ] as SeedArticle[],
};

/** 20 ảnh gallery, dùng chung cho hero / slider. */
export const gallery: string[] = [
    "https://thenamduhill.com/image/catalog/gallery/a6d24bc09a5e15004c4f.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-10.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-11.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-12.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-13.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-14.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-15.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-16.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-17.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-18.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-1.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-19.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-2.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-20.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-4.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-5.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-6.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-7.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-8.jpg",
    "https://thenamduhill.com/image/catalog/gallery/sua-tam-9.jpg",
];

/** Ảnh banner/hero lấy từ trang chủ. */
export const banners: string[] = [
    "https://thenamduhill.com/image/catalog/banner/namdu-3.jpg",
    "https://thenamduhill.com/image/catalog/banner/banner2.jpg",
    "https://thenamduhill.com/image/catalog/banner/namdu-2.jpg",
    "https://thenamduhill.com/application/assets/img/bg-video-home.jpg",
    "https://thenamduhill.com/application/assets//img/bg-home-2.jpg",
];

export interface SeedPolicyPage {
    title: string;
    url: string;
    paragraphs: string[];
}

/** Trích từ 5 trang /page/... của website nguồn. */
export const policies = {
    checkIn: "14:00",
    checkOut: "11:00 đến 12:00",
    cancellation: "Khách có thể hủy miễn phí trong thời hạn cho phép trước ngày nhận phòng. Trường hợp hủy sát ngày hoặc không đến nhận phòng, chỗ nghỉ có thể áp dụng phí theo chính sách tại thời điểm đặt phòng. Thời hạn hủy tính theo giờ địa phương.",
    children: "Phù hợp cho trẻ em. Giá hiển thị áp dụng cho số lượng khách tiêu chuẩn; vui lòng cung cấp đầy đủ thông tin khi đi cùng trẻ em.",
    extraBed: "Không đảm bảo cung cấp, tùy thuộc vào tình trạng sẵn có.",
    smoking: "Không hút thuốc: Hầu hết các khách sạn đều có chính sách cấm hút thuốc trong phòng. Nếu bạn hút thuốc trong phòng, sẽ bị phạt một khoản phí làm sạch và dọn vệ sinh",
    quietHours: "Hành vi không đúng mực: Khách sạn yêu cầu khách giữ thái độ lịch sự và không có hành vi gây ồn ào sau 22:00, quấy rối người khác.",
    /** Toàn văn từng trang chính sách — dùng cho /terms, /privacy. */
    pages: [
        {
            title: "Hướng dẫn nhận phòng -Huỷ phòng",
            url: "/page/huong-dan-nhan-phong-huy-phong",
            paragraphs: [
                "Khách có thể hủy miễn phí trong thời hạn cho phép trước ngày nhận phòng. Trường hợp hủy sát ngày hoặc không đến nhận phòng, chỗ nghỉ có thể áp dụng phí theo chính sách tại thời điểm đặt phòng. Thời hạn hủy tính theo giờ địa phương.",
                "Hủy qua đường dẫn trong email xác nhận hoặc liên hệ trực tiếp hotline 0985 000 650 với chỗ nghỉ.",
                "Một số đặt phòng có thể yêu cầu thanh toán trước một phần hoặc toàn bộ chi phí. Thông tin thanh toán được hiển thị rõ khi đặt phòng.",
                "Giá phòng có thể đã bao gồm hoặc chưa bao gồm thuế, phí theo quy định. Các khoản áp dụng sẽ được thông báo trước khi xác nhận.",
                "Phù hợp cho trẻ em. Giá hiển thị áp dụng cho số lượng khách tiêu chuẩn; vui lòng cung cấp đầy đủ thông tin khi đi cùng trẻ em.",
                "Không đảm bảo cung cấp, tùy thuộc vào tình trạng sẵn có.",
                "Hoàn tất đặt phòng đồng nghĩa với việc khách đồng ý các điều kiện trên.",
            ],
        },
        {
            title: "Qui Định Chung",
            url: "/page/qui-dianh-chung",
            paragraphs: [
                "Tại The Nam Du Hill sẽ có những quy định riêng, nhưng dưới đây là một số quy định chung mà khách sạn áp dụng:",
                "Giờ nhận phòng (Check-in): Từ 14:00. Tuy nhiên, nếu quý khách đến sớm có thể yêu cầu nhận phòng sớm, nhưng thường sẽ có phí phụ thu tùy theo chính sách của khách sạn.",
                "Giờ trả phòng (Check-out): Từ 11:00 đến 12:00. Nếu muốn ở lâu hơn, quý khách có thể yêu cầu gia hạn phòng, nhưng cần sự chấp thuận từ khách sạn và có thể phải trả thêm phí.",
                "Mỗi phòng khách sạn chỉ được phép chứa một số lượng người nhất định. Việc thêm người vào phòng sẽ dẫn đến phí phát sinh hoặc yêu cầu chuyển sang phòng lớn hơn.",
                "Các khách sạn có thể yêu cầu bạn cung cấp giấy tờ tùy thân cho tất cả các khách ở cùng phòng.",
                "Không hút thuốc: Hầu hết các khách sạn đều có chính sách cấm hút thuốc trong phòng. Nếu bạn hút thuốc trong phòng, sẽ bị phạt một khoản phí làm sạch và dọn vệ sinh",
                "Hành vi không đúng mực: Khách sạn yêu cầu khách giữ thái độ lịch sự và không có hành vi gây ồn ào sau 22:00, quấy rối người khác.",
                "Mang đồ ăn ngoài vào phòng: Quý khách không được mang đồ ăn có mùi vào phòng.",
                "Quý Khách cần xuất trình CMND/CCCD hoặc hộ chiếu khi nhận phòng. Đối với khách quốc tế, hộ chiếu là yêu cầu bắt buộc.",
                "Chính sách về trẻ em tại The Nam Du Hill cho phép trẻ em dưới 6 tuổi ở chung phòng với phụ huynh mà không mất phí, nhưng nếu cần giường phụ, sẽ có phí bổ sung.",
                "Giường phụ có thể được cung cấp tùy theo yêu cầu và tùy thuộc vào loại phòng.",
                "Giữ gìn tài sản: Khách sạn có trách nhiệm bảo vệ tài sản của bạn trong suốt thời gian lưu trú, nhưng bạn cũng nên lưu ý bảo vệ các vật dụng quý giá của mình. Sử dụng két sắt trong phòng hoặc tại quầy lễ tân để bảo quản tài sản.",
                "An ninh: Tại The Nam Du Hill yêu cầu không để người lạ vào phòng hoặc khu vực chung mà không có sự đồng ý của nhân viên.",
                "The Nam Du Hill không cho phép mang động vật nuôi vào phòng.",
                "Dịch vụ phòng: Nếu bạn muốn sử dụng dịch vụ phòng, hãy chắc chắn kiểm tra menu và phí dịch vụ kèm theo.",
                "Wi-Fi và tiện ích khác: Wi-Fi miễn phí trong khu vực chung.",
                "Những quy định này có thể thay đổi tùy theo từng khách sạn và địa phương, vì vậy khi đặt phòng, bạn nên đọc kỹ các điều khoản và chính sách của khách sạn để tránh bất kỳ sự bất tiện nào.",
            ],
        },
        {
            title: "Chính sách bảo mật",
            url: "/page/chinh-sach-baao-maat",
            paragraphs: [
                "THE NAM DU HILL rất quan tâm đến quyền riêng tư của quý khách khi quý khách sử dụng những dịch vụ của chúng tôi.Chúng tôi cũng hiểu rằng quý khách sẽ rất quan tâm đến việc những thông tin mà quý khách cũng cấp cho chúng tôi có được bảo mật an toàn hay không. Và chúng tôi luôn muốn quý khách sẽ thật yên tâm và tin tưởng khi tham gia các dịch vụ của chúng tôi. Vì vậy chúng tôi cam kết sẽ khiến quý khách có những trải nghiệm tuyệt vời nhất khi tham gia chương trình của chúng tôi với sự tin tưởng hoàn toàn với các mục bảo mật như sau (Click từng mục để xem chi tiết):",
                "Chúng tôi tạo ra chính sách bảo mật này để chứng minh cho cam kết về sự an toàn bảo mật của  chúng tôi với quý khách hàng. Qua Chính sách bảo mật thông tin này, chúng tôi muốn quý khách hiểu được về việc chúng tôi thu thập thông tin khách hàng, việc sử dụng và chia sẻ thông tin cũng như việc bảo mật thông tin khách hàng của chúng tôi. Chúng tôi cũng hi vọng quý khách sẽ đọc thật kỹ những điều chúng tôi mô tả dưới đây.",
                "Chúng tôi thu thập thông tin từ tất cả những ai truy cập và sử dụng nội dung dịch vụ của chúng tôi,",
                "Các thành viên có thể sẽ được yêu cầu cung cấp đầy đủ những thông tin cá nhân khi họ đăng khí sử dụng những sản phẩm và dịch vụ của chúng tôi, bao gồm: tên, địa chỉ, số điện thoại và thông tin thanh toán. Chúng tôi sử dụng những thông tin này chủ yếu để cung cấp những thông tin hữu ích nhất được cập nhật hàng ngày cho những khách hàng sử dụng dịch vụ của chúng tôi, và nói chung, chúng tôi không bao giờ chia sẻ những thông tin thu được này cho bất cứ bên thứ ba nào.",
                "Chúng tôi sẽ lưu trữ toàn bộ những thông tin truy cập cũng như phản hồi của khách hàng. Những thông tin này được lưu trữ nhằm mục đích chăm sóc tốt hơn cho những khách hàng của chúng tôi.",
                "Chúng tôi sẽ lưu trữ tất cả những hóa đơn chứng từ mua bán, giao dịch, lịch sử mua hàng, phương thức thanh toán … nhằm tránh những phát sinh đáng tiếc nếu có sau này.",
                "Sử Dụng Thông Tin: Chúng tôi sử dụng thông tin khách hàng cho những mục đích sau:",
                "Cung cấp những thông tin hữu ích nhằm chăm sóc tốt nhất cho khách hàng, bao gồm:  Bản tin hàng ngày (Newsletter), Các chương trình khuyến mãi, Thông tin về sản phẩm mới hoặc các chương trình thúc đẩy phát triển khác của công ty chúng tôi.",
                "Cung cấp một số tiện ích cũng như các dịch vụ tư vấn hỗ trợ khách hàng tốt hơn.",
                "Chúng tôi sẽ sử dụng thông tin khách hàng một cách hợp lý vì mục đích phát triển và hoàn thiện những dịch vụ của công ty để có thể phục vụ tốt hơn quý khách hàng.",
                "Giải quyết những vấn đề tranh chấp, khiếu nại, giải đáp thắc mắc của khách hàng.",
                "Phòng tránh những trường hợp đáng tiếc có thể xảy ra sau này như những hành vi vi phạm pháp luật.",
                "Chia Sẻ Thông Tin: Như đã nói, chúng tôi rất coi trọng việc bảo mật thông tin khách hàng nên chúng tôi cam kết sẽ tuyệt đối không tự ý sử dụng thông tin khách hàng với mục đích không mang lại lợi ích cho khách hàng, chúng tôi cam kết không buôn bán, trao đổi thông tin bảo mật của khách hàng cho bất cứ bên thứ ba nào. Tuy nhiên, trong một số trường hợp đặc biệt sau, chúng tôi có thể chia sẻ thông tin khách một cách hợp lý:",
                "Để bảo vệ quyền lợi của công ty và những đối tác của công ty: Chúng tôi chỉ đưa ra những thông tin cá nhân của khách hàng khi chắc chắn rằng những thông tin đó có thể bảo vệ được quyền lợi, tài sản của công ty chúng tôi và những đối tác liên quan. Những thông tin này sẽ được tiết lộ một cách hợp pháp theo Pháp luật Việt Nam.",
                "Theo yêu cầu của những cơ quan chính phủ khi chúng tôi thấy nó phù hợp với pháp luật Việt Nam.",
                "Trong một số trường hợp cần thiết phải cung cấp thông tin khách hàng khác, như các chương trình khuyến mãi có sự tài trợ của một bên thứ ba chẳng hạn, chúng tôi sẽ thông báo cho quý khách hàng trước khi thông tin của quý khách được chia sẻ. Qúy khách có quyền quyết định xem có đồng ý chia sẻ thông tin hoặc tham gia hay không.",
                "Thông tin của quý khách hàng được THE NAM DU HILL  lưu trữ trong thời gian khách hàng còn sử dụng dịch vụ  có liên quan đến ngành nghề kinh doanh của chúng tôi. Quý khách có thể yêu cầu ngưng lưu trữ thông tin của quý khách vui lòng gửi mail về thenamduhill@gmail.com, chúng tôi sẽ hủy thông tin của Quý khách trên hệ thống khi có yêu cầu từ email đã đăng ký.",
                "4/ Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân:",
                "Hệ thống thu thập và quản lý thông tin của khách hàng trên website thenamduhill.com thuộc về THE NAM DU HILL Địa chỉ: Tổ 6, Ấp Cũ Tron, Xã An Sơn, Huyện Kiên Hải, Kiên Giang, Việt Nam",
                "5/ Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân của mình:",
                "Mỗi thành viên của trang web thenamduhill.com có quyền xem những thông tin cá nhân của mình trên trang web và thay đổi theo mong muốn. Để thực hiện việc này, người sử dụng cần đăng nhập vào trang web và thay đổi thông tin. Người sử dụng có thể được yêu cầu cung cấp một số thông tin cần thiết hoặc chứng minh thông tin tài khoản đăng nhập bằng cách kích hoạt đường dẫn qua email đăng ký.",
                "Khách hàng đã đăng ký nhận thông tin từ thenamduhill.com có thể từ chối nhận các bản tin, thông tin thương mại và quảng cáo bất cứ lúc nào hoặc cấm truyền tải thông tin cá nhân cho các đơn vị khác trừ khi thực hiện các giao dịch trực tuyến. Khách hàng có thể xóa các dữ liệu cá nhân trên thenamduhill.com vào bất cứ thời điểm nào. Tuy nhiên, một số thông tin liên quan đến mục đích kế toán vẫn được thenamduhill.com lưu giữ một cách hợp pháp.",
                "Chúng tôi cam kết bảo đảm an toàn thông tin cho quý khách hàng khi đăng ký thông tin cá nhân với công ty chúng tôi. Chúng tôi cam kết không trao đổi mua bán thông tin khách hàng vì mục đích thương mại. Mọi sự chia sẻ và sử dụng thông tin khách hàng chúng tôi cam kết thực hiện theo chính sách bảo mật của công ty. Chúng tôi cam kết sẽ khiến quý khách cảm thấy tin tưởng và hài lòng về bảo mật thông tin cá nhân khi tham gia và sử dụng những dịch vụ của công ty chúng tôi.",
                "Để bảo mật thông tin của khách hàng tốt nhất, chúng tôi khuyến cáo quý khách hạn chế truy cập tài khoản bằng đăng nhập tự động, chú ý chế độ sao lưu password và đảm bảo đăng xuất khỏi tài khoản khi sử dụng máy tính chung để đăng nhập tài khoản trên website của chúng tôi. Chúng tôi sẽ không chịu trách nhiệm khi những thông tin cá nhân của quý khách bị rò rỉ vì những lý do trên.",
                "Chính sách bảo mật chỉ áp dụng những thông tin quý khách hàng đăng ký trên website chính thức thenamduhill.com của công ty chúng tôi. Mọi thông tin quý khách đăng ký tại những wedsite hoặc những địa chỉ khác đều không thuộc phạm vi hiệu lực của Chính sách Bảo mật thông tin này.",
                "Chúng tôi luôn nhấn mạnh khẳng định rằng: Chúng tôi rất coi trọng quyền lợi được bảo mật thông tin của quý khách hàng. Nếu như quý khách có bất cứ thắc mắc hay góp ý nào liên quan đến Chính sách bảo mật của công ty, vui lòng liên hệ với chúng tôi:",
                "Địa chỉ: Tổ 6, Ấp Cũ Tron, Xã An Sơn, Huyện Kiên Hải, Kiên Giang, Việt Nam",
            ],
        },
        {
            title: "Hướng Dẫn đặt phòng",
            url: "/page/phuong-thuc-thanh-toan-va-giao-hang",
            paragraphs: [
                "Facebook là một kênh tiện lợi để đặt phòng nếu bạn biết thông tin của khách sạn hoặc homestay nào đó có sẵn trên trang Facebook.",
                "Bước 1: Tìm kiếm trang Facebook của The Nam Du Hill",
                "Vào phần Tìm kiếm trên Facebook và gõ tên khách sạn.",
                "Bước 3: Kiểm tra thông tin phòng và giá cả trong các bài đăng, album ảnh hoặc mục \"Dịch vụ\" trên trang của khách sạn.",
                "Bước 4: Nếu không thấy thông tin cụ thể, hãy nhắn tin trực tiếp cho khách sạn qua Facebook Messenger. Hỏi về các phòng trống, giá cả và chính sách đặt phòng.",
                "Bước 5: Nếu bạn đồng ý với các điều kiện, khách sạn sẽ hướng dẫn bạn cách thanh toán và xác nhận đặt phòng.",
                "Zalo cũng là một nền tảng phổ biến ở Việt Nam để liên hệ và đặt phòng trực tiếp với khách sạn The Nam Du Hill.",
                "Bước 1: Tìm kiếm trang Zalo của khách sạn hoặc nhà cung cấp dịch vụ lưu trú.",
                "Tìm qua số điện thoại, tên khách sạn hoặc mã QR nếu khách sạn cung cấp.",
                "Bước 2: Thêm khách sạn vào danh bạ Zalo hoặc chat trực tiếp qua ứng dụng.",
                "Bước 3: Gửi tin nhắn yêu cầu đặt phòng, hỏi về thông tin phòng, giá và các yêu cầu đặc biệt nếu có.",
                "Bước 4: Sau khi nhận được thông tin, xác nhận yêu cầu và thanh toán qua ZaloPay hoặc các phương thức thanh toán khác nếu khách sạn hỗ trợ.",
                "Booking.com là một nền tảng đặt phòng trực tuyến lớn và dễ sử dụng.",
                "Bước 2: Nhập điểm đến, ngày check-in và check-out, số lượng khách và nhấn \"Tìm kiếm\".",
                "Bước 3: Chọn khách sạn hoặc phòng phù hợp với nhu cầu của bạn.",
                "Bước 4: Kiểm tra thông tin phòng, các tiện ích, giá cả và các điều kiện huỷ phòng.",
                "Bước 5: Chọn phòng và điền thông tin cá nhân, phương thức thanh toán để hoàn tất đặt phòng.",
                "Agoda cũng là một nền tảng đặt phòng nổi tiếng và dễ sử dụng.",
                "Bước 2: Nhập thông tin về điểm đến, ngày check-in, check-out và số lượng khách.",
                "Bước 3: Lọc kết quả tìm kiếm theo các tiêu chí như giá cả, vị trí, tiện nghi,...",
                "Bước 4: Chọn khách sạn và xem chi tiết phòng, các chính sách và đánh giá của khách trước.",
                "Bước 5: Chọn phòng, điền thông tin cá nhân và chọn phương thức thanh toán để hoàn tất.",
                "Kiểm tra đánh giá: Đọc kỹ các đánh giá của khách hàng trước để có cái nhìn chính xác về chất lượng dịch vụ.",
                "So sánh giá: Trước khi đặt, bạn nên so sánh giá phòng giữa các nền tảng khác nhau như Booking.com, Agoda và trực tiếp với khách sạn qua Zalo hoặc Facebook.",
                "Hủy phòng: Kiểm tra chính sách hủy phòng để biết nếu có thay đổi kế hoạch bạn có thể hủy miễn phí hay không.",
            ],
        },
        {
            title: "Hướng Dẫn Thanh Toán",
            url: "/page/huoang-daan-thanh-toaan",
            paragraphs: [
                "Khi thanh toán tại The Nam Du Hill, bạn thường cần thực hiện một số bước cơ bản. Dưới đây là hướng dẫn chung để thanh toán tại khách sạn:",
                "Xác nhận chi tiết đặt phòng: Trước khi thanh toán, hãy chắc chắn rằng bạn đã kiểm tra thông tin về giá cả, các dịch vụ đã sử dụng, và thời gian lưu trú.",
                "Phương thức thanh toán: Tại The Nam Du Hill chúng tôi chấp nhận các hình thức thanh toán như thẻ tín dụng, thẻ ghi nợ, hoặc tiền mặt. Quý khách hàng cũng có thể thanh toán qua các ứng dụng thanh toán điện tử như chuyển khoản, ví MoMo.",
                "Đọc kỹ hóa đơn: Khi đến quầy lễ tân để thanh toán, nhân viên sẽ đưa cho bạn hóa đơn tổng kết tất cả các dịch vụ bạn đã sử dụng (phòng ở, đồ ăn, dịch vụ bổ sung như giặt ủi, spa, v.v.). Kiểm tra kỹ càng xem có sai sót gì không.",
                "Sử dụng thẻ tín dụng hoặc ghi nợ: Nếu bạn thanh toán bằng thẻ, nhân viên lễ tân sẽ quẹt thẻ của bạn và yêu cầu bạn ký xác nhận.",
                "Thanh toán bằng tiền mặt: Nếu bạn thanh toán bằng tiền mặt, hãy chắc chắn rằng bạn nhận đủ biên lai.",
                "Ứng dụng thanh toán điện tử: Nếu khách sạn có hỗ trợ thanh toán qua ứng dụng điện thoại như: Quét mã QR, thanh toán qua ví MoMo, bạn có thể sử dụng để thanh toán nhanh chóng.",
                "Sau khi thanh toán thành công, bạn sẽ nhận được biên lai xác nhận việc thanh toán. Nếu bạn đã sử dụng thẻ tín dụng, đừng quên lấy lại thẻ của mình.",
                "Nếu bạn đã thanh toán xong, nhân viên sẽ yêu cầu bạn thực hiện thủ tục check-out (trả phòng). Bạn có thể nhận lại chìa khóa phòng và các giấy tờ liên quan.",
                "Đặt cọc: Tại The Nam Du Hill, chúng tôi yêu cầu bạn đặt cọc trước 50% giá trị khi đặt phòng qua các hệ thống của khách sạn. Cọc sẽ bị thu hồi khi quý khách huỷ phòng (trừ vấn đề về thời tiết thay đổi)",
                "Phí phụ thu: Hãy chú ý các phí phụ thu có thể phát sinh như phí resort, phí đồ uống, các dịp lễ, Tết Nguyên Đáng hoặc các dịch vụ khác.",
                "Nếu bạn có thắc mắc hoặc cần thêm thông tin, đừng ngần ngại yêu cầu nhân viên lễ tân hỗ trợ!",
            ],
        },
    ] as SeedPolicyPage[],
};

export const payment = {
    methods: [
        "Thẻ tín dụng",
        "Thẻ ghi nợ",
        "Tiền mặt",
        "Chuyển khoản",
        "Ví MoMo",
    ],
    guide: [
        "Khi thanh toán tại The Nam Du Hill, bạn thường cần thực hiện một số bước cơ bản. Dưới đây là hướng dẫn chung để thanh toán tại khách sạn:",
        "Xác nhận chi tiết đặt phòng: Trước khi thanh toán, hãy chắc chắn rằng bạn đã kiểm tra thông tin về giá cả, các dịch vụ đã sử dụng, và thời gian lưu trú.",
        "Phương thức thanh toán: Tại The Nam Du Hill chúng tôi chấp nhận các hình thức thanh toán như thẻ tín dụng, thẻ ghi nợ, hoặc tiền mặt. Quý khách hàng cũng có thể thanh toán qua các ứng dụng thanh toán điện tử như chuyển khoản, ví MoMo.",
        "Đọc kỹ hóa đơn: Khi đến quầy lễ tân để thanh toán, nhân viên sẽ đưa cho bạn hóa đơn tổng kết tất cả các dịch vụ bạn đã sử dụng (phòng ở, đồ ăn, dịch vụ bổ sung như giặt ủi, spa, v.v.). Kiểm tra kỹ càng xem có sai sót gì không.",
        "Sử dụng thẻ tín dụng hoặc ghi nợ: Nếu bạn thanh toán bằng thẻ, nhân viên lễ tân sẽ quẹt thẻ của bạn và yêu cầu bạn ký xác nhận.",
        "Thanh toán bằng tiền mặt: Nếu bạn thanh toán bằng tiền mặt, hãy chắc chắn rằng bạn nhận đủ biên lai.",
        "Ứng dụng thanh toán điện tử: Nếu khách sạn có hỗ trợ thanh toán qua ứng dụng điện thoại như: Quét mã QR, thanh toán qua ví MoMo, bạn có thể sử dụng để thanh toán nhanh chóng.",
        "Sau khi thanh toán thành công, bạn sẽ nhận được biên lai xác nhận việc thanh toán. Nếu bạn đã sử dụng thẻ tín dụng, đừng quên lấy lại thẻ của mình.",
        "Nếu bạn đã thanh toán xong, nhân viên sẽ yêu cầu bạn thực hiện thủ tục check-out (trả phòng). Bạn có thể nhận lại chìa khóa phòng và các giấy tờ liên quan.",
        "Đặt cọc: Tại The Nam Du Hill, chúng tôi yêu cầu bạn đặt cọc trước 50% giá trị khi đặt phòng qua các hệ thống của khách sạn. Cọc sẽ bị thu hồi khi quý khách huỷ phòng (trừ vấn đề về thời tiết thay đổi)",
        "Phí phụ thu: Hãy chú ý các phí phụ thu có thể phát sinh như phí resort, phí đồ uống, các dịp lễ, Tết Nguyên Đáng hoặc các dịch vụ khác.",
        "Nếu bạn có thắc mắc hoặc cần thêm thông tin, đừng ngần ngại yêu cầu nhân viên lễ tân hỗ trợ!",
    ],
};

export const contact = {
    address: "Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam",
    phone: "0985 000 650",
    email: "thenamduhill@gmail.com",
};

export const namDuHillSeed = {
    hotel: hotelInfo,
    roomTypes,
    dining,
    experiences,
    events,
    news,
    gallery,
    banners,
    policies,
    payment,
    contact,
};
