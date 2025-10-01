/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Transportation() {
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

    const transports = [
        {
            id: 1,
            title: "Thuê Xe Riêng Tại Phú Quốc",
            subtitle: "Thuê xe có tài xế riêng • Phú Quốc",
            badges: ["Đặt trước cho ngày mai", "Lịch trình tuỳ chỉnh"],
            rating: "4.4",
            reviews: "716",
            bookings: "3K+",
            price: "931,000",
            originalPrice: null,
            image: "/images/phuongtiendulich-1.webp"
        },
        {
            id: 2,
            title: "Xe Đưa Đón Sân Bay Quốc Tế Phú Quốc",
            subtitle: "Xe sân bay • Phú Quốc",
            badges: ["Bán chạy", "Xác nhận tức thời"],
            rating: "4.7",
            reviews: "1,663",
            bookings: "8K+",
            price: "220,191",
            originalPrice: null,
            image: "/images/phuongtiendulich-2.webp"
        },
        {
            id: 3,
            title: "Thuê xe riêng có tài xế ở Phú Quốc",
            subtitle: "Thuê xe có tài xế riêng • Phú Quốc",
            badges: ["Đặt trước cho ngày mai", "Lịch trình tuỳ chỉnh"],
            rating: "4.8",
            reviews: "59",
            bookings: "600+",
            price: "1,380,000",
            originalPrice: "1,550,000",
            image: "/images/phuongtiendulich-3.webp"
        },
        {
            id: 4,
            title: "Tàu cao tốc Phú Quốc - Hà Tiên",
            subtitle: "Phà • Phú Quốc",
            badges: ["Đặt trước cho ngày mai", "Miễn phí huỷ"],
            rating: "4.5",
            reviews: "234",
            bookings: "1K+",
            price: "256,500",
            originalPrice: null,
            image: "/images/phuongtiendulich-4.webp"
        },
        {
            id: 5,
            title: "Thuê Xe Máy Tại Phú Quốc",
            subtitle: "Thuê xe máy • Phú Quốc",
            badges: ["Giá rẻ", "Thuận tiện"],
            rating: "4.6",
            reviews: "892",
            bookings: "5K+",
            price: "150,000",
            originalPrice: null,
            image: "/images/phuongtiendulich-5.webp"
        },
        {
            id: 6,
            title: "Xe Buýt Du Lịch Phú Quốc",
            subtitle: "Xe buýt • Phú Quốc",
            badges: ["Tiết kiệm", "Thoải mái"],
            rating: "4.3",
            reviews: "445",
            bookings: "2K+",
            price: "50,000",
            originalPrice: null,
            image: "/images/phuongtiendulich-6.webp"
        }
    ];

    if (!t || !t.sections) {
        return (
            <section className="py-8 bg-white/80 backdrop-blur-sm rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gray-200 rounded-xl h-64 flex-shrink-0 w-64"></div>
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
                            <strong style={{ backgroundColor: 'white', color: 'white' }}>🚗 </strong>Di chuyển thuận tiện
                        </h2>
                        <p className="text-gray-600 mt-2">Các phương tiện di chuyển tốt nhất tại Phú Quốc</p>
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
                        <Link href="#"
                            className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-lg sm:rounded-xl transition-colors shadow-lg text-sm sm:text-base">
                            <span className="hidden sm:inline">Xem tất cả</span>
                            <span className="sm:hidden">Xem thêm</span>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        {/* Group transports into sets of 4 */}
                        {Array.from({ length: Math.ceil(transports.length / 4) }, (_, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                {transports.slice(groupIndex * 4, (groupIndex + 1) * 4).map((transport) => (
                                    <Link
                                        key={transport.id}
                                        href={`#transport-${transport.id}`}
                                        className="group cursor-pointer block"
                                    >
                                        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 h-full flex flex-col">
                                            <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                                                <img
                                                    src={transport.image}
                                                    alt={transport.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />

                                                <div className="absolute top-2 left-2">
                                                    <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 shadow-sm">
                                                        {transport.subtitle}
                                                    </span>
                                                </div>

                                                {transport.originalPrice && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                                                        -{Math.round((1 - parseInt(transport.price) / parseInt(transport.originalPrice)) * 100)}%
                                                    </div>
                                                )}

                                                <div className="absolute bottom-2 left-2">
                                                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                                                        <span className="text-yellow-400 text-xs">⭐</span>
                                                        <span className="font-bold text-xs text-white">{transport.rating}</span>
                                                        <span className="text-white/90 text-xs">({transport.reviews})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-3">
                                                <h3 className="font-bold text-base leading-tight text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                                                    {transport.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {transport.badges.slice(0, 2).map((badge, index) => (
                                                        <span key={index} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium border border-green-200">
                                                            ✓ {badge}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs text-gray-500 mb-1">Từ</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-gray-900">
                                                                đ{parseInt(transport.price).toLocaleString()}
                                                            </span>
                                                            {transport.originalPrice && (
                                                                <span className="text-sm text-gray-400 line-through">
                                                                    đ{parseInt(transport.originalPrice).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {transport.bookings} đặt
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
            </div>
        </section>
    )
}