export default function TravelEssentials() {
    return (
        <section className="border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold">Travel Essentials</h2>
                    <a href="#guide" className="text-sm text-brand-600">Xem tips</a>
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl border p-4">
                        <div className="h-24 rounded-xl skeleton"></div>
                        <div className="mt-2 font-medium">Di chuyển</div>
                        <div className="text-xs text-gray-500">Sân bay • Taxi • Thuê xe</div>
                    </div>
                    <div className="rounded-2xl border p-4 skeleton"></div>
                    <div className="rounded-2xl border p-4 skeleton"></div>
                </div>
            </div>
        </section>
    )
}
