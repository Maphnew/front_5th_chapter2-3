export type Post = {
  id: number
  title: string
  body: string
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  views?: number
  userId: number
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

export interface User {
  id: number
  username: string
  fullName: string
}
