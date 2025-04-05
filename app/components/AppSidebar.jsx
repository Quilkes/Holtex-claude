"use client";
import { MessageCircleCode, SidebarCloseIcon } from "lucide-react";
import Image from "next/image";
import WorkspaceHistory from "./WorkspaceHistory";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";
import useSidebar from "../store/sidebar";
import DeleteModal from "./DeleteModal";
import Logout from "./Logout";
import { FileExplorer } from "./FileExplorer";
import useFiles from "../store/useFiles";

const AppSidebar = ({ children }) => {
  const {
    setSideBar,
    sideBar,
    smSideBar,
    setSmSidebar,
    smFileBar,
    setSmFileBar,
  } = useSidebar();
  const { files } = useFiles();
  const pathname = usePathname();
  const isWorkspaceRoute = pathname.startsWith("/workspace/");

  const handleToggleSidebar = () => {
    setSideBar(!sideBar);
  };

  const handleToggleSmSidebar = () => {
    setSmSidebar(!smSideBar);
  };

  const handleFilesSmbar = () => {
    setSmFileBar(!smFileBar);
  };

  return (
    <>
      {/* Desktop Sidebar - pushes content when opened */}
      <div
        className={`h-full bg-white z-50 hidden md:block border-r-[0.5px] border-slate-200 transition-all duration-300 ${
          sideBar ? "w-[250px]" : "w-0"
        }`}
      >
        <div
          className={`h-full flex flex-col transition-opacity duration-300 ${
            sideBar ? "opacity-100 delay-100" : "opacity-0"
          }`}
        >
          {sideBar && (
            <>
              {/* Sidebar Header */}
              <div className="p-5 pb-0 relative">
                <div className="flex items-center justify-between">
                  <span />
                  <SidebarCloseIcon
                    onClick={handleToggleSidebar}
                    className="cursor-pointer text-slate-400"
                  />
                </div>
                <Link href={"/home"} className="mt-3 w-full block">
                  <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-slate-100 hover:border-purple-500 border hover:text-purple-500 transition-colors">
                    <MessageCircleCode /> New Chat
                  </button>
                </Link>
              </div>

              {/* Sidebar Content */}
              <div className="flex-grow overflow-auto px-3">
                <div className="py-2">
                  <WorkspaceHistory />
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="mt-auto border-t-[0.5px] border-slate-200">
                <UserDropdown />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidebar - floating over content */}
      <div
        className={`fixed  inset-y-0 left-0 z-50 md:${isWorkspaceRoute ? "block" : "hidden"} bg-white border-r-[0.5px] border-slate-200 transition-transform duration-300 w-[250px] ${
          smSideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Sidebar Header */}
          <div className="p-5 pb-0 relative">
            <div className="flex items-center justify-between">
              <span />
              <SidebarCloseIcon
                onClick={handleToggleSmSidebar}
                className="cursor-pointer text-slate-500"
              />
            </div>
            <Link href={"/home"} className="mt-3 w-full block">
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-slate-100 hover:border-purple-500 border hover:text-purple-500 transition-colors">
                <MessageCircleCode /> New Chat
              </button>
            </Link>
          </div>

          {/* Mobile Sidebar Content */}
          <div className="flex-grow overflow-auto px-3">
            <div className="py-2">
              <WorkspaceHistory />
            </div>
          </div>

          {/* Mobile Sidebar Footer */}
          <div className="mt-auto border-t-[0.5px] border-slate-200">
            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop/overlay */}
      {smSideBar && (
        <div
          className={`fixed inset-0 bg-black/30 z-40 md:${isWorkspaceRoute ? "block" : "hidden"}`}
          onClick={handleToggleSmSidebar}
        />
      )}

      {/* Mobile File explorer */}
      <div
        className={`fixed inset-y-0 left-0 z-[100] md:hidden bg-white transition-transform duration-300 w-[250px] ${
          smFileBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full h-full border-r border-gray-200 overflow-y-auto">
          <FileExplorer
            // isWebContainerLoading={isWebContainerLoading}
            files={files}
          />
        </div>
      </div>

      {smFileBar && (
        <div
          className={`fixed inset-0 bg-black/30 z-40 md:${isWorkspaceRoute ? "block" : "hidden"}`}
          onClick={handleFilesSmbar}
        />
      )}

      {/* Delete workspace button */}
      <DeleteModal />
      <Logout />
      {/* Logout modal */}
    </>
  );
};

export default AppSidebar;
