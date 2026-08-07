'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Column } from './DataTable'

export type SortDir = 'asc' | 'desc'

export interface FetchParams<F> {
  page: number
  pageSize: number
  sortKey: string | null
  sortDir: SortDir
  filters: F
}

export interface FetchResult<T> {
  data: T[]
  total: number
}

export interface DataTableConfig<T, F extends Record<string, any> = Record<string, any>> {
  /** API fetcher function for server-side pagination/sort/filter. */
  fetcher?: (params: FetchParams<F>) => Promise<FetchResult<T>>
  /** Static array for client-side data mode. */
  data?: T[]
  /** Table columns format specification. */
  columns: Column<T>[]
  /** Unique key getter for rows. */
  rowKey: (row: T, index?: number) => string
  /** Initial filter state. */
  initialFilters?: F
  /** Initial sort column key. */
  initialSortKey?: string | null
  /** Initial sort direction. */
  initialSortDir?: SortDir
  /** Page size (default: 20). */
  pageSize?: number
  /** Enable checkbox selection column. */
  selectable?: boolean
  /** Initial selected row keys. */
  initialSelectedKeys?: string[]
  /** Callback when a row is clicked. */
  onRowClick?: (row: T, index: number) => void
  /** Auto polling interval in milliseconds (optional). */
  pollIntervalMs?: number
}

export interface UseDataTableReturn<T, F extends Record<string, any>> {
  /** Clean props object to spread directly into `<SmartDataTable {...tableProps} />`. */
  tableProps: {
    columns: Column<T>[]
    rows: T[]
    rowKey: (row: T, index?: number) => string
    loading: boolean
    sortKey: string | null
    sortDir: SortDir
    onSort: (key: string) => void
    onRowClick?: (row: T, index: number) => void
    selectable: boolean
    selectedKeys: string[]
    onSelectionChange: (keys: string[]) => void
    pagination: {
      total: number
      page: number
      pageSize: number
      onPageChange: (page: number) => void
      onPageSizeChange: (pageSize: number) => void
    }
  }
  // Detailed state & helper accessors for child customization
  data: T[]
  total: number
  loading: boolean
  error: string | null
  page: number
  pageSize: number
  sortKey: string | null
  sortDir: SortDir
  filters: F
  selectedKeys: string[]
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSort: (key: string, dir?: SortDir) => void
  setFilter: <K extends keyof F>(key: K, value: F[K]) => void
  setFilters: (filters: F | ((prev: F) => F)) => void
  resetFilters: () => void
  setSelectedKeys: (keys: string[]) => void
  clearSelection: () => void
  refresh: () => void
}

export function useDataTable<T, F extends Record<string, any> = Record<string, any>>(
  config: DataTableConfig<T, F>,
): UseDataTableReturn<T, F> {
  const {
    fetcher,
    data: staticData,
    columns,
    rowKey,
    initialFilters = {} as F,
    initialSortKey = null,
    initialSortDir = 'asc',
    pageSize: initialPageSize = 20,
    selectable = false,
    initialSelectedKeys = [],
    onRowClick,
    pollIntervalMs,
  } = config

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(initialPageSize)
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey)
  const [sortDir, setSortDir] = useState<SortDir>(initialSortDir)
  const [filters, setFiltersState] = useState<F>(initialFilters)
  const [selectedKeys, setSelectedKeys] = useState<string[]>(initialSelectedKeys)

  const [apiData, setApiData] = useState<T[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(!!fetcher)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState<number>(0)

  const refresh = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  // Update single filter field
  const setFilter = useCallback(<K extends keyof F>(key: K, value: F[K]) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }))
    setPage(1) // Auto-reset page when filter changes
  }, [])

  const setFilters = useCallback((updater: F | ((prev: F) => F)) => {
    setFiltersState(updater)
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters)
    setPage(1)
  }, [initialFilters])

  const onSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    },
    [sortKey],
  )

  const setSort = useCallback((key: string, dir?: SortDir) => {
    setSortKey(key)
    if (dir) setSortDir(dir)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedKeys([])
  }, [])

  // API Fetching effect
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    if (!fetcherRef.current) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetcherRef
      .current({ page, pageSize, sortKey, sortDir, filters })
      .then((res) => {
        if (cancelled) return
        setApiData(res.data ?? [])
        setTotal(res.total ?? 0)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Tải dữ liệu thất bại')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, pageSize, sortKey, sortDir, filters, refreshIndex])

  // Polling effect if configured
  useEffect(() => {
    if (!fetcherRef.current || !pollIntervalMs || pollIntervalMs <= 0) return

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }, pollIntervalMs)

    return () => clearInterval(interval)
  }, [pollIntervalMs, refresh])

  // Compute displayed data & total if operating in client-side static mode
  const effectiveData = useMemo(() => {
    if (fetcher) return apiData
    if (!staticData) return []

    let result = [...staticData]

    // Client-side sort
    if (sortKey) {
      const dir = sortDir === 'asc' ? 1 : -1
      result.sort((a, b) => {
        const valA = (a as any)[sortKey]
        const valB = (b as any)[sortKey]
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir
        }
        return String(valA ?? '').localeCompare(String(valB ?? ''), 'vi') * dir
      })
    }

    return result
  }, [fetcher, apiData, staticData, sortKey, sortDir])

  const effectiveTotal = fetcher ? total : (staticData?.length ?? 0)

  // Paginated slice for static data
  const paginatedData = useMemo(() => {
    if (fetcher) return effectiveData
    const start = (page - 1) * pageSize
    return effectiveData.slice(start, start + pageSize)
  }, [fetcher, effectiveData, page, pageSize])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }, [])

  return {
    tableProps: {
      columns,
      rows: paginatedData,
      rowKey,
      loading,
      sortKey,
      sortDir,
      onSort,
      onRowClick,
      selectable,
      selectedKeys,
      onSelectionChange: setSelectedKeys,
      pagination: {
        total: effectiveTotal,
        page,
        pageSize,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      },
    },
    data: paginatedData,
    total: effectiveTotal,
    loading,
    error,
    page,
    pageSize,
    sortKey,
    sortDir,
    filters,
    selectedKeys,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    setFilters,
    resetFilters,
    setSelectedKeys,
    clearSelection,
    refresh,
  }
}
