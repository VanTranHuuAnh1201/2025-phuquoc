/* eslint-disable @next/next/no-img-element */
'use client'

import PhoGroupHero from "@/app/components/PhoGroupHero"
import Link from "next/link"

export default function PhoTravelPage() {
    const tours = [
        {
            id: 1,
            name: "Tour 3 Đảo Phú Quốc",
            nameEn: "Phu Quoc 3 Islands Hopping Tour",
            price: "850,000",
            priceUSD: "$36",
            duration: "1 ngày",
            durationEn: "Full day",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Khám phá 3 đảo đẹp nhất Phú Quốc: Hòn Thơm, Hòn Mây Rút, Hòn Gầm Ghì",
            descriptionEn: "Explore 3 most beautiful islands: Hon Thom, Hon May Rut, Hon Gam Ghi",
            highlights: ["Cáp treo Hòn Thơm", "Lặn ngắm san hô", "Buffet trưa", "Xe đón tiễn"],
            highlightsEn: ["Hon Thom Cable Car", "Snorkeling", "Lunch Buffet", "Hotel Transfer"],
            rating: 4.8,
            reviews: 324,
            maxGuests: 20
        },
        {
            id: 2,
            name: "Vé Cáp Treo Hòn Thơm",
            nameEn: "Hon Thom Cable Car Ticket",
            price: "320,000",
            priceUSD: "$14",
            duration: "Nửa ngày",
            durationEn: "Half day",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Trải nghiệm cáp treo dài nhất thế giới qua biển",
            descriptionEn: "Experience world's longest sea-crossing cable car",
            highlights: ["Cáp treo 7899m", "View toàn cảnh", "Bãi biển Hòn Thơm", "Ăn trưa tự túc"],
            highlightsEn: ["7899m Cable Car", "Panoramic View", "Hon Thom Beach", "Own Lunch"],
            rating: 4.9,
            reviews: 567,
            maxGuests: 50
        },
        {
            id: 3,
            name: "Vé VinWonders + Safari Combo",
            nameEn: "VinWonders + Safari Combo Ticket",
            price: "1,200,000",
            priceUSD: "$52",
            duration: "1 ngày",
            durationEn: "Full day",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Khám phá VinWonders và Safari trong 1 ngày",
            descriptionEn: "Explore VinWonders and Safari in one day",
            highlights: ["VinWonders Park", "Vinpearl Safari", "Xe bus miễn phí", "Ăn trưa"],
            highlightsEn: ["VinWonders Park", "Vinpearl Safari", "Free Shuttle", "Lunch Included"],
            rating: 4.7,
            reviews: 445,
            maxGuests: 100
        },
        {
            id: 4,
            name: "Câu Cá & BBQ Hoàng Hôn",
            nameEn: "Sunset Fishing & BBQ Tour",
            price: "650,000",
            priceUSD: "$28",
            duration: "Nửa ngày",
            durationEn: "Half day",
            image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Câu cá hoàng hôn và BBQ hải sản tươi sống",
            descriptionEn: "Sunset fishing and fresh seafood BBQ",
            highlights: ["Câu cá hoàng hôn", "BBQ hải sản", "Đồ uống", "Ngắm hoàng hôn"],
            highlightsEn: ["Sunset Fishing", "Seafood BBQ", "Drinks", "Sunset Viewing"],
            rating: 4.6,
            reviews: 234,
            maxGuests: 15
        },
        {
            id: 5,
            name: "Tour Rừng Quốc Gia",
            nameEn: "National Park Discovery Tour",
            price: "450,000",
            priceUSD: "$19",
            duration: "Nửa ngày",
            durationEn: "Half day",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Khám phá rừng nguyên sinh và thác nước",
            descriptionEn: "Explore pristine forest and waterfalls",
            highlights: ["Trekking rừng", "Thác Tranh", "Chùa Sư Muôn", "Hướng dẫn viên"],
            highlightsEn: ["Forest Trekking", "Tranh Stream", "Su Muon Pagoda", "Tour Guide"],
            rating: 4.5,
            reviews: 156,
            maxGuests: 12
        },
        {
            id: 6,
            name: "Night Market & Street Food",
            nameEn: "Night Market Food Tour",
            price: "350,000",
            priceUSD: "$15",
            duration: "Tối",
            durationEn: "Evening",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Khám phá ẩm thực đường phố và chợ đêm",
            descriptionEn: "Discover street food and night market",
            highlights: ["Chợ đêm Dinh Cậu", "10+ món ăn", "Hướng dẫn ẩm thực", "Đồ uống"],
            highlightsEn: ["Dinh Cau Night Market", "10+ Dishes", "Food Guide", "Drinks"],
            rating: 4.8,
            reviews: 289,
            maxGuests: 8
        }
    ]

    return (
        <>
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hover:text-gray-700">Trang chủ</span>
                        <span>›</span>
                        <span>Việt Nam</span>
                        <span>›</span>
                        <span>Phú Quốc</span>
                        <span>›</span>
                        <strong className="text-gray-700">Pho Travel - Tour & Trải nghiệm</strong>
                    </nav>
                </div>
            </section>

            <PhoGroupHero activeTab="travel" />

            <main className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30 min-h-screen">
                {/* Hero Section */}
                <section className="py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            Pho Travel - Tour & Trải Nghiệm Phú Quốc
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Khám phá Phú Quốc với những tour độc đáo và trải nghiệm khó quên.
                            Từ tour 3 đảo, cáp treo Hòn Thơm đến safari và ẩm thực đường phố -
                            chúng tôi mang đến cho bạn những kỷ niệm tuyệt vời nhất.
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="text-2xl font-bold text-orange-600">1000+</div>
                                <div className="text-sm text-gray-600">Khách hàng hài lòng</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="text-2xl font-bold text-orange-600">15+</div>
                                <div className="text-sm text-gray-600">Tour đa dạng</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="text-2xl font-bold text-orange-600">4.8★</div>
                                <div className="text-sm text-gray-600">Đánh giá trung bình</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="text-2xl font-bold text-orange-600">24/7</div>
                                <div className="text-sm text-gray-600">Hỗ trợ khách hàng</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tours Section */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Tour & Trải nghiệm nổi bật
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tours.map((tour) => (
                                <div key={tour.id} className="bg-white rounded-2xl border-2 border-transparent hover:border-orange-200 transition-colors shadow-lg hover:shadow-xl overflow-hidden group">
                                    {/* Tour Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={tour.image}
                                            alt={tour.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            ✈️ Pho Travel
                                        </div>
                                        <div className="absolute top-3 right-3 bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                                            {tour.duration}
                                        </div>
                                    </div>

                                    {/* Tour Info */}
                                    <div className="p-4 sm:p-6">
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                                            {tour.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3 italic">{tour.nameEn}</p>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                                        {/* Highlights */}
                                        <div className="mb-4">
                                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Điểm nổi bật:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {tour.highlights.slice(0, 2).map((highlight, idx) => (
                                                    <span key={idx} className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs">
                                                        ✓ {highlight}
                                                    </span>
                                                ))}
                                                {tour.highlights.length > 2 && (
                                                    <span className="text-orange-500 text-xs font-medium">
                                                        +{tour.highlights.length - 2} khác
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Rating & Guests */}
                                        <div className="flex items-center justify-between mb-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="font-bold">{tour.rating}</span>
                                                <span className="text-gray-500">({tour.reviews})</span>
                                            </div>
                                            <span className="text-gray-500">Tối đa {tour.maxGuests} khách</span>
                                        </div>

                                        {/* Price & Button */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    ₫{parseInt(tour.price).toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {tour.priceUSD}/người
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors shadow-lg text-sm">
                                                Đặt tour
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Booking Form Section */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Đặt tour ngay hôm nay
                            </h2>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ tên *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Nhập họ tên của bạn"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="+84 123 456 789"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày tour mong muốn *
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số người tham gia *
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                            <option>1 người</option>
                                            <option>2 người</option>
                                            <option>3-5 người</option>
                                            <option>6-10 người</option>
                                            <option>Trên 10 người</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tour quan tâm *
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                            <option>Tour 3 Đảo</option>
                                            <option>Cáp treo Hòn Thơm</option>
                                            <option>VinWonders + Safari</option>
                                            <option>Câu cá hoàng hôn</option>
                                            <option>Tour rừng quốc gia</option>
                                            <option>Food tour</option>
                                            <option>Combo nhiều tour</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Yêu cầu đặc biệt
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Ví dụ: Đón tại khách sạn, ăn chay, dị ứng thực phẩm..."
                                    ></textarea>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        Gửi yêu cầu đặt tour
                                    </button>
                                    <p className="text-sm text-gray-500 mt-3">
                                        Chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Tại sao chọn Pho Travel?
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="font-bold mb-2">Giá tốt nhất</h3>
                                <p className="text-sm text-gray-600">Cam kết giá tốt nhất thị trường, hoàn tiền nếu tìm được giá rẻ hơn</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="font-bold mb-2">Xác nhận nhanh</h3>
                                <p className="text-sm text-gray-600">Xác nhận đặt tour trong 15 phút, không phải chờ đợi lâu</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
                                <div className="text-4xl mb-4">🛡️</div>
                                <h3 className="font-bold mb-2">An toàn đảm bảo</h3>
                                <p className="text-sm text-gray-600">Bảo hiểm du lịch, hướng dẫn viên chuyên nghiệp</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
                                <div className="text-4xl mb-4">💬</div>
                                <h3 className="font-bold mb-2">Hỗ trợ 24/7</h3>
                                <p className="text-sm text-gray-600">Hỗ trợ khách hàng 24/7 qua Zalo, WhatsApp</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold mb-4">Liên hệ tư vấn miễn phí</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link
                                    href="https://zalo.me/photravel"
                                    className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">💬</span>
                                    Chat qua Zalo
                                </Link>
                                <Link
                                    href="https://wa.me/+84123456789"
                                    className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">📱</span>
                                    Chat qua WhatsApp
                                </Link>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>📞 Hotline: +84 123 456 789 | 📧 travel@phogroup.vn</p>
                                <p>🕒 Hoạt động: 6:00 - 22:00 hàng ngày</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
