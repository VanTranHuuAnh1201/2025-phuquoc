'use client'

import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

export default function NotFound() {
    const { t, currentLocale } = useLanguage()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 leading-none">
                        {t.notFound?.error404 || '404'}
                    </h1>
                </div>

                {/* Content */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t.notFound?.title || 'Page Not Found'}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">
                        {t.notFound?.subtitle || 'Sorry, the page you are looking for does not exist.'}
                    </p>
                    <p className="text-gray-500">
                        {t.notFound?.description || 'This page may have been moved, deleted, or you entered the wrong URL address.'}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href={`/${currentLocale}`}
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        {t.notFound?.backHome || 'Back to Home'}
                    </Link>
                    <Link
                        href={`/${currentLocale}/1-things-to-do`}
                        className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                    >
                        {t.notFound?.exploreMore || 'Explore More'}
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-32 right-16 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
                <div className="absolute bottom-32 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>
        </div>
    )
}