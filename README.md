This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🏗️ Cấu trúc Thư mục Đề xuất:

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
└── components/
    ├── layouts/                 # Layout components
    │   ├── ActivityDetailLayout.tsx
    │   ├── HotelDetailLayout.tsx
    │   └── DestinationLayout.tsx
    ├── shared/                  # Shared components
    │   ├── ImageGallery.tsx
    │   ├── BookingForm.tsx
    │   ├── ReviewSection.tsx
    │   ├── PriceDisplay.tsx
    │   └── ShareButtons.tsx
    └── module-specific/         # Module specific components
        ├── pho-food/
        ├── pho-retreat/
        └── pho-travel/