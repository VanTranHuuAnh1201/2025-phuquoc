'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { galleryPhotos, type ResortPhotoCategory } from '../../data/property'
import { ROOMS } from '../../data/rooms'
import { Button } from '../../components/common/Button'

/**
 * Thư viện ảnh — bố cục port từ `/h7/gallery` của app 2026-thenamduhill:
 * hero → nút lọc theo nhóm + nhãn đếm → lưới ảnh → dải kêu gọi đặt phòng.
 *
 * VÌ SAO KHÔNG DÙNG LẠI `GalleryPage` CỦA @repo/ui: component đó kéo theo
 * `PageShell` (header/footer/token riêng của theme h7). App này đã có Header và
 * Footer ở root layout cùng một hệ Tailwind khác hẳn, ghép vào sẽ ra hai bộ
 * điều hướng chồng nhau. Chỉ port BỐ CỤC, không port component.
 *
 * Ảnh gộp từ ba nguồn qua `galleryPhotos()`: ảnh local trong `public/uploads/`,
 * ảnh từng hạng phòng và ảnh điểm đến — cùng bộ mà `/h7/gallery` của app 3000
 * đang hiện.
 *
 * ⚠️ Phần lớn ảnh phòng/điểm đến là URL crawl từ thenamduhill.com. Xem cảnh báo
 * luật R9 ở `galleryPhotos()` trước khi deploy.
 */

type Filter = 'all' | ResortPhotoCategory

/**
 * Chỉ liệt kê nhóm THỰC SỰ có ảnh — nút lọc luôn trả về rỗng là ngõ cụt.
 * Thêm ảnh phòng vào `RESORT_PHOTOS` thì nhóm 'rooms' tự xuất hiện ở đây.
 */
const FILTER_LABELS: Record<Filter, { vi: string; en: string }> = {
    all: { vi: 'Tất cả', en: 'All' },
    rooms: { vi: 'Phòng nghỉ', en: 'Rooms' },
    dining: { vi: 'Ẩm thực', en: 'Dining' },
    places: { vi: 'Điểm đến', en: 'Destinations' },
    resort: { vi: 'Khuôn viên', en: 'Grounds' },
    views: { vi: 'Cảnh quan', en: 'Views' },
}

const CATEGORY_ORDER: ResortPhotoCategory[] = ['rooms', 'dining', 'places', 'resort', 'views']

