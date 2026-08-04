'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'
import { MapPin, Sparkles, Send, ExternalLink } from 'lucide-react'

export function ContactCtaSection() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* 1. Special Offer Promo Banner */}
        <div>
          <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
            {t('KHUYẾN MÃI ĐẶC QUYỀN', 'EXCLUSIVE PROMOTION')}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight mb-4">
            {t('Ưu đãi đặc biệt', 'Special Offers')}
          </h2>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B192C] via-[#0F2D52] to-[#1D4E89] text-white p-8 sm:p-10 shadow-[0_20px_50px_rgba(11,25,44,0.25)] border border-amber-400/30">
            {/* Background Decorative Graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FFB800] via-blue-400 to-transparent" />
            
            <div className="relative z-10 max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#FFB800]/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#FFB800] border border-[#FFB800]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>{t('ƯU ĐÃI MÙA HÈ', 'SUMMER SPECIAL')}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
                {t('Giảm đến 20% cho đặt phòng sớm', 'Get up to 20% off early bookings')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
                {t('Đặt phòng trước 14 ngày để nhận ưu đãi đặc biệt cùng dịch vụ đưa đón bến tàu miễn phí 2 chiều.', 'Book 14 days in advance to enjoy exclusive discounts and free roundtrip pier transfer.')}
              </p>
              <div className="pt-2">
                <Link href="/rooms">
                  <Button variant="secondary" size="lg" radius="full" className="bg-[#FFB800] hover:bg-[#F59E0B] text-slate-950 font-extrabold text-xs sm:text-sm shadow-md px-7 border-none">
                    {t('Xem chi tiết ưu đãi →', 'View Promotion Details →')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Resort Location Map Box */}
        <div>
          <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
            {t('TÌM CHÚNG TÔI DỄ DÀNG', 'LOCATION & MAP')}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight mb-4">
            {t('Vị trí của chúng tôi', 'Our Location')}
          </h2>
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(11,25,44,0.15)] transition-all duration-300 grid grid-cols-1 md:grid-cols-3">
            {/* Map Preview Visual */}
            <div className="relative md:col-span-2 h-56 sm:h-72 bg-slate-200 overflow-hidden">
              <img
                src="/uploads/hero-2.jpg"
                alt="Bản đồ Nam Du"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <div className="bg-white p-3.5 rounded-full shadow-2xl animate-bounce">
                  <MapPin className="w-7 h-7 text-[#1D4E89]" />
                </div>
              </div>
            </div>

            {/* Location Info Box */}
            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6 bg-white">
              <div>
                <div className="flex items-center gap-2.5 text-[#0B192C] font-serif font-extrabold text-lg">
                  <MapPin className="w-5 h-5 text-[#1D4E89]" />
                  <span>The Nam Du Hill Resort</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed font-medium">
                  {t(
                    'Ấp Củ Tron, Đảo Nam Du, Huyện Kiên Hải, Tỉnh Kiên Giang, Việt Nam',
                    'Cu Tron Village, Nam Du Island, Kien Hai District, Kien Giang Province, Vietnam'
                  )}
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=The+Nam+Du+Hill+Resort"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="md" fullWidth radius="full" className="border-[#1D4E89] text-[#1D4E89] hover:bg-[#F0F5FA] font-bold text-xs sm:text-sm">
                  <span className="flex items-center justify-center gap-2">
                    {t('Xem trên bản đồ Google Maps', 'View on Google Maps')}
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Newsletter Subscription Box */}
        <div>
          <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
            {t('TẬN HƯỞNG ĐẶC QUYỀN VIP', 'VIP PRIVILEGES')}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight mb-4">
            {t('Tham gia nhận ưu đãi độc quyền', 'Join for Exclusive Offers')}
          </h2>
          <div className="bg-[#FAFAF8] border border-slate-200/80 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-sm">
            <p className="text-xs sm:text-sm text-slate-600 mb-5 font-normal leading-relaxed">
              {t(
                'Nhận thông tin ưu đãi mới nhất và bí kíp du lịch Nam Du trực tiếp qua email của bạn.',
                'Get the latest resort promotions and travel tips directly in your email inbox.'
              )}
            </p>

            {subscribed ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold">
                ✓ {t('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin ưu đãi sớm nhất.', 'Thank you for subscribing!')}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder={t('Nhập email của bạn...', 'Enter your email address...')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-[48px] bg-white border border-slate-200 rounded-full px-5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1D4E89] focus:ring-2 focus:ring-[#1D4E89]/20 shadow-xs"
                />
                <Button type="submit" variant="primary" size="md" radius="full" className="bg-[#0F2D52] hover:bg-[#163B6C] text-white px-6 font-bold h-[48px] shadow-md">
                  <span className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                    <Send className="w-4 h-4" />
                    <span>{t('Đăng ký ngay', 'Subscribe Now')}</span>
                  </span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
