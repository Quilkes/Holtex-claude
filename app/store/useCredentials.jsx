import { create } from "zustand";

const useCredentials = create((set) => ({
  userDetail: null,
  setUserDetail: (userDetail) => set({ userDetail }),

  // Update specific fields in userDetail
  updateUserDetail: (updates) =>
    set((state) => ({
      userDetail: state.userDetail
        ? { ...state.userDetail, ...updates }
        : updates,
    })),

  // Clear user details (useful for logout)
  clearUserDetail: () => set({ userDetail: null }),
}));

export default useCredentials;
