'use client'

import Image from 'next/image';
import Link from 'next/link';
import { hotelsData, type Hotel } from '../lib/data';

interface HotelCardProps {
    hotel: Hotel;
}

function HotelCard({ hotel }: HotelCardProps) {
    return (
        <Link href={`/hotels/${hotel.id}`} className="group">
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

                    {hotel.location && (
                        <p className="text-xs text-blue-600 mb-2">📍 {hotel.location}</p>
                    )}

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
    );
}

export default function Hotels() {
    // Separate Pho Group villas and other hotels
    const phoRetreatVillas = hotelsData.filter(hotel => hotel.isPhoGroup);
    const otherHotels = hotelsData.filter(hotel => !hotel.isPhoGroup);

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

                {/* Pho Retreat Villas Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-brand-800">🏖️ Villa Pho Retreat - Đặc quyền riêng tư</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {phoRetreatVillas.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                </div>

                {/* Other Hotels Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">🏨 Khách sạn & Resort khác</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherHotels.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
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
