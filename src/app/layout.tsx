import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  },
  other: {
    "google-site-verification": "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
