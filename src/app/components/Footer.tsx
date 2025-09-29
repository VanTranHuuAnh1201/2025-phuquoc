import Link from 'next/link';

export default function Footer() {
    const popularDestinations = [
        {
            title: "Điểm tham quan hàng đầu Phú Quốc",
            links: [
                { name: "Hòn Móng Tay", href: "/attractions/hon-mong-tay" },
                { name: "Bãi biển Ong Lang", href: "/beaches/ong-lang" },
                { name: "Bãi Dài Phú Quốc", href: "/beaches/bai-dai" },
                { name: "Rạch Vẹm", href: "/attractions/rach-vem" },
                { name: "Dinh Cậu", href: "/attractions/dinh-cau" }
            ]
        },
        {
            title: "Hoạt động hàng đầu Phú Quốc",
            links: [
                { name: "Cáp treo Hòn Thơm", href: "/activities/cable-car" },
                { name: "Sun World Hon Thom", href: "/activities/sun-world" },
                { name: "Safari Phú Quốc", href: "/activities/safari" },
                { name: "VinWonders", href: "/activities/vinwonders" },
                { name: "Chợ đêm Phú Quốc", href: "/activities/night-market" }
            ]
        },
        {
            title: "Villa Pho Retreat",
            links: [
                { name: "Villa Ocean Breeze", href: "/pho-retreat/ocean-breeze" },
                { name: "Villa Sunset Paradise", href: "/pho-retreat/sunset-paradise" },
                { name: "Villa Garden View", href: "/pho-retreat/garden-view" },
                { name: "Villa Beachfront", href: "/pho-retreat/beachfront" },
                { name: "Xem tất cả villa", href: "/pho-retreat" }
            ]
        }
    ];

    const otherDestinations = [
        {
            title: "Việt Nam",
            destinations: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Nha Trang", "Hội An"]
        },
        {
            title: "Đông Nam Á",
            destinations: ["Bangkok", "Phuket", "Singapore", "Kuala Lumpur", "Bali"]
        },
        {
            title: "Châu Á",
            destinations: ["Tokyo", "Seoul", "Hong Kong", "Đài Bắc", "Mumbai"]
        },
        {
            title: "Châu Âu",
            destinations: ["London", "Paris", "Rome", "Barcelona", "Amsterdam"]
        },
        {
            title: "Châu Úc",
            destinations: ["Sydney", "Melbourne", "Brisbane", "Perth", "Auckland"]
        },
        {
            title: "Châu Mỹ",
            destinations: ["New York", "Los Angeles", "Las Vegas", "San Francisco", "Miami"]
        }
    ];

    return (
        <footer className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6">Hấp dẫn không kém</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {popularDestinations.map((section, index) => (
                            <div key={index}>
                                <h4 className="font-medium mb-3 text-gray-900">{section.title}</h4>
                                <ul className="space-y-2 text-sm">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link href={link.href} className="text-gray-600 hover:text-brand-600 transition-colors">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <h4 className="font-medium mb-4 text-gray-900">Điểm đến khác</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-sm">
                        {otherDestinations.map((region, index) => (
                            <div key={index}>
                                <h5 className="font-medium mb-2 text-gray-900">{region.title}</h5>
                                <ul className="space-y-1">
                                    {region.destinations.map((dest, destIndex) => (
                                        <li key={destIndex}>
                                            <Link href={`/destinations/${dest.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-brand-600 transition-colors">
                                                {dest}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="border-t pt-6">
                    <h4 className="font-medium mb-4 text-gray-900">Điểm đến khác</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-sm">
                        {otherDestinations.map((region, index) => (
                            <div key={index}>
                                <h5 className="font-medium mb-2 text-gray-900">{region.title}</h5>
                                <ul className="space-y-1">
                                    {region.destinations.map((dest, destIndex) => (
                                        <li key={destIndex}>
                                            <Link href={`/destinations/${dest.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-brand-600 transition-colors">
                                                {dest}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    )
}   
