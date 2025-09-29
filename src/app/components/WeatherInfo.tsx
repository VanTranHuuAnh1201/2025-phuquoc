export default function WeatherInfo() {
    const weatherData = [
        {
            period: "THG 12 - THG 2",
            temp: { max: 31, min: 23 },
            description: "Mùa khô - thời điểm tuyệt nhất để du lịch Phú Quốc",
            isRecommended: true
        },
        {
            period: "THG 3 - THG 5",
            temp: { max: 32, min: 26 },
            description: "Mùa nắng - thời tiết ấm nóng, không quá đông du khách",
            isRecommended: false
        },
        {
            period: "THG 6 - THG 8",
            temp: { max: 30, min: 26 },
            description: "Giao mùa - dễ có mưa vào tháng 07 và tháng 08",
            isRecommended: false
        },
        {
            period: "THG 9 - THG 11",
            temp: { max: 30, min: 24 },
            description: "Mùa mưa - khả năng cao dễ có bão",
            isRecommended: false
        }
    ]

    const quickInfo = [
        { label: "Múi giờ", value: "GMT +07:00", note: "Không chênh lệch thời gian" },
        { label: "Tiền tệ", value: "Việt Nam Đồng", note: "1VND = 1.00VND" },
        { label: "Ngôn ngữ chính thức", value: "Tiếng Việt", note: "English được sử dụng rộng rãi" },
        { label: "Thời gian tuyệt nhất để đến", value: "THG 1", note: "Lễ hội âm nhạc Epizode Việt Nam" },
        { label: "Thời lượng lý tưởng", value: "3-4 ngày", note: "Đủ thời gian trải nghiệm đầy đủ" },
        { label: "Thời gian bay", value: "1 giờ", note: "Khởi hành từ Thành phố Hồ Chí Minh" }
    ]

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Thông tin ngắn về Phú Quốc
                </h2>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Weather Info */}
                    <div className="bg-white rounded-lg p-6 border">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            🌤️ Thời tiết địa phương
                        </h3>

                        <div className="space-y-4">
                            {weatherData.map((weather, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${weather.isRecommended ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-lg">{weather.period}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold">{weather.temp.max}°</span>
                                            <span className="text-gray-500">{weather.temp.min}°</span>
                                            {weather.isRecommended && (
                                                <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                                    Tốt nhất
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{weather.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-white rounded-lg p-6 border">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            ℹ️ Thông tin chung
                        </h3>

                        <div className="space-y-4">
                            {quickInfo.map((info, index) => (
                                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-700">{info.label}</span>
                                        <span className="font-semibold">{info.value}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{info.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pho Group tips */}
                <div className="mt-8 bg-brand-50 rounded-lg p-6 border border-brand-200">
                    <h3 className="text-lg font-semibold mb-3 text-brand-800">
                        💡 Tips từ Pho Group
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-brand-700">Thời điểm đặt villa:</span>
                            <p className="text-gray-600">Đặt trước 2-4 tuần để có giá tốt, đặc biệt mùa cao điểm (Dec-Feb)</p>
                        </div>
                        <div>
                            <span className="font-medium text-brand-700">Mua đặc sản:</span>
                            <p className="text-gray-600">Nên mua ở những cửa hàng uy tín có hóa đơn để đảm bảo chất lượng</p>
                        </div>
                        <div>
                            <span className="font-medium text-brand-700">Tour 3 đảo:</span>
                            <p className="text-gray-600">Đi vào buổi sáng để tránh nắng và có ánh sáng đẹp chụp ảnh</p>
                        </div>
                        <div>
                            <span className="font-medium text-brand-700">Di chuyển:</span>
                            <p className="text-gray-600">Thuê xe máy hoặc xe riêng để tự do khám phá, đường đi an toàn</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
