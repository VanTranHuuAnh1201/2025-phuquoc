// Simple i18n configuration
export const locales = ['vi', 'en'] as const;
export const defaultLocale = 'vi' as const;

export type Locale = typeof locales[number];

// We'll implement proper i18n later
export const translations = {
    vi: {
        navigation: {
            phoFood: "PhoFood",
            phoRetreat: "Pho Retreat",
            phoTravel: "Pho Travel",
            openApp: "Mở ứng dụng",
            help: "Trợ giúp",
            cart: "Xem giỏ đặy",
            signup: "Đăng ký",
            login: "Đăng nhập"
        },
        common: {
            search: "Tìm theo điểm đến, hoạt động",
            bookNow: "Đặt ngay",
            viewMore: "Xem thêm",
            rating: "đánh giá"
        },
        sections: {
            topActivities: "Vui chơi & Trải nghiệm hàng đầu ở Phú Quốc",
            topDestinations: "Điểm tham quan hàng đầu ở Phú Quốc",
            transportation: "Phương tiện đi lại ở Phú Quốc",
            accommodation: "Nơi ở ở Phú Quốc",
            travelGuides: "Hướng dẫn du lịch Phú Quốc",
            activityReviews: "Đánh giá về các hoạt động ở Phú Quốc",
            weatherInfo: "Thông tin ngắn về Phú Quốc",
            faq: "Câu hỏi thường gặp về Phú Quốc"
        }
    },
    en: {
        navigation: {
            phoFood: "PhoFood",
            phoRetreat: "Pho Retreat",
            phoTravel: "Pho Travel",
            openApp: "Open App",
            help: "Help",
            cart: "View Cart",
            signup: "Sign Up",
            login: "Log In"
        },
        common: {
            search: "Search by destination, activity",
            bookNow: "Book Now",
            viewMore: "View More",
            rating: "reviews"
        },
        sections: {
            topActivities: "Top Fun & Experiences in Phu Quoc",
            topDestinations: "Top Attractions in Phu Quoc",
            transportation: "Transportation in Phu Quoc",
            accommodation: "Accommodation in Phu Quoc",
            travelGuides: "Phu Quoc Travel Guides",
            activityReviews: "Activity Reviews in Phu Quoc",
            weatherInfo: "Brief Information about Phu Quoc",
            faq: "Frequently Asked Questions about Phu Quoc"
        }
    }
};