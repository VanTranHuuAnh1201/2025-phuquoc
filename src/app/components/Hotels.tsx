export default function Hotels() {
    const hotels = [
        {
            id: 1,
            title: "Villa Ocean Breeze - Pho Retreat",
            subtitle: "Villa riêng tư • Phú Quốc",
            badges: ["Xác nhận tức thời", "Free airport pickup", "Hồ bơi riêng"],
            rating: "4.8",
            reviews: "120",
            bookings: "50+",
            price: "2,500,000",
            originalPrice: null,
            description: "3 phòng ngủ • Hồ bơi riêng • 500m ra biển",
            isPhoGroup: true
        },
        {
            id: 2,
            title: "Vinholidays Fiesta Phú Quốc",
            subtitle: "Khách sạn • Phú Quốc",
            badges: ["Xác nhận tức thời"],
            rating: "4.7",
            reviews: "120",
            bookings: "50+",
            price: "753,924",
            originalPrice: null,
            description: "Resort cao cấp gần biển",
            isPhoGroup: false
        },
        {
            id: 3,
            title: "The Shells Resort & Spa Phu Quoc",
            subtitle: "Khách sạn • Phú Quốc",
            badges: ["Xác nhận tức thời"],
            rating: "4.2",
            reviews: "571",
            bookings: null,
            price: "1,787,108",
            originalPrice: null,
            description: "Resort & Spa sang trọng",
            isPhoGroup: false
        },
        {
            id: 4,
            title: "Villa Sunset Paradise - Pho Retreat",
            subtitle: "Villa riêng tư • Phú Quốc",
            badges: ["Xác nhận tức thời", "Self check-in", "Gần chợ đêm"],
            rating: "4.7",
            reviews: "85",
            bookings: "30+",
            price: "1,800,000",
            originalPrice: null,
            description: "2 phòng ngủ • Gần chợ đêm • BBQ",
            isPhoGroup: true
        }
    ]

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                        Nơi ở ở Phú Quốc
                    </h2>
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold text-brand-600">Pho Retreat</span> - Villa riêng tư của chúng tôi
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white ${hotel.isPhoGroup ? 'ring-2 ring-brand-200' : ''}`}>
                            {/* Image placeholder */}
                            <div className="aspect-[4/3] bg-gradient-to-br from-emerald-400 to-blue-500 relative">
                                <div className="absolute inset-0 skeleton"></div>
                                {/* Pho Group badge */}
                                {hotel.isPhoGroup && (
                                    <div className="absolute top-3 left-3 bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        Pho Retreat
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                {/* Title */}
                                <h3 className="font-semibold text-lg mb-2">
                                    {hotel.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-2">{hotel.description}</p>

                                {/* Category */}
                                <p className="text-sm text-gray-500 mb-2">{hotel.subtitle}</p>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {hotel.badges.map((badge, index) => (
                                        <span key={index} className={`text-xs px-2 py-1 rounded ${hotel.isPhoGroup ? 'bg-brand-50 text-brand-700' : 'bg-green-50 text-green-700'}`}>
                                            {badge}
                                        </span>
                                    ))}
                                </div>

                                {/* Rating & Reviews */}
                                <div className="flex items-center gap-2 mb-3 text-sm">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-semibold">{hotel.rating}</span>
                                    <span className="text-gray-500">({hotel.reviews})</span>
                                    {hotel.bookings && (
                                        <>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-500">{hotel.bookings} Đã được đặt</span>
                                        </>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-red-600">
                                            Từ ₫ {parseInt(hotel.price).toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500">/đêm</span>
                                    </div>

                                    {hotel.isPhoGroup && (
                                        <button className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700">
                                            Đặt ngay
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* External partners */}
                <div className="mt-8 p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold mb-3">Tìm thêm nơi ở qua đối tác của chúng tôi:</h3>
                    <div className="flex gap-3">
                        <a
                            href="https://booking.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                        >
                            Booking.com
                        </a>
                        <a
                            href="https://airbnb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
                        >
                            Airbnb
                        </a>
                    </div>
                </div>

                {/* View more */}
                <div className="text-center mt-8">
                    <button className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold">
                        Xem thêm nơi ở
                    </button>
                </div>
            </div>
        </section>
    )
}
