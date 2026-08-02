export default function Hero() {
    return (
        <section id="overview" aria-label="Hero" className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-sky-500 to-emerald-500 opacity-25"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        Phú Quốc — Ăn • Ở • Trải nghiệm
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Đặc sản chuẩn vị • Villa riêng tư • Tour quốc tế
                    </p>

                    {/* Search bar */}
                    <div className="mt-5 rounded-2xl border shadow-soft bg-white p-3 flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                className="w-full outline-none"
                                placeholder="Bạn muốn tìm gì ở Phú Quốc? (tour, villa, đặc sản)"
                            />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <input type="date" className="px-3 py-2 border rounded-xl" />
                            <input type="date" className="px-3 py-2 border rounded-xl" />
                            <button className="px-4 py-2 rounded-xl bg-brand-600 text-white">Tìm kiếm</button>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="px-3 py-1.5 rounded-full border">3 đảo</span>
                        <span className="px-3 py-1.5 rounded-full border">Cáp treo</span>
                        <span className="px-3 py-1.5 rounded-full border">Vin Safari</span>
                        <span className="px-3 py-1.5 rounded-full border">Khô cá thu</span>
                    </div>

                    {/* USP strip */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                        <div className="rounded-xl border p-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Free cancel*
                        </div>
                        <div className="rounded-xl border p-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Best price
                        </div>
                        <div className="rounded-xl border p-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                            Instant confirm
                        </div>
                    </div>

                    {/* Social proof */}
                    <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">★★★★★</div>
                        <span>4.8/5 • 1.2k+ reviews</span>
                        <span className="hidden sm:inline">• 50k+ khách đã đặt</span>
                    </div>
                </div>

                <div className="lg:col-span-5 h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden grid grid-cols-3 gap-2 p-2 bg-white/60">
                    <div className="col-span-2 rounded-xl skeleton"></div>
                    <div className="rounded-xl skeleton"></div>
                    <div className="rounded-xl skeleton"></div>
                    <div className="col-span-2 rounded-xl skeleton"></div>
                </div>
            </div>
        </section>
    )
}
