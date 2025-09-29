'use client'

import { useState } from 'react'

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    const faqs = [
        {
            question: "Phú Quốc có gì vui?",
            answer: "Phú Quốc có rất nhiều hoạt động hấp dẫn như: cáp treo Hòn Thơm (dài nhất Việt Nam), VinWonders & Vinpearl Safari, tour 3 đảo khám phá biển xanh, các bãi biển đẹp như Bãi Sao, Bãi Khem, thưởng thức đặc sản cá khô và hải sản tươi ngon. Pho Group cung cấp trọn gói: nơi ở (Pho Retreat), tour trải nghiệm (Pho Travel) và đặc sản chất lượng (PhoFood)."
        },
        {
            question: "Du lịch Phú Quốc vào tháng mấy?",
            answer: "Thời điểm tốt nhất là từ tháng 11 đến tháng 4 (mùa khô) với thời tiết nắng đẹp, biển êm. Tháng 12-2 là cao điểm, đông khách nhất. Tháng 3-5 ít đông hơn, giá cả hợp lý. Tránh tháng 6-10 vì mùa mưa bão. Pho Group phục vụ quanh năm với ưu đãi đặc biệt cho mùa thấp điểm."
        },
        {
            question: "Kinh nghiệm du lịch Phú Quốc cho gia đình?",
            answer: "Gia đình nên chọn villa riêng tư (Pho Retreat) để thoải mái, có bếp nấu ăn và hồ bơi riêng. Lịch trình nên bao gồm: VinWonders (phù hợp trẻ em), cáp treo Hòn Thơm, tour 3 đảo nhẹ nhàng, khám phá chợ đêm. Đặc sản cá khô PhoFood là quà biếu lý tưởng. Pho Group hỗ trợ đưa đón sân bay và tư vấn lịch trình phù hợp từng độ tuổi."
        },
        {
            question: "Chi phí du lịch Phú Quốc bao nhiều?",
            answer: "Chi phí trung bình 3N2Đ cho 2 người khoảng 8-15 triệu tùy mức độ. Villa Pho Retreat từ 1.8-4.5 triệu/đêm. Tour 3 đảo 600K-1.4 triệu/người. Vé cáp treo 590K, VinWonders 940K. Ăn uống 300-800K/bữa. Pho Group có gói combo tiết kiệm khi đặt villa + tour + đặc sản."
        },
        {
            question: "Pho Group có dịch vụ gì?",
            answer: "Pho Group cung cấp 3 dịch vụ chính: 1) PhoFood - đặc sản cá khô, hải sản chất lượng cao, ship toàn quốc. 2) Pho Retreat - villa riêng tư có hồ bơi, gần biển, free airport pickup. 3) Pho Travel - tour 3 đảo, cáp treo, VinWonders với giá ưu đãi. Tất cả đều chất lượng quốc tế, phục vụ khách Việt và quốc tế."
        }
    ]

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <section className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                    Câu hỏi thường gặp về Phú Quốc
                </h2>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-lg">{faq.question}</span>
                                <span className={`text-2xl transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                                    ⌄
                                </span>
                            </button>

                            {openFaq === index && (
                                <div className="px-6 pb-4 border-t bg-gray-50">
                                    <p className="text-gray-700 leading-relaxed pt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-8 text-center p-6 bg-brand-50 rounded-lg border border-brand-200">
                    <h3 className="font-semibold text-brand-800 mb-2">Còn thắc mắc gì khác?</h3>
                    <p className="text-gray-600 mb-4">Liên hệ trực tiếp với Pho Group để được tư vấn chi tiết</p>
                    <div className="flex justify-center gap-3">
                        <a
                            href="https://wa.me/84123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            WhatsApp
                        </a>
                        <a
                            href="https://zalo.me/84123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Zalo
                        </a>
                        <a
                            href="tel:+84123456789"
                            className="px-4 py-2 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50"
                        >
                            Gọi ngay
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
