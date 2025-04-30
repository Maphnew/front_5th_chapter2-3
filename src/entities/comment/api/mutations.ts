import { useMutation } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { commentKeys } from "./queries"
import { Comment, CommentAddDTO } from "../../../entities/comment/model"
import { LikeCommentProps } from "../model"
import { queryClient } from "../../../shared/api/queryClient"
import { Post } from "../../post/model"

export const useAddComment = (postId: Post["id"]) => {
  return useMutation({
    mutationFn: (newComment: CommentAddDTO) =>
      fetcher({
        url: "/comments/add",
        method: "POST",
        data: newComment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    }
  })
}

export const useUpdateComment = (postId: Post["id"]) => {
  return useMutation<string, Error, Comment>({
    mutationFn: (selectedComment: Comment) => fetcher<string>({
      url: `/comments/${selectedComment.id}`,
      method: "PUT",
      data: {body: selectedComment.body},
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    }
  })
}

export const useLikeComment = (postId: Post["id"]) => {
  return useMutation({
    mutationFn: ({ commentId, comment }: LikeCommentProps) =>
      fetcher<string>({
        url: `/comments/${commentId}`,
        method: "PATCH",
        data: { likes: comment.likes + 1 },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    }
  })
}

export const useDeleteComment = (postId: Post["id"]) => {
  return useMutation({
    mutationFn: (commentId) =>
      fetcher({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    }
  })
}
