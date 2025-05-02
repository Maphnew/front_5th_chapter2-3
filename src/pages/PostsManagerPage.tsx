import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent } from "../shared/ui"
import { AddCommentDialog, UpdateCommentDialog } from "../features/comment/ui/Comment"
import {
  PostTable,
  PostHeader,
  PostSearch,
  AddPostDialog,
  DetailPostDialog,
  UpdatePostDialog,
} from "../features/post/ui"
import { usePostStore } from "../entities/post/model/store"
import { usePaginationStore } from "../features/pagination/model/store"
import { Pagination } from "../widgets/pagination/ui/Pagination"
import { UserModal } from "../entities/user/ui/UserModal"
import { Post } from "../entities/post/model/types"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const selectedTag = usePostStore((state) => state.selectedTag)

  const setSelectedPost = usePostStore((state) => state.setSelectedPost)
  const setShowPostDetailDialog = usePostStore((state) => state.setShowPostDetailDialog)
  const setSelectedTag = usePostStore((state) => state.setSelectedTag)

  const skip = usePaginationStore((state) => state.skip)
  const limit = usePaginationStore((state) => state.limit)
  const searchQuery = usePaginationStore((state) => state.searchQuery)
  const sortBy = usePaginationStore((state) => state.sortBy)
  const sortOrder = usePaginationStore((state) => state.sortOrder)

  const setSkip = usePaginationStore((state) => state.setSkip)
  const setLimit = usePaginationStore((state) => state.setLimit)
  const setSearchQuery = usePaginationStore((state) => state.setSearchQuery)
  const setSortBy = usePaginationStore((state) => state.setSortBy)
  const setSortOrder = usePaginationStore((state) => state.setSortOrder)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder((params.get("sortOrder") || "asc") as "asc" | "desc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 하이라이트 함수 추가
  const highlightText: (text: string, query: string) => React.ReactNode = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostHeader />
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostSearch updateURL={updateURL} />

          {/* 게시물 테이블 */}
          <PostTable highlightText={highlightText} updateURL={updateURL} openPostDetail={openPostDetail} />

          <Pagination />
        </div>
      </CardContent>

      <AddPostDialog />
      <UpdatePostDialog />
      <DetailPostDialog highlightText={highlightText} />

      <AddCommentDialog />
      <UpdateCommentDialog />

      <UserModal />
    </Card>
  )
}

export default PostsManager
