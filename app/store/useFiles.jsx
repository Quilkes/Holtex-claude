import { create } from "zustand";

const useFiles = create((set) => ({
  files: [],
  setFiles: (newFiles) => set({ files: newFiles }),
  llmMessages: [],
  setLlmMessages: (newLlmMessages) => set({ llmMessages: newLlmMessages }),
  steps: [],
  setSteps: (newSteps) => set({ steps: newSteps }),
  templateSet: false,
  setTemplateSet: (bool) => set({ templateSet: bool }),
  currentStep: 1,
  setCurrentStep: (stepId) => set({ currentStep: stepId }),

  isLoading: true,
  setIsLoading: (bool) => set({ isLoading: bool }),
  isDownloadingZipFile: false,
  setIsDownloadingZipFile: (bool) => set({ isDownloadingZipFile: bool }),
  fileFromDbLoading: false,
  setFileFromDbLoading: (bool) => set({ fileFromDbLoading: bool }),

  // Fixed parameter check and handling for arrays
  addFile: (file) =>
    set((state) => ({
      files: Array.isArray(file)
        ? [...state.files, ...file]
        : [...state.files, file],
    })),
  addLLMMessages: (llmFile) =>
    set((state) => ({
      llmMessages: Array.isArray(llmFile)
        ? [...state.llmMessages, ...llmFile]
        : [...state.llmMessages, llmFile],
    })),
  addSteps: (step) =>
    set((state) => ({
      steps: Array.isArray(step)
        ? [...state.steps, ...step]
        : [...state.steps, step],
    })),

  // New function to update steps status (e.g., from "pending" to "completed")
  updateStepsStatus: (status, condition) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        condition(step) ? { ...step, status } : step
      ),
    })),

  // Clear all Files
  clearFiles: () => set({ files: [] }),
}));

export default useFiles;
