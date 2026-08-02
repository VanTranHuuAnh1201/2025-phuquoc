'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BlogManagement() {
    const [posts] = useState([
        { id: 1, title: 'Hướng dẫn chế biến cá khô Phú Quốc', category: 'Ẩm thực', author: 'Admin', status: 'published', views: 1245, publishedAt: '15/10/2025' },
        { id: 2, title: 'Top 10 villa đẹp nhất Phú Quốc 2025', category: 'Du lịch', author: 'Admin', status: 'published', views: 892, publishedAt: '12/10/2025' },
        { id: 3, title: 'Kinh nghiệm tour 3 đảo Phú Quốc', category: 'Du lịch', author: 'Admin', status: 'draft', views: 0, publishedAt: '' },
        { id: 4, title: 'Mẹo bảo quản hải sản tươi sống', category: 'Ẩm thực', author: 'Admin', status: 'published', views: 567, publishedAt: '10/10/2025' },
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'published': return 'Đã xuất bản';
            case 'draft': return 'Bản nháp';
            case 'archived': return 'Lưu trữ';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Mobile optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📝 Quản lý Blog & Tin tức</h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Quản lý nội dung và bài viết</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/blog/categories"
                        className="px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Danh mục
                    </Link>
                    <Link
                        href="/admin/blog/new"
                        className="px-3 py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
                    >
                        + Viết bài mới
                    </Link>
                </div>
            </div>

            {/* Stats Cards - Mobile responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">📝</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng bài viết</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{posts.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Đã xuất bản</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'published').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">📄</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Bản nháp</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'draft').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl grid place-items-center mr-2 sm:mr-4">
                            <span className="text-lg sm:text-2xl">👁️</span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng lượt xem</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + p.views, 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Mobile optimized */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Link href="/admin/blog/categories" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📋</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Danh mục</h3>
                        <p className="text-xs text-gray-600 hidden sm:block">Quản lý chủ đề</p>
                    </Link>
                    <Link href="/admin/blog/media" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🖼️</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Media</h3>
                        <p className="text-xs text-gray-600 hidden sm:block">Hình ảnh, video</p>
                    </Link>
                    <Link href="/admin/blog/comments" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💬</div>
                        <h3 className="font-semibold text-xs sm:text-sm">Bình luận</h3>
                        <p className="text-xs text-gray-600 hidden sm:block">Quản lý comments</p>
                    </Link>
                    <Link href="/admin/blog/seo" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔍</div>
                        <h3 className="font-semibold text-xs sm:text-sm">SEO</h3>
                        <p className="text-xs text-gray-600 hidden sm:block">Tối ưu SEO</p>
                    </Link>
                </div>
            </div>

            {/* Posts Table - Mobile responsive */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Danh sách bài viết</h2>
                        <div className="flex gap-2">
                            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                Lọc
                            </button>
                            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                Xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="block sm:hidden">
                    {posts.map((post) => (
                        <div key={post.id} className="p-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{post.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{post.category} • {post.views} lượt xem</p>
                                </div>
                                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(post.status)}`}>
                                    {getStatusText(post.status)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{post.publishedAt || 'Chưa xuất bản'}</span>
                                <div className="flex gap-2">
                                    <button className="text-blue-600">Sửa</button>
                                    <button className="text-red-600">Xóa</button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài viết</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt xem</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg grid place-items-center text-white font-bold mr-3">
                                                📝
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">{post.title}</div>
                                                <div className="text-sm text-gray-500">ID: #{post.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {post.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {post.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {post.views} lượt
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {post.publishedAt || 'Chưa xuất bản'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(post.status)}`}>
                                            {getStatusText(post.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-700">Sửa</button>
                                            <button className="text-green-600 hover:text-green-700">Xem</button>
                                            <button className="text-red-600 hover:text-red-700">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">📊 Hiệu suất theo danh mục</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Ẩm thực</h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    {posts.filter(p => p.category === 'Ẩm thực').length} bài viết
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm sm:text-base">
                                    {posts.filter(p => p.category === 'Ẩm thực').reduce((sum, p) => sum + p.views, 0)} views
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Du lịch</h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    {posts.filter(p => p.category === 'Du lịch').length} bài viết
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm sm:text-base">
                                    {posts.filter(p => p.category === 'Du lịch').reduce((sum, p) => sum + p.views, 0)} views
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
