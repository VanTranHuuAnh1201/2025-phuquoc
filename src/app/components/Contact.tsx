'use client'

import { useState } from 'react'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Contact form submitted:', formData)
        // Handle form submission - integrate with your backend
        alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong 24h.')
        setFormData({ name: '', email: '', message: '' })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <>
            <section id="contact" className="border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h3 className="text-2xl font-bold">Sẵn sàng lên kế hoạch?</h3>
                        <p className="mt-2 text-gray-600">
                            Liên hệ nhanh qua form, hoặc chat WhatsApp/Zalo.
                        </p>
                        <ul className="text-sm text-gray-500 mt-2 space-y-1">
                            <li>✓ Tư vấn miễn phí 24/7</li>
                            <li>✓ Đặt tour/villa nhanh chóng</li>
                            <li>✓ Giá tốt nhất thị trường</li>
                        </ul>

                        {/* Contact info */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                                    📱
                                </div>
                                <div>
                                    <div className="font-medium">Hotline</div>
                                    <div className="text-sm text-gray-600">+84 123 456 789</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                                    📧
                                </div>
                                <div>
                                    <div className="font-medium">Email</div>
                                    <div className="text-sm text-gray-600">info@phogroup.vn</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                                    📍
                                </div>
                                <div>
                                    <div className="font-medium">Địa chỉ</div>
                                    <div className="text-sm text-gray-600">Dương Đông, Phú Quốc, Kiên Giang</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-3">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Tên của bạn"
                            required
                        />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Email"
                            type="email"
                            required
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                            placeholder="Nội dung (tour nào, villa nào, đặc sản gì...)"
                            required
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                        >
                            Gửi yêu cầu
                        </button>
                    </form>
                </div>

                {/* Promotional banner */}
                <div className="bg-brand-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm">
                        Ưu đãi nội đảo: miễn phí giao hàng cho đơn đặc sản &gt; 300k • Giảm 5% khi đặt combo Villa + Tour
                    </div>
                </div>
            </section>
        </>
    )
}
