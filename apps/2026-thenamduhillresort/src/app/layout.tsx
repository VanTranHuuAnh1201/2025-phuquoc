import type { Metadata } from 'next'
import { LanguageProvider } from '../context/LanguageContext'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'

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
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
            background: #ffffff;
            color: #0b1b26;
            -webkit-font-smoothing: antialiased;
          }
          a { color: #0284c7; text-decoration: none; }
          a:hover { color: #0369a1; }
          :focus-visible { outline: 3px solid #0284c7; outline-offset: 3px; border-radius: 6px; }
          input, button, select { font-family: inherit; }
          @keyframes ndFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes ndRise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
          ::selection { background: #00c46a; color: #04241a; }
        `}</style>
      </head>
      <body>
        <LanguageProvider>
          <Header />
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
