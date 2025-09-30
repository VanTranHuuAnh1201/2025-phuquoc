'use client';

import Link from 'next/link';


export default function TermsPage() {
    return (
        <>
            {/* Breadcrumbs */}
            <section className="bg-gradient-to-r from-orange-50/50 to-pink-50/50 border-b border-orange-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-600 flex items-center gap-2">
                        <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
                            <span>🏠</span>
                            <span>Trang chủ</span>
                        </Link>
                        <span className="text-orange-300">›</span>
                        <strong className="text-gray-800 font-semibold">📋 Điều khoản dịch vụ</strong>
                    </nav>
                </div>
            </section>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-orange-50/80 via-pink-50/60 to-orange-50/40 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        📋 Điều khoản dịch vụ
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Điều khoản và điều kiện sử dụng dịch vụ của PhoGroup
                    </p>
                    <div className="mt-6 text-sm text-gray-500">
                        Cập nhật lần cuối: 30 tháng 9, 2025
                    </div>
                </div>
            </section>

            {/* Content */}
            <main className="py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-orange-100/50 p-8 sm:p-12 space-y-8">

                        {/* Introduction */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>🤝</span>
                                Giới thiệu
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Chào mừng bạn đến với PhoGroup! Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
                                Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
                            </p>
                        </section>

                        {/* Services */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>🏢</span>
                                Dịch vụ của chúng tôi
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <h3 className="font-semibold text-gray-900 mb-2">🐟 PhoFood - Hải sản tươi sống</h3>
                                    <p className="text-gray-600 text-sm">Cung cấp hải sản tươi sống chất lượng cao với dịch vụ giao hàng toàn quốc.</p>
                                </div>
                                <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                                    <h3 className="font-semibold text-gray-900 mb-2">🏖️ Pho Retreat - Villa & Resort</h3>
                                    <p className="text-gray-600 text-sm">Dịch vụ lưu trú cao cấp với villa riêng tư và resort sang trọng tại Phú Quốc.</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    <h3 className="font-semibold text-gray-900 mb-2">✈️ Pho Travel - Tour du lịch</h3>
                                    <p className="text-gray-600 text-sm">Tổ chức tour du lịch trọn gói với dịch vụ chuyên nghiệp và trải nghiệm độc đáo.</p>
                                </div>
                            </div>
                        </section>

                        {/* User Responsibilities */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>👤</span>
                                Trách nhiệm của khách hàng
                            </h2>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Cung cấp thông tin chính xác khi đặt dịch vụ</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Tuân thủ lịch trình và quy định của tour/villa</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Thanh toán đầy đủ và đúng hạn theo thỏa thuận</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Bảo vệ tài sản và môi trường tại điểm đến</span>
                                </li>
                            </ul>
                        </section>

                        {/* Booking & Payment */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>💳</span>
                                Đặt chỗ và thanh toán
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    <strong>Đặt chỗ:</strong> Khách hàng có thể đặt dịch vụ qua website, điện thoại hoặc trực tiếp tại văn phòng.
                                    Đặt chỗ được xác nhận sau khi nhận được thông tin đầy đủ và thanh toán cọc.
                                </p>
                                <p>
                                    <strong>Thanh toán:</strong> Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng,
                                    ví điện tử và thẻ tín dụng. Thanh toán cọc tối thiểu 30% tổng giá trị dịch vụ.
                                </p>
                            </div>
                        </section>

                        {/* Cancellation Policy */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>🔄</span>
                                Chính sách hủy đặt
                            </h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <ul className="space-y-2 text-gray-700 text-sm">
                                    <li><strong>Hủy trước 15 ngày:</strong> Hoàn lại 90% số tiền đã thanh toán</li>
                                    <li><strong>Hủy trước 7-14 ngày:</strong> Hoàn lại 70% số tiền đã thanh toán</li>
                                    <li><strong>Hủy trước 3-6 ngày:</strong> Hoàn lại 50% số tiền đã thanh toán</li>
                                    <li><strong>Hủy trong vòng 3 ngày:</strong> Không hoàn lại tiền</li>
                                </ul>
                            </div>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>📞</span>
                                Liên hệ hỗ trợ
                            </h2>
                            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-6 border border-orange-100">
                                <p className="text-gray-600 mb-4">
                                    Nếu bạn có thắc mắc về điều khoản dịch vụ, vui lòng liên hệ:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-sm">
                                            <span>📱</span>
                                            <span>Hotline: 0901 234 567</span>
                                        </p>
                                        <p className="flex items-center gap-2 text-sm">
                                            <span>📧</span>
                                            <span>Email: support@phogroup.vn</span>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-sm">
                                            <span>🕒</span>
                                            <span>Thời gian: 8:00 - 22:00 hàng ngày</span>
                                        </p>
                                        <p className="flex items-center gap-2 text-sm">
                                            <span>📍</span>
                                            <span>Địa chỉ: Phú Quốc, Kiên Giang</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section className="pt-8 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/privacy"
                                    className="px-6 py-3 bg-white border-2 border-orange-200 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors text-center"
                                >
                                    📋 Chính sách bảo mật
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-colors text-center"
                                >
                                    📞 Liên hệ ngay
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
