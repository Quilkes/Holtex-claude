import React, { useState } from "react";
import { File, FileWarning, Loader2, FolderCode } from "lucide-react";
import useCodeView from "@/store/useCodeView";

function FileNode({ item, depth, onFileClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(null);

  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
      setIsActive("");
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-slate-200"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === "folder" ? (
          <FolderCode className="w-4 h-4 ml-2 text-green-400" />
        ) : (
          <File className="w-4 h-4 ml-2 text-blue-400" />
        )}
        {/* Truncate File/Folder Name */}
        <span className="w-full overflow-hidden text-gray-500 truncate text-ellipsis whitespace-nowrap">
          {item.name}
        </span>
      </div>
      {item.type === "folder" && isExpanded && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, isWebContainerLoading }) {
  const { setSelectedFile } = useCodeView();

  return (
    <div className="space-y-1 ">
      {isWebContainerLoading ? (
        <div className="h-72 w-full flex justify-center items-center">
          <Loader2 size={50} className="animate-spin" />
        </div>
      ) : files && files.length > 0 ? (
        files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={setSelectedFile}
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
