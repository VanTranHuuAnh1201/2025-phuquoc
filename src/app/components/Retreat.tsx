'use client'

import { useState } from 'react'

export default function Retreat() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        checkin: '',
        checkout: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // Handle form submission
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <section id="retreat" className="border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Nơi ở — Pho Retreat</h2>
                        <p className="text-gray-600">Villa riêng tư, gần biển, có hồ bơi • Đưa đón sân bay.</p>
                    </div>
                    <a href="#contact" className="hidden sm:inline-flex px-3 py-2 rounded-lg border hover:border-brand-500">
                        Yêu cầu báo giá
                    </a>
                </div>

                <div className="mt-6 rounded-2xl border p-4 lg:p-6 grid lg:grid-cols-2 gap-4">
                    <div className="aspect-video rounded-xl skeleton"></div>
                    <div>
                        <h3 className="font-semibold text-lg">Villa Ocean Breeze</h3>
                        <p className="text-gray-600 text-sm">
                            3 phòng ngủ • Hồ bơi riêng • 500m ra biển. Tiện nghi: BBQ, bếp, máy giặt…
                        </p>
                        <div className="mt-3 flex gap-2 text-xs">
                            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border">
                                Free airport pickup
                            </span>
                            <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border">
                                Self‑check‑in
                            </span>
                            <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border">
                                Best for families
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 grid sm:grid-cols-2 gap-2">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="px-3 py-2 border rounded-xl"
                                placeholder="Họ tên"
                            />
                            <input
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="px-3 py-2 border rounded-xl"
                                placeholder="WhatsApp/Zalo"
                            />
                            <input
                                name="checkin"
                                value={formData.checkin}
                                onChange={handleChange}
                                type="date"
                                className="px-3 py-2 border rounded-xl"
                            />
                            <input
                                name="checkout"
                                value={formData.checkout}
                                onChange={handleChange}
                                type="date"
                                className="px-3 py-2 border rounded-xl"
                            />
                            <button
                                type="submit"
                                className="sm:col-span-2 px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700"
                            >
                                Gửi yêu cầu
                            </button>
                        </form>

                        <div className="mt-3 flex gap-2 text-sm">
                            <a
                                className="px-3 py-1.5 rounded-lg border hover:border-brand-500"
                                href="https://booking.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Booking.com
                            </a>
                            <a
                                className="px-3 py-1.5 rounded-lg border hover:border-brand-500"
                                href="https://airbnb.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Airbnb
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
