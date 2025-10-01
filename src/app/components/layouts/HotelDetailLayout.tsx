'use client'

import {
    AirVent,
    Car,
    Check,
    ChevronLeft, ChevronRight,
    Coffee,
    Heart,
    MapPin,
    Share,
    Shield,
    Spool,
    Star,
    Utensils,
    Wifi,
    X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface HotelDetailLayoutProps {
    hotel: {
        id: string
        name: string
        location: string
        address: string
        rating: number
        reviewCount: number
        images: string[]
        description: string
        amenities: {
            icon: string
            name: string
            available: boolean
        }[]
        roomTypes: {
            id: string
            name: string
            size: string
            capacity: number
            price: number
            originalPrice?: number
            amenities: string[]
            images: string[]
            availability: boolean
        }[]
        policies: {
            checkIn: string
            checkOut: string
            cancellation: string
            children: string
            pets: string
        }
        location_details: {
            nearbyAttractions: {
                name: string
                distance: string
            }[]
            coordinates: {
                lat: number
                lng: number
            }
        }
    }
    reviews?: Array<{
        id: string
        author: string
        rating: number
        comment: string
        date: string
        room_type: string
        avatar?: string
    }>
    similarHotels?: Array<{
        id: string
        name: string
        image: string
        rating: number
        price: number
        location: string
    }>
}

export default function HotelDetailLayout({
    hotel,
    reviews = [],
    similarHotels = []
}: HotelDetailLayoutProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedRoomType, setSelectedRoomType] = useState(hotel.roomTypes[0]?.id || '')
    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')
    const [guestCount, setGuestCount] = useState(2)
    const [isFavorite, setIsFavorite] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length)
    }

    const selectedRoom = hotel.roomTypes.find(room => room.id === selectedRoomType) || hotel.roomTypes[0]
    const discount = selectedRoom?.originalPrice
        ? Math.round(((selectedRoom.originalPrice - selectedRoom.price) / selectedRoom.originalPrice) * 100)
        : 0

    const amenityIcons: Record<string, any> = {
        wifi: Wifi,
        parking: Car,
        coffee: Coffee,
        pool: Spool,
        restaurant: Utensils,
        ac: AirVent,
        security: Shield
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/vi" className="hover:text-gray-700">Trang chủ</Link>
                <span className="mx-2">/</span>
                <Link href="/vi/pho-retreat" className="hover:text-gray-700">Pho Retreat</Link>
                <span className="mx-2">/</span>
                <span>{hotel.location}</span>
            </nav>

            {/* Hotel Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                        <div className="flex items-center space-x-4 text-gray-600">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                                <span>{hotel.rating}</span>
                                <span className="ml-1">({hotel.reviewCount} đánh giá)</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{hotel.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`p-2 rounded-full ${isFavorite
                                ? 'bg-red-100 text-red-500'
                                : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 text-gray-500">
                            <Share className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images & Info */}
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="relative mb-6">
                        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                                src={hotel.images[currentImageIndex]}
                                alt={hotel.name}
                                fill
                                className="object-cover"
                            />
                            {hotel.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex mt-4 space-x-2 overflow-x-auto">
                            {hotel.images.slice(0, 6).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${index === currentImageIndex
                                        ? 'border-blue-500'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${hotel.name} ${index + 1}`}
                                        width={80}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'overview', label: 'Tổng quan' },
                                { id: 'rooms', label: 'Phòng & Giá' },
                                { id: 'amenities', label: 'Tiện nghi' },
                                { id: 'location', label: 'Vị trí' },
                                { id: 'policies', label: 'Chính sách' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mb-8">
                        {activeTab === 'overview' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Giới thiệu</h3>
                                <p className="text-gray-700 leading-relaxed mb-6">{hotel.description}</p>
                                <p className="text-gray-600">{hotel.address}</p>
                            </div>
                        )}

                        {activeTab === 'rooms' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Các loại phòng</h3>
                                <div className="space-y-6">
                                    {hotel.roomTypes.map((room) => (
                                        <div key={room.id} className="border border-gray-200 rounded-lg p-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-xl font-semibold mb-2">{room.name}</h4>
                                                    <p className="text-gray-600 mb-4">{room.size} • Tối đa {room.capacity} khách</p>
                                                    <div className="space-y-2">
                                                        {room.amenities.map((amenity, index) => (
                                                            <div key={index} className="flex items-center text-sm text-gray-600">
                                                                <Check className="w-4 h-4 text-green-500 mr-2" />
                                                                <span>{amenity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                {room.price.toLocaleString('vi-VN')}₫
                                                            </span>
                                                            {room.originalPrice && (
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    {room.originalPrice.toLocaleString('vi-VN')}₫
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 text-sm">/ đêm</p>
                                                    </div>
                                                    {room.availability ? (
                                                        <button
                                                            onClick={() => setSelectedRoomType(room.id)}
                                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                                        >
                                                            Chọn phòng
                                                        </button>
                                                    ) : (
                                                        <span className="text-red-500 font-medium">Hết phòng</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'amenities' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Tiện nghi khách sạn</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {hotel.amenities.map((amenity, index) => {
                                        const IconComponent = amenityIcons[amenity.icon] || Shield
                                        return (
                                            <div key={index} className={`flex items-center p-3 rounded-lg ${amenity.available ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                                                }`}>
                                                <IconComponent className="w-5 h-5 mr-3" />
                                                <span className="text-sm">{amenity.name}</span>
                                                {amenity.available ? (
                                                    <Check className="w-4 h-4 ml-auto" />
                                                ) : (
                                                    <X className="w-4 h-4 ml-auto" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Vị trí & Điểm tham quan gần đó</h3>
                                <div className="mb-6">
                                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Bản đồ sẽ được hiển thị ở đây</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3">Điểm tham quan gần đó</h4>
                                    <div className="space-y-2">
                                        {hotel.location_details.nearbyAttractions.map((attraction, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span>{attraction.name}</span>
                                                <span className="text-gray-600 text-sm">{attraction.distance}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'policies' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Chính sách khách sạn</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Check-in / Check-out</h4>
                                        <p className="text-gray-700">Check-in: {hotel.policies.checkIn}</p>
                                        <p className="text-gray-700">Check-out: {hotel.policies.checkOut}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Chính sách hủy phòng</h4>
                                        <p className="text-gray-700">{hotel.policies.cancellation}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Trẻ em</h4>
                                        <p className="text-gray-700">{hotel.policies.children}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Thú cưng</h4>
                                        <p className="text-gray-700">{hotel.policies.pets}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Booking Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {selectedRoom?.price.toLocaleString('vi-VN')}₫
                                    </span>
                                    {selectedRoom?.originalPrice && (
                                        <>
                                            <span className="text-lg text-gray-500 line-through">
                                                {selectedRoom.originalPrice.toLocaleString('vi-VN')}₫
                                            </span>
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                                -{discount}%
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-gray-600">/ đêm</p>
                            </div>

                            {/* Booking Form */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nhận phòng
                                        </label>
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trả phòng
                                        </label>
                                        <input
                                            type="date"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số khách
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                            className="p-2 hover:bg-gray-50"
                                        >
                                            -
                                        </button>
                                        <span className="flex-1 text-center py-2">{guestCount}</span>
                                        <button
                                            onClick={() => setGuestCount(guestCount + 1)}
                                            className="p-2 hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại phòng
                                    </label>
                                    <select
                                        value={selectedRoomType}
                                        onChange={(e) => setSelectedRoomType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {hotel.roomTypes.map((room) => (
                                            <option key={room.id} value={room.id} disabled={!room.availability}>
                                                {room.name} - {room.price.toLocaleString('vi-VN')}₫
                                                {!room.availability && ' (Hết phòng)'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="border-t pt-4">
                                    <button
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                        disabled={!selectedRoom?.availability}
                                    >
                                        {selectedRoom?.availability ? 'Đặt phòng ngay' : 'Hết phòng'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
                    <div className="space-y-6">
                        {reviews.slice(0, 3).map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        {review.avatar ? (
                                            <Image src={review.avatar} alt={review.author} width={40} height={40} className="rounded-full" />
                                        ) : (
                                            <span className="text-sm font-medium">{review.author[0]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{review.author}</h4>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">{review.date}</span>
                                            <span className="text-sm text-blue-600">{review.room_type}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Similar Hotels */}
            {similarHotels.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Khách sạn tương tự</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarHotels.map((similar) => (
                            <Link key={similar.id} href={`/vi/pho-retreat/hotels/${similar.id}`}>
                                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative h-48">
                                        <Image
                                            src={similar.image}
                                            alt={similar.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                            {similar.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{similar.location}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                <span className="text-sm">{similar.rating}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-blue-600">
                                                    {similar.price.toLocaleString('vi-VN')}₫
                                                </span>
                                                <p className="text-xs text-gray-500">/ đêm</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}