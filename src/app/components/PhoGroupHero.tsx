'use client'

import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

type Tab = 'explore' | 'things' | 'food' | 'retreat' | 'travel'

interface Props {
    activeTab?: Tab
}

export default function PhoGroupHero({ activeTab = 'explore' }: Props) {
    const { currentLocale } = useLanguage()
    return (
        <section className="bg-white">
            <div className="relative">
                {/* Hero Image Background - Mobile Responsive */}
                <div className="h-64 sm:h-80 lg:h-96 relative overflow-hidden">
                    {/* Background Image - Real Phu Quoc Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`
                        }}
                    ></div>

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>

                    {/* Content overlay - Mobile First Design */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4">
                            Phú Quốc
                        </h1>
                        <div className="max-w-4xl">
                            <p className="text-sm sm:text-base lg:text-lg text-white/95 leading-relaxed mb-4">
                                Phú Quốc, hòn đảo lớn nhất Việt Nam, là thiên đường nhiệt đới nổi tiếng với những bãi biển cát trắng, làn nước trong vắt và cảnh quan tuyệt đẹp. Hòn đảo này là nơi có các điểm tham quan thú vị như <span className="font-semibold">VinWonders Phú Quốc</span>, công viên giải trí đẳng cấp thế giới với các trò chơi và hoạt động giải trí lý kì, và <span className="font-semibold">Vinpearl Safari</span>, công viên bảo tồn động vật hoang dã lớn nhất cả nước.
                            </p>
                            <button className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium text-sm sm:text-base">
                                Xem thêm
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation - Mobile Responsive */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex gap-6 lg:gap-8">
                            <Link
                                href={`/${currentLocale}`}
                                className={`${activeTab === 'explore' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-900'} px-1 py-4 border-b-2 font-medium flex items-center gap-2`}
                            >
                                <span>🏙️</span>
                                Khám phá Phú Quốc
                            </Link>
                            <Link
                                href={`/${currentLocale}/1-things-to-do`}
                                className={`${activeTab === 'things' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-900'} px-1 py-4 border-b-2 font-medium flex items-center gap-2`}
                            >
                                <span>🎢</span>
                                Vui chơi & Trải nghiệm
                            </Link>
                            <Link
                                href={`/${currentLocale}/pho-food`}
                                className={`${activeTab === 'food' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-900'} px-1 py-4 border-b-2 font-medium flex items-center gap-2`}
                            >
                                <span>🐟</span>
                                PhoFood - Hải sản
                            </Link>
                            <Link
                                href={`/${currentLocale}/pho-retreat`}
                                className={`${activeTab === 'retreat' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-900'} px-1 py-4 border-b-2 font-medium flex items-center gap-2`}
                            >
                                <span>🏖️</span>
                                Pho Retreat - Villa
                            </Link>
                            <Link
                                href={`/${currentLocale}/pho-travel`}
                                className={`${activeTab === 'travel' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-900'} px-1 py-4 border-b-2 font-medium flex items-center gap-2`}
                            >
                                <span>✈️</span>
                                Pho Travel - Tour
                            </Link>
                        </div>

                        {/* Mobile Navigation - Horizontal Scroll */}
                        <div className="md:hidden overflow-x-auto">
                            <div className="flex gap-4 min-w-max py-2">
                                <Link
                                    href={`/${currentLocale}`}
                                    className={`${activeTab === 'explore' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-transparent text-gray-600'} px-3 py-2 border-b-2 font-medium flex items-center gap-2 rounded-t-lg transition-colors whitespace-nowrap text-sm`}
                                >
                                    <span>🏙️</span>
                                    Khám phá
                                </Link>
                                <Link
                                    href={`/${currentLocale}/1-things-to-do`}
                                    className={`${activeTab === 'things' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-transparent text-gray-600'} px-3 py-2 border-b-2 font-medium flex items-center gap-2 rounded-t-lg transition-colors whitespace-nowrap text-sm`}
                                >
                                    <span>🎢</span>
                                    Vui chơi
                                </Link>
                                <Link
                                    href={`/${currentLocale}/pho-food`}
                                    className={`${activeTab === 'food' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-transparent text-gray-600'} px-3 py-2 border-b-2 font-medium flex items-center gap-2 rounded-t-lg transition-colors whitespace-nowrap text-sm`}
                                >
                                    <span>🐟</span>
                                    Hải sản
                                </Link>
                                <Link
                                    href={`/${currentLocale}/pho-retreat`}
                                    className={`${activeTab === 'retreat' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-transparent text-gray-600'} px-3 py-2 border-b-2 font-medium flex items-center gap-2 rounded-t-lg transition-colors whitespace-nowrap text-sm`}
                                >
                                    <span>🏖️</span>
                                    Villa
                                </Link>
                                <Link
                                    href={`/${currentLocale}/pho-travel`}
                                    className={`${activeTab === 'travel' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-transparent text-gray-600'} px-3 py-2 border-b-2 font-medium flex items-center gap-2 rounded-t-lg transition-colors whitespace-nowrap text-sm`}
                                >
                                    <span>✈️</span>
                                    Tour
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
