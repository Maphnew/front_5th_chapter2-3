export type Comment = {
  id: number
  body: string
  postId: number | null
  likes?: number
  isDeleted?: boolean
  user: {
    id: number
    username: string
    fullName: string
  }
}

export type CommentAddDTO = {
  body: string
  postId?: number | null | undefined
  userId?: number | undefined
  id?: number
}

export interface LikeCommentProps {
  commentId: Comment["id"]
  likes: Comment["likes"]
}
