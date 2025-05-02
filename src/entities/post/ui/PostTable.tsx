import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useDeletePost, usePostsQuery } from "../api"
import { usePostStore } from "../model/store"
import { usePaginationStore } from "../../../features/pagination/model/store"
import { Post, PostTableProps } from "../model/types"
import { User } from "../../user/model/types"
import { useUserStore } from "../../user/model/store"

export const PostTable = ({ highlightText, updateURL, openPostDetail }: PostTableProps) => {
  const searchQuery = usePaginationStore((state) => state.searchQuery)
  const selectedTag = usePostStore((state) => state.selectedTag)
  const setSelectedTag = usePostStore((state) => state.setSelectedTag)
  const setSelectedPost = usePostStore((state) => state.setSelectedPost)
  const setShowEditDialog = usePostStore((state) => state.setShowEditDialog)
  const setTotal = usePostStore((state) => state.setTotal)

  const setShowUserModal = useUserStore((state) => state.setShowUserModal)
  const setSelectedUser = useUserStore((state) => state.setSelectedUser)

  const { posts, isLoading, error, total } = usePostsQuery()
  setTotal(total)
  const deletePost = useDeletePost()

  // 사용자 모달 열기
  const openUserModal = async (user: User | undefined) => {
    if (typeof user === "undefined") return
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  if (isLoading) return <h1>로딩 중...</h1>
  if (error) return <h1>Error!</h1>

  const handleDeletePost = (postId: Post["id"]) => {
    deletePost.mutate(postId)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
