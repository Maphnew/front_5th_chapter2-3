import { useQuery } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { Post, PostComments } from "../../post/model/types"

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (postId: Post["id"]) => [...commentKeys.lists(), postId] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
}

export const useComments = (postId: Post["id"]) => {
  return useQuery<PostComments>({
    queryKey: commentKeys.list(postId),
    queryFn: async () => {
      const comments = await fetcher<PostComments>({
        url: `/comments/post/${postId}`,
        method: "GET",
      })
      return comments
    },
  })
}
