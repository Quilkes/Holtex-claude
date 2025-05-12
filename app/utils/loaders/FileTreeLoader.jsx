import React from "react";

export default function FileTreeLoader() {
  // Create a recursive skeleton structure to mimic folder hierarchy
  const renderSkeletonNode = (depth = 3, isFolder = true, childCount = 0) => {
    return (
      <div className="select-none" key={`skeleton-${depth}-${childCount}`}>
        <div
          className="flex items-center gap-2 p-2 animate-pulse"
          style={{ paddingLeft: `${depth * 1.5}rem` }}
        >
          <div
            className={`w-4 h-4 ml-2 rounded-sm ${isFolder ? "bg-gray-200 dark:bg-gray-600" : "bg-gray-300 dark:bg-gray-900"}`}
          ></div>

          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Render children for folders with depth < 2 to avoid too much nesting */}
        {isFolder && depth < 2 && (
          <div style={{ overflow: "hidden" }}>
            {/* Add a file child */}
            {renderSkeletonNode(depth + 1, false, 0)}

            {/* Add another folder with children if not too deep */}
            {depth < 1 && renderSkeletonNode(depth + 1, true, 1)}

            {/* Add a simple file */}
            {renderSkeletonNode(depth + 1, false, 2)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {/* Render multiple top-level items */}
      {renderSkeletonNode(0, true, 0)}
      {renderSkeletonNode(0, false, 1)}
      {renderSkeletonNode(0, true, 2)}
    </div>
  );
}
