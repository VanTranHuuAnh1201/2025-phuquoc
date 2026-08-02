# Pho Group Phú Quốc - Layout Components Documentation

## 📋 Tổng quan

Dự án được thiết kế với 3 module chính và các layout detail tương ứng, tham khảo từ Klook.com:

### 🏗️ Cấu trúc Module

```
1. PhoFood: Hải sản & Đặc sản Phú Quốc
   - Giới thiệu sản phẩm cá khô, hải sản đặc sản
   - Khách quốc tế mua biếu, khách Việt đặt ăn
   - Route: /[locale]/pho-food/

2. Pho Retreat: Biệt thự & Lưu trú
   - Giới thiệu biệt thự lưu trú tại Phú Quốc
   - Form booking đơn giản
   - Mở rộng thêm địa điểm khác trong tương lai
   - Route: /[locale]/pho-retreat/

3. Pho Travel: Tour & Trải nghiệm
   - Tour 3 đảo, vé cáp treo, Vin Safari...
   - Dành cho khách quốc tế
   - Route: /[locale]/pho-travel/
```

## 🎨 Layout Components Đã Tạo

### 1. ActivityDetailLayout
**File:** `apps/2025-phogroup/src/app/components/layouts/ActivityDetailLayout.tsx`

**Sử dụng cho:** Pho Travel activities (tour, trải nghiệm)

**Tính năng:**
- ✅ Image gallery với lightbox
- ✅ Booking form với date picker
- ✅ Rating & reviews section
- ✅ Highlights & inclusions/exclusions
- ✅ Pricing with discount display
- ✅ Similar activities recommendations
- ✅ Responsive design

**Props Interface:**
```typescript
interface ActivityDetailLayoutProps {
    activity: {
        id: string
        title: string
        location: string
        rating: number
        reviewCount: number
        price: number
        originalPrice?: number
        duration: string
        groupSize: string
        highlights: string[]
        description: string
        images: string[]
        inclusions: string[]
        exclusions: string[]
        cancellationPolicy: string
        category: string
    }
    reviews?: Array<{...}>
    similarActivities?: Array<{...}>
}
```

### 2. HotelDetailLayout
**File:** `apps/2025-phogroup/src/app/components/layouts/HotelDetailLayout.tsx`

**Sử dụng cho:** Pho Retreat hotels (biệt thự, khách sạn)

**Tính năng:**
- ✅ Multi-tab interface (Tổng quan, Phòng & Giá, Tiện nghi, Vị trí, Chính sách)
- ✅ Room type selection với pricing
- ✅ Image gallery với thumbnails
- ✅ Hotel amenities với icons
- ✅ Booking form với check-in/check-out dates
- ✅ Location & nearby attractions
- ✅ Guest reviews
- ✅ Similar hotels recommendations

**Props Interface:**
```typescript
interface HotelDetailLayoutProps {
    hotel: {
        id: string
        name: string
        location: string
        address: string
        rating: number
        reviewCount: number
        images: string[]
        description: string
        amenities: Array<{...}>
        roomTypes: Array<{...}>
        policies: {...}
        location_details: {...}
    }
    reviews?: Array<{...}>
    similarHotels?: Array<{...}>
}
```

### 3. DestinationLayout
**File:** `apps/2025-phogroup/src/app/components/layouts/DestinationLayout.tsx`

**Sử dụng cho:** Blog posts, destination guides

**Tính năng:**
- ✅ Hero section với overlay text
- ✅ Author information & publish date
- ✅ Flexible content rendering (text, image, gallery, quote, list)
- ✅ Multi-tab navigation (Nội dung, Hoạt động, Nơi ở, Ẩm thực)
- ✅ Share & favorite functionality
- ✅ Related destinations
- ✅ Recommended activities & hotels integration

**Props Interface:**
```typescript
interface DestinationLayoutProps {
    destination: {
        id: string
        title: string
        subtitle: string
        location: string
        author: {...}
        publishDate: string
        readTime: string
        heroImage: string
        tags: string[]
        content: Array<{
            type: 'text' | 'image' | 'gallery' | 'quote' | 'list'
            content: any
        }>
        seo: {...}
    }
    relatedDestinations?: Array<{...}>
    recommendedActivities?: Array<{...}>
    recommendedHotels?: Array<{...}>
}
```

