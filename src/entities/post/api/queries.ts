import { useQuery } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { Posts } from "../model/types"
import { usePaginationStore } from "../../../features/pagination/model/store"
import { usePostStore } from "../model/store"
import { Users } from "../../user/model/types"

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (limit: number, skip: number) => [...postKeys.lists(), limit, skip] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string | number) => [...postKeys.details(), id] as const,
  searchs: () => [...postKeys.all, "search"] as const,
  search: (searchQuery: string) => [...postKeys.searchs(), searchQuery] as const,
  tags: () => [...postKeys.all, "tag"] as const,
  tag: (tag: string) => [...postKeys.tags(), tag] as const,
}

export const usePostsQuery = (limit, skip, selectedTag, searchQuery) => {
  const postsQuery = useQuery({
    queryKey: postKeys.list(limit, skip),
    queryFn: () =>
      fetcher<Posts>({
        url: `/posts?limit=${limit}&skip=${skip}`,
        method: "GET",
      }),
  })

  const tagPostQuery = useQuery({
    queryKey: postKeys.tag(selectedTag),
    queryFn: () =>
      fetcher<Posts>({
        url: `posts/tag/${selectedTag}`,
        method: "GET",
      }),
  })

  const searchPostsQuery = useQuery({
    queryKey: postKeys.search(searchQuery),
    queryFn: () =>
      fetcher<Posts>({
        url: `/posts/search?q=${searchQuery}`,
        method: "GET",
      }),
  })

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetcher<Users>({
        url: "/users?limit=0&select=username,image",
        method: "GET",
      }),
  })

  const performSearch = () => {
    if (searchQuery) {
      searchPostsQuery.refetch()
    }
  }

  const getActiveQuery = () => {
    if (searchQuery) return searchPostsQuery
    if (selectedTag && selectedTag !== "all") return tagPostQuery
    return postsQuery
  }

  const activeQuery = getActiveQuery()

  const postsWithUsers =
    activeQuery.data?.posts.map((post) => ({
      ...post,
      author: usersQuery.data?.users?.find((user) => user.id === post.userId),
    })) || []

  return {
    posts: postsWithUsers,
    total: activeQuery.data?.total || 0,
    isLoading: activeQuery.isLoading || usersQuery.isLoading,
    isError: activeQuery.isError || usersQuery.isError,
    error: activeQuery.error || usersQuery.error,
    searchPosts: performSearch,
  }
}
