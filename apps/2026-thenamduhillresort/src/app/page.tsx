'use client'

import { useLanguage } from '../context/LanguageContext'
import { property } from '../data/property'
import { H2About, H2Rooms, H2Dining, H2Places, H2Practical } from '@repo/theme-h2'

import { HeroSection } from '../components/home/HeroSection'
import { PanoramaSection } from '../components/home/PanoramaSection'
import { HostServiceSection } from '../components/home/HostServiceSection'
import { GallerySection } from '../components/home/GallerySection'

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <main>
      <HeroSection />
      
      <div data-theme="h2">
        <H2About data={property} locale={language} />
      </div>

      <PanoramaSection />

      <div data-theme="h2">
        <H2Rooms data={property} locale={language} slug="" />
        <H2Dining data={property} locale={language} slug="" />
        <H2Places data={property} locale={language} slug="" />
      </div>

      <HostServiceSection />

      <GallerySection />

      <div data-theme="h2">
        <H2Practical data={property} locale={language} />
      </div>
    </main>
  )
}
