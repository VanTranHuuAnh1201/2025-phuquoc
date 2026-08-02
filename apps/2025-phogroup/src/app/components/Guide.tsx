'use client'

import { useState } from 'react'

export default function Guide() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const faqs = [
        {
            question: "Mùa nào đi Phú Quốc đẹp?",
            answer: "Từ tháng 11–4 (mùa khô) biển êm, nắng đẹp; mùa hè 5–10 có mưa rào nhưng ít khách, giá tốt."
        },
        {
            question: "Có cần đặt tour trước?",
            answer: "Nên đặt trước 1–3 ngày, cuối tuần/ lễ nên giữ chỗ sớm để có cano giờ đẹp."
        },
        {
            question: "Villa có đưa đón sân bay không?",
            answer: "Có, Pho Retreat cung cấp dịch vụ đưa đón sân bay miễn phí cho khách lưu trú từ 2 đêm trở lên."
        },
        {
            question: "Đặc sản có ship toàn quốc không?",
            answer: "Có, PhoFood giao hàng toàn quốc qua các đối tác vận chuyển. Miễn phí ship nội đảo cho đơn từ 300k."
        }
    ]

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <section id="guide" className="border-t bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold">Travel Guide & Blog</h2>

                {/* Featured blog post */}
                <article className="mt-6 rounded-2xl border p-4 lg:p-6 bg-white">
                    <div className="h-28 rounded-xl skeleton"></div>
                    <h3 className="mt-3 font-semibold">Lịch trình 3N2Đ Phú Quốc (tiết kiệm)</h3>
                    <p className="text-sm text-gray-600">
                        Gợi ý ăn gì, chơi gì, ở đâu • Tips di chuyển • Mùa đẹp nhất…
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 15/09/2025</span>
                        <span>👀 2.3k lượt xem</span>
                        <span>⏱️ 5 phút đọc</span>
                    </div>
                </article>

                {/* More blog posts grid */}
                <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <article className="rounded-xl border p-4 bg-white">
                        <div className="h-20 rounded-lg skeleton"></div>
                        <h4 className="mt-2 font-medium">Top 10 quán ăn ngon ở Phú Quốc</h4>
                        <p className="text-xs text-gray-500 mt-1">Từ bình dân đến cao cấp</p>
                    </article>
                    <article className="rounded-xl border p-4 bg-white">
                        <div className="h-20 rounded-lg skeleton"></div>
                        <h4 className="mt-2 font-medium">Cách chọn villa đẹp giá tốt</h4>
                        <p className="text-xs text-gray-500 mt-1">Tips từ chuyên gia</p>
                    </article>
                    <article className="rounded-xl border p-4 bg-white">
                        <div className="h-20 rounded-lg skeleton"></div>
                        <h4 className="mt-2 font-medium">Review tour 3 đảo chi tiết</h4>
                        <p className="text-xs text-gray-500 mt-1">Kinh nghiệm thực tế</p>
                    </article>
                </div>

                {/* FAQ Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Câu hỏi thường gặp</h3>
                    <div className="rounded-2xl border bg-white">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group p-4 border-b last:border-b-0"
                                open={openFaq === index}
                            >
                                <summary
                                    className="flex cursor-pointer items-center justify-between font-medium"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        toggleFaq(index)
                                    }}
                                >
                                    {faq.question}
                                    <span className={`transition ${openFaq === index ? 'rotate-180' : ''}`}>
                                        ⌄
                                    </span>
                                </summary>
                                {openFaq === index && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {faq.answer}
                                    </div>
                                )}
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
