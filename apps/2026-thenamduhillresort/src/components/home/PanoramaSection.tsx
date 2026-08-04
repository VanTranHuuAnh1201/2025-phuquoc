'use client'

import { UI } from '@repo/core'

import { useLanguage } from '../../context/LanguageContext'
import { gallery } from '../../data/property'
import { SectionHeading } from '../common/SectionHeading'

export function PanoramaSection() {
  const { tx } = useLanguage()

  return (
    <section className="py-5 sm:py-7 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          title={tx(UI.momentsAtTheNamDuHill)}
          description={tx(UI.captureUnforgettableIslandMemories)}
          href="/explore"
          actionLabel={tx(UI.viewAll)}
        />

        {/* 2x2 Grid on Mobile, 4-col on Desktop (Image Radius 16px) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="relative aspect-[4/3] rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <img
                src={item.image}
                alt={tx(item.title)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-xs sm:text-sm leading-tight drop-shadow-sm">
                  {tx(item.title)}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/80 font-normal mt-0.5 line-clamp-1">
                  {tx(item.subtitle)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
