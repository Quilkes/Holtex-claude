import { UserDetailContext } from "@/app/context/UserDetailContext";
import useSidebar from "../store/sidebar";
import useMediaQuery from "../store/useMediaQuery";
import useMessage from "../store/useMessage";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "sonner";

export default function Logout() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const { setMessages } = useMessage();
  const { isMobile } = useMediaQuery();
  const {
    sideBar,
    setSideBar,
    setSmSidebar,
    showLogoutModal,
    setShowLogoutModal,
  } = useSidebar();

  const handleToggleSidebar = () => {
    isMobile ? setSmSidebar(false) : setSideBar(!sideBar);
  };

  const handleLogout = () => {
    toast.success("Signed Out Successfully");
    handleToggleSidebar();
    setShowLogoutModal(false);
    localStorage.clear();
    setUserDetail(null);
    setMessages(null);
    router.push("/home");
  };

  return (
    <>
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 text-sm bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md cursor-pointer hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
