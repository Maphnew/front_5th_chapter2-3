import { CommentAddDTO } from "../model"

export const addCommentWithNewComment = async (newComment: CommentAddDTO) => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  })
  const data = await response.json()
  return data
}
