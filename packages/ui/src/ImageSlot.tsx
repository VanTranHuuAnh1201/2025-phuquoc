import type { CSSProperties } from 'react'

/**
 * Ô ảnh có tỉ lệ cố định.
 *
 * Thay cho `<image-slot>` của prototype. Khi chưa có ảnh — hoặc khi ảnh bị
 * loại khỏi bản production vì lý do bản quyền (luật R9) — ô này vẫn giữ đúng
 * chỗ trong lưới thay vì làm sập bố cục, và hiện nhãn mô tả để người dựng
 * biết chỗ đó cần ảnh gì.
 */

export interface ImageSlotProps {
    /** Mô tả ảnh cần đặt vào. Hiện ra khi chưa có `src`. */
    placeholder: string
    src?: string
    /** Chiều cao cố định; bỏ trống khi ô nằm trong lưới tự co giãn. */
    height?: number | string
    style?: CSSProperties
}

export function ImageSlot({ placeholder, src, height, style }: ImageSlotProps) {
    return (
        <div
            style={{
                position: 'relative',
                height,
                width: '100%',
                background: 'var(--surface-alt)',
                borderRadius: 'inherit',
                overflow: 'hidden',
                ...style,
            }}
        >
            {src ? (
                // Ảnh nội dung do dữ liệu cấp, kích thước không biết trước —
                // dùng <img> thường thay vì next/image để `ui` không phụ thuộc Next.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={placeholder}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            ) : (
                <span
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'var(--space-4)',
                        textAlign: 'center',
                        fontSize: 'var(--text-xs)',
                        lineHeight: 1.5,
                        color: 'var(--text-muted)',
                        opacity: 0.75,
                    }}
                >
                    {placeholder}
                </span>
            )}
        </div>
    )
}
