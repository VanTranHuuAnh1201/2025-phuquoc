'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { travelGuidesData, type SpecialGuide, type TravelGuide } from '../lib/data';

interface GuideCardProps {
    guide: TravelGuide;
}

function GuideCard({ guide }: GuideCardProps) {
    return (
        <Link href={`/guides/${guide.id}`} className="group cursor-pointer block">
            <article className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                    <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                        <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 shadow-sm">
                            {guide.category}
                        </span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>

                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                    <h3 className="font-bold text-sm sm:text-base leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                        {guide.title}
                    </h3>

                    {guide.excerpt && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {guide.excerpt}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                        <span className="font-medium">{guide.author}</span>
                        <div className="flex items-center gap-2">
                            <span>📖 {guide.readTime}</span>
                            <span>👀 {guide.views}</span>
                        </div>
                    </div>

                    {guide.tags && (
                        <div className="flex flex-wrap gap-1">
                            {guide.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded-full font-medium">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}

interface SpecialGuideCardProps {
    guide: SpecialGuide;
}

function SpecialGuideCard({ guide }: SpecialGuideCardProps) {
    const iconMap = {
        villa: '🏖️',
        food: '🍽️',
        travel: '🗺️'
    };

    return (
        <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <span className="text-2xl">{iconMap[guide.type || 'travel']}</span>
                <div className="flex-1">
                    <h4 className="font-semibold mb-2">{guide.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-brand-600 font-medium">{guide.author}</span>
                        <button className="text-sm text-brand-600 hover:text-brand-700 transition-colors">
                            Đọc ngay →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TravelGuides() {
    const specialGuidesScrollRef = useRef<HTMLDivElement>(null);
    const activitiesScrollRef = useRef<HTMLDivElement>(null);
    const foodScrollRef = useRef<HTMLDivElement>(null);

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

    const activitiesGuides = travelGuidesData.filter(guide => guide.category === "Hoạt động nên trải nghiệm");
    const foodGuides = travelGuidesData.filter(guide => guide.category === "Đồ ăn & thức uống");

    return (
        <section className="py-4 sm:py-6 bg-white/90 backdrop-blur-sm rounded-2xl mx-2 sm:mx-3 lg:mx-4 shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        📚 Cẩm nang du lịch
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
                        Hướng dẫn chi tiết cho chuyến đi hoàn hảo
                    </p>
                </div>

                {/* Activities & Experiences Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">🎯 Hoạt động & Trải nghiệm</h3>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => scrollLeft(activitiesScrollRef)}
                                    className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => scrollRight(activitiesScrollRef)}
                                    className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden">
                        <div
                            ref={activitiesScrollRef}
                            className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {/* Group activities guides into sets of 4 */}
                            {Array.from({ length: Math.ceil(activitiesGuides.length / 4) }, (_, groupIndex) => (
                                <div
                                    key={groupIndex}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    {activitiesGuides.slice(groupIndex * 4, (groupIndex + 1) * 4).map((guide) => (
                                        <div key={guide.id} className="h-full">
                                            <GuideCard guide={guide} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Food & Drinks Guides */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">🍽️ Ẩm thực & Đặc sản</h3>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => scrollLeft(foodScrollRef)}
                                    className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => scrollRight(foodScrollRef)}
                                    className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden">
                        <div
                            ref={foodScrollRef}
                            className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {/* Group food guides into sets of 4 */}
                            {Array.from({ length: Math.ceil(foodGuides.length / 4) }, (_, groupIndex) => (
                                <div
                                    key={groupIndex}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    {foodGuides.slice(groupIndex * 4, (groupIndex + 1) * 4).map((guide) => (
                                        <div key={guide.id} className="h-full">
                                            <GuideCard guide={guide} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* View more */}
                <div className="text-center mt-6 sm:mt-8">
                    <Link href="#" className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-lg sm:rounded-xl transition-colors shadow-lg text-sm sm:text-base">
                        <span>Xem thêm hướng dẫn</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}