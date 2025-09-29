export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-brand-600 grid place-items-center text-white font-bold">
                            Pho
                        </div>
                        <span className="font-semibold">Pho Group</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                        Eat • Stay • Experience — Phu Quoc.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-brand-100 flex items-center justify-center"
                        >
                            📘
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-brand-100 flex items-center justify-center"
                        >
                            📷
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-brand-100 flex items-center justify-center"
                        >
                            📺
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Khám phá</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a href="#retreat" className="hover:text-brand-600">Nơi ở</a></li>
                        <li><a href="#travel" className="hover:text-brand-600">Trải nghiệm</a></li>
                        <li><a href="#food" className="hover:text-brand-600">Đặc sản</a></li>
                        <li><a href="#guide" className="hover:text-brand-600">Guide</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Đối tác</h4>
                    <ul className="space-y-1 text-sm">
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
                                href="https://www.tiktok.com"
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
                    <h4 className="font-semibold mb-2">Công ty</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a href="#" className="hover:text-brand-600">Về chúng tôi</a></li>
                        <li><a href="#" className="hover:text-brand-600">Liên hệ</a></li>
                        <li><a href="#" className="hover:text-brand-600">Chính sách bảo mật</a></li>
                        <li><a href="#" className="hover:text-brand-600">Điều khoản sử dụng</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t py-4 text-center text-xs text-gray-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    © 2025 Pho Group. All rights reserved. • Giấy phép kinh doanh: 0123456789 •
                    Website này được tối ưu cho SEO và tốc độ tải nhanh.
                </div>
            </div>
        </footer>
    )
}
