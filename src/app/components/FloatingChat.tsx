'use client'

import { useState } from 'react'

export default function FloatingChat() {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleChat = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isExpanded && (
                <div className="mb-3 bg-white rounded-2xl shadow-lg border p-4 w-64">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Cần hỗ trợ?</h4>
                        <button
                            onClick={toggleChat}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                        Chúng tôi online 24/7 để tư vấn tour, villa và đặc sản!
                    </p>
                    <div className="space-y-2">
                        <a
                            href="https://wa.me/84123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-3 py-2 rounded-lg bg-green-500 text-white text-center text-sm hover:bg-green-600"
                        >
                            💬 Chat WhatsApp
                        </a>
                        <a
                            href="https://zalo.me/84123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-3 py-2 rounded-lg bg-blue-500 text-white text-center text-sm hover:bg-blue-600"
                        >
                            🗨️ Chat Zalo
                        </a>
                        <a
                            href="tel:+84123456789"
                            className="block w-full px-3 py-2 rounded-lg border text-center text-sm hover:bg-gray-50"
                        >
                            📞 Gọi ngay
                        </a>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                {!isExpanded && (
                    <>
                        <a
                            href="https://wa.me/84123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-full shadow-soft bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                        >
                            WhatsApp
                        </a>
                        <a
                            href="https://zalo.me/84123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-full shadow-soft bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                        >
                            Zalo
                        </a>
                    </>
                )}

                <button
                    onClick={toggleChat}
                    className="w-12 h-12 rounded-full shadow-soft bg-brand-600 text-white hover:bg-brand-700 transition-colors flex items-center justify-center"
                    aria-label={isExpanded ? "Đóng chat" : "Mở chat"}
                >
                    {isExpanded ? '✕' : '💬'}
                </button>
            </div>
        </div>
    )
}
