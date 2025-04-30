import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { commentKeys } from "./queries"
import { Comment, CommentAddDTO } from "../model/types"
import { LikeCommentProps } from "../model/types"
import { Post, PostComments } from "../../post/model"

export const useAddComment = (postId: Post["id"]) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newComment: CommentAddDTO) => {
      return fetcher({
        url: "/comments/add",
        method: "POST",
        data: newComment,
      })
    },
    onSuccess: (comment: Comment | unknown) => {
      queryClient.setQueriesData({ queryKey: commentKeys.list(postId) }, (prev: PostComments) => {
        return {
          ...prev,
          comments: [...prev.comments, comment],
        }
      })
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })
}

export const useUpdateComment = (postId: Post["id"]) => {
  const queryClient = useQueryClient()
  return useMutation<string, Error, Comment>({
    mutationFn: (selectedComment: Comment) =>
      fetcher<string>({
        url: `/comments/${selectedComment.id}`,
        method: "PUT",
        data: { body: selectedComment.body },
      }),
    onSuccess: (data: string, variables: Comment, context: unknown) => {
      queryClient.setQueriesData({ queryKey: commentKeys.list(postId) }, (prev: PostComments) => {
        return {
          ...prev,
          comments: prev.comments.map((comment) => {
            if (comment.id === variables.id) return variables
            return comment
          }),
        }
      })
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    },
  })
}

export const useLikeComment = (postId: Post["id"]) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, likes }: LikeCommentProps) =>
      fetcher<string>({
        url: `/comments/${commentId}`,
        method: "PATCH",
        data: { likes: likes + 1 },
      }),
    onSuccess: (data: string, variables: LikeCommentProps, context: unknown) => {
      queryClient.setQueriesData({ queryKey: commentKeys.list(postId) }, (prev: PostComments) => {
        return {
          ...prev,
          comments: prev.comments.map((comment) => {
            if (comment.id === variables.commentId) return { ...comment, likes: comment.likes + 1 }
            return comment
          }),
        }
      })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
  })
}

export const useDeleteComment = (postId: Post["id"]) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId) =>
      fetcher({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
    onSuccess: (data: Comment, variables: void, context: unknown) => {
      queryClient.setQueriesData({ queryKey: commentKeys.list(postId) }, (prev: PostComments) => {
        return {
          ...prev,
          comments: prev.comments.filter((comment) => {
            if (comment.id === data.id) return false
            return true
          }),
        }
      })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })
}
