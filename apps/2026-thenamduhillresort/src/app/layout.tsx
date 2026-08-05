import type { Metadata } from 'next'
import './globals.css'
import '@repo/styling-css/contract.css'
import '@repo/theme-h2/tokens.css'
import '@repo/theme-h3/tokens.css'
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
      {/*
        * `data-theme` là BẮT BUỘC, không phải trang trí.
        *
        * `@repo/theme-h2/tokens.css` khai mọi biến trong `[data-theme='h2']`.
        * Thiếu thuộc tính này thì cả trang rơi về bộ dự phòng xám của
        * `@repo/styling-css/contract.css` — header và footer dùng chung sẽ mất
        * hết màu thương hiệu dù build vẫn xanh.
        *
        * Màu nền và chữ đọc từ token thay vì hex cứng, để đổi mẫu chỉ cần đổi
        * dòng import `tokens.css` ở trên (luật D0).
        */}
      <body
        data-theme="h2"
        className="bg-surface-base font-primary text-text-primary antialiased"
      >
        <LanguageProvider>
          <Header />
          {/*
            * `overflow-x-clip` chứ KHÔNG phải `overflow-x-hidden`.
            *
            * `overflow-x: hidden` khiến trình duyệt tính `overflow-y` thành
            * `auto`, biến div này thành một scroll container. Mọi
            * `position: sticky` bên trong sẽ dính vào DIV đó thay vì vào
            * viewport — cuộn trang là thanh dính trôi mất. Đây đúng là lý do
            * bộ lọc ở /gallery không dính được.
            *
            * `clip` chặn tràn ngang y hệt nhưng KHÔNG tạo scroll container,
            * nên sticky ở mọi trang con vẫn hoạt động.
            */}
          <div className="w-full overflow-x-clip">{children}</div>
          <Footer />
          <MobileStickyCta />
        </LanguageProvider>
      </body>
    </html>
  )
}
