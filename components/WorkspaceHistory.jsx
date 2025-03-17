"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import useSidebar from "@/store/sidebar";
import { useConvex, useMutation } from "convex/react";
import Link from "next/link";
import { Trash } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import useMediaQuery from "@/store/useMediaQuery";
import useWorkspace from "@/store/useWorkspace";

function WorkspaceHistory() {
  const { setSideBar, setSmSidebar } = useSidebar();
  const { userDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const {
    setIsModalOpen,
    setSelectedWorkspaceId,
    groupedWorkspaces,
    setGroupedWorkspaces,
  } = useWorkspace();
  const { isMobile } = useMediaQuery();

  const handleToggleSidebar = () => {
    setSideBar(false);
  };

  const handleToggleSmSidebar = () => {
    setSmSidebar(false);
  };

  useEffect(() => {
    userDetail && GetAllWorkspace();

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
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail._id,
    });

    // Group workspaces by date
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
        <h3 className="text-xs font-semibold text-gray-400 mb-2">{title}</h3>
        {workspaces.map((workspace, index) => (
          <div
            onClick={isMobile ? handleToggleSmSidebar : handleToggleSidebar}
            key={index}
            className="flex justify-between  items-center hover:bg-slate-200 rounded-md px-1 py-1 group relative"
          >
            <Link
              href={"/workspace/" + workspace?._id}
              key={index}
              className="w-full"
            >
              <div className="flex items-center justify-between w-full">
                <h2 className="text-sm text-gray-700 mt-2 cursor-pointer truncate max-w-[90%]">
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
              className="text-red-500 hover:text-red-700 text-sm px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-2">
      <h2 className="font-medium text-lg mb-4">Your Recents Chat</h2>

      {renderWorkspaceGroup(groupedWorkspaces.today, "Today")}
      {renderWorkspaceGroup(groupedWorkspaces.yesterday, "Yesterday")}
      {renderWorkspaceGroup(groupedWorkspaces.lastWeek, "Last 7 Days")}
      {renderWorkspaceGroup(groupedWorkspaces.older, "Older")}

      {Object.values(groupedWorkspaces).every(
        (group) => group.length === 0
      ) && <p className="text-sm text-gray-700">No chat history found</p>}
    </div>
  );
}

export default WorkspaceHistory;
