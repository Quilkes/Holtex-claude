import { create } from "zustand";

const useSidebar = create((set) => ({
  smFileBar: false,
  setSmFileBar: (bool) => set({ smFileBar: bool }),
  sideBar: false,
  setSideBar: (bool) => set({ sideBar: bool }),
  smSideBar: false,
  setSmSidebar: (bool) => set({ smSideBar: bool }),
  showLogoutModal: false,
  setShowLogoutModal: (bool) => set({ showLogoutModal: bool }),
}));

export default useSidebar;
