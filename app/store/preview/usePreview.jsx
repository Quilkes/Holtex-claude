import { create } from "zustand";

const usePreview = create((set) => ({
  url: "",
  setUrl: (string) => set({ url: string }),
}));

export default usePreview;
