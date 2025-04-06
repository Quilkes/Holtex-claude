import React, { useState } from "react";
import { File, FileWarning, FolderOpen, FolderClosed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCodeView from "../store/useCodeView";
import useFiles from "../store/useFiles";

function FileNode({ item, depth, onFileClick, activeFilePath }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = activeFilePath === item.path;

  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-slate-100 ${
          isActive && item.type === "file" ? "bg-slate-100" : ""
        }`}
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === "folder" ? (
          <>
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 ml-2 text-green-400" />
            ) : (
              <FolderClosed className="w-4 h-4 ml-2 text-green-400" />
            )}
          </>
        ) : (
          <File className="w-4 h-4 ml-2 text-blue-400" />
        )}
        {/* Truncate File/Folder Name */}
        <span className="w-full overflow-hidden text-gray-500 truncate text-ellipsis whitespace-nowrap">
          {item.name}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {item.type === "folder" && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {item.children.map((child, index) => (
              <FileNode
                key={`${child.path}-${index}`}
                item={child}
                depth={depth + 1}
                onFileClick={onFileClick}
                activeFilePath={activeFilePath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileExplorer() {
  const { selectedFile, setSelectedFile } = useCodeView();
  const { files, fileFromDbLoading } = useFiles();
  const activeFilePath = selectedFile?.path;

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="space-y-1">
      {fileFromDbLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <span>Loading...</span>
        </div>
      ) : files.length > 0 ? (
        files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={handleFileClick}
            activeFilePath={activeFilePath}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <FileWarning className="w-8 h-8 mb-2 text-gray-500" />
          <p>No files available</p>
        </div>
      )}
    </div>
  );
}
