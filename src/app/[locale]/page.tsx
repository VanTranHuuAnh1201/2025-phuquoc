import Link from 'next/link'
import ActivityReviews from '../components/ActivityReviews'
import ContactBookingForm from '../components/ContactBookingForm'
import FAQ from '../components/FAQ'
import FloatingChat from '../components/FloatingChat'
import Footer from '../components/Footer'
import Hotels from '../components/Hotels'
import PhoGroupHero from '../components/PhoGroupHero'
import TopActivities from '../components/TopActivities'
import TopDestinations from '../components/TopDestinations'
import Transportation from '../components/Transportation'
import TravelGuides from '../components/TravelGuides'
import WeatherInfo from '../components/WeatherInfo'


export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-r from-orange-50/50 to-pink-50/50 border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm text-gray-600 flex items-center gap-2">
            <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
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
        {/* Top Activities - Enhanced */}
        <section id="activities" className="py-6 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                🎯 Hoạt động hàng đầu
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Khám phá những trải nghiệm tuyệt vời nhất tại đảo ngọc Phú Quốc
              </p>
            </div>
            <TopActivities />
          </div>
        </section>

        {/* Top Destinations - Enhanced */}
        <section id="destinations" className="py-6 sm:py-10 lg:py-12 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                🏖️ Điểm đến nổi bật
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những địa điểm không thể bỏ qua khi đến với Phú Quốc
              </p>
            </div>
            <TopDestinations />
          </div>
        </section>

        {/* Transportation */}
        <section className="py-6 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                🚗 Di chuyển thuận tiện
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Các phương tiện di chuyển tốt nhất tại Phú Quốc
              </p>
            </div>
            <Transportation />
          </div>
        </section>

        {/* Hotels */}
        <section id="hotels" className="py-6 sm:py-10 lg:py-12 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                🏨 Lưu trú cao cấp
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Villa và resort sang trọng với dịch vụ hoàn hảo
              </p>
            </div>
            <Hotels />
          </div>
        </section>

        {/* Travel Guides */}
        <section id="guides" className="py-6 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                📚 Cẩm nang du lịch
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hướng dẫn chi tiết cho chuyến đi hoàn hảo
              </p>
            </div>
            <TravelGuides />
          </div>
        </section>

        {/* Activity Reviews */}
        <section className="py-6 sm:py-10 lg:py-12 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                ⭐ Đánh giá từ khách hàng
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những trải nghiệm thực tế từ du khách
              </p>
            </div>
            <ActivityReviews />
          </div>
        </section>

        {/* Weather Info */}
        <section className="py-6 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                🌤️ Thông tin thời tiết
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Lựa chọn thời điểm tốt nhất cho chuyến đi
              </p>
            </div>
            <WeatherInfo />
          </div>
        </section>

        {/* Contact & Booking */}
        <section className="py-6 sm:py-10 lg:py-12 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                📞 Đặt tour ngay
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Liên hệ với chúng tôi để có trải nghiệm tuyệt vời nhất
              </p>
            </div>
            <ContactBookingForm />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-6 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                ❓ Câu hỏi thường gặp
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Giải đáp mọi thắc mắc về chuyến du lịch Phú Quốc
              </p>
            </div>
            <FAQ />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingChat />
    </>
  )
}
