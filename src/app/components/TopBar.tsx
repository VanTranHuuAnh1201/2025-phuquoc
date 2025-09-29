'use client'

import { useState } from 'react'

export default function TopBar() {
    const [language, setLanguage] = useState('VI')

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'VI' ? 'EN' : 'VI')
    }

    return (
        <div className="w-full bg-gray-50 border-b text-xs sm:text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
                <span className="text-gray-600">
                    Giao nhanh tại Phú Quốc • Hỗ trợ 24/7
                </span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleLanguage}
                        className="px-2 py-1 rounded-md hover:bg-gray-100 border text-xs"
                    >
                        {language}/EN
                    </button>
                    <a href="#contact" className="hover:text-brand-600">Contact</a>
                </div>
            </div>
        </div>
    )
}
