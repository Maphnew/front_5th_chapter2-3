import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { useAddPost, useUpdatePost } from "../../../entities/post/api"
import { usePostStore } from "../../../entities/post/model/store"
import { Comments } from "../../../features/comment/ui/Comment"
import { usePaginationStore } from "../../../features/pagination/model/store"

export const AddPostDialog = () => {
  const addPost = useAddPost()
  const showAddDialog = usePostStore((state) => state.showAddDialog)
  const setShowAddDialog = usePostStore((state) => state.setShowAddDialog)
  const newPost = usePostStore((state) => state.newPost)
  const setNewPost = usePostStore((state) => state.setNewPost)

  const handleAddPost = () => {
    addPost.mutate()
    setShowAddDialog(false)
    setNewPost(newPost)
  }
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: (e.target as HTMLInputElement).value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: (e.target as HTMLTextAreaElement).value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number((e.target as HTMLInputElement).value) })}
          />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const UpdatePostDialog = () => {
  const selectedPost = usePostStore((state) => state.selectedPost)
  const setSelectedPost = usePostStore((state) => state.setSelectedPost)
  const showEditDialog = usePostStore((state) => state.showEditDialog)
  const setShowEditDialog = usePostStore((state) => state.setShowEditDialog)
  const updatePost = useUpdatePost()

  const handleUpdatePost = () => {
    updatePost.mutate()
    setShowEditDialog(false)
  }

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: (e.target as HTMLInputElement).value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: (e.target as HTMLInputElement).value })}
          />
          <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const DetailPostDialog = ({
  highlightText,
}: {
  highlightText: (text: string, query: string) => React.ReactNode
}) => {
  const searchQuery = usePaginationStore((state) => state.searchQuery)
  const selectedPost = usePostStore((state) => state.selectedPost)
  const showPostDetailDialog = usePostStore((state) => state.showPostDetailDialog)
  const setShowPostDetailDialog = usePostStore((state) => state.setShowPostDetailDialog)
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          <Comments highlightText={highlightText} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
