import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { commentKeys } from "./queries"
import { Comment, CommentAddDTO } from "../model/types"
import { LikeCommentProps } from "../model/types"
import { Post, PostComments } from "../../post/model"

const erroMessage = "API 데이터에 해당 댓글이 존재하지 않습니다. (하지만 앱 작동을 위해 캐시 데이터는 수정됩니다)"

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
    onError: (error: Error, variables: CommentAddDTO, context: unknown) => {
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
    onError: (error: Error, variables: Comment, context: unknown) => {
      queryClient.setQueriesData({ queryKey: commentKeys.list(postId) }, (prev: PostComments) => {
        return {
          ...prev,
          comments: prev.comments.map((comment) => {
            if (comment.id === variables.id) return variables
            return comment
          }),
        }
      })
      console.error("댓글 업데이트 오류:" + erroMessage, error)
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
    onError: (error: Error, variables: LikeCommentProps, context: unknown) => {
      queryClient.setQueriesData({ queryKey: commentKeys.list(postId) }, (prev: PostComments) => {
        return {
          ...prev,
          comments: prev.comments.map((comment) => {
            if (comment.id === variables.commentId) return { ...comment, likes: comment.likes ? comment.likes + 1 : 1 }
            return comment
          }),
        }
      })
      console.error("댓글 좋아요 오류:" + erroMessage, error)
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
    onError: (error: Error, variables: number | void, context: unknown) => {
      queryClient.setQueriesData({ queryKey: commentKeys.list(postId) }, (prev: PostComments) => {
        return {
          ...prev,
          comments: prev.comments.filter((comment) => {
            if (comment.id === variables) return false
            return true
          }),
        }
      })
      console.error("댓글 삭제 오류:" + erroMessage, error)
    },
  })
}
