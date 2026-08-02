import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 leading-none">
                        404
                    </h1>
                </div>

                {/* Content */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Trang không tìm thấy
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
                    </p>
                    <p className="text-gray-500">
                        Trang này có thể đã được di chuyển, xóa hoặc bạn đã nhập sai địa chỉ URL.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Về trang chủ
                    </Link>
                    <Link
                        href="/vi/1-things-to-do"
                        className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                    >
                        Khám phá thêm
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-32 right-16 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
                <div className="absolute bottom-32 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>
        </div>
    )
}