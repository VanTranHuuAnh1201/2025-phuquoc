'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageGalleryProps {
    images: string[]
    title: string
    className?: string
}

export default function ImageGallery({ images, title, className = '' }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!images || images.length === 0) {
        return null
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const openModal = (index: number) => {
        setCurrentIndex(index)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            {/* Gallery Grid */}
            <div className={`grid gap-2 ${className}`}>
                {images.length === 1 && (
                    <div
                        className="relative h-96 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openModal(0)}
                    >
                        <Image
                            src={images[0]}
                            alt={`${title} 1`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}

                {images.length === 2 && (
                    <>
                        <div
                            className="relative h-96 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => openModal(0)}
                        >
                            <Image
                                src={images[0]}
                                alt={`${title} 1`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div
                            className="relative h-96 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => openModal(1)}
                        >
                            <Image
                                src={images[1]}
                                alt={`${title} 2`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </>
                )}

                {images.length >= 3 && (
                    <>
                        {/* Main large image */}
                        <div className="md:row-span-2">
                            <div
                                className="relative h-96 md:h-full rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => openModal(0)}
                            >
                                <Image
                                    src={images[0]}
                                    alt={`${title} 1`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Smaller images */}
                        {images.slice(1, 5).map((image, index) => (
                            <div
                                key={index + 1}
                                className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => openModal(index + 1)}
                            >
                                <Image
                                    src={image}
                                    alt={`${title} ${index + 2}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                                {index === 3 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white text-xl font-semibold">
                                            +{images.length - 5}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                    <div className="relative max-w-5xl max-h-full">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-3xl"
                        >
                            ×
                        </button>

                        {/* Image counter */}
                        <div className="absolute top-4 left-4 z-10 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                            {currentIndex + 1} / {images.length}
                        </div>

                        {/* Main image */}
                        <div className="relative h-[80vh] w-[90vw] max-w-5xl">
                            <Image
                                src={images[currentIndex]}
                                alt={`${title} ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Navigation buttons */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        {/* Thumbnail strip */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-full">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 ${index === currentIndex
                                            ? 'border-white'
                                            : 'border-transparent opacity-70'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${title} thumbnail ${index + 1}`}
                                        width={64}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}