/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function TopActivities() {
    const { t } = useLanguage();
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
        <section className="py-8 bg-white/80 backdrop-blur-sm rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            {t.sections.topActivities}
                        </h2>
                        <p className="text-gray-600 mt-2">Những trải nghiệm hàng đầu tại Phú Quốc</p>
                    </div>
                    <Link href="/1-things-to-do"
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-xl transition-colors shadow-lg ">
                        <span>{t.common.viewMore}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="group cursor-pointer">
                            <div className="bg-white rounded-xl border-2 border-transparent hover:border-orange-200 transition-colors duration-200 overflow-hidden shadow-md hover:shadow-lg">
                                {/* Image with heart icon */}
                                <div className="relative aspect-[16/10] overflow-hidden">                                    <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />{/* Heart icon */}
                                    <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors">
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>                                    {/* Discount badge */}
                                    {activity.originalPrice && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                            -{Math.round((1 - parseInt(activity.price) / parseInt(activity.originalPrice)) * 100)}%
                                        </div>
                                    )}
                                </div>                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    {/* Category */}
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{activity.subtitle}</p>

                                    {/* Title */}
                                    <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                                        {activity.title}
                                    </h3>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-1">
                                        {activity.badges.slice(0, 1).map((badge, index) => (
                                            <span key={index} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                                                ✓ {badge}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Rating & Reviews */}
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="font-bold">{activity.rating}</span>
                                            <span className="text-gray-500">({activity.reviews})</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500">{activity.bookings} đặt</span>
                                    </div>

                                    {/* Price & Button */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">
                                                ₫{parseInt(activity.price).toLocaleString()}
                                            </span>
                                            {activity.originalPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ₫{parseInt(activity.originalPrice).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                                            Đặt ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>                {/* Mobile view more button */}
                <div className="text-center mt-8 md:hidden">
                    <a href="/1-things-to-do" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors shadow-lg">
                        <span>Xem tất cả hoạt động</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}

