import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '../context/LanguageContext'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { MobileStickyCta } from '../components/common/MobileStickyCta'

export const metadata: Metadata = {
  title: 'THE NAM DU HILL · Hilltop Boutique Resort',
  description: 'Bình minh và hoàng hôn từ cùng một sân hiên. Khu nghỉ dưỡng cao cấp trên ngọn đồi Nam Du.',
  icons: {
    icon: '/OP5.ico',
    shortcut: '/OP5.ico',
    apple: '/OP5.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAFAFA] text-[#344054] font-sans antialiased">
        <LanguageProvider>
          <Header />
          <div className="w-full overflow-x-hidden">{children}</div>
          <Footer />
          <MobileStickyCta />
        </LanguageProvider>
      </body>
    </html>
  )
}
