'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'
import { SPOTS, SATELLITE_ISLANDS, TRIPS } from '../../data/explore'
import { Button } from '../../components/common/Button'
import { Compass, Anchor, Calendar, ShieldCheck, Sun, MessageCircle } from 'lucide-react'

export default function ExplorePage() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [activeTripKey, setActiveTripKey] = useState<'d2' | 'd3'>('d2')
  const currentTrip = TRIPS[activeTripKey]

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-14 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-end overflow-hidden bg-[#0F2D52] pt-20">
        <ImageSlot
          id="ndh-explore-hero"
          placeholder="Vịnh Nam Du"
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-[#0F2D52]/60 to-black/40 pointer-events-none" />
        
        <div className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C6A86A]" />
            <span>{t('21 hòn đảo · 9,12 km² · Vịnh Thái Lan', '21 Islands · 9.12 km² · Gulf of Thailand')}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl leading-tight">
            {t(
              'Khám phá Nam Du — Lịch trình 2 & 3 ngày trọn vẹn nhất',
              'Explore Nam Du — Complete 2 & 3 Day Curated Itineraries'
            )}
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            {t(
              'Những trải nghiệm thực tế được tổng hợp từ khách hàng resort. Hỗ trợ trọn gói xe máy, tàu gỗ thăm đảo và tiệc hải sản BBQ.',
              'Curated experiences tried and loved by our resort guests. Complete assistance with island boats, scooters, and seafood BBQs.'
            )}
          </p>
        </div>
      </section>

      {/* Floating Quick Stats Bar */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] p-5 sm:p-6 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#C6A86A] uppercase tracking-wider block">
              {t('Mùa đẹp nhất', 'Best Season')}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              {t('Tháng 12 – Tháng 3', 'December – March')}
            </div>
            <div className="text-[#6B7280]">
              {t('Biển êm, nước trong xanh, nắng nhẹ', 'Calm turquoise sea & mild weather')}
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-[#ECECEC] sm:pl-6">
            <span className="text-[10px] font-bold text-[#C6A86A] uppercase tracking-wider block">
              {t('Đỉnh cao nhất', 'Highest Peak')}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              309 m {t('(Hải đăng Nam Du)', '(Lighthouse)')}
            </div>
            <div className="text-[#6B7280]">
              {t('Toạ độ ngắm toàn cảnh các hòn đảo', 'Panoramic viewpoint on Hon Lon')}
            </div>
          </div>

          <div className="space-y-1 lg:border-l lg:border-[#ECECEC] lg:pl-6">
            <span className="text-[10px] font-bold text-[#C6A86A] uppercase tracking-wider block">
              {t('Cách di chuyển', 'Getting Here')}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              {t('Rạch Giá → 2.5 giờ tàu', 'Rach Gia → 2.5h Speedboat')}
            </div>
            <div className="text-[#6B7280]">
              {t('Đón bến tàu Củ Tron miễn phí', 'Free pier pickup at Cu Tron')}
            </div>
          </div>

          <div className="space-y-1 lg:border-l lg:border-[#ECECEC] lg:pl-6">
            <span className="text-[10px] font-bold text-[#C6A86A] uppercase tracking-wider block">
              {t('Cần chuẩn bị', 'Must Bring')}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              {t('CCCD & Tiền mặt', 'ID Card & Cash')}
            </div>
            <div className="text-[#6B7280]">
              {t('Kiểm tra vùng biên giới & cây ATM rất ít', 'Border check & limited ATMs')}
            </div>
          </div>
        </div>
      </section>

      {/* 6 Spots on Hon Lon ("Trên Hòn Lớn") */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
              <Compass className="w-4 h-4 text-[#1D4E89]" />
              <span>{t('Trên Hòn Lớn (Đảo Chính)', 'Hon Lon Main Island')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D52]">
              {t('Cung đường ven biển 11km & Các điểm dừng chân', '11km Coastal Loop & Highlights')}
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] max-w-md">
            {t(
              'Thuê xe máy 120.000–150.000đ/ngày. Chạy hết vòng mất một buổi sáng nếu dừng thăm thú chụp ảnh.',
              'Scooter rental 120,000–150,000 VND/day. Takes a morning to loop with scenic stops.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPOTS.map((s) => (
            <article
              key={s.id}
              className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col"
            >
              <div className="relative h-48 bg-[#F5F7FA] overflow-hidden">
                <ImageSlot
                  id={`ndh-spot-${s.id}`}
                  placeholder={isEn ? s.nameEn : s.nameVi}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-[#ECECEC] text-[#0F2D52] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {isEn ? s.distEn : s.distVi}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-[#0F2D52] group-hover:text-[#1D4E89] transition">
                    {isEn ? s.nameEn : s.nameVi}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {isEn ? s.textEn : s.textVi}
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-[#1D4E89] pt-2 border-t border-[#ECECEC] flex items-center justify-between">
                  <span>💡 {isEn ? s.tipEn : s.tipVi}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4 Satellite Islands Section ("Cụm đảo vệ tinh") */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
              <Anchor className="w-4 h-4 text-[#1D4E89]" />
              <span>{t('Cụm Đảo Vệ Tinh Hoang Sơ', 'Satellite Islands')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D52]">
              {t('Tàu gỗ lặn ngắm san hô & Thăm 4 hòn đảo', 'Wooden Boat Tour & Coral Snorkeling')}
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] max-w-md">
            {t(
              '200.000–400.000đ/người tour ghép hoặc thuê trọn chuyến tàu riêng. Đặt trước qua lễ tân resort.',
              '200,000–400,000 VND per person for island boat tours booked via reception.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SATELLITE_ISLANDS.map((i) => (
            <article
              key={i.id}
              className="relative min-h-[320px] rounded-[12px] overflow-hidden bg-[#0F2D52] flex items-end p-5 shadow-xs group"
            >
              <ImageSlot
                id={`ndh-island-${i.id}`}
                placeholder={isEn ? i.nameEn : i.nameVi}
                style={{ position: 'absolute', inset: 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-[#0F2D52]/40 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-1.5 text-white">
                <span className="inline-block text-[10px] font-bold text-[#C6A86A] bg-[#0F2D52]/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#C6A86A]/30">
                  {isEn ? i.badgeEn : i.badgeVi}
                </span>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C6A86A] transition">
                  {isEn ? i.nameEn : i.nameVi}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  {isEn ? i.textEn : i.textVi}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Suggested Itineraries & Cost Estimator Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECECEC] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
                <Calendar className="w-4 h-4 text-[#1D4E89]" />
                <span>{t('Gợi Ý Lịch Trình', 'Suggested Itineraries')}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2D52]">
                {t('Lịch trình chi tiết 2 ngày 1 đêm & 3 ngày 2 đêm', 'Detailed 2D1N & 3D2N Itinerary')}
              </h2>
            </div>

            {/* Tab Selector */}
            <div className="inline-flex p-1 rounded-[8px] bg-[#F8F9FA] border border-[#ECECEC]">
              {(['d2', 'd3'] as const).map((k) => {
                const active = activeTripKey === k
                const plan = TRIPS[k]
                return (
                  <button
                    key={k}
                    onClick={() => setActiveTripKey(k)}
                    className={`px-4 py-2 text-xs font-bold rounded-[6px] transition ${
                      active
                        ? 'bg-[#1D4E89] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {isEn ? plan?.nameEn : plan?.nameVi}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {currentTrip?.legs.map((l, i) => (
                <div key={i} className="flex items-start gap-4 p-3.5 rounded-[8px] bg-[#F8F9FA] border border-[#ECECEC] text-xs">
                  <div className="w-24 shrink-0 space-y-0.5 border-r border-[#ECECEC] pr-3">
                    <span className="text-[10px] font-bold text-[#1D4E89] block">{isEn ? l.dayEn : l.dayVi}</span>
                    <span className="font-mono font-bold text-[#0F2D52] block">{l.time}</span>
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="font-bold text-[#0F2D52] text-xs">{isEn ? l.titleEn : l.titleVi}</h4>
                    <p className="text-[#4B5563] text-[11px] leading-relaxed">{isEn ? l.textEn : l.textVi}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Estimator & Zalo Action Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-[#ECECEC] rounded-[10px] p-5 space-y-3 text-xs bg-white">
                <h3 className="font-serif font-bold text-[#0F2D52] border-b border-[#ECECEC] pb-2 text-sm">
                  {t('Dự toán chi phí / khách', 'Estimated Cost per Guest')}
                </h3>
                {currentTrip?.costs.map((c, idx) => (
                  <div key={idx} className="flex justify-between text-[#4B5563]">
                    <span>{isEn ? c.labelEn : c.labelVi}</span>
                    <span className="font-semibold text-[#1A1A1A]">{c.val}</span>
                  </div>
                ))}
                <div className="border-t border-[#ECECEC] pt-2 flex justify-between font-bold text-[#0F2D52] text-sm">
                  <span>{t('Tổng dự toán:', 'Total Estimate:')}</span>
                  <span className="text-[#1D4E89]">{currentTrip?.total}</span>
                </div>
              </div>

              {/* Zalo Action */}
              <div className="bg-[#0F2D52] text-white rounded-[10px] p-5 space-y-3">
                <h4 className="font-serif text-base font-bold text-white">
                  {t('Chúng tôi hỗ trợ trọn gói', 'We Arrange Everything')}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {t(
                    'Đặt trước tàu gỗ đi đảo, vé tàu cao tốc khứ hồi, thuê xe máy và đặt tiệc nướng BBQ ngay tại resort.',
                    'Book island boats, speedboat tickets, scooters, and seafood BBQs directly with reception.'
                  )}
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <a href="https://zalo.me/0985000650" target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="md" radius="6px" className="w-full bg-[#0068FF] hover:bg-[#0052cc]">
                      <MessageCircle className="w-4 h-4 mr-1.5" />
                      {t('Tư vấn lịch trình qua Zalo', 'Consult on Zalo')}
                    </Button>
                  </a>
                  <Link href="/rooms">
                    <Button variant="outline" size="md" radius="6px" className="w-full border-white/30 text-white hover:bg-white/10">
                      {t('Đặt phòng trước', 'Pick a Room First')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Advice Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2D52] border-b border-[#ECECEC] pb-3">
            {t('Kinh nghiệm lưu ý khi du lịch Nam Du', 'Essential Tips Before Visiting Nam Du')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <h3 className="font-bold text-[#0F2D52] text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1D4E89]" />
                <span>{t('Đặt vé tàu trước 2–4 tuần', 'Book Speedboat Early')}</span>
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {t(
                  'Vào mùa cao điểm (tháng 12 đến tháng 3), vé tàu cao tốc khứ hồi Rạch Giá - Nam Du thường hết sớm.',
                  'During peak season (Dec to Mar), return tickets sell out fast. Book both room & boat early.'
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-[#0F2D52] text-sm flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#1D4E89]" />
                <span>{t('Theo dõi thời tiết & Gió biển', 'Check Sea Weather')}</span>
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {t(
                  'Khi gió trên cấp 6 tàu cao tốc sẽ ngừng chạy. Resort cam kết hoàn 100% cọc nếu tàu hoãn do thời tiết.',
                  'Speedboats stop when wind exceeds force 6. We offer 100% deposit refunds for weather cancellations.'
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-[#0F2D52] text-sm flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-[#1D4E89]" />
                <span>{t('Bảo vệ môi trường san hô', 'Protect Coral Reefs')}</span>
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {t(
                  'Tuyệt đối không bẻ hoặc giẫm đạp lên rạn san hô khi lặn biển. Mang theo rác về đất liền.',
                  'Never break or stand on coral reefs while snorkeling. Keep Nam Du clean and pristine.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
