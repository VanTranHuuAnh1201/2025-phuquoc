
'use client';
import { activities } from '@/mockup/website';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
export default function TopActivities() {
    const { t, currentLocale } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({ left: -containerWidth, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({ left: containerWidth, behavior: 'smooth' });
        }
    };


    // Fallback if translations are not loaded yet
    if (!t || !t.sections) {
        return (
            <section className="py-8 bg-white/80 backdrop-blur-sm rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-200 rounded-2xl h-64"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4 sm:py-6 bg-white/90 backdrop-blur-sm rounded-2xl mx-2 sm:mx-3 lg:mx-4 shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            <strong style={{ backgroundColor: 'white', color: 'white' }}>🎯</strong> Vui chơi & Trải nghiệm hàng đầu ở Phú Quốc
                        </h2>
                        <p className="text-gray-600 mt-2">  Khám phá những trải nghiệm tuyệt vời nhất tại đảo ngọc Phú Quốc</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={scrollLeft}
                                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={scrollRight}
                                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <Link href={`/${currentLocale}/1-things-to-do`}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-xl transition-colors shadow-lg ">
                            <span>{t.common.viewMore}</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {/* Group activities into sets of 4 */}
                        {Array.from({ length: Math.ceil(activities.length / 4) }, (_, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                {activities.slice(groupIndex * 4, (groupIndex + 1) * 4).map((activity) => (
                                    <Link
                                        key={activity.id}
                                        href={`/${currentLocale}/1-things-to-do/${activity.id}`}
                                        className="group cursor-pointer block"
                                    >
                                        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 h-full flex flex-col">
                                            <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={activity.image}
                                                    alt={activity.title}
                                                    fill
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                                {activity.originalPrice && (
                                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold shadow-md">
                                                        -{Math.round((1 - parseInt(activity.price) / parseInt(activity.originalPrice)) * 100)}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                                    {activity.subtitle}
                                                </p>

                                                <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors flex-1">
                                                    {activity.title}
                                                </h3>

                                                {activity.badges && activity.badges.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {activity.badges.slice(0, 2).map((badge, index) => (
                                                            <span key={index} className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full font-medium border border-green-200">
                                                                ✓ {badge}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-yellow-500">⭐</span>
                                                        <span className="font-bold">{activity.rating}</span>
                                                        <span className="text-gray-500">({activity.reviews})</span>
                                                    </div>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-gray-500 text-xs">{activity.bookings} đã đặt</span>
                                                </div>

                                                <div className="mt-auto pt-1 border-t border-gray-100">
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-gray-500 mr-1">Từ</span>
                                                        <div className="flex items-center gap-1">
                                                            {activity.price === "Free" ? (
                                                                <span className="text-sm sm:text-base font-bold text-green-600">Miễn phí</span>
                                                            ) : (
                                                                <>
                                                                    <span className="text-sm sm:text-base font-bold text-gray-900">
                                                                        đ{parseInt(activity.price).toLocaleString()}
                                                                    </span>
                                                                    {activity.originalPrice && (
                                                                        <span className="text-xs text-gray-400 line-through">
                                                                            đ{parseInt(activity.originalPrice).toLocaleString()}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-6 sm:mt-8 sm:hidden">
                    <Link href={`/${currentLocale}/1-things-to-do`} className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-lg sm:rounded-xl transition-colors shadow-lg text-sm sm:text-base">
                        <span>Xem tất cả hoạt động</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}

