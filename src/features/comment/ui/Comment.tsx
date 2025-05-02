import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { useComments } from "../../../entities/comment/api/queries"
import { useAddComment, useUpdateComment, useLikeComment, useDeleteComment } from "../../../entities/comment/api"
import { useCommentStore } from "../../../entities/comment/model/store"
import { usePostStore } from "../../../entities/post/model/store"
import { usePaginationStore } from "../../pagination/model/store"

export const Comments = ({ highlightText }: { highlightText: (text: string, query: string) => React.ReactNode }) => {
  const setSelectedComment = useCommentStore((state) => state.setSelectedComment)
  const setNewComment = useCommentStore((state) => state.setNewComment)
  const setShowAddCommentDialog = useCommentStore((state) => state.setShowAddCommentDialog)
  const setShowEditCommentDialog = useCommentStore((state) => state.setShowEditCommentDialog)

  const searchQuery = usePaginationStore((state) => state.searchQuery)
  const selectedPost = usePostStore((state) => state.selectedPost)

  const { data, isLoading, error } = useComments(selectedPost?.id)
  const likeComment = useLikeComment(selectedPost?.id)
  const deleteComment = useDeleteComment(selectedPost?.id)

  if (isLoading || typeof data === "undefined") return <h1>Loading...</h1>
  if (error) {
    return <h1>Error!</h1>
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId: selectedPost?.id }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {data.comments?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="block w-70 truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeComment.mutate({ commentId: comment.id, likes: comment.likes })}
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment.mutate(comment.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const AddCommentDialog = () => {
  const selectedPost = usePostStore((state) => state.selectedPost)
  const addComment = useAddComment(selectedPost?.id)
  const newComment = useCommentStore((state) => state.newComment)
  const setNewComment = useCommentStore((state) => state.setNewComment)
  const showAddCommentDialog = useCommentStore((state) => state.showAddCommentDialog)
  const setShowAddCommentDialog = useCommentStore((state) => state.setShowAddCommentDialog)

  const handleAddComment = () => {
    addComment.mutate(newComment)
    setShowAddCommentDialog(false)
    setNewComment({ body: "", postId: null, userId: 1 })
  }
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: (e.target as HTMLTextAreaElement).value })}
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const UpdateCommentDialog = () => {
  const selectedPost = usePostStore((state) => state.selectedPost)
  const updateComment = useUpdateComment(selectedPost?.id)
  const selectedComment = useCommentStore((state) => state.selectedComment)
  const setSelectedComment = useCommentStore((state) => state.setSelectedComment)
  const showEditCommentDialog = useCommentStore((state) => state.showEditCommentDialog)
  const setShowEditCommentDialog = useCommentStore((state) => state.setShowEditCommentDialog)

  const handleUpdateComment = () => {
    if (selectedComment === null) return
    updateComment.mutate(selectedComment)
    setShowEditCommentDialog(false)
  }
  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: (e.target as HTMLTextAreaElement).value })}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
