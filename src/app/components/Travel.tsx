export default function Travel() {
    return (
        <section id="travel" className="border-t bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold">Trải nghiệm — Pho Travel</h2>
                <p className="text-gray-600">Tour 3 đảo, Cáp treo Hòn Thơm, Vin Safari, snorkeling…</p>

                {/* Sticky filter bar */}
                <div className="sticky-filter mt-4 rounded-2xl border p-3 shadow-soft">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <button className="px-3 py-1.5 rounded-full border hover:border-brand-500">Giá</button>
                        <button className="px-3 py-1.5 rounded-full border hover:border-brand-500">Đánh giá</button>
                        <button className="px-3 py-1.5 rounded-full border hover:border-brand-500">Thời lượng</button>
                        <button className="px-3 py-1.5 rounded-full border hover:border-brand-500">Pick‑up</button>
                        <span className="ml-auto text-gray-500">Sắp xếp: <b>Phổ biến</b></span>
                    </div>
                </div>

                {/* Tour content */}
                <div className="mt-6 rounded-2xl border p-4 lg:p-6 bg-white">
                    <div className="aspect-[4/3] rounded-xl skeleton"></div>
                    <div className="mt-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">3‑Islands Speedboat</h3>
                            <p className="text-sm text-gray-500">Đón khách tại khách sạn • Ăn trưa • Lặn ngắm san hô</p>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="text-brand-600 font-semibold">₫ 850,000</span>
                                <span className="text-xs text-gray-500 line-through">₫ 950,000</span>
                                <span className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded">-11%</span>
                            </div>
                        </div>
                        <a href="#contact" className="px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700">
                            Đặt tour
                        </a>
                    </div>
                </div>

                {/* Map teaser */}
                <div className="mt-6 rounded-2xl border p-4 bg-white">
                    <div className="h-48 rounded-xl skeleton"></div>
                    <p className="mt-2 text-sm text-gray-600">
                        Bản đồ vị trí bến cano / điểm đón khách (teaser – nhúng map thật sau).
                    </p>
                </div>
            </div>
        </section>
    )
}
