import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/ui"
import { fetchPostsWithPagination } from "../entities/post/api"
import { AddCommentDialog, UpdateCommentDialog } from "../entities/comment/ui/Comment"
import { PostTable, PostHeader } from "../entities/post/ui"
import { AddPostDialog, DetailPostDialog, UpdatePostDialog } from "../entities/post/ui/PostDialogs"
import { usePostStore } from "../entities/post/model/store"
import { usePaginationStore } from "../features/pagination/model/store"
import { Pagination } from "../widgets/pagination/ui/Pagination"
import { UserModal } from "../entities/user/ui/UserModal"
import { PostSearch } from "../entities/post/ui/PostSearch"
import { useUserStore } from "../entities/user/model/store"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tags = usePostStore((state) => state.tags)
  const selectedTag = usePostStore((state) => state.selectedTag)

  const setTotal = usePostStore((state) => state.setTotal)
  const setSelectedPost = usePostStore((state) => state.setSelectedPost)
  const setShowPostDetailDialog = usePostStore((state) => state.setShowPostDetailDialog)
  const setTags = usePostStore((state) => state.setTags)
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

  const showUserModal = useUserStore((state) => state.showUserModal)
  const selectedUser = useUserStore((state) => state.selectedUser)

  const setShowUserModal = useUserStore((state) => state.setShowUserModal)
  const setSelectedUser = useUserStore((state) => state.setSelectedUser)

  // 상태 관리
  const [posts, setPosts] = useState([]) // server state

  const [loading, setLoading] = useState(false) // server state

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

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)

    let usersData

    const postsData = await fetchPostsWithPagination(limit, skip)

    fetch("/api/users?limit=0&select=username,image")
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users
        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.find((user) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 삭제
  const deletePost = async (id) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
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
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              highlightText={highlightText}
              updateURL={updateURL}
              openUserModal={openUserModal}
              openPostDetail={openPostDetail}
            />
          )}

          <Pagination />
        </div>
      </CardContent>

      <AddPostDialog />
      <UpdatePostDialog />
      <DetailPostDialog highlightText={highlightText} />

      <AddCommentDialog />
      <UpdateCommentDialog />

      <UserModal showUserModal={showUserModal} setShowUserModal={setShowUserModal} selectedUser={selectedUser} />
    </Card>
  )
}

export default PostsManager
