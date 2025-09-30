'use client';

import Link from 'next/link';
import { useState } from 'react';
import { translations, type Locale } from '../../i18n';

export default function Header() {
    const [currentLocale, setCurrentLocale] = useState<Locale>('vi')
    const t = translations[currentLocale]

    const toggleLanguage = () => {
        setCurrentLocale(currentLocale === 'vi' ? 'en' : 'vi')
    }

    return (
        <header className="sticky top-0 z-40 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 grid place-items-center text-white font-bold text-sm">
                            Pho
                        </div>
                        <span className="font-bold text-xl text-gray-900">PhoGroup</span>
                    </Link>

                    {/* Main Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
                        <Link href="/phofood" className="px-4 py-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t.navigation.phoFood}
                        </Link>
                        <Link href="/phoretreat" className="px-4 py-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t.navigation.phoRetreat}
                        </Link>
                        <Link href="/photravel" className="px-4 py-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t.navigation.phoTravel}
                        </Link>
                    </nav>

                    {/* Right side navigation */}
                    <div className="flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium transition-colors"
                            >
                                <span className="text-lg">{currentLocale === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                                <span className="uppercase">{currentLocale}</span>
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Secondary Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600 hover:text-gray-900">
                                {t.navigation.help}
                            </a>
                            <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600 hover:text-gray-900">
                                {t.navigation.signup}
                            </a>
                            <a href="#" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-medium transition-colors">
                                {t.navigation.login}
                            </a>
                        </nav>

                        {/* Book Now Button */}
                        <a href="#contact" className="ml-2 inline-flex px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-semibold text-sm transition-colors">
                            {t.common.bookNow}
                        </a>

                        {/* Mobile menu button */}
                        <button className="lg:hidden p-2 ml-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu (hidden by default) */}
                <div className="lg:hidden border-t bg-white">
                    <div className="px-4 py-3 space-y-1">
                        <Link href="/phofood" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                            {t.navigation.phoFood}
                        </Link>
                        <Link href="/phoretreat" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                            {t.navigation.phoRetreat}
                        </Link>
                        <Link href="/photravel" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                            {t.navigation.phoTravel}
                        </Link>
                        <div className="border-t pt-2 mt-2">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium w-full text-left"
                            >
                                <span className="text-lg">{currentLocale === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                                <span>{currentLocale === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
