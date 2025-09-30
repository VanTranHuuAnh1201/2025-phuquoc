export default function Transportation() {
    const transports = [
        {
            id: 1,
            title: "Thuê Xe Riêng Tại Phú Quốc",
            subtitle: "Thuê xe có tài xế riêng • Phú Quốc",
            badges: ["Đặt trước cho ngày mai", "Lịch trình tuỳ chỉnh", "Miễn phí huỷ", "Xác nhận tức thời"],
            rating: "4.4",
            reviews: "716",
            bookings: "3K+",
            price: "931,000",
            originalPrice: null,
            saleTag: "Sale",
            discount: "Giảm 5%",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Xe Đưa Đón Sân Bay Sân bay quốc tế Phú Quốc | Phú Quốc",
            subtitle: "Xe sân bay • Phú Quốc",
            badges: ["Bán chạy", "Xác nhận tức thời"],
            rating: "4.7",
            reviews: "1,663",
            bookings: "8K+",
            price: "220,191",
            originalPrice: null,
            saleTag: null,
            discount: null,
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Thuê xe riêng có tài xế ở Phú Quốc (Không giới hạn quãng đường)",
            subtitle: "Thuê xe có tài xế riêng • Phú Quốc",
            badges: ["Đặt trước cho ngày mai", "Lịch trình tuỳ chỉnh", "Miễn phí huỷ", "Xác nhận tức thời"],
            rating: "4.8",
            reviews: "59",
            bookings: "600+",
            price: "1,380,000",
            originalPrice: "1,550,000",
            saleTag: null,
            discount: null,
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Tàu cao tốc: Đảo Phú Quốc - Hà Tiên của Superdong",
            subtitle: "Phà • Phú Quốc",
            badges: ["Đặt trước cho ngày mai", "Miễn phí huỷ", "Xác nhận tức thời"],
            rating: null,
            reviews: null,
            bookings: "50+",
            price: "256,500",
            originalPrice: null,
            saleTag: "Sale",
            discount: "Giảm 5%",
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ]
    return (
        <section className="py-8 bg-white/80 backdrop-blur-sm rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            🚗 Phương tiện đi lại ở Phú Quốc
                        </h2>
                        <p className="text-gray-600 mt-2">Dịch vụ vận chuyển tiện lợi và an toàn</p>
                    </div>
                    <a href="#" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg hidden md:block">
                        <span>Xem tất cả</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {transports.map((transport, index) => (
                        <div
                            key={transport.id}
                            className="group cursor-pointer animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                {/* Image with heart icon and badges */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={transport.image}
                                        alt={transport.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Heart icon */}
                                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all transform hover:scale-110">
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    {/* Sale badge */}
                                    {transport.saleTag && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                                            🔥 {transport.saleTag}
                                        </div>
                                    )}

                                    {/* Discount badge */}
                                    {transport.discount && (
                                        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                                            {transport.discount}
                                        </div>
                                    )}
                                </div>                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    {/* Category */}
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{transport.subtitle}</p>

                                    {/* Title */}
                                    <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                                        {transport.title}
                                    </h3>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-1">
                                        {transport.badges.slice(0, 1).map((badge, index) => (
                                            <span key={index} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                                                ✓ {badge}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Rating & Reviews */}
                                    {transport.rating && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="font-bold">{transport.rating}</span>
                                                <span className="text-gray-500">({transport.reviews})</span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-500">{transport.bookings} đặt</span>
                                        </div>
                                    )}

                                    {/* Price & Button */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">
                                                ₫{parseInt(transport.price).toLocaleString()}
                                            </span>
                                            {transport.originalPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ₫{parseInt(transport.originalPrice).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-xs font-bold rounded-lg transition-all transform hover:scale-105 shadow-md">
                                            Đặt ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>                {/* Mobile view more button */}
                <div className="text-center mt-8 md:hidden">
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg">
                        <span>Xem thêm phương tiện</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}


