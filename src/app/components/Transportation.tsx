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
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                        Phương tiện đi lại ở Phú Quốc
                    </h2>
                    <a href="#" className="text-orange-500 hover:text-orange-600 font-medium hidden md:block">
                        Xem 7 phương tiện ở Phú Quốc
                    </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {transports.map((transport) => (
                        <div key={transport.id} className="group cursor-pointer">
                            {/* Image with heart icon and badges */}
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                                <img
                                    src={transport.image}
                                    alt={transport.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Heart icon */}
                                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                {/* Sale badge */}
                                {transport.saleTag && (
                                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                        {transport.saleTag}
                                    </div>
                                )}

                                {/* Discount badge */}
                                {transport.discount && (
                                    <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                        {transport.discount}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                {/* Category */}
                                <p className="text-sm text-gray-500">{transport.subtitle}</p>

                                {/* Title */}
                                <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
                                    {transport.title}
                                </h3>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-1">
                                    {transport.badges.slice(0, 3).map((badge, index) => (
                                        <span key={index} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                                            {badge}
                                        </span>
                                    ))}
                                </div>

                                {/* Rating & Reviews */}
                                {transport.rating && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            <span className="font-semibold">{transport.rating}</span>
                                            <span className="text-gray-500">({transport.reviews})</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500">{transport.bookings} Đã được đặt</span>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">
                                        Từ ₫ {parseInt(transport.price).toLocaleString()}
                                    </span>
                                    {transport.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ₫ {parseInt(transport.originalPrice).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile view more button */}
                <div className="text-center mt-8 md:hidden">
                    <button className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 font-semibold">
                        Xem thêm phương tiện
                    </button>
                </div>
            </div>
        </section>
    )
}


