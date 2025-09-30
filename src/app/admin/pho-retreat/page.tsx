'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PhoRetreatManagement() {
    const [villas] = useState([
        {
            id: 1,
            name: 'Villa Ocean View Premium',
            type: 'Villa biển',
            capacity: 8,
            pricePerNight: 2500000,
            bookingRate: 85,
            status: 'active',
            totalBookings: 45
        },
        {
            id: 2,
            name: 'Villa Garden Paradise',
            type: 'Villa vườn',
            capacity: 6,
            pricePerNight: 1800000,
            bookingRate: 72,
            status: 'active',
            totalBookings: 32
        },
        {
            id: 3,
            name: 'Resort Suite Deluxe',
            type: 'Resort suite',
            capacity: 4,
            pricePerNight: 3200000,
            bookingRate: 90,
            status: 'active',
            totalBookings: 67
        },
        {
            id: 4,
            name: 'Villa Sunset View',
            type: 'Villa biển',
            capacity: 10,
            pricePerNight: 3500000,
            bookingRate: 0,
            status: 'maintenance',
            totalBookings: 28
        },
    ]);

    const [recentBookings] = useState([
        { id: '#VL001', guest: 'Gia đình Nguyễn', villa: 'Villa Ocean View', checkIn: '15/10/2025', nights: 3, amount: 7500000, status: 'confirmed' },
        { id: '#VL002', guest: 'Mr. John Smith', villa: 'Resort Suite Deluxe', checkIn: '18/10/2025', nights: 2, amount: 6400000, status: 'pending' },
        { id: '#VL003', guest: 'Công ty ABC', villa: 'Villa Garden Paradise', checkIn: '20/10/2025', nights: 4, amount: 7200000, status: 'confirmed' },
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Hoạt động';
            case 'maintenance': return 'Bảo trì';
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
                    <h1 className="text-2xl font-bold text-gray-900">🏖️ Pho Retreat - Quản lý Villa & Resort</h1>
                    <p className="mt-2 text-gray-600">Quản lý lưu trú cao cấp tại Phú Quốc</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/admin/pho-retreat/new"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-colors"
                    >
                        <span className="mr-2">+</span>
                        Thêm villa mới
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">🏨</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng villa</p>
                            <p className="text-2xl font-bold text-gray-900">{villas.length}</p>
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
                            <p className="text-2xl font-bold text-gray-900">{villas.filter(v => v.status === 'active').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tỷ lệ đặt chỗ TB</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.round(villas.reduce((sum, v) => sum + v.bookingRate, 0) / villas.length)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng booking</p>
                            <p className="text-2xl font-bold text-gray-900">{villas.reduce((sum, v) => sum + v.totalBookings, 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link href="/admin/pho-retreat/bookings" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">📅</div>
                        <h3 className="font-semibold">Lịch đặt chỗ</h3>
                        <p className="text-sm text-gray-600">Xem lịch booking</p>
                    </Link>
                    <Link href="/admin/pho-retreat/maintenance" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">🔧</div>
                        <h3 className="font-semibold">Bảo trì</h3>
                        <p className="text-sm text-gray-600">Lịch bảo trì villa</p>
                    </Link>
                    <Link href="/admin/pho-retreat/reviews" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">⭐</div>
                        <h3 className="font-semibold">Đánh giá</h3>
                        <p className="text-sm text-gray-600">Reviews khách hàng</p>
                    </Link>
                    <Link href="/admin/pho-retreat/pricing" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">💲</div>
                        <h3 className="font-semibold">Bảng giá</h3>
                        <p className="text-sm text-gray-600">Quản lý giá theo mùa</p>
                    </Link>
                </div>
            </div>

            {/* Villa List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Danh sách Villa & Resort</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Villa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sức chứa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá/đêm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ đặt</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {villas.map((villa) => (
                                <tr key={villa.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg grid place-items-center text-white font-bold mr-3">
                                                🏖️
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{villa.name}</div>
                                                <div className="text-sm text-gray-500">ID: #{villa.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {villa.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {villa.capacity} người
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₫{villa.pricePerNight.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${villa.bookingRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{villa.bookingRate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(villa.status)}`}>
                                            {getStatusText(villa.status)}
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

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Đặt chỗ gần đây</h2>
                        <Link href="/admin/pho-retreat/bookings" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                            Xem tất cả →
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã booking</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Villa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đêm</th>
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
                                        {booking.guest}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.villa}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.checkIn}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.nights} đêm
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

            {/* External Platform Integration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🔗 Liên kết nền tảng đặt phòng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Booking.com</h3>
                                <p className="text-sm text-gray-600">{villas.filter(v => v.status === 'active').length} villa đã đồng bộ</p>
                            </div>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                                Quản lý
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Airbnb</h3>
                                <p className="text-sm text-gray-600">{villas.filter(v => v.status === 'active').length} villa đã đồng bộ</p>
                            </div>
                            <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
                                Quản lý
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
