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
  })
}

export const useUpdateComment = (postId: Post["id"]) => {
  return useMutation<string, Error, Comment>({
    mutationFn: (selectedComment: Comment) =>
      fetcher<string>({
        url: `/comments/${selectedComment.id}`,
        method: "PUT",
        data: selectedComment.body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
  })
}

export const useLikeComment = () => {
  return useMutation({
    mutationFn: ({ commentId, comment }: LikeCommentProps) =>
      fetcher<string>({
        url: `/comments/${commentId}`,
        method: "PATCH",
        data: { likes: comment.likes + 1 },
      }),
    onSuccess: (data: string) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(data) })
    },
  })
}

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (commentId) =>
      fetcher({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() })
    },
  })
}
