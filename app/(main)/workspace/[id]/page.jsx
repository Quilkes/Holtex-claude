"use client";

import React, { useEffect, useRef, useState } from "react";
import { TabView } from "@/app/components/TabView";
import { ChevronRight, MessageSquare } from "lucide-react";
import { CodeEditor } from "@/app/components/CodeEditor";
import CodeView from "@/app/components/CodeView";
import PreviewFrame from "@/app/components/PreviewFrame";
import useCodeView from "@/app/store/useCodeView";
import useFiles from "@/app/store/useFiles";
import ChatView from "@/app/components/ChatView";
import { useParams } from "next/navigation";
import { useConvex, useMutation, useQuery } from "convex/react";
import { useWebContainer } from "@/app/hooks/useWebContainer";
import { updateStepsAndFiles } from "@/app/utils/updateStepsAndFiles";
import { fetchInitialSteps } from "@/app/utils/fetchInitialSteps";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

export default function page() {
  const { id } = useParams();
  const convex = useConvex();
  const webContainerRef = useRef(null);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const webContainer = useWebContainer();
  const { activeTab } = useCodeView();
  const {
    files,
    setFiles,
    steps,
    setSteps,
    setLlmMessages,
    updateStepsStatus,
    setTemplateSet,
  } = useFiles();

  // Query with caching strategy
  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });
  const messages = workspaceData?.messages || [];

  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);
  const [isWebContainerLoading, setIsWebContainerLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track initialization and debounce database updates
  const isInitializing = useRef(false);
  const saveTimeoutRef = useRef(null);
  const isMounted = useRef(true);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Main initialization flow with improved reliability
  useEffect(() => {
    const initializeWorkspace = async () => {
      // Guard conditions
      if (isInitializing.current || !id || !webContainer || workspaceLoaded)
        return;
      isInitializing.current = true;

      try {
        setIsWebContainerLoading(true);

        // First try to fetch from database
        const hasData = await fetchWorkspaceData();

        // If no data in database, initialize with default files
        if (!hasData) {
          await fetchInitialSteps(
            messages,
            setSteps,
            setLlmMessages,
            setTemplateSet,
            setLoading
          );

          // Save initial state to database after small delay
          // to allow steps and files to be populated
          setTimeout(async () => {
            if (steps.length > 0 || files.length > 0) {
              await saveToDatabase();
            }
          }, 2000);
        } else {
          hasGeneratedCode.current = true;
        }

        if (isMounted.current) {
          setWorkspaceLoaded(true);
        }
      } catch (error) {
        console.error("Workspace initialization error:", error);
        toast("Error initializing workspace");
      } finally {
        isInitializing.current = false;
        setIsLoading(false);
      }
    };

    initializeWorkspace();
  }, [id, webContainer, workspaceLoaded]);

  // Improved database fetch with error handling
  const fetchWorkspaceData = async () => {
    if (!isMounted.current || !id) return false;

    try {
      //  Fetch from database
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });

      if (!isMounted.current) return false;

      if (result && result.fileData && result.fileData.length > 0) {
        // Process and load the files into WebContainer
        if (webContainerRef.current) {
          updateStepsAndFiles(
            result.steps,
            result.files,
            result.setFiles,
            setSteps,
            webContainerRef
          );

          if (isMounted.current) {
            setFiles(processedFiles);

            // Also update state
            if (result.steps) setSteps(result.steps);
            if (result.llmMessages) setLlmMessages(result.llmMessages);
            if (result.templateSet) setTemplateSet(result.templateSet);

            setIsLoading(false);
            setIsWebContainerLoading(false);
          }
        }
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      if (isMounted.current) {
        toast("Failed to load project files");
        setIsLoading(false);
      }
      return false;
    }
  };

  // Update web container reference
  useEffect(() => {
    if (webContainer) {
      webContainerRef.current = webContainer;
    }
  }, [webContainer]);

  useEffect(() => {
    if (webContainerRef.current) {
      updateStepsAndFiles(
        steps,
        files,
        setFiles,
        updateStepsStatus,
        webContainerRef
      );
    }
  }, [steps, files, webContainerRef.current]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Loading state handling
  const showLoading = isLoading;

  return (
    <div className="p-1 h-[100vh] relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden h-full gap-2 md:grid place-content-center md:grid-cols-12">
        <div className="col-span-3 h-[98vh] p-0.5 flex flex-col justify-center">
          <ChatView />
        </div>
        <div className="md:col-span-9 h-[98vh] flex flex-col justify-center">
          <CodeView
            showLoading={showLoading}
            isWebContainerLoading={isWebContainerLoading}
            webContainerRef={webContainerRef}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block h-full md:hidden">
        {/* Mobile CodeView */}
        <div className="h-full">
          <div className="grid h-full border rounded-md grid-rows-12 bg-slate-100">
            {/* Tab View - Using updated TabView component */}
            <div className="flex justify-between w-full row-span-1 border bg-slate-100">
              <TabView />
            </div>

            {/* Code editor and preview section */}
            <div className="w-full h-full row-span-11">
              <div className="grid w-full h-full grid-cols-12">
                {/* Code Editor or Preview  */}
                <div className="w-full col-span-12">
                  <div className="w-full h-full overflow-auto border-b border-gray-200 md:border-b-0 md:border-r">
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

              {/* {showLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="mt-2 text-sm text-gray-600">
                      {loadingMessage}
                    </p>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
        Slide-in ChatView for Mobile
        <div
          className={`fixed top-0 left-0 h-full w-full bg-white z-20 transition-transform duration-300 ease-in-out ${
            isChatOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ maxWidth: "100vw", maxHeight: "100vh" }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 bg-slate-100">
              <h2 className="text-lg font-semibold">Chat</h2>
              <button
                onClick={toggleChat}
                className="p-2 rounded-full hover:bg-slate-200"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">ChatView</div>
          </div>
        </div>
        {/* Chat Toggle Button (only shows when chat is closed) */}
        {!isChatOpen && (
          <button
            onClick={toggleChat}
            className="fixed z-10 flex items-center justify-center p-3 text-white bg-purple-600 rounded-full shadow-lg bottom-6 right-6"
          >
            <MessageSquare size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
