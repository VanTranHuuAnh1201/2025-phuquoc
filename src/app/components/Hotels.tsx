'use client'

import Image from 'next/image';
import Link from 'next/link';

export default function Hotels() {
    const hotels = [
        {
            id: 1,
            title: "Villa Ocean Breeze - Pho Retreat",
            subtitle: "Villa riêng tư • Phú Quốc",
            badges: ["Xác nhận tức thời", "Free airport pickup", "Hồ bơi riêng"],
            rating: "4.8",
            reviews: "120",
            bookings: "50+",
            price: "2,500,000",
            originalPrice: null,
            description: "3 phòng ngủ • Hồ bơi riêng • 500m ra biển",
            isPhoGroup: true,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000"
        },
        {
            id: 2,
            title: "Vinholidays Fiesta Phú Quốc",
            subtitle: "Khách sạn • Phú Quốc",
            badges: ["Xác nhận tức thời"],
            rating: "4.7",
            reviews: "120",
            bookings: "50+",
            price: "753,924",
            originalPrice: null,
            description: "Resort cao cấp gần biển",
            isPhoGroup: false,
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000"
        },
        {
            id: 3,
            title: "The Shells Resort & Spa Phu Quoc",
            subtitle: "Khách sạn • Phú Quốc",
            badges: ["Xác nhận tức thời"],
            rating: "4.2",
            reviews: "571",
            bookings: null,
            price: "1,787,108",
            originalPrice: null,
            description: "Resort & Spa sang trọng",
            isPhoGroup: false,
            image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000"
        },
        {
            id: 4,
            title: "Villa Sunset Paradise - Pho Retreat",
            subtitle: "Villa riêng tư • Phú Quốc",
            badges: ["Xác nhận tức thời", "Self check-in", "Gần chợ đêm"],
            rating: "4.7",
            reviews: "85",
            bookings: "30+",
            price: "1,800,000",
            originalPrice: null,
            description: "2 phòng ngủ • Gần chợ đêm • BBQ",
            isPhoGroup: true,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000"
        }
    ]

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                        Nơi ở ở Phú Quốc
                    </h2>
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold text-brand-600">Pho Retreat</span> - Villa riêng tư của chúng tôi
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {hotels.map((hotel) => (
                        <Link key={hotel.id} href={`/hotels/${hotel.id}`} className="group">
                            <div className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white ${hotel.isPhoGroup ? 'ring-2 ring-brand-200' : ''}`}>
                                <div className="relative aspect-[4/3]">
                                    <Image
                                        src={hotel.image}
                                        alt={hotel.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                    {hotel.isPhoGroup && (
                                        <div className="absolute top-3 left-3 bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Pho Retreat
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                        {hotel.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-2">{hotel.description}</p>
                                    <p className="text-sm text-gray-500 mb-3">{hotel.subtitle}</p>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {hotel.badges.slice(0, 2).map((badge, index) => (
                                            <span key={index} className={`text-xs px-2 py-1 rounded ${hotel.isPhoGroup ? 'bg-brand-50 text-brand-700' : 'bg-green-50 text-green-700'}`}>
                                                {badge}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 mb-3 text-sm">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-semibold">{hotel.rating}</span>
                                        <span className="text-gray-500">({hotel.reviews})</span>
                                        {hotel.bookings && (
                                            <>
                                                <span className="text-gray-500">•</span>
                                                <span className="text-gray-500">{hotel.bookings} Đã được đặt</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-red-600">
                                                Từ ₫ {parseInt(hotel.price).toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500">/đêm</span>
                                        </div>

                                        {hotel.isPhoGroup && (
                                            <button
                                                onClick={(e) => e.preventDefault()}
                                                className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700 transition-colors"
                                            >
                                                Đặt ngay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold mb-3">Tìm thêm nơi ở qua đối tác của chúng tôi:</h3>
                    <div className="flex gap-3">
                        <a
                            href="https://booking.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                        >
                            Booking.com
                        </a>
                        <a
                            href="https://airbnb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                            Airbnb
                        </a>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold transition-colors">
                        Xem thêm nơi ở
                    </button>
                </div>
            </div>
        </section>
    )
}
