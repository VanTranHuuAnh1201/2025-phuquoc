'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PhoTravelManagement() {
    const [tours] = useState([
        {
            id: 1,
            name: 'Tour 3 đảo Phú Quốc',
            type: 'Tour biển',
            duration: '1 ngày',
            price: 1200000,
            capacity: 20,
            bookings: 156,
            status: 'active',
            rating: 4.8
        },
        {
            id: 2,
            name: 'Vé cáp treo Hòn Thơm',
            type: 'Vé tham quan',
            duration: '4 giờ',
            price: 940000,
            capacity: 0,
            bookings: 89,
            status: 'active',
            rating: 4.7
        },
        {
            id: 3,
            name: 'Vinpearl Safari + Show Kiss of the Sea',
            type: 'Combo vé',
            duration: '1 ngày',
            price: 1850000,
            capacity: 15,
            bookings: 67,
            status: 'active',
            rating: 4.9
        },
        {
            id: 4,
            name: 'Tour câu cá + BBQ trên biển',
            type: 'Tour trải nghiệm',
            duration: '6 giờ',
            price: 1500000,
            capacity: 12,
            bookings: 34,
            status: 'seasonal',
            rating: 4.6
        },
    ]);

    const [recentBookings] = useState([
        { id: '#TR001', customer: 'John & Sarah Smith', tour: 'Tour 3 đảo Phú Quốc', date: '15/10/2025', people: 4, amount: 4800000, status: 'confirmed' },
        { id: '#TR002', customer: 'Gia đình Nguyễn', tour: 'Vinpearl Safari Combo', date: '18/10/2025', people: 6, amount: 11100000, status: 'pending' },
        { id: '#TR003', customer: 'Group ABC Company', tour: 'Tour câu cá + BBQ', date: '20/10/2025', people: 12, amount: 18000000, status: 'confirmed' },
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'seasonal': return 'bg-yellow-100 text-yellow-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Hoạt động';
            case 'seasonal': return 'Theo mùa';
            case 'inactive': return 'Tạm ngừng';
            default: return 'Không xác định';
        }
    };

    const getBookingStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBookingStatusText = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xác nhận';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">✈️ Pho Travel - Quản lý Tour & Trải nghiệm</h1>
                    <p className="mt-2 text-gray-600">Quản lý tour du lịch và vé tham quan Phú Quốc</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/admin/pho-travel/new"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                        <span className="mr-2">+</span>
                        Tạo tour mới
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">🎫</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng tour</p>
                            <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-gray-900">{tours.filter(t => t.status === 'active').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng booking</p>
                            <p className="text-2xl font-bold text-gray-900">{tours.reduce((sum, t) => sum + t.bookings, 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(tours.reduce((sum, t) => sum + t.rating, 0) / tours.length).toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link href="/admin/pho-travel/calendar" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">📅</div>
                        <h3 className="font-semibold">Lịch tour</h3>
                        <p className="text-sm text-gray-600">Quản lý lịch trình</p>
                    </Link>
                    <Link href="/admin/pho-travel/guides" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">👨‍🏫</div>
                        <h3 className="font-semibold">Hướng dẫn viên</h3>
                        <p className="text-sm text-gray-600">Quản lý HDV</p>
                    </Link>
                    <Link href="/admin/pho-travel/vehicles" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">🚌</div>
                        <h3 className="font-semibold">Phương tiện</h3>
                        <p className="text-sm text-gray-600">Xe, thuyền, cano</p>
                    </Link>
                    <Link href="/admin/pho-travel/reviews" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">📝</div>
                        <h3 className="font-semibold">Đánh giá</h3>
                        <p className="text-sm text-gray-600">Reviews khách hàng</p>
                    </Link>
                </div>
            </div>

            {/* Tour List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Danh sách Tour & Trải nghiệm</h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Lọc theo loại
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Xuất báo cáo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá/người</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tours.map((tour) => (
                                <tr key={tour.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg grid place-items-center text-white font-bold mr-3">
                                                ✈️
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{tour.name}</div>
                                                <div className="text-sm text-gray-500">ID: #{tour.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {tour.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {tour.duration}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₫{tour.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {tour.bookings} lượt
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">⭐</span>
                                            <span className="text-sm font-semibold text-gray-900">{tour.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(tour.status)}`}>
                                            {getStatusText(tour.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-700">Sửa</button>
                                            <button className="text-green-600 hover:text-green-700">Lịch</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Tour Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Đặt tour gần đây</h2>
                        <Link href="/admin/pho-travel/bookings" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                            Xem tất cả →
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã tour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số người</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentBookings.map((booking, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {booking.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.tour}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.people} người
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₫{booking.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusBadge(booking.status)}`}>
                                            {getBookingStatusText(booking.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Partner Integration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🤝 Đối tác & Liên kết</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Sun World Hòn Thơm</h3>
                                <p className="text-sm text-gray-600">Đối tác cáp treo</p>
                            </div>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">VinWonders</h3>
                                <p className="text-sm text-gray-600">Công viên giải trí</p>
                            </div>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                    </div>

                    <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Vinpearl Safari</h3>
                                <p className="text-sm text-gray-600">Vườn thú safari</p>
                            </div>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
