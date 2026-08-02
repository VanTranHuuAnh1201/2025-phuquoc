'use client';

import { useState } from 'react';

export default function CustomersManagement() {
    const [customers] = useState([
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', location: 'TP.HCM', totalOrders: 5, totalSpent: 2250000, lastOrder: '15/10/2025', status: 'active', type: 'VIP' },
        { id: 2, name: 'John Smith', email: 'john.smith@email.com', phone: '+84901234568', location: 'USA', totalOrders: 2, totalSpent: 12900000, lastOrder: '12/10/2025', status: 'active', type: 'International' },
        { id: 3, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0901234569', location: 'Hà Nội', totalOrders: 3, totalSpent: 3600000, lastOrder: '10/10/2025', status: 'active', type: 'Regular' },
        { id: 4, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0901234570', location: 'Đà Nẵng', totalOrders: 1, totalSpent: 450000, lastOrder: '08/10/2025', status: 'inactive', type: 'New' },
        { id: 5, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+84901234571', location: 'Australia', totalOrders: 4, totalSpent: 18700000, lastOrder: '07/10/2025', status: 'active', type: 'VIP' },
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'blocked': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Hoạt động';
            case 'inactive': return 'Không hoạt động';
            case 'blocked': return 'Đã chặn';
            default: return 'Không xác định';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'VIP': return 'bg-purple-100 text-purple-800';
            case 'International': return 'bg-blue-100 text-blue-800';
            case 'Regular': return 'bg-green-100 text-green-800';
            case 'New': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Mobile optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">👥 Quản lý Khách hàng</h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Theo dõi và chăm sóc khách hàng</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Lọc
                    </button>
                    <button className="px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Xuất danh sách
                    </button>
                </div>
            </div>

            {/* Stats Cards - Mobile responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">👥</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng KH</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{customers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Hoạt động</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{customers.filter(c => c.status === 'active').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">👑</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">VIP</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{customers.filter(c => c.type === 'VIP').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">🌍</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Quốc tế</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{customers.filter(c => c.type === 'International').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Mobile optimized */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <button className="p-3 sm:p-4 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">👑</div>
                        <h3 className="font-semibold text-xs sm:text-sm">KH VIP</h3>
                        <p className="text-xs text-gray-600">{customers.filter(c => c.type === 'VIP').length} khách</p>
                    </button>
                    <button className="p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🌍</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Quốc tế</h3>
                        <p className="text-xs text-gray-600">{customers.filter(c => c.type === 'International').length} khách</p>
                    </button>
                    <button className="p-3 sm:p-4 border border-yellow-200 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🆕</div>
                        <h3 className="font-semibold text-xs sm:text-sm">KH mới</h3>
                        <p className="text-xs text-gray-600">{customers.filter(c => c.type === 'New').length} khách</p>
                    </button>
                    <button className="p-3 sm:p-4 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📧</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Gửi email</h3>
                        <p className="text-xs text-gray-600">Marketing</p>
                    </button>
                </div>
            </div>

            {/* Customers Table - Mobile responsive */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Danh sách khách hàng</h2>
                </div>

                {/* Mobile Cards */}
                <div className="block sm:hidden">
                    {customers.map((customer) => (
                        <div key={customer.id} className="p-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-sm text-gray-900">{customer.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(customer.type)}`}>
                                            {customer.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{customer.email}</p>
                                    <p className="text-xs text-gray-500">{customer.phone} • {customer.location}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                        <span className="text-gray-600">{customer.totalOrders} đơn</span>
                                        <span className="font-semibold text-gray-900">₫{customer.totalSpent.toLocaleString()}</span>
                                    </div>
                                </div>
                                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(customer.status)}`}>
                                    {getStatusText(customer.status)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Mua cuối: {customer.lastOrder}</span>
                                <div className="flex gap-2">
                                    <button className="text-blue-600">Xem</button>
                                    <button className="text-green-600">Liên hệ</button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiêu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mua cuối</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full grid place-items-center text-white font-bold mr-3">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-sm text-gray-500">ID: #{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                        <div className="text-sm text-gray-500">{customer.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {customer.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                        {customer.totalOrders}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₫{customer.totalSpent.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {customer.lastOrder}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(customer.type)}`}>
                                            {customer.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(customer.status)}`}>
                                            {getStatusText(customer.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-700">Xem</button>
                                            <button className="text-green-600 hover:text-green-700">Liên hệ</button>
                                            <button className="text-orange-600 hover:text-orange-700">Chỉnh sửa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Top Spending Customers */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">💎 Top khách hàng VIP</h3>
                    <div className="space-y-3">
                        {customers
                            .filter(c => c.type === 'VIP')
                            .sort((a, b) => b.totalSpent - a.totalSpent)
                            .slice(0, 3)
                            .map((customer, index) => (
                                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full grid place-items-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <div>
                                            <div className="font-medium text-sm text-gray-900">{customer.name}</div>
                                            <div className="text-xs text-gray-500">{customer.totalOrders} đơn hàng</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm text-gray-900">₫{customer.totalSpent.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">🌍 Phân bố địa lý</h3>
                    <div className="space-y-3">
                        {[...new Set(customers.map(c => c.location))].map(location => {
                            const count = customers.filter(c => c.location === location).length;
                            const revenue = customers.filter(c => c.location === location).reduce((sum, c) => sum + c.totalSpent, 0);
                            return (
                                <div key={location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">{location}</div>
                                        <div className="text-xs text-gray-500">{count} khách hàng</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm text-gray-900">₫{revenue.toLocaleString()}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
