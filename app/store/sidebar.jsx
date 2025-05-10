import { create } from "zustand";

const useSidebar = create((set) => ({
  isOpen: false,
  setIsOpen: (bool) => set({ isOpen: bool }),
  sideBar: false,
  smFileBar: true,
  setSmFileBar: (bool) => set({ smFileBar: bool }),
  sideBar: false,
  setSideBar: (bool) => set({ sideBar: bool }),
  smSideBar: false,
  setSmSidebar: (bool) => set({ smSideBar: bool }),
  showLogoutModal: false,
  setShowLogoutModal: (bool) => set({ showLogoutModal: bool }),
  openUserDropDown: false,
  setOpenUserDropDown: (bool) => set({ openUserDropDown: bool }),
}));

export default useSidebar;
