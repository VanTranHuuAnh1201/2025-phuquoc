'use client'

import { useState } from 'react'

export default function TopBar() {
    const [language, setLanguage] = useState('VI')

    return (
        <div className="w-full bg-white border-b text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-end">
                <div className="flex items-center gap-4">
                    {/* Country Flag & Currency */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🇻🇳</span>
                        <button className="flex items-center gap-1 hover:text-orange-500">
                            <span className="font-medium">{'VND'}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Language Selector */}
                    <button
                        className="flex items-center gap-1 hover:text-orange-500"
                        onClick={() => setLanguage(prev => prev === 'VI' ? 'EN' : 'VI')}
                    >
                        <span className="font-medium">{language}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Links */}
                    <a href="#" className="hover:text-orange-500 font-medium">Mở ứng dụng</a>
                    <a href="#" className="hover:text-orange-500 font-medium">Trợ giúp</a>
                    <a href="#" className="hover:text-orange-500 font-medium">Xem giỏ đặy</a>
                    <a href="#" className="hover:text-orange-500 font-medium">Đăng ký</a>
                    <a href="#" className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 font-medium">
                        Đăng nhập
                    </a>
                </div>
            </div>
        </div>
    )
}
