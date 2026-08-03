'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'
import { DINING_MENU } from '../../data/dining'
import { Button } from '../../components/common/Button'
import { Utensils, Coffee, Flame, MessageCircle, Clock, CheckCircle } from 'lucide-react'

export default function DiningPage() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [activeTab, setActiveTab] = useState<'coffee' | 'tea' | 'hot'>('coffee')
  const currentCategory = DINING_MENU[activeTab]

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-14 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-end overflow-hidden bg-[#0F2D52] pt-20">
        <ImageSlot
          id="ndh-dining-hero"
          placeholder="Nhà hàng đỉnh đồi nhìn ra biển"
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-[#0F2D52]/60 to-black/40 pointer-events-none" />

        <div className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
            <Utensils className="w-3.5 h-3.5 text-[#C6A86A]" />
            <span>{t('Ẩm thực biển đảo trên đỉnh đồi', 'Hilltop Oceanfront Dining')}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl leading-tight">
            {t(
              'Ẩm thực hải sản Nam Du — Tươi ngon, đậm đà bản vị',
              'Nam Du Seafood Dining — Fresh, Plain, Unmistakably Local'
            )}
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            {t(
              'Hải sản tươi mua trực tiếp từ ngư dân Nam Du trong ngày. Bữa sáng miễn phí, cà phê ngắm bình minh và tiệc nướng BBQ ngoài trời.',
              'Seafood landed daily by Nam Du fishermen. Complimentary breakfast, sunrise coffee, and outdoor seafood BBQs.'
            )}
          </p>
        </div>
      </section>

      {/* 3 Venue Cards Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Venue 1: Hilltop Restaurant */}
          <article className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group">
            <div className="relative h-48 bg-[#F5F7FA] overflow-hidden">
              <ImageSlot
                id="ndh-dining-restaurant"
                placeholder="Hilltop Restaurant — bàn ăn nhìn ra biển"
                style={{ position: 'absolute', inset: 0 }}
              />
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#0F2D52] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#ECECEC]">
                {t('CẢ NGÀY · 06:30 – 21:30', 'ALL DAY · 06:30 – 21:30')}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#0F2D52] group-hover:text-[#1D4E89] transition">
                  Hilltop Restaurant
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {t(
                    'Không gian nhà hàng nhìn thẳng xuống biển ngọc Hòn Lớn. Thưởng thức hải sản tươi nướng sa tế, lẩu cá bớp và các món ăn đậm vị miền Tây.',
                    'Dining room with panoramic sea views of Hon Lon. Enjoy fresh grilled seafood, cobia hotpot, and Southern specialties.'
                  )}
                </p>
              </div>

              <a href="https://zalo.me/0985000650" target="_blank" rel="noopener noreferrer" className="pt-2">
                <Button variant="outline" size="sm" radius="6px" className="w-full">
                  <MessageCircle className="w-3.5 h-3.5 mr-1 text-[#0068FF]" />
                  {t('Đặt bàn qua Zalo', 'Reserve Table on Zalo')}
                </Button>
              </a>
            </div>
          </article>

          {/* Venue 2: Sunset Café & Bar */}
          <article className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group">
            <div className="relative h-48 bg-[#F5F7FA] overflow-hidden">
              <ImageSlot
                id="ndh-dining-bar"
                placeholder="Sunset Café & Bar trên nóc đồi"
                style={{ position: 'absolute', inset: 0 }}
              />
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#ECECEC]">
                {t('06:00 – ĐẾN KHUYA', '06:00 – LATE')}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#0F2D52] group-hover:text-[#1D4E89] transition">
                  Sunset Café & Bar
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {t(
                    'Nằm tại tầng cao nhất của resort. Phục vụ cà phê phin ngắm bình minh và cocktail nhiệt đới đón hoàng hôn ngả xuống các đảo.',
                    'Located on the top deck. Serving drip coffee at sunrise and tropical cocktails as the sun sets over the islands.'
                  )}
                </p>
              </div>

              <a href="#menu" className="pt-2">
                <Button variant="outline" size="sm" radius="6px" className="w-full">
                  <Coffee className="w-3.5 h-3.5 mr-1 text-[#1D4E89]" />
                  {t('Xem Menu Đồ Uống', 'View Drinks Menu')}
                </Button>
              </a>
            </div>
          </article>

          {/* Venue 3: Outdoor BBQ & Karaoke */}
          <article className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group">
            <div className="relative h-48 bg-[#F5F7FA] overflow-hidden">
              <ImageSlot
                id="ndh-dining-bbq"
                placeholder="Tiệc BBQ hải sản ngoài trời buổi tối"
                style={{ position: 'absolute', inset: 0 }}
              />
              <span className="absolute top-3 left-3 bg-[#C6A86A] text-[#0F2D52] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                300.000đ / BÀN
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#0F2D52] group-hover:text-[#1D4E89] transition">
                  Outdoor BBQ & Karaoke
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {t(
                    'Tự nướng hải sản dưới trời sao đỉnh đồi, chuẩn bị sẵn bếp nướng, than hồng và dàn karaoke giải trí cho gia đình.',
                    'Grill fresh catch under the stars with coals, setup, sauces, and a outdoor karaoke rig for families.'
                  )}
                </p>
              </div>

              <a href="#bbq" className="pt-2">
                <Button variant="primary" size="sm" radius="6px" className="w-full">
                  <Flame className="w-3.5 h-3.5 mr-1" />
                  {t('Xem Giá Tiệc BBQ', 'BBQ Pricing')}
                </Button>
              </a>
            </div>
          </article>

        </div>
      </section>

      {/* Signature Dishes Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
            <Utensils className="w-4 h-4 text-[#1D4E89]" />
            <span>{t('Hải Sản Tươi Sống Trong Ngày', 'Fresh Daily Catch')}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D52]">
            {t('Những Món Đặc Trưng Không Thể Bỏ Qua', 'Signature Island Specialties')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Main Dish (2x2) */}
          <div className="md:col-span-2 md:row-span-2 relative min-h-[300px] md:min-h-[420px] rounded-[12px] overflow-hidden bg-[#0F2D52] flex items-end p-6 shadow-xs group">
            <ImageSlot
              id="ndh-dish-goica"
              placeholder="Gỏi cá trích Nam Du"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-[#0F2D52]/40 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-1.5 text-white">
              <span className="inline-block text-[10px] font-bold text-[#C6A86A] bg-[#0F2D52]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#C6A86A]/30">
                {t('Món Đặc Sản Số 1', 'Top Specialty')}
              </span>
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#C6A86A] transition">
                Gỏi Cá Trích Nam Du
              </h3>
              <p className="text-xs text-white/80 leading-relaxed max-w-md">
                {t('Cá trích tươi cuốn bánh tráng với rau rừng bản địa, dừa nạo và nước chấm đậu phộng gia truyền.', 'Fresh herring rolled in rice paper with wild island herbs, grated coconut and traditional peanut dip.')}
              </p>
            </div>
          </div>

          {/* Dish 2 */}
          <div className="relative min-h-[200px] rounded-[12px] overflow-hidden bg-[#0F2D52] flex items-end p-4 shadow-xs group">
            <ImageSlot
              id="ndh-dish-chao"
              placeholder="Cháo cá đập đập"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-white space-y-0.5">
              <h4 className="font-bold text-sm text-white group-hover:text-[#C6A86A] transition">Cháo Cá Đập Đập</h4>
              <p className="text-[11px] text-white/80">{t('Đậm đà hương vị miền Tây', 'Rich Mekong style porridge')}</p>
            </div>
          </div>

          {/* Dish 3 */}
          <div className="relative min-h-[200px] rounded-[12px] overflow-hidden bg-[#0F2D52] flex items-end p-4 shadow-xs group">
            <ImageSlot
              id="ndh-dish-lau"
              placeholder="Lẩu hải sản chua cay"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-white space-y-0.5">
              <h4 className="font-bold text-sm text-white group-hover:text-[#C6A86A] transition">Lẩu Hải Sản Chua Cay</h4>
              <p className="text-[11px] text-white/80">{t('Nồi lẩu nóng hổi cho 2–4 người', 'Hotpot for 2–4 guests')}</p>
            </div>
          </div>

          {/* Dish 4 */}
          <div className="relative min-h-[200px] rounded-[12px] overflow-hidden bg-[#0F2D52] flex items-end p-4 shadow-xs group">
            <ImageSlot
              id="ndh-dish-nuong"
              placeholder="Hải sản nướng sa tế"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-white space-y-0.5">
              <h4 className="font-bold text-sm text-white group-hover:text-[#C6A86A] transition">Hải Sản Nướng Sa Tế</h4>
              <p className="text-[11px] text-white/80">{t('Ghẹ, tôm hùm, ốc vú nàng, mực trứng', 'Crabs, lobster, squid, snails')}</p>
            </div>
          </div>

          {/* 100% Quality Box */}
          <div className="bg-[#0F2D52] text-white rounded-[12px] p-5 flex flex-col justify-between space-y-3 border border-[#C6A86A]/20">
            <span className="font-serif text-3xl font-bold text-[#C6A86A]">100%</span>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">{t('Đánh Bắt Trong Ngày', 'Landed Same Day')}</h4>
              <p className="text-[11px] text-white/70 leading-relaxed">
                {t('Mua trực tiếp tại bến tàu Nam Du — không đông lạnh.', 'Bought straight from local fishermen — never frozen.')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Full Drinks Menu (#menu) */}
      <section id="menu" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECECEC] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
                <Coffee className="w-4 h-4 text-[#1D4E89]" />
                <span>Sunset Café & Bar</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2D52]">
                {t('Menu Đồ Uống Trên Đỉnh Đồi', 'Top Deck Drinks Menu')}
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="inline-flex p-1 rounded-[8px] bg-[#F8F9FA] border border-[#ECECEC]">
              {(['coffee', 'tea', 'hot'] as const).map((key) => {
                const active = activeTab === key
                const cat = DINING_MENU[key]
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-[6px] transition ${
                      active
                        ? 'bg-[#1D4E89] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {isEn ? cat?.nameEn : cat?.nameVi}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Menu Items Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentCategory?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-[8px] bg-[#F8F9FA] border border-[#ECECEC] text-xs hover:border-[#1D4E89]/30 transition"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#0F2D52]">{item.nameVi}</div>
                  <div className="text-[11px] text-[#6B7280] italic">{item.nameEn}</div>
                </div>
                <div className="font-mono font-bold text-[#1D4E89] text-sm shrink-0 ml-3">
                  {item.price}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BBQ & Karaoke Pricing Section (#bbq) */}
      <section id="bbq" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-[#0F2D52] text-white rounded-[12px] p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6A86A]/20 text-[#C6A86A] text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-[#C6A86A]" />
                <span>{t('Tiệc Nướng BBQ & Karaoke Ngoài Trời', 'Outdoor Seafood BBQ & Karaoke')}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                {t('Bạn Mua Hải Sản. Chúng Tôi Nhóm Than & Phục Vụ', 'Buy Your Catch. We Light Coals & Serve')}
              </h2>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {t(
                  'Gửi hải sản tươi mua tại bến tàu cho lễ tân. Buổi tối resort chuẩn bị sẵn bếp nướng than hồng, gia vị chấm và dàn âm thanh hát karaoke ngắm biển đêm.',
                  'Bring your pier seafood catch to reception. We prepare charcoal grills, dipping sauces, and a outdoor karaoke setup.'
                )}
              </p>

              <div className="pt-2">
                <a href="https://zalo.me/0985000650" target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="md" radius="6px" className="bg-[#0068FF] hover:bg-[#0052cc]">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    {t('Đặt bàn BBQ qua Zalo', 'Reserve BBQ Table on Zalo')}
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[10px] p-4 text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#C6A86A] uppercase tracking-wider block">
                  {t('Setup Bàn BBQ (6–10 khách)', 'BBQ Table Setup (6–10 Guests)')}
                </span>
                <div className="font-serif text-2xl font-bold text-white">
                  300.000đ <span className="text-xs font-normal text-white/70">/ {t('bàn', 'table')}</span>
                </div>
                <p className="text-white/70 text-[11px]">
                  {t('Bao gồm bếp nướng, than, chén dĩa, kẹp gắp và nước chấm đặc biệt.', 'Includes charcoal grill, plates, tongs & special dipping sauces.')}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[10px] p-4 text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#C6A86A] uppercase tracking-wider block">
                  {t('Phụ thu bia mang ngoài vào', 'Outside Beer Corkage')}
                </span>
                <div className="font-serif text-2xl font-bold text-white">
                  150.000đ <span className="text-xs font-normal text-white/70">/ {t('thùng', 'crate')}</span>
                </div>
                <p className="text-white/70 text-[11px]">
                  {t('Đã bao gồm thùng đá ướp lạnh suốt tiệc.', 'Includes ice bucket & ice setup.')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Info Service Boxes */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs shadow-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#0F2D52] block text-sm">{t('Bữa Sáng Sân Hiên', 'Terrace Breakfast')}</span>
            <p className="text-[#6B7280]">
              {t('Phục vụ gọi món & combo Á từ 06:30 hàng ngày.', 'Asian combo & à la carte served from 06:30 daily.')}
            </p>
          </div>

          <div className="space-y-1 sm:border-l sm:border-[#ECECEC] sm:pl-6">
            <span className="font-bold text-[#0F2D52] block text-sm">{t('Cà Phê Bình Minh', 'Sunrise Coffee')}</span>
            <p className="text-[#6B7280]">
              {t('Miễn phí trà & cà phê phin tại tầng cao cho khách lưu trú.', 'Free sunrise filter coffee & tea for guests.')}
            </p>
          </div>

          <div className="space-y-1 lg:border-l lg:border-[#ECECEC] lg:pl-6">
            <span className="font-bold text-[#0F2D52] block text-sm">{t('Phục Vụ Đoàn Đông', 'Group Catering')}</span>
            <p className="text-[#6B7280]">
              {t('Set menu hải sản cho đoàn 10+ khách (báo trước 1 ngày).', 'Seafood set menus for 10+ guests (1 day notice).')}
            </p>
          </div>

          <div className="space-y-1 lg:border-l lg:border-[#ECECEC] lg:pl-6">
            <span className="font-bold text-[#0F2D52] block text-sm">{t('Hotline Đặt Bàn', 'Dining Hotline')}</span>
            <a href="tel:0985000650" className="font-serif text-lg font-bold text-[#1D4E89] block hover:underline">
              0985 000 650
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
