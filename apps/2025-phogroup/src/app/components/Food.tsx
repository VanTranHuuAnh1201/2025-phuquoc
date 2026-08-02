export default function Food() {
    return (
        <section id="food" className="border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold">Đặc sản — PhoFood</h2>
                <p className="text-gray-600">Cá khô/đặc sản tuyển chọn, hút chân không, giao nhanh.</p>

                <div className="mt-6 rounded-2xl border p-4 lg:p-6">
                    <div className="aspect-[4/3] rounded-xl skeleton"></div>
                    <div className="mt-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Cá thu một nắng 250g</h3>
                            <p className="text-sm text-gray-500">Chuẩn vị • Hút chân không • Bảo quản lạnh</p>
                            <div className="mt-2 text-xs text-gray-500">
                                ✔️ Xưởng sạch • ✔️ Tiêu chuẩn quà biếu • ✔️ Ship nội đảo trong 2h
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="text-brand-600 font-semibold">₫ 180,000</span>
                                <span className="text-xs text-gray-500 line-through">₫ 220,000</span>
                                <span className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded">-18%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                className="px-3 py-1.5 rounded-lg border hover:border-brand-500"
                                href="https://shopee.vn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Shopee
                            </a>
                            <a
                                className="px-3 py-1.5 rounded-lg border hover:border-brand-500"
                                href="https://www.tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                TikTok Shop
                            </a>
                        </div>
                    </div>
                </div>

                {/* Additional products grid */}
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-xl border p-4">
                        <div className="aspect-square rounded-lg skeleton"></div>
                        <h4 className="mt-2 font-medium">Tôm khô Phú Quốc</h4>
                        <p className="text-sm text-gray-500">Size L • 200g</p>
                        <div className="mt-2 text-brand-600 font-semibold">₫ 320,000</div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="aspect-square rounded-lg skeleton"></div>
                        <h4 className="mt-2 font-medium">Mắm ruốc đặc biệt</h4>
                        <p className="text-sm text-gray-500">Truyền thống • 500ml</p>
                        <div className="mt-2 text-brand-600 font-semibold">₫ 150,000</div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="aspect-square rounded-lg skeleton"></div>
                        <h4 className="mt-2 font-medium">Combo quà tặng</h4>
                        <p className="text-sm text-gray-500">3 món đặc sản</p>
                        <div className="mt-2 text-brand-600 font-semibold">₫ 580,000</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
