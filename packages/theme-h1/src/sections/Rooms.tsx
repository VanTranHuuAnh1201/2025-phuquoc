import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { fill, fitFor, ui } from '../strings'

/**
 * Section `rooms` — spec v4 §2.1 "ít card trang trí, nhiều dòng so sánh rõ":
 * 4 phòng nổi bật dựng thành DÒNG SO SÁNH ngang, đúng anatomy row của trang
 * Rooms (§5.2: ảnh · tên/giường/view · giá + CTA) — Home và Rooms nói cùng
 * một ngôn ngữ (§13.1).
 *
 * "Xem chi tiết" là CTA phụ trên từng dòng; CTA của section là nút xanh
 * "Xem tất cả N hạng phòng" (§4.5). Vàng để dành cho CTA booking (§2.1).
 */

const SLUG = meta.slug

export function Rooms({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const rooms = data.rooms.slice(0, 4)
    const roomsHref = `${themePath(SLUG, 'rooms')}${locale === 'vi' ? '' : '?lang=en'}`

    return (
        <section id="rooms" className="pt-7">
            <div className="h6-container">
                <p className="h6-kicker mt-0 mb-2">{t.roomsKicker}</p>
                <h2 className="h6-display mt-0 mb-5 text-3xl">{t.roomsTitle}</h2>

                <div className="border-t border-border-default">
                    {rooms.map((room) => {
                        const extra = data.roomExtras[room.id]
                        const specs = [
                            extra ? pick(extra.bed, locale) : null,
                            extra ? pick(extra.view, locale) : null,
                            room.area,
                        ].filter(Boolean)

                        return (
                            <a
                                key={room.id}
                                // `group` để hover trên cả dòng đổi màu tiêu đề và
                                // nền nút phụ (trước đây là selector con trong <style>).
                                className="group grid items-center gap-4 border-b border-border-muted py-4 text-inherit no-underline min-[900px]:grid-cols-[280px_minmax(0,1fr)_220px]"
                                href={`${themePath(SLUG, 'rooms')}/${room.id}${locale === 'vi' ? '' : '?lang=en'}`}
                            >
                                <div className="aspect-[3/2] overflow-hidden rounded-md bg-[var(--color-surface-sand)]">
                                    {room.images?.[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={room.images[0]}
                                            alt={pick(room.name, locale)}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="h6-display mt-0 mb-2 text-xl transition-colors duration-[var(--motion-instant)] ease-linear group-hover:text-brand">
                                        {pick(room.name, locale)}
                                    </h3>
                                    {specs.length > 0 && (
                                        <p className="mt-0 mb-1 text-sm text-text-secondary">
                                            {specs.join(' · ')}
                                        </p>
                                    )}
                                    <p className="m-0 text-sm text-text-secondary">
                                        {t.fitLabel}: {fitFor(room, locale)}
                                    </p>
                                </div>

                                <div className="min-[900px]:text-right">
                                    <p className="mt-0 mb-2">
                                        <span className="text-sm text-text-secondary">
                                            {t.fromPrice}{' '}
                                        </span>
                                        <strong className="text-xl [font-variant-numeric:tabular-nums]">
                                            {formatPrice(room.price, locale)}
                                        </strong>
                                        <span className="text-sm text-text-secondary">
                                            {t.perNight}
                                        </span>
                                    </p>
                                    {/* CTA phụ — cả dòng đã là link nên đây là span tạo hình nút. */}
                                    <span className="h6-btn h6-btn-ghost min-h-[40px] group-hover:border-[var(--border-strong)] group-hover:bg-[var(--color-surface-sand)]">
                                        {t.seeDetail}
                                    </span>
                                </div>
                            </a>
                        )
                    })}
                </div>

                <div className="pt-5 text-center">
                    <a className="h6-btn h6-btn-brand" href={roomsHref}>
                        {fill(t.viewAllRooms, { n: data.rooms.length })}
                    </a>
                </div>
            </div>
        </section>
    )
}
