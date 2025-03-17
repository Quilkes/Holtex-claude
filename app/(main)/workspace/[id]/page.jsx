"use client";
import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import { TabView } from "@/components/custom/TabView";
import React, { useState } from "react";
import { ChevronRight, MessageSquare, Loader2 } from "lucide-react";
import { CodeEditor } from "@/components/custom/CodeEditor";
import PreviewFrame from "@/components/custom/PreviewFrame";
import useCodeView from "@/store/useCodeView";
import useFiles from "@/store/useFiles";

function Workspace() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const { files } = useFiles();
  const { activeTab } = useCodeView();
  const webContainerRef = React.useRef(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleFileExplorer = () => {
    setIsFileExplorerOpen(!isFileExplorerOpen);
  };

  return (
    <div className="p-1 h-[100vh] relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:grid place-content-center h-full md:grid-cols-12 gap-2">
        <div className="col-span-3 h-[98vh] p-0.5 flex flex-col justify-center">
          <ChatView />
        </div>
        <div className="md:col-span-9 h-[98vh] flex flex-col justify-center">
          <CodeView />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden h-full">
        {/* Mobile CodeView */}
        <div className="h-full">
          <div className="h-full grid grid-rows-12 rounded-md border bg-slate-100">
            {/* Tab View - Using updated TabView component */}
            <div className="border flex justify-between row-span-1 bg-slate-100 w-full">
              <TabView />
            </div>

            {/* Code editor and preview section */}
            <div className="row-span-11 h-full w-full">
              <div className="grid grid-cols-12 h-full w-full">
                {/* Code Editor or Preview  */}
                <div className="w-full  col-span-12">
                  <div className="h-full w-full overflow-auto border-b md:border-b-0 md:border-r border-gray-200">
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
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
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

        {/* Slide-in ChatView for Mobile */}
        <div
          className={`fixed top-0 left-0 h-full w-full bg-white z-20 transition-transform duration-300 ease-in-out ${
            isChatOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ maxWidth: "100vw", maxHeight: "100vh" }}
        >
          <div className="h-full flex flex-col">
            <div className="p-2 bg-slate-100 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Chat</h2>
              <button
                onClick={toggleChat}
                className="p-2 rounded-full hover:bg-slate-200"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatView />
            </div>
          </div>
        </div>

        {/* Chat Toggle Button (only shows when chat is closed) */}
        {!isChatOpen && (
          <button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg z-10 flex items-center justify-center"
          >
            <MessageSquare size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(Workspace);
