import { useQuery } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { Post } from "../model/types"
import { fetchUsers } from "../../user/api/fetchUsers"

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (postId: Post["id"]) => [...postKeys.lists(), postId] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

export const usePosts = (limit: string, skip: string) => {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: async () => {
      const posts = await fetcher<Post[]>({
        url: `/posts?limit=${limit}&skip=${skip}`,
        method: "GET",
      })
      const users = await fetchUsers()
      return posts.posts.map((post) => ({
        ...post,
        author: users.users.find((user) => user.id === post.userId),
      }))
    },
  })
}
