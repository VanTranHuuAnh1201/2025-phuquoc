import Link from "next/link";


export default function ContactPage() {
    return (
        <>
            {/* Breadcrumbs */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hover:text-gray-700">Trang chủ</span>
                        <span>›</span>
                        <strong className="text-gray-700">Liên hệ</strong>
                    </nav>
                </div>
            </section>

            <main className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30 min-h-screen">
                {/* Hero Section */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
                            Liên hệ với Pho Group
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8">
                            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn 24/7
                        </p>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {/* Chat Methods */}
                            <Link
                                href="https://zalo.me/phogroup"
                                className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-2xl text-center transition-all transform hover:scale-105 shadow-lg"
                            >
                                <div className="text-3xl mb-3">💬</div>
                                <h3 className="font-bold text-lg mb-2">Chat Zalo</h3>
                                <p className="text-sm opacity-90">Phản hồi nhanh nhất</p>
                            </Link>

                            <Link
                                href="https://wa.me/+84123456789"
                                className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-2xl text-center transition-all transform hover:scale-105 shadow-lg"
                            >
                                <div className="text-3xl mb-3">📱</div>
                                <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
                                <p className="text-sm opacity-90">Hỗ trợ quốc tế</p>
                            </Link>

                            <Link
                                href="tel:+84123456789"
                                className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-2xl text-center transition-all transform hover:scale-105 shadow-lg"
                            >
                                <div className="text-3xl mb-3">📞</div>
                                <h3 className="font-bold text-lg mb-2">Hotline</h3>
                                <p className="text-sm opacity-90">+84 123 456 789</p>
                            </Link>

                            <Link
                                href="mailto:info@phogroup.vn"
                                className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-2xl text-center transition-all transform hover:scale-105 shadow-lg"
                            >
                                <div className="text-3xl mb-3">📧</div>
                                <h3 className="font-bold text-lg mb-2">Email</h3>
                                <p className="text-sm opacity-90">info@phogroup.vn</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">Gửi tin nhắn cho chúng tôi</h2>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Họ tên *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Nhập họ tên của bạn"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="+84 123 456 789"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dịch vụ quan tâm
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                            <option>Chọn dịch vụ</option>
                                            <option>PhoFood - Hải sản đặc sản</option>
                                            <option>Pho Retreat - Villa cao cấp</option>
                                            <option>Pho Travel - Tour & Trải nghiệm</option>
                                            <option>Tư vấn chung</option>
                                            <option>Hợp tác kinh doanh</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tin nhắn *
                                        </label>
                                        <textarea
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Mô tả chi tiết yêu cầu của bạn..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors shadow-lg"
                                    >
                                        Gửi tin nhắn
                                    </button>

                                    <p className="text-sm text-gray-500 text-center">
                                        Chúng tôi sẽ phản hồi trong vòng 30 phút
                                    </p>
                                </form>
                            </div>

                            {/* Contact Info & Map */}
                            <div className="space-y-8">
                                {/* Office Info */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                                    <h3 className="text-xl font-bold mb-6 text-gray-900">Thông tin liên hệ</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-orange-600">📍</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Văn phòng chính</h4>
                                                <p className="text-gray-600">Phú Quốc, Kiên Giang, Việt Nam</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-orange-600">📞</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Hotline</h4>
                                                <p className="text-gray-600">+84 123 456 789</p>
                                                <p className="text-sm text-gray-500">Hoạt động 24/7</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-orange-600">📧</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Email</h4>
                                                <p className="text-gray-600">info@phogroup.vn</p>
                                                <p className="text-sm text-gray-500">Phản hồi trong 1 giờ</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-orange-600">🕒</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Giờ làm việc</h4>
                                                <p className="text-gray-600">Thứ 2 - Chủ nhật: 6:00 - 22:00</p>
                                                <p className="text-sm text-gray-500">Hỗ trợ khẩn cấp 24/7</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                                    <h3 className="text-xl font-bold mb-6 text-gray-900">Dịch vụ chính</h3>

                                    <div className="space-y-3">
                                        <Link
                                            href="/pho-food"
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors"
                                        >
                                            <span className="text-2xl">🐟</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">PhoFood</h4>
                                                <p className="text-sm text-gray-600">Hải sản đặc sản Phú Quốc</p>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/pho-retreat"
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors"
                                        >
                                            <span className="text-2xl">🏖️</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Pho Retreat</h4>
                                                <p className="text-sm text-gray-600">Villa cao cấp bên biển</p>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/pho-travel"
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors"
                                        >
                                            <span className="text-2xl">✈️</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Pho Travel</h4>
                                                <p className="text-sm text-gray-600">Tour & Trải nghiệm</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-6 text-white text-center">
                                    <h3 className="font-bold text-lg mb-2">Liên hệ khẩn cấp</h3>
                                    <p className="text-sm opacity-90 mb-4">
                                        Nếu bạn cần hỗ trợ khẩn cấp trong chuyến du lịch
                                    </p>
                                    <Link
                                        href="tel:+84123456789"
                                        className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        <span>📞</span>
                                        Gọi ngay: +84 123 456 789
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
