export default function PhoGroupHero() {
    return (
        <section className="bg-white">
            <div className="relative">
                {/* Hero Image Background - matches Klook exactly */}
                <div className="h-80 lg:h-96 relative overflow-hidden">                    {/* Background Image - Real Phu Quoc Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`
                        }}
                    ></div>

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>

                    {/* Content overlay - exact positioning like Klook */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                            Phú Quốc
                        </h1>
                        <div className="max-w-4xl">
                            <p className="text-lg text-white/95 leading-relaxed mb-4">
                                Phú Quốc, hòn đảo lớn nhất Việt Nam, là thiên đường nhiệt đới nổi tiếng với những bãi biển cát trắng, làn nước trong vắt và cảnh quan tươi tốt. Hòn đảo này là nơi có các điểm tham quan thú vị như <span className="font-semibold">VinWonders Phú Quốc</span>, công viên giải trí đẳng cấp thế giới với các trò chơi và hoạt động giải trí ly kỳ, và <span className="font-semibold">Vinpearl Safari</span>, công viên bảo tồn động vật hoang dã lớn nhất cả nước.
                            </p>
                            <button className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium">
                                Xem thêm
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation - exact Klook style */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex gap-8">
                            <button className="px-1 py-4 border-b-2 border-orange-500 text-orange-500 font-medium flex items-center gap-2">
                                <span>🏛️</span>
                                Khám phá Phú Quốc
                            </button>
                            <button className="px-1 py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
                                <span>🎯</span>
                                Vui chơi & Trải nghiệm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
