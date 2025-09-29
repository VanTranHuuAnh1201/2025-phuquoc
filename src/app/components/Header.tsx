export default function Header() {
    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
                <a href="#overview" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 grid place-items-center text-white font-bold">
                        Pho
                    </div>
                    <span className="font-semibold text-lg">Pho Group</span>
                </a>

                <nav className="ml-auto hidden md:flex items-center gap-1" aria-label="Primary">
                    <a href="#overview" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">
                        Overview
                    </a>
                    <a href="#retreat" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">
                        Retreat
                    </a>
                    <a href="#travel" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">
                        Travel
                    </a>
                    <a href="#food" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">
                        Food
                    </a>
                    <a href="#guide" className="px-3 py-2 rounded-lg hover:bg-gray-100">
                        Guide
                    </a>
                </nav>

                <a href="#contact" className="ml-auto md:ml-4 inline-flex px-3 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700">
                    Book now
                </a>
            </div>
        </header>
    )
}
