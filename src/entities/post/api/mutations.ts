import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { postKeys } from "./queries"
import { Post } from "../model/types"

export const useAddPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newPost) => {
      return fetcher({
        url: "/posts/add",
        method: "POST",
        data: newPost,
      })
    },
    onSuccess: (data: Post, variables: void, context: unknown) => {
      queryClient.setQueriesData({ queryKey: postKeys.all }, (prev: Post[]) => {
        console.log()
        return [{ ...data, id: prev.length + 1 }, ...prev]
      })
    },
  })
}
