import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import { Search } from "lucide-react"
import { usePaginationStore } from "../../../features/pagination/model/store"
import { usePostsQuery } from "../../../entities/post/api"
import { usePostStore } from "../../../entities/post/model/store"
import { useTags } from "../../../entities/tag/api/queries"

export const PostSearch = ({ updateURL }: { updateURL: () => void }) => {
  const searchQuery = usePaginationStore((state) => state.searchQuery)
  const sortBy = usePaginationStore((state) => state.sortBy)
  const sortOrder = usePaginationStore((state) => state.sortOrder)

  const setSearchQuery = usePaginationStore((state) => state.setSearchQuery)
  const setSortBy = usePaginationStore((state) => state.setSortBy)
  const setSortOrder = usePaginationStore((state) => state.setSortOrder)

  const { data: tags } = useTags()
  const selectedTag = usePostStore((state) => state.selectedTag)
  const setSelectedTag = usePostStore((state) => state.setSelectedTag)

  const postsQuery = usePostsQuery()

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            onKeyPress={(e) => e.key === "Enter" && postsQuery.refetch()}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={(value) => {
          setSelectedTag(value)
          updateURL()
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {typeof tags === "undefined"
            ? ""
            : tags.map((tag) => (
                <SelectItem key={tag.url} value={tag.slug}>
                  {tag.slug}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
