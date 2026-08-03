import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '../context/LanguageContext'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { MobileStickyCta } from '../components/common/MobileStickyCta'

export const metadata: Metadata = {
  title: 'THE NAM DU HILL · Hilltop Boutique Resort',
  description: 'Bình minh và hoàng hôn từ cùng một sân hiên. Khu nghỉ dưỡng cao cấp trên ngọn đồi Nam Du.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <Header />
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>{children}</div>
          <Footer />
          <MobileStickyCta />
        </LanguageProvider>
      </body>
    </html>
  )
}
