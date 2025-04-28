export type Comment = {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export const deleteCommentWithCommentId = async (commentId: Comment["id"]) => {
  await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  })
}
