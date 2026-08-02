'use client'

import { useState } from 'react';
import { faqsData, type FAQ } from '../lib/data';

interface FAQItemProps {
    faq: FAQ;
    isOpen: boolean;
    onToggle: () => void;
}function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded-full font-medium">
                        {faq.category}
                    </span>
                    <span className="font-semibold text-lg text-gray-900">{faq.question}</span>
                </div>
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                    {faq.answer}
                </div>
            </div>
        </div>
    );
}

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <section className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        ❓ Câu hỏi thường gặp
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tìm hiểu những thông tin hữu ích để có chuyến du lịch Phú Quốc hoàn hảo cùng Pho Group
                    </p>
                </div>
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">🔥 Câu hỏi phổ biến nhất</h3>
                    <div className="space-y-4">
                        {faqsData.slice(0, 4).map((faq, index) => (
                            <FAQItem
                                key={index}
                                faq={faq}
                                isOpen={openFaq === index}
                                onToggle={() => toggleFaq(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Additional FAQs */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">💡 Thông tin bổ sung</h3>
                    <div className="space-y-4">
                        {faqsData.slice(4).map((faq, index) => (
                            <FAQItem
                                key={index + 4}
                                faq={faq}
                                isOpen={openFaq === index + 4}
                                onToggle={() => toggleFaq(index + 4)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
