'use client';

import { useState } from 'react';

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('7days');

    const analyticsData = {
        '7days': {
            visitors: 2547,
            pageviews: 8923,
            orders: 15,
            revenue: 12450000,
            topPages: [
                { page: '/', views: 3214, percentage: 36 },
                { page: '/pho-food', views: 1876, percentage: 21 },
                { page: '/pho-retreat', views: 1543, percentage: 17 },
                { page: '/pho-travel', views: 1287, percentage: 14 },
                { page: '/blog', views: 1003, percentage: 12 }
            ],
            deviceData: [
                { device: 'Mobile', users: 1547, percentage: 61 },
                { device: 'Desktop', users: 786, percentage: 31 },
                { device: 'Tablet', users: 214, percentage: 8 }
            ],
            locationData: [
                { country: 'Vietnam', users: 1876, percentage: 74 },
                { country: 'USA', users: 345, percentage: 14 },
                { country: 'Australia', users: 198, percentage: 8 },
                { country: 'Others', users: 128, percentage: 4 }
            ]
        }
    };

    const data = analyticsData[timeRange as keyof typeof analyticsData];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Mobile optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📈 Analytics & Báo cáo</h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Thống kê và phân tích website</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="7days">7 ngày qua</option>
                        <option value="30days">30 ngày qua</option>
                        <option value="90days">3 tháng qua</option>
                    </select>
                    <button className="px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Key Metrics - Mobile responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">👁️</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Lượt truy cập</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.visitors.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">📄</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Lượt xem trang</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.pageviews.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">🛒</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Đơn hàng</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.orders}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">💰</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Doanh thu</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">₫{data.revenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Top Pages */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">📊 Trang được xem nhiều nhất</h3>
                    <div className="space-y-3">
                        {data.topPages.map((page, index) => (
                            <div key={page.page} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs font-bold grid place-items-center">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">{page.page}</div>
                                        <div className="text-xs text-gray-500">{page.views.toLocaleString()} views</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-900">{page.percentage}%</div>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${page.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device Usage */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">📱 Thiết bị truy cập</h3>
                    <div className="space-y-3">
                        {data.deviceData.map((device, index) => (
                            <div key={device.device} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-lg grid place-items-center text-white text-sm ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-orange-500'
                                        }`}>
                                        {device.device === 'Mobile' ? '📱' : device.device === 'Desktop' ? '💻' : '📊'}
                                    </span>
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">{device.device}</div>
                                        <div className="text-xs text-gray-500">{device.users.toLocaleString()} users</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-900">{device.percentage}%</div>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-orange-500'
                                                }`}
                                            style={{ width: `${device.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Location & Business Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Geographic Data */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">🌍 Phân bố địa lý</h3>
                    <div className="space-y-3">
                        {data.locationData.map((location, index) => (
                            <div key={location.country} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">
                                        {location.country === 'Vietnam' ? '🇻🇳' :
                                            location.country === 'USA' ? '🇺🇸' :
                                                location.country === 'Australia' ? '🇦🇺' : '🌍'}
                                    </span>
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">{location.country}</div>
                                        <div className="text-xs text-gray-500">{location.users.toLocaleString()} users</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-900">{location.percentage}%</div>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-500 h-2 rounded-full"
                                            style={{ width: `${location.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Business Unit Performance */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">🏢 Hiệu suất theo mảng</h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-blue-500 rounded text-white text-xs grid place-items-center">🐟</span>
                                    <span className="font-semibold text-sm">PhoFood</span>
                                </div>
                                <span className="text-xs text-blue-600 font-medium">21% traffic</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <div className="text-gray-600">Lượt xem</div>
                                    <div className="font-semibold">1,876</div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Conversion</div>
                                    <div className="font-semibold">2.3%</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-green-500 rounded text-white text-xs grid place-items-center">🏖️</span>
                                    <span className="font-semibold text-sm">Pho Retreat</span>
                                </div>
                                <span className="text-xs text-green-600 font-medium">17% traffic</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <div className="text-gray-600">Lượt xem</div>
                                    <div className="font-semibold">1,543</div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Conversion</div>
                                    <div className="font-semibold">4.1%</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-purple-500 rounded text-white text-xs grid place-items-center">✈️</span>
                                    <span className="font-semibold text-sm">Pho Travel</span>
                                </div>
                                <span className="text-xs text-purple-600 font-medium">14% traffic</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <div className="text-gray-600">Lượt xem</div>
                                    <div className="font-semibold">1,287</div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Conversion</div>
                                    <div className="font-semibold">3.7%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-time Data */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">⚡ Dữ liệu thời gian thực</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">23</div>
                        <div className="text-xs text-gray-600">Online hiện tại</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg sm:text-2xl font-bold text-blue-600">156</div>
                        <div className="text-xs text-gray-600">Hôm nay</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg sm:text-2xl font-bold text-orange-600">4</div>
                        <div className="text-xs text-gray-600">Đơn hàng mới</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg sm:text-2xl font-bold text-purple-600">2.3%</div>
                        <div className="text-xs text-gray-600">Bounce rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
