'use client'

import { Gallery, Hero, HostService, Panorama } from '@repo/theme-h3'
import { H2About, H2Dining, H2Places, H2Practical, H2Rooms } from '@repo/theme-h2'
import { useRouter } from 'next/navigation'

import { useLanguage } from '../context/LanguageContext'
import { HERO_SLIDES, RESORT_PHOTOS, gallery, property } from '../data/property'

/**
 * Trang chủ của app này.
 *
 * MỘT NƠI CODE, HAI NƠI HIỂN THỊ: bốn section riêng của resort (Hero, Panorama,
 * HostService, Gallery) nay nằm ở `@repo/theme-h3`, nên cùng một bộ code phục
 * vụ cả URL riêng của app này lẫn `/h3` trên trang hub. Sửa giao diện thì sửa
 * trong package, hai nơi cùng đổi.
 *
 * VÌ SAO KHÔNG GỌI THẲNG `<Home>` CỦA THEME-H3: trang này là bản LAI — bốn
 * section của h3 xen với năm section mượn của mẫu 02. Gọi từng section lẻ giữ
 * đúng trật tự đó. Trang `/h3` trên hub thì gọi `<Home>`, ra bản thuần h3.
 *
 * BA THỨ APP PHẢI TỰ CẤP, THEME KHÔNG BIẾT:
 *   ảnh      nằm trong `public/` của app, mỗi app một đường dẫn
 *   ngôn ngữ đọc từ `LanguageContext` — context riêng của app
 *   router   `useRouter()` của Next; theme không được phụ thuộc framework
 */
export default function HomePage() {
    const { language } = useLanguage()
    const router = useRouter()
    const locale = language as 'vi' | 'en'

    return (
        <main data-theme="h3">
            <Hero
                locale={locale}
                slides={HERO_SLIDES}
                onSearch={(params) => {
                    const qs = new URLSearchParams(
                        Object.entries(params).filter(([, v]) => Boolean(v)) as [
                            string,
                            string,
                        ][],
                    )
                    router.push(`/rooms?${qs.toString()}`)
                }}
                searchHref="/rooms"
            />

            {/* Năm section dưới đây mượn của mẫu 02 — chúng chỉ khác token nên
                bọc `data-theme="h2"` để lấy đúng bảng màu của mẫu đó. */}
            <div data-theme="h2">
                <H2About data={property} locale={locale} />
            </div>

            <Panorama locale={locale} items={gallery} exploreHref="/explore" />

            <div data-theme="h2">
                <H2Rooms data={property} locale={locale} slug="" />
                <H2Dining data={property} locale={locale} slug="" />
                <H2Places data={property} locale={locale} slug="" />
            </div>

            <HostService
                locale={locale}
                perks={property.amenities ?? []}
                reviews={property.reviews ?? []}
            />

            <Gallery locale={locale} photos={RESORT_PHOTOS} galleryHref="/gallery" />

            <div data-theme="h2">
                <H2Practical data={property} locale={locale} />
            </div>
        </main>
    )
}
