"use client";
import { SidebarCloseIcon } from "lucide-react";
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
import { useContext } from "react";
import { UserDetailContext } from "../context/UserDetailContext";

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
  const pathname = usePathname();
  const isWorkspaceRoute = pathname.startsWith("/workspace/");
  const { userDetail } = useContext(UserDetailContext);

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
        className={`h-full bg-gray-50 border-r border-gray-200 z-50 hidden md:block  transition-all duration-300 ${
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
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <Link href="/home" className="flex items-center">
                    <h1 className="text-xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                      HOLTEX AI
                    </h1>
                  </Link>
                  {!isWorkspaceRoute && (
                    <button
                      onClick={handleToggleSidebar}
                      className="mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-2"
                    >
                      <SidebarCloseIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* New Chat Button */}
              <Link href={"/home"} className="px-4 pt-4">
                <button className="flex items-center w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors">
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
                  className="flex items-center pl-2 bg-gray-100 hover:bg-gray-200 rounded-lg p-2 w-full text-gray-600 hover:text-gray-800 mb-4"
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
              <div className="flex-grow overflow-auto px-3">
                <div className="space-y-1 pl-2">
                  <WorkspaceHistory />
                </div>
              </div>

              {/* User Profile Section */}
              <div className="mt-auto border-t border-gray-200 p-3">
                <div
                  className="flex items-center cursor-pointer justify-between"
                  onClick={() => setOpenUserDropDown(true)}
                >
                  <div className="flex items-center">
                    {userDetail ? (
                      <Image
                        src={userDetail?.picture}
                        alt="user"
                        width={30}
                        height={30}
                        className="rounded-md mr-3 w-[30px] h-[30px]"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-blue-500 text-white rounded-md flex items-center justify-center mr-3">
                        <span className="font-medium">O</span>
                      </div>
                    )}
                    <div>
                      <div
                        className="font-medium truncate max-w-[150px]"
                        title={userDetail?.name}
                      >
                        {userDetail?.name}
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
        className={`fixed  inset-y-0 left-0 z-[100] md:${isWorkspaceRoute ? "block" : "hidden"} bg-gray-50  border-r border-gray-200  transition-transform duration-300 w-[270px] ${
          smSideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b  border-gray-200">
              <div className="flex justify-between items-center">
                <Link href="/home" className="flex items-center">
                  <h1 className="text-xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                    HOLTEX AI
                  </h1>
                </Link>
              </div>
            </div>

            {/* New Chat Button */}
            <Link href={"/home"} className="px-4 pt-4">
              <button className="flex items-center w-full p-2 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors">
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
            <Link href={"/recents"} className="px-4 py-0.5">
              <button
                onClick={() => setSmSidebar(false)}
                className="flex items-center pl-2  hover:bg-gray-200 rounded-lg p-2 w-full text-gray-600 hover:text-gray-800 mb-4"
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
            <div className="flex-grow overflow-auto px-3">
              <div className="space-y-1 pl-2">
                <WorkspaceHistory />
              </div>
            </div>

            {/* User Profile Section */}
            <div className="mt-auto border-t border-gray-200 p-3">
              <div
                className="flex items-center cursor-pointer justify-between"
                onClick={() => setOpenUserDropDown(true)}
              >
                <div className="flex items-center">
                  {userDetail ? (
                    <Image
                      src={userDetail?.picture}
                      alt="user"
                      width={30}
                      height={30}
                      className="rounded-md mr-3 w-[30px] h-[30px]"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-blue-500 text-white rounded-md flex items-center justify-center mr-3">
                      <span className="font-medium">O</span>
                    </div>
                  )}
                  <div>
                    <div
                      className="font-medium truncate max-w-[150px]"
                      title={userDetail?.name}
                    >
                      {userDetail?.name}
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
      {smFileBar && (
        <div
          className={`fixed inset-0 bg-black/30 z-40 md:${isWorkspaceRoute ? "block" : "hidden"}`}
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
