// Data types for Phu Quoc tourism website

export interface Hotel {
    id: number;
    title: string;
    subtitle: string;
    badges: string[];
    rating: string;
    reviews: string;
    bookings?: string;
    price: string;
    originalPrice?: string;
    description: string;
    isPhoGroup: boolean;
    image: string;
    amenities?: string[];
    location?: string;
}

export interface TravelGuide {
    id: number;
    title: string;
    category: string;
    author: string;
    readTime: string;
    views: string;
    image: string;
    excerpt?: string;
    publishDate?: string;
    tags?: string[];
}

export interface SpecialGuide {
    title: string;
    description: string;
    author: string;
    isPhoContent: boolean;
    type?: 'villa' | 'food' | 'travel';
}

export interface WeatherPeriod {
    period: string;
    temp: { max: number; min: number };
    description: string;
    isRecommended: boolean;
    rainfall: string;
    humidity: string;
}

export interface QuickInfo {
    label: string;
    value: string;
    note: string;
    icon: string;
}

export interface CurrentWeather {
    temp: number;
    condition: string;
    humidity: number;
    wind: string;
    visibility: string;
}

export interface FAQ {
    question: string;
    answer: string;
    category: string;
}

export interface FooterSection {
    title: string;
    links: { name: string; href: string }[];
}

export interface RegionDestination {
    title: string;
    destinations: string[];
}

// Mockup Data
export const hotelsData: Hotel[] = [
    {
        id: 1,
        title: "Villa Ocean Breeze - Pho Retreat",
        subtitle: "Villa riêng tư • Phú Quốc",
        badges: ["Xác nhận tức thời", "Free airport pickup", "Hồ bơi riêng"],
        rating: "4.9",
        reviews: "156",
        bookings: "80+",
        price: "2,800,000",
        description: "3 phòng ngủ • Hồ bơi riêng • 300m ra biển",
        isPhoGroup: true,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        amenities: ["WiFi miễn phí", "Máy lạnh", "Bếp đầy đủ", "Hồ bơi riêng"],
        location: "Gần bãi biển Ong Lang"
    },
    {
        id: 2,
        title: "Villa Sunset Paradise - Pho Retreat",
        subtitle: "Villa riêng tư • Phú Quốc",
        badges: ["Xác nhận tức thời", "Self check-in", "Gần chợ đêm"],
        rating: "4.8",
        reviews: "124",
        bookings: "65+",
        price: "2,200,000",
        description: "2 phòng ngủ • View hoàng hôn • BBQ area",
        isPhoGroup: true,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000",
        amenities: ["WiFi miễn phí", "Máy lạnh", "Bếp nướng BBQ", "Ban công view biển"],
        location: "Gần chợ đêm Dinh Cậu"
    },
    {
        id: 3,
        title: "Vinholidays Fiesta Phú Quốc",
        subtitle: "Khách sạn • Phú Quốc",
        badges: ["Xác nhận tức thời"],
        rating: "4.7",
        reviews: "320",
        bookings: "150+",
        price: "756,665",
        description: "Resort cao cấp gần biển • Spa & Gym",
        isPhoGroup: false,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000",
        amenities: ["Spa", "Gym", "Nhà hàng", "Hồ bơi"],
        location: "Bãi Dài"
    },
    {
        id: 4,
        title: "The Shells Resort & Spa Phu Quoc",
        subtitle: "Khách sạn • Phú Quốc",
        badges: ["Xác nhận tức thời"],
        rating: "4.6",
        reviews: "571",
        price: "1,793,605",
        description: "Resort & Spa sang trọng • All-inclusive",
        isPhoGroup: false,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000",
        amenities: ["Spa cao cấp", "3 nhà hàng", "Bar", "Dịch vụ butler"],
        location: "Bãi Khem"
    },
    {
        id: 5,
        title: "Venice Hotel Phú Quốc",
        subtitle: "Khách sạn • Phú Quốc",
        badges: ["Xác nhận tức thời"],
        rating: "4.5",
        reviews: "289",
        bookings: "95+",
        price: "1,512,006",
        description: "Khách sạn boutique • Design độc đáo",
        isPhoGroup: false,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000",
        amenities: ["Design độc đáo", "Rooftop bar", "Spa", "Gym"],
        location: "Trung tâm Dương Đông"
    },
    {
        id: 6,
        title: "Villa Garden Paradise - Pho Retreat",
        subtitle: "Villa riêng tư • Phú Quốc",
        badges: ["Xác nhận tức thời", "Eco-friendly", "Pet-friendly"],
        rating: "4.9",
        reviews: "98",
        bookings: "45+",
        price: "3,200,000",
        description: "4 phòng ngủ • Vườn nhiệt đới • Hồ bơi vô cực",
        isPhoGroup: true,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000",
        amenities: ["Vườn riêng", "Hồ bơi vô cực", "Bếp ngoài trời", "Phòng yoga"],
        location: "Bãi Ong Lang"
    }
];

