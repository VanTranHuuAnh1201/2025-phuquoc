'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function TopDestinations() {
    const { t } = useLanguage();

    const destinations = [
        {
            id: 1,
            title: "Bãi Sao",
            description: "Bãi Sao Phú Quốc được xếp vào Top 10 bãi biển hoang sơ và yên bình nhất trên thế giới. Bãi Sao được mệnh danh là một thiên đường nhiệt đới với cảnh quan biển tuyệt đẹp cùng những hàng cây cọ xanh mướt, cát trắng mịn và nước biển trong xanh, trải đầy sao biển.",
            category: "Cảnh quan du lịch",
            rating: "4.8",
            reviews: "12K+"
        },
        {
            id: 2,
            title: "Grand World Phú Quốc",
            description: "Grand World Phu Quoc là một khu vui chơi và mua sắm sôi động nằm ở trung tâm của đảo Phú Quốc. Được biết đến với cái tên 'Thành phố không ngủ,' điểm đến này cung cấp các hoạt động không ngừng và kiến trúc ấn tượng lấy cảm hứng từ các thành phố châu Âu.",
            category: "Cảnh quan du lịch",
            rating: "4.8",
            reviews: "11K+"
        },
        {
            id: 3,
            title: "Vinpearl Safari Phú Quốc",
            description: "Bắt đầu cuộc phiêu lưu hoang dã tại Vinpearl Safari ở Phú Quốc, công viên safari lớn nhất tại Việt Nam, nơi bạn sẽ bị mê hoặc bởi vẻ đẹp của dãy núi, rừng rậm, và những kỳ quan của thiên nhiên.",
            category: "Cảnh quan du lịch",
            rating: "4.7",
            reviews: "800+"
        },
        {
            id: 4,
            title: "Hòn Thơm",
            description: "Đảo Hòn Thơm, còn được biết đến với tên gọi hòn thơm, là một hòn đảo tuyệt đẹp ở Phú Quốc. Nằm ở trung tâm của đại dương, hòn đảo này mang đến vẻ đẹp tự nhiên tuyệt vời và một không khí yên bình khiến bạn ngỡ ngàng.",
            category: "Cảnh quan du lịch",
            rating: "4.8",
            reviews: "9K+"
        },
        {
            id: 5,
            title: "Dương Đông Phú Quốc",
            description: "Chào mừng bạn đến với Thị trấn Dương Đông ở Phú Quốc, một thủ đô sôi động và nhộn nhịp mang đến sự kết hợp độc đáo giữa văn hóa, lịch sử và vẻ đẹp tự nhiên. Khám phá những con phố sặc sỡ, chợ náo nhiệt và chùa linh thiêng.",
            category: "Cảnh quan du lịch",
            rating: "4.8",
            reviews: "4K+"
        },
        {
            id: 6,
            title: "Vườn Tiêu Phú Quốc",
            description: "Bắt đầu hành trình đầy hương vị đến Phú Quốc, một hòn đảo nổi tiếng với các trang trại tiêu nổi tiếng tại Việt Nam. Khám phá sức hấp dẫn độc đáo của tiêu Phú Quốc, nổi tiếng với hương vị thơm ngon và chua cay.",
            category: "Bảo tàng",
            rating: "4.9",
            reviews: "6K+"
        }
    ]

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                        {t.sections.topDestinations}
                    </h2>
                    <button className="hidden sm:block px-4 py-2 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold text-sm">
                        {t.common.viewMore}
                    </button>
                </div>

                {/* Horizontal scroll container */}
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 w-max">
                        {destinations.map((destination) => (
                            <div key={destination.id} className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow w-80 flex-shrink-0">
                                {/* Image with absolute positioned elements */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-green-400 to-blue-500 relative">
                                    <div className="absolute inset-0 skeleton"></div>

                                    {/* Category tag - top left */}
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                                            {destination.category}
                                        </span>
                                    </div>

                                    {/* Rating - bottom left */}
                                    <div className="absolute bottom-3 left-3">
                                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                            <span className="text-yellow-500 text-sm">★</span>
                                            <span className="font-semibold text-sm text-gray-900">{destination.rating}</span>
                                            <span className="text-gray-600 text-xs">({destination.reviews} {t.common.rating})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Compact content */}
                                <div className="p-3">
                                    <h3 className="font-semibold text-base mb-2 leading-tight">
                                        {destination.title}
                                    </h3>

                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                        {destination.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile view more button */}
                <div className="text-center mt-4 sm:hidden">
                    <button className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold">
                        {t.common.viewMore}
                    </button>
                </div>
            </div>
        </section>
    )
}