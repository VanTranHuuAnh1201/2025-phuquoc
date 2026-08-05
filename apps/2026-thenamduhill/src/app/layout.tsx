import type { Metadata } from 'next'
import '@repo/ui/tokens.css'
import '@repo/theme-h1/tokens.css'
import '@repo/theme-h2/tokens.css'
import '@repo/theme-h3/tokens.css'
import '@repo/theme-h4/tokens.css'
import '@repo/theme-h5/tokens.css'
import '@repo/theme-h6/tokens.css'
import '@repo/theme-h7/tokens.css'
import './globals.css'

/**
 * Layout gốc. Token của mọi theme nạp ở đây; theme nào ăn vào DOM phụ thuộc
 * thuộc tính `data-theme` mà composition của theme đó tự đặt.
 *
 * Thêm mẫu mới: thêm một dòng import tokens.css. Đây là ngoại lệ duy nhất
 * cho luật R5 và cố ý giữ ở mức một dòng.
 */

export const metadata: Metadata = {
    title: 'Booking Platform',
    description: 'Một nền tảng, nhiều giao diện — dành cho khách sạn, resort và công ty lữ hành.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body>{children}</body>
        </html>
    )
}
