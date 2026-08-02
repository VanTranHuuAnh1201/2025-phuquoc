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
          html, body {
            margin: 0;
            padding: 0;
            font-family: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
            background: #ffffff;
            color: #0b1b26;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
            width: 100%;
          }
          a { color: #0284c7; text-decoration: none; }
          a:hover { color: #0369a1; }
          :focus-visible { outline: 3px solid #0284c7; outline-offset: 3px; border-radius: 6px; }
          input, button, select, textarea { font-family: inherit; max-width: 100%; }
          img, iframe { max-width: 100%; }
          @keyframes ndFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes ndRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ndPulse { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.4); opacity: 0.3; } }
          @keyframes ndShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          @keyframes ndGlowPulse { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.06); } }

          .nd-card {
            transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 300ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 300ms ease;
            will-change: transform, box-shadow;
          }
          .nd-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px -12px rgba(2, 132, 199, 0.16), 0 8px 16px -8px rgba(0, 0, 0, 0.06);
            border-color: rgba(2, 132, 199, 0.35) !important;
          }

          .nd-card-img-zoom {
            overflow: hidden;
          }
          .nd-card-img-zoom img {
            transition: transform 600ms cubic-bezier(0.25, 1, 0.5, 1) !important;
          }
          .nd-card:hover .nd-card-img-zoom img,
          .nd-card-img-zoom:hover img {
            transform: scale(1.07) !important;
          }

          .nd-btn-primary {
            position: relative;
            overflow: hidden;
            transition: transform 150ms ease, box-shadow 200ms ease, background 200ms ease !important;
          }
          .nd-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 24px -4px rgba(2, 132, 199, 0.40) !important;
          }
          .nd-btn-primary:active {
            transform: translateY(0) scale(0.98);
          }
          .nd-btn-primary::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 60%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
            transform: translateX(-120%);
          }
          .nd-btn-primary:hover::after {
            animation: ndShimmer 900ms ease-out forwards;
          }

          .nd-pulse-dot {
            position: relative;
            display: inline-block;
          }
          .nd-pulse-dot::before {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            background: currentColor;
            animation: ndPulse 2s infinite ease-in-out;
          }

          .nd-interactive-pill {
            transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .nd-interactive-pill:hover {
            transform: translateY(-2px) scale(1.02);
          }

          .nd-glow-card {
            position: relative;
          }
          .nd-glow-card::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(2,132,199,0.3), transparent 60%, rgba(0,196,106,0.3));
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 0;
            transition: opacity 300ms ease;
          }
          .nd-glow-card:hover::before {
            opacity: 1;
          }

          ::selection { background: #00c46a; color: #04241a; }

          /* Responsive & Safe Top Layout Rules */
          :root {
            --sat: max(14px, env(safe-area-inset-top, 14px));
          }

          @media (max-width: 768px) {
            .nd-page-main {
              padding-top: calc(64px + var(--sat)) !important;
            }
            .nd-section-container {
              padding-left: 14px !important;
              padding-right: 14px !important;
            }
            .nd-card-padding {
              padding: 16px 14px !important;
            }
            .nd-grid-responsive {
              grid-template-columns: 1fr !important;
            }
            .nd-flex-responsive {
              flex-direction: column !important;
              align-items: stretch !important;
            }
          }
          @media (max-width: 480px) {
            .nd-section-container {
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
