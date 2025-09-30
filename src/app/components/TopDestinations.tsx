'use client';

import Link from 'next/link';
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
        <section className="py-8 bg-white/80 backdrop-blur-sm rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            {t.sections.topDestinations}
                        </h2>
                        <p className="text-gray-600 mt-2">Khám phá những điểm đến tuyệt vời nhất</p>
                    </div>
                    <Link href="/1-things-to-do"
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-xl transition-colors shadow-lg ">
                        <span>{t.common.viewMore}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>                {/* Horizontal scroll container */}
                <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
                    <div className="flex gap-4 sm:gap-6 w-max px-4 sm:px-0">                        {destinations.map((destination) => (<div
                        key={destination.id}
                        className="bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-orange-200 transition-all duration-200 shadow-lg hover:shadow-xl w-72 sm:w-80 flex-shrink-0 group cursor-pointer"
                    >                            {/* Image with absolute positioned elements */}
                        <div className="aspect-[16/10] bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-300/40 to-pink-300/40 group-hover:from-orange-300/30 group-hover:to-pink-300/30 transition-all duration-300"></div>

                            {/* Fake image placeholder with better visual */}
                            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                                🏝️
                            </div>

                            {/* Category tag - top left */}
                            <div className="absolute top-3 left-3">
                                <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
                                    📍 {destination.category}
                                </span>
                            </div>

                            {/* Rating - bottom left */}
                            <div className="absolute bottom-3 left-3">
                                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                    <span className="text-yellow-500 text-sm">⭐</span>
                                    <span className="font-bold text-sm text-gray-900">{destination.rating}</span>
                                    <span className="text-gray-600 text-xs">({destination.reviews})</span>
                                </div>
                            </div>
                        </div>                                {/* Compact content */}
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 leading-tight text-gray-900 group-hover:text-orange-600 transition-colors">
                                {destination.title}
                            </h3>

                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">
                                {destination.description}
                            </p>

                            <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors shadow-lg text-sm">
                                Khám phá ngay
                            </button>
                        </div>
                    </div>
                    ))}
                    </div>
                </div>                {/* Mobile view more button */}
                <div className="text-center mt-8 sm:hidden">
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors shadow-lg">
                        <span>{t.common.viewMore}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}