## 🧩 Shared Components

### ImageGallery
**File:** `apps/2025-phogroup/src/app/components/shared/ImageGallery.tsx`

**Tính năng:**
- ✅ Responsive grid layout (1, 2, 3+ images)
- ✅ Full-screen modal với navigation
- ✅ Thumbnail navigation
- ✅ Hover effects & transitions

### BookingForm  
**File:** `apps/2025-phogroup/src/app/components/shared/BookingForm.tsx`

**Tính năng:**
- ✅ Multi-type support (hotel, activity, restaurant)
- ✅ Form validation với error messages
- ✅ Customer information fields
- ✅ Price calculation với discounts
- ✅ Special requests textarea
- ✅ Terms & conditions links

## 📁 Cấu trúc Thư mục Đề xuất

```
src/app/[locale]/
├── pho-food/                    # Module 1: Hải sản & Đặc sản
│   ├── page.tsx                 # Landing page PhoFood
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx         # Product detail page
│   └── category/
│       └── [category]/
│           └── page.tsx         # Category listing
│
├── pho-retreat/                 # Module 2: Biệt thự & Lưu trú
│   ├── page.tsx                 # Landing page Pho Retreat
│   ├── hotels/
│   │   └── [id]/
│   │       └── page.tsx         # Hotel detail + booking
│   └── locations/
│       └── [location]/
│           └── page.tsx         # Location-based listings
│
├── pho-travel/                  # Module 3: Tour & Trải nghiệm
│   ├── page.tsx                 # Landing page Pho Travel
│   ├── activities/
│   │   └── [id]/
│   │       └── page.tsx         # Activity detail + booking
│   ├── tours/
│   │   └── [slug]/
│   │       └── page.tsx         # Tour packages
│   └── destinations/
│       └── [slug]/
│           └── page.tsx         # Destination guides
│
└── blog/                        # Blog & Content
    ├── page.tsx                 # Blog listing
    └── destinations/
        └── [slug]/
            └── page.tsx         # Using DestinationLayout
```

## 🎯 Cách sử dụng

### Import Components
```typescript
import { 
    ActivityDetailLayout, 
    HotelDetailLayout, 
    DestinationLayout,
    ImageGallery,
    BookingForm 
} from '@/app/components'
```

### Sử dụng trong Pages
```typescript
// Activity Detail Page
export default function ActivityPage() {
    return (
        <ActivityDetailLayout 
            activity={activityData}
            reviews={reviewsData}
            similarActivities={similarData}
        />
    )
}

// Hotel Detail Page  
export default function HotelPage() {
    return (
        <HotelDetailLayout
            hotel={hotelData}
            reviews={reviewsData}
            similarHotels={similarData}
        />
    )
}

// Blog/Destination Page
export default function DestinationPage() {
    return (
        <DestinationLayout
            destination={destinationData}
            relatedDestinations={relatedData}
            recommendedActivities={activitiesData}
            recommendedHotels={hotelsData}
        />
    )
}
```

## 🔧 Dependencies

**Required:**
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- lucide-react (for icons)

**Installation:**
```bash
npm install lucide-react
```

## 📱 Responsive Design

Tất cả layouts đều responsive:
- ✅ Mobile-first approach
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Grid layouts adapt từ 1 column (mobile) đến 4 columns (desktop)
- ✅ Sticky booking forms trên desktop
- ✅ Touch-friendly navigation trên mobile

## 🚀 Next Steps

1. **Install lucide-react:** `npm install lucide-react`
2. **Tạo mock data** cho từng layout
3. **Tạo các trang detail** sử dụng layouts
4. **Integrate APIs** cho booking functionality
5. **Add SEO meta tags** cho từng trang
6. **Optimize images** với Next.js Image component
7. **Add loading states** và error handling
8. **Test responsive design** trên various devices

## 📞 Support

Layout components này được thiết kế để dễ dàng customize và extend. Nếu cần thêm tính năng hoặc modify layouts, chỉ cần update props interface và component logic tương ứng.