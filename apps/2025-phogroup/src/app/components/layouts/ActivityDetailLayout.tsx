'use client'

import { Calendar, ChevronLeft, ChevronRight, Clock, Heart, MapPin, Share, Star, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ActivityDetailLayoutProps {
    activity: {
        id: string
        title: string
        location: string
        rating: number
        reviewCount: number
        price: number
        originalPrice?: number
        duration: string
        groupSize: string
        highlights: string[]
        description: string
        images: string[]
        inclusions: string[]
        exclusions: string[]
        cancellationPolicy: string
        category: string
    }
    reviews?: Array<{
        id: string
        author: string
        rating: number
        comment: string
        date: string
        avatar?: string
    }>
    similarActivities?: Array<{
        id: string
        title: string
        image: string
        price: number
        rating: number
    }>
}

export default function ActivityDetailLayout({
    activity,
    reviews = [],
    similarActivities = []
}: ActivityDetailLayoutProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedDate, setSelectedDate] = useState('')
    const [guestCount, setGuestCount] = useState(1)
    const [isFavorite, setIsFavorite] = useState(false)

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % activity.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + activity.images.length) % activity.images.length)
    }

    const discount = activity.originalPrice
        ? Math.round(((activity.originalPrice - activity.price) / activity.originalPrice) * 100)
        : 0

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/vi" className="hover:text-gray-700">Trang chủ</Link>
                <span className="mx-2">/</span>
                <Link href="/vi/pho-travel" className="hover:text-gray-700">Pho Travel</Link>
                <span className="mx-2">/</span>
                <span>{activity.category}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images & Info */}
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="relative mb-6">
                        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                                src={activity.images[currentImageIndex]}
                                alt={activity.title}
                                fill
                                className="object-cover"
                            />
                            {activity.images.length > 1 && (
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
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {activity.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex mt-4 space-x-2 overflow-x-auto">
                            {activity.images.slice(0, 5).map((image, index) => (
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
                                        alt={`${activity.title} ${index + 1}`}
                                        width={80}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activity Info */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
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

                        <div className="flex items-center space-x-4 text-gray-600 mb-4">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                                <span>{activity.rating}</span>
                                <span className="ml-1">({activity.reviewCount} đánh giá)</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 text-gray-600 mb-6">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{activity.duration}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                <span>{activity.groupSize}</span>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Điểm nổi bật</h3>
                            <ul className="space-y-2">
                                {activity.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span className="text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Mô tả</h3>
                            <p className="text-gray-700 leading-relaxed">{activity.description}</p>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-green-600">Bao gồm</h3>
                                <ul className="space-y-2">
                                    {activity.inclusions.map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-red-600">Không bao gồm</h3>
                                <ul className="space-y-2">
                                    {activity.exclusions.map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-red-500 mr-2">✗</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Chính sách hủy</h3>
                            <p className="text-gray-700">{activity.cancellationPolicy}</p>
                        </div>
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
                                        {activity.price.toLocaleString('vi-VN')}₫
                                    </span>
                                    {activity.originalPrice && (
                                        <>
                                            <span className="text-lg text-gray-500 line-through">
                                                {activity.originalPrice.toLocaleString('vi-VN')}₫
                                            </span>
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                                -{discount}%
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-gray-600">/ người</p>
                            </div>

                            {/* Booking Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chọn ngày
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số lượng khách
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                            className="p-3 hover:bg-gray-50"
                                        >
                                            -
                                        </button>
                                        <span className="flex-1 text-center py-3">{guestCount}</span>
                                        <button
                                            onClick={() => setGuestCount(guestCount + 1)}
                                            className="p-3 hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-700">Tổng cộng</span>
                                        <span className="text-xl font-bold">
                                            {(activity.price * guestCount).toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                        Đặt ngay
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
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Similar Activities */}
            {similarActivities.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Hoạt động tương tự</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarActivities.map((similar) => (
                            <Link key={similar.id} href={`/vi/pho-travel/activities/${similar.id}`}>
                                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative h-48">
                                        <Image
                                            src={similar.image}
                                            alt={similar.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                            {similar.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                <span className="text-sm">{similar.rating}</span>
                                            </div>
                                            <span className="font-bold text-blue-600">
                                                {similar.price.toLocaleString('vi-VN')}₫
                                            </span>
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