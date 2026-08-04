'use client'

import { useLanguage } from '../context/LanguageContext'
import { property } from '../data/property'
import { H7About, H7Rooms, H7Dining, H7Places, H7Practical } from '@repo/theme-h7'

import { HeroSection } from '../components/home/HeroSection'
import { PanoramaSection } from '../components/home/PanoramaSection'
import { HostServiceSection } from '../components/home/HostServiceSection'
import { GallerySection } from '../components/home/GallerySection'

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <main>
      <HeroSection />
      
      <div data-theme="h7">
        <H7About data={property} locale={language} />
      </div>

      <PanoramaSection />

      <div data-theme="h7">
        <H7Rooms data={property} locale={language} slug="" />
        <H7Dining data={property} locale={language} slug="" />
        <H7Places data={property} locale={language} slug="" />
      </div>

      <HostServiceSection />

      <GallerySection />

      <div data-theme="h7">
        <H7Practical data={property} locale={language} />
      </div>
    </main>
  )
}
