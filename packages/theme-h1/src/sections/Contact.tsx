import { pick, telHref, themeRoot, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'
import { IconPhone, IconZalo } from '../components/icons'

/**
 * Section `contact` — footer, dải đậm thứ hai (và cuối cùng) của trang.
 *
 * Đường liên hệ NGƯỜI THẬT: địa chỉ, hotline `tel:`, email, Zalo. Chỉ render
 * kênh có dữ liệu thật trong core — không bịa link Facebook/TikTok khi khách
 * chưa cấp (M4); bổ sung khi có URL chính thức.
 * Link chính sách trỏ về mục FAQ (#booking) có nội dung tóm tắt — cấm `href="#"`.
 */

export function Contact({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const { brand } = data
    const zaloPhone = brand.phone.replace(/\s/g, '')

    return (
        <footer id="contact" className="mt-7 bg-surface-strong text-text-inverse">
            <div className="h6-container p-6 px-4">
                {/* Mobile một cột; ≥900px chia 7/5 — breakpoint riêng của mẫu,
                    không trùng thang mặc định của Tailwind nên viết arbitrary. */}
                <div className="grid gap-5 min-[900px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                    <div>
                        <p className="h6-display mt-0 mb-2 text-xl">
                            {brand.name} {brand.suffix}
                        </p>
                        <p className="mt-0 mb-3 max-w-[48ch] opacity-85">
                            {pick(brand.address, locale)}
                        </p>
                        <p className="m-0 text-sm opacity-85">
                            <a href={`mailto:${brand.email}`} className="text-text-inverse">
                                {brand.email}
                            </a>
                            {' · '}
                            {brand.site}
                        </p>
                    </div>

                    {/* K7: Zalo + hotline lên đầu trên mobile, về đúng cột ở ≥900px. */}
                    <div className="order-first grid content-start gap-2 min-[900px]:order-none">
                        <p className="h6-kicker m-0 text-text-inverse opacity-80">
                            {t.contactKicker}
                        </p>
                        <a
                            href={telHref(brand.phone)}
                            aria-label={
                                locale === 'vi'
                                    ? `Gọi hotline ${brand.phone}`
                                    : `Call hotline ${brand.phone}`
                            }
                            className="inline-flex min-h-[32px] items-center gap-[10px] text-lg font-bold text-text-inverse no-underline"
                        >
                            <IconPhone size={18} /> {brand.phone}
                        </a>
                        <a
                            href={`https://zalo.me/${zaloPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={
                                locale === 'vi'
                                    ? 'Nhắn Zalo cho resort (mở tab mới)'
                                    : 'Message the resort on Zalo (new tab)'
                            }
                            className="inline-flex min-h-[32px] items-center gap-[10px] text-text-inverse underline [text-underline-offset:4px]"
                        >
                            {/* Zalo OA placeholder — fake data theo D-8, thay khi có OA thật. */}
                            <IconZalo size={18} /> Zalo
                        </a>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-[var(--overlay-line)] pt-3 text-sm opacity-85">
                    <span>
                        © {brand.name} {brand.suffix}
                    </span>
                    <a
                        href={`${themeRoot(meta.slug)}#booking`}
                        title={t.policyNote}
                        className="text-text-inverse"
                    >
                        {t.policyBooking}
                    </a>
                </div>
            </div>
        </footer>
    )
}
