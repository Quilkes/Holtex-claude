"use client";

import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import useSidebar from "../store/sidebar";
import { ChevronDown } from "lucide-react";
import useMediaQuery from "../store/useMediaQuery";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const Header = () => {
  const { userDetail } = useContext(UserDetailContext);
  const { setSideBar, sideBar, smSideBar, setSmSidebar } = useSidebar();
  const { isMobile, setIsMobile } = useMediaQuery();
  const [isOpen, setIsOpen] = useState(false);
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

      <>
        {!userDetail ? (
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
              onClick={() => router.push("/auth/sign-in")}
            >
              Sign In
            </button>
          </div>
        ) : (
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleToggle}
          >
            <Image
              src={userDetail?.picture}
              alt="user"
              width={30}
              height={30}
              className="rounded-full w-[30px] h-[30px]"
            />
            <ChevronDown
              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
            />
          </div>
        )}
      </>
    </div>
  );
};

export default Header;
