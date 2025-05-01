import { usePostStore } from "../../../entities/post/model/store"
import { usePaginationStore } from "../../../features/pagination/model/store"

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"

export const Pagination = () => {
  const limit = usePaginationStore((state) => state.limit)
  const setLimit = usePaginationStore((state) => state.setLimit)
  const skip = usePaginationStore((state) => state.skip)
  const setSkip = usePaginationStore((state) => state.setSkip)
  const total = usePostStore((state) => state.total)
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value: string) => setLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  )
}
