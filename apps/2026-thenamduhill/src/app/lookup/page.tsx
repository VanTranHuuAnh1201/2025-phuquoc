'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Booking } from '@repo/core'
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
}
function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
}

export default function LookupPage() {
    const [bookingCode, setBookingCode] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<Booking | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setResult(null)

        if (!bookingCode.trim() || !phone.trim()) {
            setError('Vui lòng nhập cả Mã đơn hàng và Số điện thoại.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/bookings?code=${encodeURIComponent(bookingCode.trim())}&phone=${encodeURIComponent(phone.trim())}`)
            // Hợp đồng API (luật BE1): { success, data, error }. `data` là Booking[] khi tra bằng mã + SĐT.
            const data: { success: boolean; data: Booking[] | Booking | null } = await res.json()

            if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
                setResult(data.data[0] ?? null)
            } else if (res.ok && data.data && !Array.isArray(data.data)) {
                setResult(data.data)
            } else {
                setError('Không tìm thấy đơn hàng phù hợp với thông tin đã nhập.')
            }
        } catch {
            setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/" className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-100">Tra cứu Đơn đặt phòng</h1>
                        <p className="text-xs text-slate-400">The Nam Du Hill Resort & Retreat</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Mã đơn hàng (VD: ĐH-2026-XXXX)</label>
                        <input
                            type="text"
                            value={bookingCode}
                            onChange={(e) => setBookingCode(e.target.value)}
                            placeholder="Nhập mã đơn hàng..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Số điện thoại đặt phòng</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Nhập số điện thoại..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        <SearchIcon className="w-4 h-4" />
                        {loading ? 'Đang tra cứu...' : 'Tra cứu ngay'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-6 p-5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <span className="text-xs text-slate-400">Mã đơn: </span>
                                <span className="font-mono font-bold text-amber-400">{result.code}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {result.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2 text-slate-300">
                                <UserIcon className="w-4 h-4 text-slate-400" />
                                <span>Khách: <strong>{result.guest?.fullName || 'Khách đặt'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <BuildingIcon className="w-4 h-4 text-slate-400" />
                                <span>Hạng phòng ID: <strong>{result.roomTypeId || 'Tiêu chuẩn'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <CalendarIcon className="w-4 h-4 text-slate-400" />
                                <span>Check-in: <strong>{result.checkIn}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <CreditCardIcon className="w-4 h-4 text-slate-400" />
                                <span>Tổng tiền: <strong className="text-amber-400">{new Intl.NumberFormat('vi-VN').format(result.totalAmount || 0)}đ</strong></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
