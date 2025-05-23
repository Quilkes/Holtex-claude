"use client";

import useSidebar from "../store/sidebar";
import useMediaQuery from "../store/useMediaQuery";
import useMessage from "../store/useMessage";
import React, { useState } from "react";
import { toast } from "sonner";
import useCredentials from "../store/useCredentials";
import { useClerk } from "@clerk/nextjs";
import { Loader } from "../utils/loaders/loader";

export default function Logout() {
  const { signOut } = useClerk();
  const { setUserDetail } = useCredentials();
  const { setMessages } = useMessage();
  const { isMobile } = useMediaQuery();
  const {
    sideBar,
    setSideBar,
    setSmSidebar,
    showLogoutModal,
    setShowLogoutModal,
  } = useSidebar();
  const [logoutOverlay, setLogoutOverlay] = useState(false);

  const handleToggleSidebar = () => {
    isMobile ? setSmSidebar(false) : setSideBar(!sideBar);
  };

  const handleLogout = async () => {
    try {
      setLogoutOverlay(true);

      // Add a delay to ensure the overlay is visible
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear user data first
      setUserDetail(null);
      setMessages(null);
      handleToggleSidebar();
      setShowLogoutModal(false);

      toast.success("Signed Out Successfully");

      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error(error.message);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLogoutOverlay(false);
    }
  };

  return (
    <>
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-700 dark:border dark:border-gray-400 w-80">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 text-sm bg-gray-200 rounded-md cursor-pointer dark:border dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-300"
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

      {logoutOverlay && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex justify-center items-center z-[200]">
          <div className="text-center">
            <Loader width={12} />
            <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
              Signing Out...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
