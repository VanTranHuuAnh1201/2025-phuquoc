import Link from 'next/link'
import ActivityReviews from '../components/ActivityReviews'
import ContactBookingForm from '../components/ContactBookingForm'
import FAQ from '../components/FAQ'
import Hotels from '../components/Hotels'
import PhoGroupHero from '../components/PhoGroupHero'
import TopActivities from '../components/TopActivities'
import TopDestinations from '../components/TopDestinations'
import Transportation from '../components/Transportation'
import TravelGuides from '../components/TravelGuides'
import WeatherInfo from '../components/WeatherInfo'

interface HomeProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  const currentLocale = locale || 'vi'
  return (
    <>
      <section className="bg-gradient-to-r from-orange-50/50 to-pink-50/50 border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm text-gray-600 flex items-center gap-2">
            <Link href={`/${currentLocale}`} className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <span>🏠</span>
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            <span className="text-orange-300">›</span>
            <span className="hidden sm:inline">Việt Nam</span>
            <span className="text-orange-300 hidden sm:inline">›</span>
            <strong className="text-gray-800 font-semibold">🏝️ Phú Quốc</strong>
          </nav>
        </div>
      </section>

      <PhoGroupHero />
      <main className="bg-gradient-to-br from-orange-50/80 via-pink-50/60 to-orange-50/40 min-h-screen">
        <section id="activities">
          <TopActivities />
        </section>

        <section id="destinations">
          <TopDestinations />
        </section>

        <section>
          <Transportation />
        </section>

        <section id="hotels">
          <Hotels />
        </section>

        <section id="guides">
          <TravelGuides />
        </section>

        <section>
          <ActivityReviews />
        </section>

        <section>
          <WeatherInfo />
        </section>

        <section>
          <ContactBookingForm />
        </section>

        <section id="faq">
          <FAQ />
        </section>
      </main>
    </>
  )
}
