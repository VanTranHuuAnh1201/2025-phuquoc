/**
 * Danh mục sản phẩm hiển thị trên trang chính.
 *
 * Mỗi sản phẩm là một app + một Vercel Project riêng, có domain riêng. Vì thế
 * link là URL tuyệt đối, không phải route nội bộ.
 *
 * URL đọc từ biến môi trường để mỗi nơi trỏ một chỗ:
 *   - máy local  → localhost:3000 / 3001
 *   - production → domain thật
 *
 * Thêm sản phẩm mới: thêm một phần tử vào mảng dưới đây + một biến môi trường.
 */

export interface Product {
    id: string
    name: string
    tagline: { vi: string; en: string }
    description: { vi: string; en: string }
    /** URL tuyệt đối tới app của sản phẩm. */
    url: string
    /** Trạng thái để hiển thị nhãn. */
    status: 'live' | 'demo' | 'wip'
    /** Màu đại diện, vẽ thẻ trên trang chính. */
    accent: string
    tech: string[]
}

/** Đọc env, có giá trị dự phòng cho môi trường local. */
function url(envValue: string | undefined, localFallback: string): string {
    // Bien khai bao nhung de rong cung tinh la chua co -> dung fallback.
    const value = envValue?.trim()
    return value ? value.replace(/\/$/, '') : localFallback
}

export const products: Product[] = [
    {
        id: '2026-thenamduhill',
        name: 'The Nam Du Hill Resort',
        tagline: {
            vi: 'Đặt phòng khách sạn & resort',
            en: 'Hotel & resort reservations',
        },
        description: {
            vi: 'Hệ thống đặt phòng hoàn chỉnh với nhiều mẫu giao diện chạy trên cùng một nguồn nội dung. Song ngữ, tính giá tập trung, đổi giao diện không phải làm lại website.',
            en: 'A complete reservation system where several interface designs run on one content source. Bilingual, centralised pricing, and switching designs never means rebuilding.',
        },
        url: url(process.env.NEXT_PUBLIC_URL_2026_THENAMDUHILL, 'http://localhost:3000'),
        status: 'demo',
        accent: '#075E9E',
        tech: ['Next.js 15', 'React 19', 'TypeScript', 'Turborepo'],
    },
    {
        id: '2026-thenamduhillresort',
        name: 'The Nam Du Hill Resort — bản độc lập',
        tagline: {
            vi: 'Website resort, triển khai riêng',
            en: 'Standalone resort website',
        },
        description: {
            vi: 'Bản dựng riêng cho The Nam Du Hill Resort, tách khỏi bản đa giao diện. Deploy độc lập, có domain riêng.',
            en: 'A dedicated build for The Nam Du Hill Resort, separate from the multi-theme edition. Deployed independently on its own domain.',
        },
        url: url(
            process.env.NEXT_PUBLIC_URL_2026_THENAMDUHILLRESORT,
            'http://localhost:3003',
        ),
        status: 'wip',
        accent: '#0F766E',
        tech: ['Next.js 15', 'React 19', 'TypeScript'],
    },
    {
        id: '2025-phogroup',
        name: 'Pho Group Phú Quốc',
        tagline: {
            vi: 'Tour, villa & đặc sản Phú Quốc',
            en: 'Tours, villas & local produce in Phu Quoc',
        },
        description: {
            vi: 'Nền tảng du lịch ba mảng: hải sản đặc sản, villa nghỉ dưỡng và tour trải nghiệm. Kèm hệ quản trị nội dung.',
            en: 'A three-part travel platform: local seafood, resort villas and guided experiences, with an admin back office.',
        },
        url: url(process.env.NEXT_PUBLIC_URL_2025_PHOGROUP, 'http://localhost:3001'),
        status: 'demo',
        accent: '#EA580C',
        tech: ['Next.js 15', 'React 19', 'Tailwind CSS'],
    },
]
