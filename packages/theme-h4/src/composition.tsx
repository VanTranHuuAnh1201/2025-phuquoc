import type { ReactNode } from 'react'
import {
    pick,
    roomPath,
    themePath,
    type Locale,
    type PropertyData,
    type Room,
    type SectionId,
} from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import * as art from './images'
import { meta } from './meta'
import { Assurance } from './sections/Assurance'
import { Culinary } from './sections/Culinary'
import { Hero, type HeroSearchParams, type HeroSlide } from './sections/Hero'
import { Sanctuaries } from './sections/Sanctuaries'
import { Setting } from './sections/Setting'

/**
 * Bố cục mẫu 04 — "Nam Du Quiet Luxury".
 *
 * MAP SECTION ID (luật R7 — bộ id không được đổi tên):
 *
 *   Hero        → `top`      ảnh tràn khổ + thanh concierge đặt phòng
 *   Setting     → `about`    vị thế resort + phim giới thiệu
 *   Sanctuaries → `rooms`    ba hạng phòng tiêu biểu, lưới so le
 *   Culinary    → `dining`   dải 21:9 + khối chữ trên nền tối
 *   Assurance   → `contact`  ba cam kết + lối vào đặt phòng cuối trang
 *
 * `tours` · `places` · `gallery` · `booking` chưa có ở bản này — theme được
 * bỏ bớt section, chỉ không được đổi tên id. Mảng `sections` dưới đây khai
 * đúng những gì THẬT SỰ render, để hub và điều hướng không trỏ vào chỗ trống.
 *
 * NHỊP SECTION (P5): sáng → sáng → cát → TỐI → sáng. Dải tối ở giữa là điểm
 * nghỉ của mắt; không có nó thì cuộn hết trang là một mạch đều đều.
 */

export const sections: readonly SectionId[] = ['top', 'about', 'rooms', 'dining', 'contact'] as const

export interface HomeProps {
    data: PropertyData
    locale: Locale
    /** Chèn thêm vào header — vd nút tài khoản của app. */
    extra?: ReactNode

    /**
     * ĐƯỜNG DẪN ẢNH DO APP CẤP — TUỲ CHỌN.
     *
     * Khác với mẫu 03 (bắt buộc app bơm ảnh), mẫu này tự mang bộ ảnh đã tuyển
     * trong `images.ts`. Lý do: quyết định "ảnh nào ở hero" là quyết định thẩm
     * mỹ, mà thẩm mỹ là thứ duy nhất theme sở hữu (luật R4).
     *
     * App vẫn đè được nếu cấu trúc `public/` của nó khác — nên theme dùng được
     * ở app thứ hai mà không phải sửa gì bên trong.
     */
    heroSlides?: readonly HeroSlide[]
    settingImage?: string
    culinaryImage?: string
    /** Phim giới thiệu. Không truyền thì nút Play tự ẩn. */
    videoSrc?: string

    /** Người dùng bấm tìm phòng. Không truyền thì rơi về `searchHref`. */
    onSearch?: (params: HeroSearchParams) => void
    searchHref?: string
}

/** Ba hạng phòng đem trưng bày: rẻ nhất, giữa, và hạng lớn nhất. */
function featuredRooms(rooms: readonly Room[]): readonly Room[] {
    if (rooms.length <= 3) return rooms
    const sorted = rooms.slice().sort((a, b) => a.price - b.price)
    const cheapest = sorted[0]
    const largest = sorted.slice().sort((a, b) => b.guests - a.guests)[0]
    const middle = sorted.find((r) => r !== cheapest && r !== largest)
    return [cheapest, middle, largest].filter(Boolean) as Room[]
}

/**
 * `overflow-x-clip` chứ KHÔNG phải `overflow-x-hidden`.
 *
 * Spec CSS: khi một trục là `hidden` còn trục kia `visible`, trình duyệt âm
 * thầm đổi trục `visible` thành `auto`. Nên `overflow-x: hidden` biến phần tử
 * này thành scroll container, và mọi `position: sticky` bên trong dính vào NÓ
 * thay vì vào viewport. `clip` chặn tràn ngang y hệt mà không tạo scroll
 * container.
 */
export function Home({
    data,
    locale,
    extra,
    heroSlides,
    settingImage,
    culinaryImage,
    videoSrc,
    onSearch,
    searchHref,
}: HomeProps) {
    const slug = meta.slug
    const roomsHref = themePath(slug, 'rooms')

    const slides = heroSlides ?? art.heroSlides

    return (
        <div data-theme="h4" className="font-primary overflow-x-clip bg-surface-base">
            {/* `locales={[]}`: app hub cắm `AccountBar` vào `extra`, mà bar đó
                ĐÃ có bộ chuyển ngôn ngữ riêng. Để `siteHeaderPropsOf` bơm
                thêm `locales` nữa là header hiện "VI | EN VI | EN" — thấy rõ
                trên ảnh audit. Tắt bộ của header, giữ bộ của app. */}
            <SiteHeader
                {...siteHeaderPropsOf(data, locale, slug)}
                locales={[]}
                extra={extra}
                transparentOnTop
            />

            <main>
                <Hero
                    locale={locale}
                    slides={slides}
                    onSearch={onSearch}
                    searchHref={searchHref ?? roomsHref}
                />

                <Setting
                    locale={locale}
                    image={settingImage ?? art.settingImage.src}
                    imageAlt={pick(art.settingImage.alt, locale)}
                    videoSrc={videoSrc ?? art.introVideo}
                    videoPoster={settingImage ?? art.settingImage.src}
                />

                <Sanctuaries
                    locale={locale}
                    rooms={featuredRooms(data.rooms)}
                    imageFor={(room) => art.roomImage(room.id)}
                    roomHref={(room) => roomPath(slug, room.id)}
                    allRoomsHref={roomsHref}
                />

                <Culinary
                    locale={locale}
                    image={culinaryImage ?? art.culinaryImage.src}
                    imageAlt={pick(art.culinaryImage.alt, locale)}
                />

                <Assurance locale={locale} brand={data.brand} bookHref={roomsHref} />
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />
        </div>
    )
}
