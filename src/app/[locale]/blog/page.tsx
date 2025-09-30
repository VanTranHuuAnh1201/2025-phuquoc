/* eslint-disable @next/next/no-img-element */


export default function BlogPage() {
    const posts = [
        {
            id: 1,
            title: "Top 10 món ăn đặc sản không thể bỏ qua khi đến Phú Quốc",
            titleEn: "Top 10 Must-Try Local Dishes in Phu Quoc",
            excerpt: "Khám phá hương vị độc đáo của đảo ngọc qua những món ăn truyền thống...",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Ẩm thực",
            date: "2024-01-15",
            readTime: "5 phút đọc"
        },
        {
            id: 2,
            title: "Hướng dẫn chế biến cá khô Phú Quốc tại nhà",
            titleEn: "How to Process Phu Quoc Dried Fish at Home",
            excerpt: "Bí quyết chế biến cá khô thơm ngon như người địa phương với công thức truyền thống...",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Hướng dẫn",
            date: "2024-01-12",
            readTime: "8 phút đọc"
        },
        {
            id: 3,
            title: "Review chi tiết villa Pho Retreat - Trải nghiệm 5 sao",
            titleEn: "Detailed Review of Pho Retreat Villa - 5-Star Experience",
            excerpt: "Những trải nghiệm đáng nhớ tại villa cao cấp bên bờ biển Phú Quốc...",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Review",
            date: "2024-01-10",
            readTime: "6 phút đọc"
        },
        {
            id: 4,
            title: "Kinh nghiệm du lịch Phú Quốc 4 ngày 3 đêm tiết kiệm",
            titleEn: "Budget Travel Guide: 4 Days 3 Nights in Phu Quoc",
            excerpt: "Lịch trình chi tiết và những mẹo hay để có chuyến du lịch Phú Quốc tiết kiệm nhất...",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Kinh nghiệm",
            date: "2024-01-08",
            readTime: "10 phút đọc"
        },
        {
            id: 5,
            title: "Cáp treo Hòn Thơm - Kỷ lục thế giới tại Việt Nam",
            titleEn: "Hon Thom Cable Car - World Record in Vietnam",
            excerpt: "Khám phá cáp treo dài nhất thế giới và những trải nghiệm tuyệt vời tại Hòn Thơm...",
            image: "https://images.unsplash.com/photo-1541498404146-086620ca0031?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Du lịch",
            date: "2024-01-05",
            readTime: "7 phút đọc"
        },
        {
            id: 6,
            title: "Bí quyết chọn mua hải sản khô chất lượng",
            titleEn: "Tips for Buying Quality Dried Seafood",
            excerpt: "Những tiêu chí quan trọng để chọn mua hải sản khô tươi ngon và an toàn...",
            image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Mua sắm",
            date: "2024-01-03",
            readTime: "4 phút đọc"
        }
    ]

    const categories = [
        { name: "Tất cả", count: 6 },
        { name: "Ẩm thực", count: 2 },
        { name: "Du lịch", count: 2 },
        { name: "Review", count: 1 },
        { name: "Kinh nghiệm", count: 1 }
    ]

    return (
        <>
            {/* Breadcrumbs */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hover:text-gray-700">Trang chủ</span>
                        <span>›</span>
                        <strong className="text-gray-700">Blog</strong>
                    </nav>
                </div>
            </section>

            <main className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30 min-h-screen">
                {/* Hero Section */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
                            Blog Pho Group
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8">
                            Chia sẻ kinh nghiệm du lịch, ẩm thực và những câu chuyện thú vị về Phú Quốc
                        </p>

                        {/* Search */}
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết..."
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-3 justify-center mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category.name}
                                    className="px-4 py-2 bg-white border-2 border-transparent hover:border-orange-200 rounded-full text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors shadow-sm"
                                >
                                    {category.name} ({category.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Blog Posts */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article key={post.id} className="bg-white rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all shadow-lg hover:shadow-xl overflow-hidden group cursor-pointer">
                                    {/* Post Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                                            {post.category}
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-2 group">
                                            Đọc thêm
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="text-center mt-12">
                            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors shadow-lg">
                                Xem thêm bài viết
                            </button>
                        </div>
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Đăng ký nhận tin tức mới nhất
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Nhận thông tin về các chương trình khuyến mãi, bài viết mới và tips du lịch hữu ích
                            </p>

                            <div className="max-w-md mx-auto flex gap-3">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-colors shadow-lg">
                                    Đăng ký
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                Chúng tôi cam kết bảo mật thông tin cá nhân của bạn
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
