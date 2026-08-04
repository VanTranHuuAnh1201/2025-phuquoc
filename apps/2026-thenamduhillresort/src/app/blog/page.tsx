'use client'

import { UI } from '@repo/core'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { BLOG_POSTS } from '../../data/blog'
import { ImageSlot } from '../../components/common/ImageSlot'
import { Button } from '../../components/common/Button'
import { BookOpen, Clock, ArrowRight, Sparkles, ChevronRight } from 'lucide-react'

export default function BlogPage() {
  const { language, tx } = useLanguage()
  const isEn = language === 'en'
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const categories = [
    { key: 'ALL', vi: 'Tất cả bài viết', en: 'All articles' },
    { key: 'DI CHUYỂN', enKey: 'GETTING THERE', vi: 'Di chuyển', en: 'Getting there' },
    { key: 'HẬU TRƯỜNG', enKey: 'BEHIND THE SCENES', vi: 'Hậu trường', en: 'Behind the scenes' },
    { key: 'ẨM THỰC', enKey: 'FOOD', vi: 'Ẩm thực', en: 'Food' },
    { key: 'LỊCH TRÌNH', enKey: 'ITINERARY', vi: 'Lịch trình', en: 'Itinerary' },
  ]

  const filteredPosts = BLOG_POSTS.filter((p) => {
    if (activeCategory === 'ALL') return true
    return p.categoryVi === activeCategory || p.categoryEn === activeCategory
  })

  const heroPost = BLOG_POSTS[0]

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-20 pb-20">
      
      {/* Header Section */}
      <section className="bg-white border-b border-[#ECECEC] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
            <Link href="/" className="hover:text-[#1D4E89] transition">
              {tx(UI.home)}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="text-[#0F2D52] font-semibold">{tx(UI.namDuJournal)}</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[#1D4E89]" />
              <span>{tx(UI.notesFromTheNamDuHill)}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2D52] tracking-tight">
              {tx(UI.travelGuideIslandStories)}
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              {tx(UI.insightsGatheredOverYearsOfHosting)}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Featured Hero Article Card */}
        {heroPost && (
          <div className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[340px] bg-[#F5F7FA]">
              <Link href={`/blog/${heroPost.id}`} className="block absolute inset-0">
                <ImageSlot id={heroPost.heroSlot} placeholder={isEn ? heroPost.titleEn : heroPost.titleVi} style={{ position: 'absolute', inset: 0 }} />
              </Link>
              <span className="absolute top-4 left-4 bg-[#C6A86A] text-[#0F2D52] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{tx(UI.featured)}</span>
              </span>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#1D4E89] uppercase tracking-wider block">
                  {isEn ? heroPost.categoryEn : heroPost.categoryVi}
                </span>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2D52] hover:text-[#1D4E89] transition leading-snug">
                  <Link href={`/blog/${heroPost.id}`}>
                    {isEn ? heroPost.titleEn : heroPost.titleVi}
                  </Link>
                </h2>

                <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3">
                  {isEn ? heroPost.ledeEn : heroPost.ledeVi}
                </p>
              </div>

              <div className="pt-4 border-t border-[#ECECEC] flex items-center justify-between gap-3 text-xs">
                <div className="text-[#6B7280] text-[11px]">
                  <span>{isEn ? heroPost.dateEn : heroPost.dateVi}</span>
                  <span className="mx-1">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#1D4E89]" />
                    {heroPost.readMin} {tx(UI.min)}
                  </span>
                </div>

                <Link href={`/blog/${heroPost.id}`}>
                  <Button variant="primary" size="sm" radius="6px">
                    {tx(UI.readArticle)}
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => {
            const active = activeCategory === c.key || activeCategory === c.enKey
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-4 py-2 text-xs font-bold rounded-[6px] transition whitespace-nowrap ${
                  active
                    ? 'bg-[#1D4E89] text-white shadow-xs'
                    : 'bg-white border border-[#ECECEC] text-[#4B5563] hover:border-[#1D4E89] hover:text-[#1D4E89]'
                }`}
              >
                {isEn ? c.en : c.vi}
              </button>
            )
          })}
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
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
                    <Clock className="w-3 h-3 text-[#1D4E89]" />
                    <span>{post.readMin} {tx(UI.minRead)}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="font-semibold text-[#1D4E89] hover:underline flex items-center gap-1"
                  >
                    <span>{tx(UI.read)}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  )
}
