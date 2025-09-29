export default function TravelGuides() {
    const guides = [
        {
            id: 1,
            title: "31 Địa Điểm Du Lịch Phú Quốc Nổi Tiếng Cập Nhật Mới",
            category: "Hoạt động nên trải nghiệm",
            author: "Pho Group",
            readTime: "15 phút đọc",
            views: "25K"
        },
        {
            id: 2,
            title: "30 Đặc Sản Phú Quốc Nổi Tiếng Thơm Ngon Khó Cưỡng",
            category: "Đồ ăn & thức uống",
            author: "PhoFood Team",
            readTime: "12 phút đọc",
            views: "18K"
        },
        {
            id: 3,
            title: "VinWonders Phú Quốc, Review Công Viên Nổi Tiếng Việt Nam",
            category: "Hoạt động nên trải nghiệm",
            author: "Pho Travel",
            readTime: "10 phút đọc",
            views: "20K"
        },
        {
            id: 4,
            title: "Chơi Gì Ở Công Viên Sun World Hòn Thơm Phú Quốc?",
            category: "Hoạt động nên trải nghiệm",
            author: "Pho Travel",
            readTime: "8 phút đọc",
            views: "15K"
        },
        {
            id: 5,
            title: "27 Khu Du Lịch Việt Nam Xịn Sò Cho Chuyến Đi Gia Đình",
            category: "Hoạt động nên trải nghiệm",
            author: "Pho Group",
            readTime: "20 phút đọc",
            views: "30K"
        },
        {
            id: 6,
            title: "13 Quán Café Và Bar Ở Phú Quốc Đẹp Mê Hồn Để Sống Ảo Cực Chill",
            category: "Đồ ăn & thức uống",
            author: "PhoFood Team",
            readTime: "7 phút đọc",
            views: "12K"
        }
    ]

    const specialGuides = [
        {
            title: "Hướng dẫn chọn villa tại Pho Retreat",
            description: "Tips chọn villa phù hợp cho gia đình, tiện nghi và vị trí tốt nhất",
            author: "Pho Retreat",
            isPhoContent: true
        },
        {
            title: "Cách chế biến cá khô Phú Quốc chuẩn vị",
            description: "Bí quyết chế biến đặc sản cá khô từ PhoFood, từ nguyên liệu đến kỹ thuật",
            author: "PhoFood",
            isPhoContent: true
        }
    ]

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Hướng dẫn du lịch Phú Quốc
                </h2>

                {/* Special Pho Group content */}
                <div className="mb-8 p-6 bg-brand-50 rounded-lg border border-brand-200">
                    <h3 className="text-lg font-semibold mb-4 text-brand-800">
                        📖 Nội dung độc quyền từ Pho Group
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {specialGuides.map((guide, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border">
                                <h4 className="font-semibold mb-2">{guide.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-brand-600 font-medium">{guide.author}</span>
                                    <button className="text-sm text-brand-600 hover:text-brand-700">
                                        Đọc ngay →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* General travel guides */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guides.map((guide) => (
                        <article key={guide.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                            {/* Image placeholder */}
                            <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-500 relative">
                                <div className="absolute inset-0 skeleton"></div>
                                {/* Category badge */}
                                <div className="absolute top-3 left-3 bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                    {guide.category}
                                </div>
                            </div>

                            <div className="p-4">
                                {/* Title */}
                                <h3 className="font-semibold text-lg mb-3 line-clamp-2">
                                    {guide.title}
                                </h3>

                                {/* Meta info */}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{guide.author}</span>
                                    <div className="flex items-center gap-3">
                                        <span>{guide.readTime}</span>
                                        <span>👀 {guide.views}</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* View more */}
                <div className="text-center mt-8">
                    <button className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold">
                        Xem thêm hướng dẫn
                    </button>
                </div>
            </div>
        </section>
    )
}
