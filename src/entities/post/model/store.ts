import { create } from "zustand"
import { Post } from "./types"

// 상태 인터페이스 정의
interface PostState {
  total: number
  selectedPost: Post | null
  showAddDialog: boolean
  showEditDialog: boolean
  newPost: Post
  showPostDetailDialog: boolean
  tags: string[]
  selectedTag: string
}

// 액션 인터페이스 정의
interface PostActions {
  setTotal: (total: number) => void
  setSelectedPost: (post: Post) => void
  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setNewPost: (post: Post) => void
  setShowPostDetailDialog: (show: boolean) => void
  setTags: (tags: string[]) => void
  setSelectedTag: (selectedTag: string) => void
}

type PostStore = PostState & PostActions

const getInitialState = () => {
  let state = {
    total: 0,
    selectedPost: null,
    showAddDialog: false,
    showEditDialog: false,
    newPost: { title: "", body: "", userId: 1 },
    showPostDetailDialog: false,
    tags: [],
    selectedTag: "",
  }
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search)
    return {
      ...state,
      selectedTag: params.get("tage") || "",
    }
  }
  return state
}

export const usePostStore = create<PostStore>((set) => ({
  ...getInitialState(),
  setTotal: (total: number) => set((state) => ({ ...state, total: total })),
  setSelectedPost: (post: Post) => set((state) => ({ ...state, selectedPost: post })),
  setShowAddDialog: (show: boolean) => set((state) => ({ ...state, showAddDialog: show })),
  setShowEditDialog: (show: boolean) => set((state) => ({ ...state, showEditDialog: show })),
  setNewPost: (post: Post) => set((state) => ({ ...state, newPost: post })),
  setShowPostDetailDialog: (show: boolean) => set((state) => ({ ...state, showPostDetailDialog: show })),
  setTags: (tags: string[]) => set((state) => ({ ...state, tags: tags })),
  setSelectedTag: (selectedTag: string) => set((state) => ({ ...state, selectedTag: selectedTag })),
}))
