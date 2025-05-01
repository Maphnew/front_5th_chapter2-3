import { create } from "zustand"

interface PaginationState {
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface PaginationActions {
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSearchQuery: (searchQuery: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: "asc" | "desc") => void
}

type PaginationStore = PaginationState & PaginationActions

const getInitialState = (): PaginationState => {
  // 브라우저 환경에서만 실행되도록 확인
  if (typeof window !== "undefined") {
    const queryParams = new URLSearchParams(window.location.search)
    return {
      skip: parseInt(queryParams.get("skip") || "0"),
      limit: parseInt(queryParams.get("limit") || "10"),
      searchQuery: queryParams.get("search") || "",
      sortBy: queryParams.get("sortBy") || "",
      sortOrder: (queryParams.get("sortOrder") || "asc") as "asc" | "desc",
    }
  }
  // 서버 사이드 렌더링 또는 fallback 값
  return {
    skip: 0,
    limit: 10,
    searchQuery: "",
    sortBy: "",
    sortOrder: "asc",
  }
}

export const usePaginationStore = create<PaginationStore>()((set) => ({
  ...getInitialState(),
  setSkip: (skip: number) => set((state) => ({ ...state, skip })),
  setLimit: (limit: number) => set((state) => ({ ...state, limit })),
  setSearchQuery: (searchQuery: string) => set((state) => ({ ...state, searchQuery })),
  setSortBy: (sortBy: string) => set((state) => ({ ...state, sortBy })),
  setSortOrder: (sortOrder: "asc" | "desc") => set((state) => ({ ...state, sortOrder })),
}))
