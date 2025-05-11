"use client";

import { api } from "@/convex/_generated/api";
import useSidebar from "@/app/store/sidebar";
import { useConvex, useMutation } from "convex/react";
import Link from "next/link";
import { Trash, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import useMediaQuery from "@/app/store/useMediaQuery";
import useWorkspace from "@/app/store/useWorkspace";
import useCredentials from "@/app/store/useCredentials";
import ChatHistoryLoader from "@/app/utils/loaders/ChatHistoryLoader";

function WorkspaceHistory() {
  const { setSideBar, setSmSidebar } = useSidebar();
  const { userDetail } = useCredentials();
  const convex = useConvex();
  const {
    setIsModalOpen,
    setSelectedWorkspaceId,
    groupedWorkspaces,
    setGroupedWorkspaces,
  } = useWorkspace();
  const { isMobile } = useMediaQuery();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSidebar = () => {
    setSideBar(false);
  };

  const handleToggleSmSidebar = () => {
    setSmSidebar(false);
  };

  useEffect(() => {
    if (userDetail) {
      GetAllWorkspace();
    }

    // Add event listener for workspace deletion
    const handleWorkspaceDeleted = () => {
      GetAllWorkspace();
    };

    window.addEventListener("workspace-deleted", handleWorkspaceDeleted);

    // Cleanup
    return () => {
      window.removeEventListener("workspace-deleted", handleWorkspaceDeleted);
    };
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    try {
      setIsLoading(true);
      const result = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetail._id,
      });

      // Group workspaces by date
      groupWorkspacesByDate(result);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsLoading(false);
    }
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
      // Assuming workspace has a _creationTime field
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

  const renderWorkspaceGroup = (workspaces, title) => {
    if (!workspaces || workspaces.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="mb-2 text-xs font-semibold text-gray-400">{title}</h3>
        {workspaces.map((workspace, index) => (
          <div
            onClick={isMobile ? handleToggleSmSidebar : handleToggleSidebar}
            key={index}
            className="relative flex items-center justify-between px-1 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 group"
          >
            <Link
              href={"/workspace/" + workspace?._id}
              key={index}
              className="w-full"
            >
              <div className="flex items-center justify-between w-full">
                <h2 className="text-sm text-gray-700 dark:text-gray-300 mt-2 cursor-pointer truncate max-w-[90%]">
                  {workspace?.messages[0]?.content}
                </h2>
              </div>
            </Link>

            {/* Delete Button (outside Link) */}
            <button
              onClick={(event) => {
                event.stopPropagation();
                setSelectedWorkspaceId(workspace._id);
                setIsModalOpen(true);
              }}
              className="absolute px-2 text-sm text-red-500 transition-opacity duration-200 -translate-y-1/2 opacity-0 cursor-pointer hover:text-red-700 group-hover:opacity-100 right-1 top-1/2"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      {isLoading ? (
        <ChatHistoryLoader />
      ) : (
        <>
          {renderWorkspaceGroup(groupedWorkspaces.today, "Today")}
          {renderWorkspaceGroup(groupedWorkspaces.yesterday, "Yesterday")}
          {renderWorkspaceGroup(groupedWorkspaces.lastWeek, "Last 7 Days")}
          {renderWorkspaceGroup(groupedWorkspaces.older, "Older")}

          {Object.values(groupedWorkspaces).every(
            (group) => group.length === 0
          ) && <p className="text-sm text-gray-700">No chat history found</p>}
        </>
      )}
    </div>
  );
}

export default WorkspaceHistory;
