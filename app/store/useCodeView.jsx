import { create } from "zustand";

const useCodeView = create((set) => ({
  selectedFile: null,
  setSelectedFile: (e) => set({ selectedFile: e }),
  activeTab: "code",
  setActiveTab: (e) => set({ activeTab: e }),
}));

export default useCodeView;
