/* eslint-disable @next/next/no-img-element */


'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

export default function AboutPage() {
    const { currentLocale } = useLanguage()
    return (
        <>
            {/* Breadcrumbs */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hover:text-gray-700">Trang chủ</span>
                        <span>›</span>
                        <strong className="text-gray-700">Về chúng tôi</strong>
                    </nav>
                </div>
            </section>

            <main className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30 min-h-screen">
                {/* Hero Section */}
                <section className="py-12 sm:py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
                            Về Pho Group
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                            Pho Group là tập đoàn du lịch - ẩm thực hàng đầu tại Phú Quốc,
                            mang đến những trải nghiệm độc đáo và chất lượng cao cho du khách trong và ngoài nước.
                        </p>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
                                <div className="space-y-4 text-gray-600">
                                    <p>
                                        Bắt đầu từ năm 2020 với tình yêu dành cho đảo ngọc Phú Quốc,
                                        Pho Group được thành lập với sứ mệnh mang đến những trải nghiệm
                                        du lịch trọn vẹn và đặc sắc nhất cho du khách.
                                    </p>
                                    <p>
                                        Chúng tôi không chỉ là đơn vị cung cấp dịch vụ, mà còn là
                                        người bạn đồng hành đáng tin cậy trong hành trình khám phá
                                        vẻ đẹp thiên nhiên và văn hóa độc đáo của Phú Quốc.
                                    </p>
                                    <p>
                                        Với 3 thương hiệu chính: PhoFood (hải sản đặc sản),
                                        Pho Retreat (villa cao cấp), và Pho Travel (tour trải nghiệm),
                                        chúng tôi tự hào phục vụ hàng nghìn khách hàng mỗi năm.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Pho Group Story"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Brands */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Thương hiệu của chúng tôi
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* PhoFood */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border-2 border-transparent hover:border-orange-200 transition-all">
                                <div className="text-5xl mb-4">🐟</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">PhoFood</h3>
                                <p className="text-gray-600 mb-6">
                                    Chuyên cung cấp hải sản khô đặc sản Phú Quốc.
                                    Sản phẩm chất lượng cao, chế biến theo công thức truyền thống.
                                </p>                                <Link
                                    href={`/${currentLocale}/pho-food`}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
                                >                                    Khám phá
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Pho Retreat */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border-2 border-transparent hover:border-orange-200 transition-all">
                                <div className="text-5xl mb-4">🏖️</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Pho Retreat</h3>
                                <p className="text-gray-600 mb-6">
                                    Villa cao cấp bên bờ biển với không gian riêng tư,
                                    tiện nghi 5 sao và dịch vụ chu đáo.
                                </p>
                                <Link
                                    href={`/${currentLocale}/pho-retreat`}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
                                >
                                    Khám phá
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Pho Travel */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border-2 border-transparent hover:border-orange-200 transition-all">
                                <div className="text-5xl mb-4">✈️</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Pho Travel</h3>
                                <p className="text-gray-600 mb-6">
                                    Tour và trải nghiệm độc đáo tại Phú Quốc.
                                    Từ tour 3 đảo, cáp treo đến safari và ẩm thực.
                                </p>
                                <Link
                                    href="/pho-travel"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
                                >
                                    Khám phá
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Giá trị cốt lõi
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Chất lượng</h3>
                                <p className="text-gray-600 text-sm">
                                    Cam kết mang đến sản phẩm và dịch vụ chất lượng cao nhất
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Uy tín</h3>
                                <p className="text-gray-600 text-sm">
                                    Xây dựng niềm tin thông qua sự minh bạch và chuyên nghiệp
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Tận tâm</h3>
                                <p className="text-gray-600 text-sm">
                                    Phục vụ khách hàng với tất cả tình yêu và sự tận tâm
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    4
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Bền vững</h3>
                                <p className="text-gray-600 text-sm">
                                    Bảo vệ môi trường và phát triển du lịch bền vững
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Hãy cùng tạo nên những kỷ niệm tuyệt vời!
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                                <Link
                                    href="https://zalo.me/phogroup"
                                    className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">💬</span>
                                    Chat qua Zalo
                                </Link>
                                <Link
                                    href="https://wa.me/+84123456789"
                                    className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="text-xl">📱</span>
                                    Chat qua WhatsApp
                                </Link>
                            </div>

                            <div className="mt-6 text-sm text-gray-500">
                                <p>📞 Hotline: +84 123 456 789</p>
                                <p>📧 Email: info@phogroup.vn</p>
                                <p>📍 Địa chỉ: Phú Quốc, Kiên Giang, Việt Nam</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
