'use client'

import { UI } from '@repo/core'

import { Anchor, ArrowRight, BookOpen, Calendar, Clock, Compass, MessageCircle, ShieldCheck, Sparkles, Sun } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../../components/common/Button'
import { ImageSlot } from '../../components/common/ImageSlot'
import { useLanguage } from '../../context/LanguageContext'
import { BLOG_POSTS } from '../../data/blog'
import { SATELLITE_ISLANDS, SPOTS, TRIPS } from '../../data/explore'

export default function ExplorePage() {
  const { language, tx } = useLanguage()
  const isEn = language === 'en'

  const [activeTripKey, setActiveTripKey] = useState<'d2' | 'd3'>('d2')
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const currentTrip = TRIPS[activeTripKey]

  const categories = [
    { key: 'ALL', vi: 'Tất cả bài viết', en: 'All articles' },
    { key: 'DI CHUYỂN', enKey: 'GETTING THERE', vi: 'Di chuyển', en: 'Getting there' },
    { key: 'HẬU TRƯỜNG', enKey: 'BEHIND THE SCENES', vi: 'Hậu trường', en: 'Behind the scenes' },
    { key: 'ẨM THỰC', enKey: 'FOOD', vi: 'Ẩm thực', en: 'Food' },
    { key: 'SỰ KIỆN', enKey: 'EVENT', vi: 'Sự kiện', en: 'Event' },
    { key: 'TRẢI NGHIỆM', enKey: 'EXPERIENCES', vi: 'Trải nghiệm', en: 'Experiences' },
  ]

  const filteredPosts = BLOG_POSTS.filter((p) => {
    if (activeCategory === 'ALL') return true
    return p.categoryVi === activeCategory || p.categoryEn === activeCategory
  })

  // Map spots to blog posts where relevant
  const getSpotArticleUrl = (spotId: string) => {
    if (spotId === 'lighthouse') return '/blog/bi-mat-hai-dang-nam-du'
    return '/blog/kinh-nghiem-di-nam-du-lan-dau'
  }

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
            <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
            <span>{tx(UI.n21Islands912KmGulf)}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl leading-tight">
            {tx(UI.exploreNamDuComplete23)}
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            {tx(UI.curatedExperiencesTriedAndLovedBy)}
          </p>
        </div>
      </section>

      {/* Floating Quick Stats Bar */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] p-5 sm:p-6 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-[#FFB800] uppercase tracking-wider block">
              {tx(UI.bestSeason)}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              {tx(UI.decemberMarch)}
            </div>
            <div className="text-[#6B7280]">
              {tx(UI.calmTurquoiseSeaMildWeather)}
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-[#ECECEC] sm:pl-6">
            <span className="text-[10px] font-extrabold text-[#FFB800] uppercase tracking-wider block">
              {tx(UI.highestPeak)}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              309 m {tx(UI.lighthouse)}
            </div>
            <div className="text-[#6B7280]">
              {tx(UI.panoramicViewpointOnHonLon)}
            </div>
          </div>

          <div className="space-y-1 lg:border-l lg:border-[#ECECEC] lg:pl-6">
            <span className="text-[10px] font-extrabold text-[#FFB800] uppercase tracking-wider block">
              {tx(UI.gettingHere)}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              {tx(UI.rachGia25hSpeedboat)}
            </div>
            <div className="text-[#6B7280]">
              {tx(UI.freePierPickupAtCuTron)}
            </div>
          </div>

          <div className="space-y-1 lg:border-l lg:border-[#ECECEC] lg:pl-6">
            <span className="text-[10px] font-extrabold text-[#FFB800] uppercase tracking-wider block">
              {tx(UI.mustBring)}
            </span>
            <div className="font-serif text-base font-bold text-[#0F2D52]">
              {tx(UI.idCardCash)}
            </div>
            <div className="text-[#6B7280]">
              {tx(UI.borderCheckLimitedAtms)}
            </div>
          </div>
        </div>
      </section>

      {/* Amenities & Services Intro — nội dung biên tập của khách hàng */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="space-y-2 border-b border-[#ECECEC] pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
              <Sparkles className="w-4 h-4 text-[#1D4E89]" />
              <span>{isEn ? 'Amenities & services' : 'Tiện nghi & dịch vụ'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D52]">
              {isEn
                ? 'Amenities & services at The Nam Du Hill Resort'
                : 'Tiện nghi & dịch vụ tại The Nam Du Hill Resort'}
            </h2>
          </div>

          {/* Lead: ảnh lớn + đoạn mở đầu */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-[300px] rounded-[10px] overflow-hidden bg-[#F5F7FA]">
              <ImageSlot
                id="ndh-amenity-nature"
                placeholder={isEn ? 'Resort in harmony with nature' : 'Khu nghỉ hài hòa với thiên nhiên'}
                style={{ position: 'absolute', inset: 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#0F2D52] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#C6A86A]" />
                  <span>{isEn ? 'Designed with nature' : 'Hài hòa với thiên nhiên'}</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
              <p className="text-base sm:text-lg text-[#0F2D52] font-serif leading-relaxed">
                {isEn
                  ? 'Amenities and services at The Nam Du Hill Resort are designed in harmony with nature, giving guests a full sense of ease within the calm of the islands.'
                  : 'Hệ thống tiện nghi và dịch vụ tại The Nam Du Hill Resort được thiết kế hài hòa với thiên nhiên, mang đến cho du khách cảm giác thư giãn trọn vẹn giữa không gian biển đảo yên bình.'}
              </p>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {isEn
                  ? 'Whether you come to Nam Du to rest, to explore, or simply to find your balance again, we are ready with genuine and attentive hospitality.'
                  : 'Dù bạn đến Nam Du để nghỉ dưỡng, khám phá hay đơn giản là tìm lại sự cân bằng, chúng tôi luôn sẵn sàng đáp ứng bằng sự hiếu khách chân thành và chu đáo.'}
              </p>

              {/* Điểm nhấn dịch vụ — rút từ chính đoạn nội dung */}
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  { icon: Sun, vi: 'Café & bar hướng biển', en: 'Sea-view café & bar' },
                  { icon: Compass, vi: 'Tour tham quan đảo', en: 'Island tours' },
                  { icon: Anchor, vi: 'Lặn ngắm san hô', en: 'Coral snorkelling' },
                  { icon: ShieldCheck, vi: 'Di chuyển cano', en: 'Speedboat transfers' },
                ].map((f) => (
                  <li
                    key={f.en}
                    className="flex items-start gap-1.5 rounded-[8px] bg-[#F8F9FA] border border-[#ECECEC] px-2.5 py-2 text-[11px] font-semibold text-[#0F2D52] leading-snug"
                  >
                    <f.icon className="w-3.5 h-3.5 text-[#1D4E89] shrink-0 mt-px" />
                    <span>{isEn ? f.en : f.vi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hai khối nội dung còn lại, mỗi khối có ảnh riêng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                slot: 'ndh-amenity-cafe',
                titleVi: 'Café & bar hướng biển',
                titleEn: 'Café & bar facing the sea',
                textVi: 'Du khách có thể tận hưởng khu café & bar với tầm nhìn hướng biển, lý tưởng để ngắm bình minh hay hoàng hôn trên đảo. Đội ngũ resort hỗ trợ sắp xếp tour tham quan đảo, trải nghiệm biển, lặn ngắm san hô và di chuyển cano, giúp hành trình của bạn trở nên thuận tiện và trọn vẹn hơn.',
                textEn: 'Guests can enjoy the café & bar looking out to sea, an ideal spot to watch sunrise or sunset over the island. Our team helps arrange island tours, sea experiences, coral snorkelling and speedboat transfers, making your journey easier and more complete.',
              },
              {
                slot: 'ndh-amenity-quiet',
                titleVi: 'Không gian yên tĩnh để thả lỏng',
                titleEn: 'A quiet place to unwind',
                textVi: 'Với không gian yên tĩnh, gần gũi thiên nhiên cùng các tiện ích thiết yếu phục vụ nghỉ dưỡng, The Nam Du Hill Resort là điểm dừng chân lý tưởng để bạn thả lỏng cơ thể, tái tạo năng lượng và tận hưởng nhịp sống chậm giữa vẻ đẹp nguyên sơ của Nam Du.',
                textEn: 'With quiet surroundings close to nature and the essentials for a restful stay, The Nam Du Hill Resort is an ideal place to unwind, recover your energy and enjoy the slower pace of life amid the untouched beauty of Nam Du.',
              },
            ].map((b) => (
              <div
                key={b.slot}
                className="rounded-[10px] border border-[#ECECEC] overflow-hidden bg-[#F8F9FA] flex flex-col"
              >
                <div className="relative h-44 bg-[#F5F7FA]">
                  <ImageSlot
                    id={b.slot}
                    placeholder={isEn ? b.titleEn : b.titleVi}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-base font-bold text-[#0F2D52]">
                    {isEn ? b.titleEn : b.titleVi}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {isEn ? b.textEn : b.textVi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Spots on Hon Lon ("Trên Hòn Lớn") - Interactive Cards with Blog Detail Links */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
              <Compass className="w-4 h-4 text-[#1D4E89]" />
              <span>{tx(UI.honLonMainIsland)}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D52]">
              {tx(UI.n11kmCoastalLoopHighlights)}
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] max-w-md">
            {tx(UI.scooterRental120000150000)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPOTS.map((s) => (
            <Link
              key={s.id}
              href={getSpotArticleUrl(s.id)}
              className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col cursor-pointer"
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
                  <span className="text-xs text-[#1D4E89] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                    <span>Xem bài viết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Integrated Section: Cẩm Nang & Góc Trải Nghiệm Blog/Story Articles */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ECECEC] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
                <BookOpen className="w-4 h-4 text-[#1D4E89]" />
                <span>Cẩm nang & Kinh nghiệm du lịch</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D52]">
                {tx(UI.travelGuideIslandStories)}
              </h2>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => {
                const active = activeCategory === c.key || activeCategory === c.enKey
                return (
                  <button
                    key={c.key}
                    onClick={() => setActiveCategory(c.key)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-[6px] transition whitespace-nowrap ${active
                        ? 'bg-[#1D4E89] text-white shadow-xs'
                        : 'bg-white border border-[#ECECEC] text-[#4B5563] hover:border-[#1D4E89] hover:text-[#1D4E89]'
                      }`}
                  >
                    {isEn ? c.en : c.vi}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid of Articles with Direct onClick to Blog Detail View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col group"
              >
                <div className="relative h-48 bg-[#F5F7FA] overflow-hidden">
                  <Link href={`/blog/${post.id}`} className="block absolute inset-0">
                    <ImageSlot id={post.heroSlot} placeholder={isEn ? post.titleEn : post.titleVi} style={{ position: 'absolute', inset: 0 }} />
                  </Link>
                  <span className="absolute top-3 left-3 bg-[#0F2D52]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {isEn ? post.categoryEn : post.categoryVi}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-serif text-base font-bold text-[#0F2D52] group-hover:text-[#1D4E89] transition line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.id}`}>
                        {isEn ? post.titleEn : post.titleVi}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#4B5563] line-clamp-3 leading-relaxed">
                      {isEn ? post.ledeEn : post.ledeVi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#ECECEC] flex items-center justify-between text-[11px] text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <span>{isEn ? post.dateEn : post.dateVi}</span>
                      <span className="text-[#D1D5DB]">•</span>
                      <Clock className="w-3 h-3 text-[#1D4E89]" />
                      <span>{post.readMin} {tx(UI.minRead)}</span>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="font-bold text-[#1D4E89] hover:underline flex items-center gap-1"
                    >
                      <span>Chi tiết bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Satellite Islands Section ("Cụm đảo vệ tinh") */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E89]">
              <Anchor className="w-4 h-4 text-[#1D4E89]" />
              <span>{tx(UI.satelliteIslands)}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D52]">
              {tx(UI.woodenBoatTourCoralSnorkeling)}
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] max-w-md">
            {tx(UI.n200000400000VndPer)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SATELLITE_ISLANDS.map((i) => (
            <Link
              key={i.id}
              href="/blog/kinh-nghiem-di-nam-du-lan-dau"
              className="relative min-h-[320px] rounded-[12px] overflow-hidden bg-[#0F2D52] flex items-end p-5 shadow-xs group cursor-pointer"
            >
              <ImageSlot
                id={`ndh-island-${i.id}`}
                placeholder={isEn ? i.nameEn : i.nameVi}
                style={{ position: 'absolute', inset: 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D52] via-[#0F2D52]/40 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-1.5 text-white">
                <span className="inline-block text-[10px] font-bold text-[#FFB800] bg-[#0F2D52]/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#FFB800]/30">
                  {isEn ? i.badgeEn : i.badgeVi}
                </span>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#FFB800] transition">
                  {isEn ? i.nameEn : i.nameVi}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  {isEn ? i.textEn : i.textVi}
                </p>
              </div>
            </Link>
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
                <span>{tx(UI.suggestedItineraries)}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2D52]">
                {tx(UI.detailed2d1n3d2nItinerary)}
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
                    className={`px-4 py-2 text-xs font-bold rounded-[6px] transition ${active
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
                  {tx(UI.estimatedCostPerGuest)}
                </h3>
                {currentTrip?.costs.map((c, idx) => (
                  <div key={idx} className="flex justify-between text-[#4B5563]">
                    <span>{isEn ? c.labelEn : c.labelVi}</span>
                    <span className="font-semibold text-[#1A1A1A]">{c.val}</span>
                  </div>
                ))}
                <div className="border-t border-[#ECECEC] pt-2 flex justify-between font-bold text-[#0F2D52] text-sm">
                  <span>{tx(UI.totalEstimate)}</span>
                  <span className="text-[#1D4E89]">{currentTrip?.total}</span>
                </div>
              </div>

              {/* Zalo Action */}
              <div className="bg-[#0F2D52] text-white rounded-[10px] p-5 space-y-3">
                <h4 className="font-serif text-base font-bold text-white">
                  {tx(UI.weArrangeEverything)}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {tx(UI.bookIslandBoatsSpeedboatTicketsScooters)}
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <a href="https://zalo.me/0985000650" target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="md" radius="6px" className="w-full bg-[#0068FF] hover:bg-[#0052cc]">
                      <MessageCircle className="w-4 h-4 mr-1.5" />
                      {tx(UI.consultOnZalo)}
                    </Button>
                  </a>
                  <Link href="/rooms">
                    <Button variant="outline" size="md" radius="6px" className="w-full border-white/30 text-white hover:bg-white/10">
                      {tx(UI.pickARoomFirst)}
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
            {tx(UI.essentialTipsBeforeVisitingNamDu)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <h3 className="font-bold text-[#0F2D52] text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1D4E89]" />
                <span>{tx(UI.bookSpeedboatEarly)}</span>
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {tx(UI.duringPeakSeasonDecToMar)}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-[#0F2D52] text-sm flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#1D4E89]" />
                <span>{tx(UI.checkSeaWeather)}</span>
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {tx(UI.speedboatsStopWhenWindExceedsForce)}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-[#0F2D52] text-sm flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-[#1D4E89]" />
                <span>{tx(UI.protectCoralReefs)}</span>
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                {tx(UI.neverBreakOrStandOnCoral)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
