import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sản phẩm web thương mại — đặt phòng & du lịch',
    description:
        'Danh mục sản phẩm: hệ thống đặt phòng khách sạn, nền tảng tour du lịch. Dựng bằng Next.js 15 trên nền monorepo dùng chung.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    )
}
