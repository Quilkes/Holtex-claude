import { UserDetailContext } from "@/app/context/UserDetailContext";
import useWorkspace from "@/store/useWorkspace";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import React, { useContext } from "react";
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
  const { userDetail } = useContext(UserDetailContext);

  const handleDelete = async (workspaceId) => {
    try {
      setIsLoading(true);
      await deleteWorkspace({ workspaceId, uuid: userDetail._id });
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

      // Add this to trigger a refresh from the backend
      if (typeof window !== "undefined") {
        // Force a re-fetch by dispatching a custom event
        window.dispatchEvent(new Event("workspace-deleted"));
      }
    } catch (error) {
      toast.error("Fail to delete project, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed top-0 left-0 h-full w-full z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this workspace?
            </p>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedWorkspaceId) {
                    handleDelete(selectedWorkspaceId);
                    setIsModalOpen(false);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
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
