import Footer from '../components/Footer'
import Header from '../components/Header'

export default function PrivacyPage() {
    return (
        <>
            <Header />

            {/* Breadcrumbs */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hover:text-gray-700">Trang chủ</span>
                        <span>›</span>
                        <strong className="text-gray-700">Chính sách bảo mật</strong>
                    </nav>
                </div>
            </section>

            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Chính sách bảo mật</h1>
                        <p className="text-gray-600 mb-8">Cập nhật lần cuối: 01/01/2025</p>

                        <div className="space-y-8 text-gray-700">
                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Thu thập thông tin</h2>
                                <p className="mb-4">
                                    Pho Group thu thập thông tin cá nhân khi bạn:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Đặt hàng sản phẩm PhoFood</li>
                                    <li>Đặt phòng tại Pho Retreat</li>
                                    <li>Đăng ký tour với Pho Travel</li>
                                    <li>Liên hệ với chúng tôi qua các kênh hỗ trợ</li>
                                    <li>Đăng ký nhận bản tin</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Sử dụng thông tin</h2>
                                <p className="mb-4">
                                    Thông tin được sử dụng để:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Xử lý đơn hàng và cung cấp dịch vụ</li>
                                    <li>Liên hệ xác nhận và hỗ trợ khách hàng</li>
                                    <li>Gửi thông tin khuyến mãi (khi đồng ý)</li>
                                    <li>Cải thiện chất lượng dịch vụ</li>
                                    <li>Tuân thủ các yêu cầu pháp lý</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Bảo mật thông tin</h2>
                                <p className="mb-4">
                                    Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn thông qua:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Mã hóa dữ liệu SSL</li>
                                    <li>Hệ thống bảo mật nhiều lớp</li>
                                    <li>Giới hạn quyền truy cập nội bộ</li>
                                    <li>Đào tạo nhân viên về bảo mật</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Chia sẻ thông tin</h2>
                                <p>
                                    Pho Group không chia sẻ thông tin cá nhân với bên thứ ba,
                                    trừ khi có sự đồng ý của bạn hoặc theo yêu cầu pháp lý.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Quyền của khách hàng</h2>
                                <p className="mb-4">
                                    Bạn có quyền:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Yêu cầu xem thông tin cá nhân</li>
                                    <li>Chỉnh sửa thông tin không chính xác</li>
                                    <li>Xóa thông tin cá nhân</li>
                                    <li>Từ chối nhận email marketing</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Liên hệ</h2>
                                <p>
                                    Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
                                </p>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p>📧 Email: privacy@phogroup.vn</p>
                                    <p>📞 Hotline: +84 123 456 789</p>
                                    <p>📍 Địa chỉ: Phú Quốc, Kiên Giang, Việt Nam</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}