export const travelGuidesData: TravelGuide[] = [
    {
        id: 1,
        title: "31 Địa Điểm Du Lịch Phú Quốc Nổi Tiếng Cập Nhật 2025",
        category: "Hoạt động nên trải nghiệm",
        author: "Pho Group",
        readTime: "15 phút đọc",
        views: "32K",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
        excerpt: "Khám phá những địa điểm không thể bỏ lỡ tại đảo ngọc Phú Quốc",
        publishDate: "2025-01-15",
        tags: ["địa điểm", "check-in", "du lịch"]
    },
    {
        id: 2,
        title: "30 Đặc Sản Phú Quốc Nổi Tiếng Thơm Ngon Khó Cưỡng",
        category: "Đồ ăn & thức uống",
        author: "PhoFood Team",
        readTime: "12 phút đọc",
        views: "28K",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
        excerpt: "Tổng hợp những món đặc sản không thể bỏ lỡ khi đến Phú Quốc",
        publishDate: "2025-01-10",
        tags: ["ẩm thực", "đặc sản", "cá khô"]
    },
    {
        id: 3,
        title: "VinWonders Phú Quốc - Review Chi Tiết Công Viên Giải Trí Hàng Đầu",
        category: "Hoạt động nên trải nghiệm",
        author: "Pho Travel",
        readTime: "10 phút đọc",
        views: "25K",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
        excerpt: "Hướng dẫn chi tiết trải nghiệm VinWonders Phú Quốc",
        publishDate: "2025-01-08",
        tags: ["vinwonders", "giải trí", "gia đình"]
    },
    {
        id: 4,
        title: "Cáp Treo Hòn Thơm - Trải Nghiệm Đỉnh Cao Tại Phú Quốc",
        category: "Hoạt động nên trải nghiệm",
        author: "Pho Travel",
        readTime: "8 phút đọc",
        views: "22K",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
        excerpt: "Khám phá cáp treo dài nhất thế giới tại Phú Quốc",
        publishDate: "2025-01-05",
        tags: ["cáp treo", "hòn thơm", "view đẹp"]
    },
    {
        id: 5,
        title: "27 Khu Du Lịch Việt Nam Xịn Sò Cho Chuyến Đi Gia Đình",
        category: "Hoạt động nên trải nghiệm",
        author: "Pho Group",
        readTime: "20 phút đọc",
        views: "35K",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
        excerpt: "Tổng hợp các điểm đến lý tưởng cho gia đình có trẻ em",
        publishDate: "2025-01-03",
        tags: ["gia đình", "trẻ em", "du lịch"]
    },
    {
        id: 6,
        title: "15 Quán Café Và Bar Ở Phú Quốc Đẹp Mê Hồn",
        category: "Đồ ăn & thức uống",
        author: "PhoFood Team",
        readTime: "7 phút đọc",
        views: "18K",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
        excerpt: "Những quán café và bar có view đẹp nhất Phú Quốc",
        publishDate: "2025-01-01",
        tags: ["café", "bar", "view đẹp"]
    }
];

