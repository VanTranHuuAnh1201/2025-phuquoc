import ActivityDetailLayout from '../../../components/layouts/ActivityDetailLayout'
import { activityMockData, activityReviews, similarActivities } from './mockData'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ActivityDetailPage({ params }: PageProps) {
    const { id } = await params

    // Get activity data by ID
    const activity = activityMockData[id as keyof typeof activityMockData]

    if (!activity) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Hoạt động không tìm thấy</h1>
                <p className="text-gray-600">Hoạt động bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            </div>
        )
    }

    return (
        <ActivityDetailLayout
            activity={activity}
            reviews={activityReviews}
            similarActivities={similarActivities}
        />
    )
}

// Generate static params for known activity IDs
export async function generateStaticParams() {
    return Object.keys(activityMockData).map((id) => ({
        id: id,
    }))
}