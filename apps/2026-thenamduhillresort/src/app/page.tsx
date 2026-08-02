/**
 * Trang duy nhất của app — bản khởi tạo.
 *
 * App này độc lập hoàn toàn với `apps/2026-thenamduhill`: package riêng, cổng
 * riêng (3003), Vercel Project riêng. Không import code của app kia.
 */

export default function HomePage() {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                background: '#0B1120',
                color: '#E2E8F0',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                padding: '1.5rem',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <p
                    style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        fontSize: '0.75rem',
                        color: '#64748B',
                        margin: '0 0 1rem',
                    }}
                >
                    2026-thenamduhillresort
                </p>
                <h1
                    style={{
                        fontSize: 'clamp(2rem, 6vw, 3.25rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        margin: 0,
                    }}
                >
                    Hello world
                </h1>
            </div>
        </main>
    )
}
