import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pho Group - Phú Quốc: Ăn • Ở • Trải nghiệm",
  description: "Khám phá Phú Quốc cùng Pho Group - Đặc sản chuẩn vị, Villa riêng tư, Tour quốc tế. PhoFood, Pho Retreat, Pho Travel.",
  keywords: "Phu Quoc, Pho Group, tour Phú Quốc, villa Phú Quốc, đặc sản cá khô, hải sản, travel guide",
  openGraph: {
    title: "Pho Group - Phú Quốc: Ăn • Ở • Trải nghiệm",
    description: "Khám phá Phú Quốc cùng Pho Group - Đặc sản chuẩn vị, Villa riêng tư, Tour quốc tế",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Pho Group - Phú Quốc Tourism"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pho Group - Phú Quốc: Ăn • Ở • Trải nghiệm",
    description: "Khám phá Phú Quốc cùng Pho Group - Đặc sản chuẩn vị, Villa riêng tư, Tour quốc tế",
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200"],
  },
  robots: "index, follow",
  other: {
    "google-site-verification": "pho-group-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
              page_title: 'Pho Group - Phú Quốc',
              custom_map: {'dimension1': 'user_type'}
            });
          `}
        </Script>
        <Script id="google-search-console" strategy="afterInteractive">
          {`
            (function() {
              var script = document.createElement('script');
              script.async = true;
              script.src = 'https://cse.google.com/cse.js?cx=pho-group-search-engine-id';
              document.head.appendChild(script);
            })();
          `}
        </Script>
      </head>
      <body className="bg-white text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
