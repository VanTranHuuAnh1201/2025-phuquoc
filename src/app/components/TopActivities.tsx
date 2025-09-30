export default function TopActivities() {
    const activities = [
        {
            id: 1,
            title: "Vé Sun World Hon Thom",
            subtitle: "Cáp treo • Phú Quốc",
            rating: "4.7",
            reviews: "5,170",
            bookings: "200K+",
            price: "940,000",
            originalPrice: "950,000",
            badges: ["Xác nhận tức thời"],
            category: "Công viên giải trí",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Vé VinWonders Phú Quốc",
            subtitle: "Công viên giải trí • Phú Quốc",
            rating: "4.6",
            reviews: "3,950",
            bookings: "100K+",
            price: "940,000",
            originalPrice: "950,000",
            badges: ["Đặt ngay hôm nay", "Xác nhận tức thời"],
            category: "Công viên giải trí",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Vé Vinpearl Safari Phú Quốc",
            subtitle: "Sở thú & Thuỷ cung • Phú Quốc",
            rating: "4.7",
            reviews: "3,242",
            bookings: "100K+",
            price: "940,000",
            originalPrice: "950,000",
            badges: ["Đặt ngay hôm nay", "Xác nhận tức thời"],
            category: "Động vật hoang dã",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Vé Show Kiss of the Sea Phú Quốc",
            subtitle: "Sự kiện & Show diễn • Phú Quốc",
            rating: "4.6",
            reviews: "610",
            bookings: "30K+",
            price: "940,000",
            originalPrice: "980,000",
            badges: ["Xác nhận tức thời"],
            category: "Show diễn",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ]

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                        Vui chơi & Trải nghiệm hàng đầu ở Phú Quốc
                    </h2>
                    <a href="#" className="text-brand-600 hover:text-brand-700 font-medium hidden md:block">
                        Xem 73 hoạt động ở Phú Quốc
                    </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="group cursor-pointer">
                            {/* Image with heart icon */}
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Heart icon */}
                                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                {/* Discount badge */}
                                {activity.originalPrice && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                        -{Math.round((1 - parseInt(activity.price) / parseInt(activity.originalPrice)) * 100)}%
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                {/* Category */}
                                <p className="text-sm text-gray-500">{activity.subtitle}</p>

                                {/* Title */}
                                <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                                    {activity.title}
                                </h3>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-1">
                                    {activity.badges.slice(0, 2).map((badge, index) => (
                                        <span key={index} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                                            {badge}
                                        </span>
                                    ))}
                                </div>

                                {/* Rating & Reviews */}
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-semibold">{activity.rating}</span>
                                        <span className="text-gray-500">({activity.reviews})</span>
                                    </div>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500">{activity.bookings} Đã được đặt</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">
                                        Từ ₫ {parseInt(activity.price).toLocaleString()}
                                    </span>
                                    {activity.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ₫ {parseInt(activity.originalPrice).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile view more button */}
                <div className="text-center mt-8 md:hidden">
                    <button className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold">
                        Xem thêm hoạt động
                    </button>
                </div>
            </div>
        </section>
    )
}

