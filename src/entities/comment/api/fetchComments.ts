import { Comment } from "../model"

type Response = {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

// 댓글 가져오기
export const fetchCommentsByPostId = async (postId: number): Promise<Response> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  const data = await response.json()
  return data
}
