export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top section - Popular destinations */}
                <div className="mb-8">
                    <h3 className="font-semibold mb-4">Hấp dẫn không kém</h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Popular destinations */}
                        <div>
                            <h4 className="font-medium mb-3">Điểm tham quan hàng đầu Phú Quốc</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-brand-600">Hòn Móng Tay</a></li>
                                <li><a href="#" className="hover:text-brand-600">Bãi biển Ong Lang</a></li>
                                <li><a href="#" className="hover:text-brand-600">Bãi Dài Phú Quốc</a></li>
                                <li><a href="#" className="hover:text-brand-600">Rạch Vẹm</a></li>
                                <li><a href="#" className="hover:text-brand-600">Dinh Cậu</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-3">Hoạt động hàng đầu Phú Quốc</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-brand-600">Cáp treo Hòn Thơm</a></li>
                                <li><a href="#" className="hover:text-brand-600">Sun World Hon Thom</a></li>
                                <li><a href="#" className="hover:text-brand-600">Safari Phú Quốc</a></li>
                                <li><a href="#" className="hover:text-brand-600">VinWonders</a></li>
                                <li><a href="#" className="hover:text-brand-600">Chợ đêm Phú Quốc</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-3">Khách sạn hàng đầu Phú Quốc</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-brand-600">JW Marriott Phu Quoc</a></li>
                                <li><a href="#" className="hover:text-brand-600">InterContinental Phu Quoc</a></li>
                                <li><a href="#" className="hover:text-brand-600">Fusion Resort Phu Quoc</a></li>
                                <li><a href="#" className="hover:text-brand-600">Salinda Resort</a></li>
                                <li><a href="#" className="hover:text-brand-600">La Veranda Resort</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Other destinations */}
                    <div className="border-t pt-6">
                        <h4 className="font-medium mb-3">Điểm đến khác</h4>
                        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                            <div>
                                <h5 className="font-medium mb-2">Việt Nam</h5>
                                <ul className="space-y-1 text-gray-600">
                                    <li><a href="#" className="hover:text-brand-600">Hà Nội</a></li>
                                    <li><a href="#" className="hover:text-brand-600">TP. Hồ Chí Minh</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Đà Nẵng</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Nha Trang</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Hội An</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-medium mb-2">Đông Nam Á</h5>
                                <ul className="space-y-1 text-gray-600">
                                    <li><a href="#" className="hover:text-brand-600">Bangkok</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Phuket</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Singapore</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Kuala Lumpur</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Bali</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-medium mb-2">Châu Á</h5>
                                <ul className="space-y-1 text-gray-600">
                                    <li><a href="#" className="hover:text-brand-600">Tokyo</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Seoul</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Hong Kong</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Đài Bắc</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Mumbai</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-medium mb-2">Châu Âu</h5>
                                <ul className="space-y-1 text-gray-600">
                                    <li><a href="#" className="hover:text-brand-600">London</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Paris</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Rome</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Barcelona</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Amsterdam</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-medium mb-2">Châu Úc</h5>
                                <ul className="space-y-1 text-gray-600">
                                    <li><a href="#" className="hover:text-brand-600">Sydney</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Melbourne</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Brisbane</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Perth</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Auckland</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-medium mb-2">Châu Mỹ</h5>
                                <ul className="space-y-1 text-gray-600">
                                    <li><a href="#" className="hover:text-brand-600">New York</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Los Angeles</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Las Vegas</a></li>
                                    <li><a href="#" className="hover:text-brand-600">San Francisco</a></li>
                                    <li><a href="#" className="hover:text-brand-600">Miami</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main footer links */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                    <div>
                        <h4 className="font-semibold mb-3">Pho Group</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-brand-600">PhoFood - Hải sản</a></li>
                            <li><a href="#" className="hover:text-brand-600">Pho Retreat - Villa</a></li>
                            <li><a href="#" className="hover:text-brand-600">Pho Travel - Tours</a></li>
                            <li><a href="#" className="hover:text-brand-600">Đặt bàn nhà hàng</a></li>
                            <li><a href="#" className="hover:text-brand-600">Thuê villa</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-brand-600">Trung tâm trợ giúp</a></li>
                            <li><a href="#" className="hover:text-brand-600">Liên hệ</a></li>
                            <li><a href="#" className="hover:text-brand-600">Hướng dẫn đặt chỗ</a></li>
                            <li><a href="#" className="hover:text-brand-600">Chính sách hoàn tiền</a></li>
                            <li><a href="#" className="hover:text-brand-600">Báo cáo lỗi</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Dành cho đối tác</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-brand-600">Đăng ký đối tác</a></li>
                            <li><a href="#" className="hover:text-brand-600">Trung tâm đối tác</a></li>
                            <li><a href="#" className="hover:text-brand-600">Chương trình liên kết</a></li>
                            <li><a href="#" className="hover:text-brand-600">API cho nhà phát triển</a></li>
                            <li><a href="#" className="hover:text-brand-600">Quảng cáo</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Kết nối</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    className="hover:text-brand-600"
                                    href="https://shopee.vn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Shopee
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-brand-600"
                                    href="https://tiktok.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    TikTok Shop
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-brand-600"
                                    href="https://booking.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Booking.com
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-brand-600"
                                    href="https://airbnb.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Airbnb
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Công ty</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-brand-600">Về chúng tôi</a></li>
                            <li><a href="#" className="hover:text-brand-600">Tuyển dụng</a></li>
                            <li><a href="#" className="hover:text-brand-600">Tin tức</a></li>
                            <li><a href="#" className="hover:text-brand-600">Nhà đầu tư</a></li>
                            <li><a href="#" className="hover:text-brand-600">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:text-brand-600">Điều khoản sử dụng</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                        <div className="mb-4 sm:mb-0">
                            <p>© 2025 Pho Group. All rights reserved.</p>
                            <p>Giấy phép kinh doanh: 0123456789 • Địa chỉ: Phú Quốc, Kiên Giang, Việt Nam</p>
                        </div>

                        <div className="flex space-x-6">
                            <div className="text-xs">
                                <p className="font-medium">Hotline 24/7</p>
                                <p className="text-brand-600">+84 123 456 789</p>
                            </div>
                            <div className="text-xs">
                                <p className="font-medium">Email</p>
                                <p className="text-brand-600">info@phogroup.vn</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                        Website này được tối ưu cho SEO và tốc độ tải nhanh.
                        Hỗ trợ đa ngôn ngữ: Tiếng Việt, English, 中文, Русский, हिन्दी
                    </div>
                </div>
            </div>
        </footer>
    )
}
