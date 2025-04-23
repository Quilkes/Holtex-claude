import React, { useState } from "react";
import {
  Code2,
  Eye,
  MenuIcon,
  Loader,
  Files,
  Cloud,
  ArrowDownCircle,
} from "lucide-react";
import useCodeView from "../store/useCodeView";
import useSidebar from "../store/sidebar";
import { handleDownloadZipFile } from "../utils/downloadZIPFile";
import useFiles from "../store/useFiles";

export function TabView({ webContainerRef, isWebContainerLoading }) {
  const { activeTab, setActiveTab } = useCodeView();
  const { isDownloadingZipFile, setIsDownloadingZipFile } = useFiles();
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
      <div className="inline-flex items-center p-1 m-2 bg-gray-100 rounded-full">
        {/* Button group with simplified design */}
        <div className="relative flex">
          <button
            onClick={() => setActiveTab("preview")}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              activeTab === "preview"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Preview"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              activeTab === "code"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Code"
          >
            <Code2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center border-l border-slate-200 pl-2 gap-3">
        <button
          onMouseEnter={(e) => showTooltip("File Explorer", e)}
          onMouseLeave={hideTooltip}
          onClick={handleFilesSmbar}
          className="flex items-center justify-center p-2 text-gray-600 md:hidden rounded hover:bg-gray-100 hover:text-purple-600 transition-colors"
        >
          <Files size={18} />
        </button>

        <button
          onMouseEnter={(e) => showTooltip("Deploy", e)}
          onMouseLeave={hideTooltip}
          className="flex items-center justify-center p-2 text-gray-600 rounded hover:bg-gray-100 hover:text-purple-600 transition-colors"
        >
          <Cloud size={18} />
        </button>

        <button
          onClick={() =>
            handleDownloadZipFile({ webContainerRef, setIsDownloadingZipFile })
          }
          onMouseEnter={(e) => showTooltip("Download", e)}
          onMouseLeave={hideTooltip}
          disabled={isDownloadingZipFile || isWebContainerLoading}
          className="flex items-center justify-center p-2 text-gray-600 rounded hover:bg-gray-100 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloadingZipFile ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <ArrowDownCircle size={18} />
          )}
        </button>

        <button
          onClick={handleToggle}
          onMouseEnter={(e) => showTooltip("Menu", e)}
          onMouseLeave={hideTooltip}
          className="flex items-center justify-center p-2 text-gray-600 rounded hover:bg-gray-100 hover:text-purple-600 transition-colors"
        >
          <MenuIcon size={18} />
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
