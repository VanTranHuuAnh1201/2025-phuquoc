'use client'

import { UI } from '@repo/core'

import { useLanguage } from '../../context/LanguageContext'
import { RESORT_PHOTOS } from '../../data/property'
import { SectionHeading } from '../common/SectionHeading'

/**
 * Thư viện ảnh trang chủ — lưới 3 cột × 3 hàng, ảnh THẬT của resort.
 *
 * VÌ SAO KHÔNG PHẢI ẢNH ĐẢO: thư viện của một khách sạn là ảnh cơ sở vật chất
 * và ảnh khách — phòng, hồ bơi, nhà hàng, sân hiên. Nội dung "khám phá đảo"
 * đã có chỗ riêng ở `H7Places` và trang /explore.
 *
 * LƯỚI ĐẦY BẰNG ẢNH THẬT: `RESORT_PHOTOS` có đúng 9 ảnh, vừa khít 3×3 nên
 * không cần ô lấp chỗ. Đường sang thư viện đầy đủ đã có ở nút "Xem tất cả"
 * trên header của khối này.
 */

export function GallerySection() {
    const { tx, language } = useLanguage()

    return (
        <section id="gallery" className="py-5 sm:py-7 bg-white border-b border-[#ECECEC]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

                <SectionHeading
                    title={language === 'vi' ? 'Ảnh thật tại resort' : 'Real photos at the resort'}
                    description={
                        language === 'vi'
                            ? 'Phòng nghỉ, hồ bơi, nhà hàng và sân hiên'
                            : 'Rooms, pool, restaurant and terraces'
                    }
                    href="/gallery"
                    actionLabel={tx(UI.viewAll)}
                />

                {/* 3 cột × 3 hàng trên desktop; mobile hạ xuống 2 cột cho ảnh còn đọc được */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {RESORT_PHOTOS.slice(0, 9).map((photo) => (
                        <figure
                            key={photo.id}
                            className="relative aspect-[4/3] rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <img
                                src={photo.src}
                                alt={photo.title[language]}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                            <figcaption className="absolute bottom-3 left-3 right-3 text-white font-bold text-xs sm:text-sm leading-tight drop-shadow-sm">
                                {photo.title[language]}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
