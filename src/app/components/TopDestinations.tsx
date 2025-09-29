export default function TopDestinations() {
    const destinations = [
        {
            id: 1,
            title: "Bãi Sao",
            description: "Bãi Sao Phú Quốc được xếp vào Top 10 bãi biển hoang sơ và yên bình nhất trên thế giới. Bãi Sao được mệnh danh là một thiên đường nhiệt đới với cảnh quan biển tuyệt đẹp cùng những hàng cây cọ xanh mướt, cát trắng mịn và nước biển trong xanh, trải đầy sao biển.",
            category: "Địa điểm du lịch",
            rating: "4.9",
            reviews: "6K+",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "grand world phú quốc",
            description: "Grand World Phu Quoc là một khu vui chơi và mua sắm sôi động nằm ở trung tâm của đảo Phú Quốc. Được biết đến với cái tên 'Thành phố không ngủ,' điểm đến này cung cấp các hoạt động không ngừng và kiến trúc ấn tượng lấy cảm hứng từ các thành phố châu Âu.",
            category: "Cảnh quan du lịch",
            rating: "4.8",
            reviews: "11K+",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "vinpearl safari phú quốc",
            description: "Bắt đầu cuộc phiêu lưu hoang dã tại Vinpearl Safari ở Phú Quốc, công viên safari lớn nhất tại Việt Nam, nơi bạn sẽ bị mê hoặc bởi vẻ đẹp của dãy núi, rừng rậm, và những kỳ quan của thiên nhiên.",
            category: "Cảnh quan du lịch",
            rating: "4.8",
            reviews: "11K+",
            image: "https://images.unsplash.com/photo-1549366021-9f761d040fb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "hòn Thơm",
            description: "Đảo Hòn Thơm, còn được biết đến với tên gọi hòn thơm, là một hòn đảo tuyệt đẹp ở Phú Quốc. Nằm ở trung tâm của đại dương, hòn đảo này mang đến vẻ đẹp tự nhiên tuyệt vời và một không khí yên bình khiến bạn ngỡ ngàng.",
            category: "Cảnh quan du lịch",
            rating: "4.7",
            reviews: "800+",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ]

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Điểm tham quan hàng đầu ở Phú Quốc
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.map((destination) => (
                        <div key={destination.id} className="group cursor-pointer">
                            {/* Image with category badge */}
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                                <img
                                    src={destination.image}
                                    alt={destination.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Category badge */}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                    {destination.category}
                                </div>

                                {/* Rating badge */}
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded text-sm font-semibold flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span>{destination.rating}</span>
                                    <span className="text-gray-500">({destination.reviews} đánh giá)</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                {/* Title */}
                                <h3 className="font-semibold text-lg leading-tight group-hover:text-orange-500 transition-colors">
                                    {destination.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                    {destination.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
