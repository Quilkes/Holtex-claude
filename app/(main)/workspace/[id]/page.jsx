"use client";

import React, { useEffect, useRef, useState } from "react";
import { TabView } from "@/app/components/TabView";
import { ChevronRight, MessageSquare } from "lucide-react";
import { CodeEditor } from "@/app/components/CodeEditor";
import CodeView from "@/app/components/CodeView";
import PreviewFrame from "@/app/components/PreviewFrame";
import useCodeView from "@/app/store/useCodeView";
import useFiles from "@/app/store/useFiles";
import ChatView from "./components/ChatView";
import { useParams } from "next/navigation";
import { useConvex, useMutation, useQuery } from "convex/react";
import { useWebContainer } from "@/app/hooks/useWebContainer";
import { updateStepsAndFiles } from "@/app/utils/updateStepsAndFiles";
import { fetchInitialSteps } from "@/app/utils/fetchInitialSteps";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import useSidebar from "@/app/store/sidebar";
import { FileExplorer } from "@/app/components/FileExplorer";
import { countToken } from "@/app/utils/tokenCount";
import useCredentials from "@/app/store/useCredentials";

export default function page() {
  const { id } = useParams();
  const { updateUserDetail, userDetail } = useCredentials();
  const convex = useConvex();
  const webContainerRef = useRef(null);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const webContainer = useWebContainer();
  const { activeTab } = useCodeView();
  const { setFileFromDbLoading, isLoading, setIsLoading } = useFiles();
  const { smFileBar } = useSidebar();

  const [steps, setSteps] = useState([]);
  const [files, setFiles] = useState([]);
  const [llmMessages, setLlmMessages] = useState([]);

  // Reset initialization flag when component mounts or ID changes
  const hasInitialized = useRef(false);
  const isMounted = useRef(true);

  // Force reinitialization when navigating back to the page
  useEffect(() => {
    hasInitialized.current = false;
    return () => {
      isMounted.current = false;
    };
  }, [id]);

  // Query with caching strategy
  // Query with explicit refresh policy to prevent stale data
  const workspaceData = useQuery(
    api.workspace.GetWorkspace,
    { workspaceId: id },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );
  const messages = workspaceData?.messages?.[0]?.content || "";

  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);
  const [isWebContainerLoading, setIsWebContainerLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Update web container reference
  useEffect(() => {
    if (webContainer) {
      webContainerRef.current = webContainer;
    }
  }, [webContainer]);

  // Main initialization flow with improved reliability
  useEffect(() => {
    const initializeWorkspace = async () => {
      // Skip if already initializing or missing required data
      if (hasInitialized.current || !id || !webContainer) return;
      hasInitialized.current = true;

      try {
        setIsWebContainerLoading(true);
        setIsLoading(true);

        // 1: First try to fetch from database
        const hasData = await fetchWorkspaceData();

        // 2: If no data in database, generate new files
        if (!hasData) {
          console.log("No data in database, generating new files");
          await fetchInitialSteps(
            messages,
            setSteps,
            setLlmMessages,
            userDetail,
            updateUserDetail,
            countToken,
            UpdateTokens
          );
        }
        updateStepsAndFiles(steps, files, setSteps, setFiles, webContainerRef);

        if (isMounted.current) {
          setWorkspaceLoaded(true);
          setIsWebContainerLoading(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Workspace initialization error:", error);
        toast.error("Error initializing workspace");
        setIsLoading(false);
      } finally {
        hasInitialized.current = true;
        setIsWebContainerLoading(false);
        setIsLoading(false);
      }
    };
    initializeWorkspace();

    // Clean up function
    return () => {
      isMounted.current = false;
    };
  }, [id, webContainer, workspaceLoaded, messages, files.length]);

  // Improved database fetch with error handling
  const fetchWorkspaceData = async () => {
    setFileFromDbLoading(true);

    try {
      //  Fetch from database
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });

      if (
        result &&
        result.fileData &&
        result.fileData.files &&
        result.fileData.files.length > 0
      ) {
        const { files, steps, llmMessages } = result.fileData;
        // Process and load the files into WebContainer if webContainer is ready
        if (webContainerRef.current) {
          updateStepsAndFiles(
            steps,
            files,
            setSteps,
            setFiles,
            webContainerRef
          );

          // Update state with fetched data
          setFiles(files);
          setSteps(steps);
          setLlmMessages(llmMessages);
          setIsWebContainerLoading(false);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      throw error;
      return false;
    } finally {
      setFileFromDbLoading(false);
    }
  };

  // Handle file updates and save to database
  const saveToDatabase = async () => {
    // Don't save empty files or during loading
    if (!id || files.length === 0 || isLoading) return;

    try {
      await UpdateFiles({
        workspaceId: id,
        steps,
        llmMessages,
        files,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to save workspace:", error);
      toast.error("Failed to save your changes");
    }
  };

  const processSteps = async () => {
    let originalFiles = Array.isArray(files) ? [...files] : [];
    let updateHappened = false;

    const pendingSteps = steps.filter(
      (step) => step && step.status === "pending"
    );

    for (const step of pendingSteps) {
      updateHappened = true;
      if (step?.type === "CreateFile") {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = originalFiles;
        let currentFolder = "";

        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`.replace(
            "//",
            "/"
          );
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            let file = currentFileStructure.find(
              (x) => x.path === currentFolder
            );
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: "file",
                path: currentFolder,
                content: step.code,
              });
            } else {
              file.content = step.code;
            }

            if (webContainerRef?.current) {
              try {
                const parentDir = currentFolder.substring(
                  0,
                  currentFolder.lastIndexOf("/")
                );
                if (parentDir) {
                  await webContainerRef.current.fs.mkdir(parentDir, {
                    recursive: true,
                  });
                }
                await webContainerRef.current.fs.writeFile(
                  currentFolder,
                  step.code
                );
              } catch (error) {
                console.error(`Error writing file ${currentFolder}:`, error);
              }
            }
          } else {
            let folder = currentFileStructure.find(
              (x) => x.path === currentFolder
            );
            if (!folder) {
              folder = {
                name: currentFolderName,
                type: "folder",
                path: currentFolder,
                children: [],
              };
              currentFileStructure.push(folder);

              if (webContainerRef?.current) {
                try {
                  await webContainerRef.current.fs.mkdir(currentFolder, {
                    recursive: true,
                  });
                } catch (error) {
                  console.error(
                    `Error creating directory ${currentFolder}:`,
                    error
                  );
                }
              }
            }
            currentFileStructure = folder.children || [];
          }
        }
      }
    }

    if (updateHappened) {
      const sortFiles = (items) => {
        items.sort((a, b) => {
          if (a.type === "folder" && b.type === "file") return -1;
          if (a.type === "file" && b.type === "folder") return 1;
          return a.name.localeCompare(b.name);
        });
        items.forEach((item) => {
          if (item.type === "folder" && item.children) {
            sortFiles(item.children);
          }
        });
      };

      sortFiles(originalFiles);

      setFiles([...originalFiles]);
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.status === "pending" ? { ...step, status: "completed" } : step
        )
      );
    }
  };

  // Modified to prevent early saving and only save when data is initialized and not loading
  useEffect(() => {
    if (files.length > 0) {
      saveToDatabase();
    }
  }, [steps, files, isLoading]);

  // Update WebContainer when files or steps change (only after initialization)
  useEffect(() => {
    if (!workspaceLoaded) {
      processSteps();
    }
  }, [steps, files]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <>
      <div className="p-1 h-[100vh] bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden h-full gap-2 md:grid place-content-center md:grid-cols-12">
          <div className="col-span-3 h-[98vh] p-0.5 flex flex-col justify-center">
            <ChatView
              steps={steps}
              setSteps={setSteps}
              llmMessages={llmMessages}
              setLlmMessages={setLlmMessages}
            />
          </div>
          <div className="md:col-span-9 h-[98vh] flex flex-col justify-center">
            <CodeView
              files={files}
              isWebContainerLoading={isWebContainerLoading}
              webContainerRef={webContainerRef}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block h-full md:hidden">
          {/* Mobile CodeView */}
          <div className="h-full">
            <div className="grid h-full border rounded-md dark:border-gray-700 grid-rows-12 bg-slate-100 dark:bg-gray-900">
              {/* Tab View - Using updated TabView component */}
              <div className="flex justify-between w-full row-span-1 border dark:border-gray-700 bg-slate-100 dark:bg-gray-900">
                <TabView
                  webContainerRef={webContainerRef}
                  isWebContainerLoading={isWebContainerLoading}
                />
              </div>

              {/* Code editor and preview section */}
              <div className="w-full h-full row-span-11">
                <div className="grid w-full h-full grid-cols-12">
                  {/* Code Editor or Preview  */}
                  <div className="w-full col-span-12">
                    <div className="w-full h-full overflow-auto border-b border-gray-200 md:border-b-0 md:border-r dark:border-gray-700">
                      {activeTab === "code" ? (
                        <CodeEditor files={files[0]} />
                      ) : (
                        <PreviewFrame
                          files={files}
                          webContainerRef={webContainerRef}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide-in ChatView for Mobile */}
          <div
            className={`fixed top-0 left-0 h-full w-full bg-white z-20 transition-transform duration-300 ease-in-out ${
              isChatOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ maxWidth: "100vw", maxHeight: "100vh" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-gray-900">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button
                  onClick={toggleChat}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-800"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatView
                  steps={steps}
                  setSteps={setSteps}
                  llmMessages={llmMessages}
                  setLlmMessages={setLlmMessages}
                />
              </div>
            </div>
          </div>

          {/* Chat Toggle Button (only shows when chat is closed) */}
          {!isChatOpen && (
            <button
              onClick={toggleChat}
              className="fixed z-10 flex items-center justify-center p-2 text-white transition-colors bg-purple-600 rounded-full shadow-md bottom-4 right-4 hover:bg-purple-700"
            >
              <MessageSquare size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile File explorer */}
      <div
        className={`fixed inset-y-0 left-0 z-[100] md:hidden bg-white dark:bg-gray-900 transition-transform duration-300 w-[270px] ${
          smFileBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="w-full h-full overflow-y-auto border-r border-gray-200 custom-scrollbar dark:border-gray-700"
          style={{
            "--scrollbar-thumb": "#d1d5db",
            "--scrollbar-track": "transparent",
          }}
        >
          <FileExplorer files={files} />
        </div>
      </div>
    </>
  );
}
