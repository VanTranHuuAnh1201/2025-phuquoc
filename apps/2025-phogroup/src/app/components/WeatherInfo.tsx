import { quickInfoData, weatherData } from '../lib/data';

export default function WeatherInfo() {
    return (
        <section className="py-4 sm:py-6 bg-white/90 backdrop-blur-sm rounded-2xl mx-2 sm:mx-3 lg:mx-4 shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        🌤️ Thông tin thời tiết
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
                        Lựa chọn thời điểm tốt nhất cho chuyến đi
                    </p>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 border shadow-sm">
                    <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
                        {/* Weather Section */}
                        <div className="lg:col-span-3">
                            {/* Weather Header */}
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    Thời tiết địa phương
                                </h3>
                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                    <button className="px-2 py-1 sm:px-3 sm:py-1 bg-white rounded-md text-xs sm:text-sm font-medium shadow-sm">
                                        °F
                                    </button>
                                    <button className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium text-gray-600">
                                        °C
                                    </button>
                                </div>
                            </div>

                            {/* Weather Periods */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {weatherData.map((weather, index) => (
                                    <div key={index} className="text-left">
                                        <div className="text-sm text-gray-600 mb-2">{weather.period}</div>
                                        <div className="mb-2">
                                            <span className="text-3xl font-bold text-gray-900">{weather.temp.max}°</span>
                                            <span className="text-lg text-gray-500 ml-1">{weather.temp.min}°</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed">{weather.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* General Information */}
                            <div className="border-t pt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chung</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {quickInfoData.map((info, index) => (
                                        <div key={index} className="text-left">
                                            <div className="text-sm text-gray-600 mb-1">{info.label}</div>
                                            <div className="font-semibold text-gray-900 mb-1">{info.value}</div>
                                            <div className="text-xs text-gray-500">{info.note}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flight Time */}
                            <div className="border-t pt-6 mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Thời gian bay</h4>
                                <div className="text-left">
                                    <div className="text-sm text-gray-600 mb-1">Thời gian bay</div>
                                    <div className="font-semibold text-gray-900 mb-1">1.5 giờ</div>
                                    <div className="text-xs text-gray-500">Khởi hành từ Thành phố Hồ Chí Minh</div>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-4 h-full min-h-[300px] relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 rounded-lg">
                                    {/* Map placeholder with location markers */}
                                    <div className="relative h-full">
                                        <div className="absolute top-6 right-6 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                                            ĐỊ A73
                                        </div>
                                        <div className="absolute top-12 left-8 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                                            ĐT A5
                                        </div>
                                        <div className="absolute bottom-1/3 right-1/2 transform translate-x-1/2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                                            <div className="text-xs font-medium mt-1 bg-white px-2 py-1 rounded shadow text-center">
                                                PHÚ QUỐC<br />
                                                <span className="text-green-600">National Park</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                        Xem các hoạt động nổi bật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-brand-50 rounded-lg border border-brand-200">
                    <h3 className="text-lg font-semibold mb-3 text-brand-800">
                        🌟 Lời khuyên từ Pho Group
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-green-600">✅</span>
                                <strong className="text-green-800">Thời điểm tốt nhất:</strong>
                            </div>
                            <p>Tháng 12-2 là lý tưởng với thời tiết khô ráo, ít mưa, biển êm.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-red-600">⚠️</span>
                                <strong className="text-red-800">Tránh thời điểm:</strong>
                            </div>
                            <p>Tháng 9-11 có nhiều mưa và khả năng có bão.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}