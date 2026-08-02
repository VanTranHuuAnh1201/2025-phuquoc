'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { hotelsData, type Hotel } from '../lib/data';

interface HotelCardProps {
    hotel: Hotel;
}

function HotelCard({ hotel }: HotelCardProps) {
    return (
        <Link href={`/hotels/${hotel.id}`} className="group">
            <div className={`bg-white rounded-2xl border-2 border-transparent hover:border-orange-200 transition-colors shadow-lg hover:shadow-xl overflow-hidden ${hotel.isPhoGroup ? 'border-orange-300' : ''}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={hotel.image}
                        alt={hotel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    {hotel.isPhoGroup && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            🏖️ Pho Retreat
                        </div>
                    )}
                </div>
                <div className="p-4 space-y-3">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {hotel.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2">{hotel.description}</p>
                    <p className="text-xs text-gray-500">{hotel.subtitle}</p>

                    {hotel.location && (
                        <p className="text-xs text-orange-600 font-medium">📍 {hotel.location}</p>
                    )}

                    <div className="flex flex-wrap gap-1">
                        {hotel.badges.slice(0, 1).map((badge, index) => (
                            <span key={index} className={`text-xs px-2 py-1 rounded-full font-medium ${hotel.isPhoGroup ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                                ✓ {badge}
                            </span>
                        ))}
                    </div>

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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-600">
                                Từ ₫ {parseInt(hotel.price).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">/đêm</span>
                        </div>

                        {hotel.isPhoGroup && (
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700 transition-colors"
                            >
                                Đặt ngay
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Hotels() {
    const { t, currentLocale } = useLanguage();
    const phoRetreatVillas = hotelsData.filter(hotel => hotel.isPhoGroup);
    const otherHotels = hotelsData.filter(hotel => !hotel.isPhoGroup);

    const phoRetreatScrollRef = useRef<HTMLDivElement>(null);
    const otherHotelsScrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            containerRef.current.scrollBy({ left: -containerWidth, behavior: 'smooth' });
        }
    };

    const scrollRight = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            containerRef.current.scrollBy({ left: containerWidth, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-6 bg-white/90 backdrop-blur-sm rounded-2xl mx-3 sm:mx-4 lg:mx-6 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        🏨 Lưu trú cao cấp
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Villa và resort sang trọng với dịch vụ hoàn hảo
                    </p>
                </div>
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-orange-600">🏖️ Villa Pho Retreat - Đặc quyền riêng tư</h3>
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => scrollLeft(phoRetreatScrollRef)}
                                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scrollRight(phoRetreatScrollRef)}
                                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="relative overflow-hidden">
                        <div
                            ref={phoRetreatScrollRef}
                            className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {/* Group Pho Retreat villas into sets of 4 */}
                            {Array.from({ length: Math.ceil(phoRetreatVillas.length / 4) }, (_, groupIndex) => (
                                <div 
                                    key={groupIndex}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    {phoRetreatVillas.slice(groupIndex * 4, (groupIndex + 1) * 4).map((hotel) => (
                                        <div key={hotel.id} className="h-full">
                                            <HotelCard hotel={hotel} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">🏨 Khách sạn & Resort khác</h3>
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => scrollLeft(otherHotelsScrollRef)}
                                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scrollRight(otherHotelsScrollRef)}
                                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="relative overflow-hidden">
                        <div
                            ref={otherHotelsScrollRef}
                            className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {/* Group other hotels into sets of 4 */}
                            {Array.from({ length: Math.ceil(otherHotels.length / 4) }, (_, groupIndex) => (
                                <div
                                    key={groupIndex}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    {otherHotels.slice(groupIndex * 4, (groupIndex + 1) * 4).map((hotel) => (
                                        <div key={hotel.id} className="h-full">
                                            <HotelCard hotel={hotel} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">🔗 Tìm thêm nơi ở qua đối tác của chúng tôi</h3>
                        <p className="text-gray-600 text-sm">Khám phá thêm nhiều lựa chọn lưu trú tại Phú Quốc</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="https://booking.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <span className="text-lg">📚</span>
                            <span>Booking.com</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                        <a
                            href="https://airbnb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <span className="text-lg">🏠</span>
                            <span>Airbnb</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="#" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <span>Xem thêm nơi ở</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}