export default function GalleryPage() {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const [filter, setFilter] = useState<Filter>('all')

    const photos = useMemo(() => galleryPhotos(ROOMS), [])

    /** Chỉ hiện nhóm THỰC SỰ có ảnh — nút lọc luôn rỗng là ngõ cụt. */
    const filters: Filter[] = useMemo(
        () => [
            'all',
            ...CATEGORY_ORDER.filter((cat) => photos.some((photo) => photo.category === cat)),
        ],
        [photos],
    )

    const visible =
        filter === 'all' ? photos : photos.filter((photo) => photo.category === filter)

    return (
        <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-14 pb-20">

            {/* Hero */}
            <section className="relative min-h-[38vh] sm:min-h-[46vh] flex items-end overflow-hidden bg-[#0F2D52] pt-20">
                <img
                    src="/uploads/hero-3.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-[#0F2D52]/60 to-black/40 pointer-events-none" />
                <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
                    <nav aria-label="Breadcrumb" className="text-[11px] text-white/70 mb-2">
                        <Link href="/" className="hover:text-white underline-offset-2 hover:underline">
                            {isEn ? 'Home' : 'Trang chủ'}
                        </Link>
                        <span className="mx-1.5" aria-hidden="true">
                            /
                        </span>
                        <span className="text-white">{isEn ? 'Gallery' : 'Thư viện ảnh'}</span>
                    </nav>
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {isEn ? 'Photo gallery' : 'Thư viện ảnh'}
                    </h1>
                    <p className="text-xs sm:text-sm text-white/80 font-normal mt-1.5 max-w-xl">
                        {isEn
                            ? 'Real photos of the rooms, the grounds and destinations around the island.'
                            : 'Hình ảnh thực tế phòng nghỉ, khuôn viên và các điểm đến quanh đảo.'}
                    </p>
                </div>
            </section>

            {/*
             * Bộ lọc dính ngay dưới top header.
             *
             * VÌ SAO HAI MỐC `top`: Header là `fixed`, cao khác nhau theo
             * breakpoint vì nút "Đặt ngay" bị ẩn dưới `sm`.
             *   mobile : 10 + 36 (logo) + 10 = 56px
             *   ≥ sm   : 10 + 42 (Button md) + 10 = 62px
             * Đặt thấp hơn mốc đó thì thanh lọc chui xuống dưới header.
             *
             * VÌ SAO KHÔNG BỌC THÊM DIV CÓ `overflow`: bất kỳ tổ tiên nào mang
             * `overflow: hidden/auto` đều vô hiệu hoá `position: sticky` — kể
             * cả `overflow-x: hidden`, vì trình duyệt tự đổi trục còn lại
             * thành `auto`. Xem ghi chú ở `globals.css` và `layout.tsx`.
             *
             * `-mx-4` bù lại padding ngang của section để dải nền chạy hết
             * chiều rộng màn hình khi dính, không bị hụt hai mép.
             */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div
                    className="
                        sticky top-[56px] sm:top-[62px] z-30
                        -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8
                        bg-[#F8F9FA]/95 backdrop-blur-md
                        border-b border-[#ECECEC]
                        py-3 mb-4
                        flex items-center justify-between gap-3 sm:gap-4
                    "
                >
                    {/*
                     * Mobile cuộn ngang thay vì xuống dòng: sáu nút wrap thành
                     * hai hàng làm thanh dính cao gấp đôi, ăn mất phần ảnh vốn
                     * là thứ trang này cần hiện. `no-scrollbar` đã có sẵn ở
                     * globals.css.
                     */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:overflow-visible min-w-0">
                        {filters.map((id) => {
                            const active = filter === id
                            const label = FILTER_LABELS[id]
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setFilter(id)}
                                    aria-pressed={active}
                                    className={`shrink-0 whitespace-nowrap h-[36px] px-3.5 rounded-[6px] text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E89] ${
                                        active
                                            ? 'bg-[#1D4E89] border border-transparent text-white shadow-xs'
                                            : 'bg-white border border-[#ECECEC] text-[#4B5563] hover:border-[#1D4E89] hover:text-[#1D4E89]'
                                    }`}
                                >
                                    {isEn ? label.en : label.vi}
                                </button>
                            )
                        })}
                    </div>
                    <span aria-live="polite" className="shrink-0 text-xs text-[#6B7280]">
                        {visible.length} {isEn ? 'photos' : 'ảnh'}
                    </span>
                </div>

                {visible.length === 0 ? (
                    // Trạng thái rỗng phải nói rõ làm gì tiếp (luật D6)
                    <p className="text-sm text-[#4B5563] bg-white border border-[#ECECEC] rounded-[12px] p-6 text-center">
                        {isEn
                            ? 'No photos in this group yet. Choose “All” to see the full gallery.'
                            : 'Nhóm này chưa có ảnh. Chọn “Tất cả” để xem toàn bộ thư viện.'}
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {visible.map((photo) => (
                            <figure
                                key={photo.id}
                                className="relative aspect-[4/3] rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group bg-white"
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
                )}

                {/* Dải kêu gọi đặt phòng — như bản /h7/gallery */}
                <div className="mt-8 bg-[#FAFAF8] border border-[#ECECEC] rounded-[12px] p-5 sm:p-8 flex items-center justify-between gap-5 flex-wrap">
                    <div>
                        <h2 className="font-serif text-base sm:text-xl font-bold text-[#1A1A1A]">
                            {isEn ? 'Like what you see?' : 'Thích không gian này?'}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#4B5563] font-normal mt-0.5">
                            {isEn
                                ? 'Check availability and book your stay directly with us.'
                                : 'Kiểm tra phòng trống và đặt trực tiếp với resort.'}
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Link href="/rooms">
                            <Button variant="primary" size="sm" radius="6px">
                                {isEn ? 'View rooms' : 'Xem phòng'}
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="secondary" size="sm" radius="6px">
                                {isEn ? 'Contact us' : 'Liên hệ'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
