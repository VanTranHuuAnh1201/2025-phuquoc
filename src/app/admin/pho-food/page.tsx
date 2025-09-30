'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PhoFoodManagement() {
    const [products] = useState([
        {
            id: 1,
            name: 'Cá khô Phú Quốc đặc biệt',
            category: 'Cá khô',
            price: 450000,
            stock: 25,
            status: 'active',
            sales: 156
        },
        {
            id: 2,
            name: 'Tôm khô size lớn',
            category: 'Tôm khô',
            price: 320000,
            stock: 12,
            status: 'active',
            sales: 89
        },
        {
            id: 3,
            name: 'Mực khô Phú Quốc',
            category: 'Mực khô',
            price: 280000,
            stock: 0,
            status: 'out_of_stock',
            sales: 67
        },
        {
            id: 4,
            name: 'Combo hải sản khô',
            category: 'Combo',
            price: 850000,
            stock: 8,
            status: 'active',
            sales: 34
        },
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'out_of_stock': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Đang bán';
            case 'out_of_stock': return 'Hết hàng';
            case 'draft': return 'Nháp';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🐟 PhoFood - Quản lý sản phẩm</h1>
                    <p className="mt-2 text-gray-600">Quản lý cá khô, hải sản và đặc sản Phú Quốc</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/admin/pho-food/new"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors"
                    >
                        <span className="mr-2">+</span>
                        Thêm sản phẩm mới
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">📦</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đang bán</p>
                            <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'active').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">❌</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Hết hàng</p>
                            <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'out_of_stock').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl grid place-items-center mr-4">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng bán</p>
                            <p className="text-2xl font-bold text-gray-900">{products.reduce((sum, p) => sum + p.sales, 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/pho-food/categories" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">📋</div>
                        <h3 className="font-semibold">Quản lý danh mục</h3>
                        <p className="text-sm text-gray-600">Cá khô, tôm khô, mực khô...</p>
                    </Link>
                    <Link href="/admin/pho-food/orders" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">🛒</div>
                        <h3 className="font-semibold">Đơn hàng</h3>
                        <p className="text-sm text-gray-600">Quản lý đơn đặt hàng</p>
                    </Link>
                    <Link href="/admin/pho-food/inventory" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="font-semibold">Tồn kho</h3>
                        <p className="text-sm text-gray-600">Theo dõi số lượng sản phẩm</p>
                    </Link>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Lọc
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Xuất Excel
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg grid place-items-center text-white font-bold mr-3">
                                                🐟
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">ID: #{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₫{product.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span className={product.stock === 0 ? 'text-red-600 font-semibold' : ''}>
                                            {product.stock} sp
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {product.sales} đơn
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                                            {getStatusText(product.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-700">Sửa</button>
                                            <button className="text-red-600 hover:text-red-700">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* External Platforms */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🔗 Liên kết nền tảng bán hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Shopee</h3>
                                <p className="text-sm text-gray-600">156 sản phẩm đã đồng bộ</p>
                            </div>
                            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                                Quản lý
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border border-pink-200 rounded-lg bg-pink-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">TikTok Shop</h3>
                                <p className="text-sm text-gray-600">89 sản phẩm đã đồng bộ</p>
                            </div>
                            <button className="px-3 py-1 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 transition-colors">
                                Quản lý
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
