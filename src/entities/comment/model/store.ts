import { create } from "zustand"
import { CommentAddDTO } from "./types"

interface CommentState {
  selectedComment: CommentAddDTO | null
  newComment: CommentAddDTO
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
}

interface CommentActions {
  setSelectedComment: (comment: CommentAddDTO) => void
  setNewComment: {
    (comment: CommentAddDTO): void
    (updater: (prev: CommentAddDTO) => CommentAddDTO): void
  }
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
}

type CommentStore = CommentState & CommentActions

export const useCommentStore = create<CommentStore>((set) => ({
  selectedComment: null,
  setSelectedComment: (comment: CommentAddDTO) => set((state) => ({ ...state, selectedComment: comment })),
  newComment: { body: "", postId: null, userId: 1 },
  setNewComment: (commentOrUpdater: CommentAddDTO | ((prev: CommentAddDTO) => CommentAddDTO)) => {
    set((state) => {
      if (typeof commentOrUpdater === "function") {
        const updatedComment = commentOrUpdater(state.newComment)
        return { ...state, newComment: updatedComment }
      }
      return { ...state, newComment: commentOrUpdater }
    })
  },
  showAddCommentDialog: false,
  setShowAddCommentDialog: (show: boolean) => set((state) => ({ ...state, showAddCommentDialog: show })),
  showEditCommentDialog: false,
  setShowEditCommentDialog: (show: boolean) => set((state) => ({ ...state, showEditCommentDialog: show })),
}))
