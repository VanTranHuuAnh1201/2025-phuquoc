import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thenamduhillresort.com'
    const now = new Date()

    return [
        {
            url: `${siteUrl}/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${siteUrl}/booking`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/lookup`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${siteUrl}/login`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]
}
