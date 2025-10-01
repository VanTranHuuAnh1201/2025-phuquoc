/* eslint-disable @next/next/no-img-element */
'use client';

import { destinations } from '@/mockup/website';
import Link from 'next/link';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function TopDestinations() {
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
                            <strong style={{ backgroundColor: 'white', color: 'white' }}>🏖️</strong>Điểm đến nổi bật
                        </h2>
                        <p className="text-gray-600 mt-2">Những địa điểm không thể bỏ qua khi đến với Phú Quốc</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden md:flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={scrollLeft}
                                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={scrollRight}
                                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
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
                </div>

                <div className="relative overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {/* Group destinations into sets of 4 */}
                        {Array.from({ length: Math.ceil(destinations.length / 4) }, (_, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                {destinations.slice(groupIndex * 4, (groupIndex + 1) * 4).map((destination) => (
                                    <Link
                                        key={destination.id}
                                        href={`/${currentLocale}/destinations/${destination.id}`}
                                        className="group cursor-pointer block"
                                    >
                                        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 h-full flex flex-col">
                                            <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                                                <img
                                                    src={destination.images}
                                                    alt={destination.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />

                                                {/* Category tag - top left */}
                                                <div className="absolute top-2 left-2">
                                                    <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 shadow-sm">
                                                        {destination.category}
                                                    </span>
                                                </div>

                                                {/* Rating - bottom left */}
                                                <div className="absolute bottom-2 left-2">
                                                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                                                        <span className="text-yellow-400 text-xs">⭐</span>
                                                        <span className="font-bold text-xs text-white">{destination.rating}</span>
                                                        <span className="text-white/90 text-xs">({destination.reviews})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content - Compact with flex layout */}
                                            <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                                                <h3 className="font-bold text-sm sm:text-base leading-tight text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                                                    {destination.title}
                                                </h3>

                                                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mt-auto">
                                                    {destination.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>                {/* Mobile view more button */}
                <div className="text-center mt-6 sm:mt-8 sm:hidden">
                    <Link href={`/${currentLocale}/1-things-to-do`} className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-lg sm:rounded-xl transition-colors shadow-lg text-sm sm:text-base">
                        <span>Xem tất cả điểm đến</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}