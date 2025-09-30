'use client'

import Image from 'next/image';
import Link from 'next/link';
import { specialGuidesData, travelGuidesData, type SpecialGuide, type TravelGuide } from '../lib/data';

interface GuideCardProps {
    guide: TravelGuide;
}

function GuideCard({ guide }: GuideCardProps) {
    return (
        <Link href={`/guides/${guide.id}`} className="group">
            <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                <div className="relative aspect-[4/3]">
                    <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {guide.category}
                    </div>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {guide.title}
                    </h3>

                    {guide.excerpt && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.excerpt}</p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="font-medium">{guide.author}</span>
                        <div className="flex items-center gap-3">
                            <span>📖 {guide.readTime}</span>
                            <span>👀 {guide.views}</span>
                        </div>
                    </div>

                    {guide.tags && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {guide.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
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
    // Group guides by category
    const activitiesGuides = travelGuidesData.filter(guide => guide.category === "Hoạt động nên trải nghiệm");
    const foodGuides = travelGuidesData.filter(guide => guide.category === "Đồ ăn & thức uống");

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Hướng dẫn du lịch Phú Quốc
                </h2>

                {/* Special Pho Group content */}
                <div className="mb-8 p-6 bg-brand-50 rounded-lg border border-brand-200">
                    <h3 className="text-lg font-semibold mb-4 text-brand-800">
                        📖 Nội dung độc quyền từ Pho Group
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {specialGuidesData.map((guide, index) => (
                            <SpecialGuideCard key={index} guide={guide} />
                        ))}
                    </div>
                </div>

                {/* Activities Guides */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">🎯 Hoạt động & Trải nghiệm</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activitiesGuides.map((guide) => (
                            <GuideCard key={guide.id} guide={guide} />
                        ))}
                    </div>
                </div>

                {/* Food & Drinks Guides */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">🍽️ Ẩm thực & Đặc sản</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {foodGuides.map((guide) => (
                            <GuideCard key={guide.id} guide={guide} />
                        ))}
                    </div>
                </div>

                {/* View more */}
                <div className="text-center mt-8">
                    <button className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold transition-colors">
                        Xem thêm hướng dẫn
                    </button>
                </div>
            </div>
        </section>
    )
}