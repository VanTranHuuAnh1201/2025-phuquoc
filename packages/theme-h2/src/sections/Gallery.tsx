import type { Locale, PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

/**
 * Ảnh thật tại resort.
 *
 * Bản thiết kế bỏ lưới mosaic của mẫu 01, thay bằng một hàng năm ảnh đều
 * nhau — desktop dàn hết chiều ngang, mobile cuộn ngang.
 *
 * Ảnh lấy từ `data.rooms` khi có; chỗ nào thiếu thì `ImageSlot` giữ đúng ô
 * trong lưới để bố cục không sập (xem chú thích trong ImageSlot về luật R9).
 */

const TILES = [
    { vi: 'Phòng nghỉ', en: 'Guest room' },
    { vi: 'Hồ bơi', en: 'Swimming pool' },
    { vi: 'Bãi Cây Mến', en: 'Cay Men beach' },
    { vi: 'BBQ hải sản', en: 'Seafood BBQ' },
    { vi: 'Hoàng hôn', en: 'Sunset' },
] as const

export function Gallery({ data, locale }: { data: PropertyData; locale: Locale }) {
    const sectionTitle = locale === 'vi' ? 'Ảnh thật tại resort' : 'Real photos at the resort'
    const linkLabel = locale === 'vi' ? 'Xem tất cả' : 'View all'

    // Gom ảnh sẵn có từ các hạng phòng — nguồn duy nhất là `core` (luật R8).
    const images = data.rooms.flatMap((room) => room.images ?? [])

    return (
        <section
            id="gallery"
            className="bg-surface-raised pt-[26px] pb-2 [scroll-margin-top:80px] min-[960px]:pt-[36px] min-[960px]:pb-3"
        >
            <div className="mx-auto max-w-[var(--container)]">
                <div className="mb-3 flex items-center gap-3 px-4 min-[960px]:mb-[20px] min-[960px]:px-6">
                    <h2 className="mr-auto text-[15px] font-bold tracking-[0.07em] text-text-primary uppercase min-[960px]:text-[16px]">
                        {sectionTitle}
                    </h2>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-[6px] text-[13px] font-semibold whitespace-nowrap text-brand no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                        {linkLabel}
                        <span aria-hidden="true">→</span>
                    </a>
                </div>

                <div
                    className={[
                        // MOBILE: băng cuộn ngang, lộ mép ô kế tiếp.
                        'grid grid-flow-col [grid-auto-columns:52vw] gap-[10px]',
                        'overflow-x-auto [scroll-snap-type:x_mandatory]',
                        'pt-1 px-4 pb-[18px]',
                        // Ẩn thanh cuộn: đây là carousel có chủ đích, thanh cuộn
                        // hệ thống làm vỡ nhịp ảnh.
                        '[-webkit-overflow-scrolling:touch] [scrollbar-width:none]',
                        '[&::-webkit-scrollbar]:hidden',
                        // DESKTOP: năm ô dàn đều hết chiều ngang, hết cuộn.
                        'min-[960px]:grid-flow-row min-[960px]:grid-cols-5',
                        'min-[960px]:[grid-auto-columns:auto] min-[960px]:gap-[14px]',
                        'min-[960px]:overflow-x-visible min-[960px]:px-6 min-[960px]:pb-2',
                    ].join(' ')}
                >
                    {TILES.map((tile, index) => (
                        <div
                            key={tile.en}
                            className="h-[120px] overflow-hidden rounded-md [scroll-snap-align:start] min-[960px]:h-[150px]"
                        >
                            <ImageSlot
                                placeholder={tile[locale]}
                                src={images[index]}
                                height="100%"
                                style={{ borderRadius: 'var(--radius)' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
