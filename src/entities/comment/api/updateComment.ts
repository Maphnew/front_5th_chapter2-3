import { Comment } from "../model"

export const updateCommentWithComment = async (selectedComment: Comment | null) => {
  if (selectedComment === null) throw new Error("Error! Please provide a comment to update the comment.")
  const response = await fetch(`/api/comments/${selectedComment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: selectedComment.body }),
  })
  const data = await response.json()
  return data
}
