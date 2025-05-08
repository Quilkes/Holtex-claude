"use client";
import { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import { Trash, Search, Plus } from "lucide-react";
import useSidebar from "@/app/store/sidebar";
import useMediaQuery from "@/app/store/useMediaQuery";
import useWorkspace from "@/app/store/useWorkspace";
import { useUser } from "@clerk/nextjs";

export default function ChatHistory() {
  const { setSideBar, setSmSidebar } = useSidebar();
  const { user } = useUser();
  const convex = useConvex();
  const {
    setIsModalOpen,
    setSelectedWorkspaceId,
    groupedWorkspaces,
    setGroupedWorkspaces,
  } = useWorkspace();
  const { isMobile } = useMediaQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSidebar = () => {
    setSideBar(false);
  };

  const handleToggleSmSidebar = () => {
    setSmSidebar(false);
  };

  useEffect(() => {
    user && getAllWorkspaces();

    const handleWorkspaceDeleted = () => {
      getAllWorkspaces();
    };

    window.addEventListener("workspace-deleted", handleWorkspaceDeleted);

    return () => {
      window.removeEventListener("workspace-deleted", handleWorkspaceDeleted);
    };
  }, [user]);

  const getAllWorkspaces = async () => {
    if (!user?._id) return;

    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: user._id,
    });

    groupWorkspacesByDate(result);
  };

  const groupWorkspacesByDate = (workspaces) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const grouped = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    workspaces.forEach((workspace) => {
      const creationDate = new Date(
        workspace._creationTime || workspace.messages[0]?.timestamp
      );
      creationDate.setHours(0, 0, 0, 0);

      if (creationDate.getTime() === today.getTime()) {
        grouped.today.push(workspace);
      } else if (creationDate.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(workspace);
      } else if (creationDate.getTime() >= lastWeekStart.getTime()) {
        grouped.lastWeek.push(workspace);
      } else {
        grouped.older.push(workspace);
      }
    });

    setGroupedWorkspaces(grouped);
  };

  const filteredWorkspaces = () => {
    if (!searchQuery.trim()) return groupedWorkspaces;

    const filtered = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    Object.keys(groupedWorkspaces).forEach((timeframe) => {
      filtered[timeframe] = groupedWorkspaces[timeframe].filter((workspace) =>
        workspace.messages[0]?.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });

    return filtered;
  };

  const renderWorkspaceGroup = (workspaces, title) => {
    if (!workspaces || workspaces.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-semibold text-gray-500">{title}</h3>
        <div className="space-y-1">
          {workspaces.map((workspace, index) => (
            <div
              onClick={isMobile ? handleToggleSmSidebar : handleToggleSidebar}
              key={index}
              className="relative flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 group"
            >
              <Link
                onClick={handleToggleSmSidebar}
                href={`/workspace/${workspace?._id}`}
                className="w-full"
              >
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-sm text-gray-800 dark:text-gray-400 cursor-pointer truncate max-w-[90%]">
                    {workspace?.messages[0]?.content}
                  </h2>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Last message{" "}
                  {formatTime(
                    workspace._creationTime || workspace.messages[0]?.timestamp
                  )}
                </p>
              </Link>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedWorkspaceId(workspace._id);
                  setIsModalOpen(true);
                }}
                className="absolute px-2 text-sm text-gray-400 transition-opacity duration-200 -translate-y-1/2 opacity-0 cursor-pointer hover:text-red-600 group-hover:opacity-100 right-2 top-1/2"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  const filteredGroups = filteredWorkspaces();
  const noChats = Object.values(filteredGroups).every(
    (group) => group.length === 0
  );

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto dark:bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-medium text-gray-800 dark:text-gray-400 md:text-xl lg:text-3xl">
          Your chat history
        </h1>
        <Link href="/home">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors border rounded-lg dark:text-gray-400 dark:border-gray-400 dark:hover:bg-gray-700 md:text-md lg:text-lg hover:bg-gray-50">
            <Plus size={16} className="text-[#800080]" />
            New chat
          </button>
        </Link>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none left-3">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search your chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {user && !noChats ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You have {countTotalChats(groupedWorkspaces)} previous chats with
            Holtex AI.{" "}
            {/* <button className="text-blue-600 hover:underline">Select</button> */}
          </p>

          <div className="pt-4 mt-6 border-t border-gray-100">
            {renderWorkspaceGroup(filteredGroups.today, "Today")}
            {renderWorkspaceGroup(filteredGroups.yesterday, "Yesterday")}
            {renderWorkspaceGroup(filteredGroups.lastWeek, "Last 7 Days")}
            {renderWorkspaceGroup(filteredGroups.older, "Older")}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No chat history found
          </p>
        </div>
      )}
    </div>
  );
}

function countTotalChats(groupedWorkspaces) {
  return Object.values(groupedWorkspaces).reduce(
    (count, group) => count + group.length,
    0
  );
}
