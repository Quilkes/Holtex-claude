import React, { useState } from "react";
import {
  Code2,
  Eye,
  Files,
  Cloud,
  ArrowDownCircle,
  Home,
  Loader,
  ExternalLink,
} from "lucide-react";
import useCodeView from "@/app/store/useCodeView";
import useSidebar from "@/app/store/sidebar";
import { handleDownloadZipFile } from "@/app/utils/downloadZIPFile";
import useFiles from "@/app/store/useFiles";
import Link from "next/link";
import usePreview from "@/app/store/preview/usePreview";

export function TabView({ webContainerRef, isWebContainerLoading }) {
  const { activeTab, setActiveTab } = useCodeView();
  const { url } = usePreview();
  const { isDownloadingZipFile, setIsDownloadingZipFile } = useFiles();
  const { setSmSidebar, smSideBar, setSmFileBar, smFileBar } = useSidebar();
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleFilesSmbar = () => {
    setSmFileBar(!smFileBar);
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
    <div className="flex items-center justify-between h-12 w-full px-3 border-b border-gray-200 dark:border-gray-800">
      {/* Left side - Claude-style toggle */}
      <div className="flex items-center space-x-2">
        <button
          onMouseEnter={(e) => showTooltip("File Explorer", e)}
          onMouseLeave={hideTooltip}
          onClick={handleFilesSmbar}
          className="flex items-center justify-center p-2 text-gray-500 transition-colors rounded-md md:hidden hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:text-gray-400"
          aria-label="Toggle File Explorer"
        >
          <Files size={18} />
        </button>

        {/* Claude-style toggle button for code/preview */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center justify-center h-7 px-2 rounded-md transition-all duration-200 ${
              activeTab === "preview"
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
            aria-label="Preview"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center justify-center h-7 px-2 rounded-md transition-all duration-200 ${
              activeTab === "code"
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
            aria-label="Code"
          >
            <Code2 size={16} />
          </button>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-1">
        {url && (
          <button
            onMouseEnter={(e) => showTooltip("New tab", e)}
            onMouseLeave={hideTooltip}
            onClick={() => window.open(url, "_blank")}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            aria-label="New tab"
          >
            <ExternalLink size={14} />
          </button>
        )}
        <button
          onMouseEnter={(e) => showTooltip("Deploy", e)}
          onMouseLeave={hideTooltip}
          className="flex items-center justify-center p-2 text-gray-500 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:text-gray-400"
          aria-label="Deploy"
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
          className="flex items-center justify-center p-2 text-gray-500 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Download"
        >
          {isDownloadingZipFile ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <ArrowDownCircle size={18} />
          )}
        </button>

        <Link href="/home">
          <button
            onMouseEnter={(e) => showTooltip("Home", e)}
            onMouseLeave={hideTooltip}
            className="flex items-center justify-center p-2 text-gray-500 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:text-gray-400"
            aria-label="Home"
          >
            <Home size={18} />
          </button>
        </Link>
      </div>

      {/* Custom Tooltip */}
      {tooltipVisible && (
        <div
          className="absolute z-50 px-2 py-1 text-xs text-white transition-opacity duration-300 bg-gray-800 rounded shadow-md pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translateX(-50%)",
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}
