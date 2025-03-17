"use client";
import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import useSidebar from "@/store/sidebar";
import { ChevronDown } from "lucide-react";
import useMediaQuery from "@/store/useMediaQuery";

const Header = () => {
  const { userDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const { setSideBar, sideBar, smSideBar, setSmSidebar } = useSidebar();
  const { isMobile, setIsMobile } = useMediaQuery();
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="px-4 py-2 flex relative justify-between bg-white items-center z-30">
      <div className="flex items-center">
        {!sideBar && (
          <span className="font-semibold text-xl text-purple-600">
            Holtex AI
          </span>
        )}
      </div>

      <>
        {!userDetail ? (
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
              onClick={() => setOpenDialog(true)}
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

      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
};

export default Header;
