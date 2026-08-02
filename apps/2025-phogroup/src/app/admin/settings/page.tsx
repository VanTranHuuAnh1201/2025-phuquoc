'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);

    const tabs = [
        { id: 'general', name: 'Cài đặt chung', icon: '⚙️' },
        { id: 'business', name: 'Thông tin doanh nghiệp', icon: '🏢' },
        { id: 'notifications', name: 'Thông báo', icon: '🔔' },
        { id: 'security', name: 'Bảo mật', icon: '🔐' },
        { id: 'integrations', name: 'Tích hợp', icon: '🔗' },
        { id: 'backup', name: 'Sao lưu', icon: '💾' },
    ];

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        alert('Cài đặt đã được lưu thành công!');
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h1>
                <p className="text-gray-600">Quản lý cài đặt và tùy chỉnh hệ thống PhoGroup</p>
            </div>

            {/* Tab Navigation - Mobile Scrollable */}
            <div className="mb-6 sm:mb-8">
                <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-1 sm:gap-2 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 border border-orange-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
                {/* General Settings */}
                {activeTab === 'general' && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Cài đặt chung</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Website Settings */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Thông tin Website</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên website</label>
                                    <input
                                        type="text"
                                        defaultValue="PhoGroup - Phú Quốc"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                    <textarea
                                        rows={3}
                                        defaultValue="Khám phá Phú Quốc với PhoGroup - Du lịch, Nghỉ dưỡng, Ẩm thực"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Từ khóa SEO</label>
                                    <input
                                        type="text"
                                        defaultValue="Phú Quốc, du lịch, villa, seafood, tour"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* System Settings */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Cài đặt hệ thống</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Múi giờ</label>
                                    <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                        <option value="Asia/Ho_Chi_Minh">UTC+7 (Việt Nam)</option>
                                        <option value="Asia/Bangkok">UTC+7 (Bangkok)</option>
                                        <option value="UTC">UTC+0 (GMT)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ mặc định</label>
                                    <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                        <option value="vi">Tiếng Việt</option>
                                        <option value="en">English</option>
                                        <option value="ko">한국어</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tiền tệ</label>
                                    <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                        <option value="VND">VND (₫)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Business Information */}
                {activeTab === 'business' && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Thông tin doanh nghiệp</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Company Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</label>
                                    <input
                                        type="text"
                                        defaultValue="PhoGroup Vietnam Co., Ltd"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã số thuế</label>
                                    <input
                                        type="text"
                                        defaultValue="0123456789"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                                    <textarea
                                        rows={3}
                                        defaultValue="123 Trần Hưng Đạo, Dương Đông, Phú Quốc, Kiên Giang, Việt Nam"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email liên hệ</label>
                                    <input
                                        type="email"
                                        defaultValue="info@phogroup.vn"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        defaultValue="+84 297 123 4567"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                    <input
                                        type="url"
                                        defaultValue="https://phogroup.vn"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Cài đặt thông báo</h2>
                        
                        <div className="space-y-6">
                            {/* Email Notifications */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-4">Thông báo Email</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'new_order', label: 'Đơn hàng mới', description: 'Nhận thông báo khi có đơn hàng mới' },
                                        { id: 'booking_confirm', label: 'Xác nhận booking', description: 'Thông báo khi booking được xác nhận' },
                                        { id: 'payment_received', label: 'Thanh toán', description: 'Thông báo khi nhận được thanh toán' },
                                        { id: 'review_posted', label: 'Đánh giá mới', description: 'Thông báo khi có đánh giá mới' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                            <div>
                                                <div className="font-medium text-gray-900">{item.label}</div>
                                                <div className="text-sm text-gray-600">{item.description}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SMS Notifications */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-4">Thông báo SMS</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'urgent_booking', label: 'Booking khẩn cấp', description: 'SMS cho booking trong ngày' },
                                        { id: 'payment_reminder', label: 'Nhắc nhở thanh toán', description: 'SMS nhắc khách thanh toán' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                            <div>
                                                <div className="font-medium text-gray-900">{item.label}</div>
                                                <div className="text-sm text-gray-600">{item.description}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Bảo mật</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Password Settings */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Cài đặt mật khẩu</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 transition-colors">
                                    Đổi mật khẩu
                                </button>
                            </div>

                            {/* Two-Factor Authentication */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Xác thực 2 bước</h3>
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">🔐</span>
                                        <div>
                                            <div className="font-medium text-yellow-800">Chưa kích hoạt</div>
                                            <div className="text-sm text-yellow-600">Tăng cường bảo mật tài khoản</div>
                                        </div>
                                    </div>
                                    <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                                        Kích hoạt 2FA
                                    </button>
                                </div>

                                {/* Login History */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Lịch sử đăng nhập gần đây</h4>
                                    <div className="space-y-2">
                                        {[
                                            { time: '2 phút trước', location: 'Phú Quốc, VN', device: 'Chrome on Windows' },
                                            { time: '1 giờ trước', location: 'Phú Quốc, VN', device: 'Mobile Safari' },
                                            { time: '1 ngày trước', location: 'TP.HCM, VN', device: 'Chrome on Mac' },
                                        ].map((login, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                                                <div>
                                                    <div className="font-medium text-gray-900">{login.device}</div>
                                                    <div className="text-gray-600">{login.location}</div>
                                                </div>
                                                <div className="text-gray-500">{login.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Integrations */}
                {activeTab === 'integrations' && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Tích hợp bên thứ 3</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Analytics */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900 mb-4">Analytics & Tracking</h3>
                                
                                {/* Google Analytics */}
                                <div className="p-4 border border-gray-200 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📊</span>
                                            <div>
                                                <div className="font-medium">Google Analytics</div>
                                                <div className="text-sm text-gray-600">Web analytics platform</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Kết nối</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="GA-XXXXXXXXX-X"
                                        defaultValue="GA-123456789-1"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Facebook Pixel */}
                                <div className="p-4 border border-gray-200 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📱</span>
                                            <div>
                                                <div className="font-medium">Facebook Pixel</div>
                                                <div className="text-sm text-gray-600">Facebook advertising tracking</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Chưa kết nối</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Pixel ID"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Payment & E-commerce */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900 mb-4">Thanh toán & E-commerce</h3>
                                
                                {/* Shopee */}
                                <div className="p-4 border border-gray-200 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🛍️</span>
                                            <div>
                                                <div className="font-medium">Shopee</div>
                                                <div className="text-sm text-gray-600">E-commerce platform</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Kết nối</span>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Shop ID"
                                            defaultValue="phogroup_official"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <input
                                            type="password"
                                            placeholder="API Key"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* VNPay */}
                                <div className="p-4 border border-gray-200 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">💳</span>
                                            <div>
                                                <div className="font-medium">VNPay</div>
                                                <div className="text-sm text-gray-600">Payment gateway</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Chưa kết nối</span>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Merchant ID"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Secret Key"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Backup */}
                {activeTab === 'backup' && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Sao lưu & Khôi phục</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Auto Backup */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Sao lưu tự động</h3>
                                
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <div className="font-medium text-green-800">Đã kích hoạt</div>
                                            <div className="text-sm text-green-600">Sao lưu hàng ngày lúc 2:00 AM</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tần suất sao lưu</label>
                                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                            <option value="daily">Hàng ngày</option>
                                            <option value="weekly">Hàng tuần</option>
                                            <option value="monthly">Hàng tháng</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Số bản sao lưu giữ lại</label>
                                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                            <option value="7">7 bản</option>
                                            <option value="14">14 bản</option>
                                            <option value="30">30 bản</option>
                                        </select>
                                    </div>
                                </div>

                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-colors">
                                    Sao lưu ngay
                                </button>
                            </div>

                            {/* Backup History */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Lịch sử sao lưu</h3>
                                
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {[
                                        { date: '2024-01-15 02:00', size: '245 MB', status: 'success' },
                                        { date: '2024-01-14 02:00', size: '242 MB', status: 'success' },
                                        { date: '2024-01-13 02:00', size: '238 MB', status: 'success' },
                                        { date: '2024-01-12 02:00', size: '235 MB', status: 'failed' },
                                        { date: '2024-01-11 02:00', size: '232 MB', status: 'success' },
                                    ].map((backup, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-900">{backup.date}</div>
                                                <div className="text-sm text-gray-600">{backup.size}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    backup.status === 'success' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {backup.status === 'success' ? 'Thành công' : 'Thất bại'}
                                                </span>
                                                {backup.status === 'success' && (
                                                    <button className="p-1 text-gray-400 hover:text-gray-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu cài đặt'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
