export default function TopPicks() {
    return (
        <section className="border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold">Ưu tiên hàng đầu tại Phú Quốc</h2>
                    <a href="#travel" className="text-sm text-brand-600">Xem thêm</a>
                </div>
                <div className="mt-4 rounded-2xl border p-4">
                    <div className="aspect-[21/9] rounded-xl skeleton"></div>
                    <div className="mt-3 flex items-center justify-between">
                        <div>
                            <div className="font-semibold">Cáp treo Hòn Thơm + Công viên nước</div>
                            <div className="text-xs text-gray-500">Vé điện tử • Vào cửa nhanh</div>
                        </div>
                        <a href="#contact" className="px-3 py-1.5 rounded-lg border hover:border-brand-500">
                            Nhận tư vấn
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
