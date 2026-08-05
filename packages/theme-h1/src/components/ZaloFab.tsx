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
            className={[
                'fixed right-4 z-40 flex h-[56px] w-[56px] items-center justify-center',
                // Trên mobile phải nhường chỗ cho thanh CTA dính đáy + tai thỏ.
                'bottom-[calc(84px+env(safe-area-inset-bottom,0px))]',
                // 900px là ngưỡng riêng của mẫu (không phải md/lg mặc định).
                'min-[900px]:bottom-6',
                'rounded-[999px] bg-surface-raised text-brand',
                'border border-border-default shadow-2',
                'transition-[box-shadow,border-color] duration-[var(--motion-instant)] ease-out',
                // Hover nâng bóng lên bậc `--shadow-lg` của hợp đồng `ui`.
                'hover:border-brand hover:shadow-[var(--shadow-lg)]',
                'active:brightness-[0.96]',
            ].join(' ')}
        >
            <IconZalo size={26} />
        </a>
    )
}
