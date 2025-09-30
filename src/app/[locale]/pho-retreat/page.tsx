/* eslint-disable @next/next/no-img-element */
'use client'

import PhoGroupHero from "@/app/components/PhoGroupHero"


export default function PhoRetreatPage() {
    const villas = [
        {
            id: 1,
            name: "Pho Retreat Ocean Villa",
            nameEn: "Ocean Villa - Sea View Paradise",
            price: "3,500,000",
            priceUSD: "$150",
            images: [
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ],
            location: "Bãi Trường, Phú Quốc",
            locationEn: "Truong Beach, Phu Quoc",
            bedrooms: 3,
            guests: 8,
            area: 150,
            amenities: ["Bãi biển riêng", "Hồ bơi", "BBQ", "WiFi", "Điều hòa", "Bếp đầy đủ"],
            amenitiesEn: ["Private Beach", "Pool", "BBQ", "WiFi", "AC", "Full Kitchen"],
            rating: 4.9,
            reviews: 127,
            available: true
        },
        {
            id: 2,
            name: "Pho Retreat Garden Villa",
            nameEn: "Garden Villa - Tropical Paradise",
            price: "2,800,000",
            priceUSD: "$120",
            images: [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ],
            location: "Ông Lang, Phú Quốc",
            locationEn: "Ong Lang, Phu Quoc",
            bedrooms: 2,
            guests: 6,
            area: 120,
            amenities: ["Vườn nhiệt đới", "Hồ bơi", "Spa", "WiFi", "Điều hòa", "Bếp"],
            amenitiesEn: ["Tropical Garden", "Pool", "Spa", "WiFi", "AC", "Kitchen"],
            rating: 4.8,
            reviews: 89,
            available: true
        },
        {
            id: 3,
            name: "Pho Retreat Sunset Villa",
            nameEn: "Sunset Villa - Romantic Getaway",
            price: "4,200,000",
            priceUSD: "$180",
            images: [
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ],
            location: "Bãi Kem, Phú Quốc",
            locationEn: "Kem Beach, Phu Quoc",
            bedrooms: 4,
            guests: 10,
            area: 200,
            amenities: ["View hoàng hôn", "Hồ bơi infinity", "Butler", "WiFi", "Điều hòa", "Bếp cao cấp"],
            amenitiesEn: ["Sunset View", "Infinity Pool", "Butler", "WiFi", "AC", "Premium Kitchen"],
            rating: 5.0,
            reviews: 156,
            available: false
        }
    ]

    const bookingPlatforms = [
        {
            name: "Booking.com",
            icon: "🏨",
            url: "https://booking.com/phoretreat",
            color: "bg-blue-600 hover:bg-blue-700",
            description: "Đặt trực tiếp qua Booking.com"
        },
        {
            name: "Airbnb",
            icon: "🏠",
            url: "https://airbnb.com/phoretreat",
            color: "bg-red-500 hover:bg-red-600",
            description: "Trải nghiệm như người địa phương"
        },
        {
            name: "Agoda",
            icon: "🌟",
            url: "https://agoda.com/phoretreat",
            color: "bg-purple-600 hover:bg-purple-700",
            description: "Giá tốt nhất đảm bảo"
        }
    ]

    return (
        <>
            {/* Breadcrumbs */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hover:text-gray-700">Trang chủ</span>
                        <span>›</span>
                        <span>Việt Nam</span>
                        <span>›</span>
                        <span>Phú Quốc</span>
                        <span>›</span>
                        <strong className="text-gray-700">Pho Retreat - Villa & Resort</strong>
                    </nav>
                </div>
            </section>

            <PhoGroupHero activeTab="retreat" />

            <main className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30 min-h-screen">
                {/* Hero Section */}
                <section className="py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            Pho Retreat - Villa Riêng Tư Phú Quốc
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Trải nghiệm kỳ nghỉ hoàn hảo tại những villa cao cấp bên bờ biển Phú Quốc.
                            Không gian riêng tư, tiện nghi 5 sao và dịch vụ chu đáo cho kỳ nghỉ đáng nhớ.
                        </p>

                        {/* Quick Booking Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                            {bookingPlatforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${platform.color} text-white p-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex flex-col items-center gap-2`}
                                >
                                    <span className="text-2xl">{platform.icon}</span>
                                    <span className="text-base">{platform.name}</span>
                                    <span className="text-xs opacity-90">{platform.description}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Villas Section */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Villa cao cấp của chúng tôi
                        </h2>

                        <div className="space-y-8">
                            {villas.map((villa, index) => (
                                <div key={villa.id} className={`bg-white rounded-3xl shadow-xl overflow-hidden ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} lg:flex`}>
                                    {/* Villa Images */}
                                    <div className="lg:w-1/2">
                                        <div className="relative h-64 sm:h-80 lg:h-full">
                                            <img
                                                src={villa.images[0]}
                                                alt={villa.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {!villa.available && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold text-lg">
                                                        Đã được đặt
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                🏖️ Pho Retreat
                                            </div>
                                        </div>
                                    </div>

                                    {/* Villa Info */}
                                    <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                                        <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
                                            {villa.name}
                                        </h3>
                                        <p className="text-gray-500 mb-4 italic">{villa.nameEn}</p>

                                        {/* Location & Details */}
                                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500">📍</span>
                                                <span>{villa.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500">🛏️</span>
                                                <span>{villa.bedrooms} phòng ngủ</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500">👥</span>
                                                <span>Tối đa {villa.guests} khách</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500">📐</span>
                                                <span>{villa.area}m²</span>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="font-bold">{villa.rating}</span>
                                                <span className="text-gray-500">({villa.reviews} đánh giá)</span>
                                            </div>
                                        </div>

                                        {/* Amenities */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold mb-3">Tiện nghi nổi bật:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {villa.amenities.slice(0, 4).map((amenity, idx) => (
                                                    <span key={idx} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {villa.amenities.length > 4 && (
                                                    <span className="text-orange-500 text-xs font-medium">
                                                        +{villa.amenities.length - 4} tiện nghi khác
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price & Booking */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    ₫{parseInt(villa.price).toLocaleString()}<span className="text-sm text-gray-500">/đêm</span>
                                                </div>
                                                <div className="text-lg text-gray-600">
                                                    {villa.priceUSD}<span className="text-xs">/night</span>
                                                </div>
                                            </div>
                                            <button
                                                disabled={!villa.available}
                                                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${villa.available
                                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {villa.available ? 'Đặt ngay' : 'Hết phòng'}
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
                                Đặt phòng ngay
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
                                            Ngày nhận phòng *
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày trả phòng *
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số khách
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                            <option>1-2 khách</option>
                                            <option>3-4 khách</option>
                                            <option>5-6 khách</option>
                                            <option>7-8 khách</option>
                                            <option>9+ khách</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Villa mong muốn
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                            <option>Ocean Villa</option>
                                            <option>Garden Villa</option>
                                            <option>Sunset Villa</option>
                                            <option>Tùy chọn tốt nhất</option>
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
                                        placeholder="Ví dụ: Tổ chức sinh nhật, honeymoon, đón tiễn sân bay..."
                                    ></textarea>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        Gửi yêu cầu đặt phòng
                                    </button>
                                    <p className="text-sm text-gray-500 mt-3">
                                        Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold mb-4">Liên hệ trực tiếp</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a
                                    href="https://zalo.me/phoretreat"
                                    className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">💬</span>
                                    Chat qua Zalo
                                </a>
                                <a
                                    href="https://wa.me/+84123456789"
                                    className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">📱</span>
                                    Chat qua WhatsApp
                                </a>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>📞 Hotline: +84 123 456 789 | 📧 retreat@phogroup.vn</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
