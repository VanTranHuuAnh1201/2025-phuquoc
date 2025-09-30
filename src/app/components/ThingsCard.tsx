/* eslint-disable @next/next/no-img-element */
'use client'

import { ThingItem } from "../[locale]/1-things-to-do/mockData"


export default function ThingsCard({ item }: { item: ThingItem }) {
  return (
    <div className="group cursor-pointer bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Heart icon */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all hover:scale-110">
          <svg className="w-4 h-4 text-gray-600 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {item.originalPrice && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{Math.round((1 - item.price / item.originalPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.subtitle}</p>
        <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors min-h-[2.5rem] text-gray-900">
          {item.title}
        </h3>

        {/* Badges - Compact */}
        <div className="flex flex-wrap gap-1">
          {item.badges?.slice(0, 1).map((b, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full border border-green-200 font-medium">
              {b}
            </span>
          ))}
        </div>

        {/* Rating and bookings - Compact */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-gray-900 text-xs">{item.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-xs">({item.reviews > 1000 ? `${Math.floor(item.reviews / 1000)}k` : item.reviews})</span>
          </div>
          {item.bookings && (
            <span className="text-gray-600 text-xs bg-gray-50 px-2 py-0.5 rounded-full">{item.bookings}</span>
          )}
        </div>

        {/* Price - Compact */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">
              ₫ {item.price.toLocaleString()}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₫ {item.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  )
}
