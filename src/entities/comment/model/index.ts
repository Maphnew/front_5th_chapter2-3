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
  
  export type CommentAddDTO = {
    body: string
    postId: number | null
    userId: number
  }
  