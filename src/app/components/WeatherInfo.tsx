export default function WeatherInfo() {
    const weatherData = [
        {
            period: "THG 12 - THG 2",
            temp: { max: 31, min: 23 },
            description: "Mùa khô - thời điểm tuyệt nhất để du lịch Phú Quốc",
            isRecommended: true,
            rainfall: "20mm",
            humidity: "70%"
        },
        {
            period: "THG 3 - THG 5",
            temp: { max: 32, min: 26 },
            description: "Mùa nắng - thời tiết ấm nóng, không quá đông du khách",
            isRecommended: false,
            rainfall: "50mm",
            humidity: "75%"
        },
        {
            period: "THG 6 - THG 8",
            temp: { max: 30, min: 26 },
            description: "Giao mùa - dễ có mưa vào tháng 07 và tháng 08",
            isRecommended: false,
            rainfall: "150mm",
            humidity: "85%"
        },
        {
            period: "THG 9 - THG 11",
            temp: { max: 30, min: 24 },
            description: "Mùa mưa - khả năng cao dễ có bão",
            isRecommended: false,
            rainfall: "300mm",
            humidity: "90%"
        }
    ]

    const quickInfo = [
        { label: "Múi giờ", value: "GMT +07:00", note: "Không chênh lệch thời gian", icon: "⏰" },
        { label: "Tiền tệ", value: "Việt Nam Đồng", note: "1USD ≈ 24,000VND", icon: "💰" },
        { label: "Ngôn ngữ chính thức", value: "Tiếng Việt", note: "English được sử dụng rộng rãi", icon: "🗣️" },
        { label: "Thời gian tuyệt nhất để đến", value: "THG 12 - THG 2", note: "Lễ hội âm nhạc Epizode Việt Nam", icon: "🎵" },
        { label: "Thời lượng lý tưởng", value: "3-4 ngày", note: "Đủ thời gian trải nghiệm đầy đủ", icon: "📅" },
        { label: "Thời gian bay", value: "1 giờ", note: "Khởi hành từ Thành phố Hồ Chí Minh", icon: "✈️" }
    ]

    const currentWeather = {
        temp: 28,
        condition: "Nắng đẹp",
        humidity: 72,
        wind: "15 km/h",
        visibility: "10 km"
    }

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Thông tin ngắn về Phú Quốc
                </h2>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg p-6 border">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    🌤️ Thời tiết địa phương
                                </h3>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{currentWeather.temp}°C</div>
                                    <div className="text-sm text-gray-600">{currentWeather.condition}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Độ ẩm</span>
                                    <span className="font-semibold">{currentWeather.humidity}%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Gió</span>
                                    <span className="font-semibold">{currentWeather.wind}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {weatherData.map((weather, index) => (
                                    <div key={index} className={`p-4 rounded-lg border transition-all hover:shadow-md ${weather.isRecommended ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-lg">{weather.period}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-orange-600">{weather.temp.max}°</span>
                                                    <span className="text-gray-500 ml-1">{weather.temp.min}°</span>
                                                </div>
                                                {weather.isRecommended && (
                                                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                                                        Tốt nhất
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{weather.description}</p>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <span>🌧️ {weather.rainfall}</span>
                                            <span>💧 {weather.humidity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 border">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                ℹ️ Thông tin chung
                            </h3>

                            <div className="space-y-4">
                                {quickInfo.map((info, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span>{info.icon}</span>
                                            <span className="font-medium text-gray-900">{info.label}</span>
                                        </div>
                                        <div className="font-semibold text-brand-600">{info.value}</div>
                                        <div className="text-sm text-gray-500">{info.note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                🗺️ Bản đồ Phú Quốc
                            </h3>
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <div className="text-3xl mb-2">🗺️</div>
                                    <div className="text-sm">Interactive Map</div>
                                    <div className="text-xs">Coming Soon</div>
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
                        <div className="bg-white p-4 rounded-lg">
                            <strong>Thời điểm tốt nhất:</strong> Tháng 12-2 là lý tưởng với thời tiết khô ráo, ít mưa.
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <strong>Tránh thời điểm:</strong> Tháng 9-11 có nhiều mưa và khả năng có bão.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}