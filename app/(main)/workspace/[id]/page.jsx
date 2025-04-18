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
  const { setTemplateSet, setNewFileFromApiLoading, setFileFromDbLoading } =
    useFiles();

  const [steps, setSteps] = useState([]);
  const [files, setFiles] = useState([]);
  const [llmMessages, setLlmMessages] = useState([]);

  // Query with caching strategy
  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });
  const messages = workspaceData?.messages || [];

  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);
  const [isWebContainerLoading, setIsWebContainerLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Track initialization and debounce database updates
  const hasInitialized = useRef(false);
  const isMounted = useRef(true);

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

        // 1: First try to fetch from database
        const hasData = await fetchWorkspaceData();

        // 2: If no data in database, generate new files
        if (!hasData) {
          console.log("No data in database, generating new files");
          await fetchInitialSteps(
            messages,
            setSteps,
            setLlmMessages,
            setTemplateSet,
            setNewFileFromApiLoading
          );
        }

        if (isMounted.current) {
          setWorkspaceLoaded(true);
          setIsWebContainerLoading(false);
        }
      } catch (error) {
        console.error("Workspace initialization error:", error);
        toast.error("Error initializing workspace");
      } finally {
        hasInitialized.current = true;
        setIsWebContainerLoading(false);
      }
    };
    initializeWorkspace();

    // Clean up function
    return () => {
      isMounted.current = false;
    };
  }, [id, webContainer, workspaceLoaded, messages, files.length]);

  useEffect(() => {
    // Check if we have files and steps generated but not yet saved
    if (steps.length > 0 && files.length > 0 && !workspaceLoaded) {
      saveToDatabase();
    }
  }, [steps, files]);

  // Improved database fetch with error handling
  const fetchWorkspaceData = async () => {
    if (!id) return;

    setFileFromDbLoading(true);
    console.log("Processing existing workspace data");

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
        // Process and load the files into WebContainer if webContainer is ready
        if (webContainerRef.current) {
          await updateStepsAndFiles(
            result.fileData.steps || [],
            result.fileData.files,
            setFiles,
            webContainerRef
          );

          // Update state with fetched data
          setFiles(result.fileData.files);
          if (result.fileData.steps) setSteps(result.fileData.steps);
          if (result.fileData.llmMessages)
            setLlmMessages(result.fileData.llmMessages);
          if (result.fileData.templateSet)
            setTemplateSet(result.fileData.templateSet);
          setIsWebContainerLoading(false);
        } else {
          console.warn("WebContainer not ready yet, will retry");
          // Still update the state so it's ready when container is available
          setFiles(result.fileData.files);
          if (result.fileData.steps) setSteps(result.fileData.steps);
          if (result.fileData.llmMessages)
            setLlmMessages(result.fileData.llmMessages);
          if (result.fileData.templateSet)
            setTemplateSet(result.fileData.templateSet);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      if (isMounted.current) {
        toast.error("Failed to load project files");
      }
      return false;
    } finally {
      setFileFromDbLoading(false);
    }
  };

  // Update WebContainer when files or steps change (only after initialization)
  useEffect(() => {
    if (hasInitialized.current && webContainerRef.current) {
      updateStepsAndFiles(steps, files, setFiles, webContainerRef);
    }
  }, [steps, files]);

  const saveToDatabase = async () => {
    if (!id) return;

    try {
      await UpdateFiles({
        workspaceId: id,
        steps,
        files,
        llmMessages: workspaceData?.llmMessages || [],
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to save workspace:", error);
      toast.error("Failed to save your changes");
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  console.log("Steps:", steps);

  return (
    <div className="p-1 h-[100vh] relative overflow-hidden">
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
