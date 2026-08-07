import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const isProd = process.env.VERCEL_ENV === 'production'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thenamduhillresort.com'

    return isProd
        ? {
            rules: [
                {
                    userAgent: '*',
                    allow: '/',
                    disallow: ['/admin', '/api', '/my-orders'],
                },
            ],
            sitemap: `${siteUrl}/sitemap.xml`,
        }
        : {
            rules: [
                {
                    userAgent: '*',
                    disallow: '/',
                },
            ],
        }
}
