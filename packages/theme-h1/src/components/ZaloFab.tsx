import type { Brand, Locale } from '@repo/core'

import { IconZalo } from './icons'

/**
 * Nút Zalo nổi 56×56 mọi trang — van xả phụ của phễu (spec §3, D-8).
 *
 * ⚠️ PLACEHOLDER FAKE DATA (quyết định D-8): khách chưa cấp Zalo OA thật.
 * Link tạm trỏ zalo.me theo số hotline trong dữ liệu; khi có OA chính thức chỉ
 * thay chỗ này.
 */
export function ZaloFab({
    brand,
    locale,
    context,
}: {
    brand: Brand
    locale: Locale
    /** Tin nhắn gợi ý đính kèm — tên phòng + ngày (spec §3.3). */
    context?: string
}) {
    const phone = brand.phone.replace(/\s/g, '')
    const label =
        locale === 'vi'
            ? `Nhắn Zalo cho resort${context ? ` về ${context}` : ''}`
            : `Message the resort on Zalo${context ? ` about ${context}` : ''}`

    return (
        <a
            href={`https://zalo.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="h6-zalo-fab"
            style={{
                position: 'fixed',
                right: 16,
                bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))',
                zIndex: 40,
                width: 56,
                height: 56,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface-raised)',
                color: 'var(--color-brand)',
                border: '1px solid var(--color-border-default)',
                boxShadow: 'var(--shadow-2)',
                transition: 'box-shadow var(--motion-instant) ease, border-color var(--motion-instant) ease',
            }}
        >
            <IconZalo size={26} />
            <style>{`
                .h6-zalo-fab:hover { border-color: var(--color-brand); box-shadow: var(--shadow-lg); }
                .h6-zalo-fab:active { filter: brightness(0.96); }
                @media (min-width: 900px) {
                    .h6-zalo-fab { bottom: 24px; }
                }
            `}</style>
        </a>
    )
}

