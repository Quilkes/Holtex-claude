import { create } from "zustand";

const useProjectType = create((set) => ({
  projectType: "",
  setProjectType: (e) => set({ projectType: e }),
}));

export default useProjectType;
