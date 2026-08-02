import { products } from '../products'

/**
 * Trang chính của monorepo — danh mục sản phẩm.
 *
 * Mỗi thẻ trỏ sang một app deploy độc lập, nên dùng thẻ <a> với URL tuyệt đối
 * chứ không phải <Link> của Next (Link chỉ dùng cho điều hướng nội bộ).
 */

const STATUS_LABEL: Record<string, string> = {
    live: 'Đang vận hành',
    demo: 'Bản demo',
    wip: 'Đang phát triển',
}

export default function HomePage() {
    return (
        <main
            style={{
                minHeight: '100vh',
                background: '#0B1120',
                color: '#E2E8F0',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                padding: '5rem 1.5rem',
            }}
        >
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <p
                        style={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.18em',
                            fontSize: '0.75rem',
                            color: '#64748B',
                            margin: '0 0 1rem',
                        }}
                    >
                        Sản phẩm web thương mại
                    </p>
                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                            fontWeight: 800,
                            lineHeight: 1.15,
                            margin: '0 0 1.25rem',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Đặt phòng, đặt tour —{' '}
                        <span style={{ color: '#38BDF8' }}>dựng để chạy thật.</span>
                    </h1>
                    <p
                        style={{
                            fontSize: '1.05rem',
                            lineHeight: 1.75,
                            color: '#94A3B8',
                            maxWidth: '62ch',
                            margin: 0,
                        }}
                    >
                        Các sản phẩm dưới đây dùng chung một nền tảng: cùng lõi nghiệp vụ,
                        cùng bộ component, nhưng mỗi sản phẩm triển khai và vận hành độc
                        lập. Bấm vào để xem bản demo.
                    </p>
                </header>

                <section
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {products.map((product) => (
                        <a
                            key={product.id}
                            href={product.url}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'block',
                            }}
                        >
                            <article
                                style={{
                                    background: '#111C33',
                                    border: '1px solid #1E293B',
                                    borderRadius: 18,
                                    overflow: 'hidden',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        height: 6,
                                        background: product.accent,
                                    }}
                                />
                                <div
                                    style={{
                                        padding: '1.75rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem',
                                        flex: 1,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                        }}
                                    >
                                        <h2
                                            style={{
                                                fontSize: '1.3rem',
                                                fontWeight: 700,
                                                margin: 0,
                                            }}
                                        >
                                            {product.name}
                                        </h2>
                                        <span
                                            style={{
                                                fontSize: '0.7rem',
                                                padding: '0.15rem 0.55rem',
                                                borderRadius: 999,
                                                background: '#1E293B',
                                                color: '#94A3B8',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {STATUS_LABEL[product.status]}
                                        </span>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: '0.9rem',
                                            color: product.accent,
                                            margin: 0,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {product.tagline.vi}
                                    </p>

                                    <p
                                        style={{
                                            fontSize: '0.92rem',
                                            lineHeight: 1.7,
                                            color: '#94A3B8',
                                            margin: 0,
                                        }}
                                    >
                                        {product.description.vi}
                                    </p>

                                    <ul
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.4rem',
                                            listStyle: 'none',
                                            padding: 0,
                                            margin: 'auto 0 0',
                                            paddingTop: '1.25rem',
                                        }}
                                    >
                                        {product.tech.map((item) => (
                                            <li
                                                key={item}
                                                style={{
                                                    fontSize: '0.72rem',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: 6,
                                                    background: '#0B1120',
                                                    border: '1px solid #1E293B',
                                                    color: '#64748B',
                                                }}
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        </a>
                    ))}
                </section>

                <footer
                    style={{
                        marginTop: '4rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid #1E293B',
                        color: '#64748B',
                        fontSize: '0.85rem',
                    }}
                >
                    <p style={{ margin: 0 }}>
                        Phát triển bởi{' '}
                        <a
                            href="https://github.com/CobyTran"
                            style={{ color: '#38BDF8', textDecoration: 'none' }}
                        >
                            CobyTran
                        </a>{' '}
                        — senior frontend engineer, sản phẩm đặt phòng &amp; du lịch.
                    </p>
                </footer>
            </div>
        </main>
    )
}
