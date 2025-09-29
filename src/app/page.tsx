import Collections from './components/Collections'
import Contact from './components/Contact'
import FloatingChat from './components/FloatingChat'
import Food from './components/Food'
import Footer from './components/Footer'
import Guide from './components/Guide'
import Header from './components/Header'
import Hero from './components/Hero'
import Retreat from './components/Retreat'
import TopBar from './components/TopBar'
import TopPicks from './components/TopPicks'
import Travel from './components/Travel'
import TravelEssentials from './components/TravelEssentials'

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />

      {/* Breadcrumb + Destination Header */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-xs text-gray-500 flex items-center gap-1">
            <a href="#overview" className="hover:text-gray-700">Trang chủ</a>
            <span>›</span>
            <span>Việt Nam</span>
            <span>›</span>
            <strong className="text-gray-700">Phú Quốc</strong>
          </nav>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Khám phá Phú Quốc cùng Pho Group</h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border">Phổ biến</span>
              <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border">Gia đình</span>
              <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border">Tiết kiệm</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">Hướng dẫn, tour & đặc sản • Cập nhật giá tốt mỗi ngày</div>
        </div>
      </section>

      <main>
        <Hero />
        <Collections />
        <TopPicks />
        <Retreat />
        <TravelEssentials />
        <Travel />
        <Food />
        <Guide />
        <Contact />
      </main>

      <Footer />
      <FloatingChat />
    </>
  )
}