export const specialGuidesData: SpecialGuide[] = [
    {
        title: "Hướng dẫn chọn villa tại Pho Retreat",
        description: "Tips chọn villa phù hợp cho gia đình, tiện nghi và vị trí tốt nhất cho kỳ nghỉ hoàn hảo",
        author: "Pho Retreat",
        isPhoContent: true,
        type: 'villa'
    },
    {
        title: "Bí quyết chế biến cá khô Phú Quốc chuẩn vị",
        description: "Chia sẻ công thức chế biến đặc sản cá khô từ PhoFood, từ nguyên liệu đến kỹ thuật",
        author: "PhoFood",
        isPhoContent: true,
        type: 'food'
    },
    {
        title: "Lịch trình 3N2Đ Phú Quốc tiết kiệm",
        description: "Gợi ý lịch trình du lịch Phú Quốc 3 ngày 2 đêm với chi phí hợp lý từ Pho Travel",
        author: "Pho Travel",
        isPhoContent: true,
        type: 'travel'
    }
];

export const weatherData: WeatherPeriod[] = [
    {
        period: "THG 12 - THG 2",
        temp: { max: 31, min: 23 },
        description: "Mùa khô - thời điểm tuyệt nhất để du lịch Phú Quốc",
        isRecommended: true,
        rainfall: "25mm",
        humidity: "72%"
    },
    {
        period: "THG 3 - THG 5",
        temp: { max: 32, min: 26 },
        description: "Mùa nắng - thời tiết ấm nóng, không quá đông du khách",
        isRecommended: false,
        rainfall: "55mm",
        humidity: "78%"
    },
    {
        period: "THG 6 - THG 8",
        temp: { max: 30, min: 26 },
        description: "Giao mùa - dễ có mưa vào tháng 07 và tháng 08",
        isRecommended: false,
        rainfall: "180mm",
        humidity: "88%"
    },
    {
        period: "THG 9 - THG 11",
        temp: { max: 30, min: 24 },
        description: "Mùa mưa - khả năng cao dễ có bão",
        isRecommended: false,
        rainfall: "320mm",
        humidity: "92%"
    }
];

export const quickInfoData: QuickInfo[] = [
    { label: "Múi giờ", value: "GMT +07:00", note: "Không chênh lệch thời gian", icon: "⏰" },
    { label: "Tiền tệ", value: "Việt Nam Đồng", note: "1USD ≈ 24,500VND", icon: "💰" },
    { label: "Ngôn ngữ chính thức", value: "Tiếng Việt", note: "English được sử dụng rộng rãi", icon: "🗣️" },
    { label: "Thời gian tuyệt nhất để đến", value: "THG 12 - THG 2", note: "Lễ hội âm nhạc Epizode Việt Nam", icon: "🎵" },
    { label: "Thời lượng lý tưởng", value: "3-4 ngày", note: "Đủ thời gian trải nghiệm đầy đủ", icon: "📅" },
    { label: "Thời gian bay", value: "1.5 giờ", note: "Khởi hành từ Thành phố Hồ Chí Minh", icon: "✈️" }
];

export const currentWeatherData: CurrentWeather = {
    temp: 29,
    condition: "Nắng đẹp",
    humidity: 75,
    wind: "12 km/h",
    visibility: "10 km"
};

