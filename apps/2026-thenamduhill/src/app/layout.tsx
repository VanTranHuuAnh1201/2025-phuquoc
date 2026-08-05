import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Lora } from 'next/font/google'
import '@repo/ui/tokens.css'
import '@repo/theme-h1/tokens.css'
import '@repo/theme-h2/tokens.css'
import './globals.css'

/**
 * Layout gốc. Token của mọi theme nạp ở đây; theme nào ăn vào DOM phụ thuộc
 * thuộc tính `data-theme` mà composition của theme đó tự đặt.
 *
 * Thêm mẫu mới: thêm một dòng import tokens.css (+ khai next/font nếu mẫu
 * dùng font riêng). Đây là ngoại lệ duy nhất cho luật R5 và cố ý giữ gọn.
 */

/**
 * Font của mẫu 05 "Tropical Bright" — display Lora + body Be Vietnam Pro,
 * subset vietnamese để dấu `ệ ự ỡ ẳ Đ` không vỡ (K2). Chỉ tokens.css của h5
 * đọc hai biến này; các mẫu khác không bị ảnh hưởng.
 */
const lora = Lora({
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '700'],
    display: 'swap',
    variable: '--font-lora',
})

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '700'],
    display: 'swap',
    variable: '--font-bevietnam',
})

export const metadata: Metadata = {
    title: 'Booking Platform',
    description: 'Một nền tảng, nhiều giao diện — dành cho khách sạn, resort và công ty lữ hành.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body className={`${lora.variable} ${beVietnamPro.variable}`}>{children}</body>
        </html>
    )
}
