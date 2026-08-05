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
        <footer
            id="contact"
            style={{
                marginTop: 'var(--space-7)',
                background: 'var(--color-surface-strong)',
                color: 'var(--color-text-inverse)',
            }}
        >
            <div className="h6-container" style={{ padding: 'var(--space-6) var(--space-4)' }}>
                <div
                    className="h6-contact-grid"
                    style={{ display: 'grid', gap: 'var(--space-5)' }}
                >
                    <div>
                        <p
                            className="h6-display"
                            style={{ fontSize: 'var(--font-size-xl)', margin: '0 0 var(--space-2)' }}
                        >
                            {brand.name} {brand.suffix}
                        </p>
                        <p style={{ margin: '0 0 var(--space-3)', opacity: 0.85, maxWidth: '48ch' }}>
                            {pick(brand.address, locale)}
                        </p>
                        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', opacity: 0.85 }}>
                            <a
                                href={`mailto:${brand.email}`}
                                style={{ color: 'var(--color-text-inverse)' }}
                            >
                                {brand.email}
                            </a>
                            {' · '}
                            {brand.site}
                        </p>
                    </div>

                    <div className="h6-contact-actions" style={{ display: 'grid', gap: 'var(--space-2)', alignContent: 'start' }}>
                        <p className="h6-kicker" style={{ color: 'var(--color-text-inverse)', opacity: 0.8, margin: 0 }}>
                            {t.contactKicker}
                        </p>
                        <a
                            href={telHref(brand.phone)}
                            aria-label={
                                locale === 'vi'
                                    ? `Gọi hotline ${brand.phone}`
                                    : `Call hotline ${brand.phone}`
                            }
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                minHeight: 32,
                                color: 'var(--color-text-inverse)',
                                fontWeight: 'var(--font-weight-bold)' as never,
                                fontSize: 'var(--font-size-lg)',
                                textDecoration: 'none',
                            }}
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
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                minHeight: 32,
                                color: 'var(--color-text-inverse)',
                                textDecoration: 'underline',
                                textUnderlineOffset: 4,
                            }}
                        >
                            {/* Zalo OA placeholder — fake data theo D-8, thay khi có OA thật. */}
                            <IconZalo size={18} /> Zalo
                        </a>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 'var(--space-5)',
                        paddingTop: 'var(--space-3)',
                        borderTop: '1px solid var(--overlay-line)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--space-2) var(--space-4)',
                        alignItems: 'baseline',
                        fontSize: 'var(--font-size-sm)',
                        opacity: 0.85,
                    }}
                >
                    <span>© {brand.name} {brand.suffix}</span>
                    <a
                        href={`${themeRoot(meta.slug)}#booking`}
                        title={t.policyNote}
                        style={{ color: 'var(--color-text-inverse)' }}
                    >
                        {t.policyBooking}
                    </a>
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .h6-contact-grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
                }
                @media (max-width: 899.98px) {
                    /* K7: Zalo + hotline lên đầu trên mobile. */
                    .h6-contact-actions { order: -1; }
                }
            `}</style>
        </footer>
    )
}

