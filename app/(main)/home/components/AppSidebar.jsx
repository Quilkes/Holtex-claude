"use client";
import { SidebarCloseIcon } from "lucide-react";
import Image from "next/image";
import WorkspaceHistory from "./WorkspaceHistory";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "@/app/components/UserDropdown";
import useSidebar from "@/app/store/sidebar";
import DeleteModal from "../../workspace/[id]/components/DeleteModal";
import Logout from "@/app/components/Logout";
import useMediaQuery from "@/app/store/useMediaQuery";
import { useUser } from "@clerk/nextjs";

const AppSidebar = ({ children }) => {
  const {
    setSideBar,
    openUserDropDown,
    setOpenUserDropDown,
    sideBar,
    smSideBar,
    setSmSidebar,
    smFileBar,
    setSmFileBar,
    isOpen,
    setIsOpen,
  } = useSidebar();
  const { isMobile } = useMediaQuery();
  const pathname = usePathname();
  const isWorkspaceRoute = pathname.startsWith("/workspace/");
  // const { user } = useContext(userContext);
  const { user } = useUser();

  const handleToggleSidebar = () => {
    setSideBar(!sideBar);
    setIsOpen(!isOpen);
  };

  const handleToggleSmSidebar = () => {
    setSmSidebar(!smSideBar);
    setIsOpen(!isOpen);
  };

  const handleFilesSmbar = () => {
    setSmFileBar(!smFileBar);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Sidebar - pushes content when opened */}
      <div
        className={`h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 hidden md:block  transition-all duration-300 ${
          sideBar ? "w-[270px]" : "w-0"
        }`}
      >
        <div
          className={`h-full flex flex-col transition-opacity relative duration-300 ${
            sideBar ? "opacity-100 delay-100" : "opacity-0"
          }`}
        >
          {sideBar && (
            <>
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Link href="/home" className="flex items-center">
                    <h1 className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                      HOLTEX AI
                    </h1>
                  </Link>
                  {!isWorkspaceRoute && (
                    <button
                      onClick={handleToggleSidebar}
                      className="p-2 mr-2 text-gray-500 rounded-full dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <SidebarCloseIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* New Chat Button */}
              <Link href={"/home"} className="px-4 pt-4">
                <button
                  onClick={() => setSideBar(false)}
                  className="flex items-center w-full p-2 text-gray-800 transition-colors bg-gray-100 rounded-lg dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="purple"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>New chat</span>
                </button>
              </Link>

              {/* Chats Navigation */}
              <Link href={"/recents"} className="p-4">
                <button
                  onClick={() => setSideBar(false)}
                  className="flex items-center w-full p-2 text-gray-800 transition-colors bg-gray-100 rounded-lg dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="purple"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Chats</span>
                </button>
              </Link>

              {/* Recents Section */}
              <div
                className="flex-grow px-3  overflow-auto custom-scrollbar"
                style={{
                  "--scrollbar-thumb": "#d1d5db",
                  "--scrollbar-track": "transparent",
                }}
              >
                <div className="pl-2 space-y-1">
                  <WorkspaceHistory />
                </div>
              </div>

              {/* User Profile Section */}
              <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenUserDropDown(true)}
                >
                  <div className="flex items-center">
                    {user ? (
                      <Image
                        src={user?.imageUrl}
                        alt="user"
                        width={30}
                        height={30}
                        className="rounded-md mr-3 w-[30px] h-[30px]"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-blue-500 rounded-md">
                        <span className="font-medium">O</span>
                      </div>
                    )}
                    <div>
                      <div
                        className="font-medium truncate max-w-[150px]"
                        title={user?.fullName}
                      >
                        {user?.fullName}
                      </div>
                      <div className="text-xs text-gray-500">Free plan</div>
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="purple"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {/* Sidebar Footer */}
              <UserDropdown />
              {openUserDropDown && (
                <div
                  className={`fixed inset-0 z-0`}
                  onClick={() => setOpenUserDropDown(false)}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidebar - floating over content */}
      <div
        className={`fixed  inset-y-0 left-0 z-[100] md:${isWorkspaceRoute ? "block" : "hidden"} bg-gray-50 dark:bg-gray-900  border-r dark:border-gray-700 border-gray-200  transition-transform duration-300 w-[270px] ${
          smSideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Link href="/home" className="flex items-center">
                  <h1 className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                    HOLTEX AI
                  </h1>
                </Link>
              </div>
            </div>

            {/* New Chat Button */}
            <Link href={"/home"} className="px-4 pt-4">
              <button
                onClick={() => setSmSidebar(false)}
                className="flex items-center w-full p-2 text-gray-800 transition-colors bg-gray-100 rounded-lg dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="purple"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>New chat</span>
              </button>
            </Link>

            {/* Chats Navigation */}
            <Link href={"/recents"} className="p-4">
              <button
                onClick={() => setSmSidebar(false)}
                className="flex items-center w-full p-2 text-gray-800 transition-colors bg-gray-100 rounded-lg dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="purple"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Chats</span>
              </button>
            </Link>

            {/* Recents Section */}
            <div className="flex-grow px-3 overflow-auto">
              <div className="pl-2 space-y-1">
                <WorkspaceHistory />
              </div>
            </div>

            {/* User Profile Section */}
            <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenUserDropDown(true)}
              >
                <div className="flex items-center">
                  {user ? (
                    <Image
                      src={user?.imageUrl}
                      alt="user"
                      width={30}
                      height={30}
                      className="rounded-md mr-3 w-[30px] h-[30px]"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 mr-3 text-white bg-blue-500 rounded-md">
                      <span className="font-medium">O</span>
                    </div>
                  )}
                  <div>
                    <div
                      className="font-medium truncate max-w-[150px]"
                      title={user?.fullName}
                    >
                      {user?.fullName}
                    </div>
                    <div className="text-xs text-gray-500">Free plan</div>
                  </div>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="purple"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            {/* Sidebar Footer */}
            <UserDropdown />
            {openUserDropDown && (
              <div
                className={`fixed inset-0 z-0`}
                onClick={() => setOpenUserDropDown(false)}
              />
            )}
          </>
        </div>
      </div>

      {/* Mobile sidebar backdrop/overlay */}
      {smSideBar && (
        <div
          className={`fixed inset-0 bg-black/30 z-[90] md:${isWorkspaceRoute ? "block" : "hidden"}`}
          onClick={handleToggleSmSidebar}
        />
      )}

      {/* File Explorer for mobile */}
      {smFileBar && isWorkspaceRoute && (
        <div
          className={`fixed inset-0 bg-black/30 z-40 md:hidden`}
          onClick={handleFilesSmbar}
        />
      )}

      {/* Delete workspace button */}
      <DeleteModal />
      <Logout />
    </>
  );
};

export default AppSidebar;
