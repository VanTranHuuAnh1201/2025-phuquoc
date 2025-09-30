import Link from 'next/link'
import ActivityReviews from './components/ActivityReviews'
import FAQ from './components/FAQ'
import FloatingChat from './components/FloatingChat'
import Footer from './components/Footer'
import Header from './components/Header'
import Hotels from './components/Hotels'
import PhoGroupHero from './components/PhoGroupHero'
import TopActivities from './components/TopActivities'
import TopDestinations from './components/TopDestinations'
import Transportation from './components/Transportation'
import TravelGuides from './components/TravelGuides'
import WeatherInfo from './components/WeatherInfo'

export default function Home() {
  return (
    <>
      {/* <TopBar /> */}
      <Header />

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-1">
            <Link href="/" className="hover:text-gray-700">Trang chủ</Link>
            <span>›</span>
            <span>Việt Nam</span>
            <span>›</span>
            <strong className="text-gray-700">Phú Quốc</strong>
          </nav>
        </div>
      </section>

      <PhoGroupHero />

      <main>
        <section id="activities">
          <TopActivities />
        </section>

        <section id="destinations">
          <TopDestinations />
        </section>

        <Transportation />

        <section id="hotels">
          <Hotels />
        </section>

        <section id="guides">
          <TravelGuides />
        </section>

        <ActivityReviews />

        <WeatherInfo />

        <section id="faq">
          <FAQ />
        </section>
      </main>

      <Footer />
      <FloatingChat />
    </>
  )
}
