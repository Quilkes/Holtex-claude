import React, { useState } from "react";
import {
  Code2,
  Download,
  FolderOpen,
  FolderClosed,
  Eye,
  MenuIcon,
  Rocket,
} from "lucide-react";
import useCodeView from "@/store/useCodeView";
import useSidebar from "@/store/sidebar";

export function TabView({ handleDownload, isDownloading, showLoading }) {
  const { activeTab, setActiveTab } = useCodeView();
  const { setSmSidebar, smSideBar, setSmFileBar, smFileBar } = useSidebar();
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleToggleSmSidebar = () => {
    setSmSidebar(!smSideBar);
  };

  const handleFilesSmbar = () => {
    setSmFileBar(!smFileBar);
  };

  const handleToggle = () => {
    handleToggleSmSidebar();
  };

  const showTooltip = (text, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipText(text);
    setTooltipPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX + rect.width / 2,
    });
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <>
      <div className="relative inline-flex items-center h-10 p-1 mt-2 ml-2 rounded-lg">
        {/* Sliding background with translate animation */}
        <div
          className={`absolute h-[90%] top-0 bg-emerald-400 rounded-3xl transition-transform duration-300 ease-in-out ${
            activeTab === "preview" ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ width: "calc(50% - 2px)" }}
        />

        {/* Button group */}
        <div className="relative z-10 flex pb-1">
          <button
            onClick={() => setActiveTab("preview")}
            onMouseEnter={(e) => showTooltip("Preview", e)}
            onMouseLeave={hideTooltip}
            className={`flex items-center justify-center min-w-16 sm:min-w-28 p-3 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === "preview"
                ? "text-white"
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline ml-2">Preview</span>
          </button>

          <button
            onClick={() => setActiveTab("code")}
            onMouseEnter={(e) => showTooltip("Code", e)}
            onMouseLeave={hideTooltip}
            className={`flex items-center justify-center min-w-16 sm:min-w-28 p-3 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === "code"
                ? "text-white"
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline ml-2">Code</span>
          </button>
        </div>
      </div>

      <div className="flex items-center border-l space-x-1.5">
        <button
          onMouseEnter={(e) => showTooltip("File Explorer", e)}
          onMouseLeave={hideTooltip}
          onClick={handleFilesSmbar}
          className="flex items-center md:hidden px-2 py-1 ml-2 text-gray-600 hover:text-purple-400 rounded-md"
        >
          <FolderOpen size={16} className="" />
        </button>

        <button
          onMouseEnter={(e) => showTooltip("Deploy", e)}
          onMouseLeave={hideTooltip}
          className="flex items-center md:hidden px-2 py-1 ml-2 text-gray-600 hover:text-purple-400 rounded-md"
        >
          <Rocket size={16} className="" />
          <span className="hidden sm:inline">Deploy</span>
        </button>
        <button
          onClick={handleDownload}
          onMouseEnter={(e) => showTooltip("Download", e)}
          onMouseLeave={hideTooltip}
          disabled={isDownloading || showLoading}
          className="flex items-center md:hidden px-2 py-1 ml-2 text-gray-600 hover:text-purple-400 rounded-md"
        >
          <Download size={16} className="" />
          <span className="hidden sm:inline">
            {isDownloading ? "Downloading..." : "Download"}
          </span>
        </button>
        <button
          onClick={handleToggle}
          onMouseEnter={(e) => showTooltip("Menu", e)}
          onMouseLeave={hideTooltip}
          className="hover:bg-slate-200 rounded-sm p-2"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Custom Tooltip */}
      {tooltipVisible && (
        <div
          className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded pointer-events-none transition-opacity duration-300"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translateX(-50%)",
          }}
        >
          {tooltipText}
        </div>
      )}
    </>
  );
}
