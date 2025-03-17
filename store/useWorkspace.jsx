import { create } from "zustand";

const useWorkspace = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (bool) => set({ isModalOpen: bool }),
  isLoading: false,
  setIsLoading: (bool) => set({ isLoading: bool }),
  selectedWorkspaceId: null,
  setSelectedWorkspaceId: (e) => set({ selectedWorkspaceId: e }),

  groupedWorkspaces: {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  },
  setGroupedWorkspaces: (newGroupedWorkspaces) =>
    set({ groupedWorkspaces: newGroupedWorkspaces }),
}));

export default useWorkspace;
