'use client'

import type { ReactNode } from 'react'

export interface SidebarRecentItem {
  id: string
  title: string
  subtitle?: string
  href?: string
  icon?: ReactNode
  badge?: ReactNode
  status?: 'active' | 'processing' | 'done' | 'error' | string
}

export interface SidebarRecentListProps {
  title?: string
  items: SidebarRecentItem[]
  loading?: boolean
  emptyText?: string
  activeId?: string
  onItemClick?: (item: SidebarRecentItem) => void
  renderItem?: (item: SidebarRecentItem, isActive: boolean) => ReactNode
  containerClassName?: string
}

export function SidebarRecentList({
  title = 'Gần đây',
  items,
  loading = false,
  emptyText = 'Không có mục nào',
  activeId,
  onItemClick,
  renderItem,
  containerClassName = '',
}: SidebarRecentListProps) {
  if (!loading && items.length === 0) {
    return null
  }

  return (
    <div className={`sidebar-recent-container ${containerClassName}`.trim()}>
      {title && (
        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {loading && items.length === 0 && (
          <div className="px-3 py-2 text-xs text-slate-400 animate-pulse">
            Đang tải…
          </div>
        )}
        {items.map((item) => {
          const isActive = activeId === item.id

          if (renderItem) {
            return <div key={item.id}>{renderItem(item, isActive)}</div>
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick?.(item)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs rounded-md transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {item.icon && <span className="shrink-0 text-slate-400">{item.icon}</span>}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{item.title}</div>
                {item.subtitle && (
                  <div className="truncate text-[10px] text-slate-400">{item.subtitle}</div>
                )}
              </div>
              {item.badge}
              {item.status && (
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    item.status === 'done'
                      ? 'bg-emerald-500'
                      : item.status === 'processing'
                        ? 'bg-amber-500 animate-ping'
                        : item.status === 'error'
                          ? 'bg-rose-500'
                          : 'bg-blue-500'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