export const faqsData: FAQ[] = [
    {
        question: "Phú Quốc có gì vui?",
        answer: "Phú Quốc có rất nhiều hoạt động hấp dẫn như: cáp treo Hòn Thơm (dài nhất thế giới), VinWonders & Vinpearl Safari, tour 3 đảo khám phá biển xanh, các bãi biển đẹp như Bãi Sao, Bãi Khem, thưởng thức đặc sản cá khô và hải sản tươi ngon. Pho Group cung cấp trọn gói: nơi ở (Pho Retreat), tour trải nghiệm (Pho Travel) và đặc sản chất lượng (PhoFood).",
        category: "Hoạt động"
    },
    {
        question: "Du lịch Phú Quốc vào tháng mấy?",
        answer: "Thời điểm tốt nhất là từ tháng 11 đến tháng 4 (mùa khô) với thời tiết nắng đẹp, biển êm. Tháng 12-2 là cao điểm, đông khách nhất. Tháng 3-5 ít đông hơn, giá cả hợp lý. Tránh tháng 6-10 vì mùa mưa bão. Pho Group phục vụ quanh năm với ưu đãi đặc biệt cho mùa thấp điểm.",
        category: "Thời tiết"
    },
    {
        question: "Kinh nghiệm du lịch Phú Quốc cho gia đình?",
        answer: "Gia đình nên chọn villa riêng tư (Pho Retreat) để thoải mái, có bếp nấu ăn và hồ bơi riêng. Lịch trình nên bao gồm: VinWonders (phù hợp trẻ em), cáp treo Hòn Thơm, tour 3 đảo nhẹ nhàng, khám phá chợ đêm. Đặc sản cá khô PhoFood là quà biếu lý tưởng. Pho Group hỗ trợ đưa đón sân bay và tư vấn lịch trình phù hợp từng độ tuổi.",
        category: "Gia đình"
    },
    {
        question: "Chi phí du lịch Phú Quốc bao nhiều?",
        answer: "Chi phí trung bình 3N2Đ cho 2 người khoảng 10-18 triệu tùy mức độ. Villa Pho Retreat từ 2.2-3.5 triệu/đêm. Tour 3 đảo 650K-1.5 triệu/người. Vé cáp treo 650K, VinWonders 990K. Ăn uống 400-900K/bữa. Pho Group có gói combo tiết kiệm khi đặt villa + tour + đặc sản.",
        category: "Chi phí"
    },
    {
        question: "Pho Group có dịch vụ gì?",
        answer: "Pho Group cung cấp 3 dịch vụ chính: 1) PhoFood - đặc sản cá khô, hải sản chất lượng cao, ship toàn quốc. 2) Pho Retreat - villa riêng tư có hồ bơi, gần biển, free airport pickup. 3) Pho Travel - tour 3 đảo, cáp treo, VinWonders với giá ưu đãi. Tất cả đều chất lượng quốc tế, phục vụ khách Việt và quốc tế.",
        category: "Dịch vụ"
    },
    {
        question: "Làm sao đặt villa Pho Retreat?",
        answer: "Đặt villa Pho Retreat rất đơn giản: 1) Chọn villa phù hợp trên website, 2) Chọn ngày check-in/out, 3) Điền thông tin và thanh toán, 4) Nhận xác nhận qua email/SMS. Hotline 24/7: 0999.888.777. Thanh toán linh hoạt: chuyển khoản, thẻ visa, ví điện tử. Free airport pickup và late check-out theo yêu cầu.",
        category: "Đặt phòng"
    },
    {
        question: "Có nên mua tour trọn gói hay tự túc?",
        answer: "Tùy vào sở thích và kinh nghiệm du lịch. Tour trọn gói tiết kiệm thời gian, có hướng dẫn viên, phù hợp lần đầu đi. Du lịch tự túc linh hoạt hơn, khám phá theo ý thích. Pho Travel có gói tour linh hoạt, có thể tùy chỉnh theo nhu cầu từng nhóm khách.",
        category: "Lựa chọn"
    },
    {
        question: "Đặc sản Phú Quốc nên mua gì?",
        answer: "Đặc sản nổi tiếng: cá khô (PhoFood có chất lượng cao nhất), nước mắm Phú Quốc, tiêu đen, sim rượu, mật ong rừng. PhoFood đảm bảo nguồn gốc, chế biến sạch sẽ, đóng gói đẹp làm quà. Có thể mua trực tiếp tại cửa hàng hoặc order online ship toàn quốc.",
        category: "Mua sắm"
    }
];

