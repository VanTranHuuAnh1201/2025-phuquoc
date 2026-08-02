import type { Metadata } from 'next'
import { LanguageProvider } from '../context/LanguageContext'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { MobilePreviewModal } from '../components/common/MobilePreviewModal'

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
          input, button, select, textarea { font-family: inherit; }
          @keyframes ndFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes ndRise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
          ::selection { background: #00c46a; color: #04241a; }

          /* Global responsive side padding & layout adjustments for mobile */
          @media (max-width: 768px) {
            main, section, header, footer {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }
            .mobile-grid-1col {
              grid-template-columns: 1fr !important;
            }
            .mobile-padding-sm {
              padding: 20px 16px !important;
            }
          }
          @media (max-width: 480px) {
            main, section, header, footer {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }
          }
        `}</style>
      </head>
      <body>
        <LanguageProvider>
          <Header />
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>{children}</div>
          <Footer />
          <MobilePreviewModal />
        </LanguageProvider>
      </body>
    </html>
  )
}
