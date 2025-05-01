import { create } from "zustand"
import { User } from "./types"

// 상태 인터페이스 정의
interface UserState {
  showUserModal: boolean
  selectedUser: User | null
}

// 액션 인터페이스 정의
interface UserActions {
  setShowUserModal: (show: boolean) => void
  setSelectedUser: (user: User) => void
}

// 전체 스토어 타입 정의
type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>((set) => ({
  showUserModal: false,
  setShowUserModal: (show: boolean) => set((state) => ({ ...state, showUserModal: show })),
  selectedUser: null,
  setSelectedUser: (user: User) => set((state) => ({ ...state, selectedUser: user })),
}))
