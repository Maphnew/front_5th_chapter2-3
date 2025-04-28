import { Comment } from "../model/comment"

interface LikeCommentProps {
  commentId: Comment["id"]
  comment: Comment
}

export const likeCommentWithComment = async ({ commentId, comment }: LikeCommentProps) => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: comment.likes + 1 }),
  })
  const data = await response.json()
  return data
}
