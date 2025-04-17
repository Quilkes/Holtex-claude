import React, { useState } from "react";
import {
  Code2,
  Download,
  FolderOpen,
  Eye,
  MenuIcon,
  Rocket,
  Loader,
} from "lucide-react";
import useCodeView from "../store/useCodeView";
import useSidebar from "../store/sidebar";

export function TabView({
  handleDownload,
  isDownloading,
  isWebContainerLoading,
}) {
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
            className={`flex cursor-pointer items-center justify-center min-w-16 sm:min-w-28 p-3 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === "preview"
                ? "text-white"
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden ml-2 sm:inline">Preview</span>
          </button>

          <button
            onClick={() => setActiveTab("code")}
            onMouseEnter={(e) => showTooltip("Code", e)}
            onMouseLeave={hideTooltip}
            className={`flex cursor-pointer items-center justify-center min-w-16 sm:min-w-28 p-3 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === "code"
                ? "text-white"
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden ml-2 sm:inline">Code</span>
          </button>
        </div>
      </div>

      <div className="flex items-center border-l border-slate-200 space-x-1.5">
        <button
          onMouseEnter={(e) => showTooltip("File Explorer", e)}
          onMouseLeave={hideTooltip}
          onClick={handleFilesSmbar}
          className="flex items-center px-2 py-1 ml-2 text-gray-600 rounded-md md:hidden hover:text-purple-400"
        >
          <FolderOpen size={16} className="" />
        </button>

        <button
          onMouseEnter={(e) => showTooltip("Deploy", e)}
          onMouseLeave={hideTooltip}
          className="flex items-center px-2 py-1 ml-2 text-gray-600 rounded-md md:hidden hover:text-purple-400"
        >
          <Rocket size={16} className="" />
        </button>
        <button
          onClick={handleDownload}
          onMouseEnter={(e) => showTooltip("Download", e)}
          onMouseLeave={hideTooltip}
          disabled={isDownloading || isWebContainerLoading}
          className="flex items-center px-2 py-1 ml-2 text-gray-600 rounded-md md:hidden hover:text-purple-400"
        >
          {isDownloading ? (
            <Loader className="animate-spin" />
          ) : (
            <Download size={16} className="" />
          )}
        </button>
        <button
          onClick={handleToggle}
          onMouseEnter={(e) => showTooltip("Menu", e)}
          onMouseLeave={hideTooltip}
          className="p-2 rounded-sm cursor-pointer hover:text-[#800080]"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Custom Tooltip */}
      {tooltipVisible && (
        <div
          className="absolute z-50 px-2 py-1 text-xs text-white transition-opacity duration-300 bg-gray-800 rounded pointer-events-none"
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
