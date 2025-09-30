'use client';

import { useState } from 'react';

export default function OrdersManagement() {
    const [orders] = useState([
        { id: '#PH001', customer: 'Nguyễn Văn A', product: 'Cá khô Phú Quốc', type: 'PhoFood', amount: 450000, status: 'pending', date: '15/10/2025', phone: '0901234567' },
        { id: '#PH002', customer: 'John Smith', product: 'Villa Ocean View 3N2Đ', type: 'PhoRetreat', amount: 7500000, status: 'confirmed', date: '12/10/2025', phone: '+84901234568' },
        { id: '#PH003', customer: 'Trần Thị B', product: 'Tour 3 đảo', type: 'PhoTravel', amount: 2400000, status: 'completed', date: '10/10/2025', phone: '0901234569' },
        { id: '#PH004', customer: 'Lê Văn C', product: 'Combo hải sản khô', type: 'PhoFood', amount: 850000, status: 'cancelled', date: '08/10/2025', phone: '0901234570' },
        { id: '#PH005', customer: 'Sarah Johnson', product: 'Villa Garden Paradise 4N3Đ', type: 'PhoRetreat', amount: 5400000, status: 'confirmed', date: '07/10/2025', phone: '+84901234571' },
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Hoàn thành';
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xử lý';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'PhoFood': return 'bg-blue-500';
            case 'PhoRetreat': return 'bg-green-500';
            case 'PhoTravel': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'PhoFood': return '🐟';
            case 'PhoRetreat': return '🏖️';
            case 'PhoTravel': return '✈️';
            default: return '📦';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Mobile optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📦 Quản lý Đơn hàng</h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Theo dõi và xử lý đơn hàng</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Lọc
                    </button>
                    <button className="px-3 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Stats Cards - Mobile responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">📦</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng đơn</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">⏰</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Chờ xử lý</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Hoàn thành</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'completed').length}</p>
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
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">
                                ₫{orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Mobile optimized */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <button className="p-3 sm:p-4 border border-yellow-200 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⏰</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Đơn chờ xử lý</h3>
                        <p className="text-xs text-gray-600">{orders.filter(o => o.status === 'pending').length} đơn</p>
                    </button>
                    <button className="p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔄</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Đồng bộ</h3>
                        <p className="text-xs text-gray-600">Cập nhật trạng thái</p>
                    </button>
                    <button className="p-3 sm:p-4 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📊</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Báo cáo</h3>
                        <p className="text-xs text-gray-600">Thống kê chi tiết</p>
                    </button>
                </div>
            </div>

            {/* Orders Table - Mobile responsive */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Danh sách đơn hàng</h2>
                </div>

                {/* Mobile Cards */}
                <div className="block sm:hidden">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm text-gray-900">{order.id}</span>
                                        <span className={`w-6 h-6 rounded text-white text-xs grid place-items-center ${getTypeColor(order.type)}`}>
                                            {getTypeIcon(order.type)}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-sm text-gray-900">{order.customer}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-1">{order.product}</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">₫{order.amount.toLocaleString()}</p>
                                </div>
                                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{order.date}</span>
                                <div className="flex gap-2">
                                    <button className="text-blue-600">Xem</button>
                                    {order.status === 'pending' && <button className="text-green-600">Xác nhận</button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm/Dịch vụ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                        <div className="text-sm text-gray-500">{order.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 max-w-xs line-clamp-2">{order.product}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`w-8 h-8 rounded-lg text-white text-sm grid place-items-center mr-2 ${getTypeColor(order.type)}`}>
                                                {getTypeIcon(order.type)}
                                            </span>
                                            <span className="text-sm text-gray-600">{order.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₫{order.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-700">Xem</button>
                                            {order.status === 'pending' && (
                                                <button className="text-green-600 hover:text-green-700">Xác nhận</button>
                                            )}
                                            <button className="text-red-600 hover:text-red-700">Hủy</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Business Unit Performance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-blue-500 rounded-lg grid place-items-center text-white">🐟</span>
                            PhoFood
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Đơn hàng:</span>
                            <span className="font-semibold">{orders.filter(o => o.type === 'PhoFood').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Doanh thu:</span>
                            <span className="font-semibold">₫{orders.filter(o => o.type === 'PhoFood' && o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-green-500 rounded-lg grid place-items-center text-white">🏖️</span>
                            Pho Retreat
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Booking:</span>
                            <span className="font-semibold">{orders.filter(o => o.type === 'PhoRetreat').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Doanh thu:</span>
                            <span className="font-semibold">₫{orders.filter(o => o.type === 'PhoRetreat' && o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-purple-500 rounded-lg grid place-items-center text-white">✈️</span>
                            Pho Travel
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tour:</span>
                            <span className="font-semibold">{orders.filter(o => o.type === 'PhoTravel').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Doanh thu:</span>
                            <span className="font-semibold">₫{orders.filter(o => o.type === 'PhoTravel' && o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
