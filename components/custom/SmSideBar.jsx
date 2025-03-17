import useSidebar from "@/store/sidebar";
import { MessageCircleCode, SidebarCloseIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import WorkspaceHistory from "../WorkspaceHistory";
import UserDropdown from "./UserDropdown";
import Link from "next/link";

export default function SmSideBar() {
  const { smSideBar, setSmSidebar } = useSidebar();

  const handleToggleSmSidebar = () => {
    setSmSidebar(false);
  };
  return (
    <div
      className={`h-screen bg-slate-100 md:hidden border-r shadow-sm transition-all duration-300 ${
        smSideBar ? "w-[250px] opacity-100 delay-300" : "w-0 opacity-0"
      }`}
    >
      <div
        className={`h-full flex flex-col transition-opacity duration-300 ${
          smSideBar ? "opacity-100 delay-500" : "opacity-0"
        }`}
      >
        {smSideBar && (
          <>
            {/* Header */}
            <div className="p-5 pb-0 relative">
              <div className="flex items-center justify-between">
                <Image src={"/logo.png"} alt="logo" width={30} height={30} />
                <SidebarCloseIcon
                  onClick={handleToggleSmSidebar}
                  className="cursor-pointer text-slate-500"
                />
              </div>
              <Link href={"/"} className="mt-3 w-full block">
                <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-slate-100 hover:border-purple-500 border hover:text-purple-500 transition-colors">
                  <MessageCircleCode /> New Chat
                </button>
              </Link>
            </div>

            {/* Content */}

            <div className="flex-grow overflow-auto px-3">
              <div className="py-2">
                <WorkspaceHistory />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t">
              <UserDropdown />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
