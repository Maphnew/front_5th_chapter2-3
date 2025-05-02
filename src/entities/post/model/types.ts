import { User } from "../../user/model/types"

export type Tag = {
  slug: string
  name: string
  url: string
}

export type Post = {
  id?: number
  title?: string | any
  body?: string | undefined | any
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  views?: number
  userId?: number | undefined
}

export type Posts = {
  posts: Post[]
  limit: number
  skip: number
  total: number
}

export interface PostComments {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: User
}

export interface PostTableProps {
  highlightText: (text: string, query: string) => React.ReactNode
  updateURL: () => void
  openPostDetail: (post: Post) => void
}
