import { create } from "zustand";

const useFiles = create((set) => ({
  files: [],
  setFiles: (newFiles) => set({ files: newFiles }),

  // Fixed parameter check and handling for arrays
  addFile: (file) =>
    set((state) => ({
      files: Array.isArray(file)
        ? [...state.files, ...file]
        : [...state.files, file],
    })),

  // Clear all Files
  clearFiles: () => set({ files: [] }),
}));

export default useFiles;
