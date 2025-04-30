import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { CommentAddDTO, Comment } from "../model/types"
import { useComments } from "../api/queries"
import { useAddComment, useUpdateComment, useLikeComment, useDeleteComment } from "../api"
import { Post } from "../../post/model"

export const Comments = ({
  postId,
  setNewComment,
  setShowAddCommentDialog,
  setSelectedComment,
  setShowEditCommentDialog,
  highlightText,
  searchQuery,
}) => {
  const { data, isLoading, error } = useComments(postId)
  const likeComment = useLikeComment(postId)
  const deleteComment = useDeleteComment(postId)

  if (isLoading) return <h1>Loading...</h1>
  if (error) return <h1>Error!</h1>

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
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

interface AddCommentDialogProps {
  postId: Post["id"]
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (show: boolean) => void
  newComment: CommentAddDTO
  setNewComment: React.Dispatch<
    React.SetStateAction<{
      body: string
      postId: number | null
      userId: number
    }>
  >
}

export const AddCommentDialog = ({
  postId,
  showAddCommentDialog,
  setShowAddCommentDialog,
  newComment,
  setNewComment,
}: AddCommentDialogProps) => {
  const addComment = useAddComment(postId)

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
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface UpdateCommentDialogProps {
  postId: Post["id"]
  showEditCommentDialog: boolean
  setShowEditCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedComment: Comment | null
  setSelectedComment: React.Dispatch<
    React.SetStateAction<{
      body: string | any
      postId?: number | null | undefined
      userId?: number | undefined
    } | null>
  >
}

export const UpdateCommentDialog = ({
  postId,
  showEditCommentDialog,
  setShowEditCommentDialog,
  selectedComment,
  setSelectedComment,
}: UpdateCommentDialogProps) => {
  const updateComment = useUpdateComment(postId)

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
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
