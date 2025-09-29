'use client'

import { useState } from 'react'

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    const faqs = [
        {
            question: "Phú Quốc có gì vui?",
            answer: "Phú Quốc có rất nhiều hoạt động hấp dẫn như: cáp treo Hòn Thơm (dài nhất Việt Nam), VinWonders & Vinpearl Safari, tour 3 đảo khám phá biển xanh, các bãi biển đẹp như Bãi Sao, Bãi Khem, thưởng thức đặc sản cá khô và hải sản tươi ngon. Pho Group cung cấp trọn gói: nơi ở (Pho Retreat), tour trải nghiệm (Pho Travel) và đặc sản chất lượng (PhoFood).",
            category: "Hoạt động"
        },
        {
            question: "Du lịch Phú Quốc vào tháng mấy?",
            answer: "Thời điểm tốt nhất là từ tháng 11 đến tháng 4 (mùa khô) với thời tiết nắng đẹp, biển êm. Tháng 12-2 là cao điểm, đông khách nhất. Tháng 3-5 ít đông hơn, giá cả hợp lý. Tránh tháng 6-10 vì mùa mưa bão. Pho Group phục vụ quanh năm với ưu đãi đặc biệt cho mùa thấp điểm.",
            category: "Thời tiết"
        },
        {
            question: "Kinh nghiệm du lịch Phú Quốc cho gia đình?",
            answer: "Gia đình nên chọn villa riêng tư (Pho Retreat) để thoải mái, có bếp nấu ăn và hồ bơi riêng. Lịch trình nên bao gồm: VinWonders (phù hợp trẻ em), cáp treo Hòn Thơm, tour 3 đảo nhẹ nhàng, khám phá chợ đêm. Đặc sản cá khô PhoFood là quà biếu lý tưởng. Pho Group hỗ trợ đưa đón sân bay và tư vấn lịch trình phù hợp từng độ tuổi.",
            category: "Gia đình"
        },
        {
            question: "Chi phí du lịch Phú Quốc bao nhiều?",
            answer: "Chi phí trung bình 3N2Đ cho 2 người khoảng 8-15 triệu tùy mức độ. Villa Pho Retreat từ 1.8-4.5 triệu/đêm. Tour 3 đảo 600K-1.4 triệu/người. Vé cáp treo 590K, VinWonders 940K. Ăn uống 300-800K/bữa. Pho Group có gói combo tiết kiệm khi đặt villa + tour + đặc sản.",
            category: "Chi phí"
        },
        {
            question: "Pho Group có dịch vụ gì?",
            answer: "Pho Group cung cấp 3 dịch vụ chính: 1) PhoFood - đặc sản cá khô, hải sản chất lượng cao, ship toàn quốc. 2) Pho Retreat - villa riêng tư có hồ bơi, gần biển, free airport pickup. 3) Pho Travel - tour 3 đảo, cáp treo, VinWonders với giá ưu đãi. Tất cả đều chất lượng quốc tế, phục vụ khách Việt và quốc tế.",
            category: "Dịch vụ"
        },
        {
            question: "Làm sao đặt villa Pho Retreat?",
            answer: "Đặt villa Pho Retreat rất đơn giản: 1) Chọn villa phù hợp trên website, 2) Chọn ngày check-in/out, 3) Điền thông tin và thanh toán, 4) Nhận xác nhận qua email/SMS. Hotline 24/7: 0999.888.777. Thanh toán linh hoạt: chuyển khoản, thẻ visa, ví điện tử. Free airport pickup và late check-out theo yêu cầu.",
            category: "Đặt phòng"
        }
    ]

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <section className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        Câu hỏi thường gặp về Phú Quốc
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tìm hiểu những thông tin hữu ích để có chuyến du lịch Phú Quốc hoàn hảo cùng Pho Group
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded-full font-medium">
                                        {faq.category}
                                    </span>
                                    <span className="font-semibold text-lg text-gray-900">{faq.question}</span>
                                </div>
                                <div className={`transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}>
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            <div className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-brand-50 rounded-lg border border-brand-200 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-brand-800">
                        Không tìm thấy câu trả lời bạn cần?
                    </h3>
                    <p className="text-brand-700 mb-4">
                        Liên hệ trực tiếp với đội ngũ Pho Group để được tư vấn chi tiết
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="tel:0999888777" className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
                            📞 Hotline: 0999.888.777
                        </a>
                        <a href="mailto:info@phogroup.vn" className="px-6 py-2 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors font-medium">
                            ✉️ Email: info@phogroup.vn
                        </a>
                    </div>
                </div>
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
        </section>
    )
}
