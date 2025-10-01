'use client'

import {
    BookOpen,
    Calendar,
    Camera,
    ChevronRight,
    Clock,
    Heart, MapPin,
    Share,
    Star,
    User,
    Utensils
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface DestinationLayoutProps {
    destination: {
        id: string
        title: string
        subtitle: string
        location: string
        author: {
            name: string
            avatar?: string
            bio: string
        }
        publishDate: string
        readTime: string
        heroImage: string
        tags: string[]
        content: {
            type: 'text' | 'image' | 'gallery' | 'quote' | 'list'
            content: any
        }[]
        seo: {
            description: string
            keywords: string[]
        }
    }
    relatedDestinations?: Array<{
        id: string
        title: string
        image: string
        excerpt: string
        readTime: string
        publishDate: string
    }>
    recommendedActivities?: Array<{
        id: string
        title: string
        image: string
        price: number
        rating: number
        category: string
    }>
    recommendedHotels?: Array<{
        id: string
        name: string
        image: string
        rating: number
        price: number
        location: string
    }>
}

export default function DestinationLayout({
    destination,
    relatedDestinations = [],
    recommendedActivities = [],
    recommendedHotels = []
}: DestinationLayoutProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [activeSection, setActiveSection] = useState('content')

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: destination.title,
                text: destination.subtitle,
                url: window.location.href,
            })
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const renderContent = (content: any) => {
        switch (content.type) {
            case 'text':
                return (
                    <div className="prose prose-lg max-w-none mb-8">
                        <p className="text-gray-700 leading-relaxed">{content.content}</p>
                    </div>
                )

            case 'image':
                return (
                    <div className="mb-8">
                        <div className="relative h-96 rounded-lg overflow-hidden">
                            <Image
                                src={content.content.src}
                                alt={content.content.alt}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {content.content.caption && (
                            <p className="text-sm text-gray-600 mt-2 text-center italic">
                                {content.content.caption}
                            </p>
                        )}
                    </div>
                )

            case 'gallery':
                return (
                    <div className="mb-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {content.content.images.map((image: any, index: number) => (
                                <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        {content.content.caption && (
                            <p className="text-sm text-gray-600 mt-4 text-center italic">
                                {content.content.caption}
                            </p>
                        )}
                    </div>
                )

            case 'quote':
                return (
                    <div className="mb-8">
                        <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                            <p className="text-lg text-gray-800 italic">"{content.content.text}"</p>
                            {content.content.author && (
                                <cite className="text-gray-600 mt-2 block">— {content.content.author}</cite>
                            )}
                        </blockquote>
                    </div>
                )

            case 'list':
                return (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">{content.content.title}</h3>
                        <ul className="space-y-3">
                            {content.content.items.map((item: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
                <Link href="/vi" className="hover:text-gray-700">Trang chủ</Link>
                <span className="mx-2">/</span>
                <Link href="/vi/blog" className="hover:text-gray-700">Blog</Link>
                <span className="mx-2">/</span>
                <span>{destination.location}</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-8">
                {/* Hero Image */}
                <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-6">
                    <Image
                        src={destination.heroImage}
                        alt={destination.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{destination.title}</h1>
                        <p className="text-lg md:text-xl opacity-90">{destination.subtitle}</p>
                    </div>
                </div>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                {destination.author.avatar ? (
                                    <Image
                                        src={destination.author.avatar}
                                        alt={destination.author.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{destination.author.name}</p>
                                <p className="text-sm text-gray-600">{destination.author.bio}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="text-sm">{destination.publishDate}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="text-sm">{destination.readTime}</span>
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
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                        >
                            <Share className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {destination.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                    {[
                        { id: 'content', label: 'Nội dung', icon: BookOpen },
                        { id: 'activities', label: 'Hoạt động', icon: Camera },
                        { id: 'hotels', label: 'Nơi ở', icon: MapPin },
                        { id: 'food', label: 'Ẩm thực', icon: Utensils }
                    ].map((tab) => {
                        const IconComponent = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${activeSection === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <IconComponent className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Content Sections */}
            <div className="mb-12">
                {activeSection === 'content' && (
                    <div>
                        {destination.content.map((content, index) => (
                            <div key={index}>
                                {renderContent(content)}
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'activities' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Hoạt động đề xuất</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedActivities.map((activity) => (
                                <Link key={activity.id} href={`/vi/pho-travel/activities/${activity.id}`}>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="relative h-48">
                                            <Image
                                                src={activity.image}
                                                alt={activity.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white px-2 py-1 rounded text-sm font-medium">
                                                    {activity.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                                {activity.title}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                    <span className="text-sm">{activity.rating}</span>
                                                </div>
                                                <span className="font-bold text-blue-600">
                                                    {activity.price.toLocaleString('vi-VN')}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'hotels' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Khách sạn đề xuất</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedHotels.map((hotel) => (
                                <Link key={hotel.id} href={`/vi/pho-retreat/hotels/${hotel.id}`}>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="relative h-48">
                                            <Image
                                                src={hotel.image}
                                                alt={hotel.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                                {hotel.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                    <span className="text-sm">{hotel.rating}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-blue-600">
                                                        {hotel.price.toLocaleString('vi-VN')}₫
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

                {activeSection === 'food' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Ẩm thực địa phương</h2>
                        <div className="text-center py-12">
                            <p className="text-gray-500">Nội dung về ẩm thực sẽ được cập nhật sớm...</p>
                            <Link
                                href="/vi/pho-food"
                                className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
                            >
                                Khám phá PhoFood
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Related Destinations */}
            {relatedDestinations.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedDestinations.map((related) => (
                            <Link key={related.id} href={`/vi/blog/destinations/${related.id}`}>
                                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative h-48">
                                        <Image
                                            src={related.image}
                                            alt={related.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {related.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{related.publishDate}</span>
                                            <span>{related.readTime}</span>
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