'use client'

import FloatingChat from '@/app/components/FloatingChat'
import Footer from '@/app/components/Footer'
import PhoGroupHero from '@/app/components/PhoGroupHero'

export default function PhoFoodPage() {
    const products = [
        {
            id: 1,
            name: "Cá Khô Phú Quốc Đặc Biệt",
            nameEn: "Phu Quoc Special Dried Fish",
            price: "450,000",
            originalPrice: "500,000",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Cá khô nguyên chất từ biển Phú Quốc, chế biến theo công thức truyền thống",
            descriptionEn: "Pure dried fish from Phu Quoc sea, processed with traditional recipe",
            weight: "500g",
            inStock: true,
            rating: 4.8,
            reviews: 245
        },
        {
            id: 2,
            name: "Tôm Khô Size Jumbo",
            nameEn: "Jumbo Dried Shrimp",
            price: "850,000",
            originalPrice: "950,000",
            image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Tôm khô size jumbo, thịt chắc ngọt tự nhiên",
            descriptionEn: "Jumbo dried shrimp, naturally sweet and firm meat",
            weight: "300g",
            inStock: true,
            rating: 4.9,
            reviews: 178
        },
        {
            id: 3,
            name: "Mực Khô Phú Quốc",
            nameEn: "Phu Quoc Dried Squid",
            price: "650,000",
            originalPrice: "750,000",
            image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Mực khô tươi ngon, dai giòn đặc trưng vùng biển Phú Quốc",
            descriptionEn: "Fresh dried squid, crispy texture from Phu Quoc waters",
            weight: "400g",
            inStock: true,
            rating: 4.7,
            reviews: 156
        }
    ]

    const shopLinks = [
        {
            name: "Shopee",
            icon: "🛒",
            url: "https://shopee.vn/phofood",
            color: "bg-orange-500 hover:bg-orange-600"
        },
        {
            name: "TikTok Shop",
            icon: "🎵",
            url: "https://tiktokshop.vn/phofood",
            color: "bg-black hover:bg-gray-800"
        },
        {
            name: "Zalo",
            icon: "💬",
            url: "https://zalo.me/phofood",
            color: "bg-blue-500 hover:bg-blue-600"
        },
        {
            name: "WhatsApp",
            icon: "📱",
            url: "https://wa.me/+84123456789",
            color: "bg-green-500 hover:bg-green-600"
        }
    ]

    return (
        <>
            {/* Breadcrumbs */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hover:text-gray-700">Trang chủ</span>
                        <span>›</span>
                        <span>Việt Nam</span>
                        <span>›</span>
                        <span>Phú Quốc</span>
                        <span>›</span>
                        <strong className="text-gray-700">PhoFood - Hải sản đặc sản</strong>
                    </nav>
                </div>
            </section>

            <PhoGroupHero activeTab="food" />

            <main className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30 min-h-screen">
                {/* Hero Section */}
                <section className="py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            PhoFood - Hải Sản Đặc Sản Phú Quốc
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Chuyên cung cấp hải sản khô chất lượng cao từ biển Phú Quốc.
                            Sản phẩm được chế biến theo công thức truyền thống, đảm bảo hương vị đậm đà,
                            tự nhiên và an toàn cho sức khỏe.
                        </p>

                        {/* Quick Order Links */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                            {shopLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${link.color} text-white p-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex flex-col items-center gap-2`}
                                >
                                    <span className="text-2xl">{link.icon}</span>
                                    <span className="text-sm sm:text-base">Đặt qua {link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Sản phẩm nổi bật
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl border-2 border-transparent hover:border-orange-200 transition-colors shadow-lg hover:shadow-xl overflow-hidden group">
                                    {/* Product Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.originalPrice && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                                -{Math.round((1 - parseInt(product.price) / parseInt(product.originalPrice)) * 100)}%
                                            </div>
                                        )}
                                        {!product.inStock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                                                    Hết hàng
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 sm:p-6">
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3 italic">{product.nameEn}</p>
                                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="font-bold">{product.rating}</span>
                                                <span className="text-gray-500">({product.reviews} đánh giá)</span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-500">{product.weight}</span>
                                        </div>

                                        {/* Price & Button */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xl font-bold text-gray-900">
                                                    ₫{parseInt(product.price).toLocaleString()}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through ml-2">
                                                        ₫{parseInt(product.originalPrice).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                disabled={!product.inStock}
                                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${product.inStock
                                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {product.inStock ? 'Đặt ngay' : 'Hết hàng'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Liên hệ đặt hàng
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Liên hệ trực tiếp để được tư vấn và đặt hàng với giá tốt nhất
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a
                                    href="https://zalo.me/phofood"
                                    className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">💬</span>
                                    Chat qua Zalo
                                </a>
                                <a
                                    href="https://wa.me/+84123456789"
                                    className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">📱</span>
                                    Chat qua WhatsApp
                                </a>
                            </div>

                            <div className="mt-6 text-sm text-gray-500">
                                <p>📞 Hotline: +84 123 456 789</p>
                                <p>📧 Email: contact@phofood.vn</p>
                                <p>🚚 Giao hàng toàn quốc - COD hỗ trợ</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <FloatingChat />
        </>
    )
}
