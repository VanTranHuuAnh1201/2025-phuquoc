import Link from 'next/link'
import { getProperty, pick, DEFAULT_LOCALE, isLocale } from '@repo/core'

import { themes } from '@/themes/registry'

/**
 * Trang hub — liệt kê mọi mẫu để khách chọn.
 *
 * Nội dung sinh từ registry, nên thêm mẫu mới là thẻ tự hiện, không phải sửa
 * file này (luật R5).
 */

export async function generateMetadata() {
    const data = await getProperty()
    return {
        title: `${data.brand.name} — chọn giao diện`,
        description:
            'Cùng một nội dung, nhiều giao diện. Chọn mẫu hợp với thương hiệu của bạn.',
    }
}

export default async function HubPage({
    searchParams,
}: {
    searchParams: Promise<{ lang?: string }>
}) {
    const { lang } = await searchParams
    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const data = await getProperty()
    const vi = locale === 'vi'

    return (
        <main
            style={{
                fontFamily: 'system-ui, sans-serif',
                background: '#f7fafc',
                minHeight: '100vh',
                padding: '4rem 1rem',
            }}
        >
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <p
                        style={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontSize: '0.8rem',
                            color: '#718096',
                            margin: '0 0 0.75rem',
                        }}
                    >
                        {data.brand.name}
                    </p>
                    <h1
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            color: '#1a202c',
                            margin: '0 0 1rem',
                            lineHeight: 1.2,
                        }}
                    >
                        {vi ? 'Chọn giao diện cho website của bạn' : 'Choose your interface'}
                    </h1>
                    <p
                        style={{
                            color: '#4a5568',
                            maxWidth: '60ch',
                            margin: '0 auto',
                            lineHeight: 1.7,
                        }}
                    >
                        {vi
                            ? 'Tất cả các mẫu dùng chung một nguồn nội dung — phòng, giá và đơn đặt phía sau đều là một. Sau này đổi mẫu không phải làm lại website.'
                            : 'Every design shares one content source — the rooms, prices and bookings behind them are identical. Switching later costs a configuration change, not a rebuild.'}
                    </p>
                </header>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    {themes.map(({ meta }) => (
                        <Link
                            key={meta.slug}
                            href={`/${meta.slug}?lang=${locale}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <article
                                style={{
                                    background: '#fff',
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 14px rgba(0,0,0,.06)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        aspectRatio: '16 / 10',
                                        background: `linear-gradient(135deg, ${meta.swatch.brand}, ${meta.swatch.accent})`,
                                    }}
                                />
                                <div style={{ padding: '1.25rem', flex: 1 }}>
                                    <p
                                        style={{
                                            fontSize: '0.8rem',
                                            color: '#a0aec0',
                                            margin: '0 0 0.35rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {meta.num}
                                    </p>
                                    <h2
                                        style={{
                                            fontSize: '1.15rem',
                                            fontWeight: 700,
                                            margin: '0 0 0.5rem',
                                        }}
                                    >
                                        {pick(meta.name, locale)}
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: '0.9rem',
                                            color: '#4a5568',
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}
                                    >
                                        {pick(meta.description, locale)}
                                    </p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}