export const footerSectionsData: FooterSection[] = [
    {
        title: "Điểm tham quan hàng đầu Phú Quốc",
        links: [
            { name: "Bãi Sao", href: "/attractions/bai-sao" },
            { name: "grand world phú quốc", href: "/attractions/grand-world" },
            { name: "vinpearl safari phú quốc", href: "/attractions/vinpearl-safari" },
            { name: "hòn Thơm", href: "/attractions/hon-thom" },
            { name: "dương đông phú quốc", href: "/attractions/duong-dong" },
            { name: "vườn tiêu phú quốc", href: "/attractions/vuon-tieu" },
            { name: "Nhà tù Phú Quốc", href: "/attractions/nha-tu" },
            { name: "bãi khem", href: "/attractions/bai-khem" },
            { name: "Hòn Mây Rút", href: "/attractions/hon-may-rut" },
            { name: "Chùa Hộ Quốc", href: "/attractions/chua-ho-quoc" },
            { name: "gành dầu", href: "/attractions/ganh-dau" },
            { name: "hòn Gầm Ghì", href: "/attractions/hon-gam-ghi" },
            { name: "hòn Móng Tay", href: "/attractions/hon-mong-tay" },
            { name: "Bãi biển Ong Lang", href: "/attractions/bai-bien-ong-lang" },
            { name: "bãi dài phú quốc", href: "/attractions/bai-dai" },
            { name: "rạch vẹm", href: "/attractions/rach-vem" },
            { name: "dinh cầu", href: "/attractions/dinh-cau" }
        ]
    },
    {
        title: "Mọi thứ bạn cần cho chuyến đi Phú Quốc",
        links: [
            { name: "Khách sạn Phú Quốc", href: "/hotels/phu-quoc" },
            { name: "Xe sân bay Phú Quốc", href: "/transport/airport-transfer" },
            { name: "Tour & Trải nghiệm Phú Quốc", href: "/tours/experiences" },
            { name: "Tour Phú Quốc", href: "/tours/phu-quoc" },
            { name: "Tour đi thuyền Phú Quốc", href: "/tours/boat-tours" },
            { name: "Tour trong ngày Phú Quốc", href: "/tours/day-tours" },
            { name: "Hoạt động dưới nước Phú Quốc", href: "/activities/water-sports" },
            { name: "Massages Phú Quốc", href: "/wellness/massage" },
            { name: "Spa & Massage Phú Quốc", href: "/wellness/spa" },
            { name: "Lặn ống thở & Lặn bình dưỡng khí Phú Quốc", href: "/activities/diving" },
            { name: "Thuê thuyền Phú Quốc", href: "/rentals/boat-rental" },
            { name: "Cắm trại Phú Quốc", href: "/activities/camping" },
            { name: "Du thuyền Phú Quốc", href: "/tours/yacht" },
            { name: "Tour nhiều ngày Phú Quốc", href: "/tours/multi-day" },
            { name: "Hoạt động ngoài trời Phú Quốc", href: "/activities/outdoor" },
            { name: "Vé bãi biển/resort Phú Quốc", href: "/tickets/beach-resort" },
            { name: "Du thuyền ngắm cảnh Phú Quốc", href: "/tours/scenic-cruise" }
        ]
    }
];

export const regionDestinationsData: RegionDestination[] = [
    {
        title: "Việt Nam",
        destinations: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Nha Trang", "Hội An", "Sapa"]
    },
    {
        title: "Đông Nam Á",
        destinations: ["Bangkok", "Phuket", "Singapore", "Kuala Lumpur", "Bali", "Boracay"]
    },
    {
        title: "Châu Á",
        destinations: ["Tokyo", "Seoul", "Hong Kong", "Đài Bắc", "Mumbai", "Dubai"]
    },
    {
        title: "Châu Âu",
        destinations: ["London", "Paris", "Rome", "Barcelona", "Amsterdam", "Prague"]
    },
    {
        title: "Châu Úc",
        destinations: ["Sydney", "Melbourne", "Brisbane", "Perth", "Auckland", "Gold Coast"]
    },
    {
        title: "Châu Mỹ",
        destinations: ["New York", "Los Angeles", "Las Vegas", "San Francisco", "Miami", "Toronto"]
    }
];