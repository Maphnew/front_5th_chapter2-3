import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { postKeys } from "./queries"
import { Post, Posts } from "../model/types"
import { usePostStore } from "../model/store"
import { usePaginationStore } from "../../../features/pagination/model/store"

export const useAddPost = () => {
  const total = usePostStore((state) => state.total)
  const setTotal = usePostStore((state) => state.setTotal)

  const limit = usePaginationStore((state) => state.limit)
  const skip = usePaginationStore((state) => state.skip)
  const newPost = usePostStore((state) => state.newPost)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetcher({
        url: "/posts/add",
        method: "POST",
        data: newPost,
      }) as Promise<Post>,
    onSuccess: (data: Post) => {
      queryClient.setQueriesData({ queryKey: postKeys.list(limit, skip) }, (prev: Posts) => {
        setTotal(total + 1)
        return { ...prev, posts: [{ ...data, key: total + 1, id: total + 1 }, ...prev.posts] }
      })
    },
  })
}

export const useUpdatePost = () => {
  const limit = usePaginationStore((state) => state.limit)
  const skip = usePaginationStore((state) => state.skip)
  const selectedPost = usePostStore((state) => state.selectedPost)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetcher<Post>({
        url: `/posts/${selectedPost ? selectedPost.id : 0}`,
        method: "PUT",
        data: selectedPost,
      }),
    onSuccess: (data: Post) => {
      queryClient.setQueriesData({ queryKey: postKeys.list(limit, skip) }, (prev: Posts) => {
        console.log(prev, data)
        const posts = prev.posts.map((post) =>
          post.id === data.id ? { ...post, title: data.title, body: data.body } : post,
        )
        return { ...prev, posts: posts }
      })
    },
  })
}

export const useDeletePost = () => {
  const limit = usePaginationStore((state) => state.limit)
  const skip = usePaginationStore((state) => state.skip)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: Post["id"]) =>
      fetcher<Post>({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
    onSuccess: (data: Post) => {
      queryClient.setQueriesData({ queryKey: postKeys.list(limit, skip) }, (prev: Posts) => {
        return { ...prev, posts: prev.posts.filter((post) => post.id !== data.id) }
      })
    },
  })
}
