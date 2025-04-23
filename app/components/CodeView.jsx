"use client";
import React from "react";
import { CodeEditor } from "./CodeEditor";
import { PreviewFrame } from "./PreviewFrame";
import { FileExplorer } from "./FileExplorer";
import { TabView } from "./TabView";
import useCodeView from "../store/useCodeView";

function CodeView({ isWebContainerLoading, webContainerRef, files }) {
  const { activeTab } = useCodeView();

  return (
    <div className="grid h-full bg-white border rounded-md grid-rows-12 border-slate-200">
      {/* Tab View */}
      <div className="flex justify-between w-full row-span-1 border-b border-slate-200">
        <TabView
          webContainerRef={webContainerRef}
          isWebContainerLoading={isWebContainerLoading}
        />
      </div>
      {/* Code editor and preview */}
      <div className="w-full h-full row-span-11">
        <div className="grid w-full h-full grid-cols-9">
          {/* Left panel - File explorer */}
          <div className="w-full col-span-2 overflow-y-auto border-r border-gray-200">
            <FileExplorer files={files} />
          </div>
          <div className="w-full col-span-7">
            <div className="grid w-full h-full overflow-auto border-b border-gray-200 md:border-b-0 md:border-r">
              {activeTab === "code" ? (
                <CodeEditor files={files[0]} />
              ) : (
                <PreviewFrame files={files} webContainerRef={webContainerRef} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CodeView);
