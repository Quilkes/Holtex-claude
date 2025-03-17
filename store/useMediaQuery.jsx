import { create } from "zustand";

const useMediaQuery = create((set) => ({
  isMobile: false,
  setIsMobile: (bool) => set({ isMobile: bool }),
}));

export default useMediaQuery;
