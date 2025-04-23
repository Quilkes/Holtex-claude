"use client";

import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import useSidebar from "../store/sidebar";
import { ChevronDown, SidebarClose, SidebarOpenIcon } from "lucide-react";
import useMediaQuery from "../store/useMediaQuery";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const Header = () => {
  const { userDetail } = useContext(UserDetailContext);
  const { setSideBar, sideBar, smSideBar, setSmSidebar, isOpen, setIsOpen } =
    useSidebar();
  const { isMobile, setIsMobile } = useMediaQuery();
  const router = useRouter();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleToggleSmSidebar = () => {
    setSmSidebar(!smSideBar);
  };

  const ToggleSidebar = () => {
    setSideBar(!sideBar);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    isMobile ? handleToggleSmSidebar() : ToggleSidebar();
  };

  return (
    <div className="px-4 py-2 flex relative justify-between items-center z-30">
      <div className="flex items-center">
        {!sideBar && (
          <Link href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                HOLTEX AI
              </h1>
            </motion.div>
          </Link>
        )}
      </div>

      <div className="flex gap-3 h-10 items-center">
        {!userDetail ? (
          <button
            className="px-4 py-2 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
            onClick={() => router.push("/auth/sign-in")}
          >
            Sign In
          </button>
        ) : (
          <div
            className="flex gap-1 items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer h-6 w-6"
            onClick={handleToggle}
          >
            <SidebarClose className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
