import React, { useState } from "react";
import { Rocket, ChevronDown, Check, Loader } from "lucide-react";
import axios from "axios";
import { deploymentOptions } from "../utils/deploymentOption";
import useHomeStore from "../pages/home/useHome";
import Popup from "../utils/Popup";
import { AnimatePresence } from "framer-motion";

export function DeployDropdown({ webContainerRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deployingTo, setDeployingTo] = useState(null);
  const [popup, setPopup] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState({
    status: null,
    url: null,
    error: null,
  });

  // Function to collect files from WebContainer
  const collectFiles = async () => {
    if (!webContainerRef?.current) {
      throw new Error("WebContainer is not initialized");
    }

    const files = {};

    async function traverseDirectory(dir) {
      const entries = await webContainerRef.current.fs.readdir(dir, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
          await traverseDirectory(fullPath);
        } else {
          const content = await webContainerRef.current.fs.readFile(
            fullPath,
            "utf-8"
          );
          // Store relative path (remove leading slash)
          const relativePath = fullPath.startsWith("/")
            ? fullPath.substring(1)
            : fullPath;
          files[relativePath] = content;
        }
      }
    }

    await traverseDirectory("/");
    return files;
  };

  // // Handle deployment to specific platform
  // const handleDeploy = async (platform) => {
  //   if (!user || !currentProjectId) {
  //     setPopup({ type: "error", message: "You must be logged in to deploy" });
  //     return;
  //   }

  //   if (!webContainerRef?.current) {
  //     setPopup({
  //       type: "warning",
  //       message: "Project initialization incomplete",
  //     });
  //     return;
  //   }

  //   setDeployingTo(platform.id);
  //   setDeploymentStatus({ status: null, url: null, error: null });

  //   // try {
  //   //   // Collect all files from WebContainer
  //   //   const files = await collectFiles();

  //   //   // Send deployment request to your backend
  //   //   const response = await axios.post(`${BACKEND_URL}/deploy`, {
  //   //     platform: platform.id,
  //   //     files,
  //   //     projectId: currentProjectId,
  //   //     userId: user.uid,
  //   //     projectType,
  //   //   });

  //   //   // Extract URL from response ensuring consistent naming
  //   //   const deploymentUrl = response.data.url;

  //   //   // Create standardized deployment data structure
  //   //   const deploymentData = {
  //   //     url: deploymentUrl,
  //   //     deployedAt: new Date(),
  //   //     status: "success",
  //   //     ...response.data,
  //   //   };

  //   //   // Update project in Firestore with deployment info
  //   //   const projectRef = doc(
  //   //     db,
  //   //     `users/${user.uid}/${projectType}`,
  //   //     currentProjectId
  //   //   );

  //   //   // Update using the same structure as backend
  //   //   await updateDoc(projectRef, {
  //   //     [`deployments.${platform.id}`]: deploymentData,
  //   //   });

  //   //   // Update UI state
  //   //   setDeploymentStatus({
  //   //     status: "success",
  //   //     url: deploymentUrl,
  //   //     error: null,
  //   //   });

  //   //   // Optional: Open the deployed site in a new tab
  //   //   window.open(deploymentUrl, "_blank");
  //   // } catch (error) {
  //   //   console.error("Deployment failed:", error);

  //   //   // Get specific error message from response if available
  //   //   const errorMessage =
  //   //     error.response?.data?.message || "Deployment failed. Try again.";
  //   //   setPopup({ type: "error", message: errorMessage });

  //   //   // Update UI with error
  //   //   setDeploymentStatus({
  //   //     status: "error",
  //   //     url: null,
  //   //     error: errorMessage,
  //   //   });

  //   //   // Update Firestore with failure using the same structure as backend
  //   //   const projectRef = doc(
  //   //     db,
  //   //     `users/${user.uid}/${projectType}`,
  //   //     currentProjectId
  //   //   );
  //   //   await updateDoc(projectRef, {
  //   //     [`deployments.${platform.id}`]: {
  //   //       status: "failed",
  //   //       error: errorMessage,
  //   //       deployedAt: new Date(),
  //   //     },
  //   //   });
  //   // } finally {
  //   //   setDeployingTo(null);
  //   //   // Close dropdown after a short delay
  //   //   setTimeout(() => setIsOpen(false), 2000);
  //   // }
  // };

  return (
    <div className="relative inline-block">
      {/* Deploy Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 text-sm text-white transition bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={deployingTo !== null}
      >
        {deployingTo ? (
          <>
            <Loader size={16} className="mr-2 animate-spin" />
            Deploying...
          </>
        ) : (
          <>
            <Rocket size={16} className="mr-2" />
            Deploy
            <ChevronDown className="w-4 h-4 ml-2" />
          </>
        )}
      </button>

      {/* Deployment Status Toast (shows on success/error) */}
      {/* {deploymentStatus.status && (
        <div
          className={`absolute right-0 z-50 p-3 mt-2 text-sm text-white rounded shadow-lg ${
            deploymentStatus.status === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
          style={{ width: "250px", top: "100%" }}
        >
          {deploymentStatus.status === "success" ? (
            <>
              <div className="flex items-center mb-2">
                <Check size={16} className="mr-2" />
                <span>Deployment successful!</span>
              </div>
              <a
                href={deploymentStatus.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 text-center bg-green-700 rounded hover:bg-green-800"
              >
                Visit Site
              </a>
            </>
          ) : (
            <>
              <div className="mb-2">Deployment failed:</div>
              <div className="p-2 text-sm bg-red-700 rounded">
                {deploymentStatus.error}
              </div>
            </>
          )}
        </div>
      )} */}

      {/* Dropdown Menu */}
      {isOpen && !deployingTo && (
        <div className="absolute right-0 z-50 w-56 mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg">
          <div className="p-2 text-sm text-gray-400 border-b border-gray-700">
            Select deployment platform:
          </div>
          {deploymentOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => handleDeploy(option)}
              className="flex items-center w-full px-4 py-3 text-left text-white transition-all hover:bg-gray-700"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {popup && (
          <Popup
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
