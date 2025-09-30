'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        activeVillas: 0,
        pendingBookings: 0,
        blogPosts: 0
    });

    useEffect(() => {
        // Simulate loading stats
        const timer = setTimeout(() => {
            setStats({
                totalOrders: 156,
                totalRevenue: 2850000,
                totalCustomers: 89,
                activeVillas: 12,
                pendingBookings: 8,
                blogPosts: 24
            });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const quickActions = [
        { name: 'Thêm sản phẩm mới', href: '/admin/pho-food/new', icon: '🐟', color: 'from-blue-500 to-cyan-500' },
        { name: 'Thêm villa mới', href: '/admin/pho-retreat/new', icon: '🏖️', color: 'from-green-500 to-teal-500' },
        { name: 'Tạo tour mới', href: '/admin/pho-travel/new', icon: '✈️', color: 'from-purple-500 to-pink-500' },
        { name: 'Viết blog mới', href: '/admin/blog/new', icon: '📝', color: 'from-orange-500 to-red-500' },
    ];

    const recentOrders = [
        { id: '#001', customer: 'Nguyễn Văn A', product: 'Cá khô Phú Quốc', amount: 450000, status: 'pending' },
        { id: '#002', customer: 'Trần Thị B', product: 'Villa Ocean View 3N2Đ', amount: 2500000, status: 'confirmed' },
        { id: '#003', customer: 'John Smith', product: 'Tour 3 đảo', amount: 1200000, status: 'completed' },
        { id: '#004', customer: 'Lê Văn C', product: 'Tôm khô đặc biệt', amount: 320000, status: 'pending' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Hoàn thành';
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xử lý';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl text-white p-8">
                <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
                <p className="text-white/90">Quản lý hệ thống PhoGroup - Cập nhật hoạt động mới nhất</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            <p className="text-sm text-green-600">+12% từ tháng trước</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl grid place-items-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900">₫{stats.totalRevenue.toLocaleString()}</p>
                            <p className="text-sm text-green-600">+8% từ tháng trước</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl grid place-items-center">
                            <span className="text-2xl">💰</span>
                        </div>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Khách hàng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                            <p className="text-sm text-green-600">+5 khách mới</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl grid place-items-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                {/* Active Villas */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Villa hoạt động</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeVillas}</p>
                            <p className="text-sm text-blue-600">85% đặt chỗ</p>
                        </div>
                        <div className="w-12 h-12 bg-teal-100 rounded-xl grid place-items-center">
                            <span className="text-2xl">🏖️</span>
                        </div>
                    </div>
                </div>

                {/* Pending Bookings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đặt chỗ chờ</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                            <p className="text-sm text-orange-600">Cần xử lý</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl grid place-items-center">
                            <span className="text-2xl">⏰</span>
                        </div>
                    </div>
                </div>

                {/* Blog Posts */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Bài viết blog</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.blogPosts}</p>
                            <p className="text-sm text-green-600">3 bài mới tuần này</p>
                        </div>
                        <div className="w-12 h-12 bg-pink-100 rounded-xl grid place-items-center">
                            <span className="text-2xl">📝</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200`}
                        >
                            <div className="text-2xl mb-2">{action.icon}</div>
                            <h3 className="font-semibold text-sm">{action.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Đơn hàng gần đây</h2>
                        <Link href="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Xem tất cả →
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.product}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                        ₫{order.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
