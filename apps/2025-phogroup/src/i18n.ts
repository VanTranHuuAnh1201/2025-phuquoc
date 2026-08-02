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
            rating: "đánh giá",
            name: "Họ và tên",
            email: "Email",
            phone: "Số điện thoại",
            checkIn: "Ngày nhận phòng",
            checkOut: "Ngày trả phòng",
            guests: "Số khách",
            message: "Tin nhắn",
            submit: "Gửi yêu cầu",
            contactUs: "Liên hệ với chúng tôi",
            quickBooking: "Đặt phòng nhanh",
            required: "Bắt buộc"
        },
        sections: {
            topActivities: "Vui chơi & Trải nghiệm hàng đầu ở Phú Quốc",
            topDestinations: "Điểm tham quan hàng đầu ở Phú Quốc",
            transportation: "Phương tiện đi lại ở Phú Quốc",
            accommodation: "Nơi ở ở Phú Quốc",
            travelGuides: "Hướng dẫn du lịch Phú Quốc",
            activityReviews: "Đánh giá về các hoạt động ở Phú Quốc",
            weatherInfo: "Thông tin ngắn về Phú Quốc",
            faq: "Câu hỏi thường gặp về Phú Quốc",
            contact: "Liên hệ & Đặt phòng",
            externalLinks: "Đặt phòng qua các nền tảng"
        },
        platforms: {
            shopee: "Mua sắm trên Shopee",
            tiktokShop: "TikTok Shop",
            bookingCom: "Đặt phòng Booking.com",
            airbnb: "Thuê villa trên Airbnb",
            whatsapp: "Chat WhatsApp",
            zalo: "Chat Zalo"
        },
        notFound: {
            title: "Trang không tìm thấy",
            subtitle: "Xin lỗi, trang bạn đang tìm kiếm không tồn tại.",
            description: "Trang này có thể đã được di chuyển, xóa hoặc bạn đã nhập sai địa chỉ URL.",
            backHome: "Về trang chủ",
            exploreMore: "Khám phá thêm",
            error404: "404"
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
            rating: "reviews",
            name: "Full Name",
            email: "Email",
            phone: "Phone Number",
            checkIn: "Check-in Date",
            checkOut: "Check-out Date",
            guests: "Number of Guests",
            message: "Message",
            submit: "Submit Request",
            contactUs: "Contact Us",
            quickBooking: "Quick Booking",
            required: "Required"
        },
        sections: {
            topActivities: "Top Fun & Experiences in Phu Quoc",
            topDestinations: "Top Attractions in Phu Quoc",
            transportation: "Transportation in Phu Quoc",
            accommodation: "Accommodation in Phu Quoc",
            travelGuides: "Phu Quoc Travel Guides",
            activityReviews: "Activity Reviews in Phu Quoc",
            weatherInfo: "Brief Information about Phu Quoc",
            faq: "Frequently Asked Questions about Phu Quoc",
            contact: "Contact & Booking",
            externalLinks: "Book via Platforms"
        },
        platforms: {
            shopee: "Shop on Shopee",
            tiktokShop: "TikTok Shop",
            bookingCom: "Book on Booking.com",
            airbnb: "Rent Villa on Airbnb",
            whatsapp: "Chat WhatsApp",
            zalo: "Chat Zalo"
        },
        notFound: {
            title: "Page Not Found",
            subtitle: "Sorry, the page you are looking for does not exist.",
            description: "This page may have been moved, deleted, or you entered the wrong URL address.",
            backHome: "Back to Home",
            exploreMore: "Explore More",
            error404: "404"
        }
    }
};