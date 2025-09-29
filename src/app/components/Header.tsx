import Link from 'next/link'

export default function Header() {
    return (
        <header className="sticky top-10 z-40 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 grid place-items-center text-white font-bold text-sm">
                            Pho
                        </div>
                        <span className="font-bold text-xl text-gray-900">PhoGroup</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm theo điểm đến, hoạt động"
                                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
                        <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                            Mở ứng dụng
                        </a>
                        <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                            Trợ giúp
                        </a>
                        <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                            Xem giỏ đặy
                        </a>
                        <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                            Đăng ký
                        </a>
                        <a href="#" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-medium">
                            Đăng nhập
                        </a>
                    </nav>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <a href="#contact" className="ml-auto md:ml-4 inline-flex px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-semibold">
                        Đặt ngay
                    </a>
                </div>
            </div>
        </header>
    )
}
