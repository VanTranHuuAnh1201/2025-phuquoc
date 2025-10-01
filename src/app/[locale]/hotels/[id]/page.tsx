import HotelDetailLayout from '../../../components/layouts/HotelDetailLayout'
import { hotelMockData, hotelReviews, similarHotels } from '../mockData'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function HotelDetailPage({ params }: PageProps) {
    const { id } = await params

    // Get hotel data by ID
    const hotel = hotelMockData[id as keyof typeof hotelMockData]

    if (!hotel) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Khách sạn không tìm thấy</h1>
                <p className="text-gray-600">Khách sạn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            </div>
        )
    }

    return (
        <HotelDetailLayout
            hotel={hotel}
            reviews={hotelReviews}
            similarHotels={similarHotels}
        />
    )
}

// Generate static params for known hotel IDs
export async function generateStaticParams() {
    return Object.keys(hotelMockData).map((id) => ({
        id: id,
    }))
}