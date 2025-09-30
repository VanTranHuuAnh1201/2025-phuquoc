import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import FloatingChat from '../components/FloatingChat'
import Header from '../components/Header'
import { LanguageProvider } from '../contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const currentLocale = locale || 'vi'

    const metadata = {
        vi: {
            title: 'Pho Group Phú Quốc - Hải Sản, Villa & Du Lịch',
            description: 'Khám phá Phú Quốc với Pho Group: Hải sản tươi sống PhoFood, Villa cao cấp Pho Retreat, Tour du lịch Pho Travel. Trải nghiệm hoàn hảo tại đảo ngọc Phú Quốc.',
            keywords: 'Phú Quốc, hải sản, villa, du lịch, PhoFood, Pho Retreat, Pho Travel',
        },
        en: {
            title: 'Pho Group Phu Quoc - Seafood, Villa & Travel',
            description: 'Discover Phu Quoc with Pho Group: Fresh seafood PhoFood, Luxury villas Pho Retreat, Travel tours Pho Travel. Perfect experience at Phu Quoc pearl island.',
            keywords: 'Phu Quoc, seafood, villa, travel, PhoFood, Pho Retreat, Pho Travel',
        }
    }

    const currentMeta = metadata[currentLocale as keyof typeof metadata] || metadata.vi
    return {
        title: currentMeta.title,
        description: currentMeta.description,
        keywords: currentMeta.keywords,
        robots: 'index, follow',
        openGraph: {
            title: currentMeta.title,
            description: currentMeta.description,
            type: 'website',
            locale: currentLocale === 'vi' ? 'vi_VN' : 'en_US',
            siteName: 'Pho Group Phú Quốc',
        },
        twitter: {
            card: 'summary_large_image',
            title: currentMeta.title,
            description: currentMeta.description,
        },
        alternates: {
            canonical: `/${currentLocale}`,
            languages: {
                'vi': '/vi',
                'en': '/en',
            }
        }
    }
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const currentLocale = locale || 'vi'

    return (
        <html lang={currentLocale}>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="google-site-verification" content="" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Pho Group Phú Quốc",
                            "url": `https://phogroup.com/${currentLocale}`,
                            "logo": "https://phogroup.com/logo.png",
                            "sameAs": [
                                "https://facebook.com/phogroup",
                                "https://instagram.com/phogroup",
                                "https://tiktok.com/@phogroup"
                            ],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+84-297-123-4567",
                                "contactType": "customer service"
                            }
                        })
                    }}
                />
            </head>
            <body className={inter.className}>
                <LanguageProvider initialLocale={currentLocale}>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <FloatingChat />
                </LanguageProvider>
            </body>
        </html>
    )
}

export async function generateStaticParams() {
    return [
        { locale: 'vi' },
        { locale: 'en' },
    ]
}
