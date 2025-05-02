import { useQuery } from "@tanstack/react-query"
import { fetcher } from "../../../shared/api/baseQueries"
import { Tag } from "../../post/model/types"

export const useTags = () => {
  return useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () =>
      fetcher<Tag[]>({
        url: "/posts/tags",
        method: "GET",
      }),
  })
}
