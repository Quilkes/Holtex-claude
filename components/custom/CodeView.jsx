"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { BASE_PROMPT } from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { basePrompt } from "@/lib/reactTemplate";
import { parseXml } from "@/lib/parseXml";
import { loadFilesToWebContainer } from "@/lib/loadFileToWebcontainer";
import { useWebContainer } from "@/hooks/useWebContainer";
import { CodeEditor } from "./CodeEditor";
import { PreviewFrame } from "./PreviewFrame";
import { FileExplorer } from "./FileExplorer";
import { Loader2 } from "lucide-react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { TabView } from "./TabView";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { countToken } from "./ChatView";
import { toast } from "sonner";
import useCodeView from "@/store/useCodeView";
import useFiles from "@/store/useFiles";
import useSharedState from "@/store/useShareState";

function CodeView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const webContainer = useWebContainer();
  const { activeTab } = useCodeView();
  const { files, setFiles, addFile, clearFiles } = useFiles();

  // Get the shared state
  const { pendingCodeGeneration, pendingMessages, clearPendingCodeGeneration } =
    useSharedState();

  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });
  const messages = workspaceData?.messages || [];
  const [isWebContainerLoading, setIsWebContainerLoading] = useState(false);
  const webContainerRef = useRef(null);
  const hasGeneratedCode = useRef(false);
  const hasLoadedDefaultFiles = useRef(false);
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAiCode, setIsGeneratingAiCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);

  // Add initialization tracking flag
  const isInitializing = useRef(false);

  // Main initialization flow - ensure this only runs once
  useEffect(() => {
    const initializeWorkspace = async () => {
      // Prevent duplicate initializations
      if (isInitializing.current || !id || !webContainer) return;

      // Set flag to prevent re-entry
      isInitializing.current = true;

      try {
        webContainerRef.current = webContainer;
        setIsWebContainerLoading(true);

        // Step 1: Try to fetch data from storage
        const hasData = await fetchWorkspaceData();

        // Step 2: If no data, load default files
        if (!hasData) {
          await loadDefaultFiles();
        } else {
          // If data was found, mark as already generated
          hasGeneratedCode.current = true;
        }

        // Step 3: Mark workspace as loaded (only if still mounted)
        if (isMounted.current) {
          setWorkspaceLoaded(true);
        }
      } finally {
        // Reset initialization flag if process fails to allow retry
        isInitializing.current = false;
      }
    };

    initializeWorkspace();
  }, [id, webContainer]);

  // AI Code generation when workspace is loaded and messages are available
  // Make this run only once with flag checking
  useEffect(() => {
    // Strict conditions to ensure this runs exactly once
    if (
      workspaceLoaded &&
      webContainerRef.current &&
      messages &&
      messages.length > 0 &&
      !hasGeneratedCode.current &&
      !isGeneratingAiCode &&
      isMounted.current
    ) {
      // Uncomment this line when you want to use AI code generation
      generateAiCode();
    }
  }, [workspaceLoaded, messages, isGeneratingAiCode]);

  // NEW: Listen for pending code generation requests from ChatView
  useEffect(() => {
    if (
      pendingCodeGeneration &&
      pendingMessages.length > 0 &&
      workspaceLoaded &&
      webContainerRef.current &&
      !isGeneratingAiCode
    ) {
      // Call generateAiCodeFromChat with the pending messages
      // generateAiCodeFromChat(pendingMessages);

      // Clear the pending state after processing
      clearPendingCodeGeneration();
    }
  }, [
    pendingCodeGeneration,
    pendingMessages,
    workspaceLoaded,
    isGeneratingAiCode,
  ]);

  // Fetch workspace data from storage
  const fetchWorkspaceData = async () => {
    if (!isMounted.current) return false;

    setIsLoading(true);
    try {
      // Fetch workspace from db
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });

      // Bail if component unmounted during async operation
      if (!isMounted.current) return false;

      // Check if we have file data
      if (result && result.fileData) {
        // Load files into WebContainer
        if (webContainerRef.current) {
          const processedFiles = await loadFilesToWebContainer(
            result.fileData,
            webContainerRef
          );

          if (isMounted.current) {
            setFiles(processedFiles);
            setIsLoading(false);
            setIsWebContainerLoading(false);
          }
        }
        return true; // Data found and loaded
      }

      if (isMounted.current) {
        setIsLoading(false);
      }
      return false; // No data found
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      if (isMounted.current) {
        toast("Failed to load project files");
        setIsLoading(false);
      }
      return false;
    }
  };

  // Load default files from basePrompt
  const loadDefaultFiles = async () => {
    if (!isMounted.current) return;

    setIsLoading(true);
    try {
      const parsedFiles = parseXml(basePrompt);

      if (!isMounted.current) return;

      if (webContainerRef.current) {
        const defaultFiles = await loadFilesToWebContainer(
          parsedFiles,
          webContainerRef
        );

        setFiles(defaultFiles);
      } else {
        console.error("WebContainer not initialized for default files");
      }

      hasLoadedDefaultFiles.current = true;
    } catch (error) {
      console.error("Error loading default files:", error);
      if (isMounted.current) {
        toast("Failed to load default files");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsWebContainerLoading(false);
      }
    }
  };

  // Generate code from AI based on messages - with protection against double execution
  const generateAiCode = async () => {
    // Guard against duplicate executions and invalid states
    if (
      hasGeneratedCode.current ||
      !messages ||
      messages.length === 0 ||
      isGeneratingAiCode ||
      !isMounted.current
    )
      return;

    // Set flag immediately to prevent concurrent executions
    hasGeneratedCode.current = true;

    try {
      setIsGeneratingAiCode(true);

      const PROMPT = {
        messages: [
          {
            role: "user",
            content: BASE_PROMPT,
          },
          {
            role: "user",
            content: `Here is an artifact that contains all files of the project visible to you.
                      Consider the contents of ALL files in the project.
                      ${basePrompt}
                      Here is a list of files that exist on the file system but are not being shown to you:
                        - .gitignore
                        - package-lock.json`,
          },
          {
            role: "user",
            content: JSON.stringify(messages),
          },
        ],
      };

      // Make API call to generate code
      const result = await axios.post("/api/gen-ai-code", PROMPT);

      // Only proceed if component is still mounted
      if (!isMounted.current) return;

      if (!result.data || !result.data.result) {
        console.error("Error: result.data.result is missing", result.data);
        return;
      }

      const aiResp = result.data.result;

      // Parse new files from AI response
      const newFiles = parseXml(aiResp);

      // Create a copy of the current files for merging
      const currentFiles = [...files];

      // Merge files - we'll do this manually to ensure the right files are included
      const fileMap = new Map();

      // Add existing files first
      currentFiles.forEach((file) => {
        fileMap.set(file.path, file);
      });

      // Then override with new files from AI
      newFiles.forEach((file) => {
        fileMap.set(file.path, file);
      });

      // Create the merged array
      const mergedFiles = Array.from(fileMap.values());

      // Process merged files for WebContainer AND UI
      if (webContainerRef.current && isMounted.current) {
        // This will update the WebContainer filesystem
        const processedFiles = await loadFilesToWebContainer(
          mergedFiles,
          webContainerRef
        );

        // Update the state with the processed hierarchical file structure
        if (isMounted.current) {
          setFiles(processedFiles);
        }
      }

      if (mergedFiles && mergedFiles.length > 0 && isMounted.current) {
        await UpdateFiles({
          workspaceId: id,
          files: mergedFiles,
        });
      } else {
        console.error("No files to save to database");
      }

      // Update tokens
      if (isMounted.current) {
        const remTokens =
          Number(userDetail?.token) -
          Number(countToken(JSON.stringify(aiResp)));
        setUserDetail((prev) => ({ ...prev, token: remTokens }));

        // Update tokens in database
        await UpdateTokens({
          userId: userDetail?._id,
          token: remTokens,
        });

        toast.success("Code generated successfully");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      if (isMounted.current) {
        toast.error("Failed to generate code");
        // Reset flag to allow retry on failure
        hasGeneratedCode.current = false;
      }
    } finally {
      if (isMounted.current) {
        setIsGeneratingAiCode(false);
      }
    }
  };

  // NEW: Extract file content from the WebContainer
  const extractFileContent = async (maxCharsPerFile = 500) => {
    if (!webContainerRef.current) return {};

    const fileContents = {};
    const extractContent = async (path) => {
      try {
        const content = await webContainerRef.current.fs.readFile(
          path,
          "utf-8"
        );
        // Truncate if needed
        return content.length > maxCharsPerFile
          ? content.substring(0, maxCharsPerFile) + "...(truncated)"
          : content;
      } catch (error) {
        console.error(`Failed to read file ${path}:`, error);
        return "(could not read file)";
      }
    };

    // Process files recursively
    const processFiles = async (dirPath) => {
      try {
        const entries = await webContainerRef.current.fs.readdir(dirPath, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          const fullPath = `${dirPath}/${entry.name}`;

          if (entry.isDirectory()) {
            await processFiles(fullPath);
          } else {
            // Skip node_modules, hidden files, etc.
            if (
              !fullPath.includes("node_modules") &&
              !entry.name.startsWith(".") &&
              !entry.name.endsWith(".map")
            ) {
              fileContents[fullPath] = await extractContent(fullPath);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to read directory ${dirPath}:`, error);
      }
    };

    await processFiles("/");
    return fileContents;
  };

  // NEW: Generate code from chat messages
  const generateAiCodeFromChat = async (chatMessages) => {
    if (isGeneratingAiCode || !isMounted.current || !webContainerRef.current)
      return;

    try {
      setIsGeneratingAiCode(true);

      // Extract file content for context
      const fileContents = await extractFileContent(500);

      // Prepare request with current file contents as context
      const PROMPT = {
        messages: [
          {
            role: "user",
            content: BASE_PROMPT,
          },
          {
            role: "user",
            content: `Here is an artifact that contains key files of the project with their contents.
                      Use this to understand the project structure before making changes.
                      ${JSON.stringify(fileContents)}
                      
                      Make sure to preserve the functionality of existing files.
                      Only modify files that need to be changed based on the user request.
                      If new files are needed, create them with complete implementation.
                      Return only the modified or new files.`,
          },
          {
            role: "user",
            content: JSON.stringify(chatMessages),
          },
        ],
      };

      // Make API call to generate code modifications
      const result = await axios.post("/api/gen-ai-code", PROMPT);

      if (!isMounted.current) return;

      if (!result.data || !result.data.result) {
        console.error("Error: result.data.result is missing", result.data);
        return;
      }

      const aiResp = result.data.result;

      // Parse new files from AI response
      const newFiles = parseXml(aiResp);

      // Create a copy of the current files for merging
      const currentFiles = [...files];

      // Merge files - we'll do this manually to ensure the right files are included
      const fileMap = new Map();

      // Add existing files first
      currentFiles.forEach((file) => {
        fileMap.set(file.path, file);
      });

      // Then override with new files from AI
      newFiles.forEach((file) => {
        fileMap.set(file.path, file);
      });

      // Create the merged array
      const mergedFiles = Array.from(fileMap.values());

      // Process merged files for WebContainer AND UI
      if (webContainerRef.current && isMounted.current) {
        // This will update the WebContainer filesystem
        const processedFiles = await loadFilesToWebContainer(
          mergedFiles,
          webContainerRef
        );

        // Update the state with the processed hierarchical file structure
        if (isMounted.current) {
          setFiles(processedFiles);
        }
      }

      if (mergedFiles && mergedFiles.length > 0 && isMounted.current) {
        await UpdateFiles({ workspaceId: id, files: mergedFiles });
      } else {
        console.error("No files to save to database");
      }

      // Update tokens
      if (isMounted.current) {
        const remTokens =
          Number(userDetail?.token) -
          Number(countToken(JSON.stringify(aiResp)));
        setUserDetail((prev) => ({ ...prev, token: remTokens }));

        // Update tokens in database
        await UpdateTokens({
          userId: userDetail?._id,
          token: remTokens,
        });

        toast.success("Code updated successfully");
      }
    } catch (error) {
      console.error("Error generating code modifications:", error);
      if (isMounted.current) {
        toast.error("Failed to update code");
      }
    } finally {
      if (isMounted.current) {
        setIsGeneratingAiCode(false);
      }
    }
  };

  // Handle downloading files
  const handleDownload = async () => {
    if (isDownloading || !isMounted.current) return;

    setIsDownloading(true);
    try {
      if (!webContainerRef?.current) {
        console.error("WebContainer is not initialized yet.");
        toast.error("WebContainer not ready");
        return;
      }

      const zip = new JSZip();

      async function addFilesToZip(dir, zipFolder) {
        const entries = await webContainerRef.current.fs.readdir(dir, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          const fullPath = `${dir}/${entry.name}`;

          if (entry.isDirectory()) {
            const folder = zipFolder.folder(entry.name);
            await addFilesToZip(fullPath, folder);
          } else {
            const fileContent = await webContainerRef.current.fs.readFile(
              fullPath,
              "utf-8"
            );
            zipFolder.file(entry.name, fileContent || "");
          }
        }
      }

      await addFilesToZip("/", zip);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "project.zip");

      if (isMounted.current) {
        toast.success("Download complete");
      }
    } catch (error) {
      console.error("Error during download:", error);
      if (isMounted.current) {
        toast.error("Download failed");
      }
    } finally {
      if (isMounted.current) {
        setIsDownloading(false);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Combined loading state
  const showLoading = isLoading || isGeneratingAiCode;
  const loadingMessage = isGeneratingAiCode
    ? "Generating AI code..."
    : "Loading files...";

  return (
    <div className="h-full grid grid-rows-12 rounded-md border bg-slate-100">
      {/* Tab View */}
      <div className="border flex justify-between row-span-1 bg-slate-100 w-full">
        <TabView
          handleDownload={handleDownload}
          isDownloading={isDownloading}
          showLoading={showLoading}
        />
      </div>
      {/* Code editor and preview */}
      <div className="row-span-11 h-full w-full">
        <div className="grid grid-cols-9 h-full w-full">
          {/* Left panel - File explorer */}
          <div className="w-full col-span-2 border-r border-gray-200 overflow-y-auto">
            <FileExplorer
              isWebContainerLoading={isWebContainerLoading}
              files={files}
            />
          </div>
          <div className="w-full col-span-7">
            <div className="grid h-full w-full overflow-auto border-b md:border-b-0 md:border-r border-gray-200">
              {activeTab === "code" ? (
                <CodeEditor files={files[0]} />
              ) : (
                <PreviewFrame files={files} webContainerRef={webContainerRef} />
              )}
            </div>
          </div>
        </div>

        {showLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-gray-600">{loadingMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(CodeView);
