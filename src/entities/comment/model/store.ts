import { create } from "zustand";

const useCommentStore = create((set) => {
    comments: [],
    addComment: (comment) => set((state) => ({
        ...state,
        [comment.postId]: [...(state[comment.postId] || []), comment]
    }))
})