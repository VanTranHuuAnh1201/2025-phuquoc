/**
 * Nội dung khám phá đảo — đọc từ `@repo/core`, KHÔNG khai dữ liệu tại đây
 * (luật R8).
 *
 * Nguồn thật: `packages/core/src/data/explore.ts`.
 *
 * Lớp này chỉ trải `I18nText` của core ra cặp `xxxVi`/`xxxEn` mà giao diện
 * hiện tại đang đọc. Khi màn hình chuyển sang dùng `tx()` thì bỏ được lớp này.
 */

import {
    exploreSpots,
    satelliteIslands,
    tripPlans,
    type CostItem as CoreCostItem,
    type ExploreSpot,
    type ItineraryLeg as CoreLeg,
    type SatelliteIsland as CoreIsland,
    type TripPlan as CoreTripPlan,
} from '@repo/core'

export interface Spot {
    id: string
    nameVi: string
    nameEn: string
    distVi: string
    distEn: string
    textVi: string
    textEn: string
    tipVi: string
    tipEn: string
}

export interface SatelliteIsland {
    id: string
    nameVi: string
    nameEn: string
    badgeVi: string
    badgeEn: string
    textVi: string
    textEn: string
}

export interface ItineraryLeg {
    dayVi: string
    dayEn: string
    time: string
    titleVi: string
    titleEn: string
    textVi: string
    textEn: string
}

export interface CostItem {
    labelVi: string
    labelEn: string
    val: string
}

export interface TripPlan {
    key: 'd2' | 'd3'
    nameVi: string
    nameEn: string
    legs: ItineraryLeg[]
    costs: CostItem[]
    total: string
}

const toSpot = (s: ExploreSpot): Spot => ({
    id: s.id,
    nameVi: s.name.vi,
    nameEn: s.name.en,
    distVi: s.dist.vi,
    distEn: s.dist.en,
    textVi: s.text.vi,
    textEn: s.text.en,
    tipVi: s.tip.vi,
    tipEn: s.tip.en,
})

const toIsland = (i: CoreIsland): SatelliteIsland => ({
    id: i.id,
    nameVi: i.name.vi,
    nameEn: i.name.en,
    badgeVi: i.badge.vi,
    badgeEn: i.badge.en,
    textVi: i.text.vi,
    textEn: i.text.en,
})

const toLeg = (l: CoreLeg): ItineraryLeg => ({
    dayVi: l.day.vi,
    dayEn: l.day.en,
    time: l.time,
    titleVi: l.title.vi,
    titleEn: l.title.en,
    textVi: l.text.vi,
    textEn: l.text.en,
})

const toCost = (c: CoreCostItem): CostItem => ({
    labelVi: c.label.vi,
    labelEn: c.label.en,
    val: c.val,
})

const toTrip = (t: CoreTripPlan): TripPlan => ({
    key: t.key as TripPlan['key'],
    nameVi: t.name.vi,
    nameEn: t.name.en,
    legs: t.legs.map(toLeg),
    costs: t.costs.map(toCost),
    total: t.total,
})

export const SPOTS: Spot[] = exploreSpots.map(toSpot)

export const SATELLITE_ISLANDS: SatelliteIsland[] = satelliteIslands.map(toIsland)

export const TRIPS: Record<string, TripPlan> = Object.fromEntries(
    Object.entries(tripPlans).map(([key, trip]) => [key, toTrip(trip)]),
)
