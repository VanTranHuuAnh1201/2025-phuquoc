'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const publicPages = ['/login']
    const isPublicPage = publicPages.some(page => pathname.endsWith(page))

    if (isPublicPage) {
        return <>{children}</>
    }
    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
        { name: 'Quản lý PhoFood', href: '/admin/pho-food', icon: '🐟' },
        { name: 'Quản lý Villa', href: '/admin/pho-retreat', icon: '🏖️' },
        { name: 'Quản lý Tour', href: '/admin/pho-travel', icon: '✈️' },
        { name: 'Quản lý Blog', href: '/admin/blog', icon: '📝' },
        { name: 'Đơn hàng', href: '/admin/orders', icon: '📦' },
        { name: 'Khách hàng', href: '/admin/customers', icon: '👥' },
        { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
        { name: 'Cài đặt', href: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar - Mobile optimized */}
            <div className={`fixed inset-y-0 left-0 w-64 sm:w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>                {/* Logo - Mobile optimized */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white font-bold text-sm sm:text-base">
                            Pho
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm sm:text-base">Admin Panel</div>
                            <div className="text-xs text-gray-500 hidden sm:block">PhoGroup Management</div>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>                {/* Navigation - Mobile optimized */}
                <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors ${isActive
                                    ? 'bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 border-l-2 sm:border-l-4 border-orange-500'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className="text-base sm:text-lg">{item.icon}</span>
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 grid place-items-center text-white font-bold">
                            A
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">Admin User</div>
                            <div className="text-xs text-gray-500">admin@phogroup.vn</div>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 mt-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span>🌐</span>
                        <span>Xem website</span>
                    </Link>
                </div>
            </div>
            {/* Main content */}
            <div className="w-full">
                {/* Top bar - Mobile optimized */}
                <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">PhoGroup Admin</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-2-2V9a6 6 0 00-12 0v6l-2 2h14z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile dropdown */}
                            <Link
                                href="/admin/profile"
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 grid place-items-center text-white text-sm font-bold">
                                    A
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>
                {/* Page content - Mobile optimized */}
                <main className="p-3 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
