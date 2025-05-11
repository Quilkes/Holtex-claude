import useCredentials from "@/app/store/useCredentials";
import useWorkspace from "@/app/store/useWorkspace";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import React from "react";
import { toast } from "sonner";

export default function DeleteModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    isLoading,
    setIsLoading,
    selectedWorkspaceId,
    setGroupedWorkspaces,
  } = useWorkspace();
  const deleteWorkspace = useMutation(api.workspace.DeleteWorkspace);
  const { userDetail } = useCredentials();

  const handleDelete = async (workspaceId) => {
    try {
      setIsLoading(true);

      await deleteWorkspace({
        workspaceId,
        uuid: userDetail._id,
      });

      toast.success("Workspace deleted successfully!");

      // Update local state
      setGroupedWorkspaces((prev) => {
        const updated = {
          today: prev.today.filter((ws) => ws._id !== workspaceId),
          yesterday: prev.yesterday.filter((ws) => ws._id !== workspaceId),
          lastWeek: prev.lastWeek.filter((ws) => ws._id !== workspaceId),
          older: prev.older.filter((ws) => ws._id !== workspaceId),
        };
        return updated;
      });

      // Trigger a refresh from the backend
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("workspace-deleted"));
      }
    } catch (error) {
      console.error("Delete workspace error:", error);
      toast.error(
        "Failed to delete workspace: " + (error.message || "Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed top-0 left-0 h-full w-full z-[100] bg-black/40 flex items-center justify-center">
          <div className="p-5 bg-white rounded-lg shadow-lg dark:bg-gray-700 dark:border dark:border-gray-400 w-80">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this workspace?
            </p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded cursor-pointer dark:border dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-300 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedWorkspaceId) {
                    handleDelete(selectedWorkspaceId);
                    setIsModalOpen(false);
                  } else {
                    toast.error("No workspace selected");
                  }
                }}
                className="px-4 py-2 text-white bg-red-600 rounded cursor-pointer hover:bg-red-500"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
