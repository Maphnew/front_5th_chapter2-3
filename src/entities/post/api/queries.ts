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

export const usePostsQuery = () => {
  const limit = usePaginationStore((state) => state.limit)
  const skip = usePaginationStore((state) => state.skip)
  const selectedTag = usePostStore((state) => state.selectedTag)
  const searchQuery = usePaginationStore((state) => state.searchQuery)
  const sortBy = usePaginationStore((state) => state.sortBy)
  const sortOrder = usePaginationStore((state) => state.sortOrder)

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
        url: selectedTag ? `posts/tag/${selectedTag}` : "posts/tags",
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

  const sortedPosts = [...postsWithUsers].sort((a, b) => {
    if (!sortBy || sortBy === "none") return 0

    let valA, valB

    if (sortBy === "id") {
      valA = a.id
      valB = b.id
    } else if (sortBy === "title") {
      valA = a.title
      valB = b.title
    } else if (sortBy === "reactions") {
      valA = a.reactions?.likes || 0
      valB = b.reactions?.likes || 0
    } else {
      return 0
    }

    if (sortOrder === "asc") {
      return valA > valB ? 1 : -1
    } else {
      return valA < valB ? 1 : -1
    }
  })

  return {
    posts: sortedPosts,
    total: activeQuery.data?.total || 0,
    isLoading: activeQuery.isLoading || usersQuery.isLoading,
    isError: activeQuery.isError || usersQuery.isError,
    error: activeQuery.error || usersQuery.error,
    searchPosts: performSearch,
    refetch: activeQuery.refetch,
  }
}
