export default function Collections() {
    return (
        <section className="border-t bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold">Bộ sưu tập gợi ý</h2>
                    <a href="#travel" className="text-sm text-brand-600">Xem tất cả</a>
                </div>
                <div className="mt-4 overflow-x-auto no-scrollbar">
                    <div className="min-w-[680px] sm:min-w-[820px] grid grid-cols-3 sm:grid-cols-4 gap-3">
                        <div className="rounded-2xl border p-4 bg-white">
                            <div className="h-28 rounded-xl skeleton"></div>
                            <div className="mt-2 font-medium">3 đảo nổi bật</div>
                            <div className="text-xs text-gray-500">Cano nhanh • Lặn san hô</div>
                        </div>
                        <div className="rounded-2xl border p-4 bg-white skeleton"></div>
                        <div className="rounded-2xl border p-4 bg-white skeleton"></div>
                        <div className="rounded-2xl border p-4 bg-white skeleton hidden sm:block"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
