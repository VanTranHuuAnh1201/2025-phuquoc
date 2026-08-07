'use client'

import { useEffect, useRef, useState } from 'react'

const DEFAULT_COLLAPSE_KEY = 'cms-sidebar-collapsed'
const KEEP_OPEN_SELECTOR = '.cms-overlay, [role="dialog"], .mn-admin-overlay'

export interface RailCollapseOptions {
  storageKey?: string
  defaultCollapsed?: boolean
  keepOpenWithin?: string
}

export interface RailCollapseReturn {
  collapsed: boolean
  /** Toggle sidebar collapse state and save preference to localStorage. */
  toggle: () => void
  /** Ref to attach to the `<aside>` element for click-outside detection. */
  railRef: React.RefObject<HTMLElement | null>
  /** Force set state without writing to localStorage (for temporary responsive collapses). */
  setCollapsedState: (collapsed: boolean) => void
}

/**
 * Custom hook managing sidebar rail collapse/expand state.
 * Supports manual toggle with localStorage persistence, as well as
 * click-outside auto-collapse when the sidebar is expanded.
 */
export function useRailCollapse(options: RailCollapseOptions = {}): RailCollapseReturn {
  const {
    storageKey = DEFAULT_COLLAPSE_KEY,
    defaultCollapsed = false,
    keepOpenWithin = KEEP_OPEN_SELECTOR,
  } = options

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) return stored === '1'
      return defaultCollapsed
    } catch {
      return defaultCollapsed
    }
  })

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(storageKey, next ? '1' : '0')
      } catch {
        // localStorage not available
      }
      return next
    })
  }

  const railRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!collapsed) {
      const onClickCapture = (e: globalThis.MouseEvent) => {
        if (e.button !== 0) return
        const target = e.target as Node | null
        if (!target || railRef.current?.contains(target)) return
        if (target instanceof Element && target.closest(keepOpenWithin)) return
        setCollapsed(true)
      }
      document.addEventListener('click', onClickCapture, true)
      return () => document.removeEventListener('click', onClickCapture, true)
    } else {
      const onMouseDownOnsite = (e: globalThis.MouseEvent) => {
        if (e.button !== 0) return
        const target = e.target as Node | null
        if (target && railRef.current?.contains(target)) {
          setCollapsed(false)
        }
      }
      document.addEventListener('mousedown', onMouseDownOnsite, true)
      return () => document.removeEventListener('mousedown', onMouseDownOnsite, true)
    }
  }, [collapsed, keepOpenWithin])

  return {
    collapsed,
    toggle,
    railRef,
    setCollapsedState: setCollapsed,
  }
}
