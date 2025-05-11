"use client";

import React, { useEffect } from "react";
import useSidebar from "@/app/store/sidebar";
import { SidebarClose } from "lucide-react";
import useMediaQuery from "@/app/store/useMediaQuery";
import { motion } from "framer-motion";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const Header = () => {
  const { setSideBar, sideBar, smSideBar, setSmSidebar, isOpen, setIsOpen } =
    useSidebar();
  const { isMobile, setIsMobile } = useMediaQuery();

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
    <div className="px-4 py-2 flex relative justify-between items-center z-30 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="flex items-center">
        {!sideBar && (
          <Link href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300">
                HOLTEX AI
              </h1>
            </motion.div>
          </Link>
        )}
      </div>

      <div className="flex gap-3 h-10 items-center">
        <div>
          <SignedOut>
            <SignInButton>
              <button className="hidden md:inline-block px-5 py-1 text-purple-600 hover:text-white font-medium rounded-md border hover:bg-purple-700">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div
              className="flex gap-1 items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer h-6 w-6 transition-colors"
              onClick={handleToggle}
            >
              <SidebarClose className="w-6 h-6" />
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Header;
