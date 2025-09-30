'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
    const { currentLocale, t, toggleLanguage } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Enhanced */}                    <Link href={`/${currentLocale}`} className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-400 to-pink-500 grid place-items-center text-white font-bold shadow-lg shadow-orange-200">
                            Pho
                        </div>
                        <div className="hidden sm:block">
                            <div className="font-bold text-xl text-gray-900">PhoGroup</div>
                            <div className="text-xs text-gray-500 -mt-1">Khám phá Phú Quốc</div>
                        </div>
                        <div className="block sm:hidden font-bold text-lg text-gray-900">PhoGroup</div>
                    </Link>{/* Right Side - Login, Language & Menu */}
                    <div className="flex items-center gap-2">
                        {/* Login Button */}
                        <Link
                            href="/admin/login"
                            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{currentLocale === 'vi' ? 'Đăng nhập' : 'Login'}</span>
                        </Link>

                        {/* Language Switcher - Minimal */}
                        <button
                            onClick={toggleLanguage}
                            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        >
                            <span className="text-base">{currentLocale === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                            <span className="uppercase font-medium">{currentLocale}</span>
                        </button>

                        {/* Menu Toggle - Clean & Prominent */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="relative p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 group"
                            aria-label="Menu"
                        >
                            <svg
                                className={`w-6 h-6 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 text-orange-600' : 'text-gray-700 group-hover:text-orange-600'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                            {/* Notification dot for active menu */}
                            {isMobileMenuOpen && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-pulse"></div>
                            )}
                        </button>
                    </div>
                </div>                {/* Enhanced Mobile Menu - Full Screen Overlay */}
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <div className="fixed top-16 right-4 left-4 md:right-auto md:left-auto md:w-80 md:top-18 bg-white rounded-2xl shadow-2xl border border-orange-100/50 z-50 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-orange-50 to-pink-50 px-6 py-4 border-b border-orange-100/50">
                                <h3 className="font-semibold text-gray-900">Menu điều hướng</h3>
                                <p className="text-sm text-gray-600 mt-1">Khám phá các dịch vụ của chúng tôi</p>
                            </div>

                            {/* Main Navigation */}
                            <div className="py-4 space-y-2">                                <Link
                                href={`/${currentLocale}`}
                                className="flex items-center gap-4 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600 transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="text-lg">🏙️</span>
                                <div>
                                    <div>Khám phá Phú Quốc</div>
                                    <div className="text-xs text-gray-500">Trang chủ</div>
                                </div>
                            </Link>

                                <Link
                                    href={`/${currentLocale}/pho-food`}
                                    className="flex items-center gap-4 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600 transition-all duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="text-lg">🐟</span>
                                    <div>
                                        <div>PhoFood</div>
                                        <div className="text-xs text-gray-500">Hải sản tươi sống</div>
                                    </div>
                                </Link>                                <Link
                                    href={`/${currentLocale}/pho-retreat`}
                                    className="flex items-center gap-4 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600 transition-all duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="text-lg">🏖️</span>
                                    <div>
                                        <div>Pho Retreat</div>
                                        <div className="text-xs text-gray-500">Villa & Resort</div>
                                    </div>
                                </Link>

                                <Link
                                    href={`/${currentLocale}/pho-travel`}
                                    className="flex items-center gap-4 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600 transition-all duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="text-lg">✈️</span>
                                    <div>
                                        <div>Pho Travel</div>
                                        <div className="text-xs text-gray-500">Tour du lịch</div>
                                    </div>
                                </Link>
                            </div>

                            {/* Additional Links */}
                            <div className="border-t border-gray-100 py-3 space-y-1">
                                <Link
                                    href={`/${currentLocale}/about`}
                                    className="flex items-center gap-4 px-6 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>ℹ️</span>
                                    <span>Về chúng tôi</span>
                                </Link>
                                <Link
                                    href={`/${currentLocale}/contact`}
                                    className="flex items-center gap-4 px-6 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>📞</span>
                                    <span>Liên hệ</span>
                                </Link>                                <Link
                                    href={`/${currentLocale}/blog`}
                                    className="flex items-center gap-4 px-6 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>📝</span>
                                    <span>Blog & Tin tức</span>
                                </Link>
                                <Link
                                    href="/admin/login"
                                    className="flex items-center gap-4 px-6 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>👤</span>
                                    <span>{currentLocale === 'vi' ? 'Đăng nhập Admin' : 'Admin Login'}</span>
                                </Link>
                            </div>

                            {/* Language Switcher */}
                            <div className="border-t border-gray-100 p-4">
                                <button
                                    onClick={() => {
                                        toggleLanguage();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-4 w-full px-2 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <span className="text-lg">{currentLocale === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                                    <div>
                                        <div>{currentLocale === 'vi' ? 'Tiếng Việt' : 'English'}</div>
                                        <div className="text-xs text-gray-500">Đổi ngôn ngữ</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}
