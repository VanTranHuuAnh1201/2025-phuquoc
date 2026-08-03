'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../../components/common/Button'
import { Phone, MapPin, Mail, Clock, Send, MessageCircle, Navigation, CheckCircle, ShieldCheck } from 'lucide-react'

export default function ContactPage() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-20 pb-20">
      {/* Hero / Header Section */}
      <section className="bg-white border-b border-[#ECECEC] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('Hỗ trợ tư vấn 24/7', '24/7 Reception Support')}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2D52] tracking-tight">
            {t('Liên hệ & Đặt phòng', 'Contact & Reservations')}
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl leading-relaxed">
            {t(
              'Gửi yêu cầu hoặc nhắn Zalo trực tiếp để nhận báo giá ưu đãi tốt nhất. Đặt phòng trực tiếp luôn cam kết đưa đón bến tàu miễn phí.',
              'Send a request or message on Zalo for the best rates. Direct bookings include free pier transfers.'
            )}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Booking Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#ECECEC] rounded-[12px] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0F2D52]">
                {t('Gửi yêu cầu đặt phòng nhanh', 'Quick Reservation Request')}
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                {t('Lễ tân resort sẽ liên hệ xác nhận trong vòng 15-30 phút.', 'Our receptionist will confirm your inquiry within 15-30 minutes.')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Họ và tên *', 'Full Name *')}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={t('Nhập họ và tên', 'Enter full name')}
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Số điện thoại (Zalo) *', 'Phone / Zalo Number *')}
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="0985 000 650"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#1A1A1A]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Ngày nhận phòng', 'Check-in Date')}
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Ngày trả phòng', 'Check-out Date')}
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Số lượng khách', 'Number of Guests')}
                  </label>
                  <select className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]">
                    <option>{t('2 khách', '2 guests')}</option>
                    <option>{t('3 khách', '3 guests')}</option>
                    <option>{t('4 khách', '4 guests')}</option>
                    <option>{t('6 khách', '6 guests')}</option>
                    <option>{t('8 khách trở lên', '8+ guests')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Hạng phòng quan tâm', 'Preferred Room')}
                  </label>
                  <select className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]">
                    <option>{t('Chưa quyết — cần tư vấn', 'Need recommendation')}</option>
                    <option>Deluxe Sea View</option>
                    <option>Rock Deluxe Sunset</option>
                    <option>Superior King Sea View</option>
                    <option>Family Suite 8 Guests</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#1A1A1A]">
                  {t('Ghi chú hoặc yêu cầu đặc biệt', 'Message or Special Requests')}
                </label>
                <textarea
                  rows={3}
                  placeholder={t('Ví dụ: Cần xe đón bến tàu lúc 10h, ăn chay...', 'e.g. Need pier pick-up at 10am, vegetarian...')}
                  className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89] resize-none"
                />
              </div>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-[8px] p-3 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('Yêu cầu đã được gửi! Lễ tân sẽ nhắn Zalo cho bạn ngay.', 'Request sent! Receptionist will message you on Zalo shortly.')}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  radius="6px"
                  className="flex-1 py-3"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  {t('Gửi yêu cầu tư vấn', 'Submit Request')}
                </Button>

                <a
                  href="https://zalo.me/0985000650"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    radius="6px"
                    className="w-full py-3 border-[#0068FF] text-[#0068FF] hover:bg-[#0068FF]/5"
                  >
                    <MessageCircle className="w-4 h-4 mr-1.5 text-[#0068FF]" />
                    {t('Nhắn Zalo ngay', 'Message on Zalo')}
                  </Button>
                </a>
              </div>
            </form>
          </div>

          {/* Right Column: Resort Contact Info & Direct Transfer Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Contact Card */}
            <div className="bg-[#0F2D52] text-white rounded-[12px] p-6 space-y-5 shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#C6A86A] uppercase tracking-wider">
                  {t('Hotline Đặt phòng', 'Reservation Hotline')}
                </span>
                <a
                  href="tel:0985000650"
                  className="block font-serif text-3xl font-bold text-white hover:text-[#C6A86A] transition tracking-tight"
                >
                  0985 000 650
                </a>
                <p className="text-xs text-white/70">
                  {t('Zalo / WhatsApp cùng số · Hỗ trợ 24/7', 'Zalo / WhatsApp available · 24/7 Service')}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C6A86A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{t('Địa chỉ Resort:', 'Resort Address:')}</span>
                    <span className="text-white/80 leading-relaxed">
                      {t('Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam', 'Cu Tron Hamlet, Kien Hai Special Zone, An Giang Province, Vietnam')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C6A86A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Email:</span>
                    <a href="mailto:thenamduhill@gmail.com" className="text-white/80 hover:text-white transition">
                      thenamduhill@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C6A86A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{t('Giờ đón khách:', 'Reception Hours:')}</span>
                    <span className="text-white/80">
                      {t('Check-in 14:00 · Check-out 12:00 (Lễ tân 24/7)', 'Check-in 14:00 · Check-out 12:00 (24/7 Desk)')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Guide Card */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-5 space-y-3 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#0F2D52] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#1D4E89]" />
                <span>{t('Hướng dẫn di chuyển đến Nam Du', 'Getting to Nam Du Island')}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block">{t('TP.HCM → Rạch Giá', 'HCMC → Rach Gia')}</span>
                    <span className="text-[#6B7280]">{t('Xe giường nằm đêm, khoảng 7 tiếng (210k–250k).', 'Overnight sleeper coach, approx. 7 hours.')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] text-[10px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block">{t('Rạch Giá → Bến Củ Tron', 'Rach Gia → Cu Tron Pier')}</span>
                    <span className="text-[#6B7280]">{t('Tàu cao tốc (Superdong, Phú Quốc Express), 2.5 tiếng.', 'Speedboat (Superdong, Phu Quoc Express), 2.5 hours.')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-emerald-800 block">{t('Bến tàu → The Nam Du Hill', 'Pier → The Nam Du Hill')}</span>
                    <span className="text-emerald-700 font-medium">{t('Xe riêng resort đón tận bến tàu (Miễn phí 2 chiều).', 'Resort car picks you up at pier (Free 2-way).')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs relative">
          <div className="h-[360px] w-full bg-[#E5E7EB] relative">
            <iframe
              title="Bản đồ The Nam Du Hill"
              src="https://www.openstreetmap.org/export/embed.html?bbox=104.28%2C9.64%2C104.42%2C9.72&amp;layer=mapnik&amp;marker=9.6835%2C104.3595"
              className="w-full h-full border-0"
              loading="lazy"
            />
            
            {/* Floating Location Card */}
            <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-md border border-[#ECECEC] rounded-[10px] p-4 shadow-lg max-w-[300px] text-xs space-y-1.5">
              <h4 className="font-serif font-bold text-[#0F2D52] text-sm">THE NAM DU HILL RESORT</h4>
              <p className="text-[#6B7280]">{t('Ấp Củ Tron, Kiên Hải, Kiên Giang', 'Cu Tron Hamlet, Kien Hai, Kien Giang')}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&amp;query=THE+NAM+DU+HILL+resort+Nam+Du"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#1D4E89] font-semibold hover:underline pt-1"
              >
                {t('Xem trên Google Maps →', 'Open in Google Maps →')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
