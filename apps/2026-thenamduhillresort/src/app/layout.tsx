import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'The Nam Du Hill Resort',
    description: 'Khu nghỉ dưỡng Nam Du — bản dựng khởi đầu.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    )
}
