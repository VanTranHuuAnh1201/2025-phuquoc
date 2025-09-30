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
            <div className={`bg-white rounded-2xl border-2 border-transparent hover:border-orange-200 transition-colors shadow-lg hover:shadow-xl overflow-hidden ${hotel.isPhoGroup ? 'border-orange-300' : ''}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={hotel.image}
                        alt={hotel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    {hotel.isPhoGroup && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            🏖️ Pho Retreat
                        </div>
                    )}
                </div>                <div className="p-4 space-y-3">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {hotel.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2">{hotel.description}</p>
                    <p className="text-xs text-gray-500">{hotel.subtitle}</p>

                    {hotel.location && (
                        <p className="text-xs text-orange-600 font-medium">📍 {hotel.location}</p>
                    )}

                    <div className="flex flex-wrap gap-1">
                        {hotel.badges.slice(0, 1).map((badge, index) => (
                            <span key={index} className={`text-xs px-2 py-1 rounded-full font-medium ${hotel.isPhoGroup ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                                ✓ {badge}
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
    const otherHotels = hotelsData.filter(hotel => !hotel.isPhoGroup); return (
        <section className="py-8 bg-white/80 backdrop-blur-sm rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            Nơi ở ở Phú Quốc
                        </h2>
                        <p className="text-gray-600 mt-2">
                            <span className="font-semibold text-orange-600">Pho Retreat</span> - Villa riêng tư của chúng tôi
                        </p>
                    </div>
                </div>                {/* Pho Retreat Villas Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">🏖️ Villa Pho Retreat - Đặc quyền riêng tư</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {phoRetreatVillas.map((hotel, index) => (
                            <div key={hotel.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <HotelCard hotel={hotel} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Hotels Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">🏨 Khách sạn & Resort khác</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherHotels.map((hotel, index) => (
                            <div key={hotel.id} className="animate-fadeInUp" style={{ animationDelay: `${(index + phoRetreatVillas.length) * 0.1}s` }}>
                                <HotelCard hotel={hotel} />
                            </div>
                        ))}
                    </div>
                </div>                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                    <h3 className="font-bold mb-4 text-gray-800">🔗 Tìm thêm nơi ở qua đối tác của chúng tôi:</h3>
                    <div className="flex gap-4">
                        <a
                            href="https://booking.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                            📚 Booking.com
                        </a>
                        <a
                            href="https://airbnb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                            🏠 Airbnb
                        </a>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg">
                        <span>Xem thêm nơi ở</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}
