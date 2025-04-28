export const fetchPostsWithPagination = async (limit: string | number, skip: string | number) => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  const data = await response.json()
  return data
}
